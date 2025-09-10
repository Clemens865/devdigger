import Database from 'better-sqlite3';
import * as crypto from 'crypto';
import path from 'path';
import { app } from 'electron';

export class DatabaseMaintenanceService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'devdigger.db');
    this.db = new Database(dbPath);
  }

  // Find duplicate documents by content hash
  findDuplicateDocuments(): any[] {
    const query = `
      SELECT 
        content_hash,
        COUNT(*) as duplicate_count,
        GROUP_CONCAT(id) as document_ids,
        GROUP_CONCAT(source_id) as source_ids,
        SUBSTR(content, 1, 100) as content_preview
      FROM documents
      WHERE content_hash IS NOT NULL
      GROUP BY content_hash
      HAVING COUNT(*) > 1
      ORDER BY duplicate_count DESC
    `;
    
    return this.db.prepare(query).all();
  }

  // Find duplicate sources by URL
  findDuplicateSources(): any[] {
    const query = `
      SELECT 
        url,
        COUNT(*) as duplicate_count,
        GROUP_CONCAT(id) as source_ids,
        GROUP_CONCAT(title) as titles,
        GROUP_CONCAT(crawl_status) as statuses
      FROM sources
      GROUP BY url
      HAVING COUNT(*) > 1
      ORDER BY duplicate_count DESC
    `;
    
    return this.db.prepare(query).all();
  }

  // Find empty or near-empty documents
  findEmptyDocuments(minLength: number = 10): any[] {
    const query = `
      SELECT 
        d.id,
        d.source_id,
        s.url as source_url,
        s.title as source_title,
        LENGTH(d.content) as content_length,
        SUBSTR(d.content, 1, 50) as content_preview
      FROM documents d
      LEFT JOIN sources s ON d.source_id = s.id
      WHERE LENGTH(TRIM(d.content)) < ?
      ORDER BY content_length ASC
    `;
    
    return this.db.prepare(query).all(minLength);
  }

  // Find orphaned documents (no matching source)
  findOrphanedDocuments(): any[] {
    const query = `
      SELECT 
        d.id,
        d.source_id,
        d.content_hash,
        SUBSTR(d.content, 1, 100) as content_preview
      FROM documents d
      LEFT JOIN sources s ON d.source_id = s.id
      WHERE s.id IS NULL
    `;
    
    return this.db.prepare(query).all();
  }

  // Find sources with no documents
  findEmptySources(): any[] {
    const query = `
      SELECT 
        s.id,
        s.url,
        s.title,
        s.crawl_status,
        s.created_at
      FROM sources s
      LEFT JOIN documents d ON s.id = d.source_id
      WHERE d.id IS NULL
      ORDER BY s.created_at DESC
    `;
    
    return this.db.prepare(query).all();
  }

  // Remove duplicate documents (keep the first one)
  removeDuplicateDocuments(): { removed: number; kept: number } {
    const duplicates = this.findDuplicateDocuments();
    let removedCount = 0;
    let keptCount = 0;

    const deleteStmt = this.db.prepare('DELETE FROM documents WHERE id = ?');
    
    const transaction = this.db.transaction(() => {
      for (const dup of duplicates) {
        const ids = dup.document_ids.split(',');
        // Keep the first document, delete the rest
        const [keepId, ...deleteIds] = ids;
        keptCount++;
        
        for (const id of deleteIds) {
          deleteStmt.run(id);
          removedCount++;
        }
      }
    });

    transaction();
    
    return { removed: removedCount, kept: keptCount };
  }

  // Remove empty documents
  removeEmptyDocuments(minLength: number = 10): number {
    const stmt = this.db.prepare(`
      DELETE FROM documents 
      WHERE LENGTH(TRIM(content)) < ?
    `);
    
    const result = stmt.run(minLength);
    return result.changes;
  }

  // Remove orphaned documents
  removeOrphanedDocuments(): number {
    const stmt = this.db.prepare(`
      DELETE FROM documents 
      WHERE source_id NOT IN (SELECT id FROM sources)
    `);
    
    const result = stmt.run();
    return result.changes;
  }

  // Remove empty sources (sources with no documents)
  removeEmptySources(): number {
    const stmt = this.db.prepare(`
      DELETE FROM sources 
      WHERE id NOT IN (SELECT DISTINCT source_id FROM documents)
    `);
    
    const result = stmt.run();
    return result.changes;
  }

  // Merge duplicate sources (combines documents under one source)
  mergeDuplicateSources(): { merged: number; removed: number } {
    const duplicates = this.findDuplicateSources();
    let mergedCount = 0;
    let removedCount = 0;

    const updateDocsStmt = this.db.prepare('UPDATE documents SET source_id = ? WHERE source_id = ?');
    const deleteSourceStmt = this.db.prepare('DELETE FROM sources WHERE id = ?');
    
    const transaction = this.db.transaction(() => {
      for (const dup of duplicates) {
        const ids = dup.source_ids.split(',');
        const [keepId, ...deleteIds] = ids;
        mergedCount++;
        
        // Move all documents to the first source
        for (const deleteId of deleteIds) {
          updateDocsStmt.run(keepId, deleteId);
          deleteSourceStmt.run(deleteId);
          removedCount++;
        }
      }
    });

    transaction();
    
    return { merged: mergedCount, removed: removedCount };
  }

  // Recalculate content hashes for all documents
  recalculateContentHashes(): number {
    const documents = this.db.prepare('SELECT id, content FROM documents WHERE content_hash IS NULL').all();
    const updateStmt = this.db.prepare('UPDATE documents SET content_hash = ? WHERE id = ?');
    
    let updated = 0;
    const transaction = this.db.transaction(() => {
      for (const doc of documents) {
        const hash = crypto.createHash('sha256').update(doc.content).digest('hex');
        updateStmt.run(hash, doc.id);
        updated++;
      }
    });

    transaction();
    return updated;
  }

  // Get database statistics
  getDatabaseStats(): any {
    const stats = {
      totalSources: this.db.prepare('SELECT COUNT(*) as count FROM sources').get().count,
      totalDocuments: this.db.prepare('SELECT COUNT(*) as count FROM documents').get().count,
      totalCodeExamples: this.db.prepare('SELECT COUNT(*) as count FROM code_examples').get().count,
      duplicateDocuments: this.db.prepare(`
        SELECT COUNT(*) as count FROM (
          SELECT content_hash FROM documents 
          WHERE content_hash IS NOT NULL 
          GROUP BY content_hash 
          HAVING COUNT(*) > 1
        )`).get().count,
      duplicateSources: this.db.prepare(`
        SELECT COUNT(*) as count FROM (
          SELECT url FROM sources 
          GROUP BY url 
          HAVING COUNT(*) > 1
        )`).get().count,
      emptyDocuments: this.db.prepare('SELECT COUNT(*) as count FROM documents WHERE LENGTH(TRIM(content)) < 10').get().count,
      orphanedDocuments: this.db.prepare(`
        SELECT COUNT(*) as count FROM documents d 
        LEFT JOIN sources s ON d.source_id = s.id 
        WHERE s.id IS NULL
      `).get().count,
      emptySources: this.db.prepare(`
        SELECT COUNT(*) as count FROM sources s 
        LEFT JOIN documents d ON s.id = d.source_id 
        WHERE d.id IS NULL
      `).get().count,
      averageDocumentSize: this.db.prepare('SELECT AVG(LENGTH(content)) as avg FROM documents').get().avg || 0,
      databaseSize: this.getDatabaseSize()
    };
    
    return stats;
  }

  // Get database file size
  private getDatabaseSize(): string {
    const fs = require('fs');
    const dbPath = path.join(app.getPath('userData'), 'devdigger.db');
    const stats = fs.statSync(dbPath);
    const bytes = stats.size;
    
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }

  // Vacuum database (reclaim space after deletions)
  vacuumDatabase(): void {
    this.db.exec('VACUUM');
  }

  // Analyze database (update statistics for query optimizer)
  analyzeDatabase(): void {
    this.db.exec('ANALYZE');
  }

  // Full cleanup - removes all duplicates and empty content
  performFullCleanup(): any {
    const results = {
      startStats: this.getDatabaseStats(),
      hashesRecalculated: 0,
      duplicateDocumentsRemoved: { removed: 0, kept: 0 },
      emptyDocumentsRemoved: 0,
      orphanedDocumentsRemoved: 0,
      duplicateSourcesMerged: { merged: 0, removed: 0 },
      emptySourcesRemoved: 0,
      endStats: null as any
    };

    // Recalculate hashes first
    results.hashesRecalculated = this.recalculateContentHashes();

    // Remove duplicates and empty content
    results.duplicateDocumentsRemoved = this.removeDuplicateDocuments();
    results.emptyDocumentsRemoved = this.removeEmptyDocuments();
    results.orphanedDocumentsRemoved = this.removeOrphanedDocuments();
    results.duplicateSourcesMerged = this.mergeDuplicateSources();
    results.emptySourcesRemoved = this.removeEmptySources();

    // Vacuum and analyze
    this.vacuumDatabase();
    this.analyzeDatabase();

    // Get final stats
    results.endStats = this.getDatabaseStats();

    return results;
  }

  close() {
    this.db.close();
  }
}
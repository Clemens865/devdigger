import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'path';
import { DatabaseService, Document } from './database';

export class EnhancedDatabaseService {
  private db: Database.Database | null = null;
  private dbPath: string;
  private ftsInitialized: boolean = false;
  private baseService: DatabaseService;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = join(userDataPath, 'devdigger.db');
    this.baseService = new DatabaseService();
  }

  async initialize() {
    // Initialize base service first
    await this.baseService.initialize();
    
    // Get the database instance
    this.db = new Database(this.dbPath);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    
    // Initialize FTS
    await this.initializeFTS();
  }

  async initializeFTS() {
    if (!this.db || this.ftsInitialized) return;

    try {
      // Create FTS5 virtual table for full-text search
      this.db.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
          id UNINDEXED,
          content,
          title,
          url,
          tokenize='porter unicode61'
        );
      `);

      // Check if FTS table needs population
      const ftsCount = this.db.prepare('SELECT COUNT(*) as count FROM documents_fts').get() as { count: number };
      const docsCount = this.db.prepare('SELECT COUNT(*) as count FROM documents').get() as { count: number };
      
      if (ftsCount.count < docsCount.count) {
        console.log('Populating FTS table...');
        
        // Get all documents
        const documents = this.db.prepare(`
          SELECT d.id, d.content, s.title, s.url 
          FROM documents d 
          LEFT JOIN sources s ON d.source_id = s.id
        `).all();
        
        // Insert into FTS table
        const insertFts = this.db.prepare(`
          INSERT OR REPLACE INTO documents_fts (id, content, title, url) 
          VALUES (?, ?, ?, ?)
        `);
        
        const insertMany = this.db.transaction((docs: any[]) => {
          for (const doc of docs) {
            insertFts.run(doc.id, doc.content, doc.title || '', doc.url || '');
          }
        });
        
        insertMany(documents);
        console.log(`Indexed ${documents.length} documents for full-text search`);
      }

      this.ftsInitialized = true;
    } catch (error) {
      console.error('Failed to initialize FTS:', error);
    }
  }

  async searchDocumentsByKeywords(
    keywords: string[],
    limit: number = 50,
    filters?: {
      sourceType?: string;
      language?: string;
      dateRange?: { start: Date; end: Date };
    }
  ): Promise<Document[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    // Initialize FTS if not done
    if (!this.ftsInitialized) {
      await this.initializeFTS();
    }

    // Build FTS5 query with proper escaping
    const ftsQuery = keywords
      .map(k => `"${k.replace(/"/g, '""')}"`)
      .join(' OR ');
    
    let query = `
      SELECT 
        d.id,
        d.source_id,
        d.content,
        d.content_hash,
        d.chunk_index,
        d.metadata,
        d.created_at,
        bm25(documents_fts) as rank
      FROM documents d
      INNER JOIN documents_fts f ON d.id = f.id
      WHERE documents_fts MATCH ?
    `;
    
    const params: any[] = [ftsQuery];
    
    // Apply filters
    if (filters?.sourceType) {
      query += ' AND d.source_id IN (SELECT id FROM sources WHERE type = ?)';
      params.push(filters.sourceType);
    }
    
    if (filters?.language) {
      query += ' AND d.id IN (SELECT document_id FROM code_examples WHERE language = ?)';
      params.push(filters.language);
    }
    
    if (filters?.dateRange) {
      query += ' AND d.created_at BETWEEN ? AND ?';
      params.push(filters.dateRange.start.toISOString());
      params.push(filters.dateRange.end.toISOString());
    }
    
    query += ' ORDER BY rank DESC LIMIT ?';
    params.push(limit);
    
    try {
      const rows = this.db.prepare(query).all(...params);
      
      return rows.map((row: any) => ({
        id: row.id,
        source_id: row.source_id,
        content: row.content,
        content_hash: row.content_hash,
        chunk_index: row.chunk_index,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        created_at: row.created_at
      })) as Document[];
    } catch (error) {
      console.error('Keyword search failed:', error);
      return [];
    }
  }

  async hybridSearch(
    query: string,
    vectorResults: any[],
    limit: number = 20
  ): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    // Get keyword search results
    const keywords = query.split(/\s+/).filter(k => k.length > 2);
    const keywordResults = await this.searchDocumentsByKeywords(keywords, limit * 2);
    
    // Create a map for combining scores
    const scoreMap = new Map<string, { doc: any; vectorScore: number; keywordScore: number }>();
    
    // Add vector search results
    for (const result of vectorResults) {
      scoreMap.set(result.id, {
        doc: result,
        vectorScore: result.score,
        keywordScore: 0
      });
    }
    
    // Add/merge keyword search results
    for (let i = 0; i < keywordResults.length; i++) {
      const doc = keywordResults[i];
      const keywordScore = 1 - (i / keywordResults.length); // Rank-based score
      
      if (scoreMap.has(doc.id)) {
        const entry = scoreMap.get(doc.id)!;
        entry.keywordScore = keywordScore;
      } else {
        scoreMap.set(doc.id, {
          doc: doc,
          vectorScore: 0,
          keywordScore: keywordScore
        });
      }
    }
    
    // Combine scores with weights
    const results = Array.from(scoreMap.values()).map(entry => ({
      ...entry.doc,
      score: (entry.vectorScore * 0.7) + (entry.keywordScore * 0.3),
      searchType: 'hybrid'
    }));
    
    // Sort by combined score
    results.sort((a, b) => b.score - a.score);
    
    return results.slice(0, limit);
  }

  async addDocumentWithFTS(document: {
    sourceId: string;
    content: string;
    chunkIndex: number;
    metadata?: any;
  }): Promise<Document> {
    // First add to main documents table using base service
    const doc = await this.baseService.addDocument(document);
    
    if (!this.db) throw new Error('Database not initialized');
    
    // Initialize FTS if needed
    if (!this.ftsInitialized) {
      await this.initializeFTS();
    }
    
    // Get source info for FTS
    const source = this.db.prepare('SELECT title, url FROM sources WHERE id = ?').get(document.sourceId) as any;
    
    // Add to FTS table
    try {
      this.db.prepare(`
        INSERT INTO documents_fts (id, content, title, url) 
        VALUES (?, ?, ?, ?)
      `).run(
        doc.id,
        document.content,
        source?.title || '',
        source?.url || ''
      );
    } catch (error) {
      console.error('Failed to add document to FTS:', error);
    }
    
    return doc;
  }

  async getAllDocuments(): Promise<Document[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const rows = this.db.prepare(`
      SELECT id, source_id, content, content_hash, chunk_index, metadata, created_at
      FROM documents
    `).all();
    
    return rows.map((row: any) => ({
      id: row.id,
      source_id: row.source_id,
      content: row.content,
      content_hash: row.content_hash,
      chunk_index: row.chunk_index,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
      created_at: row.created_at
    })) as Document[];
  }

  async rebuildFTSIndex() {
    if (!this.db) throw new Error('Database not initialized');
    
    console.log('Rebuilding FTS index...');
    
    // Clear existing FTS data
    this.db.exec('DELETE FROM documents_fts');
    
    // Reset initialization flag
    this.ftsInitialized = false;
    
    // Reinitialize
    await this.initializeFTS();
    
    console.log('FTS index rebuilt successfully');
  }

  // Delegate other methods to base service
  async addDocument(document: any) {
    return this.baseService.addDocument(document);
  }

  async getDocuments(sourceId: string) {
    return this.baseService.getDocuments(sourceId);
  }

  async getStats() {
    return this.baseService.getStats();
  }

  async addSource(source: any) {
    return this.baseService.addSource(source);
  }

  async updateSource(id: string, updates: any) {
    return this.baseService.updateSource(id, updates);
  }

  async getSources() {
    return this.baseService.getSources();
  }

  async close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    await this.baseService.close();
  }
}
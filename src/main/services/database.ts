import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'path';
import { createHash } from 'crypto';

export interface Source {
  id: string;
  type: 'website' | 'file' | 'github' | 'documentation';
  url: string;
  title?: string;
  description?: string;
  metadata?: any;
  crawl_status?: string;
  last_crawled?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Document {
  id: string;
  source_id: string;
  content: string;
  content_hash?: string;
  chunk_index: number;
  metadata?: any;
  embedding?: number[];
  embedding_model?: string;
  created_at?: Date;
}

export interface CodeExample {
  id: string;
  document_id: string;
  source_id: string;
  language: string;
  code: string;
  description?: string;
  tags?: string[];
  usage_count?: number;
  created_at?: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  item_count?: number;
  size?: string;
  export_path?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class DatabaseService {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = join(userDataPath, 'devdigger.db');
  }

  async initialize() {
    this.db = new Database(this.dbPath);
    
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
    
    // Enable WAL mode for better performance
    this.db.pragma('journal_mode = WAL');
    
    // Create tables
    this.createTables();
    
    // Create indexes
    this.createIndexes();
    
    // Register custom functions for vector operations
    this.registerVectorFunctions();
  }

  private createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // Sources table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        type TEXT CHECK(type IN ('website', 'file', 'github', 'documentation')),
        url TEXT UNIQUE,
        title TEXT,
        description TEXT,
        metadata JSON,
        crawl_status TEXT DEFAULT 'pending',
        last_crawled TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Documents table with embeddings
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL,
        content TEXT NOT NULL,
        content_hash TEXT UNIQUE,
        chunk_index INTEGER,
        metadata JSON,
        embedding BLOB,
        embedding_model TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
      )
    `);

    // Code examples table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS code_examples (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        language TEXT,
        code TEXT NOT NULL,
        description TEXT,
        tags JSON,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
      )
    `);

    // Collections table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'mixed',
        description TEXT,
        tags JSON,
        item_count INTEGER DEFAULT 0,
        total_size INTEGER DEFAULT 0,
        export_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Collection items junction table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS collection_items (
        collection_id TEXT NOT NULL,
        source_id TEXT,
        document_id TEXT,
        item_type TEXT CHECK(item_type IN ('source', 'document', 'code')),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (collection_id, COALESCE(source_id, ''), COALESCE(document_id, '')),
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
        FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE,
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
      )
    `);

    // Search history for analytics
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        search_type TEXT DEFAULT 'text',
        results_count INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private createIndexes() {
    if (!this.db) throw new Error('Database not initialized');

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_documents_source_id ON documents(source_id);
      CREATE INDEX IF NOT EXISTS idx_code_examples_source_id ON code_examples(source_id);
      CREATE INDEX IF NOT EXISTS idx_code_examples_language ON code_examples(language);
      CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(type);
      CREATE INDEX IF NOT EXISTS idx_sources_crawl_status ON sources(crawl_status);
      CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);
      CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents(id) WHERE embedding IS NOT NULL;
    `);
  }

  private registerVectorFunctions() {
    if (!this.db) throw new Error('Database not initialized');

    // Register cosine similarity function
    this.db.function('cosine_similarity', {
      deterministic: true,
      varargs: false,
      directOnly: true
    }, (blob1: Buffer, blob2: Buffer) => {
      if (!blob1 || !blob2) return 0;
      
      const vec1 = new Float32Array(blob1.buffer, blob1.byteOffset, blob1.byteLength / 4);
      const vec2 = new Float32Array(blob2.buffer, blob2.byteOffset, blob2.byteLength / 4);
      
      if (vec1.length !== vec2.length) return 0;
      
      let dotProduct = 0;
      let norm1 = 0;
      let norm2 = 0;
      
      for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        norm1 += vec1[i] * vec1[i];
        norm2 += vec2[i] * vec2[i];
      }
      
      const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
      return denominator === 0 ? 0 : dotProduct / denominator;
    });
  }

  // Source operations
  async addSource(source: {
    url: string;
    type: 'website' | 'file' | 'github' | 'documentation';
    title?: string;
    description?: string;
    metadata?: any;
  }): Promise<Source> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId(source.url);
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO sources (id, url, type, title, description, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      source.url,
      source.type,
      source.title || null,
      source.description || null,
      JSON.stringify(source.metadata || {})
    );

    return { id, ...source };
  }

  async getSources(type?: string): Promise<Source[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM sources';
    const params: any[] = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const rows = this.db.prepare(query).all(...params);
    return rows.map(row => ({
      ...row,
      metadata: JSON.parse(row.metadata as string || '{}')
    })) as Source[];
  }

  async getSource(id: string): Promise<Source | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = this.db.prepare('SELECT * FROM sources WHERE id = ?').get(id);
    if (!row) return null;
    
    return {
      ...row,
      metadata: JSON.parse(row.metadata as string || '{}')
    } as Source;
  }

  async updateSourceStatus(sourceId: string, status: string) {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      UPDATE sources 
      SET crawl_status = ?, last_crawled = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(status, sourceId);
  }

  // Document operations
  async addDocument(document: {
    sourceId: string;
    content: string;
    chunkIndex: number;
    metadata?: any;
    embedding?: number[];
    embeddingModel?: string;
  }): Promise<Document> {
    if (!this.db) throw new Error('Database not initialized');

    const contentHash = this.generateHash(document.content);
    const id = this.generateId(`${document.sourceId}-${document.chunkIndex}`);

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO documents 
      (id, source_id, content, content_hash, chunk_index, metadata, embedding, embedding_model)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const embeddingBuffer = document.embedding 
      ? Buffer.from(new Float32Array(document.embedding).buffer)
      : null;

    const result = stmt.run(
      id,
      document.sourceId,
      document.content,
      contentHash,
      document.chunkIndex,
      JSON.stringify(document.metadata || {}),
      embeddingBuffer,
      document.embeddingModel || null
    );

    return { 
      id, 
      source_id: document.sourceId,
      content: document.content,
      chunk_index: document.chunkIndex,
      metadata: document.metadata,
      embedding: document.embedding
    };
  }

  async addDocuments(documents: Array<{
    sourceId: string;
    content: string;
    chunkIndex: number;
    metadata?: any;
    embedding?: number[];
    embeddingModel?: string;
  }>): Promise<Document[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO documents 
      (id, source_id, content, content_hash, chunk_index, metadata, embedding, embedding_model)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction((docs) => {
      const results = [];
      for (const doc of docs) {
        const contentHash = this.generateHash(doc.content);
        const id = this.generateId(`${doc.sourceId}-${doc.chunkIndex}`);
        
        const embeddingBuffer = doc.embedding 
          ? Buffer.from(new Float32Array(doc.embedding).buffer)
          : null;

        stmt.run(
          id,
          doc.sourceId,
          doc.content,
          contentHash,
          doc.chunkIndex,
          JSON.stringify(doc.metadata || {}),
          embeddingBuffer,
          doc.embeddingModel || null
        );

        results.push({
          id,
          source_id: doc.sourceId,
          content: doc.content,
          chunk_index: doc.chunkIndex,
          metadata: doc.metadata,
          embedding: doc.embedding
        });
      }
      return results;
    });

    return insertMany(documents) as Document[];
  }

  async getDocuments(sourceId: string): Promise<Document[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      SELECT id, source_id, content, chunk_index, metadata, created_at
      FROM documents
      WHERE source_id = ?
      ORDER BY chunk_index
    `);

    const rows = stmt.all(sourceId);
    return rows.map(row => ({
      ...row,
      metadata: JSON.parse(row.metadata as string || '{}')
    })) as Document[];
  }

  // Code example operations
  async addCodeExample(example: {
    documentId: string;
    sourceId: string;
    language: string;
    code: string;
    description?: string;
    tags?: string[];
  }): Promise<CodeExample> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId(`${example.documentId}-${example.code.substring(0, 50)}`);

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO code_examples 
      (id, document_id, source_id, language, code, description, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      example.documentId,
      example.sourceId,
      example.language,
      example.code,
      example.description || null,
      JSON.stringify(example.tags || [])
    );

    return { 
      id, 
      document_id: example.documentId,
      source_id: example.sourceId,
      language: example.language,
      code: example.code,
      description: example.description,
      tags: example.tags
    };
  }

  async getCodeExamples(sourceId?: string, language?: string): Promise<CodeExample[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM code_examples';
    const conditions: string[] = [];
    const params: any[] = [];

    if (sourceId) {
      conditions.push('source_id = ?');
      params.push(sourceId);
    }

    if (language) {
      conditions.push('language = ?');
      params.push(language);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY usage_count DESC, created_at DESC';

    const rows = this.db.prepare(query).all(...params);
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags as string || '[]')
    })) as CodeExample[];
  }

  // Collection operations
  async createCollection(collection: {
    name: string;
    type?: string;
    description?: string;
    tags?: string[];
  }): Promise<Collection> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId(collection.name + Date.now());
    
    const stmt = this.db.prepare(`
      INSERT INTO collections (id, name, type, description, tags)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      collection.name,
      collection.type || 'mixed',
      collection.description || null,
      JSON.stringify(collection.tags || [])
    );

    return { 
      id, 
      name: collection.name,
      type: collection.type,
      description: collection.description,
      tags: collection.tags,
      item_count: 0,
      total_size: 0
    } as Collection;
  }

  async getCollections(): Promise<Collection[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = this.db.prepare(`
      SELECT 
        c.*,
        COUNT(ci.collection_id) as item_count,
        COALESCE(SUM(LENGTH(d.content)), 0) as total_size
      FROM collections c
      LEFT JOIN collection_items ci ON c.id = ci.collection_id
      LEFT JOIN documents d ON ci.document_id = d.id
      GROUP BY c.id
      ORDER BY c.updated_at DESC
    `).all();

    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags as string || '[]'),
      size: this.formatBytes(row.total_size as number)
    })) as Collection[];
  }

  async addToCollection(collectionId: string, itemId: string, itemType: 'source' | 'document' | 'code') {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO collection_items (collection_id, source_id, document_id, item_type)
      VALUES (?, ?, ?, ?)
    `);

    if (itemType === 'source') {
      stmt.run(collectionId, itemId, null, itemType);
    } else if (itemType === 'document') {
      stmt.run(collectionId, null, itemId, itemType);
    }

    // Update collection timestamp
    this.db.prepare('UPDATE collections SET updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(collectionId);
  }

  // Search operations
  async search(query: string, options: {
    limit?: number;
    threshold?: number;
    sourceTypes?: string[];
    searchType?: 'text' | 'semantic';
  } = {}): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const limit = options.limit || 10;
    const searchType = options.searchType || 'text';

    // Log search for analytics
    this.db.prepare('INSERT INTO search_history (query, search_type) VALUES (?, ?)')
      .run(query, searchType);

    if (searchType === 'text') {
      // Text-based search using FTS
      const stmt = this.db.prepare(`
        SELECT 
          d.id,
          d.content,
          d.source_id,
          s.url,
          s.title,
          s.type,
          LENGTH(d.content) - LENGTH(REPLACE(LOWER(d.content), LOWER(?), '')) as relevance
        FROM documents d
        JOIN sources s ON d.source_id = s.id
        WHERE LOWER(d.content) LIKE LOWER(?)
        ${options.sourceTypes?.length ? `AND s.type IN (${options.sourceTypes.map(() => '?').join(',')})` : ''}
        ORDER BY relevance DESC
        LIMIT ?
      `);

      const searchPattern = `%${query}%`;
      const params = [query, searchPattern];
      
      if (options.sourceTypes?.length) {
        params.push(...options.sourceTypes);
      }
      
      params.push(limit);

      const results = stmt.all(...params);
      
      // Calculate match scores
      return results.map(row => ({
        ...row,
        score: Math.min(100, Math.round((row.relevance / query.length) * 10))
      }));
    }

    // Semantic search would require embeddings
    return [];
  }

  async semanticSearch(embedding: number[], options: {
    limit?: number;
    threshold?: number;
  } = {}): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const limit = options.limit || 10;
    const threshold = options.threshold || 0.7;
    
    const queryEmbedding = Buffer.from(new Float32Array(embedding).buffer);

    // Use cosine similarity for semantic search
    const stmt = this.db.prepare(`
      SELECT 
        d.id,
        d.content,
        d.source_id,
        s.url,
        s.title,
        s.type,
        cosine_similarity(d.embedding, ?) as similarity
      FROM documents d
      JOIN sources s ON d.source_id = s.id
      WHERE d.embedding IS NOT NULL
        AND cosine_similarity(d.embedding, ?) > ?
      ORDER BY similarity DESC
      LIMIT ?
    `);

    const results = stmt.all(queryEmbedding, queryEmbedding, threshold, limit);
    
    return results.map(row => ({
      ...row,
      score: Math.round(row.similarity * 100)
    }));
  }

  // Settings operations
  async getSetting(key: string): Promise<string | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? row.value : null;
  }

  async setSetting(key: string, value: string) {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.prepare(`
      INSERT OR REPLACE INTO settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).run(key, value);
  }

  // Statistics
  async getStatistics() {
    if (!this.db) throw new Error('Database not initialized');

    const stats = {
      sources: this.db.prepare('SELECT COUNT(*) as count FROM sources').get(),
      documents: this.db.prepare('SELECT COUNT(*) as count FROM documents').get(),
      codeExamples: this.db.prepare('SELECT COUNT(*) as count FROM code_examples').get(),
      collections: this.db.prepare('SELECT COUNT(*) as count FROM collections').get(),
      embeddedDocuments: this.db.prepare('SELECT COUNT(*) as count FROM documents WHERE embedding IS NOT NULL').get(),
      totalSize: this.db.prepare('SELECT SUM(LENGTH(content)) as size FROM documents').get()
    };

    return {
      sources: stats.sources?.count || 0,
      documents: stats.documents?.count || 0,
      codeExamples: stats.codeExamples?.count || 0,
      collections: stats.collections?.count || 0,
      embeddedDocuments: stats.embeddedDocuments?.count || 0,
      totalSize: this.formatBytes(stats.totalSize?.size || 0)
    };
  }

  // Utility methods
  private generateId(input: string): string {
    return createHash('sha256').update(input).digest('hex').substring(0, 16);
  }

  private generateHash(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  async close() {
    this.db?.close();
  }
}
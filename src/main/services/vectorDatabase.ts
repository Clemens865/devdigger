import { LocalIndex } from 'vectra';
import path from 'path';
import { app } from 'electron';

export interface VectorDocument {
  id: string;
  content: string;
  metadata: {
    sourceId: string;
    title?: string;
    url?: string;
    chunkIndex?: number;
  };
  vector?: number[];
}

export class VectorDatabaseService {
  private index: LocalIndex | null = null;
  private indexPath: string;

  constructor() {
    this.indexPath = path.join(app.getPath('userData'), 'vector-index');
  }

  async initialize() {
    try {
      // Create or load the vector index
      this.index = new LocalIndex(this.indexPath);
      
      // Check if index exists
      const exists = await this.index.isIndexCreated();
      
      if (!exists) {
        // Create new index with 768 dimensions (for nomic embeddings)
        await this.index.createIndex({
          version: 1,
          deleteIfExists: false,
          dimensions: 768,
          metricType: 'cosine'
        });
        console.log('Vector index created successfully');
      } else {
        console.log('Vector index loaded successfully');
      }
    } catch (error) {
      console.error('Failed to initialize vector database:', error);
      throw error;
    }
  }

  async addDocument(doc: VectorDocument) {
    if (!this.index) throw new Error('Vector index not initialized');
    
    if (!doc.vector || doc.vector.length === 0) {
      throw new Error('Document must have a vector embedding');
    }

    await this.index.insertItem({
      id: doc.id,
      vector: doc.vector,
      metadata: {
        ...doc.metadata,
        content: doc.content
      }
    });
  }

  async addDocuments(documents: VectorDocument[]) {
    if (!this.index) throw new Error('Vector index not initialized');
    
    const items = documents.map(doc => ({
      id: doc.id,
      vector: doc.vector!,
      metadata: {
        ...doc.metadata,
        content: doc.content
      }
    }));

    await this.index.insertItems(items);
  }

  async search(queryVector: number[], limit: number = 10) {
    if (!this.index) throw new Error('Vector index not initialized');
    
    const results = await this.index.queryItems(queryVector, limit);
    
    return results.map(result => ({
      id: result.item.id,
      content: result.item.metadata.content,
      metadata: {
        sourceId: result.item.metadata.sourceId,
        title: result.item.metadata.title,
        url: result.item.metadata.url,
        chunkIndex: result.item.metadata.chunkIndex
      },
      score: result.score
    }));
  }

  async deleteDocument(id: string) {
    if (!this.index) throw new Error('Vector index not initialized');
    await this.index.deleteItem(id);
  }

  async getStats() {
    if (!this.index) throw new Error('Vector index not initialized');
    
    const items = await this.index.listItems();
    return {
      totalDocuments: items.length,
      indexPath: this.indexPath
    };
  }

  async close() {
    // Vectra automatically saves on operations
    this.index = null;
  }
}
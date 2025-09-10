import { LRUCache } from 'lru-cache';
import { app } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SearchResult } from './advancedSearch';

/**
 * Advanced Caching Service for DevDigger
 * Implements multi-level caching with LRU memory cache, disk persistence,
 * and semantic similarity matching for fuzzy cache hits.
 */

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  allowSemantic?: boolean; // Allow semantic similarity matching
  persistToDisk?: boolean; // Persist to disk cache
  compressionLevel?: number; // 0-9, higher = more compression
}

interface CacheEntry<T> {
  key: string;
  value: T;
  embedding?: number[];
  timestamp: number;
  hits: number;
  lastAccessed: number;
}

interface CacheStats {
  memoryHits: number;
  memoryMisses: number;
  diskHits: number;
  diskMisses: number;
  semanticHits: number;
  totalQueries: number;
  cacheSize: number;
  diskCacheSize: number;
}

export class AdvancedCacheService {
  private embeddingCache: LRUCache<string, number[]>;
  private queryCache: LRUCache<string, SearchResult[]>;
  private documentCache: LRUCache<string, any>;
  private semanticIndex: Map<string, { embedding: number[]; key: string }>;
  private cacheDir: string;
  private stats: CacheStats;
  private saveTimer: NodeJS.Timeout | null = null;
  private isDirty: boolean = false;

  constructor() {
    // Initialize LRU caches with size and TTL limits
    this.embeddingCache = new LRUCache<string, number[]>({
      max: 10000, // Maximum 10,000 embeddings
      maxSize: 100 * 1024 * 1024, // 100MB max memory
      sizeCalculation: (value) => value.length * 4, // 4 bytes per float
      ttl: 1000 * 60 * 60 * 24, // 24 hour TTL for embeddings
      updateAgeOnGet: true,
      updateAgeOnHas: true,
    });

    this.queryCache = new LRUCache<string, SearchResult[]>({
      max: 1000, // Maximum 1,000 cached queries
      maxSize: 50 * 1024 * 1024, // 50MB max memory
      sizeCalculation: (value) => JSON.stringify(value).length,
      ttl: 1000 * 60 * 5, // 5 minute TTL for queries
      updateAgeOnGet: true,
    });

    this.documentCache = new LRUCache<string, any>({
      max: 5000, // Maximum 5,000 documents
      maxSize: 200 * 1024 * 1024, // 200MB max memory
      sizeCalculation: (value) => JSON.stringify(value).length,
      ttl: 1000 * 60 * 30, // 30 minute TTL
      updateAgeOnGet: true,
    });

    this.semanticIndex = new Map();
    
    // Set up cache directory
    this.cacheDir = path.join(app.getPath('userData'), 'cache');
    
    // Initialize statistics
    this.stats = {
      memoryHits: 0,
      memoryMisses: 0,
      diskHits: 0,
      diskMisses: 0,
      semanticHits: 0,
      totalQueries: 0,
      cacheSize: 0,
      diskCacheSize: 0,
    };

    // Initialize cache directory and load persisted cache
    this.initializeCacheDirectory();
    this.loadPersistedCache();

    // Set up periodic save to disk
    this.setupPeriodicSave();
  }

  /**
   * Initialize cache directory structure
   */
  private async initializeCacheDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      await fs.mkdir(path.join(this.cacheDir, 'embeddings'), { recursive: true });
      await fs.mkdir(path.join(this.cacheDir, 'queries'), { recursive: true });
      await fs.mkdir(path.join(this.cacheDir, 'documents'), { recursive: true });
    } catch (error) {
      console.error('Failed to initialize cache directory:', error);
    }
  }

  /**
   * Load persisted cache from disk
   */
  private async loadPersistedCache(): Promise<void> {
    try {
      // Load embeddings cache manifest
      const manifestPath = path.join(this.cacheDir, 'manifest.json');
      if (await this.fileExists(manifestPath)) {
        const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
        console.log(`Loading ${manifest.embeddings} embeddings from disk cache`);
        
        // Load most recently used embeddings
        if (manifest.recentEmbeddings) {
          for (const entry of manifest.recentEmbeddings.slice(0, 1000)) {
            const filePath = path.join(this.cacheDir, 'embeddings', `${entry.hash}.bin`);
            if (await this.fileExists(filePath)) {
              const buffer = await fs.readFile(filePath);
              const embedding = Array.from(new Float32Array(buffer.buffer));
              this.embeddingCache.set(entry.key, embedding);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load persisted cache:', error);
    }
  }

  /**
   * Set up periodic save to disk (every 5 minutes)
   */
  private setupPeriodicSave(): void {
    this.saveTimer = setInterval(() => {
      if (this.isDirty) {
        this.persistToDisk();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Main caching method with semantic fallback
   */
  async getCachedOrCompute<T>(
    key: string,
    compute: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const {
      ttl = 5 * 60 * 1000,
      allowSemantic = true,
      persistToDisk = false,
    } = options;

    this.stats.totalQueries++;

    // Check memory cache first
    const cached = this.getFromMemoryCache<T>(key);
    if (cached !== null) {
      this.stats.memoryHits++;
      return cached;
    }
    this.stats.memoryMisses++;

    // Check disk cache if enabled
    if (persistToDisk) {
      const diskCached = await this.getFromDiskCache<T>(key);
      if (diskCached !== null) {
        this.stats.diskHits++;
        // Promote to memory cache
        this.setInMemoryCache(key, diskCached, ttl);
        return diskCached;
      }
      this.stats.diskMisses++;
    }

    // Check semantic similarity cache if enabled
    if (allowSemantic && this.isQueryKey(key)) {
      const semanticResult = await this.findSemanticallySimilar<T>(key);
      if (semanticResult !== null) {
        this.stats.semanticHits++;
        return semanticResult;
      }
    }

    // Compute the result
    const result = await compute();

    // Cache the result
    this.setInMemoryCache(key, result, ttl);
    
    if (persistToDisk) {
      await this.setInDiskCache(key, result);
    }

    this.isDirty = true;
    return result;
  }

  /**
   * Get from memory cache
   */
  private getFromMemoryCache<T>(key: string): T | null {
    // Check appropriate cache based on key type
    if (this.isEmbeddingKey(key)) {
      return this.embeddingCache.get(key) as T | undefined || null;
    } else if (this.isQueryKey(key)) {
      return this.queryCache.get(key) as T | undefined || null;
    } else {
      return this.documentCache.get(key) as T | undefined || null;
    }
  }

  /**
   * Set in memory cache
   */
  private setInMemoryCache<T>(key: string, value: T, ttl: number): void {
    if (this.isEmbeddingKey(key)) {
      this.embeddingCache.set(key, value as number[], { ttl });
    } else if (this.isQueryKey(key)) {
      this.queryCache.set(key, value as SearchResult[], { ttl });
    } else {
      this.documentCache.set(key, value, { ttl });
    }
  }

  /**
   * Get from disk cache
   */
  private async getFromDiskCache<T>(key: string): Promise<T | null> {
    try {
      const hash = this.hashKey(key);
      const subDir = this.getSubDirectory(key);
      const filePath = path.join(this.cacheDir, subDir, `${hash}.json`);

      if (await this.fileExists(filePath)) {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
      }
    } catch (error) {
      console.error(`Failed to read from disk cache for key ${key}:`, error);
    }
    return null;
  }

  /**
   * Set in disk cache
   */
  private async setInDiskCache<T>(key: string, value: T): Promise<void> {
    try {
      const hash = this.hashKey(key);
      const subDir = this.getSubDirectory(key);
      const filePath = path.join(this.cacheDir, subDir, `${hash}.json`);

      await fs.writeFile(filePath, JSON.stringify(value), 'utf-8');
    } catch (error) {
      console.error(`Failed to write to disk cache for key ${key}:`, error);
    }
  }

  /**
   * Find semantically similar cached queries
   */
  private async findSemanticallySimilar<T>(queryKey: string): Promise<T | null> {
    // Extract the actual query from the key
    const query = this.extractQueryFromKey(queryKey);
    if (!query) return null;

    // Get or compute embedding for this query
    const queryEmbedding = await this.getQueryEmbedding(query);
    if (!queryEmbedding) return null;

    // Search through cached queries for similar ones
    let bestMatch: { key: string; similarity: number } | null = null;
    let bestSimilarity = 0;

    for (const [cachedKey, _] of this.queryCache.entries()) {
      const cachedQuery = this.extractQueryFromKey(cachedKey);
      if (!cachedQuery) continue;

      const cachedEmbedding = await this.getQueryEmbedding(cachedQuery);
      if (!cachedEmbedding) continue;

      const similarity = this.cosineSimilarity(queryEmbedding, cachedEmbedding);
      
      // Threshold for semantic similarity (0.95 = very similar)
      if (similarity > 0.95 && similarity > bestSimilarity) {
        bestMatch = { key: cachedKey, similarity };
        bestSimilarity = similarity;
      }
    }

    if (bestMatch) {
      console.log(`Found semantic match with similarity ${bestMatch.similarity.toFixed(3)}`);
      return this.queryCache.get(bestMatch.key) as T | undefined || null;
    }

    return null;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (normA * normB);
  }

  /**
   * Cache embeddings for batch processing
   */
  async cacheEmbeddings(embeddings: Map<string, number[]>): Promise<void> {
    for (const [key, embedding] of embeddings) {
      this.embeddingCache.set(key, embedding);
      
      // Also save to semantic index for similarity search
      this.semanticIndex.set(key, { embedding, key });
    }
    
    this.isDirty = true;
  }

  /**
   * Precompute and cache embeddings for documents
   */
  async precomputeEmbeddings(
    documents: { id: string; content: string }[],
    computeEmbedding: (content: string) => Promise<number[]>
  ): Promise<void> {
    const batchSize = 100;
    const total = documents.length;
    
    console.log(`Precomputing embeddings for ${total} documents`);
    
    for (let i = 0; i < total; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const embeddings = new Map<string, number[]>();
      
      // Process batch in parallel
      const promises = batch.map(async (doc) => {
        const key = `embedding:${doc.id}`;
        
        // Check if already cached
        if (this.embeddingCache.has(key)) {
          return;
        }
        
        const embedding = await computeEmbedding(doc.content);
        embeddings.set(key, embedding);
      });
      
      await Promise.all(promises);
      await this.cacheEmbeddings(embeddings);
      
      // Persist to disk periodically
      if (i % 1000 === 0) {
        await this.persistToDisk();
      }
      
      console.log(`Processed ${Math.min(i + batchSize, total)}/${total} documents`);
    }
    
    // Final persist
    await this.persistToDisk();
  }

  /**
   * Persist current cache state to disk
   */
  async persistToDisk(): Promise<void> {
    try {
      // Create manifest with cache metadata
      const manifest = {
        version: 1,
        timestamp: Date.now(),
        embeddings: this.embeddingCache.size,
        queries: this.queryCache.size,
        documents: this.documentCache.size,
        recentEmbeddings: [] as Array<{ key: string; hash: string; timestamp: number }>,
      };

      // Save most recently used embeddings
      for (const [key, value] of this.embeddingCache.entries()) {
        const hash = this.hashKey(key);
        const filePath = path.join(this.cacheDir, 'embeddings', `${hash}.bin`);
        
        // Save as binary for efficiency
        const buffer = Buffer.from(new Float32Array(value).buffer);
        await fs.writeFile(filePath, buffer);
        
        manifest.recentEmbeddings.push({
          key,
          hash,
          timestamp: Date.now(),
        });
        
        // Limit to 1000 most recent
        if (manifest.recentEmbeddings.length >= 1000) break;
      }

      // Save manifest
      await fs.writeFile(
        path.join(this.cacheDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );

      this.isDirty = false;
      console.log('Cache persisted to disk');
    } catch (error) {
      console.error('Failed to persist cache to disk:', error);
    }
  }

  /**
   * Clear all caches
   */
  async clearCache(): Promise<void> {
    this.embeddingCache.clear();
    this.queryCache.clear();
    this.documentCache.clear();
    this.semanticIndex.clear();
    
    // Clear disk cache
    try {
      await fs.rm(this.cacheDir, { recursive: true });
      await this.initializeCacheDirectory();
    } catch (error) {
      console.error('Failed to clear disk cache:', error);
    }
    
    // Reset stats
    this.stats = {
      memoryHits: 0,
      memoryMisses: 0,
      diskHits: 0,
      diskMisses: 0,
      semanticHits: 0,
      totalQueries: 0,
      cacheSize: 0,
      diskCacheSize: 0,
    };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.stats.cacheSize = 
      this.embeddingCache.size + 
      this.queryCache.size + 
      this.documentCache.size;
    
    return { ...this.stats };
  }

  /**
   * Helper methods
   */
  private hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex').substring(0, 16);
  }

  private isEmbeddingKey(key: string): boolean {
    return key.startsWith('embedding:');
  }

  private isQueryKey(key: string): boolean {
    return key.startsWith('query:');
  }

  private getSubDirectory(key: string): string {
    if (this.isEmbeddingKey(key)) return 'embeddings';
    if (this.isQueryKey(key)) return 'queries';
    return 'documents';
  }

  private extractQueryFromKey(key: string): string | null {
    if (!this.isQueryKey(key)) return null;
    return key.substring('query:'.length);
  }

  private async getQueryEmbedding(query: string): Promise<number[] | null> {
    const embeddingKey = `embedding:query:${query}`;
    return this.embeddingCache.get(embeddingKey) || null;
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Cleanup on shutdown
   */
  async shutdown(): Promise<void> {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }
    
    if (this.isDirty) {
      await this.persistToDisk();
    }
    
    console.log('Cache service shutdown complete');
    console.log('Final cache stats:', this.getStats());
  }
}
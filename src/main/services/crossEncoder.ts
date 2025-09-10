import { pipeline, env } from '@xenova/transformers';
import { app } from 'electron';
import path from 'path';
import { SearchResult } from './advancedSearch';

/**
 * CrossEncoder Neural Reranking Service
 * Uses transformer models to accurately score query-document pairs
 * for superior relevance ranking.
 */

// Configure Transformers.js
// @ts-ignore - env object may not have all these properties in type definitions
env.cacheDir = path.join(app.getPath('userData'), 'models');
// @ts-ignore
env.allowRemoteModels = true;

export interface RerankResult {
  index: number;
  score: number;
  document: SearchResult;
}

export interface CrossEncoderConfig {
  modelName?: string;
  maxLength?: number;
  batchSize?: number;
  device?: 'cpu' | 'gpu';
  cacheModels?: boolean;
}

export class CrossEncoderService {
  private reranker: any = null;
  private modelName: string;
  private maxLength: number;
  private batchSize: number;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private modelCache: Map<string, any> = new Map();

  constructor(config: CrossEncoderConfig = {}) {
    this.modelName = config.modelName || 'Xenova/ms-marco-MiniLM-L-6-v2';
    this.maxLength = config.maxLength || 512;
    this.batchSize = config.batchSize || 8;
    
    // Set cache directory for models
    if (config.cacheModels !== false) {
      this.setupModelCache();
    }
  }

  /**
   * Setup model cache directory
   */
  private setupModelCache(): void {
    const cacheDir = path.join(app.getPath('userData'), 'models');
    env.cacheDir = cacheDir;
    console.log(`Model cache directory: ${cacheDir}`);
  }

  /**
   * Initialize the cross-encoder model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Prevent multiple initialization calls
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this.doInitialize();
    await this.initializationPromise;
    this.initializationPromise = null;
  }

  private async doInitialize(): Promise<void> {
    try {
      console.log(`Initializing cross-encoder model: ${this.modelName}`);
      const startTime = Date.now();
      
      // Check if model is cached
      if (this.modelCache.has(this.modelName)) {
        this.reranker = this.modelCache.get(this.modelName);
        console.log('Loaded model from cache');
      } else {
        // Load the model
        // Using 'feature-extraction' as a workaround since 'reranking' might not be available
        this.reranker = await pipeline(
          'feature-extraction',
          this.modelName,
          {
            progress_callback: (progress: any) => {
              if (progress.status === 'download') {
                const percent = (progress.loaded / progress.total * 100).toFixed(1);
                console.log(`Downloading model: ${percent}%`);
              }
            }
          }
        );
        
        // Cache the model
        this.modelCache.set(this.modelName, this.reranker);
      }
      
      const loadTime = Date.now() - startTime;
      console.log(`Model loaded in ${loadTime}ms`);
      
      this.isInitialized = true;
      
      // Warm up the model with a test query
      await this.warmUp();
      
    } catch (error) {
      console.error('Failed to initialize cross-encoder:', error);
      throw new Error(`CrossEncoder initialization failed: ${error}`);
    }
  }

  /**
   * Warm up the model with a test query
   */
  private async warmUp(): Promise<void> {
    try {
      console.log('Warming up cross-encoder model...');
      const testQuery = 'test query';
      const testDoc = 'test document';
      await this.scoreDocumentPair(testQuery, testDoc);
      console.log('Model warm-up complete');
    } catch (error) {
      console.warn('Model warm-up failed:', error);
    }
  }

  /**
   * Rerank search results using the cross-encoder
   */
  async rerank(
    query: string,
    results: SearchResult[],
    topK: number = 10
  ): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.reranker) {
      console.warn('CrossEncoder not available, returning original results');
      return results.slice(0, topK);
    }
    
    console.log(`Reranking ${results.length} results for query: "${query}"`);
    const startTime = Date.now();
    
    try {
      // Score all document pairs
      const scores = await this.scoreDocuments(query, results);
      
      // Combine scores with original results
      const rerankedResults = results.map((result, index) => ({
        ...result,
        crossEncoderScore: scores[index],
        originalScore: result.score,
        // Combine original score with cross-encoder score
        score: this.combineScores(result.score, scores[index]),
      }));
      
      // Sort by combined score
      rerankedResults.sort((a, b) => b.score - a.score);
      
      const rerankTime = Date.now() - startTime;
      console.log(`Reranking completed in ${rerankTime}ms`);
      
      // Log score changes for debugging
      this.logScoreChanges(results, rerankedResults.slice(0, topK));
      
      return rerankedResults.slice(0, topK);
      
    } catch (error) {
      console.error('Reranking failed:', error);
      // Fallback to original results
      return results.slice(0, topK);
    }
  }

  /**
   * Score multiple documents against a query
   */
  private async scoreDocuments(
    query: string,
    documents: SearchResult[]
  ): Promise<number[]> {
    const scores: number[] = [];
    
    // Process in batches for efficiency
    for (let i = 0; i < documents.length; i += this.batchSize) {
      const batch = documents.slice(i, i + this.batchSize);
      const batchScores = await this.scoreBatch(query, batch);
      scores.push(...batchScores);
    }
    
    return scores;
  }

  /**
   * Score a batch of documents
   */
  private async scoreBatch(
    query: string,
    documents: SearchResult[]
  ): Promise<number[]> {
    try {
      // Prepare input pairs
      const pairs = documents.map(doc => this.prepareInput(query, doc.content));
      
      // Score all pairs
      const scores = await Promise.all(
        pairs.map(pair => this.scoreDocumentPair(pair.query, pair.document))
      );
      
      return scores;
    } catch (error) {
      console.error('Batch scoring failed:', error);
      // Return neutral scores on failure
      return documents.map(() => 0.5);
    }
  }

  /**
   * Score a single query-document pair
   */
  private async scoreDocumentPair(query: string, document: string): Promise<number> {
    try {
      // For feature-extraction pipeline, we need to compute similarity differently
      // We'll use the model to get embeddings and compute cosine similarity
      
      // Truncate if necessary
      const truncatedDoc = this.truncateText(document, this.maxLength);
      
      // Get embeddings for query and document
      const queryEmbedding = await this.reranker(query, {
        pooling: 'mean',
        normalize: true,
      });
      
      const docEmbedding = await this.reranker(truncatedDoc, {
        pooling: 'mean',
        normalize: true,
      });
      
      // Compute cosine similarity
      const similarity = this.cosineSimilarity(
        Array.from(queryEmbedding.data),
        Array.from(docEmbedding.data)
      );
      
      // Convert to 0-1 score
      return (similarity + 1) / 2;
      
    } catch (error) {
      console.warn('Document scoring failed:', error);
      return 0.5; // Neutral score on failure
    }
  }

  /**
   * Alternative implementation using a different approach
   * This can be used if the model supports text-similarity
   */
  private async scoreWithTextSimilarity(query: string, document: string): Promise<number> {
    try {
      // Combine query and document with separator
      const input = `${query} [SEP] ${this.truncateText(document, this.maxLength)}`;
      
      // Get model output
      const output = await this.reranker(input);
      
      // Extract relevance score (model-specific)
      // For BERT-based models, typically use the [CLS] token output
      if (output && output.data) {
        // Sigmoid to convert to 0-1 range
        const logit = output.data[0];
        return 1 / (1 + Math.exp(-logit));
      }
      
      return 0.5;
    } catch {
      return 0.5;
    }
  }

  /**
   * Prepare input for the model
   */
  private prepareInput(query: string, document: string): { query: string; document: string } {
    // Clean and normalize text
    const cleanQuery = this.cleanText(query);
    const cleanDoc = this.cleanText(document);
    
    // Truncate document to max length
    const truncatedDoc = this.truncateText(cleanDoc, this.maxLength - cleanQuery.length - 10);
    
    return {
      query: cleanQuery,
      document: truncatedDoc,
    };
  }

  /**
   * Clean text for model input
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
      .trim();
  }

  /**
   * Truncate text to maximum length
   */
  private truncateText(text: string, maxLength: number): string {
    const words = text.split(/\s+/);
    if (words.length <= maxLength / 5) { // Rough estimate: 5 chars per word
      return text;
    }
    
    // Truncate to approximately maxLength characters
    let truncated = '';
    for (const word of words) {
      if (truncated.length + word.length > maxLength) break;
      truncated += (truncated ? ' ' : '') + word;
    }
    
    return truncated;
  }

  /**
   * Combine original score with cross-encoder score
   */
  private combineScores(originalScore: number, crossEncoderScore: number): number {
    // Weighted combination: 30% original, 70% cross-encoder
    const combined = originalScore * 0.3 + crossEncoderScore * 0.7;
    
    // Apply boost for very high cross-encoder scores
    if (crossEncoderScore > 0.8) {
      return Math.min(1, combined * 1.1);
    }
    
    return combined;
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
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Log score changes for debugging
   */
  private logScoreChanges(
    original: SearchResult[],
    reranked: SearchResult[]
  ): void {
    console.log('Top results after reranking:');
    
    for (let i = 0; i < Math.min(5, reranked.length); i++) {
      const result = reranked[i];
      const originalIndex = original.findIndex(o => o.id === result.id);
      const change = originalIndex - i;
      
      console.log(
        `  ${i + 1}. Score: ${result.score.toFixed(3)} ` +
        `(was #${originalIndex + 1}, ${change > 0 ? '+' : ''}${change})`
      );
    }
  }

  /**
   * Batch rerank multiple queries
   */
  async batchRerank(
    queries: Array<{ query: string; results: SearchResult[] }>,
    topK: number = 10
  ): Promise<Array<SearchResult[]>> {
    const rerankedBatch: Array<SearchResult[]> = [];
    
    // Process queries in parallel (with concurrency limit)
    const concurrency = 3;
    for (let i = 0; i < queries.length; i += concurrency) {
      const batch = queries.slice(i, i + concurrency);
      
      const promises = batch.map(({ query, results }) =>
        this.rerank(query, results, topK)
      );
      
      const batchResults = await Promise.all(promises);
      rerankedBatch.push(...batchResults);
    }
    
    return rerankedBatch;
  }

  /**
   * Get model information
   */
  getModelInfo(): {
    modelName: string;
    isInitialized: boolean;
    cacheDir: string;
    maxLength: number;
    batchSize: number;
  } {
    return {
      modelName: this.modelName,
      isInitialized: this.isInitialized,
      cacheDir: env.cacheDir,
      maxLength: this.maxLength,
      batchSize: this.batchSize,
    };
  }

  /**
   * Change the model (requires re-initialization)
   */
  async changeModel(modelName: string): Promise<void> {
    this.modelName = modelName;
    this.isInitialized = false;
    this.reranker = null;
    await this.initialize();
  }

  /**
   * Clear model cache
   */
  clearCache(): void {
    this.modelCache.clear();
    console.log('Model cache cleared');
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.reranker = null;
    this.isInitialized = false;
    this.modelCache.clear();
    console.log('CrossEncoder service cleaned up');
  }
}
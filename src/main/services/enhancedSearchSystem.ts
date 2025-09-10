import { DatabaseService } from './database';
import { VectorDatabaseService } from './vectorDatabase';
import { EmbeddingService } from './embedding';
import { EnhancedDatabaseService } from './databaseEnhanced';
import { AdvancedSearchService, SearchResult, SearchOptions } from './advancedSearch';
import { AdvancedCacheService } from './advancedCache';
import { MultiStageRAGPipeline, PipelineOptions, PipelineProfile } from './multiStageRAG';
import { CrossEncoderService } from './crossEncoder';
import { ContextualEmbeddingService, DocumentContext } from './contextualEmbedding';
import { app } from 'electron';

/**
 * Enhanced Search System
 * Integrates all advanced search features into a unified, easy-to-use interface.
 * This is the main entry point for DevDigger's advanced search capabilities.
 */

export interface SystemConfig {
  enableCache?: boolean;
  enableCrossEncoder?: boolean;
  enableContextualEmbeddings?: boolean;
  defaultPipelineProfile?: PipelineProfile;
  autoInitialize?: boolean;
  openAIKey?: string;
}

export interface SystemStats {
  initialized: boolean;
  servicesStatus: {
    database: boolean;
    vectorDb: boolean;
    embedding: boolean;
    cache: boolean;
    crossEncoder: boolean;
    contextualEmbedding: boolean;
    pipeline: boolean;
  };
  cacheStats: any;
  pipelineMetrics: any;
}

export class EnhancedSearchSystem {
  // Core services
  private database: EnhancedDatabaseService;
  private vectorDb: VectorDatabaseService;
  private embeddingService: EmbeddingService;
  
  // Advanced services
  private cacheService: AdvancedCacheService;
  private searchService: AdvancedSearchService;
  private crossEncoderService: CrossEncoderService | null = null;
  private contextualEmbeddingService: ContextualEmbeddingService | null = null;
  private ragPipeline: MultiStageRAGPipeline;
  
  // Configuration
  private config: SystemConfig;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  
  // Singleton instance
  private static instance: EnhancedSearchSystem | null = null;

  private constructor(
    database: DatabaseService,
    vectorDb: VectorDatabaseService,
    embeddingService: EmbeddingService,
    config: SystemConfig = {}
  ) {
    // Set up core services
    this.database = new EnhancedDatabaseService();
    this.vectorDb = vectorDb;
    this.embeddingService = embeddingService;
    
    // Set up configuration
    this.config = {
      enableCache: config.enableCache !== false,
      enableCrossEncoder: config.enableCrossEncoder !== false,
      enableContextualEmbeddings: config.enableContextualEmbeddings !== false,
      defaultPipelineProfile: config.defaultPipelineProfile || 'balanced',
      autoInitialize: config.autoInitialize !== false,
      openAIKey: config.openAIKey,
    };
    
    // Initialize advanced services
    this.cacheService = new AdvancedCacheService();
    this.searchService = new AdvancedSearchService(
      this.database,
      this.vectorDb,
      this.embeddingService
    );
    
    // Initialize RAG pipeline
    this.ragPipeline = new MultiStageRAGPipeline(
      this.searchService,
      this.cacheService,
      this.database,
      this.vectorDb,
      this.embeddingService
    );
    
    // Auto-initialize if configured
    if (this.config.autoInitialize) {
      this.initialize().catch(console.error);
    }
  }

  /**
   * Get or create singleton instance
   */
  static getInstance(
    database?: DatabaseService,
    vectorDb?: VectorDatabaseService,
    embeddingService?: EmbeddingService,
    config?: SystemConfig
  ): EnhancedSearchSystem {
    if (!EnhancedSearchSystem.instance) {
      if (!database || !vectorDb || !embeddingService) {
        throw new Error('Services required for first initialization');
      }
      
      EnhancedSearchSystem.instance = new EnhancedSearchSystem(
        database,
        vectorDb,
        embeddingService,
        config
      );
    }
    
    return EnhancedSearchSystem.instance;
  }

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Prevent multiple initialization
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this.doInitialize();
    await this.initializationPromise;
    this.initializationPromise = null;
  }

  private async doInitialize(): Promise<void> {
    console.log('Initializing Enhanced Search System...');
    const startTime = Date.now();
    
    try {
      // Initialize database with FTS5
      await this.database.initializeFTS();
      console.log('✓ Database and FTS5 initialized');
      
      // Initialize CrossEncoder if enabled
      if (this.config.enableCrossEncoder) {
        try {
          this.crossEncoderService = new CrossEncoderService({
            modelName: 'Xenova/ms-marco-MiniLM-L-6-v2',
            batchSize: 8,
            cacheModels: true,
          });
          await this.crossEncoderService.initialize();
          console.log('✓ CrossEncoder service initialized');
        } catch (error) {
          console.warn('CrossEncoder initialization failed, continuing without it:', error);
          this.crossEncoderService = null;
        }
      }
      
      // Initialize Contextual Embeddings if enabled
      if (this.config.enableContextualEmbeddings) {
        try {
          this.contextualEmbeddingService = new ContextualEmbeddingService(
            this.embeddingService,
            this.cacheService,
            {
              llmProvider: 'ollama',
              llmModel: 'llama2',
              enhancementStrategy: 'hybrid',
            }
          );
          
          if (this.config.openAIKey) {
            this.contextualEmbeddingService.setOpenAIKey(this.config.openAIKey);
          }
          
          await this.contextualEmbeddingService.initialize();
          console.log('✓ Contextual Embedding service initialized');
        } catch (error) {
          console.warn('Contextual Embedding initialization failed, continuing without it:', error);
          this.contextualEmbeddingService = null;
        }
      }
      
      // Build search index
      await this.searchService.buildSearchIndex();
      console.log('✓ Search index built');
      
      this.isInitialized = true;
      
      const initTime = Date.now() - startTime;
      console.log(`✅ Enhanced Search System initialized in ${initTime}ms`);
      
    } catch (error) {
      console.error('Failed to initialize Enhanced Search System:', error);
      throw error;
    }
  }

  /**
   * Main search interface - uses the full pipeline
   */
  async search(
    query: string,
    options: {
      profile?: PipelineProfile;
      limit?: number;
      context?: DocumentContext;
      useCache?: boolean;
      rerank?: boolean;
    } = {}
  ): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const {
      profile = this.config.defaultPipelineProfile,
      limit = 10,
      context = {},
      useCache = this.config.enableCache,
      rerank = this.config.enableCrossEncoder && this.crossEncoderService !== null,
    } = options;
    
    console.log(`🔍 Searching: "${query}" with profile: ${profile}`);
    
    // Use contextual embeddings if available and context provided
    if (this.contextualEmbeddingService && Object.keys(context).length > 0) {
      const enhancedEmbedding = await this.contextualEmbeddingService.generateContextualEmbedding(
        query,
        context
      );
      console.log(`Enhanced query with context (confidence: ${enhancedEmbedding.confidence.toFixed(2)})`);
      
      // Use enhanced text for search
      query = enhancedEmbedding.enhancedText;
    }
    
    // Execute the multi-stage pipeline
    const pipelineOptions: PipelineOptions = {
      profile,
      limit,
      enableCache: useCache,
      enableReranking: rerank,
      enableContextEnrichment: true,
      enableSemanticExpansion: profile === 'research',
      minConfidence: 0.3,
      maxLatency: profile === 'fast' ? 2000 : 5000,
    };
    
    let results = await this.ragPipeline.execute(query, pipelineOptions);
    
    // Apply cross-encoder reranking if available
    if (rerank && this.crossEncoderService) {
      console.log('Applying CrossEncoder reranking...');
      results = await this.crossEncoderService.rerank(query, results, limit);
    }
    
    // Log search quality metrics
    this.logSearchQuality(query, results);
    
    return results;
  }

  /**
   * Simple search without the full pipeline
   */
  async simpleSearch(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return await this.searchService.search(query, options);
  }

  /**
   * Hybrid search combining vector and keyword
   */
  async hybridSearch(
    query: string,
    limit: number = 10
  ): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // Get vector results
    const queryEmbedding = await this.embeddingService.generateEmbedding(query);
    const vectorResults = await this.vectorDb.search(queryEmbedding.embedding, limit * 2);
    
    // Perform hybrid search with database
    return await this.database.hybridSearch(query, vectorResults, limit);
  }

  /**
   * Precompute embeddings for all documents
   */
  async precomputeEmbeddings(
    progressCallback?: (progress: number) => void
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    console.log('Starting embedding precomputation...');
    
    // Get all documents
    const documents = await this.database.getAllDocuments();
    console.log(`Found ${documents.length} documents to process`);
    
    // Prepare for caching
    const computeEmbedding = async (content: string) => {
      const result = await this.embeddingService.generateEmbedding(content);
      return result.embedding;
    };
    
    // Use cache service for precomputation
    await this.cacheService.precomputeEmbeddings(
      documents.map(d => ({ id: d.id, content: d.content })),
      computeEmbedding
    );
    
    console.log('Embedding precomputation complete');
  }

  /**
   * Warm up caches and models
   */
  async warmUp(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    console.log('Warming up search system...');
    
    // Warm up with test queries
    const testQueries = [
      'function',
      'error handling',
      'async await',
      'database connection',
    ];
    
    for (const query of testQueries) {
      await this.simpleSearch(query, { limit: 5 });
    }
    
    console.log('Warm-up complete');
  }

  /**
   * Get system statistics
   */
  getStatistics(): SystemStats {
    const cacheStats = this.cacheService.getStats();
    const pipelineMetrics = this.ragPipeline.getMetrics();
    
    return {
      initialized: this.isInitialized,
      servicesStatus: {
        database: true,
        vectorDb: true,
        embedding: true,
        cache: true,
        crossEncoder: this.crossEncoderService !== null,
        contextualEmbedding: this.contextualEmbeddingService !== null,
        pipeline: true,
      },
      cacheStats,
      pipelineMetrics,
    };
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    await this.cacheService.clearCache();
    
    if (this.crossEncoderService) {
      this.crossEncoderService.clearCache();
    }
    
    console.log('All caches cleared');
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SystemConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Handle OpenAI key update
    if (config.openAIKey) {
      this.embeddingService.setOpenAIKey(config.openAIKey);
      
      if (this.contextualEmbeddingService) {
        this.contextualEmbeddingService.setOpenAIKey(config.openAIKey);
      }
    }
    
    console.log('Configuration updated');
  }

  /**
   * Log search quality metrics
   */
  private logSearchQuality(query: string, results: SearchResult[]): void {
    if (results.length === 0) {
      console.log(`⚠️ No results found for: "${query}"`);
      return;
    }
    
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const highQualityCount = results.filter(r => r.score > 0.7).length;
    
    console.log(`📊 Search Quality Metrics:`);
    console.log(`   Results: ${results.length}`);
    console.log(`   Avg Score: ${avgScore.toFixed(3)}`);
    console.log(`   High Quality: ${highQualityCount}/${results.length}`);
    console.log(`   Top Score: ${results[0].score.toFixed(3)}`);
  }

  /**
   * Rebuild search indices
   */
  async rebuildIndices(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    console.log('Rebuilding search indices...');
    
    // Rebuild FTS index
    await this.database.rebuildFTSIndex();
    
    // Rebuild search index
    await this.searchService.buildSearchIndex();
    
    console.log('Indices rebuilt successfully');
  }

  /**
   * Shutdown and cleanup
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down Enhanced Search System...');
    
    // Save cache to disk
    await this.cacheService.shutdown();
    
    // Cleanup services
    if (this.crossEncoderService) {
      await this.crossEncoderService.cleanup();
    }
    
    // Clear singleton
    EnhancedSearchSystem.instance = null;
    
    console.log('Shutdown complete');
  }

  /**
   * Export search configuration
   */
  exportConfig(): any {
    return {
      system: this.config,
      cache: this.cacheService.getStats(),
      pipeline: this.ragPipeline.getMetrics(),
      crossEncoder: this.crossEncoderService?.getModelInfo(),
      contextualEmbedding: this.contextualEmbeddingService?.getStatistics(),
    };
  }
}
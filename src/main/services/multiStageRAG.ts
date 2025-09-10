import { AdvancedSearchService, SearchResult, SearchStrategy } from './advancedSearch';
import { AdvancedCacheService } from './advancedCache';
import { DatabaseService } from './database';
import { VectorDatabaseService } from './vectorDatabase';
import { EmbeddingService } from './embedding';
import { EnhancedDatabaseService } from './databaseEnhanced';

/**
 * Multi-Stage RAG Pipeline for DevDigger
 * Implements a sophisticated retrieval pipeline with multiple stages
 * for progressively refined search results.
 */

export type PipelineProfile = 'fast' | 'balanced' | 'accurate' | 'research';

export interface PipelineOptions {
  profile?: PipelineProfile;
  limit?: number;
  enableCache?: boolean;
  enableReranking?: boolean;
  enableContextEnrichment?: boolean;
  enableSemanticExpansion?: boolean;
  minConfidence?: number;
  maxLatency?: number; // Maximum allowed latency in ms
}

export interface PipelineStageResult {
  stage: string;
  results: SearchResult[];
  candidateCount: number;
  processingTime: number;
  confidence: number;
}

export interface PipelineMetrics {
  totalTime: number;
  stages: PipelineStageResult[];
  cacheHitRate: number;
  finalResultCount: number;
  averageConfidence: number;
}

interface StageConfig {
  name: string;
  enabled: boolean;
  candidateMultiplier: number;
  strategy?: SearchStrategy;
  timeout?: number;
}

export class MultiStageRAGPipeline {
  private searchService: AdvancedSearchService;
  private cacheService: AdvancedCacheService;
  private database: EnhancedDatabaseService;
  private vectorDb: VectorDatabaseService;
  private embeddingService: EmbeddingService;
  
  // Pipeline configuration profiles
  private profiles: Map<PipelineProfile, StageConfig[]>;
  
  // Metrics tracking
  private metrics: PipelineMetrics;

  constructor(
    searchService: AdvancedSearchService,
    cacheService: AdvancedCacheService,
    database: EnhancedDatabaseService,
    vectorDb: VectorDatabaseService,
    embeddingService: EmbeddingService
  ) {
    this.searchService = searchService;
    this.cacheService = cacheService;
    this.database = database;
    this.vectorDb = vectorDb;
    this.embeddingService = embeddingService;
    
    // Initialize pipeline profiles
    this.profiles = this.initializeProfiles();
    
    // Initialize metrics
    this.metrics = this.createEmptyMetrics();
  }

  /**
   * Initialize pipeline configuration profiles
   */
  private initializeProfiles(): Map<PipelineProfile, StageConfig[]> {
    const profiles = new Map<PipelineProfile, StageConfig[]>();
    
    // Fast profile - optimize for speed
    profiles.set('fast', [
      { name: 'broad_retrieval', enabled: true, candidateMultiplier: 3, strategy: 'keyword' },
      { name: 'vector_search', enabled: true, candidateMultiplier: 2, strategy: 'semantic' },
      { name: 'merge_deduplicate', enabled: true, candidateMultiplier: 1 },
      { name: 'basic_scoring', enabled: true, candidateMultiplier: 1 },
    ]);
    
    // Balanced profile - good trade-off
    profiles.set('balanced', [
      { name: 'broad_retrieval', enabled: true, candidateMultiplier: 5, strategy: 'keyword' },
      { name: 'vector_search', enabled: true, candidateMultiplier: 3, strategy: 'semantic' },
      { name: 'hybrid_search', enabled: true, candidateMultiplier: 2, strategy: 'hybrid' },
      { name: 'reranking', enabled: true, candidateMultiplier: 1.5 },
      { name: 'context_enrichment', enabled: true, candidateMultiplier: 1 },
      { name: 'final_scoring', enabled: true, candidateMultiplier: 1 },
    ]);
    
    // Accurate profile - maximize quality
    profiles.set('accurate', [
      { name: 'broad_retrieval', enabled: true, candidateMultiplier: 10, strategy: 'keyword' },
      { name: 'vector_search', enabled: true, candidateMultiplier: 5, strategy: 'semantic' },
      { name: 'hybrid_search', enabled: true, candidateMultiplier: 3, strategy: 'hybrid' },
      { name: 'contextual_search', enabled: true, candidateMultiplier: 2.5, strategy: 'contextual' },
      { name: 'reranking', enabled: true, candidateMultiplier: 2 },
      { name: 'cross_encoder_rerank', enabled: true, candidateMultiplier: 1.5 },
      { name: 'context_enrichment', enabled: true, candidateMultiplier: 1.2 },
      { name: 'semantic_expansion', enabled: true, candidateMultiplier: 1.1 },
      { name: 'final_scoring', enabled: true, candidateMultiplier: 1 },
    ]);
    
    // Research profile - comprehensive search
    profiles.set('research', [
      { name: 'exhaustive_keyword', enabled: true, candidateMultiplier: 20, strategy: 'keyword' },
      { name: 'deep_vector_search', enabled: true, candidateMultiplier: 10, strategy: 'semantic' },
      { name: 'multi_strategy_search', enabled: true, candidateMultiplier: 5 },
      { name: 'document_expansion', enabled: true, candidateMultiplier: 3 },
      { name: 'citation_following', enabled: true, candidateMultiplier: 2.5 },
      { name: 'cross_reference', enabled: true, candidateMultiplier: 2 },
      { name: 'reranking', enabled: true, candidateMultiplier: 1.5 },
      { name: 'deep_context', enabled: true, candidateMultiplier: 1.2 },
      { name: 'quality_filtering', enabled: true, candidateMultiplier: 1 },
    ]);
    
    return profiles;
  }

  /**
   * Execute the multi-stage RAG pipeline
   */
  async execute(query: string, options: PipelineOptions = {}): Promise<SearchResult[]> {
    const startTime = Date.now();
    
    const {
      profile = 'balanced',
      limit = 10,
      enableCache = true,
      enableReranking = true,
      enableContextEnrichment = true,
      enableSemanticExpansion = false,
      minConfidence = 0.3,
      maxLatency = 5000,
    } = options;
    
    // Reset metrics
    this.metrics = this.createEmptyMetrics();
    
    // Check cache first if enabled
    if (enableCache) {
      const cacheKey = `query:${query}:${profile}:${limit}`;
      const cached = await this.cacheService.getCachedOrCompute(
        cacheKey,
        async () => this.executePipeline(query, profile, limit, options),
        { ttl: 5 * 60 * 1000, allowSemantic: true }
      );
      
      if (cached) {
        this.metrics.cacheHitRate = 1.0;
        return cached;
      }
    }
    
    // Execute the pipeline
    const results = await this.executePipeline(query, profile, limit, options);
    
    // Update final metrics
    this.metrics.totalTime = Date.now() - startTime;
    this.metrics.finalResultCount = results.length;
    this.metrics.averageConfidence = this.calculateAverageConfidence(results);
    
    // Log pipeline performance
    this.logPipelineMetrics();
    
    return results;
  }

  /**
   * Execute the actual pipeline stages
   */
  private async executePipeline(
    query: string,
    profile: PipelineProfile,
    limit: number,
    options: PipelineOptions
  ): Promise<SearchResult[]> {
    const stages = this.profiles.get(profile) || this.profiles.get('balanced')!;
    let candidates: SearchResult[] = [];
    
    for (const stage of stages) {
      if (!stage.enabled) continue;
      
      const stageStartTime = Date.now();
      const targetCandidates = Math.ceil(limit * stage.candidateMultiplier);
      
      try {
        // Execute stage with timeout
        candidates = await this.executeStageWithTimeout(
          stage,
          query,
          candidates,
          targetCandidates,
          options,
          stage.timeout || options.maxLatency || 5000
        );
        
        // Track stage metrics
        this.metrics.stages.push({
          stage: stage.name,
          results: candidates,
          candidateCount: candidates.length,
          processingTime: Date.now() - stageStartTime,
          confidence: this.calculateAverageConfidence(candidates),
        });
        
        // Early termination if we have enough high-confidence results
        if (this.shouldTerminateEarly(candidates, limit, options.minConfidence || 0.3)) {
          console.log(`Early termination at stage ${stage.name} with ${candidates.length} results`);
          break;
        }
        
      } catch (error) {
        console.error(`Stage ${stage.name} failed:`, error);
        // Continue with existing candidates if a stage fails
      }
    }
    
    // Final filtering and sorting
    return this.finalizeResults(candidates, limit, options.minConfidence || 0.3);
  }

  /**
   * Execute a single pipeline stage with timeout
   */
  private async executeStageWithTimeout(
    stage: StageConfig,
    query: string,
    inputCandidates: SearchResult[],
    targetCandidates: number,
    options: PipelineOptions,
    timeout: number
  ): Promise<SearchResult[]> {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Stage ${stage.name} timed out after ${timeout}ms`));
      }, timeout);
      
      try {
        let results: SearchResult[];
        
        switch (stage.name) {
          case 'broad_retrieval':
            results = await this.broadRetrieval(query, targetCandidates);
            break;
            
          case 'vector_search':
            results = await this.vectorSearch(query, targetCandidates);
            break;
            
          case 'hybrid_search':
            results = await this.hybridSearch(query, inputCandidates, targetCandidates);
            break;
            
          case 'contextual_search':
            results = await this.contextualSearch(query, inputCandidates, targetCandidates);
            break;
            
          case 'merge_deduplicate':
            results = this.mergeAndDeduplicate(inputCandidates);
            break;
            
          case 'reranking':
            results = await this.rerankResults(query, inputCandidates, targetCandidates);
            break;
            
          case 'cross_encoder_rerank':
            results = await this.crossEncoderRerank(query, inputCandidates, targetCandidates);
            break;
            
          case 'context_enrichment':
            results = await this.enrichWithContext(inputCandidates, targetCandidates);
            break;
            
          case 'semantic_expansion':
            results = await this.semanticExpansion(query, inputCandidates, targetCandidates);
            break;
            
          case 'basic_scoring':
          case 'final_scoring':
            results = await this.scoreAndRank(query, inputCandidates, targetCandidates);
            break;
            
          // Research profile stages
          case 'exhaustive_keyword':
            results = await this.exhaustiveKeywordSearch(query, targetCandidates);
            break;
            
          case 'deep_vector_search':
            results = await this.deepVectorSearch(query, targetCandidates);
            break;
            
          case 'multi_strategy_search':
            results = await this.multiStrategySearch(query, inputCandidates, targetCandidates);
            break;
            
          case 'document_expansion':
            results = await this.expandDocuments(inputCandidates, targetCandidates);
            break;
            
          case 'citation_following':
            results = await this.followCitations(inputCandidates, targetCandidates);
            break;
            
          case 'cross_reference':
            results = await this.crossReference(inputCandidates, targetCandidates);
            break;
            
          case 'deep_context':
            results = await this.deepContextAnalysis(inputCandidates, targetCandidates);
            break;
            
          case 'quality_filtering':
            results = this.qualityFilter(inputCandidates, targetCandidates);
            break;
            
          default:
            results = inputCandidates;
        }
        
        clearTimeout(timeoutId);
        resolve(results);
        
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Stage implementations
   */
  
  private async broadRetrieval(query: string, limit: number): Promise<SearchResult[]> {
    // Fast keyword-based retrieval for initial candidates
    const keywords = query.split(/\s+/).filter(k => k.length > 2);
    const documents = await this.database.searchDocumentsByKeywords(keywords, limit);
    
    return documents.map(doc => ({
      id: doc.id,
      content: doc.content,
      score: 0.5, // Base score for keyword matches
      metadata: doc.metadata || {},
      strategy: 'keyword' as SearchStrategy,
    }));
  }

  private async vectorSearch(query: string, limit: number): Promise<SearchResult[]> {
    // Semantic vector search
    const { embedding } = await this.embeddingService.generateEmbedding(query);
    const results = await this.vectorDb.search(embedding, limit);
    
    return results.map(r => ({
      ...r,
      strategy: 'semantic' as SearchStrategy,
    }));
  }

  private async hybridSearch(
    query: string,
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Use the advanced search service for hybrid search
    const results = await this.searchService.search(query, {
      strategy: 'hybrid',
      limit: limit,
      rerank: false, // We'll rerank later
    });
    
    // Merge with existing candidates
    return this.mergeResults(candidates, results, limit);
  }

  private async contextualSearch(
    query: string,
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Enhanced contextual search
    const results = await this.searchService.search(query, {
      strategy: 'contextual',
      limit: limit,
      contextEnhanced: true,
    });
    
    return this.mergeResults(candidates, results, limit);
  }

  private mergeAndDeduplicate(candidates: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    const merged: SearchResult[] = [];
    
    for (const candidate of candidates) {
      if (!seen.has(candidate.id)) {
        seen.add(candidate.id);
        merged.push(candidate);
      } else {
        // Update score if we've seen this before (take maximum)
        const existing = merged.find(m => m.id === candidate.id);
        if (existing && candidate.score > existing.score) {
          existing.score = candidate.score;
        }
      }
    }
    
    return merged.sort((a, b) => b.score - a.score);
  }

  private async rerankResults(
    query: string,
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Simple reranking based on multiple factors
    const reranked = candidates.map(candidate => {
      let score = candidate.score;
      
      // Boost for exact matches
      if (candidate.content.toLowerCase().includes(query.toLowerCase())) {
        score *= 1.3;
      }
      
      // Boost for title matches (if available)
      if (candidate.metadata?.title?.toLowerCase().includes(query.toLowerCase())) {
        score *= 1.2;
      }
      
      // Recency boost
      if (candidate.metadata?.created_at) {
        const age = Date.now() - new Date(candidate.metadata.created_at).getTime();
        const ageInDays = age / (1000 * 60 * 60 * 24);
        const recencyBoost = Math.max(0, 1 - ageInDays / 365);
        score *= (1 + recencyBoost * 0.1);
      }
      
      // Code presence boost
      if (candidate.metadata?.hasCode) {
        score *= 1.15;
      }
      
      return { ...candidate, score };
    });
    
    return reranked
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private async crossEncoderRerank(
    query: string,
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Placeholder for cross-encoder reranking
    // Will be implemented when we add the cross-encoder model
    console.log('Cross-encoder reranking not yet implemented, using simple reranking');
    return this.rerankResults(query, candidates, limit);
  }

  private async enrichWithContext(
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Enrich results with surrounding context
    const enriched = await Promise.all(
      candidates.slice(0, limit).map(async (candidate) => {
        try {
          // Get adjacent chunks if available
          const adjacentChunks = await this.getAdjacentChunks(candidate.id);
          
          return {
            ...candidate,
            metadata: {
              ...candidate.metadata,
              context: adjacentChunks,
              contextEnriched: true,
            },
          };
        } catch (error) {
          console.error(`Failed to enrich context for ${candidate.id}:`, error);
          return candidate;
        }
      })
    );
    
    return enriched;
  }

  private async semanticExpansion(
    query: string,
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Expand search with semantically related documents
    const expansionQueries = this.generateExpansionQueries(query);
    const expansionResults: SearchResult[] = [];
    
    for (const expQuery of expansionQueries) {
      const results = await this.searchService.search(expQuery, {
        strategy: 'semantic',
        limit: Math.ceil(limit / expansionQueries.length),
      });
      expansionResults.push(...results);
    }
    
    return this.mergeResults(candidates, expansionResults, limit);
  }

  private async scoreAndRank(
    query: string,
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Final scoring and ranking
    const scored = candidates.map(candidate => {
      // Normalize score to 0-1 range
      const normalizedScore = Math.min(1, Math.max(0, candidate.score));
      
      // Apply confidence threshold
      const confidence = this.calculateConfidence(candidate);
      
      return {
        ...candidate,
        score: normalizedScore,
        metadata: {
          ...candidate.metadata,
          confidence,
          finalScore: normalizedScore * confidence,
        },
      };
    });
    
    return scored
      .sort((a, b) => (b.metadata.finalScore || b.score) - (a.metadata.finalScore || a.score))
      .slice(0, limit);
  }

  /**
   * Research profile specific stages
   */
  
  private async exhaustiveKeywordSearch(query: string, limit: number): Promise<SearchResult[]> {
    // Comprehensive keyword search with variations
    const variations = this.generateQueryVariations(query);
    const results: SearchResult[] = [];
    
    for (const variation of variations) {
      const keywords = variation.split(/\s+/).filter(k => k.length > 2);
      const docs = await this.database.searchDocumentsByKeywords(keywords, Math.ceil(limit / variations.length));
      
      results.push(...docs.map(doc => ({
        id: doc.id,
        content: doc.content,
        score: 0.4,
        metadata: doc.metadata || {},
        strategy: 'keyword' as SearchStrategy,
      })));
    }
    
    return this.mergeAndDeduplicate(results);
  }

  private async deepVectorSearch(query: string, limit: number): Promise<SearchResult[]> {
    // Multiple vector searches with query variations
    const variations = this.generateQueryVariations(query);
    const results: SearchResult[] = [];
    
    for (const variation of variations) {
      const { embedding } = await this.embeddingService.generateEmbedding(variation);
      const searchResults = await this.vectorDb.search(embedding, Math.ceil(limit / variations.length));
      results.push(...searchResults);
    }
    
    return this.mergeAndDeduplicate(results);
  }

  private async multiStrategySearch(
    query: string,
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Run all search strategies in parallel
    const strategies: SearchStrategy[] = ['semantic', 'keyword', 'hybrid', 'contextual'];
    
    const promises = strategies.map(strategy =>
      this.searchService.search(query, {
        strategy,
        limit: Math.ceil(limit / strategies.length),
      })
    );
    
    const allResults = await Promise.all(promises);
    const flattened = allResults.flat();
    
    return this.mergeResults(candidates, flattened, limit);
  }

  private async expandDocuments(
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Expand with related documents
    const expanded: SearchResult[] = [...candidates];
    
    for (const candidate of candidates.slice(0, 10)) {
      // Find similar documents
      if (candidate.metadata?.sourceId) {
        const related = await this.database.getDocuments(candidate.metadata.sourceId);
        
        expanded.push(...related.slice(0, 3).map(doc => ({
          id: doc.id,
          content: doc.content,
          score: candidate.score * 0.7, // Lower score for expanded docs
          metadata: { ...doc.metadata, expandedFrom: candidate.id },
          strategy: 'semantic' as SearchStrategy,
        })));
      }
    }
    
    return this.mergeAndDeduplicate(expanded).slice(0, limit);
  }

  private async followCitations(
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Follow references and citations in documents
    // This is a placeholder - would need citation extraction
    return candidates.slice(0, limit);
  }

  private async crossReference(
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Cross-reference with related documents
    // This is a placeholder - would need relationship mapping
    return candidates.slice(0, limit);
  }

  private async deepContextAnalysis(
    candidates: SearchResult[],
    limit: number
  ): Promise<SearchResult[]> {
    // Deep analysis of document context
    const analyzed = await Promise.all(
      candidates.slice(0, limit).map(async (candidate) => {
        const chunks = await this.getAdjacentChunks(candidate.id);
        const contextScore = this.analyzeContext(chunks);
        
        return {
          ...candidate,
          score: candidate.score * (1 + contextScore * 0.2),
          metadata: {
            ...candidate.metadata,
            contextScore,
            deepAnalysis: true,
          },
        };
      })
    );
    
    return analyzed.sort((a, b) => b.score - a.score);
  }

  private qualityFilter(
    candidates: SearchResult[],
    limit: number
  ): SearchResult[] {
    // Filter based on quality metrics
    return candidates
      .filter(c => {
        // Filter out low-quality results
        if (c.score < 0.2) return false;
        if (c.content.length < 50) return false;
        if (c.metadata?.confidence && c.metadata.confidence < 0.3) return false;
        return true;
      })
      .slice(0, limit);
  }

  /**
   * Helper methods
   */
  
  private async getAdjacentChunks(documentId: string): Promise<string[]> {
    // Get surrounding chunks for context
    try {
      const docs = await this.database.getDocuments(documentId);
      return docs.map(d => d.content);
    } catch {
      return [];
    }
  }

  private generateQueryVariations(query: string): string[] {
    const variations = [query];
    
    // Add singular/plural variations
    const words = query.split(/\s+/);
    if (words.length <= 3) {
      // Simple variations for short queries
      variations.push(words.map(w => w.endsWith('s') ? w.slice(0, -1) : w + 's').join(' '));
    }
    
    // Add synonym variations (simplified)
    const synonymMap: Record<string, string[]> = {
      'function': ['method', 'procedure', 'func'],
      'variable': ['var', 'const', 'let'],
      'class': ['struct', 'type', 'interface'],
      'error': ['exception', 'bug', 'issue'],
    };
    
    for (const [word, synonyms] of Object.entries(synonymMap)) {
      if (query.toLowerCase().includes(word)) {
        for (const synonym of synonyms) {
          variations.push(query.toLowerCase().replace(word, synonym));
        }
      }
    }
    
    return [...new Set(variations)].slice(0, 5);
  }

  private generateExpansionQueries(query: string): string[] {
    // Generate semantically related queries
    const expansions = [query];
    
    // Add question variations
    if (!query.includes('?')) {
      expansions.push(`What is ${query}?`);
      expansions.push(`How to ${query}?`);
    }
    
    // Add context variations
    expansions.push(`${query} example`);
    expansions.push(`${query} implementation`);
    
    return expansions.slice(0, 3);
  }

  private mergeResults(
    existing: SearchResult[],
    newResults: SearchResult[],
    limit: number
  ): SearchResult[] {
    const merged = [...existing];
    const seen = new Set(existing.map(e => e.id));
    
    for (const result of newResults) {
      if (!seen.has(result.id)) {
        merged.push(result);
        seen.add(result.id);
      }
    }
    
    return merged
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private calculateConfidence(result: SearchResult): number {
    let confidence = result.score;
    
    // Adjust based on strategy
    if (result.strategy === 'contextual') confidence *= 1.1;
    if (result.strategy === 'hybrid') confidence *= 1.05;
    
    // Adjust based on metadata
    if (result.metadata?.contextEnriched) confidence *= 1.1;
    if (result.metadata?.hasCode) confidence *= 1.05;
    
    return Math.min(1, confidence);
  }

  private calculateAverageConfidence(results: SearchResult[]): number {
    if (results.length === 0) return 0;
    
    const totalConfidence = results.reduce((sum, r) => sum + this.calculateConfidence(r), 0);
    return totalConfidence / results.length;
  }

  private analyzeContext(chunks: string[]): number {
    // Simple context analysis
    if (chunks.length === 0) return 0;
    
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const avgLength = totalLength / chunks.length;
    
    // Score based on context richness
    if (avgLength > 500) return 0.8;
    if (avgLength > 200) return 0.6;
    return 0.4;
  }

  private shouldTerminateEarly(
    candidates: SearchResult[],
    targetCount: number,
    minConfidence: number
  ): boolean {
    // Check if we have enough high-quality results
    const highQualityCount = candidates.filter(c => c.score >= minConfidence * 1.5).length;
    return highQualityCount >= targetCount * 2;
  }

  private createEmptyMetrics(): PipelineMetrics {
    return {
      totalTime: 0,
      stages: [],
      cacheHitRate: 0,
      finalResultCount: 0,
      averageConfidence: 0,
    };
  }

  private finalizeResults(
    candidates: SearchResult[],
    limit: number,
    minConfidence: number
  ): SearchResult[] {
    return candidates
      .filter(c => c.score >= minConfidence)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private logPipelineMetrics(): void {
    console.log('Pipeline Metrics:');
    console.log(`Total Time: ${this.metrics.totalTime}ms`);
    console.log(`Cache Hit Rate: ${(this.metrics.cacheHitRate * 100).toFixed(1)}%`);
    console.log(`Final Results: ${this.metrics.finalResultCount}`);
    console.log(`Average Confidence: ${this.metrics.averageConfidence.toFixed(3)}`);
    
    console.log('Stage Performance:');
    for (const stage of this.metrics.stages) {
      console.log(`  ${stage.stage}: ${stage.processingTime}ms, ${stage.candidateCount} candidates, confidence: ${stage.confidence.toFixed(3)}`);
    }
  }

  /**
   * Get current pipeline metrics
   */
  getMetrics(): PipelineMetrics {
    return { ...this.metrics };
  }
}
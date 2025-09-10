import { DatabaseService } from './database';
import { VectorDatabaseService } from './vectorDatabase';
import { EmbeddingService } from './embedding';
import natural from 'natural';

export type SearchStrategy = 'semantic' | 'keyword' | 'hybrid' | 'contextual';

export interface SearchOptions {
  strategy?: SearchStrategy;
  limit?: number;
  minScore?: number;
  rerank?: boolean;
  contextEnhanced?: boolean;
  filters?: {
    sourceType?: string;
    language?: string;
    dateRange?: { start: Date; end: Date };
  };
}

export interface SearchResult {
  id: string;
  content: string;
  score: number;
  metadata: any;
  strategy: SearchStrategy;
  explanation?: string;
}

export class AdvancedSearchService {
  private database: DatabaseService;
  private vectorDb: VectorDatabaseService;
  private embedding: EmbeddingService;
  private tfidf: natural.TfIdf;
  private tokenizer: natural.WordTokenizer;

  constructor(
    database: DatabaseService,
    vectorDb: VectorDatabaseService,
    embedding: EmbeddingService
  ) {
    this.database = database;
    this.vectorDb = vectorDb;
    this.embedding = embedding;
    this.tfidf = new natural.TfIdf();
    this.tokenizer = new natural.WordTokenizer();
  }

  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const {
      strategy = 'hybrid',
      limit = 10,
      minScore = 0.3,
      rerank = true,
      contextEnhanced = false,
      filters = {}
    } = options;

    let results: SearchResult[] = [];

    // Apply the selected search strategy
    switch (strategy) {
      case 'semantic':
        results = await this.semanticSearch(query, limit * 2, filters);
        break;
      case 'keyword':
        results = await this.keywordSearch(query, limit * 2, filters);
        break;
      case 'hybrid':
        results = await this.hybridSearch(query, limit * 2, filters);
        break;
      case 'contextual':
        results = await this.contextualSearch(query, limit * 2, filters);
        break;
    }

    // Filter by minimum score
    results = results.filter(r => r.score >= minScore);

    // Apply reranking if enabled
    if (rerank && results.length > 0) {
      results = await this.rerankResults(query, results);
    }

    // Return top results
    return results.slice(0, limit);
  }

  private async semanticSearch(
    query: string,
    limit: number,
    filters: any
  ): Promise<SearchResult[]> {
    // Generate query embedding
    const { embedding } = await this.embedding.generateEmbedding(query);
    
    // Perform vector search
    const vectorResults = await this.vectorDb.search(embedding, limit);
    
    // Apply filters and format results
    return vectorResults.map(result => ({
      id: result.id,
      content: result.content,
      score: result.score,
      metadata: result.metadata,
      strategy: 'semantic' as SearchStrategy,
      explanation: `Semantic similarity score: ${result.score.toFixed(3)}`
    }));
  }

  private async keywordSearch(
    query: string,
    limit: number,
    filters: any
  ): Promise<SearchResult[]> {
    // Tokenize query
    const queryTokens = this.tokenizer.tokenize(query.toLowerCase()) || [];
    
    // For now, use a simple document search since searchDocumentsByKeywords doesn't exist in base DatabaseService
    // This will be replaced when EnhancedDatabaseService is used
    const allDocs = await this.database.getDocuments('');
    const documents = allDocs
      .filter(doc => {
        const content = doc.content.toLowerCase();
        return queryTokens.some(token => content.includes(token));
      })
      .slice(0, limit);
    
    // Calculate TF-IDF scores
    const results: SearchResult[] = [];
    for (const doc of documents) {
      const contentTokens = this.tokenizer.tokenize(doc.content.toLowerCase()) || [];
      const score = this.calculateTfIdfScore(queryTokens, contentTokens);
      
      results.push({
        id: doc.id,
        content: doc.content,
        score,
        metadata: doc.metadata,
        strategy: 'keyword' as SearchStrategy,
        explanation: `Keyword match score: ${score.toFixed(3)}`
      });
    }
    
    // Sort by score
    return results.sort((a, b) => b.score - a.score);
  }

  private async hybridSearch(
    query: string,
    limit: number,
    filters: any
  ): Promise<SearchResult[]> {
    // Run both searches in parallel
    const [semanticResults, keywordResults] = await Promise.all([
      this.semanticSearch(query, limit, filters),
      this.keywordSearch(query, limit, filters)
    ]);
    
    // Combine and normalize scores
    const combinedResults = new Map<string, SearchResult>();
    
    // Add semantic results with weight
    for (const result of semanticResults) {
      combinedResults.set(result.id, {
        ...result,
        score: result.score * 0.7, // Semantic weight
        strategy: 'hybrid' as SearchStrategy,
        explanation: `Hybrid (semantic: ${result.score.toFixed(3)})`
      });
    }
    
    // Merge keyword results
    for (const result of keywordResults) {
      const existing = combinedResults.get(result.id);
      if (existing) {
        // Combine scores
        existing.score += result.score * 0.3; // Keyword weight
        existing.explanation = `Hybrid (semantic: ${(existing.score / 0.7).toFixed(3)}, keyword: ${result.score.toFixed(3)})`;
      } else {
        combinedResults.set(result.id, {
          ...result,
          score: result.score * 0.3,
          strategy: 'hybrid' as SearchStrategy,
          explanation: `Hybrid (keyword: ${result.score.toFixed(3)})`
        });
      }
    }
    
    // Sort by combined score
    return Array.from(combinedResults.values())
      .sort((a, b) => b.score - a.score);
  }

  private async contextualSearch(
    query: string,
    limit: number,
    filters: any
  ): Promise<SearchResult[]> {
    // Enhance query with context
    const enhancedQuery = await this.enhanceQueryWithContext(query);
    
    // Perform hybrid search with enhanced query
    const results = await this.hybridSearch(enhancedQuery, limit, filters);
    
    // Update strategy and explanation
    return results.map(r => ({
      ...r,
      strategy: 'contextual' as SearchStrategy,
      explanation: `Contextual search: ${r.explanation}`
    }));
  }

  private async enhanceQueryWithContext(query: string): Promise<string> {
    // Extract key entities and concepts
    const tokens = this.tokenizer.tokenize(query) || [];
    const stems = tokens.map(t => natural.PorterStemmer.stem(t));
    
    // Add synonyms and related terms
    const enhanced = [...tokens];
    for (const token of tokens) {
      // Simple synonym expansion (in production, use a proper synonym database)
      if (token === 'function') enhanced.push('method', 'procedure', 'fn');
      if (token === 'variable') enhanced.push('var', 'const', 'let');
      if (token === 'class') enhanced.push('struct', 'type', 'interface');
    }
    
    return enhanced.join(' ');
  }

  private async rerankResults(
    query: string,
    results: SearchResult[]
  ): Promise<SearchResult[]> {
    // Simple reranking based on multiple factors
    const reranked = results.map(result => {
      let adjustedScore = result.score;
      
      // Boost recent documents
      if (result.metadata?.created_at) {
        const age = Date.now() - new Date(result.metadata.created_at).getTime();
        const ageInDays = age / (1000 * 60 * 60 * 24);
        const recencyBoost = Math.max(0, 1 - ageInDays / 365);
        adjustedScore *= (1 + recencyBoost * 0.1);
      }
      
      // Boost documents with code examples
      if (result.metadata?.hasCode) {
        adjustedScore *= 1.2;
      }
      
      // Boost exact matches
      if (result.content.toLowerCase().includes(query.toLowerCase())) {
        adjustedScore *= 1.3;
      }
      
      // Length penalty for very short or very long documents
      const idealLength = 500;
      const lengthRatio = result.content.length / idealLength;
      if (lengthRatio < 0.2 || lengthRatio > 5) {
        adjustedScore *= 0.9;
      }
      
      return {
        ...result,
        score: adjustedScore,
        explanation: `${result.explanation} (reranked: ${adjustedScore.toFixed(3)})`
      };
    });
    
    return reranked.sort((a, b) => b.score - a.score);
  }

  private calculateTfIdfScore(queryTokens: string[], contentTokens: string[]): number {
    // Calculate term frequency
    const termFreq = new Map<string, number>();
    for (const token of contentTokens) {
      termFreq.set(token, (termFreq.get(token) || 0) + 1);
    }
    
    // Calculate score
    let score = 0;
    for (const queryToken of queryTokens) {
      const tf = (termFreq.get(queryToken) || 0) / contentTokens.length;
      // Simplified IDF (in production, calculate from corpus)
      const idf = Math.log(10000 / (1 + (termFreq.get(queryToken) || 0)));
      score += tf * idf;
    }
    
    return Math.min(1, score / queryTokens.length);
  }

  async buildSearchIndex() {
    // Build TF-IDF index for keyword search
    // Get all sources and their documents
    const sources = await this.database.getSources();
    const documents = [];
    for (const source of sources) {
      const sourceDocs = await this.database.getDocuments(source.id);
      documents.push(...sourceDocs);
    }
    
    for (const doc of documents) {
      this.tfidf.addDocument(doc.content);
    }
    
    console.log(`Built search index with ${documents.length} documents`);
  }

  async updateSearchIndex(documentId: string, content: string) {
    // Update TF-IDF index
    this.tfidf.addDocument(content);
  }
}
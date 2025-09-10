import { Ollama } from 'ollama';
import { EmbeddingService } from './embedding';
import { AdvancedCacheService } from './advancedCache';

/**
 * LLM-Enhanced Contextual Embedding Service
 * Uses LLMs to understand context and generate enriched embeddings
 * for improved semantic search accuracy.
 */

export interface ContextualEmbeddingConfig {
  llmProvider?: 'ollama' | 'openai';
  llmModel?: string;
  maxContextLength?: number;
  enhancementStrategy?: 'expand' | 'summarize' | 'hybrid';
  cacheEnhanced?: boolean;
}

export interface DocumentContext {
  previousQueries?: string[];
  documentType?: string;
  userIntent?: string;
  relatedDocuments?: string[];
  metadata?: Record<string, any>;
}

export interface EnhancedEmbedding {
  embedding: number[];
  originalText: string;
  enhancedText: string;
  context: DocumentContext;
  confidence: number;
  model: string;
}

export class ContextualEmbeddingService {
  private embeddingService: EmbeddingService;
  private cacheService: AdvancedCacheService;
  private ollama: Ollama | null = null;
  private openaiApiKey: string | null = null;
  private config: ContextualEmbeddingConfig;
  private llmAvailable: boolean = false;

  constructor(
    embeddingService: EmbeddingService,
    cacheService: AdvancedCacheService,
    config: ContextualEmbeddingConfig = {}
  ) {
    this.embeddingService = embeddingService;
    this.cacheService = cacheService;
    
    this.config = {
      llmProvider: config.llmProvider || 'ollama',
      llmModel: config.llmModel || 'llama2',
      maxContextLength: config.maxContextLength || 2000,
      enhancementStrategy: config.enhancementStrategy || 'hybrid',
      cacheEnhanced: config.cacheEnhanced !== false,
    };
  }

  /**
   * Initialize the LLM connection
   */
  async initialize(): Promise<void> {
    if (this.config.llmProvider === 'ollama') {
      try {
        this.ollama = new Ollama({ host: 'http://localhost:11434' });
        // Test connection
        await this.ollama.list();
        this.llmAvailable = true;
        console.log('Connected to Ollama for contextual enhancement');
      } catch (error) {
        console.warn('Ollama not available for contextual enhancement:', error);
        this.llmAvailable = false;
      }
    } else if (this.config.llmProvider === 'openai' && this.openaiApiKey) {
      this.llmAvailable = true;
      console.log('Using OpenAI for contextual enhancement');
    } else {
      this.llmAvailable = false;
      console.warn('No LLM available for contextual enhancement');
    }
  }

  /**
   * Set OpenAI API key
   */
  setOpenAIKey(apiKey: string): void {
    this.openaiApiKey = apiKey;
    if (this.config.llmProvider === 'openai') {
      this.llmAvailable = true;
    }
  }

  /**
   * Generate contextually enhanced embedding
   */
  async generateContextualEmbedding(
    text: string,
    context: DocumentContext = {}
  ): Promise<EnhancedEmbedding> {
    const startTime = Date.now();
    
    // Check cache first if enabled
    if (this.config.cacheEnhanced) {
      const cacheKey = this.generateCacheKey(text, context);
      const cached = await this.cacheService.getCachedOrCompute(
        cacheKey,
        async () => this.computeContextualEmbedding(text, context),
        { ttl: 24 * 60 * 60 * 1000, persistToDisk: true }
      );
      
      if (cached) return cached;
    }
    
    // Compute new contextual embedding
    return await this.computeContextualEmbedding(text, context);
  }

  /**
   * Compute the actual contextual embedding
   */
  private async computeContextualEmbedding(
    text: string,
    context: DocumentContext
  ): Promise<EnhancedEmbedding> {
    let enhancedText = text;
    let confidence = 1.0;
    
    // Enhance text with LLM if available
    if (this.llmAvailable) {
      try {
        enhancedText = await this.enhanceWithContext(text, context);
        confidence = this.calculateConfidence(text, enhancedText, context);
      } catch (error) {
        console.warn('Failed to enhance text with LLM:', error);
        // Fall back to original text
        enhancedText = text;
        confidence = 0.5;
      }
    } else {
      // Simple enhancement without LLM
      enhancedText = this.simpleEnhancement(text, context);
      confidence = 0.7;
    }
    
    // Generate embeddings for both original and enhanced text
    const [originalEmbedding, enhancedEmbedding] = await Promise.all([
      this.embeddingService.generateEmbedding(text),
      this.embeddingService.generateEmbedding(enhancedText),
    ]);
    
    // Combine embeddings with weighted average
    const combinedEmbedding = this.combineEmbeddings(
      originalEmbedding.embedding,
      enhancedEmbedding.embedding,
      confidence
    );
    
    return {
      embedding: combinedEmbedding,
      originalText: text,
      enhancedText,
      context,
      confidence,
      model: `contextual-${this.config.llmProvider}-${enhancedEmbedding.model}`,
    };
  }

  /**
   * Enhance text using LLM understanding
   */
  private async enhanceWithContext(
    text: string,
    context: DocumentContext
  ): Promise<string> {
    const strategy = this.config.enhancementStrategy;
    
    switch (strategy) {
      case 'expand':
        return await this.expandWithContext(text, context);
      case 'summarize':
        return await this.summarizeWithContext(text, context);
      case 'hybrid':
      default:
        return await this.hybridEnhancement(text, context);
    }
  }

  /**
   * Expand text with additional context
   */
  private async expandWithContext(
    text: string,
    context: DocumentContext
  ): Promise<string> {
    const prompt = this.buildExpansionPrompt(text, context);
    const expansion = await this.callLLM(prompt);
    
    // Combine original text with expansion
    return `${text}\n\nExpanded context: ${expansion}`;
  }

  /**
   * Summarize text with context awareness
   */
  private async summarizeWithContext(
    text: string,
    context: DocumentContext
  ): Promise<string> {
    const prompt = this.buildSummarizationPrompt(text, context);
    const summary = await this.callLLM(prompt);
    
    // Return summary with key terms from original
    const keyTerms = this.extractKeyTerms(text);
    return `${summary}\n\nKey terms: ${keyTerms.join(', ')}`;
  }

  /**
   * Hybrid enhancement combining expansion and summarization
   */
  private async hybridEnhancement(
    text: string,
    context: DocumentContext
  ): Promise<string> {
    const prompt = this.buildHybridPrompt(text, context);
    const enhanced = await this.callLLM(prompt);
    
    return enhanced;
  }

  /**
   * Build expansion prompt for LLM
   */
  private buildExpansionPrompt(text: string, context: DocumentContext): string {
    let prompt = `Given the following text, expand it with relevant context and related concepts that would help in semantic search:\n\n`;
    prompt += `Text: ${text}\n\n`;
    
    if (context.documentType) {
      prompt += `Document Type: ${context.documentType}\n`;
    }
    
    if (context.userIntent) {
      prompt += `User Intent: ${context.userIntent}\n`;
    }
    
    if (context.previousQueries && context.previousQueries.length > 0) {
      prompt += `Previous Queries: ${context.previousQueries.join(', ')}\n`;
    }
    
    prompt += `\nProvide an expanded version that includes:\n`;
    prompt += `1. Related concepts and synonyms\n`;
    prompt += `2. Common use cases or applications\n`;
    prompt += `3. Technical details if applicable\n`;
    prompt += `4. Keywords that users might search for\n`;
    prompt += `\nExpanded text:`;
    
    return prompt;
  }

  /**
   * Build summarization prompt for LLM
   */
  private buildSummarizationPrompt(text: string, context: DocumentContext): string {
    let prompt = `Summarize the following text while preserving key searchable terms:\n\n`;
    prompt += `Text: ${text}\n\n`;
    
    if (context.documentType) {
      prompt += `Document Type: ${context.documentType}\n`;
    }
    
    prompt += `\nProvide a concise summary that:\n`;
    prompt += `1. Captures the main concepts\n`;
    prompt += `2. Includes important technical terms\n`;
    prompt += `3. Maintains searchability\n`;
    prompt += `\nSummary:`;
    
    return prompt;
  }

  /**
   * Build hybrid prompt for LLM
   */
  private buildHybridPrompt(text: string, context: DocumentContext): string {
    let prompt = `Enhance the following text for improved semantic search by adding context and clarifying concepts:\n\n`;
    prompt += `Original text: ${text}\n\n`;
    
    if (context.documentType) {
      prompt += `Document Type: ${context.documentType}\n`;
    }
    
    if (context.userIntent) {
      prompt += `User Intent: ${context.userIntent}\n`;
    }
    
    if (context.metadata) {
      prompt += `Additional Context: ${JSON.stringify(context.metadata)}\n`;
    }
    
    prompt += `\nEnhance the text by:\n`;
    prompt += `1. Adding relevant synonyms and related terms\n`;
    prompt += `2. Clarifying technical concepts\n`;
    prompt += `3. Including common search keywords\n`;
    prompt += `4. Maintaining the original meaning\n`;
    prompt += `\nKeep the enhancement concise (max 200 words).\n`;
    prompt += `\nEnhanced text:`;
    
    return prompt;
  }

  /**
   * Call the LLM with a prompt
   */
  private async callLLM(prompt: string): Promise<string> {
    // Truncate prompt if too long
    const truncatedPrompt = this.truncatePrompt(prompt, this.config.maxContextLength!);
    
    try {
      if (this.config.llmProvider === 'ollama' && this.ollama) {
        const response = await this.ollama.generate({
          model: this.config.llmModel!,
          prompt: truncatedPrompt,
          options: {
            temperature: 0.3, // Lower temperature for more consistent output
            top_p: 0.9,
            max_tokens: 300,
          },
        });
        
        return response.response;
        
      } else if (this.config.llmProvider === 'openai' && this.openaiApiKey) {
        // OpenAI implementation would go here
        // Using axios to call OpenAI API
        throw new Error('OpenAI implementation not yet complete');
      }
      
      throw new Error('No LLM available');
      
    } catch (error) {
      console.error('LLM call failed:', error);
      throw error;
    }
  }

  /**
   * Simple enhancement without LLM
   */
  private simpleEnhancement(text: string, context: DocumentContext): string {
    let enhanced = text;
    
    // Add document type context
    if (context.documentType) {
      enhanced = `[${context.documentType}] ${enhanced}`;
    }
    
    // Add user intent
    if (context.userIntent) {
      enhanced += ` (Intent: ${context.userIntent})`;
    }
    
    // Add key metadata
    if (context.metadata) {
      const metaStr = Object.entries(context.metadata)
        .filter(([_, v]) => v && typeof v === 'string')
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      
      if (metaStr) {
        enhanced += ` [${metaStr}]`;
      }
    }
    
    // Expand with simple synonyms
    enhanced = this.addSimpleSynonyms(enhanced);
    
    return enhanced;
  }

  /**
   * Add simple synonyms to text
   */
  private addSimpleSynonyms(text: string): string {
    const synonymMap: Record<string, string[]> = {
      'function': ['method', 'procedure', 'func', 'routine'],
      'variable': ['var', 'const', 'let', 'parameter', 'argument'],
      'class': ['struct', 'type', 'interface', 'object'],
      'error': ['exception', 'bug', 'issue', 'fault', 'problem'],
      'create': ['make', 'build', 'generate', 'construct', 'initialize'],
      'delete': ['remove', 'destroy', 'drop', 'clear', 'erase'],
      'update': ['modify', 'change', 'alter', 'edit', 'revise'],
      'search': ['find', 'query', 'lookup', 'locate', 'discover'],
    };
    
    let enhanced = text;
    const addedSynonyms: string[] = [];
    
    for (const [word, synonyms] of Object.entries(synonymMap)) {
      if (text.toLowerCase().includes(word)) {
        // Add first 2 synonyms
        addedSynonyms.push(...synonyms.slice(0, 2));
      }
    }
    
    if (addedSynonyms.length > 0) {
      enhanced += ` (related: ${addedSynonyms.join(', ')})`;
    }
    
    return enhanced;
  }

  /**
   * Extract key terms from text
   */
  private extractKeyTerms(text: string): string[] {
    // Simple extraction of important words
    const words = text.split(/\s+/);
    const keyTerms: string[] = [];
    
    for (const word of words) {
      // Keep technical terms (CamelCase, snake_case, etc.)
      if (/[A-Z]/.test(word) || word.includes('_') || word.includes('-')) {
        keyTerms.push(word);
      }
      // Keep longer words (likely to be important)
      else if (word.length > 7) {
        keyTerms.push(word);
      }
    }
    
    return [...new Set(keyTerms)].slice(0, 10);
  }

  /**
   * Combine original and enhanced embeddings
   */
  private combineEmbeddings(
    original: number[],
    enhanced: number[],
    confidence: number
  ): number[] {
    // Weight based on confidence: higher confidence = more weight to enhanced
    const enhancedWeight = 0.3 + (confidence * 0.4); // 0.3 to 0.7
    const originalWeight = 1 - enhancedWeight;
    
    const combined: number[] = [];
    for (let i = 0; i < original.length; i++) {
      combined.push(
        original[i] * originalWeight + 
        (enhanced[i] || 0) * enhancedWeight
      );
    }
    
    // Normalize the combined embedding
    return this.normalizeEmbedding(combined);
  }

  /**
   * Normalize embedding vector
   */
  private normalizeEmbedding(embedding: number[]): number[] {
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );
    
    if (magnitude === 0) return embedding;
    
    return embedding.map(val => val / magnitude);
  }

  /**
   * Calculate confidence score for enhancement
   */
  private calculateConfidence(
    original: string,
    enhanced: string,
    context: DocumentContext
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence if enhanced text is longer (more context added)
    const lengthRatio = enhanced.length / original.length;
    if (lengthRatio > 1.2 && lengthRatio < 3) {
      confidence += 0.2;
    }
    
    // Higher confidence if context is rich
    if (context.documentType) confidence += 0.1;
    if (context.userIntent) confidence += 0.1;
    if (context.previousQueries && context.previousQueries.length > 0) confidence += 0.1;
    
    // Cap at 1.0
    return Math.min(1.0, confidence);
  }

  /**
   * Truncate prompt to maximum length
   */
  private truncatePrompt(prompt: string, maxLength: number): string {
    if (prompt.length <= maxLength) return prompt;
    
    // Try to truncate at a sentence boundary
    const truncated = prompt.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastNewline = truncated.lastIndexOf('\n');
    
    const cutPoint = Math.max(lastPeriod, lastNewline);
    if (cutPoint > maxLength * 0.8) {
      return truncated.substring(0, cutPoint + 1);
    }
    
    return truncated + '...';
  }

  /**
   * Generate cache key for contextual embedding
   */
  private generateCacheKey(text: string, context: DocumentContext): string {
    const contextStr = JSON.stringify(context);
    return `contextual:${text.substring(0, 100)}:${contextStr.substring(0, 50)}`;
  }

  /**
   * Batch process contextual embeddings
   */
  async generateBatchContextual(
    texts: string[],
    contexts: DocumentContext[] = []
  ): Promise<EnhancedEmbedding[]> {
    const results: EnhancedEmbedding[] = [];
    
    // Process in parallel with concurrency limit
    const batchSize = 5;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchContexts = contexts.slice(i, i + batchSize);
      
      const promises = batch.map((text, idx) =>
        this.generateContextualEmbedding(text, batchContexts[idx] || {})
      );
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
      
      console.log(`Processed ${Math.min(i + batchSize, texts.length)}/${texts.length} contextual embeddings`);
    }
    
    return results;
  }

  /**
   * Analyze context quality
   */
  analyzeContextQuality(context: DocumentContext): {
    score: number;
    missing: string[];
    suggestions: string[];
  } {
    const missing: string[] = [];
    const suggestions: string[] = [];
    let score = 0;
    
    // Check for important context elements
    if (!context.documentType) {
      missing.push('documentType');
      suggestions.push('Add document type (e.g., "code", "documentation", "tutorial")');
    } else {
      score += 0.25;
    }
    
    if (!context.userIntent) {
      missing.push('userIntent');
      suggestions.push('Specify user intent (e.g., "learn", "debug", "implement")');
    } else {
      score += 0.25;
    }
    
    if (!context.previousQueries || context.previousQueries.length === 0) {
      missing.push('previousQueries');
      suggestions.push('Include search history for better context');
    } else {
      score += 0.25;
    }
    
    if (!context.metadata || Object.keys(context.metadata).length === 0) {
      missing.push('metadata');
      suggestions.push('Add metadata like language, framework, or domain');
    } else {
      score += 0.25;
    }
    
    return { score, missing, suggestions };
  }

  /**
   * Get service statistics
   */
  getStatistics(): {
    llmAvailable: boolean;
    provider: string;
    model: string;
    enhancementStrategy: string;
    cacheEnabled: boolean;
  } {
    return {
      llmAvailable: this.llmAvailable,
      provider: this.config.llmProvider!,
      model: this.config.llmModel!,
      enhancementStrategy: this.config.enhancementStrategy!,
      cacheEnabled: this.config.cacheEnhanced!,
    };
  }
}
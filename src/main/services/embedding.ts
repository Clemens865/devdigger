import { Ollama } from 'ollama';
import axios from 'axios';

export class EmbeddingService {
  private ollama: Ollama | null = null;
  private useOllama: boolean = false;
  private openaiApiKey: string | null = null;

  async initialize() {
    // Try to connect to local Ollama first
    try {
      this.ollama = new Ollama({ host: 'http://localhost:11434' });
      // Test connection
      await this.ollama.list();
      this.useOllama = true;
      console.log('Connected to local Ollama for embeddings');
    } catch (error) {
      console.log('Ollama not available, will use OpenAI if configured');
      this.useOllama = false;
    }
  }

  setOpenAIKey(apiKey: string) {
    this.openaiApiKey = apiKey;
  }

  async generateEmbedding(text: string): Promise<{ embedding: number[], model: string }> {
    if (this.useOllama && this.ollama) {
      const embedding = await this.generateOllamaEmbedding(text);
      return { embedding, model: 'nomic-embed-text' };
    } else if (this.openaiApiKey) {
      const embedding = await this.generateOpenAIEmbedding(text);
      return { embedding, model: 'text-embedding-ada-002' };
    } else {
      // Fallback to a simple hash-based embedding for MVP
      const embedding = await this.generateSimpleEmbedding(text);
      return { embedding, model: 'simple-fallback' };
    }
  }

  async generateBatch(texts: string[]): Promise<{ embeddings: number[][], model: string }> {
    const results = await Promise.all(
      texts.map(text => this.generateEmbedding(text))
    );
    return { 
      embeddings: results.map(r => r.embedding), 
      model: results[0]?.model || 'simple-fallback' 
    };
  }

  private async generateOllamaEmbedding(text: string): Promise<number[]> {
    if (!this.ollama) throw new Error('Ollama not initialized');

    try {
      const response = await this.ollama.embeddings({
        model: 'nomic-embed-text', // Or any other embedding model
        prompt: text
      });
      return response.embedding;
    } catch (error) {
      console.error('Ollama embedding failed:', error);
      // Fallback to simple embedding
      return this.generateSimpleEmbedding(text);
    }
  }

  private async generateOpenAIEmbedding(text: string): Promise<number[]> {
    if (!this.openaiApiKey) throw new Error('OpenAI API key not set');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: 'text-embedding-ada-002',
          input: text
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('OpenAI embedding failed:', error);
      // Fallback to simple embedding
      return this.generateSimpleEmbedding(text);
    }
  }

  // Simple fallback embedding using character frequencies and hashing
  private generateSimpleEmbedding(text: string, dimensions: number = 384): Promise<number[]> {
    const embedding = new Array(dimensions).fill(0);
    
    // Simple but deterministic embedding based on text content
    const words = text.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const index = (charCode * (i + 1) * (j + 1)) % dimensions;
        embedding[index] += 1 / words.length;
      }
    }
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }
    
    return Promise.resolve(embedding);
  }

  // Calculate cosine similarity between two embeddings
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Find most similar embeddings
  findSimilar(
    queryEmbedding: number[],
    embeddings: Array<{ id: string; embedding: number[] }>,
    topK: number = 10,
    threshold: number = 0.7
  ): Array<{ id: string; similarity: number }> {
    const similarities = embeddings.map(item => ({
      id: item.id,
      similarity: this.cosineSimilarity(queryEmbedding, item.embedding)
    }));

    return similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}
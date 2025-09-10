import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  database: {
    search: (query: string, options?: any) => 
      ipcRenderer.invoke('db:search', query, options),
    semanticSearch: (embedding: number[], options?: any) => 
      ipcRenderer.invoke('db:semanticSearch', embedding, options),
    getSources: (type?: string) => 
      ipcRenderer.invoke('db:getSources', type),
    getSource: (id: string) => 
      ipcRenderer.invoke('db:getSource', id),
    addSource: (source: any) => 
      ipcRenderer.invoke('db:addSource', source),
    updateSourceStatus: (sourceId: string, status: string) => 
      ipcRenderer.invoke('db:updateSourceStatus', sourceId, status),
    getDocuments: (sourceId: string) => 
      ipcRenderer.invoke('db:getDocuments', sourceId),
    addDocument: (document: any) => 
      ipcRenderer.invoke('db:addDocument', document),
    addDocuments: (documents: any[]) => 
      ipcRenderer.invoke('db:addDocuments', documents),
    getCodeExamples: (sourceId?: string, language?: string) => 
      ipcRenderer.invoke('db:getCodeExamples', sourceId, language),
    addCodeExample: (example: any) => 
      ipcRenderer.invoke('db:addCodeExample', example),
    getCollections: () => 
      ipcRenderer.invoke('db:getCollections'),
    createCollection: (collection: any) => 
      ipcRenderer.invoke('db:createCollection', collection),
    addToCollection: (collectionId: string, itemId: string, itemType: string) => 
      ipcRenderer.invoke('db:addToCollection', collectionId, itemId, itemType),
    getStatistics: () => 
      ipcRenderer.invoke('db:getStatistics'),
    getSetting: (key: string) => 
      ipcRenderer.invoke('db:getSetting', key),
    setSetting: (key: string, value: string) => 
      ipcRenderer.invoke('db:setSetting', key, value)
  },

  // Web scraping operations
  scraper: {
    crawl: (url: string, options?: any) => 
      ipcRenderer.invoke('scraper:crawl', url, options),
    scrapeUrl: (url: string) => 
      ipcRenderer.invoke('scraper:scrapeUrl', url),
    stop: () => 
      ipcRenderer.send('scraper:stop'),
    onProgress: (callback: (data: any) => void) => {
      ipcRenderer.on('crawl:progress', (_, data) => callback(data));
      return () => ipcRenderer.removeAllListeners('crawl:progress');
    }
  },

  // Embedding operations
  embedding: {
    generate: (text: string) => 
      ipcRenderer.invoke('embedding:generate', text),
    generateBatch: (texts: string[]) => 
      ipcRenderer.invoke('embedding:generateBatch', texts)
  },

  // System operations
  system: {
    openExternal: (url: string) => 
      ipcRenderer.invoke('system:openExternal', url),
    getAppVersion: () => 
      ipcRenderer.invoke('system:getAppVersion'),
    getStoragePath: () => 
      ipcRenderer.invoke('system:getStoragePath')
  },

  // Claude integration
  claude: {
    exportToMCP: (data: any) => 
      ipcRenderer.invoke('claude:exportToMCP', data),
    syncWithFlow: (collections: any[]) => 
      ipcRenderer.invoke('claude:syncWithFlow', collections)
  },

  // Settings operations
  settings: {
    updated: () => 
      ipcRenderer.invoke('settings:updated')
  },

  // Enhanced search operations
  search: {
    enhanced: (query: string, options?: {
      profile?: 'fast' | 'balanced' | 'accurate' | 'research';
      limit?: number;
      context?: any;
      rerank?: boolean;
      useCache?: boolean;
    }) => ipcRenderer.invoke('search:enhanced', query, options),
    
    contextual: (query: string, context: any, options?: any) => 
      ipcRenderer.invoke('search:contextual', query, context, options),
    
    configure: (config: any) => 
      ipcRenderer.invoke('search:configure', config),
    
    getConfig: () => 
      ipcRenderer.invoke('search:getConfig'),
    
    getStatistics: () => 
      ipcRenderer.invoke('search:statistics'),
    
    clearCache: () => 
      ipcRenderer.invoke('search:clearCache'),
    
    warmUp: () => 
      ipcRenderer.invoke('search:warmUp'),
    
    onProgress: (callback: (data: any) => void) => {
      ipcRenderer.on('search:progress', (_, data) => callback(data));
      return () => ipcRenderer.removeAllListeners('search:progress');
    },
    
    onComplete: (callback: (data: any) => void) => {
      ipcRenderer.on('search:complete', (_, data) => callback(data));
      return () => ipcRenderer.removeAllListeners('search:complete');
    }
  },

  // Memory management
  memory: {
    getUsage: () => 
      ipcRenderer.invoke('memory:usage'),
    
    cleanup: (aggressive?: boolean) => 
      ipcRenderer.invoke('memory:cleanup', aggressive),
    
    setAutoCleanup: (enabled: boolean, threshold?: number) => 
      ipcRenderer.invoke('memory:autoCleanup', enabled, threshold)
  }
});

// Type definitions for TypeScript
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
  type?: string;
  description?: string;
  tags?: string[];
  item_count?: number;
  size?: string;
  export_path?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface SearchResult {
  id: string;
  content: string;
  source_id: string;
  url: string;
  title: string;
  type?: string;
  score: number;
}

export interface Statistics {
  sources: number;
  documents: number;
  codeExamples: number;
  collections: number;
  embeddedDocuments: number;
  totalSize: string;
}

export interface IElectronAPI {
  database: {
    search: (query: string, options?: {
      limit?: number;
      threshold?: number;
      sourceTypes?: string[];
      searchType?: 'text' | 'semantic';
    }) => Promise<SearchResult[]>;
    semanticSearch: (embedding: number[], options?: {
      limit?: number;
      threshold?: number;
    }) => Promise<SearchResult[]>;
    getSources: (type?: string) => Promise<Source[]>;
    getSource: (id: string) => Promise<Source | null>;
    addSource: (source: Omit<Source, 'id'>) => Promise<Source>;
    updateSourceStatus: (sourceId: string, status: string) => Promise<void>;
    getDocuments: (sourceId: string) => Promise<Document[]>;
    addDocument: (document: {
      sourceId: string;
      content: string;
      chunkIndex: number;
      metadata?: any;
      embedding?: number[];
      embeddingModel?: string;
    }) => Promise<Document>;
    addDocuments: (documents: Array<{
      sourceId: string;
      content: string;
      chunkIndex: number;
      metadata?: any;
      embedding?: number[];
      embeddingModel?: string;
    }>) => Promise<Document[]>;
    getCodeExamples: (sourceId?: string, language?: string) => Promise<CodeExample[]>;
    addCodeExample: (example: {
      documentId: string;
      sourceId: string;
      language: string;
      code: string;
      description?: string;
      tags?: string[];
    }) => Promise<CodeExample>;
    getCollections: () => Promise<Collection[]>;
    createCollection: (collection: {
      name: string;
      type?: string;
      description?: string;
      tags?: string[];
    }) => Promise<Collection>;
    addToCollection: (collectionId: string, itemId: string, itemType: 'source' | 'document' | 'code') => Promise<void>;
    getStatistics: () => Promise<Statistics>;
    getSetting: (key: string) => Promise<string | null>;
    setSetting: (key: string, value: string) => Promise<void>;
  };
  scraper: {
    crawl: (url: string, options?: {
      depth?: number;
      maxPages?: number;
      strategy?: string;
    }) => Promise<void>;
    scrapeUrl: (url: string) => Promise<any>;
    stop: () => void;
    onProgress: (callback: (data: {
      current: number;
      total: number;
      url: string;
      status: string;
    }) => void) => () => void;
  };
  embedding: {
    generate: (text: string) => Promise<number[]>;
    generateBatch: (texts: string[]) => Promise<number[][]>;
  };
  system: {
    openExternal: (url: string) => Promise<void>;
    getAppVersion: () => Promise<string>;
    getStoragePath: () => Promise<string>;
  };
  claude: {
    exportToMCP: (data: any) => Promise<void>;
    syncWithFlow: (collections: any[]) => Promise<void>;
  };
  search: {
    enhanced: (query: string, options?: {
      profile?: 'fast' | 'balanced' | 'accurate' | 'research';
      limit?: number;
      context?: any;
      rerank?: boolean;
      useCache?: boolean;
    }) => Promise<SearchResult[]>;
    contextual: (query: string, context: any, options?: any) => Promise<SearchResult[]>;
    configure: (config: any) => Promise<void>;
    getConfig: () => Promise<any>;
    getStatistics: () => Promise<any>;
    clearCache: () => Promise<void>;
    warmUp: () => Promise<void>;
    onProgress: (callback: (data: any) => void) => () => void;
    onComplete: (callback: (data: any) => void) => () => void;
  };
  memory: {
    getUsage: () => Promise<{
      total: number;
      used: number;
      percentage: number;
      details: any;
    }>;
    cleanup: (aggressive?: boolean) => Promise<void>;
    setAutoCleanup: (enabled: boolean, threshold?: number) => Promise<void>;
  };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
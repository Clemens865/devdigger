import { app, BrowserWindow, ipcMain, shell, Menu, dialog } from 'electron';
import { join } from 'path';
import * as os from 'os';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { DatabaseService } from './services/database';
import { WebScraperService } from './services/webScraper';
import { EmbeddingService } from './services/embedding';
import { VectorDatabaseService } from './services/vectorDatabase';
import { RealtimeServer } from './services/realtimeServer';
import { WorkerManager } from './services/workerManager';
import { createSettingsWindow } from './settingsWindow';
import { DatabaseMaintenanceService } from './services/databaseMaintenance';
import { EnhancedSearchSystem } from './services/enhancedSearchSystem';

let mainWindow: BrowserWindow | null = null;
let database: DatabaseService;
let scraper: WebScraperService;
let embedding: EmbeddingService;
let vectorDb: VectorDatabaseService;
let realtimeServer: RealtimeServer;
let workerManager: WorkerManager;
let enhancedSearchSystem: EnhancedSearchSystem | null = null;

// Helper function to chunk text
function chunkText(text: string, maxChunkSize: number = 4000): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

function createMenu(): void {
  const isMac = process.platform === 'darwin';
  
  const template: any[] = [
    // On macOS, the first menu item is the app menu
    ...(isMac ? [{
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Settings...',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            if (mainWindow) {
              createSettingsWindow(mainWindow);
            }
          }
        },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://github.com/devdigger');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1A1A1A',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// Initialize services
async function initializeServices() {
  database = new DatabaseService();
  await database.initialize();
  
  scraper = new WebScraperService();
  await scraper.initialize();
  
  // CRITICAL: Set up scraper event handlers immediately after initialization
  // This must happen BEFORE any crawling can occur
  setupScraperEventHandlers();
  
  embedding = new EmbeddingService();
  await embedding.initialize();
  
  // Initialize vector database
  vectorDb = new VectorDatabaseService();
  await vectorDb.initialize();
  console.log('Vector database initialized');
  
  // Start realtime server
  realtimeServer = new RealtimeServer(8089);
  await realtimeServer.start();
  console.log('Realtime server started on port 8089');
  
  // Initialize worker manager
  workerManager = new WorkerManager(4);
  await workerManager.initialize();
  console.log('Worker manager initialized with 4 workers');
  
  // Load OpenAI API key from database if exists
  const apiKey = await database.getSetting('openai_api_key');
  if (apiKey) {
    embedding.setOpenAIKey(apiKey);
    console.log('OpenAI API key loaded from settings');
  }
  
  // Initialize Enhanced Search System (with delay for database readiness)
  try {
    console.log('Waiting for database to be fully ready...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    
    enhancedSearchSystem = EnhancedSearchSystem.getInstance(
      database,
      vectorDb,
      embedding,
      { 
        enableCache: true, 
        enableCrossEncoder: true, 
        enableContextualEmbeddings: true,
        openAIKey: apiKey
      }
    );
    await enhancedSearchSystem.initialize();
    console.log('✓ Enhanced search system initialized successfully');
    
    // Warm up the system with a test query for better first search performance
    setTimeout(async () => {
      try {
        await enhancedSearchSystem!.search('test', { limit: 1 });
        console.log('Enhanced search system warmed up');
      } catch (error) {
        console.log('Search system warmup skipped (no documents yet)');
      }
    }, 5000);
    
    // Enable auto-cleanup for memory management
    const totalMemory = os.totalmem();
    const threshold = 80; // 80% memory threshold
    setInterval(async () => {
      const freeMemory = os.freemem();
      const usedPercentage = ((totalMemory - freeMemory) / totalMemory) * 100;
      
      if (usedPercentage > threshold) {
        console.log(`Memory usage ${usedPercentage.toFixed(1)}% exceeds threshold, triggering cleanup`);
        if (enhancedSearchSystem) {
          await enhancedSearchSystem.clearCaches();
        }
        if (global.gc) {
          global.gc();
        }
      }
    }, 60000); // Check every minute
    
  } catch (error) {
    console.error('Failed to initialize enhanced search system:', error);
    console.log('Continuing with fallback search functionality');
  }
}

// IPC Handlers
function setupIpcHandlers() {
  // Database operations
  ipcMain.handle('db:search', async (_, query: string, options?: any) => {
    return database.search(query, options);
  });

  ipcMain.handle('db:semanticSearch', async (_, embedding: number[], options?: any) => {
    return database.semanticSearch(embedding, options);
  });

  // Enhanced Search Handlers
  ipcMain.handle('search:enhanced', async (_, query: string, options?: any) => {
    if (!enhancedSearchSystem) {
      enhancedSearchSystem = EnhancedSearchSystem.getInstance(
        database,
        vectorDb,
        embedding,
        { enableCache: true, enableCrossEncoder: true, enableContextualEmbeddings: true }
      );
      await enhancedSearchSystem.initialize();
    }
    
    // Send progress updates to renderer
    const startTime = Date.now();
    mainWindow?.webContents.send('search:progress', {
      stage: 'initializing',
      progress: 0.1
    });
    
    const results = await enhancedSearchSystem.search(query, options);
    
    // Send completion with metrics
    mainWindow?.webContents.send('search:complete', {
      duration: Date.now() - startTime,
      resultCount: results.length,
      cacheHit: results.some((r: any) => r.fromCache)
    });
    
    return results;
  });

  // Configure search pipeline profile
  ipcMain.handle('search:configure', async (_, config: any) => {
    if (!enhancedSearchSystem) {
      enhancedSearchSystem = EnhancedSearchSystem.getInstance(
        database,
        vectorDb,
        embedding,
        { enableCache: true, enableCrossEncoder: true, enableContextualEmbeddings: true }
      );
      await enhancedSearchSystem.initialize();
    }
    // Store configuration
    if (config.profile) {
      await database.setSetting('search_profile', config.profile);
    }
    if (config.enableReranking !== undefined) {
      await database.setSetting('enable_reranking', config.enableReranking.toString());
    }
    if (config.enableContextual !== undefined) {
      await database.setSetting('enable_contextual', config.enableContextual.toString());
    }
    return { success: true };
  });

  // Get search configuration
  ipcMain.handle('search:getConfig', async () => {
    const profile = await database.getSetting('search_profile') || 'balanced';
    const enableReranking = (await database.getSetting('enable_reranking')) !== 'false';
    const enableContextual = (await database.getSetting('enable_contextual')) !== 'false';
    
    return {
      profile,
      enableReranking,
      enableContextual,
      profiles: ['fast', 'balanced', 'accurate', 'research']
    };
  });

  // Cross-encoder reranking
  ipcMain.handle('search:rerank', async (_, query: string, results: any[]) => {
    if (!enhancedSearchSystem) {
      return results;
    }
    // This would use the cross-encoder service if available
    return results;
  });

  // Contextual search with enhanced embeddings
  ipcMain.handle('search:contextual', async (_, query: string, context?: any) => {
    if (!enhancedSearchSystem) {
      enhancedSearchSystem = EnhancedSearchSystem.getInstance(
        database,
        vectorDb,
        embedding,
        { enableCache: true, enableCrossEncoder: true, enableContextualEmbeddings: true }
      );
      await enhancedSearchSystem.initialize();
    }
    return enhancedSearchSystem.search(query, { ...context, useContextual: true });
  });

  // Get search performance metrics
  ipcMain.handle('search:metrics', async () => {
    if (enhancedSearchSystem) {
      const stats = await enhancedSearchSystem.getStatistics();
      return {
        ...stats,
        memoryUsage: process.memoryUsage(),
        cacheHitRate: stats?.cacheHitRate || 0,
        avgSearchTime: stats?.avgSearchTime || 0
      };
    }
    return null;
  });

  ipcMain.handle('search:statistics', async () => {
    if (enhancedSearchSystem) {
      const stats = await enhancedSearchSystem.getStatistics();
      return {
        ...stats,
        memoryUsage: process.memoryUsage(),
        cacheHitRate: stats?.cacheHitRate || 0,
        avgSearchTime: stats?.avgSearchTime || 0
      };
    }
    return null;
  });

  ipcMain.handle('search:stats', async () => {
    if (enhancedSearchSystem) {
      return enhancedSearchSystem.getStatistics();
    }
    return null;
  });

  ipcMain.handle('search:clearCache', async () => {
    if (enhancedSearchSystem) {
      await enhancedSearchSystem.clearCaches();
    }
  });

  ipcMain.handle('search:rebuildIndex', async () => {
    if (enhancedSearchSystem) {
      await enhancedSearchSystem.rebuildIndices();
    }
  });

  // Warm up models for better performance
  ipcMain.handle('search:warmup', async () => {
    if (!enhancedSearchSystem) {
      enhancedSearchSystem = EnhancedSearchSystem.getInstance(
        database,
        vectorDb,
        embedding,
        { enableCache: true, enableCrossEncoder: true, enableContextualEmbeddings: true }
      );
      await enhancedSearchSystem.initialize();
    }
    // Warm up the models with a dummy query
    await enhancedSearchSystem.search('test', { limit: 1 });
    return { warmedUp: true };
  });

  ipcMain.handle('db:getSources', async (_, type?: string) => {
    return database.getSources(type);
  });

  ipcMain.handle('db:getSource', async (_, id: string) => {
    return database.getSource(id);
  });

  ipcMain.handle('db:addSource', async (_, source: any) => {
    return database.addSource(source);
  });

  ipcMain.handle('db:updateSourceStatus', async (_, sourceId: string, status: string) => {
    return database.updateSourceStatus(sourceId, status);
  });

  ipcMain.handle('db:getDocuments', async (_, sourceId: string) => {
    return database.getDocuments(sourceId);
  });

  ipcMain.handle('db:addDocument', async (_, document: any) => {
    return database.addDocument(document);
  });

  ipcMain.handle('db:addDocuments', async (_, documents: any[]) => {
    return database.addDocuments(documents);
  });

  ipcMain.handle('db:getCodeExamples', async (_, sourceId?: string, language?: string) => {
    return database.getCodeExamples(sourceId, language);
  });

  ipcMain.handle('db:addCodeExample', async (_, example: any) => {
    return database.addCodeExample(example);
  });

  ipcMain.handle('db:getCollections', async () => {
    return database.getCollections();
  });

  ipcMain.handle('db:createCollection', async (_, collection: any) => {
    return database.createCollection(collection);
  });

  ipcMain.handle('db:addToCollection', async (_, collectionId: string, itemId: string, itemType: string) => {
    return database.addToCollection(collectionId, itemId, itemType);
  });

  ipcMain.handle('db:getStatistics', async () => {
    return database.getStatistics();
  });

  ipcMain.handle('db:getSetting', async (_, key: string) => {
    return database.getSetting(key);
  });

  ipcMain.handle('db:setSetting', async (_, key: string, value: string) => {
    return database.setSetting(key, value);
  });

  // Database maintenance operations
  ipcMain.handle('maintenance:getStats', async () => {
    const maintenance = new DatabaseMaintenanceService();
    const stats = maintenance.getDatabaseStats();
    maintenance.close();
    return stats;
  });

  ipcMain.handle('maintenance:findDuplicates', async () => {
    const maintenance = new DatabaseMaintenanceService();
    const result = {
      documents: maintenance.findDuplicateDocuments(),
      sources: maintenance.findDuplicateSources(),
      empty: maintenance.findEmptyDocuments(),
      orphaned: maintenance.findOrphanedDocuments(),
      emptySources: maintenance.findEmptySources()
    };
    maintenance.close();
    return result;
  });

  ipcMain.handle('maintenance:cleanup', async () => {
    const maintenance = new DatabaseMaintenanceService();
    const result = maintenance.performFullCleanup();
    maintenance.close();
    return result;
  });

  ipcMain.handle('maintenance:removeDuplicates', async () => {
    const maintenance = new DatabaseMaintenanceService();
    const result = maintenance.removeDuplicateDocuments();
    maintenance.close();
    return result;
  });

  ipcMain.handle('maintenance:removeEmpty', async () => {
    const maintenance = new DatabaseMaintenanceService();
    const result = maintenance.removeEmptyDocuments();
    maintenance.close();
    return result;
  });

  // Web scraping operations
  ipcMain.handle('scraper:crawl', async (_, url: string, options?: any) => {
    // First, add the source to the database with pending status
    try {
      const existingSource = await database.getSource(url);
      let sourceId: string;
      
      if (!existingSource) {
        const newSource = await database.addSource({
          type: 'website',
          url: url,
          title: url,
          description: '',
          metadata: {},
          crawl_status: 'pending'
        });
        sourceId = newSource.id;
      } else {
        sourceId = existingSource.id;
      }
      
      // Update status to crawling
      await database.updateSourceStatus(sourceId, 'crawling');
      
      // Fix parameter mismatch: convert 'depth' to 'maxDepth'
      const crawlOptions = {
        ...options,
        maxDepth: options.depth || options.maxDepth || 3,
        maxPages: options.maxPages || 100
      };
      // Remove the old parameter to prevent confusion
      if (crawlOptions.depth !== undefined) {
        delete crawlOptions.depth;
      }
      
      console.log('Starting crawl for:', url, 'with options:', crawlOptions);
      
      // Start crawling in background and don't wait for completion
      // The crawl method will emit events as it progresses
      scraper.crawl(url, crawlOptions).catch(error => {
        console.error('Crawl failed:', error);
        database.updateSourceStatus(sourceId, 'failed');
        mainWindow?.webContents.send('crawl:error', error);
      });
      
      // Return immediately to indicate crawl has started
      return { status: 'started', url, sourceId };
    } catch (error) {
      console.error('Failed to initialize crawl:', error);
      throw error;
    }
  });

  ipcMain.handle('scraper:scrapeUrl', async (_, url: string) => {
    return scraper.scrapeUrl(url);
  });

  ipcMain.on('scraper:stop', () => {
    scraper.stopCrawling();
  });

  // Embedding operations
  ipcMain.handle('embedding:generate', async (_, text: string) => {
    return embedding.generateEmbedding(text);
  });

  // Embedding operations
  ipcMain.handle('embedding:generateBatch', async (_, texts: string[]) => {
    return embedding.generateBatch(texts);
  });

  // Memory management handlers
  ipcMain.handle('memory:usage', async () => {
    const memUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    return {
      total: totalMemory,
      used: usedMemory,
      percentage: (usedMemory / totalMemory) * 100,
      details: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers
      }
    };
  });

  ipcMain.handle('memory:cleanup', async (_, aggressive = false) => {
    try {
      // Clear search cache
      if (enhancedSearchSystem) {
        await enhancedSearchSystem.clearCaches();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // If aggressive, also clear vector database cache
      if (aggressive && vectorDb) {
        await vectorDb.clearCache();
      }
      
      console.log('Memory cleanup completed');
    } catch (error) {
      console.error('Memory cleanup error:', error);
      throw error;
    }
  });

  // Auto-cleanup configuration
  let autoCleanupInterval: NodeJS.Timeout | null = null;
  
  ipcMain.handle('memory:autoCleanup', async (_, enabled: boolean, threshold = 80) => {
    if (autoCleanupInterval) {
      clearInterval(autoCleanupInterval);
      autoCleanupInterval = null;
    }
    
    if (enabled) {
      autoCleanupInterval = setInterval(async () => {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedPercentage = ((totalMemory - freeMemory) / totalMemory) * 100;
        
        if (usedPercentage > threshold) {
          console.log(`Memory usage ${usedPercentage.toFixed(1)}% exceeds threshold ${threshold}%, triggering cleanup`);
          if (enhancedSearchSystem) {
            await enhancedSearchSystem.clearCaches();
          }
          
          if (global.gc) {
            global.gc();
          }
        }
      }, 60000); // Check every minute
    }
    
    console.log(`Auto-cleanup ${enabled ? 'enabled' : 'disabled'} with threshold ${threshold}%`);
  });

  // System operations
  ipcMain.handle('system:openExternal', async (_, url: string) => {
    shell.openExternal(url);
  });

  ipcMain.handle('system:getAppVersion', async () => {
    return app.getVersion();
  });

  ipcMain.handle('system:getStoragePath', async () => {
    return app.getPath('userData');
  });

  // Settings update handler
  ipcMain.handle('settings:updated', async () => {
    // Reload API key when settings are updated
    const apiKey = await database.getSetting('openai_api_key');
    if (apiKey) {
      embedding.setOpenAIKey(apiKey);
      console.log('OpenAI API key updated from settings');
    }
    
    const model = await database.getSetting('embedding_model');
    if (model) {
      console.log('Embedding model preference:', model);
    }
  });
}

// Separate function for scraper event handlers - called immediately after scraper initialization
function setupScraperEventHandlers() {
  console.log('Setting up scraper event handlers');
  
  // Progress events
  scraper.on('progress', (data) => {
    mainWindow?.webContents.send('crawl:progress', data);
  });

  // Handle scraped pages and store them
  scraper.on('pageScraped', async (data) => {
    console.log('PageScraped event received for:', data.url);
    try {
      // Add source if not exists
      const source = await database.getSource(data.url);
      let sourceId: string;
      
      if (!source) {
        const newSource = await database.addSource({
          type: 'website',
          url: data.url,
          title: data.content.title,
          description: data.content.metadata.description || '',
          metadata: data.content.metadata,
          crawl_status: 'crawling'
        });
        sourceId = newSource.id;
        console.log('Created new source:', sourceId);
      } else {
        sourceId = source.id;
        console.log('Using existing source:', sourceId);
      }

      // Chunk and store content with larger chunks for better context
      const chunks = chunkText(data.content.text, 4000);
      console.log(`Processing ${chunks.length} chunks for ${data.url}`);
      
      const embeddingResult = await embedding.generateBatch(chunks);
      console.log(`Generated embeddings with model: ${embeddingResult.model}`);
      
      const documents = chunks.map((chunk, index) => ({
        sourceId,
        content: chunk,
        chunkIndex: index,
        embedding: embeddingResult.embeddings[index],
        embeddingModel: embeddingResult.model,
        metadata: {
          title: data.content.title,
          depth: data.depth
        }
      }));

      await database.addDocuments(documents);
      console.log(`Saved ${documents.length} documents to database`);

      // Store code examples
      if (data.content.codeBlocks && data.content.codeBlocks.length > 0) {
        console.log(`Saving ${data.content.codeBlocks.length} code examples`);
        
        // Get the actual document IDs from the database
        const savedDocs = await database.getDocuments(sourceId);
        if (savedDocs && savedDocs.length > 0) {
          // Use the first document's ID for code examples
          const documentId = savedDocs[0].id;
          
          for (const codeBlock of data.content.codeBlocks) {
            try {
              await database.addCodeExample({
                documentId: documentId,
                sourceId,
                language: codeBlock.language,
                code: codeBlock.code,
                description: `Code from ${data.content.title}`
              });
            } catch (codeError) {
              console.error('Failed to save code example:', codeError);
            }
          }
        }
      }

      // Update source status
      await database.updateSourceStatus(sourceId, 'completed');
      console.log('Updated source status to completed');
      
      // Send update to renderer
      mainWindow?.webContents.send('source:updated', { sourceId, status: 'completed' });
    } catch (error) {
      console.error('Failed to process scraped page:', error);
      console.error('Error stack:', error.stack);
    }
  });

  scraper.on('complete', async (stats) => {
    mainWindow?.webContents.send('crawl:complete', stats);
  });

  scraper.on('error', (error) => {
    mainWindow?.webContents.send('crawl:error', error);
  });
  
  console.log('Scraper event handlers registered successfully');
}

app.whenReady().then(async () => {
  // Set app name
  app.setName('DevDigger');
  
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.devdigger');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  await initializeServices();
  setupIpcHandlers();
  createMenu();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app shutdown
app.on('before-quit', async () => {
  await database?.close();
  await scraper?.cleanup();
  await vectorDb?.close();
  await realtimeServer?.stop();
  await workerManager?.terminate();
  console.log('All services shut down gracefully');
});
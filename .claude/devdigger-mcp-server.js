#!/usr/bin/env node

/**
 * DevDigger MCP Server for Claude Code/Flow Integration
 * 
 * This server allows Claude to directly query your DevDigger knowledge base
 * through the Model Context Protocol (MCP).
 */

const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const express = require('express');
const cors = require('cors');

// Path to DevDigger database
const DB_PATH = path.join(
  os.homedir(),
  'Library',
  'Application Support',
  'devdigger',
  'devdigger.db'
);

class DevDiggerMCPServer {
  constructor(port = 3333) {
    this.port = port;
    this.app = express();
    this.db = null;
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  connectDatabase() {
    try {
      this.db = new Database(DB_PATH, { readonly: true });
      console.log('✅ Connected to DevDigger database');
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to database:', error.message);
      return false;
    }
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        database: this.db ? 'connected' : 'disconnected',
        version: '1.0.0'
      });
    });

    // Search documents
    this.app.post('/search', (req, res) => {
      const { query, limit = 10 } = req.body;
      
      if (!this.db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      try {
        const results = this.db.prepare(`
          SELECT 
            d.id,
            d.content,
            d.source_id,
            s.url,
            s.title,
            s.type
          FROM documents d
          JOIN sources s ON d.source_id = s.id
          WHERE d.content LIKE ?
          LIMIT ?
        `).all(`%${query}%`, limit);

        res.json({ results, count: results.length });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Semantic search with embeddings
    this.app.post('/semantic-search', (req, res) => {
      const { embedding, limit = 10 } = req.body;
      
      if (!this.db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      try {
        // Convert embedding array to buffer for SQLite
        const embeddingBuffer = Buffer.from(new Float32Array(embedding).buffer);
        
        const results = this.db.prepare(`
          SELECT 
            d.id,
            d.content,
            s.url,
            s.title,
            cosine_similarity(d.embedding, ?) as similarity
          FROM documents d
          JOIN sources s ON d.source_id = s.id
          WHERE d.embedding IS NOT NULL
          ORDER BY similarity DESC
          LIMIT ?
        `).all(embeddingBuffer, limit);

        res.json({ results, count: results.length });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get code examples
    this.app.get('/code-examples', (req, res) => {
      const { language, limit = 20 } = req.query;
      
      if (!this.db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      try {
        let query = `
          SELECT 
            c.id,
            c.language,
            c.code,
            c.description,
            s.url as source_url,
            s.title as source_title
          FROM code_examples c
          JOIN sources s ON c.source_id = s.id
        `;
        
        const params = [];
        if (language) {
          query += ` WHERE c.language = ?`;
          params.push(language);
        }
        
        query += ` LIMIT ?`;
        params.push(parseInt(limit));
        
        const results = this.db.prepare(query).all(...params);
        res.json({ results, count: results.length });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get sources
    this.app.get('/sources', (req, res) => {
      const { type } = req.query;
      
      if (!this.db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      try {
        let query = `
          SELECT 
            id,
            type,
            url,
            title,
            description,
            crawl_status,
            datetime(created_at) as created_at
          FROM sources
        `;
        
        const params = [];
        if (type) {
          query += ` WHERE type = ?`;
          params.push(type);
        }
        
        query += ` ORDER BY created_at DESC`;
        
        const results = this.db.prepare(query).all(...params);
        res.json({ results, count: results.length });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get statistics
    this.app.get('/stats', (req, res) => {
      if (!this.db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      try {
        const stats = {
          sources: this.db.prepare('SELECT COUNT(*) as count FROM sources').get().count,
          documents: this.db.prepare('SELECT COUNT(*) as count FROM documents').get().count,
          code_examples: this.db.prepare('SELECT COUNT(*) as count FROM code_examples').get().count,
          embedded_docs: this.db.prepare('SELECT COUNT(*) as count FROM documents WHERE embedding IS NOT NULL').get().count
        };
        
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // MCP-specific endpoint for tool discovery
    this.app.get('/mcp/tools', (req, res) => {
      res.json({
        tools: [
          {
            name: 'devdigger_search',
            description: 'Search DevDigger knowledge base for documentation and code',
            parameters: {
              query: { type: 'string', required: true },
              limit: { type: 'number', required: false, default: 10 }
            }
          },
          {
            name: 'devdigger_code',
            description: 'Find code examples in DevDigger database',
            parameters: {
              language: { type: 'string', required: false },
              limit: { type: 'number', required: false, default: 20 }
            }
          },
          {
            name: 'devdigger_sources',
            description: 'List crawled sources in DevDigger',
            parameters: {
              type: { type: 'string', required: false }
            }
          }
        ]
      });
    });
  }

  start() {
    if (!this.connectDatabase()) {
      console.error('Failed to start server: Database connection failed');
      process.exit(1);
    }

    this.app.listen(this.port, () => {
      console.log(`🚀 DevDigger MCP Server running on http://localhost:${this.port}`);
      console.log(`📚 Database: ${DB_PATH}`);
      console.log('\nAvailable endpoints:');
      console.log(`  POST /search         - Full-text search`);
      console.log(`  POST /semantic-search - Vector similarity search`);
      console.log(`  GET  /code-examples  - Find code snippets`);
      console.log(`  GET  /sources        - List crawled sources`);
      console.log(`  GET  /stats          - Database statistics`);
      console.log(`  GET  /mcp/tools      - MCP tool discovery`);
    });
  }
}

// Start server
const server = new DevDiggerMCPServer(process.env.PORT || 3333);
server.start();
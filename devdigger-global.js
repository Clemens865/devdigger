#!/usr/bin/env node

/**
 * DevDigger Global CLI
 * Access your knowledge base from anywhere
 */

const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const { program } = require('commander');

// Database path
const DB_PATH = path.join(
  os.homedir(),
  'Library',
  'Application Support',
  'DevDigger',
  'devdigger.db'
);

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Initialize database
let db;
try {
  db = new Database(DB_PATH, { readonly: true });
} catch (error) {
  console.error(`${colors.red}❌ Failed to connect to DevDigger database${colors.reset}`);
  console.error(`${colors.yellow}Make sure DevDigger has crawled some data first${colors.reset}`);
  process.exit(1);
}

// Search function
function search(query, options = {}) {
  const limit = options.limit || 10;
  const format = options.format || 'text';
  
  try {
    // Search in documents
    const stmt = db.prepare(`
      SELECT 
        d.content,
        d.source_id,
        s.url,
        s.title,
        LENGTH(d.content) as content_length
      FROM documents d
      JOIN sources s ON d.source_id = s.id
      WHERE d.content LIKE ?
      ORDER BY content_length DESC
      LIMIT ?
    `);
    
    const results = stmt.all(`%${query}%`, limit);
    
    if (format === 'json') {
      console.log(JSON.stringify(results, null, 2));
    } else {
      if (results.length === 0) {
        console.log(`${colors.yellow}No results found${colors.reset}`);
        return;
      }
      
      console.log(`${colors.green}\nFound ${results.length} results for "${query}":\n${colors.reset}`);
      results.forEach((result, index) => {
        console.log(`${colors.cyan}[${index + 1}] ${result.title || 'Untitled'}${colors.reset}`);
        console.log(`${colors.gray}    Source: ${result.url}${colors.reset}`);
        
        // Show snippet with highlighted query
        const snippet = result.content.substring(0, 200);
        const highlighted = snippet.replace(
          new RegExp(query, 'gi'),
          match => `${colors.yellow}${colors.bold}${match}${colors.reset}`
        );
        console.log(`    ${highlighted}...`);
        console.log();
      });
    }
  } catch (error) {
    console.error(`${colors.red}Search failed:${colors.reset}`, error.message);
  }
}

// Search code examples
function searchCode(query, language) {
  try {
    let sql = `
      SELECT 
        ce.code,
        ce.language,
        ce.description,
        s.url,
        s.title
      FROM code_examples ce
      JOIN sources s ON ce.source_id = s.id
      WHERE ce.code LIKE ?
    `;
    
    const params = [`%${query}%`];
    
    if (language) {
      sql += ' AND ce.language = ?';
      params.push(language);
    }
    
    sql += ' LIMIT 20';
    
    const stmt = db.prepare(sql);
    const results = stmt.all(...params);
    
    if (results.length === 0) {
      console.log(`${colors.yellow}No code examples found${colors.reset}`);
      return;
    }
    
    console.log(`${colors.green}\nFound ${results.length} code examples:\n${colors.reset}`);
    results.forEach((result, index) => {
      console.log(`${colors.cyan}[${index + 1}] ${result.description}${colors.reset}`);
      console.log(`${colors.gray}    Language: ${result.language || 'unknown'}${colors.reset}`);
      console.log(`${colors.gray}    Source: ${result.url}${colors.reset}`);
      console.log(`${colors.white}    Code:${colors.reset}`);
      
      // Show first 10 lines of code
      const codeLines = result.code.split('\n').slice(0, 10);
      codeLines.forEach(line => console.log(`      ${line}`));
      if (result.code.split('\n').length > 10) {
        console.log(`${colors.gray}      ...${colors.reset}`);
      }
      console.log();
    });
  } catch (error) {
    console.error(`${colors.red}Code search failed:${colors.reset}`, error.message);
  }
}

// Get statistics
function stats() {
  try {
    const sourcesCount = db.prepare('SELECT COUNT(*) as count FROM sources').get().count;
    const docsCount = db.prepare('SELECT COUNT(*) as count FROM documents').get().count;
    const codeCount = db.prepare('SELECT COUNT(*) as count FROM code_examples').get().count;
    
    console.log(`${colors.green}\n📊 DevDigger Statistics:\n${colors.reset}`);
    console.log(`  Sources:        ${colors.cyan}${sourcesCount}${colors.reset}`);
    console.log(`  Documents:      ${colors.cyan}${docsCount}${colors.reset}`);
    console.log(`  Code Examples:  ${colors.cyan}${codeCount}${colors.reset}`);
    
    // Get top sources
    const topSources = db.prepare(`
      SELECT s.url, s.title, COUNT(d.id) as doc_count
      FROM sources s
      JOIN documents d ON s.id = d.source_id
      GROUP BY s.id
      ORDER BY doc_count DESC
      LIMIT 5
    `).all();
    
    console.log(`${colors.green}\n📚 Top Sources:\n${colors.reset}`);
    topSources.forEach((source, index) => {
      console.log(`  ${index + 1}. ${source.title || source.url} (${source.doc_count} docs)`);
    });
  } catch (error) {
    console.error(`${colors.red}Failed to get statistics:${colors.reset}`, error.message);
  }
}

// List sources
function sources(type) {
  try {
    let sql = 'SELECT id, url, title, crawl_status FROM sources';
    const params = [];
    
    if (type) {
      sql += ' WHERE type = ?';
      params.push(type);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const stmt = db.prepare(sql);
    const results = stmt.all(...params);
    
    console.log(`${colors.green}\n📚 Sources (${results.length}):\n${colors.reset}`);
    results.forEach((source, index) => {
      const status = source.crawl_status === 'completed' 
        ? `${colors.green}✓${colors.reset}` 
        : `${colors.yellow}⋯${colors.reset}`;
      console.log(`  ${status} ${source.title || source.url}`);
    });
  } catch (error) {
    console.error(`${colors.red}Failed to list sources:${colors.reset}`, error.message);
  }
}

// Set up CLI commands
program
  .name('devdigger')
  .description('Access your DevDigger knowledge base from anywhere')
  .version('1.0.0');

program
  .command('search <query>')
  .description('Search in your knowledge base')
  .option('-l, --limit <number>', 'limit results', '10')
  .option('-f, --format <format>', 'output format (text/json)', 'text')
  .action((query, options) => {
    search(query, options);
  });

program
  .command('code <query>')
  .description('Search for code examples')
  .option('-l, --language <language>', 'filter by language')
  .action((query, options) => {
    searchCode(query, options.language);
  });

program
  .command('stats')
  .description('Show database statistics')
  .action(stats);

program
  .command('sources')
  .description('List all sources')
  .option('-t, --type <type>', 'filter by type')
  .action((options) => {
    sources(options.type);
  });

// Parse arguments
program.parse(process.argv);

// Close database on exit
process.on('exit', () => {
  if (db) db.close();
});
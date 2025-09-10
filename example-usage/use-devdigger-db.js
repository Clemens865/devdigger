#!/usr/bin/env node

/**
 * Example: How to use DevDigger database in another project
 * 
 * This script shows how to:
 * 1. Connect to the DevDigger SQLite database
 * 2. Query crawled data
 * 3. Perform semantic search
 * 4. Export data for use in other applications
 */

const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

// Path to DevDigger database
const DB_PATH = path.join(
  os.homedir(),
  'Library',
  'Application Support',
  'devdigger',
  'devdigger.db'
);

console.log('📁 Connecting to DevDigger database at:', DB_PATH);

// Connect to the database
const db = new Database(DB_PATH, { readonly: true });

// ============================================
// 1. LIST ALL SOURCES (CRAWLED WEBSITES)
// ============================================
function listSources() {
  console.log('\n📚 SOURCES IN DATABASE:');
  console.log('=' .repeat(50));
  
  const sources = db.prepare(`
    SELECT 
      id,
      type,
      url,
      title,
      crawl_status,
      datetime(created_at) as created_at
    FROM sources
    ORDER BY created_at DESC
  `).all();
  
  if (sources.length === 0) {
    console.log('No sources found. Please crawl some websites first in DevDigger.');
    return [];
  }
  
  sources.forEach(source => {
    console.log(`
📌 ${source.title || 'Untitled'}
   URL: ${source.url}
   Type: ${source.type}
   Status: ${source.crawl_status}
   ID: ${source.id}
   Created: ${source.created_at}
    `);
  });
  
  return sources;
}

// ============================================
// 2. GET DOCUMENTS FOR A SOURCE
// ============================================
function getDocuments(sourceId) {
  console.log('\n📄 DOCUMENTS:');
  console.log('=' .repeat(50));
  
  const documents = db.prepare(`
    SELECT 
      id,
      source_id,
      substr(content, 1, 200) as preview,
      chunk_index,
      length(content) as content_length
    FROM documents
    WHERE source_id = ?
    ORDER BY chunk_index
  `).all(sourceId);
  
  console.log(`Found ${documents.length} document chunks`);
  
  return documents;
}

// ============================================
// 3. SEARCH FOR CONTENT
// ============================================
function searchContent(query) {
  console.log(`\n🔍 SEARCHING FOR: "${query}"`);
  console.log('=' .repeat(50));
  
  const results = db.prepare(`
    SELECT 
      d.id,
      d.content,
      d.source_id,
      s.url,
      s.title
    FROM documents d
    JOIN sources s ON d.source_id = s.id
    WHERE d.content LIKE ?
    LIMIT 10
  `).all(`%${query}%`);
  
  if (results.length === 0) {
    console.log('No results found.');
    return [];
  }
  
  results.forEach((result, index) => {
    const preview = result.content.substring(0, 200).replace(/\n/g, ' ');
    console.log(`
Result ${index + 1}:
  Source: ${result.title || result.url}
  Preview: ${preview}...
    `);
  });
  
  return results;
}

// ============================================
// 4. GET CODE EXAMPLES
// ============================================
function getCodeExamples(language = null) {
  console.log('\n💻 CODE EXAMPLES:');
  console.log('=' .repeat(50));
  
  let query = `
    SELECT 
      c.id,
      c.language,
      c.code,
      c.description,
      s.url as source_url
    FROM code_examples c
    JOIN sources s ON c.source_id = s.id
  `;
  
  if (language) {
    query += ` WHERE c.language = ?`;
  }
  
  query += ` LIMIT 10`;
  
  const stmt = db.prepare(query);
  const examples = language ? stmt.all(language) : stmt.all();
  
  if (examples.length === 0) {
    console.log('No code examples found.');
    return [];
  }
  
  examples.forEach(example => {
    console.log(`
Language: ${example.language}
Description: ${example.description || 'No description'}
Source: ${example.source_url}
Code Preview:
${example.code.substring(0, 200)}...
    `);
  });
  
  return examples;
}

// ============================================
// 5. EXPORT DATA AS JSON
// ============================================
function exportToJSON() {
  console.log('\n📦 EXPORTING DATA TO JSON...');
  console.log('=' .repeat(50));
  
  const data = {
    sources: db.prepare('SELECT * FROM sources').all(),
    documents: db.prepare('SELECT * FROM documents').all(),
    code_examples: db.prepare('SELECT * FROM code_examples').all(),
    collections: db.prepare('SELECT * FROM collections').all()
  };
  
  const fs = require('fs');
  const outputPath = './devdigger-export.json';
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`✅ Data exported to: ${outputPath}`);
  console.log(`   Sources: ${data.sources.length}`);
  console.log(`   Documents: ${data.documents.length}`);
  console.log(`   Code Examples: ${data.code_examples.length}`);
  
  return data;
}

// ============================================
// 6. USE WITH VECTOR SEARCH (EMBEDDINGS)
// ============================================
function vectorSearch(embedding) {
  console.log('\n🧠 VECTOR SEARCH:');
  console.log('=' .repeat(50));
  
  // This requires the embedding column to have data
  const results = db.prepare(`
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
    LIMIT 10
  `).all(Buffer.from(new Float32Array(embedding).buffer));
  
  return results;
}

// ============================================
// 7. GET DATABASE STATISTICS
// ============================================
function getStats() {
  console.log('\n📊 DATABASE STATISTICS:');
  console.log('=' .repeat(50));
  
  const stats = {
    sources: db.prepare('SELECT COUNT(*) as count FROM sources').get().count,
    documents: db.prepare('SELECT COUNT(*) as count FROM documents').get().count,
    code_examples: db.prepare('SELECT COUNT(*) as count FROM code_examples').get().count,
    collections: db.prepare('SELECT COUNT(*) as count FROM collections').get().count,
    embedded_docs: db.prepare('SELECT COUNT(*) as count FROM documents WHERE embedding IS NOT NULL').get().count
  };
  
  console.log(`
  Sources: ${stats.sources}
  Documents: ${stats.documents}
  Code Examples: ${stats.code_examples}
  Collections: ${stats.collections}
  Documents with Embeddings: ${stats.embedded_docs}
  `);
  
  return stats;
}

// ============================================
// MAIN EXECUTION
// ============================================
async function main() {
  try {
    // 1. Get statistics
    const stats = getStats();
    
    if (stats.sources === 0) {
      console.log('\n⚠️  No data found in database!');
      console.log('Please use DevDigger to crawl some websites first.');
      console.log('\nTo crawl data:');
      console.log('1. Open DevDigger app');
      console.log('2. Go to "Mine" tab');
      console.log('3. Enter a URL (e.g., https://react.dev/learn)');
      console.log('4. Click "Commence"');
      console.log('5. Wait for crawling to complete');
      process.exit(0);
    }
    
    // 2. List sources
    const sources = listSources();
    
    // 3. Get documents for first source
    if (sources.length > 0) {
      getDocuments(sources[0].id);
    }
    
    // 4. Search for content
    searchContent('react');
    
    // 5. Get code examples
    getCodeExamples();
    
    // 6. Export data (optional)
    // exportToJSON();
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close();
  }
}

// Run the script
main();
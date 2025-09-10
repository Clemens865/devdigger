/**
 * Test script to verify DevDigger crawling functionality
 * This script will test the crawling pipeline by directly using the crawl logic
 */
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const axios = require('axios');
const cheerio = require('cheerio');

// Database path (must match the actual app)
const DB_PATH = path.join(
  os.homedir(),
  'Library',
  'Application Support',
  'DevDigger',
  'devdigger.db'
);

// Simple test function to simulate crawling
async function testCrawl() {
  console.log('🔍 Starting DevDigger crawl test...');
  
  // Connect to database
  let db;
  try {
    db = new Database(DB_PATH, { readonly: false });
    console.log('✅ Connected to DevDigger database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    return;
  }

  // Check initial state
  const initialStats = {
    sources: db.prepare('SELECT COUNT(*) as count FROM sources').get().count,
    documents: db.prepare('SELECT COUNT(*) as count FROM documents').get().count,
    codeExamples: db.prepare('SELECT COUNT(*) as count FROM code_examples').get().count
  };
  
  console.log('📊 Initial stats:', initialStats);

  // Test URL - use a simple, reliable site
  const testUrl = 'https://example.com';
  console.log(`🌐 Testing crawl for: ${testUrl}`);

  try {
    // Scrape the test URL using axios/cheerio (simplified version)
    const response = await axios.get(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const content = {
      title: $('title').text() || 'No title',
      text: $('body').text() || 'No content',
      html: response.data
    };

    console.log('✅ Successfully scraped content');
    console.log(`📄 Title: ${content.title}`);
    console.log(`📝 Content length: ${content.text.length} characters`);

    // Generate a simple source ID
    const sourceId = require('crypto').createHash('sha256').update(testUrl).digest('hex').substring(0, 16);
    
    // Add source to database
    const addSourceStmt = db.prepare(`
      INSERT OR REPLACE INTO sources (id, url, type, title, description, metadata, crawl_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    addSourceStmt.run(
      sourceId,
      testUrl,
      'website',
      content.title,
      'Test crawl description',
      JSON.stringify({ test: true }),
      'completed'
    );
    
    console.log('✅ Added source to database');

    // Create document chunks (simple chunking)
    const chunks = chunkText(content.text, 500);
    console.log(`📄 Created ${chunks.length} chunks`);

    // Add documents to database
    const addDocumentStmt = db.prepare(`
      INSERT OR IGNORE INTO documents 
      (id, source_id, content, content_hash, chunk_index, metadata, embedding, embedding_model)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTransaction = db.transaction((docs) => {
      let inserted = 0;
      for (const doc of docs) {
        const contentHash = require('crypto').createHash('sha256').update(doc.content).digest('hex');
        const docId = require('crypto').createHash('sha256').update(`${doc.sourceId}-${doc.chunkIndex}`).digest('hex').substring(0, 16);
        
        // Generate simple embedding (fallback method)
        const simpleEmbedding = generateSimpleEmbedding(doc.content);
        const embeddingBuffer = Buffer.from(new Float32Array(simpleEmbedding).buffer);

        const result = addDocumentStmt.run(
          docId,
          doc.sourceId,
          doc.content,
          contentHash,
          doc.chunkIndex,
          JSON.stringify(doc.metadata || {}),
          embeddingBuffer,
          'simple-fallback'
        );
        
        if (result.changes > 0) inserted++;
      }
      return inserted;
    });

    const documents = chunks.map((chunk, index) => ({
      sourceId,
      content: chunk,
      chunkIndex: index,
      metadata: { title: content.title }
    }));

    const inserted = insertTransaction(documents);
    console.log(`✅ Inserted ${inserted} documents into database`);

    // Check final stats
    const finalStats = {
      sources: db.prepare('SELECT COUNT(*) as count FROM sources').get().count,
      documents: db.prepare('SELECT COUNT(*) as count FROM documents').get().count,
      codeExamples: db.prepare('SELECT COUNT(*) as count FROM code_examples').get().count
    };
    
    console.log('📊 Final stats:', finalStats);
    console.log('📈 Changes:');
    console.log(`  Sources: ${initialStats.sources} → ${finalStats.sources} (+${finalStats.sources - initialStats.sources})`);
    console.log(`  Documents: ${initialStats.documents} → ${finalStats.documents} (+${finalStats.documents - initialStats.documents})`);

    console.log('🎉 Test crawl completed successfully!');

  } catch (error) {
    console.error('❌ Test crawl failed:', error.message);
  } finally {
    db.close();
  }
}

// Helper functions
function chunkText(text, maxChunkSize = 500) {
  const chunks = [];
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

function generateSimpleEmbedding(text, dimensions = 384) {
  const embedding = new Array(dimensions).fill(0);
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
  
  return embedding;
}

// Run the test
if (require.main === module) {
  testCrawl().catch(console.error);
}

module.exports = { testCrawl };
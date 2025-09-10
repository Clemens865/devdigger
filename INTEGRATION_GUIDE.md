# DevDigger Integration Guide

## Complete End-to-End Workflow

### 1. Setup DevDigger

1. **Configure OpenAI API Key**
   - Open DevDigger app
   - Press `Cmd+,` (or DevDigger menu → Settings)
   - Enter your OpenAI API key
   - Save settings

### 2. Crawl and Build Your Knowledge Base

```bash
# In DevDigger app:
1. Go to "Mine" tab
2. Enter URLs to crawl:
   - https://react.dev/learn
   - https://nodejs.org/docs
   - https://github.com/facebook/react
3. Configure:
   - Depth: 3-5 layers
   - Strategy: Documentation
4. Click "Commence"
5. Let it run (can take 5-30 minutes depending on site size)
```

### 3. Verify Data is Saved

```bash
# Check database directly
sqlite3 ~/Library/Application\ Support/devdigger/devdigger.db \
  "SELECT COUNT(*) FROM sources; SELECT COUNT(*) FROM documents;"
```

### 4. Database Location

The SQLite database is stored at:
```
~/Library/Application Support/devdigger/devdigger.db
```

This database contains:
- **sources**: Crawled websites and their metadata
- **documents**: Text content chunked for search
- **code_examples**: Extracted code snippets
- **collections**: User-created collections
- **embeddings**: Vector representations for semantic search

### 5. Use in Another Project

#### Option A: Direct SQLite Access

```javascript
// Node.js Example
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

const dbPath = path.join(
  os.homedir(), 
  'Library/Application Support/devdigger/devdigger.db'
);

const db = new Database(dbPath, { readonly: true });

// Query your knowledge
const results = db.prepare(`
  SELECT * FROM documents 
  WHERE content LIKE ? 
  LIMIT 10
`).all('%react hooks%');

console.log(results);
```

#### Option B: Python Integration

```python
import sqlite3
from pathlib import Path

# Connect to DevDigger database
db_path = Path.home() / "Library/Application Support/devdigger/devdigger.db"
conn = sqlite3.connect(str(db_path))

# Search for content
cursor = conn.cursor()
cursor.execute("""
    SELECT content, url FROM documents d
    JOIN sources s ON d.source_id = s.id
    WHERE content LIKE ?
""", ('%useState%',))

for row in cursor.fetchall():
    print(row[0][:200])  # Print first 200 chars
```

#### Option C: Export and Import

```bash
# Export from DevDigger
sqlite3 ~/Library/Application\ Support/devdigger/devdigger.db \
  ".dump" > devdigger_backup.sql

# Import in your project
sqlite3 my_project.db < devdigger_backup.sql
```

### 6. Integration with AI Tools

#### With LangChain

```python
from langchain.vectorstores import SQLiteVSS
from langchain.embeddings import OpenAIEmbeddings
from langchain.document_loaders import SQLiteLoader

# Load documents from DevDigger
loader = SQLiteLoader(
    db_path="~/Library/Application Support/devdigger/devdigger.db",
    query="SELECT content FROM documents"
)
documents = loader.load()

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = SQLiteVSS.from_documents(documents, embeddings)

# Query
results = vectorstore.similarity_search("How do React hooks work?")
```

#### With OpenAI RAG

```python
import openai
import sqlite3

# Get relevant context from DevDigger
conn = sqlite3.connect("~/Library/Application Support/devdigger/devdigger.db")
cursor = conn.cursor()
cursor.execute("SELECT content FROM documents WHERE content LIKE ?", ('%hooks%',))
context = "\n".join([row[0] for row in cursor.fetchall()[:5]])

# Use as context for GPT
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": f"Use this context: {context}"},
        {"role": "user", "content": "Explain React hooks"}
    ]
)
```

### 7. Advanced Usage

#### Semantic Search with Embeddings

```sql
-- DevDigger stores embeddings as BLOB
-- Use cosine_similarity for vector search
SELECT 
    content,
    cosine_similarity(embedding, ?) as score
FROM documents
WHERE embedding IS NOT NULL
ORDER BY score DESC
LIMIT 10;
```

#### Build Knowledge Graph

```python
import networkx as nx
import sqlite3

# Create knowledge graph from DevDigger data
conn = sqlite3.connect("~/Library/Application Support/devdigger/devdigger.db")
cursor = conn.cursor()

# Get all sources and their relationships
cursor.execute("""
    SELECT s1.url, s2.url
    FROM documents d1
    JOIN documents d2 ON d1.content LIKE '%' || d2.content || '%'
    JOIN sources s1 ON d1.source_id = s1.id
    JOIN sources s2 ON d2.source_id = s2.id
    WHERE s1.id != s2.id
""")

# Build graph
G = nx.Graph()
for source, target in cursor.fetchall():
    G.add_edge(source, target)
```

### 8. Database Schema

```sql
-- Key tables in DevDigger database

-- Sources (websites/documents crawled)
CREATE TABLE sources (
    id TEXT PRIMARY KEY,
    type TEXT, -- 'website', 'github', 'documentation'
    url TEXT,
    title TEXT,
    description TEXT,
    metadata JSON,
    crawl_status TEXT,
    created_at TIMESTAMP
);

-- Documents (chunked content)
CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    source_id TEXT,
    content TEXT,
    chunk_index INTEGER,
    embedding BLOB, -- Vector embedding
    metadata JSON,
    FOREIGN KEY (source_id) REFERENCES sources(id)
);

-- Code examples
CREATE TABLE code_examples (
    id TEXT PRIMARY KEY,
    source_id TEXT,
    language TEXT,
    code TEXT,
    description TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id)
);
```

### 9. Troubleshooting

**No data in database?**
- Make sure you've crawled at least one website
- Check crawl completed successfully in DevDigger
- Verify database path is correct

**Embeddings not working?**
- Ensure OpenAI API key is configured
- Check Settings page shows "Configured" status
- Re-crawl content after adding API key

**Can't access database?**
- Database might be locked if DevDigger is running
- Use readonly mode when accessing from other apps
- Copy database file if needed for isolation

### 10. Best Practices

1. **Regular Crawling**: Update your knowledge base weekly
2. **Selective Crawling**: Focus on high-quality documentation sites
3. **Depth Settings**: Use 3-5 layers for comprehensive coverage
4. **Export Backups**: Regularly export your database
5. **Version Control**: Track database schema changes

## Example Projects

Check the `example-usage/` folder for complete examples:
- `use-devdigger-db.js` - Node.js integration
- `use_devdigger_db.py` - Python integration
- Both show how to query, search, and export data

## Support

- Database location: `~/Library/Application Support/devdigger/devdigger.db`
- Settings: Press `Cmd+,` in DevDigger
- API Key required for embeddings/semantic search
- SQLite database is portable - copy anywhere!
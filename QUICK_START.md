# DevDigger Quick Start Guide

## ✅ What We Fixed
- **Document Saving Issue**: Fixed the `embedding_model` column error that prevented documents from being saved
- **Claude Integration**: Created CLI and MCP server for easy database access
- **Simplified Usage**: Made the database easily accessible from any project

## 🚀 How to Use DevDigger Database

### 1. Direct CLI Usage (Simplest)

```bash
# Make CLI executable
chmod +x ./devdigger-cli

# Search your knowledge base
./devdigger-cli search "react hooks"

# Find code examples
./devdigger-cli code --language javascript

# Get stats
./devdigger-cli stats

# Get context for Claude
./devdigger-cli claude-query "useState implementation"
```

### 2. Use in Node.js Projects

```javascript
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

// Connect to DevDigger database
const dbPath = path.join(
  os.homedir(),
  'Library/Application Support/devdigger/devdigger.db'
);
const db = new Database(dbPath, { readonly: true });

// Search for React hooks knowledge
const results = db.prepare(`
  SELECT content, url FROM documents d
  JOIN sources s ON d.source_id = s.id
  WHERE content LIKE '%react hooks%'
  LIMIT 5
`).all();

console.log(results);
```

### 3. Use in Python Projects

```python
import sqlite3
from pathlib import Path

# Connect to DevDigger
db_path = Path.home() / "Library/Application Support/devdigger/devdigger.db"
conn = sqlite3.connect(str(db_path))

# Query your knowledge
cursor = conn.cursor()
cursor.execute("""
    SELECT content FROM documents 
    WHERE content LIKE '%useState%'
    LIMIT 5
""")

for row in cursor.fetchall():
    print(row[0][:200])  # Print preview
```

### 4. Claude Code/Flow Integration

```bash
# Start MCP server (optional, for API access)
node .claude/devdigger-mcp-server.js

# Use in Claude Flow
./claude-flow sparc "Build a React component using DevDigger examples"

# The system will automatically query DevDigger for relevant context
```

### 5. In Your CLAUDE.md File

Add this to your project's CLAUDE.md to enable DevDigger queries:

```markdown
# Knowledge Base
Use DevDigger for documentation and examples:
- Search: `./devdigger-cli search "query"`
- Code: `./devdigger-cli code --language javascript`
- Context: `./devdigger-cli claude-query "topic"`
```

## 📊 Verify Everything Works

```bash
# 1. Check database has content
./devdigger-cli stats

# 2. Test search
./devdigger-cli search "react"

# 3. Find code examples
./devdigger-cli code

# If you see results, everything is working!
```

## 🔧 Troubleshooting

### No Documents Showing?
1. Make sure you've crawled websites in DevDigger
2. Check the Mine tab shows completed crawls
3. Run `./devdigger-cli stats` to verify

### Database Not Found?
The database is at: `~/Library/Application Support/devdigger/devdigger.db`

### Want to Test the Fix?
1. Open DevDigger
2. Go to Mine tab
3. Crawl a small site (e.g., https://react.dev/learn/tutorial-tic-tac-toe)
4. Check Excavate tab - should show searchable documents
5. Run `./devdigger-cli stats` - documents count should increase

## 🎯 Next Steps

1. **Crawl More Sources**: Add documentation sites you use frequently
2. **Use in Projects**: Reference DevDigger in your coding projects
3. **Claude Integration**: Add to CLAUDE.md for automatic context

## 💡 Pro Tips

- DevDigger database is portable - copy it anywhere
- Use `--format json` flag for programmatic access
- The MCP server enables REST API access at http://localhost:3333
- All data is stored locally for privacy and speed
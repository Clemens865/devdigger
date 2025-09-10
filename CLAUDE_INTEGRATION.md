# DevDigger + Claude Code Integration Guide

## Quick Setup for New Users

### 1. Install DevDigger
```bash
# Clone and install
git clone https://github.com/Clemens865/devdigger.git
cd devdigger
npm install

# Make CLI globally available
npm link
```

### 2. Add to Your ~/CLAUDE.md

Add these lines to your `~/CLAUDE.md` file (create it if it doesn't exist):

```markdown
## DevDigger Knowledge Base Commands

### Search Your Knowledge Base
- `devdigger search "query"`: Search documents in your knowledge base
- `devdigger search "query" --limit 5`: Limit search results
- `devdigger code "pattern"`: Search for code examples
- `devdigger code "pattern" --language rust`: Filter by language
- `devdigger stats`: Show database statistics
- `devdigger sources`: List all crawled sources
- `devdigger clean`: Remove empty or failed sources

### Global Access
- `devdigger search "query"`: Access from any directory (global CLI)
- `devdigger code "pattern"`: Search code from anywhere
- `devdigger stats`: Quick stats check
```

### 3. Configure Claude Code Permissions

When you first use DevDigger commands in Claude Code, it will ask for permission. You can pre-configure by adding to `.claude/settings.json` in your project:

```json
{
  "permissions": {
    "allow": [
      "Bash(devdigger search:*)",
      "Bash(devdigger code:*)",
      "Bash(devdigger stats:*)",
      "Bash(devdigger sources:*)",
      "Bash(devdigger clean:*)"
    ]
  }
}
```

### 4. Build Your Knowledge Base

Run DevDigger and start crawling documentation:
```bash
npm run dev  # Launch the Electron app
```

Then in the app:
1. Go to "Mine" page
2. Add documentation URLs (e.g., `https://doc.rust-lang.org`)
3. Click "Start Mining"

### 5. Use in Any Project

Now in any project, Claude Code can access your knowledge:

```bash
# Start Claude Code
claude

# Claude can now use commands like:
# devdigger search "async programming"
# devdigger code "iterator"
```

## Advanced Configuration

### Custom Database Location

If you want to use a different database location, update `devdigger-global.js`:

```javascript
const DB_PATH = path.join(
  os.homedir(),
  'Library',
  'Application Support',
  'DevDigger',
  'devdigger.db'
);
```

### Add Custom Commands to Claude Flow

For Claude Flow users, add to your `claude-flow.config.json`:

```json
{
  "custom_commands": {
    "knowledge": {
      "search": "devdigger search",
      "code": "devdigger code",
      "stats": "devdigger stats"
    }
  }
}
```

### Create Aliases for Convenience

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# DevDigger shortcuts
alias dds="devdigger search"
alias ddc="devdigger code"
alias ddstats="devdigger stats"

# Open Claude with DevDigger reminder
alias claude-dev="claude && echo 'DevDigger ready: use devdigger search/code/stats'"
```

## Example Workflows

### Research Workflow
```bash
# In your project
claude

# Ask Claude to research a topic using your knowledge base
> "Search my knowledge base for information about Vec in Rust"
# Claude runs: devdigger search "Vec"

> "Find code examples of push operations"  
# Claude runs: devdigger code "push"
```

### Code Reference Workflow
```bash
# Working on a Rust project
claude

> "I need to implement a custom iterator. Find examples in my knowledge base"
# Claude runs: devdigger code "iterator" --language rust
# Then provides implementation based on found examples
```

## Troubleshooting

### Command Not Found
If `devdigger` command is not found:
```bash
cd /path/to/devdigger
npm link
```

### Database Not Found
If Claude can't find your database:
1. Check the database exists: `ls ~/Library/Application\ Support/DevDigger/`
2. Run DevDigger app at least once to create the database
3. Verify global CLI works: `devdigger stats`

### Permission Denied in Claude Code
Add to your project's `.claude/settings.json`:
```json
{
  "permissions": {
    "allow": ["Bash(devdigger:*)"]
  }
}
```

## Benefits of Integration

1. **Context-Aware Assistance**: Claude can search your personal knowledge base for relevant documentation
2. **Code Examples**: Quickly find and adapt code patterns you've previously saved
3. **Offline Access**: All knowledge is stored locally, works without internet
4. **Project-Specific Knowledge**: Build specialized knowledge bases for different domains

## Contributing

Found a better integration pattern? Submit a PR to improve this guide!

---

**Made for developers who want AI assistance with their personal knowledge base**
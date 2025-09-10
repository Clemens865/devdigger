# DevDigger 🔍

> A powerful local knowledge management system that transforms web documentation into your personal, searchable knowledge base. Built with Electron, React, and AI-powered semantic search.

![DevDigger](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)

## 🌟 Overview

DevDigger is inspired by the concept of a "digital archaeologist" - it excavates, processes, and preserves web documentation into a searchable knowledge base that works entirely offline. Perfect for developers who want to maintain their own curated library of technical documentation, code examples, and learning resources.

### Key Features

- 🕷️ **Smart Web Crawling**: Intelligently crawls and extracts content from documentation sites
- 🧠 **AI-Powered Search**: Semantic search using embeddings for finding relevant content
- 💾 **Local-First**: All data stored locally in SQLite - works offline, no cloud dependencies
- 🔍 **Code Extraction**: Automatically identifies and indexes code examples
- 🌐 **Global CLI Access**: Search your knowledge base from any project directory
- 🤖 **Claude Code Integration**: Seamlessly integrates with Claude Code for AI-assisted development

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19 + TypeScript + Framer Motion
- **Backend**: Electron 38 + Node.js
- **Database**: SQLite (better-sqlite3) + Vector embeddings (Vectra)
- **AI/ML**: OpenAI embeddings API for semantic search
- **Scraping**: Cheerio for HTML parsing
- **Build**: Vite + electron-vite + electron-builder

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                     Electron Main Process                │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Database   │  │ Web Scraper  │  │  Embedding    │ │
│  │   Service   │  │   Service    │  │   Service     │ │
│  └─────────────┘  └──────────────┘  └───────────────┘ │
│         │                │                   │          │
│         └────────────────┴───────────────────┘          │
│                          │                              │
│                    IPC Bridge                           │
│                          │                              │
├─────────────────────────────────────────────────────────┤
│                   Electron Renderer                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │              React Application                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │   │
│  │  │   Mine    │  │  Search  │  │ Collections  │ │   │
│  │  │   Page    │  │   Page   │  │    Page      │ │   │
│  │  └──────────┘  └──────────┘  └──────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Clemens865/devdigger.git
cd devdigger
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up OpenAI API key (optional, for embeddings)**
```bash
# Add your API key in the app settings or via environment variable
export OPENAI_API_KEY="your-api-key-here"
```

4. **Run in development mode**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm run dist
```

## 🚀 Usage

### Desktop Application

1. **Launch DevDigger**
   - Run `npm run dev` for development
   - Or install the built application from `dist/`

2. **Add Sources to Mine**
   - Navigate to the "Mine" page
   - Enter documentation URLs (e.g., `https://doc.rust-lang.org`)
   - Configure crawl depth and max pages
   - Click "Start Mining"

3. **Search Your Knowledge**
   - Go to "Search" page
   - Enter queries to search through your documentation
   - Use semantic search for concept-based queries
   - Filter by source or document type

4. **Browse Collections**
   - View organized collections by domain
   - See statistics about your knowledge base
   - Export collections for sharing

### Global CLI Access

DevDigger includes a powerful CLI that works from any directory:

1. **Install globally**
```bash
npm link  # Run from the DevDigger directory
```

2. **Available Commands**
```bash
# Search documentation
devdigger search "Vec"
devdigger search "async programming" --limit 5

# Find code examples
devdigger code "useState"
devdigger code "iterator" --language rust

# View statistics
devdigger stats

# List sources
devdigger sources

# Clean empty sources
devdigger clean
```

### Claude Code Integration

DevDigger seamlessly integrates with Claude Code for AI-assisted development:

1. **Setup Integration**
   - DevDigger commands are automatically added to your `~/CLAUDE.md`
   - Claude Code will recognize and use DevDigger commands

2. **Usage in Projects**
```bash
# Start Claude Code in any project
claude

# Claude can now use commands like:
# devdigger search "concept"
# devdigger code "pattern"
```

## 🗂️ Data Storage

DevDigger stores all data locally:

- **Database**: `~/Library/Application Support/DevDigger/devdigger.db` (macOS)
- **Vector Index**: `~/Library/Application Support/DevDigger/vector-index/`
- **Settings**: Application preferences and API keys

### Database Schema

- `sources`: Tracked documentation sources
- `documents`: Indexed content chunks with embeddings
- `code_examples`: Extracted code snippets with metadata
- `collections`: User-defined collections
- `embeddings`: Vector embeddings for semantic search

## 🛠️ Development

### Project Structure

```
DevDigger/
├── src/
│   ├── main/           # Electron main process
│   │   ├── services/    # Core services (DB, scraper, embeddings)
│   │   └── index.ts     # Main process entry
│   ├── renderer/        # React application
│   │   ├── pages/       # Application pages
│   │   ├── components/  # React components
│   │   └── App.tsx      # React entry point
│   └── preload/         # Preload scripts for IPC
├── devdigger-cli        # Local CLI tool
├── devdigger-global.js  # Global CLI tool
└── package.json
```

### Key Services

- **DatabaseService**: SQLite operations and data management
- **WebScraperService**: Intelligent web crawling and content extraction
- **EmbeddingService**: OpenAI embeddings generation
- **VectorDatabaseService**: Semantic search with Vectra

### Running Tests

```bash
npm run test         # Run test suite
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint checks
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Archon knowledge management system
- Built with Electron and React
- Semantic search powered by OpenAI embeddings
- Special thanks to the open-source community

## 📧 Contact

Clemens Hoenig - [@Clemens865](https://github.com/Clemens865)

Project Link: [https://github.com/Clemens865/devdigger](https://github.com/Clemens865/devdigger)

---

**Made with ❤️ for developers who love organized documentation**
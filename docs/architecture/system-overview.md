# DevDigger System Architecture

## Overview
DevDigger is an Electron-based local knowledge management system designed for developers to efficiently crawl, index, and search through their local documentation, code, and knowledge bases using semantic search and knowledge graph technologies.

## Architecture Principles

### 1. Local-First Architecture
- All data stored locally in SQLite databases
- No cloud dependencies for core functionality
- Optional cloud sync and backup capabilities
- Privacy-focused design

### 2. Modular Component Design
- Loosely coupled services within Electron container
- Plugin-based architecture for extensibility
- Clear separation of concerns
- Event-driven communication

### 3. Performance-Oriented
- Lazy loading and virtualization for large datasets
- Efficient vector search using sqlite-vec
- Background processing for heavy operations
- Optimized SQLite configurations

### 4. Developer-Centric
- Claude Code/Flow integration hooks
- Git repository awareness
- Code-specific parsers and analyzers
- Developer workflow integration

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Main Process                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Database       │  │  Crawler        │  │  Search         │ │
│  │  Service        │  │  Service        │  │  Service        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Vector         │  │  Knowledge      │  │  Claude         │ │
│  │  Service        │  │  Graph Service  │  │  Integration    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    IPC Communication                        │
├─────────────────────────────────────────────────────────────┤
│                  Electron Renderer Process                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Search UI      │  │  Knowledge      │  │  Document       │ │
│  │  Component      │  │  Graph UI       │  │  Viewer         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Settings UI    │  │  Import UI      │  │  Mining         │ │
│  │  Component      │  │  Component      │  │  Dashboard      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Technologies
- **Electron**: Cross-platform desktop application framework
- **SQLite**: Local database with ACID compliance
- **sqlite-vec**: Vector search extension for semantic similarity
- **Node.js**: Backend runtime environment
- **React/Vue**: Frontend UI framework
- **TypeScript**: Type-safe development

### Additional Libraries
- **pdf-parse**: PDF document extraction
- **markdown-it**: Markdown parsing and rendering
- **tree-sitter**: Code parsing and analysis
- **compromise**: Natural language processing
- **d3.js**: Knowledge graph visualization
- **fuse.js**: Fuzzy text search

## Data Architecture

### Database Schema Design
```sql
-- Core documents table
CREATE TABLE documents (
    id INTEGER PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    content_hash TEXT,
    file_type TEXT,
    size INTEGER,
    created_at DATETIME,
    modified_at DATETIME,
    indexed_at DATETIME
);

-- Vector embeddings table
CREATE TABLE document_vectors (
    id INTEGER PRIMARY KEY,
    document_id INTEGER,
    chunk_index INTEGER,
    embedding BLOB, -- Vector embedding
    content_chunk TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- Knowledge graph nodes
CREATE TABLE kg_nodes (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    type TEXT, -- concept, entity, function, class, etc.
    description TEXT,
    confidence REAL DEFAULT 1.0
);

-- Knowledge graph relationships
CREATE TABLE kg_relationships (
    id INTEGER PRIMARY KEY,
    source_node_id INTEGER,
    target_node_id INTEGER,
    relationship_type TEXT,
    weight REAL DEFAULT 1.0,
    source_document_id INTEGER,
    FOREIGN KEY (source_node_id) REFERENCES kg_nodes(id),
    FOREIGN KEY (target_node_id) REFERENCES kg_nodes(id),
    FOREIGN KEY (source_document_id) REFERENCES documents(id)
);

-- Search index for full-text search
CREATE VIRTUAL TABLE documents_fts USING fts5(
    title, content, tags,
    content='documents',
    content_rowid='id'
);
```
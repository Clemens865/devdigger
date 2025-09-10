# Archon OS Overview

The **Archon** GitHub repository hosts the beta release of Archon OS, which is positioned as a **knowledge and task management backbone for AI coding assistants**. Below is a detailed overview of what Archon is, what it does, and how it works:

***

### What is Archon?

- **Archon acts as a command center for AI coding assistants**. It provides an interface for users to manage documentation, project knowledge, and tasks for software projects.
- For AI coding assistants (like Claude Code, Cursor, etc.), Archon serves as a **Model Context Protocol (MCP) server** that enables these agents to collaboratively leverage the same context, documentation, and task lists.
- The system aims to boost the effectiveness of AI-driven coding by giving both humans and AI rich access to indexed project knowledge, semantic search, and live task orchestration.
- It's developed as a replacement for previous agent-management tools, expanding to become a universal backbone for "context engineering" in codebases of any size or type.

***

### Core Features and Capabilities

#### **Knowledge Management**
- **Smart Web Crawling:** Automatically crawls documentation sites and individual pages to ingest knowledge.
- **Document Processing:** Upload PDFs, Word docs, markdown, and text files, which are intelligently chunked and indexed.
- **Code Example Extraction:** Detects and indexes code snippets from technical documents for better search capabilities.
- **Vector Search:** Uses contextual embeddings for advanced, semantically aware retrieval across all knowledge.
- **Source Organization:** Knowledge can be filtered and referenced by source, type, and tags for precise access.

#### **AI Integration**
- **Model Context Protocol (MCP):** Allows any MCP-compatible client—AI assistants, dev tools, or editors—to integrate and interact with the knowledge/task store.
- **RAG Queries:** Supports advanced retrieval-augmented generation (RAG) strategies for superior contextual AI answers.
- **Multi-LLM Support:** Works with OpenAI, Google Gemini, Ollama, and more.
- **Live Agent Streaming:** Supports real-time, streaming dialog and progress tracking for integrated AI coding sessions.

#### **Project & Task Management**
- **Hierarchical Projects:** Supports organizing work by project, feature, and task for a clear and scalable workflow.
- **AI-Assisted Task Generation:** Integrated AI can automatically generate requirements and breaking down feature tasks from high-level input.
- **Version-controlled Document Management:** Built-in collaborative editing and versioning for all documents and task artifacts.
- **Live Progress Tracking:** See status changes and collaboration activity in real time.

#### **Collaboration**
- **WebSocket-powered Updates:** Efficiently pushes live updates to the UI.
- **Multi-user Support:** Enables shared knowledge building and task management (team-based workflows).
- **Background Processing:** Asynchronous, non-blocking processing for heavy knowledge ingestion tasks.
- **Health Monitoring:** Service health and auto-recovery is built-in.

***

### Architecture and How It Works

**Microservices**:  
Archon is architected as a set of composable microservices, each with a clear responsibility:

| Service       | Location                | Functionality                       | Technologies                   |
|---------------|------------------------|-------------------------------------|--------------------------------|
| UI           | archon-ui-main/         | Frontend dashboard                  | React, Vite, Tailwind, Socket.IO |
| API Server   | python/src/server/      | Core business logic, ML ops, APIs   | FastAPI, Socket.IO             |
| MCP Server   | python/src/mcp/         | MCP protocol, AI agent interface    | Lightweight HTTP, SSE, stdio   |
| Agents       | python/src/agents/      | Hosts doc and RAG agents            | PydanticAI, vector ops         |
| Database     | External (Supabase/PG)  | Persistent knowledge, tasks, projects | PostgreSQL, PGVector           |

**Communication:**
- Inter-service traffic uses HTTP APIs.
- Socket.IO is used for pushing live updates to the frontend.
- MCP Protocol (over HTTP/SSE/stdio) is used for connecting AI coding assistants.

**Infrastructure Needs:**
- Requires Docker and Node.js for setup.
- Uses Supabase for the knowledge/task/project backend (both cloud and local setups supported).

***

### Example Workflows

- **Ingest documentation:** Crawl URLs or upload files; Archon chunks and embeds content for semantic search.
- **Set up projects and tasks:** Hierarchically organize software projects and link all relevant docs or code references.
- **AI Integration:** Connect an AI coding assistant through MCP; the assistant gains live access to all project docs and task history for best-in-class RAG-powered code suggestions.
- **Collaboration:** Multiple users and agents can update tasks or ingest new docs; all participants and AIs see live updates.

***

### Technical Stack

- **Languages:** Python (backend, ~59%), TypeScript (frontend, ~38%), bits of PLpgSQL, CSS, JS, Makefile.
- **Frameworks & Tools:** React, FastAPI, Tailwind CSS, PGVector, Docker, Supabase, Make.
- **License:** Archon Community License (open for use, forking, and modification, but with restrictions against SaaS resale without permission).

***

**Summary:**  
Archon provides a robust platform to **centralize, orchestrate, and automate context for AI coding assistants and developers**, improving both solo and collaborative work by fusing knowledge management and structured task execution for any codebase or project. It is highly modular, extensible, and designed for both power-users and large dev teams, especially those pushing the boundaries with agentic/AI-driven development workflows.

## Reference
[GitHub Repository](https://github.com/coleam00/Archon)
#!/usr/bin/env python3

"""
Example: How to use DevDigger database in Python projects

This script shows how to:
1. Connect to the DevDigger SQLite database
2. Query crawled data
3. Perform semantic search
4. Use with LangChain or other AI tools
"""

import sqlite3
import json
import os
from pathlib import Path
import numpy as np

# Path to DevDigger database
DB_PATH = Path.home() / "Library" / "Application Support" / "devdigger" / "devdigger.db"

class DevDiggerDB:
    """Interface to DevDigger knowledge database"""
    
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self.conn = sqlite3.connect(str(db_path))
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()
        
    def get_stats(self):
        """Get database statistics"""
        stats = {}
        tables = ['sources', 'documents', 'code_examples', 'collections']
        
        for table in tables:
            self.cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
            stats[table] = self.cursor.fetchone()['count']
            
        return stats
    
    def list_sources(self):
        """List all crawled sources"""
        self.cursor.execute("""
            SELECT id, type, url, title, crawl_status, created_at
            FROM sources
            ORDER BY created_at DESC
        """)
        return [dict(row) for row in self.cursor.fetchall()]
    
    def search(self, query, limit=10):
        """Full-text search across documents"""
        self.cursor.execute("""
            SELECT 
                d.id,
                d.content,
                d.source_id,
                s.url,
                s.title
            FROM documents d
            JOIN sources s ON d.source_id = s.id
            WHERE d.content LIKE ?
            LIMIT ?
        """, (f"%{query}%", limit))
        return [dict(row) for row in self.cursor.fetchall()]
    
    def get_documents(self, source_id=None):
        """Get all documents, optionally filtered by source"""
        if source_id:
            self.cursor.execute("""
                SELECT * FROM documents 
                WHERE source_id = ?
                ORDER BY chunk_index
            """, (source_id,))
        else:
            self.cursor.execute("SELECT * FROM documents")
        return [dict(row) for row in self.cursor.fetchall()]
    
    def get_code_examples(self, language=None):
        """Get code examples, optionally filtered by language"""
        if language:
            self.cursor.execute("""
                SELECT c.*, s.url as source_url
                FROM code_examples c
                JOIN sources s ON c.source_id = s.id
                WHERE c.language = ?
            """, (language,))
        else:
            self.cursor.execute("""
                SELECT c.*, s.url as source_url
                FROM code_examples c
                JOIN sources s ON c.source_id = s.id
            """)
        return [dict(row) for row in self.cursor.fetchall()]
    
    def get_embeddings(self):
        """Get documents with embeddings for vector search"""
        self.cursor.execute("""
            SELECT 
                d.id,
                d.content,
                d.embedding,
                s.url,
                s.title
            FROM documents d
            JOIN sources s ON d.source_id = s.id
            WHERE d.embedding IS NOT NULL
        """)
        
        results = []
        for row in self.cursor.fetchall():
            doc = dict(row)
            # Convert embedding from blob to numpy array
            if doc['embedding']:
                doc['embedding'] = np.frombuffer(doc['embedding'], dtype=np.float32)
            results.append(doc)
        return results
    
    def export_to_json(self, output_path="devdigger_export.json"):
        """Export entire database to JSON"""
        data = {
            'sources': self.list_sources(),
            'documents': self.get_documents(),
            'code_examples': self.get_code_examples()
        }
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        
        return output_path
    
    def to_langchain_documents(self):
        """Convert to LangChain Document format"""
        try:
            from langchain.schema import Document
        except ImportError:
            print("Install langchain: pip install langchain")
            return []
        
        documents = []
        for doc in self.get_documents():
            documents.append(Document(
                page_content=doc['content'],
                metadata={
                    'source_id': doc['source_id'],
                    'chunk_index': doc['chunk_index'],
                    'id': doc['id']
                }
            ))
        return documents
    
    def close(self):
        """Close database connection"""
        self.conn.close()


# ============================================
# USAGE EXAMPLES
# ============================================

def example_basic_usage():
    """Basic usage example"""
    print("=" * 60)
    print("DEVDIGGER DATABASE USAGE EXAMPLE")
    print("=" * 60)
    
    # Connect to database
    db = DevDiggerDB()
    
    # Get statistics
    stats = db.get_stats()
    print(f"\n📊 Database Statistics:")
    for table, count in stats.items():
        print(f"  {table}: {count}")
    
    if stats['sources'] == 0:
        print("\n⚠️  No data found! Please crawl some websites in DevDigger first.")
        return
    
    # List sources
    print(f"\n📚 Sources:")
    for source in db.list_sources()[:5]:
        print(f"  - {source['title'] or source['url']}")
    
    # Search for content
    print(f"\n🔍 Searching for 'react':")
    results = db.search("react", limit=3)
    for i, result in enumerate(results, 1):
        preview = result['content'][:100].replace('\n', ' ')
        print(f"  {i}. {preview}...")
    
    # Get code examples
    print(f"\n💻 Code Examples:")
    examples = db.get_code_examples()[:3]
    for example in examples:
        print(f"  - {example['language']}: {example.get('description', 'No description')}")
    
    db.close()


def example_with_openai():
    """Example using with OpenAI for RAG"""
    from openai import OpenAI
    
    # Initialize
    client = OpenAI()  # Uses OPENAI_API_KEY env var
    db = DevDiggerDB()
    
    # Get relevant documents
    query = "How do React hooks work?"
    docs = db.search(query, limit=5)
    
    # Create context from documents
    context = "\n\n".join([doc['content'] for doc in docs])
    
    # Generate response with context
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Answer based on the provided context."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
        ]
    )
    
    print(f"Answer: {response.choices[0].message.content}")
    db.close()


def example_with_langchain():
    """Example using with LangChain"""
    from langchain.vectorstores import Chroma
    from langchain.embeddings import OpenAIEmbeddings
    from langchain.chains import RetrievalQA
    from langchain.llms import OpenAI
    
    # Get documents from DevDigger
    db = DevDiggerDB()
    documents = db.to_langchain_documents()
    
    # Create vector store
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(documents, embeddings)
    
    # Create QA chain
    qa = RetrievalQA.from_chain_type(
        llm=OpenAI(),
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )
    
    # Ask questions
    result = qa.run("What is useState in React?")
    print(result)
    
    db.close()


if __name__ == "__main__":
    # Check if database exists
    if not DB_PATH.exists():
        print(f"❌ Database not found at: {DB_PATH}")
        print("\nPlease use DevDigger to crawl some data first!")
        exit(1)
    
    # Run basic example
    example_basic_usage()
    
    # Uncomment to run advanced examples:
    # example_with_openai()
    # example_with_langchain()
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentViewer from '../components/ContentViewer';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  score: number;
  type: string;
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('semantic');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [totalSources, setTotalSources] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await window.electronAPI.database.getStatistics();
      setTotalSources(stats.sources);
      setTotalDocuments(stats.documents);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    setResults([]);
    
    try {
      let searchResults: any[] = [];
      
      if (searchMode === 'semantic') {
        // Generate embedding for the query and perform semantic search
        const embedding = await window.electronAPI.embedding.generate(query);
        searchResults = await window.electronAPI.database.semanticSearch(embedding, {
          limit: 20,
          threshold: 0.5
        });
      } else {
        // Perform text-based search
        searchResults = await window.electronAPI.database.search(query, {
          limit: 20,
          searchType: 'text',
          sourceTypes: filterType === 'all' ? undefined : [filterType]
        });
      }
      
      // Transform results to match our interface
      const formattedResults: SearchResult[] = searchResults.map((result: any) => ({
        id: result.id,
        title: result.title || 'Untitled',
        excerpt: result.content ? result.content.substring(0, 200) + '...' : '',
        source: result.url || result.source_id || 'Unknown',
        score: Math.round((result.score || 0.5) * 100),
        type: result.type || 'document'
      }));
      
      setResults(formattedResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 200, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Search Your <span style={{ color: '#ff6b00', fontWeight: 300 }}>Knowledge</span>
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Semantic search through your excavated documentation and code artifacts.
        </p>
      </section>

      {/* Search Interface */}
      <section className="mining-interface" style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <label className="gallery-label">Search Query</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="gallery-input"
              placeholder="Enter your search query..."
              style={{ flex: 1 }}
            />
            <button
              onClick={handleSearch}
              className="gallery-button"
              disabled={!query || isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <div className="gallery-option">
            <span className="gallery-label">Search Mode</span>
            <select 
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
              className="gallery-select"
            >
              <option value="semantic">Semantic</option>
              <option value="exact">Exact Match</option>
              <option value="fuzzy">Fuzzy</option>
            </select>
          </div>
          <div className="gallery-option">
            <span className="gallery-label">Filter</span>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="gallery-select"
            >
              <option value="all">All Types</option>
              <option value="website">Website</option>
              <option value="documentation">Documentation</option>
              <option value="github">GitHub</option>
              <option value="file">File</option>
            </select>
          </div>
        </div>
      </section>

      {/* Statistics */}
      {!isSearching && results.length === 0 && (
        <section style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="mining-interface" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 200, color: '#ff6b00', marginBottom: '0.5rem' }}>
                {totalSources}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Sources Indexed
              </div>
            </div>
            <div className="mining-interface" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 200, color: '#ff6b00', marginBottom: '0.5rem' }}>
                {totalDocuments}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Documents Searchable
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <section style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 300 }}>Results</h2>
            <span style={{ color: '#ff6b00', fontSize: '0.875rem' }}>
              {results.length} matches found
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e6e6e6' }}>
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="data-layer"
                style={{ 
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 107, 0, 0.03), #ffffff)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                }}
                onClick={() => {
                  // Extract source_id from the result
                  const sourceId = result.source.includes('/') ? result.id : result.source;
                  setSelectedSourceId(sourceId);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                      {result.title}
                    </h3>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                      {result.excerpt}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {result.source}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>
                        {result.type}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 200, color: '#ff6b00' }}>
                      {result.score}%
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Match
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!isSearching && results.length === 0 && (
        <section style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 2rem',
            border: '2px solid #e6e6e6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px',
              border: '1px solid #ff6b00',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
          </div>
          <p style={{ color: '#999', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Ready to search your knowledge base
          </p>
        </section>
      )}

      {/* Content Viewer Modal */}
      {selectedSourceId && (
        <ContentViewer
          sourceId={selectedSourceId}
          onClose={() => setSelectedSourceId(null)}
        />
      )}
    </>
  );
}

export default SearchPage;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentViewer from '../components/ContentViewer';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  score: number;
  type: string;
  fromCache?: boolean;
}

interface SearchMetrics {
  duration: number;
  resultCount: number;
  cacheHit: boolean;
  cacheHitRate?: number;
  avgSearchTime?: number;
  memoryUsage?: number;
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('enhanced');
  const [pipelineProfile, setPipelineProfile] = useState('balanced');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [totalSources, setTotalSources] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchStage, setSearchStage] = useState('');
  const [searchMetrics, setSearchMetrics] = useState<SearchMetrics | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [enableReranking, setEnableReranking] = useState(true);
  const [enableContextual, setEnableContextual] = useState(true);
  const [enableCache, setEnableCache] = useState(true);
  const [memoryUsage, setMemoryUsage] = useState({ percentage: 0, used: 0, total: 0 });
  
  const progressUnsubscribe = useRef<(() => void) | null>(null);
  const completeUnsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    loadStatistics();
    loadSearchConfig();
    checkMemoryUsage();
    
    // Set up progress listeners
    if (window.electronAPI.search) {
      progressUnsubscribe.current = window.electronAPI.search.onProgress((data) => {
        setSearchProgress(data.progress * 100);
        setSearchStage(data.stage);
      });
      
      completeUnsubscribe.current = window.electronAPI.search.onComplete((data) => {
        setSearchMetrics(data);
      });
    }
    
    // Set up memory monitoring
    const memoryInterval = setInterval(checkMemoryUsage, 30000); // Check every 30 seconds
    
    return () => {
      progressUnsubscribe.current?.();
      completeUnsubscribe.current?.();
      clearInterval(memoryInterval);
    };
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await window.electronAPI.database.getStatistics();
      setTotalSources(stats.sources);
      setTotalDocuments(stats.documents);
      
      // Load search statistics if available
      if (window.electronAPI.search) {
        const searchStats = await window.electronAPI.search.getStatistics();
        if (searchStats) {
          setSearchMetrics(prev => ({
            ...prev,
            cacheHitRate: searchStats.cacheHitRate,
            avgSearchTime: searchStats.avgSearchTime
          } as SearchMetrics));
        }
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const loadSearchConfig = async () => {
    try {
      if (window.electronAPI.search) {
        const config = await window.electronAPI.search.getConfig();
        if (config) {
          setPipelineProfile(config.profile || 'balanced');
          setEnableReranking(config.enableReranking !== false);
          setEnableContextual(config.enableContextual !== false);
        }
      }
    } catch (error) {
      console.error('Failed to load search config:', error);
    }
  };

  const checkMemoryUsage = async () => {
    try {
      if (window.electronAPI.memory) {
        const usage = await window.electronAPI.memory.getUsage();
        setMemoryUsage({
          percentage: usage.percentage, // Now shows heap utilization
          used: usage.process?.rssMB || usage.used,
          total: usage.process?.rssGB || usage.total
        });
        
        // Auto cleanup if heap utilization is high (85% of allocated heap)
        if (usage.percentage > 85) {
          console.log('High heap utilization detected, triggering cleanup');
          await window.electronAPI.memory.cleanup(false);
        }
      }
    } catch (error) {
      console.error('Failed to check memory usage:', error);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    setResults([]);
    setSearchProgress(0);
    setSearchStage('');
    setSearchMetrics(null);
    
    try {
      let searchResults: any[] = [];
      
      if (searchMode === 'enhanced' && window.electronAPI.search) {
        // Use new enhanced search API
        searchResults = await window.electronAPI.search.enhanced(query, {
          profile: pipelineProfile,
          limit: 20,
          context: {
            documentType: filterType === 'all' ? undefined : filterType,
            userIntent: 'search'
          },
          rerank: enableReranking,
          useCache: enableCache
        });
      } else if (searchMode === 'semantic') {
        // Fallback to legacy semantic search
        const embedding = await window.electronAPI.embedding.generate(query);
        searchResults = await window.electronAPI.database.semanticSearch(embedding, {
          limit: 20,
          threshold: 0.5
        });
      } else {
        // Fallback to text-based search
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
        type: result.type || 'document',
        fromCache: result.fromCache || false
      }));
      
      setResults(formattedResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
      setSearchProgress(100);
    }
  };

  const handleProfileChange = async (profile: string) => {
    setPipelineProfile(profile);
    
    // Save preference
    if (window.electronAPI.search) {
      await window.electronAPI.search.configure({ profile });
    }
  };

  const handleAdvancedToggle = async () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleClearCache = async () => {
    if (window.electronAPI.search) {
      await window.electronAPI.search.clearCache();
      alert('Search cache cleared successfully');
    }
  };

  const formatMemory = (mb: number) => {
    if (mb < 1024) {
      return mb.toFixed(1) + ' MB';
    } else {
      return (mb / 1024).toFixed(2) + ' GB';
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
          AI-powered search with neural reranking and contextual understanding.
        </p>
      </section>

      {/* Performance Metrics Bar */}
      {searchMetrics && (
        <section style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          <div style={{ 
            background: 'white', 
            padding: '1rem', 
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-around',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Search Time</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{searchMetrics.duration}ms</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Results</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{searchMetrics.resultCount}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Cache Hit</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: searchMetrics.cacheHit ? '#10b981' : '#ef4444' }}>
                {searchMetrics.cacheHit ? 'Yes' : 'No'}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>App Memory</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: memoryUsage.percentage > 80 ? '#ef4444' : '#10b981' }}>
                {formatMemory(memoryUsage.used)}
              </div>
            </div>
          </div>
        </section>
      )}

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

        {/* Progress Bar */}
        {isSearching && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              {searchStage || 'Initializing...'}
            </div>
            <div style={{ background: '#e5e5e5', borderRadius: '4px', height: '8px' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${searchProgress}%` }}
                style={{ background: '#ff6b00', height: '100%', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
          <div className="gallery-option">
            <span className="gallery-label">Search Mode</span>
            <select 
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
              className="gallery-select"
            >
              <option value="enhanced">Enhanced (AI)</option>
              <option value="semantic">Semantic</option>
              <option value="exact">Exact Match</option>
              <option value="fuzzy">Fuzzy</option>
            </select>
          </div>
          
          {searchMode === 'enhanced' && (
            <div className="gallery-option">
              <span className="gallery-label">Pipeline Profile</span>
              <select 
                value={pipelineProfile}
                onChange={(e) => handleProfileChange(e.target.value)}
                className="gallery-select"
              >
                <option value="fast">Fast (200ms)</option>
                <option value="balanced">Balanced (500ms)</option>
                <option value="accurate">Accurate (1-2s)</option>
                <option value="research">Research (Deep)</option>
              </select>
            </div>
          )}
          
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

        {/* Advanced Options Toggle */}
        {searchMode === 'enhanced' && (
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={handleAdvancedToggle}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff6b00',
                cursor: 'pointer',
                fontSize: '0.875rem',
                padding: '0.5rem 0'
              }}
            >
              {showAdvanced ? '▼' : '▶'} Advanced Options
            </button>
            
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ 
                    background: 'white', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    marginTop: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={enableReranking}
                        onChange={(e) => setEnableReranking(e.target.checked)}
                      />
                      <span>Enable Neural Reranking (Cross-Encoder)</span>
                    </label>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={enableContextual}
                        onChange={(e) => setEnableContextual(e.target.checked)}
                      />
                      <span>Enable Contextual Embeddings (LLM Enhancement)</span>
                    </label>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={enableCache}
                        onChange={(e) => setEnableCache(e.target.checked)}
                      />
                      <span>Use Cache (Semantic Similarity Matching)</span>
                    </label>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={handleClearCache}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Clear Cache
                      </button>
                      
                      <button
                        onClick={() => window.electronAPI.memory?.cleanup(true)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#fee2e2',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Clean Memory
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Statistics */}
      {!isSearching && results.length === 0 && (
        <section style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div className="gallery-stat-card">
              <h3 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {totalSources}
              </h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>Sources Indexed</p>
            </div>
            <div className="gallery-stat-card">
              <h3 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {totalDocuments}
              </h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>Documents Available</p>
            </div>
            <div className="gallery-stat-card">
              <h3 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {formatMemory(memoryUsage.used)}
              </h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>App Memory</p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {results.length > 0 && (
        <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 300 }}>
              Found {results.length} Results
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              {results.filter(r => r.fromCache).length} from cache
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {results.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="gallery-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedSourceId(result.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                    {result.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {result.fromCache && (
                      <span style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        CACHED
                      </span>
                    )}
                    <span style={{ 
                      background: '#ff6b00', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}>
                      {result.score}%
                    </span>
                  </div>
                </div>
                
                <p style={{ color: '#666', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {result.excerpt}
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#999' }}>
                  <span>{result.type}</span>
                  <span>•</span>
                  <span>{result.source}</span>
                </div>
              </motion.div>
            ))}
          </div>
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
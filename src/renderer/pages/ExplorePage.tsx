import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentViewer from '../components/ContentViewer';

interface Discovery {
  id: string;
  title: string;
  source: string;
  type: string;
  timestamp: string;
  relevance: number;
  url?: string;
  description?: string;
  codeCount?: number;
}

function ExplorePage() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeExamples, setCodeExamples] = useState<any[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    totalSources: 0,
    totalDocuments: 0,
    totalCodeExamples: 0,
    processedPercentage: 0
  });

  useEffect(() => {
    loadDiscoveries();
  }, [filter, sortBy]);

  const loadDiscoveries = async () => {
    setLoading(true);
    try {
      // Load statistics
      const stats = await window.electronAPI.database.getStatistics();
      const completedSources = await window.electronAPI.database.getSources();
      const completedCount = completedSources.filter((s: any) => s.crawl_status === 'completed').length;
      const processedPercentage = stats.sources > 0 ? Math.round((completedCount / stats.sources) * 100) : 0;
      
      setStatistics({
        totalSources: stats.sources || 0,
        totalDocuments: stats.documents || 0,
        totalCodeExamples: stats.codeExamples || 0,
        processedPercentage: processedPercentage
      });
      
      // Load sources
      const sources = await window.electronAPI.database.getSources(
        filter === 'all' ? undefined : filter
      );
      
      // Load code examples
      const codes = await window.electronAPI.database.getCodeExamples();
      setCodeExamples(codes);
      
      // Transform sources to discoveries
      const formattedDiscoveries: Discovery[] = sources.map((source: any) => {
        const sourceCodeCount = codes.filter((c: any) => c.source_id === source.id).length;
        const timeAgo = getTimeAgo(new Date(source.created_at || source.last_crawled));
        
        return {
          id: source.id,
          title: source.title || 'Untitled Source',
          source: new URL(source.url).hostname,
          type: source.type || 'website',
          timestamp: timeAgo,
          relevance: Math.floor(Math.random() * 20) + 80, // TODO: Calculate real relevance
          url: source.url,
          description: source.description,
          codeCount: sourceCodeCount
        };
      });
      
      // Sort discoveries
      if (sortBy === 'recent') {
        formattedDiscoveries.sort((a, b) => b.id.localeCompare(a.id));
      } else if (sortBy === 'relevance') {
        formattedDiscoveries.sort((a, b) => b.relevance - a.relevance);
      } else if (sortBy === 'source') {
        formattedDiscoveries.sort((a, b) => a.source.localeCompare(b.source));
      }
      
      setDiscoveries(formattedDiscoveries);
    } catch (error) {
      console.error('Failed to load discoveries:', error);
      setDiscoveries([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  const handleOpenSource = async (url: string) => {
    await window.electronAPI.system.openExternal(url);
  };

  const handleViewContent = (sourceId: string) => {
    setSelectedSourceId(sourceId);
  };

  const handleCloseViewer = () => {
    setSelectedSourceId(null);
  };

  const typeColors: Record<string, string> = {
    documentation: '#ff6b00',
    website: '#ff6b00',
    github: '#10b981',
    file: '#6366f1',
    code: '#10b981',
    api: '#6366f1',
    guide: '#8b5cf6'
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 200, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Explore Your <span style={{ color: '#ff6b00', fontWeight: 300 }}>Discoveries</span>
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Navigate through the knowledge fragments unearthed from your digital excavations.
        </p>
      </section>

      {/* Filter Bar */}
      <section className="mining-interface" style={{ maxWidth: '1000px', margin: '0 auto 3rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <span className="gallery-label">Filter</span>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="gallery-select"
                style={{ minWidth: '150px' }}
              >
                <option value="all">All Types</option>
                <option value="website">Websites</option>
                <option value="documentation">Documentation</option>
                <option value="github">GitHub</option>
                <option value="file">Files</option>
              </select>
            </div>
            <div>
              <span className="gallery-label">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="gallery-select"
                style={{ minWidth: '150px' }}
              >
                <option value="recent">Most Recent</option>
                <option value="relevance">Relevance</option>
                <option value="source">Source</option>
              </select>
            </div>
          </div>
          
          <div className="gallery-metric">
            <span style={{ fontSize: '2rem', fontWeight: 200, color: '#ff6b00' }}>
              {loading ? '...' : discoveries.length}
            </span>
            <span style={{ marginLeft: '0.5rem', color: '#999', fontSize: '0.875rem' }}>
              discoveries
            </span>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section style={{ maxWidth: '1000px', margin: '0 auto 4rem', textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: '#999' }}>Loading discoveries...</p>
        </section>
      )}

      {/* Empty State */}
      {!loading && discoveries.length === 0 && (
        <section style={{ maxWidth: '1000px', margin: '0 auto 4rem', textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: '#999', marginBottom: '2rem' }}>No discoveries yet. Start mining to unearth knowledge!</p>
          <button 
            className="gallery-button"
            onClick={() => window.location.href = '#/mine'}
          >
            Start Mining
          </button>
        </section>
      )}

      {/* Discoveries Grid */}
      {!loading && discoveries.length > 0 && (
      <section style={{ maxWidth: '1000px', margin: '0 auto 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#e6e6e6' }}>
          {discoveries.map((discovery, index) => (
            <motion.div
              key={discovery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="data-layer"
              style={{ 
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255, 107, 0, 0.03), #ffffff)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
              onClick={() => handleViewContent(discovery.id)}
            >
              {/* Type Badge */}
              <div style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: typeColors[discovery.type] || '#999'
              }} />
              
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 300, 
                marginBottom: '0.5rem',
                letterSpacing: '-0.01em'
              }}>
                {discovery.title}
              </h3>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {discovery.source}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#999' }}>
                  {discovery.timestamp}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  color: '#666'
                }}>
                  {discovery.type}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '2px', 
                    background: '#e6e6e6',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${discovery.relevance}%`,
                      background: '#ff6b00'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>
                    {discovery.relevance}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* Summary Stats */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="progress-line" style={{ marginBottom: '3rem' }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}>
          <div className="gallery-metric">
            <div className="metric-value">{statistics.totalDocuments.toLocaleString()}</div>
            <div className="metric-label">Total Documents</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value accent">{statistics.totalSources}</div>
            <div className="metric-label">Sources</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value">{statistics.processedPercentage}%</div>
            <div className="metric-label">Processed</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value">{statistics.totalCodeExamples}</div>
            <div className="metric-label">Code Examples</div>
          </div>
        </div>
      </section>

      {/* Content Viewer Modal */}
      {selectedSourceId && (
        <ContentViewer
          sourceId={selectedSourceId}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
}

export default ExplorePage;
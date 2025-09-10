import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Collection {
  id: string;
  name: string;
  itemCount: number;
  size: string;
  lastModified: string;
  type: 'documentation' | 'code' | 'mixed' | 'research' | 'website' | 'github' | 'file';
}

function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('modified');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalCollections: 0,
    totalItems: 0,
    totalSize: 0,
    totalExports: 0
  });

  useEffect(() => {
    loadCollections();
  }, [filter, sortBy]);

  const loadCollections = async () => {
    setLoading(true);
    try {
      // Load all sources and group them by type/domain as collections
      const sources = await window.electronAPI.database.getSources();
      const stats = await window.electronAPI.database.getStatistics();
      
      // Group sources by domain/type to create collections
      const groupedCollections = new Map<string, any>();
      
      for (const source of sources) {
        // Group by domain for websites, or by type for other sources
        let collectionKey = '';
        let collectionName = '';
        let collectionType = source.type || 'website';
        
        try {
          if (source.url && source.url.startsWith('http')) {
            const url = new URL(source.url);
            collectionKey = url.hostname;
            collectionName = url.hostname.replace('www.', '');
          } else {
            collectionKey = source.type || 'misc';
            collectionName = source.type || 'Miscellaneous';
          }
        } catch {
          collectionKey = source.type || 'misc';
          collectionName = source.type || 'Miscellaneous';
        }
        
        if (!groupedCollections.has(collectionKey)) {
          groupedCollections.set(collectionKey, {
            id: collectionKey,
            name: collectionName,
            sources: [],
            type: collectionType,
            documentCount: 0,
            totalSize: 0,
            lastModified: source.created_at || source.updated_at
          });
        }
        
        const collection = groupedCollections.get(collectionKey);
        collection.sources.push(source);
        
        // Update last modified if this source is newer
        if (source.created_at > collection.lastModified) {
          collection.lastModified = source.created_at;
        }
      }
      
      // Load documents count for each source to calculate total size
      const documentsPromises = Array.from(groupedCollections.values()).map(async (collection) => {
        let totalDocs = 0;
        for (const source of collection.sources) {
          const docs = await window.electronAPI.database.getDocuments(source.id);
          totalDocs += docs.length;
        }
        collection.documentCount = totalDocs;
        // Estimate size based on document count (rough estimate)
        collection.totalSize = totalDocs * 1024; // Assume ~1KB per document
        return collection;
      });
      
      await Promise.all(documentsPromises);
      
      // Convert to Collection format
      const formattedCollections: Collection[] = Array.from(groupedCollections.values()).map(col => ({
        id: col.id,
        name: col.name,
        itemCount: col.documentCount,
        size: formatSize(col.totalSize),
        lastModified: getTimeAgo(new Date(col.lastModified)),
        type: mapType(col.type)
      }));
      
      // Apply filter
      let filteredCollections = formattedCollections;
      if (filter !== 'all') {
        filteredCollections = formattedCollections.filter(c => c.type === filter);
      }
      
      // Apply sorting
      filteredCollections.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'size':
            return parseSize(b.size) - parseSize(a.size);
          case 'items':
            return b.itemCount - a.itemCount;
          case 'modified':
          default:
            return 0; // Already sorted by modified date
        }
      });
      
      setCollections(filteredCollections);
      
      // Calculate total statistics
      const totalItems = formattedCollections.reduce((sum, col) => sum + col.itemCount, 0);
      const totalSize = formattedCollections.reduce((sum, col) => sum + parseSize(col.size), 0);
      
      setStatistics({
        totalCollections: formattedCollections.length,
        totalItems: totalItems,
        totalSize: totalSize,
        totalExports: 0 // No exports tracked yet
      });
      
    } catch (error) {
      console.error('Failed to load collections:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const parseSize = (sizeStr: string): number => {
    const match = sizeStr.match(/^([\d.]+)\s*([KMGT]?B)$/);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2];
    switch (unit) {
      case 'KB': return value * 1024;
      case 'MB': return value * 1024 * 1024;
      case 'GB': return value * 1024 * 1024 * 1024;
      default: return value;
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

  const mapType = (type: string): any => {
    switch (type) {
      case 'documentation': return 'documentation';
      case 'github': return 'code';
      case 'website': return 'mixed';
      case 'file': return 'documentation';
      default: return 'mixed';
    }
  };

  const typeIcons = {
    documentation: '📚',
    code: '💻',
    mixed: '🔀',
    research: '🔬',
    website: '🌐',
    github: '🐙',
    file: '📄'
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 200, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Knowledge <span style={{ color: '#ff6b00', fontWeight: 300 }}>Archive</span>
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Organized collections of your excavated knowledge, ready for exploration and export.
        </p>
      </section>

      {/* Controls Bar */}
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
                <option value="all">All Collections</option>
                <option value="documentation">Documentation</option>
                <option value="code">Code</option>
                <option value="mixed">Mixed</option>
                <option value="research">Research</option>
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
                <option value="modified">Last Modified</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="items">Item Count</option>
              </select>
            </div>
          </div>
          
          <button className="gallery-button">
            New Collection
          </button>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section style={{ maxWidth: '1000px', margin: '0 auto 4rem', textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: '#999' }}>Loading collections...</p>
        </section>
      )}

      {/* Empty State */}
      {!loading && collections.length === 0 && (
        <section style={{ maxWidth: '1000px', margin: '0 auto 4rem', textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: '#999', marginBottom: '2rem' }}>No collections yet. Start mining to create knowledge collections!</p>
          <button 
            className="gallery-button"
            onClick={() => window.location.href = '#/mine'}
          >
            Start Mining
          </button>
        </section>
      )}

      {/* Collections Grid */}
      {!loading && collections.length > 0 && (
        <section style={{ maxWidth: '1000px', margin: '0 auto 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e6e6e6' }}>
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="data-layer"
                style={{ 
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255, 107, 0, 0.03), #ffffff)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{typeIcons[collection.type] || '📦'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>{collection.lastModified}</span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 400, 
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.01em'
                  }}>
                    {collection.name}
                  </h3>
                  
                  <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {collection.type}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 200, color: '#ff6b00' }}>
                      {collection.itemCount}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>items</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#666' }}>
                    {collection.size}
                  </span>
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
            <div className="metric-value">{statistics.totalCollections}</div>
            <div className="metric-label">Collections</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value accent">{statistics.totalItems.toLocaleString()}</div>
            <div className="metric-label">Total Items</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value">{formatSize(statistics.totalSize)}</div>
            <div className="metric-label">Total Size</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value">{statistics.totalExports}</div>
            <div className="metric-label">Exports</div>
          </div>
        </div>
      </section>

      {/* Oracle Message */}
      <section className="oracle-message">
        <p>
          "Your knowledge archive grows with each excavation. Collections preserve the wisdom for future exploration."
        </p>
      </section>
    </>
  );
}

export default CollectionsPage;
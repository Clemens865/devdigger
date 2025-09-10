import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function MiningPage() {
  const [url, setUrl] = useState('https://react.dev/learn');
  const [isActive, setIsActive] = useState(false);
  const [depth, setDepth] = useState('3 layers');
  const [strategy, setStrategy] = useState('Documentation');
  const [quality, setQuality] = useState('Standard');
  const [progress, setProgress] = useState({ 
    current: 0, 
    total: 0, 
    currentUrl: '',
    pagesScraped: 0,
    codeExamples: 0
  });
  const [recentSources, setRecentSources] = useState<any[]>([]);

  useEffect(() => {
    // Listen for crawl progress updates
    const unsubscribeProgress = window.electronAPI.scraper.onProgress((data: any) => {
      setProgress({
        current: data.current,
        total: data.total,
        currentUrl: data.url || data.currentUrl,
        pagesScraped: data.current,
        codeExamples: 0
      });
    });

    // Load recent sources
    loadRecentSources();

    return () => {
      unsubscribeProgress();
    };
  }, []);

  const loadRecentSources = async () => {
    try {
      const sources = await window.electronAPI.database.getSources('website');
      setRecentSources(sources.slice(0, 5));
    } catch (error) {
      console.error('Failed to load sources:', error);
    }
  };

  const handleCommence = async () => {
    if (!url || isActive) return;
    
    setIsActive(true);
    setProgress({ current: 0, total: 0, currentUrl: '', pagesScraped: 0, codeExamples: 0 });
    
    try {
      // Parse depth setting
      const maxDepth = depth === '∞ infinite' ? 10 : parseInt(depth);
      const maxPages = strategy === 'Complete Site' ? 500 : strategy === 'Code Examples' ? 200 : 100;
      
      // Start crawling
      await window.electronAPI.scraper.crawl(url, {
        depth: maxDepth,
        maxPages,
        strategy: strategy.toLowerCase().replace(' ', '_')
      });
      
      // Reload sources after crawl completes
      await loadRecentSources();
    } catch (error) {
      console.error('Crawl failed:', error);
    } finally {
      setIsActive(false);
    }
  };

  const handleStop = () => {
    window.electronAPI.scraper.stop();
    setIsActive(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 200, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Excavate <span style={{ color: '#ff6b00', fontWeight: 300 }}>Knowledge</span>
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Transform documentation into wisdom through methodical digital archaeology. Every insight carefully extracted and catalogued.
        </p>
      </section>

      {/* Mining Interface */}
      <section className="mining-interface" style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <label className="gallery-label">Mining Location</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="gallery-input"
              placeholder="https://"
              style={{ flex: 1 }}
            />
            <button
              onClick={isActive ? handleStop : handleCommence}
              className="gallery-button"
              disabled={!url}
              style={isActive ? { background: '#dc2626', borderColor: '#dc2626' } : {}}
            >
              {isActive ? 'Stop' : 'Commence'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
          <div className="gallery-option">
            <span className="gallery-label">Depth</span>
            <select 
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="gallery-select"
            >
              <option>3 layers</option>
              <option>5 layers</option>
              <option>∞ infinite</option>
            </select>
          </div>
          <div className="gallery-option">
            <span className="gallery-label">Strategy</span>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="gallery-select"
            >
              <option>Documentation</option>
              <option>Code Examples</option>
              <option>Complete Site</option>
            </select>
          </div>
          <div className="gallery-option">
            <span className="gallery-label">Quality</span>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="gallery-select"
            >
              <option>Standard</option>
              <option>High Precision</option>
              <option>Maximum Detail</option>
            </select>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="progress-line" style={{ marginBottom: '3rem' }}>
          {isActive && progress.total > 0 && (
            <div className="progress-fill" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}>
          <div className="gallery-metric">
            <div className="metric-value">{progress.pagesScraped}</div>
            <div className="metric-label">Pages Analyzed</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value accent">{progress.codeExamples}</div>
            <div className="metric-label">Code Examples</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value">{progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%</div>
            <div className="metric-label">Completion</div>
          </div>
          <div className="gallery-metric">
            <div className="metric-value">{isActive ? 'Mining' : 'Ready'}</div>
            <div className="metric-label">Status</div>
          </div>
        </div>
        
        {isActive && progress.currentUrl && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px', border: '1px solid #e6e6e6' }}>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Currently processing:</p>
            <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#333', wordBreak: 'break-all' }}>
              {progress.currentUrl}
            </p>
          </div>
        )}
      </section>

      {/* Data Layers */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e6e6e6', marginBottom: '4rem' }}>
        <div className={`data-layer ${isActive ? 'active' : ''}`}>
          <div className="layer-bg">I</div>
          <div className="layer-label">Surface</div>
          <div className="layer-count">89</div>
        </div>
        <div className={`data-layer ${isActive ? 'active' : ''}`}>
          <div className="layer-bg">II</div>
          <div className="layer-label">Shallow</div>
          <div className="layer-count">134</div>
        </div>
        <div className="data-layer">
          <div className="layer-bg">III</div>
          <div className="layer-label">Deep</div>
          <div className="layer-count">24</div>
        </div>
      </section>

      {/* Oracle Message */}
      <section className="oracle-message">
        <p>
          "The digital stratum reveals its secrets methodically. Each layer of knowledge now catalogued and ready for integration into your development workflow."
        </p>
      </section>
    </>
  );
}

export default MiningPage;
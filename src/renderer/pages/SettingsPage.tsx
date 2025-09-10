import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SettingSection {
  id: string;
  title: string;
  icon: string;
}

function SettingsPage() {
  const [embeddingModel, setEmbeddingModel] = useState('local');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [crawlDepth, setCrawlDepth] = useState('3');
  const [quality, setQuality] = useState('standard');
  const [autoExport, setAutoExport] = useState(false);
  const [dbStats, setDbStats] = useState({ sources: 0, documents: 0, size: '0 MB' });
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      // Check if API key exists
      const apiKey = await window.electronAPI.database.getSetting('openai_api_key');
      setHasApiKey(!!apiKey && apiKey.length > 0);
      
      // Load embedding model preference
      const model = await window.electronAPI.database.getSetting('embedding_model');
      if (model) setEmbeddingModel(model);
      
      // Load database statistics
      const stats = await window.electronAPI.database.getStatistics();
      const sizeInMB = (stats.totalSize / (1024 * 1024)).toFixed(1);
      setDbStats({
        sources: stats.sources,
        documents: stats.documents,
        size: `${sizeInMB} MB`
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };
  
  const sections: SettingSection[] = [
    { id: 'model', title: 'Embedding Model', icon: '🧠' },
    { id: 'api', title: 'API Configuration', icon: '🔑' },
    { id: 'database', title: 'Database', icon: '💾' },
    { id: 'crawling', title: 'Crawling Preferences', icon: '🕷️' },
    { id: 'integration', title: 'Claude Integration', icon: '🤖' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 200, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Settings & <span style={{ color: '#ff6b00', fontWeight: 300 }}>Configuration</span>
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Fine-tune DevDigger's excavation parameters and integration options.
        </p>
      </section>

      {/* Settings Grid */}
      <section style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Embedding Model */}
        <div className="mining-interface" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Embedding Model
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <label 
              style={{ 
                padding: '1.5rem',
                border: `2px solid ${embeddingModel === 'local' ? '#ff6b00' : '#e6e6e6'}`,
                background: embeddingModel === 'local' ? 'rgba(255, 107, 0, 0.03)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="radio"
                name="embedding"
                value="local"
                checked={embeddingModel === 'local'}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontWeight: 400 }}>Local (Ollama)</span>
              <p style={{ fontSize: '0.875rem', color: '#999', marginTop: '0.5rem' }}>
                Uses local Ollama server for privacy
              </p>
            </label>
            
            <label 
              style={{ 
                padding: '1.5rem',
                border: `2px solid ${embeddingModel === 'openai' ? '#ff6b00' : '#e6e6e6'}`,
                background: embeddingModel === 'openai' ? 'rgba(255, 107, 0, 0.03)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="radio"
                name="embedding"
                value="openai"
                checked={embeddingModel === 'openai'}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontWeight: 400 }}>OpenAI</span>
              <p style={{ fontSize: '0.875rem', color: '#999', marginTop: '0.5rem' }}>
                Cloud-based, requires API key
              </p>
            </label>
          </div>
        </div>

        {/* API Configuration */}
        <div className="mining-interface" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔑</span> API Configuration
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div>
              <span className="gallery-label">OpenAI API Key Status</span>
              <div style={{ 
                marginTop: '0.5rem',
                padding: '0.75rem 1rem',
                background: hasApiKey ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${hasApiKey ? '#22c55e' : '#ef4444'}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{hasApiKey ? '✓' : '✗'}</span>
                <span style={{ color: hasApiKey ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                  {hasApiKey ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                {hasApiKey 
                  ? 'API key is set. OpenAI embeddings are available.'
                  : 'No API key. Using fallback embedding method.'}
              </p>
            </div>
            
            <div>
              <span className="gallery-label">Configuration</span>
              <button 
                className="gallery-button" 
                style={{ 
                  marginTop: '0.5rem',
                  background: 'transparent', 
                  border: '1px solid #ff6b00', 
                  color: '#ff6b00',
                  fontSize: '0.875rem',
                  padding: '0.5rem 1rem'
                }}
                onClick={() => {
                  // Open settings from menu
                  window.electronAPI.system.openExternal('devdigger://settings');
                }}
              >
                {hasApiKey ? 'Update API Key' : 'Add API Key'}
              </button>
              <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                Use Cmd+, to open settings
              </p>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="mining-interface" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💾</span> Database
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <span className="gallery-label">Location</span>
              <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#666' }}>
                ~/Library/Application Support/DevDigger
              </p>
            </div>
            <div>
              <span className="gallery-label">Database Size</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 200, color: '#ff6b00' }}>
                {dbStats.size}
              </p>
            </div>
            <div>
              <span className="gallery-label">Documents</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 200 }}>
                {dbStats.documents}
              </p>
            </div>
            <div>
              <span className="gallery-label">Sources</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 200 }}>
                {dbStats.sources}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="gallery-button" style={{ background: 'transparent', border: '1px solid #ff6b00', color: '#ff6b00' }}>
              Export Database
            </button>
            <button className="gallery-button" style={{ background: 'transparent', border: '1px solid #e6e6e6', color: '#666' }}>
              Import Database
            </button>
          </div>
        </div>

        {/* Crawling Preferences */}
        <div className="mining-interface" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🕷️</span> Crawling Preferences
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div>
              <span className="gallery-label">Default Depth</span>
              <select 
                value={crawlDepth}
                onChange={(e) => setCrawlDepth(e.target.value)}
                className="gallery-select"
                style={{ width: '100%' }}
              >
                <option value="1">1 layer</option>
                <option value="3">3 layers</option>
                <option value="5">5 layers</option>
                <option value="infinite">∞ infinite</option>
              </select>
            </div>
            
            <div>
              <span className="gallery-label">Quality</span>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="gallery-select"
                style={{ width: '100%' }}
              >
                <option value="standard">Standard</option>
                <option value="high">High Precision</option>
                <option value="maximum">Maximum Detail</option>
              </select>
            </div>
            
            <div>
              <span className="gallery-label">Auto Export</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoExport}
                  onChange={(e) => setAutoExport(e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                  Export after crawl
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Claude Integration */}
        <div className="mining-interface" style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span> Claude Integration
          </h3>
          
          <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            DevDigger can integrate with Claude Code and Claude Flow to enhance your coding experience 
            with excavated knowledge directly accessible in your AI assistant.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="gallery-button">
              Configure MCP Server
            </button>
            <button className="gallery-button" style={{ background: 'transparent', border: '1px solid #e6e6e6', color: '#666' }}>
              Test Connection
            </button>
          </div>
        </div>
      </section>

      {/* Oracle Message */}
      <section className="oracle-message">
        <p>
          "Configure the oracle's vision. Each setting shapes how knowledge is excavated and preserved."
        </p>
      </section>
    </>
  );
}

export default SettingsPage;
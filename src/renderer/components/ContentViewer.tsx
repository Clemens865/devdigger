import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentViewerProps {
  sourceId: string;
  onClose: () => void;
}

interface Document {
  id: string;
  content: string;
  chunk_index: number;
  metadata?: any;
}

interface CodeExample {
  id: string;
  language: string;
  code: string;
  description?: string;
}

function ContentViewer({ sourceId, onClose }: ContentViewerProps) {
  const [source, setSource] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [codeExamples, setCodeExamples] = useState<CodeExample[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'code'>('content');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSourceContent();
  }, [sourceId]);

  const loadSourceContent = async () => {
    setLoading(true);
    try {
      // Load source details
      const sourceData = await window.electronAPI.database.getSource(sourceId);
      setSource(sourceData);

      // Load documents
      const docs = await window.electronAPI.database.getDocuments(sourceId);
      setDocuments(docs.sort((a: Document, b: Document) => a.chunk_index - b.chunk_index));

      // Load code examples
      const codes = await window.electronAPI.database.getCodeExamples(sourceId);
      setCodeExamples(codes);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          style={{
            background: '#ffffff',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '1200px',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '2rem',
            borderBottom: '1px solid #e6e6e6',
            background: 'linear-gradient(180deg, #ffffff, #fafafa)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 300, 
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em'
                }}>
                  {source?.title || 'Content Viewer'}
                </h2>
                <div style={{ display: 'flex', gap: '2rem', color: '#666', fontSize: '0.875rem' }}>
                  <span>{source?.url}</span>
                  <span>{documents.length} chunks</span>
                  <span>{codeExamples.length} code examples</span>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#999',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setActiveTab('content')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 0',
                  fontSize: '0.875rem',
                  color: activeTab === 'content' ? '#ff6b00' : '#666',
                  borderBottom: activeTab === 'content' ? '2px solid #ff6b00' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Text Content ({documents.length})
              </button>
              <button
                onClick={() => setActiveTab('code')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 0',
                  fontSize: '0.875rem',
                  color: activeTab === 'code' ? '#ff6b00' : '#666',
                  borderBottom: activeTab === 'code' ? '2px solid #ff6b00' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Code Examples ({codeExamples.length})
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '2rem'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                Loading content...
              </div>
            ) : (
              <>
                {/* Text Content Tab */}
                {activeTab === 'content' && (
                  <div>
                    {documents.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                        No text content available for this source.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {documents.map((doc, index) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                              background: '#fafafa',
                              borderRadius: '8px',
                              padding: '1.5rem',
                              position: 'relative'
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              top: '1rem',
                              right: '1rem',
                              fontSize: '0.75rem',
                              color: '#999',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em'
                            }}>
                              Chunk {doc.chunk_index + 1}
                            </div>
                            <p style={{
                              fontSize: '0.95rem',
                              lineHeight: 1.7,
                              color: '#333',
                              margin: 0,
                              whiteSpace: 'pre-wrap'
                            }}>
                              {doc.content}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Code Examples Tab */}
                {activeTab === 'code' && (
                  <div>
                    {codeExamples.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                        No code examples found in this source.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {codeExamples.map((example, index) => (
                          <motion.div
                            key={example.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                              background: '#1a1a1a',
                              borderRadius: '8px',
                              overflow: 'hidden'
                            }}
                          >
                            <div style={{
                              padding: '1rem 1.5rem',
                              background: '#0d0d0d',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  color: '#ff6b00',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.1em'
                                }}>
                                  {example.language}
                                </span>
                                {example.description && (
                                  <span style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {example.description}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => copyToClipboard(example.code)}
                                style={{
                                  background: 'none',
                                  border: '1px solid #333',
                                  borderRadius: '4px',
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.75rem',
                                  color: '#666',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#ff6b00';
                                  e.currentTarget.style.color = '#ff6b00';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#333';
                                  e.currentTarget.style.color = '#666';
                                }}
                              >
                                Copy
                              </button>
                            </div>
                            <pre style={{
                              margin: 0,
                              padding: '1.5rem',
                              overflow: 'auto',
                              maxHeight: '400px'
                            }}>
                              <code style={{
                                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                fontSize: '0.875rem',
                                lineHeight: 1.6,
                                color: '#e6e6e6'
                              }}>
                                {example.code}
                              </code>
                            </pre>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid #e6e6e6',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Source ID: {sourceId}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.electronAPI.system.openExternal(source?.url)}
                className="gallery-button"
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
              >
                Open Original
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem 1.5rem',
                  fontSize: '0.875rem',
                  background: '#f5f5f5',
                  border: '1px solid #e6e6e6',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ContentViewer;
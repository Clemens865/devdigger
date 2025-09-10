import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MiningPage from './pages/MiningPage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import CollectionsPage from './pages/CollectionsPage';
import SettingsPage from './pages/SettingsPage';
import './styles/gallery.css';

type Page = 'mine' | 'explore' | 'search' | 'archive' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('mine');

  const navigation = [
    { id: 'mine', label: 'Mine' },
    { id: 'explore', label: 'Explore' },
    { id: 'search', label: 'Search' },
    { id: 'archive', label: 'Archive' },
    { id: 'settings', label: 'Settings' },
  ] as const;

  const renderPage = () => {
    switch (currentPage) {
      case 'mine':
        return <MiningPage />;
      case 'explore':
        return <ExplorePage />;
      case 'search':
        return <SearchPage />;
      case 'archive':
        return <CollectionsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <MiningPage />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#fafafa' }}>
      {/* Gallery Header */}
      <header className="gallery-header">
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="gallery-logo">DevDigger</div>
            
            <ul className="gallery-nav">
              {navigation.map((item) => (
                <li key={item.id} style={{ listStyle: 'none' }}>
                  <button
                    onClick={() => setCurrentPage(item.id as Page)}
                    className={`gallery-nav-item ${currentPage === item.id ? 'active' : ''}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="gallery-status">
              <div className="status-dot"></div>
              Connected
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
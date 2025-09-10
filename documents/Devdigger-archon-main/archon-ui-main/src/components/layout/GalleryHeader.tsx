import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function GalleryHeader() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Mine' },
    { path: '/explore', label: 'Explore' },
    { path: '/search', label: 'Search' },
    { path: '/archive', label: 'Archive' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <header className="bg-white border-b border-[#e6e6e6]">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-xl font-light tracking-[0.1em] uppercase">DevDigger</div>
          
          <ul className="flex gap-12 list-none">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    text-xs uppercase tracking-[0.05em] text-[#666] hover:text-[#1a1a1a] 
                    transition-colors relative
                    ${location.pathname === item.path ? 'text-[#1a1a1a] after:content-[""] after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-[3px] after:h-[3px] after:bg-[#ff6b00] after:rounded-full' : ''}
                  `}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#999]">
            <div className="w-[6px] h-[6px] bg-[#10b981] rounded-full animate-pulse"></div>
            Connected
          </div>
        </nav>
      </div>
    </header>
  );
}
/**
 * SVG Gradient Definitions for DevDigger Icons
 * 
 * Provides mystical and sophisticated gradient definitions for enhanced icon styling.
 * These gradients support the oracle/mystical theme while maintaining accessibility.
 */

import React from 'react';

export const IconGradients: React.FC = () => (
  <svg
    className="icon-gradients"
    style={{
      position: 'absolute',
      width: 0,
      height: 0,
      pointerEvents: 'none',
      userSelect: 'none',
    }}
    aria-hidden="true"
  >
    <defs>
      {/* Primary Oracle Gradient */}
      <linearGradient id="gradient-oracle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(271, 91%, 75%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(271, 91%, 65%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(271, 91%, 55%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Mystical Flame Gradient */}
      <linearGradient id="gradient-mystical-flame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(45, 90%, 70%)" stopOpacity="0.9" />
        <stop offset="30%" stopColor="hsl(30, 90%, 65%)" stopOpacity="0.8" />
        <stop offset="70%" stopColor="hsl(15, 90%, 60%)" stopOpacity="0.7" />
        <stop offset="100%" stopColor="hsl(0, 90%, 55%)" stopOpacity="0.6" />
      </linearGradient>

      {/* Crystal Gradient */}
      <linearGradient id="gradient-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(200, 80%, 75%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(190, 80%, 65%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(180, 80%, 55%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Wisdom Gradient */}
      <linearGradient id="gradient-wisdom" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(290, 70%, 75%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(280, 70%, 65%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(270, 70%, 55%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Success Aura Gradient */}
      <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(160, 84%, 49%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(160, 84%, 39%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(160, 84%, 29%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Error Vortex Gradient */}
      <linearGradient id="gradient-error" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(0, 84%, 70%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(0, 84%, 60%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(0, 84%, 50%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Warning Beacon Gradient */}
      <linearGradient id="gradient-warning" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(45, 90%, 70%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(45, 90%, 60%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(45, 90%, 50%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Info Prism Gradient */}
      <linearGradient id="gradient-info" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(217, 91%, 70%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(217, 91%, 50%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Primary Theme Gradient */}
      <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(217, 91%, 70%)" stopOpacity="0.9" />
        <stop offset="100%" stopColor="hsl(217, 91%, 50%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Secondary Theme Gradient */}
      <linearGradient id="gradient-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(240, 5%, 70%)" stopOpacity="0.9" />
        <stop offset="100%" stopColor="hsl(240, 5%, 50%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Radial Gradients for Special Effects */}
      
      {/* Orb Effect */}
      <radialGradient id="gradient-orb" cx="30%" cy="30%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
        <stop offset="70%" stopColor="currentColor" stopOpacity="0.6" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
      </radialGradient>

      {/* Mystical Aura */}
      <radialGradient id="gradient-aura" cx="50%" cy="50%">
        <stop offset="0%" stopColor="transparent" stopOpacity="0" />
        <stop offset="60%" stopColor="currentColor" stopOpacity="0.1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
      </radialGradient>

      {/* Portal Effect */}
      <radialGradient id="gradient-portal" cx="50%" cy="50%">
        <stop offset="0%" stopColor="hsl(271, 91%, 65%)" stopOpacity="0.8" />
        <stop offset="40%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.5" />
        <stop offset="100%" stopColor="hsl(190, 80%, 60%)" stopOpacity="0.2" />
      </radialGradient>

      {/* Conic Gradients for Advanced Effects */}
      
      {/* Rotating Energy */}
      <defs>
        <style>{`
          @keyframes rotate-gradient {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .rotating-gradient {
            animation: rotate-gradient 10s linear infinite;
            transform-origin: 50% 50%;
          }
        `}</style>
      </defs>

      {/* Dark Mode Variants */}
      
      {/* Dark Oracle Gradient */}
      <linearGradient id="gradient-oracle-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(271, 91%, 85%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(271, 91%, 75%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(271, 91%, 65%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Dark Crystal Gradient */}
      <linearGradient id="gradient-crystal-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(200, 80%, 85%)" stopOpacity="0.9" />
        <stop offset="50%" stopColor="hsl(190, 80%, 75%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(180, 80%, 65%)" stopOpacity="0.7" />
      </linearGradient>

      {/* Filters for Special Effects */}
      
      {/* Mystical Glow Filter */}
      <filter id="mystical-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      {/* Oracle Vision Filter */}
      <filter id="oracle-vision" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feColorMatrix 
          in="blur" 
          values="1 0 1 0 0  0 1 1 0 0  1 0 1 0 0  0 0 0 1 0"
          result="coloredBlur"
        />
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      {/* Crystal Refraction Filter */}
      <filter id="crystal-refraction" x="-20%" y="-20%" width="140%" height="140%">
        <feOffset in="SourceGraphic" dx="1" dy="1" result="offset"/>
        <feGaussianBlur in="offset" stdDeviation="0.5" result="blur"/>
        <feFlood floodColor="hsl(190, 80%, 60%)" floodOpacity="0.3" result="color"/>
        <feComposite in="color" in2="blur" operator="in" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  </svg>
);

export default IconGradients;
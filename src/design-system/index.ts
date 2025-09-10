/**
 * DevDigger Design System v2.0
 * A world-class design system with sophisticated aesthetics
 */

// Core Styles
export * from './styles/typography.css';
export * from './styles/colors.css';
export * from './styles/layout.css';
export * from './styles/animations.css';
export * from './styles/icons.css';
export * from './styles/dataviz.css';
export * from './styles/interactive.css';

// Components
export * from '../components/ui/ButtonV2';
export * from '../components/ui/FormElements';
export * from '../components/layout/GridSystem';
export * from '../components/icons/IconSystem';
export * from '../components/icons/LoadingSpinners';
export * from '../components/icons/EmptyStateGraphics';
export * from '../components/charts/DataViz';

// Hooks
export * from '../hooks/useAnimation';

// Utils
export * from '../utils/animationUtils';

// Design Tokens
export const designTokens = {
  // Typography
  fonts: {
    ui: '-apple-system, BlinkMacSystemFont, "Inter var", "Segoe UI", Roboto, sans-serif',
    display: '"Inter var", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
  },
  
  // Spacing (Fibonacci)
  spacing: {
    xs: '2px',
    sm: '4px',
    base: '8px',
    md: '13px',
    lg: '21px',
    xl: '34px',
    '2xl': '55px',
    '3xl': '89px',
    '4xl': '144px',
  },
  
  // Golden Ratio
  golden: {
    ratio: 1.618,
    inverse: 0.618,
  },
  
  // Animation
  animation: {
    durations: {
      instant: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
    easings: {
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  
  // Breakpoints (Golden Ratio)
  breakpoints: {
    xs: '518px',
    sm: '768px',
    md: '1242px',
    lg: '1440px',
    xl: '1920px',
  },
};

// Theme Configuration
export const themeConfig = {
  name: 'DevDigger Light Theme v2.0',
  mode: 'light',
  version: '2.0.0',
  description: 'A sophisticated, world-class design system optimized for light themes',
  
  features: {
    goldenRatio: true,
    fibonacciSpacing: true,
    fluidTypography: true,
    perceptualColors: true,
    microInteractions: true,
    glassmorphism: true,
    neumorphism: true,
    accessibilityAAA: true,
    reducedMotion: true,
    wideGamut: true,
  },
  
  performance: {
    animations: 'gpu-accelerated',
    colorSpace: 'oklch',
    fontLoading: 'swap',
    cssOptimization: 'tree-shaking',
  },
};

// Export initialization function
export function initializeDesignSystem() {
  // Add root CSS custom properties
  const root = document.documentElement;
  
  // Set design system active
  root.setAttribute('data-design-system', 'v2');
  
  // Enable features
  root.classList.add('design-system-v2');
  
  // Log initialization
  console.log('🎨 DevDigger Design System v2.0 initialized');
  console.log('✨ Features:', themeConfig.features);
  
  return themeConfig;
}
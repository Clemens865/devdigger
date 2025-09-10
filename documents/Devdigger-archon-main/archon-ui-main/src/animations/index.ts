/**
 * DevDigger Animation System - Main Export
 * 
 * A comprehensive animation system for sophisticated micro-interactions
 * and delightful user experiences in the DevDigger application.
 * 
 * Features:
 * - Performance-optimized animations with GPU acceleration
 * - Accessibility-first design with reduced motion support
 * - Sophisticated micro-interactions and special effects
 * - Data visualization animations with smooth transitions
 * - Comprehensive Framer Motion integration
 * - Memory-efficient animation management
 * 
 * Usage:
 * import { AnimatedButton, useHoverAnimation, fadeVariants } from '@/animations';
 */

// Core animation configuration and utilities
export * from './core';

// Animation hooks for React components
export * from './hooks';

// Framer Motion variants and configurations
export * from './framer-motion';

// JavaScript animation utilities
export * from './utils';

// Performance optimization tools
export * from './performance';

// Micro-interaction components
export {
  AnimatedInput,
  AnimatedToggle,
  AnimatedCheckbox,
  AnimatedTooltip,
  AnimatedButton,
} from './micro-interactions';

// Data visualization components
export {
  AnimatedProgressBar,
  AnimatedCounter,
  AnimatedChartBar,
  AnimatedCircleProgress,
  AnimatedStatsGrid,
  AnimatedMetricCard,
} from './data-visualizations';

// Special effects components
export {
  ParticleSystem,
  MorphingBlob,
  ShimmerOverlay,
  LiquidButton,
  FloatingElements,
  GradientOrbs,
  AuroraEffect,
} from './special-effects';

/**
 * Animation system version and configuration
 */
export const ANIMATION_SYSTEM = {
  version: '1.0.0',
  name: 'DevDigger Animation System',
  description: 'Sophisticated micro-interactions for world-class user experiences',
  features: [
    'GPU-accelerated animations',
    'Accessibility-first design',
    'Performance monitoring',
    'Memory-efficient operation',
    'Framer Motion integration',
    'Responsive animation scaling',
  ],
} as const;

/**
 * Quick start configuration for common use cases
 */
export const QUICK_START = {
  // Import CSS animations
  importCSS: () => import('./keyframes.css'),
  
  // Basic fade animation
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Button hover effect
  buttonHover: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },
  
  // Card interaction
  cardHover: {
    whileHover: { 
      scale: 1.03, 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      y: -4,
    },
    transition: { duration: 0.3 },
  },
  
  // Staggered list animation
  staggeredList: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4 },
      },
    },
  },
} as const;

/**
 * Common animation patterns for quick implementation
 */
export const PATTERNS = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
  
  // Modal animations
  modal: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 },
    },
  },
  
  // Notification toast
  toast: {
    initial: { opacity: 0, x: 100, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 100, scale: 0.9 },
    transition: { duration: 0.3, ease: 'backOut' },
  },
  
  // Loading states
  loading: {
    spinner: {
      animate: { rotate: 360 },
      transition: { duration: 1, repeat: Infinity, ease: 'linear' },
    },
    pulse: {
      animate: { scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] },
      transition: { duration: 2, repeat: Infinity },
    },
  },
} as const;

/**
 * Accessibility utilities
 */
export const ACCESSIBILITY = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Get safe animation configuration
  getSafeConfig: (config: any) => {
    if (ACCESSIBILITY.prefersReducedMotion()) {
      return {
        ...config,
        transition: { duration: 0.01 },
      };
    }
    return config;
  },
  
  // Focus management for animations
  preserveFocus: (element: HTMLElement) => {
    const activeElement = document.activeElement;
    return () => {
      if (activeElement && activeElement !== document.body) {
        (activeElement as HTMLElement).focus?.();
      }
    };
  },
} as const;

/**
 * Development utilities
 */
export const DEV_TOOLS = {
  // Log animation performance
  logPerformance: (name: string, startTime: number) => {
    const duration = performance.now() - startTime;
    console.log(`[Animation] ${name} completed in ${duration.toFixed(2)}ms`);
  },
  
  // Visualize animation boundaries (dev mode only)
  showBoundaries: (element: HTMLElement) => {
    if (process.env.NODE_ENV === 'development') {
      element.style.outline = '1px dashed rgba(255, 0, 0, 0.5)';
      setTimeout(() => {
        element.style.outline = '';
      }, 2000);
    }
  },
  
  // Performance monitoring
  monitorFPS: (callback: (fps: number) => void) => {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measure = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        callback(fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measure);
    };
    
    measure();
  },
} as const;

/**
 * Theme integration helpers
 */
export const THEME_INTEGRATION = {
  // Get theme-aware colors for animations
  getThemeColor: (colorName: string, theme: 'light' | 'dark' = 'light') => {
    const colors = {
      light: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      dark: {
        primary: '#60a5fa',
        secondary: '#9ca3af',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
      },
    };
    
    return colors[theme][colorName as keyof typeof colors.light] || colors[theme].primary;
  },
  
  // Apply theme-based animation timing
  getThemeTimings: (theme: 'light' | 'dark' = 'light') => {
    // Dark theme might benefit from slightly slower animations
    const multiplier = theme === 'dark' ? 1.1 : 1;
    
    return {
      quick: 200 * multiplier,
      normal: 300 * multiplier,
      slow: 500 * multiplier,
    };
  },
} as const;

/**
 * Migration helpers for existing components
 */
export const MIGRATION = {
  // Convert CSS transitions to Framer Motion
  cssToFramerMotion: (cssTransition: string) => {
    // Parse CSS transition and convert to Framer Motion config
    const parts = cssTransition.split(' ');
    const duration = parseFloat(parts[1]) || 0.3;
    const ease = parts[2] || 'ease';
    
    return {
      duration,
      ease: ease === 'ease-in-out' ? 'easeInOut' : ease,
    };
  },
  
  // Wrap existing components with animation
  wrapWithAnimation: (Component: React.ComponentType, animationConfig: any) => {
    return React.forwardRef((props: any, ref) => (
      <motion.div {...animationConfig}>
        <Component ref={ref} {...props} />
      </motion.div>
    ));
  },
} as const;
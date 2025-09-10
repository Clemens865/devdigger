/**
 * Icon Provider Component for DevDigger
 * 
 * Provides context and global configuration for the icon system,
 * including theme integration and performance optimizations.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { IconGradients } from './gradients';
import { useTheme } from '../../contexts/ThemeContext';

// Icon system configuration
interface IconConfig {
  defaultSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  defaultStyle: 'outline' | 'filled' | 'duotone' | 'gradient';
  enableAnimations: boolean;
  enableGradients: boolean;
  performanceMode: 'quality' | 'performance';
  theme: 'light' | 'dark' | 'auto';
}

// Default configuration
const defaultConfig: IconConfig = {
  defaultSize: 'md',
  defaultStyle: 'outline',
  enableAnimations: true,
  enableGradients: true,
  performanceMode: 'quality',
  theme: 'auto',
};

// Icon context
interface IconContextValue {
  config: IconConfig;
  updateConfig: (updates: Partial<IconConfig>) => void;
  isDarkMode: boolean;
}

const IconContext = createContext<IconContextValue | undefined>(undefined);

// Hook to use icon context
export const useIconContext = () => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error('useIconContext must be used within an IconProvider');
  }
  return context;
};

// Icon provider props
interface IconProviderProps {
  children: React.ReactNode;
  config?: Partial<IconConfig>;
}

// Icon provider component
export const IconProvider: React.FC<IconProviderProps> = ({ 
  children, 
  config: userConfig = {} 
}) => {
  const { theme } = useTheme();
  const [config, setConfig] = React.useState<IconConfig>({
    ...defaultConfig,
    ...userConfig,
  });

  const isDarkMode = useMemo(() => {
    if (config.theme === 'auto') {
      return theme === 'dark';
    }
    return config.theme === 'dark';
  }, [config.theme, theme]);

  const updateConfig = React.useCallback((updates: Partial<IconConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const contextValue = useMemo(() => ({
    config,
    updateConfig,
    isDarkMode,
  }), [config, updateConfig, isDarkMode]);

  // CSS custom properties for theming
  const cssVariables = useMemo(() => {
    const baseHue = isDarkMode ? 271 : 271; // Oracle purple
    const saturation = 91;
    const lightness = isDarkMode ? 75 : 65;

    return {
      '--icon-primary-h': baseHue,
      '--icon-primary-s': `${saturation}%`,
      '--icon-primary-l': `${lightness}%`,
      '--icon-primary-rgb': `${Math.round(255 * (lightness / 100))}, ${Math.round(255 * (saturation / 100) * (lightness / 100))}, ${Math.round(255 * (lightness / 100))}`,
      '--icon-accent-h': baseHue + 30,
      '--icon-accent-s': `${saturation - 10}%`,
      '--icon-accent-l': `${lightness + 10}%`,
      '--icon-accent-rgb': `${Math.round(255 * ((lightness + 10) / 100))}, ${Math.round(255 * ((saturation - 10) / 100) * ((lightness + 10) / 100))}, ${Math.round(255 * ((lightness + 10) / 100))}`,
      '--icon-opacity-base': config.performanceMode === 'performance' ? '0.8' : '1',
      '--icon-opacity-hover': config.performanceMode === 'performance' ? '0.9' : '1',
      '--icon-transition-duration': config.enableAnimations ? '200ms' : '0ms',
    } as React.CSSProperties;
  }, [isDarkMode, config.performanceMode, config.enableAnimations]);

  return (
    <IconContext.Provider value={contextValue}>
      <div style={cssVariables}>
        {config.enableGradients && <IconGradients />}
        {children}
      </div>
    </IconContext.Provider>
  );
};

// HOC for icon components to use context
export const withIconContext = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const context = useIconContext();
    return <Component ref={ref} {...props} iconContext={context} />;
  });

  WrappedComponent.displayName = `withIconContext(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Performance monitoring hook
export const useIconPerformance = () => {
  const { config } = useIconContext();
  const [renderCount, setRenderCount] = React.useState(0);
  const [lastRenderTime, setLastRenderTime] = React.useState(0);

  React.useEffect(() => {
    if (config.performanceMode === 'performance') {
      const start = performance.now();
      setRenderCount(prev => prev + 1);
      
      requestAnimationFrame(() => {
        const end = performance.now();
        setLastRenderTime(end - start);
      });
    }
  });

  return {
    renderCount,
    lastRenderTime,
    isPerformanceMode: config.performanceMode === 'performance',
  };
};

// Icon theme utilities
export const useIconTheme = () => {
  const { config, isDarkMode } = useIconContext();

  const getThemeClasses = React.useCallback((variant?: 'primary' | 'secondary' | 'accent' | 'oracle' | 'mystical') => {
    const baseClasses = ['transition-all'];
    
    if (config.enableAnimations) {
      baseClasses.push('duration-200', 'ease-out');
    }

    switch (variant) {
      case 'oracle':
        baseClasses.push('text-purple-600', 'dark:text-purple-400');
        if (config.enableGradients) {
          baseClasses.push('icon-oracle');
        }
        break;
      case 'mystical':
        baseClasses.push('icon-mystical');
        break;
      case 'accent':
        baseClasses.push('text-blue-600', 'dark:text-blue-400');
        break;
      case 'secondary':
        baseClasses.push('text-gray-500', 'dark:text-zinc-400');
        break;
      case 'primary':
      default:
        baseClasses.push('text-gray-900', 'dark:text-gray-100');
    }

    return baseClasses.join(' ');
  }, [config.enableAnimations, config.enableGradients]);

  const getEffectClasses = React.useCallback((effect?: 'glow' | 'pulse' | 'mystical' | 'interactive') => {
    if (!config.enableAnimations && (effect === 'pulse' || effect === 'interactive')) {
      return '';
    }

    switch (effect) {
      case 'glow':
        return 'icon-glow';
      case 'pulse':
        return 'icon-pulse';
      case 'mystical':
        return 'icon-mystical';
      case 'interactive':
        return 'icon-interactive';
      default:
        return '';
    }
  }, [config.enableAnimations]);

  return {
    isDarkMode,
    getThemeClasses,
    getEffectClasses,
    config,
  };
};

// Preload icon assets for performance
export const preloadIconAssets = () => {
  // Preload critical icon fonts or sprites if needed
  // This can be expanded based on specific performance requirements
  
  if (typeof window !== 'undefined') {
    // Example: Preload font files
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    // Add icon font URL when available
    
    // Preload critical SVG sprites
    const svgPreload = document.createElement('link');
    svgPreload.rel = 'preload';
    svgPreload.as = 'image';
    svgPreload.type = 'image/svg+xml';
    // Add sprite URL when available
  }
};

// Icon accessibility utilities
export const useIconAccessibility = () => {
  const getA11yProps = React.useCallback((
    label?: string,
    description?: string,
    decorative = false
  ) => {
    if (decorative) {
      return {
        'aria-hidden': true,
        role: 'presentation',
      };
    }

    const props: Record<string, any> = {
      role: 'img',
    };

    if (label) {
      props['aria-label'] = label;
    }

    if (description) {
      props['aria-describedby'] = description;
    }

    return props;
  }, []);

  return { getA11yProps };
};

export default IconProvider;
/**
 * DevDigger Animation System - Performance Optimizations
 * 
 * Performance utilities and optimizations for smooth animations
 * with proper cleanup and accessibility considerations.
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Performance monitoring utilities
 */
export class AnimationPerformanceMonitor {
  private static instance: AnimationPerformanceMonitor;
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private isMonitoring = false;
  private callbacks: ((fps: number) => void)[] = [];

  static getInstance(): AnimationPerformanceMonitor {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
    }
    return AnimationPerformanceMonitor.instance;
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.measureFPS();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  onFPSChange(callback: (fps: number) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  getFPS(): number {
    return this.fps;
  }

  private measureFPS(): void {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = now;
      
      this.callbacks.forEach(callback => callback(this.fps));
    }

    this.frameCount++;
    requestAnimationFrame(() => this.measureFPS());
  }
}

/**
 * Hook for monitoring animation performance
 */
export function useAnimationPerformance(onFPSChange?: (fps: number) => void) {
  const monitor = useRef(AnimationPerformanceMonitor.getInstance());

  useEffect(() => {
    monitor.current.startMonitoring();
    
    let cleanup: (() => void) | undefined;
    if (onFPSChange) {
      cleanup = monitor.current.onFPSChange(onFPSChange);
    }

    return () => {
      monitor.current.stopMonitoring();
      cleanup?.();
    };
  }, [onFPSChange]);

  return {
    getFPS: () => monitor.current.getFPS(),
  };
}

/**
 * Intersection Observer for performance-optimized scroll animations
 */
export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  };

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(callback);
      },
      defaultOptions
    );

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  return targetRef;
}

/**
 * Resize Observer for performance-optimized size-based animations
 */
export function useResizeObserver(
  callback: (entry: ResizeObserverEntry) => void
) {
  const targetRef = useRef<HTMLElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    observerRef.current = new ResizeObserver((entries) => {
      entries.forEach(callback);
    });

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  return targetRef;
}

/**
 * Optimized scroll listener with requestAnimationFrame throttling
 */
export function useOptimizedScroll(
  callback: (scrollY: number) => void,
  deps: React.DependencyList = []
) {
  const frameRef = useRef<number>();
  const callbackRef = useRef(callback);

  // Keep callback reference up to date
  useEffect(() => {
    callbackRef.current = callback;
  });

  const optimizedCallback = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      callbackRef.current(window.scrollY);
    });
  }, deps);

  useEffect(() => {
    window.addEventListener('scroll', optimizedCallback, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', optimizedCallback);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [optimizedCallback]);
}

/**
 * Memory-efficient animation queue
 */
export class AnimationQueue {
  private queue: (() => void)[] = [];
  private isRunning = false;
  private maxConcurrent = 3;

  add(animation: () => void): void {
    this.queue.push(animation);
    this.process();
  }

  setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
  }

  clear(): void {
    this.queue = [];
  }

  private async process(): Promise<void> {
    if (this.isRunning || this.queue.length === 0) return;

    this.isRunning = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.maxConcurrent);
      
      await Promise.all(
        batch.map(animation => 
          new Promise<void>(resolve => {
            animation();
            // Give browser time to render
            requestAnimationFrame(() => resolve());
          })
        )
      );
    }

    this.isRunning = false;
  }
}

/**
 * GPU layer promotion utilities
 */
export function promoteToGPULayer(element: HTMLElement): void {
  element.style.transform = element.style.transform || 'translateZ(0)';
  element.style.willChange = 'transform, opacity';
}

export function demoteFromGPULayer(element: HTMLElement): void {
  element.style.willChange = 'auto';
}

/**
 * Animation cleanup utilities
 */
export class AnimationCleanupManager {
  private static cleanupTasks: Set<() => void> = new Set();

  static addCleanupTask(task: () => void): () => void {
    this.cleanupTasks.add(task);
    return () => {
      this.cleanupTasks.delete(task);
    };
  }

  static cleanup(): void {
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Animation cleanup error:', error);
      }
    });
    this.cleanupTasks.clear();
  }
}

/**
 * Hook for automatic cleanup on unmount
 */
export function useAnimationCleanup(cleanupFn: () => void) {
  useEffect(() => {
    const removeCleanup = AnimationCleanupManager.addCleanupTask(cleanupFn);
    
    return () => {
      removeCleanup();
      cleanupFn();
    };
  }, [cleanupFn]);
}

/**
 * Reduced motion detection and handling
 */
export function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook for responsive animation configuration
 */
export function useResponsiveAnimation() {
  const [isReducedMotion, setIsReducedMotion] = useState(checkReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    isReducedMotion,
    getAnimationConfig: (config: any) => {
      if (isReducedMotion) {
        return {
          ...config,
          duration: 0.01,
          transition: { duration: 0.01 },
        };
      }
      return config;
    },
  };
}

/**
 * Battery-aware animations
 */
export function useBatteryAwareAnimations() {
  const [isLowBattery, setIsLowBattery] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          setIsLowBattery(battery.level < 0.2 && !battery.charging);
        };

        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);

        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      });
    }
  }, []);

  return {
    isLowBattery,
    shouldReduceAnimations: isLowBattery || checkReducedMotion(),
  };
}

/**
 * Connection-aware animations
 */
export function useConnectionAwareAnimations() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionStatus = () => {
        setIsSlowConnection(
          connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g' ||
          connection.saveData
        );
      };

      updateConnectionStatus();
      connection.addEventListener('change', updateConnectionStatus);

      return () => {
        connection.removeEventListener('change', updateConnectionStatus);
      };
    }
  }, []);

  return {
    isSlowConnection,
    shouldReduceAnimations: isSlowConnection,
  };
}

/**
 * Performance-optimized animation wrapper
 */
export function withPerformanceOptimization<T extends Record<string, any>>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return React.memo((props: T) => {
    const { isReducedMotion } = useResponsiveAnimation();
    const { shouldReduceAnimations: batteryReduce } = useBatteryAwareAnimations();
    const { shouldReduceAnimations: connectionReduce } = useConnectionAwareAnimations();

    const shouldOptimize = isReducedMotion || batteryReduce || connectionReduce;

    return (
      <Component
        {...props}
        data-performance-optimized={shouldOptimize}
      />
    );
  });
}

/**
 * Animation scheduling utilities
 */
export function scheduleAnimation(
  animation: () => void,
  priority: 'high' | 'normal' | 'low' = 'normal'
): void {
  const delays = {
    high: 0,
    normal: 16, // ~1 frame
    low: 33,    // ~2 frames
  };

  setTimeout(() => {
    requestAnimationFrame(animation);
  }, delays[priority]);
}

/**
 * Memory usage monitoring for animations
 */
export function useMemoryMonitor() {
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);

  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory;
        const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        setMemoryUsage(usage);
      };

      updateMemoryUsage();
      const interval = setInterval(updateMemoryUsage, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  return {
    memoryUsage,
    isHighMemoryUsage: memoryUsage !== null && memoryUsage > 80,
  };
}

import { useState } from 'react';
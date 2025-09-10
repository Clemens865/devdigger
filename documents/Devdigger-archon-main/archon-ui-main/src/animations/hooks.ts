/**
 * DevDigger Animation System - React Hooks
 * 
 * Collection of React hooks for sophisticated micro-interactions and animations
 * Built to work seamlessly with the existing animation system.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TIMING, EASING, shouldReduceMotion, getSafeDuration } from './core';
import {
  createRippleEffect,
  createMagneticEffect,
  animateValue,
  animateCounter,
  createScrollTrigger,
} from './utils';

/**
 * Enhanced hover animation hook with magnetic effects
 */
export function useHoverAnimation(
  options: {
    scale?: number;
    magneticStrength?: number;
    returnSpeed?: number;
    disabled?: boolean;
  } = {}
) {
  const {
    scale = 1.02,
    magneticStrength = 10,
    returnSpeed = TIMING.normal,
    disabled = false,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled || shouldReduceMotion()) return;

    // Setup magnetic effect
    cleanupRef.current = createMagneticEffect(element, {
      strength: magneticStrength,
      returnSpeed,
    });

    const handleMouseEnter = () => {
      setIsHovering(true);
      element.style.transition = `transform ${TIMING.quick}ms ${EASING.gentle}`;
      element.style.transform = `scale(${scale})`;
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      element.style.transform = 'scale(1)';
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      cleanupRef.current?.();
    };
  }, [scale, magneticStrength, returnSpeed, disabled]);

  return { elementRef, isHovering };
}

/**
 * Ripple effect hook for buttons and clickable elements
 */
export function useRippleEffect(
  options: {
    color?: string;
    duration?: number;
    disabled?: boolean;
  } = {}
) {
  const { color = 'rgba(255, 255, 255, 0.3)', duration = TIMING.normal, disabled = false } = options;

  const elementRef = useRef<HTMLElement>(null);

  const createRipple = useCallback(
    (event: React.MouseEvent) => {
      const element = elementRef.current;
      if (!element || disabled) return;

      createRippleEffect(element, event.nativeEvent, { color, duration });
    },
    [color, duration, disabled]
  );

  return { elementRef, createRipple };
}

/**
 * Smooth counter animation hook
 */
export function useCounterAnimation(
  target: number,
  options: {
    duration?: number;
    delay?: number;
    startValue?: number;
  } = {}
) {
  const { duration = TIMING.deliberate, delay = 0, startValue = 0 } = options;
  
  const [current, setCurrent] = useState(startValue);
  const animationRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (shouldReduceMotion()) {
      setCurrent(target);
      return;
    }

    const timeoutId = setTimeout(() => {
      animationRef.current?.(); // Cleanup previous animation
      
      animationRef.current = animateCounter({
        from: current,
        to: target,
        duration,
        onUpdate: setCurrent,
      });
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      animationRef.current?.();
    };
  }, [target, duration, delay]);

  return current;
}

/**
 * Intersection-based animation trigger hook
 */
export function useScrollAnimation(
  options: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
  } = {}
) {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = createScrollTrigger(
      [element],
      (_, visible) => {
        if (visible && (!hasTriggered.current || !triggerOnce)) {
          setIsVisible(true);
          hasTriggered.current = true;
        } else if (!visible && !triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    return cleanup;
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}

/**
 * Progress animation hook with smooth transitions
 */
export function useProgressAnimation(
  targetProgress: number,
  options: {
    duration?: number;
    delay?: number;
  } = {}
) {
  const { duration = TIMING.normal, delay = 0 } = options;
  
  const [currentProgress, setCurrentProgress] = useState(0);
  const animationRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (shouldReduceMotion()) {
      setCurrentProgress(targetProgress);
      return;
    }

    const timeoutId = setTimeout(() => {
      animationRef.current?.(); // Cleanup previous animation
      
      animationRef.current = animateValue({
        from: currentProgress,
        to: targetProgress,
        duration,
        easing: 'ease-out',
        onUpdate: setCurrentProgress,
      });
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      animationRef.current?.();
    };
  }, [targetProgress, duration, delay]);

  return currentProgress;
}

/**
 * Loading state animation hook
 */
export function useLoadingAnimation(
  isLoading: boolean,
  options: {
    minDuration?: number;
    fadeOutDuration?: number;
  } = {}
) {
  const { minDuration = 300, fadeOutDuration = TIMING.quick } = options;
  
  const [showLoading, setShowLoading] = useState(isLoading);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
      setIsAnimating(true);
      startTimeRef.current = Date.now();
    } else if (showLoading) {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setIsAnimating(false);
        
        setTimeout(() => {
          setShowLoading(false);
        }, fadeOutDuration);
      }, remainingTime);
    }
  }, [isLoading, showLoading, minDuration, fadeOutDuration]);

  return { showLoading, isAnimating };
}

/**
 * Staggered list animation hook
 */
export function useStaggeredAnimation<T>(
  items: T[],
  options: {
    staggerDelay?: number;
    animationDelay?: number;
    resetOnChange?: boolean;
  } = {}
) {
  const {
    staggerDelay = TIMING.stagger.normal,
    animationDelay = 0,
    resetOnChange = true,
  } = options;

  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const resetTrigger = resetOnChange ? items.length : 0;

  useEffect(() => {
    if (shouldReduceMotion()) {
      setVisibleItems(new Set(items.map((_, index) => index)));
      return;
    }

    setVisibleItems(new Set());
    
    const timeouts: NodeJS.Timeout[] = [];
    
    items.forEach((_, index) => {
      const delay = animationDelay + index * staggerDelay;
      
      const timeoutId = setTimeout(() => {
        setVisibleItems(prev => new Set(prev).add(index));
      }, delay);
      
      timeouts.push(timeoutId);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [resetTrigger, staggerDelay, animationDelay]);

  const isVisible = useCallback((index: number) => visibleItems.has(index), [visibleItems]);
  
  return { isVisible, visibleCount: visibleItems.size };
}

/**
 * Focus animation hook for form elements
 */
export function useFocusAnimation(
  options: {
    scaleOnFocus?: number;
    glowColor?: string;
  } = {}
) {
  const { scaleOnFocus = 1.02, glowColor = '59, 130, 246' } = options;
  
  const elementRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || shouldReduceMotion()) return;

    const handleFocus = () => {
      setIsFocused(true);
      element.style.transition = `all ${TIMING.quick}ms ${EASING.gentle}`;
      element.style.transform = `scale(${scaleOnFocus})`;
      element.style.boxShadow = `0 0 0 3px rgba(${glowColor}, 0.1)`;
    };

    const handleBlur = () => {
      setIsFocused(false);
      element.style.transform = 'scale(1)';
      element.style.boxShadow = 'none';
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [scaleOnFocus, glowColor]);

  return { elementRef, isFocused };
}

/**
 * Text typing animation hook
 */
export function useTypingAnimation(
  text: string,
  options: {
    speed?: number;
    delay?: number;
    cursor?: boolean;
  } = {}
) {
  const { speed = 50, delay = 0, cursor = true } = options;
  
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(cursor);

  useEffect(() => {
    if (shouldReduceMotion()) {
      setDisplayedText(text);
      setIsComplete(true);
      setShowCursor(false);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    setShowCursor(cursor);

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
          
          if (cursor) {
            // Blink cursor after completion
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
              setShowCursor(prev => !prev);
              blinkCount++;
              if (blinkCount > 6) {
                clearInterval(blinkInterval);
                setShowCursor(false);
              }
            }, 500);
          }
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, cursor]);

  const displayText = useMemo(() => {
    return displayedText + (showCursor ? '|' : '');
  }, [displayedText, showCursor]);

  return { displayText, isComplete };
}

/**
 * Page transition hook
 */
export function usePageTransition(
  options: {
    duration?: number;
    easing?: string;
  } = {}
) {
  const { duration = TIMING.deliberate, easing = EASING.smooth } = options;
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const startTransition = useCallback((direction: 'in' | 'out' = 'in') => {
    const element = elementRef.current;
    if (!element) return;

    setIsTransitioning(true);

    if (shouldReduceMotion()) {
      element.style.opacity = direction === 'in' ? '1' : '0';
      setIsTransitioning(false);
      return;
    }

    const keyframes = direction === 'in'
      ? [
          { opacity: '0', transform: 'translateY(20px)' },
          { opacity: '1', transform: 'translateY(0)' }
        ]
      : [
          { opacity: '1', transform: 'translateY(0)' },
          { opacity: '0', transform: 'translateY(-20px)' }
        ];

    const animation = element.animate(keyframes, {
      duration: getSafeDuration(duration),
      easing,
      fill: 'forwards'
    });

    animation.addEventListener('finish', () => {
      setIsTransitioning(false);
    });
  }, [duration, easing]);

  return { elementRef, isTransitioning, startTransition };
}

/**
 * Custom hook for element size-based animations
 */
export function useResizeAnimation(
  options: {
    duration?: number;
    easing?: string;
  } = {}
) {
  const { duration = TIMING.normal, easing = EASING.gentle } = options;
  
  const elementRef = useRef<HTMLElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || shouldReduceMotion()) return;

    let resizeTimeout: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver(() => {
      setIsResizing(true);
      
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsResizing(false);
      }, duration);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [duration]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || shouldReduceMotion()) return;

    element.style.transition = `all ${duration}ms ${easing}`;
  }, [duration, easing]);

  return { elementRef, isResizing };
}
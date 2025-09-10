/**
 * React Animation Hooks for DevDigger
 * Performance-optimized animation utilities with intersection observer
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// Animation types and interfaces
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
  iterations?: number | 'infinite';
}

export interface ScrollRevealConfig {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  stagger?: number;
}

export interface StaggerConfig {
  delay?: number;
  duration?: number;
  easing?: string;
}

export interface ParallaxConfig {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
}

/**
 * Hook for triggering animations when elements enter viewport
 */
export function useScrollReveal(config: ScrollRevealConfig = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true,
    stagger = 0
  } = config;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (stagger > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (once) setHasTriggered(true);
            }, stagger);
          } else {
            setIsVisible(true);
            if (once) setHasTriggered(true);
          }
        } else if (!once && !hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, once, stagger, hasTriggered]);

  return { elementRef, isVisible };
}

/**
 * Hook for staggered animations on child elements
 */
export function useStaggeredAnimation(config: StaggerConfig = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const [isTriggered, setIsTriggered] = useState(false);

  const { delay = 100, duration = 250, easing = 'ease-out-expo' } = config;

  const trigger = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    
    children.forEach((child, index) => {
      child.style.setProperty('--stagger-index', index.toString());
      child.style.setProperty('--stagger-delay', `${delay}ms`);
      child.style.animationDuration = `${duration}ms`;
      child.style.animationTimingFunction = `var(--ease-${easing})`;
    });

    setIsTriggered(true);
  }, [delay, duration, easing]);

  const reset = useCallback(() => {
    setIsTriggered(false);
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    children.forEach((child) => {
      child.style.removeProperty('--stagger-index');
      child.style.removeProperty('--stagger-delay');
      child.style.removeProperty('animation-duration');
      child.style.removeProperty('animation-timing-function');
    });
  }, []);

  return { containerRef, trigger, reset, isTriggered };
}

/**
 * Hook for parallax scroll effects
 */
export function useParallax(config: ParallaxConfig = {}) {
  const elementRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  const { speed = 0.5, direction = 'up', scale = 1 } = config;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      let transform = '';
      
      switch (direction) {
        case 'up':
          transform = `translateY(${rate}px)`;
          break;
        case 'down':
          transform = `translateY(${-rate}px)`;
          break;
        case 'left':
          transform = `translateX(${rate}px)`;
          break;
        case 'right':
          transform = `translateX(${-rate}px)`;
          break;
      }

      if (scale !== 1) {
        const scaleValue = 1 + (scrolled * speed * 0.001);
        transform += ` scale(${Math.max(0.1, Math.min(scaleValue, 2))})`;
      }

      element.style.transform = transform;
      setOffset(rate);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [speed, direction, scale]);

  return { elementRef, offset };
}

/**
 * Hook for morphing animations
 */
export function useMorph() {
  const elementRef = useRef<HTMLElement>(null);
  const [isMorphing, setIsMorphing] = useState(false);

  const morph = useCallback((
    from: Partial<CSSStyleDeclaration>,
    to: Partial<CSSStyleDeclaration>,
    duration = 500
  ) => {
    const element = elementRef.current;
    if (!element || isMorphing) return;

    setIsMorphing(true);

    // Apply initial styles
    Object.assign(element.style, from);

    // Trigger reflow
    element.offsetHeight;

    // Apply transition
    element.style.transition = `all ${duration}ms var(--ease-out-expo)`;

    // Apply final styles
    requestAnimationFrame(() => {
      Object.assign(element.style, to);
    });

    // Clean up after animation
    setTimeout(() => {
      element.style.transition = '';
      setIsMorphing(false);
    }, duration);
  }, [isMorphing]);

  return { elementRef, morph, isMorphing };
}

/**
 * Hook for click ripple effect
 */
export function useRipple() {
  const elementRef = useRef<HTMLElement>(null);

  const createRipple = useCallback((event: React.MouseEvent) => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 600ms linear;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `;

    // Add keyframes if not already present
    if (!document.querySelector('#ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    element.style.position = element.style.position || 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }, []);

  return { elementRef, createRipple };
}

/**
 * Hook for loading animations
 */
export function useLoadingAnimation(isLoading: boolean) {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isLoading) {
      setAnimationClass('animate-pulse');
    } else {
      setAnimationClass('animate-fade-in');
    }
  }, [isLoading]);

  return animationClass;
}

/**
 * Hook for success/error feedback animations
 */
export function useFeedbackAnimation() {
  const elementRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerSuccess = useCallback(() => {
    const element = elementRef.current;
    if (!element || isAnimating) return;

    setIsAnimating(true);
    element.classList.add('success-pop');
    
    setTimeout(() => {
      element.classList.remove('success-pop');
      setIsAnimating(false);
    }, 350);
  }, [isAnimating]);

  const triggerError = useCallback(() => {
    const element = elementRef.current;
    if (!element || isAnimating) return;

    setIsAnimating(true);
    element.classList.add('error-shake');
    
    setTimeout(() => {
      element.classList.remove('error-shake');
      setIsAnimating(false);
    }, 500);
  }, [isAnimating]);

  const triggerWarning = useCallback(() => {
    const element = elementRef.current;
    if (!element || isAnimating) return;

    setIsAnimating(true);
    element.classList.add('warning-pulse');
    
    setTimeout(() => {
      element.classList.remove('warning-pulse');
      setIsAnimating(false);
    }, 3000);
  }, [isAnimating]);

  return { 
    elementRef, 
    triggerSuccess, 
    triggerError, 
    triggerWarning, 
    isAnimating 
  };
}

/**
 * Hook for confetti particle effects
 */
export function useConfetti() {
  const createConfetti = useCallback((count = 50) => {
    const colors = ['#fbbf24', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDelay = Math.random() * 3 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }
  }, []);

  return { createConfetti };
}

/**
 * Hook for page transitions
 */
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');

  const startTransition = useCallback((type: 'enter' | 'exit' = 'enter') => {
    setIsTransitioning(true);
    setTransitionClass(`page-${type}`);
    
    // Auto-trigger active class for CSS transitions
    requestAnimationFrame(() => {
      setTransitionClass(`page-${type}-active`);
    });

    const duration = type === 'enter' ? 700 : 350;
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionClass('');
    }, duration);
  }, []);

  return { isTransitioning, transitionClass, startTransition };
}

/**
 * Hook for reduced motion detection
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for performance-optimized animations
 */
export function useOptimizedAnimation() {
  const elementRef = useRef<HTMLElement>(null);

  const enableGPUAcceleration = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  }, []);

  const disableGPUAcceleration = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    element.style.transform = '';
    element.style.willChange = '';
  }, []);

  return { elementRef, enableGPUAcceleration, disableGPUAcceleration };
}

/**
 * Utility function to create custom keyframe animations
 */
export function createKeyframeAnimation(
  name: string,
  keyframes: Record<string, Partial<CSSStyleDeclaration>>
) {
  const keyframeText = Object.entries(keyframes)
    .map(([key, styles]) => {
      const styleText = Object.entries(styles)
        .map(([prop, value]) => `${prop}: ${value};`)
        .join(' ');
      return `${key} { ${styleText} }`;
    })
    .join(' ');

  const style = document.createElement('style');
  style.textContent = `@keyframes ${name} { ${keyframeText} }`;
  document.head.appendChild(style);

  return name;
}

/**
 * Utility function for spring physics animations
 */
export function springAnimation(
  element: HTMLElement,
  property: string,
  from: number,
  to: number,
  stiffness = 100,
  damping = 10
) {
  let currentValue = from;
  let velocity = 0;
  let startTime: number;

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    
    const deltaTime = (timestamp - startTime) / 1000;
    startTime = timestamp;

    const displacement = to - currentValue;
    const springForce = displacement * stiffness;
    const dampingForce = velocity * damping;
    
    velocity += (springForce - dampingForce) * deltaTime;
    currentValue += velocity * deltaTime;

    element.style.setProperty(property, currentValue.toString());

    if (Math.abs(displacement) > 0.01 || Math.abs(velocity) > 0.01) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}
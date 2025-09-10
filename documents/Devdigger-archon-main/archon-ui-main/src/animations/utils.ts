/**
 * DevDigger Animation System - JavaScript Utilities
 * 
 * Performance-optimized animation utilities for complex interactions
 * that require JavaScript coordination or cannot be achieved with CSS alone.
 */

import { TIMING, EASING, shouldReduceMotion, getSafeDuration, getSafeEasing } from './core';

// Animation cleanup tracking
const activeAnimations = new Set<() => void>();

/**
 * Animate a numeric value over time with easing
 */
export function animateValue({
  from,
  to,
  duration = TIMING.normal,
  easing = 'ease-out',
  onUpdate,
  onComplete,
}: {
  from: number;
  to: number;
  duration?: number;
  easing?: string;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}): () => void {
  const safeDuration = getSafeDuration(duration);
  const startTime = performance.now();
  const distance = to - from;
  
  // Convert CSS easing to bezier function
  const easingFunction = getEasingFunction(easing);
  
  let animationId: number;
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / safeDuration, 1);
    
    const easedProgress = easingFunction(progress);
    const currentValue = from + distance * easedProgress;
    
    onUpdate(currentValue);
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      cleanup();
      onComplete?.();
    }
  };
  
  const cleanup = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    activeAnimations.delete(cleanup);
  };
  
  activeAnimations.add(cleanup);
  animationId = requestAnimationFrame(animate);
  
  return cleanup;
}

/**
 * Counter animation utility
 */
export function animateCounter({
  from = 0,
  to,
  duration = TIMING.deliberate,
  onUpdate,
  onComplete,
}: {
  from?: number;
  to: number;
  duration?: number;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}): () => void {
  return animateValue({
    from,
    to,
    duration,
    easing: 'ease-out',
    onUpdate: (value) => onUpdate(Math.round(value)),
    onComplete,
  });
}

/**
 * Progress bar animation
 */
export function animateProgress({
  from = 0,
  to,
  duration = TIMING.normal,
  element,
  onUpdate,
  onComplete,
}: {
  from?: number;
  to: number;
  duration?: number;
  element?: HTMLElement;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}): () => void {
  return animateValue({
    from,
    to,
    duration,
    easing: 'ease-out',
    onUpdate: (progress) => {
      if (element) {
        element.style.setProperty('--progress', `${progress}%`);
        element.style.width = `${progress}%`;
      }
      onUpdate?.(progress);
    },
    onComplete,
  });
}

/**
 * Staggered animation utility
 */
export function createStaggeredAnimation({
  elements,
  duration = TIMING.normal,
  stagger = TIMING.stagger.normal,
  animateElement,
}: {
  elements: HTMLElement[] | NodeListOf<Element>;
  duration?: number;
  stagger?: number;
  animateElement: (element: HTMLElement, index: number) => void;
}): () => void {
  const elementsArray = Array.from(elements) as HTMLElement[];
  const cleanupFunctions: (() => void)[] = [];
  
  elementsArray.forEach((element, index) => {
    const delay = index * stagger;
    
    const timeoutId = setTimeout(() => {
      animateElement(element, index);
    }, delay);
    
    cleanupFunctions.push(() => clearTimeout(timeoutId));
  });
  
  const cleanup = () => {
    cleanupFunctions.forEach(fn => fn());
  };
  
  activeAnimations.add(cleanup);
  return cleanup;
}

/**
 * Ripple effect animation
 */
export function createRippleEffect(
  element: HTMLElement,
  event: MouseEvent,
  options: {
    color?: string;
    duration?: number;
    maxScale?: number;
  } = {}
): void {
  const {
    color = 'rgba(255, 255, 255, 0.3)',
    duration = TIMING.normal,
    maxScale = 4,
  } = options;
  
  if (shouldReduceMotion()) return;
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    opacity: 1;
    z-index: 1000;
  `;
  
  element.appendChild(ripple);
  
  // Ensure element has relative positioning for ripple
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }
  
  // Add overflow hidden to contain ripple
  const originalOverflow = element.style.overflow;
  element.style.overflow = 'hidden';
  
  // Animate ripple
  const animation = ripple.animate([
    { transform: 'scale(0)', opacity: '1' },
    { transform: `scale(${maxScale})`, opacity: '0' }
  ], {
    duration: getSafeDuration(duration),
    easing: getSafeEasing('ease-out'),
    fill: 'forwards'
  });
  
  animation.addEventListener('finish', () => {
    ripple.remove();
    element.style.overflow = originalOverflow;
  });
}

/**
 * Magnetic button effect
 */
export function createMagneticEffect(
  element: HTMLElement,
  options: {
    strength?: number;
    returnSpeed?: number;
  } = {}
): () => void {
  const { strength = 20, returnSpeed = TIMING.normal } = options;
  
  if (shouldReduceMotion()) return () => {};
  
  let isHovering = false;
  
  const handleMouseMove = (event: MouseEvent) => {
    if (!isHovering) return;
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) / rect.width;
    const deltaY = (event.clientY - centerY) / rect.height;
    
    const moveX = deltaX * strength;
    const moveY = deltaY * strength;
    
    element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  };
  
  const handleMouseEnter = () => {
    isHovering = true;
    element.style.transition = 'transform 0.1s ease-out';
  };
  
  const handleMouseLeave = () => {
    isHovering = false;
    element.style.transition = `transform ${returnSpeed}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    element.style.transform = 'translate3d(0, 0, 0)';
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    element.style.transform = '';
    element.style.transition = '';
  };
}

/**
 * Parallax scrolling effect
 */
export function createParallaxEffect(
  elements: { element: HTMLElement; speed: number }[],
  container?: HTMLElement
): () => void {
  if (shouldReduceMotion()) return () => {};
  
  const targetContainer = container || window;
  let ticking = false;
  
  const updateParallax = () => {
    const scrolled = container 
      ? container.scrollTop 
      : window.pageYOffset;
    
    elements.forEach(({ element, speed }) => {
      const yPos = -(scrolled * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    ticking = false;
  };
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };
  
  targetContainer.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    targetContainer.removeEventListener('scroll', handleScroll);
  };
}

/**
 * Morphing shape animation
 */
export function morphShape(
  element: HTMLElement,
  fromShape: string,
  toShape: string,
  duration = TIMING.normal
): Promise<void> {
  return new Promise((resolve) => {
    if (shouldReduceMotion()) {
      element.style.clipPath = toShape;
      resolve();
      return;
    }
    
    const animation = element.animate([
      { clipPath: fromShape },
      { clipPath: toShape }
    ], {
      duration: getSafeDuration(duration),
      easing: getSafeEasing('ease-in-out'),
      fill: 'forwards'
    });
    
    animation.addEventListener('finish', () => resolve());
  });
}

/**
 * Particle system for decorative effects
 */
export function createParticleSystem(
  container: HTMLElement,
  options: {
    count?: number;
    color?: string;
    size?: number;
    duration?: number;
    spread?: number;
  } = {}
): () => void {
  const {
    count = 20,
    color = 'rgba(59, 130, 246, 0.5)',
    size = 4,
    duration = TIMING.extended,
    spread = 100,
  } = options;
  
  if (shouldReduceMotion()) return () => {};
  
  const particles: HTMLElement[] = [];
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
    `;
    
    const x = Math.random() * spread - spread / 2;
    const y = Math.random() * spread - spread / 2;
    const rotation = Math.random() * 360;
    
    particle.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
    particle.style.opacity = '0';
    
    container.appendChild(particle);
    particles.push(particle);
    
    // Animate particle
    const animation = particle.animate([
      { 
        opacity: '0',
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(0)`
      },
      {
        opacity: '1',
        transform: `translate3d(${x * 2}px, ${y * 2}px, 0) rotate(${rotation + 180}deg) scale(1)`
      },
      {
        opacity: '0',
        transform: `translate3d(${x * 3}px, ${y * 3}px, 0) rotate(${rotation + 360}deg) scale(0)`
      }
    ], {
      duration: getSafeDuration(duration),
      delay: Math.random() * 200,
      easing: getSafeEasing('ease-out'),
    });
    
    animation.addEventListener('finish', () => {
      particle.remove();
    });
  }
  
  return () => {
    particles.forEach(particle => particle.remove());
  };
}

/**
 * Get easing function from CSS easing string
 */
function getEasingFunction(easing: string): (t: number) => number {
  switch (easing) {
    case 'linear':
      return (t) => t;
    case 'ease-in':
      return (t) => t * t;
    case 'ease-out':
      return (t) => 1 - (1 - t) * (1 - t);
    case 'ease-in-out':
      return (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    default:
      // Fallback to ease-out
      return (t) => 1 - (1 - t) * (1 - t);
  }
}

/**
 * Cleanup all active animations
 */
export function cleanupAllAnimations(): void {
  activeAnimations.forEach(cleanup => cleanup());
  activeAnimations.clear();
}

/**
 * Intersection observer for scroll-triggered animations
 */
export function createScrollTrigger(
  elements: HTMLElement[],
  callback: (element: HTMLElement, isVisible: boolean) => void,
  options: IntersectionObserverInit = {}
): () => void {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry.target as HTMLElement, entry.isIntersecting);
    });
  }, defaultOptions);
  
  elements.forEach(element => observer.observe(element));
  
  return () => {
    observer.disconnect();
  };
}
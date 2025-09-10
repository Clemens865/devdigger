/**
 * Animation Utility Functions for DevDigger
 * Performance-optimized helpers for complex animations
 */

// Animation timing functions
export const easingFunctions = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeSpring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeBounce: 'cubic-bezier(0.68, 0, 0.265, 1)',
} as const;

// Duration presets
export const durations = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 700,
} as const;

// Animation state management
export interface AnimationState {
  isAnimating: boolean;
  progress: number;
  direction: 'forward' | 'reverse';
  iteration: number;
}

/**
 * Creates a smooth transition between two values
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Easing function implementations
 */
export const easing = {
  // Quadratic
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Exponential
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  // Elastic
  easeInElastic: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Back
  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // Bounce
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
};

/**
 * Performance monitoring for animations
 */
export class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;

  startMonitoring() {
    const measureFPS = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  getFPS(): number {
    return this.fps;
  }

  isPerformanceGood(): boolean {
    return this.fps >= 30;
  }
}

/**
 * Animation queue for sequential animations
 */
export class AnimationQueue {
  private queue: Array<() => Promise<void>> = [];
  private isRunning = false;

  add(animation: () => Promise<void>): void {
    this.queue.push(animation);
    this.process();
  }

  private async process(): Promise<void> {
    if (this.isRunning || this.queue.length === 0) return;

    this.isRunning = true;

    while (this.queue.length > 0) {
      const animation = this.queue.shift();
      if (animation) {
        await animation();
      }
    }

    this.isRunning = false;
  }

  clear(): void {
    this.queue = [];
  }

  get length(): number {
    return this.queue.length;
  }
}

/**
 * Intersection Observer for scroll animations
 */
export function createScrollObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Optimized requestAnimationFrame wrapper
 */
export class AnimationFrameScheduler {
  private callbacks = new Set<(timestamp: number) => void>();
  private isRunning = false;

  add(callback: (timestamp: number) => void): void {
    this.callbacks.add(callback);
    this.start();
  }

  remove(callback: (timestamp: number) => void): void {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }

  private start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
  }

  private stop(): void {
    this.isRunning = false;
  }

  private tick = (timestamp: number) => {
    if (!this.isRunning) return;

    this.callbacks.forEach(callback => {
      try {
        callback(timestamp);
      } catch (error) {
        console.error('Animation callback error:', error);
      }
    });

    if (this.callbacks.size > 0) {
      requestAnimationFrame(this.tick);
    } else {
      this.stop();
    }
  };
}

/**
 * CSS animation utilities
 */
export function generateCSSAnimation(
  keyframes: Record<string, Record<string, string>>,
  options: {
    duration?: number;
    easing?: string;
    delay?: number;
    iterations?: number | 'infinite';
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  } = {}
): string {
  const {
    duration = 300,
    easing = 'ease-out',
    delay = 0,
    iterations = 1,
    direction = 'normal',
    fillMode = 'both',
  } = options;

  // Generate unique animation name
  const animationName = `animation-${Math.random().toString(36).substr(2, 9)}`;

  // Create keyframes CSS
  const keyframeCSS = Object.entries(keyframes)
    .map(([percentage, styles]) => {
      const styleString = Object.entries(styles)
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ');
      return `${percentage} { ${styleString} }`;
    })
    .join(' ');

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ${animationName} {
      ${keyframeCSS}
    }
  `;
  document.head.appendChild(style);

  // Return animation CSS property value
  return `${animationName} ${duration}ms ${easing} ${delay}ms ${iterations} ${direction} ${fillMode}`;
}

/**
 * Spring physics animation
 */
export class SpringAnimation {
  private currentValue: number;
  private targetValue: number;
  private velocity: number;
  private stiffness: number;
  private damping: number;
  private precision: number;
  private onUpdate: (value: number) => void;
  private animationId: number | null = null;

  constructor(
    initialValue: number,
    stiffness = 100,
    damping = 10,
    precision = 0.01,
    onUpdate: (value: number) => void
  ) {
    this.currentValue = initialValue;
    this.targetValue = initialValue;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
    this.precision = precision;
    this.onUpdate = onUpdate;
  }

  setTarget(target: number): void {
    this.targetValue = target;
    this.start();
  }

  private start(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.animate();
  }

  private animate = (): void => {
    const deltaTime = 1 / 60; // Assume 60fps
    const displacement = this.targetValue - this.currentValue;
    const springForce = displacement * this.stiffness;
    const dampingForce = this.velocity * this.damping;

    this.velocity += (springForce - dampingForce) * deltaTime;
    this.currentValue += this.velocity * deltaTime;

    this.onUpdate(this.currentValue);

    // Continue animation if not settled
    if (
      Math.abs(displacement) > this.precision ||
      Math.abs(this.velocity) > this.precision
    ) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.currentValue = this.targetValue;
      this.velocity = 0;
      this.onUpdate(this.currentValue);
      this.animationId = null;
    }
  };

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  isAnimating(): boolean {
    return this.animationId !== null;
  }
}

/**
 * Path animation utilities
 */
export function animateAlongPath(
  element: HTMLElement,
  path: SVGPathElement,
  duration: number,
  easing: (t: number) => number = easing.easeOutQuart
): Promise<void> {
  return new Promise((resolve) => {
    const pathLength = path.getTotalLength();
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      
      const point = path.getPointAtLength(easedProgress * pathLength);
      
      element.style.transform = `translate(${point.x}px, ${point.y}px)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

/**
 * Morphing path animation
 */
export function morphPath(
  pathElement: SVGPathElement,
  fromPath: string,
  toPath: string,
  duration: number,
  easing: (t: number) => number = easing.easeOutQuart
): Promise<void> {
  return new Promise((resolve) => {
    // This is a simplified version - in production, you'd use a library like Flubber
    // for proper path morphing with point interpolation
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      // Simple interpolation (in reality, this would be much more complex)
      if (progress < 0.5) {
        pathElement.setAttribute('d', fromPath);
      } else {
        pathElement.setAttribute('d', toPath);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        pathElement.setAttribute('d', toPath);
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

/**
 * Text animation utilities
 */
export function animateText(
  element: HTMLElement,
  text: string,
  animationType: 'typewriter' | 'fadeIn' | 'slideIn' = 'typewriter',
  duration = 2000
): Promise<void> {
  return new Promise((resolve) => {
    const chars = text.split('');
    element.innerHTML = '';

    if (animationType === 'typewriter') {
      let index = 0;
      const interval = duration / chars.length;

      const typeChar = () => {
        if (index < chars.length) {
          element.innerHTML += chars[index];
          index++;
          setTimeout(typeChar, interval);
        } else {
          resolve();
        }
      };

      typeChar();
    } else {
      // For other animation types, create spans for each character
      chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        
        if (animationType === 'slideIn') {
          span.style.transform = 'translateY(20px)';
        }
        
        element.appendChild(span);

        // Animate each character with delay
        setTimeout(() => {
          span.style.transition = `all 300ms ease-out`;
          span.style.opacity = '1';
          
          if (animationType === 'slideIn') {
            span.style.transform = 'translateY(0)';
          }

          // Resolve when last character is animated
          if (index === chars.length - 1) {
            setTimeout(resolve, 300);
          }
        }, (index * duration) / chars.length);
      });
    }
  });
}

/**
 * Global animation manager
 */
export const animationManager = {
  performanceMonitor: new AnimationPerformanceMonitor(),
  frameScheduler: new AnimationFrameScheduler(),
  queue: new AnimationQueue(),

  init() {
    this.performanceMonitor.startMonitoring();
  },

  scheduleAnimation(callback: (timestamp: number) => void) {
    this.frameScheduler.add(callback);
  },

  unscheduleAnimation(callback: (timestamp: number) => void) {
    this.frameScheduler.remove(callback);
  },

  queueAnimation(animation: () => Promise<void>) {
    this.queue.add(animation);
  },

  isPerformanceGood(): boolean {
    return this.performanceMonitor.isPerformanceGood();
  },

  getFPS(): number {
    return this.performanceMonitor.getFPS();
  },
};

// Initialize animation manager
if (typeof window !== 'undefined') {
  animationManager.init();
}
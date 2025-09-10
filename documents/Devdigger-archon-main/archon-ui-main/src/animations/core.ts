/**
 * DevDigger Animation System - Core Configuration
 * 
 * This module provides the foundation for all animations in the DevDigger application.
 * It defines timing, easing curves, and animation patterns that create a cohesive
 * and sophisticated user experience.
 */

// Animation timing constants (in milliseconds)
export const TIMING = {
  // Quick interactions - snappy feedback
  instant: 0,
  quick: 200,
  
  // Standard interactions - most UI elements
  normal: 300,
  
  // Deliberate animations - important state changes
  deliberate: 500,
  
  // Dramatic animations - page transitions, major updates
  dramatic: 800,
  
  // Special long animations - loading, complex transitions
  extended: 1200,
  
  // Micro-timing for staggered animations
  stagger: {
    quick: 50,
    normal: 100,
    slow: 150,
  },
} as const;

// Sophisticated easing curves for natural motion
export const EASING = {
  // Standard ease curves
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Custom cubic-bezier curves for specific interactions
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  sharp: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  gentle: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Framer Motion compatible easings
  anticipate: [0.22, 1, 0.36, 1],
  backIn: [0.6, -0.28, 0.735, 0.045],
  backOut: [0.175, 0.885, 0.32, 1.275],
  backInOut: [0.68, -0.55, 0.265, 1.55],
  circIn: [0.6, 0.04, 0.98, 0.335],
  circOut: [0.075, 0.82, 0.165, 1],
  circInOut: [0.785, 0.135, 0.15, 0.86],
} as const;

// Animation states for consistent behavior
export const ANIMATION_STATES = {
  idle: 'idle',
  hover: 'hover',
  active: 'active',
  focus: 'focus',
  disabled: 'disabled',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

// Transform properties for performance optimization
export const TRANSFORM_PROPERTIES = {
  // GPU-accelerated properties only
  translate: 'translate3d',
  scale: 'scale3d',
  rotate: 'rotate3d',
  opacity: 'opacity',
  filter: 'filter',
} as const;

// Animation scales for consistent sizing
export const SCALES = {
  micro: 0.95,    // Subtle press effect
  small: 0.97,    // Small reduction
  normal: 1.02,   // Standard hover growth
  medium: 1.05,   // Prominent hover
  large: 1.08,    // Dramatic effect
  huge: 1.12,     // Maximum recommended scale
} as const;

// Blur and filter effects
export const EFFECTS = {
  blur: {
    none: 'blur(0px)',
    subtle: 'blur(0.5px)',
    soft: 'blur(1px)',
    medium: 'blur(2px)',
    strong: 'blur(4px)',
  },
  brightness: {
    dim: 'brightness(0.8)',
    normal: 'brightness(1)',
    bright: 'brightness(1.2)',
    intense: 'brightness(1.4)',
  },
  saturate: {
    muted: 'saturate(0.8)',
    normal: 'saturate(1)',
    vibrant: 'saturate(1.2)',
    intense: 'saturate(1.5)',
  },
} as const;

// Animation preferences for accessibility
export const MOTION_PREFERENCES = {
  respectReducedMotion: true,
  fallbackDuration: TIMING.quick,
  fallbackEasing: EASING.easeOut,
} as const;

// Common animation combinations
export const PRESETS = {
  // Button interactions
  buttonHover: {
    duration: TIMING.quick,
    easing: EASING.gentle,
    scale: SCALES.normal,
  },
  buttonPress: {
    duration: TIMING.instant,
    easing: EASING.sharp,
    scale: SCALES.micro,
  },
  
  // Card interactions
  cardHover: {
    duration: TIMING.normal,
    easing: EASING.smooth,
    scale: SCALES.small,
    elevation: 8,
  },
  cardPress: {
    duration: TIMING.quick,
    easing: EASING.backOut,
    scale: SCALES.micro,
  },
  
  // Modal and overlay animations
  modalEnter: {
    duration: TIMING.normal,
    easing: EASING.backOut,
    scale: [0.95, 1],
    opacity: [0, 1],
  },
  modalExit: {
    duration: TIMING.quick,
    easing: EASING.sharp,
    scale: [1, 0.95],
    opacity: [1, 0],
  },
  
  // Page transitions
  pageEnter: {
    duration: TIMING.deliberate,
    easing: EASING.smooth,
    y: [20, 0],
    opacity: [0, 1],
  },
  pageExit: {
    duration: TIMING.normal,
    easing: EASING.sharp,
    y: [0, -20],
    opacity: [1, 0],
  },
  
  // Notification animations
  notificationSlideIn: {
    duration: TIMING.normal,
    easing: EASING.backOut,
    x: [300, 0],
    opacity: [0, 1],
  },
  notificationSlideOut: {
    duration: TIMING.quick,
    easing: EASING.sharp,
    x: [0, 300],
    opacity: [1, 0],
  },
} as const;

// Physics-based spring configurations
export const SPRING_CONFIGS = {
  gentle: { tension: 120, friction: 14 },
  wobbly: { tension: 180, friction: 12 },
  stiff: { tension: 210, friction: 20 },
  slow: { tension: 280, friction: 60 },
  molasses: { tension: 280, friction: 120 },
} as const;

// Utility function to check for reduced motion preference
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Utility function to get safe animation duration
export const getSafeDuration = (duration: number): number => {
  if (shouldReduceMotion()) {
    return MOTION_PREFERENCES.fallbackDuration;
  }
  return duration;
};

// Utility function to get safe easing
export const getSafeEasing = (easing: string): string => {
  if (shouldReduceMotion()) {
    return MOTION_PREFERENCES.fallbackEasing;
  }
  return easing;
};

export type AnimationTiming = typeof TIMING;
export type AnimationEasing = typeof EASING;
export type AnimationState = typeof ANIMATION_STATES[keyof typeof ANIMATION_STATES];
export type AnimationPreset = typeof PRESETS[keyof typeof PRESETS];
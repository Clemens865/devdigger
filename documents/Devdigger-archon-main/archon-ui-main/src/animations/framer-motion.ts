/**
 * DevDigger Animation System - Framer Motion Configurations
 * 
 * Comprehensive collection of Framer Motion variants and configurations
 * for sophisticated animations throughout the DevDigger application.
 */

import { Variants, Transition, MotionProps } from 'framer-motion';
import { TIMING, EASING, shouldReduceMotion } from './core';

// ============================================
// CORE VARIANTS
// ============================================

/**
 * Basic fade animations
 */
export const fadeVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.gentle,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.sharp,
    }
  },
};

/**
 * Slide animations
 */
export const slideVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.backOut,
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.sharp,
    }
  },
};

/**
 * Scale animations
 */
export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.backOut,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.sharp,
    }
  },
};

/**
 * Sophisticated entrance animations
 */
export const entranceVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95,
    rotateX: -15,
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.deliberate / 1000,
      ease: EASING.backOut,
    }
  },
};

// ============================================
// INTERACTION VARIANTS
// ============================================

/**
 * Button interaction variants
 */
export const buttonVariants: Variants = {
  idle: { 
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: { 
    scale: 1.02,
    y: -2,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.gentle,
    }
  },
  tap: { 
    scale: 0.98,
    y: 0,
    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : 0.1,
      ease: EASING.sharp,
    }
  },
  disabled: {
    scale: 1,
    opacity: 0.5,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
    }
  },
};

/**
 * Card interaction variants
 */
export const cardVariants: Variants = {
  idle: { 
    scale: 1,
    rotateY: 0,
    z: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: { 
    scale: 1.03,
    rotateY: 2,
    z: 20,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.smooth,
    }
  },
  tap: { 
    scale: 0.97,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : 0.1,
    }
  },
};

/**
 * Modal variants
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.backOut,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.sharp,
    }
  },
};

/**
 * Backdrop variants
 */
export const backdropVariants: Variants = {
  hidden: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: { 
    opacity: 1,
    backdropFilter: 'blur(4px)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
    }
  },
  exit: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
    }
  },
};

// ============================================
// LIST AND STAGGER VARIANTS
// ============================================

/**
 * Container for staggered children
 */
export const staggerContainerVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: shouldReduceMotion() ? 0 : 0.1,
      delayChildren: shouldReduceMotion() ? 0 : 0.1,
    }
  },
};

/**
 * Individual staggered items
 */
export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.gentle,
    }
  },
};

/**
 * List item variants with sophisticated entrance
 */
export const listItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20, 
    scale: 0.95,
    filter: 'blur(4px)',
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.backOut,
    }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    scale: 0.95,
    filter: 'blur(4px)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.sharp,
    }
  },
};

// ============================================
// NAVIGATION VARIANTS
// ============================================

/**
 * Page transition variants
 */
export const pageVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(4px)',
  },
  in: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.deliberate / 1000,
      ease: EASING.smooth,
    }
  },
  out: { 
    opacity: 0, 
    y: -20,
    filter: 'blur(4px)',
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.sharp,
    }
  },
};

/**
 * Tab transition variants
 */
export const tabVariants: Variants = {
  inactive: { 
    opacity: 0.6,
    scale: 0.95,
    y: 2,
  },
  active: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.gentle,
    }
  },
};

// ============================================
// NOTIFICATION VARIANTS
// ============================================

/**
 * Toast notification variants
 */
export const toastVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 100,
    scale: 0.9,
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
      ease: EASING.backOut,
    }
  },
  exit: { 
    opacity: 0,
    x: 100,
    scale: 0.9,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.sharp,
    }
  },
};

// ============================================
// FORM VARIANTS
// ============================================

/**
 * Input field variants
 */
export const inputVariants: Variants = {
  idle: { 
    scale: 1,
    borderColor: 'rgba(209, 213, 219, 1)', // gray-300
  },
  focus: { 
    scale: 1.02,
    borderColor: 'rgba(59, 130, 246, 1)', // blue-500
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.gentle,
    }
  },
  error: {
    scale: 1,
    borderColor: 'rgba(239, 68, 68, 1)', // red-500
    x: [0, -4, 4, -4, 4, 0],
    transition: {
      x: {
        duration: shouldReduceMotion() ? 0.01 : 0.4,
        ease: EASING.sharp,
      },
      borderColor: {
        duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      }
    }
  },
};

/**
 * Label float variants
 */
export const labelVariants: Variants = {
  normal: { 
    y: 0,
    scale: 1,
    color: 'rgba(107, 114, 128, 1)', // gray-500
  },
  float: { 
    y: -24,
    scale: 0.85,
    color: 'rgba(59, 130, 246, 1)', // blue-500
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
      ease: EASING.gentle,
    }
  },
};

// ============================================
// DATA VISUALIZATION VARIANTS
// ============================================

/**
 * Progress bar variants
 */
export const progressVariants: Variants = {
  hidden: { 
    scaleX: 0,
    originX: 0,
  },
  visible: { 
    scaleX: 1,
    originX: 0,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.deliberate / 1000,
      ease: EASING.smooth,
    }
  },
};

/**
 * Chart bar variants
 */
export const barVariants: Variants = {
  hidden: { 
    scaleY: 0,
    originY: 1,
  },
  visible: { 
    scaleY: 1,
    originY: 1,
    transition: {
      duration: shouldReduceMotion() ? 0.01 : TIMING.deliberate / 1000,
      ease: EASING.backOut,
    }
  },
};

// ============================================
// LOADING VARIANTS
// ============================================

/**
 * Loading spinner variants
 */
export const spinnerVariants: Variants = {
  spinning: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }
  },
};

/**
 * Skeleton loading variants
 */
export const skeletonVariants: Variants = {
  loading: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  },
};

// ============================================
// TRANSITION PRESETS
// ============================================

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
};

export const smoothTransition: Transition = {
  duration: shouldReduceMotion() ? 0.01 : TIMING.normal / 1000,
  ease: EASING.smooth,
};

export const quickTransition: Transition = {
  duration: shouldReduceMotion() ? 0.01 : TIMING.quick / 1000,
  ease: EASING.sharp,
};

export const elasticTransition: Transition = {
  duration: shouldReduceMotion() ? 0.01 : TIMING.deliberate / 1000,
  ease: EASING.backOut,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create custom stagger transition
 */
export function createStaggerTransition(
  staggerDelay: number = 0.1,
  childDelay: number = 0.1
): Transition {
  return {
    staggerChildren: shouldReduceMotion() ? 0 : staggerDelay,
    delayChildren: shouldReduceMotion() ? 0 : childDelay,
  };
}

/**
 * Create custom spring configuration
 */
export function createSpringConfig(
  stiffness: number = 400,
  damping: number = 30,
  mass: number = 1
): Transition {
  return shouldReduceMotion() 
    ? { duration: 0.01 }
    : {
        type: 'spring',
        stiffness,
        damping,
        mass,
      };
}

/**
 * Merge variants with motion props for convenience
 */
export function withAnimationProps(
  variants: Variants,
  initial: string = 'hidden',
  animate: string = 'visible',
  exit?: string
): MotionProps {
  return {
    variants,
    initial,
    animate,
    exit,
    layout: true,
  };
}

/**
 * Get safe variants for reduced motion
 */
export function getSafeVariants(variants: Variants): Variants {
  if (!shouldReduceMotion()) return variants;
  
  const safeVariants: Variants = {};
  
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === 'object' && 'transition' in value) {
      safeVariants[key] = {
        ...value,
        transition: { duration: 0.01 },
      };
    } else {
      safeVariants[key] = value;
    }
  }
  
  return safeVariants;
}
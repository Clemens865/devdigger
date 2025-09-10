/**
 * Animated Icon Components for DevDigger
 * 
 * Sophisticated animated versions of icons with micro-interactions
 * and mystical visual effects for enhanced user experience.
 */

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconProps, IconBase } from './icon-system';
import { cn } from '../../lib/utils';

// Animation variants for different effects
const animationVariants = {
  // Mystical Pulse
  mysticPulse: {
    initial: { scale: 1, opacity: 0.8 },
    animate: { 
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  },
  
  // Oracle Revelation
  oracleReveal: {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8
      }
    }
  },
  
  // Crystal Formation
  crystalForm: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: [0.8, 1.2, 1],
      opacity: [0, 0.5, 1],
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        times: [0, 0.5, 1]
      }
    }
  },
  
  // Energy Flow
  energyFlow: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  },
  
  // Flame Flicker
  flameFlicker: {
    initial: { scale: 1, y: 0 },
    animate: { 
      scale: [1, 1.05, 0.98, 1.02, 1],
      y: [0, -1, 1, -0.5, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    }
  },
  
  // Portal Spin
  portalSpin: {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: {
        duration: 8,
        ease: "linear",
        repeat: Infinity
      }
    }
  }
};

// Hover effects
const hoverVariants = {
  hover: {
    scale: 1.1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  mysticalHover: {
    scale: 1.15,
    filter: "drop-shadow(0 0 12px rgba(139, 92, 246, 0.6))",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Enhanced Animated Icon Base
interface AnimatedIconProps extends IconProps {
  animation?: keyof typeof animationVariants;
  hoverEffect?: keyof typeof hoverVariants;
  delay?: number;
  onAnimationComplete?: () => void;
}

const AnimatedIconBase = forwardRef<SVGSVGElement, AnimatedIconProps & { children: React.ReactNode }>(
  ({ animation, hoverEffect = 'hover', delay = 0, onAnimationComplete, children, className, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const motionProps = {
      ...(animation && animationVariants[animation]),
      ...(isHovered && hoverEffect && hoverVariants[hoverEffect]),
      transition: {
        ...animationVariants[animation || 'mysticPulse'].animate.transition,
        delay
      },
      onAnimationComplete
    };

    return (
      <motion.div
        {...motionProps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="inline-block"
      >
        <IconBase
          ref={ref}
          className={cn("transition-all duration-200", className)}
          {...props}
        >
          {children}
        </IconBase>
      </motion.div>
    );
  }
);

// Animated Oracle Eye with Mystical Reveal
export const AnimatedOracleEye = forwardRef<SVGSVGElement, AnimatedIconProps>((props, ref) => (
  <AnimatedIconBase ref={ref} animation="oracleReveal" hoverEffect="mysticalHover" {...props}>
    <motion.path 
      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
      variants={animationVariants.energyFlow}
    />
    <motion.circle 
      cx="12" 
      cy="12" 
      r="3"
      variants={animationVariants.crystalForm}
    />
    <motion.circle 
      cx="12" 
      cy="12" 
      r="1" 
      fill="currentColor"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.path 
      d="M8.5 8.5 12 5l3.5 3.5M8.5 15.5 12 19l3.5-3.5" 
      opacity="0.4"
      animate={{ opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
    />
  </AnimatedIconBase>
));

// Animated Crystal Ball with Mystical Energy
export const AnimatedCrystalBall = forwardRef<SVGSVGElement, AnimatedIconProps>((props, ref) => (
  <AnimatedIconBase ref={ref} animation="crystalForm" {...props}>
    <motion.circle 
      cx="12" 
      cy="12" 
      r="8"
      variants={animationVariants.energyFlow}
    />
    <motion.path 
      d="M6 12a6 6 0 0 1 12 0" 
      opacity="0.6"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
    <motion.path 
      d="M8 8a6 6 0 0 1 8 8" 
      opacity="0.4"
      animate={{ opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
    />
    <motion.circle 
      cx="10" 
      cy="10" 
      r="1" 
      fill="currentColor" 
      opacity="0.8"
      animate={{ 
        x: [0, 2, -1, 0],
        y: [0, -1, 2, 0],
        opacity: [0.8, 1, 0.6, 0.8]
      }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <motion.g strokeWidth="1">
      <motion.path 
        d="M4 12h2M18 12h2M12 4v2M12 18v2"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, staggerChildren: 0.2 }}
      />
    </motion.g>
  </AnimatedIconBase>
));

// Animated Mystical Flame
export const AnimatedMysticFlame = forwardRef<SVGSVGElement, AnimatedIconProps>((props, ref) => (
  <AnimatedIconBase ref={ref} animation="flameFlicker" {...props}>
    <motion.path 
      d="M12 2c-1 3-3 4-3 8 0 3 2 6 5 6s5-3 5-6c0-4-2-5-3-8"
      animate={{
        d: [
          "M12 2c-1 3-3 4-3 8 0 3 2 6 5 6s5-3 5-6c0-4-2-5-3-8",
          "M12 2c-1.2 3-2.8 4-2.8 8 0 3 2 6 5 6s5-3 5-6c0-4-2.2-5-3.2-8",
          "M12 2c-0.8 3-3.2 4-3.2 8 0 3 2 6 5 6s5-3 5-6c0-4-1.8-5-2.8-8",
          "M12 2c-1 3-3 4-3 8 0 3 2 6 5 6s5-3 5-6c0-4-2-5-3-8"
        ]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path 
      d="M12 6c-1 2-2 2-2 4 0 2 1 3 2 3s2-1 2-3c0-2-1-2-2-4" 
      opacity="0.6"
      animate={{
        opacity: [0.4, 0.8, 0.6, 0.4],
        d: [
          "M12 6c-1 2-2 2-2 4 0 2 1 3 2 3s2-1 2-3c0-2-1-2-2-4",
          "M12 6c-1.1 2-1.9 2-1.9 4 0 2 1 3 2 3s2-1 2-3c0-2-0.9-2-2.1-4",
          "M12 6c-0.9 2-2.1 2-2.1 4 0 2 1 3 2 3s2-1 2-3c0-2-1.1-2-1.9-4",
          "M12 6c-1 2-2 2-2 4 0 2 1 3 2 3s2-1 2-3c0-2-1-2-2-4"
        ]
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
    />
    <motion.g strokeWidth="1" opacity="0.4">
      <motion.path 
        d="M6 18c2 2 6 2 12 0M8 20c1 1 3 1 8 0"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.g>
  </AnimatedIconBase>
));

// Animated Loading Orb
export const AnimatedLoadingOrb = forwardRef<SVGSVGElement, AnimatedIconProps>((props, ref) => (
  <AnimatedIconBase ref={ref} animation="portalSpin" {...props}>
    <circle cx="12" cy="12" r="10" opacity="0.2" />
    <motion.path 
      d="M21 12a9 9 0 1 1-9-9" 
      strokeWidth="2"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{ originX: '12px', originY: '12px' }}
    />
    <motion.circle 
      cx="12" 
      cy="3" 
      r="1" 
      fill="currentColor"
      animate={{ 
        scale: [1, 1.5, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </AnimatedIconBase>
));

// Animated Search Crystal
export const AnimatedSearchCrystal = forwardRef<SVGSVGElement, AnimatedIconProps>((props, ref) => (
  <AnimatedIconBase ref={ref} hoverEffect="mysticalHover" {...props}>
    <motion.circle 
      cx="11" 
      cy="11" 
      r="8"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.path 
      d="M21 21l-4.35-4.35" 
      strokeWidth="2"
      whileHover={{ scale: 1.1 }}
    />
    <motion.path 
      d="M7 11l4-2 4 2-4 2-4-2Z" 
      opacity="0.6"
      animate={{ 
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.05, 1]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.g strokeWidth="0.5" opacity="0.4">
      <motion.path 
        d="M9 9l2-1 2 1M9 13l2 1 2-1"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
    </motion.g>
  </AnimatedIconBase>
));

// Animated Data Flow
export const AnimatedDataFlow = forwardRef<SVGSVGElement, AnimatedIconProps>((props, ref) => (
  <AnimatedIconBase ref={ref} {...props}>
    <motion.g strokeWidth="1" opacity="0.4">
      <motion.path d="M3 6h18" variants={animationVariants.energyFlow} />
      <motion.path d="M3 12h18" variants={animationVariants.energyFlow} />
      <motion.path d="M3 18h18" variants={animationVariants.energyFlow} />
    </motion.g>
    <motion.circle 
      cx="6" 
      cy="6" 
      r="2" 
      fill="currentColor"
      animate={{ x: [0, 12, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle 
      cx="12" 
      cy="12" 
      r="2" 
      fill="currentColor" 
      opacity="0.8"
      animate={{ x: [0, 6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.circle 
      cx="18" 
      cy="18" 
      r="2" 
      fill="currentColor" 
      opacity="0.6"
      animate={{ x: [0, -12, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
  </AnimatedIconBase>
));

// Animated API Portal
export const AnimatedAPIPortal = forwardRef<SVGSVGElement, AnimatedIconProps>((props, ref) => (
  <AnimatedIconBase ref={ref} animation="portalSpin" {...props}>
    <motion.circle 
      cx="12" 
      cy="12" 
      r="9"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <motion.circle 
      cx="12" 
      cy="12" 
      r="6" 
      opacity="0.6"
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: [0.4, 0.8, 0.4]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.circle 
      cx="12" 
      cy="12" 
      r="3" 
      opacity="0.4"
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.6, 0.2]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.g strokeWidth="1">
      <motion.path 
        d="M12 3v6M12 15v6M3 12h6M15 12h6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, staggerChildren: 0.1 }}
      />
    </motion.g>
    <motion.g strokeWidth="0.5" opacity="0.6">
      <motion.path 
        d="M6.3 6.3l4.2 4.2M13.5 13.5l4.2 4.2M6.3 17.7l4.2-4.2M13.5 10.5l4.2-4.2"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          rotate: 360
        }}
        transition={{ 
          opacity: { duration: 3, repeat: Infinity },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        style={{ originX: '12px', originY: '12px' }}
      />
    </motion.g>
  </AnimatedIconBase>
));

// Export collection of animated icons
export const AnimatedDevDiggerIcons = {
  AnimatedOracleEye,
  AnimatedCrystalBall,
  AnimatedMysticFlame,
  AnimatedLoadingOrb,
  AnimatedSearchCrystal,
  AnimatedDataFlow,
  AnimatedAPIPortal,
};

export default AnimatedDevDiggerIcons;
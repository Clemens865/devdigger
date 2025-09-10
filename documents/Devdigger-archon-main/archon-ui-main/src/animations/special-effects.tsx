/**
 * DevDigger Animation System - Special Effects Components
 * 
 * Advanced visual effects for creating sophisticated user experiences
 * including particles, morphing shapes, liquid animations, and more.
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { TIMING, EASING, shouldReduceMotion } from './core';
import { createParticleSystem } from './utils';

// ============================================
// PARTICLE SYSTEM COMPONENT
// ============================================

interface ParticleSystemProps {
  trigger?: boolean;
  count?: number;
  colors?: string[];
  size?: number;
  duration?: number;
  spread?: number;
  className?: string;
  continuous?: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  trigger = false,
  count = 30,
  colors = ['#3b82f6', '#8b5cf6', '#06d6a0'],
  size = 4,
  duration = TIMING.extended,
  spread = 150,
  className = '',
  continuous = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!trigger || shouldReduceMotion() || !containerRef.current) return;

    setIsActive(true);
    
    const createParticles = () => {
      const container = containerRef.current;
      if (!container) return;

      const particles = Array.from({ length: count }, (_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const velocity = 0.5 + Math.random() * 1.5;
        const particleSpread = spread * (0.5 + Math.random() * 0.5);
        
        return {
          id: Math.random(),
          x: Math.cos(angle) * particleSpread,
          y: Math.sin(angle) * particleSpread,
          color,
          size: size * (0.5 + Math.random() * 1),
          velocity,
          life: 1,
        };
      });

      return particles;
    };

    const particles = createParticles();
    
    if (continuous) {
      const interval = setInterval(() => {
        if (containerRef.current) {
          createParticles();
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }

    const timeout = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [trigger, count, colors, size, duration, spread, continuous]);

  if (shouldReduceMotion()) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      <AnimatePresence>
        {isActive && trigger && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: count }, (_, i) => (
              <Particle
                key={i}
                index={i}
                color={colors[Math.floor(Math.random() * colors.length)]}
                size={size}
                duration={duration}
                spread={spread}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Particle: React.FC<{
  index: number;
  color: string;
  size: number;
  duration: number;
  spread: number;
}> = ({ index, color, size, duration, spread }) => {
  const angle = (Math.PI * 2 * index) / 30 + Math.random() * 0.5;
  const velocity = 0.5 + Math.random() * 1.5;
  const distance = spread * (0.3 + Math.random() * 0.7);

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size * (0.5 + Math.random()),
        height: size * (0.5 + Math.random()),
        backgroundColor: color,
        left: '50%',
        top: '50%',
        boxShadow: `0 0 10px ${color}`,
      }}
      initial={{
        x: 0,
        y: 0,
        opacity: 1,
        scale: 0,
      }}
      animate={{
        x: x * velocity,
        y: y * velocity,
        opacity: 0,
        scale: [0, 1.2, 0],
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: (duration / 1000) * (0.8 + Math.random() * 0.4),
        ease: 'easeOut',
      }}
    />
  );
};

// ============================================
// MORPHING BLOB
// ============================================

interface MorphingBlobProps {
  size?: number;
  color?: string;
  intensity?: number;
  speed?: number;
  className?: string;
}

export const MorphingBlob: React.FC<MorphingBlobProps> = ({
  size = 200,
  color = '#3b82f6',
  intensity = 20,
  speed = 3,
  className = '',
}) => {
  const pathValue = useMotionValue(0);
  
  const paths = useMemo(() => [
    `M${size/2},${size/4} Q${3*size/4},${size/4} ${3*size/4},${size/2} Q${3*size/4},${3*size/4} ${size/2},${3*size/4} Q${size/4},${3*size/4} ${size/4},${size/2} Q${size/4},${size/4} ${size/2},${size/4}`,
    `M${size/2},${size/3} Q${2*size/3},${size/4} ${2*size/3},${size/2} Q${2*size/3},${2*size/3} ${size/2},${2*size/3} Q${size/3},${2*size/3} ${size/3},${size/2} Q${size/3},${size/3} ${size/2},${size/3}`,
    `M${size/2},${size/5} Q${4*size/5},${size/3} ${4*size/5},${size/2} Q${4*size/5},${2*size/3} ${size/2},${4*size/5} Q${size/5},${2*size/3} ${size/5},${size/2} Q${size/5},${size/3} ${size/2},${size/5}`,
  ], [size]);

  const animatedPath = useTransform(pathValue, [0, 1, 2], paths);

  useEffect(() => {
    if (shouldReduceMotion()) return;

    const controls = pathValue.set(0);
    
    const animate = () => {
      pathValue.set(Math.random() * (paths.length - 1));
    };

    const interval = setInterval(animate, (1000 / speed) * 2);
    return () => clearInterval(interval);
  }, [pathValue, paths.length, speed]);

  if (shouldReduceMotion()) {
    return (
      <div
        className={`rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity: 0.1,
        }}
      />
    );
  }

  return (
    <motion.div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        <motion.path
          d={animatedPath}
          fill={color}
          opacity={0.1}
          animate={{
            d: paths,
          }}
          transition={{
            repeat: Infinity,
            duration: speed,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d={animatedPath}
          fill={color}
          opacity={0.05}
          animate={{
            d: paths,
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: speed * 1.5,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  );
};

// ============================================
// SHIMMER OVERLAY
// ============================================

interface ShimmerOverlayProps {
  active?: boolean;
  color?: string;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  duration?: number;
  className?: string;
}

export const ShimmerOverlay: React.FC<ShimmerOverlayProps> = ({
  active = true,
  color = 'rgba(255, 255, 255, 0.6)',
  direction = 'horizontal',
  duration = 2,
  className = '',
}) => {
  if (shouldReduceMotion() || !active) return null;

  const gradientDirections = {
    horizontal: 'to right',
    vertical: 'to bottom',
    diagonal: 'to bottom right',
  };

  const animationKeyframes = {
    horizontal: { x: ['-100%', '200%'] },
    vertical: { y: ['-100%', '200%'] },
    diagonal: { x: ['-100%', '200%'], y: ['-100%', '200%'] },
  };

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `linear-gradient(${gradientDirections[direction]}, transparent 0%, ${color} 50%, transparent 100%)`,
        width: direction === 'horizontal' ? '50%' : '100%',
        height: direction === 'vertical' ? '50%' : '100%',
      }}
      animate={animationKeyframes[direction]}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatDelay: 1,
      }}
    />
  );
};

// ============================================
// LIQUID BUTTON EFFECT
// ============================================

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  liquidColor?: string;
  intensity?: number;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  liquidColor = '#3b82f6',
  intensity = 1,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  if (shouldReduceMotion()) {
    return (
      <button
        className={`relative px-6 py-3 rounded-lg overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      className={`relative px-6 py-3 rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
      
      {/* Liquid effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, ${liquidColor}40 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Ripple effects */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                background: liquidColor,
                left: mouseX,
                top: mouseY,
                width: 20,
                height: 20,
                x: '-50%',
                y: '-50%',
              }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: intensity * 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                background: liquidColor,
                left: mouseX,
                top: mouseY,
                width: 40,
                height: 40,
                x: '-50%',
                y: '-50%',
              }}
              initial={{ scale: 0, opacity: 0.3 }}
              animate={{ scale: intensity * 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ============================================
// FLOATING ELEMENTS
// ============================================

interface FloatingElementsProps {
  count?: number;
  colors?: string[];
  shapes?: ('circle' | 'square' | 'triangle')[];
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 15,
  colors = ['#3b82f6', '#8b5cf6', '#06d6a0', '#f59e0b'],
  shapes = ['circle'],
  minSize = 20,
  maxSize = 60,
  speed = 20,
  className = '',
}) => {
  if (shouldReduceMotion()) return null;

  const elements = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: minSize + Math.random() * (maxSize - minSize),
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: speed + Math.random() * speed,
    })), 
    [count, colors, shapes, minSize, maxSize, speed]
  );

  const getShapeStyles = (shape: string, size: number) => {
    const baseStyles = { width: size, height: size };
    
    switch (shape) {
      case 'circle':
        return { ...baseStyles, borderRadius: '50%' };
      case 'square':
        return { ...baseStyles, borderRadius: '8px' };
      case 'triangle':
        return {
          ...baseStyles,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute opacity-20"
          style={{
            ...getShapeStyles(element.shape, element.size),
            backgroundColor: element.color,
            left: `${element.initialX}%`,
            top: `${element.initialY}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// GRADIENT ORBS
// ============================================

interface GradientOrbsProps {
  count?: number;
  colors?: string[][];
  blur?: number;
  className?: string;
}

export const GradientOrbs: React.FC<GradientOrbsProps> = ({
  count = 3,
  colors = [
    ['#3b82f6', '#8b5cf6'],
    ['#06d6a0', '#f59e0b'],
    ['#ef4444', '#ec4899'],
  ],
  blur = 40,
  className = '',
}) => {
  if (shouldReduceMotion()) {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        {Array.from({ length: count }, (_, i) => {
          const colorPair = colors[i % colors.length];
          return (
            <div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: 200 + Math.random() * 200,
                height: 200 + Math.random() * 200,
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
                background: `linear-gradient(45deg, ${colorPair[0]}, ${colorPair[1]})`,
                filter: `blur(${blur}px)`,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const colorPair = colors[i % colors.length];
        const size = 200 + Math.random() * 200;
        const initialX = Math.random() * 80;
        const initialY = Math.random() * 80;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: size,
              height: size,
              background: `linear-gradient(45deg, ${colorPair[0]}, ${colorPair[1]})`,
              filter: `blur(${blur}px)`,
            }}
            initial={{
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -20, 40, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2,
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================
// AURORA EFFECT
// ============================================

interface AuroraEffectProps {
  colors?: string[];
  intensity?: number;
  speed?: number;
  className?: string;
}

export const AuroraEffect: React.FC<AuroraEffectProps> = ({
  colors = ['#3b82f6', '#8b5cf6', '#06d6a0'],
  intensity = 0.3,
  speed = 3,
  className = '',
}) => {
  if (shouldReduceMotion()) {
    return (
      <div 
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
          background: `linear-gradient(45deg, ${colors.join(', ')})`,
          opacity: intensity * 0.5,
        }}
      />
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 800px 600px at 50% 50%, ${color}40 0%, transparent 70%)`,
          }}
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-10%', '10%', '-10%'],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: speed * (2 + index),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
          style={{
            opacity: intensity,
          }}
        />
      ))}
      
      {/* Additional flowing layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${colors[0]}20 50%, transparent 100%)`,
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: speed * 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
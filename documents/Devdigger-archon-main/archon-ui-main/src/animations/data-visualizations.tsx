/**
 * DevDigger Animation System - Data Visualization Components
 * 
 * Sophisticated animated components for data visualization with smooth transitions,
 * progressive disclosure, and accessibility considerations.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useCounterAnimation, useProgressAnimation, useScrollAnimation } from './hooks';
import { progressVariants, barVariants, staggerContainerVariants, staggerItemVariants } from './framer-motion';
import { TIMING, EASING } from './core';

// ============================================
// ANIMATED PROGRESS BAR
// ============================================

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  striped?: boolean;
  glowEffect?: boolean;
  className?: string;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  height = 8,
  animated = true,
  striped = false,
  glowEffect = false,
  className = '',
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: true });
  const animatedProgress = useProgressAnimation(isVisible ? progress : 0, {
    duration: TIMING.deliberate,
    delay: 100,
  });
  
  const displayProgress = animated ? animatedProgress : progress;
  const animatedCounter = useCounterAnimation(displayProgress, {
    duration: TIMING.deliberate,
    delay: 150,
  });

  return (
    <div ref={elementRef} className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <motion.span 
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
              transition={{ delay: 0.2, duration: TIMING.normal / 1000 }}
            >
              {label}
            </motion.span>
          )}
          {showPercentage && (
            <motion.span 
              className="text-sm text-gray-500"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 10 }}
              transition={{ delay: 0.3, duration: TIMING.normal / 1000 }}
            >
              {Math.round(animatedCounter)}%
            </motion.span>
          )}
        </div>
      )}
      
      <div
        className="relative rounded-full overflow-hidden"
        style={{ height, backgroundColor }}
      >
        {/* Progress fill */}
        <motion.div
          className={`h-full rounded-full relative ${striped ? 'bg-stripes' : ''}`}
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={{ width: `${displayProgress}%` }}
          transition={{
            duration: animated ? TIMING.deliberate / 1000 : 0,
            ease: EASING.smooth,
            delay: 0.1,
          }}
        >
          {/* Animated stripes */}
          {striped && (
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 6px,
                  rgba(255,255,255,0.3) 6px,
                  rgba(255,255,255,0.3) 12px
                )`,
              }}
              animate={{ x: [0, 24] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
          
          {/* Glow effect */}
          {glowEffect && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: `inset 0 0 8px rgba(255,255,255,0.3), 0 0 8px ${color}40`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>

        {/* Shimmer effect on completion */}
        <AnimatePresence>
          {displayProgress >= 99.5 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// ANIMATED COUNTER
// ============================================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = TIMING.deliberate,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  size = 'md',
  color,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: true });
  const animatedValue = useCounterAnimation(isVisible ? value : 0, {
    duration,
    delay: 100,
  });

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const formatValue = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <motion.div
      ref={elementRef}
      className={`font-bold ${sizes[size]} ${className}`}
      style={{ color }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8 
      }}
      transition={{ 
        duration: TIMING.normal / 1000, 
        delay: 0.2,
        ease: EASING.backOut,
      }}
    >
      {prefix}{formatValue(animatedValue)}{suffix}
    </motion.div>
  );
};

// ============================================
// ANIMATED CHART BAR
// ============================================

interface AnimatedChartBarProps {
  value: number;
  maxValue: number;
  label?: string;
  color?: string;
  index?: number;
  showValue?: boolean;
  height?: number;
  className?: string;
}

export const AnimatedChartBar: React.FC<AnimatedChartBarProps> = ({
  value,
  maxValue,
  label,
  color = '#3b82f6',
  index = 0,
  showValue = true,
  height = 200,
  className = '',
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: true });
  const percentage = (value / maxValue) * 100;

  const barHeight = useMotionValue(0);
  const displayValue = useTransform(barHeight, [0, height], [0, value]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        barHeight.set((percentage / 100) * height);
      }, index * 100);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, percentage, height, barHeight, index]);

  return (
    <div ref={elementRef} className={`flex flex-col items-center ${className}`}>
      <div 
        className="relative flex items-end"
        style={{ height }}
      >
        <motion.div
          className="w-full min-w-[40px] rounded-t-lg relative overflow-hidden"
          style={{ 
            backgroundColor: color,
            height: barHeight,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            delay: index * 0.1,
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-20"
            initial={{ y: '100%' }}
            animate={{ y: isVisible ? '-100%' : '100%' }}
            transition={{
              duration: 1.2,
              delay: index * 0.1 + 0.5,
              ease: 'easeOut',
            }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-t-lg"
            style={{
              boxShadow: `inset 0 0 10px rgba(255,255,255,0.2), 0 0 10px ${color}30`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        </motion.div>

        {/* Value display */}
        {showValue && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              y: isVisible ? 0 : 10 
            }}
            transition={{ 
              delay: index * 0.1 + 0.8,
              duration: TIMING.normal / 1000,
            }}
          >
            <motion.span 
              className="text-sm font-medium px-2 py-1 bg-gray-900 text-white rounded shadow-lg"
            >
              {Math.round(displayValue.get())}
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Label */}
      {label && (
        <motion.span 
          className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            y: isVisible ? 0 : 10 
          }}
          transition={{ 
            delay: index * 0.1 + 1,
            duration: TIMING.normal / 1000,
          }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
};

// ============================================
// ANIMATED CIRCLE PROGRESS
// ============================================

interface AnimatedCircleProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  className?: string;
}

export const AnimatedCircleProgress: React.FC<AnimatedCircleProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showPercentage = true,
  className = '',
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: true });
  
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  const animatedProgress = useProgressAnimation(isVisible ? progress : 0, {
    duration: TIMING.deliberate,
    delay: 200,
  });
  
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  const animatedCounter = useCounterAnimation(animatedProgress, {
    duration: TIMING.deliberate,
    delay: 250,
  });

  return (
    <div ref={elementRef} className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={backgroundColor}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: TIMING.deliberate / 1000,
            ease: EASING.smooth,
            delay: 0.2,
          }}
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            scale: isVisible ? 1 : 0.8 
          }}
          transition={{ 
            duration: TIMING.normal / 1000,
            delay: 0.5,
          }}
        >
          <span className="text-2xl font-bold" style={{ color }}>
            {Math.round(animatedCounter)}%
          </span>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// ANIMATED STATS GRID
// ============================================

interface StatItemProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
  prefix?: string;
  suffix?: string;
  change?: number; // percentage change
}

interface AnimatedStatsGridProps {
  stats: StatItemProps[];
  columns?: number;
  className?: string;
}

export const AnimatedStatsGrid: React.FC<AnimatedStatsGridProps> = ({
  stats,
  columns = 2,
  className = '',
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: true });

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <motion.div
      ref={elementRef}
      className={`grid gap-6 ${gridCols[columns as keyof typeof gridCols]} ${className}`}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={`${stat.label}-${index}`}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          variants={staggerItemVariants}
          whileHover={{
            scale: 1.02,
            y: -4,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
          transition={{ duration: TIMING.quick / 1000 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {stat.icon && (
                <motion.div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: TIMING.quick / 1000 }}
                >
                  {stat.icon}
                </motion.div>
              )}
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </h3>
            </div>
            
            {stat.change !== undefined && (
              <motion.div
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.change >= 0 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.8 }}
              >
                {stat.change >= 0 ? '+' : ''}{stat.change}%
              </motion.div>
            )}
          </div>

          <AnimatedCounter
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            size="lg"
            color={stat.color}
            className="text-gray-900 dark:text-white"
            duration={TIMING.deliberate + index * 100}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================
// ANIMATED METRIC CARD
// ============================================

interface AnimatedMetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({
  title,
  value,
  previousValue,
  unit = '',
  icon,
  color = '#3b82f6',
  trend = 'neutral',
  className = '',
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: true });
  const changePercentage = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;

  const trendColors = {
    up: '#10b981', // green
    down: '#ef4444', // red
    neutral: '#6b7280', // gray
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <motion.div
      ref={elementRef}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.95,
      }}
      transition={{ duration: TIMING.normal / 1000, delay: 0.1 }}
      whileHover={{
        scale: 1.02,
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${color}20` }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: TIMING.quick / 1000 }}
            >
              <div style={{ color }}>{icon}</div>
            </motion.div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        
        {previousValue && (
          <motion.div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${trendColors[trend]}20`,
              color: trendColors[trend],
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
            transition={{ delay: 0.4 }}
          >
            <span>{trendIcons[trend]}</span>
            <span>{Math.abs(changePercentage).toFixed(1)}%</span>
          </motion.div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <AnimatedCounter
          value={value}
          duration={TIMING.deliberate}
          size="xl"
          color={color}
          className="text-gray-900 dark:text-white"
        />
        {unit && (
          <motion.span
            className="text-lg font-medium text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.8 }}
          >
            {unit}
          </motion.span>
        )}
      </div>

      {/* Subtle animation background */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-5 pointer-events-none"
        style={{ background: `linear-gradient(45deg, ${color}, transparent)` }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};
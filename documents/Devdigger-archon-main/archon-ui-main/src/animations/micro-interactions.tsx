/**
 * DevDigger Animation System - Micro-interactions Components
 * 
 * Sophisticated micro-interaction components for enhanced user experience
 * Built on top of the animation system with accessibility considerations
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useHoverAnimation, useRippleEffect, useFocusAnimation } from './hooks';
import { buttonVariants, inputVariants, labelVariants } from './framer-motion';
import { TIMING, EASING } from './core';

// ============================================
// ANIMATED INPUT FIELD
// ============================================

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  success,
  icon,
  helperText,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));
  const { elementRef: inputRef } = useFocusAnimation();

  const isLabelFloating = isFocused || hasValue;
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value));
    props.onChange?.(e);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative"
        initial={false}
        animate={error ? 'error' : isFocused ? 'focus' : 'idle'}
        variants={inputVariants}
      >
        {icon && (
          <motion.div 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
            animate={{ 
              color: error ? '#ef4444' : isFocused ? '#3b82f6' : '#6b7280',
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: TIMING.quick / 1000 }}
          >
            {icon}
          </motion.div>
        )}
        
        <motion.input
          ref={inputRef}
          className={`
            w-full px-3 py-3 bg-white dark:bg-gray-800 border rounded-lg
            transition-colors duration-200 focus:outline-none
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'}
            ${error ? 'text-red-900' : 'text-gray-900 dark:text-white'}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {label && (
          <motion.label
            className={`
              absolute left-3 pointer-events-none origin-left
              transition-colors duration-200
              ${icon ? 'left-10' : 'left-3'}
              ${error ? 'text-red-500' : isFocused ? 'text-blue-500' : 'text-gray-500'}
            `}
            style={{ top: isLabelFloating ? '8px' : '50%' }}
            initial={false}
            animate={isLabelFloating ? 'float' : 'normal'}
            variants={labelVariants}
          >
            {label}
          </motion.label>
        )}

        {/* Focus ring */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' }}
          animate={{
            boxShadow: isFocused 
              ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
              : '0 0 0 0 rgba(59, 130, 246, 0)',
          }}
          transition={{ duration: TIMING.quick / 1000 }}
        />
      </motion.div>

      {/* Helper text and error messages */}
      <AnimatePresence mode="wait">
        {(error || helperText) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: TIMING.quick / 1000 }}
            className="mt-1 px-1"
          >
            <motion.p
              className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}
              animate={{ color: error ? '#ef4444' : '#6b7280' }}
            >
              {error || helperText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// ANIMATED TOGGLE SWITCH
// ============================================

interface AnimatedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
  description?: string;
}

export const AnimatedToggle: React.FC<AnimatedToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = '#3b82f6',
  label,
  description,
}) => {
  const { elementRef, isHovering } = useHoverAnimation({ disabled });

  const sizes = {
    sm: { width: 36, height: 20, knob: 16 },
    md: { width: 44, height: 24, knob: 20 },
    lg: { width: 52, height: 28, knob: 24 },
  };

  const currentSize = sizes[size];
  const knobOffset = currentSize.width - currentSize.knob - 4;

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <motion.div
        ref={elementRef}
        className="relative inline-flex items-center rounded-full transition-all duration-200"
        style={{
          width: currentSize.width,
          height: currentSize.height,
        }}
        initial={false}
        animate={{
          backgroundColor: checked ? color : '#d1d5db',
          scale: isHovering && !disabled ? 1.05 : 1,
        }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        transition={{ duration: TIMING.quick / 1000, ease: EASING.gentle }}
        onClick={handleClick}
      >
        {/* Knob */}
        <motion.div
          className="absolute bg-white rounded-full shadow-lg"
          style={{
            width: currentSize.knob,
            height: currentSize.knob,
          }}
          initial={false}
          animate={{
            x: checked ? knobOffset : 2,
            scale: isHovering && !disabled ? 1.1 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />

        {/* Ripple effect on activation */}
        <AnimatePresence>
          {checked && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: color }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <motion.label
              className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}
              animate={{ opacity: disabled ? 0.5 : 1 }}
            >
              {label}
            </motion.label>
          )}
          {description && (
            <motion.p
              className={`text-sm ${disabled ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}
              animate={{ opacity: disabled ? 0.3 : 1 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// ANIMATED CHECKBOX
// ============================================

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  size = 'md',
  color = '#3b82f6',
  label,
}) => {
  const { elementRef, isHovering } = useHoverAnimation({ disabled });
  const { elementRef: rippleRef, createRipple } = useRippleEffect({ disabled });

  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const currentSize = sizes[size];

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      createRipple(e);
      onChange(!checked);
    }
  };

  return (
    <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <motion.div
        ref={elementRef}
        className="relative inline-flex items-center justify-center border-2 rounded transition-all"
        style={{ width: currentSize, height: currentSize }}
        initial={false}
        animate={{
          backgroundColor: (checked || indeterminate) ? color : 'transparent',
          borderColor: (checked || indeterminate) ? color : '#d1d5db',
          scale: isHovering && !disabled ? 1.1 : 1,
        }}
        whileTap={disabled ? {} : { scale: 0.9 }}
        transition={{ duration: TIMING.quick / 1000 }}
        onClick={handleClick}
      >
        <div ref={rippleRef} className="absolute inset-0 rounded overflow-hidden" />
        
        {/* Checkmark */}
        <AnimatePresence>
          {checked && !indeterminate && (
            <motion.svg
              className="text-white"
              style={{ width: currentSize * 0.6, height: currentSize * 0.6 }}
              viewBox="0 0 24 24"
              fill="none"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 20,
              }}
            >
              <motion.path
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 6L9 17l-5-5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Indeterminate state */}
        <AnimatePresence>
          {indeterminate && (
            <motion.div
              className="bg-white rounded-sm"
              style={{ width: currentSize * 0.5, height: 2 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 20,
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {label && (
        <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

// ============================================
// ANIMATED TOOLTIP
// ============================================

interface AnimatedTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 500,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  const placementStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900',
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none ${placementStyles[placement]}`}
            initial={{ opacity: 0, scale: 0.9, y: placement === 'top' ? 4 : placement === 'bottom' ? -4 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: placement === 'top' ? 4 : placement === 'bottom' ? -4 : 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
          >
            {content}
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${arrowStyles[placement]}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// ANIMATED BUTTON
// ============================================

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rippleColor?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  rippleColor,
  className = '',
  disabled,
  ...props
}) => {
  const { elementRef, createRipple } = useRippleEffect({ 
    color: rippleColor,
    disabled: disabled || isLoading,
  });

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white border-transparent',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      createRipple(e);
      props.onClick?.(e);
    }
  };

  return (
    <motion.button
      ref={elementRef}
      className={`
        relative inline-flex items-center justify-center border rounded-lg font-medium
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        overflow-hidden
        ${sizes[size]}
        ${variants[variant]}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      variants={buttonVariants}
      initial="idle"
      whileHover={disabled || isLoading ? "idle" : "hover"}
      whileTap={disabled || isLoading ? "idle" : "tap"}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {/* Loading spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button content */}
      <motion.div
        className="flex items-center gap-2"
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: TIMING.quick / 1000 }}
      >
        {leftIcon && (
          <motion.span
            initial={{ x: -4, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {leftIcon}
          </motion.span>
        )}
        
        <motion.span
          initial={{ y: 2, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: leftIcon ? 0.15 : 0.1 }}
        >
          {children}
        </motion.span>
        
        {rightIcon && (
          <motion.span
            initial={{ x: 4, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {rightIcon}
          </motion.span>
        )}
      </motion.div>
    </motion.button>
  );
};
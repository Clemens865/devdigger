import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

// Types for sophisticated button configuration
export type ButtonVariant = 
  | 'primary'      // Main CTA buttons - COMMENCE, SUBMIT
  | 'secondary'    // Supporting actions
  | 'tertiary'     // Low-emphasis actions
  | 'ghost'        // Minimal, text-only
  | 'oracle'       // Mystical-themed special buttons
  | 'danger';      // Destructive actions

export type ButtonSize = 
  | 'tiny'         // 24px height - compact controls
  | 'small'        // 32px height - secondary actions
  | 'medium'       // 40px height - default
  | 'large'        // 48px height - prominent actions
  | 'xl';          // 56px height - hero buttons

export type IconPosition = 'left' | 'right' | 'only';

export type ButtonShape = 
  | 'rounded'      // Standard rounded corners
  | 'geometric'    // Sophisticated angular cuts
  | 'pill'         // Fully rounded
  | 'square';      // Sharp corners

export interface PremiumButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  
  // Icon system
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  
  // Loading states
  loading?: boolean;
  loadingText?: string;
  progress?: number; // 0-100 for progress buttons
  
  // Visual enhancements
  glow?: boolean;
  magnetic?: boolean; // Subtle attraction animation
  ripple?: boolean;
  
  // Special states
  success?: boolean;
  error?: boolean;
  
  // Layout
  fullWidth?: boolean;
  elevated?: boolean; // Extra depth/shadow
  
  // Accessibility
  'aria-label'?: string;
}

// Sophisticated animation variants
const buttonVariants = {
  default: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    z: 0,
  },
  hover: {
    scale: 1.02,
    rotateX: -2,
    rotateY: 2,
    z: 8,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      mass: 0.5 
    }
  },
  tap: {
    scale: 0.98,
    rotateX: 0,
    rotateY: 0,
    z: 0,
    transition: { 
      type: "spring", 
      stiffness: 600, 
      damping: 30 
    }
  }
};

// Ripple effect component
const RippleEffect: React.FC<{ trigger: boolean; onComplete: () => void }> = ({ 
  trigger, 
  onComplete 
}) => {
  return trigger ? (
    <motion.div
      className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute bg-white/20 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        initial={{ width: 0, height: 0 }}
        animate={{ 
          width: '300%', 
          height: '300%',
          opacity: [0.6, 0]
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut" 
        }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  ) : null;
};

// Sophisticated spinner for loading states
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const sizeMap = {
    tiny: 12,
    small: 14,
    medium: 16,
    large: 18,
    xl: 20
  };
  
  const spinnerSize = sizeMap[size];
  
  return (
    <motion.div
      className="relative mr-2"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{ width: spinnerSize, height: spinnerSize }}
    >
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 24 24"
        className="text-current"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray="60"
          strokeDashoffset="20"
          strokeLinecap="round"
          opacity="0.4"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray="30"
          strokeDashoffset="10"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(({
  children,
  variant = 'primary',
  size = 'medium',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  loading = false,
  loadingText,
  progress,
  glow = false,
  magnetic = false,
  ripple = false,
  success = false,
  error = false,
  fullWidth = false,
  elevated = false,
  className,
  disabled,
  onClick,
  ...props
}, ref) => {
  const [isRippling, setIsRippling] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle magnetic effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || disabled) return;
    
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      setMousePosition({
        x: deltaX * 0.1,
        y: deltaY * 0.1
      });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Handle ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled) {
      setIsRippling(true);
    }
    onClick?.(e);
  };

  // Size configurations
  const sizeConfigs = {
    tiny: {
      height: 'h-6',
      padding: 'px-2',
      text: 'text-xs',
      iconSize: 'w-3 h-3',
      gap: 'gap-1'
    },
    small: {
      height: 'h-8',
      padding: 'px-3',
      text: 'text-sm',
      iconSize: 'w-4 h-4',
      gap: 'gap-1.5'
    },
    medium: {
      height: 'h-10',
      padding: 'px-4',
      text: 'text-base',
      iconSize: 'w-5 h-5',
      gap: 'gap-2'
    },
    large: {
      height: 'h-12',
      padding: 'px-6',
      text: 'text-lg',
      iconSize: 'w-6 h-6',
      gap: 'gap-2.5'
    },
    xl: {
      height: 'h-14',
      padding: 'px-8',
      text: 'text-xl',
      iconSize: 'w-7 h-7',
      gap: 'gap-3'
    }
  };

  // Shape configurations with sophisticated geometric cuts
  const shapeConfigs = {
    rounded: 'rounded-lg',
    geometric: 'rounded-tl-lg rounded-br-lg rounded-tr-sm rounded-bl-sm',
    pill: 'rounded-full',
    square: 'rounded-none'
  };

  // Variant styles with premium materials
  const variantConfigs = {
    primary: {
      base: cn(
        'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
        'text-white font-semibold',
        'border border-white/20',
        'shadow-lg shadow-purple-500/25',
        glow && 'shadow-xl shadow-purple-500/40',
        elevated && 'shadow-2xl shadow-purple-500/30',
        'backdrop-blur-sm',
        'relative overflow-hidden'
      ),
      hover: 'hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 hover:shadow-xl hover:shadow-purple-500/50',
      focus: 'focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
      disabled: 'disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:shadow-none',
      overlay: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity'
    },
    secondary: {
      base: cn(
        'bg-gradient-to-br from-slate-100 to-slate-200',
        'dark:from-slate-800 dark:to-slate-900',
        'text-slate-900 dark:text-slate-100 font-medium',
        'border border-slate-300 dark:border-slate-600',
        'shadow-md shadow-slate-900/10',
        glow && 'shadow-lg shadow-slate-900/20',
        'backdrop-blur-sm'
      ),
      hover: 'hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-800 hover:shadow-lg',
      focus: 'focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2',
      disabled: 'disabled:from-gray-200 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-800'
    },
    tertiary: {
      base: cn(
        'bg-transparent',
        'text-slate-700 dark:text-slate-300 font-medium',
        'border border-slate-300/50 dark:border-slate-600/50',
        'shadow-sm'
      ),
      hover: 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-500',
      focus: 'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
      disabled: 'disabled:border-gray-300 dark:disabled:border-gray-600'
    },
    ghost: {
      base: cn(
        'bg-transparent',
        'text-slate-600 dark:text-slate-400 font-medium'
      ),
      hover: 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
      focus: 'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
      disabled: ''
    },
    oracle: {
      base: cn(
        'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500',
        'text-white font-bold',
        'border border-amber-300/30',
        'shadow-lg shadow-orange-500/30',
        glow && 'shadow-xl shadow-orange-500/50',
        'backdrop-blur-sm',
        'relative overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent'
      ),
      hover: 'hover:from-amber-300 hover:via-orange-400 hover:to-red-400 hover:shadow-xl hover:shadow-orange-500/60',
      focus: 'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
      disabled: 'disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600'
    },
    danger: {
      base: cn(
        'bg-gradient-to-br from-red-500 to-red-600',
        'text-white font-semibold',
        'border border-red-400/30',
        'shadow-lg shadow-red-500/25',
        glow && 'shadow-xl shadow-red-500/40',
        'backdrop-blur-sm'
      ),
      hover: 'hover:from-red-400 hover:to-red-500 hover:shadow-xl hover:shadow-red-500/50',
      focus: 'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
      disabled: 'disabled:from-gray-400 disabled:to-gray-500'
    }
  };

  const sizeConfig = sizeConfigs[size];
  const variantConfig = variantConfigs[variant];
  const shapeConfig = shapeConfigs[shape];

  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center',
        'font-medium transition-all duration-300',
        'focus:outline-none focus:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Size styles
        sizeConfig.height,
        sizeConfig.padding,
        sizeConfig.text,
        
        // Shape styles
        shapeConfig,
        
        // Variant styles
        variantConfig.base,
        !isDisabled && variantConfig.hover,
        variantConfig.focus,
        isDisabled && variantConfig.disabled,
        
        // Layout styles
        fullWidth && 'w-full',
        
        // State styles
        success && 'ring-2 ring-green-500',
        error && 'ring-2 ring-red-500',
        
        className
      )}
      variants={buttonVariants}
      initial="default"
      whileHover={!isDisabled && magnetic ? "hover" : undefined}
      whileTap={!isDisabled ? "tap" : undefined}
      animate={{
        x: magnetic ? mousePosition.x : 0,
        y: magnetic ? mousePosition.y : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
    >
      {/* Progress bar background for progress buttons */}
      {typeof progress === 'number' && (
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <motion.div
            className="absolute left-0 top-0 h-full bg-white/20"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Ripple effect */}
      <RippleEffect 
        trigger={isRippling} 
        onComplete={() => setIsRippling(false)} 
      />

      {/* Content container */}
      <span className={cn(
        'relative z-10 flex items-center',
        sizeConfig.gap,
        iconPosition === 'only' ? 'justify-center' : 'justify-start'
      )}>
        {/* Loading state */}
        {loading && <LoadingSpinner size={size} />}
        
        {/* Icon - left position */}
        {icon && iconPosition === 'left' && !loading && (
          <span className={cn('flex-shrink-0', sizeConfig.iconSize)}>
            {icon}
          </span>
        )}
        
        {/* Button text */}
        {iconPosition !== 'only' && (
          <span className="flex-1">
            {loading && loadingText ? loadingText : children}
          </span>
        )}
        
        {/* Icon - right position or icon-only */}
        {icon && (iconPosition === 'right' || iconPosition === 'only') && !loading && (
          <span className={cn('flex-shrink-0', sizeConfig.iconSize)}>
            {icon}
          </span>
        )}
      </span>

      {/* Shimmer effect for oracle variant */}
      {variant === 'oracle' && (
        <motion.div
          className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
});

PremiumButton.displayName = 'PremiumButton';
import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ripple?: boolean;
  magnetic?: boolean;
  gradient?: boolean;
  glow?: boolean;
  rounded?: boolean;
  children?: React.ReactNode;
}

export interface RipplePoint {
  x: number;
  y: number;
  id: number;
}

const ButtonV2 = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    ripple = true,
    magnetic = true,
    gradient = false,
    glow = false,
    rounded = false,
    children,
    onClick,
    onMouseMove,
    onMouseLeave,
    disabled,
    ...props
  }, ref) => {
    const [ripples, setRipples] = useState<RipplePoint[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Base button classes
    const baseClasses = cn(
      'button-v2',
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-all',
      'duration-200',
      'ease-out',
      'overflow-hidden',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'active:scale-95',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:transform-none',
      {
        'rounded-full': rounded,
        'rounded-lg': !rounded,
        'cursor-wait': loading,
        'animate-glow': glow && !disabled,
      }
    );

    // Variant classes
    const variantClasses = {
      primary: cn(
        'bg-blue-600 text-white',
        'hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25',
        'focus:ring-blue-500',
        'border border-blue-600',
        gradient && 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
      ),
      secondary: cn(
        'bg-gray-100 text-gray-900 border border-gray-200',
        'hover:bg-gray-200 hover:border-gray-300 hover:shadow-md',
        'focus:ring-gray-500',
        'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
        'dark:hover:bg-gray-700 dark:hover:border-gray-600'
      ),
      ghost: cn(
        'bg-transparent text-gray-700 border border-transparent',
        'hover:bg-gray-100 hover:text-gray-900',
        'focus:ring-gray-500',
        'dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
      ),
      outline: cn(
        'bg-transparent text-blue-600 border-2 border-blue-600',
        'hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/25',
        'focus:ring-blue-500',
        'dark:text-blue-400 dark:border-blue-400',
        'dark:hover:bg-blue-400 dark:hover:text-gray-900'
      ),
      text: cn(
        'bg-transparent text-blue-600 border border-transparent',
        'hover:text-blue-700 hover:bg-blue-50',
        'focus:ring-blue-500',
        'dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20'
      ),
    };

    // Size classes
    const sizeClasses = {
      xs: 'h-6 px-2 text-xs gap-1',
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    };

    // Handle ripple effect
    const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || disabled || loading) return;

      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple: RipplePoint = {
        x,
        y,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, 600);
    };

    // Handle magnetic effect
    const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || disabled || loading) return;

      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      setMousePosition({ x: x * 0.1, y: y * 0.1 });
      onMouseMove?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
      setMousePosition({ x: 0, y: 0 });
      setIsHovered(false);
      onMouseLeave?.(event);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      handleRipple(event);
      onClick?.(event);
    };

    const magneticStyle = magnetic && !disabled && !loading
      ? {
          transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
        }
      : {};

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={magneticStyle}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        disabled={disabled || loading}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute animate-ripple rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}

        {/* Gradient overlay for hover effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          </div>
        )}

        {/* Content */}
        <div className={cn('flex items-center gap-inherit', loading && 'opacity-0')}>
          {icon && iconPosition === 'left' && (
            <span className="inline-flex items-center justify-center">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="inline-flex items-center justify-center">{icon}</span>
          )}
        </div>
      </button>
    );
  }
);

ButtonV2.displayName = 'ButtonV2';

// Floating Action Button
export const FloatingActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, size = 'md', ...props }, ref) => {
    const fabSizes = {
      xs: 'w-8 h-8',
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-14 h-14',
    };

    return (
      <ButtonV2
        ref={ref}
        className={cn(
          'fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl',
          fabSizes[size],
          'p-0 rounded-full',
          className
        )}
        size={size}
        rounded
        glow
        magnetic
        {...props}
      >
        {children}
      </ButtonV2>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

// Icon Button with Tooltip
export interface IconButtonProps extends ButtonProps {
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, tooltip, tooltipPosition = 'top', className, ...props }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative inline-flex">
        <ButtonV2
          ref={ref}
          className={cn('aspect-square p-0', className)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          {...props}
        >
          {children}
        </ButtonV2>
        
        {tooltip && showTooltip && (
          <div
            className={cn(
              'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg',
              'transition-opacity duration-200',
              'pointer-events-none whitespace-nowrap',
              {
                'bottom-full mb-2 left-1/2 transform -translate-x-1/2': tooltipPosition === 'top',
                'top-full mt-2 left-1/2 transform -translate-x-1/2': tooltipPosition === 'bottom',
                'right-full mr-2 top-1/2 transform -translate-y-1/2': tooltipPosition === 'left',
                'left-full ml-2 top-1/2 transform -translate-y-1/2': tooltipPosition === 'right',
              }
            )}
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  }
);

IconButton.displayName = 'IconButton';

// Button Group
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal',
  variant = 'secondary',
  size = 'md',
}) => {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        '[&>button]:rounded-none',
        '[&>button:first-child]:rounded-l-lg',
        '[&>button:last-child]:rounded-r-lg',
        orientation === 'vertical' && '[&>button:first-child]:rounded-t-lg [&>button:first-child]:rounded-l-none',
        orientation === 'vertical' && '[&>button:last-child]:rounded-b-lg [&>button:last-child]:rounded-r-none',
        '[&>button:not(:first-child)]:border-l-0',
        orientation === 'vertical' && '[&>button:not(:first-child)]:border-l [&>button:not(:first-child)]:border-t-0',
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<ButtonProps>, {
              variant,
              size,
              magnetic: false, // Disable magnetic in groups
            })
          : child
      )}
    </div>
  );
};

// Toggle Button
export interface ToggleButtonProps extends Omit<ButtonProps, 'onClick'> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ pressed = false, onPressedChange, className, variant = 'outline', ...props }, ref) => {
    const handleClick = () => {
      onPressedChange?.(!pressed);
    };

    return (
      <ButtonV2
        ref={ref}
        className={cn(
          pressed && variant === 'outline' && 'bg-blue-600 text-white border-blue-600',
          pressed && variant === 'ghost' && 'bg-blue-100 text-blue-900',
          className
        )}
        variant={variant}
        onClick={handleClick}
        aria-pressed={pressed}
        {...props}
      />
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

export { ButtonV2 as Button };
export default ButtonV2;
import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// Button Group for related actions
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xl';
  variant?: 'connected' | 'spaced';
  className?: string;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(({
  children,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'connected',
  className
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        variant === 'connected' 
          ? orientation === 'horizontal' 
            ? '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:border-l-0'
            : '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:border-t-0'
          : orientation === 'horizontal'
            ? 'gap-1'
            : 'gap-1',
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
});

ButtonGroup.displayName = 'ButtonGroup';

// Segmented Control for exclusive selection
export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(({
  options,
  value,
  onChange,
  size = 'medium',
  fullWidth = false,
  className
}, ref) => {
  const sizeClasses = {
    small: 'text-sm px-3 py-1.5',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3'
  };

  const selectedIndex = options.findIndex(option => option.value === value);

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1',
        fullWidth && 'w-full',
        className
      )}
      role="tablist"
    >
      {/* Background indicator */}
      <motion.div
        className="absolute bg-white dark:bg-slate-700 rounded-md shadow-sm"
        layoutId="segmented-control-indicator"
        style={{
          width: `${100 / options.length}%`,
          height: 'calc(100% - 8px)',
          top: 4,
          left: `${(selectedIndex * 100) / options.length}%`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      
      {options.map((option) => (
        <button
          key={option.value}
          className={cn(
            'relative z-10 inline-flex items-center justify-center gap-2',
            'font-medium transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[size],
            fullWidth && 'flex-1',
            value === option.value
              ? 'text-slate-900 dark:text-slate-100'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => !option.disabled && onChange(option.value)}
          disabled={option.disabled}
          role="tab"
          aria-selected={value === option.value}
        >
          {option.icon && (
            <span className="w-4 h-4 flex-shrink-0">
              {option.icon}
            </span>
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
});

SegmentedControl.displayName = 'SegmentedControl';

// Floating Action Button
export interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  extended?: boolean; // Extended FAB with text
  className?: string;
  disabled?: boolean;
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(({
  children,
  onClick,
  position = 'bottom-right',
  size = 'medium',
  variant = 'primary',
  extended = false,
  className,
  disabled = false,
  ...props
}, ref) => {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  const sizeClasses = {
    small: extended ? 'h-12 px-4 gap-2 text-sm' : 'w-12 h-12',
    medium: extended ? 'h-14 px-6 gap-3 text-base' : 'w-14 h-14',
    large: extended ? 'h-16 px-8 gap-4 text-lg' : 'w-16 h-16'
  };

  const variants = {
    primary: cn(
      'bg-gradient-to-br from-indigo-500 to-purple-600',
      'hover:from-indigo-400 hover:to-purple-500',
      'text-white shadow-lg shadow-purple-500/25',
      'hover:shadow-xl hover:shadow-purple-500/40'
    ),
    secondary: cn(
      'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
      'border border-slate-300 dark:border-slate-600',
      'hover:bg-slate-50 dark:hover:bg-slate-700',
      'shadow-lg'
    )
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center',
        'font-medium transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'rounded-full z-50',
        positions[position],
        sizeClasses[size],
        variants[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

// Split Button - main action + dropdown
export interface SplitButtonProps {
  children: React.ReactNode;
  onMainClick: () => void;
  onDropdownClick: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  dropdownIcon?: React.ReactNode;
}

export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(({
  children,
  onMainClick,
  onDropdownClick,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  className,
  dropdownIcon
}, ref) => {
  const sizeClasses = {
    small: 'h-8 text-sm',
    medium: 'h-10 text-base',
    large: 'h-12 text-lg'
  };

  const variants = {
    primary: {
      main: cn(
        'bg-gradient-to-br from-indigo-500 to-purple-600',
        'hover:from-indigo-400 hover:to-purple-500',
        'text-white border border-white/20'
      ),
      dropdown: cn(
        'bg-gradient-to-br from-purple-600 to-indigo-600',
        'hover:from-purple-500 hover:to-indigo-500',
        'text-white border border-white/20 border-l-white/40'
      )
    },
    secondary: {
      main: cn(
        'bg-slate-100 dark:bg-slate-800',
        'hover:bg-slate-200 dark:hover:bg-slate-700',
        'text-slate-900 dark:text-slate-100',
        'border border-slate-300 dark:border-slate-600'
      ),
      dropdown: cn(
        'bg-slate-200 dark:bg-slate-700',
        'hover:bg-slate-300 dark:hover:bg-slate-600',
        'text-slate-900 dark:text-slate-100',
        'border border-slate-300 dark:border-slate-600 border-l-slate-400 dark:border-l-slate-500'
      )
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex rounded-lg overflow-hidden shadow-sm',
        className
      )}
    >
      {/* Main button */}
      <button
        className={cn(
          'inline-flex items-center justify-center px-4',
          'font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          variants[variant].main,
          'rounded-r-none'
        )}
        onClick={onMainClick}
        disabled={disabled}
      >
        {children}
      </button>

      {/* Dropdown button */}
      <button
        className={cn(
          'inline-flex items-center justify-center px-2',
          'font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          variants[variant].dropdown,
          'rounded-l-none'
        )}
        onClick={onDropdownClick}
        disabled={disabled}
      >
        {dropdownIcon || (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );
});

SplitButton.displayName = 'SplitButton';
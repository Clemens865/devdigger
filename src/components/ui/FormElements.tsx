import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Custom Checkbox Component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, indeterminate, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className={cn('checkbox-custom', className)}
            {...props}
          />
          {indeterminate && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-0.5 bg-white rounded"></div>
            </div>
          )}
        </div>
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Custom Radio Button Component
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="radio"
          className={cn('radio-custom', className)}
          {...props}
        />
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// Radio Group Component
export interface RadioGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  className,
  orientation = 'vertical',
  name,
  value,
  onValueChange,
}) => {
  return (
    <div
      className={cn(
        'space-y-3',
        orientation === 'horizontal' && 'flex space-x-6 space-y-0',
        className
      )}
      role="radiogroup"
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<RadioProps>, {
              name,
              checked: child.props.value === value,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                onValueChange?.(e.target.value);
                child.props.onChange?.(e);
              },
            })
          : child
      )}
    </div>
  );
};

// Custom Switch Component
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'switch-custom-sm',
      md: 'switch-custom',
      lg: 'switch-custom-lg',
    };

    return (
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="checkbox"
          className={cn(sizeClasses[size], className)}
          {...props}
        />
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

// Custom Range Slider Component
export interface RangeSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  thumbColor?: string;
  trackColor?: string;
}

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  ({ 
    className, 
    label, 
    showValue = true, 
    formatValue = (value) => value.toString(),
    value,
    min = 0,
    max = 100,
    step = 1,
    ...props 
  }, ref) => {
    const [currentValue, setCurrentValue] = useState(value || min);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setCurrentValue(newValue);
      props.onChange?.(e);
    };

    const percentage = ((Number(currentValue) - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {label}
            </label>
            {showValue && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatValue(Number(currentValue))}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            className={cn('range-custom w-full', className)}
            value={currentValue}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #d1d5db ${percentage}%, #d1d5db 100%)`,
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';

// Split Button Component
export interface SplitButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  onDropdownClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  dropdownOpen?: boolean;
  dropdownContent?: React.ReactNode;
}

export const SplitButton: React.FC<SplitButtonProps> = ({
  children,
  onClick,
  onDropdownClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  dropdownOpen = false,
  dropdownContent,
}) => {
  const [isOpen, setIsOpen] = useState(dropdownOpen);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
    onDropdownClick?.();
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
  };

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  return (
    <div className="relative inline-flex split-button">
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          'split-main px-4 rounded-l-lg',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </button>
      
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          'split-dropdown px-2 rounded-r-lg',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleDropdownClick}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Content */}
      {isOpen && dropdownContent && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-full">
          {dropdownContent}
        </div>
      )}
    </div>
  );
};

// File Upload Component with drag and drop
export interface FileUploadProps {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  multiple = false,
  disabled = false,
  className,
  children,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      onFileSelect?.(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect?.(e.target.files);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-all',
        'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10',
        isDragOver && 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
      />
      {children || (
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <span className="font-medium text-blue-600">Click to upload</span>
            <span className="text-gray-500"> or drag and drop</span>
          </div>
          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
};

export default {
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  RangeSlider,
  SplitButton,
  FileUpload,
};
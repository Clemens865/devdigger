import { SVGProps } from 'react';

// Size variants for responsive icon system
export type IconSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 64;

// Animation types for micro-interactions
export type IconAnimation = 
  | 'spin'
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'flip'
  | 'scale'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'none';

// Icon style variants
export type IconStyle = 'line' | 'filled' | 'duotone';

// Color themes for icon system
export type IconColor = 
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'muted'
  | string; // Custom color values

// Base props for all icons
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'size' | 'color'> {
  /** Icon size in pixels */
  size?: IconSize;
  
  /** Icon color - theme color or custom hex/rgb */
  color?: IconColor;
  
  /** Rotation angle in degrees */
  rotation?: number;
  
  /** Animation type for micro-interactions */
  animation?: IconAnimation;
  
  /** Icon style variant */
  variant?: IconStyle;
  
  /** Whether icon should be mirrored horizontally */
  flip?: boolean;
  
  /** Accessibility label for screen readers */
  'aria-label'?: string;
  
  /** Additional CSS classes */
  className?: string;
}

// Icon categories for organization
export type IconCategory = 
  | 'navigation'
  | 'actions'
  | 'states'
  | 'files'
  | 'data'
  | 'communication'
  | 'security'
  | 'development'
  | 'utility'
  | 'brand';

// Icon registry for dynamic loading
export interface IconDefinition {
  name: string;
  category: IconCategory;
  tags: string[];
  description: string;
  component: React.ComponentType<IconProps>;
}

// Loading states for icon system
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Icon grid configuration for showcases
export interface IconGridConfig {
  columns: number;
  gap: number;
  showLabels: boolean;
  showCode: boolean;
  size: IconSize;
}

// Theme configuration for icon colors
export interface IconTheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  neutral: string;
  muted: string;
  background: string;
  surface: string;
}

// Animation configuration
export interface AnimationConfig {
  duration: number;
  timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  delay?: number;
  iteration?: number | 'infinite';
}

// Icon utility functions interface
export interface IconUtils {
  getIconByName: (name: string) => IconDefinition | undefined;
  getIconsByCategory: (category: IconCategory) => IconDefinition[];
  searchIcons: (query: string) => IconDefinition[];
  validateIconProps: (props: IconProps) => boolean;
}

// Export types for external consumption
export type {
  SVGProps
} from 'react';
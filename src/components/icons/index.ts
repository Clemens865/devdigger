// DevDigger Icon System - Main Export File

// Core Icon System
export * from './IconSystem';
export * from './types';
export { IconRegistry, iconRegistry, DynamicIcon, IconPicker } from './IconRegistry';

// Specialized Components
export { default as LoadingSpinners } from './LoadingSpinners';
export { default as EmptyStateGraphics, EmptyState } from './EmptyStateGraphics';

// Individual Component Exports
export {
  CircularSpinner,
  DotsSpinner,
  TriangleSpinner,
  SquareSpinner,
  HexagonSpinner,
  WaveSpinner,
  HelixSpinner,
  GridSpinner,
  AtomSpinner,
  MorphSpinner,
  ProgressRingSpinner
} from './LoadingSpinners';

export {
  NoDataGraphic,
  EmptyFolderGraphic,
  NoCollectionsGraphic,
  NoMiningResultsGraphic,
  NoConnectionGraphic,
  NoNotificationsGraphic,
  UnderConstructionGraphic,
  ErrorStateGraphic,
  SuccessStateGraphic,
  WelcomeGraphic
} from './EmptyStateGraphics';

// Type Exports
export type {
  IconProps,
  IconSize,
  IconAnimation,
  IconStyle,
  IconColor,
  IconCategory,
  IconDefinition,
  LoadingState,
  IconGridConfig,
  IconTheme,
  AnimationConfig,
  IconUtils
} from './types';

// Utility Functions
export const getIconByName = (name: string) => iconRegistry.getIconByName(name);
export const getIconsByCategory = (category: string) => iconRegistry.getIconsByCategory(category as any);
export const searchIcons = (query: string) => iconRegistry.searchIcons(query);
export const getAllIcons = () => iconRegistry.getAllIcons();
export const getIconCategories = () => iconRegistry.getCategories();

// Icon System Constants
export const ICON_SIZES = [12, 16, 20, 24, 28, 32, 40, 48, 64] as const;
export const ICON_ANIMATIONS = [
  'spin', 'pulse', 'bounce', 'shake', 'flip', 'scale', 'fade',
  'slide-up', 'slide-down', 'slide-left', 'slide-right', 'none'
] as const;
export const ICON_CATEGORIES = [
  'navigation', 'actions', 'states', 'files', 'data',
  'communication', 'security', 'development', 'utility', 'brand'
] as const;
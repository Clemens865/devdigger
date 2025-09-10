/**
 * DevDigger Icon System - Main Export
 * 
 * Centralized export for the complete icon system including static icons,
 * animated variants, theming, and utilities.
 */

// Core icon system
export * from './icon-system';
export { default as DevDiggerIcons } from './icon-system';

// Animated icons
export * from './animated-icons';
export { default as AnimatedDevDiggerIcons } from './animated-icons';

// Gradients and effects
export { default as IconGradients } from './gradients';

// Re-export commonly used icons for convenience
export {
  // Oracle & Mystical
  OracleEye,
  CrystalBall,
  SacredScroll,
  RuneStone,
  MysticFlame,
  
  // Archaeological & Exploration
  DigitalPickaxe,
  DataBrush,
  CompassGrid,
  LayerScan,
  
  // Developer & Technical
  CodeOracle,
  GitBranch,
  DatabaseCrystal,
  APIPortal,
  
  // Navigation & Interface
  MineIcon,
  ExploreIcon,
  SearchCrystal,
  ArchiveVault,
  
  // Wisdom & Insight
  WisdomTree,
  InsightBeam,
  KnowledgeGem,
  
  // Utility & Actions
  PlusOrb,
  DeleteVoid,
  EditQuill,
  SaveRune,
  
  // Data Visualization
  DataFlow,
  MetricsGalaxy,
  
  // Status & State
  LoadingOrb,
  SuccessAura,
  ErrorVortex,
  WarningBeacon,
  InfoPrism,
} from './icon-system';

// Re-export animated icons
export {
  AnimatedOracleEye,
  AnimatedCrystalBall,
  AnimatedMysticFlame,
  AnimatedLoadingOrb,
  AnimatedSearchCrystal,
  AnimatedDataFlow,
  AnimatedAPIPortal,
} from './animated-icons';

// Type exports
export type { IconProps, IconSize, IconStyle } from './icon-system';

// Icon collections for easy access
export const OracleIcons = {
  OracleEye,
  CrystalBall,
  SacredScroll,
  RuneStone,
  MysticFlame,
} as const;

export const DeveloperIcons = {
  CodeOracle,
  GitBranch,
  DatabaseCrystal,
  APIPortal,
} as const;

export const NavigationIcons = {
  MineIcon,
  ExploreIcon,
  SearchCrystal,
  ArchiveVault,
} as const;

export const StatusIcons = {
  LoadingOrb,
  SuccessAura,
  ErrorVortex,
  WarningBeacon,
  InfoPrism,
} as const;

export const UtilityIcons = {
  PlusOrb,
  DeleteVoid,
  EditQuill,
  SaveRune,
} as const;

// Icon theme utilities
export const iconThemeClasses = {
  // Sizes
  sizes: {
    xs: 'icon-xs',
    sm: 'icon-sm', 
    md: 'icon-md',
    lg: 'icon-lg',
    xl: 'icon-xl',
  },
  
  // Styles
  styles: {
    outline: 'icon-outline',
    filled: 'icon-filled',
    duotone: 'icon-duotone',
    gradient: 'icon-gradient',
  },
  
  // Colors
  colors: {
    primary: 'icon-primary',
    secondary: 'icon-secondary',
    accent: 'icon-accent',
    success: 'icon-success',
    warning: 'icon-warning',
    error: 'icon-error',
    info: 'icon-info',
    oracle: 'icon-oracle',
    crystal: 'icon-crystal',
    wisdom: 'icon-wisdom',
  },
  
  // Effects
  effects: {
    glow: 'icon-glow',
    mystical: 'icon-mystical',
    animate: 'icon-animate',
    pulse: 'icon-pulse',
    spin: 'icon-spin',
    bounce: 'icon-bounce',
    interactive: 'icon-interactive',
  },
  
  // States
  states: {
    loading: 'icon-loading',
    disabled: 'icon-disabled',
  },
} as const;

// Helper function to generate icon class names
export const getIconClasses = ({
  size = 'md',
  style = 'outline',
  color,
  effect,
  state,
  className,
}: {
  size?: keyof typeof iconThemeClasses.sizes;
  style?: keyof typeof iconThemeClasses.styles;
  color?: keyof typeof iconThemeClasses.colors;
  effect?: keyof typeof iconThemeClasses.effects;
  state?: keyof typeof iconThemeClasses.states;
  className?: string;
} = {}) => {
  const classes = [
    iconThemeClasses.sizes[size],
    iconThemeClasses.styles[style],
  ];
  
  if (color) classes.push(iconThemeClasses.colors[color]);
  if (effect) classes.push(iconThemeClasses.effects[effect]);
  if (state) classes.push(iconThemeClasses.states[state]);
  if (className) classes.push(className);
  
  return classes.filter(Boolean).join(' ');
};

// Icon registry for dynamic loading
export const iconRegistry = new Map([
  // Oracle & Mystical
  ['oracle-eye', OracleEye],
  ['crystal-ball', CrystalBall],
  ['sacred-scroll', SacredScroll],
  ['rune-stone', RuneStone],
  ['mystic-flame', MysticFlame],
  
  // Archaeological & Exploration
  ['digital-pickaxe', DigitalPickaxe],
  ['data-brush', DataBrush],
  ['compass-grid', CompassGrid],
  ['layer-scan', LayerScan],
  
  // Developer & Technical
  ['code-oracle', CodeOracle],
  ['git-branch', GitBranch],
  ['database-crystal', DatabaseCrystal],
  ['api-portal', APIPortal],
  
  // Navigation & Interface
  ['mine', MineIcon],
  ['explore', ExploreIcon],
  ['search', SearchCrystal],
  ['archive', ArchiveVault],
  
  // Wisdom & Insight
  ['wisdom-tree', WisdomTree],
  ['insight-beam', InsightBeam],
  ['knowledge-gem', KnowledgeGem],
  
  // Utility & Actions
  ['add', PlusOrb],
  ['delete', DeleteVoid],
  ['edit', EditQuill],
  ['save', SaveRune],
  
  // Data Visualization
  ['data-flow', DataFlow],
  ['metrics', MetricsGalaxy],
  
  // Status & State
  ['loading', LoadingOrb],
  ['success', SuccessAura],
  ['error', ErrorVortex],
  ['warning', WarningBeacon],
  ['info', InfoPrism],
]);

// Helper function to get icon by name
export const getIcon = (name: string) => {
  return iconRegistry.get(name);
};

// Default export for the complete icon system
export default {
  // All icons
  ...DevDiggerIcons,
  ...AnimatedDevDiggerIcons,
  
  // Collections
  OracleIcons,
  DeveloperIcons,
  NavigationIcons,
  StatusIcons,
  UtilityIcons,
  
  // Utilities
  iconThemeClasses,
  getIconClasses,
  iconRegistry,
  getIcon,
};
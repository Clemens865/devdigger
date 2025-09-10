/**
 * DevDigger Icon System
 * 
 * A comprehensive icon library that balances mystical oracle themes with modern design.
 * Features sacred geometry, minimalist aesthetics, and consistent visual language.
 */

import { forwardRef, type SVGAttributes } from 'react';
import { cn } from '../../lib/utils';

// Icon size definitions based on 24x24 grid system
export const iconSizes = {
  xs: 16,
  sm: 20, 
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export type IconSize = keyof typeof iconSizes;

// Icon style variants
export type IconStyle = 'outline' | 'filled' | 'duotone' | 'gradient';

// Base icon props
export interface IconProps extends Omit<SVGAttributes<SVGElement>, 'viewBox'> {
  size?: IconSize | number;
  style?: IconStyle;
  className?: string;
  animate?: boolean;
}

// Base icon component with consistent structure
const IconBase = forwardRef<SVGSVGElement, IconProps & { children: React.ReactNode; viewBox?: string }>(
  ({ size = 'md', style = 'outline', className, animate = false, children, viewBox = '0 0 24 24', ...props }, ref) => {
    const sizeValue = typeof size === 'number' ? size : iconSizes[size];
    
    return (
      <svg
        ref={ref}
        width={sizeValue}
        height={sizeValue}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'transition-all duration-200',
          style === 'outline' && 'stroke-current fill-none',
          style === 'filled' && 'fill-current stroke-none',
          style === 'duotone' && 'fill-current stroke-current',
          style === 'gradient' && 'fill-url(#gradient) stroke-none',
          animate && 'hover:scale-110 hover:rotate-1',
          className
        )}
        strokeWidth={style === 'outline' ? 1.5 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* Gradient definitions for gradient style */}
        {style === 'gradient' && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        )}
        {children}
      </svg>
    );
  }
);

IconBase.displayName = 'IconBase';

// ORACLE & MYSTICAL ICONS
// Sacred geometry and mystical symbols

export const OracleEye = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* All-seeing eye with sacred geometry */}
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    {/* Sacred triangles */}
    <path d="M8.5 8.5 12 5l3.5 3.5M8.5 15.5 12 19l3.5-3.5" opacity="0.4" />
  </IconBase>
));

export const CrystalBall = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Crystal sphere with mystical energy */}
    <circle cx="12" cy="12" r="8" />
    <path d="M6 12a6 6 0 0 1 12 0" opacity="0.6" />
    <path d="M8 8a6 6 0 0 1 8 8" opacity="0.4" />
    <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.8" />
    {/* Energy waves */}
    <path d="M4 12h2M18 12h2M12 4v2M12 18v2" strokeWidth="1" />
  </IconBase>
));

export const SacredScroll = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Ancient scroll with mystical text */}
    <path d="M4 6v12c0 1 .5 2 2 2h12c1.5 0 2-1 2-2V6c0-1-.5-2-2-2H6c-1.5 0-2 1-2 2Z" />
    <path d="M2 6h20M2 18h20" strokeWidth="1" />
    {/* Mystical symbols inside */}
    <path d="M8 10h8M8 12h6M8 14h4" strokeWidth="1" opacity="0.6" />
    <circle cx="16" cy="14" r="1" fill="currentColor" opacity="0.4" />
  </IconBase>
));

export const RuneStone = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Mystical rune stone */}
    <path d="M6 4h12l2 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l2-4Z" />
    {/* Runic symbols */}
    <path d="M9 10v6M9 12h2v2M15 10v6M13 12h2" strokeWidth="1.5" />
    <path d="M12 8l-1 1 1 1 1-1-1-1Z" fill="currentColor" />
  </IconBase>
));

export const MysticFlame = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Sacred flame with energy */}
    <path d="M12 2c-1 3-3 4-3 8 0 3 2 6 5 6s5-3 5-6c0-4-2-5-3-8" />
    <path d="M12 6c-1 2-2 2-2 4 0 2 1 3 2 3s2-1 2-3c0-2-1-2-2-4" opacity="0.6" />
    {/* Energy aura */}
    <path d="M6 18c2 2 6 2 12 0M8 20c1 1 3 1 8 0" strokeWidth="1" opacity="0.4" />
  </IconBase>
));

// ARCHAEOLOGICAL & EXPLORATION ICONS
// Tools and symbols for digital archaeology

export const DigitalPickaxe = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Modern archaeological tool */}
    <path d="M14.5 6.5 18 3l1 1-3.5 3.5L14.5 6.5ZM6.5 14.5 3 18l1 1 3.5-3.5-1-1Z" />
    <path d="M14.5 6.5 6.5 14.5l2 2 8-8-2-2Z" />
    {/* Digital elements */}
    <rect x="9" y="9" width="2" height="2" fill="currentColor" opacity="0.6" />
    <rect x="11" y="11" width="2" height="2" fill="currentColor" opacity="0.4" />
  </IconBase>
));

export const DataBrush = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Precision data cleaning tool */}
    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
    <path d="M9 9h6M9 13h6M9 17h4" strokeWidth="1" opacity="0.6" />
    {/* Brush bristles */}
    <path d="M8 3v4M10 3v4M12 3v4M14 3v4M16 3v4" strokeWidth="1.5" />
  </IconBase>
));

export const CompassGrid = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Navigation compass with grid overlay */}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v18M3 12h18" strokeWidth="1" opacity="0.4" />
    <path d="M6.3 6.3l11.4 11.4M6.3 17.7L17.7 6.3" strokeWidth="0.5" opacity="0.3" />
    {/* Compass needle */}
    <path d="M12 8l2 4-2 4-2-4 2-4Z" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </IconBase>
));

export const LayerScan = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Archaeological layer scanning */}
    <rect x="4" y="4" width="16" height="3" rx="1" opacity="0.8" />
    <rect x="4" y="9" width="16" height="3" rx="1" opacity="0.6" />
    <rect x="4" y="14" width="16" height="3" rx="1" opacity="0.4" />
    <rect x="4" y="19" width="16" height="1" rx="0.5" opacity="0.2" />
    {/* Scanning beam */}
    <path d="M2 8h20M2 13h20" strokeWidth="0.5" opacity="0.6" />
  </IconBase>
));

// DEVELOPER & TECHNICAL ICONS
// Modern development tools with mystical touches

export const CodeOracle = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Code window with mystical elements */}
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <path d="M2 7h20" strokeWidth="1" />
    {/* Terminal symbols with mystical flair */}
    <path d="M6 11l3 2-3 2M10 15h4" strokeWidth="1.5" />
    {/* Sacred geometry overlay */}
    <circle cx="17" cy="13" r="1" fill="currentColor" opacity="0.6" />
    <path d="M16 12l2 2-2 2" strokeWidth="0.5" opacity="0.4" />
  </IconBase>
));

export const GitBranch = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Git branching with organic flow */}
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="18" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path d="M9 6h6M15 9v6" strokeWidth="2" />
    {/* Mystical connection */}
    <path d="M6 9v3a3 3 0 0 0 3 3h6" strokeWidth="1.5" opacity="0.7" />
  </IconBase>
));

export const DatabaseCrystal = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Crystal-like database structure */}
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14a9 3 0 0 0 18 0V5" />
    <path d="M3 12a9 3 0 0 0 18 0" />
    {/* Crystal facets */}
    <path d="M8 5l4-2 4 2M8 12l4-2 4 2M8 19l4-2 4 2" strokeWidth="0.5" opacity="0.4" />
  </IconBase>
));

export const APIPortal = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Mystical portal for API connections */}
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" opacity="0.6" />
    <circle cx="12" cy="12" r="3" opacity="0.4" />
    {/* Portal energy streams */}
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeWidth="1" />
    <path d="M6.3 6.3l4.2 4.2M13.5 13.5l4.2 4.2M6.3 17.7l4.2-4.2M13.5 10.5l4.2-4.2" strokeWidth="0.5" opacity="0.6" />
  </IconBase>
));

// NAVIGATION & INTERFACE ICONS
// Clean interface elements with subtle mystical touches

export const MineIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Mining/exploration icon */}
    <path d="M8 3l4 4 4-4v6l-4 4-4-4V3Z" />
    <path d="M3 14l4 4 4-4-4-4-4 4ZM13 14l4 4 4-4-4-4-4 4Z" opacity="0.7" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
  </IconBase>
));

export const ExploreIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Exploration with compass elements */}
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l4-4 4 4-4 4-4-4Z" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeWidth="1" opacity="0.4" />
  </IconBase>
));

export const SearchCrystal = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Crystal-enhanced search */}
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" strokeWidth="2" />
    {/* Crystal facets inside */}
    <path d="M7 11l4-2 4 2-4 2-4-2Z" opacity="0.6" />
    <path d="M9 9l2-1 2 1M9 13l2 1 2-1" strokeWidth="0.5" opacity="0.4" />
  </IconBase>
));

export const ArchiveVault = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Mystical archive vault */}
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 8h18M3 16h18" strokeWidth="1" opacity="0.6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    {/* Mystical lock pattern */}
    <path d="M10 10l4 4M10 14l4-4" strokeWidth="0.5" opacity="0.4" />
  </IconBase>
));

// WISDOM & INSIGHT ICONS
// Symbols of knowledge and revelation

export const WisdomTree = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Tree of knowledge */}
    <path d="M12 22V12M8 22l8-10M16 22L8 12" strokeWidth="2" />
    <circle cx="12" cy="8" r="6" />
    <circle cx="9" cy="6" r="1.5" fill="currentColor" opacity="0.8" />
    <circle cx="15" cy="6" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="10" r="1" fill="currentColor" opacity="0.4" />
  </IconBase>
));

export const InsightBeam = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Beam of insight/revelation */}
    <path d="M12 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4Z" />
    <path d="M12 13v9M8 18l4-2 4 2M6 20l6-3 6 3" strokeWidth="1" opacity="0.6" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </IconBase>
));

export const KnowledgeGem = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Crystallized knowledge */}
    <path d="M6 3h12l3 7-9 11L3 10l3-7Z" />
    <path d="M6 3l6 8 6-8M3 10h18M9 3v8M15 3v8" strokeWidth="1" opacity="0.6" />
    <circle cx="12" cy="8" r="1" fill="currentColor" opacity="0.8" />
  </IconBase>
));

// UTILITY & ACTION ICONS
// Enhanced versions of common actions

export const PlusOrb = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Add action with mystical orb */}
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" opacity="0.2" />
  </IconBase>
));

export const DeleteVoid = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Delete with void effect */}
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" opacity="0.1" />
  </IconBase>
));

export const EditQuill = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Mystical quill for editing */}
    <path d="M12 19l7-7 3 3-7 7-3-3Z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z" />
    <path d="M16 5l3 3" />
    <circle cx="4" cy="20" r="1" fill="currentColor" />
  </IconBase>
));

export const SaveRune = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Runic save symbol */}
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M17 21v-8H7v8M7 3v5h8" />
    {/* Runic mark */}
    <path d="M12 13v3M10 15h4" strokeWidth="1.5" />
  </IconBase>
));

// DATA VISUALIZATION ICONS
// Beautiful representations of data flow

export const DataFlow = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Flowing data streams */}
    <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="1" opacity="0.4" />
    <circle cx="6" cy="6" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8" />
    <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.6" />
    <path d="M8 6l2 4 2-4M14 12l2 4 2-4" strokeWidth="1" />
  </IconBase>
));

export const MetricsGalaxy = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Cosmic metrics visualization */}
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="6" cy="8" r="1.5" fill="currentColor" opacity="0.8" />
    <circle cx="18" cy="8" r="1" fill="currentColor" opacity="0.6" />
    <circle cx="8" cy="16" r="1" fill="currentColor" opacity="0.6" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" opacity="0.8" />
    {/* Connecting orbits */}
    <path d="M6 8l6 4M18 8l-6 4M8 16l4-4M16 16l-4-4" strokeWidth="0.5" opacity="0.4" />
  </IconBase>
));

// STATUS & STATE ICONS
// Enhanced status indicators

export const LoadingOrb = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props} animate>
    {/* Animated loading orb */}
    <circle cx="12" cy="12" r="10" opacity="0.2" />
    <path d="M21 12a9 9 0 1 1-9-9" strokeWidth="2" />
    <circle cx="12" cy="3" r="1" fill="currentColor" />
  </IconBase>
));

export const SuccessAura = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Success with energy aura */}
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" opacity="0.2" />
    <circle cx="12" cy="12" r="14" opacity="0.1" />
  </IconBase>
));

export const ErrorVortex = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Error with warning vortex */}
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" opacity="0.1" />
  </IconBase>
));

export const WarningBeacon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Warning beacon */}
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4M12 17h.01" strokeWidth="2" />
  </IconBase>
));

export const InfoPrism = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Information prism */}
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" strokeWidth="2" />
    <path d="M8 8l4 4 4-4M8 16l4-4 4 4" strokeWidth="0.5" opacity="0.4" />
  </IconBase>
));

// Export all icons as a collection
export const DevDiggerIcons = {
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
};

export default DevDiggerIcons;
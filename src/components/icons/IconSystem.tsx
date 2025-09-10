import React from 'react';
import { IconProps, IconSize, IconAnimation } from './types';

// Base Icon Component with geometric construction
export const Icon: React.FC<IconProps> = ({
  children,
  size = 24,
  color = 'currentColor',
  rotation = 0,
  animation,
  className = '',
  style,
  ...props
}) => {
  const baseClassName = `devdigger-icon ${className}`;
  const animationClass = animation ? `icon-animate-${animation}` : '';
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${baseClassName} ${animationClass}`.trim()}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        ...style
      }}
      {...props}
    >
      {children}
    </svg>
  );
};

// Navigation Icons - Geometric & Minimalist
export const HomeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </Icon>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </Icon>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </Icon>
);

export const ProfileIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 14v-6m11-5h-6m-14 0h6m15.5-6.5l-4.24 4.24M6.74 17.26l-4.24 4.24m12.73-4.24l4.24 4.24M6.74 6.74l4.24 4.24" />
  </Icon>
);

// Action Icons - Clean Geometric Forms
export const AddIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </Icon>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Icon>
);

export const DeleteIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </Icon>
);

export const SaveIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </Icon>
);

export const CancelIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Icon>
);

export const SubmitIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="20,6 9,17 4,12" />
  </Icon>
);

// State Indicators - Geometric & Symbolic
export const SuccessIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </Icon>
);

export const ErrorIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Icon>
);

export const WarningIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

export const InfoIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Icon>
);

// File Type Icons - Distinctive & Clear
export const FolderIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Icon>
);

export const FileIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </Icon>
);

export const CodeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </Icon>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </Icon>
);

export const ArchiveIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="21,8 21,21 3,21 3,8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </Icon>
);

// Data Visualization Icons
export const ChartIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </Icon>
);

export const GraphIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </Icon>
);

export const TableIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v6m0 0v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9m6 0h10v10a2 2 0 0 1-2 2h-4" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </Icon>
);

export const AnalyticsIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </Icon>
);

// DevDigger Specific Icons
export const MiningIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
    <path d="M12 10v6m-3-3h6" />
  </Icon>
);

export const ExploreIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
  </Icon>
);

export const CollectionIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
  </Icon>
);

// Utility Icons
export const LoadingIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} animation="spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </Icon>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </Icon>
);

export const ExpandIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="15,3 21,3 21,9" />
    <polyline points="9,21 3,21 3,15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </Icon>
);

export const CollapseIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="15,3 21,3 21,9" />
    <polyline points="9,21 3,21 3,15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </Icon>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
  </Icon>
);

export const SortIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M11 5h10" />
    <path d="M11 9h7" />
    <path d="M11 13h4" />
    <path d="M3 17l3 3 3-3" />
    <path d="M6 18V4" />
  </Icon>
);

// Arrow Icons - Directional Navigation
export const ArrowUpIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5,12 12,5 19,12" />
  </Icon>
);

export const ArrowDownIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19,12 12,19 5,12" />
  </Icon>
);

export const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </Icon>
);

export const ArrowRightIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </Icon>
);

// Chevron Icons - Subtle Navigation
export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="18,15 12,9 6,15" />
  </Icon>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="6,9 12,15 18,9" />
  </Icon>
);

export const ChevronLeftIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="15,18 9,12 15,6" />
  </Icon>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="9,18 15,12 9,6" />
  </Icon>
);

// Achievement & Status Icons
export const StarIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
  </Icon>
);

export const BadgeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);

export const TrophyIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.15 18.75 14 20 16 20s3.85-1.25 5.03-1.79c.5-.23.97-.66.97-1.21v-2.34" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </Icon>
);

// Development-specific Icons
export const DatabaseIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </Icon>
);

export const ServerIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="2" y="3" width="20" height="4" rx="1" />
    <rect x="2" y="9" width="20" height="4" rx="1" />
    <rect x="2" y="15" width="20" height="4" rx="1" />
    <line x1="6" y1="5" x2="6.01" y2="5" />
    <line x1="6" y1="11" x2="6.01" y2="11" />
    <line x1="6" y1="17" x2="6.01" y2="17" />
  </Icon>
);

export const ApiIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16,6 12,2 8,6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </Icon>
);

export const GitIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M18 6V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1" />
    <path d="M18 11v-1" />
    <path d="M6 11v9" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </Icon>
);

// Communication Icons
export const MessageIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);

export const NotificationIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Icon>
);

// Security Icons
export const LockIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

export const UnlockIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </Icon>
);

export const ShieldIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Icon>
);
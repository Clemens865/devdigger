import React from 'react';
import { IconProps } from './types';

// Empty State Graphics - Minimalist Illustrations for DevDigger

// No Data Found - Empty Search Results
export const NoDataGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#94a3b8',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic no-data ${className}`}
    {...props}
  >
    {/* Background Circle */}
    <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="2" opacity="0.2" />
    
    {/* Search Icon */}
    <circle cx="50" cy="45" r="15" fill="none" stroke={color} strokeWidth="2" />
    <line x1="61" y1="56" x2="70" y2="65" stroke={color} strokeWidth="2" strokeLinecap="round" />
    
    {/* No Results Lines */}
    <line x1="25" y1="80" x2="95" y2="80" stroke={color} strokeWidth="1" opacity="0.3" />
    <line x1="35" y1="88" x2="75" y2="88" stroke={color} strokeWidth="1" opacity="0.2" />
    <line x1="45" y1="96" x2="65" y2="96" stroke={color} strokeWidth="1" opacity="0.1" />
    
    {/* Dots for visual interest */}
    <circle cx="30" cy="30" r="2" fill={color} opacity="0.2" />
    <circle cx="90" cy="25" r="1.5" fill={color} opacity="0.3" />
    <circle cx="85" cy="90" r="2" fill={color} opacity="0.2" />
  </svg>
);

// Empty Folder - No Files
export const EmptyFolderGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#94a3b8',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic empty-folder ${className}`}
    {...props}
  >
    {/* Folder Outline */}
    <path
      d="M20 40 L20 85 C20 87 22 89 24 89 L96 89 C98 89 100 87 100 85 L100 45 C100 43 98 41 96 41 L60 41 L54 35 L24 35 C22 35 20 37 20 39 Z"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    
    {/* Empty Lines */}
    <line x1="35" y1="55" x2="85" y2="55" stroke={color} strokeWidth="1" opacity="0.2" />
    <line x1="35" y1="62" x2="75" y2="62" stroke={color} strokeWidth="1" opacity="0.2" />
    <line x1="35" y1="69" x2="65" y2="69" stroke={color} strokeWidth="1" opacity="0.2" />
    
    {/* Floating Elements */}
    <rect x="40" y="20" width="8" height="8" fill="none" stroke={color} strokeWidth="1" opacity="0.3" rx="1" />
    <circle cx="75" cy="25" r="3" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
  </svg>
);

// No Collections - Empty Library
export const NoCollectionsGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#94a3b8',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic no-collections ${className}`}
    {...props}
  >
    {/* Bookshelf */}
    <rect x="20" y="70" width="80" height="4" fill={color} opacity="0.3" />
    <rect x="20" y="85" width="80" height="4" fill={color} opacity="0.2" />
    
    {/* Empty Book Slots */}
    <rect x="25" y="40" width="8" height="30" fill="none" stroke={color} strokeWidth="1" opacity="0.2" rx="1" />
    <rect x="40" y="35" width="8" height="35" fill="none" stroke={color} strokeWidth="1" opacity="0.2" rx="1" />
    <rect x="55" y="38" width="8" height="32" fill="none" stroke={color} strokeWidth="1" opacity="0.2" rx="1" />
    <rect x="70" y="42" width="8" height="28" fill="none" stroke={color} strokeWidth="1" opacity="0.2" rx="1" />
    <rect x="85" y="37" width="8" height="33" fill="none" stroke={color} strokeWidth="1" opacity="0.2" rx="1" />
    
    {/* Floating Plus */}
    <circle cx="60" cy="25" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
    <line x1="60" y1="20" x2="60" y2="30" stroke={color} strokeWidth="1" opacity="0.4" />
    <line x1="55" y1="25" x2="65" y2="25" stroke={color} strokeWidth="1" opacity="0.4" />
  </svg>
);

// No Mining Results - Empty Extraction
export const NoMiningResultsGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#94a3b8',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic no-mining ${className}`}
    {...props}
  >
    {/* Pickaxe */}
    <line x1="35" y1="35" x2="65" y2="65" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M65 65 L70 60 L75 65 L70 70 Z" fill={color} opacity="0.4" />
    
    {/* Mining Cart */}
    <rect x="20" y="75" width="25" height="15" fill="none" stroke={color} strokeWidth="2" rx="2" />
    <circle cx="26" cy="92" r="4" fill="none" stroke={color} strokeWidth="2" />
    <circle cx="39" cy="92" r="4" fill="none" stroke={color} strokeWidth="2" />
    
    {/* Empty Cart Lines */}
    <line x1="24" y1="80" x2="41" y2="80" stroke={color} strokeWidth="1" opacity="0.2" />
    <line x1="24" y1="85" x2="41" y2="85" stroke={color} strokeWidth="1" opacity="0.2" />
    
    {/* Scattered Rocks */}
    <circle cx="70" cy="85" r="2" fill={color} opacity="0.3" />
    <circle cx="80" cy="90" r="1.5" fill={color} opacity="0.3" />
    <circle cx="85" cy="80" r="2.5" fill={color} opacity="0.3" />
    
    {/* Question Mark */}
    <circle cx="85" cy="35" r="10" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
    <path d="M80 32 Q85 27 90 32 Q85 37 85 40" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
    <circle cx="85" cy="42" r="1" fill={color} opacity="0.3" />
  </svg>
);

// No Network/Connection - Offline State
export const NoConnectionGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#94a3b8',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic no-connection ${className}`}
    {...props}
  >
    {/* Disconnected Cables */}
    <path d="M30 40 Q35 35 40 40 L50 50" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M70 50 L80 40 Q85 35 90 40" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    
    {/* Plug Ends */}
    <rect x="25" y="38" width="10" height="4" fill={color} opacity="0.6" rx="2" />
    <rect x="85" y="38" width="10" height="4" fill={color} opacity="0.6" rx="2" />
    
    {/* Disconnect Symbol */}
    <line x1="50" y1="50" x2="70" y2="50" stroke={color} strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
    
    {/* Warning Signs */}
    <path d="M40 75 L50 55 L60 75 Z" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
    <line x1="50" y1="62" x2="50" y2="68" stroke={color} strokeWidth="1" opacity="0.3" />
    <circle cx="50" cy="72" r="1" fill={color} opacity="0.3" />
    
    {/* Cloud (crossed out) */}
    <path d="M70 75 Q75 70 80 75 Q85 70 90 75 Q85 80 80 75 Q75 80 70 75" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
    <line x1="68" y1="78" x2="92" y2="67" stroke={color} strokeWidth="1" opacity="0.4" />
  </svg>
);

// No Notifications - Empty Inbox
export const NoNotificationsGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#94a3b8',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic no-notifications ${className}`}
    {...props}
  >
    {/* Bell */}
    <path d="M45 35 Q45 25 60 25 Q75 25 75 35 L75 55 Q80 65 70 65 L50 65 Q40 65 45 55 Z" fill="none" stroke={color} strokeWidth="2" />
    <path d="M55 65 Q55 70 60 70 Q65 70 65 65" fill="none" stroke={color} strokeWidth="2" />
    
    {/* Crossed Out */}
    <line x1="35" y1="35" x2="85" y2="85" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    
    {/* ZZZ (sleeping) */}
    <text x="75" y="40" fontSize="12" fill={color} opacity="0.4" fontFamily="Arial, sans-serif">Z</text>
    <text x="80" y="35" fontSize="10" fill={color} opacity="0.3" fontFamily="Arial, sans-serif">Z</text>
    <text x="83" y="31" fontSize="8" fill={color} opacity="0.2" fontFamily="Arial, sans-serif">Z</text>
  </svg>
);

// Under Construction - Coming Soon
export const UnderConstructionGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#f59e0b',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic under-construction ${className}`}
    {...props}
  >
    {/* Caution Tape */}
    <rect x="10" y="30" width="100" height="8" fill={color} opacity="0.3" />
    <rect x="10" y="82" width="100" height="8" fill={color} opacity="0.3" />
    
    {/* Warning Triangle */}
    <path d="M60 40 L80 70 L40 70 Z" fill="none" stroke={color} strokeWidth="2" />
    <line x1="60" y1="50" x2="60" y2="60" stroke={color} strokeWidth="2" />
    <circle cx="60" cy="65" r="2" fill={color} />
    
    {/* Construction Tools */}
    <rect x="20" y="45" width="3" height="25" fill={color} opacity="0.4" rx="1" />
    <rect x="18" y="43" width="7" height="5" fill={color} opacity="0.4" rx="1" />
    
    <circle cx="95" cy="55" r="8" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
    <line x1="90" y1="55" x2="100" y2="55" stroke={color} strokeWidth="2" opacity="0.4" />
  </svg>
);

// Error State - Something Went Wrong
export const ErrorStateGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#ef4444',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic error-state ${className}`}
    {...props}
  >
    {/* Error Circle */}
    <circle cx="60" cy="60" r="40" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
    
    {/* X Mark */}
    <line x1="45" y1="45" x2="75" y2="75" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="75" y1="45" x2="45" y2="75" stroke={color} strokeWidth="3" strokeLinecap="round" />
    
    {/* Glitch Effects */}
    <rect x="20" y="30" width="15" height="2" fill={color} opacity="0.2" />
    <rect x="85" y="40" width="10" height="2" fill={color} opacity="0.2" />
    <rect x="25" y="85" width="12" height="2" fill={color} opacity="0.2" />
    <rect x="90" y="90" width="8" height="2" fill={color} opacity="0.2" />
  </svg>
);

// Success State - All Done
export const SuccessStateGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#10b981',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic success-state ${className}`}
    {...props}
  >
    {/* Success Circle */}
    <circle cx="60" cy="60" r="40" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
    
    {/* Checkmark */}
    <polyline points="40,60 55,75 80,45" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Celebration Elements */}
    <circle cx="30" cy="30" r="2" fill={color} opacity="0.4" />
    <rect x="85" y="25" width="4" height="4" fill={color} opacity="0.4" transform="rotate(45 87 27)" />
    <circle cx="25" cy="85" r="1.5" fill={color} opacity="0.4" />
    <polygon points="90,85 92,90 95,87" fill={color} opacity="0.4" />
  </svg>
);

// Welcome State - Getting Started
export const WelcomeGraphic: React.FC<IconProps> = ({
  size = 120,
  color = '#6366f1',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    className={`empty-state-graphic welcome ${className}`}
    {...props}
  >
    {/* Welcome Hand Wave */}
    <path d="M50 40 Q55 35 60 40 L65 45 Q70 40 75 45 L70 50 Q75 55 70 60 L65 55 Q60 60 55 55 L50 50 Q45 55 50 40" 
          fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    
    {/* Sparkles */}
    <polygon points="30,25 32,30 35,28 33,35 30,33 27,35 25,30 27,28" fill={color} opacity="0.4" />
    <polygon points="85,30 86,33 88,32 87,36 85,35 83,36 82,33 83,32" fill={color} opacity="0.4" />
    <polygon points="25,75 27,80 30,78 28,83 25,81 22,83 20,80 22,78" fill={color} opacity="0.4" />
    <polygon points="90,80 91,83 93,82 92,86 90,85 88,86 87,83 88,82" fill={color} opacity="0.4" />
    
    {/* Arrow pointing to content */}
    <path d="M45 75 Q50 80 55 75" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
    <polygon points="55,75 58,77 55,79" fill={color} opacity="0.4" />
  </svg>
);

// Export all graphics
export const EmptyStateGraphics = {
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
};

// Helper component for empty states with text
export interface EmptyStateProps {
  graphic: React.ComponentType<IconProps>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: number;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  graphic: Graphic,
  title,
  description,
  action,
  size = 120,
  className = ''
}) => (
  <div className={`empty-state ${className}`}>
    <div className="empty-state-graphic">
      <Graphic size={size} />
    </div>
    <div className="empty-state-content">
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  </div>
);

export default EmptyStateGraphics;
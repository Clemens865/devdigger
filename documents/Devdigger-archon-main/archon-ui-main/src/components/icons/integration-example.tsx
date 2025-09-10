/**
 * DevDigger Icon Integration Example
 * 
 * Demonstrates how to integrate the new icon system into existing DevDigger components.
 * This shows practical usage patterns and migration strategies.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  OracleEye,
  SearchCrystal,
  MineIcon,
  ArchiveVault,
  DatabaseCrystal,
  AnimatedLoadingOrb,
  AnimatedDataFlow,
  getIconClasses,
  useIconTheme,
} from './index';
import { cn } from '../../lib/utils';

// Example: Enhanced Navigation with new icons
export const EnhancedNavigation = () => {
  const { getThemeClasses } = useIconTheme();

  const navigationItems = [
    {
      path: "/",
      icon: MineIcon,
      label: "Mine Knowledge",
      description: "Dig deep into data repositories"
    },
    {
      path: "/explore",
      icon: OracleEye,
      label: "Oracle Vision",
      description: "Gain mystical insights"
    },
    {
      path: "/search",
      icon: SearchCrystal,
      label: "Crystal Search",
      description: "Crystal-clear data discovery"
    },
    {
      path: "/archive",
      icon: ArchiveVault,
      label: "Sacred Archive",
      description: "Preserve digital artifacts"
    }
  ];

  return (
    <nav className="space-y-2">
      {navigationItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-gray-200/50 dark:border-zinc-800/50 hover:border-purple-300/50 dark:hover:border-purple-500/30 transition-all duration-300 cursor-pointer">
              <Icon
                size="md"
                className={cn(
                  getThemeClasses('oracle'),
                  "group-hover:icon-mystical transition-all duration-300"
                )}
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </nav>
  );
};

// Example: Loading States with animated icons
export const EnhancedLoadingStates = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasData, setHasData] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setHasData(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AnimatedLoadingOrb 
          size="xl" 
          className="text-purple-600 dark:text-purple-400" 
        />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Consulting the Oracle...
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gathering mystical insights from the data realm
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30"
    >
      <div className="flex items-center space-x-3 mb-4">
        <DatabaseCrystal 
          size="lg" 
          style="gradient" 
          className="text-purple-600 dark:text-purple-400" 
        />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Data Revealed
        </h3>
      </div>
      
      <AnimatedDataFlow className="mb-4" />
      
      <p className="text-gray-700 dark:text-gray-300">
        The oracle has spoken! Your data insights are ready for exploration.
      </p>
    </motion.div>
  );
};

// Example: Responsive Icon Grid
export const ResponsiveIconGrid = () => {
  const [selectedSize, setSelectedSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [selectedStyle, setSelectedStyle] = React.useState<'outline' | 'filled' | 'duotone' | 'gradient'>('outline');

  const iconGrid = [
    { icon: OracleEye, name: 'Oracle Eye', category: 'Mystical' },
    { icon: SearchCrystal, name: 'Search Crystal', category: 'Interface' },
    { icon: MineIcon, name: 'Mine', category: 'Action' },
    { icon: DatabaseCrystal, name: 'Database', category: 'Technical' },
    { icon: ArchiveVault, name: 'Archive', category: 'Storage' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Size:</label>
          <select 
            value={selectedSize} 
            onChange={(e) => setSelectedSize(e.target.value as any)}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Style:</label>
          <select 
            value={selectedStyle} 
            onChange={(e) => setSelectedStyle(e.target.value as any)}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {['outline', 'filled', 'duotone', 'gradient'].map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {iconGrid.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center space-y-3 p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-zinc-800/50 hover:border-purple-300/50 dark:hover:border-purple-500/30 transition-all duration-300"
            >
              <Icon
                size={selectedSize}
                style={selectedStyle}
                className={getIconClasses({
                  color: 'oracle',
                  effect: 'interactive'
                })}
              />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.category}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Example: Interactive Button with icons
export const MysticalButton = ({ 
  children, 
  icon: Icon, 
  loading = false, 
  ...props 
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  loading?: boolean;
  [key: string]: any;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center space-x-2 px-6 py-3",
        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
        "text-white font-medium rounded-lg shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <AnimatedLoadingOrb size="sm" className="text-white" />
      ) : Icon ? (
        <Icon size="sm" className="text-white" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};

// Example: Status Card with contextual icons
export const StatusCard = ({ 
  status, 
  title, 
  description 
}: {
  status: 'loading' | 'success' | 'error' | 'warning';
  title: string;
  description: string;
}) => {
  const statusConfig = {
    loading: {
      icon: AnimatedLoadingOrb,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800/30'
    },
    success: {
      icon: OracleEye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800/30'
    },
    error: {
      icon: SearchCrystal,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800/30'
    },
    warning: {
      icon: MineIcon,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800/30'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-lg border",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon 
          size="md" 
          className={cn(config.color, "flex-shrink-0 mt-0.5")}
        />
        <div className="flex-1 space-y-1">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Example usage demonstration
export const IntegrationDemo = () => {
  return (
    <div className="space-y-12 p-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Enhanced Navigation
        </h2>
        <EnhancedNavigation />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Loading States
        </h2>
        <EnhancedLoadingStates />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Responsive Icon Grid
        </h2>
        <ResponsiveIconGrid />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Interactive Buttons
        </h2>
        <div className="flex flex-wrap gap-4">
          <MysticalButton icon={OracleEye}>
            Consult Oracle
          </MysticalButton>
          <MysticalButton icon={SearchCrystal}>
            Crystal Search
          </MysticalButton>
          <MysticalButton icon={MineIcon} loading>
            Mining Data...
          </MysticalButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Status Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusCard
            status="loading"
            title="Processing Request"
            description="The oracle is consulting the ancient data scrolls..."
          />
          <StatusCard
            status="success"
            title="Vision Received"
            description="The crystal ball reveals profound insights about your data."
          />
          <StatusCard
            status="warning"
            title="Mining Incomplete"
            description="Some data veins remain unexplored in the digital realm."
          />
          <StatusCard
            status="error"
            title="Mystical Interference"
            description="Dark forces are disrupting the connection to the data realm."
          />
        </div>
      </section>
    </div>
  );
};

export default IntegrationDemo;
/**
 * Icon Showcase Component for DevDigger
 * 
 * Comprehensive showcase and testing component for the icon system.
 * Demonstrates all icons, styles, animations, and interactive features.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../features/ui/primitives/tabs';
import { cn } from '../../lib/utils';

// Import all icons
import {
  DevDiggerIcons,
  AnimatedDevDiggerIcons,
  OracleIcons,
  DeveloperIcons,
  NavigationIcons,
  StatusIcons,
  UtilityIcons,
  iconThemeClasses,
  getIconClasses,
  type IconProps,
} from './index';

interface IconShowcaseProps {
  className?: string;
}

interface IconDemoProps {
  icon: React.ComponentType<IconProps>;
  name: string;
  category: string;
  description?: string;
}

const IconDemo: React.FC<IconDemoProps> = ({ icon: Icon, name, category, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<'outline' | 'filled' | 'duotone' | 'gradient'>('outline');
  const [currentSize, setCurrentSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-gray-200/50 dark:border-zinc-800/50 hover:border-purple-300/50 dark:hover:border-purple-500/30 transition-all duration-300">
        {/* Icon Display */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-100 dark:border-purple-800/30">
            <Icon
              size={currentSize}
              style={currentStyle}
              className={cn(
                "text-purple-600 dark:text-purple-400 transition-all duration-300",
                isHovered && "icon-mystical"
              )}
            />
          </div>

          {/* Icon Info */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Interactive Controls */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col space-y-2 w-full"
              >
                {/* Style Selector */}
                <div className="flex justify-center space-x-1">
                  {(['outline', 'filled', 'duotone', 'gradient'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setCurrentStyle(style)}
                      className={cn(
                        "px-2 py-1 text-xs rounded transition-all",
                        currentStyle === style
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                {/* Size Selector */}
                <div className="flex justify-center space-x-1">
                  {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setCurrentSize(size)}
                      className={cn(
                        "px-2 py-1 text-xs rounded transition-all",
                        currentSize === size
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export const IconShowcase: React.FC<IconShowcaseProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAnimated, setShowAnimated] = useState(false);

  // Icon collections with metadata
  const iconCollections = [
    {
      name: 'Oracle & Mystical',
      icons: Object.entries(OracleIcons).map(([key, icon]) => ({
        icon,
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        category: 'Oracle',
        description: 'Mystical symbols for divine insight and wisdom'
      }))
    },
    {
      name: 'Developer & Technical',
      icons: Object.entries(DeveloperIcons).map(([key, icon]) => ({
        icon,
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        category: 'Developer',
        description: 'Technical tools and programming concepts'
      }))
    },
    {
      name: 'Navigation & Interface',
      icons: Object.entries(NavigationIcons).map(([key, icon]) => ({
        icon,
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        category: 'Navigation',
        description: 'UI navigation and interface elements'
      }))
    },
    {
      name: 'Status & State',
      icons: Object.entries(StatusIcons).map(([key, icon]) => ({
        icon,
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        category: 'Status',
        description: 'Application state and status indicators'
      }))
    },
    {
      name: 'Utility & Actions',
      icons: Object.entries(UtilityIcons).map(([key, icon]) => ({
        icon,
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        category: 'Utility',
        description: 'Common actions and utility functions'
      }))
    }
  ];

  // Flatten all icons for searching
  const allIcons = iconCollections.flatMap(collection => collection.icons);

  // Filter icons based on search and category
  const filteredIcons = allIcons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         icon.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           icon.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(allIcons.map(icon => icon.category))];

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          DevDigger Icon System
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A comprehensive collection of mystical and professional icons designed for the DevDigger oracle experience.
        </motion.p>
      </div>

      {/* Controls */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Input
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showAnimated}
              onChange={(e) => setShowAnimated(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show Animated</span>
          </label>
          
          <Badge variant="outline">
            {filteredIcons.length} icons
          </Badge>
        </div>
      </motion.div>

      {/* Icon Grid */}
      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Gallery View</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="examples">Usage Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-8">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            layout
          >
            <AnimatePresence>
              {filteredIcons.map((iconData, index) => (
                <motion.div
                  key={`${iconData.name}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <IconDemo {...iconData} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredIcons.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500 dark:text-gray-400">
                No icons found matching your criteria.
              </p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-8">
          <div className="space-y-12">
            {iconCollections.map((collection, collectionIndex) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: collectionIndex * 0.1 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                  {collection.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {collection.icons.map((iconData, index) => (
                    <motion.div
                      key={`${iconData.name}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <IconDemo {...iconData} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="examples" className="mt-8">
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Basic Usage</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{`import { OracleEye, SearchCrystal } from '@/components/icons';

// Basic usage
<OracleEye size="md" />
<SearchCrystal size="lg" style="filled" />

// With styling
<OracleEye 
  size="xl" 
  style="gradient" 
  className="text-purple-600 hover:text-purple-700" 
/>`}</code>
                </pre>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Animated Icons</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{`import { AnimatedOracleEye, AnimatedCrystalBall } from '@/components/icons';

// Animated variants
<AnimatedOracleEye animation="oracleReveal" />
<AnimatedCrystalBall animation="crystalForm" delay={0.5} />`}</code>
                </pre>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Theme Integration</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{`import { IconProvider, useIconTheme } from '@/components/icons';

// Wrap your app
<IconProvider config={{ enableAnimations: true, theme: 'auto' }}>
  <YourApp />
</IconProvider>

// Use theme utilities
const { getThemeClasses } = useIconTheme();
<OracleEye className={getThemeClasses('oracle')} />`}</code>
                </pre>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IconShowcase;
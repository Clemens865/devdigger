import React, { useState, useMemo } from 'react';
import { IconProps, IconSize, IconAnimation, IconCategory } from './types';
import { iconRegistry, DynamicIcon } from './IconRegistry';
import { LoadingSpinners } from './LoadingSpinners';
import { EmptyStateGraphics, EmptyState } from './EmptyStateGraphics';
import * as Icons from './IconSystem';

// Icon Showcase Component - For development and documentation
export interface IconShowcaseProps {
  showSearch?: boolean;
  showCategories?: boolean;
  showSizes?: boolean;
  showAnimations?: boolean;
  showCode?: boolean;
  defaultSize?: IconSize;
  className?: string;
}

export const IconShowcase: React.FC<IconShowcaseProps> = ({
  showSearch = true,
  showCategories = true,
  showSizes = true,
  showAnimations = true,
  showCode = true,
  defaultSize = 24,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all' | 'loading' | 'empty-states'>('all');
  const [selectedSize, setSelectedSize] = useState<IconSize>(defaultSize);
  const [selectedAnimation, setSelectedAnimation] = useState<IconAnimation>('none');
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>('');

  const iconSizes: IconSize[] = [12, 16, 20, 24, 28, 32, 40, 48, 64];
  const animations: IconAnimation[] = ['none', 'spin', 'pulse', 'bounce', 'shake', 'flip', 'scale', 'fade'];

  const filteredIcons = useMemo(() => {
    if (selectedCategory === 'loading') {
      return Object.entries(LoadingSpinners).map(([name, component]) => ({
        name: name.replace('Spinner', '').toLowerCase(),
        category: 'loading' as IconCategory,
        component,
        description: `${name} loading animation`
      }));
    }

    if (selectedCategory === 'empty-states') {
      return Object.entries(EmptyStateGraphics).map(([name, component]) => ({
        name: name.replace('Graphic', '').toLowerCase(),
        category: 'empty-states' as IconCategory,
        component,
        description: `${name} empty state illustration`
      }));
    }

    let icons = iconRegistry.getAllIcons();

    if (selectedCategory !== 'all') {
      icons = icons.filter(icon => icon.category === selectedCategory);
    }

    if (searchQuery) {
      icons = iconRegistry.searchIcons(searchQuery);
    }

    return icons;
  }, [searchQuery, selectedCategory]);

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
    if (showCode) {
      setShowCodePanel(true);
    }
  };

  const generateIconCode = (iconName: string) => {
    const pascalCase = iconName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('') + 'Icon';

    return `import { ${pascalCase} } from '@/components/icons';

// Basic Usage
<${pascalCase} />

// With Props
<${pascalCase} 
  size={${selectedSize}} 
  color="currentColor"
  ${selectedAnimation !== 'none' ? `animation="${selectedAnimation}"` : ''}
/>

// Dynamic Usage
<DynamicIcon name="${iconName}" size={${selectedSize}} />`;
  };

  return (
    <div className={`icon-showcase ${className}`}>
      {/* Header */}
      <div className="showcase-header">
        <h2>DevDigger Icon System</h2>
        <p className="showcase-description">
          Minimalist geometric icons optimized for light themes with consistent 2px stroke weight
        </p>
      </div>

      {/* Controls */}
      <div className="showcase-controls">
        {showSearch && (
          <div className="control-group">
            <label htmlFor="icon-search">Search Icons</label>
            <input
              id="icon-search"
              type="text"
              placeholder="Search by name, category, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        {showCategories && (
          <div className="control-group">
            <label htmlFor="category-select">Category</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="category-select"
            >
              <option value="all">All Icons</option>
              {iconRegistry.getCategories().map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
              <option value="loading">Loading Spinners</option>
              <option value="empty-states">Empty States</option>
            </select>
          </div>
        )}

        {showSizes && (
          <div className="control-group">
            <label htmlFor="size-select">Size</label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value) as IconSize)}
              className="size-select"
            >
              {iconSizes.map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
        )}

        {showAnimations && (
          <div className="control-group">
            <label htmlFor="animation-select">Animation</label>
            <select
              id="animation-select"
              value={selectedAnimation}
              onChange={(e) => setSelectedAnimation(e.target.value as IconAnimation)}
              className="animation-select"
            >
              {animations.map(animation => (
                <option key={animation} value={animation}>
                  {animation === 'none' ? 'None' : animation.charAt(0).toUpperCase() + animation.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="showcase-stats">
        <span className="stat">
          {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'}
        </span>
        <span className="stat">
          {iconRegistry.getCategories().length} categories
        </span>
        <span className="stat">
          {iconSizes.length} sizes
        </span>
      </div>

      {/* Icon Grid */}
      <div className="icon-grid">
        {filteredIcons.length === 0 ? (
          <div className="no-results">
            <EmptyState
              graphic={EmptyStateGraphics.NoDataGraphic}
              title="No icons found"
              description="Try adjusting your search or category filter"
              size={80}
            />
          </div>
        ) : (
          filteredIcons.map(icon => {
            const IconComponent = icon.component;
            return (
              <div
                key={icon.name}
                className={`icon-grid-item ${selectedIcon === icon.name ? 'selected' : ''}`}
                onClick={() => handleIconClick(icon.name)}
                title={icon.description}
              >
                <div className="icon-wrapper">
                  <IconComponent
                    size={selectedSize}
                    animation={selectedAnimation}
                  />
                </div>
                <span className="icon-label">{icon.name}</span>
                <span className="icon-category">{icon.category}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Code Panel */}
      {showCodePanel && selectedIcon && (
        <div className="code-panel">
          <div className="code-panel-header">
            <h3>Code for {selectedIcon}</h3>
            <button
              onClick={() => setShowCodePanel(false)}
              className="close-button"
              aria-label="Close code panel"
            >
              <Icons.CancelIcon size={20} />
            </button>
          </div>
          <pre className="code-block">
            <code>{generateIconCode(selectedIcon)}</code>
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(generateIconCode(selectedIcon))}
            className="copy-button"
          >
            <Icons.SaveIcon size={16} />
            Copy Code
          </button>
        </div>
      )}

      {/* Style Guide */}
      <div className="style-guide">
        <h3>Style Guide</h3>
        <div className="guide-grid">
          <div className="guide-item">
            <h4>Stroke Weight</h4>
            <p>Consistent 2px stroke for all icons</p>
            <div className="guide-example">
              <Icons.HomeIcon size={32} />
              <Icons.SearchIcon size={32} />
              <Icons.SettingsIcon size={32} />
            </div>
          </div>

          <div className="guide-item">
            <h4>Grid System</h4>
            <p>24x24px base grid with optical adjustments</p>
            <div className="guide-example grid-demo">
              <div className="grid-overlay">
                <Icons.AddIcon size={48} />
              </div>
            </div>
          </div>

          <div className="guide-item">
            <h4>Color Usage</h4>
            <p>Icons inherit text color by default</p>
            <div className="guide-example color-demo">
              <Icons.SuccessIcon size={24} color="#10b981" />
              <Icons.WarningIcon size={24} color="#f59e0b" />
              <Icons.ErrorIcon size={24} color="#ef4444" />
              <Icons.InfoIcon size={24} color="#3b82f6" />
            </div>
          </div>

          <div className="guide-item">
            <h4>Animations</h4>
            <p>Subtle micro-interactions enhance UX</p>
            <div className="guide-example">
              <Icons.LoadingIcon size={24} animation="spin" />
              <Icons.StarIcon size={24} animation="pulse" />
              <Icons.AddIcon size={24} animation="scale" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Size Comparison Component
export const SizeComparison: React.FC = () => {
  const sizes: IconSize[] = [12, 16, 20, 24, 28, 32, 40, 48, 64];
  
  return (
    <div className="size-comparison">
      <h3>Size Variants</h3>
      <div className="size-grid">
        {sizes.map(size => (
          <div key={size} className="size-item">
            <Icons.HomeIcon size={size} />
            <span className="size-label">{size}px</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Animation Showcase
export const AnimationShowcase: React.FC = () => {
  const animations: IconAnimation[] = ['spin', 'pulse', 'bounce', 'shake', 'flip', 'scale', 'fade'];
  
  return (
    <div className="animation-showcase">
      <h3>Animations</h3>
      <div className="animation-grid">
        {animations.map(animation => (
          <div key={animation} className="animation-item">
            <Icons.StarIcon size={32} animation={animation} />
            <span className="animation-label">{animation}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Spinner Showcase
export const LoadingShowcase: React.FC = () => {
  return (
    <div className="loading-showcase">
      <h3>Loading Spinners</h3>
      <div className="loading-grid">
        <div className="loading-item">
          <LoadingSpinners.CircularSpinner size={32} />
          <span>Circular</span>
        </div>
        <div className="loading-item">
          <LoadingSpinners.DotsSpinner size={32} />
          <span>Dots</span>
        </div>
        <div className="loading-item">
          <LoadingSpinners.TriangleSpinner size={32} />
          <span>Triangle</span>
        </div>
        <div className="loading-item">
          <LoadingSpinners.SquareSpinner size={32} />
          <span>Square</span>
        </div>
        <div className="loading-item">
          <LoadingSpinners.HexagonSpinner size={32} />
          <span>Hexagon</span>
        </div>
        <div className="loading-item">
          <LoadingSpinners.WaveSpinner size={32} />
          <span>Wave</span>
        </div>
        <div className="loading-item">
          <LoadingSpinners.GridSpinner size={32} />
          <span>Grid</span>
        </div>
        <div className="loading-item">
          <LoadingSpinners.AtomSpinner size={32} />
          <span>Atom</span>
        </div>
      </div>
    </div>
  );
};

// Empty State Showcase
export const EmptyStateShowcase: React.FC = () => {
  return (
    <div className="empty-state-showcase">
      <h3>Empty State Graphics</h3>
      <div className="empty-state-grid">
        <EmptyState
          graphic={EmptyStateGraphics.NoDataGraphic}
          title="No Data"
          description="No search results found"
          size={80}
        />
        <EmptyState
          graphic={EmptyStateGraphics.EmptyFolderGraphic}
          title="Empty Folder"
          description="This folder is empty"
          size={80}
        />
        <EmptyState
          graphic={EmptyStateGraphics.NoCollectionsGraphic}
          title="No Collections"
          description="Create your first collection"
          size={80}
        />
        <EmptyState
          graphic={EmptyStateGraphics.ErrorStateGraphic}
          title="Error"
          description="Something went wrong"
          size={80}
        />
      </div>
    </div>
  );
};

export default IconShowcase;
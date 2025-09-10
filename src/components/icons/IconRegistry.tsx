import React from 'react';
import { IconDefinition, IconCategory, IconUtils } from './types';
import * as Icons from './IconSystem';

// Icon Registry - Centralized icon management
export class IconRegistry implements IconUtils {
  private static instance: IconRegistry;
  private icons: Map<string, IconDefinition> = new Map();

  private constructor() {
    this.registerDefaultIcons();
  }

  public static getInstance(): IconRegistry {
    if (!IconRegistry.instance) {
      IconRegistry.instance = new IconRegistry();
    }
    return IconRegistry.instance;
  }

  private registerDefaultIcons(): void {
    // Navigation Icons
    this.registerIcon('home', 'navigation', ['house', 'main', 'dashboard'], 'Home/dashboard navigation', Icons.HomeIcon);
    this.registerIcon('search', 'navigation', ['find', 'lookup', 'explore'], 'Search functionality', Icons.SearchIcon);
    this.registerIcon('menu', 'navigation', ['hamburger', 'options', 'nav'], 'Navigation menu', Icons.MenuIcon);
    this.registerIcon('profile', 'navigation', ['user', 'account', 'person'], 'User profile', Icons.ProfileIcon);
    this.registerIcon('settings', 'navigation', ['config', 'preferences', 'gear'], 'Settings/configuration', Icons.SettingsIcon);

    // Action Icons
    this.registerIcon('add', 'actions', ['plus', 'create', 'new'], 'Add/create new item', Icons.AddIcon);
    this.registerIcon('edit', 'actions', ['modify', 'update', 'pencil'], 'Edit/modify content', Icons.EditIcon);
    this.registerIcon('delete', 'actions', ['remove', 'trash', 'destroy'], 'Delete/remove item', Icons.DeleteIcon);
    this.registerIcon('save', 'actions', ['store', 'persist', 'disk'], 'Save changes', Icons.SaveIcon);
    this.registerIcon('cancel', 'actions', ['close', 'abort', 'dismiss'], 'Cancel operation', Icons.CancelIcon);
    this.registerIcon('submit', 'actions', ['confirm', 'check', 'done'], 'Submit/confirm action', Icons.SubmitIcon);

    // State Indicators
    this.registerIcon('success', 'states', ['check', 'complete', 'done'], 'Success state', Icons.SuccessIcon);
    this.registerIcon('error', 'states', ['alert', 'fail', 'warning'], 'Error state', Icons.ErrorIcon);
    this.registerIcon('warning', 'states', ['caution', 'alert', 'attention'], 'Warning state', Icons.WarningIcon);
    this.registerIcon('info', 'states', ['information', 'help', 'details'], 'Information state', Icons.InfoIcon);
    this.registerIcon('loading', 'states', ['spinner', 'progress', 'wait'], 'Loading state', Icons.LoadingIcon);

    // File Type Icons
    this.registerIcon('folder', 'files', ['directory', 'collection', 'group'], 'Folder/directory', Icons.FolderIcon);
    this.registerIcon('file', 'files', ['document', 'text', 'content'], 'Generic file', Icons.FileIcon);
    this.registerIcon('code', 'files', ['script', 'programming', 'development'], 'Code file', Icons.CodeIcon);
    this.registerIcon('image', 'files', ['picture', 'photo', 'graphic'], 'Image file', Icons.ImageIcon);
    this.registerIcon('archive', 'files', ['zip', 'compressed', 'package'], 'Archive file', Icons.ArchiveIcon);

    // Data Visualization Icons
    this.registerIcon('chart', 'data', ['bar', 'statistics', 'metrics'], 'Bar chart', Icons.ChartIcon);
    this.registerIcon('graph', 'data', ['line', 'trend', 'analytics'], 'Line graph', Icons.GraphIcon);
    this.registerIcon('table', 'data', ['grid', 'spreadsheet', 'rows'], 'Data table', Icons.TableIcon);
    this.registerIcon('analytics', 'data', ['insights', 'trends', 'analysis'], 'Analytics data', Icons.AnalyticsIcon);

    // DevDigger Specific Icons
    this.registerIcon('mining', 'brand', ['dig', 'extract', 'discover'], 'Data mining', Icons.MiningIcon);
    this.registerIcon('explore', 'brand', ['compass', 'discover', 'navigate'], 'Explore data', Icons.ExploreIcon);
    this.registerIcon('collection', 'brand', ['book', 'library', 'organize'], 'Data collection', Icons.CollectionIcon);

    // Utility Icons
    this.registerIcon('refresh', 'utility', ['reload', 'update', 'sync'], 'Refresh/reload', Icons.RefreshIcon);
    this.registerIcon('expand', 'utility', ['fullscreen', 'maximize', 'grow'], 'Expand view', Icons.ExpandIcon);
    this.registerIcon('collapse', 'utility', ['minimize', 'shrink', 'reduce'], 'Collapse view', Icons.CollapseIcon);
    this.registerIcon('filter', 'utility', ['sort', 'organize', 'arrange'], 'Filter content', Icons.FilterIcon);
    this.registerIcon('sort', 'utility', ['order', 'arrange', 'organize'], 'Sort content', Icons.SortIcon);

    // Arrow Icons
    this.registerIcon('arrow-up', 'utility', ['north', 'top', 'ascend'], 'Arrow pointing up', Icons.ArrowUpIcon);
    this.registerIcon('arrow-down', 'utility', ['south', 'bottom', 'descend'], 'Arrow pointing down', Icons.ArrowDownIcon);
    this.registerIcon('arrow-left', 'utility', ['west', 'back', 'previous'], 'Arrow pointing left', Icons.ArrowLeftIcon);
    this.registerIcon('arrow-right', 'utility', ['east', 'forward', 'next'], 'Arrow pointing right', Icons.ArrowRightIcon);

    // Chevron Icons
    this.registerIcon('chevron-up', 'utility', ['caret', 'collapse'], 'Chevron up', Icons.ChevronUpIcon);
    this.registerIcon('chevron-down', 'utility', ['caret', 'expand'], 'Chevron down', Icons.ChevronDownIcon);
    this.registerIcon('chevron-left', 'utility', ['caret', 'back'], 'Chevron left', Icons.ChevronLeftIcon);
    this.registerIcon('chevron-right', 'utility', ['caret', 'forward'], 'Chevron right', Icons.ChevronRightIcon);

    // Achievement Icons
    this.registerIcon('star', 'utility', ['favorite', 'rating', 'bookmark'], 'Star rating', Icons.StarIcon);
    this.registerIcon('badge', 'utility', ['achievement', 'award', 'certification'], 'Badge/achievement', Icons.BadgeIcon);
    this.registerIcon('trophy', 'utility', ['winner', 'champion', 'award'], 'Trophy/achievement', Icons.TrophyIcon);

    // Development Icons
    this.registerIcon('database', 'development', ['data', 'storage', 'sql'], 'Database', Icons.DatabaseIcon);
    this.registerIcon('server', 'development', ['host', 'infrastructure', 'cloud'], 'Server', Icons.ServerIcon);
    this.registerIcon('api', 'development', ['interface', 'endpoint', 'service'], 'API', Icons.ApiIcon);
    this.registerIcon('git', 'development', ['version', 'control', 'repository'], 'Git version control', Icons.GitIcon);

    // Communication Icons
    this.registerIcon('message', 'communication', ['chat', 'text', 'conversation'], 'Message/chat', Icons.MessageIcon);
    this.registerIcon('notification', 'communication', ['alert', 'bell', 'notice'], 'Notification', Icons.NotificationIcon);
    this.registerIcon('share', 'communication', ['send', 'distribute', 'export'], 'Share content', Icons.ShareIcon);

    // Security Icons
    this.registerIcon('lock', 'security', ['secure', 'private', 'protected'], 'Locked/secure', Icons.LockIcon);
    this.registerIcon('unlock', 'security', ['open', 'public', 'accessible'], 'Unlocked/open', Icons.UnlockIcon);
    this.registerIcon('shield', 'security', ['protection', 'defense', 'safety'], 'Security shield', Icons.ShieldIcon);
  }

  private registerIcon(
    name: string,
    category: IconCategory,
    tags: string[],
    description: string,
    component: React.ComponentType<any>
  ): void {
    this.icons.set(name, {
      name,
      category,
      tags,
      description,
      component
    });
  }

  public getIconByName(name: string): IconDefinition | undefined {
    return this.icons.get(name);
  }

  public getIconsByCategory(category: IconCategory): IconDefinition[] {
    return Array.from(this.icons.values()).filter(icon => icon.category === category);
  }

  public searchIcons(query: string): IconDefinition[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.icons.values()).filter(icon => 
      icon.name.toLowerCase().includes(lowercaseQuery) ||
      icon.description.toLowerCase().includes(lowercaseQuery) ||
      icon.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  public validateIconProps(props: any): boolean {
    // Basic validation for icon props
    const validSizes = [12, 16, 20, 24, 28, 32, 40, 48, 64];
    const validAnimations = ['spin', 'pulse', 'bounce', 'shake', 'flip', 'scale', 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'none'];
    
    if (props.size && !validSizes.includes(props.size)) {
      console.warn(`Invalid icon size: ${props.size}. Valid sizes: ${validSizes.join(', ')}`);
      return false;
    }
    
    if (props.animation && !validAnimations.includes(props.animation)) {
      console.warn(`Invalid animation: ${props.animation}. Valid animations: ${validAnimations.join(', ')}`);
      return false;
    }
    
    return true;
  }

  public getAllIcons(): IconDefinition[] {
    return Array.from(this.icons.values());
  }

  public getCategories(): IconCategory[] {
    const categories = new Set<IconCategory>();
    this.icons.forEach(icon => categories.add(icon.category));
    return Array.from(categories);
  }

  public getIconCount(): number {
    return this.icons.size;
  }
}

// Dynamic Icon Component - Renders icon by name
export interface DynamicIconProps {
  name: string;
  size?: number;
  color?: string;
  animation?: string;
  className?: string;
  fallback?: React.ReactNode;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  animation,
  className = '',
  fallback = null,
  ...props
}) => {
  const registry = IconRegistry.getInstance();
  const iconDef = registry.getIconByName(name);
  
  if (!iconDef) {
    console.warn(`Icon "${name}" not found in registry`);
    return fallback ? <>{fallback}</> : null;
  }
  
  const IconComponent = iconDef.component;
  
  return (
    <IconComponent
      size={size}
      color={color}
      animation={animation}
      className={className}
      aria-label={iconDef.description}
      {...props}
    />
  );
};

// Icon Picker Component - For development/showcase
export interface IconPickerProps {
  onSelectIcon?: (iconName: string) => void;
  selectedIcon?: string;
  category?: IconCategory;
  showSearch?: boolean;
  showCategories?: boolean;
  size?: number;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  onSelectIcon,
  selectedIcon,
  category,
  showSearch = true,
  showCategories = true,
  size = 24
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<IconCategory | 'all'>('all');
  
  const registry = IconRegistry.getInstance();
  
  const filteredIcons = React.useMemo(() => {
    let icons = registry.getAllIcons();
    
    // Filter by category
    if (selectedCategory !== 'all') {
      icons = icons.filter(icon => icon.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      icons = registry.searchIcons(searchQuery);
    }
    
    return icons;
  }, [searchQuery, selectedCategory]);
  
  return (
    <div className="icon-picker">
      {showSearch && (
        <div className="icon-picker-search">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      )}
      
      {showCategories && (
        <div className="icon-picker-categories">
          <button
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'active' : ''}
          >
            All
          </button>
          {registry.getCategories().map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'active' : ''}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      <div className="icon-grid">
        {filteredIcons.map(icon => {
          const IconComponent = icon.component;
          return (
            <div
              key={icon.name}
              className={`icon-grid-item ${selectedIcon === icon.name ? 'selected' : ''}`}
              onClick={() => onSelectIcon?.(icon.name)}
            >
              <IconComponent size={size} />
              <span className="icon-grid-label">{icon.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export registry instance
export const iconRegistry = IconRegistry.getInstance();
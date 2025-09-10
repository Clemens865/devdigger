/**
 * DevDigger Advanced Layout Components
 * Gallery-Quality Layout Patterns
 * 
 * Sophisticated layout components for world-class design implementations.
 * These components provide professional-grade layouts with mathematical
 * precision and visual excellence.
 */

import React, { ReactNode, HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ================================
// ADVANCED LAYOUT TYPES
// ================================

interface BaseLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

type FluidSpacing = 'sm' | 'md' | 'lg' | 'xl';
type VisualEmphasis = 'subtle' | 'moderate' | 'strong' | 'dramatic';
type LayerLevel = 'base' | 'raised' | 'floating' | 'elevated' | 'overlay';

// ================================
// MAGAZINE LAYOUT
// ================================

interface MagazineLayoutProps extends BaseLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
  aside?: ReactNode;
  gap?: 'md' | 'lg' | 'xl';
}

export const MagazineLayout = forwardRef<HTMLDivElement, MagazineLayoutProps>(
  ({ sidebar, content, aside, gap = 'xl', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'magazine-layout',
          gap && `gap-${gap}`,
          className
        )}
        {...props}
      >
        <aside className="magazine-sidebar">
          {sidebar}
        </aside>
        <main className="magazine-content">
          {content}
        </main>
        {aside && (
          <aside className="magazine-aside">
            {aside}
          </aside>
        )}
      </div>
    );
  }
);

MagazineLayout.displayName = 'MagazineLayout';

// ================================
// BENTO LAYOUT
// ================================

interface BentoLayoutProps extends BaseLayoutProps {
  gap?: 'sm' | 'md' | 'lg';
}

export const BentoLayout = forwardRef<HTMLDivElement, BentoLayoutProps>(
  ({ children, gap = 'md', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bento-layout',
          gap && `gap-${gap}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BentoLayout.displayName = 'BentoLayout';

interface BentoItemProps extends BaseLayoutProps {
  size?: 'default' | 'large' | 'tall' | 'hero';
  emphasis?: VisualEmphasis;
  interactive?: boolean;
}

export const BentoItem = forwardRef<HTMLDivElement, BentoItemProps>(
  ({ 
    children, 
    size = 'default',
    emphasis = 'moderate',
    interactive = true,
    className, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bento-item',
          size !== 'default' && size,
          emphasis && `emphasis-${emphasis}`,
          interactive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BentoItem.displayName = 'BentoItem';

// ================================
// SWISS LAYOUT
// ================================

interface SwissLayoutProps extends BaseLayoutProps {
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
}

export const SwissLayout = forwardRef<HTMLDivElement, SwissLayoutProps>(
  ({ children, columns = 4, gap = 'md', className, ...props }, ref) => {
    const gridStyle = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'swiss-layout',
          gap && `gap-${gap}`,
          className
        )}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SwissLayout.displayName = 'SwissLayout';

// ================================
// ASYMMETRIC GRID
// ================================

interface AsymmetricGridProps extends BaseLayoutProps {
  areas?: string[];
  minHeight?: string;
}

export const AsymmetricGrid = forwardRef<HTMLDivElement, AsymmetricGridProps>(
  ({ children, areas, minHeight = '100vh', className, ...props }, ref) => {
    const gridStyle = areas ? {
      gridTemplateAreas: areas.map(area => `"${area}"`).join(' '),
      minHeight,
    } : { minHeight };

    return (
      <div
        ref={ref}
        className={cn('asymmetric-grid', className)}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AsymmetricGrid.displayName = 'AsymmetricGrid';

// ================================
// GALLERY LAYOUT
// ================================

interface GalleryLayoutProps extends BaseLayoutProps {
  minItemWidth?: number;
  aspectRatio?: 'golden' | 'square' | 'classic' | 'wide';
  gap?: 'sm' | 'md' | 'lg';
}

export const GalleryLayout = forwardRef<HTMLDivElement, GalleryLayoutProps>(
  ({ 
    children, 
    minItemWidth = 300, 
    aspectRatio = 'golden',
    gap = 'md',
    className, 
    ...props 
  }, ref) => {
    const gridStyle = {
      gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'gallery-layout',
          gap && `gap-${gap}`,
          className
        )}
        style={gridStyle}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className={`gallery-item aspect-${aspectRatio}`}>
            {child}
          </div>
        ))}
      </div>
    );
  }
);

GalleryLayout.displayName = 'GalleryLayout';

// ================================
// CONTENT RIVER
// ================================

interface ContentRiverProps extends BaseLayoutProps {
  measure?: 'narrow' | 'optimal' | 'wide' | 'ultra';
  rhythm?: boolean;
}

export const ContentRiver = forwardRef<HTMLDivElement, ContentRiverProps>(
  ({ 
    children, 
    measure = 'optimal',
    rhythm = true,
    className, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'content-river',
          measure && `measure-${measure}`,
          rhythm && 'space-rhythm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContentRiver.displayName = 'ContentRiver';

// ================================
// ADVANCED CARDS
// ================================

interface PristineCardProps extends BaseLayoutProps {
  variant?: 'pristine' | 'luxurious' | 'minimal';
  layer?: LayerLevel;
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PristineCard = forwardRef<HTMLDivElement, PristineCardProps>(
  ({ 
    children,
    variant = 'pristine',
    layer = 'floating',
    interactive = true,
    padding = 'lg',
    className,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          `card-${variant}`,
          layer && `layer-${layer}`,
          padding && `p-${padding}`,
          interactive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PristineCard.displayName = 'PristineCard';

// ================================
// STACK LAYOUTS
// ================================

interface StackProps extends BaseLayoutProps {
  spacing?: 'tight' | 'comfortable' | 'generous' | 'luxurious';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ 
    children,
    spacing = 'comfortable',
    align = 'stretch',
    className,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          `stack-${spacing}`,
          align !== 'stretch' && `items-${align}`,
          'flex flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

// ================================
// CLUSTER LAYOUT
// ================================

interface ClusterProps extends BaseLayoutProps {
  justify?: 'start' | 'center' | 'end' | 'between';
  align?: 'start' | 'center' | 'end' | 'baseline';
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  wrap?: boolean;
}

export const Cluster = forwardRef<HTMLDivElement, ClusterProps>(
  ({ 
    children,
    justify = 'start',
    align = 'center',
    gap = 'sm',
    wrap = true,
    className,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'cluster',
          justify !== 'start' && justify,
          align !== 'center' && `items-${align}`,
          gap && `gap-${gap}`,
          !wrap && 'flex-nowrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Cluster.displayName = 'Cluster';

// ================================
// GOLDEN SIDEBAR
// ================================

interface GoldenSidebarLayoutProps extends BaseLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
  sidebarFirst?: boolean;
  gap?: 'md' | 'lg' | 'xl';
  minContentWidth?: number;
}

export const GoldenSidebarLayout = forwardRef<HTMLDivElement, GoldenSidebarLayoutProps>(
  ({ 
    sidebar,
    content,
    sidebarFirst = true,
    gap = 'lg',
    minContentWidth = 400,
    className,
    ...props
  }, ref) => {
    const contentStyle = {
      minWidth: `${minContentWidth}px`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'sidebar-golden',
          gap && `gap-${gap}`,
          className
        )}
        {...props}
      >
        {sidebarFirst ? (
          <>
            <div>{sidebar}</div>
            <div style={contentStyle}>{content}</div>
          </>
        ) : (
          <>
            <div style={contentStyle}>{content}</div>
            <div>{sidebar}</div>
          </>
        )}
      </div>
    );
  }
);

GoldenSidebarLayout.displayName = 'GoldenSidebarLayout';

// ================================
// FLUID GRID
// ================================

interface FluidGridProps extends BaseLayoutProps {
  minItemWidth?: string;
  maxItemWidth?: string;
  gap?: FluidSpacing;
}

export const FluidGrid = forwardRef<HTMLDivElement, FluidGridProps>(
  ({ 
    children,
    minItemWidth = '280px',
    maxItemWidth = '400px',
    gap = 'md',
    className,
    ...props
  }, ref) => {
    const gridStyle = {
      gridTemplateColumns: `repeat(auto-fit, minmax(
        clamp(${minItemWidth}, 30vw, ${maxItemWidth}), 1fr
      ))`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fluid-grid',
          gap && `fluid-space-${gap}`,
          className
        )}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FluidGrid.displayName = 'FluidGrid';

// ================================
// VISUAL EMPHASIS WRAPPER
// ================================

interface EmphasisProps extends BaseLayoutProps {
  level?: VisualEmphasis;
  layer?: LayerLevel;
}

export const Emphasis = forwardRef<HTMLDivElement, EmphasisProps>(
  ({ 
    children,
    level = 'moderate',
    layer,
    className,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          level && `emphasis-${level}`,
          layer && `layer-${layer}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Emphasis.displayName = 'Emphasis';

// ================================
// RESPONSIVE CONTAINER
// ================================

interface ResponsiveContainerProps extends BaseLayoutProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  padding?: FluidSpacing;
  centerContent?: boolean;
}

export const ResponsiveContainer = forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ 
    children,
    maxWidth = 'lg',
    padding = 'md',
    centerContent = true,
    className,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          maxWidth !== 'none' && `max-w-${maxWidth}`,
          centerContent && 'mx-auto',
          padding && `fluid-space-${padding}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';

// ================================
// LAYOUT SHOWCASE COMPONENT
// ================================

export const LayoutShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-xl">
      {/* Magazine Layout Example */}
      <section className="mb-2xl">
        <ResponsiveContainer maxWidth="2xl">
          <h2 className="text-3xl font-bold text-center mb-xl">Magazine Layout</h2>
          <MagazineLayout
            sidebar={
              <PristineCard variant="minimal">
                <h3 className="text-lg font-semibold mb-md">Navigation</h3>
                <Stack spacing="tight">
                  <a href="#" className="text-blue-600 hover:text-blue-800">Dashboard</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">Analytics</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">Reports</a>
                </Stack>
              </PristineCard>
            }
            content={
              <PristineCard variant="luxurious">
                <ContentRiver measure="optimal">
                  <h1>The Future of Design Systems</h1>
                  <p className="text-lg text-gray-600">
                    Mathematical precision meets artistic vision in the next generation
                    of digital experiences.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </ContentRiver>
              </PristineCard>
            }
            aside={
              <PristineCard variant="minimal">
                <h4 className="text-sm font-semibold mb-sm text-gray-500 uppercase tracking-wide">
                  Related
                </h4>
                <Stack spacing="tight">
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Design Principles
                  </a>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Color Theory
                  </a>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Typography
                  </a>
                </Stack>
              </PristineCard>
            }
          />
        </ResponsiveContainer>
      </section>

      {/* Bento Layout Example */}
      <section className="mb-2xl">
        <ResponsiveContainer maxWidth="xl">
          <h2 className="text-3xl font-bold text-center mb-xl">Bento Grid Layout</h2>
          <BentoLayout gap="md">
            <BentoItem size="hero" className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <div className="h-full flex flex-col justify-between">
                <h3 className="text-2xl font-bold">Featured Content</h3>
                <p className="text-blue-100">
                  This hero item spans multiple grid cells for maximum impact.
                </p>
              </div>
            </BentoItem>
            
            <BentoItem className="bg-white">
              <Emphasis level="strong">
                <h4 className="font-semibold mb-sm">Metric Card</h4>
              </Emphasis>
              <p className="text-2xl font-bold text-green-600">+24.5%</p>
              <p className="text-sm text-gray-600">Growth this month</p>
            </BentoItem>
            
            <BentoItem size="tall" className="bg-gradient-to-b from-green-400 to-green-600 text-white">
              <h4 className="font-semibold mb-md">Tall Card</h4>
              <p className="text-green-100">
                This card takes up more vertical space for detailed content.
              </p>
            </BentoItem>
            
            <BentoItem className="bg-white">
              <h4 className="font-semibold mb-sm">Quick Stats</h4>
              <Cluster gap="sm">
                <span className="px-xs py-micro-sm bg-blue-100 text-blue-800 text-xs rounded">
                  Active
                </span>
                <span className="px-xs py-micro-sm bg-green-100 text-green-800 text-xs rounded">
                  Growing
                </span>
              </Cluster>
            </BentoItem>
            
            <BentoItem size="large" className="bg-gray-900 text-white">
              <h4 className="font-semibold mb-md">Wide Feature</h4>
              <p className="text-gray-300">
                Extended content area perfect for charts, images, or detailed information.
              </p>
            </BentoItem>
          </BentoLayout>
        </ResponsiveContainer>
      </section>

      {/* Gallery Layout Example */}
      <section className="mb-2xl">
        <ResponsiveContainer maxWidth="xl">
          <h2 className="text-3xl font-bold text-center mb-xl">Gallery Layout</h2>
          <GalleryLayout minItemWidth={280} aspectRatio="golden">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${
                  [
                    'from-red-400 to-red-600',
                    'from-blue-400 to-blue-600',
                    'from-green-400 to-green-600',
                    'from-purple-400 to-purple-600',
                    'from-yellow-400 to-yellow-600',
                    'from-pink-400 to-pink-600',
                    'from-indigo-400 to-indigo-600',
                    'from-teal-400 to-teal-600',
                  ][i]
                } flex items-center justify-center text-white font-semibold`}
              >
                Gallery Item {i + 1}
              </div>
            ))}
          </GalleryLayout>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

// ================================
// EXPORTS
// ================================

export default {
  MagazineLayout,
  BentoLayout,
  BentoItem,
  SwissLayout,
  AsymmetricGrid,
  GalleryLayout,
  ContentRiver,
  PristineCard,
  Stack,
  Cluster,
  GoldenSidebarLayout,
  FluidGrid,
  Emphasis,
  ResponsiveContainer,
  LayoutShowcase,
};

// Type exports
export type {
  MagazineLayoutProps,
  BentoLayoutProps,
  BentoItemProps,
  SwissLayoutProps,
  AsymmetricGridProps,
  GalleryLayoutProps,
  ContentRiverProps,
  PristineCardProps,
  StackProps,
  ClusterProps,
  GoldenSidebarLayoutProps,
  FluidGridProps,
  EmphasisProps,
  ResponsiveContainerProps,
};
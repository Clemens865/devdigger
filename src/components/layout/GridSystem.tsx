import React, { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ================================
// GRID SYSTEM TYPES
// ================================

type ColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'golden-major' | 'golden-minor';
type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid';
type SpacingSize = 'micro-xs' | 'micro-sm' | 'micro-md' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type AspectRatio = 'square' | 'video' | 'golden' | 'golden-portrait' | 'card' | 'hero' | '4-3' | '3-2' | '2-1';

interface BaseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

// ================================
// CONTAINER COMPONENT
// ================================

interface ContainerProps extends BaseProps {
  size?: ContainerSize;
  centerContent?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  centerContent = false,
  className = '',
  ...props
}) => {
  const containerClass = cn(
    'container',
    size !== 'fluid' && `container-${size}`,
    centerContent && 'content-centered',
    className
  );

  return (
    <div className={containerClass} {...props}>
      {children}
    </div>
  );
};

// ================================
// GRID COMPONENT
// ================================

interface GridProps extends BaseProps {
  columns?: number;
  gap?: SpacingSize;
  responsive?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 12,
  gap = 'md',
  responsive = true,
  className = '',
  ...props
}) => {
  const gridClass = cn(
    'grid',
    gap && `gap-${gap}`,
    !responsive && columns !== 12 && `grid-cols-${columns}`,
    className
  );

  const gridStyle = columns !== 12 ? {
    gridTemplateColumns: `repeat(${columns}, 1fr)`
  } : undefined;

  return (
    <div className={gridClass} style={gridStyle} {...props}>
      {children}
    </div>
  );
};

// ================================
// COLUMN COMPONENT
// ================================

interface ColumnProps extends BaseProps {
  span?: ColumnSpan;
  smSpan?: ColumnSpan;
  mdSpan?: ColumnSpan;
  lgSpan?: ColumnSpan;
  xlSpan?: ColumnSpan;
  offset?: number;
  order?: number;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  span = 12,
  smSpan,
  mdSpan,
  lgSpan,
  xlSpan,
  offset,
  order,
  className = '',
  ...props
}) => {
  const columnClass = cn(
    span && `col-${span}`,
    smSpan && `sm:col-${smSpan}`,
    mdSpan && `md:col-${mdSpan}`,
    lgSpan && `lg:col-${lgSpan}`,
    xlSpan && `xl:col-${xlSpan}`,
    className
  );

  const columnStyle = {
    ...(offset && { gridColumnStart: offset + 1 }),
    ...(order && { order }),
  };

  return (
    <div className={columnClass} style={columnStyle} {...props}>
      {children}
    </div>
  );
};

// ================================
// FLEX COMPONENTS
// ================================

interface FlexProps extends BaseProps {
  direction?: 'row' | 'col';
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: SpacingSize;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  wrap = false,
  justify = 'start',
  align = 'start',
  gap,
  className = '',
  ...props
}) => {
  const flexClass = cn(
    'flex',
    direction === 'col' && 'flex-col',
    wrap && 'flex-wrap',
    justify && `justify-${justify}`,
    align && `items-${align}`,
    gap && `gap-${gap}`,
    className
  );

  return (
    <div className={flexClass} {...props}>
      {children}
    </div>
  );
};

// ================================
// LAYOUT PATTERNS
// ================================

interface GoldenSidebarProps extends BaseProps {
  reverse?: boolean;
  sidebar: ReactNode;
  content: ReactNode;
}

export const GoldenSidebar: React.FC<GoldenSidebarProps> = ({
  reverse = false,
  sidebar,
  content,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={cn(
        'golden-sidebar-layout',
        reverse && 'reverse',
        className
      )} 
      {...props}
    >
      {reverse ? (
        <>
          <div>{content}</div>
          <div>{sidebar}</div>
        </>
      ) : (
        <>
          <div>{sidebar}</div>
          <div>{content}</div>
        </>
      )}
    </div>
  );
};

interface TwoColumnProps extends BaseProps {
  left: ReactNode;
  right: ReactNode;
  gap?: SpacingSize;
}

export const TwoColumn: React.FC<TwoColumnProps> = ({
  left,
  right,
  gap = 'lg',
  className = '',
  ...props
}) => {
  return (
    <div 
      className={cn('two-column-layout', gap && `gap-${gap}`, className)} 
      {...props}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
};

interface ThreeColumnProps extends BaseProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  gap?: SpacingSize;
}

export const ThreeColumn: React.FC<ThreeColumnProps> = ({
  left,
  center,
  right,
  gap = 'md',
  className = '',
  ...props
}) => {
  return (
    <div 
      className={cn('three-column-layout', gap && `gap-${gap}`, className)} 
      {...props}
    >
      <div>{left}</div>
      <div>{center}</div>
      <div>{right}</div>
    </div>
  );
};

// ================================
// HERO SECTION
// ================================

interface HeroProps extends BaseProps {
  variant?: 'center' | 'left';
  fullHeight?: boolean;
  backgroundImage?: string;
}

export const Hero: React.FC<HeroProps> = ({
  children,
  variant = 'center',
  fullHeight = true,
  backgroundImage,
  className = '',
  ...props
}) => {
  const heroClass = cn(
    'hero-layout',
    !fullHeight && 'min-h-0',
    variant === 'left' && 'text-left',
    className
  );

  const heroStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : undefined;

  return (
    <section className={heroClass} style={heroStyle} {...props}>
      <Container size="lg" centerContent>
        {children}
      </Container>
    </section>
  );
};

// ================================
// CARD GRID
// ================================

interface CardGridProps extends BaseProps {
  minCardWidth?: number;
  gap?: SpacingSize;
  responsive?: boolean;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  minCardWidth = 280,
  gap = 'md',
  responsive = true,
  className = '',
  ...props
}) => {
  const cardGridClass = cn(
    responsive ? 'card-grid' : 'grid',
    gap && `gap-${gap}`,
    className
  );

  const gridStyle = !responsive ? {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}px, 1fr))`
  } : undefined;

  return (
    <div className={cardGridClass} style={gridStyle} {...props}>
      {children}
    </div>
  );
};

// ================================
// DASHBOARD GRID
// ================================

interface DashboardGridProps extends BaseProps {
  minItemWidth?: number;
  gap?: SpacingSize;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  minItemWidth = 300,
  gap = 'md',
  className = '',
  ...props
}) => {
  const dashboardClass = cn('dashboard-grid', gap && `gap-${gap}`, className);
  
  const gridStyle = {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`
  };

  return (
    <div className={dashboardClass} style={gridStyle} {...props}>
      {children}
    </div>
  );
};

// ================================
// MASONRY LAYOUT
// ================================

interface MasonryProps extends BaseProps {
  columns?: number;
  gap?: SpacingSize;
}

export const Masonry: React.FC<MasonryProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className = '',
  ...props
}) => {
  const masonryClass = cn('masonry-layout', gap && `gap-${gap}`, className);
  
  const masonryStyle = {
    columnCount: columns,
    columnGap: `var(--space-${gap})`,
  };

  return (
    <div className={masonryClass} style={masonryStyle} {...props}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="masonry-item">
          {child}
        </div>
      ))}
    </div>
  );
};

// ================================
// ASPECT RATIO BOX
// ================================

interface AspectBoxProps extends BaseProps {
  ratio?: AspectRatio;
  customRatio?: number;
}

export const AspectBox: React.FC<AspectBoxProps> = ({
  children,
  ratio = 'square',
  customRatio,
  className = '',
  ...props
}) => {
  const aspectClass = cn(
    customRatio ? '' : `aspect-${ratio}`,
    className
  );

  const aspectStyle = customRatio ? {
    aspectRatio: customRatio.toString()
  } : undefined;

  return (
    <div className={aspectClass} style={aspectStyle} {...props}>
      {children}
    </div>
  );
};

// ================================
// CENTERED LAYOUT
// ================================

interface CenteredProps extends BaseProps {
  fullHeight?: boolean;
  maxWidth?: string;
}

export const Centered: React.FC<CenteredProps> = ({
  children,
  fullHeight = false,
  maxWidth,
  className = '',
  ...props
}) => {
  const centeredClass = cn(
    'flex items-center justify-center',
    fullHeight && 'min-h-screen',
    className
  );

  const centeredStyle = maxWidth ? { maxWidth } : undefined;

  return (
    <div className={centeredClass} style={centeredStyle} {...props}>
      {children}
    </div>
  );
};

// ================================
// SPACING COMPONENT
// ================================

interface SpacerProps {
  size?: SpacingSize;
  direction?: 'vertical' | 'horizontal';
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
}) => {
  const spacerClass = direction === 'vertical' 
    ? `h-${size} w-full` 
    : `w-${size} h-full`;

  return <div className={spacerClass} />;
};

// ================================
// SECTION WRAPPER
// ================================

interface SectionProps extends BaseProps {
  padding?: SpacingSize;
  background?: 'transparent' | 'white' | 'gray-50' | 'gray-100';
}

export const Section: React.FC<SectionProps> = ({
  children,
  padding = 'xl',
  background = 'transparent',
  className = '',
  ...props
}) => {
  const sectionClass = cn(
    padding && `py-${padding}`,
    background !== 'transparent' && `bg-${background}`,
    className
  );

  return (
    <section className={sectionClass} {...props}>
      {children}
    </section>
  );
};

// ================================
// RESPONSIVE UTILITIES
// ================================

interface ResponsiveProps extends BaseProps {
  show?: ('sm' | 'md' | 'lg' | 'xl')[];
  hide?: ('sm' | 'md' | 'lg' | 'xl')[];
}

export const Responsive: React.FC<ResponsiveProps> = ({
  children,
  show = [],
  hide = [],
  className = '',
  ...props
}) => {
  const responsiveClass = cn(
    show.length > 0 && 'hidden',
    ...show.map(bp => `${bp}:block`),
    ...hide.map(bp => `${bp}:hidden`),
    className
  );

  return (
    <div className={responsiveClass} {...props}>
      {children}
    </div>
  );
};

// ================================
// EXPORTS
// ================================

export default {
  Container,
  Grid,
  Column,
  Flex,
  GoldenSidebar,
  TwoColumn,
  ThreeColumn,
  Hero,
  CardGrid,
  DashboardGrid,
  Masonry,
  AspectBox,
  Centered,
  Spacer,
  Section,
  Responsive,
};

// Type exports for external use
export type {
  ColumnSpan,
  ContainerSize,
  SpacingSize,
  AspectRatio,
  ContainerProps,
  GridProps,
  ColumnProps,
  FlexProps,
  GoldenSidebarProps,
  HeroProps,
  CardGridProps,
  DashboardGridProps,
  MasonryProps,
  AspectBoxProps,
  CenteredProps,
  SpacerProps,
  SectionProps,
  ResponsiveProps,
};
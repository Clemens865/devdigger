/**
 * DevDigger Layout System
 * Gallery-Quality Design Components
 * 
 * A comprehensive layout system based on mathematical principles:
 * - Golden ratio (φ = 1.618) proportional layouts
 * - Fibonacci sequence spacing scale
 * - Musical interval typography scales
 * - Advanced responsive patterns with fluid scaling
 * - Visual rhythm and baseline grid systems
 * - Container queries and intelligent breakpoints
 * 
 * @example
 * ```tsx
 * import { 
 *   Container, 
 *   BentoLayout, 
 *   BentoItem, 
 *   MagazineLayout,
 *   PristineCard,
 *   Stack,
 *   ResponsiveContainer
 * } from '@/components/layout';
 * 
 * function App() {
 *   return (
 *     <ResponsiveContainer maxWidth="xl">
 *       <Stack spacing="luxurious">
 *         <h1 className="text-fluid-4xl">Gallery-Quality Design</h1>
 *         
 *         <BentoLayout gap="md">
 *           <BentoItem size="hero">
 *             <PristineCard variant="luxurious">
 *               Featured Content
 *             </PristineCard>
 *           </BentoItem>
 *           <BentoItem>
 *             <PristineCard>Regular Content</PristineCard>
 *           </BentoItem>
 *         </BentoLayout>
 *       </Stack>
 *     </ResponsiveContainer>
 *   );
 * }
 * ```
 */

// ================================
// CORE GRID SYSTEM
// ================================

export {
  Container,
  Grid,
  Column,
  Flex,
  type ContainerProps,
  type GridProps,
  type ColumnProps,
  type FlexProps,
} from './GridSystem';

// Basic Layout Patterns
export {
  GoldenSidebar,
  TwoColumn,
  ThreeColumn,
  Hero,
  type GoldenSidebarProps,
  type HeroProps,
} from './GridSystem';

// Grid Systems
export {
  CardGrid,
  DashboardGrid,
  Masonry,
  type CardGridProps,
  type DashboardGridProps,
  type MasonryProps,
} from './GridSystem';

// Layout Utilities
export {
  AspectBox,
  Centered,
  Spacer,
  Section,
  Responsive,
  type AspectBoxProps,
  type CenteredProps,
  type SpacerProps,
  type SectionProps,
  type ResponsiveProps,
} from './GridSystem';

// ================================
// ADVANCED LAYOUT COMPONENTS
// ================================

export {
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
  type MagazineLayoutProps,
  type BentoLayoutProps,
  type BentoItemProps,
  type SwissLayoutProps,
  type AsymmetricGridProps,
  type GalleryLayoutProps,
  type ContentRiverProps,
  type PristineCardProps,
  type StackProps,
  type ClusterProps,
  type GoldenSidebarLayoutProps,
  type FluidGridProps,
  type EmphasisProps,
  type ResponsiveContainerProps,
} from './AdvancedLayouts';

// ================================
// DOCUMENTATION & EXAMPLES
// ================================

export { LayoutDocumentation } from './LayoutDocumentation';
export { LayoutExample } from './LayoutExample';

// ================================
// TYPE EXPORTS
// ================================

export type {
  ColumnSpan,
  ContainerSize,
  SpacingSize,
  AspectRatio,
} from './GridSystem';

// ================================
// CONVENIENCE EXPORTS
// ================================

// Default grid system export
export { default as GridSystem } from './GridSystem';

// Advanced layouts default export
export { default as AdvancedLayouts } from './AdvancedLayouts';
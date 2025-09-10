// Oracle-themed Data Visualization Components
export { OracleProgressSphere } from './OracleProgressSphere';
export { MysticScrollProgress } from './MysticScrollProgress';
export { CrawlingDepthGauge } from './CrawlingDepthGauge';
export { OracleChart } from './OracleChart';
export { KnowledgeExcavationMap } from './KnowledgeExcavationMap';
export { GlassmorphismContainer } from './GlassmorphismContainer';

// Hooks and utilities
export { useVisualizationData, useRealtimeVisualizationData } from '../hooks/useVisualizationData';

// Type definitions
export type {
  VisualizationDataPoint,
  VisualizationConfig,
  UseVisualizationDataOptions
} from '../hooks/useVisualizationData';

export type { ExcavationNode } from './KnowledgeExcavationMap';

// Re-export commonly used interfaces
export interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
  category?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ProgressVisualizationProps {
  progress: number;
  label?: string;
  variant?: 'crystal' | 'energy' | 'mystic' | 'void';
  isActive?: boolean;
  className?: string;
}

export interface ChartVisualizationProps {
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'area' | 'pie' | 'radar' | 'sparkline';
  variant?: 'crystal' | 'energy' | 'mystic' | 'void';
  showAnimation?: boolean;
  interactive?: boolean;
  className?: string;
}
import { useState, useEffect, useMemo } from 'react';

export interface VisualizationDataPoint {
  id: string;
  label: string;
  value: number;
  category?: string;
  color?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface VisualizationConfig {
  type: 'bar' | 'line' | 'area' | 'pie' | 'radar' | 'sparkline' | 'progress';
  variant?: 'crystal' | 'energy' | 'mystic' | 'void';
  showAnimation?: boolean;
  showTooltip?: boolean;
  interactive?: boolean;
  refreshInterval?: number;
}

export interface UseVisualizationDataOptions {
  dataSource?: () => Promise<VisualizationDataPoint[]> | VisualizationDataPoint[];
  config?: Partial<VisualizationConfig>;
  dependencies?: any[];
  transformData?: (data: VisualizationDataPoint[]) => VisualizationDataPoint[];
  filterData?: (data: VisualizationDataPoint[]) => VisualizationDataPoint[];
  sortData?: (data: VisualizationDataPoint[]) => VisualizationDataPoint[];
}

export const useVisualizationData = ({
  dataSource,
  config = {},
  dependencies = [],
  transformData,
  filterData,
  sortData
}: UseVisualizationDataOptions = {}) => {
  const [data, setData] = useState<VisualizationDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const defaultConfig: VisualizationConfig = {
    type: 'bar',
    variant: 'crystal',
    showAnimation: true,
    showTooltip: true,
    interactive: true,
    refreshInterval: 30000, // 30 seconds
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Fetch and update data
  const fetchData = async () => {
    if (!dataSource) return;

    setLoading(true);
    setError(null);

    try {
      const result = await Promise.resolve(dataSource());
      let processedData = Array.isArray(result) ? result : [];

      // Apply data transformations
      if (transformData) {
        processedData = transformData(processedData);
      }

      if (filterData) {
        processedData = filterData(processedData);
      }

      if (sortData) {
        processedData = sortData(processedData);
      }

      setData(processedData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and dependency-based refetch
  useEffect(() => {
    fetchData();
  }, dependencies);

  // Auto-refresh interval
  useEffect(() => {
    if (!finalConfig.refreshInterval || finalConfig.refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchData();
    }, finalConfig.refreshInterval);

    return () => clearInterval(interval);
  }, [finalConfig.refreshInterval, ...dependencies]);

  // Data statistics and insights
  const statistics = useMemo(() => {
    if (data.length === 0) {
      return {
        count: 0,
        sum: 0,
        average: 0,
        min: 0,
        max: 0,
        median: 0,
        standardDeviation: 0,
        categories: [],
        trends: null
      };
    }

    const values = data.map(d => d.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)];

    const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    const categories = [...new Set(data.map(d => d.category).filter(Boolean))];

    // Simple trend analysis for time-series data
    const trends = data.length > 1 && data.every(d => d.timestamp) ? 
      calculateTrends(data.sort((a, b) => 
        (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
      )) : null;

    return {
      count: data.length,
      sum,
      average,
      min,
      max,
      median,
      standardDeviation,
      categories,
      trends
    };
  }, [data]);

  // Color palette generation
  const generateColorPalette = (variant: string, count: number): string[] => {
    const variants = {
      crystal: ['#60a5fa', '#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a'],
      energy: ['#34d399', '#10b981', '#047857', '#065f46', '#064e3b'],
      mystic: ['#a855f7', '#9333ea', '#7c3aed', '#6d28d9', '#5b21b6'],
      void: ['#6b7280', '#4b5563', '#374151', '#1f2937', '#111827']
    };

    const baseColors = variants[variant as keyof typeof variants] || variants.crystal;
    
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // Generate additional colors by interpolating
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const index = (i / (count - 1)) * (baseColors.length - 1);
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);
      
      if (lowerIndex === upperIndex) {
        colors.push(baseColors[lowerIndex]);
      } else {
        // Simple color interpolation
        colors.push(baseColors[lowerIndex]);
      }
    }

    return colors;
  };

  // Assign colors to data points
  const dataWithColors = useMemo(() => {
    const colors = generateColorPalette(finalConfig.variant || 'crystal', data.length);
    return data.map((point, index) => ({
      ...point,
      color: point.color || colors[index % colors.length]
    }));
  }, [data, finalConfig.variant]);

  return {
    data: dataWithColors,
    loading,
    error,
    lastUpdated,
    config: finalConfig,
    statistics,
    refetch: fetchData,
    // Utility functions
    addDataPoint: (point: Omit<VisualizationDataPoint, 'id'>) => {
      const newPoint: VisualizationDataPoint = {
        ...point,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      setData(prev => [...prev, newPoint]);
    },
    updateDataPoint: (id: string, updates: Partial<VisualizationDataPoint>) => {
      setData(prev => prev.map(point => 
        point.id === id ? { ...point, ...updates } : point
      ));
    },
    removeDataPoint: (id: string) => {
      setData(prev => prev.filter(point => point.id !== id));
    },
    clearData: () => {
      setData([]);
    }
  };
};

// Helper function for trend analysis
const calculateTrends = (timeSeriesData: VisualizationDataPoint[]) => {
  if (timeSeriesData.length < 2) return null;

  const values = timeSeriesData.map(d => d.value);
  const n = values.length;
  
  // Calculate linear regression
  const sumX = timeSeriesData.reduce((sum, _, index) => sum + index, 0);
  const sumY = values.reduce((sum, value) => sum + value, 0);
  const sumXY = timeSeriesData.reduce((sum, point, index) => sum + (index * point.value), 0);
  const sumXX = timeSeriesData.reduce((sum, _, index) => sum + (index * index), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Determine trend direction
  const trendDirection = slope > 0.01 ? 'increasing' : 
                        slope < -0.01 ? 'decreasing' : 'stable';
  
  // Calculate R-squared (coefficient of determination)
  const meanY = sumY / n;
  const totalSumSquares = values.reduce((sum, value) => sum + Math.pow(value - meanY, 2), 0);
  const residualSumSquares = timeSeriesData.reduce((sum, point, index) => {
    const predicted = slope * index + intercept;
    return sum + Math.pow(point.value - predicted, 2);
  }, 0);
  
  const rSquared = 1 - (residualSumSquares / totalSumSquares);
  
  return {
    direction: trendDirection,
    slope,
    intercept,
    correlation: Math.sqrt(Math.abs(rSquared)) * (slope >= 0 ? 1 : -1),
    strength: rSquared,
    prediction: (steps: number) => slope * (n - 1 + steps) + intercept
  };
};

// Hook for real-time data streaming
export const useRealtimeVisualizationData = (
  streamSource: () => Promise<VisualizationDataPoint> | VisualizationDataPoint,
  options: {
    maxDataPoints?: number;
    updateInterval?: number;
    bufferSize?: number;
  } = {}
) => {
  const {
    maxDataPoints = 100,
    updateInterval = 1000,
    bufferSize = 10
  } = options;

  const [data, setData] = useState<VisualizationDataPoint[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = () => {
    setIsStreaming(true);
  };

  const stopStreaming = () => {
    setIsStreaming(false);
  };

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(async () => {
      try {
        const newPoint = await Promise.resolve(streamSource());
        
        setData(prevData => {
          const updatedData = [...prevData, newPoint];
          
          // Keep only the last maxDataPoints
          if (updatedData.length > maxDataPoints) {
            return updatedData.slice(-maxDataPoints);
          }
          
          return updatedData;
        });
      } catch (error) {
        console.error('Error streaming data:', error);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isStreaming, updateInterval, maxDataPoints, streamSource]);

  return {
    data,
    isStreaming,
    startStreaming,
    stopStreaming,
    clearData: () => setData([])
  };
};
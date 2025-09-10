import React, { useState, useEffect, useRef } from 'react';
import './../../styles/dataviz.css';

// Types for data visualization
interface ProgressData {
  value: number;
  max: number;
  segments?: number;
  color?: string;
  label?: string;
}

interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

interface MetricData {
  value: number;
  previousValue?: number;
  target?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

interface StatusData {
  status: 'healthy' | 'warning' | 'error' | 'offline';
  label: string;
  value?: number;
  details?: string;
}

interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
  status: 'active' | 'inactive' | 'processing';
}

// Linear Progress Bar Component
export const LinearProgress: React.FC<ProgressData> = ({ 
  value, 
  max, 
  segments = 1, 
  color = '#3b82f6',
  label 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="linear-progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="linear-progress-track">
        <div 
          className="linear-progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            animationDelay: '0.3s'
          }}
        />
        {segments > 1 && (
          <div className="progress-segments">
            {Array.from({ length: segments - 1 }, (_, i) => (
              <div 
                key={i}
                className="segment-divider"
                style={{ left: `${((i + 1) / segments) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="progress-value">{value}/{max}</div>
    </div>
  );
};

// Circular Progress Ring Component
export const CircularProgress: React.FC<ProgressData & { size?: number }> = ({ 
  value, 
  max, 
  color = '#3b82f6',
  label,
  size = 120
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="circular-progress-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circular-progress-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="progress-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="progress-circle"
          style={{
            stroke: color,
            strokeDasharray,
            strokeDashoffset,
            animationDelay: '0.5s'
          }}
        />
      </svg>
      <div className="circular-progress-content">
        <div className="progress-percentage">{Math.round(percentage)}%</div>
        {label && <div className="progress-label-small">{label}</div>}
      </div>
    </div>
  );
};

// Step Progress Indicator
export const StepProgress: React.FC<{
  steps: string[];
  currentStep: number;
  completedColor?: string;
  activeColor?: string;
}> = ({ 
  steps, 
  currentStep, 
  completedColor = '#10b981',
  activeColor = '#3b82f6'
}) => {
  return (
    <div className="step-progress-container">
      <div className="step-progress-line">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div 
              className={`step-node ${
                index < currentStep ? 'completed' : 
                index === currentStep ? 'active' : 'pending'
              }`}
              style={{
                backgroundColor: index < currentStep ? completedColor : 
                                index === currentStep ? activeColor : '#e5e7eb'
              }}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`step-connector ${index < currentStep ? 'completed' : ''}`}
                style={{ backgroundColor: index < currentStep ? completedColor : '#e5e7eb' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="step-labels">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`step-label ${
              index <= currentStep ? 'active' : 'inactive'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

// Wave Progress Animation
export const WaveProgress: React.FC<ProgressData & { height?: number }> = ({ 
  value, 
  max, 
  color = '#06b6d4',
  label,
  height = 100 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="wave-progress-container" style={{ height }}>
      {label && <div className="wave-label">{label}</div>}
      <div className="wave-container">
        <svg className="wave-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <mask id="wave-mask">
              <rect width="100" height="100" fill="white" />
              <path
                d={`M0,${100 - percentage} Q25,${100 - percentage - 5} 50,${100 - percentage} T100,${100 - percentage} V100 H0 Z`}
                fill="black"
                className="wave-path"
              />
            </mask>
          </defs>
          <rect 
            width="100" 
            height="100" 
            fill={color} 
            mask="url(#wave-mask)"
            opacity="0.8"
          />
        </svg>
        <div className="wave-percentage">{Math.round(percentage)}%</div>
      </div>
    </div>
  );
};

// Health Status Indicator
export const HealthIndicator: React.FC<StatusData> = ({ 
  status, 
  label, 
  value, 
  details 
}) => {
  const statusColors = {
    healthy: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    offline: '#6b7280'
  };
  
  const statusIcons = {
    healthy: '●',
    warning: '⚠',
    error: '●',
    offline: '○'
  };
  
  return (
    <div className="health-indicator">
      <div className="health-icon" style={{ color: statusColors[status] }}>
        {statusIcons[status]}
      </div>
      <div className="health-content">
        <div className="health-label">{label}</div>
        {value !== undefined && <div className="health-value">{value}</div>}
        {details && <div className="health-details">{details}</div>}
      </div>
      <div className="health-pulse" style={{ backgroundColor: statusColors[status] }} />
    </div>
  );
};

// Sparkline Chart
export const Sparkline: React.FC<{ 
  data: number[]; 
  color?: string; 
  width?: number; 
  height?: number;
}> = ({ 
  data, 
  color = '#3b82f6', 
  width = 100, 
  height = 30 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="sparkline" width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        className="sparkline-path"
      />
    </svg>
  );
};

// Bar Chart Component
export const BarChart: React.FC<ChartData & { height?: number }> = ({ 
  labels, 
  values, 
  colors,
  height = 200 
}) => {
  const maxValue = Math.max(...values);
  const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  return (
    <div className="bar-chart" style={{ height }}>
      <div className="chart-bars">
        {values.map((value, index) => (
          <div key={index} className="bar-container">
            <div 
              className="bar"
              style={{
                height: `${(value / maxValue) * 80}%`,
                backgroundColor: colors?.[index] || defaultColors[index % defaultColors.length],
                animationDelay: `${index * 0.1}s`
              }}
            />
            <div className="bar-label">{labels[index]}</div>
            <div className="bar-value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
export const DonutChart: React.FC<ChartData & { size?: number }> = ({ 
  labels, 
  values, 
  colors,
  size = 200 
}) => {
  const total = values.reduce((sum, value) => sum + value, 0);
  const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const radius = (size - 40) / 2;
  const innerRadius = radius * 0.6;
  const center = size / 2;
  
  let cumulativeAngle = 0;
  
  const createArcPath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = center + outerR * Math.cos(startAngleRad);
    const y1 = center + outerR * Math.sin(startAngleRad);
    const x2 = center + outerR * Math.cos(endAngleRad);
    const y2 = center + outerR * Math.sin(endAngleRad);
    
    const x3 = center + innerR * Math.cos(endAngleRad);
    const y3 = center + innerR * Math.sin(endAngleRad);
    const x4 = center + innerR * Math.cos(startAngleRad);
    const y4 = center + innerR * Math.sin(startAngleRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };
  
  return (
    <div className="donut-chart-container">
      <svg width={size} height={size} className="donut-chart">
        {values.map((value, index) => {
          const percentage = (value / total) * 100;
          const angle = (value / total) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;
          cumulativeAngle += angle;
          
          return (
            <path
              key={index}
              d={createArcPath(startAngle, endAngle, radius, innerRadius)}
              fill={colors?.[index] || defaultColors[index % defaultColors.length]}
              className="donut-segment"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          );
        })}
        <text 
          x={center} 
          y={center} 
          textAnchor="middle" 
          dominantBaseline="middle"
          className="donut-total"
        >
          {total}
        </text>
      </svg>
      <div className="donut-legend">
        {labels.map((label, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: colors?.[index] || defaultColors[index % defaultColors.length] }}
            />
            <span className="legend-label">{label}</span>
            <span className="legend-value">{values[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Animated Number Display
export const AnimatedNumber: React.FC<MetricData & { 
  duration?: number;
  suffix?: string;
}> = ({ 
  value, 
  previousValue, 
  target, 
  unit = '', 
  trend,
  duration = 1000,
  suffix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(previousValue || 0);
  
  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [value, duration]);
  
  const trendIcons = {
    up: '↗',
    down: '↘',
    stable: '→'
  };
  
  const trendColors = {
    up: '#10b981',
    down: '#ef4444',
    stable: '#6b7280'
  };
  
  return (
    <div className="animated-number">
      <div className="number-value">
        {Math.round(displayValue).toLocaleString()}{unit}{suffix}
      </div>
      {trend && (
        <div 
          className="trend-indicator"
          style={{ color: trendColors[trend] }}
        >
          {trendIcons[trend]}
        </div>
      )}
      {target && (
        <div className="target-indicator">
          Target: {target.toLocaleString()}{unit}
        </div>
      )}
    </div>
  );
};

// Network Graph Visualization
export const NetworkGraph: React.FC<{ 
  nodes: NetworkNode[];
  width?: number;
  height?: number;
}> = ({ 
  nodes, 
  width = 400, 
  height = 300 
}) => {
  const statusColors = {
    active: '#10b981',
    inactive: '#6b7280',
    processing: '#f59e0b'
  };
  
  return (
    <div className="network-graph">
      <svg width={width} height={height} className="network-svg">
        {/* Render connections */}
        {nodes.map(node => 
          node.connections.map(connectionId => {
            const connectedNode = nodes.find(n => n.id === connectionId);
            if (!connectedNode) return null;
            
            return (
              <line
                key={`${node.id}-${connectionId}`}
                x1={node.x * width}
                y1={node.y * height}
                x2={connectedNode.x * width}
                y2={connectedNode.y * height}
                className="network-connection"
              />
            );
          })
        )}
        
        {/* Render nodes */}
        {nodes.map(node => (
          <g key={node.id} className="network-node">
            <circle
              cx={node.x * width}
              cy={node.y * height}
              r="8"
              fill={statusColors[node.status]}
              className="node-circle"
            />
            <text
              x={node.x * width}
              y={node.y * height - 15}
              textAnchor="middle"
              className="node-label"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// KPI Card Component
export const KPICard: React.FC<{
  title: string;
  value: number;
  change?: number;
  changeType?: 'percentage' | 'absolute';
  format?: 'number' | 'currency' | 'percentage';
  color?: string;
}> = ({ 
  title, 
  value, 
  change, 
  changeType = 'percentage',
  format = 'number',
  color = '#3b82f6'
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };
  
  const isPositive = change ? change > 0 : null;
  
  return (
    <div className="kpi-card" style={{ borderTopColor: color }}>
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
      </div>
      <div className="kpi-value" style={{ color }}>
        {formatValue(value)}
      </div>
      {change !== undefined && (
        <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="change-indicator">
            {isPositive ? '↗' : '↘'}
          </span>
          <span className="change-value">
            {changeType === 'percentage' ? `${Math.abs(change)}%` : formatValue(Math.abs(change))}
          </span>
        </div>
      )}
    </div>
  );
};

// Heatmap Component
export const Heatmap: React.FC<{
  data: number[][];
  labels?: { x: string[]; y: string[] };
  colorRange?: [string, string];
}> = ({ 
  data, 
  labels,
  colorRange = ['#f3f4f6', '#3b82f6']
}) => {
  const maxValue = Math.max(...data.flat());
  const minValue = Math.min(...data.flat());
  
  const getColor = (value: number) => {
    const intensity = (value - minValue) / (maxValue - minValue);
    return `rgba(59, 130, 246, ${intensity})`;
  };
  
  return (
    <div className="heatmap">
      <div className="heatmap-grid">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="heatmap-row">
            {labels?.y && (
              <div className="heatmap-row-label">{labels.y[rowIndex]}</div>
            )}
            {row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="heatmap-cell"
                style={{ backgroundColor: getColor(value) }}
                title={`${value}`}
              >
                <span className="cell-value">{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {labels?.x && (
        <div className="heatmap-x-labels">
          {labels.x.map((label, index) => (
            <div key={index} className="heatmap-x-label">{label}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Performance Gauge
export const PerformanceGauge: React.FC<{
  value: number;
  max: number;
  min?: number;
  label: string;
  thresholds?: { warning: number; critical: number };
}> = ({ 
  value, 
  max, 
  min = 0, 
  label,
  thresholds 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180 - 90;
  
  const getColor = () => {
    if (thresholds) {
      if (value >= thresholds.critical) return '#ef4444';
      if (value >= thresholds.warning) return '#f59e0b';
    }
    return '#10b981';
  };
  
  return (
    <div className="performance-gauge">
      <div className="gauge-container">
        <svg className="gauge-svg" viewBox="0 0 200 120">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            className="gauge-track"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            className="gauge-fill"
          />
          <circle cx="100" cy="100" r="4" fill={getColor()} />
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 60 * Math.sin((angle * Math.PI) / 180)}
            stroke={getColor()}
            strokeWidth="3"
            className="gauge-needle"
          />
        </svg>
        <div className="gauge-value">{value}</div>
        <div className="gauge-label">{label}</div>
      </div>
    </div>
  );
};

// Main DataViz export with all components
const DataViz = {
  LinearProgress,
  CircularProgress,
  StepProgress,
  WaveProgress,
  HealthIndicator,
  Sparkline,
  BarChart,
  DonutChart,
  AnimatedNumber,
  NetworkGraph,
  KPICard,
  Heatmap,
  PerformanceGauge
};

export default DataViz;
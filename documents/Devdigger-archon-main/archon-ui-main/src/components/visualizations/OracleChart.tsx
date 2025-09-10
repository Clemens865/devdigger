import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { TrendingUp, BarChart3, PieChart, Activity, Zap, Eye } from 'lucide-react';

interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
  category?: string;
  color?: string;
  metadata?: Record<string, any>;
}

interface OracleChartProps {
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'area' | 'pie' | 'radar' | 'sparkline';
  width?: number;
  height?: number;
  variant?: 'crystal' | 'energy' | 'mystic' | 'void';
  showAnimation?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  interactive?: boolean;
  onDataPointClick?: (dataPoint: ChartDataPoint) => void;
  onDataPointHover?: (dataPoint: ChartDataPoint | null) => void;
  className?: string;
}

export const OracleChart: React.FC<OracleChartProps> = ({
  data = [],
  type = 'bar',
  width = 400,
  height = 300,
  variant = 'crystal',
  showAnimation = true,
  showTooltip = true,
  showLegend = false,
  interactive = true,
  onDataPointClick,
  onDataPointHover,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: ChartDataPoint | null;
  }>({ visible: false, x: 0, y: 0, data: null });
  const [isHovered, setIsHovered] = useState(false);

  // Variant configurations
  const variantConfig = {
    crystal: {
      primary: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#1d4ed8',
      gradient: ['#60a5fa', '#3b82f6', '#1d4ed8'],
      glow: 'rgba(96, 165, 250, 0.4)',
      particles: '#ddd6fe',
      name: 'Crystal Vision'
    },
    energy: {
      primary: '#34d399',
      secondary: '#10b981',
      accent: '#047857',
      gradient: ['#34d399', '#10b981', '#047857'],
      glow: 'rgba(52, 211, 153, 0.4)',
      particles: '#fde68a',
      name: 'Energy Flow'
    },
    mystic: {
      primary: '#a855f7',
      secondary: '#9333ea',
      accent: '#7c3aed',
      gradient: ['#a855f7', '#9333ea', '#7c3aed'],
      glow: 'rgba(168, 85, 247, 0.4)',
      particles: '#fbbf24',
      name: 'Mystic Realm'
    },
    void: {
      primary: '#6b7280',
      secondary: '#4b5563',
      accent: '#374151',
      gradient: ['#6b7280', '#4b5563', '#374151'],
      glow: 'rgba(107, 114, 128, 0.4)',
      particles: '#d1d5db',
      name: 'Void Space'
    }
  };

  const config = variantConfig[variant];

  // Chart type icons
  const chartIcons = {
    bar: BarChart3,
    line: TrendingUp,
    area: Activity,
    pie: PieChart,
    radar: Zap,
    sparkline: Activity
  };

  const ChartIcon = chartIcons[type];

  // Color scale for data points
  const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.id))
    .range(config.gradient.concat(d3.schemeCategory10));

  // D3 chart rendering
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add mystical background gradient
    const defs = svg.append('defs');
    
    const gradient = defs.append('linearGradient')
      .attr('id', `oracle-gradient-${variant}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', config.primary)
      .attr('stop-opacity', 0.1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', config.secondary)
      .attr('stop-opacity', 0.05);

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', `url(#oracle-gradient-${variant})`)
      .attr('rx', 8);

    // Render different chart types
    switch (type) {
      case 'bar':
        renderBarChart(g, data, innerWidth, innerHeight, config, showAnimation);
        break;
      case 'line':
        renderLineChart(g, data, innerWidth, innerHeight, config, showAnimation);
        break;
      case 'area':
        renderAreaChart(g, data, innerWidth, innerHeight, config, showAnimation);
        break;
      case 'pie':
        renderPieChart(g, data, innerWidth, innerHeight, config, showAnimation);
        break;
      case 'radar':
        renderRadarChart(g, data, innerWidth, innerHeight, config, showAnimation);
        break;
      case 'sparkline':
        renderSparklineChart(g, data, innerWidth, innerHeight, config, showAnimation);
        break;
    }

    // Add interactive hover effects
    if (interactive) {
      g.selectAll('.data-point, .bar, .pie-slice')
        .on('mouseover', function(event, d) {
          if (showTooltip) {
            const [x, y] = d3.pointer(event, containerRef.current);
            setTooltip({
              visible: true,
              x: x + 10,
              y: y - 10,
              data: d as ChartDataPoint
            });
          }
          onDataPointHover?.(d as ChartDataPoint);
          
          // Add glow effect
          d3.select(this)
            .style('filter', `drop-shadow(0 0 8px ${config.glow})`);
        })
        .on('mouseout', function() {
          setTooltip({ visible: false, x: 0, y: 0, data: null });
          onDataPointHover?.(null);
          
          d3.select(this)
            .style('filter', 'none');
        })
        .on('click', function(event, d) {
          onDataPointClick?.(d as ChartDataPoint);
        });
    }

  }, [data, type, width, height, variant, showAnimation, interactive]);

  // Bar Chart Renderer
  const renderBarChart = (g: any, data: ChartDataPoint[], width: number, height: number, config: any, animate: boolean) => {
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height, 0]);

    // Add axes with mystic styling
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('fill', config.accent)
      .style('font-size', '12px');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('fill', config.accent)
      .style('font-size', '12px');

    // Create bars with animation
    const bars = g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: ChartDataPoint) => xScale(d.label) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', (d: ChartDataPoint) => d.color || config.primary)
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .style('opacity', 0.8);

    if (animate) {
      bars.transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .ease(d3.easeElastic.period(0.3))
        .attr('y', (d: ChartDataPoint) => yScale(d.value))
        .attr('height', (d: ChartDataPoint) => height - yScale(d.value));
    } else {
      bars
        .attr('y', (d: ChartDataPoint) => yScale(d.value))
        .attr('height', (d: ChartDataPoint) => height - yScale(d.value));
    }

    // Add data labels
    g.selectAll('.bar-label')
      .data(data)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', (d: ChartDataPoint) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d: ChartDataPoint) => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', config.accent)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text((d: ChartDataPoint) => d.value);
  };

  // Line Chart Renderer
  const renderLineChart = (g: any, data: ChartDataPoint[], width: number, height: number, config: any, animate: boolean) => {
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([height, 0]);

    const line = d3.line<ChartDataPoint>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Add gradient for line
    const lineGradient = g.append('defs').append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', 0).attr('y2', 0);

    lineGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', config.secondary);

    lineGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', config.primary);

    // Draw the line
    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .style('filter', `drop-shadow(0 0 6px ${config.glow})`)
      .attr('d', line);

    if (animate) {
      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    }

    // Add data points
    const points = g.selectAll('.data-point')
      .data(data)
      .enter().append('circle')
      .attr('class', 'data-point')
      .attr('cx', (d: ChartDataPoint, i: number) => xScale(i))
      .attr('cy', (d: ChartDataPoint) => yScale(d.value))
      .attr('r', 0)
      .attr('fill', config.primary)
      .style('cursor', 'pointer');

    if (animate) {
      points.transition()
        .duration(600)
        .delay((d, i) => i * 100 + 800)
        .ease(d3.easeBounce)
        .attr('r', 5);
    } else {
      points.attr('r', 5);
    }
  };

  // Area Chart Renderer
  const renderAreaChart = (g: any, data: ChartDataPoint[], width: number, height: number, config: any, animate: boolean) => {
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([height, 0]);

    const area = d3.area<ChartDataPoint>()
      .x((d, i) => xScale(i))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Create area gradient
    const areaGradient = g.append('defs').append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', config.primary)
      .attr('stop-opacity', 0.6);

    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', config.secondary)
      .attr('stop-opacity', 0.1);

    // Draw the area
    const areaPath = g.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient)')
      .attr('stroke', config.primary)
      .attr('stroke-width', 2)
      .style('filter', `drop-shadow(0 0 8px ${config.glow})`)
      .attr('d', area);

    if (animate) {
      areaPath
        .attr('transform', 'scaleY(0)')
        .transition()
        .duration(1000)
        .ease(d3.easeElastic.period(0.4))
        .attr('transform', 'scaleY(1)');
    }
  };

  // Pie Chart Renderer
  const renderPieChart = (g: any, data: ChartDataPoint[], width: number, height: number, config: any, animate: boolean) => {
    const radius = Math.min(width, height) / 2 - 20;
    const centerX = width / 2;
    const centerY = height / 2;

    const pie = d3.pie<ChartDataPoint>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
      .innerRadius(radius * 0.3)
      .outerRadius(radius);

    const arcData = pie(data);

    const slices = g.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .selectAll('.pie-slice')
      .data(arcData)
      .enter().append('path')
      .attr('class', 'pie-slice')
      .attr('fill', (d: any, i: number) => colorScale(d.data.id) as string)
      .style('cursor', 'pointer')
      .style('opacity', 0.9)
      .attr('stroke', config.accent)
      .attr('stroke-width', 2);

    if (animate) {
      slices
        .attr('d', d3.arc<d3.PieArcDatum<ChartDataPoint>>()
          .innerRadius(radius * 0.3)
          .outerRadius(0) as any)
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .ease(d3.easeElastic.period(0.3))
        .attr('d', arc as any);
    } else {
      slices.attr('d', arc as any);
    }

    // Add labels
    g.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .selectAll('.pie-label')
      .data(arcData)
      .enter().append('text')
      .attr('class', 'pie-label')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text((d: any) => d.data.value);
  };

  // Radar Chart Renderer
  const renderRadarChart = (g: any, data: ChartDataPoint[], width: number, height: number, config: any, animate: boolean) => {
    const radius = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;
    const levels = 5;

    const angleSlice = (Math.PI * 2) / data.length;
    const maxValue = d3.max(data, d => d.value) || 100;

    const radiusScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);

    // Draw grid circles
    for (let level = 1; level <= levels; level++) {
      g.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', (radius / levels) * level)
        .attr('fill', 'none')
        .attr('stroke', config.accent)
        .attr('stroke-opacity', 0.2)
        .attr('stroke-width', 1);
    }

    // Draw grid lines
    data.forEach((d, i) => {
      g.append('line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', centerX + Math.cos(angleSlice * i - Math.PI / 2) * radius)
        .attr('y2', centerY + Math.sin(angleSlice * i - Math.PI / 2) * radius)
        .attr('stroke', config.accent)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-width', 1);
    });

    // Create radar area
    const radarLine = d3.lineRadial<ChartDataPoint>()
      .angle((d, i) => angleSlice * i)
      .radius(d => radiusScale(d.value))
      .curve(d3.curveLinearClosed);

    const radarArea = g.append('path')
      .datum(data)
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', config.primary)
      .attr('fill-opacity', 0.3)
      .attr('stroke', config.primary)
      .attr('stroke-width', 3)
      .style('filter', `drop-shadow(0 0 8px ${config.glow})`)
      .attr('d', radarLine);

    if (animate) {
      radarArea
        .attr('transform', `translate(${centerX}, ${centerY}) scale(0)`)
        .transition()
        .duration(1000)
        .ease(d3.easeElastic.period(0.4))
        .attr('transform', `translate(${centerX}, ${centerY}) scale(1)`);
    }

    // Add data points
    g.selectAll('.radar-point')
      .data(data)
      .enter().append('circle')
      .attr('class', 'radar-point')
      .attr('cx', (d, i) => centerX + Math.cos(angleSlice * i - Math.PI / 2) * radiusScale(d.value))
      .attr('cy', (d, i) => centerY + Math.sin(angleSlice * i - Math.PI / 2) * radiusScale(d.value))
      .attr('r', 0)
      .attr('fill', config.accent)
      .style('cursor', 'pointer');

    if (animate) {
      g.selectAll('.radar-point')
        .transition()
        .duration(600)
        .delay((d, i) => i * 100 + 500)
        .ease(d3.easeBounce)
        .attr('r', 6);
    } else {
      g.selectAll('.radar-point').attr('r', 6);
    }
  };

  // Sparkline Chart Renderer
  const renderSparklineChart = (g: any, data: ChartDataPoint[], width: number, height: number, config: any, animate: boolean) => {
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([height, 0]);

    const line = d3.line<ChartDataPoint>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal);

    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', config.primary)
      .attr('stroke-width', 2)
      .style('filter', `drop-shadow(0 0 4px ${config.glow})`)
      .attr('d', line);

    if (animate) {
      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    }

    // Highlight last point
    g.append('circle')
      .attr('cx', xScale(data.length - 1))
      .attr('cy', yScale(data[data.length - 1].value))
      .attr('r', 4)
      .attr('fill', config.accent)
      .style('filter', `drop-shadow(0 0 6px ${config.glow})`);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Chart Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
          animate={{
            boxShadow: isHovered ? 
              [`0 0 15px ${config.glow}`, `0 0 25px ${config.glow}`, `0 0 15px ${config.glow}`] :
              `0 0 8px ${config.glow}`
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <ChartIcon className="w-5 h-5" style={{ color: config.primary }} />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
            {type} Chart
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {config.name} • {data.length} data points
          </p>
        </div>
        
        {/* Mystical indicator */}
        <motion.div
          className="ml-auto"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Eye className="w-5 h-5 text-purple-400 opacity-60" />
        </motion.div>
      </div>

      {/* Chart Container */}
      <motion.div
        className="relative bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
        animate={{
          boxShadow: isHovered ? 
            `0 8px 32px ${config.glow}` :
            `0 4px 16px ${config.glow}`
        }}
        transition={{ duration: 0.3 }}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="w-full h-full"
        />

        {/* Mystical overlay effects */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${config.glow} 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${config.glow} 0%, transparent 50%)`
          }}
        />
      </motion.div>

      {/* Legend */}
      <AnimatePresence>
        {showLegend && data.length > 0 && (
          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {data.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || colorScale(item.id) as string }}
                />
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip.visible && tooltip.data && (
          <motion.div
            className="absolute z-50 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg border border-white/20 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              boxShadow: `0 4px 12px ${config.glow}`
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-semibold">{tooltip.data.label}</div>
            <div className="text-gray-300">Value: {tooltip.data.value}</div>
            {tooltip.data.category && (
              <div className="text-gray-400">Category: {tooltip.data.category}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
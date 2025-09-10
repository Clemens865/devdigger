import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronDown, Activity, Database, AlertTriangle, CheckCircle } from 'lucide-react';

interface CrawlingDepthGaugeProps {
  currentDepth: number;
  maxDepth: number;
  totalPages?: number;
  processedPages?: number;
  status?: 'crawling' | 'processing' | 'completed' | 'error';
  layers?: Array<{
    depth: number;
    label: string;
    count: number;
    isActive?: boolean;
  }>;
  variant?: 'underground' | 'ocean' | 'space' | 'forest';
  showWaveEffect?: boolean;
  className?: string;
}

export const CrawlingDepthGauge: React.FC<CrawlingDepthGaugeProps> = ({
  currentDepth = 0,
  maxDepth = 10,
  totalPages = 0,
  processedPages = 0,
  status = 'crawling',
  layers = [],
  variant = 'underground',
  showWaveEffect = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  // Variant configurations with depth-based theming
  const variantConfig = {
    underground: {
      surface: '#8b7355',
      layers: ['#a0956b', '#8b7d5b', '#6b5b47', '#5d4e37', '#4a3728'],
      accent: '#d2691e',
      glow: 'rgba(210, 105, 30, 0.4)',
      particleColor: '#daa520',
      name: 'Underground Mining'
    },
    ocean: {
      surface: '#87ceeb',
      layers: ['#4682b4', '#4169e1', '#0000cd', '#00008b', '#191970'],
      accent: '#20b2aa',
      glow: 'rgba(32, 178, 170, 0.4)',
      particleColor: '#40e0d0',
      name: 'Ocean Depths'
    },
    space: {
      surface: '#483d8b',
      layers: ['#4b0082', '#2e0854', '#1a0033', '#0d001a', '#000000'],
      accent: '#8a2be2',
      glow: 'rgba(138, 43, 226, 0.4)',
      particleColor: '#da70d6',
      name: 'Cosmic Exploration'
    },
    forest: {
      surface: '#90ee90',
      layers: ['#228b22', '#006400', '#2d4a2d', '#1a3d1a', '#0d2818'],
      accent: '#32cd32',
      glow: 'rgba(50, 205, 50, 0.4)',
      particleColor: '#98fb98',
      name: 'Forest Canopy'
    }
  };

  const config = variantConfig[variant];
  const progress = maxDepth > 0 ? (currentDepth / maxDepth) * 100 : 0;

  // Status configuration
  const statusConfig = {
    crawling: {
      icon: Activity,
      color: '#3b82f6',
      label: 'Crawling',
      pulseColor: 'rgba(59, 130, 246, 0.3)'
    },
    processing: {
      icon: Database,
      color: '#8b5cf6',
      label: 'Processing',
      pulseColor: 'rgba(139, 92, 246, 0.3)'
    },
    completed: {
      icon: CheckCircle,
      color: '#10b981',
      label: 'Completed',
      pulseColor: 'rgba(16, 185, 129, 0.3)'
    },
    error: {
      icon: AlertTriangle,
      color: '#ef4444',
      label: 'Error',
      pulseColor: 'rgba(239, 68, 68, 0.3)'
    }
  };

  const currentStatus = statusConfig[status];

  // Generate default layers if none provided
  const displayLayers = layers.length > 0 ? layers : 
    Array.from({ length: Math.min(maxDepth, 5) }, (_, i) => ({
      depth: i + 1,
      label: `Layer ${i + 1}`,
      count: Math.floor(Math.random() * 50) + 10,
      isActive: i + 1 <= currentDepth
    }));

  // Canvas animation for depth visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      depth: number;
      alpha: number;
    }> = [];

    // Initialize particles for each layer
    for (let layer = 0; layer < 5; layer++) {
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: Math.random() * 300,
          y: (layer * 50) + 30 + Math.random() * 40,
          size: 1 + Math.random() * 2,
          speed: 0.5 + Math.random() * 1,
          depth: layer,
          alpha: 0.3 + Math.random() * 0.7
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, 300, 300);
      time += 0.016;

      // Draw layer backgrounds with depth gradient
      for (let i = 0; i < 5; i++) {
        const layerY = i * 50 + 20;
        const layerAlpha = i < currentDepth ? 0.6 : 0.2;
        
        const gradient = ctx.createLinearGradient(0, layerY, 0, layerY + 50);
        gradient.addColorStop(0, `${config.layers[i]}${Math.floor(layerAlpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${config.layers[i]}${Math.floor(layerAlpha * 0.5 * 255).toString(16).padStart(2, '0')}`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, layerY, 300, 50);
      }

      // Draw particles with layer-specific movement
      particles.forEach((particle, index) => {
        if (particle.depth < currentDepth) {
          // Active layer particles move dynamically
          particle.x += Math.sin(time + index * 0.1) * 0.5;
          particle.y += Math.cos(time * 0.7 + index * 0.1) * 0.3;
          
          // Wrap around edges
          if (particle.x < 0) particle.x = 300;
          if (particle.x > 300) particle.x = 0;
          
          const pulseAlpha = particle.alpha * (0.7 + 0.3 * Math.sin(time * 3 + index));
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `${config.particleColor}${Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
          
          // Add glow effect for active particles
          ctx.shadowColor = config.particleColor;
          ctx.shadowBlur = particle.size * 3;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw scanning wave effect
      if (showWaveEffect && status === 'crawling') {
        const waveY = (currentDepth * 50) + 20 + Math.sin(time * 4) * 10;
        const gradient = ctx.createLinearGradient(0, waveY - 5, 0, waveY + 5);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, config.accent);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, waveY - 2, 300, 4);
        
        // Add wave sparkles
        for (let x = 0; x < 300; x += 20) {
          const sparkleAlpha = 0.5 + 0.5 * Math.sin(time * 6 + x / 10);
          ctx.fillStyle = `${config.accent}${Math.floor(sparkleAlpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fillRect(x - 1, waveY - 1, 2, 2);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [currentDepth, maxDepth, status, showWaveEffect, config, variant]);

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
            animate={{
              boxShadow: isHovered ? 
                [`0 0 20px ${config.glow}`, `0 0 40px ${config.glow}`, `0 0 20px ${config.glow}`] :
                `0 0 10px ${config.glow}`
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Layers className="w-5 h-5" style={{ color: config.accent }} />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {config.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Depth {currentDepth} of {maxDepth} layers
            </p>
          </div>
        </div>
        
        {/* Status indicator */}
        <motion.div
          className="flex items-center gap-2 px-3 py-2 rounded-full border"
          style={{
            backgroundColor: `${currentStatus.color}15`,
            borderColor: `${currentStatus.color}30`,
            color: currentStatus.color
          }}
          animate={{
            backgroundColor: status === 'crawling' ? 
              [`${currentStatus.color}15`, `${currentStatus.color}25`, `${currentStatus.color}15`] :
              `${currentStatus.color}15`
          }}
          transition={{
            backgroundColor: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <motion.div
            animate={{
              rotate: status === 'crawling' ? 360 : 0
            }}
            transition={{
              duration: 2,
              repeat: status === 'crawling' ? Infinity : 0,
              ease: "linear"
            }}
          >
            <currentStatus.icon className="w-4 h-4" />
          </motion.div>
          <span className="text-sm font-medium">{currentStatus.label}</span>
        </motion.div>
      </div>

      {/* Main depth visualization */}
      <div 
        ref={gaugeRef}
        className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-inner"
        style={{ height: '300px' }}
      >
        {/* Canvas for dynamic effects */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Layer indicators */}
        <div className="absolute inset-0">
          {displayLayers.map((layer, index) => {
            const layerY = (index / Math.max(displayLayers.length - 1, 1)) * 260 + 20;
            const isActive = layer.depth <= currentDepth;
            const isCurrent = layer.depth === currentDepth;
            
            return (
              <motion.div
                key={layer.depth}
                className="absolute left-4 right-4 flex items-center justify-between cursor-pointer"
                style={{ top: `${layerY}px` }}
                onHoverStart={() => setActiveLayer(layer.depth)}
                onHoverEnd={() => setActiveLayer(null)}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  scale: isCurrent ? 1.05 : 1,
                  x: isCurrent && status === 'crawling' ? [0, 2, 0] : 0
                }}
                transition={{
                  x: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Depth marker */}
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-4 h-4 rounded-full border-2 ${
                      isActive ? 'border-white shadow-lg' : 'border-gray-400'
                    }`}
                    style={{
                      backgroundColor: isActive ? config.accent : 'transparent',
                      boxShadow: isCurrent ? `0 0 10px ${config.glow}` : 'none'
                    }}
                    animate={{
                      scale: isCurrent ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                      duration: 2,
                      repeat: isCurrent ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <div className="text-sm">
                    <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {layer.label}
                    </div>
                    {layer.count > 0 && (
                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {layer.count} pages
                      </div>
                    )}
                  </div>
                </div>

                {/* Layer progress indicator */}
                {activeLayer === layer.depth && (
                  <motion.div
                    className="flex items-center gap-2 text-xs text-white/90"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <ChevronDown className="w-3 h-3" />
                    <span>Layer {layer.depth}</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress indicator */}
        <motion.div
          className="absolute right-2 top-4 bottom-4 w-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden"
          style={{ opacity: 0.8 }}
        >
          <motion.div
            className="w-full rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${config.accent}, ${config.layers[Math.min(currentDepth - 1, config.layers.length - 1)]})`
            }}
            animate={{
              height: `${progress}%`
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </motion.div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="text-2xl font-bold" style={{ color: config.accent }}>
            {currentDepth}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Current Depth</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="text-2xl font-bold text-blue-500">
            {totalPages}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Pages</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="text-2xl font-bold text-green-500">
            {processedPages}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Processed</div>
        </div>
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {status === 'completed' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
              style={{
                backgroundColor: config.accent,
                boxShadow: `0 0 30px ${config.glow}`
              }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
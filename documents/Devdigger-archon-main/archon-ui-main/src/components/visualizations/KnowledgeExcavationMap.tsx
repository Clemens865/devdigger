import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Database, 
  FileText, 
  Code, 
  Globe, 
  Layers, 
  Zap, 
  Eye,
  Pickaxe,
  Gem,
  Mountain
} from 'lucide-react';

interface ExcavationNode {
  id: string;
  type: 'source' | 'document' | 'chunk' | 'code' | 'knowledge';
  label: string;
  value: number;
  x: number;
  y: number;
  depth: number;
  connections: string[];
  metadata?: {
    size?: number;
    quality?: number;
    relevance?: number;
    lastUpdated?: Date;
  };
}

interface KnowledgeExcavationMapProps {
  nodes: ExcavationNode[];
  width?: number;
  height?: number;
  showConnections?: boolean;
  showDepthLayers?: boolean;
  variant?: 'mining' | 'archaeological' | 'geological' | 'mystical';
  onNodeClick?: (node: ExcavationNode) => void;
  onNodeHover?: (node: ExcavationNode | null) => void;
  className?: string;
}

export const KnowledgeExcavationMap: React.FC<KnowledgeExcavationMapProps> = ({
  nodes = [],
  width = 800,
  height = 600,
  showConnections = true,
  showDepthLayers = true,
  variant = 'mining',
  onNodeClick,
  onNodeHover,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<ExcavationNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<ExcavationNode | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isExcavating, setIsExcavating] = useState(false);

  // Variant configurations
  const variantConfig = {
    mining: {
      background: 'linear-gradient(180deg, #8b7355 0%, #6b5b47 30%, #5d4e37 60%, #4a3728 100%)',
      layerColors: ['#a0956b', '#8b7d5b', '#6b5b47', '#5d4e37', '#4a3728'],
      nodeColors: {
        source: '#d2691e',
        document: '#daa520',
        chunk: '#b8860b',
        code: '#cd853f',
        knowledge: '#ffd700'
      },
      particleColor: '#daa520',
      toolColor: '#8b4513',
      name: 'Underground Mining'
    },
    archaeological: {
      background: 'linear-gradient(180deg, #deb887 0%, #cd853f 30%, #a0522d 60%, #8b4513 100%)',
      layerColors: ['#deb887', '#cd853f', '#a0522d', '#8b4513', '#654321'],
      nodeColors: {
        source: '#daa520',
        document: '#b8860b',
        chunk: '#cd853f',
        code: '#d2691e',
        knowledge: '#ffd700'
      },
      particleColor: '#daa520',
      toolColor: '#8b4513',
      name: 'Archaeological Dig'
    },
    geological: {
      background: 'linear-gradient(180deg, #708090 0%, #555555 30%, #2f4f4f 60%, #1c1c1c 100%)',
      layerColors: ['#708090', '#555555', '#2f4f4f', '#1c1c1c', '#000000'],
      nodeColors: {
        source: '#4682b4',
        document: '#5f9ea0',
        chunk: '#708090',
        code: '#87ceeb',
        knowledge: '#add8e6'
      },
      particleColor: '#87ceeb',
      toolColor: '#556b2f',
      name: 'Geological Survey'
    },
    mystical: {
      background: 'linear-gradient(180deg, #483d8b 0%, #2e0854 30%, #1a0033 60%, #0d001a 100%)',
      layerColors: ['#483d8b', '#2e0854', '#1a0033', '#0d001a', '#000000'],
      nodeColors: {
        source: '#9370db',
        document: '#8a2be2',
        chunk: '#9932cc',
        code: '#ba55d3',
        knowledge: '#dda0dd'
      },
      particleColor: '#da70d6',
      toolColor: '#9400d3',
      name: 'Mystical Excavation'
    }
  };

  const config = variantConfig[variant];

  // Node type configurations
  const nodeTypeConfig = {
    source: { icon: Globe, size: 12, glow: 3 },
    document: { icon: FileText, size: 10, glow: 2 },
    chunk: { icon: Database, size: 8, glow: 1 },
    code: { icon: Code, size: 9, glow: 2 },
    knowledge: { icon: Gem, size: 14, glow: 4 }
  };

  // Calculate depth layers
  const maxDepth = Math.max(...nodes.map(n => n.depth), 0);
  const depthLayers = Array.from({ length: maxDepth + 1 }, (_, i) => i);

  // Canvas animation for excavation effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Particle system for dust and debris
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;
    }> = [];

    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * -3 - 1,
        size: Math.random() * 3 + 1,
        life: 1,
        maxLife: Math.random() * 2 + 1,
        color: config.particleColor
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // Draw depth layers
      if (showDepthLayers) {
        depthLayers.forEach((depth, index) => {
          const layerY = (depth / maxDepth) * height;
          const layerHeight = height / (maxDepth + 1);
          
          const gradient = ctx.createLinearGradient(0, layerY, 0, layerY + layerHeight);
          gradient.addColorStop(0, `${config.layerColors[index % config.layerColors.length]}40`);
          gradient.addColorStop(1, `${config.layerColors[index % config.layerColors.length]}20`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, layerY, width, layerHeight);
          
          // Add layer separator
          ctx.strokeStyle = `${config.layerColors[index % config.layerColors.length]}60`;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(0, layerY);
          ctx.lineTo(width, layerY);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      // Draw connections between nodes
      if (showConnections) {
        nodes.forEach(node => {
          node.connections.forEach(connectionId => {
            const connectedNode = nodes.find(n => n.id === connectionId);
            if (connectedNode) {
              const pulse = 0.5 + 0.3 * Math.sin(time * 2);
              ctx.strokeStyle = `${config.nodeColors[node.type]}${Math.floor(pulse * 128).toString(16).padStart(2, '0')}`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(connectedNode.x, connectedNode.y);
              ctx.stroke();
            }
          });
        });
      }

      // Draw nodes with glowing effects
      nodes.forEach(node => {
        const nodeConfig = nodeTypeConfig[node.type];
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;
        
        // Glow effect
        const glowSize = nodeConfig.glow + (isHovered ? 2 : 0) + (isSelected ? 3 : 0);
        const glowAlpha = 0.3 + (isHovered ? 0.2 : 0) + Math.sin(time * 3) * 0.1;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeConfig.size + glowSize, 0, Math.PI * 2);
        ctx.fillStyle = `${config.nodeColors[node.type]}${Math.floor(glowAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Node body
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeConfig.size, 0, Math.PI * 2);
        ctx.fillStyle = config.nodeColors[node.type];
        ctx.fill();
        ctx.strokeStyle = '#ffffff60';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Value indicator
        if (node.value > 0) {
          const valueSize = Math.max(2, node.value / 10);
          ctx.beginPath();
          ctx.arc(node.x, node.y, valueSize, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff80';
          ctx.fill();
        }

        // Create particles around active nodes
        if ((isHovered || isSelected || isExcavating) && Math.random() > 0.7) {
          createParticle(
            node.x + (Math.random() - 0.5) * nodeConfig.size,
            node.y + (Math.random() - 0.5) * nodeConfig.size
          );
        }
      });

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.life -= 0.016 / particle.maxLife;
        
        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        
        const alpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }

      // Draw excavation tool cursor
      if (isExcavating && mousePosition.x > 0 && mousePosition.y > 0) {
        const toolAngle = time * 5;
        const toolSize = 20;
        
        ctx.save();
        ctx.translate(mousePosition.x, mousePosition.y);
        ctx.rotate(toolAngle);
        
        // Tool handle
        ctx.strokeStyle = config.toolColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -toolSize);
        ctx.stroke();
        
        // Tool head
        ctx.beginPath();
        ctx.moveTo(-5, -toolSize);
        ctx.lineTo(5, -toolSize);
        ctx.lineTo(0, -toolSize - 8);
        ctx.closePath();
        ctx.fillStyle = config.toolColor;
        ctx.fill();
        
        ctx.restore();
        
        // Sparks
        if (Math.random() > 0.8) {
          createParticle(mousePosition.x, mousePosition.y);
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
  }, [nodes, hoveredNode, selectedNode, isExcavating, mousePosition, showConnections, showDepthLayers, config, maxDepth, depthLayers, width, height]);

  // Handle mouse events
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePosition({ x, y });

    // Find hovered node
    const hoveredNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance <= nodeTypeConfig[node.type].size + 5;
    });

    if (hoveredNode !== hoveredNode) {
      setHoveredNode(hoveredNode || null);
      onNodeHover?.(hoveredNode || null);
    }
  };

  const handleMouseClick = (event: React.MouseEvent) => {
    if (hoveredNode) {
      setSelectedNode(hoveredNode);
      onNodeClick?.(hoveredNode);
      
      // Trigger excavation animation
      setIsExcavating(true);
      setTimeout(() => setIsExcavating(false), 2000);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{
        width,
        height,
        background: config.background
      }}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          className="flex items-center gap-3 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20"
          animate={{
            boxShadow: isExcavating ? 
              ['0 0 10px rgba(255,215,0,0.3)', '0 0 20px rgba(255,215,0,0.6)', '0 0 10px rgba(255,215,0,0.3)'] :
              '0 0 10px rgba(0,0,0,0.3)'
          }}
          transition={{
            boxShadow: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <motion.div
            animate={{
              rotate: isExcavating ? 360 : 0
            }}
            transition={{
              duration: 2,
              repeat: isExcavating ? Infinity : 0,
              ease: "linear"
            }}
          >
            <Pickaxe className="w-5 h-5 text-amber-400" />
          </motion.div>
          <div>
            <h3 className="text-white font-semibold">{config.name}</h3>
            <p className="text-white/70 text-sm">{nodes.length} nodes excavated</p>
          </div>
        </motion.div>
      </div>

      {/* Depth indicator */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div
          className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20"
          animate={{
            y: [0, -2, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-white text-sm">Depth: {maxDepth} layers</span>
        </motion.div>
      </div>

      {/* Canvas for visualization */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-crosshair"
      />

      {/* Node tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            className="absolute z-20 px-3 py-2 bg-black/80 backdrop-blur-sm text-white text-sm rounded-lg border border-white/20 pointer-events-none"
            style={{
              left: hoveredNode.x + 15,
              top: hoveredNode.y - 40
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-semibold capitalize">{hoveredNode.type}</div>
            <div className="text-gray-300">{hoveredNode.label}</div>
            <div className="text-gray-400">Value: {hoveredNode.value}</div>
            <div className="text-gray-400">Depth: {hoveredNode.depth}</div>
            {hoveredNode.metadata?.quality && (
              <div className="text-amber-400">Quality: {(hoveredNode.metadata.quality * 100).toFixed(0)}%</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <motion.div
          className="flex gap-4 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {Object.entries(nodeTypeConfig).map(([type, typeConfig]) => {
            const Icon = typeConfig.icon;
            return (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: config.nodeColors[type as keyof typeof config.nodeColors] }}
                />
                <span className="text-white/70 text-xs capitalize">{type}</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Stats panel */}
      <div className="absolute bottom-4 right-4 z-10">
        <motion.div
          className="grid grid-cols-2 gap-2 p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">
              {nodes.filter(n => n.type === 'knowledge').length}
            </div>
            <div className="text-xs text-white/70">Knowledge</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {nodes.reduce((sum, n) => sum + n.value, 0)}
            </div>
            <div className="text-xs text-white/70">Total Value</div>
          </div>
        </motion.div>
      </div>

      {/* Excavation progress indicator */}
      <AnimatePresence>
        {isExcavating && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex items-center gap-3 px-6 py-3 bg-amber-900/80 backdrop-blur-sm rounded-lg border border-amber-500/50"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 20px rgba(255,191,0,0.5)',
                  '0 0 30px rgba(255,191,0,0.8)',
                  '0 0 20px rgba(255,191,0,0.5)'
                ]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-6 h-6 text-amber-300" />
              </motion.div>
              <div>
                <div className="text-amber-100 font-semibold">Excavating Knowledge...</div>
                <div className="text-amber-300 text-sm">Extracting valuable insights</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
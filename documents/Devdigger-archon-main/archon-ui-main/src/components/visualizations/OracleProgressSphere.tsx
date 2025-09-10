import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, Zap } from 'lucide-react';

interface OracleProgressSphereProps {
  progress: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'crystal' | 'energy' | 'mystic' | 'void';
  isActive?: boolean;
  className?: string;
  showEnergyRings?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
}

export const OracleProgressSphere: React.FC<OracleProgressSphereProps> = ({
  progress = 0,
  label,
  size = 'md',
  variant = 'crystal',
  isActive = false,
  className = '',
  showEnergyRings = true,
  glowIntensity = 'medium'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Size configurations
  const sizeConfig = {
    sm: { size: 80, strokeWidth: 3, fontSize: 'text-xs' },
    md: { size: 120, strokeWidth: 4, fontSize: 'text-sm' },
    lg: { size: 160, strokeWidth: 5, fontSize: 'text-base' },
    xl: { size: 200, strokeWidth: 6, fontSize: 'text-lg' }
  };

  const config = sizeConfig[size];
  const radius = config.size / 2 - config.strokeWidth;
  
  // Variant color schemes
  const variantConfig = {
    crystal: {
      primary: '#60a5fa', // blue-400
      secondary: '#3b82f6', // blue-500
      accent: '#1d4ed8', // blue-700
      glow: 'rgba(96, 165, 250, 0.6)',
      particles: '#ddd6fe' // violet-200
    },
    energy: {
      primary: '#34d399', // emerald-400
      secondary: '#10b981', // emerald-500
      accent: '#047857', // emerald-700
      glow: 'rgba(52, 211, 153, 0.6)',
      particles: '#fde68a' // yellow-200
    },
    mystic: {
      primary: '#a855f7', // purple-500
      secondary: '#9333ea', // purple-600
      accent: '#7c3aed', // violet-600
      glow: 'rgba(168, 85, 247, 0.6)',
      particles: '#fbbf24' // amber-400
    },
    void: {
      primary: '#6b7280', // gray-500
      secondary: '#4b5563', // gray-600
      accent: '#374151', // gray-700
      glow: 'rgba(107, 114, 128, 0.6)',
      particles: '#d1d5db' // gray-300
    }
  };

  const colors = variantConfig[variant];

  // Canvas animation for mystical effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = config.size / 2;
    const centerY = config.size / 2;
    let animationId: number;
    let time = 0;

    const particles: Array<{
      angle: number;
      radius: number;
      size: number;
      alpha: number;
      speed: number;
    }> = [];

    // Initialize floating particles
    for (let i = 0; i < 12; i++) {
      particles.push({
        angle: (i / 12) * Math.PI * 2,
        radius: radius * 0.7 + Math.random() * radius * 0.3,
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7,
        speed: 0.005 + Math.random() * 0.01
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, config.size, config.size);
      time += 0.016;

      // Draw energy rings
      if (showEnergyRings && isActive) {
        for (let i = 0; i < 3; i++) {
          const ringRadius = radius * 0.8 + Math.sin(time * 2 + i) * 10;
          const alpha = 0.1 + Math.sin(time + i) * 0.05;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `${colors.glow.slice(0, -4)}${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw mystical particles
      particles.forEach((particle, index) => {
        particle.angle += particle.speed;
        const x = centerX + Math.cos(particle.angle) * particle.radius;
        const y = centerY + Math.sin(particle.angle) * particle.radius;
        
        const pulseAlpha = particle.alpha * (0.7 + 0.3 * Math.sin(time * 3 + index));
        
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.particles}${Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Add small glow
        ctx.shadowColor = colors.particles;
        ctx.shadowBlur = particle.size * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw progress arc with energy effect
      const progressAngle = (progress / 100) * Math.PI * 2 - Math.PI / 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, progressAngle);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = config.strokeWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Add energy pulse at progress end
      if (progress > 0 && isActive) {
        const endX = centerX + Math.cos(progressAngle) * radius;
        const endY = centerY + Math.sin(progressAngle) * radius;
        
        const pulseSize = 3 + Math.sin(time * 4) * 2;
        ctx.beginPath();
        ctx.arc(endX, endY, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = colors.accent;
        ctx.fill();
        
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [progress, isActive, showEnergyRings, variant, config.size, config.strokeWidth]);

  const glowStyles = {
    low: 'shadow-lg',
    medium: 'shadow-xl shadow-blue-500/25',
    high: 'shadow-2xl shadow-blue-500/40'
  };

  return (
    <motion.div
      className={`relative inline-flex flex-col items-center ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Main sphere container */}
      <motion.div
        className={`relative ${glowStyles[glowIntensity]}`}
        animate={{
          scale: isHovered ? 1.05 : 1,
          rotate: isActive ? 360 : 0
        }}
        transition={{
          scale: { duration: 0.3 },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      >
        {/* Background sphere */}
        <div
          className="rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
          style={{
            width: config.size,
            height: config.size,
            background: `conic-gradient(from 0deg, ${colors.glow}, transparent 70%, ${colors.glow})`
          }}
        />
        
        {/* Canvas for mystical effects */}
        <canvas
          ref={canvasRef}
          width={config.size}
          height={config.size}
          className="absolute inset-0 pointer-events-none"
        />
        
        {/* Progress text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className={`font-bold ${config.fontSize} text-white drop-shadow-lg`}
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
              textShadow: isActive ? 
                ['0 0 5px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.8)', '0 0 5px rgba(255,255,255,0.5)'] :
                '0 0 5px rgba(255,255,255,0.5)'
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {Math.round(progress)}%
          </motion.div>
          
          {/* Mystical eye indicator for active state */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-6"
              >
                <Eye className="w-4 h-4 text-white/80" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Energy sparks for high progress */}
        <AnimatePresence>
          {progress > 80 && isActive && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 60}deg) translateY(-${radius + 15}px)`
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Label */}
      {label && (
        <motion.div
          className={`mt-3 text-center ${config.fontSize} font-medium text-gray-700 dark:text-gray-300`}
          animate={{
            opacity: isHovered ? 1 : 0.8,
            y: isHovered ? -2 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.div>
      )}
      
      {/* Completion celebration */}
      <AnimatePresence>
        {progress >= 100 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
              </motion.div>
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
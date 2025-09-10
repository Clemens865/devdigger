import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlassmorphismContainerProps {
  children: ReactNode;
  variant?: 'subtle' | 'medium' | 'strong' | 'ethereal';
  glowColor?: string;
  animated?: boolean;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface GlassParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
}

export const GlassmorphismContainer: React.FC<GlassmorphismContainerProps> = ({
  children,
  variant = 'medium',
  glowColor = '#60a5fa',
  animated = true,
  interactive = true,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<GlassParticle[]>([]);

  // Variant configurations
  const variantConfig = {
    subtle: {
      backdrop: 'backdrop-blur-sm',
      background: 'bg-white/5',
      border: 'border-white/10',
      shadow: 'shadow-lg',
      glowIntensity: 0.1,
      particleCount: 3
    },
    medium: {
      backdrop: 'backdrop-blur-md',
      background: 'bg-white/10',
      border: 'border-white/20',
      shadow: 'shadow-xl',
      glowIntensity: 0.2,
      particleCount: 6
    },
    strong: {
      backdrop: 'backdrop-blur-lg',
      background: 'bg-white/15',
      border: 'border-white/30',
      shadow: 'shadow-2xl',
      glowIntensity: 0.3,
      particleCount: 9
    },
    ethereal: {
      backdrop: 'backdrop-blur-xl',
      background: 'bg-gradient-to-br from-white/20 to-white/5',
      border: 'border-white/40',
      shadow: 'shadow-2xl',
      glowIntensity: 0.4,
      particleCount: 12
    }
  };

  const config = variantConfig[variant];

  // Initialize particles
  useEffect(() => {
    const newParticles: GlassParticle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      newParticles.push({
        x: Math.random() * 400,
        y: Math.random() * 300,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2
      });
    }
    setParticles(newParticles);
  }, [config.particleCount]);

  // Canvas animation for floating particles
  useEffect(() => {
    if (!animated) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Draw floating glass particles
      particles.forEach((particle, index) => {
        // Update particle position
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.angle = Math.PI - particle.angle;
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.angle = -particle.angle;
        }

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle with glow effect
        const glowAlpha = particle.opacity * (0.8 + 0.2 * Math.sin(time * 2 + index));
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${glowColor}${Math.floor(glowAlpha * 0.1 * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Inner particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${glowAlpha})`;
        ctx.fill();

        // Add subtle sparkle effect
        if (Math.random() > 0.98) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${glowAlpha * 2})`;
          ctx.fill();
        }
      });

      // Mouse interaction effect
      if (interactive && isHovered && mousePosition.x > 0 && mousePosition.y > 0) {
        const rippleRadius = 30 + Math.sin(time * 4) * 10;
        const rippleAlpha = 0.1 * (1 - (rippleRadius - 30) / 20);
        
        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${glowColor}${Math.floor(rippleAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [particles, animated, glowColor, interactive, isHovered, mousePosition]);

  // Handle mouse events
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Dynamic glow effect based on hover
  const glowStyle = interactive && isHovered ? {
    boxShadow: [
      `0 0 20px ${glowColor}${Math.floor(config.glowIntensity * 255).toString(16).padStart(2, '0')}`,
      `0 0 40px ${glowColor}${Math.floor(config.glowIntensity * 0.5 * 255).toString(16).padStart(2, '0')}`,
      `0 0 60px ${glowColor}${Math.floor(config.glowIntensity * 0.2 * 255).toString(16).padStart(2, '0')}`
    ].join(', ')
  } : {
    boxShadow: `0 0 10px ${glowColor}${Math.floor(config.glowIntensity * 0.5 * 255).toString(16).padStart(2, '0')}`
  };

  return (
    <motion.div
      ref={containerRef}
      className={`
        relative overflow-hidden rounded-xl
        ${config.backdrop}
        ${config.background}
        ${config.border}
        ${config.shadow}
        border
        transition-all duration-300 ease-out
        ${className}
      `}
      style={{
        ...style,
        ...glowStyle
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: interactive && isHovered ? 1.01 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Animated canvas background */}
      {animated && (
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        />
      )}

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, ${glowColor}20 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${glowColor}15 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)
          `
        }}
      />

      {/* Mystical border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `linear-gradient(45deg, 
            transparent, 
            ${glowColor}10, 
            transparent, 
            ${glowColor}10, 
            transparent
          )`,
          backgroundSize: '20px 20px',
        }}
        animate={{
          backgroundPosition: interactive && isHovered ? ['0px 0px', '20px 20px'] : '0px 0px'
        }}
        transition={{
          duration: 2,
          repeat: interactive && isHovered ? Infinity : 0,
          ease: "linear"
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Interactive ripple effects */}
      {interactive && isHovered && mousePosition.x > 0 && (
        <motion.div
          className="absolute rounded-full border-2 pointer-events-none"
          style={{
            left: mousePosition.x - 25,
            top: mousePosition.y - 25,
            width: 50,
            height: 50,
            borderColor: `${glowColor}40`
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.6, 0.2, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Corner accent highlights */}
      <div className="absolute top-0 left-0 w-8 h-8 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-4 -left-4 w-8 h-8 rotate-45"
          style={{
            background: `linear-gradient(135deg, ${glowColor}30, transparent)`
          }}
        />
      </div>
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-4 -right-4 w-8 h-8 rotate-45"
          style={{
            background: `linear-gradient(225deg, ${glowColor}30, transparent)`
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-8 overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-4 -left-4 w-8 h-8 rotate-45"
          style={{
            background: `linear-gradient(45deg, ${glowColor}30, transparent)`
          }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-4 -right-4 w-8 h-8 rotate-45"
          style={{
            background: `linear-gradient(315deg, ${glowColor}30, transparent)`
          }}
        />
      </div>
    </motion.div>
  );
};
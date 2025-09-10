import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, Feather, BookOpen, Sparkles2 } from 'lucide-react';

interface MysticScrollProgressProps {
  progress: number;
  steps?: string[];
  currentStep?: number;
  label?: string;
  variant?: 'ancient' | 'parchment' | 'stone' | 'ethereal';
  isUnrolling?: boolean;
  showQuill?: boolean;
  className?: string;
}

interface RuneSymbol {
  x: number;
  y: number;
  opacity: number;
  char: string;
  size: number;
}

export const MysticScrollProgress: React.FC<MysticScrollProgressProps> = ({
  progress = 0,
  steps = [],
  currentStep = 0,
  label,
  variant = 'ancient',
  isUnrolling = false,
  showQuill = true,
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [runeSymbols, setRuneSymbols] = useState<RuneSymbol[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Mystical rune characters
  const runeChars = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛇ'];

  // Variant configurations
  const variantConfig = {
    ancient: {
      background: 'linear-gradient(145deg, #f7f3e8 0%, #e8dcc0 50%, #d4c5a0 100%)',
      border: '#8b7355',
      text: '#5d4e37',
      accent: '#8b4513',
      glow: 'rgba(139, 69, 19, 0.3)',
      paper: '#faf7f0'
    },
    parchment: {
      background: 'linear-gradient(145deg, #f4f1e8 0%, #ede6d3 50%, #e2d5bb 100%)',
      border: '#a0956b',
      text: '#6b5b47',
      accent: '#8b7d5b',
      glow: 'rgba(139, 125, 91, 0.3)',
      paper: '#f8f4e6'
    },
    stone: {
      background: 'linear-gradient(145deg, #e5e7eb 0%, #d1d5db 50%, #9ca3af 100%)',
      border: '#6b7280',
      text: '#374151',
      accent: '#4b5563',
      glow: 'rgba(75, 85, 99, 0.3)',
      paper: '#f3f4f6'
    },
    ethereal: {
      background: 'linear-gradient(145deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
      border: '#a855f7',
      text: '#581c87',
      accent: '#7c3aed',
      glow: 'rgba(124, 58, 237, 0.3)',
      paper: '#fdfbff'
    }
  };

  const config = variantConfig[variant];

  // Initialize floating runes
  useEffect(() => {
    const symbols: RuneSymbol[] = [];
    for (let i = 0; i < 8; i++) {
      symbols.push({
        x: Math.random() * 400,
        y: Math.random() * 200,
        opacity: 0.1 + Math.random() * 0.3,
        char: runeChars[Math.floor(Math.random() * runeChars.length)],
        size: 12 + Math.random() * 8
      });
    }
    setRuneSymbols(symbols);
  }, []);

  // Canvas animation for mystical effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, 400, 200);
      time += 0.016;

      // Draw floating runes with gentle movement
      runeSymbols.forEach((symbol, index) => {
        const floatX = symbol.x + Math.sin(time + index) * 2;
        const floatY = symbol.y + Math.cos(time * 0.7 + index) * 1.5;
        const alpha = symbol.opacity * (0.7 + 0.3 * Math.sin(time * 2 + index));

        ctx.font = `${symbol.size}px serif`;
        ctx.fillStyle = `${config.accent}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.textAlign = 'center';
        ctx.fillText(symbol.char, floatX, floatY);
      });

      // Draw mystical energy lines
      if (progress > 0) {
        const progressWidth = (progress / 100) * 350;
        
        ctx.beginPath();
        ctx.moveTo(25, 100);
        for (let x = 25; x < 25 + progressWidth; x += 5) {
          const waveOffset = Math.sin((x / 50) + time * 3) * 2;
          ctx.lineTo(x, 100 + waveOffset);
        }
        
        ctx.strokeStyle = `${config.accent}80`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add sparkles along the progress line
        for (let i = 0; i < Math.floor(progressWidth / 30); i++) {
          const sparkleX = 25 + (i * 30) + Math.sin(time * 4 + i) * 5;
          const sparkleY = 100 + Math.cos(time * 3 + i) * 3;
          const sparkleAlpha = 0.5 + 0.5 * Math.sin(time * 5 + i);
          
          ctx.fillStyle = `${config.accent}${Math.floor(sparkleAlpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fillRect(sparkleX - 1, sparkleY - 1, 2, 2);
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
  }, [progress, runeSymbols, config.accent]);

  const scrollWidth = Math.max(300, (progress / 100) * 400);

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Scroll container */}
      <div className="relative flex items-center justify-center">
        {/* Left scroll rod */}
        <motion.div
          className="w-4 rounded-full shadow-lg z-10"
          style={{
            height: '120px',
            background: `linear-gradient(90deg, ${config.border}, #8b7355, ${config.border})`,
            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.2), 0 0 8px ${config.glow}`
          }}
          animate={{
            rotateZ: isUnrolling ? 360 : 0
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: isUnrolling ? Infinity : 0
          }}
        />

        {/* Main scroll parchment */}
        <motion.div
          ref={scrollRef}
          className="relative mx-2 rounded-lg shadow-xl overflow-hidden"
          style={{
            width: `${scrollWidth}px`,
            height: '100px',
            background: config.background,
            border: `2px solid ${config.border}`,
            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 12px ${config.glow}`
          }}
          animate={{
            width: `${scrollWidth}px`,
            scaleX: isHovered ? 1.02 : 1
          }}
          transition={{
            width: { duration: 1, ease: "easeOut" },
            scaleX: { duration: 0.3 }
          }}
        >
          {/* Parchment texture overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${config.paper} 0%, transparent 50%),
                          radial-gradient(circle at 80% 70%, ${config.paper} 0%, transparent 50%),
                          linear-gradient(45deg, transparent 40%, ${config.paper} 50%, transparent 60%)`
            }}
          />

          {/* Canvas for mystical effects */}
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: 'scale(1, 0.5)' }}
          />

          {/* Progress content */}
          <div className="relative h-full flex items-center justify-between px-4">
            {/* Progress text */}
            <div className="flex flex-col items-start">
              {label && (
                <motion.div
                  className="text-sm font-semibold mb-1"
                  style={{ color: config.text }}
                  animate={{
                    opacity: isHovered ? 1 : 0.8
                  }}
                >
                  {label}
                </motion.div>
              )}
              
              <motion.div
                className="text-2xl font-bold"
                style={{ color: config.accent }}
                animate={{
                  scale: progress >= 100 ? [1, 1.1, 1] : 1,
                  textShadow: progress >= 100 ? 
                    ['0 0 5px rgba(0,0,0,0.3)', '0 0 10px rgba(0,0,0,0.5)', '0 0 5px rgba(0,0,0,0.3)'] :
                    '0 0 5px rgba(0,0,0,0.3)'
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {Math.round(progress)}%
              </motion.div>
            </div>

            {/* Step indicators */}
            {steps.length > 0 && (
              <div className="flex flex-col items-end space-y-1">
                {steps.slice(0, 3).map((step, index) => (
                  <motion.div
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      index <= currentStep 
                        ? `bg-opacity-20 border-opacity-60`
                        : 'bg-opacity-10 border-opacity-30'
                    }`}
                    style={{
                      backgroundColor: config.accent + (index <= currentStep ? '33' : '1a'),
                      borderColor: config.accent + (index <= currentStep ? '99' : '4d'),
                      color: config.text
                    }}
                    animate={{
                      scale: index === currentStep ? [1, 1.05, 1] : 1,
                      opacity: index <= currentStep ? 1 : 0.6
                    }}
                    transition={{
                      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {step.substring(0, 12)}...
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Completion sparkles */}
          <AnimatePresence>
            {progress >= 100 && (
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
                      left: `${20 + (i * 60 / 5)}%`,
                      top: `${30 + Math.sin(i) * 40}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <Sparkles2 className="w-4 h-4" style={{ color: config.accent }} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right scroll rod */}
        <motion.div
          className="w-4 rounded-full shadow-lg z-10"
          style={{
            height: '120px',
            background: `linear-gradient(90deg, ${config.border}, #8b7355, ${config.border})`,
            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.2), 0 0 8px ${config.glow}`
          }}
          animate={{
            rotateZ: isUnrolling ? -360 : 0
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: isUnrolling ? Infinity : 0
          }}
        />

        {/* Mystical quill */}
        <AnimatePresence>
          {showQuill && progress > 0 && progress < 100 && (
            <motion.div
              className="absolute right-16 top-1/2"
              initial={{ opacity: 0, x: 20, rotate: -30 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                rotate: [-30, -25, -30],
                y: [-2, 2, -2]
              }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                opacity: { duration: 0.5 },
                x: { duration: 0.5 },
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Feather className="w-8 h-8 text-amber-600 drop-shadow-lg" />
              
              {/* Ink drops */}
              <motion.div
                className="absolute -bottom-2 left-6 w-1 h-1 rounded-full bg-purple-900"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion seal */}
        <AnimatePresence>
          {progress >= 100 && (
            <motion.div
              className="absolute right-8 top-1/2 transform -translate-y-1/2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div 
                className="w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: config.accent,
                  borderColor: config.border,
                  boxShadow: `0 0 15px ${config.glow}`
                }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
import React from 'react';
import { IconProps } from './types';

// Geometric Loading Spinners - Minimalist & Sophisticated

// Classic Circular Spinner
export const CircularSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner circular ${className}`}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="31.416"
      strokeDashoffset="31.416"
      style={{
        animation: 'spin 2s linear infinite, dash 1.5s ease-in-out infinite'
      }}
    />
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes dash {
        0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
        50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
        100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
      }
    `}</style>
  </svg>
);

// Dots Orbital Spinner
export const DotsSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <div
    className={`loading-spinner-dots ${className}`}
    style={{ width: size, height: size }}
    {...props}
  >
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        style={{
          backgroundColor: color,
          animationDelay: `${-0.1 * i}s`
        }}
      />
    ))}
  </div>
);

// Triangular Spinner
export const TriangleSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner triangle ${className}`}
    {...props}
  >
    <polygon
      points="12,2 22,20 2,20"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      style={{
        animation: 'triangle-spin 2s linear infinite'
      }}
    />
    <style jsx>{`
      @keyframes triangle-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </svg>
);

// Square Pulse Spinner
export const SquareSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner square ${className}`}
    {...props}
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      fill="none"
      stroke={color}
      strokeWidth="2"
      rx="2"
      style={{
        animation: 'square-pulse 1.5s ease-in-out infinite'
      }}
    />
    <style jsx>{`
      @keyframes square-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.8); opacity: 0.6; }
      }
    `}</style>
  </svg>
);

// Hexagon Spinner
export const HexagonSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner hexagon ${className}`}
    {...props}
  >
    <polygon
      points="12,2 20.5,7 20.5,17 12,22 3.5,17 3.5,7"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      style={{
        animation: 'hexagon-rotate 2s linear infinite'
      }}
    />
    <style jsx>{`
      @keyframes hexagon-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </svg>
);

// Wave Spinner
export const WaveSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner wave ${className}`}
    {...props}
  >
    {[2, 6, 10, 14, 18, 22].map((x, i) => (
      <line
        key={i}
        x1={x}
        y1="4"
        x2={x}
        y2="20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          animation: `wave-animation 1.4s ease-in-out infinite`,
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
    <style jsx>{`
      @keyframes wave-animation {
        0%, 40%, 100% { transform: scaleY(0.4); }
        20% { transform: scaleY(1); }
      }
    `}</style>
  </svg>
);

// DNA Helix Spinner
export const HelixSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner helix ${className}`}
    {...props}
  >
    <path
      d="M2 12c0-5.5 4.5-10 10-10s10 4.5 10 10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      style={{
        animation: 'helix-rotate 1.5s linear infinite'
      }}
    />
    <path
      d="M22 12c0 5.5-4.5 10-10 10s-10-4.5-10-10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      style={{
        animation: 'helix-rotate-reverse 1.5s linear infinite'
      }}
    />
    <style jsx>{`
      @keyframes helix-rotate {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }
      @keyframes helix-rotate-reverse {
        0% { transform: rotateY(360deg); }
        100% { transform: rotateY(0deg); }
      }
    `}</style>
  </svg>
);

// Grid Spinner
export const GridSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner grid ${className}`}
    {...props}
  >
    {[0, 1, 2].map(row => 
      [0, 1, 2].map(col => (
        <rect
          key={`${row}-${col}`}
          x={4 + col * 6}
          y={4 + row * 6}
          width="4"
          height="4"
          fill={color}
          rx="1"
          style={{
            animation: 'grid-fade 1.5s ease-in-out infinite',
            animationDelay: `${(row + col) * 0.1}s`
          }}
        />
      ))
    )}
    <style jsx>{`
      @keyframes grid-fade {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(0.8); }
      }
    `}</style>
  </svg>
);

// Atom Spinner
export const AtomSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner atom ${className}`}
    {...props}
  >
    <circle cx="12" cy="12" r="2" fill={color} />
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.4"
      style={{
        animation: 'atom-orbit-1 2s linear infinite'
      }}
    />
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.4"
      style={{
        animation: 'atom-orbit-2 2s linear infinite'
      }}
    />
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.4"
      style={{
        animation: 'atom-orbit-3 2s linear infinite'
      }}
    />
    <style jsx>{`
      @keyframes atom-orbit-1 {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes atom-orbit-2 {
        0% { transform: rotate(120deg); }
        100% { transform: rotate(480deg); }
      }
      @keyframes atom-orbit-3 {
        0% { transform: rotate(240deg); }
        100% { transform: rotate(600deg); }
      }
    `}</style>
  </svg>
);

// Morph Spinner - Shape changing
export const MorphSpinner: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`loading-spinner morph ${className}`}
    {...props}
  >
    <path
      d="M12,4 L20,12 L12,20 L4,12 Z"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      style={{
        animation: 'morph-shape 3s ease-in-out infinite'
      }}
    />
    <style jsx>{`
      @keyframes morph-shape {
        0% { d: path("M12,4 L20,12 L12,20 L4,12 Z"); }
        25% { d: path("M12,2 L22,12 L12,22 L2,12 Z"); }
        50% { d: path("M4,4 L20,4 L20,20 L4,20 Z"); }
        75% { d: path("M12,2 L22,12 L12,22 L2,12 Z"); }
        100% { d: path("M12,4 L20,12 L12,20 L4,12 Z"); }
      }
    `}</style>
  </svg>
);

// Progress Ring Spinner
export const ProgressRingSpinner: React.FC<IconProps & { progress?: number }> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  progress = 0,
  ...props
}) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`loading-spinner progress-ring ${className}`}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.2"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          transition: 'stroke-dashoffset 0.3s ease'
        }}
      />
    </svg>
  );
};

// Export all spinners
export const LoadingSpinners = {
  CircularSpinner,
  DotsSpinner,
  TriangleSpinner,
  SquareSpinner,
  HexagonSpinner,
  WaveSpinner,
  HelixSpinner,
  GridSpinner,
  AtomSpinner,
  MorphSpinner,
  ProgressRingSpinner
};

// Default export
export default LoadingSpinners;
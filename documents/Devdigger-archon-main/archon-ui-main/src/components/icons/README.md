# DevDigger Icon System

A sophisticated icon library that perfectly balances mystical oracle themes with modern, professional design. Built for the DevDigger application with React, TypeScript, and advanced animation support.

## 🌟 Key Features

- **Mystical Oracle Theme**: Carefully crafted icons inspired by sacred geometry and divine symbolism
- **Multiple Style Variants**: Outline, filled, duotone, and gradient styles
- **Responsive Sizing**: Five size variants (xs, sm, md, lg, xl) with optical adjustments
- **Advanced Animations**: Framer Motion-powered micro-interactions and mystical effects
- **Dark/Light Theme Support**: Seamless integration with DevDigger's theme system
- **TypeScript Support**: Fully typed components with excellent developer experience
- **Performance Optimized**: Lazy loading, context-based configuration, and performance monitoring
- **Accessibility First**: ARIA attributes, reduced motion support, and semantic markup

## 🎨 Design Philosophy

The DevDigger icon system follows these core principles:

1. **Sacred Geometry**: Icons incorporate mystical symbols and geometric patterns
2. **Minimalist Elegance**: Clean, sophisticated designs that scale beautifully
3. **Contextual Meaning**: Each icon tells a story relevant to digital archaeology
4. **Consistent Language**: Unified visual vocabulary across all components
5. **Interactive Delight**: Subtle animations enhance user engagement

## 📦 Installation & Setup

### Basic Integration

```tsx
// Import the icon provider and CSS
import { IconProvider } from '@/components/icons/icon-provider';
import '@/components/icons/icon-theme.css';

// Wrap your app
function App() {
  return (
    <IconProvider config={{ enableAnimations: true, theme: 'auto' }}>
      <YourApplication />
    </IconProvider>
  );
}
```

### CSS Integration

Add to your main CSS file:

```css
@import './components/icons/icon-theme.css';
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { OracleEye, SearchCrystal, MineIcon } from '@/components/icons';

function MyComponent() {
  return (
    <div>
      {/* Basic icon */}
      <OracleEye size="md" />
      
      {/* Styled icon */}
      <SearchCrystal 
        size="lg" 
        style="filled" 
        className="text-purple-600" 
      />
      
      {/* Interactive icon */}
      <MineIcon 
        size="xl" 
        style="gradient" 
        className="icon-interactive" 
      />
    </div>
  );
}
```

### Animated Icons

```tsx
import { 
  AnimatedOracleEye, 
  AnimatedCrystalBall, 
  AnimatedMysticFlame 
} from '@/components/icons';

function AnimatedDemo() {
  return (
    <div>
      <AnimatedOracleEye 
        animation="oracleReveal" 
        hoverEffect="mysticalHover" 
      />
      
      <AnimatedCrystalBall 
        animation="crystalForm" 
        delay={0.5}
        onAnimationComplete={() => console.log('Animation done!')}
      />
      
      <AnimatedMysticFlame 
        animation="flameFlicker" 
        className="icon-mystical" 
      />
    </div>
  );
}
```

## 📚 Icon Collections

### Oracle & Mystical
Perfect for divine insight and wisdom features:
- `OracleEye` - All-seeing eye with sacred geometry
- `CrystalBall` - Mystical sphere with energy waves
- `SacredScroll` - Ancient scroll with mystical text
- `RuneStone` - Mystical rune stone with symbols
- `MysticFlame` - Sacred flame with energy aura

### Developer & Technical
Modern development tools with mystical touches:
- `CodeOracle` - Code window with mystical elements
- `GitBranch` - Git branching with organic flow
- `DatabaseCrystal` - Crystal-like database structure
- `APIPortal` - Mystical portal for API connections

### Navigation & Interface
Clean interface elements with subtle mystical touches:
- `MineIcon` - Mining/exploration symbol
- `ExploreIcon` - Exploration compass
- `SearchCrystal` - Crystal-enhanced search
- `ArchiveVault` - Mystical archive vault

### Status & State
Enhanced status indicators:
- `LoadingOrb` - Animated loading orb
- `SuccessAura` - Success with energy aura
- `ErrorVortex` - Error with warning vortex
- `WarningBeacon` - Warning beacon
- `InfoPrism` - Information prism

### Utility & Actions
Enhanced versions of common actions:
- `PlusOrb` - Add action with mystical orb
- `DeleteVoid` - Delete with void effect
- `EditQuill` - Mystical quill for editing
- `SaveRune` - Runic save symbol

## 🎛️ Configuration Options

### Icon Provider Configuration

```tsx
const iconConfig = {
  defaultSize: 'md',           // xs | sm | md | lg | xl
  defaultStyle: 'outline',     // outline | filled | duotone | gradient
  enableAnimations: true,      // Enable/disable animations
  enableGradients: true,       // Enable/disable gradient effects
  performanceMode: 'quality',  // quality | performance
  theme: 'auto',              // light | dark | auto
};

<IconProvider config={iconConfig}>
  <App />
</IconProvider>
```

### CSS Custom Properties

```css
:root {
  --icon-primary-h: 271;
  --icon-primary-s: 91%;
  --icon-primary-l: 65%;
  --icon-transition-duration: 200ms;
  --icon-opacity-base: 1;
  --icon-opacity-hover: 1;
}
```

## 🎨 Styling & Theming

### Size Classes

```css
.icon-xs { width: 16px; height: 16px; }
.icon-sm { width: 20px; height: 20px; }
.icon-md { width: 24px; height: 24px; }
.icon-lg { width: 32px; height: 32px; }
.icon-xl { width: 48px; height: 48px; }
```

### Style Variants

```css
.icon-outline   /* Stroke-based outline style */
.icon-filled    /* Solid fill style */
.icon-duotone   /* Two-tone effect */
.icon-gradient  /* Gradient fill */
```

### Effect Classes

```css
.icon-glow      /* Subtle glow effect */
.icon-mystical  /* Mystical multi-layer glow */
.icon-animate   /* Hover scale and rotate */
.icon-pulse     /* Pulsing animation */
.icon-spin      /* Spinning animation */
.icon-bounce    /* Bouncing animation */
```

### Theme Classes

```css
.icon-oracle    /* Oracle purple theme */
.icon-crystal   /* Crystal blue theme */
.icon-wisdom    /* Wisdom purple theme */
.icon-primary   /* Primary blue theme */
.icon-success   /* Success green theme */
.icon-warning   /* Warning yellow theme */
.icon-error     /* Error red theme */
```

## 🔧 Advanced Usage

### Theme Integration

```tsx
import { useIconTheme } from '@/components/icons';

function ThemedIcon() {
  const { getThemeClasses, getEffectClasses } = useIconTheme();
  
  return (
    <OracleEye 
      className={cn(
        getThemeClasses('oracle'),
        getEffectClasses('mystical')
      )}
    />
  );
}
```

### Performance Monitoring

```tsx
import { useIconPerformance } from '@/components/icons';

function PerformanceMonitor() {
  const { renderCount, lastRenderTime } = useIconPerformance();
  
  return (
    <div>
      Renders: {renderCount}, Last: {lastRenderTime}ms
    </div>
  );
}
```

### Accessibility

```tsx
import { useIconAccessibility } from '@/components/icons';

function AccessibleIcon() {
  const { getA11yProps } = useIconAccessibility();
  
  return (
    <OracleEye 
      {...getA11yProps('Oracle vision', 'Mystical insight icon')}
    />
  );
}
```

### Dynamic Icon Loading

```tsx
import { getIcon } from '@/components/icons';

function DynamicIcon({ iconName }: { iconName: string }) {
  const Icon = getIcon(iconName);
  
  if (!Icon) return null;
  
  return <Icon size="md" />;
}
```

## 🎭 Animation System

### Built-in Animations

```tsx
// Oracle revelation effect
<AnimatedOracleEye animation="oracleReveal" />

// Crystal formation
<AnimatedCrystalBall animation="crystalForm" />

// Flame flickering
<AnimatedMysticFlame animation="flameFlicker" />

// Portal spinning
<AnimatedAPIPortal animation="portalSpin" />

// Energy flow
<AnimatedDataFlow />
```

### Custom Animations

```tsx
import { motion } from 'framer-motion';
import { IconBase } from '@/components/icons';

const CustomAnimatedIcon = () => (
  <motion.div
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
  >
    <IconBase size="md">
      <path d="..." />
    </IconBase>
  </motion.div>
);
```

## 🛠️ Development

### Creating Custom Icons

```tsx
import { forwardRef } from 'react';
import { IconBase, type IconProps } from '@/components/icons';

export const CustomIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    {/* Your SVG paths here */}
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </IconBase>
));
```

### Testing Icons

```tsx
import { render, screen } from '@testing-library/react';
import { OracleEye } from '@/components/icons';

test('renders oracle eye icon', () => {
  render(<OracleEye data-testid="oracle-eye" />);
  expect(screen.getByTestId('oracle-eye')).toBeInTheDocument();
});
```

## 📱 Responsive Considerations

Icons automatically adjust stroke weight for optimal readability at different sizes:

- **xs (16px)**: stroke-width: 1.8
- **sm (20px)**: stroke-width: 1.6  
- **md (24px)**: stroke-width: 1.5
- **lg (32px)**: stroke-width: 1.4
- **xl (48px)**: stroke-width: 1.2

## ♿ Accessibility Features

- **ARIA labels**: Semantic descriptions for screen readers
- **Reduced motion**: Respects `prefers-reduced-motion`
- **High contrast**: Works with system high contrast modes
- **Keyboard navigation**: Focus indicators and navigation support
- **Color independence**: Icons work without color dependency

## 🎯 Performance Optimization

- **Tree shaking**: Import only what you need
- **Lazy loading**: Gradients loaded only when needed
- **Performance mode**: Reduces effects for better performance
- **Memoization**: React.memo for expensive renders
- **CSS-in-JS optimization**: Minimal runtime styles

## 🐛 Troubleshooting

### Common Issues

**Icons not showing:**
```tsx
// Make sure IconProvider is wrapping your app
// Import the CSS theme file
```

**Animations not working:**
```tsx
// Check that animations are enabled in config
<IconProvider config={{ enableAnimations: true }}>
```

**TypeScript errors:**
```tsx
// Make sure you're importing the correct types
import type { IconProps } from '@/components/icons';
```

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and ensure all new icons follow the design system principles.

### Icon Design Guidelines

1. **Sacred Geometry**: Incorporate mystical symbols and geometric patterns
2. **24x24 Grid**: Design on a 24x24 pixel grid system
3. **Consistent Stroke**: Use 1.5px stroke weight for base designs
4. **Meaningful Metaphors**: Each icon should tell a relevant story
5. **Scalable Design**: Test at all size variants

## 📄 License

This icon system is part of the DevDigger project and follows the project's licensing terms.

---

*Built with ❤️ for the DevDigger oracle experience*
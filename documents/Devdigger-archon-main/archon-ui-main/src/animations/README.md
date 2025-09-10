# DevDigger Animation System

A world-class animation system designed for sophisticated micro-interactions and delightful user experiences. Built with performance, accessibility, and developer experience in mind.

## ✨ Features

- **Performance-Optimized**: GPU-accelerated animations with 60fps target
- **Accessibility-First**: Full support for `prefers-reduced-motion` and other accessibility requirements
- **Sophisticated Micro-interactions**: Input fields, toggles, buttons, and more with natural animations
- **Data Visualizations**: Animated charts, progress bars, and counters
- **Special Effects**: Particles, morphing shapes, liquid animations, and aurora effects
- **Framer Motion Integration**: Comprehensive variants library and configurations
- **Memory Efficient**: Smart cleanup and resource management
- **TypeScript Support**: Full type safety and IntelliSense support

## 🚀 Quick Start

### 1. Import the CSS animations (in your main CSS/index.css):

```css
@import './animations/keyframes.css';
```

### 2. Basic Usage Examples:

```tsx
import React from 'react';
import { 
  AnimatedButton, 
  AnimatedInput, 
  useHoverAnimation, 
  fadeVariants 
} from '@/animations';
import { motion } from 'framer-motion';

// Simple fade animation
<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeVariants}
>
  Content here
</motion.div>

// Animated button with ripple effect
<AnimatedButton
  variant="primary"
  onClick={() => console.log('Clicked!')}
  leftIcon={<Plus />}
>
  Add Item
</AnimatedButton>

// Input with floating label animation
<AnimatedInput
  label="Your Name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

## 🎯 Core Components

### Micro-interactions

#### AnimatedButton
```tsx
<AnimatedButton
  variant="primary" // primary | secondary | ghost
  size="md"         // sm | md | lg
  isLoading={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  rippleColor="#ffffff"
>
  Click me
</AnimatedButton>
```

#### AnimatedInput
```tsx
<AnimatedInput
  label="Email Address"
  type="email"
  error="Invalid email"
  success={true}
  icon={<MailIcon />}
  helperText="We'll never share your email"
/>
```

#### AnimatedToggle
```tsx
<AnimatedToggle
  checked={isEnabled}
  onChange={setIsEnabled}
  size="md"          // sm | md | lg
  color="#3b82f6"
  label="Enable notifications"
  description="Receive updates about your projects"
/>
```

#### AnimatedCheckbox
```tsx
<AnimatedCheckbox
  checked={isChecked}
  onChange={setIsChecked}
  indeterminate={someChecked}
  size="md"
  label="Select all items"
/>
```

#### AnimatedTooltip
```tsx
<AnimatedTooltip
  content="This is a helpful tooltip"
  placement="top"    // top | bottom | left | right
  delay={500}
>
  <button>Hover me</button>
</AnimatedTooltip>
```

### Data Visualizations

#### AnimatedProgressBar
```tsx
<AnimatedProgressBar
  progress={75}
  label="Upload Progress"
  showPercentage={true}
  color="#3b82f6"
  height={8}
  animated={true}
  striped={true}
  glowEffect={true}
/>
```

#### AnimatedCounter
```tsx
<AnimatedCounter
  value={1234}
  duration={2000}
  prefix="$"
  suffix="USD"
  decimals={2}
  size="xl"          // sm | md | lg | xl
  color="#10b981"
/>
```

#### AnimatedCircleProgress
```tsx
<AnimatedCircleProgress
  progress={85}
  size={120}
  strokeWidth={8}
  color="#8b5cf6"
  showPercentage={true}
/>
```

#### AnimatedStatsGrid
```tsx
<AnimatedStatsGrid
  columns={3}
  stats={[
    {
      label: 'Total Users',
      value: 12345,
      icon: <UsersIcon />,
      color: '#3b82f6',
      change: 12.5, // percentage change
    },
    // ... more stats
  ]}
/>
```

### Special Effects

#### ParticleSystem
```tsx
<ParticleSystem
  trigger={showParticles}
  count={30}
  colors={['#3b82f6', '#8b5cf6', '#06d6a0']}
  size={4}
  duration={2000}
  spread={150}
  continuous={false}
/>
```

#### MorphingBlob
```tsx
<MorphingBlob
  size={200}
  color="#3b82f6"
  intensity={20}
  speed={3}
/>
```

#### LiquidButton
```tsx
<LiquidButton
  liquidColor="#3b82f6"
  intensity={1.2}
  onClick={() => console.log('Liquid click!')}
>
  Liquid Effect
</LiquidButton>
```

## 🎨 Animation Hooks

### useHoverAnimation
```tsx
const MyComponent = () => {
  const { elementRef, isHovering } = useHoverAnimation({
    scale: 1.05,
    magneticStrength: 15,
    returnSpeed: 300,
  });

  return (
    <div ref={elementRef}>
      Hover me for magnetic effect
    </div>
  );
};
```

### useCounterAnimation
```tsx
const Counter = ({ target }) => {
  const current = useCounterAnimation(target, {
    duration: 2000,
    delay: 500,
  });

  return <span>{Math.round(current)}</span>;
};
```

### useScrollAnimation
```tsx
const ScrollTriggered = () => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
    >
      Appears when scrolled into view
    </motion.div>
  );
};
```

## 🔧 Framer Motion Variants

Pre-built variants for common animations:

```tsx
import { 
  fadeVariants,
  slideVariants, 
  scaleVariants,
  buttonVariants,
  cardVariants,
  modalVariants,
  staggerContainerVariants,
  staggerItemVariants 
} from '@/animations';

// Staggered list animation
<motion.div
  variants={staggerContainerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      variants={staggerItemVariants}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>

// Interactive button
<motion.button
  variants={buttonVariants}
  initial="idle"
  whileHover="hover"
  whileTap="tap"
>
  Interactive Button
</motion.button>
```

## ⚡ Performance Optimizations

### GPU Acceleration
All animations use transform3d and opacity for optimal performance:

```tsx
// Automatically optimized
<AnimatedButton />

// Manual GPU promotion
import { promoteToGPULayer } from '@/animations';

useEffect(() => {
  if (elementRef.current) {
    promoteToGPULayer(elementRef.current);
  }
}, []);
```

### Memory Management
```tsx
import { useAnimationCleanup } from '@/animations';

const MyComponent = () => {
  useAnimationCleanup(() => {
    // Cleanup function called on unmount
    console.log('Cleaning up animations');
  });

  return <div>Component content</div>;
};
```

### Performance Monitoring
```tsx
import { useAnimationPerformance } from '@/animations';

const App = () => {
  const { getFPS } = useAnimationPerformance((fps) => {
    if (fps < 30) {
      console.warn('Low FPS detected:', fps);
    }
  });

  return <div>App content</div>;
};
```

## 🌐 Accessibility Features

### Reduced Motion Support
The system automatically respects user preferences:

```tsx
import { shouldReduceMotion, getSafeDuration } from '@/animations';

// Check motion preference
if (shouldReduceMotion()) {
  // Use static styles
}

// Get safe duration (0.01ms if reduced motion)
const duration = getSafeDuration(500);
```

### Battery and Connection Awareness
```tsx
import { 
  useBatteryAwareAnimations, 
  useConnectionAwareAnimations 
} from '@/animations';

const SmartComponent = () => {
  const { shouldReduceAnimations: batteryReduce } = useBatteryAwareAnimations();
  const { shouldReduceAnimations: connectionReduce } = useConnectionAwareAnimations();
  
  const shouldOptimize = batteryReduce || connectionReduce;

  return (
    <motion.div
      animate={shouldOptimize ? {} : { scale: 1.05 }}
    >
      Smart animations
    </motion.div>
  );
};
```

## 🎭 Animation Patterns

### Page Transitions
```tsx
import { PATTERNS } from '@/animations';

<motion.div
  {...PATTERNS.pageTransition}
>
  Page content
</motion.div>
```

### Modal Animations
```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        className="backdrop"
        {...PATTERNS.modal.backdrop}
      />
      <motion.div
        className="modal-content"
        {...PATTERNS.modal.content}
      >
        Modal content
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Loading States
```tsx
<motion.div
  className="spinner"
  {...PATTERNS.loading.spinner}
/>

<motion.div
  className="pulse-loading"
  {...PATTERNS.loading.pulse}
/>
```

## 🛠️ Development Tools

### Performance Logging
```tsx
import { DEV_TOOLS } from '@/animations';

// Log animation performance in development
const startTime = performance.now();
// ... animation code ...
DEV_TOOLS.logPerformance('MyAnimation', startTime);

// Monitor FPS
DEV_TOOLS.monitorFPS((fps) => {
  console.log('Current FPS:', fps);
});
```

### Visual Debugging
```tsx
// Show animation boundaries in development
DEV_TOOLS.showBoundaries(elementRef.current);
```

## 🎨 Theme Integration

```tsx
import { THEME_INTEGRATION } from '@/animations';

const ThemedComponent = ({ theme }) => {
  const primaryColor = THEME_INTEGRATION.getThemeColor('primary', theme);
  const timings = THEME_INTEGRATION.getThemeTimings(theme);

  return (
    <motion.div
      animate={{ backgroundColor: primaryColor }}
      transition={{ duration: timings.normal }}
    >
      Themed animation
    </motion.div>
  );
};
```

## 📦 Migration from Existing Animations

### CSS to Framer Motion
```tsx
import { MIGRATION } from '@/animations';

// Convert CSS transition: "all 0.3s ease-in-out"
const motionConfig = MIGRATION.cssToFramerMotion('all 0.3s ease-in-out');

// Wrap existing components
const AnimatedLegacyComponent = MIGRATION.wrapWithAnimation(
  LegacyComponent,
  { whileHover: { scale: 1.05 } }
);
```

## 🧪 Testing Animations

### Reduced Motion Testing
```tsx
// Mock reduced motion for testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query.includes('prefers-reduced-motion: reduce'),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});
```

### Animation State Testing
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button shows loading state', async () => {
  const { rerender } = render(
    <AnimatedButton isLoading={false}>Click me</AnimatedButton>
  );
  
  rerender(<AnimatedButton isLoading={true}>Click me</AnimatedButton>);
  
  expect(screen.getByRole('button')).toHaveAttribute('disabled');
});
```

## 📈 Performance Guidelines

### Do's ✅
- Use `transform` and `opacity` properties for animations
- Implement `will-change` optimization strategically
- Use `requestAnimationFrame` for JavaScript animations
- Respect `prefers-reduced-motion` settings
- Clean up animations on component unmount
- Use staggering for list animations
- Implement loading states with animations

### Don'ts ❌
- Animate layout properties (`width`, `height`, `top`, `left`)
- Create infinite animations without pause
- Ignore accessibility preferences
- Animate too many elements simultaneously
- Use blocking animations during critical user flows
- Forget to test on lower-end devices

## 🔍 Browser Support

- **Modern browsers**: Full feature support
- **IE11**: Graceful degradation with CSS fallbacks
- **Reduced motion**: Automatic detection and adaptation
- **Mobile**: Optimized for touch interactions
- **PWA**: Battery and connection awareness

## 📝 Examples & Demos

Check the `/examples` directory for comprehensive examples:
- Basic animations
- Complex micro-interactions
- Data visualization demos
- Special effects showcase
- Performance optimization examples
- Accessibility demonstrations

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new components
3. Include accessibility considerations
4. Add performance optimizations where possible
5. Write tests for new functionality
6. Update documentation

## 📄 License

This animation system is part of the DevDigger project. See the main project license for details.

---

**Built with ❤️ for world-class user experiences**
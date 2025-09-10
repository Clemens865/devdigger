/**
 * DevDigger Layout System Documentation
 * Comprehensive Examples & Implementation Guide
 * 
 * This component provides a complete showcase of the layout system
 * with interactive examples, code snippets, and implementation guides
 * for creating gallery-quality designs.
 */

import React, { useState } from 'react';
import { 
  MagazineLayout,
  BentoLayout,
  BentoItem,
  GalleryLayout,
  ContentRiver,
  PristineCard,
  Stack,
  Cluster,
  GoldenSidebarLayout,
  FluidGrid,
  Emphasis,
  ResponsiveContainer
} from './AdvancedLayouts';
import { Container, Grid, Column, Hero } from './GridSystem';

// ================================
// DOCUMENTATION COMPONENTS
// ================================

interface CodeExampleProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

const CodeExample: React.FC<CodeExampleProps> = ({ 
  title, 
  description, 
  code, 
  children 
}) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <section className="mb-fluid-2xl">
      <div className="mb-fluid-lg">
        <h3 className="text-fluid-2xl font-bold mb-fluid-sm heading-rhythm">
          {title}
        </h3>
        <p className="text-fluid-lg text-gray-600 mb-fluid-md measure-optimal">
          {description}
        </p>
        <Cluster gap="sm">
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-proportion-md py-proportion-sm bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors duration-rhythm-quarter"
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </button>
          <span className="text-sm text-gray-500">
            Click to {showCode ? 'hide' : 'view'} implementation
          </span>
        </Cluster>
      </div>

      {/* Live Example */}
      <div className="mb-fluid-lg p-fluid-lg bg-white rounded-xl shadow-gentle border">
        {children}
      </div>

      {/* Code Display */}
      {showCode && (
        <div className="p-fluid-md bg-gray-900 rounded-lg overflow-x-auto">
          <pre className="text-sm text-gray-300">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </section>
  );
};

interface FeatureHighlightProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon,
  title,
  description
}) => (
  <PristineCard variant="luxurious" className="text-center h-full">
    <div className="text-4xl mb-fluid-md">{icon}</div>
    <h4 className="text-lg font-semibold mb-fluid-sm">{title}</h4>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </PristineCard>
);

// ================================
// MAIN DOCUMENTATION COMPONENT
// ================================

export const LayoutDocumentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero fullHeight={false} className="py-fluid-3xl bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-fluid-5xl font-bold mb-fluid-lg heading-rhythm">
            DevDigger Layout System
          </h1>
          <p className="text-fluid-xl mb-fluid-xl opacity-90 measure-wide">
            A mathematically precise layout system based on the golden ratio, 
            Fibonacci sequence, and musical intervals for gallery-quality designs.
          </p>
          
          <Cluster justify="center" gap="lg">
            <div className="text-center">
              <div className="text-3xl font-bold">φ</div>
              <div className="text-sm opacity-75">Golden Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">♪</div>
              <div className="text-sm opacity-75">Musical Intervals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">∑</div>
              <div className="text-sm opacity-75">Fibonacci Sequence</div>
            </div>
          </Cluster>
        </div>
      </Hero>

      {/* Overview Section */}
      <section className="py-fluid-3xl">
        <ResponsiveContainer maxWidth="xl">
          <div className="text-center mb-fluid-2xl">
            <h2 className="text-fluid-4xl font-bold mb-fluid-lg heading-rhythm">
              System Overview
            </h2>
            <p className="text-fluid-lg text-gray-600 measure-optimal mx-auto">
              Our layout system combines mathematical precision with artistic vision 
              to create harmonious, professional-grade user interfaces.
            </p>
          </div>

          <FluidGrid minItemWidth="280px" gap="lg">
            <FeatureHighlight
              icon="📐"
              title="Mathematical Foundation"
              description="Built on golden ratio (φ = 1.618) and Fibonacci sequence for natural, pleasing proportions."
            />
            <FeatureHighlight
              icon="🎵"
              title="Musical Intervals"
              description="Typography scales based on musical ratios create harmonious visual rhythm."
            />
            <FeatureHighlight
              icon="📱"
              title="Fluid Responsive"
              description="Advanced responsive system with container queries and viewport-aware scaling."
            />
            <FeatureHighlight
              icon="🎨"
              title="Visual Rhythm"
              description="Baseline grids and proportional spacing ensure consistent vertical rhythm."
            />
            <FeatureHighlight
              icon="⚡"
              title="Performance Optimized"
              description="CSS-first approach with hardware acceleration and efficient repaints."
            />
            <FeatureHighlight
              icon="♿"
              title="Accessibility First"
              description="Built-in support for reduced motion, high contrast, and print media."
            />
          </FluidGrid>
        </ResponsiveContainer>
      </section>

      {/* Layout Examples */}
      <section className="py-fluid-2xl bg-white">
        <ResponsiveContainer maxWidth="2xl">
          
          {/* Bento Layout Example */}
          <CodeExample
            title="Bento Layout"
            description="Modern card grid layout inspired by bento boxes. Perfect for dashboards and content galleries with varying card sizes."
            code={`<BentoLayout gap="md">
  <BentoItem size="hero" className="bg-gradient-to-br from-blue-500 to-purple-600">
    <h3>Hero Content</h3>
    <p>Spans multiple grid cells for maximum impact.</p>
  </BentoItem>
  
  <BentoItem className="bg-white">
    <h4>Standard Card</h4>
    <p>Regular grid item with default sizing.</p>
  </BentoItem>
  
  <BentoItem size="tall">
    <h4>Tall Card</h4>
    <p>Extends vertically for more content space.</p>
  </BentoItem>
</BentoLayout>`}
          >
            <BentoLayout gap="md">
              <BentoItem 
                size="hero" 
                className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"
              >
                <Stack spacing="comfortable">
                  <h3 className="text-xl font-bold">Featured Dashboard</h3>
                  <p className="text-blue-100">
                    This hero card spans multiple grid positions for maximum visual impact. 
                    Perfect for highlighting key metrics or featured content.
                  </p>
                  <Cluster gap="sm">
                    <span className="px-2 py-1 bg-blue-400 rounded text-sm">Analytics</span>
                    <span className="px-2 py-1 bg-purple-400 rounded text-sm">Featured</span>
                  </Cluster>
                </Stack>
              </BentoItem>
              
              <BentoItem className="bg-white">
                <Stack spacing="tight">
                  <h4 className="font-semibold text-gray-800">Revenue</h4>
                  <p className="text-2xl font-bold text-green-600">$127K</p>
                  <p className="text-sm text-gray-600">↗ +12% from last month</p>
                </Stack>
              </BentoItem>
              
              <BentoItem className="bg-white">
                <Stack spacing="tight">
                  <h4 className="font-semibold text-gray-800">Users</h4>
                  <p className="text-2xl font-bold text-blue-600">8,429</p>
                  <p className="text-sm text-gray-600">↗ +5.2% active users</p>
                </Stack>
              </BentoItem>
              
              <BentoItem size="tall" className="bg-gradient-to-b from-green-50 to-green-100">
                <Stack spacing="comfortable">
                  <h4 className="font-semibold text-green-800">Growth Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Conversion</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Retention</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </Stack>
              </BentoItem>
              
              <BentoItem size="large" className="bg-gray-900 text-white">
                <Stack spacing="comfortable">
                  <h4 className="font-semibold">System Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">API Response</p>
                      <p className="text-green-400 font-semibold">98ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Uptime</p>
                      <p className="text-green-400 font-semibold">99.9%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Load</p>
                      <p className="text-yellow-400 font-semibold">2.1</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Memory</p>
                      <p className="text-blue-400 font-semibold">64%</p>
                    </div>
                  </div>
                </Stack>
              </BentoItem>
            </BentoLayout>
          </CodeExample>

          {/* Magazine Layout Example */}
          <CodeExample
            title="Magazine Layout"
            description="Three-column layout with golden ratio proportions. Ideal for content-heavy applications with navigation, main content, and supplementary information."
            code={`<MagazineLayout
  sidebar={<Navigation />}
  content={<MainArticle />}
  aside={<RelatedLinks />}
  gap="xl"
/>`}
          >
            <MagazineLayout
              sidebar={
                <PristineCard variant="minimal" className="h-full">
                  <h4 className="font-semibold mb-proportion-md text-gray-800">Navigation</h4>
                  <Stack spacing="tight">
                    <a href="#" className="text-blue-600 hover:text-blue-800 py-1">Dashboard</a>
                    <a href="#" className="text-blue-600 hover:text-blue-800 py-1">Analytics</a>
                    <a href="#" className="text-blue-600 hover:text-blue-800 py-1">Reports</a>
                    <a href="#" className="text-blue-600 hover:text-blue-800 py-1">Settings</a>
                  </Stack>
                </PristineCard>
              }
              content={
                <PristineCard variant="pristine">
                  <ContentRiver measure="optimal">
                    <h2 className="text-2xl font-bold text-gray-800 heading-rhythm">
                      The Art of Mathematical Design
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Discover how mathematical principles create harmonious user interfaces 
                      that feel natural and pleasing to the eye.
                    </p>
                    <p className="text-gray-700">
                      The golden ratio, found throughout nature from nautilus shells to flower petals, 
                      provides a foundation for creating layouts that feel inherently balanced. 
                      When combined with the Fibonacci sequence and musical intervals, we achieve 
                      designs that resonate with users on a subconscious level.
                    </p>
                    <p className="text-gray-700">
                      This approach moves beyond arbitrary spacing and sizing decisions, 
                      instead grounding every design choice in mathematical principles 
                      that have been refined over millennia.
                    </p>
                  </ContentRiver>
                </PristineCard>
              }
              aside={
                <PristineCard variant="minimal">
                  <h5 className="font-semibold mb-proportion-sm text-gray-500 uppercase tracking-wide text-xs">
                    Related Topics
                  </h5>
                  <Stack spacing="tight">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 py-1">
                      Golden Ratio in Design
                    </a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 py-1">
                      Fibonacci in Nature
                    </a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 py-1">
                      Musical Intervals
                    </a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 py-1">
                      Typographic Scale
                    </a>
                  </Stack>
                </PristineCard>
              }
            />
          </CodeExample>

          {/* Gallery Layout Example */}
          <CodeExample
            title="Gallery Layout"
            description="Responsive image gallery with perfect aspect ratios and intelligent spacing. Automatically adjusts column count based on screen size."
            code={`<GalleryLayout 
  minItemWidth={280} 
  aspectRatio="golden"
  gap="md"
>
  {images.map((image, index) => (
    <GalleryItem key={index}>
      <img src={image.src} alt={image.alt} />
    </GalleryItem>
  ))}
</GalleryLayout>`}
          >
            <GalleryLayout minItemWidth={250} aspectRatio="golden" gap="md">
              {Array.from({ length: 9 }, (_, i) => {
                const gradients = [
                  'from-red-400 to-pink-500',
                  'from-blue-400 to-indigo-500',
                  'from-green-400 to-teal-500',
                  'from-yellow-400 to-orange-500',
                  'from-purple-400 to-pink-500',
                  'from-indigo-400 to-blue-500',
                  'from-teal-400 to-green-500',
                  'from-orange-400 to-red-500',
                  'from-pink-400 to-purple-500',
                ];
                
                return (
                  <div
                    key={i}
                    className={`bg-gradient-to-br ${gradients[i]} rounded-lg 
                               flex items-center justify-center text-white font-semibold 
                               hover:scale-105 transition-transform duration-300 cursor-pointer`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎨</div>
                      <div>Gallery {i + 1}</div>
                    </div>
                  </div>
                );
              })}
            </GalleryLayout>
          </CodeExample>

          {/* Golden Sidebar Layout */}
          <CodeExample
            title="Golden Sidebar Layout"
            description="Sidebar layout with golden ratio proportions (38.2% / 61.8%). The sidebar automatically collapses to vertical stacking on smaller screens."
            code={`<GoldenSidebarLayout
  sidebar={<Sidebar />}
  content={<MainContent />}
  minContentWidth={400}
  gap="lg"
/>`}
          >
            <GoldenSidebarLayout
              sidebar={
                <PristineCard variant="luxurious">
                  <h4 className="font-semibold mb-proportion-md text-gray-800">Sidebar Content</h4>
                  <p className="text-sm text-gray-600 mb-proportion-md">
                    This sidebar takes up 38.2% of the total width (the golden ratio's minor proportion).
                  </p>
                  <Stack spacing="comfortable">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-1">Quick Stats</h5>
                      <p className="text-sm text-blue-600">View key metrics at a glance</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-1">Recent Activity</h5>
                      <p className="text-sm text-green-600">Latest updates and changes</p>
                    </div>
                  </Stack>
                </PristineCard>
              }
              content={
                <PristineCard variant="pristine">
                  <h4 className="font-semibold mb-proportion-md text-gray-800">Main Content Area</h4>
                  <p className="text-gray-600 mb-proportion-lg">
                    This content area occupies 61.8% of the total width (the golden ratio's major proportion). 
                    This creates the most visually pleasing balance between sidebar and main content.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Feature A</h5>
                      <p className="text-sm text-gray-600">
                        Detailed information about the first feature with plenty of space for content.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Feature B</h5>
                      <p className="text-sm text-gray-600">
                        Additional feature details that benefit from the expanded content area.
                      </p>
                    </div>
                  </div>
                </PristineCard>
              }
            />
          </CodeExample>

        </ResponsiveContainer>
      </section>

      {/* Implementation Guide */}
      <section className="py-fluid-2xl bg-gray-100">
        <ResponsiveContainer maxWidth="xl">
          <div className="text-center mb-fluid-2xl">
            <h2 className="text-fluid-3xl font-bold mb-fluid-lg heading-rhythm">
              Implementation Guide
            </h2>
            <p className="text-fluid-lg text-gray-600 measure-optimal mx-auto">
              Get started with the DevDigger layout system in your project.
            </p>
          </div>

          <Grid gap="lg">
            <Column span={12} mdSpan={6}>
              <PristineCard variant="luxurious" className="h-full">
                <h3 className="text-xl font-semibold mb-proportion-md">1. Installation</h3>
                <p className="text-gray-600 mb-proportion-lg">
                  Import the CSS files and React components into your project.
                </p>
                <div className="bg-gray-900 p-4 rounded-lg mb-proportion-md">
                  <code className="text-green-400 text-sm">
                    {`// Import CSS files
import './styles/layout.css';
import './styles/advanced-layout.css';
import './styles/fluid-responsive.css';
import './styles/visual-rhythm.css';`}
                  </code>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <code className="text-blue-400 text-sm">
                    {`// Import React components
import { 
  BentoLayout, 
  MagazineLayout, 
  GalleryLayout 
} from './components/layout/AdvancedLayouts';`}
                  </code>
                </div>
              </PristineCard>
            </Column>
            
            <Column span={12} mdSpan={6}>
              <PristineCard variant="luxurious" className="h-full">
                <h3 className="text-xl font-semibold mb-proportion-md">2. Basic Usage</h3>
                <p className="text-gray-600 mb-proportion-lg">
                  Start with fundamental layout components and spacing utilities.
                </p>
                <div className="bg-gray-900 p-4 rounded-lg mb-proportion-md">
                  <code className="text-yellow-400 text-sm">
                    {`<ResponsiveContainer maxWidth="lg">
  <Stack spacing="comfortable">
    <h1>Page Title</h1>
    <BentoLayout gap="md">
      <BentoItem>Content 1</BentoItem>
      <BentoItem>Content 2</BentoItem>
    </BentoLayout>
  </Stack>
</ResponsiveContainer>`}
                  </code>
                </div>
              </PristineCard>
            </Column>
          </Grid>

          <div className="mt-fluid-xl">
            <PristineCard variant="pristine">
              <h3 className="text-xl font-semibold mb-proportion-lg">CSS Custom Properties</h3>
              <p className="text-gray-600 mb-proportion-lg">
                The system exposes CSS custom properties for easy customization:
              </p>
              
              <Grid gap="md">
                <Column span={12} mdSpan={4}>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Spacing Scale</h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>--space-xs: 8px</li>
                      <li>--space-sm: 13px</li>
                      <li>--space-md: 21px</li>
                      <li>--space-lg: 34px</li>
                      <li>--space-xl: 55px</li>
                    </ul>
                  </div>
                </Column>
                <Column span={12} mdSpan={4}>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Golden Ratios</h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>--ratio-golden: 1.618</li>
                      <li>--golden-major: 61.8%</li>
                      <li>--golden-minor: 38.2%</li>
                      <li>--aspect-golden: 1.618</li>
                    </ul>
                  </div>
                </Column>
                <Column span={12} mdSpan={4}>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Visual Rhythm</h4>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>--baseline-unit: 24px</li>
                      <li>--rhythm-base: 24px</li>
                      <li>--rhythm-double: 48px</li>
                      <li>--rhythm-triple: 72px</li>
                    </ul>
                  </div>
                </Column>
              </Grid>
            </PristineCard>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Footer */}
      <footer className="py-fluid-2xl bg-gray-900 text-white">
        <ResponsiveContainer maxWidth="lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-proportion-lg">DevDigger Layout System</h3>
            <p className="text-gray-300 mb-proportion-xl measure-optimal mx-auto">
              Mathematical precision meets artistic vision. Create gallery-quality layouts 
              with golden ratio proportions, Fibonacci spacing, and musical intervals.
            </p>
            
            <Cluster justify="center" gap="lg">
              <div className="text-center">
                <div className="text-3xl mb-2">📐</div>
                <div className="text-sm text-gray-400">Mathematical</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-sm text-gray-400">Beautiful</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm text-gray-400">Performant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">♿</div>
                <div className="text-sm text-gray-400">Accessible</div>
              </div>
            </Cluster>
            
            <div className="mt-proportion-xl pt-proportion-lg border-t border-gray-700 text-sm text-gray-400">
              © 2024 DevDigger. Designed with mathematical precision.
            </div>
          </div>
        </ResponsiveContainer>
      </footer>
    </div>
  );
};

export default LayoutDocumentation;
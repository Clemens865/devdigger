/**
 * DevDigger Layout System - Comprehensive Example
 * 
 * This example demonstrates all the mathematical layout features:
 * - Golden ratio proportions (φ = 1.618)
 * - Fibonacci spacing scale
 * - Perfect aspect ratios
 * - Responsive grid systems
 * - Visual hierarchy through spacing
 */

import React from 'react';
import {
  Container,
  Grid,
  Column,
  Flex,
  GoldenSidebar,
  TwoColumn,
  ThreeColumn,
  Hero,
  CardGrid,
  DashboardGrid,
  Masonry,
  AspectBox,
  Centered,
  Spacer,
  Section,
  Responsive
} from './index';

// Sample card component for demonstrations
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`bg-white rounded-lg shadow-sm border p-md ${className}`}>
    {children}
  </div>
);

// Sample metric component
const MetricCard: React.FC<{ 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' 
}> = ({ title, value, change, trend }) => (
  <Card>
    <div className="space-y-xs">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? '↗' : '↘'} {change}
      </p>
    </div>
  </Card>
);

export const LayoutExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION - Golden Ratio Height */}
      <Hero fullHeight backgroundImage="/hero-bg.jpg">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-md">DevDigger Layout System</h1>
          <p className="text-xl mb-lg max-w-2xl mx-auto">
            Mathematically perfect layouts based on the golden ratio and Fibonacci sequence
          </p>
          <Flex justify="center" gap="md">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-lg py-sm rounded-lg">
              Get Started
            </button>
            <button className="bg-transparent border-2 border-white text-white px-lg py-sm rounded-lg">
              Learn More
            </button>
          </Flex>
        </div>
      </Hero>

      {/* FIBONACCI SPACING DEMONSTRATION */}
      <Section padding="3xl">
        <Container size="lg">
          <div className="text-center mb-2xl">
            <h2 className="text-4xl font-bold mb-md">Fibonacci Spacing Scale</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our spacing system uses the Fibonacci sequence (8, 13, 21, 34, 55, 89, 144px) 
              for perfect mathematical harmony in layouts.
            </p>
          </div>
          
          {/* Visual spacing demonstration */}
          <div className="bg-white rounded-lg p-lg shadow-sm">
            <Grid gap="md">
              <Column span={3} className="text-center">
                <div className="bg-blue-100 h-xs rounded mb-micro-md"></div>
                <p className="text-sm">8px (xs)</p>
              </Column>
              <Column span={3} className="text-center">
                <div className="bg-blue-200 h-sm rounded mb-micro-md"></div>
                <p className="text-sm">13px (sm)</p>
              </Column>
              <Column span={3} className="text-center">
                <div className="bg-blue-300 h-md rounded mb-micro-md"></div>
                <p className="text-sm">21px (md)</p>
              </Column>
              <Column span={3} className="text-center">
                <div className="bg-blue-400 h-lg rounded mb-micro-md"></div>
                <p className="text-sm">34px (lg)</p>
              </Column>
            </Grid>
          </div>
        </Container>
      </Section>

      {/* GOLDEN RATIO SIDEBAR LAYOUT */}
      <Section padding="2xl" background="white">
        <Container size="xl">
          <div className="text-center mb-xl">
            <h2 className="text-3xl font-bold mb-md">Golden Ratio Layouts</h2>
            <p className="text-lg text-gray-600">
              Sidebar proportions based on φ (1.618) for natural visual balance
            </p>
          </div>
          
          <GoldenSidebar
            sidebar={
              <Card className="h-full">
                <h3 className="text-xl font-semibold mb-md">Navigation</h3>
                <nav className="space-y-sm">
                  <a href="#" className="block py-xs px-sm hover:bg-gray-50 rounded">Dashboard</a>
                  <a href="#" className="block py-xs px-sm hover:bg-gray-50 rounded">Analytics</a>
                  <a href="#" className="block py-xs px-sm hover:bg-gray-50 rounded">Reports</a>
                  <a href="#" className="block py-xs px-sm hover:bg-gray-50 rounded">Settings</a>
                </nav>
              </Card>
            }
            content={
              <Card>
                <h3 className="text-2xl font-semibold mb-md">Main Content Area</h3>
                <p className="text-gray-600 mb-lg">
                  This content area takes up ~61.8% of the width (the golden ratio), 
                  while the sidebar takes ~38.2%. This creates the most visually 
                  pleasing proportions found in nature and classical architecture.
                </p>
                
                {/* Nested grid within content */}
                <Grid gap="md">
                  <Column span={6}>
                    <AspectBox ratio="golden" className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      <span className="text-lg font-semibold">Golden Ratio Box</span>
                    </AspectBox>
                  </Column>
                  <Column span={6}>
                    <AspectBox ratio="square" className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
                      <span className="text-lg font-semibold">Square Box</span>
                    </AspectBox>
                  </Column>
                </Grid>
              </Card>
            }
          />
        </Container>
      </Section>

      {/* DASHBOARD GRID - RESPONSIVE CARDS */}
      <Section padding="2xl">
        <Container size="xl">
          <div className="text-center mb-xl">
            <h2 className="text-3xl font-bold mb-md">Dashboard Metrics</h2>
            <p className="text-lg text-gray-600">
              Auto-fitting grid with minimum card widths for perfect responsiveness
            </p>
          </div>
          
          <DashboardGrid minItemWidth={280} gap="md">
            <MetricCard 
              title="Total Revenue" 
              value="$124,567" 
              change="+12.5%" 
              trend="up" 
            />
            <MetricCard 
              title="Active Users" 
              value="8,429" 
              change="+5.2%" 
              trend="up" 
            />
            <MetricCard 
              title="Conversion Rate" 
              value="3.24%" 
              change="-2.1%" 
              trend="down" 
            />
            <MetricCard 
              title="Avg. Session" 
              value="4m 32s" 
              change="+8.7%" 
              trend="up" 
            />
          </DashboardGrid>
        </Container>
      </Section>

      {/* THREE COLUMN LAYOUT */}
      <Section padding="2xl" background="white">
        <Container size="lg">
          <div className="text-center mb-xl">
            <h2 className="text-3xl font-bold mb-md">Equal Column Layout</h2>
            <p className="text-lg text-gray-600">
              Perfectly balanced three-column layout with Fibonacci spacing
            </p>
          </div>
          
          <ThreeColumn
            gap="lg"
            left={
              <Card>
                <AspectBox ratio="card" className="bg-red-100 rounded mb-md flex items-center justify-center">
                  <span className="text-red-600 font-semibold">Feature A</span>
                </AspectBox>
                <h3 className="text-lg font-semibold mb-sm">Performance</h3>
                <p className="text-gray-600">
                  Lightning-fast performance with mathematical precision in every layout calculation.
                </p>
              </Card>
            }
            center={
              <Card>
                <AspectBox ratio="card" className="bg-green-100 rounded mb-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold">Feature B</span>
                </AspectBox>
                <h3 className="text-lg font-semibold mb-sm">Flexibility</h3>
                <p className="text-gray-600">
                  Highly composable components that work together in perfect harmony.
                </p>
              </Card>
            }
            right={
              <Card>
                <AspectBox ratio="card" className="bg-blue-100 rounded mb-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">Feature C</span>
                </AspectBox>
                <h3 className="text-lg font-semibold mb-sm">Scalability</h3>
                <p className="text-gray-600">
                  Scales beautifully from mobile to ultra-wide displays with mathematical precision.
                </p>
              </Card>
            }
          />
        </Container>
      </Section>

      {/* RESPONSIVE GRID DEMONSTRATION */}
      <Section padding="2xl">
        <Container size="xl">
          <div className="text-center mb-xl">
            <h2 className="text-3xl font-bold mb-md">Responsive Grid System</h2>
            <p className="text-lg text-gray-600">
              12-column grid that adapts perfectly across all screen sizes
            </p>
          </div>
          
          <Grid gap="md">
            <Column span={12} mdSpan={6} lgSpan={4}>
              <Card>
                <h4 className="font-semibold mb-sm">Column 1</h4>
                <p className="text-sm text-gray-600">
                  12 cols on mobile, 6 on tablet, 4 on desktop
                </p>
              </Card>
            </Column>
            <Column span={12} mdSpan={6} lgSpan={4}>
              <Card>
                <h4 className="font-semibold mb-sm">Column 2</h4>
                <p className="text-sm text-gray-600">
                  Responsive breakpoints at golden ratio intervals
                </p>
              </Card>
            </Column>
            <Column span={12} mdSpan={12} lgSpan={4}>
              <Card>
                <h4 className="font-semibold mb-sm">Column 3</h4>
                <p className="text-sm text-gray-600">
                  Perfect adaptation to screen size changes
                </p>
              </Card>
            </Column>
          </Grid>
        </Container>
      </Section>

      {/* MASONRY LAYOUT */}
      <Section padding="2xl" background="white">
        <Container size="lg">
          <div className="text-center mb-xl">
            <h2 className="text-3xl font-bold mb-md">Masonry Layout</h2>
            <p className="text-lg text-gray-600">
              Pinterest-style layout that flows naturally with variable content heights
            </p>
          </div>
          
          <Masonry columns={3} gap="md">
            <Card className="mb-md">
              <AspectBox ratio="4-3" className="bg-purple-100 rounded mb-sm"></AspectBox>
              <h4 className="font-semibold mb-xs">Card 1</h4>
              <p className="text-sm text-gray-600">Short content that demonstrates masonry flow.</p>
            </Card>
            
            <Card className="mb-md">
              <AspectBox ratio="golden" className="bg-yellow-100 rounded mb-sm"></AspectBox>
              <h4 className="font-semibold mb-xs">Card 2</h4>
              <p className="text-sm text-gray-600">
                Longer content that shows how masonry layouts handle variable heights 
                gracefully. The content flows naturally without awkward gaps.
              </p>
            </Card>
            
            <Card className="mb-md">
              <AspectBox ratio="square" className="bg-pink-100 rounded mb-sm"></AspectBox>
              <h4 className="font-semibold mb-xs">Card 3</h4>
              <p className="text-sm text-gray-600">Medium length content.</p>
            </Card>
            
            <Card className="mb-md">
              <AspectBox ratio="2-1" className="bg-indigo-100 rounded mb-sm"></AspectBox>
              <h4 className="font-semibold mb-xs">Card 4</h4>
              <p className="text-sm text-gray-600">
                Another piece of content with different height to showcase 
                the natural flow of masonry columns.
              </p>
            </Card>
            
            <Card className="mb-md">
              <AspectBox ratio="3-2" className="bg-cyan-100 rounded mb-sm"></AspectBox>
              <h4 className="font-semibold mb-xs">Card 5</h4>
              <p className="text-sm text-gray-600">Compact content.</p>
            </Card>
          </Masonry>
        </Container>
      </Section>

      {/* CENTERED LAYOUT EXAMPLE */}
      <Section padding="3xl">
        <Centered fullHeight={false} maxWidth="600px">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-lg">Perfect Centering</h2>
            <p className="text-lg text-gray-600 mb-xl">
              Mathematical precision in content centering with optimal reading widths 
              based on typography research.
            </p>
            
            <Flex justify="center" gap="md" className="mb-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                φ
              </div>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                ∞
              </div>
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                ∑
              </div>
            </Flex>
            
            <p className="text-gray-600">
              The golden ratio (φ), infinity (∞), and summation (∑) represent the 
              mathematical foundation of our layout system.
            </p>
          </div>
        </Centered>
      </Section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-2xl">
        <Container size="lg">
          <TwoColumn
            gap="xl"
            left={
              <div>
                <h3 className="text-xl font-bold mb-md">DevDigger Layout System</h3>
                <p className="text-gray-300 mb-lg">
                  Built with mathematical precision using the golden ratio and 
                  Fibonacci sequence for optimal visual harmony.
                </p>
                <Flex gap="md">
                  <a href="#" className="text-blue-400 hover:text-blue-300">GitHub</a>
                  <a href="#" className="text-blue-400 hover:text-blue-300">Documentation</a>
                  <a href="#" className="text-blue-400 hover:text-blue-300">Examples</a>
                </Flex>
              </div>
            }
            right={
              <div>
                <h4 className="text-lg font-semibold mb-md">Features</h4>
                <ul className="space-y-xs text-gray-300">
                  <li>✓ Golden ratio proportions</li>
                  <li>✓ Fibonacci spacing scale</li>
                  <li>✓ Responsive grid system</li>
                  <li>✓ Perfect aspect ratios</li>
                  <li>✓ Mathematical harmony</li>
                  <li>✓ TypeScript support</li>
                </ul>
              </div>
            }
          />
          
          <Spacer size="xl" />
          
          <div className="text-center text-gray-400 text-sm pt-lg border-t border-gray-700">
            © 2024 DevDigger. Designed with mathematical precision.
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LayoutExample;
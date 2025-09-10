import React, { useState } from 'react';
import { ButtonV2 } from '../../components/ui/ButtonV2';
import { FormElements } from '../../components/ui/FormElements';
import { Container, Grid, Column, GoldenSidebar, Hero, Section } from '../../components/layout/GridSystem';
import { IconSystem } from '../../components/icons/IconSystem';
import { LoadingSpinners } from '../../components/icons/LoadingSpinners';
import { EmptyStateGraphics } from '../../components/icons/EmptyStateGraphics';
import DataViz from '../../components/charts/DataViz';
import { useScrollReveal, useStaggeredAnimation, useParallax } from '../../hooks/useAnimation';

/**
 * DevDigger Design System Showcase
 * A comprehensive demonstration of the world-class UI components
 */
export const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { elementRef: heroRef } = useScrollReveal({ threshold: 0.2 });
  const { containerRef: cardsRef, trigger } = useStaggeredAnimation({ delay: 100 });
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <IconSystem.HomeIcon size={20} /> },
    { id: 'typography', label: 'Typography', icon: <IconSystem.FileIcon size={20} /> },
    { id: 'colors', label: 'Colors', icon: <IconSystem.SettingsIcon size={20} /> },
    { id: 'buttons', label: 'Buttons', icon: <IconSystem.StarIcon size={20} /> },
    { id: 'forms', label: 'Forms', icon: <IconSystem.EditIcon size={20} /> },
    { id: 'layout', label: 'Layout', icon: <IconSystem.GridIcon size={20} /> },
    { id: 'icons', label: 'Icons', icon: <IconSystem.ImageIcon size={20} /> },
    { id: 'dataviz', label: 'Data Viz', icon: <IconSystem.ChartIcon size={20} /> },
    { id: 'animations', label: 'Animations', icon: <IconSystem.PlayIcon size={20} /> },
  ];
  
  React.useEffect(() => {
    trigger();
  }, [activeTab]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <LoadingSpinners.HexagonSpinner size={32} />
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                DevDigger Design System v2.0
              </h1>
            </div>
            <nav className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                    ${activeTab === tab.id 
                      ? 'bg-primary-100 text-primary-700 shadow-sm' 
                      : 'hover:bg-neutral-100 text-neutral-600'}
                  `}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </Container>
      </header>
      
      {/* Main Content */}
      <main className="pb-20">
        {activeTab === 'overview' && (
          <div ref={heroRef} className="animate-fade-in-up">
            <Hero className="bg-gradient-to-br from-primary-50 via-white to-complementary-50">
              <div className="text-center py-20">
                <h2 className="text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary-600 to-complementary-600 bg-clip-text text-transparent">
                  World-Class Design System
                </h2>
                <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-12">
                  A sophisticated, mathematically perfect UI system built with golden ratio proportions, 
                  perceptually uniform colors, and gallery-quality aesthetics.
                </p>
                
                {/* Feature Cards */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl animate-fade-in delay-100">
                    <IconSystem.LayersIcon size={48} className="mx-auto mb-4 text-primary-500" />
                    <h3 className="text-lg font-bold mb-2">Golden Ratio Layout</h3>
                    <p className="text-neutral-600">Mathematical precision with φ = 1.618 proportions</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl animate-fade-in delay-200">
                    <IconSystem.PaletteIcon size={48} className="mx-auto mb-4 text-complementary-500" />
                    <h3 className="text-lg font-bold mb-2">OKLCH Colors</h3>
                    <p className="text-neutral-600">Perceptually uniform color space with AAA contrast</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl animate-fade-in delay-300">
                    <IconSystem.ZapIcon size={48} className="mx-auto mb-4 text-triadic-green-500" />
                    <h3 className="text-lg font-bold mb-2">Micro-interactions</h3>
                    <p className="text-neutral-600">Subtle animations with spring physics</p>
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
                  <DataViz.KPICard title="Components" value={54} trend={12} format="number" />
                  <DataViz.KPICard title="Animations" value={36} trend={8} format="number" />
                  <DataViz.KPICard title="Icons" value={40} trend={15} format="number" />
                  <DataViz.KPICard title="Colors" value={80} trend={20} format="number" />
                </div>
              </div>
            </Hero>
          </div>
        )}
        
        {activeTab === 'buttons' && (
          <Container className="py-12">
            <Section>
              <h2 className="text-3xl font-bold mb-8">Button Components</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Primary Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <ButtonV2 variant="primary">Default</ButtonV2>
                    <ButtonV2 variant="primary" size="lg">Large</ButtonV2>
                    <ButtonV2 variant="primary" loading>Loading</ButtonV2>
                    <ButtonV2 variant="primary" disabled>Disabled</ButtonV2>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Special Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <ButtonV2.FAB icon={<IconSystem.PlusIcon />} />
                    <ButtonV2.IconButton icon={<IconSystem.HeartIcon />} />
                    <ButtonV2.ToggleButton>Toggle</ButtonV2.ToggleButton>
                    <ButtonV2.SplitButton>
                      Split Action
                    </ButtonV2.SplitButton>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Button Group</h3>
                  <ButtonV2.ButtonGroup>
                    <ButtonV2 variant="outline">Left</ButtonV2>
                    <ButtonV2 variant="outline">Center</ButtonV2>
                    <ButtonV2 variant="outline">Right</ButtonV2>
                  </ButtonV2.ButtonGroup>
                </div>
              </div>
            </Section>
          </Container>
        )}
        
        {activeTab === 'forms' && (
          <Container className="py-12">
            <Section>
              <h2 className="text-3xl font-bold mb-8">Form Elements</h2>
              
              <Grid cols={2} gap="lg">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Checkboxes</label>
                    <div className="space-y-2">
                      <FormElements.Checkbox label="Option 1" defaultChecked />
                      <FormElements.Checkbox label="Option 2" />
                      <FormElements.Checkbox label="Disabled" disabled />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Radio Buttons</label>
                    <div className="space-y-2">
                      <FormElements.RadioButton name="radio" label="Choice A" defaultChecked />
                      <FormElements.RadioButton name="radio" label="Choice B" />
                      <FormElements.RadioButton name="radio" label="Choice C" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Switches</label>
                    <div className="space-y-3">
                      <FormElements.Switch label="Small" size="sm" />
                      <FormElements.Switch label="Medium" defaultChecked />
                      <FormElements.Switch label="Large" size="lg" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Range Slider</label>
                    <FormElements.RangeSlider min={0} max={100} defaultValue={50} />
                  </div>
                </div>
              </Grid>
            </Section>
          </Container>
        )}
        
        {activeTab === 'dataviz' && (
          <Container className="py-12">
            <Section>
              <h2 className="text-3xl font-bold mb-8">Data Visualization</h2>
              
              <Grid cols={2} gap="lg">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Progress Indicators</h3>
                    <div className="space-y-4">
                      <DataViz.LinearProgress value={75} max={100} />
                      <DataViz.WaveProgress value={60} max={100} />
                      <div className="flex gap-4">
                        <DataViz.CircularProgress value={80} max={100} />
                        <DataViz.CircularProgress value={45} max={100} size={80} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Status Indicators</h3>
                    <div className="flex flex-wrap gap-4">
                      <DataViz.HealthIndicator status="healthy" label="API" />
                      <DataViz.HealthIndicator status="warning" label="Database" />
                      <DataViz.HealthIndicator status="error" label="Cache" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Charts</h3>
                  <DataViz.BarChart 
                    data={[
                      { label: 'Mon', value: 30 },
                      { label: 'Tue', value: 45 },
                      { label: 'Wed', value: 60 },
                      { label: 'Thu', value: 35 },
                      { label: 'Fri', value: 80 },
                    ]}
                    height={200}
                  />
                </div>
              </Grid>
            </Section>
          </Container>
        )}
        
        {activeTab === 'icons' && (
          <Container className="py-12">
            <Section>
              <h2 className="text-3xl font-bold mb-8">Icon System</h2>
              
              <div className="grid grid-cols-8 gap-4">
                {Object.entries(IconSystem).slice(0, 32).map(([name, Icon]) => (
                  <div key={name} className="flex flex-col items-center p-4 rounded-lg hover:bg-neutral-100 transition-colors">
                    <Icon size={24} />
                    <span className="text-xs mt-2 text-neutral-600">{name.replace('Icon', '')}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold mt-12 mb-4">Loading Spinners</h3>
              <div className="flex flex-wrap gap-8">
                <LoadingSpinners.CircularSpinner size={32} />
                <LoadingSpinners.DotsSpinner size={32} />
                <LoadingSpinners.TriangleSpinner size={32} />
                <LoadingSpinners.HexagonSpinner size={32} />
                <LoadingSpinners.WaveSpinner size={32} />
              </div>
            </Section>
          </Container>
        )}
      </main>
    </div>
  );
};
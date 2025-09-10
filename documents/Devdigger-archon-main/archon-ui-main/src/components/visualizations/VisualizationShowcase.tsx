import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  OracleProgressSphere,
  MysticScrollProgress,
  CrawlingDepthGauge,
  OracleChart,
  KnowledgeExcavationMap,
  GlassmorphismContainer,
  useVisualizationData
} from './index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Eye, Sparkles, Database, TrendingUp } from 'lucide-react';
import type { ChartDataPoint, ExcavationNode } from './index';

interface VisualizationShowcaseProps {
  className?: string;
}

export const VisualizationShowcase: React.FC<VisualizationShowcaseProps> = ({
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('progress');
  const [progress, setProgress] = useState(0);
  const [crawlDepth, setCrawlDepth] = useState(0);

  // Sample data for charts
  const sampleChartData: ChartDataPoint[] = [
    { id: '1', label: 'Documents', value: 125, category: 'content', color: '#60a5fa' },
    { id: '2', label: 'Code Files', value: 89, category: 'code', color: '#34d399' },
    { id: '3', label: 'Images', value: 67, category: 'media', color: '#a855f7' },
    { id: '4', label: 'Data Files', value: 43, category: 'data', color: '#f59e0b' },
    { id: '5', label: 'Archives', value: 21, category: 'archive', color: '#ef4444' }
  ];

  // Sample excavation nodes
  const excavationNodes: ExcavationNode[] = [
    {
      id: '1',
      type: 'source',
      label: 'Main Website',
      value: 100,
      x: 150,
      y: 50,
      depth: 0,
      connections: ['2', '3'],
      metadata: { quality: 0.95, size: 1000 }
    },
    {
      id: '2',
      type: 'document',
      label: 'API Docs',
      value: 85,
      x: 100,
      y: 150,
      depth: 1,
      connections: ['4', '5'],
      metadata: { quality: 0.88, size: 500 }
    },
    {
      id: '3',
      type: 'document',
      label: 'User Guide',
      value: 75,
      x: 200,
      y: 150,
      depth: 1,
      connections: ['6'],
      metadata: { quality: 0.82, size: 300 }
    },
    {
      id: '4',
      type: 'code',
      label: 'Examples',
      value: 65,
      x: 50,
      y: 250,
      depth: 2,
      connections: ['7'],
      metadata: { quality: 0.79, size: 200 }
    },
    {
      id: '5',
      type: 'chunk',
      label: 'API Reference',
      value: 55,
      x: 150,
      y: 250,
      depth: 2,
      connections: [],
      metadata: { quality: 0.75, size: 150 }
    },
    {
      id: '6',
      type: 'knowledge',
      label: 'Best Practices',
      value: 90,
      x: 250,
      y: 250,
      depth: 2,
      connections: [],
      metadata: { quality: 0.92, size: 400 }
    },
    {
      id: '7',
      type: 'knowledge',
      label: 'Patterns',
      value: 80,
      x: 100,
      y: 350,
      depth: 3,
      connections: [],
      metadata: { quality: 0.85, size: 250 }
    }
  ];

  // Sample progress steps
  const progressSteps = [
    'Initializing crawl',
    'Discovering pages',
    'Extracting content',
    'Processing data',
    'Storing results'
  ];

  // Animate progress over time
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 2));
      setCrawlDepth(prev => {
        const newDepth = Math.floor(progress / 20);
        return Math.min(5, newDepth);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [progress]);

  const currentStep = Math.floor((progress / 100) * (progressSteps.length - 1));

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DevDigger Oracle Visualizations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Mystical data visualization components with world-class aesthetics
          </p>
        </motion.div>

        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Oracle-themed
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Animated
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Interactive
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="depth">Depth</TabsTrigger>
          <TabsTrigger value="excavation">Excavation</TabsTrigger>
          <TabsTrigger value="glassmorphism">Glassmorphism</TabsTrigger>
        </TabsList>

        {/* Progress Visualizations */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassmorphismContainer variant="medium" glowColor="#60a5fa">
              <Card>
                <CardHeader>
                  <CardTitle>Oracle Progress Sphere</CardTitle>
                  <CardDescription>
                    Crystal ball progress with mystical effects
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-8">
                  <OracleProgressSphere
                    progress={progress}
                    label="Knowledge Extraction"
                    size="lg"
                    variant="crystal"
                    isActive={progress < 100}
                    showEnergyRings={true}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="medium" glowColor="#34d399">
              <Card>
                <CardHeader>
                  <CardTitle>Mystic Scroll Progress</CardTitle>
                  <CardDescription>
                    Ancient scroll unrolling with progress steps
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-4">
                  <MysticScrollProgress
                    progress={progress}
                    steps={progressSteps}
                    currentStep={currentStep}
                    label="Data Processing"
                    variant="ancient"
                    isUnrolling={progress < 100}
                    showQuill={true}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>
          </div>

          <GlassmorphismContainer variant="strong" glowColor="#a855f7">
            <Card>
              <CardHeader>
                <CardTitle>Multiple Variants</CardTitle>
                <CardDescription>
                  Different mystical themes and sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-items-center">
                  <OracleProgressSphere
                    progress={progress}
                    label="Crystal"
                    size="md"
                    variant="crystal"
                    isActive={progress < 100}
                  />
                  <OracleProgressSphere
                    progress={progress}
                    label="Energy"
                    size="md"
                    variant="energy"
                    isActive={progress < 100}
                  />
                  <OracleProgressSphere
                    progress={progress}
                    label="Mystic"
                    size="md"
                    variant="mystic"
                    isActive={progress < 100}
                  />
                  <OracleProgressSphere
                    progress={progress}
                    label="Void"
                    size="md"
                    variant="void"
                    isActive={progress < 100}
                  />
                </div>
              </CardContent>
            </Card>
          </GlassmorphismContainer>
        </TabsContent>

        {/* Charts */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassmorphismContainer variant="medium" glowColor="#60a5fa">
              <Card>
                <CardHeader>
                  <CardTitle>Oracle Bar Chart</CardTitle>
                  <CardDescription>
                    Animated bar chart with mystical effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OracleChart
                    data={sampleChartData}
                    type="bar"
                    variant="crystal"
                    showAnimation={true}
                    showTooltip={true}
                    interactive={true}
                    width={350}
                    height={250}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="medium" glowColor="#34d399">
              <Card>
                <CardHeader>
                  <CardTitle>Oracle Pie Chart</CardTitle>
                  <CardDescription>
                    Mystical pie chart with energy flows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OracleChart
                    data={sampleChartData}
                    type="pie"
                    variant="energy"
                    showAnimation={true}
                    showTooltip={true}
                    interactive={true}
                    width={350}
                    height={250}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="medium" glowColor="#a855f7">
              <Card>
                <CardHeader>
                  <CardTitle>Oracle Line Chart</CardTitle>
                  <CardDescription>
                    Flowing line chart with particle effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OracleChart
                    data={sampleChartData}
                    type="line"
                    variant="mystic"
                    showAnimation={true}
                    showTooltip={true}
                    interactive={true}
                    width={350}
                    height={250}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="medium" glowColor="#f59e0b">
              <Card>
                <CardHeader>
                  <CardTitle>Oracle Radar Chart</CardTitle>
                  <CardDescription>
                    Multi-dimensional radar with void theme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OracleChart
                    data={sampleChartData}
                    type="radar"
                    variant="void"
                    showAnimation={true}
                    showTooltip={true}
                    interactive={true}
                    width={350}
                    height={250}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>
          </div>
        </TabsContent>

        {/* Crawling Depth */}
        <TabsContent value="depth" className="space-y-6">
          <GlassmorphismContainer variant="strong" glowColor="#d2691e">
            <Card>
              <CardHeader>
                <CardTitle>Crawling Depth Gauge</CardTitle>
                <CardDescription>
                  Underground mining visualization with layer exploration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CrawlingDepthGauge
                  currentDepth={crawlDepth}
                  maxDepth={5}
                  totalPages={150}
                  processedPages={Math.floor(progress * 1.5)}
                  status={progress >= 100 ? 'completed' : 'crawling'}
                  variant="underground"
                  showWaveEffect={true}
                  layers={[
                    { depth: 1, label: 'Surface Layer', count: 25, isActive: crawlDepth >= 1 },
                    { depth: 2, label: 'Content Layer', count: 45, isActive: crawlDepth >= 2 },
                    { depth: 3, label: 'Data Layer', count: 35, isActive: crawlDepth >= 3 },
                    { depth: 4, label: 'Code Layer', count: 28, isActive: crawlDepth >= 4 },
                    { depth: 5, label: 'Knowledge Core', count: 17, isActive: crawlDepth >= 5 }
                  ]}
                />
              </CardContent>
            </Card>
          </GlassmorphismContainer>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassmorphismContainer variant="medium" glowColor="#4682b4">
              <Card>
                <CardHeader>
                  <CardTitle>Ocean Depths</CardTitle>
                  <CardDescription>
                    Deep sea exploration variant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CrawlingDepthGauge
                    currentDepth={crawlDepth}
                    maxDepth={5}
                    totalPages={100}
                    processedPages={Math.floor(progress)}
                    status={progress >= 100 ? 'completed' : 'processing'}
                    variant="ocean"
                    showWaveEffect={true}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="medium" glowColor="#9370db">
              <Card>
                <CardHeader>
                  <CardTitle>Mystical Realm</CardTitle>
                  <CardDescription>
                    Ethereal exploration theme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CrawlingDepthGauge
                    currentDepth={crawlDepth}
                    maxDepth={5}
                    totalPages={80}
                    processedPages={Math.floor(progress * 0.8)}
                    status={progress >= 100 ? 'completed' : 'crawling'}
                    variant="space"
                    showWaveEffect={true}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>
          </div>
        </TabsContent>

        {/* Knowledge Excavation */}
        <TabsContent value="excavation" className="space-y-6">
          <GlassmorphismContainer variant="strong" glowColor="#daa520">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Excavation Map</CardTitle>
                <CardDescription>
                  Interactive mining map with connected knowledge nodes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <KnowledgeExcavationMap
                  nodes={excavationNodes}
                  width={700}
                  height={400}
                  showConnections={true}
                  showDepthLayers={true}
                  variant="mining"
                  onNodeClick={(node) => console.log('Clicked node:', node)}
                  onNodeHover={(node) => console.log('Hovered node:', node)}
                />
              </CardContent>
            </Card>
          </GlassmorphismContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassmorphismContainer variant="medium" glowColor="#cd853f">
              <Card>
                <CardHeader>
                  <CardTitle>Archaeological</CardTitle>
                  <CardDescription>Historical dig site</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <KnowledgeExcavationMap
                    nodes={excavationNodes.slice(0, 5)}
                    width={250}
                    height={200}
                    variant="archaeological"
                    showConnections={false}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="medium" glowColor="#87ceeb">
              <Card>
                <CardHeader>
                  <CardTitle>Geological</CardTitle>
                  <CardDescription>Rock formation study</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <KnowledgeExcavationMap
                    nodes={excavationNodes.slice(0, 5)}
                    width={250}
                    height={200}
                    variant="geological"
                    showConnections={false}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="medium" glowColor="#da70d6">
              <Card>
                <CardHeader>
                  <CardTitle>Mystical</CardTitle>
                  <CardDescription>Ethereal exploration</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <KnowledgeExcavationMap
                    nodes={excavationNodes.slice(0, 5)}
                    width={250}
                    height={200}
                    variant="mystical"
                    showConnections={false}
                  />
                </CardContent>
              </Card>
            </GlassmorphismContainer>
          </div>
        </TabsContent>

        {/* Glassmorphism Effects */}
        <TabsContent value="glassmorphism" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassmorphismContainer variant="subtle" glowColor="#60a5fa" animated={true}>
              <Card>
                <CardHeader>
                  <CardTitle>Subtle Glassmorphism</CardTitle>
                  <CardDescription>
                    Light glass effect with gentle animations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-blue-600">125</div>
                    <div className="text-gray-600">Documents Processed</div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="strong" glowColor="#34d399" animated={true}>
              <Card>
                <CardHeader>
                  <CardTitle>Strong Glassmorphism</CardTitle>
                  <CardDescription>
                    Intense glass effect with dynamic particles
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-green-600">89</div>
                    <div className="text-gray-600">Code Files Found</div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progress * 0.7}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="ethereal" glowColor="#a855f7" animated={true}>
              <Card>
                <CardHeader>
                  <CardTitle>Ethereal Glassmorphism</CardTitle>
                  <CardDescription>
                    Mystical glass effect with magical particles
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-purple-600">67</div>
                    <div className="text-gray-600">Knowledge Chunks</div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progress * 0.5}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GlassmorphismContainer>

            <GlassmorphismContainer variant="medium" glowColor="#f59e0b" animated={true} interactive={true}>
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Glass</CardTitle>
                  <CardDescription>
                    Hover for enhanced effects and interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-yellow-600">43</div>
                    <div className="text-gray-600">Data Insights</div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progress * 0.3}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GlassmorphismContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
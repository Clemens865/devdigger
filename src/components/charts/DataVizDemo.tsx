import React from 'react';
import DataViz from './DataViz';

// Demo component showcasing all DataViz components
const DataVizDemo: React.FC = () => {
  // Sample data for demonstrations
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    values: [120, 190, 150, 220, 180],
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  };

  const networkNodes = [
    { id: '1', label: 'API', x: 0.2, y: 0.3, connections: ['2', '3'], status: 'active' as const },
    { id: '2', label: 'DB', x: 0.7, y: 0.2, connections: ['1', '4'], status: 'active' as const },
    { id: '3', label: 'Cache', x: 0.5, y: 0.6, connections: ['1', '4'], status: 'processing' as const },
    { id: '4', label: 'UI', x: 0.8, y: 0.7, connections: ['2', '3'], status: 'active' as const }
  ];

  const heatmapData = [
    [5, 10, 15, 8],
    [12, 20, 18, 14],
    [8, 16, 22, 19],
    [15, 12, 9, 11]
  ];

  const sparklineData = [10, 12, 15, 8, 20, 18, 25, 22, 19, 24, 28, 26];

  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '40px', 
        color: '#1f2937',
        fontSize: '32px',
        fontWeight: '700'
      }}>
        DevDigger Data Visualization Components
      </h1>
      
      {/* Progress Indicators Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#374151', marginBottom: '24px', fontSize: '24px' }}>
          Progress Indicators
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <DataViz.LinearProgress 
            value={75} 
            max={100} 
            segments={4}
            label="Project Completion"
            color="#10b981"
          />
          <DataViz.CircularProgress 
            value={68} 
            max={100} 
            label="Performance"
            color="#3b82f6"
            size={140}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <DataViz.StepProgress 
            steps={['Planning', 'Development', 'Testing', 'Deployment']}
            currentStep={2}
          />
        </div>
        
        <div style={{ height: '120px', marginBottom: '24px' }}>
          <DataViz.WaveProgress 
            value={45} 
            max={100} 
            label="Memory Usage"
            color="#06b6d4"
            height={120}
          />
        </div>
      </section>

      {/* Status Displays Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#374151', marginBottom: '24px', fontSize: '24px' }}>
          Status Displays
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <DataViz.HealthIndicator 
            status="healthy"
            label="API Server"
            value={99.9}
            details="All systems operational"
          />
          <DataViz.HealthIndicator 
            status="warning"
            label="Database"
            value={85.2}
            details="High load detected"
          />
          <DataViz.HealthIndicator 
            status="error"
            label="Cache Service"
            details="Connection timeout"
          />
        </div>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <DataViz.Sparkline 
            data={sparklineData}
            color="#10b981"
            width={120}
            height={40}
          />
          <DataViz.PerformanceGauge 
            value={78}
            max={100}
            label="CPU Usage"
            thresholds={{ warning: 70, critical: 90 }}
          />
        </div>
      </section>

      {/* Data Charts Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#374151', marginBottom: '24px', fontSize: '24px' }}>
          Data Charts
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          <div style={{ height: '250px' }}>
            <DataViz.BarChart 
              labels={chartData.labels}
              values={chartData.values}
              colors={chartData.colors}
              height={250}
            />
          </div>
          <DataViz.DonutChart 
            labels={['Frontend', 'Backend', 'Database', 'DevOps']}
            values={[35, 25, 20, 20]}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
            size={220}
          />
        </div>
        
        <div style={{ marginTop: '32px' }}>
          <DataViz.Heatmap 
            data={heatmapData}
            labels={{
              x: ['Mon', 'Tue', 'Wed', 'Thu'],
              y: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
            }}
          />
        </div>
      </section>

      {/* Metric Displays Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#374151', marginBottom: '24px', fontSize: '24px' }}>
          Metric Displays
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <DataViz.KPICard 
            title="Total Revenue"
            value={124500}
            change={12.5}
            format="currency"
            color="#10b981"
          />
          <DataViz.KPICard 
            title="Active Users"
            value={8420}
            change={-3.2}
            changeType="percentage"
            color="#3b82f6"
          />
          <DataViz.KPICard 
            title="Conversion Rate"
            value={4.2}
            change={0.8}
            format="percentage"
            color="#f59e0b"
          />
          <DataViz.AnimatedNumber 
            value={1250}
            previousValue={1100}
            target={1500}
            unit=""
            trend="up"
            suffix=" users"
          />
        </div>
      </section>

      {/* Special Visualizations Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#374151', marginBottom: '24px', fontSize: '24px' }}>
          Special Visualizations
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          <DataViz.NetworkGraph 
            nodes={networkNodes}
            width={400}
            height={300}
          />
        </div>
      </section>

      {/* Usage Examples */}
      <section style={{ 
        marginTop: '60px', 
        padding: '24px', 
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <h3 style={{ color: '#374151', marginBottom: '16px' }}>Usage Examples</h3>
        <pre style={{ 
          background: '#f8fafc', 
          padding: '16px', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1f2937',
          overflow: 'auto'
        }}>
{`// Import the DataViz components
import DataViz from './components/charts/DataViz';

// Use individual components
<DataViz.LinearProgress value={75} max={100} label="Progress" />
<DataViz.CircularProgress value={68} max={100} size={120} />
<DataViz.BarChart labels={labels} values={values} />
<DataViz.KPICard title="Revenue" value={124500} format="currency" />
<DataViz.HealthIndicator status="healthy" label="API Server" />
<DataViz.NetworkGraph nodes={networkData} width={400} height={300} />

// All components support customization through props:
// - Colors, sizes, labels
// - Animation durations
// - Custom formatting
// - Responsive design
// - Accessibility features`}
        </pre>
      </section>
    </div>
  );
};

export default DataVizDemo;
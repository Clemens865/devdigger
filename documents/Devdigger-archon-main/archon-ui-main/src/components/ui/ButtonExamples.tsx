import React, { useState } from 'react';
import { PremiumButton } from './PremiumButton';
import { ButtonGroup, SegmentedControl, FloatingActionButton, SplitButton } from './ButtonGroup';

// Icon components for examples (you can replace with your icon library)
const PlayIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-3-9v18" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

/**
 * ButtonExamples - Comprehensive showcase of all button variants
 * 
 * This component demonstrates all button styles, states, and features
 * for the DevDigger premium button system.
 */
export const ButtonExamples: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [segmentValue, setSegmentValue] = useState('design');

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const handleProgressDemo = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setProgress(0), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const segmentOptions = [
    { value: 'design', label: 'Design', icon: <PlayIcon /> },
    { value: 'develop', label: 'Develop', icon: <SettingsIcon /> },
    { value: 'deploy', label: 'Deploy', icon: <DownloadIcon /> }
  ];

  return (
    <div className="p-8 space-y-12 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Premium Button System
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Gallery-quality interactive elements designed for sophisticated user experiences.
          Each button variant serves a specific purpose in the interface hierarchy.
        </p>
      </div>

      {/* Button Hierarchy */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Button Hierarchy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Primary Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Primary Actions</h3>
            <div className="space-y-3">
              <PremiumButton variant="primary" size="large" glow magnetic>
                COMMENCE
              </PremiumButton>
              <PremiumButton variant="primary" icon={<PlayIcon />}>
                Get Started
              </PremiumButton>
              <PremiumButton variant="primary" size="small" shape="geometric">
                Submit
              </PremiumButton>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Secondary Actions</h3>
            <div className="space-y-3">
              <PremiumButton variant="secondary" size="large">
                Learn More
              </PremiumButton>
              <PremiumButton variant="secondary" icon={<SettingsIcon />}>
                Settings
              </PremiumButton>
              <PremiumButton variant="secondary" size="small" shape="pill">
                Cancel
              </PremiumButton>
            </div>
          </div>

          {/* Tertiary & Ghost */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Low Emphasis</h3>
            <div className="space-y-3">
              <PremiumButton variant="tertiary" size="large">
                View Details
              </PremiumButton>
              <PremiumButton variant="ghost" icon={<DownloadIcon />}>
                Download
              </PremiumButton>
              <PremiumButton variant="ghost" size="small">
                Skip
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>

      {/* Special Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Special Variants</h2>
        
        <div className="flex flex-wrap gap-4">
          <PremiumButton 
            variant="oracle" 
            size="large" 
            glow 
            magnetic 
            ripple
            icon={<PlayIcon />}
          >
            Divine Inspiration
          </PremiumButton>
          
          <PremiumButton 
            variant="danger" 
            icon={<TrashIcon />}
            glow
          >
            Delete Project
          </PremiumButton>
        </div>
      </section>

      {/* Interactive States */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Interactive States</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Loading States */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Loading States</h3>
            <div className="space-y-3">
              <PremiumButton 
                variant="primary" 
                loading={loading} 
                loadingText="Processing..."
                onClick={handleLoadingDemo}
              >
                Start Process
              </PremiumButton>
              <PremiumButton variant="secondary" loading>
                Loading...
              </PremiumButton>
            </div>
          </div>

          {/* Progress Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Progress Buttons</h3>
            <div className="space-y-3">
              <PremiumButton 
                variant="primary" 
                progress={progress}
                onClick={handleProgressDemo}
              >
                Upload Files ({progress}%)
              </PremiumButton>
              <PremiumButton variant="secondary" progress={75}>
                Sync Progress
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>

      {/* Size System */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Size System</h2>
        
        <div className="flex flex-wrap items-end gap-4">
          <PremiumButton variant="primary" size="tiny">Tiny</PremiumButton>
          <PremiumButton variant="primary" size="small">Small</PremiumButton>
          <PremiumButton variant="primary" size="medium">Medium</PremiumButton>
          <PremiumButton variant="primary" size="large">Large</PremiumButton>
          <PremiumButton variant="primary" size="xl">Extra Large</PremiumButton>
        </div>
      </section>

      {/* Shape Variations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Shape Variations</h2>
        
        <div className="flex flex-wrap gap-4">
          <PremiumButton variant="primary" shape="rounded">Rounded</PremiumButton>
          <PremiumButton variant="primary" shape="geometric" glow>Geometric</PremiumButton>
          <PremiumButton variant="primary" shape="pill">Pill</PremiumButton>
          <PremiumButton variant="primary" shape="square">Square</PremiumButton>
        </div>
      </section>

      {/* Button Groups */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Button Groups</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Connected Group</h3>
            <ButtonGroup variant="connected">
              <PremiumButton variant="secondary">First</PremiumButton>
              <PremiumButton variant="secondary">Second</PremiumButton>
              <PremiumButton variant="secondary">Third</PremiumButton>
            </ButtonGroup>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Spaced Group</h3>
            <ButtonGroup variant="spaced">
              <PremiumButton variant="tertiary" icon={<PlayIcon />}>Play</PremiumButton>
              <PremiumButton variant="tertiary" icon={<SettingsIcon />}>Settings</PremiumButton>
              <PremiumButton variant="tertiary" icon={<DownloadIcon />}>Download</PremiumButton>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Segmented Control */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Segmented Control</h2>
        
        <div className="space-y-4">
          <SegmentedControl
            options={segmentOptions}
            value={segmentValue}
            onChange={setSegmentValue}
            size="medium"
          />
          
          <SegmentedControl
            options={segmentOptions}
            value={segmentValue}
            onChange={setSegmentValue}
            size="large"
            fullWidth
          />
        </div>
      </section>

      {/* Split Button */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Split Buttons</h2>
        
        <div className="flex flex-wrap gap-4">
          <SplitButton
            onMainClick={() => console.log('Main action')}
            onDropdownClick={() => console.log('Dropdown clicked')}
            variant="primary"
          >
            Publish
          </SplitButton>
          
          <SplitButton
            onMainClick={() => console.log('Secondary action')}
            onDropdownClick={() => console.log('Secondary dropdown')}
            variant="secondary"
            size="large"
          >
            Export Data
          </SplitButton>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Icon Buttons</h2>
        
        <div className="flex flex-wrap gap-4">
          <PremiumButton 
            variant="primary" 
            icon={<AddIcon />} 
            iconPosition="only"
            shape="pill"
            glow
            aria-label="Add item"
          />
          <PremiumButton 
            variant="secondary" 
            icon={<SettingsIcon />} 
            iconPosition="only"
            shape="geometric"
            aria-label="Settings"
          />
          <PremiumButton 
            variant="danger" 
            icon={<TrashIcon />} 
            iconPosition="only"
            shape="square"
            aria-label="Delete"
          />
        </div>
      </section>

      {/* Floating Action Button (positioned absolutely) */}
      <FloatingActionButton
        onClick={() => console.log('FAB clicked')}
        position="bottom-right"
        size="large"
        variant="primary"
        extended
      >
        <AddIcon />
        Create New
      </FloatingActionButton>

      {/* Usage Guidelines */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Usage Guidelines</h2>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3>Button Hierarchy Best Practices</h3>
            <ul>
              <li><strong>Primary:</strong> Use for main CTAs like "COMMENCE", "SUBMIT", "GET STARTED" - limit to 1-2 per page</li>
              <li><strong>Secondary:</strong> Supporting actions like "Learn More", "Settings" - can have multiple</li>
              <li><strong>Tertiary:</strong> Low-emphasis actions like "View Details", "Cancel" - subtle presence</li>
              <li><strong>Ghost:</strong> Minimal actions that don't distract from primary content</li>
              <li><strong>Oracle:</strong> Special mystical-themed buttons for unique app features</li>
              <li><strong>Danger:</strong> Destructive actions like "Delete" - use sparingly with confirmation</li>
            </ul>

            <h3>Accessibility Features</h3>
            <ul>
              <li>Focus-visible rings with appropriate contrast ratios</li>
              <li>Proper ARIA labels for icon-only buttons</li>
              <li>Reduced motion support for users with vestibular disorders</li>
              <li>High contrast mode compatibility</li>
              <li>Keyboard navigation with proper focus management</li>
            </ul>

            <h3>Performance Considerations</h3>
            <ul>
              <li>Hardware-accelerated CSS animations using transform and opacity</li>
              <li>Debounced interaction handlers to prevent excessive re-renders</li>
              <li>Lazy loading of complex animations until user interaction</li>
              <li>Optimized gradient and shadow rendering</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
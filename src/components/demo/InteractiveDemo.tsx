import React, { useState } from 'react';
import { 
  ButtonV2, 
  FloatingActionButton, 
  IconButton, 
  ButtonGroup, 
  ToggleButton 
} from '../ui/ButtonV2';
import { 
  Checkbox, 
  Radio, 
  RadioGroup, 
  Switch, 
  RangeSlider, 
  SplitButton, 
  FileUpload 
} from '../ui/FormElements';
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  HeartIcon, 
  StarIcon,
  BoltIcon,
  PlusIcon,
  DownloadIcon,
  ShareIcon,
  SettingsIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

const InteractiveDemo: React.FC = () => {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [radioValue, setRadioValue] = useState('option1');
  const [sliderValue, setSliderValue] = useState(50);
  const [splitDropdownOpen, setSplitDropdownOpen] = useState(false);

  const handleToggle = (key: string) => {
    setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSwitch = (key: string) => {
    setSwitchStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      console.log('Selected files:', Array.from(files).map(f => f.name));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interactive Elements Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            DevDigger's sophisticated button system and form elements
          </p>
        </div>

        {/* Button Variants */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Button Variants
          </h2>
          
          {/* Basic Variants */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Basic Variants
            </h3>
            <div className="flex flex-wrap gap-4">
              <ButtonV2 variant="primary">Primary</ButtonV2>
              <ButtonV2 variant="secondary">Secondary</ButtonV2>
              <ButtonV2 variant="ghost">Ghost</ButtonV2>
              <ButtonV2 variant="outline">Outline</ButtonV2>
              <ButtonV2 variant="text">Text</ButtonV2>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonV2 size="xs">Extra Small</ButtonV2>
              <ButtonV2 size="sm">Small</ButtonV2>
              <ButtonV2 size="md">Medium</ButtonV2>
              <ButtonV2 size="lg">Large</ButtonV2>
            </div>
          </div>

          {/* With Icons */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              With Icons
            </h3>
            <div className="flex flex-wrap gap-4">
              <ButtonV2 icon={<PlayIcon className="w-4 h-4" />} iconPosition="left">
                Play
              </ButtonV2>
              <ButtonV2 icon={<DownloadIcon className="w-4 h-4" />} iconPosition="right" variant="outline">
                Download
              </ButtonV2>
              <ButtonV2 icon={<HeartIcon className="w-4 h-4" />} variant="ghost" />
            </div>
          </div>

          {/* Special Effects */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Special Effects
            </h3>
            <div className="flex flex-wrap gap-4">
              <ButtonV2 gradient glow className="button-gradient-border">
                Gradient Border
              </ButtonV2>
              <ButtonV2 className="button-glass" variant="ghost">
                Glassmorphism
              </ButtonV2>
              <ButtonV2 className="button-neuro depth-3d">
                Neumorphic 3D
              </ButtonV2>
              <ButtonV2 className="animate-float" variant="primary">
                Floating
              </ButtonV2>
            </div>
          </div>

          {/* States */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              States
            </h3>
            <div className="flex flex-wrap gap-4">
              <ButtonV2 loading>Loading</ButtonV2>
              <ButtonV2 disabled>Disabled</ButtonV2>
              <ButtonV2 variant="primary" className="animate-pulse-border">
                Pulsing
              </ButtonV2>
            </div>
          </div>
        </section>

        {/* Special Button Types */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Special Button Types
          </h2>

          {/* Icon Buttons */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Icon Buttons with Tooltips
            </h3>
            <div className="flex flex-wrap gap-4">
              <IconButton tooltip="Play video" variant="primary">
                <PlayIcon className="w-5 h-5" />
              </IconButton>
              <IconButton tooltip="Favorite" variant="ghost" tooltipPosition="bottom">
                <HeartIcon className="w-5 h-5" />
              </IconButton>
              <IconButton tooltip="Settings" variant="outline" tooltipPosition="left">
                <SettingsIcon className="w-5 h-5" />
              </IconButton>
              <IconButton tooltip="Share" variant="secondary" tooltipPosition="right">
                <ShareIcon className="w-5 h-5" />
              </IconButton>
            </div>
          </div>

          {/* Button Groups */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Button Groups
            </h3>
            <div className="space-y-4">
              <ButtonGroup>
                <ButtonV2>First</ButtonV2>
                <ButtonV2>Second</ButtonV2>
                <ButtonV2>Third</ButtonV2>
              </ButtonGroup>
              <ButtonGroup orientation="vertical" variant="outline">
                <ButtonV2>Top</ButtonV2>
                <ButtonV2>Middle</ButtonV2>
                <ButtonV2>Bottom</ButtonV2>
              </ButtonGroup>
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Toggle Buttons
            </h3>
            <div className="flex flex-wrap gap-4">
              <ToggleButton
                pressed={toggleStates.bold || false}
                onPressedChange={() => handleToggle('bold')}
              >
                Bold
              </ToggleButton>
              <ToggleButton
                pressed={toggleStates.italic || false}
                onPressedChange={() => handleToggle('italic')}
                variant="ghost"
              >
                Italic
              </ToggleButton>
              <ToggleButton
                pressed={toggleStates.underline || false}
                onPressedChange={() => handleToggle('underline')}
                variant="outline"
                icon={<StarIcon className="w-4 h-4" />}
              >
                Star
              </ToggleButton>
            </div>
          </div>

          {/* Split Button */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Split Button
            </h3>
            <SplitButton
              onClick={() => console.log('Main action')}
              onDropdownClick={() => setSplitDropdownOpen(!splitDropdownOpen)}
              dropdownOpen={splitDropdownOpen}
              dropdownContent={
                <div className="py-1">
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Action 1
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Action 2
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Action 3
                  </button>
                </div>
              }
            >
              Split Action
            </SplitButton>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Form Elements
          </h2>

          {/* Checkboxes */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Checkboxes
            </h3>
            <div className="space-y-4">
              <Checkbox 
                label="Accept terms and conditions" 
                description="Please read and accept our terms and conditions to continue"
              />
              <Checkbox 
                label="Subscribe to newsletter" 
                description="Get updates about new features and releases"
              />
              <Checkbox 
                label="Enable notifications" 
                indeterminate={true}
              />
            </div>
          </div>

          {/* Radio Buttons */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Radio Buttons
            </h3>
            <RadioGroup
              name="options"
              value={radioValue}
              onValueChange={setRadioValue}
            >
              <Radio 
                value="option1"
                label="Option 1"
                description="This is the first option"
              />
              <Radio 
                value="option2"
                label="Option 2" 
                description="This is the second option"
              />
              <Radio 
                value="option3"
                label="Option 3"
                description="This is the third option"
              />
            </RadioGroup>
          </div>

          {/* Switches */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Switches
            </h3>
            <div className="space-y-4">
              <Switch
                size="sm"
                label="Dark mode"
                description="Toggle between light and dark theme"
                checked={switchStates.darkMode || false}
                onChange={() => handleSwitch('darkMode')}
              />
              <Switch
                size="md"
                label="Email notifications"
                description="Receive email updates about your account"
                checked={switchStates.email || false}
                onChange={() => handleSwitch('email')}
              />
              <Switch
                size="lg"
                label="Push notifications"
                description="Receive push notifications on your device"
                checked={switchStates.push || false}
                onChange={() => handleSwitch('push')}
              />
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Range Slider
            </h3>
            <div className="max-w-md">
              <RangeSlider
                label="Volume"
                value={sliderValue}
                min={0}
                max={100}
                step={5}
                formatValue={(value) => `${value}%`}
                onChange={(e) => setSliderValue(Number(e.target.value))}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              File Upload
            </h3>
            <div className="max-w-md">
              <FileUpload
                accept="image/*"
                multiple={true}
                onFileSelect={handleFileSelect}
              />
            </div>
          </div>
        </section>

        {/* Floating Action Button */}
        <FloatingActionButton
          variant="primary"
          size="lg"
          className="animate-float"
        >
          <PlusIcon className="w-6 h-6" />
        </FloatingActionButton>

        {/* Demo Controls */}
        <section className="space-y-8 bg-white dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Interactive Demo Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Button Effects
              </h4>
              <div className="space-y-2">
                <ButtonV2 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    document.querySelectorAll('.button-v2').forEach(btn => {
                      btn.classList.add('haptic-feedback');
                      setTimeout(() => btn.classList.remove('haptic-feedback'), 100);
                    });
                  }}
                >
                  Trigger Haptic Feedback
                </ButtonV2>
                <ButtonV2 
                  size="sm" 
                  variant="ghost"
                  onClick={() => {
                    const buttons = document.querySelectorAll('.button-v2');
                    buttons.forEach((btn, index) => {
                      setTimeout(() => {
                        btn.classList.add('animate-float');
                        setTimeout(() => btn.classList.remove('animate-float'), 3000);
                      }, index * 100);
                    });
                  }}
                >
                  Float All Buttons
                </ButtonV2>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Theme Toggle
              </h4>
              <ButtonGroup>
                <ButtonV2 
                  icon={<SunIcon className="w-4 h-4" />}
                  size="sm"
                  onClick={() => document.documentElement.classList.remove('dark')}
                >
                  Light
                </ButtonV2>
                <ButtonV2 
                  icon={<MoonIcon className="w-4 h-4" />}
                  size="sm"
                  onClick={() => document.documentElement.classList.add('dark')}
                >
                  Dark
                </ButtonV2>
              </ButtonGroup>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Performance Test
              </h4>
              <ButtonV2 
                size="sm" 
                variant="primary"
                className="animate-glow"
                onClick={() => {
                  console.log('Performance test started');
                  const startTime = performance.now();
                  
                  // Simulate heavy interaction
                  for (let i = 0; i < 1000; i++) {
                    const event = new MouseEvent('click', { bubbles: true });
                    document.querySelector('.button-v2')?.dispatchEvent(event);
                  }
                  
                  const endTime = performance.now();
                  console.log(`Performance test completed in ${endTime - startTime}ms`);
                  alert(`Performance test: ${(endTime - startTime).toFixed(2)}ms`);
                }}
              >
                Run Performance Test
              </ButtonV2>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600 dark:text-gray-400">
          <p>
            DevDigger Interactive Elements Demo - Showcasing sophisticated UI components
          </p>
        </footer>
      </div>
    </div>
  );
};

export default InteractiveDemo;
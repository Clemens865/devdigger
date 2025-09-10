import React from 'react';
import { motion } from 'framer-motion';

/**
 * Typography Showcase Component
 * Demonstrates the complete DevDigger typography system
 * with practical implementation examples
 */
function TypographyShowcase() {
  const codeExample = `// Example API response
const discoveries = {
  total: 247,
  analyzed: 156,
  status: "mining",
  timestamp: "2024-01-15T10:30:00Z"
};`;

  return (
    <div className="max-w-6xl mx-auto px-8 py-12 space-y-16">
      
      {/* Display Typography */}
      <section>
        <div className="text-label mb-8">Display Typography</div>
        <div className="space-y-8">
          <h1 className="text-display-1">
            Revolutionary Typography System
          </h1>
          <h2 className="text-display-2">
            Crafted for Digital Excellence
          </h2>
          <h3 className="text-display-3">
            Every Character Matters
          </h3>
        </div>
      </section>

      {/* Heading Hierarchy */}
      <section>
        <div className="text-label mb-8">Heading Hierarchy</div>
        <div className="space-y-6">
          <h1 className="text-heading-1">Primary Section Heading</h1>
          <h2 className="text-heading-2">Secondary Content Heading</h2>
          <h3 className="text-heading-3">Subsection Heading</h3>
          <h4 className="text-heading-4">Label Heading</h4>
        </div>
      </section>

      {/* Body Typography */}
      <section>
        <div className="text-label mb-8">Body Typography</div>
        <div className="space-y-8">
          <div>
            <h3 className="text-heading-3 mb-4">Large Body Text</h3>
            <p className="text-body-large">
              This is large body text designed for introductory paragraphs and important content. 
              It uses Crimson Text, a serif font optimized for reading, with carefully calculated 
              line height and letter spacing for maximum readability. The measure is constrained 
              to optimal line length for comfortable reading.
            </p>
          </div>
          
          <div>
            <h3 className="text-heading-3 mb-4">Standard Body Text</h3>
            <p className="text-body">
              This is standard body text for main content areas. It maintains excellent readability 
              while being more compact than large body text. The typography system automatically 
              adjusts spacing and contrast based on the user's preferences and device capabilities.
            </p>
            <p className="text-body">
              Multiple paragraphs maintain consistent spacing and rhythm throughout the document. 
              The reading experience is optimized for both short bursts of information and 
              longer-form content consumption.
            </p>
          </div>

          <div>
            <h3 className="text-heading-3 mb-4">Small Body Text</h3>
            <p className="text-body-small">
              Small body text is perfect for secondary information, captions, and supplementary 
              content that supports the main narrative without overwhelming the primary message.
            </p>
          </div>
        </div>
      </section>

      {/* Interface Typography */}
      <section>
        <div className="text-label mb-8">Interface Typography</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="text-interface-large mb-3">Large Interface Text</div>
            <div className="text-interface mb-3">Standard Interface Text</div>
            <div className="text-interface-small">Small Interface Text</div>
          </div>
          
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="text-label mb-4">Form Elements</div>
            <div className="space-y-3">
              <div>
                <label className="text-label block mb-2">Input Label</label>
                <input 
                  type="text" 
                  placeholder="Placeholder text"
                  className="w-full p-2 border border-neutral-300 rounded text-interface"
                />
              </div>
              <button className="text-button px-4 py-2 bg-orange-500 text-white rounded">
                Action Button
              </button>
            </div>
          </div>
          
          <div className="p-6 border border-neutral-200 rounded-lg">
            <div className="text-label mb-4">Status & Labels</div>
            <div className="space-y-2">
              <div className="text-caption">Caption text for images</div>
              <div className="text-metadata">metadata • timestamp • version</div>
              <div className="text-success">Success message</div>
              <div className="text-warning">Warning message</div>
              <div className="text-error">Error message</div>
              <div className="text-loading">Loading state</div>
            </div>
          </div>
        </div>
      </section>

      {/* Code & Data Typography */}
      <section>
        <div className="text-label mb-8">Code & Data Typography</div>
        <div className="space-y-8">
          <div>
            <h3 className="text-heading-3 mb-4">Inline Code</h3>
            <p className="text-body">
              Use <code className="text-code-inline">console.log()</code> to debug your application, 
              or access the <code className="text-code-inline">window.electronAPI</code> object 
              for Electron-specific functionality.
            </p>
          </div>
          
          <div>
            <h3 className="text-heading-3 mb-4">Code Block</h3>
            <pre className="text-code-block bg-neutral-100 p-6 rounded-lg overflow-x-auto">
              {codeExample}
            </pre>
          </div>

          <div>
            <h3 className="text-heading-3 mb-4">Data Visualization</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-number-large text-oracle-glow">247</div>
                <div className="text-label mt-2">Total Discoveries</div>
              </div>
              <div className="text-center">
                <div className="text-number">63%</div>
                <div className="text-label mt-2">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-number-small">1.2M</div>
                <div className="text-label mt-2">Data Points</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Oracle Typography */}
      <section>
        <div className="text-label mb-8">Oracle Typography</div>
        <div className="space-y-8 text-center">
          <h2 className="text-display-2 text-oracle-glow">
            The Oracle Reveals Knowledge
          </h2>
          <div className="text-oracle-mystical text-body-large max-w-2xl mx-auto">
            In the depths of digital archaeology, patterns emerge from chaos, 
            and wisdom crystallizes from the vast ocean of information.
          </div>
        </div>
      </section>

      {/* Interactive Typography */}
      <section>
        <div className="text-label mb-8">Interactive Elements</div>
        <div className="space-y-6">
          <div>
            <h3 className="text-heading-3 mb-4">Links & Navigation</h3>
            <p className="text-body">
              Visit our <a href="#" className="text-link">documentation</a> or 
              explore the <a href="#" className="text-link">API reference</a> for 
              detailed implementation guidance.
            </p>
          </div>
          
          <div>
            <h3 className="text-heading-3 mb-4">Button Styles</h3>
            <div className="flex flex-wrap gap-4">
              <button className="text-button px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Primary Action
              </button>
              <button className="text-button px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                Secondary Action
              </button>
              <button className="text-interface text-neutral-500 hover:text-neutral-700 transition-colors">
                Text Button
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Demonstration */}
      <section>
        <div className="text-label mb-8">Responsive Scaling</div>
        <div className="space-y-4">
          <div className="text-caption">
            Typography automatically scales based on viewport size and user preferences.
            Resize your browser window to see fluid scaling in action.
          </div>
          <motion.div 
            className="text-display-3 text-oracle-glow text-center"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Fluid & Responsive
          </motion.div>
        </div>
      </section>

      {/* Typography Guidelines */}
      <section className="border-t border-neutral-200 pt-16">
        <div className="text-label mb-8">Implementation Guidelines</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-heading-3 mb-4">Font Selection</h3>
            <ul className="text-body-small space-y-2">
              <li><strong>Inter</strong> - Primary UI font with excellent legibility</li>
              <li><strong>Crimson Text</strong> - Reading font for long-form content</li>
              <li><strong>JetBrains Mono</strong> - Code font with programming ligatures</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-heading-3 mb-4">Best Practices</h3>
            <ul className="text-body-small space-y-2">
              <li>Use semantic classes (text-heading-1, text-body)</li>
              <li>Maintain consistent vertical rhythm</li>
              <li>Test readability in light and dark themes</li>
              <li>Consider accessibility and contrast ratios</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TypographyShowcase;
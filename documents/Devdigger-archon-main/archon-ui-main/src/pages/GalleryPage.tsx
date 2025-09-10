import React, { useState } from 'react';

export function GalleryPage() {
  const [url, setUrl] = useState('https://docs.react.dev');
  const [isActive, setIsActive] = useState(false);
  const [depth, setDepth] = useState('3 layers');
  const [strategy, setStrategy] = useState('Documentation');
  const [quality, setQuality] = useState('Standard');

  const handleCommence = () => {
    setIsActive(true);
    // Trigger actual crawling logic here
    setTimeout(() => setIsActive(false), 5000); // Simulate operation
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="text-center mb-24 mt-12">
        <h1 className="text-[3.5rem] font-extralight leading-tight mb-4 tracking-[-0.02em]">
          Excavate <span className="text-[#ff6b00] font-light">Knowledge</span>
        </h1>
        <p className="text-lg text-[#666] max-w-[600px] mx-auto mb-12">
          Transform documentation into wisdom through methodical digital archaeology. Every insight carefully extracted and catalogued.
        </p>
      </section>

      {/* Mining Interface */}
      <section className="bg-white border border-[#e6e6e6] p-12 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-16 max-w-[800px] mx-auto">
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-[0.1em] text-[#999] mb-4">
            Mining Location
          </label>
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent border-0 border-b border-[#e6e6e6] pb-4 text-lg font-light text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors placeholder:text-[#999] placeholder:font-light"
              placeholder="https://"
            />
            <button
              onClick={handleCommence}
              className="px-8 py-4 text-sm font-normal uppercase tracking-wider text-white transition-all duration-200 hover:transform hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(255,107,0,0.3)]"
              style={{
                background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
                clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)',
              }}
            >
              Commence
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.1em] text-[#999]">Depth</span>
            <select 
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="bg-transparent border-0 border-b border-[#e6e6e6] pb-2 text-[#666] text-sm cursor-pointer outline-none focus:border-[#1a1a1a] transition-colors"
            >
              <option>3 layers</option>
              <option>5 layers</option>
              <option>∞ infinite</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.1em] text-[#999]">Strategy</span>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="bg-transparent border-0 border-b border-[#e6e6e6] pb-2 text-[#666] text-sm cursor-pointer outline-none focus:border-[#1a1a1a] transition-colors"
            >
              <option>Documentation</option>
              <option>Code Examples</option>
              <option>Complete Site</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.1em] text-[#999]">Quality</span>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="bg-transparent border-0 border-b border-[#e6e6e6] pb-2 text-[#666] text-sm cursor-pointer outline-none focus:border-[#1a1a1a] transition-colors"
            >
              <option>Standard</option>
              <option>High Precision</option>
              <option>Maximum Detail</option>
            </select>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="mb-16">
        <div className="h-px bg-[#e6e6e6] relative mb-12 overflow-hidden">
          {isActive && (
            <div 
              className="absolute top-0 left-0 h-full w-[60%]"
              style={{
                background: 'linear-gradient(90deg, transparent, #ff6b00, transparent)',
                animation: 'shimmer 3s infinite'
              }}
            />
          )}
        </div>

        <div className="grid grid-cols-4 gap-12">
          <div className="text-center">
            <div className="text-[2.5rem] font-extralight leading-none mb-2">247</div>
            <div className="text-xs uppercase tracking-[0.1em] text-[#999]">Pages Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-[2.5rem] font-extralight leading-none mb-2 text-[#ff6b00]">73</div>
            <div className="text-xs uppercase tracking-[0.1em] text-[#999]">Code Examples</div>
          </div>
          <div className="text-center">
            <div className="text-[2.5rem] font-extralight leading-none mb-2">92%</div>
            <div className="text-xs uppercase tracking-[0.1em] text-[#999]">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-[2.5rem] font-extralight leading-none mb-2">1.2s</div>
            <div className="text-xs uppercase tracking-[0.1em] text-[#999]">Avg Response</div>
          </div>
        </div>
      </section>

      {/* Data Layers */}
      <section className="grid grid-cols-3 gap-px bg-[#e6e6e6] mb-16">
        <div className="bg-white p-8 flex flex-col justify-end min-h-[120px] relative overflow-hidden bg-gradient-to-b from-[rgba(255,107,0,0.05)] to-white">
          <div className="absolute top-0 right-[-20px] text-[4rem] text-[rgba(0,0,0,0.02)] font-thin leading-none">I</div>
          <div className="relative z-10">
            <div className="text-xs uppercase tracking-[0.1em] text-[#999] mb-2">Surface</div>
            <div className="text-2xl font-extralight text-[#1a1a1a]">89</div>
          </div>
        </div>
        <div className="bg-white p-8 flex flex-col justify-end min-h-[120px] relative overflow-hidden bg-gradient-to-b from-[rgba(255,107,0,0.05)] to-white">
          <div className="absolute top-0 right-[-20px] text-[4rem] text-[rgba(0,0,0,0.02)] font-thin leading-none">II</div>
          <div className="relative z-10">
            <div className="text-xs uppercase tracking-[0.1em] text-[#999] mb-2">Shallow</div>
            <div className="text-2xl font-extralight text-[#1a1a1a]">134</div>
          </div>
        </div>
        <div className="bg-white p-8 flex flex-col justify-end min-h-[120px] relative overflow-hidden">
          <div className="absolute top-0 right-[-20px] text-[4rem] text-[rgba(0,0,0,0.02)] font-thin leading-none">III</div>
          <div className="relative z-10">
            <div className="text-xs uppercase tracking-[0.1em] text-[#999] mb-2">Deep</div>
            <div className="text-2xl font-extralight text-[#1a1a1a]">24</div>
          </div>
        </div>
      </section>

      {/* Oracle Message */}
      <section className="text-center max-w-[600px] mx-auto italic text-[#666] p-8 border-t border-[#e6e6e6]">
        <p>
          "The digital stratum reveals its secrets methodically. Each layer of knowledge now catalogued and ready for integration into your development workflow."
        </p>
      </section>
    </div>
  );
}
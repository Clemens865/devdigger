/**
 * Animation Demo Component for DevDigger
 * Showcases the animation system capabilities
 */

import React, { useState } from 'react';
import {
  useScrollReveal,
  useStaggeredAnimation,
  useParallax,
  useMorph,
  useRipple,
  useFeedbackAnimation,
  useConfetti,
  usePageTransition,
} from '../hooks/useAnimation';
import '../styles/animations.css';

export function AnimationDemo() {
  const [showDemo, setShowDemo] = useState(false);
  const { elementRef: scrollRef, isVisible } = useScrollReveal({
    threshold: 0.3,
    once: true,
  });

  const { containerRef, trigger, isTriggered } = useStaggeredAnimation({
    delay: 100,
    duration: 350,
  });

  const { elementRef: parallaxRef } = useParallax({
    speed: 0.5,
    direction: 'up',
  });

  const { elementRef: morphRef, morph } = useMorph();
  const { elementRef: rippleRef, createRipple } = useRipple();
  const { elementRef: feedbackRef, triggerSuccess, triggerError } = useFeedbackAnimation();
  const { createConfetti } = useConfetti();
  const { startTransition, transitionClass } = usePageTransition();

  const handleMorph = () => {
    morph(
      { borderRadius: '8px', backgroundColor: '#3b82f6' },
      { borderRadius: '50%', backgroundColor: '#10b981' },
      500
    );
  };

  const handleConfetti = () => {
    createConfetti(30);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <header className="text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            DevDigger Animation System
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Sophisticated micro-interactions and entrance animations designed for performance and elegance.
          </p>
        </header>

        {/* Entrance Animations */}
        <section className="bg-white rounded-xl p-8 shadow-lg animate-fade-in-up delay-200">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Entrance Animations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Fade In', class: 'animate-fade-in' },
              { name: 'Fade In Up', class: 'animate-fade-in-up' },
              { name: 'Scale In', class: 'animate-scale-in' },
              { name: 'Slide In Down', class: 'animate-slide-in-down' },
            ].map((animation, index) => (
              <div
                key={animation.name}
                className={`p-4 bg-blue-50 rounded-lg border-2 border-blue-200 text-center ${animation.class}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium text-slate-700">{animation.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Staggered Animations */}
        <section className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Staggered Animations</h2>
          <button
            onClick={trigger}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover-lift hover-scale transition-all duration-200"
          >
            Trigger Staggered Animation
          </button>
          <div
            ref={containerRef}
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
              isTriggered ? 'stagger-fade-in-up' : ''
            }`}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-full mb-3"></div>
                <h3 className="font-semibold text-slate-900 mb-2">Item {i + 1}</h3>
                <p className="text-slate-600 text-sm">
                  This item will animate with a staggered delay.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Micro-interactions */}
        <section className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Micro-interactions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Hover Effects */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-xl mx-auto mb-3 hover-lift hover-scale cursor-pointer"></div>
              <span className="text-sm text-slate-700">Hover Lift + Scale</span>
            </div>

            {/* Ripple Effect */}
            <div className="text-center">
              <div
                ref={rippleRef}
                onClick={createRipple}
                className="w-20 h-20 bg-blue-500 rounded-xl mx-auto mb-3 click-ripple cursor-pointer"
              ></div>
              <span className="text-sm text-slate-700">Click Ripple</span>
            </div>

            {/* Morph Animation */}
            <div className="text-center">
              <div
                ref={morphRef}
                onClick={handleMorph}
                className="w-20 h-20 bg-blue-500 rounded-xl mx-auto mb-3 cursor-pointer transition-all duration-500"
              ></div>
              <span className="text-sm text-slate-700">Morph Shape</span>
            </div>

            {/* Pulse Animation */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-xl mx-auto mb-3 animate-pulse"></div>
              <span className="text-sm text-slate-700">Pulse</span>
            </div>
          </div>
        </section>

        {/* Feedback Animations */}
        <section className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Feedback Animations</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              ref={feedbackRef}
              onClick={triggerSuccess}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover-lift transition-all duration-200"
            >
              Trigger Success
            </button>
            <button
              onClick={triggerError}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover-lift transition-all duration-200"
            >
              Trigger Error
            </button>
            <button
              onClick={handleConfetti}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover-lift transition-all duration-200"
            >
              Celebrate! 🎉
            </button>
          </div>
        </section>

        {/* Scroll Reveal */}
        <section
          ref={scrollRef}
          className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Scroll Reveal</h2>
          <p className="text-slate-600 mb-4">
            This section animates into view when it enters the viewport.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-indigo-500 rounded-lg mb-3"></div>
                <h3 className="font-semibold text-slate-900 mb-2">Feature {i + 1}</h3>
                <p className="text-slate-600 text-sm">
                  This card reveals with a staggered delay.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Parallax Section */}
        <section className="relative bg-slate-900 rounded-xl overflow-hidden">
          <div
            ref={parallaxRef}
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-80"
          ></div>
          <div className="relative z-10 p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Parallax Background</h2>
            <p className="text-xl opacity-90">
              The background moves at a different speed as you scroll, creating depth.
            </p>
          </div>
        </section>

        {/* Loading Animations */}
        <section className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Spinner */}
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
              <span className="text-sm text-slate-700">Spinner</span>
            </div>

            {/* Dots */}
            <div className="text-center">
              <div className="flex justify-center space-x-1 mb-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full animate-dots"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
              <span className="text-sm text-slate-700">Dots</span>
            </div>

            {/* Progress Bar */}
            <div className="text-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto mb-3 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-progress w-1/3"></div>
              </div>
              <span className="text-sm text-slate-700">Progress</span>
            </div>
          </div>
        </section>

        {/* Page Transition Demo */}
        <section className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Page Transitions</h2>
          <button
            onClick={() => startTransition('enter')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover-lift transition-all duration-200"
          >
            Simulate Page Transition
          </button>
          {transitionClass && (
            <div className={`mt-4 p-4 bg-indigo-50 rounded-lg ${transitionClass}`}>
              <p className="text-indigo-900">
                This content demonstrates page transition animations.
              </p>
            </div>
          )}
        </section>

        {/* Performance Info */}
        <section className="bg-slate-50 rounded-xl p-8 border-2 border-slate-200">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Performance Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Optimizations</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  GPU acceleration with transform3d
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Reduced motion preference support
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Intersection Observer for scroll animations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  RequestAnimationFrame scheduling
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Accessibility</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Respects prefers-reduced-motion
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Focus-visible animations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Semantic animation feedback
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Keyboard navigation support
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
import React from 'react';
import { GalleryHeader } from './GalleryHeader';

interface GalleryLayoutProps {
  children: React.ReactNode;
}

export function GalleryLayout({ children }: GalleryLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <GalleryHeader />
      <main className="py-16">
        <div className="max-w-[1400px] mx-auto px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
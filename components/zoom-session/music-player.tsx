"use client";

import { useEffect, useState } from 'react';
import { loadScript } from '@/lib/load-script';

export function MusicPlayer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScript('https://static.elfsight.com/platform/platform.js')
      .then(() => {
        // Add a small delay to allow the widget to initialize
        setTimeout(() => setIsLoading(false), 1000);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="px-3 py-2">
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      <div 
        className={`elfsight-app-5c9eb876-52d4-4768-aa3f-781ff3530c4d ${isLoading ? 'hidden' : ''}`}
        data-elfsight-app-lazy
      />
    </div>
  );
}
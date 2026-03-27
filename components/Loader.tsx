"use client";

import { useEffect, useState } from "react";

interface LoaderProps {
  onLoadComplete?: () => void;
  isLoading?: boolean;
}

export function Loader({ onLoadComplete, isLoading = true }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(3000); // Default 3 seconds

  useEffect(() => {
    // Estimate connection speed based on browser performance API
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const nav = navigator as Navigator & {
        connection?: {
          effectiveType?: string;
        };
      };
      const connection = nav.connection;
      if (connection && connection.effectiveType) {
        // Adjust estimated time based on effective connection type
        const speedMap: Record<string, number> = {
          'slow-2g': 8000,
          '2g': 6000,
          '3g': 4000,
          '4g': 2000,
          '5g': 1000,
        };
        setEstimatedTime(speedMap[connection.effectiveType] || 3000);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Data loaded, complete the progress
      setProgress(100);
      return;
    }

    // Calculate increment speed based on estimated time
    // We want to reach 90% by the estimated time, then slow down
    const targetProgress = 90;
    const incrementInterval = 50; // Update every 50ms
    const totalIncrements = estimatedTime / incrementInterval;
    const incrementAmount = targetProgress / totalIncrements;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (!isLoading) {
          // If loading finished, jump to 100%
          return 100;
        }
        if (prev >= 90) {
          // Slow down significantly after 90%
          return Math.min(prev + 0.5, 95);
        }
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + incrementAmount, 90);
      });
    }, incrementInterval);

    return () => clearInterval(interval);
  }, [isLoading, estimatedTime]);

  // Complete when loading finishes
  useEffect(() => {
    if (!isLoading && progress < 100) {
      setProgress(100);
      if (onLoadComplete) {
        setTimeout(onLoadComplete, 300);
      }
    }
  }, [isLoading, progress, onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex items-center justify-center">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated logo/icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a]/40 border border-[#2a2a2a]/50 backdrop-blur-2xl flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-blue-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Loading Ideas</h3>
          <p className="text-sm text-slate-500">Preparing your dashboard...</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-[#1a1a1a]/40 border border-[#2a2a2a]/50 rounded-full overflow-hidden backdrop-blur-xl">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <div className="text-sm font-mono text-slate-600">
          {progress}%
        </div>
      </div>
    </div>
  );
}

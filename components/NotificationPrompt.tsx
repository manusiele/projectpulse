"use client";

import { useEffect, useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications";

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we should show the notification prompt
    const dismissed = localStorage.getItem('notificationPromptDismissed');
    const hasPermission = 'Notification' in window && Notification.permission === 'granted';
    
    if (!dismissed && !hasPermission && 'Notification' in window) {
      // Show prompt after 5 seconds (reduced from 10)
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    
    try {
      const permission = await requestNotificationPermission();
      
      if (permission === 'granted') {
        setShowPrompt(false);
        localStorage.setItem('notificationPromptDismissed', 'true');
        
        // Trigger an immediate background sync check
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          if ('sync' in registration) {
            try {
              const bgSync = registration as unknown as {
                sync: {
                  register: (tag: string) => Promise<void>;
                };
              };
              await bgSync.sync.register('check-new-ideas');
            } catch (error) {
              console.log('Could not register sync:', error);
            }
          }
        }
      } else if (permission === 'denied') {
        // Show feedback that permission was denied
        alert('Notifications blocked. Enable them in your browser settings to get alerts for new ideas.');
        setShowPrompt(false);
        localStorage.setItem('notificationPromptDismissed', 'true');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notificationPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slideUp max-w-sm">
      <div className="bg-[#1a1a1a] border-2 border-blue-500/30 rounded-2xl backdrop-blur-xl shadow-2xl shadow-blue-500/10 p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-base font-bold text-white mb-1.5">Stay Updated</h3>
            
            {/* Description */}
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Get instant alerts when new project ideas arrive, even when the app is closed.
            </p>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleEnable}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-blue-600/50 disabled:to-cyan-600/50 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enabling...
                  </span>
                ) : (
                  'Enable Notifications'
                )}
              </button>
              <button
                onClick={handleDismiss}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-[#252525] hover:bg-[#2a2a2a] disabled:bg-[#252525]/50 text-slate-300 hover:text-white disabled:text-slate-500 text-sm font-medium transition-colors disabled:cursor-not-allowed"
              >
                Later
              </button>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            disabled={isLoading}
            className="text-slate-400 hover:text-white transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

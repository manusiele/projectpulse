"use client";

import { useEffect, useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications";

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if we should show the notification prompt
    const dismissed = localStorage.getItem('notificationPromptDismissed');
    const hasPermission = 'Notification' in window && Notification.permission === 'granted';
    
    if (!dismissed && !hasPermission && 'Notification' in window) {
      // Show prompt after 5 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
          handleDismiss();
        }, 10000);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    const permission = await requestNotificationPermission();
    setShowPrompt(false);
    localStorage.setItem('notificationPromptDismissed', 'true');
    
    if (permission === 'granted') {
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
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notificationPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl p-3 flex items-center gap-3">
        <svg className="w-5 h-5 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        
        <span className="text-sm text-white font-medium">Enable notifications?</span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleEnable}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            Yes
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-1 rounded bg-[#252525] hover:bg-[#2a2a2a] text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

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
      // Show prompt after 10 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      setShowPrompt(false);
      localStorage.setItem('notificationPromptDismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notificationPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slideUp max-w-xs">
      <div className="bg-[#1a1a1a]/95 border border-[#2a2a2a] rounded-xl backdrop-blur-xl shadow-2xl p-3">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-white mb-1">Get Notified</h3>
            <p className="text-xs text-slate-400 mb-2 leading-tight">Receive alerts for new daily ideas</p>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleEnable}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-medium transition-colors"
              >
                Enable
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] text-slate-400 hover:text-white text-xs font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

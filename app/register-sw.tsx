"use client";

import { useEffect } from 'react';

export function RegisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(async (registration) => {
          console.log('Service Worker registered:', registration);
          
          // Wait for service worker to be active
          await navigator.serviceWorker.ready;
          console.log('Service Worker is active');
          
          // Register periodic background sync (Chrome/Edge only)
          if ('periodicSync' in registration) {
            try {
              const periodicSync = registration as unknown as {
                periodicSync: {
                  register: (tag: string, options: { minInterval: number }) => Promise<void>;
                };
              };
              await periodicSync.periodicSync.register('check-new-ideas', {
                minInterval: 30 * 60 * 1000, // 30 minutes
              });
              console.log('Periodic background sync registered');
            } catch (error) {
              console.log('Periodic sync not available:', error);
            }
          }
          
          // Register regular background sync as fallback
          if ('sync' in registration) {
            try {
              const bgSync = registration as unknown as {
                sync: {
                  register: (tag: string) => Promise<void>;
                };
              };
              await bgSync.sync.register('check-new-ideas');
              console.log('Background sync registered');
            } catch (syncError) {
              console.log('Background sync not available:', syncError);
            }
          }
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;
}

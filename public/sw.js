// Service Worker for FocusLock PWA
const CACHE_NAME = 'focuslock-v1';
const RUNTIME_CACHE = 'focuslock-runtime';
const API_CACHE = 'focuslock-api';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and register periodic sync
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // API requests - network first
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
  );
});

// Periodic Background Sync - Check for new ideas every 30 minutes
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-new-ideas') {
    event.waitUntil(checkForNewIdeas());
  }
});

// Background Sync - Fallback for browsers that don't support periodic sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-new-ideas') {
    event.waitUntil(checkForNewIdeas());
  }
});

// Function to check for new ideas
async function checkForNewIdeas() {
  try {
    // Fetch latest ideas from API
    const response = await fetch('/api/ideas');
    if (!response.ok) return;
    
    const ideas = await response.json();
    if (!ideas || ideas.length === 0) return;
    
    const latestIdea = ideas[0];
    
    // Get the last known idea ID from cache
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match('/api/ideas');
    
    if (cachedResponse) {
      const cachedIdeas = await cachedResponse.json();
      const lastKnownId = cachedIdeas[0]?.id;
      
      // If there's a new idea, show notification
      if (lastKnownId && latestIdea.id !== lastKnownId) {
        await showNewIdeaNotification(latestIdea);
      }
    } else {
      // First time - just cache it
      await cache.put('/api/ideas', new Response(JSON.stringify(ideas)));
    }
    
    // Update cache with latest ideas
    await cache.put('/api/ideas', new Response(JSON.stringify(ideas)));
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Show notification for new idea
async function showNewIdeaNotification(idea) {
  const title = '🚀 New FocusLock Idea!';
  const options = {
    body: idea.projectName || 'A fresh project idea just arrived',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'new-idea-' + idea.id,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      url: '/dashboard',
      ideaId: idea.id
    },
    actions: [
      {
        action: 'view',
        title: 'View Idea',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  await self.registration.showNotification(title, options);
}

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'FocusLock - New Idea!';
  const options = {
    body: data.body || 'A new project idea is ready for you',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'focuslock-notification',
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/dashboard'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/dashboard';
  
  // Handle action buttons
  if (event.action === 'dismiss') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Message event - for manual sync trigger from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_NEW_IDEAS') {
    event.waitUntil(checkForNewIdeas());
  }
});

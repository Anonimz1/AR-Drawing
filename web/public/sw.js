// Service Worker Disabled - Using Vercel CDN caching instead
// This prevents aggressive caching issues during development

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  return self.clients.claim();
});

// No fetch interception - let Vercel handle caching
self.addEventListener('fetch', (event) => {
  // Do nothing, let network handle all requests
  return;
});

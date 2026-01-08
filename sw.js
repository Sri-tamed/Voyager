
const CACHE_NAME = 'voyager-v1-map-tiles';
const TILE_SOURCE = 'basemaps.cartocdn.com';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Only intercept tile requests to ensure map performance
  if (url.includes(TILE_SOURCE)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cached tile if available, otherwise fetch and cache
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
    );
  }
});

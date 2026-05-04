const CACHE_NAME = 'pm-v2'; // 🔥 change version every update

const FILES_TO_CACHE = [
  './',
  './index.html'
];

// INSTALL → cache files
self.addEventListener('install', event => {
  self.skipWaiting(); // 🔥 activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ACTIVATE → delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim(); // 🔥 take control immediately
});

// FETCH → network first (important)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // update cache in background
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback offline
  );
});

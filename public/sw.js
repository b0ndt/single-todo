const SW_VERSION = new URL(self.location.href).searchParams.get('v') ?? 'v1';
const CACHE_NAME = `single-todo-${SW_VERSION}`;
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/assets/app.js',
  '/assets/app.css',
  '/logo.svg',
  '/logo-dark.svg',
  '/logo-light.svg',
  '/favicon.svg',
  '/og-image.svg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_ASSETS);
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => keys.filter((key) => key !== CACHE_NAME))
      .then((staleKeys) => Promise.all(staleKeys.map((staleKey) => caches.delete(staleKey))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('/index.html', cloned);
          });
          return response;
        })
        .catch(() => caches.match('/index.html')),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200 && networkResponse.type === 'basic') {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cloned);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match('/index.html'));
    }),
  );
});

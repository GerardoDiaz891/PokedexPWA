const CACHE_NAME = 'poke-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',

  '/static/js/453.fa71e030.chunk.js',
  '/static/js/main.b3ddad31.js',
  '/static/css/main.8910c831.css',
];


this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

this.addEventListener('fetch', event => {
  if (event.request.url.includes('pokeapi.co')) {
    event.respondWith(
      caches.open('poke-cache').then(cache => {
        return fetch(event.request)
          .then(response => {
            cache.put(event.request, response.clone());
            console.log('[Service Worker] Datos obtenidos de la red y cacheados:', event.request.url);
            return response;
          })
          .catch(() => {
            return cache.match(event.request).then(cachedResponse => {
              if (cachedResponse) {
                console.log('[Service Worker] Datos obtenidos del cache (offline):', event.request.url);
                return cachedResponse;
              } else {
                console.warn('[Service Worker] Sin conexión y sin datos en cache:', event.request.url);
                return new Response(JSON.stringify({error: 'Sin conexión y sin datos en cache'}), {
                  status: 503,
                  headers: {'Content-Type': 'application/json'}
                });
              }
            });
          });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('[Service Worker] Recurso estático obtenido del cache:', event.request.url);
            return response;
          }
          console.log('[Service Worker] Recurso estático obtenido de la red:', event.request.url);
          return fetch(event.request);
        })
    );
  }
});

this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

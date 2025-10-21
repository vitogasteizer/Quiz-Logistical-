const CACHE_NAME = 'logistica-quiz-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/data/questions.js',
  '/data/preparacion-pedidos-questions.js',
  '/data/preparacion-pedidos-2-questions.js',
  'https://cdn.tailwindcss.com',
  'https://i.postimg.cc/tJDL7vz5/Quiz-by-avma.png',
  'https://i.postimg.cc/vH2JdYhn/Almacenaje-m-vil.jpg',
  'https://i.postimg.cc/c4kpNxhn/Sistema-Cantilever.jpg',
  'https://i.postimg.cc/J4YfWrx1/Sistema-autom-ticos.jpg',
  'https://i.postimg.cc/HsvqCYz7/Sistema-autoportante.jpg',
  'https://i.postimg.cc/L6QcM9Df/Sistema-de-almacenamiento-din-mico.jpg',
  'https://i.postimg.cc/T3yZdzNg/Sistema-de-estanter-a-convencional-o-Rack-sistema.jpg',
  'https://i.postimg.cc/cLKVxpkF/Sistema-de-estanter-as-din-micas-Din-micas-por-gravedad.png',
  'https://i.postimg.cc/QdBR82Y6/Sistema-de-estanter-as-din-micas-Estanter-as-shuttle-lanzadera.jpg',
  'https://i.postimg.cc/L8qr9cQt/Sistema-de-estanter-as-din-micas-push-back.jpg',
  'https://i.postimg.cc/htJHDkZN/Sistema-Drive-through.png',
  'https://i.postimg.cc/6p7DWkb1/Sistema-Driven-in.jpg',
  'https://i.postimg.cc/BndRXmd3/Sistema-en-bloque.jpg',
  'https://i.postimg.cc/kgkLBTLf/Sistema-Flow-rail.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        
        // Not in cache, fetch from network and cache it
        return fetch(event.request).then(
          networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
              return networkResponse;
            }
            
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                // We don't cache tailwindcss on the fly due to opaque response issues
                if (!event.request.url.includes('tailwindcss')) {
                     cache.put(event.request, responseToCache);
                }
              });
            
            return networkResponse;
          }
        ).catch(error => {
            console.error('Fetch failed; app is likely offline and resource is not cached.', error);
        });
      })
  );
});
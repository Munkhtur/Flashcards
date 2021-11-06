const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v4';

const assets = [
  '/',
  '/index.html',
  '/build/bundle.js',
  '/build/bundle.css',
  '/global.css',
  '/img/az.png',
  '/favicon.ico',
  '/fallback.html',
  'https://kit.fontawesome.com/87f14d78d7.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching');
      cache.addAll(assets);
    })
  );
});
self.addEventListener('activate', (e) => {
  console.log('activate ', e);
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      fetch(evt.request).catch(function () {
        return caches.match(evt.request);
      })
    );
  }
});

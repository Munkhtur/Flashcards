const staticCacheName = 'site-static-v7';
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

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

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
      caches.match(evt.request).then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              if (evt.request.url.match('^(http|https)://')) {
                cache.put(evt.request.url, fetchRes.clone());
                // check cached items size
                limitCacheSize(dynamicCacheName, 15);
              } else {
                return;
              }
              return fetchRes;
            });
          })
        );
      })
    );
  }
});

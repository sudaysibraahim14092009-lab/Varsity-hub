const CACHE_NAME = 'scholrza-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
  '/og-image.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // NEVER cache API calls or HTML pages — always fetch fresh
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('.html') ||
      event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).catch(() => caches.match('/index.html'))
    )
  );
});


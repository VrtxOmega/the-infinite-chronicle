const CACHE_NAME = 'scroll-v2-v1';
const ASSETS = [
  '/the-infinite-chronicle/',
  '/the-infinite-chronicle/index.html',
  '/the-infinite-chronicle/style.css',
  '/the-infinite-chronicle/app.js',
  '/the-infinite-chronicle/data.js',
  '/the-infinite-chronicle/manifest.json',
  '/the-infinite-chronicle/assets/hero_chronicle.png',
  '/the-infinite-chronicle/assets/img_space_1777628517848.png',
  '/the-infinite-chronicle/assets/img_science_1777628546990.png',
  '/the-infinite-chronicle/assets/img_history_1777628532063.png',
  '/the-infinite-chronicle/assets/img_art_1777628559672.png',
  '/the-infinite-chronicle/assets/img_weird_1777628571793.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
      return cached || fetchPromise;
    })
  );
});

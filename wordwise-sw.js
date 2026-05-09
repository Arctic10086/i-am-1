const CACHE = 'wordwise-shell-v2';
const PRECACHE = [
  './wordwise.html',
  './wordwise-sw.js',
  './data/lexicon-cet4.json',
  './data/lexicon-cet6.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).catch(() => {
        if (req.mode === 'navigate') return caches.match('./wordwise.html');
        return caches.match(req);
      });
    })
  );
});

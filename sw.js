const CACHE = 'paulo-paixao-v8';
const IMG_CACHE = 'paulo-paixao-imgs-v4';
const MAX_IMG_CACHE = 50;

const PRECACHE = [
  '/',
  'index.html',
  'empreendimentos.js',
  'style.css',
  'main.js',
  'assets/favicon/favicon.ico',
  'assets/favicon/favicon-16.png',
  'assets/favicon/favicon-32.png',
  'assets/favicon/favicon-192.png',
  'assets/favicon/apple-touch-icon.png',
  'politica-de-privacidade.html',
  'assets/img/foto-residencial.webp',
  'assets/img/hero-poster.jpg?v=1',
  'assets/img/og-banner.jpg',
  'assets/capas/capas%20paulo%20-%201.webp',
  'assets/fotos/maro/fachada.webp?v=2',
  'assets/fotos/momi/foto-8.webp',
  'site.webmanifest',
  'robots.txt'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== IMG_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Imagens: cache-first com limite
  if (/\.(jpe?g|png|gif|svg|webp|avif|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(IMG_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
              trimCache(cache, MAX_IMG_CACHE);
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // Videos: network-first (não armazenar em cache - muito grandes)
  if (/\.(mp4|webm|mov)$/i.test(url.pathname)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cross-origin: passthrough (CSP não permite fetch de CDNs no SW)
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(event.request).catch(function() { return new Response('', { status: 408 }); }));
    return;
  }

  // HTML/JS/CSS (documento principal e código do site): network-first.
  // Sempre tenta buscar a versão mais nova primeiro; só usa o cache como
  // reserva se o usuário estiver offline. Isso evita que quem já visitou o
  // site fique preso numa versão antiga (CSP, assets, etc.) depois de um
  // novo deploy.
  if (event.request.mode === 'navigate' || /\.(html|js|css)$/i.test(url.pathname) || url.pathname === '/') {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var copy = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(event.request, copy); });
        }
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Demais arquivos same-origin: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var fetched = fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var copy = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(event.request, copy); });
        }
        return response;
      }).catch(function() { return cached; });
      return cached || fetched;
    })
  );
});

function trimCache(cache, maxItems) {
  cache.keys().then(keys => {
    if (keys.length > maxItems) {
      cache.delete(keys[0]).then(() => trimCache(cache, maxItems));
    }
  });
}

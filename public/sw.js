const CACHE_NAME = 'pokedex-v1';
const API_CACHE = 'pokedex-api-v1';

// archivos estáticos a cachear durante la instalación
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

// instalar sw y cachear archivos estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando archivos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[SW] Error al cachear archivos:', error);
      })
  );
  self.skipWaiting();
});

// activar y limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('[SW] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// estrategia de caché para las peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // estrategia para la API de Pokémon
  if (url.origin.includes('back-poke-api.vercel.app')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // estrategia para imágenes de Pokémon 
  if (url.origin.includes('raw.githubusercontent.com') && url.pathname.includes('sprites')) {
    event.respondWith(cacheFirstStrategy(request, API_CACHE));
    return;
  }

  // estrategia para archivos estáticos
  event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
});

// network First 
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(
      JSON.stringify({ error: 'Sin conexión y no hay datos en caché' }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503
      }
    );
  }
}

// cache First 
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Fetch failed:', request.url);
    if (request.destination === 'image') {
      return new Response('', { status: 404 });
    }
    throw error;
  }
}
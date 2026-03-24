// Service Worker for Game DIIB
// Improves performance with caching

const CACHE_NAME = 'gamediib-v1.0.0';
const STATIC_CACHE = 'gamediib-static-v1.0.0';
const DYNAMIC_CACHE = 'gamediib-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/mobile-styles.css',
    '/b-firebase-config.js',
    '/b-common.js',
    '/b-api.js',
    '/b-security.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                console.error('[SW] Error caching static files:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip Firebase requests (they need fresh data)
    if (url.hostname.includes('firebase') ||
        url.hostname.includes('googleapis') ||
        url.hostname.includes('gstatic')) {
        return;
    }

    // Cache strategy: Cache First for static files, Network First for dynamic
    if (STATIC_FILES.some(file => request.url.includes(file))) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

// Cache First Strategy
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache first error:', error);
        // Return offline fallback
        return caches.match('/index.html');
    }
}

// Network First Strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] Network first error:', error);
        // Try cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Return offline page
        return caches.match('/index.html');
    }
}
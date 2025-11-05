// Service Worker for caching external resources (especially Stripe)
// This improves performance by caching external resources with longer TTLs

const CACHE_NAME = 'stockflow-v1';
const STRIPE_CACHE_NAME = 'stockflow-stripe-v1';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Stripe domains to cache
const STRIPE_DOMAINS = [
  'js.stripe.com',
  'm.stripe.network'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing...');
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== STRIPE_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Check if URL is from Stripe domain
function isStripeResource(url) {
  try {
    const urlObj = new URL(url);
    return STRIPE_DOMAINS.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

// Fetch event - intercept requests and serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Check if this is a Stripe resource
  if (isStripeResource(url)) {
    event.respondWith(
      caches.open(STRIPE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Check if cached response is still fresh
            const cachedDate = cachedResponse.headers.get('sw-cached-date');
            if (cachedDate) {
              const cacheAge = Date.now() - parseInt(cachedDate, 10);
              // Use cached response if it's less than 7 days old
              if (cacheAge < CACHE_DURATION) {
                console.log('[SW] Serving Stripe resource from cache:', url);
                return cachedResponse;
              }
            }
          }

          // Fetch from network and cache
          return fetch(request.clone()).then((response) => {
            // Only cache successful responses (allow both 'basic' and 'cors' types)
            if (response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
              // Clone the response before caching
              const responseToCache = response.clone();
              
              // Create a new response with cache metadata
              // For CORS responses, we need to recreate the response with proper CORS headers
              const headers = new Headers(responseToCache.headers);
              headers.set('sw-cached-date', Date.now().toString());
              
              // Create modified response with cache headers
              const modifiedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers,
                // Preserve original cache headers from Stripe
              });

              // Cache the modified response
              cache.put(request, modifiedResponse.clone());
              console.log('[SW] Cached Stripe resource:', url);
              
              return response;
            }
            return response;
          }).catch((error) => {
            console.error('[SW] Fetch error for Stripe resource:', url, error);
            // Return cached response even if expired, as fallback
            if (cachedResponse) {
              console.log('[SW] Using expired cache as fallback:', url);
              return cachedResponse;
            }
            throw error;
          });
        });
      })
    );
  }
});


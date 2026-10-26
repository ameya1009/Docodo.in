/**
 * Docodo Clinic PWA Service Worker
 * Provides offline caching for clinic appointments, OPD queue, and front-desk schedule.
 */

const CACHE_NAME = "docodo-clinic-offline-v1";
const OFFLINE_URL = "/dashboard/bookings";

const PRECACHE_ASSETS = [
  "/",
  "/dashboard",
  "/dashboard/bookings",
  "/manifest.webmanifest",
];

// 1. Install Event: Precache essential front-desk assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Docodo SW] Precaching clinical offline assets");
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[Docodo SW] Precache warning:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[Docodo SW] Removing outdated cache:", name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-first with cache fallback for appointments & schedules
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Handle appointment schedules & dashboard navigation (Network-First, Cache Fallback)
  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/api/bookings") ||
    url.pathname.startsWith("/book")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, clone into cache for offline viewing
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          console.log("[Docodo SW] Network unavailable. Serving offline cached schedule:", url.pathname);
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to bookings dashboard
          const fallback = await caches.match(OFFLINE_URL);
          if (fallback) return fallback;
          return new Response("You are currently offline. Please reconnect to sync clinic appointments.", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        })
    );
    return;
  }

  // For static assets (JS, CSS, fonts, images): Cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2|woff|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }
});

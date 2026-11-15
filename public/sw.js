// OmniShield AI Lightweight Service Worker for Progressive Web App support
const CACHE_NAME = "omnishield-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Purge any older or stale caches to prevent CSS/chunk 404s
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Bypass API calls and Next.js development hot-reload streams
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("_next/webpack-hmr") ||
    url.pathname.includes("/_next/development/")
  ) {
    return;
  }

  // Network-First strategy: Always fetch fresh HTML and CSS from network
  // Falls back to offline cache ONLY when network connection is severed.
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache valid static responses for offline resilience
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Avoid caching cache-busted dev chunks with query strings to prevent FOUC
            if (!url.searchParams.has("v")) {
              cache.put(event.request, responseToCache);
            }
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});

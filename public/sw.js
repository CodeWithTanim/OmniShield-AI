// OmniShield AI Service Worker
// Automatically unregisters on localhost during development to prevent CSS 404 / FOUC

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Never intercept localhost development assets or Next.js internal calls
  const url = new URL(event.request.url);
  if (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Network-First for production
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

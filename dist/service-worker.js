// Version bump forces browsers to install fresh, clearing old caches
const CACHE_NAME = "shg-v3";

self.addEventListener("install", (event) => {
  // Skip waiting immediately — don't hold onto old version
  self.skipWaiting();
  event.waitUntil(
    // Clear ALL old caches on install
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network first — never serve stale HTML
self.addEventListener("fetch", (event) => {
  // Always fetch fresh from network for HTML pages
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request));
    return;
  }
  // For everything else — network first, no caching
  event.respondWith(fetch(event.request));
});

// Push notification handler
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Self Hypnosis Goddess";
  const body = data.body || "New audio just dropped.";
  const url = data.url || "/";
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});

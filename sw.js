// ===============================
// 🚀 HASENE ARABIC GAME – SAFE MODE SW
// ===============================

// Cache adı
const CACHE_VERSION = "safe-v1";
const CACHE_NAME = `hasene-safe-${CACHE_VERSION}`;

// Minimum app shell
const APP_SHELL = [
  "index.html",
  "style.css"
];

// ===============================
// INSTALL
// ===============================
self.addEventListener("install", (event) => {
  console.log("📦 SAFE SW INSTALL…");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch(err => {
        console.warn("⚠️ Safe cache addAll warning:", err);
      });
    })
  );

  self.skipWaiting();
});

// ===============================
// ACTIVATE
// ===============================
self.addEventListener("activate", (event) => {
  console.log("🚀 SAFE SW ACTIVATE…");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ===============================
// FETCH
// ===============================
self.addEventListener("fetch", (event) => {
  const request = event.request;

  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).catch(() => {
          if (request.mode === "navigate") {
            return caches.match("index.html");
          }
        })
      );
    })
  );
});

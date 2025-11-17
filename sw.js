// ===============================
// 🚀 HASENE ARABIC GAME – SAFE MODE SW
// ===============================

// === DİNAMİK BASE PATH ===
const BASE = location.pathname.includes("NEW_HASENE")
  ? "/NEW_HASENE/"
  : "/";

// Cache adı
const CACHE_VERSION = "safe-v2";
const CACHE_NAME = `hasene-safe-${CACHE_VERSION}`;

// Minimum app shell (TAM YOL KULLANILIYOR)
const APP_SHELL = [
  `${BASE}`,
  `${BASE}index.html`,
  `${BASE}style.css`
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
          // Navigasyon isteklerinde fallback
          if (request.mode === "navigate") {
            return caches.match(`${BASE}index.html`);
          }
        })
      );
    })
  );
});

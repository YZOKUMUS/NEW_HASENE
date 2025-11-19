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

// ===============================
// PUSH NOTIFICATIONS
// ===============================
self.addEventListener("push", (event) => {
  console.log("📬 Push event alındı:", event);
  
  let notificationData = {
    title: "Hasene Arapça",
    body: "Yeni bildirim",
    icon: `${BASE}icon-192-v4-RED-MUSHAF.png`,
    badge: `${BASE}icon-192-v4-RED-MUSHAF.png`,
    tag: "hasene-notification",
    requireInteraction: false,
    data: {}
  };

  // Eğer push verisi varsa kullan
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge
      };
    } catch (e) {
      // Text verisi ise
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// ===============================
// NOTIFICATION CLICK
// ===============================
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Bildirim tıklandı:", event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || `${BASE}index.html`;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Açık bir pencere varsa odaklan
      for (let client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Yeni pencere aç
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// ===============================
// NOTIFICATION CLOSE
// ===============================
self.addEventListener("notificationclose", (event) => {
  console.log("❌ Bildirim kapatıldı:", event);
});
// ===============================
// 🚀 HASENE ARABIC GAME – SAFE MODE SW
// ===============================

// === DİNAMİK BASE PATH ===
const BASE = self.location.pathname.includes("NEW_HASENE")
  ? "/NEW_HASENE/"
  : "/";

// Cache adı - Versiyon artırıldı (eski cache'leri temizlemek için)
// Her güncellemede bu versiyonu artırın: v3 -> v4 -> v5...
const CACHE_VERSION = "safe-v3";
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
  // Log'ları azalt - sadece gerçekten gerekliyse göster
  // console.log("📦 SAFE SW INSTALL…");

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
  // Log'ları azalt - sadece gerçekten gerekliyse göster
  // console.log("🚀 SAFE SW ACTIVATE - Tüm eski cache'ler temizleniyor…");

  event.waitUntil(
    caches.keys().then((keys) => {
      // Tüm eski cache'leri sil (yeni versiyon hariç)
      return Promise.all(
        keys.map((key) => {
          if (!key.includes(CACHE_VERSION)) {
            // console.log("🗑️ Eski cache siliniyor:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Tüm client'lara yeni Service Worker'ı bildir
      return self.clients.claim();
    })
  );
});

// ===============================
// FETCH - NETWORK FIRST STRATEGY (Yeni içerik öncelikli)
// ===============================
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // HTML dosyaları için NETWORK FIRST (her zaman güncel versiyon)
  if (request.mode === "navigate" || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Network'ten başarılı yanıt geldi, cache'e kaydet ve göster
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Network hatası, cache'den göster
          return caches.match(request).then((cached) => {
            return cached || caches.match(`${BASE}index.html`);
          });
        })
    );
    return;
  }

  // Diğer dosyalar için STALE WHILE REVALIDATE (Hızlı göster, arka planda güncelle)
  event.respondWith(
    caches.match(request).then((cached) => {
      // Cache'den göster (hızlı)
      const fetchPromise = fetch(request)
        .then((response) => {
          // Arka planda cache'i güncelle
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network hatası, cache'den göster
          return cached;
        });

      // Cache varsa hemen göster, yoksa network'ü bekle
      return cached || fetchPromise;
    })
  );
});

// ===============================
// PUSH NOTIFICATIONS
// ===============================
self.addEventListener("push", (event) => {
  // console.log("📬 Push event alındı:", event);
  
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
  // console.log("🔔 Bildirim tıklandı:", event);
  
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
  // console.log("❌ Bildirim kapatıldı:", event);
});
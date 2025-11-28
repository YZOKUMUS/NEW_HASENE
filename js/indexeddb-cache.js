// ============ INDEXEDDB CACHE MANAGER ============
// JSON dosyalarını IndexedDB'ye cache'ler (performans optimizasyonu)
// İkinci ziyarette dosyalar network'ten değil IndexedDB'den yüklenir

const DB_NAME = 'hasene_cache_db';
const DB_VERSION = 1;
const STORE_NAME = 'json_cache';

let dbInstance = null;

/**
 * IndexedDB veritabanını başlatır
 * @returns {Promise<IDBDatabase>} Veritabanı instance'ı
 */
async function initIndexedDBCache() {
    if (dbInstance) {
        return dbInstance;
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            log.error('❌ IndexedDB açılamadı:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            dbInstance = request.result;
            log.debug('✅ IndexedDB cache başlatıldı');
            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Object store oluştur (yoksa)
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                log.debug('✅ IndexedDB object store oluşturuldu');
            }
        };
    });
}

/**
 * JSON dosyasını IndexedDB'den okur
 * @param {string} key - Cache key (dosya yolu)
 * @returns {Promise<object|null>} Cache'den okunan veri veya null
 */
async function getCachedJSON(key) {
    try {
        const db = await initIndexedDBCache();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onsuccess = () => {
                const result = request.result;
                
                if (result && result.data) {
                    // Cache geçerliliğini kontrol et (7 gün)
                    const cacheAge = Date.now() - result.timestamp;
                    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 gün
                    
                    if (cacheAge < maxAge) {
                        log.debug(`📦 Cache'den yüklendi: ${key} (${(cacheAge / 1000 / 60).toFixed(1)} dakika önce)`);
                        resolve(result.data);
                    } else {
                        log.debug(`⏰ Cache süresi dolmuş: ${key}`);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                log.warn(`⚠️ Cache okuma hatası: ${key}`, request.error);
                resolve(null); // Hata durumunda null dön, network'ten yüklenir
            };
        });
    } catch (error) {
        log.warn('⚠️ IndexedDB başlatılamadı, cache kullanılamıyor:', error);
        return null;
    }
}

/**
 * JSON dosyasını IndexedDB'ye cache'ler
 * @param {string} key - Cache key (dosya yolu)
 * @param {object} data - Cache'lenecek veri
 * @returns {Promise<boolean>} Başarı durumu
 */
async function setCachedJSON(key, data) {
    try {
        const db = await initIndexedDBCache();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            const cacheEntry = {
                key: key,
                data: data,
                timestamp: Date.now()
            };
            
            const request = store.put(cacheEntry);

            request.onsuccess = () => {
                log.debug(`💾 Cache'e kaydedildi: ${key}`);
                resolve(true);
            };

            request.onerror = () => {
                log.warn(`⚠️ Cache yazma hatası: ${key}`, request.error);
                resolve(false); // Hata durumunda false dön ama devam et
            };
        });
    } catch (error) {
        log.warn('⚠️ IndexedDB başlatılamadı, cache kaydedilemedi:', error);
        return false;
    }
}

/**
 * Cache'i temizler (eski veriler)
 * @param {number} maxAge - Maksimum yaş (ms) - varsayılan 30 gün
 * @returns {Promise<number>} Silinen kayıt sayısı
 */
async function clearOldCache(maxAge = 30 * 24 * 60 * 60 * 1000) {
    try {
        const db = await initIndexedDBCache();
        const cutoffTime = Date.now() - maxAge;
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('timestamp');
            const range = IDBKeyRange.upperBound(cutoffTime);
            const request = index.openCursor(range);
            
            let deletedCount = 0;

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    deletedCount++;
                    cursor.continue();
                } else {
                    log.debug(`🧹 ${deletedCount} eski cache kaydı silindi`);
                    resolve(deletedCount);
                }
            };

            request.onerror = () => {
                log.warn('⚠️ Cache temizleme hatası:', request.error);
                resolve(0);
            };
        });
    } catch (error) {
        log.warn('⚠️ Cache temizleme başarısız:', error);
        return 0;
    }
}

/**
 * Tüm cache'i temizler
 * @returns {Promise<boolean>} Başarı durumu
 */
async function clearAllCache() {
    try {
        const db = await initIndexedDBCache();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => {
                log.debug('🧹 Tüm cache temizlendi');
                resolve(true);
            };

            request.onerror = () => {
                log.warn('⚠️ Cache temizleme hatası:', request.error);
                resolve(false);
            };
        });
    } catch (error) {
        log.warn('⚠️ Cache temizleme başarısız:', error);
        return false;
    }
}

// Global erişim için
window.getCachedJSON = getCachedJSON;
window.setCachedJSON = setCachedJSON;
window.clearOldCache = clearOldCache;
window.clearAllCache = clearAllCache;


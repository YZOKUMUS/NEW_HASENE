// Modüler JavaScript dosyaları yüklendi (config.js ve utils.js)
// Artık CONFIG, log, getLocalDateString, hapticFeedback, initSwipeGestures,
// sanitizeHTML, safeSetHTML, showLoading, hideLoading, encryptData, decryptData,
// secureSetItem, secureGetItem, showCustomAlert fonksiyonları kullanılabilir

// ============ HELPER FUNCTIONS ============
// ⚡ SPEED ANIMATIONS SYSTEM
function addSpeedAnimation(element, type = 'fade-in') {
    if (!element) return;
    element.classList.add(`speed-${type}`);
    setTimeout(() => element.classList.remove(`speed-${type}`), 600);
}

// 🎯 NAVIGATION HELPER
function setActiveNavItem(index) {
    // Yeni bottom-nav için
    document.querySelectorAll('.bottom-nav .nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    // Eski flutter-nav-item için geriye dönük uyumluluk
    document.querySelectorAll('.flutter-nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// 🎆 SUCCESS ANIMATIONS - CONFETTI SYSTEM
function triggerConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    // 50 konfeti parçası oluştur
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
    }

    // 3 saniye sonra temizle
    setTimeout(() => {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }, 3000);
}

function triggerSuccessBurst(element) {
    if (!element) return;
    element.classList.add('success-burst');
    setTimeout(() => element.classList.remove('success-burst'), 800);
}

// 📱 HAPTIC FEEDBACK SYSTEM
function triggerHaptic(type = 'medium') {
    // CONFIG kontrolü ile haptic feedback
    if (!CONFIG.hapticEnabled) return;
    
    try {
        // Modern haptic feedback API
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [50],
                success: [20, 50, 20],
                error: [50, 100, 50],
                combo: [20, 30, 20, 30, 50],
                warning: [30, 50, 30]
            };
            navigator.vibrate(patterns[type] || patterns.medium);
        }
    } catch (error) {
        log.debug('Haptic feedback not supported');
    }
}

// 🌐 ARABIC TEXT HELPER (Deprecated but kept for compatibility)
function updateArabicTextColoring() {
    // Fonksiyon kaldırıldı ama hala çağrılıyor, boş fonksiyon olarak tanımlı
    // Hata önleme için
}

// 🏠 NAVIGATION - ANA MENÜ
function goToMainMenu() {
    log.debug('🏠 Ana menüye dönülüyor...');
    
    // Timer varsa durdur
    if (typeof stopTimer === 'function') {
        stopTimer();
    }
    
    // Oyun seslerini durdur
    if (typeof currentAudio !== 'undefined' && currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // Tüm modalları kapat
    closeAllModals();
    
    // Tüm oyun modlarını gizle
    hideAllModes();
    
    // Ana menüyü göster
    if (elements.mainMenu) {
        elements.mainMenu.style.display = 'block';
    } else {
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) mainMenu.style.display = 'block';
    }
    
    // Navigasyon bar'ı göster
    showBottomNavBar();
    
    // Settings butonunu gizle (ana menüde gerekmez)
    if (elements.settingsBtn) {
        elements.settingsBtn.style.display = 'none';
    }
    
    log.debug('✅ Ana menü gösterildi');
}

// 🌙 DARK MODE TOGGLE
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    const darkModeIcon = document.getElementById('darkModeIcon');
    
    // Debug
    log.debug('Dark mode toggled:', isDark);
    log.debug('Body classes:', body.className);
    
    // LocalStorage'a kaydet
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    
    // Icon güncelle
    if (darkModeIcon) {
        darkModeIcon.textContent = isDark ? '☀️' : '🌙';
    }
    
    // Buton stilini güncelle
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (darkModeBtn) {
        if (isDark) {
            darkModeBtn.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
        } else {
            darkModeBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }
}

// Global erişim için (inline onclick handlers için gerekli)
window.updateArabicTextColoring = updateArabicTextColoring;
window.goToMainMenu = goToMainMenu;
window.toggleDarkMode = toggleDarkMode;

// ============ EVENT LISTENER YÖNETİMİ (Memory Leak Prevention) ============
/**
 * StorageManager - Merkezi LocalStorage yönetimi
 * Error handling, caching ve quota management ile güvenli storage
 */
class StorageManager {
    constructor() {
        this.storageAvailable = this.checkStorageAvailability();
        this.cache = new Map();
        log.debug('🗄️ StorageManager başlatıldı', { available: this.storageAvailable });
    }

    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            log.error('❌ LocalStorage kullanılamıyor:', e);
            return false;
        }
    }

    get(key, defaultValue = null) {
        if (!this.storageAvailable) {
            log.warn('⚠️ Storage kullanılamıyor, default döndürülüyor');
            return defaultValue;
        }

        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        try {
            const value = localStorage.getItem(key);
            if (value === null) {
                return defaultValue;
            }

            try {
                const parsed = JSON.parse(value);
                this.cache.set(key, parsed);
                return parsed;
            } catch (e) {
                this.cache.set(key, value);
                return value;
            }
        } catch (error) {
            log.error(`❌ Storage okuma hatası (${key}):`, error);
            return defaultValue;
        }
    }

    set(key, value) {
        if (!this.storageAvailable) {
            log.warn('⚠️ Storage kullanılamıyor, veri kaydedilmedi');
            return false;
        }

        try {
            const serialized = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, serialized);
            this.cache.set(key, value);
            return true;
        } catch (error) {
            log.error(`❌ Storage yazma hatası (${key}):`, error);
            
            if (error.name === 'QuotaExceededError') {
                log.error('💥 Storage kotası doldu! Temizlik yapılıyor...');
                this.cleanup();
                
                try {
                    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
                    localStorage.setItem(key, serialized);
                    this.cache.set(key, value);
                    log.debug(`💾 Temizlikten sonra kaydedildi: ${key}`);
                    return true;
                } catch (retryError) {
                    log.error(`❌ Temizlikten sonra bile başarısız: ${key}`);
                    return false;
                }
            }
            return false;
        }
    }

    remove(key) {
        if (!this.storageAvailable) return false;

        try {
            localStorage.removeItem(key);
            this.cache.delete(key);
            log.debug(`🗑️ Storage'dan silindi: ${key}`);
            return true;
        } catch (error) {
            log.error(`❌ Storage silme hatası (${key}):`, error);
            return false;
        }
    }

    clear() {
        if (!this.storageAvailable) return false;

        try {
            localStorage.clear();
            this.cache.clear();
            log.debug('🧹 Storage temizlendi');
            return true;
        } catch (error) {
            log.error('❌ Storage temizleme hatası:', error);
            return false;
        }
    }

    cleanup() {
        if (!this.storageAvailable) return;
        
        const keysToRemove = [];
        const now = Date.now();
        const ONE_YEAR = 365 * 24 * 60 * 60 * 1000; // 1 yıl
        
        try {
            // 1. Geçici verileri temizle (temp, cache, old)
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    if (key.startsWith('temp_') || 
                        key.startsWith('cache_') || 
                        key.startsWith('old_') ||
                        key.includes('_backup_') ||
                        key.includes('_temp')) {
                        keysToRemove.push(key);
                    }
                }
            }
            
            // 2. 1 yıldan eski daily stats'ları temizle
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key) && key.startsWith('dailyStats_')) {
                    try {
                        const dateStr = key.replace('dailyStats_', '');
                        const date = new Date(dateStr);
                        if (!isNaN(date) && (now - date.getTime() > ONE_YEAR)) {
                            keysToRemove.push(key);
                        }
                    } catch (e) {
                        // Geçersiz tarih formatı, sil
                        keysToRemove.push(key);
                    }
                }
            }
            
            // 3. Boş veya geçersiz verileri temizle
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const value = localStorage.getItem(key);
                    if (!value || value === 'undefined' || value === 'null' || value === '{}' || value === '[]') {
                        keysToRemove.push(key);
                    }
                }
            }
            
            // Temizliği uygula
            const removedCount = keysToRemove.length;
            keysToRemove.forEach(key => this.remove(key));
            
            log.debug(`🧹 Storage cleanup: ${removedCount} anahtar temizlendi`);
            return removedCount;
        } catch (error) {
            log.error('❌ Storage cleanup hatası:', error);
            return 0;
        }
    }

    getAllKeys() {
        if (!this.storageAvailable) return [];

        try {
            return Object.keys(localStorage);
        } catch (error) {
            log.error('❌ Storage key listesi alınamadı:', error);
            return [];
        }
    }

    getSize() {
        if (!this.storageAvailable) return 0;

        try {
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length + key.length;
                }
            }
            return totalSize;
        } catch (error) {
            log.error('❌ Storage boyutu hesaplanamadı:', error);
            return 0;
        }
    }

    /**
     * Veri doğrulama - Belirli bir key için beklenen veri yapısını kontrol et
     * @param {string} key - Storage anahtarı
     * @param {Object} schema - Beklenen veri şeması { type: 'object|array|number|string', required: ['field1', 'field2'] }
     * @returns {boolean} - Veri geçerli mi?
     */
    validate(key, schema) {
        const data = this.get(key);
        if (data === null || data === undefined) {
            return false;
        }

        // Tip kontrolü
        if (schema.type) {
            const actualType = Array.isArray(data) ? 'array' : typeof data;
            if (actualType !== schema.type) {
                log.warn(`⚠️ Storage validation failed: ${key} (expected ${schema.type}, got ${actualType})`);
                return false;
            }
        }

        // Required field kontrolü (sadece object için)
        if (schema.required && typeof data === 'object' && !Array.isArray(data)) {
            for (const field of schema.required) {
                if (!(field in data)) {
                    log.warn(`⚠️ Storage validation failed: ${key} missing required field "${field}"`);
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Güvenli get - Schema validation ile birlikte
     * @param {string} key - Storage anahtarı
     * @param {*} defaultValue - Default değer
     * @param {Object} schema - Opsiyonel validation şeması
     * @returns {*} - Storage değeri veya default
     */
    getSafe(key, defaultValue = null, schema = null) {
        const data = this.get(key, defaultValue);
        
        // Schema varsa validate et
        if (schema && data !== defaultValue) {
            if (!this.validate(key, schema)) {
                log.warn(`⚠️ Invalid data for ${key}, returning default`);
                return defaultValue;
            }
        }
        
        return data;
    }

    /**
     * Storage kullanım istatistikleri
     * @returns {Object} - { used: number, total: number, percent: number, itemCount: number }
     */
    getStats() {
        if (!this.storageAvailable) {
            return { used: 0, total: 0, percent: 0, itemCount: 0 };
        }

        const used = this.getSize();
        const total = 5 * 1024 * 1024; // 5MB (tarayıcı varsayılanı)
        const percent = ((used / total) * 100).toFixed(2);
        const itemCount = this.getAllKeys().length;

        return {
            used,
            total,
            percent: parseFloat(percent),
            itemCount,
            usedMB: (used / (1024 * 1024)).toFixed(2),
            totalMB: (total / (1024 * 1024)).toFixed(2)
        };
    }

    /**
     * Otomatik temizlik - Storage %80 doluysa temizlik yap
     * @returns {boolean} - Temizlik yapıldı mı?
     */
    autoCleanup() {
        const stats = this.getStats();
        if (stats.percent > 80) {
            log.warn(`⚠️ Storage %${stats.percent} dolu, otomatik temizlik başlatılıyor...`);
            const cleaned = this.cleanup();
            log.debug(`🧹 Otomatik temizlik: ${cleaned} anahtar silindi`);
            return true;
        }
        return false;
    }
}

// Global storage manager
const storage = new StorageManager();

/**
 * Storage Schemas - Kritik veriler için validation şemaları
 * Type safety ve data integrity sağlar
 */
const StorageSchemas = {
    // User Data Schemas
    dailyGoalHasene: { type: 'string', validate: (v) => !isNaN(parseInt(v)) && parseInt(v) > 0 },
    dailyGoalLevel: { type: 'string', validate: (v) => ['easy', 'normal', 'serious'].includes(v) },
    dailyHasene: { type: 'string', validate: (v) => !isNaN(parseInt(v)) && parseInt(v) >= 0 },
    dailyCorrect: { type: 'string', validate: (v) => !isNaN(parseInt(v)) && parseInt(v) >= 0 },
    dailyWrong: { type: 'string', validate: (v) => !isNaN(parseInt(v)) && parseInt(v) >= 0 },
    
    // Game State Schemas
    hasene_totalPoints: { type: 'string', validate: (v) => !isNaN(parseInt(v)) && parseInt(v) >= 0 },
    hasene_wordStats: { type: 'object', validate: (v) => typeof v === 'object' && !Array.isArray(v) },
    hasene_dailyTasks: { type: 'object', required: ['todayStats'], validate: (v) => v.todayStats !== undefined },
    
    // Achievement Schemas
    unlockedAchievements: { type: 'array', validate: (v) => Array.isArray(v) },
    hasene_badges: { type: 'object', validate: (v) => typeof v === 'object' },
    
    // Streak Data Schema
    hasene_streakData: { 
        type: 'object', 
        required: ['currentStreak', 'bestStreak', 'playDates'],
        validate: (v) => {
            return v.currentStreak !== undefined && 
                   v.bestStreak !== undefined && 
                   Array.isArray(v.playDates);
        }
    }
};

/**
 * Storage Helper - Schema validation ile güvenli storage erişimi
 */
const StorageHelper = {
    /**
     * Validation ile güvenli get
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default değer
     * @returns {*} - Validated değer veya default
     */
    getSafe(key, defaultValue = null) {
        const schema = StorageSchemas[key];
        if (!schema) {
            // Schema yoksa normal get
            return storage.get(key, defaultValue);
        }
        
        const value = storage.get(key, defaultValue);
        if (value === defaultValue) {
            return value;
        }
        
        // Type check
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== schema.type) {
            log.warn(`⚠️ Type mismatch for ${key}: expected ${schema.type}, got ${actualType}. Using default.`);
            return defaultValue;
        }
        
        // Custom validation
        if (schema.validate && !schema.validate(value)) {
            log.warn(`⚠️ Validation failed for ${key}. Using default.`);
            return defaultValue;
        }
        
        // Required fields check (for objects)
        if (schema.required && actualType === 'object') {
            for (const field of schema.required) {
                if (!(field in value)) {
                    log.warn(`⚠️ Missing required field "${field}" in ${key}. Using default.`);
                    return defaultValue;
                }
            }
        }
        
        return value;
    },

    /**
     * Validation ile güvenli set
     * @param {string} key - Storage key
     * @param {*} value - Değer
     * @returns {boolean} - Başarılı mı?
     */
    setSafe(key, value) {
        const schema = StorageSchemas[key];
        if (!schema) {
            // Schema yoksa normal set
            return storage.set(key, value);
        }
        
        // Type check
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== schema.type) {
            log.error(`❌ Cannot save ${key}: type mismatch (expected ${schema.type}, got ${actualType})`);
            return false;
        }
        
        // Custom validation
        if (schema.validate && !schema.validate(value)) {
            log.error(`❌ Cannot save ${key}: validation failed`);
            return false;
        }
        
        // Required fields check
        if (schema.required && actualType === 'object') {
            for (const field of schema.required) {
                if (!(field in value)) {
                    log.error(`❌ Cannot save ${key}: missing required field "${field}"`);
                    return false;
                }
            }
        }
        
        return storage.set(key, value);
    },

    /**
     * Schema tanımı ekle (runtime'da)
     * @param {string} key - Storage key
     * @param {Object} schema - Schema tanımı
     */
    addSchema(key, schema) {
        StorageSchemas[key] = schema;
        log.debug(`📋 Schema eklendi: ${key}`);
    }
};

/**
 * Performance Monitor - Performans izleme ve optimizasyon
 * Memory, timing ve render performansını izler
 */
const PerformanceMonitor = {
    enabled: false, // CONFIG.debug true olunca otomatik aktif olur
    
    /**
     * Fonksiyon çalışma süresini ölç
     * @param {string} name - Fonksiyon adı
     * @param {Function} fn - Ölçülecek fonksiyon
     * @returns {*} - Fonksiyonun return değeri
     */
    measure(name, fn) {
        if (!this.enabled) return fn();
        
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        const duration = (end - start).toFixed(2);
        
        if (duration > 16.67) { // 60 FPS threshold (1000ms / 60fps = 16.67ms)
            log.warn(`⚠️ Slow function: ${name} took ${duration}ms (>16.67ms threshold)`);
        } else {
            log.debug(`⏱️ ${name}: ${duration}ms`);
        }
        
        return result;
    },

    /**
     * Async fonksiyon çalışma süresini ölç
     * @param {string} name - Fonksiyon adı
     * @param {Function} fn - Ölçülecek async fonksiyon
     * @returns {Promise<*>}
     */
    async measureAsync(name, fn) {
        if (!this.enabled) return await fn();
        
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        const duration = (end - start).toFixed(2);
        
        log.debug(`⏱️ ${name} (async): ${duration}ms`);
        return result;
    },

    /**
     * Memory kullanımını raporla
     */
    logMemory() {
        if (!this.enabled || !performance.memory) return;
        
        const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
        const total = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
        const limit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
        
        log.debug(`💾 Memory: ${used}MB / ${total}MB (Limit: ${limit}MB)`);
    },

    /**
     * Storage kullanımını raporla
     */
    logStorage() {
        if (!this.enabled) return;
        
        const stats = storage.getStats();
        log.debug(`💾 Storage: ${stats.usedMB}MB / ${stats.totalMB}MB (${stats.percent}%) - ${stats.itemCount} items`);
    },

    /**
     * Tüm performans metriklerini raporla
     */
    report() {
        if (!this.enabled) return;
        
        log.debug('\n📊 === PERFORMANCE REPORT ===');
        this.logMemory();
        this.logStorage();
        log.debug('===========================\n');
    }
};

/**
 * Error Boundary - Global hata yakalama ve raporlama
 * Production'da kullanıcıya friendly mesaj, console'a detaylı log
 */
const ErrorBoundary = {
    /**
     * Güvenli fonksiyon wrapper
     * @param {Function} fn - Çalıştırılacak fonksiyon
     * @param {*} fallbackValue - Hata durumunda döndürülecek değer
     * @param {string} context - Hata context'i
     * @returns {*}
     */
    safe(fn, fallbackValue = null, context = 'Unknown') {
        try {
            return fn();
        } catch (error) {
            log.error(`❌ Error in ${context}:`, error);
            log.error('Stack trace:', error.stack);
            
            if (CONFIG.showCriticalErrors) {
                showCustomAlert(
                    `Bir hata oluştu: ${context}`,
                    'error'
                );
            }
            
            return fallbackValue;
        }
    },

    /**
     * Güvenli async fonksiyon wrapper
     * @param {Function} fn - Çalıştırılacak async fonksiyon
     * @param {*} fallbackValue - Hata durumunda döndürülecek değer
     * @param {string} context - Hata context'i
     * @returns {Promise<*>}
     */
    async safeAsync(fn, fallbackValue = null, context = 'Unknown') {
        try {
            return await fn();
        } catch (error) {
            log.error(`❌ Async error in ${context}:`, error);
            log.error('Stack trace:', error.stack);
            
            if (CONFIG.showCriticalErrors) {
                showCustomAlert(
                    `Bir hata oluştu: ${context}`,
                    'error'
                );
            }
            
            return fallbackValue;
        }
    },

    /**
     * Global error handler'ı başlat
     */
    init() {
        // Uncaught errors
        window.addEventListener('error', (event) => {
            log.error('❌ Global error:', event.error);
            log.error('  Message:', event.message);
            log.error('  File:', event.filename);
            log.error('  Line:', event.lineno);
            log.error('  Column:', event.colno);
            
            // Kullanıcıya bildirme
            if (CONFIG.showCriticalErrors) {
                showCustomAlert(
                    'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.',
                    'error'
                );
            }
            
            return true; // Prevent default error handling
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            log.error('❌ Unhandled promise rejection:', event.reason);
            log.error('  Promise:', event.promise);
            
            if (CONFIG.showCriticalErrors) {
                showCustomAlert(
                    'Bir işlem başarısız oldu. Lütfen tekrar deneyin.',
                    'error'
                );
            }
            
            event.preventDefault();
        });
        
        log.debug('✅ ErrorBoundary initialized');
    }
};

// Performance monitoring'i CONFIG.debug ile aktif et
if (CONFIG.debug) {
    PerformanceMonitor.enabled = true;
    log.debug('⚡ PerformanceMonitor enabled');
}

// Error boundary'yi başlat
ErrorBoundary.init();

/**
 * DOM Helper - Güvenli DOM element erişimi ve güncelleme
 * Null safety ile hata riski azaltılır
 */
const DOM = {
    /**
     * Element'i güvenli şekilde al
     * @param {string} id - Element ID
     * @param {string} context - Hata mesajında gösterilecek context
     * @returns {HTMLElement|null}
     */
    get(id, context = '') {
        const el = document.getElementById(id);
        if (!el && context) {
            log.warn(`⚠️ Element bulunamadı: ${id} ${context ? `(${context})` : ''}`);
        }
        return el;
    },

    /**
     * Text content'i güvenli şekilde güncelle
     * @param {string} id - Element ID
     * @param {string} value - Yeni text değeri
     * @returns {boolean} - Başarılı mı?
     */
    setText(id, value) {
        const el = this.get(id);
        if (el) {
            el.textContent = value;
            return true;
        }
        return false;
    },

    /**
     * HTML content'i güvenli şekilde güncelle
     * @param {string} id - Element ID
     * @param {string} html - Yeni HTML değeri
     * @returns {boolean} - Başarılı mı?
     */
    setHTML(id, html) {
        const el = this.get(id);
        if (el) {
            el.innerHTML = html;
            return true;
        }
        return false;
    },

    /**
     * Class ekle (güvenli)
     * @param {string} id - Element ID
     * @param {string} className - Eklenecek class
     * @returns {boolean} - Başarılı mı?
     */
    addClass(id, className) {
        const el = this.get(id);
        if (el) {
            el.classList.add(className);
            return true;
        }
        return false;
    },

    /**
     * Class kaldır (güvenli)
     * @param {string} id - Element ID
     * @param {string} className - Kaldırılacak class
     * @returns {boolean} - Başarılı mı?
     */
    removeClass(id, className) {
        const el = this.get(id);
        if (el) {
            el.classList.remove(className);
            return true;
        }
        return false;
    },

    /**
     * Style güncelle (güvenli)
     * @param {string} id - Element ID
     * @param {string} property - CSS property
     * @param {string} value - CSS value
     * @returns {boolean} - Başarılı mı?
     */
    setStyle(id, property, value) {
        const el = this.get(id);
        if (el) {
            el.style[property] = value;
            return true;
        }
        return false;
    },

    /**
     * Birden fazla element için text güncelle
     * @param {Object} updates - { elementId: value, ... }
     * @returns {number} - Başarılı güncelleme sayısı
     */
    setTextBatch(updates) {
        let successCount = 0;
        for (const [id, value] of Object.entries(updates)) {
            if (this.setText(id, value)) {
                successCount++;
            }
        }
        return successCount;
    }
};

/**
 * EventListenerManager - Memory leak'leri önlemek için merkezi event listener yönetimi
 * WeakMap kullanarak elementler için listener'ları takip eder
 */
class EventListenerManager {
    constructor() {
        this.listeners = new WeakMap();
        log.debug('🎧 EventListenerManager başlatıldı');
    }
    
    /**
     * Event listener ekle ve kaydet
     * @param {HTMLElement} element - Hedef element
     * @param {string} event - Event tipi (click, touchstart vb.)
     * @param {Function} handler - Event handler fonksiyonu
     * @param {Object} options - addEventListener options
     */
    add(element, event, handler, options = {}) {
        if (!element) {
            log.warn('⚠️ EventListenerManager.add: element null!');
            return;
        }
        
        // Element için listener listesi al veya oluştur
        let elementListeners = this.listeners.get(element);
        if (!elementListeners) {
            elementListeners = [];
            this.listeners.set(element, elementListeners);
        }
        
        // Listener'ı ekle
        element.addEventListener(event, handler, options);
        elementListeners.push({ event, handler, options });
        
        log.debug(`➕ Listener eklendi: ${event} (Toplam: ${elementListeners.length})`);
    }
    
    /**
     * Belirli bir element için tüm listener'ları temizle
     * @param {HTMLElement} element - Temizlenecek element
     */
    cleanup(element) {
        if (!element) {
            log.warn('⚠️ EventListenerManager.cleanup: element null!');
            return;
        }
        
        const elementListeners = this.listeners.get(element);
        if (!elementListeners) {
            log.debug('ℹ️ Temizlenecek listener yok');
            return;
        }
        
        // Tüm listener'ları kaldır
        let removed = 0;
        elementListeners.forEach(({ event, handler, options }) => {
            element.removeEventListener(event, handler, options);
            removed++;
        });
        
        // WeakMap'ten sil
        this.listeners.delete(element);
        
        log.debug(`🧹 ${removed} listener temizlendi`);
    }
    
    /**
     * Birden fazla element için temizlik yap
     * @param {Array<HTMLElement>} elements - Temizlenecek elementler
     */
    cleanupMultiple(elements) {
        if (!Array.isArray(elements)) {
            log.warn('⚠️ EventListenerManager.cleanupMultiple: elements array değil!');
            return;
        }
        
        elements.forEach(element => this.cleanup(element));
        log.debug(`🧹 ${elements.length} element için cleanup tamamlandı`);
    }
}

// Global instance oluştur
const eventManager = new EventListenerManager();

// ============ GLOBAL FONKSİYONLAR (onclick için erişilebilir olmalı) ============

// NOT: switchStatsTab fonksiyonu kaldırıldı - Stats modal'da tab sistemi yok
// Stats modal tek bir scroll edilebilir içerik olarak çalışıyor

// Daily Goal Functions
function showDailyGoalSettings() {
    const modal = document.getElementById('dailyGoalModal');
    if (modal) {
        modal.style.display = 'flex';
        // Touch event'leri başlat
        initDailyGoalModalTouchEvents();
    }
}

function closeDailyGoalModal() {
    const modal = document.getElementById('dailyGoalModal');
    if (modal) {
        // Event listener'ları temizle (memory leak prevention)
        eventManager.cleanup(modal);
        modal.style.display = 'none';
        log.debug('🔒 Daily Goal Modal kapatıldı ve temizlendi');
    }
}

// Global erişim için (inline onclick handlers)
window.showDailyGoalSettings = showDailyGoalSettings;
window.closeDailyGoalModal = closeDailyGoalModal;

// Daily Goal Modal için touch event'leri
let dailyGoalModalTouchStart = { x: 0, y: 0, time: 0 };
let dailyGoalModalIsScrolling = false;

function initDailyGoalModalTouchEvents() {
    const dailyGoalModal = document.getElementById('dailyGoalModal');
    if (!dailyGoalModal) return;
    
    // Eğer zaten eklenmişse, tekrar ekleme
    if (dailyGoalModal.hasAttribute('data-touch-events-initialized')) return;
    dailyGoalModal.setAttribute('data-touch-events-initialized', 'true');
    
    // Modal overlay için touch event'leri
    dailyGoalModal.addEventListener('touchstart', function(e) {
        if (e.target && e.target.closest('.modal-content')) {
            return;
        }
        
        const touch = e.touches[0];
        dailyGoalModalTouchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
        dailyGoalModalIsScrolling = false;
    }, { passive: true });
    
    dailyGoalModal.addEventListener('touchmove', function(e) {
        if (e.target && e.target.closest('.modal-content')) {
            return;
        }
        
        if (dailyGoalModalTouchStart.x !== 0 || dailyGoalModalTouchStart.y !== 0) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - dailyGoalModalTouchStart.x);
            const deltaY = Math.abs(touch.clientY - dailyGoalModalTouchStart.y);
            if (deltaX > 10 || deltaY > 10) {
                dailyGoalModalIsScrolling = true;
            }
        }
    }, { passive: true });
    
    dailyGoalModal.addEventListener('touchend', function(e) {
        if (dailyGoalModalIsScrolling) {
            dailyGoalModalIsScrolling = false;
            dailyGoalModalTouchStart = { x: 0, y: 0, time: 0 };
            return;
        }
        
        const touch = e.changedTouches[0];
        const deltaTime = Date.now() - dailyGoalModalTouchStart.time;
        const deltaX = Math.abs(touch.clientX - dailyGoalModalTouchStart.x);
        const deltaY = Math.abs(touch.clientY - dailyGoalModalTouchStart.y);
        
        if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
            if (e.target && e.target.closest('.modal-content')) {
                return;
            }
            if (e.target && (e.target.id === 'closeDailyGoalBtn' || e.target.closest('#closeDailyGoalBtn'))) {
                return;
            }
            closeDailyGoalModal();
        }
        
        dailyGoalModalTouchStart = { x: 0, y: 0, time: 0 };
    }, { passive: true });
}

// Her yere tıklayınca kapatma fonksiyonu
function handleDailyGoalModalClick(event) {
    const target = event.target;
    if (target && target.closest('button[onclick*="closeDailyGoalModal"]')) {
        return;
    }
    if (target && target.closest('.modal-content')) {
        return;
    }
    closeDailyGoalModal();
}

// Global olarak erişilebilir yap
window.handleDailyGoalModalClick = handleDailyGoalModalClick;

function setDailyGoal(level) {
    // 1 saat oyun = ~8000 Hasene
    // Kolay: 10 dakika (~1300 Hasene)
    // Normal: 20 dakika (~2700 Hasene)  
    // Ciddi: 45 dakika (~6000 Hasene)
    const goals = {
        easy: { hasene: 1300, name: 'Rahat', icon: '🌱' },
        normal: { hasene: 2700, name: 'Normal', icon: '🎯' },
        serious: { hasene: 6000, name: 'Ciddi', icon: '🔥' }
    };
    
    const goal = goals[level];
    // Storage manager ile güvenli kaydet
    storage.set('dailyGoalLevel', level);
    storage.set('dailyGoalHasene', goal.hasene.toString());
    
    // Günlük Hasene'yi sıfırla (her gün başta)
    const today = getLocalDateString(); // Yerel tarih (YYYY-MM-DD)
    const lastDate = storage.get('lastDailyGoalDate');
    // Eski format (toDateString) kontrolü - geriye uyumluluk için
    const todayOldFormat = new Date().toDateString();
    if (lastDate !== today && lastDate !== todayOldFormat) {
        storage.set('dailyXP', '0');
        storage.set('lastDailyGoalDate', today);
    }
    
    updateDailyGoalDisplay();
    closeDailyGoalModal();
    
    // Başarı mesajı
    showSuccessMessage(goal.icon + ' Günlük virdin ' + goal.name + ' olarak ayarlandı!');
}

function updateDailyGoalDisplay() {
    const goalXP = parseInt(storage.get('dailyGoalHasene', '2700')) || 2700;
    const dailyXP = parseInt(storage.get('dailyHasene', '0')) || 0;
    const goalLevel = storage.get('dailyGoalLevel', 'normal');
    
    const goals = {
        easy: { name: 'Rahat', icon: '🌱' },
        normal: { name: 'Normal', icon: '🎯' },
        serious: { name: 'Ciddi', icon: '🔥' }
    };
    
    // Division by zero check
    const progressPercent = goalXP > 0 ? Math.min((dailyXP / goalXP) * 100, 100) : 0;
    const isCompleted = dailyXP >= goalXP;
    
    // NULL KONTROL - Elementleri kontrol et
    const progressEl = document.getElementById('dailyGoalProgress');
    const progressTextEl = document.getElementById('dailyGoalProgressText');
    const goalTextEl = document.getElementById('dailyGoalText');
    const goalButton = document.querySelector('.goal-settings-btn');
    const goalButtonIcon = document.getElementById('goalButtonIcon'); // Opsiyonel element
    
    if (!progressEl || !progressTextEl || !goalTextEl) {
        log.error('❌ HATA: Günlük hedef elementleri bulunamadı!');
        return;
    }
    
    // Progress bar güncelle (yeni minimal tasarım için) - DOM helper ile güvenli
    const progressBar = document.querySelector('.daily-goal-card .progress-bar');
    const progressBarMinimal = document.querySelector('.progress-fill-minimal');
    if (progressBar) {
        progressBar.style.width = progressPercent + '%';
    }
    if (progressBarMinimal) {
        progressBarMinimal.style.width = progressPercent + '%';
        progressBarMinimal.setAttribute('aria-valuenow', Math.round(progressPercent));
    }
    if (progressEl) {
        progressEl.style.width = progressPercent + '%';
        progressEl.setAttribute('aria-valuenow', Math.round(progressPercent));
    }
    
    // Text güncelle - formatlanmış versiyon
    const formattedDailyXP = dailyXP.toLocaleString('tr-TR');
    const formattedGoalXP = goalXP.toLocaleString('tr-TR');
    DOM.setText('dailyGoalProgressText', `${formattedDailyXP} / ${formattedGoalXP}`);
    DOM.setText('dailyGoalText', `Günlük Vird: ${goalXP} Hasene`);
    
    // Hedef tamamlandıysa
    if (isCompleted) {
        goalTextEl.textContent = '✅ Günlük vird tamamlandı!';
        
        // Butonu altın yap ve kutlama animasyonu ekle
        if (goalButton) {
            goalButton.classList.add('completed');
            goalButton.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
            goalButton.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.5), 0 0 0 0 rgba(255, 215, 0, 0.7)';
            if (goalButtonIcon) {
                goalButtonIcon.textContent = '✨';
            }
        }
    } else {
        // Hedef tamamlanmadıysa normal görünüm
        if (goalButton) {
            goalButton.classList.remove('completed');
            goalButton.style.background = 'linear-gradient(135deg, #58cc02 0%, #4db300 100%)';
            goalButton.style.boxShadow = '0 4px 12px rgba(88, 204, 2, 0.4), 0 0 0 0 rgba(88, 204, 2, 0.7)';
            if (goalButtonIcon) {
                goalButtonIcon.textContent = '🎯';
            }
        }
    }
}

// Günlük verileri tarih bazlı kaydet (Son 7 Gün Trendi için)
function saveDailyStats() {
    try {
        const today = getLocalDateString(); // Yerel tarih (YYYY-MM-DD)
        const dayKey = `hasene_daily_${today}`;
        
        // Mevcut günlük verileri al veya yeni oluştur (storage manager ile)
        const dailyHasene = parseInt(storage.get('dailyHasene', '0')) || 0;
        const dailyCorrect = parseInt(storage.get('dailyCorrect', '0')) || 0;
        const dailyWrong = parseInt(storage.get('dailyWrong', '0')) || 0;
        
        log.debug('💾 saveDailyStats çağrıldı:', {
            today,
            dayKey,
            dailyHasene,
            dailyCorrect,
            dailyWrong
        });
        
        // Tarih bazlı veriyi kaydet
        const dayData = {
            hasene: dailyHasene,
            correct: dailyCorrect,
            wrong: dailyWrong,
            date: today
        };
        
        storage.set(dayKey, dayData);
        
        // Doğrulama: Kaydedilen veriyi oku
        const saved = storage.get(dayKey);
        if (saved) {
            log.debug('✅ Günlük veriler kaydedildi:', saved);
        } else {
            log.error('❌ Günlük veriler kaydedilemedi!');
        }
    } catch (error) {
        log.error('❌ saveDailyStats hatası:', error);
    }
}

function addDailyXP(xp) {
    const today = getLocalDateString(); // Yerel tarih (YYYY-MM-DD)
    const lastDate = storage.get('lastDailyGoalDate');
    // Eski format (toDateString) kontrolü - geriye uyumluluk için
    const todayOldFormat = new Date().toDateString();
    
    // Yeni gün başladıysa sıfırla (storage manager ile)
    if (lastDate !== today && lastDate !== todayOldFormat) {
        storage.set('dailyXP', '0');
        storage.set('lastDailyGoalDate', today);
        
        // Günlük verileri sıfırla
        storage.set('dailyHasene', '0');
        storage.set('dailyCorrect', '0');
        storage.set('dailyWrong', '0');
    }
    
    const currentXP = parseInt(storage.get('dailyHasene', '0')) || 0;
    const goalXP = parseInt(storage.get('dailyGoalHasene', '2700')) || 2700;
    const newXP = currentXP + xp;
    
    storage.set('dailyHasene', newXP.toString());
    
    // Günlük verileri tarih bazlı kaydet (Son 7 Gün Trendi için)
    saveDailyStats();
    
    // Hedef tamamlandıysa
    if (currentXP < goalXP && newXP >= goalXP) {
        setTimeout(() => {
            showSuccessMessage('🎉 Günlük virdi tamamladın! +1000 ihsan Hasene!');
            // Bonus Hasene ekle (puan sistemine direkt ekle)
            const dailyGoalBonus = 1000;
            totalPoints += dailyGoalBonus;
            
            // Bugünkü toplam puana da ekle (istatistikler için)
            dailyTasks.todayStats.toplamPuan += dailyGoalBonus;
            
            // Günlük vird bonusunu liderlik tablosuna da ekle
            if (typeof updateLeaderboardScores === 'function' && dailyGoalBonus > 0) {
                updateLeaderboardScores(dailyGoalBonus);
                log.game(`📊 Liderlik tablosu güncellendi (günlük vird bonusu): +${dailyGoalBonus} Hasene`);
            }
            
            updateStatsBar();
            debouncedSaveStats(); // Debounced kaydetme
            checkAchievements();
        }, 1000);
    }
    
    updateDailyGoalDisplay();
}

function showSuccessMessage(message) {
    const msg = document.createElement('div');
    msg.textContent = message;
    // comboIndicator ile aynı boyutlar: padding: 10px 16px, font-size: 14px, border-radius: 10px
    msg.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); color: white; padding: 10px 16px; border-radius: 10px; font-weight: 600; font-size: 14px; z-index: 10000; box-shadow: 0 4px 15px rgba(74,222,128,0.4); animation: slideUp 0.3s ease; max-width: 90%; box-sizing: border-box; text-align: center; line-height: 1.3; margin: 0;';
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

// Ses sistemi (GLOBAL)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'correct':
            // Yükselen tonlar (C5 -> E5 -> G5)
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
            
        case 'wrong':
            // Düşen ton (G4 -> C4)
            oscillator.frequency.setValueAtTime(392.00, now); // G4
            oscillator.frequency.exponentialRampToValueAtTime(261.63, now + 0.2); // C4
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
            
        case 'levelup':
            // Fanfar (C5 -> E5 -> G5 -> C6)
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
            oscillator.frequency.setValueAtTime(1046.50, now + 0.3); // C6
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;
            
        case 'combo':
            // Hızlı yükselen tonlar
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.setValueAtTime(783.99, now + 0.05); // G5
            oscillator.frequency.setValueAtTime(1046.50, now + 0.1); // C6
            gainNode.gain.setValueAtTime(0.25, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;
    }
}

// ============ KELİME İSTATİSTİKLERİ FONKSİYONLARI ============
function updateWordStatistics() {
    log.stats('📊 updateWordStatistics ÇAĞRILDI!');
    
    try {
    const wordStats = loadWordStats();
    log.stats('📦 wordStats yüklendi:', wordStats);
    
    // Genel istatistikleri hesapla
    const totalWords = Object.keys(wordStats).length;
    const masteredWords = Object.values(wordStats).filter(stat => stat.masteryLevel >= 3.0 && stat.successRate >= 0.6).length;
    const strugglingWords = Object.values(wordStats).filter(stat => stat.successRate < 0.6 || stat.masteryLevel < 1.0).length;
    
        // Genel özet güncelle (null kontrolü ile)
        const wordStatsTotalEl = document.getElementById('wordStatsTotal');
        const wordStatsMasteredEl = document.getElementById('wordStatsMastered');
        const wordStatsStrugglingEl = document.getElementById('wordStatsStruggling');
        
        if (wordStatsTotalEl) wordStatsTotalEl.textContent = totalWords;
        if (wordStatsMasteredEl) wordStatsMasteredEl.textContent = masteredWords;
        if (wordStatsStrugglingEl) wordStatsStrugglingEl.textContent = strugglingWords;
    
    // Kelime listesini göster (varsayılan: hepsi)
    filterWordStats('all');
    
        // Event listener'ları ekle (sadece bir kez) - null kontrolü ile
        const filterAll = document.getElementById('filterAll');
        const filterFavorites = document.getElementById('filterFavorites');
        const filterReview = document.getElementById('filterReview');
        const filterMastered = document.getElementById('filterMastered');
        const filterStruggling = document.getElementById('filterStruggling');
        const filterRecent = document.getElementById('filterRecent');
        
        // Favoriler ve tekrar listesini yükle
        if (typeof loadFavorites === 'function') loadFavorites();
        if (typeof loadReviewWords === 'function') loadReviewWords();
        
        // Tüm butonları güncelle
        updateAllTabButtons();
        
        if (filterAll && !filterAll.hasAttribute('data-listener-added')) {
            filterAll.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                updateAllTabButtons();
                filterWordStats('all');
            };
            filterAll.setAttribute('data-listener-added', 'true');
        }
        if (filterFavorites && !filterFavorites.hasAttribute('data-listener-added')) {
            filterFavorites.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (typeof loadFavorites === 'function') loadFavorites();
                updateAllTabButtons();
                filterWordStats('favorites');
            };
            filterFavorites.setAttribute('data-listener-added', 'true');
        }
        if (filterReview && !filterReview.hasAttribute('data-listener-added')) {
            filterReview.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (typeof loadReviewWords === 'function') {
                    loadReviewWords();
                }
                updateAllTabButtons();
                filterWordStats('review');
            };
            filterReview.setAttribute('data-listener-added', 'true');
        }
        if (filterMastered && !filterMastered.hasAttribute('data-listener-added')) {
            filterMastered.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                updateAllTabButtons();
                filterWordStats('mastered');
            };
            filterMastered.setAttribute('data-listener-added', 'true');
        }
        if (filterStruggling && !filterStruggling.hasAttribute('data-listener-added')) {
            filterStruggling.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                updateAllTabButtons();
                filterWordStats('struggling');
            };
            filterStruggling.setAttribute('data-listener-added', 'true');
        }
        if (filterRecent && !filterRecent.hasAttribute('data-listener-added')) {
            filterRecent.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                updateAllTabButtons();
                filterWordStats('recent');
            };
            filterRecent.setAttribute('data-listener-added', 'true');
        }
    } catch (error) {
        log.error('❌ updateWordStatistics HATA:', error);
        log.error('Stack trace:', error.stack);
    }
}

// Tüm sekme butonlarını güncelle (kelime sayıları ile)
function updateAllTabButtons() {
    try {
        const loadWordStatsFn = typeof loadWordStats === 'function' ? loadWordStats : (typeof window !== 'undefined' && typeof window.loadWordStats === 'function' ? window.loadWordStats : null);
        if (!loadWordStatsFn) {
            // loadWordStats henüz yüklenmemiş, sadece mevcut sayıları güncelle
            return;
        }
        
        const wordStats = loadWordStatsFn();
        if (!wordStats || typeof wordStats !== 'object') {
            return;
        }
        
        const totalWords = Object.keys(wordStats).length;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        // Favoriler sayısı
        if (typeof loadFavorites === 'function') {
            loadFavorites();
        }
        const favoriteWords = (typeof window !== 'undefined' && window.favoriteWords && Array.isArray(window.favoriteWords))
            ? window.favoriteWords
            : [];
        
        // Tekrar sayısı
        if (typeof loadReviewWords === 'function') {
            loadReviewWords();
        }
        const reviewWords = (typeof window !== 'undefined' && window.reviewWords && Array.isArray(window.reviewWords))
            ? window.reviewWords
            : [];
        
        // Öğrenildi sayısı
        let masteredCount = 0;
        // Zorlanılan sayısı
        let strugglingCount = 0;
        // Son görülen sayısı (son 7 gün)
        let recentCount = 0;
        
        Object.values(wordStats).forEach(stat => {
            if (!stat) return;
            
            const totalAttempts = (stat.correct || 0) + (stat.wrong || 0);
            // Başarı oranını hesapla (eğer yoksa)
            let successRate = stat.successRate;
            if (typeof successRate === 'undefined' || successRate === null) {
                successRate = totalAttempts > 0 ? ((stat.correct || 0) / totalAttempts) : 0;
            }
            const masteryLevel = stat.masteryLevel || 0;
            const lastSeen = stat.lastSeen || now;
            const daysSinceLastSeen = (now - lastSeen) / oneDay;
            
            // Öğrenildi: ustalık >= 3.0 ve başarı >= 60%
            if (masteryLevel >= 3.0 && successRate >= 0.6) {
                masteredCount++;
            }
            
            // Zorlanılan: başarı < 60% veya ustalık < 1.0
            if (successRate < 0.6 || masteryLevel < 1.0) {
                strugglingCount++;
            }
            
            // Son görülen: son 7 gün içinde
            if (daysSinceLastSeen < 7) {
                recentCount++;
            }
        });
        
        // Hepsi butonu
        const filterAllBtn = document.getElementById('filterAll');
        if (filterAllBtn) {
            filterAllBtn.textContent = totalWords > 0 ? `Hepsi (${totalWords})` : 'Hepsi';
            filterAllBtn.title = `${totalWords} kelime istatistiği var`;
        }
        
        // Favoriler butonu
        const filterFavoritesBtn = document.getElementById('filterFavorites');
        if (filterFavoritesBtn) {
            const count = favoriteWords.length;
            filterFavoritesBtn.textContent = count > 0 ? `⭐ Favoriler (${count})` : '⭐ Favoriler';
            filterFavoritesBtn.title = count > 0 ? `${count} favori kelime` : 'Favori kelime yok';
        }
        
        // Tekrar butonu
        const filterReviewBtn = document.getElementById('filterReview');
        if (filterReviewBtn) {
            const count = reviewWords.length;
            filterReviewBtn.textContent = count > 0 ? `🔄 Tekrar (${count})` : '🔄 Tekrar';
            filterReviewBtn.title = count > 0 ? `${count} kelime tekrar gerektiriyor` : 'Tekrar gerektiren kelime yok';
        }
        
        // Öğrenildi butonu
        const filterMasteredBtn = document.getElementById('filterMastered');
        if (filterMasteredBtn) {
            filterMasteredBtn.textContent = masteredCount > 0 ? `Öğrenildi (${masteredCount})` : 'Öğrenildi';
            filterMasteredBtn.title = masteredCount > 0 ? `${masteredCount} kelime öğrenildi` : 'Henüz öğrenilmiş kelime yok';
        }
        
        // Zorlanılan butonu
        const filterStrugglingBtn = document.getElementById('filterStruggling');
        if (filterStrugglingBtn) {
            filterStrugglingBtn.textContent = strugglingCount > 0 ? `Zorlanılan (${strugglingCount})` : 'Zorlanılan';
            filterStrugglingBtn.title = strugglingCount > 0 ? `${strugglingCount} kelime ile zorlanıyorsun` : 'Zorlandığın kelime yok';
        }
        
        // Son Görülen butonu
        const filterRecentBtn = document.getElementById('filterRecent');
        if (filterRecentBtn) {
            filterRecentBtn.textContent = recentCount > 0 ? `Son Görülen (${recentCount})` : 'Son Görülen';
            filterRecentBtn.title = recentCount > 0 ? `Son 7 günde ${recentCount} kelime görüldü` : 'Son 7 günde kelime görülmedi';
        }
        
    } catch (error) {
        log.error('❌ updateAllTabButtons hatası:', error);
    }
}

// Tekrar butonuna kelime sayısını ekle (geriye uyumluluk için)
function updateReviewButtonCount() {
    updateAllTabButtons();
}

// Test fonksiyonu: Tekrar listesini konsolda detaylı göster
// Test fonksiyonu - sadece debug modunda çalışır
function testReviewWords() {
    // Debug modu kontrolü
    if (typeof CONFIG === 'undefined' || !CONFIG.debugTest) {
        if (typeof log !== 'undefined' && log.error) {
            log.error('❌ Test fonksiyonları sadece debug modunda çalışır. Konsolda: CONFIG.debugTest = true; yapın.');
        }
        return;
    }
    
    log.debug('🧪 TEKRAR KELİMELERİ TEST RAPORU');
    log.debug('=====================================');
    
    try {
        // 1. loadWordStats kontrolü
        const loadWordStatsFn = typeof loadWordStats === 'function' ? loadWordStats : (typeof window !== 'undefined' && typeof window.loadWordStats === 'function' ? window.loadWordStats : null);
        if (!loadWordStatsFn) {
            log.error('❌ loadWordStats fonksiyonu bulunamadı!');
            return;
        }
        
        const wordStats = loadWordStatsFn();
        const totalWords = Object.keys(wordStats).length;
        log.debug(`📊 Toplam kelime istatistiği: ${totalWords}`);
        
        // 2. loadReviewWords çağır
        if (typeof loadReviewWords === 'function') {
            loadReviewWords();
        } else {
            log.error('❌ loadReviewWords fonksiyonu bulunamadı!');
            return;
        }
        
        const reviewWords = (typeof window !== 'undefined' && window.reviewWords && Array.isArray(window.reviewWords)) 
            ? window.reviewWords 
            : [];
        
        log.debug(`🔄 Tekrar listesindeki kelime sayısı: ${reviewWords.length}`);
        
        if (reviewWords.length === 0) {
            log.debug('ℹ️  Tekrar gerektiren kelime yok.');
            log.debug('💡 Test için bir kelimeyi yanlış cevaplayın veya yeterince pratik yapmayın.');
            return;
        }
        
        // 3. Her kelime için detaylı analiz
        log.debug('\n📋 TEKRAR LİSTESİ DETAYLARI:');
        log.debug('----------------------------');
        
        const oneDay = 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        reviewWords.forEach((wordId, index) => {
            const stats = wordStats[wordId];
            if (!stats) {
                log.debug(`${index + 1}. ${wordId}: ❌ İstatistik bulunamadı`);
                return;
            }
            
            const daysSinceLastSeen = (now - stats.lastSeen) / oneDay;
            const totalAttempts = (stats.correct || 0) + (stats.wrong || 0);
            const successRate = stats.successRate || 0;
            const masteryLevel = stats.masteryLevel || 0;
            
            // Neden tekrar listesinde olduğunu belirle
            const reasons = [];
            if (successRate < 0.6) reasons.push(`Başarı oranı düşük (%${Math.round(successRate * 100)})`);
            if (masteryLevel < 2.0) reasons.push(`Ustalık seviyesi düşük (${masteryLevel.toFixed(1)})`);
            if (daysSinceLastSeen > 3) reasons.push(`${Math.round(daysSinceLastSeen)} gün önce görüldü`);
            if (totalAttempts < 5) reasons.push(`Yetersiz pratik (${totalAttempts} deneme)`);
            
            log.debug(`\n${index + 1}. Kelime ID: ${wordId}`);
            log.debug(`   📊 İstatistikler:`);
            log.debug(`      - Doğru: ${stats.correct || 0}, Yanlış: ${stats.wrong || 0}, Toplam: ${totalAttempts}`);
            log.debug(`      - Başarı oranı: %${Math.round(successRate * 100)}`);
            log.debug(`      - Ustalık seviyesi: ${masteryLevel.toFixed(2)}`);
            log.debug(`      - Son görülme: ${new Date(stats.lastSeen).toLocaleString('tr-TR')} (${Math.round(daysSinceLastSeen)} gün önce)`);
            log.debug(`   🔄 Tekrar nedeni: ${reasons.join(', ')}`);
        });
        
        // 4. Özet
        log.debug('\n📈 ÖZET:');
        log.debug(`   • Toplam kelime: ${totalWords}`);
        log.debug(`   • Tekrar gerektiren: ${reviewWords.length}`);
        log.debug(`   • Oran: %${Math.round((reviewWords.length / totalWords) * 100)}`);
        
        // 5. Buton güncellemesi
        updateAllTabButtons();
        log.debug('✅ Tüm butonlar güncellendi');
        
    } catch (error) {
        log.error('❌ Test hatası:', error);
        log.error('Stack trace:', error.stack);
    }
}

// Global erişim için window'a ekle (sadece debug modunda çalışır)
window.testReviewWords = testReviewWords;

function filterWordStats(filterType) {
    try {
        log.stats('🔍 filterWordStats BAŞLADI, filterType:', filterType);
        
        // Favoriler ve tekrar listesini güncelle (filtreleme öncesi)
        if (typeof loadFavorites === 'function') {
            loadFavorites();
        }
        if (typeof loadReviewWords === 'function') {
            loadReviewWords();
        }
        
        // Tüm butonları güncelle
        updateAllTabButtons();
        
        const wordStats = loadWordStats();
        const listContainer = document.getElementById('wordStatsList');
        log.stats('🔍 filterWordStats çağrıldı, filterType:', filterType, 'wordStats:', wordStats, 'toplam kelime:', Object.keys(wordStats).length);
        log.elements('📦 listContainer elementi:', listContainer ? 'BULUNDU ✅' : 'BULUNAMADI ❌');
        
        if (!listContainer) {
            log.error('❌ HATA: wordStatsList elementi bulunamadı!');
            return;
        }
        
        // Filtre butonlarını güncelle (her sekme için farklı renk)
        const buttonColors = {
            'all': '#2980b9',      // Koyu mavi
            'favorites': '#f39c12', // Altın sarısı
            'review': '#1abc9c',    // Turkuaz
            'mastered': '#27ae60',  // Yeşil
            'struggling': '#e74c3c', // Kırmızı
            'recent': '#9b59b6'     // Mor
        };
        
        const normalizedFilterType = String(filterType).toLowerCase();
        const activeColor = buttonColors[normalizedFilterType] || buttonColors['all'];
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = '#95a5a6'; // Pasif renk (gri)
        });
        const filterBtn = document.getElementById('filter' + filterType.charAt(0).toUpperCase() + filterType.slice(1));
        if (filterBtn) {
            filterBtn.classList.add('active');
            filterBtn.style.background = activeColor; // Sekme özel aktif renk
        }
        
        let filteredStats = [];
        
        log.stats('🎯 kelimeCevirData uzunluğu:', window.kelimeCevirData ? window.kelimeCevirData.length : 'undefined');
        log.stats('📦 wordStats keyleri:', Object.keys(wordStats));
        
        // Filtreleme
        Object.entries(wordStats).forEach(([wordId, stat]) => {
            log.stats('🔄 İşleniyor:', wordId, stat);
            
            // Eski veriler için eksik alanları hesapla
            if (typeof stat.successRate === 'undefined') {
                const attempts = (stat.attempts || 0) || ((stat.correct || 0) + (stat.wrong || 0));
                stat.successRate = attempts > 0 ? ((stat.correct || 0) / attempts) : 0;
            }
            if (typeof stat.masteryLevel === 'undefined') {
                stat.masteryLevel = 0;
            }
            if (typeof stat.lastSeen === 'undefined') {
                stat.lastSeen = Date.now();
            }
            
            // Kelime verisini bul
            let wordData = null;
            
            // ID formatı: "sure:ayet:kelime" (örn: "105:4:1" veya "2:51:4")
            // kelimeCevirData'da ID aynı formatta
            if (window.kelimeCevirData && window.kelimeCevirData.length > 0) {
                wordData = window.kelimeCevirData.find(w => w.id === wordId);
            }
            
            log.stats('🔍 wordId:', wordId, 'wordData bulundu mu?', wordData ? 'EVET ✅' : 'HAYIR ❌');
            
            // Bulunamazsa - ID'den parse et
            if (!wordData) {
                const [sure, ayet, kelimeIndex] = wordId.split(':');
                wordData = { 
                    kelime: wordId, // Geçici olarak ID'yi göster
                    anlam: `Sure ${sure}, Ayet ${ayet}, Kelime ${kelimeIndex}`,
                    id: wordId
                };
                // Sadece debug modunda göster (çok fazla uyarı olabilir)
                log.stats('⚠️ Kelime verisi bulunamadı, geçici veri oluşturuldu:', wordData);
            }
            
            // Favoriler kontrolü (güncel liste ile)
            const isFav = typeof isFavorite !== 'undefined' && isFavorite(wordId);
            
            // Tekrar listesi kontrolü (güncel liste ile)
            const needsReview = (typeof window !== 'undefined' && window.reviewWords && Array.isArray(window.reviewWords) && window.reviewWords.includes(wordId)) ||
                               (typeof reviewWords !== 'undefined' && Array.isArray(reviewWords) && reviewWords.includes(wordId));
            
            const shouldShow = 
                filterType === 'all' ||
                (filterType === 'favorites' && isFav) ||
                (filterType === 'review' && needsReview) ||
                (filterType === 'mastered' && stat.masteryLevel >= 3.0 && stat.successRate >= 0.6) ||
                (filterType === 'struggling' && (stat.successRate < 0.6 || stat.masteryLevel < 1.0)) ||
                (filterType === 'recent' && (Date.now() - stat.lastSeen) < 7 * 24 * 60 * 60 * 1000); // Son 7 gün
            
            log.stats('🤔 shouldShow:', shouldShow, 'filterType:', filterType, 'stat:', stat);
            
            if (shouldShow) {
                filteredStats.push({ wordId, ...stat, wordData });
                log.stats('✅ Listeye eklendi:', wordId);
            } else {
                log.stats('❌ Listeye EKLENMEDİ:', wordId);
            }
        });
        
        log.stats('📋 Filtreleme TAMAMLANDI, sonuç:', filteredStats.length, 'kelime');
        
        // Sıralama (öncelik puanına göre)
        filteredStats.sort((a, b) => {
            if (filterType === 'recent') {
                return b.lastSeen - a.lastSeen; // En son görülenler önce
            } else if (filterType === 'review') {
                // Tekrar listesi için özel öncelik sıralaması
                if (typeof calculateReviewPriority !== 'undefined') {
                    const priorityA = calculateReviewPriority(a);
                    const priorityB = calculateReviewPriority(b);
                    return priorityB - priorityA;
                }
                return b.priority - a.priority;
            } else if (filterType === 'favorites') {
                // Favoriler için son görülme zamanına göre sırala
                return b.lastSeen - a.lastSeen;
            }
            return b.priority - a.priority; // Yüksek öncelik önce
        });
        
        log.stats('📋 Sıralama sonrası:', filteredStats.length, 'kelime');
        log.stats('📦 İlk 3 kelime:', filteredStats.slice(0, 3));
        
        // Liste içeriğini oluştur
        if (filteredStats.length === 0) {
            log.stats('⚠️ filteredStats boş, empty state gösteriliyor');
        // Toplam kelime sayısını kontrol et
        const totalWords = Object.keys(wordStats).length;
        log.stats('📝 Filtrelenmiş liste boş. totalWords:', totalWords, 'filterType:', filterType);
        
        if (totalWords === 0) {
            // Hiç oyun oynanmamış
            log.stats('🎮 Hiç oyun oynanmamış - onboarding kartı gösteriliyor');
            const cardHTML = `
                <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; margin: 20px 0;">
                    <div style="font-size: 3em; margin-bottom: 15px;">🎮</div>
                    <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">Henüz Hiç Ders Talebe Etmedin!</div>
                    <div style="font-size: 0.95em; opacity: 0.95; margin-bottom: 20px; line-height: 1.5;">
                        Kelime istatistiklerini görmek için ders talebe etmeye başla!<br>
                        Her kelimeyle çalıştıkça ilerleme kaydedilecek 📈
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 300px; margin: 0 auto;">
                        <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
                            <div style="font-size: 1.5em; margin-bottom: 5px;">📚</div>
                            <div style="font-size: 0.8em;">Kelime Çevir</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
                            <div style="font-size: 1.5em; margin-bottom: 5px;">🎧</div>
                            <div style="font-size: 0.8em;">Dinle ve Bul</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
                            <div style="font-size: 1.5em; margin-bottom: 5px;">✏️</div>
                            <div style="font-size: 0.8em;">Boşluk Doldur</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
                            <div style="font-size: 1.5em; margin-bottom: 5px;">📖</div>
                            <div style="font-size: 0.8em;">Ayet Oku</div>
                        </div>
                    </div>
                    <div style="margin-top: 20px; font-size: 0.9em; opacity: 0.9;">
                        Ana menüden bir oyun seç ve başla! 🚀
                    </div>
                </div>
            `;
            listContainer.innerHTML = cardHTML;
            log.elements('✅ Kart HTML\'i listContainer\'a eklendi, innerHTML uzunluğu:', listContainer.innerHTML.length);
            log.elements('📍 listContainer display:', window.getComputedStyle(listContainer).display);
            log.elements('📍 listContainer visibility:', window.getComputedStyle(listContainer).visibility);
        } else {
            // Oyun oynanmış ama bu kategoride kelime yok
            log.stats('📋 Oyun oynanmış ama bu kategoride kelime yok - filtre mesajı gösteriliyor');
            const filterMessages = {
                'all': 'Henüz hiç kelime istatistiği yok',
                'favorites': 'Henüz favori kelime eklenmemiş. Kelime kartlarındaki ⭐ butonuna tıklayarak favorilere ekleyebilirsin!',
                'review': 'Harika! Tekrar gerektiren kelime yok. Tüm kelimeler iyi durumda! 🎉',
                'mastered': 'Henüz öğrenilmiş kelime yok. Daha fazla pratik yap! 💪',
                'struggling': 'Harika! Zorlandığın kelime yok. Devam et! 🎉',
                'recent': 'Son 7 günde kelime çalışılmamış. Bugün pratik yap! 📅'
            };
            
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #666;">
                    <div style="font-size: 2.5em; margin-bottom: 15px;">
                        ${filterType === 'struggling' ? '🎉' : '🔍'}
                    </div>
                    <div style="font-size: 1.1em; font-weight: 600; margin-bottom: 10px; color: #333;">
                        ${filterMessages[filterType] || 'Bu kategoride kelime bulunamadı'}
                    </div>
                    <div style="font-size: 0.9em; color: #666; margin-top: 10px;">
                        ${filterType === 'mastered' ? 'Daha fazla ders talebe et ve kelimeleri öğren!' : 
                          filterType === 'struggling' ? 'Tüm kelimeler iyi durumda!' :
                          filterType === 'recent' ? 'Ders talebe ederek listeni güncel tut!' :
                          'Ders talebe ederek istatistik oluşturmaya başla!'}
                    </div>
                </div>
            `;
        }
        return;
    }
    
    // Liste başlığı ekle (her sekme için açıklayıcı)
    let listHeader = '';
    if (filteredStats.length > 0) {
        const count = filteredStats.length;
        const colors = {
            'all': { bg: '#e8f2ff', border: '#2980b9', icon: '📚' }, // Koyu mavi
            'favorites': { bg: '#fff8e6', border: '#f39c12', icon: '⭐' }, // Altın sarısı
            'review': { bg: '#e8f4f8', border: '#1abc9c', icon: '🔄' }, // Turkuaz
            'mastered': { bg: '#d5f4e6', border: '#27ae60', icon: '✅' }, // Yeşil
            'struggling': { bg: '#ffe6e6', border: '#e74c3c', icon: '📚' }, // Kırmızı
            'recent': { bg: '#f0e6ff', border: '#9b59b6', icon: '🕐' } // Mor
        };
        
        // filterType kontrolü ve renk seçimi (string olarak normalize et)
        const normalizedFilterType = String(filterType).toLowerCase();
        const color = colors[normalizedFilterType] || colors['all'];
        
        // Debug (sadece geliştirme için)
        if (typeof log !== 'undefined' && log.stats) {
            log.stats('🎨 Liste başlığı - filterType:', filterType, 'normalized:', normalizedFilterType, 'renk:', color.border);
        }
        
        const messages = {
            'all': {
                title: `${count} kelime istatistiği var`,
                desc: 'Tüm çalıştığın kelimeler aşağıda listelenmiştir.'
            },
            'favorites': {
                title: `${count} favori kelime`,
                desc: 'Favorilerine eklediğin kelimeler. Her kelime ayrı bir kart olarak gösterilir.'
            },
            'review': {
                title: `${count} farklı kelime tekrar gerektiriyor`,
                desc: 'Her kelime ayrı bir kart olarak aşağıda listelenmiştir. Her kelimenin neden tekrar gerektirdiği kart üzerinde gösterilir.'
            },
            'mastered': {
                title: `${count} kelime öğrenildi`,
                desc: 'Ustalık seviyesi 3.0+ ve başarı oranı %60+ olan kelimeler. Her kelime ayrı bir kart olarak gösterilir.'
            },
            'struggling': {
                title: `${count} kelime ile zorlanıyorsun`,
                desc: 'Başarı oranı %60 altında veya ustalık seviyesi 1.0 altında olan kelimeler. Her kelime ayrı bir kart olarak gösterilir.'
            },
            'recent': {
                title: `Son 7 günde ${count} kelime görüldü`,
                desc: 'Son bir hafta içinde çalıştığın kelimeler. Her kelime ayrı bir kart olarak gösterilir.'
            }
        };
        
        const message = messages[filterType] || messages['all'];
        
        listHeader = `
            <div style="background: ${color.bg}; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid ${color.border};">
                <div style="font-weight: 600; color: #2c3e50; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                    <span>${color.icon}</span>
                    <span>${message.title}</span>
                </div>
                <div style="font-size: 0.85em; color: #666; margin-top: 4px;">
                    ${message.desc}
                </div>
            </div>
        `;
    }
    
    // (commented) Kelime listesi log removed during cleanup
    listContainer.innerHTML = listHeader + filteredStats.slice(0, 50).map(item => { // En fazla 50 kelime göster
        // Kelime verisi yoksa veya geçersizse bu kartı gösterme
        if (!item.wordData || !item.wordData.kelime || item.wordData.kelime.includes('undefined') || item.wordData.kelime.includes('bosluk')) {
            return ''; // Boş string döndür
        }
        
        const masteryColor = item.masteryLevel >= 3 ? '#27ae60' : item.masteryLevel >= 1.5 ? '#f39c12' : '#e74c3c';
        const masteryText = item.masteryLevel >= 3 ? 'Öğrenildi' : item.masteryLevel >= 1.5 ? 'Öğreniliyor' : 'Zorlanıyor';
        const successPercent = Math.round(item.successRate * 100);
        
        const isFav = typeof isFavorite !== 'undefined' && isFavorite(item.wordId);
        const needsReview = (typeof window !== 'undefined' && window.reviewWords && Array.isArray(window.reviewWords) && window.reviewWords.includes(item.wordId)) ||
                           (typeof reviewWords !== 'undefined' && reviewWords.includes(item.wordId));
        
        // Tekrar nedeni (sadece review filtresinde göster)
        let reviewReason = '';
        if (filterType === 'review' && needsReview) {
            const oneDay = 24 * 60 * 60 * 1000;
            const daysSinceLastSeen = (Date.now() - item.lastSeen) / oneDay;
            const totalAttempts = (item.correct || 0) + (item.wrong || 0);
            const reasons = [];
            if (item.successRate < 0.6) reasons.push('Başarı %60 altı');
            if (item.masteryLevel < 2.0) reasons.push('Ustalık < 2.0');
            if (daysSinceLastSeen > 3) reasons.push(`${Math.round(daysSinceLastSeen)} gün önce`);
            if (totalAttempts < 5) reasons.push(`Pratik < 5`);
            if (reasons.length > 0) {
                reviewReason = `<div style="font-size: 0.7em; color: #e74c3c; margin-top: 4px; padding: 4px; background: #ffe6e6; border-radius: 4px;">🔄 Tekrar nedeni: ${reasons.join(', ')}</div>`;
            }
        }
        
        return `
            <div style="background: white; border-radius: 8px; padding: 12px; margin: 8px 0; border-left: 4px solid ${masteryColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div style="flex: 1;">
                        <div style="font-size: 1.1em; font-weight: bold; color: #2c3e50; margin-bottom: 2px;">
                            ${item.wordData.kelime || item.wordId}
                            ${isFav ? ' ⭐' : ''}
                            ${needsReview ? ' 🔄' : ''}
                        </div>
                        <div style="font-size: 0.9em; color: #666;">${item.wordData.anlam || 'Bilinmiyor'}</div>
                    </div>
                    <div style="text-align: right; display: flex; gap: 5px; align-items: flex-start;">
                        <button class="favorite-btn-inline" data-word-id="${item.wordId}" onclick="if(typeof toggleFavorite !== 'undefined') { const newState = toggleFavorite('${item.wordId}'); this.innerHTML = newState ? '⭐' : '☆'; this.style.background = newState ? '#ffc107' : 'transparent'; this.style.borderColor = newState ? '#ffc107' : '#ccc'; if(newState && typeof showSuccessMessage !== 'undefined') showSuccessMessage('⭐ Favorilere eklendi!'); }" style="background: ${isFav ? '#ffc107' : 'transparent'}; border: 2px solid ${isFav ? '#ffc107' : '#ccc'}; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; padding: 0; margin: 0; transition: all 0.3s ease;">${isFav ? '⭐' : '☆'}</button>
                        <div style="background: ${masteryColor}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75em; font-weight: bold;">${masteryText}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 0.8em;">
                    <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
                        <div style="font-weight: bold; color: #27ae60;">${successPercent}%</div>
                        <div style="color: #666;">Başarı</div>
                    </div>
                    <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
                        <div style="font-weight: bold; color: #3498db;">${item.attempts}</div>
                        <div style="color: #666;">Deneme</div>
                    </div>
                    <div style="text-align: center; padding: 6px; background: #f8f9fa; border-radius: 4px;">
                        <div style="font-weight: bold; color: #f39c12;">${Math.round(item.priority * 100) / 100}</div>
                        <div style="color: #666;">Öncelik</div>
                    </div>
                </div>
                
                <div style="margin-top: 8px; font-size: 0.75em; color: #666; text-align: center;">
                    Son görülme: ${new Date(item.lastSeen).toLocaleDateString('tr-TR')}
                </div>
                ${reviewReason}
            </div>
        `;
        }).join('');
        
        log.stats('✅ HTML oluşturuldu ve listContainer\'a yazıldı!');
        
    } catch (error) {
        log.error('🚨 filterWordStats HATA:', error);
        log.error('Stack trace:', error.stack);
    }
}

// ============ KELİME İSTATİSTİK YÖNETİMİ ============
function loadWordStats() {
    try {
        const saved = localStorage.getItem('hasene_wordStats');
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        log.error('📊 Kelime istatistikleri yüklenirken hata:', error);
        return {};
    }
}

function saveWordStats(wordStats) {
    try {
        localStorage.setItem('hasene_wordStats', JSON.stringify(wordStats));
        // (commented) Kelime istatistikleri kaydedildi
    } catch (error) {
        log.error('📊 Kelime istatistikleri kaydedilirken hata:', error);
    }
}

// Global erişim için window'a ekle
window.loadWordStats = loadWordStats;
window.saveWordStats = saveWordStats;

function updateWordStats(wordId, isCorrect) {
    // NULL KONTROL - wordId geçerli mi?
    if (!wordId || typeof wordId !== 'string') {
        log.error('❌ Geçersiz wordId:', wordId);
        return;
    }
    
    const wordStats = loadWordStats();
    
    if (!wordStats[wordId]) {
        wordStats[wordId] = {
            attempts: 0,
            correct: 0,
            wrong: 0,
            lastSeen: Date.now(),
            masteryLevel: 0,
            priority: 1.0
        };
    }

    const stats = wordStats[wordId];
    stats.attempts++;
    stats.lastSeen = Date.now();

    if (isCorrect) {
        stats.correct++;
        // Doğru cevap - ustalık artır, öncelik azalt
        stats.masteryLevel = Math.min(5, stats.masteryLevel + 0.2);
        stats.priority = Math.max(0.1, stats.priority * 0.8);
    } else {
        stats.wrong++;
        // Yanlış cevap - ustalık azalt, öncelik artır
        stats.masteryLevel = Math.max(0, stats.masteryLevel - 0.5);
        stats.priority = Math.min(3.0, stats.priority * 1.5);
    }

    // Başarı oranı hesapla
    stats.successRate = stats.attempts > 0 ? (stats.correct / stats.attempts) : 0;

    saveWordStats(wordStats);
    log.stats(`📊 ${wordId} kelimesi istatistiği güncellendi:`, stats);
    
    // Tekrar listesini güncelle
    if (typeof updateReviewList === 'function') {
        updateReviewList();
    }
}

function selectIntelligentWord(filteredData) {
    const wordStats = loadWordStats();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Her kelime için öncelik puanı hesapla
    const wordsWithPriority = filteredData.map(word => {
        const stats = wordStats[word.id];
        let priorityScore = 1.0;

        if (stats) {
            // Temel öncelik puanı (yanlış cevaplanan kelimeler daha öncelikli)
            priorityScore = stats.priority;

            // Zaman faktörü (uzun süredir görülmeyen kelimeler)
            const daysSinceLastSeen = (now - stats.lastSeen) / oneDay;
            if (daysSinceLastSeen > 3) {
                priorityScore *= (1 + daysSinceLastSeen * 0.1);
            }

            // Başarı oranı faktörü (düşük başarı oranı = yüksek öncelik)
            if (stats.successRate < 0.6) {
                // successRate 0-1 arası olduğu için sonuç 0.5-1.5 arası olur
                priorityScore *= Math.max(0.1, 1.5 - stats.successRate);
            }

            // Ustalık seviyesi faktörü (düşük ustalık = yüksek öncelik)
            // masteryLevel 0-5 arası olduğu için sonuç 1.0-2.0 arası olur
            priorityScore *= Math.max(0.1, 2.0 - stats.masteryLevel / 5.0);
        } else {
            // Hiç görülmemiş kelimeler orta öncelikli
            priorityScore = 1.2;
        }

        return {
            word,
            priority: priorityScore
        };
    });

    // Önceliğe göre sırala
    wordsWithPriority.sort((a, b) => b.priority - a.priority);

    // Weighted random selection (en öncelikli kelimeler daha fazla seçilir)
    const totalWeight = wordsWithPriority.reduce((sum, item) => sum + item.priority, 0);
    
    // Güvenlik kontrolü: totalWeight 0 veya negatif olamaz
    if (totalWeight <= 0 || wordsWithPriority.length === 0) {
        log.warn('⚠️ Öncelik puanları hesaplanamadı, rastgele kelime seçiliyor');
        // Array length check - prevent error if array is empty
        if (!filteredData || filteredData.length === 0) {
            log.error('❌ Filtrelenmiş veri bulunamadı!');
            return null;
        }
        return filteredData[Math.floor(Math.random() * filteredData.length)];
    }
    
    let random = Math.random() * totalWeight;

    for (const item of wordsWithPriority) {
        random -= item.priority;
        if (random <= 0) {
            // (commented) Seçilen kelime log removed during cleanup
            return item.word;
        }
    }

    // Fallback: ilk kelimeyi döndür
    return wordsWithPriority[0]?.word || filteredData[0];
}

// ============ GLOBAL FONKSİYONLAR SONU ============

// ============ GLOBAL ERROR HANDLER ============
// Error throttling - aynı hatayı tekrar tekrar loglamayı önle
const errorThrottle = new Map();
const ERROR_THROTTLE_MS = 5000; // 5 saniye

window.addEventListener('error', (event) => {
    try {
        // Error handler'ın kendisinden kaynaklanan hataları ignore et
        if (event.filename && event.filename.includes('safety-checks.js') && 
            event.message && event.message.includes('elements is not defined')) {
            return; // Bu hatayı ignore et
        }
        
        const errorKey = `${event.filename}:${event.lineno}:${event.message}`;
        const now = Date.now();
        
        // Throttle kontrolü
        if (errorThrottle.has(errorKey)) {
            const lastTime = errorThrottle.get(errorKey);
            if (now - lastTime < ERROR_THROTTLE_MS) {
                return; // Aynı hata çok yakın zamanda loglandı, ignore et
            }
        }
        errorThrottle.set(errorKey, now);
        
        // Throttle map'i temizle (bellek sızıntısını önle)
        if (errorThrottle.size > 50) {
            const oldestKey = errorThrottle.keys().next().value;
            errorThrottle.delete(oldestKey);
        }
        
        if (typeof log !== 'undefined' && log.error) {
            log.error('🚨 Global Error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        }
        
        // Kullanıcıya kritik olmayan hatalar için bildirim göster
        if (event.error && !event.error.message?.includes('ResizeObserver') && 
            !event.error.message?.includes('pendingSave') &&
            !event.error.message?.includes('elements is not defined')) {
            // ResizeObserver ve bilinen hataları ignore et
            log.error('Uygulama hatası:', event.error);
        }
    } catch (e) {
        // Error handler hatası - sessizce ignore et
    }
});

window.addEventListener('unhandledrejection', (event) => {
    try {
        // Promise rejection handler'ın kendisinden kaynaklanan hataları ignore et
        if (event.reason && typeof event.reason === 'object' && 
            event.reason.message && 
            (event.reason.message.includes('pendingSave') || 
             event.reason.message.includes('elements is not defined'))) {
            return; // Bu hatayı ignore et
        }
        
        if (typeof log !== 'undefined' && log.error) {
            log.error('🚨 Unhandled Promise Rejection:', event.reason);
        }
        log.error('Promise rejection:', event.reason);
    } catch (e) {
        // Error handler hatası - sessizce ignore et
    }
});

// ============ OFFLINE/ONLINE INDICATOR ============
window.addEventListener('online', () => {
    if (typeof showSuccessMessage === 'function') {
        showSuccessMessage('✅ İnternet bağlantısı geri geldi!');
    }
    log.debug('🌐 Online');
});

window.addEventListener('offline', () => {
    if (typeof showCustomAlert === 'function') {
        showCustomAlert('⚠️ İnternet bağlantısı yok. Offline modda çalışıyorsunuz.', 'warning');
    }
    log.debug('📴 Offline');
});

// Sayfa yüklendiğinde online durumunu kontrol et
if (!navigator.onLine) {
    if (typeof showCustomAlert === 'function') {
        setTimeout(() => {
            showCustomAlert('⚠️ İnternet bağlantısı yok. Offline modda çalışıyorsunuz.', 'warning');
        }, 1000);
    }
}

// ============ GLOBAL CLEANUP (Memory Leak Önleme) ============
const activeIntervals = new Set();
const activeTimeouts = new Set();

// Debounce değişkenleri (erken tanımlama - beforeunload için)
// Global scope'a ekle (beforeunload event listener'ı için)
if (typeof window.saveStatsTimeout === 'undefined') {
    window.saveStatsTimeout = null;
}
if (typeof window.pendingSave === 'undefined') {
    window.pendingSave = false;
}

// setInterval wrapper - otomatik takip
const originalSetInterval = window.setInterval;
window.setInterval = function(...args) {
    const id = originalSetInterval.apply(this, args);
    activeIntervals.add(id);
    return id;
};

// clearInterval wrapper - otomatik temizlik
const originalClearInterval = window.clearInterval;
window.clearInterval = function(id) {
    activeIntervals.delete(id);
    return originalClearInterval.apply(this, arguments);
};

// setTimeout wrapper - otomatik takip
const originalSetTimeout = window.setTimeout;
window.setTimeout = function(...args) {
    const id = originalSetTimeout.apply(this, args);
    activeTimeouts.add(id);
    return id;
};

// clearTimeout wrapper - otomatik temizlik
const originalClearTimeout = window.clearTimeout;
window.clearTimeout = function(id) {
    activeTimeouts.delete(id);
    return originalClearTimeout.apply(this, arguments);
};

// Sayfa kapanırken tüm interval ve timeout'ları temizle
window.addEventListener('beforeunload', () => {
    // Tüm interval'ları temizle
    activeIntervals.forEach(id => {
        try {
            originalClearInterval(id);
        } catch(e) {
            // ignore
        }
    });
    activeIntervals.clear();
    
    // Tüm timeout'ları temizle
    activeTimeouts.forEach(id => {
        try {
            originalClearTimeout(id);
        } catch(e) {
            // ignore
        }
    });
    activeTimeouts.clear();
    
    // Audio cleanup
    if (typeof cleanupAudioListeners === 'function') {
        cleanupAudioListeners();
    }
    
    // Acil kaydetme (sayfa kapanırken)
    if (typeof saveStatsImmediate === 'function' && window.pendingSave) {
        saveStatsImmediate().catch(() => {});
    }
});

// ============ KEYBOARD NAVIGATION ============
document.addEventListener('keydown', (e) => {
    // Escape tuşu ile modalları kapat
    if (e.key === 'Escape') {
        if (typeof closeAllModals === 'function') {
            closeAllModals();
        }
        // Ayrıca spesifik modalları da kapat
        if (typeof closeStatsModal === 'function' && document.getElementById('statsModal')?.style.display !== 'none') {
            closeStatsModal();
        }
        if (typeof closeBadgesModal === 'function' && document.getElementById('badgesModal')?.style.display !== 'none') {
            closeBadgesModal();
        }
        if (typeof closeCalendarModal === 'function' && document.getElementById('calendarModal')?.style.display !== 'none') {
            closeCalendarModal();
        }
        if (typeof closeDailyTasksModal === 'function' && document.getElementById('dailyTasksModal')?.style.display !== 'none') {
            closeDailyTasksModal();
        }
    }
    
    // Enter/Space ile butonları aktif et
    if ((e.key === 'Enter' || e.key === ' ') && e.target.tagName === 'BUTTON' && !e.target.disabled) {
        e.preventDefault();
        e.target.click();
    }
});

// DOM yüklendikten sonra çalıştır
document.addEventListener('DOMContentLoaded', function() {
    // (commented) DOM yüklendi log removed during cleanup
    
    // 🧹 Otomatik storage temizliği (başlangıçta)
    storage.autoCleanup();
    
    // Custom Alert Modal butonları için touch event'leri (passive)
    const customAlertCloseBtn = document.getElementById('customAlertCloseBtn');
    const customAlertOKBtn = document.getElementById('customAlertOKBtn');
    
    if (customAlertCloseBtn) {
        customAlertCloseBtn.addEventListener('touchstart', function() {
            this.style.background = '#f0f0f0';
            this.style.color = '#333';
        }, { passive: true });
        customAlertCloseBtn.addEventListener('touchend', function() {
            this.style.background = 'rgba(0,0,0,0.1)';
            this.style.color = '#666';
        }, { passive: true });
    }
    
    if (customAlertOKBtn) {
        customAlertOKBtn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        customAlertOKBtn.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        }, { passive: true });
    }
    
    // Daily Goal'u başlat
    if (!storage.get('dailyGoalHasene')) {
        storage.set('dailyGoalHasene', '2700');
        storage.set('dailyGoalLevel', 'normal');
    }
    updateDailyGoalDisplay();
    
    // Bildirimleri başlat
    if (typeof initNotifications === 'function') {
        initNotifications();
    }
    
    // Modal butonlarına event listener ekle
    const dailyTasksBtn = document.getElementById('dailyTasksBtn');
    const statsBtn = document.getElementById('statsBtn');
    const calendarBtn = document.getElementById('calendarBtn');
    const xpInfoBtn = document.getElementById('xpInfoBtn');
    
    // Detaylı istatistikler butonuna event listener ekle (detailed-stats.js yüklendikten sonra)
    setTimeout(() => {
        const detailedStatsBtn = document.getElementById('detailedStatsBtn');
        if (detailedStatsBtn) {
            const handleDetailedStatsClick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                
                log.debug('📊 Detaylı buton tıklandı');
                
                if (typeof window.showDetailedStats === 'function') {
                    log.debug('✅ showDetailedStats fonksiyonu bulundu, çağrılıyor...');
                    window.showDetailedStats();
                } else if (typeof showDetailedStats === 'function') {
                    log.debug('✅ showDetailedStats fonksiyonu bulundu (global değil), çağrılıyor...');
                    showDetailedStats();
                } else {
                    log.error('❌ showDetailedStats fonksiyonu bulunamadı!', typeof window.showDetailedStats, typeof showDetailedStats);
                }
                
                return false;
            };
            
            // Click event
            detailedStatsBtn.addEventListener('click', handleDetailedStatsClick, { capture: true, passive: false });
            
            // Touch event (mobil için)
            detailedStatsBtn.addEventListener('touchend', function(e) {
                e.stopPropagation();
                e.preventDefault();
                handleDetailedStatsClick(e);
                return false;
            }, { capture: true, passive: false });
            
            log.debug('✅ Detaylı istatistikler butonu event listener eklendi');
        } else {
            log.warn('⚠️ detailedStatsBtn elementi bulunamadı!');
        }
    }, 100); // 100ms gecikme ile detailed-stats.js yüklensin
    
    // ============ AYARLAR - BURADAN KONTROLEDEBİLİRSİN ============
    const CONFIG = {
    // OYUN MODLARI
    gameModes: {
        klasik: {
            name: '📚 Klasik',
            description: 'Normal oyun modu',
            questionsPerLevel: 10,
            timeLimit: 0,  // 0 = süre yok
            lives: 0,      // 0 = sınırsız can
            showHint: true
        },
        hizli: {
            name: '⚡ Hızlı',
            description: '30 saniye süre',
            questionsPerLevel: 15,
            timeLimit: 30,
            lives: 0,
            showHint: false
        },
        hayat: {
            name: '❤️ 3 Can',
            description: '3 hak, yanlış = -1 can',
            questionsPerLevel: 20,
            timeLimit: 0,
            lives: 3,
            showHint: true
        },
        zorluk: {
            name: '🔥 Zorluk',
            description: 'Sadece zor kelimeler',
            questionsPerLevel: 10,
            timeLimit: 20,
            lives: 3,
            showHint: false,
            minDifficulty: 7  // 7-10 arası zorluk
        }
    },

    // ZORLUK SEVİYELERİ (1 saat oyun = ~8000 Hasene hedefli)
    // Ortalama: ~22 XP/soru (360 soru/saat = 7920 XP + combolar)
    difficultyLevels: {
        kolay: {
            name: '😊 Kolay',
            minDiff: 5,
            maxDiff: 9,
            pointsMultiplier: 2  // ~13 XP/soru
        },
        orta: {
            name: '😐 Orta',
            minDiff: 10,
            maxDiff: 11,
            pointsMultiplier: 2  // ~21 XP/soru (ideal)
        },
        zor: {
            name: '😤 Zor',
            minDiff: 12,
            maxDiff: 21,
            pointsMultiplier: 2  // ~33 XP/soru
        },
        karisik: {
            name: '🎲 Karışık',
            minDiff: 5,
            maxDiff: 21,
            pointsMultiplier: 2  // ~26 XP/soru ortalama
        }
    },

    // VARSAYILAN AYARLAR
    defaultMode: 'klasik',
    defaultDifficulty: 'orta',  // UI'da mevcut olan zorluk seviyesi
    wrongAnswerPenalty: 5  // Yanlış cevap puan cezası
};

// ============ ÖZEL ONAY POP-UP ============
function showCustomConfirm(correct, wrong, xp) {
    forceLog('[MODAL] Fonksiyon cagrildi - Dogru=' + correct + ' Yanlis=' + wrong + ' XP=' + xp);
    return new Promise((resolve) => {
        forceLog('[MODAL] Promise olusturuldu');
        const confirmModal = document.getElementById('customConfirm');
        const confirmCorrect = document.getElementById('confirmCorrect');
        const confirmWrong = document.getElementById('confirmWrong');
        const confirmXP = document.getElementById('confirmXP');
        const confirmOK = document.getElementById('confirmOK');
        const confirmCancel = document.getElementById('confirmCancel');

        forceLog('[MODAL] Element kontrol:', 
            'Modal=' + !!confirmModal,
            'Correct=' + !!confirmCorrect,
            'Wrong=' + !!confirmWrong,
            'XP=' + !!confirmXP,
            'OK=' + !!confirmOK,
            'Cancel=' + !!confirmCancel
        );

        if (!confirmModal || !confirmCorrect || !confirmWrong || !confirmXP || !confirmOK || !confirmCancel) {
            log.error('[MODAL] HATA - Elementler bulunamadi!');
            resolve(true);
            return;
        }

        forceLog('[MODAL] Degerler guncelleniyor...');
        confirmCorrect.textContent = correct;
        confirmWrong.textContent = wrong;
        confirmXP.textContent = xp;

        forceLog('[MODAL] Modal gosteriliyor...');
        
        // Modal'ı body'ye taşı (eğer başka bir yerdeyse)
        if (confirmModal.parentNode !== document.body) {
            document.body.appendChild(confirmModal);
            forceLog('[MODAL] Modal body\'ye tasindi');
        }
        
        // Önce tüm stil özelliklerini sıfırla
        confirmModal.style.removeProperty('display');
        confirmModal.style.removeProperty('visibility');
        confirmModal.style.removeProperty('opacity');
        
        // CSS class ile göster (daha güvenilir)
        confirmModal.classList.add('show');
        
        // Ayrıca inline style da ekle (çift güvence)
        confirmModal.style.setProperty('display', 'flex', 'important');
        confirmModal.style.setProperty('visibility', 'visible', 'important');
        confirmModal.style.setProperty('opacity', '1', 'important');
        confirmModal.style.setProperty('z-index', '11000', 'important');
        
        // requestAnimationFrame ile bir sonraki frame'de kontrol et
        requestAnimationFrame(() => {
            const computedDisplay = window.getComputedStyle(confirmModal).display;
            const computedVisibility = window.getComputedStyle(confirmModal).visibility;
            const computedOpacity = window.getComputedStyle(confirmModal).opacity;
            const computedZIndex = window.getComputedStyle(confirmModal).zIndex;
            const isVisible = confirmModal.offsetParent !== null;
            
            forceLog('[MODAL] Display degeri (sonraki frame):', computedDisplay);
            forceLog('[MODAL] Visibility:', computedVisibility);
            forceLog('[MODAL] Opacity:', computedOpacity);
            forceLog('[MODAL] Z-index:', computedZIndex);
            forceLog('[MODAL] Gorunur mu?', isVisible);
            forceLog('[MODAL] Parent:', confirmModal.parentNode?.tagName || 'null');
            
            if (computedDisplay === 'none' || !isVisible || computedOpacity === '0') {
                forceLog('[MODAL] HATA - Hala gorunmuyor! Zorla gosteriliyor...');
                confirmModal.style.setProperty('display', 'flex', 'important');
                confirmModal.style.setProperty('visibility', 'visible', 'important');
                confirmModal.style.setProperty('opacity', '1', 'important');
                confirmModal.style.setProperty('z-index', '11000', 'important');
                confirmModal.style.setProperty('position', 'fixed', 'important');
                confirmModal.style.setProperty('top', '0', 'important');
                confirmModal.style.setProperty('left', '0', 'important');
                confirmModal.style.setProperty('width', '100%', 'important');
                confirmModal.style.setProperty('height', '100%', 'important');
            }
        });

        const handleOK = () => {
            forceLog('[MODAL] OK butonuna tiklandi');
            confirmModal.classList.remove('show');
            confirmModal.style.setProperty('display', 'none', 'important');
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            forceLog('[MODAL] Cancel butonuna tiklandi');
            confirmModal.classList.remove('show');
            confirmModal.style.setProperty('display', 'none', 'important');
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            forceLog('[MODAL] Cleanup yapiliyor...');
            if (confirmOK) confirmOK.removeEventListener('click', handleOK);
            if (confirmCancel) confirmCancel.removeEventListener('click', handleCancel);
        };

        forceLog('[MODAL] Event listener\'lar ekleniyor...');
        confirmOK.addEventListener('click', handleOK);
        confirmCancel.addEventListener('click', handleCancel);
        forceLog('[MODAL] Event listener\'lar eklendi - Modal bekleniyor...');
    });
}

// ============ ACHIEVEMENT SİSTEMİ (DOMContentLoaded İÇİNDE) ============
function checkAchievements() {
    const achievements = [
        { id: 'first_win', name: 'İlk Zafer', desc: 'İlk sahih cevabin', icon: '🎯', condition: () => sessionCorrect >= 1 },
        { id: 'combo_master', name: 'Muvazebet Ustası', desc: '5x muvazebet yap', icon: '🔥', condition: () => comboCount >= 5 },
        { id: 'daily_goal', name: 'Günlük Kahraman', desc: 'Günlük virdi tamamla', icon: '⭐', condition: () => {
            const dailyHasene = parseInt(storage.get('dailyHasene', '0')) || 0;
            const goalHasene = parseInt(storage.get('dailyGoalHasene', '2700')) || 2700;
            return dailyHasene >= goalHasene;
        }},
        { id: 'streak_7', name: '7 Gün Muvazebet', desc: '7 gün üst üste talebe et', icon: '🔥', condition: () => streakData.currentStreak >= 7 },
        { id: 'level_5', name: 'Mertebe 5', desc: 'Mertebe 5\'e ulaş', icon: '🏆', condition: () => level >= 5 },
        { id: 'level_10', name: 'Mertebe 10', desc: 'Mertebe 10\'a ulaş', icon: '💎', condition: () => level >= 10 },
        { id: 'level_20', name: 'Mertebe 20', desc: 'Mertebe 20\'ye ulaş', icon: '🌟', condition: () => level >= 20 },
        // XP bazlı başarımlar (1 saat oyun = 8500 XP mantığında)
        { id: 'xp_500', name: 'İlk Adım', desc: '500 Hasene topla (~4 dk)', icon: '🌱', condition: () => totalPoints >= 500 },
        { id: 'xp_2000', name: 'Mübtedi Yolcu', desc: '2,000 Hasene (1 Bronz)', icon: '🥉', condition: () => totalPoints >= 2000 },
        { id: 'xp_4000', name: 'Hızlı Talebe', desc: '4,000 Hasene topla', icon: '⚡', condition: () => totalPoints >= 4000 },
        { id: 'xp_8500', name: 'Gümüş Ustası', desc: '8,500 Hasene (1 Gümüş)', icon: '🥈', condition: () => totalPoints >= 8500 },
        { id: 'xp_17000', name: 'İkinci Gümüş', desc: '17,000 Hasene topla', icon: '💯', condition: () => totalPoints >= 17000 },
        { id: 'xp_25500', name: 'Altın Ustası', desc: '25,500 Hasene (1 Altın)', icon: '🥇', condition: () => totalPoints >= 25500 },
        { id: 'xp_51000', name: 'İkinci Altın', desc: '51,000 Hasene topla', icon: '🔥', condition: () => totalPoints >= 51000 },
        { id: 'xp_85000', name: 'Elmas Ustası', desc: '85,000 Hasene (1 Elmas)', icon: '💎', condition: () => totalPoints >= 85000 },
        { id: 'xp_170000', name: 'Ustalar Ustası', desc: '170,000 Hasene topla', icon: '✨', condition: () => totalPoints >= 170000 }
    ];
    
    const unlockedAchievements = storage.getSafe('unlockedAchievements', [], { type: 'array' });
    let newUnlocks = [];
    
    achievements.forEach(ach => {
        if (!unlockedAchievements.includes(ach.id) && ach.condition()) {
            unlockedAchievements.push(ach.id);
            newUnlocks.push(ach);
        }
    });
    
    if (newUnlocks.length > 0) {
        storage.set('unlockedAchievements', unlockedAchievements);
        newUnlocks.forEach(ach => {
            setTimeout(() => {
                showAchievementUnlock(ach);
            }, 500);
        });
    }
}





function showAchievementUnlock(achievement) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 16px;
        z-index: 10001;
        box-shadow: 0 10px 40px rgba(102,126,234,0.5);
        text-align: center;
        min-width: 280px;
        animation: achievementSlide 0.5s ease forwards;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 3em; margin-bottom: 10px;">${achievement.icon}</div>
        <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 5px;">Müjde Kazanıldı!</div>
        <div style="font-size: 1em; font-weight: 600; margin-bottom: 3px;">${achievement.name}</div>
        <div style="font-size: 0.85em; opacity: 0.9;">${achievement.desc}</div>
    `;
    
    document.body.appendChild(notification);
    
    // CSS animation ekle
    if (!document.getElementById('achievementAnim')) {
        const style = document.createElement('style');
        style.id = 'achievementAnim';
        style.textContent = `
            @keyframes achievementSlide {
                to { transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// ============ OYUN DURUMU ============
// Veri değişkenleri artık js/data-loader.js'de tanımlı (lazy loading için)
// kelimeBulData, ayetOkuData, duaData, hadisData global olarak erişilebilir

let currentQuestion = null;
let currentAyetIndex = 0;
let currentDuaIndex = 0;
let currentHadisIndex = 0;
let hintUsed = false; // Her soru için ipucu kullanıldı mı? (genel scope)
// Soru sayısı takibi (ayet, dua, hadis modları için)
let ayetQuestionCount = 0;
let duaQuestionCount = 0;
let hadisQuestionCount = 0;
const AYET_MAX_QUESTIONS = 10;
const DUA_MAX_QUESTIONS = 10;
const HADIS_MAX_QUESTIONS = 10;

// Cevap pozisyon takibi (tahmin edilmesini zorlaştırmak için)
let recentAnswerPositions = []; // Son 10 sorunun doğru cevap pozisyonları
const MAX_POSITION_HISTORY = 10;

// Ses kontrolü için
let currentAudio = null;

// Arapça karakter tespiti için yardımcı fonksiyon
function isArabic(text) {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
}

// Kelime Çevir oyunu için
let kelimeCevirScore = 0;
let kelimeCevirCorrect = 0;
let kelimeCevirWrong = 0;

// Dinle ve Bul oyunu için
let dinleScore = 0;
let dinleCorrect = 0;
let dinleWrong = 0;

// Boşluk Doldur oyunu için
let boslukScore = 0;
let boslukCorrect = 0;
let boslukWrong = 0;

// GLOBAL (KALICI) PUANLAR
let totalPoints = 0;  // Toplam oyun puanı (kalıcı)
let starPoints = 0;   // Yıldız puanı (her 100 Hasene = 1 yıldız)
let level = 1;        // Global seviye

// ROZET SİSTEMİ
let badges = {
    bronze: 0,   // Bronz rozetler (5 yıldız = 1 bronz)
    silver: 0,   // Gümüş rozetler (5 bronz = 1 gümüş)
    gold: 0,     // Altın rozetler (5 gümüş = 1 altın)
    diamond: 0   // Elmas rozetler (5 altın = 1 elmas)
};

// STREAK SİSTEMİ (GÜNLİK TAKİP)
let streakData = {
    currentStreak: 0,    // Mevcut ardışık gün sayısı
    bestStreak: 0,       // En iyi streak rekoru
    lastPlayDate: '',    // Son oyun oynanan tarih (YYYY-MM-DD)
    totalPlayDays: 0,    // Toplam oyun oynanan gün sayısı
    dailyGoal: 5,        // Günlük hedef (doğru cevap sayısı)
    todayProgress: 0,    // Bugünkü ilerleme
    todayDate: '',       // Bugünün tarihi
    playDates: []        // Oyun oynanan tarihler listesi
};

// GÜNLİK GÖREVLER SİSTEMİ
let dailyTasks = {
    lastTaskDate: '',    // Son görev yenileme tarihi
    tasks: [],           // Günlük görevler listesi
    bonusTasks: [],      // Bonus görevler listesi
    completedTasks: [],  // Tamamlanan görevler
    rewardsClaimed: false, // Ödül toplandı mı?
    todayStats: {        // Bugünkü oyun istatistikleri
        kelimeCevir: 0,
        dinleBul: 0,
        boslukDoldur: 0,
        ayetOku: 0,
        duaOgre: 0,
        hadisOku: 0,
        toplamDogru: 0,
        toplamYanlis: 0,  // Bugünkü toplam yanlış cevap sayısı
        toplamPuan: 0,
        perfectStreak: 0,
        farklıZorluk: new Set()
    }
};

// Global erişim için (bildirim sistemi için)
window.dailyTasks = dailyTasks;

// SESSION (OYUN İÇİ) PUANLAR
let sessionScore = 0;     // Bu oyunun puanı
let sessionCorrect = 0;   // Bu oyunun doğru sayısı
let sessionWrong = 0;     // Bu oyunun yanlış sayısı
let comboCount = 0;       // Üst üste doğru sayısı (combo)

// ESKI DEĞİŞKENLER (Geriye uyumluluk için)
let score = 0;
let correct = 0;
let wrong = 0;
let questionCount = 0;
let currentMode = CONFIG.defaultMode;
let currentDifficulty = CONFIG.defaultDifficulty;

    log.debug('Session değişkenleri başlatıldı:', {sessionScore, sessionCorrect, sessionWrong});
    log.debug(`🏁 Varsayılan zorluk seviyesi: ${currentDifficulty}`);
let lives = 0;
let timer = null;
let timeLeft = 0;

// ============ DOM ELEMANLARI ============
const elements = {
    // Ana menü
    mainMenu: document.getElementById('mainMenu'),
    kelimeCevirBtn: document.getElementById('kelimeCevirBtn'),
    dinleBulBtn: document.getElementById('dinleBulBtn'),
    boslukDoldurBtn: document.getElementById('boslukDoldurBtn'),
    duaEtBtn: document.getElementById('duaEtBtn'),
    ayetOkuBtn: document.getElementById('ayetOkuBtn'),
    hadisOkuBtn: document.getElementById('hadisOkuBtn'),
    
    // Kelime oyunu
    score: document.getElementById('score'),
    // level: document.getElementById('level'), // Kaldırıldı - Mertebe artık gösterilmiyor
    correct: document.getElementById('correct'),
    wrong: document.getElementById('wrong'),
    progressBar: document.getElementById('progressBar'),
    sureInfo: document.getElementById('sureInfo'),
    arabicWord: document.getElementById('arabicWord'),
    audioBtn: document.getElementById('audioBtn'),
    hintBtn: document.getElementById('hintBtn'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback'),
    nextBtn: document.getElementById('nextBtn'),
    difficulty: document.getElementById('difficulty'),
    modal: document.getElementById('modal'),
    newLevel: document.getElementById('newLevel'),
    modalBtn: document.getElementById('modalBtn'),
    modeSelector: document.getElementById('modeSelector'),
    gameScreen: document.getElementById('gameScreen'),
    settingsBtn: document.getElementById('settingsBtn'),
    startBtn: document.getElementById('startBtn'),
    modeButtons: document.getElementById('modeButtons'),
    difficultyButtons: document.getElementById('difficultyButtons'),
    lives: document.getElementById('lives'),
    livesDisplay: document.getElementById('livesDisplay'),
    timer: document.getElementById('timer'),
    timerDisplay: document.getElementById('timerDisplay'),
    currentMode: document.getElementById('currentMode'),
    gameOverModal: document.getElementById('gameOverModal'),
    gameOverTitle: document.getElementById('gameOverTitle'),
    gameOverText: document.getElementById('gameOverText'),
    finalScore: document.getElementById('finalScore'),
    restartBtn: document.getElementById('restartBtn'),
    backToMenuBtn: document.getElementById('backToMenuBtn'),
    backFromGameBtn: document.getElementById('backFromGameBtn'),
    
    // Ayet modu
    ayetMode: document.getElementById('ayetMode'),
    ayetSureInfo: document.getElementById('ayetSureInfo'),
    ayetArabic: document.getElementById('ayetArabic'),
    ayetTranslation: document.getElementById('ayetTranslation'),
    ayetAudioBtn: document.getElementById('ayetAudioBtn'),
    prevAyetBtn: document.getElementById('prevAyetBtn'),
    nextAyetBtn: document.getElementById('nextAyetBtn'),
    backFromAyetBtn: document.getElementById('backFromAyetBtn'),
    
    // Dua modu
    duaMode: document.getElementById('duaMode'),
    duaSureInfo: document.getElementById('duaSureInfo'),
    duaArabic: document.getElementById('duaArabic'),
    duaTranslation: document.getElementById('duaTranslation'),
    duaAudioBtn: document.getElementById('duaAudioBtn'),
    prevDuaBtn: document.getElementById('prevDuaBtn'),
    nextDuaBtn: document.getElementById('nextDuaBtn'),
    backFromDuaBtn: document.getElementById('backFromDuaBtn'),
    
    // Hadis modu
    hadisMode: document.getElementById('hadisMode'),
    hadisCategory: document.getElementById('hadisCategory'),
    hadisTitle: document.getElementById('hadisTitle'),
    hadisHeader: document.getElementById('hadisHeader'),
    hadisText: document.getElementById('hadisText'),
    hadisRef: document.getElementById('hadisRef'),
    prevHadisBtn: document.getElementById('prevHadisBtn'),
    nextHadisBtn: document.getElementById('nextHadisBtn'),
    backFromHadisBtn: document.getElementById('backFromHadisBtn'),
    
    // Boşluk Doldur modu
    boslukMode: document.getElementById('boslukMode'),
    boslukSureInfo: document.getElementById('boslukSureInfo'),
    boslukAyetText: document.getElementById('boslukAyetText'),
    boslukAudioBtn: document.getElementById('boslukAudioBtn'),
    boslukOptions: document.getElementById('boslukOptions'),
    boslukFeedback: document.getElementById('boslukFeedback'),
    boslukNextBtn: document.getElementById('boslukNextBtn'),
    boslukScore: document.getElementById('boslukScore'),
    boslukCorrect: document.getElementById('boslukCorrect'),
    boslukWrong: document.getElementById('boslukWrong'),
    backFromBoslukBtn: document.getElementById('backFromBoslukBtn'),
    
    // Dinle ve Bul modu
    dinleMode: document.getElementById('dinleMode'),
    dinleSureInfo: document.getElementById('dinleSureInfo'),
    dinleAudioBtn: document.getElementById('dinleAudioBtn'),
    dinleOptions: document.getElementById('dinleOptions'),
    dinleFeedback: document.getElementById('dinleFeedback'),
    dinleNextBtn: document.getElementById('dinleNextBtn'),
    dinleScore: document.getElementById('dinleScore'),
    dinleCorrect: document.getElementById('dinleCorrect'),
    dinleWrong: document.getElementById('dinleWrong'),
    backFromDinleBtn: document.getElementById('backFromDinleBtn')
};

// ============ KRİTİK: NULL KONTROL - EKSIK ELEMENTLER ============
function checkElements() {
    const missing = [];
    const critical = ['mainMenu', 'kelimeCevirBtn', 'dinleBulBtn', 'boslukDoldurBtn', 
                    'ayetOkuBtn', 'gameScreen', 'modeSelector'];
    
    for (const [key, value] of Object.entries(elements)) {
        if (!value) {
            missing.push(key);
            if (critical.includes(key)) {
                log.error(`❌ KRİTİK: '${key}' elementi bulunamadı!`);
            }
        }
    }
    
    if (missing.length > 0) {
        log.warn('⚠️ Eksik elementler:', missing.join(', '));
    }
    
    return missing.length === 0;
}

// ============ SES DURDURMA FONKSİYONU ============
function stopCurrentAudio() {
    if (currentAudio) {
        log.audio('⏹️ Mevcut ses durduruluyor:', {
            paused: currentAudio.paused,
            currentTime: currentAudio.currentTime,
            duration: currentAudio.duration,
            src: currentAudio.src
        });
        
        if (!currentAudio.paused) {
            currentAudio.pause();
            log.audio('⏸️ Ses durduruldu');
        }
        
        // Event listener'ları comprehensive cleanup
        cleanupAudioListeners();
        log.audio('🧹 Event listenerlar temizlendi');
        
        currentAudio.currentTime = 0;
        log.audio('🔄 Ses başa sarıldı');
        currentAudio = null;
        log.audio('🗑️ Audio object temizlendi');
    } else {
        log.audio('ℹ️ Durduracak ses yok');
    }
}

// ============ SES ÇALMA FONKSİYONU ============
function cleanupAudioListeners() {
    // Tüm audio event listener'larını temizle (memory leak önleme)
    if (currentAudio) {
        try {
            currentAudio.onloadeddata = null;
            currentAudio.oncanplay = null;
            currentAudio.onended = null;
            currentAudio.onerror = null;
            currentAudio.ontimeupdate = null;
            currentAudio.onpause = null;
            currentAudio.onplay = null;
            currentAudio.onloadstart = null;
            // Also remove addEventListener if used
            if (currentAudio.removeEventListener) {
                currentAudio.removeEventListener('loadeddata', () => {});
                currentAudio.removeEventListener('canplay', () => {});
                currentAudio.removeEventListener('ended', () => {});
                currentAudio.removeEventListener('error', () => {});
                currentAudio.removeEventListener('timeupdate', () => {});
            }
        } catch (e) {
            log.debug('Audio cleanup warning:', e);
        }
    }
}


// Navigasyon bar'ı gizle/göster fonksiyonları
function hideBottomNavBar() {
    const bottomNavBar = document.getElementById('bottomNavBar');
    if (bottomNavBar) {
bottomNavBar.style.display = 'none';
    }
}

function showBottomNavBar() {
    const bottomNavBar = document.getElementById('bottomNavBar');
    if (bottomNavBar) {
bottomNavBar.style.display = 'flex';
    }
}

function hideAllGameScreens() {
    const screens = [
'kelimeCevirScreen',
'dinleBulScreen',
'boslukDoldurScreen',
'ayetOkuScreen',
'hadisOkuScreen',
'duaOgrenScreen'
    ];

    screens.forEach(id => {
const el = document.getElementById(id);
if (el) el.style.display = 'none';
    });
}

// Global olarak erişilebilir yap
window.hideAllGameScreens = hideAllGameScreens;

// Tüm modalları kapat
function closeAllModals() {
    const modals = ['statsModal', 'badgesModal', 'calendarModal', 'dailyTasksModal', 'onboardingModal', 'dailyGoalModal', 'xpInfoModal', 'customAlertModal', 'customConfirm'];
    modals.forEach(modalId => {
const modal = document.getElementById(modalId);
if (modal) {
    modal.style.display = 'none';
    modal.style.zIndex = '';
    // Force reflow to ensure modal is hidden before next operation
    modal.offsetHeight;
}
    });
    // Body scroll'u tekrar aktif et
    document.body.style.overflow = '';
    
    // Bottom nav bar'ı tekrar göster (tüm modallar kapandığında)
    if (typeof showBottomNavBar === 'function') {
showBottomNavBar();
    }
}

// Global olarak erişilebilir yap
window.closeAllModals = closeAllModals;




// Hide all mode containers so only the requested mode is visible
function hideAllModes() {
    // Tüm oyun modlarını ve ekranları gizle (mainMenu hariç)
    const modeKeys = ['dinleMode','hadisMode','boslukMode','ayetMode','duaMode','modeSelector','gameScreen'];
    modeKeys.forEach(k => {
        try {
            const el = elements[k];
            if (el && el.style) {
                el.style.display = 'none';
                // Z-index'i de sıfırla (ekranların üst üste binmesini önle)
                el.style.zIndex = '';
            }
        } catch (e) {
            // ignore missing elements
        }
    });
    
    // Tüm game screen container'larını da gizle
    const screenIds = ['kelimeCevirScreen', 'dinleBulScreen', 'boslukDoldurScreen', 'ayetOkuScreen', 'hadisOkuScreen', 'duaOgrenScreen'];
    screenIds.forEach(screenId => {
        try {
            const screen = document.getElementById(screenId);
            if (screen && screen.style) {
                screen.style.display = 'none';
                screen.style.zIndex = '';
            }
        } catch (e) {
            // ignore missing elements
        }
    });
    
    // Tüm modal'ları da gizle
    const modals = ['statsModal', 'badgesModal', 'calendarModal', 'dailyTasksModal', 'onboardingModal', 'dailyGoalModal', 'xpInfoModal'];
    modals.forEach(modalId => {
        try {
            const modal = document.getElementById(modalId);
            if (modal && modal.style) {
                modal.style.display = 'none';
                modal.style.zIndex = '';
            }
        } catch (e) {
            // ignore missing elements
        }
    });
}

function playAudio(audioUrl, button) {
    // Eğer ses çalıyorsa durdur
    stopCurrentAudio();
    
    if (!audioUrl) {
        log.error('Ses dosyası bulunamadı');
        if (button) button.disabled = false;
        return;
    }
    
    // URL doğrulama
    if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://') && !audioUrl.startsWith('data:')) {
        log.error('Geçersiz ses URL formatı:', audioUrl);
        if (button) button.disabled = false;
        return;
    }
    
    // Butonu devre dışı bırak
    if (button) button.disabled = true;
    
    try {
        currentAudio = new Audio(audioUrl);
        
        // Ses yüklendiğinde çal
        currentAudio.addEventListener('loadeddata', () => {
            currentAudio.play().catch(err => {
                log.error('Ses çalma hatası:', err);
                log.error('Ses URL:', audioUrl);
                if (button) button.disabled = false;
                cleanupAudioListeners();
                currentAudio = null;
            });
        });
        
        // Ses bittiğinde butonu aktif et ve cleanup
        currentAudio.onended = () => {
                if (button) button.disabled = false;
                cleanupAudioListeners();
                if (currentAudio) {
                    currentAudio = null;
                }
            };
            
            // Hata durumunda cleanup
            currentAudio.onerror = (e) => {
                log.error('Ses dosyası yüklenemedi:', audioUrl);
                log.error('Hata kodu:', currentAudio.error?.code);
                log.error('Hata mesajı:', currentAudio.error?.message);
                if (button) button.disabled = false;
                cleanupAudioListeners();
                if (currentAudio) {
                    currentAudio = null;
                }
            };
        
        // Ses dosyasını yükle
        currentAudio.load();
        
    } catch (err) {
        log.error('Audio oluşturma hatası:', err);
        log.error('Ses URL:', audioUrl);
        if (button) button.disabled = false;
        currentAudio = null;
    }
}

// ============ NETWORK - FETCH WITH RETRY ============
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    // JSON yükleme hatalarında otomatik retry
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            log.debug(`📡 Fetch attempt ${i + 1}/${retries} failed for ${url}`);
            if (i === retries - 1) {
                // Son deneme de başarısız
                throw new Error(`Failed to load ${url} after ${retries} attempts: ${error.message}`);
            }
            // Retry öncesi bekle (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}





// ============ VERİ YÜKLEME ============
// Artık lazy loading kullanılıyor - veriler sadece ihtiyaç duyulduğunda yüklenir
// loadKelimeData(), loadAyetData(), loadDuaData(), loadHadisData() fonksiyonları
// js/data-loader.js dosyasında tanımlı

async function loadData() {
    try {
        // Sadece mod seçiciyi ve butonları başlat
        // Veriler lazy loading ile yüklenecek
        initModeSelector();
        initMainMenuDifficultyButtons();
        
    } catch (error) {
        log.error('Veri yükleme hatası:', error);
        // NULL KONTROL - mainMenu varsa hata mesajı göster
        if (elements.mainMenu) {
            elements.mainMenu.innerHTML = '<p style="color: red; text-align: center;">Veriler yüklenemedi!</p>';
        } else {
            log.error('❌ KRİTİK: mainMenu elementi bulunamadı!');
        }
    }
}

// ============ İNDEXEDDB SİSTEMİ (ÜÇÜNCü TARAF ÇEREZİ SORUNU İÇİN) ============
let db = null;

function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('HaseneGameDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains('gameData')) {
                db.createObjectStore('gameData');
            }
        };
    });
}

function saveToIndexedDB(key, value) {
    if (!db) return;
    try {
        const transaction = db.transaction(['gameData'], 'readwrite');
        const store = transaction.objectStore('gameData');
        store.put(value, key);
    } catch(e) { log.error('IndexedDB save failed:', e); }
}

function loadFromIndexedDB(key) {
    return new Promise((resolve) => {
        if (!db) { resolve(null); return; }
        try {
            const transaction = db.transaction(['gameData'], 'readonly');
            const store = transaction.objectStore('gameData');
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => resolve(null);
        } catch(e) { resolve(null); }
    });
}

// URL TABANLI VERİ SAKLAMA (Mobil fallback - hiçbir şey çalışmazsa)
function saveToURL() {
    const gameData = {
        p: totalPoints, // points
        b: badges.bronze + ',' + badges.silver + ',' + badges.gold + ',' + badges.diamond, // badges
        s: streakData.currentStreak, // streak
        d: getLocalDateString() // date (yerel tarih)
    };
    const encoded = btoa(JSON.stringify(gameData));
    const newUrl = window.location.origin + window.location.pathname + '?data=' + encoded;
    
    // URL'yi geçmişe ekle (geri butonu ile erişilebilir)
    if (window.history.pushState) {
        window.history.pushState({gameData: encoded}, '', newUrl);
    }
    log.debug('🔗 URL\'ye kaydedildi:', totalPoints, 'puan');
}

function loadFromURL() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const data = urlParams.get('data');
        if (data) {
            const decoded = JSON.parse(atob(data));
            totalPoints = parseInt(decoded.p) || 0;
            
            // Rozet verilerini yükle
            if (decoded.b) {
                const badgeArray = decoded.b.split(',');
                badges.bronze = parseInt(badgeArray[0]) || 0;
                badges.silver = parseInt(badgeArray[1]) || 0;
                badges.gold = parseInt(badgeArray[2]) || 0;
                badges.diamond = parseInt(badgeArray[3]) || 0;
            }
            
            // Streak verilerini yükle
            if (decoded.s) {
                streakData.currentStreak = parseInt(decoded.s) || 0;
            }
            
            log.debug('🔗 URL\'den yüklendi:', totalPoints, 'puan');
            return true;
        }
    } catch(e) {
        log.error('URL yükleme hatası:', e);
    }
    return false;
}

// ============ İSTATİSTİK BAR FONKSİYONLARI ============
async function loadStats() {
    try {
        // IndexedDB'den yükle (üçüncü taraf çerez sorunu için)
        const savedPoints = await loadFromIndexedDB('hasene_totalPoints');
        const savedBadges = await loadFromIndexedDB('hasene_badges');
        const savedStreak = await loadFromIndexedDB('hasene_streak');
        const savedTasks = await loadFromIndexedDB('hasene_dailyTasks');
        
        // Puanları yükle (IndexedDB öncelikli, localStorage yedek)
        totalPoints = parseInt(savedPoints || localStorage.getItem('hasene_totalPoints') || '0');
        starPoints = Math.floor(totalPoints / 100);
        level = calculateLevel(totalPoints);
        
        log.debug('📊 IndexedDB yüklendi:', {totalPoints, savedPoints});
    } catch (error) {
        log.debug('IndexedDB hatası, localStorage denenecek:', error);
        try {
            // localStorage dene
            totalPoints = parseInt(localStorage.getItem('hasene_totalPoints') || '0');
            starPoints = Math.floor(totalPoints / 100);
            level = calculateLevel(totalPoints);
            log.debug('📊 localStorage yüklendi:', totalPoints);
        } catch (localError) {
            log.debug('localStorage da çalışmıyor, URL deneniyor:', localError);
            // Son çare: URL'den yükle
            const urlLoaded = loadFromURL();
            if (urlLoaded) {
                starPoints = Math.floor(totalPoints / 100);
                level = calculateLevel(totalPoints);
            } else {
                // Hiçbir şey çalışmıyor, varsayılan değerler
                totalPoints = 0;
                starPoints = 0;
                level = 1;
                log.warn('⚠️ Hiçbir veri sistemi çalışmıyor, sıfırdan başlatılıyor');
            }
        }
    }
    
    // Rozet sistemi yükle (IndexedDB öncelikli)
    const savedBadgesIndexedDB = await loadFromIndexedDB('hasene_badges');
    const savedBadgesData = savedBadgesIndexedDB || localStorage.getItem('hasene_badges');
    if (savedBadgesData) {
        badges = JSON.parse(typeof savedBadgesData === 'string' ? savedBadgesData : JSON.stringify(savedBadgesData));
    }
    
    // Streak sistemi yükle (IndexedDB öncelikli)
    const savedStreakIndexedDB = await loadFromIndexedDB('hasene_streak');
    const savedStreak = savedStreakIndexedDB || localStorage.getItem('hasene_streak');
    if (savedStreak) {
        streakData = { ...streakData, ...JSON.parse(typeof savedStreak === 'string' ? savedStreak : JSON.stringify(savedStreak)) };
    }
    
    // Günlük görevler yükle (IndexedDB öncelikli) - BU ÇOOK ÖNEMLİ!
    const savedTasksIndexedDB = await loadFromIndexedDB('hasene_dailyTasks');
    const savedTasks = savedTasksIndexedDB || localStorage.getItem('hasene_dailyTasks');
    if (savedTasks) {
        dailyTasks = { ...dailyTasks, ...JSON.parse(typeof savedTasks === 'string' ? savedTasks : JSON.stringify(savedTasks)) };
        window.dailyTasks = dailyTasks; // Global erişim için güncelle
        // Set nesnelerini yeniden oluştur
        dailyTasks.todayStats.farklıZorluk = new Set(dailyTasks.todayStats.farklıZorluk || []);
    }
    
    // Oyun ayarları yükle (currentMode ve currentDifficulty) - ÇOOK ÖNEMLİ!
    const savedModeIndexedDB = await loadFromIndexedDB('hasene_currentMode');
    const savedMode = savedModeIndexedDB || localStorage.getItem('hasene_currentMode');
    if (savedMode && CONFIG.gameModes[savedMode]) {
        currentMode = savedMode;
        log.debug(`🎮 Kaydedilen mod yüklendi: ${currentMode}`);
    }
    
    const savedDifficultyIndexedDB = await loadFromIndexedDB('hasene_currentDifficulty');
    const savedDifficulty = savedDifficultyIndexedDB || localStorage.getItem('hasene_currentDifficulty');
    if (savedDifficulty && CONFIG.difficultyLevels[savedDifficulty]) {
        currentDifficulty = savedDifficulty;
        log.debug(`🎯 Kaydedilen zorluk yüklendi: ${currentDifficulty}`);
    }
    
    log.debug('📋 Günlük görevler yüklendi:', {
        completedTasks: dailyTasks.completedTasks.length,
        todayStats: dailyTasks.todayStats,
        lastTaskDate: dailyTasks.lastTaskDate
    });
    
    log.debug('🎮 Oyun ayarları yüklendi:', {
        currentMode: currentMode,
        currentDifficulty: currentDifficulty
    });
    
    // Günlük kontrol
    checkDailyProgress();
    checkDailyTasks(); // Bu fonksiyon içinde zaten updateTasksDisplay() çağrılıyor
}

// Daha zorlu seviye hesaplama sistemi
function calculateLevel(points) {
    if (points < 1000) return 1;        // Level 1: 0-999 puan
    if (points < 2500) return 2;        // Level 2: 1000-2499 puan  
    if (points < 5000) return 3;        // Level 3: 2500-4999 puan
    if (points < 8500) return 4;        // Level 4: 5000-8499 puan
    if (points < 13000) return 5;       // Level 5: 8500-12999 puan
    if (points < 19000) return 6;       // Level 6: 13000-18999 puan
    if (points < 26500) return 7;       // Level 7: 19000-26499 puan
    if (points < 35500) return 8;       // Level 8: 26500-35499 puan
    if (points < 46000) return 9;       // Level 9: 35500-45999 puan
    if (points < 58000) return 10;      // Level 10: 46000-57999 puan
    
    // Level 10'dan sonra her seviye için 15000 puan artış
    const afterLevel10 = points - 58000;
    return 10 + Math.floor(afterLevel10 / 15000);
}

// Bir sonraki seviye için gereken puan
function getNextLevelRequiredPoints(currentLevel) {
    const levelThresholds = [0, 1000, 2500, 5000, 8500, 13000, 19000, 26500, 35500, 46000, 58000];
    
    // currentLevel 1-10 arasındaysa threshold'u döndür
    if (currentLevel >= 1 && currentLevel <= 10) {
        return levelThresholds[currentLevel];
    }
    
    // Level 10'dan sonra - her seviye için 15000 puan artış
    if (currentLevel > 10) {
        return 58000 + ((currentLevel - 10) * 15000);
    }
    
    // Level 0 veya geçersiz değerler için
    return levelThresholds[1]; // Level 1 threshold'u
}

// ============ DEBOUNCE SİSTEMİ (Performans Optimizasyonu) ============
// Not: saveStatsTimeout ve pendingSave yukarıda tanımlandı (beforeunload için)

// Debounced saveStats - 500ms bekle, sonra kaydet
function debouncedSaveStats() {
    window.pendingSave = true;
    if (window.saveStatsTimeout) {
        clearTimeout(window.saveStatsTimeout);
    }
    window.saveStatsTimeout = setTimeout(() => {
        if (window.pendingSave) {
            saveStats().catch(err => {
                log.error('❌ saveStats hatası:', err);
            });
            window.pendingSave = false;
        }
    }, 500);
}

// Acil kaydetme (oyun bitişi gibi kritik durumlar için)
async function saveStatsImmediate() {
    if (window.saveStatsTimeout) {
        clearTimeout(window.saveStatsTimeout);
        window.saveStatsTimeout = null;
    }
    window.pendingSave = false;
    return await saveStats();
}

async function saveStats() {
    try {
        // ÇOKLU KAYDETME SİSTEMİ (Üçüncü taraf çerez sorunu için)
        
        // 1. IndexedDB (ana sistem - çerez engellemelerinden etkilenmez)
        if (db) {
            saveToIndexedDB('hasene_totalPoints', totalPoints.toString());
            saveToIndexedDB('hasene_badges', JSON.stringify(badges));
            saveToIndexedDB('hasene_streak', JSON.stringify(streakData));
            
            const tasksToSave = { 
                ...dailyTasks, 
                todayStats: {
                    ...dailyTasks.todayStats,
                    farklıZorluk: Array.from(dailyTasks.todayStats.farklıZorluk)
                }
            };
            saveToIndexedDB('hasene_dailyTasks', JSON.stringify(tasksToSave));
            
            // Oyun ayarları da kaydet (currentMode & currentDifficulty) - KRİTİK!
            saveToIndexedDB('hasene_currentMode', currentMode);
            saveToIndexedDB('hasene_currentDifficulty', currentDifficulty);
        }
        
        // 2. localStorage (yedek sistem)
        try {
            localStorage.setItem('hasene_totalPoints', totalPoints.toString());
            localStorage.setItem('hasene_badges', JSON.stringify(badges));
            localStorage.setItem('hasene_streak', JSON.stringify(streakData));
            
            // GÜNLÜK GÖREVLER de localStorage'a kaydet (kritik!)
            const tasksToSave = { 
                ...dailyTasks, 
                todayStats: {
                    ...dailyTasks.todayStats,
                    farklıZorluk: Array.from(dailyTasks.todayStats.farklıZorluk)
                }
            };
            localStorage.setItem('hasene_dailyTasks', JSON.stringify(tasksToSave));
            
            // Oyun ayarları da localStorage'a kaydet - KRİTİK!
            localStorage.setItem('hasene_currentMode', currentMode);
            localStorage.setItem('hasene_currentDifficulty', currentDifficulty);
        } catch(e) { log.error('localStorage failed:', e); }
        
        // 3. URL sistemi (son çare - mobil için)
        try {
            saveToURL();
        } catch(e) { log.error('URL save failed:', e); }
        
        // 4. Liderlik tablosu güncelleme - KALDIRILDI
        // NOT: updateLeaderboardScores sadece oyun bitiminde addToGlobalPoints içinde çağrılmalı
        // Burada çağrılırsa her saveAllGameData çağrısında aynı sessionScore tekrar eklenir!
        
        // 5. Hedef tamamlama bildirimi kontrolü
        if (typeof checkGoalCompletion === 'function') {
            checkGoalCompletion();
        }
        
        log.debug('💾 ÜÇLÜ KORUMA: IndexedDB + localStorage + URL ile kaydedildi!', totalPoints);
        
    } catch (error) {
        log.error('❌ Kaydetme hatası:', error);
    }
}

function resetAllStats() {
    // =========================================
    // 🔥 TEMEL SKORLAR
    // =========================================
    totalPoints = 0;
    starPoints = 0;
    level = 1;
    sessionScore = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    comboCount = 0;

    // Rozetleri sıfırla
    badges = { bronze: 0, silver: 0, gold: 0, diamond: 0 };

    // =========================================
    // 🔥 ACHIEVEMENT SİSTEMİ SIFIRLA
    // =========================================
    localStorage.removeItem('unlockedAchievements');
    localStorage.setItem('achievementsJustReset', 'true'); // UI güncellemesi için flag

    // =========================================
    // 🔥 STREAK + GÜNLÜK HEDEF SIFIRLA
    // =========================================
    streakData = {
currentStreak: 0,
playDates: [],
dailyGoal: 5,
dailyCorrect: 0
    };

    // =========================================
    // 🔥 DAILY TASKS SIFIRLA
    // =========================================
    dailyTasks = {
lastTaskDate: null,
tasks: [],
bonusTasks: [],
completedTasks: [],
rewardsClaimed: false,
todayStats: {
    kelimeCevir: 0,
    dinleBul: 0,
    boslukDoldur: 0,
    ayetOku: 0,
    duaOgre: 0,
    hadisOku: 0,
    toplamDogru: 0,
    toplamYanlis: 0,
    toplamPuan: 0,
    perfectStreak: 0,
    farklıZorluk: new Set()
}
    };
    window.dailyTasks = dailyTasks; // Global erişim için güncelle

    // ================================
// 🔥 GÜNLÜK HEDEF (DAILY GOAL) TAM SIFIRLA (Storage Manager ile)
// ================================
storage.set("dailyGoalHasene", "2700");  // hedef sıfır → 2700 varsayılan
storage.set("dailyHasene", "0");         // günlük kazanılan XP sıfır
storage.set("dailyGoalLevel", "normal"); // varsayılan zorluk
storage.remove("lastDailyXPReset");      // reset tarihi temizle

// UI Güncelle → Barları sıfırla
const bar = document.getElementById("dailyGoalProgress");
const barText = document.getElementById("dailyGoalProgressText");
const goalText = document.getElementById("dailyGoalText");

if (bar) bar.style.width = "0%";
if (barText) barText.textContent = `0 / 2700 Hasene`;
if (goalText) goalText.textContent = `Günlük Vird: 2700 Hasene`;

    // Her 1 hedeften 540 XP geliyorsa — dilersen değiştir

    // =========================================
    // 🔥 INDEXED DB TEMİZLE
    // =========================================
    if (db) {
try {
    const transaction = db.transaction(['gameData'], 'readwrite');
    const store = transaction.objectStore('gameData');
    store.clear();
    log.debug('🗑️ IndexedDB temizlendi');
} catch(e) {
    log.error('IndexedDB temizleme hatası:', e);
}
    }

    // =========================================
    // 🔥 LOCAL STORAGE TEMİZLE
    // =========================================
    localStorage.removeItem('hasene_totalPoints');
    localStorage.removeItem('hasene_badges');
    localStorage.removeItem('hasene_streak');
    localStorage.removeItem('hasene_dailyTasks');
    localStorage.removeItem('hasene_currentMode');
    localStorage.removeItem('hasene_currentDifficulty');
    localStorage.removeItem('hasene_wordStats');
    localStorage.removeItem('dailyXP');
    localStorage.removeItem('unlockedAchievements'); // Achievement sistemini de sıfırla
    
    // =========================================
    // 🔥 LİDERLİK TABLOSU SIFIRLA (MOBİL UYUMLU)
    // =========================================
    try {
localStorage.removeItem('hasene_weeklyScores');
localStorage.removeItem('hasene_monthlyScores');
// Boş obje olarak set et (mobil uyumluluk için)
localStorage.setItem('hasene_weeklyScores', JSON.stringify({}));
localStorage.setItem('hasene_monthlyScores', JSON.stringify({}));
    } catch(e) {
log.error('Liderlik tablosu sıfırlama hatası:', e);
    }
    
    // =========================================
    // 🔥 DETAYLI İSTATİSTİKLER SIFIRLA (MOBİL UYUMLU)
    // =========================================
    try {
// Günlük doğru/yanlış değerlerini sıfırla
localStorage.removeItem('dailyCorrect');
localStorage.removeItem('dailyWrong');
localStorage.setItem('dailyCorrect', '0');
localStorage.setItem('dailyWrong', '0');

// Tarih bazlı günlük verilerini temizle (hasene_daily_YYYY-MM-DD formatındaki tüm key'ler)
// localStorage'daki tüm key'leri tarayarak hasene_daily_ ile başlayanları temizle
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('hasene_daily_')) {
        keysToRemove.push(key);
    }
}
keysToRemove.forEach(key => localStorage.removeItem(key));

// Ek güvenlik: Son 90 günün verilerini de temizle (eğer yukarıdaki tarama eksik kaldıysa)
const today = new Date();
for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const dayKey = `hasene_daily_${dateKey}`;
    localStorage.removeItem(dayKey);
}

// Genel detaylı istatistik key'lerini temizle
localStorage.removeItem('hasene_detailedStats');
localStorage.removeItem('hasene_dailyStats');
localStorage.removeItem('hasene_weeklyStats');
localStorage.removeItem('hasene_monthlyStats');
localStorage.removeItem('hasene_trendStats');

// Streak data'yı temizle (detaylı istatistikler için kullanılıyor)
localStorage.removeItem('hasene_streakData');

log.debug('✅ Detaylı istatistikler sıfırlandı (tarih bazlı veriler dahil)');
    } catch(e) {
log.error('Detaylı istatistikler sıfırlama hatası:', e);
    }
    
    // =========================================
    // 🔥 BİLDİRİMLER SIFIRLA (MOBİL UYUMLU)
    // =========================================
    try {
localStorage.removeItem('hasene_notifications');
localStorage.removeItem('hasene_notificationSettings');
localStorage.removeItem('hasene_lastNotificationDate');
    } catch(e) {
log.error('Bildirimler sıfırlama hatası:', e);
    }
    
    // =========================================
    // 🔥 SOSYAL PAYLAŞIM SIFIRLA (MOBİL UYUMLU)
    // =========================================
    try {
localStorage.removeItem('hasene_socialShare');
localStorage.removeItem('hasene_shareHistory');
    } catch(e) {
log.error('Sosyal paylaşım sıfırlama hatası:', e);
    }

    // =========================================
    // 🔥 URL GEÇMİŞ TEMİZLE
    // =========================================
    try {
if (window.history.replaceState) {
    window.history.replaceState({}, '', window.location.pathname);
}
    } catch(e) {
// URL temizleme hatası kritik değil, sessizce geç
log.debug('URL geçmiş temizleme hatası (kritik değil):', e);
    }

    // =========================================
    // 🔥 YENİ DAILY TASK ÜRET
    // =========================================
    generateDailyTasks(getLocalDateString());

    // =========================================
    // 🔥 UI GÜNCELLE - TÜM İSTATİSTİK ALANLARI
    // =========================================
    
    // Üst bar güncelle
    updateStatsBar();
    updateUI();
    if (typeof updateDailyGoalDisplay === "function") {
updateDailyGoalDisplay();
    }

    // İstatistikler Modal - Seviye İlerleme Barı
    const statsCurrentLevelEl = document.getElementById('statsCurrentLevel');
    const statsNextLevelEl = document.getElementById('statsNextLevel');
    const statsLevelProgressEl = document.getElementById('statsLevelProgress');
    const statsLevelPointsNeededEl = document.getElementById('statsLevelPointsNeeded');
    if (statsCurrentLevelEl) statsCurrentLevelEl.textContent = '1';
    if (statsNextLevelEl) statsNextLevelEl.textContent = '2';
    if (statsLevelProgressEl) statsLevelProgressEl.style.width = '0%';
    if (statsLevelPointsNeededEl) statsLevelPointsNeededEl.textContent = '1,000';

    // İstatistikler Modal - Rozet Sistemi
    const statsBronzeEl = document.getElementById('statsBronze');
    const statsSilverEl = document.getElementById('statsSilver');
    const statsGoldEl = document.getElementById('statsGold');
    const statsDiamondEl = document.getElementById('statsDiamond');
    if (statsBronzeEl) statsBronzeEl.textContent = '0';
    if (statsSilverEl) statsSilverEl.textContent = '0';
    if (statsGoldEl) statsGoldEl.textContent = '0';
    if (statsDiamondEl) statsDiamondEl.textContent = '0';

    // Başarılar Modal - Mertebe Rozetleri
    const diamondBadgeCountEl = document.getElementById('diamondBadgeCount');
    const goldBadgeCountEl = document.getElementById('goldBadgeCount');
    const silverBadgeCountEl = document.getElementById('silverBadgeCount');
    const bronzeBadgeCountEl = document.getElementById('bronzeBadgeCount');
    if (diamondBadgeCountEl) diamondBadgeCountEl.textContent = '0';
    if (goldBadgeCountEl) goldBadgeCountEl.textContent = '0';
    if (silverBadgeCountEl) silverBadgeCountEl.textContent = '0';
    if (bronzeBadgeCountEl) bronzeBadgeCountEl.textContent = '0';

    // İstatistikler Modal - Başarı Analizi
    const statsSuccessRateEl = document.getElementById('statsSuccessRate');
    const statsAvgPointsPerDayEl = document.getElementById('statsAvgPointsPerDay');
    const statsPlayConsistencyEl = document.getElementById('statsPlayConsistency');
    const statsLevelProgressTextEl = document.getElementById('statsLevelProgressText');
    if (statsSuccessRateEl) statsSuccessRateEl.textContent = '0%';
    if (statsAvgPointsPerDayEl) statsAvgPointsPerDayEl.textContent = '0';
    if (statsPlayConsistencyEl) statsPlayConsistencyEl.textContent = '0%';
    if (statsLevelProgressTextEl) statsLevelProgressTextEl.textContent = '0%';

    // İstatistikler Modal - Muvazebet İstatistikleri
    const statsCurrentStreakEl = document.getElementById('statsCurrentStreak');
    const statsBestStreakEl = document.getElementById('statsBestStreak');
    const statsTotalDaysEl = document.getElementById('statsTotalDays');
    const statsTodayProgressEl = document.getElementById('statsTodayProgress');
    if (statsCurrentStreakEl) statsCurrentStreakEl.textContent = '0';
    if (statsBestStreakEl) statsBestStreakEl.textContent = '0';
    if (statsTotalDaysEl) statsTotalDaysEl.textContent = '0';
    if (statsTodayProgressEl) statsTodayProgressEl.textContent = '0';

    // İstatistikler Modal - Oyun Türü İstatistikleri
    const statsKelimeCevirEl = document.getElementById('statsKelimeCevir');
    const statsDinleBulEl = document.getElementById('statsDinleBul');
    const statsBoslukDoldurEl = document.getElementById('statsBoslukDoldur');
    const statsAyetOkuEl = document.getElementById('statsAyetOku');
    const statsDuaOgreEl = document.getElementById('statsDuaOgre');
    const statsHadisOkuEl = document.getElementById('statsHadisOku');
    if (statsKelimeCevirEl) statsKelimeCevirEl.textContent = '0';
    if (statsDinleBulEl) statsDinleBulEl.textContent = '0';
    if (statsBoslukDoldurEl) statsBoslukDoldurEl.textContent = '0';
    if (statsAyetOkuEl) statsAyetOkuEl.textContent = '0';
    if (statsDuaOgreEl) statsDuaOgreEl.textContent = '0';
    if (statsHadisOkuEl) statsHadisOkuEl.textContent = '0';

    // İstatistikler Modal - Bugünkü Performans
    const statsTodayCorrectEl = document.getElementById('statsTodayCorrect');
    const statsTodayPointsEl = document.getElementById('statsTodayPoints');
    const statsPerfectStreakEl = document.getElementById('statsPerfectStreak');
    const statsDifficultyCountEl = document.getElementById('statsDifficultyCount');
    if (statsTodayCorrectEl) statsTodayCorrectEl.textContent = '0';
    if (statsTodayPointsEl) statsTodayPointsEl.textContent = '0';
    if (statsPerfectStreakEl) statsPerfectStreakEl.textContent = '0';
    if (statsDifficultyCountEl) statsDifficultyCountEl.textContent = '0';

    // İstatistikler Modal - Kelime İstatistikleri
    const wordStatsTotalEl = document.getElementById('wordStatsTotal');
    const wordStatsMasteredEl = document.getElementById('wordStatsMastered');
    const wordStatsStrugglingEl = document.getElementById('wordStatsStruggling');
    if (wordStatsTotalEl) wordStatsTotalEl.textContent = '0';
    if (wordStatsMasteredEl) wordStatsMasteredEl.textContent = '0';
    if (wordStatsStrugglingEl) wordStatsStrugglingEl.textContent = '0';

    // Başarılar Modal - İstatistikler Özeti
    const badgesUnlockedCountEl = document.getElementById('badgesUnlockedCount');
    const badgesTotalCountEl = document.getElementById('badgesTotalCount');
    const badgesProgressPercentEl = document.getElementById('badgesProgressPercent');
    if (badgesUnlockedCountEl) badgesUnlockedCountEl.textContent = '0';
    if (badgesTotalCountEl) badgesTotalCountEl.textContent = '20';
    if (badgesProgressPercentEl) badgesProgressPercentEl.textContent = '0%';

    // Takvim Modal - Streak bilgisi
    const calendarStreakCountEl = document.getElementById('calendarStreakCount');
    if (calendarStreakCountEl) calendarStreakCountEl.textContent = '0';

    // =========================================
    // 🔥 YENİ BADGES PANEL TASARIMI GÜNCELLEMELERİ
    // =========================================
    // Achievement sıfırlama flag'i set et (updateAllAchievements için)
    localStorage.setItem('achievementsJustReset', 'true');
    
    // Achievement kartlarını güncelle (yeni tasarım için - tüm rozetleri kilitli yap)
    if (typeof updateAllAchievements === 'function') {
updateAllAchievements();
    }
    
    // Başarılar Modal istatistiklerini güncelle (sıfırlanmış durumda)
    if (typeof updateBadgesModalStats === 'function') {
updateBadgesModalStats();
    }
    
    // =========================================
    // 🔥 YENİ PANELLERİ GÜNCELLE (MOBİL UYUMLU)
    // =========================================
    
    // Liderlik tablosunu güncelle (eğer açıksa)
    try {
if (typeof closeLeaderboard === 'function') {
    // Liderlik tablosu modal'ı açıksa kapat
    const leaderboardModal = document.getElementById('leaderboardModal');
    if (leaderboardModal && leaderboardModal.style.display !== 'none') {
        closeLeaderboard();
    }
}

// Liderlik tablosu verilerini zorla sıfırla (mobil için)
if (typeof getWeeklyScores === 'function' && typeof getMonthlyScores === 'function') {
    // Fonksiyonlar varsa, verileri manuel olarak sıfırla
    localStorage.setItem('hasene_weeklyScores', JSON.stringify({}));
    localStorage.setItem('hasene_monthlyScores', JSON.stringify({}));
} else {
    // Fonksiyonlar yoksa direkt sıfırla
    localStorage.setItem('hasene_weeklyScores', JSON.stringify({}));
    localStorage.setItem('hasene_monthlyScores', JSON.stringify({}));
}
    } catch(e) {
log.error('Liderlik tablosu güncelleme hatası:', e);
    }
    
    // Detaylı istatistikleri güncelle (eğer fonksiyon varsa)
    try {
if (typeof updateDetailedStats === 'function') {
    updateDetailedStats();
}
// Detaylı istatistik verilerini zorla sıfırla (mobil için)
localStorage.setItem('dailyCorrect', '0');
localStorage.setItem('dailyWrong', '0');
localStorage.removeItem('hasene_streakData');
    } catch(e) {
log.error('Detaylı istatistikler güncelleme hatası:', e);
    }
    
    // Bildirimleri güncelle (eğer fonksiyon varsa)
    try {
if (typeof updateNotifications === 'function') {
    updateNotifications();
}
    } catch(e) {
log.error('Bildirimler güncelleme hatası:', e);
    }
    
    // Mobil cihazlarda localStorage'ı zorla temizle (tüm hasene_ ile başlayan key'ler)
    try {
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('hasene_weekly') || key.startsWith('hasene_monthly') || 
               key.startsWith('hasene_detailed') || key.startsWith('hasene_notification') ||
               key.startsWith('hasene_social') || key.startsWith('hasene_streakData'))) {
        keysToRemove.push(key);
    }
}
keysToRemove.forEach(key => {
    try {
        localStorage.removeItem(key);
    } catch(e) {
        log.debug('Key silme hatası (kritik değil):', key, e);
    }
});
    } catch(e) {
log.error('localStorage temizleme hatası:', e);
    }

    showCustomAlert("Tüm veriler tamamen sıfırlandı! 🔥", "success");
}


function updateStatsBar() {
    // NULL KONTROL - Kritik elementler
    const gamePointsEl = document.getElementById('gamePoints');
    const starPointsEl = document.getElementById('starPoints');
    const playerLevelEl = document.getElementById('playerLevel');
    
    if (!gamePointsEl || !starPointsEl || !playerLevelEl) {
        log.error('❌ HATA: Stats bar elementleri bulunamadı!');
        return;
    }
    
    // Veri doğrulama - totalPoints kontrolü
    if (typeof totalPoints !== 'number' || isNaN(totalPoints) || totalPoints < 0) {
        log.warn('⚠️ totalPoints geçersiz, sıfırlanıyor:', totalPoints);
        totalPoints = 0;
    }
    
    // Üst bar güncelle
    gamePointsEl.textContent = totalPoints;
    
    // Yıldız puanı güncelle (her 100 puana 1 yıldız - sık geri bildirim için)
    starPoints = Math.floor(totalPoints / 100);
    starPointsEl.textContent = starPoints;
    
    // Rozet sistemini güncelle (null check ile)
    if (typeof updateBadgeSystem === 'function') {
        updateBadgeSystem();
    }
    
    // Seviye güncelle (yeni hesaplama sistemi)
    if (typeof calculateLevel === 'function') {
        level = calculateLevel(totalPoints);
    } else {
        // Fallback: basit seviye hesaplama
        level = Math.max(1, Math.floor(totalPoints / 1000) + 1);
    }
    playerLevelEl.textContent = level;
    
    // Seviye ilerleme çubuğunu güncelle
    let currentLevelStart, nextLevelStart;
    
    if (level === 1) {
        currentLevelStart = 0;
        nextLevelStart = 1000;
    } else if (level <= 10) {
        const thresholds = [0, 1000, 2500, 5000, 8500, 13000, 19000, 26500, 35500, 46000, 58000];
        currentLevelStart = thresholds[level - 1];
        nextLevelStart = thresholds[level];
    } else {
        // Level 10'dan sonra
        currentLevelStart = 58000 + ((level - 11) * 15000);
        nextLevelStart = 58000 + ((level - 10) * 15000);
    }
    
    const currentLevelPoints = totalPoints - currentLevelStart;
    const levelRequiredPoints = nextLevelStart - currentLevelStart;
    // Division by zero check
    const progressPercentage = levelRequiredPoints > 0 ? Math.max(0, Math.min((currentLevelPoints / levelRequiredPoints) * 100, 100)) : 100;
    
    const levelProgressElement = document.getElementById('levelProgress');
    if (levelProgressElement) {
        levelProgressElement.style.width = progressPercentage + '%';
    }
    
    // Alt bar (oyun içi stats) güncelle
    const scoreElement = document.getElementById('score');
    if (scoreElement) scoreElement.textContent = totalPoints;
    // level elementi artık yok (Mertebe kaldırıldı)
    
    // Kaydet
    debouncedSaveStats(); // Debounced kaydetme
    
    // Debug için mevcut değerleri logla
    log.debug('📊 Mevcut İstatistikler:', {
        totalPoints: totalPoints,
        starPoints: starPoints, 
        level: level,
        sessionScore: sessionScore,
        sessionCorrect: sessionCorrect,
        sessionWrong: sessionWrong
    });
}

// COMBO FONKSİYONLARI
function updateCombo() {
    const comboIndicator = document.getElementById('comboIndicator');
    const comboCountEl = document.getElementById('comboCount');
    const comboBonusEl = document.getElementById('comboBonus');
    
    // NULL KONTROL
    if (!comboIndicator || !comboCountEl || !comboBonusEl) {
        log.warn('⚠️ Combo elementleri bulunamadı');
        return;
    }
    
    if (comboCount >= 3) {
        const bonusXP = Math.floor(comboCount / 3) * 5;
        comboCountEl.textContent = comboCount;
        comboBonusEl.textContent = bonusXP;
        
        comboIndicator.style.display = 'block';
        comboIndicator.style.animation = 'comboPopIn 0.3s ease, comboShake 0.5s ease 0.3s';
        
        // Her 3 comboda mesaj göster (bonus zaten addSessionPoints'te eklendi)
        if (comboCount % 3 === 0) {
            // Combo sesi çal
            playSound('combo');
            
            // Bonus mesajı göster
            setTimeout(() => {
                showSuccessMessage(`🔥 Maşallah! x${comboCount}! +${bonusXP} Bereketli Hasene!`);
            }, 300);
        }
        
        // 3 saniye sonra gizle
        setTimeout(() => {
            hideCombo();
        }, 3000);
    }
}

function hideCombo() {
    const comboIndicator = document.getElementById('comboIndicator');
    comboIndicator.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
        comboIndicator.style.display = 'none';
    }, 300);
}

// SESSION PUAN FONKSİYONLARI
function addSessionPoints(points) {
    log.game(`💰 === addSessionPoints(${points}) ÇAĞRILDI ===`);
    
    // Her puan eklendiğinde liderlik tablosunu güncelle (anlık güncelleme)
    if (typeof updateLeaderboardScores === 'function' && points > 0) {
        updateLeaderboardScores(points);
        log.game(`📊 Liderlik tablosu güncellendi: +${points} Hasene`);
    }
    log.game(`📊 Önce: sessionScore=${sessionScore}, totalPoints=${totalPoints}`);
    
    // Güvenli puan ekleme - NaN kontrolü
    if (typeof points !== 'number' || isNaN(points)) {
        log.error('❌ Geçersiz puan değeri:', points);
        return;
    }
    
    // Session puanlarını güncelle
    sessionScore += points;
    sessionCorrect++;
    
    // Global puanlara da ekle
    totalPoints += points;
    
    // Bugünkü toplam puana da ekle (günlük performans için)
    dailyTasks.todayStats.toplamPuan += points;
    
    // Bugünkü toplam doğru cevap sayısını güncelle
    dailyTasks.todayStats.toplamDogru++;
    
    // Daily correct sayısını localStorage'a kaydet (detaylı istatistikler için)
    const currentDailyCorrect = parseInt(localStorage.getItem('dailyCorrect')) || 0;
    localStorage.setItem('dailyCorrect', (currentDailyCorrect + 1).toString());
    
    // Daily XP ekle
    addDailyXP(points);
    
    // Günlük verileri tarih bazlı kaydet (Son 7 Gün Trendi için)
    saveDailyStats();
    
    // Doğru cevap sesi
    playSound('correct');
    
    // Combo sistemi
    comboCount++;
    updateCombo();
    
    // Her 3 doğru cevapda combo bonusu
    if (comboCount > 0 && comboCount % 3 === 0) {
        const comboBonus = 5;
        sessionScore += comboBonus; // Session skoruna da ekle (oyun sonunda gösterilecek)
        totalPoints += comboBonus;
        dailyTasks.todayStats.toplamPuan += comboBonus; // Bugünkü puana da ekle!
        
        // COMBO BONUSUNU DAILY XP'YE DE EKLE
        addDailyXP(comboBonus);
        
        // COMBO BONUSUNU LİDERLİK TABLOSUNA DA EKLE
        if (typeof updateLeaderboardScores === 'function' && comboBonus > 0) {
            updateLeaderboardScores(comboBonus);
            log.game(`📊 Liderlik tablosu güncellendi (combo bonusu): +${comboBonus} Hasene`);
        }
        
        log.game(`🔥 Combo bonusu: +${comboBonus} XP`);
        
        // COMBO BONUS SONRASI HEMEN UI GÜNCELLE
        updateUI(); // Oyun içi barı güncelle
        updateStatsBar(); // Üst barı hemen güncelle
    }
    
    // Geriye uyumluluk için eski değişkenleri de güncelle
    score = sessionScore;
    correct = sessionCorrect;
    
    // UI güncelle
    updateUI(); // Oyun içi barı güncelle
    updateStatsBar(); // Üst barı güncelle
    checkAchievements(); // Başarımları kontrol et
    
    log.game(`📊 Sonra: sessionScore=${sessionScore}, totalPoints=${totalPoints}, combo=${comboCount}`);
    log.game(`✅ addSessionPoints tamamlandı!`);
}

function addSessionWrong() {
    log.game(`❌ === addSessionWrong() ÇAĞRILDI ===`);
    log.game(`📊 Önce: sessionWrong=${sessionWrong}, wrong=${wrong}`);
    sessionWrong++;
    
    // Bugünkü toplam yanlış cevap sayısını güncelle
    if (dailyTasks && dailyTasks.todayStats) {
        dailyTasks.todayStats.toplamYanlis = (dailyTasks.todayStats.toplamYanlis || 0) + 1;
    }
    
    // Daily wrong sayısını localStorage'a kaydet (detaylı istatistikler için)
    const currentDailyWrong = parseInt(localStorage.getItem('dailyWrong')) || 0;
    localStorage.setItem('dailyWrong', (currentDailyWrong + 1).toString());
    
    // Günlük verileri tarih bazlı kaydet (Son 7 Gün Trendi için)
    saveDailyStats();
    
    // Yanlış cevap sesi
    playSound('wrong');
    
    // Combo kır
    if (comboCount > 0) {
        comboCount = 0;
        hideCombo();
    }
    wrong = sessionWrong; // Geriye uyumluluk
    log.debug(`📊 Sonra: sessionWrong=${sessionWrong}, wrong=${wrong}`);
    log.debug(`🎨 updateUI() çağrılıyor...`);
    updateUI();
    log.debug(`✅ addSessionWrong tamamlandı!`);
}

// ============ ROZET SİSTEMİ ============
function updateBadgeSystem() {
    // 🎯 XP BAZLI ROZET SİSTEMİ (1 saat oyun = ~8500 XP)
    // 🥉 Bronz: 2,000 XP = 1 bronz (~15 dk)
    // 🥈 Gümüş: 8,500 XP = 1 gümüş (~1 saat, 1 günlük hedef)
    // 🥇 Altın: 25,500 XP = 1 altın (~3 gün)
    // 💎 Elmas: 85,000 XP = 1 elmas (~10 gün)
    
    const xp = totalPoints;
    const newBronze = Math.floor(xp / 2000);
    const newSilver = Math.floor(xp / 8500);
    const newGold = Math.floor(xp / 25500);
    const newDiamond = Math.floor(xp / 85000);
    
    // Rozet seviye kontrolü ve modal gösterimi (önce en yüksek rozetleri kontrol et)
    if (newDiamond > badges.diamond) {
        badges.diamond = newDiamond;
        showBadgeUpModal('diamond', '💎 Mütebahhir');
        playSound('levelup'); // Elmas çok önemli, levelup sesi çal
    } else if (newGold > badges.gold) {
        badges.gold = newGold;
        showBadgeUpModal('gold', '🥇 Mütecaviz');
        playSound('levelup');
    } else if (newSilver > badges.silver) {
        badges.silver = newSilver;
        showBadgeUpModal('silver', '🥈 Müterakki');
        playSound('correct');
    } else if (newBronze > badges.bronze) {
        badges.bronze = newBronze;
        showBadgeUpModal('bronze', '🥉 Mübtedi');
        playSound('correct');
    }
    
    // Tüm rozet sayılarını güncelle
    badges.bronze = newBronze;
    badges.silver = newSilver;
    badges.gold = newGold;
    badges.diamond = newDiamond;
}

function showBadgeUpModal(badgeType, badgeName) {
    // Rozet kazanma modalı - profesyonel UI
    showCustomAlert(`${badgeName} nişanı kazandınız!`, 'success', 'Tebrikler');
}

function showBadgesModal() {
    // Önce tüm modalları ve oyun ekranlarını kapat
    closeAllModals();
    if (typeof hideAllGameScreens === 'function') {
        hideAllGameScreens();
    }
    if (typeof hideAllModes === 'function') {
        hideAllModes();
    }
    
    // Synchronization: Wait for DOM updates before opening new modal
    requestAnimationFrame(() => {
        // Bottom nav bar'ı gizle (modal açıkken görünmemeli)
        if (typeof hideBottomNavBar === 'function') {
            hideBottomNavBar();
        }
        
        // Touch event'lerini başlat (eğer henüz başlatılmadıysa)
        initBadgesModalTouchEvents();
        
        // Body scroll'u engelle
        document.body.style.overflow = 'hidden';
        
        // Tüm rozet sayılarını güncelle
        const diamondEl = document.getElementById('diamondBadgeCount');
        const goldEl = document.getElementById('goldBadgeCount');
        const silverEl = document.getElementById('silverBadgeCount');
        const bronzeEl = document.getElementById('bronzeBadgeCount');
        
        if (diamondEl) diamondEl.textContent = badges.diamond;
        if (goldEl) goldEl.textContent = badges.gold;
        if (silverEl) silverEl.textContent = badges.silver;
        if (bronzeEl) bronzeEl.textContent = badges.bronze;
        
        // Yeni tasarım için istatistikleri güncelle
        updateBadgesModalStats();
        
        // Tüm achievement'ları güncelle
        updateAllAchievements();
        
        // İlk kategoriyi göster (kısa bir gecikme ile, DOM'un hazır olması için)
        setTimeout(() => {
            showBadgeCategory('daily');
        }, 50);
        
        // Modal'ı göster
        const badgesModal = document.getElementById('badgesModal');
        if (badgesModal) {
            badgesModal.style.display = 'flex';
            // Force reflow to ensure modal is visible
            badgesModal.offsetHeight;
        }
    });
}

// Kategori değiştirme fonksiyonu
function showBadgeCategory(category, clickedElement) {
    // Remove active class from all tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    if (clickedElement) {
        clickedElement.classList.add('active');
    } else {
        const tab = document.querySelector(`.category-tab[data-category="${category}"]`);
        if (tab) tab.classList.add('active');
    }
    
    // Hide all badges
    document.querySelectorAll('.badge-card').forEach(card => {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });
    
    // Show badges of selected category
    const categoryCards = document.querySelectorAll(`.badge-card[data-category="${category}"]`);
    categoryCards.forEach((card, index) => {
        card.style.display = 'block';
        // Animate cards
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Başarılar modal istatistiklerini güncelle
function updateBadgesModalStats() {
    const unlockedAchievements = storage.getSafe('unlockedAchievements', [], { type: 'array' });
    const totalAchievements = 20; // Toplam achievement sayısı
    const unlockedCount = unlockedAchievements.length;
    const progressPercent = Math.round((unlockedCount / totalAchievements) * 100);

    const unlockedEl = document.getElementById('badgesUnlockedCount');
    const totalEl = document.getElementById('badgesTotalCount');
    const progressEl = document.getElementById('badgesProgressPercent');

    if (unlockedEl) unlockedEl.textContent = unlockedCount;
    if (totalEl) totalEl.textContent = totalAchievements;
    if (progressEl) progressEl.textContent = progressPercent + '%';
}

// Tüm achievement'ları güncelle
function updateAllAchievements() {
    const unlockedAchievements = storage.getSafe('unlockedAchievements', [], { type: 'array' });
    const achievements = [
        { id: 'first_win', name: 'İlk Zafer', desc: 'İlk sahih cevabin', icon: '🎯', condition: () => sessionCorrect >= 1 },
        { id: 'combo_master', name: 'Muvazebet Ustası', desc: '5x muvazebet yap', icon: '🔥', condition: () => comboCount >= 5, progress: () => Math.min(comboCount || 0, 5) },
        { id: 'daily_goal', name: 'Günlük Kahraman', desc: 'Günlük virdi tamamla', icon: '⭐', condition: () => {
            const dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
            const goalHasene = parseInt(localStorage.getItem('dailyGoalHasene')) || 2700;
            return dailyHasene >= goalHasene;
        }, progress: () => {
            const dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
            const goalHasene = parseInt(localStorage.getItem('dailyGoalHasene')) || 2700;
            // Division by zero check
            return goalHasene > 0 ? Math.min((dailyHasene / goalHasene) * 100, 100) : 0;
        }},
        { id: 'streak_7', name: '7 Gün Muvazebet', desc: '7 gün üst üste talebe et', icon: '🔥', condition: () => streakData.currentStreak >= 7, progress: () => Math.min((streakData.currentStreak || 0) / 7 * 100, 100) },
        { id: 'level_5', name: 'Mertebe 5', desc: 'Mertebe 5\'e ulaş', icon: '🏆', condition: () => level >= 5, progress: () => {
            // Level 1 ise 0% göster, 1/5 değil
            if (level <= 1) return 0;
            return Math.min((level / 5) * 100, 100);
        }},
        { id: 'level_10', name: 'Mertebe 10', desc: 'Mertebe 10\'a ulaş', icon: '💎', condition: () => level >= 10, progress: () => {
            // Level 1 ise 0% göster, 1/10 değil
            if (level <= 1) return 0;
            return Math.min((level / 10) * 100, 100);
        }},
        { id: 'level_20', name: 'Mertebe 20', desc: 'Mertebe 20\'ye ulaş', icon: '🌟', condition: () => level >= 20, progress: () => {
            // Level 1 ise 0% göster, 1/20 değil
            if (level <= 1) return 0;
            return Math.min((level / 20) * 100, 100);
        }},
        { id: 'xp_500', name: 'İlk Adım', desc: '500 Hasene topla', icon: '🌱', condition: () => totalPoints >= 500, progress: () => Math.min((totalPoints || 0) / 500 * 100, 100) },
        { id: 'xp_2000', name: 'Mübtedi Yolcu', desc: '2,000 Hasene', icon: '🥉', condition: () => totalPoints >= 2000, progress: () => Math.min((totalPoints || 0) / 2000 * 100, 100) },
        { id: 'xp_8500', name: 'Gümüş Ustası', desc: '8,500 Hasene', icon: '🥈', condition: () => totalPoints >= 8500, progress: () => Math.min((totalPoints || 0) / 8500 * 100, 100) },
        { id: 'xp_25500', name: 'Altın Ustası', desc: '25,500 Hasene', icon: '🥇', condition: () => totalPoints >= 25500, progress: () => Math.min((totalPoints || 0) / 25500 * 100, 100) },
        { id: 'xp_85000', name: 'Elmas Ustası', desc: '85,000 Hasene', icon: '💎', condition: () => totalPoints >= 85000, progress: () => Math.min((totalPoints || 0) / 85000 * 100, 100) }
    ];

    achievements.forEach(ach => {
        const card = document.getElementById(`achievement-${ach.id}`);
        if (!card) return;

        const isUnlocked = unlockedAchievements.includes(ach.id);
        const progressFill = card.querySelector('.badge-progress-fill');
        const statusText = card.querySelector('.badge-status');
        const iconEl = card.querySelector('.badge-icon');
        const titleEl = card.querySelector('.badge-title');
        const descEl = card.querySelector('.badge-desc');

        // Icon, title, desc güncelle
        if (iconEl) iconEl.textContent = ach.icon;
        if (titleEl) titleEl.textContent = ach.name;
        if (descEl) descEl.textContent = ach.desc;

        if (isUnlocked) {
            card.classList.add('unlocked');
            card.classList.remove('locked');
            // Inline style'ları temizle - CSS class'ları kullanılacak
            card.style.background = '';
            card.style.borderColor = '';
            card.style.boxShadow = '';
            card.style.opacity = '';
            card.style.filter = '';
            if (progressFill) {
                progressFill.style.width = '100%';
                progressFill.style.background = '';
            }
            if (statusText) {
                statusText.textContent = 'Tamamlandı';
                statusText.style.color = '';
                statusText.style.fontWeight = '';
            }
        } else {
            card.classList.remove('unlocked');
            card.classList.add('locked');
            // Inline style'ları temizle - CSS class'ları kullanılacak
            card.style.background = '';
            card.style.borderColor = '';
            card.style.opacity = '';
            card.style.filter = '';
            
            // İlerleme göster
            if (ach.progress && progressFill) {
                const progress = ach.progress();
                // Level achievement'ları için özel kontrol: level 1 ise 0% göster
                let finalProgress = progress;
                if (ach.id.startsWith('level_') && level <= 1) {
                    finalProgress = 0;
                }
                progressFill.style.width = finalProgress + '%';
                progressFill.style.background = '';
            }
            
            // İlerleme metni
            if (statusText && ach.progress) {
                const progress = ach.progress();
                if (ach.id === 'combo_master') {
                    statusText.textContent = `${comboCount || 0}/5`;
                } else if (ach.id === 'daily_goal') {
                    const dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
                    const goalHasene = parseInt(localStorage.getItem('dailyGoalHasene')) || 2700;
                    statusText.textContent = `${dailyHasene}/${goalHasene}`;
                } else if (ach.id === 'streak_7') {
                    statusText.textContent = `${streakData.currentStreak || 0}/7`;
                } else if (ach.id.startsWith('level_')) {
                    const targetLevel = parseInt(ach.id.split('_')[1]);
                    // Level 1 ise 0/X göster, 1/X değil
                    const currentLevel = (level <= 1) ? 0 : level;
                    statusText.textContent = `Seviye ${currentLevel}/${targetLevel}`;
                } else if (ach.id.startsWith('xp_')) {
                    const targetXP = parseInt(ach.id.split('_')[1]);
                    statusText.textContent = `${(totalPoints || 0).toLocaleString()}/${targetXP.toLocaleString()}`;
                } else {
                    statusText.textContent = 'Kilitli';
                }
                statusText.style.color = '';
                statusText.style.fontWeight = '';
            } else if (statusText) {
                statusText.textContent = 'Kilitli';
            }
        }
    });
}

function closeBadgesModal() {
    const modal = document.getElementById('badgesModal');
    if (modal) {
        // Event listener'ları temizle (memory leak prevention)
        const scrollableContent = document.getElementById('badgesScrollableContent');
        eventManager.cleanupMultiple([modal, scrollableContent].filter(Boolean));
        
        modal.style.display = 'none';
        modal.style.zIndex = '';
        // Body scroll'u tekrar aktif et
        document.body.style.overflow = '';
        
        // Bottom nav bar'ı tekrar göster (modal kapandığında)
        if (typeof showBottomNavBar === 'function') {
            showBottomNavBar();
        }
        
        // Tüm oyun ekranlarını ve modlarını gizle
        if (typeof hideAllGameScreens === 'function') {
            hideAllGameScreens();
        }
        if (typeof hideAllModes === 'function') {
            hideAllModes();
        } else {
            // Fallback: Manuel olarak modları gizle
            const modeIds = ['gameScreen', 'modeSelector', 'ayetMode', 'duaMode', 'hadisMode', 'boslukMode', 'dinleMode'];
            modeIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.display = 'none';
                    el.style.zIndex = '';
                }
            });
        }
        
        // Ana sayfanın görünür olduğundan emin ol
        if (elements && elements.mainMenu) {
            elements.mainMenu.style.display = 'block';
        }
        
        log.debug('🔒 Badges Modal kapatıldı ve temizlendi');
    }
}

// Touch event tracking for badges modal scroll detection
let badgesModalTouchStart = { x: 0, y: 0, time: 0 };
let badgesModalIsScrolling = false;

// Badges modal için unified event handler sistemi
function initBadgesModalTouchEvents() {
    const badgesModal = document.getElementById('badgesModal');
    const badgesScrollableContent = document.getElementById('badgesScrollableContent');
    if (!badgesModal) return;
    
    // Unified event handler kullan
    if (window.unifiedEventHandler) {
        // Category tabs için unified handler
        const categoryTabsContainer = badgesModal.querySelector('.category-tabs');
        if (categoryTabsContainer) {
            window.unifiedEventHandler.initCategoryTabs(categoryTabsContainer, function(category, tab, e) {
                showBadgeCategory(category, tab);
            });
        }
        
        // Modal overlay için unified handler (sadece bir kez initialize et)
        if (!badgesModal.hasAttribute('data-unified-events-initialized')) {
            badgesModal.setAttribute('data-unified-events-initialized', 'true');
            
            window.unifiedEventHandler.init(badgesModal, {
                onTap: (e, target) => {
                    // X butonuna tıklanmışsa ignore et
                    if (target && target.closest('button[onclick="closeBadgesModal()"]')) {
                        return;
                    }
                    
                    // Category tab'a tıklanmışsa ignore et (zaten category tabs handler'ı var)
                    if (target && (target.classList.contains('category-tab') || target.closest('.category-tab'))) {
                        return;
                    }
                    
                    // Category tabs container'ına tıklanmışsa ignore et
                    if (target && target.closest('.category-tabs')) {
                        return;
                    }
                    
                    // Scroll edilebilir içerik alanına veya içindeki herhangi bir elemente tıklanmışsa ignore et
                    if (target && badgesScrollableContent && (
                        target === badgesScrollableContent || 
                        target.id === 'badgesScrollableContent' || 
                        badgesScrollableContent.contains(target)
                    )) {
                        return;
                    }
                    
                    // Badge kartlarına tıklanmışsa ignore et
                    if (target && (target.classList.contains('badge-card') || target.closest('.badge-card'))) {
                        return;
                    }
                    
                    // Modal içeriğine tıklanmışsa ignore et
                    if (target && target.closest('.modal-content')) {
                        return;
                    }
                    
                    // Sadece modal overlay'e (arka plana) tap yapıldı, kapat
                    closeBadgesModal();
                },
                ignoreSelectors: [
                    'button[onclick="closeBadgesModal()"]',
                    '.category-tab',
                    '.category-tabs',
                    '#badgesScrollableContent',
                    '.badge-card',
                    '.modal-content'
                ],
                scrollableContent: badgesScrollableContent
            });
        }
    } else {
        // Fallback: Eğer unifiedEventHandler yüklenmemişse eventManager kullanan sistemi kullan
        log.warn('⚠️ UnifiedEventHandler yüklenmemiş, fallback sistemi (eventManager) kullanılıyor');
        
        // Önce eski listener'ları temizle
        if (badgesModal.hasAttribute('data-fallback-events-initialized')) {
            eventManager.cleanup(badgesModal);
            const categoryTabsContainer = badgesModal.querySelector('.category-tabs');
            if (categoryTabsContainer) {
                eventManager.cleanup(categoryTabsContainer);
            }
            log.debug('🔄 Badges Modal: Eski fallback listener\'lar temizlendi');
        }
        badgesModal.setAttribute('data-fallback-events-initialized', 'true');
        
        // Category tab event listener'larını ekle
        const categoryTabsContainer = badgesModal.querySelector('.category-tabs');
        if (categoryTabsContainer) {
            eventManager.add(categoryTabsContainer, 'click', function(e) {
                const tab = e.target.closest('.category-tab');
                if (tab) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    const category = tab.getAttribute('data-category');
                    if (category) {
                        showBadgeCategory(category, tab);
                    }
                    return false;
                }
            }, { capture: true });
            
            eventManager.add(categoryTabsContainer, 'touchend', function(e) {
                const tab = e.target.closest('.category-tab');
                if (tab) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    const category = tab.getAttribute('data-category');
                    if (category) {
                        showBadgeCategory(category, tab);
                    }
                    return false;
                }
            }, { passive: false, capture: true });
        }
    }
}

// Her yere tıklayınca kapatma fonksiyonu (Panel üzerine de tıklanınca kapanır)
function handleBadgesModalClick(event) {
    // X butonuna tıklanırsa kapatma (zaten kendi handler'ı var)
    const target = event.target;
    if (target && target.closest('button[onclick="closeBadgesModal()"]')) {
        return;
    }
    
    // Category tab butonlarına tıklanırsa, kapatma (zaten kendi handler'ı var)
    if (target && (target.classList.contains('category-tab') || target.closest('.category-tab'))) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
    }
    
    // Category tabs container'ına tıklanırsa
    if (target && target.closest('.category-tabs')) {
        return;
    }
    
    // Modal içeriğine (modal-content) tıklanırsa, kapatma (sadece arka plana tıklanınca kapat)
    if (target && (target.closest('.modal-content'))) {
        return;
    }
    
    // Scroll edilebilir içerik alanına tıklanırsa, scroll kontrolü yap
    if (target && (target.id === 'badgesScrollableContent' || target.closest('#badgesScrollableContent'))) {
        // Scroll yapıldıysa veya scroll edilebilir içerik alanına tıklanırsa, kapatma
        return;
    }
    
    // Badge kartlarına tıklanırsa, kapatma
    if (target && (target.classList.contains('badge-card') || target.closest('.badge-card'))) {
        return;
    }
    
    // Sadece modal overlay'e (arka plana) tıklanırsa kapat
    closeBadgesModal();
}

function showXPInfoModal() {
    const modal = document.getElementById('xpInfoModal');
    if (modal) {
        modal.style.display = 'flex';
        // Touch event'leri başlat
        initXPInfoModalTouchEvents();
    }
}

function closeXPInfoModal() {
    const modal = document.getElementById('xpInfoModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Global olarak erişilebilir yap
window.closeXPInfoModal = closeXPInfoModal;
window.showXPInfoModal = showXPInfoModal;

// XP Info Modal için unified event handler sistemi
function initXPInfoModalTouchEvents() {
    const xpInfoModal = document.getElementById('xpInfoModal');
    const xpInfoScrollableContent = document.getElementById('xpInfoScrollableContent');
    if (!xpInfoModal) return;
    
    // Unified event handler kullan
    if (window.unifiedEventHandler) {
        if (!xpInfoModal.hasAttribute('data-unified-events-initialized')) {
            xpInfoModal.setAttribute('data-unified-events-initialized', 'true');
            
            window.unifiedEventHandler.init(xpInfoModal, {
                onTap: (e, target) => {
                    // X butonuna tıklanmışsa ignore et
                    if (target && (target.id === 'closeXPInfoBtn' || target.closest('#closeXPInfoBtn'))) {
                        return;
                    }
                    
                    // Scroll edilebilir içerik alanına tıklanmışsa ignore et
                    if (target && (target.id === 'xpInfoScrollableContent' || target.closest('#xpInfoScrollableContent'))) {
                        return;
                    }
                    
                    // Modal içeriğine tıklanmışsa ignore et
                    if (target && target.closest('.modal-content')) {
                        return;
                    }
                    
                    // Sadece modal overlay'e (arka plana) tap yapıldı, kapat
                    closeXPInfoModal();
                },
                ignoreSelectors: [
                    '#closeXPInfoBtn',
                    '#xpInfoScrollableContent',
                    '.modal-content'
                ],
                scrollableContent: xpInfoScrollableContent
            });
        }
    } else {
        // Fallback: Eğer unifiedEventHandler yüklenmemişse eski sistemi kullan
        log.warn('⚠️ UnifiedEventHandler yüklenmemiş, fallback sistemi kullanılıyor (xpInfoModal)');
        
        if (xpInfoModal.hasAttribute('data-touch-events-initialized')) return;
        xpInfoModal.setAttribute('data-touch-events-initialized', 'true');
        
        let xpInfoModalTouchStart = { x: 0, y: 0, time: 0 };
        let xpInfoModalIsScrolling = false;
        
        if (xpInfoScrollableContent) {
            xpInfoScrollableContent.addEventListener('touchstart', function(e) {
                xpInfoModalIsScrolling = false;
            }, { passive: true });
            
            xpInfoScrollableContent.addEventListener('touchmove', function(e) {
                xpInfoModalIsScrolling = true;
            }, { passive: true });
        }
        
        xpInfoModal.addEventListener('touchstart', function(e) {
            if (e.target && (e.target.id === 'xpInfoScrollableContent' || e.target.closest('#xpInfoScrollableContent'))) {
                return;
            }
            
            const touch = e.touches[0];
            xpInfoModalTouchStart = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
            xpInfoModalIsScrolling = false;
        }, { passive: true });
        
        xpInfoModal.addEventListener('touchmove', function(e) {
            if (e.target && (e.target.id === 'xpInfoScrollableContent' || e.target.closest('#xpInfoScrollableContent'))) {
                xpInfoModalIsScrolling = true;
                return;
            }
            
            if (xpInfoModalTouchStart.x !== 0 || xpInfoModalTouchStart.y !== 0) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - xpInfoModalTouchStart.x);
                const deltaY = Math.abs(touch.clientY - xpInfoModalTouchStart.y);
                if (deltaX > 10 || deltaY > 10) {
                    xpInfoModalIsScrolling = true;
                }
            }
        }, { passive: true });
        
        xpInfoModal.addEventListener('touchend', function(e) {
            if (xpInfoModalIsScrolling) {
                xpInfoModalIsScrolling = false;
                xpInfoModalTouchStart = { x: 0, y: 0, time: 0 };
                return;
            }
            
            const touch = e.changedTouches[0];
            const deltaTime = Date.now() - xpInfoModalTouchStart.time;
            const deltaX = Math.abs(touch.clientX - xpInfoModalTouchStart.x);
            const deltaY = Math.abs(touch.clientY - xpInfoModalTouchStart.y);
            
            if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
                if (e.target && (e.target.id === 'xpInfoScrollableContent' || e.target.closest('#xpInfoScrollableContent'))) {
                    return;
                }
                if (e.target && (e.target.id === 'closeXPInfoBtn' || e.target.closest('#closeXPInfoBtn'))) {
                    return;
                }
                if (e.target && e.target.closest('.modal-content')) {
                    return;
                }
                closeXPInfoModal();
            }
            
            xpInfoModalTouchStart = { x: 0, y: 0, time: 0 };
        }, { passive: true });
    }
}

// Her yere tıklayınca kapatma fonksiyonu
function handleXPInfoModalClick(event) {
    const target = event.target;
    if (target && target.closest('button[onclick*="closeXPInfoModal"]')) {
        return;
    }
    if (target && target.closest('.modal-content')) {
        return;
    }
    if (target && (target.id === 'xpInfoScrollableContent' || target.closest('#xpInfoScrollableContent'))) {
        return;
    }
    closeXPInfoModal();
}

// Global olarak erişilebilir yap
window.handleXPInfoModalClick = handleXPInfoModalClick;

// ============ İSTATİSTİKLER SİSTEMİ ============
function showStatsModal() {
    // Önce tüm modalları ve oyun ekranlarını kapat
    closeAllModals();
    if (typeof hideAllGameScreens === 'function') {
        hideAllGameScreens();
    }
    if (typeof hideAllModes === 'function') {
        hideAllModes();
    }
    
    // Synchronization: Wait for DOM updates before opening new modal
    requestAnimationFrame(() => {
        // Bottom nav bar'ı gizle (modal açıkken görünmemeli)
        if (typeof hideBottomNavBar === 'function') {
            hideBottomNavBar();
        }
        
        // Touch event'lerini başlat (eğer henüz başlatılmadıysa)
        initStatsModalTouchEvents();
        
        // Body scroll'u engelle
        document.body.style.overflow = 'hidden';
        
        // Seviye ilerleme barını hesapla
    let currentLevelStart, nextLevelStart;
    const nextLevel = level + 1;
    
    if (level === 1) {
        currentLevelStart = 0;
        nextLevelStart = 1000;
    } else if (level <= 10) {
        const thresholds = [0, 1000, 2500, 5000, 8500, 13000, 19000, 26500, 35500, 46000, 58000];
        currentLevelStart = thresholds[level - 1];
        nextLevelStart = thresholds[level] || (58000 + ((level - 10) * 15000));
    } else {
        // Level 10'dan sonra
        currentLevelStart = 58000 + ((level - 11) * 15000);
        nextLevelStart = 58000 + ((level - 10) * 15000);
    }
    
    const currentLevelPoints = totalPoints - currentLevelStart;
    const levelRequiredPoints = nextLevelStart - currentLevelStart;
    // Division by zero check
    const progressPercentage = levelRequiredPoints > 0 ? Math.max(0, Math.min((currentLevelPoints / levelRequiredPoints) * 100, 100)) : 100;
    const pointsNeeded = Math.max(0, nextLevelStart - totalPoints);
    
    // Seviye bilgilerini güncelle (null check ile)
    const statsCurrentLevelEl = document.getElementById('statsCurrentLevel');
    const statsNextLevelEl = document.getElementById('statsNextLevel');
    const statsLevelProgressEl = document.getElementById('statsLevelProgress');
    const statsLevelPointsNeededEl = document.getElementById('statsLevelPointsNeeded');
    if (statsCurrentLevelEl) statsCurrentLevelEl.textContent = level;
    if (statsNextLevelEl) statsNextLevelEl.textContent = nextLevel;
    if (statsLevelProgressEl) {
        statsLevelProgressEl.style.width = progressPercentage + '%';
        statsLevelProgressEl.setAttribute('aria-valuenow', Math.round(progressPercentage));
    }
    if (statsLevelPointsNeededEl) statsLevelPointsNeededEl.textContent = pointsNeeded.toLocaleString();
    
    // Rozet sayılarını güncelle (null check ile)
    // badges kontrolü
    if (!badges) {
        log.warn('⚠️ badges bulunamadı, varsayılan değerler kullanılıyor');
        badges = { bronze: 0, silver: 0, gold: 0, diamond: 0 };
    }
    
    const statsBronzeEl = document.getElementById('statsBronze');
    const statsSilverEl = document.getElementById('statsSilver');
    const statsGoldEl = document.getElementById('statsGold');
    const statsDiamondEl = document.getElementById('statsDiamond');
    if (statsBronzeEl) statsBronzeEl.textContent = badges.bronze || 0;
    if (statsSilverEl) statsSilverEl.textContent = badges.silver || 0;
    if (statsGoldEl) statsGoldEl.textContent = badges.gold || 0;
    if (statsDiamondEl) statsDiamondEl.textContent = badges.diamond || 0;
    
    // Başarı analizi hesapla (null check ile)
    // dailyTasks ve todayStats kontrolü
    if (!dailyTasks || !dailyTasks.todayStats) {
        log.warn('⚠️ dailyTasks.todayStats bulunamadı, varsayılan değerler kullanılıyor');
        if (!dailyTasks) dailyTasks = {};
        if (!dailyTasks.todayStats) {
            dailyTasks.todayStats = {
                kelimeCevir: 0, dinleBul: 0, boslukDoldur: 0,
                ayetOku: 0, duaOgre: 0, hadisOku: 0,
                toplamDogru: 0, toplamYanlis: 0, toplamPuan: 0,
                perfectStreak: 0, farklıZorluk: new Set()
            };
        }
    }
    
    // streakData kontrolü
    if (!streakData) {
        log.warn('⚠️ streakData bulunamadı, varsayılan değerler kullanılıyor');
        streakData = {
            currentStreak: 0, bestStreak: 0, totalPlayDays: 0,
            todayProgress: 0, dailyGoal: 5
        };
    }
    
    // Toplam deneme sayısı = Doğru + Yanlış
    const totalAttempts = (dailyTasks.todayStats.toplamDogru || 0) + (dailyTasks.todayStats.toplamYanlis || 0);
    
    // Başarı oranı: Bugünkü toplam doğru cevap / Bugünkü toplam deneme sayısı
    const successRate = totalAttempts > 0 ? Math.round((dailyTasks.todayStats.toplamDogru / totalAttempts) * 100) : 0;
    const avgPointsPerDay = streakData.totalPlayDays > 0 ? Math.round(totalPoints / streakData.totalPlayDays) : totalPoints;
    const playConsistency = typeof getDaysFromFirstPlay === 'function' 
        ? Math.round((streakData.totalPlayDays / Math.max(1, getDaysFromFirstPlay())) * 100)
        : 0;
    const levelProgressPercent = Math.round(progressPercentage);
    
    // Başarı analizi güncelle (null check ile)
    const statsSuccessRateEl = document.getElementById('statsSuccessRate');
    const statsAvgPointsPerDayEl = document.getElementById('statsAvgPointsPerDay');
    const statsPlayConsistencyEl = document.getElementById('statsPlayConsistency');
    const statsLevelProgressTextEl = document.getElementById('statsLevelProgressText');
    if (statsSuccessRateEl) statsSuccessRateEl.textContent = successRate + '%';
    if (statsAvgPointsPerDayEl) statsAvgPointsPerDayEl.textContent = avgPointsPerDay.toLocaleString();
    if (statsPlayConsistencyEl) statsPlayConsistencyEl.textContent = Math.min(100, playConsistency) + '%';
    if (statsLevelProgressTextEl) statsLevelProgressTextEl.textContent = levelProgressPercent + '%';
    
    // Streak bilgilerini güncelle (null check ile)
    const statsCurrentStreakEl = document.getElementById('statsCurrentStreak');
    const statsBestStreakEl = document.getElementById('statsBestStreak');
    const statsTotalDaysEl = document.getElementById('statsTotalDays');
    const statsTodayProgressEl = document.getElementById('statsTodayProgress');
    if (statsCurrentStreakEl) statsCurrentStreakEl.textContent = streakData.currentStreak || 0;
    if (statsBestStreakEl) statsBestStreakEl.textContent = streakData.bestStreak || 0;
    if (statsTotalDaysEl) statsTotalDaysEl.textContent = streakData.totalPlayDays || 0;
    if (statsTodayProgressEl) {
        const todayProgress = streakData.todayProgress || 0;
        const dailyGoal = streakData.dailyGoal || 5;
        statsTodayProgressEl.textContent = Math.min(todayProgress, dailyGoal) + '/' + dailyGoal;
    }
    
    // Bugünkü oyun türü istatistikleri (null check ile)
    const statsKelimeCevirEl = document.getElementById('statsKelimeCevir');
    const statsDinleBulEl = document.getElementById('statsDinleBul');
    const statsBoslukDoldurEl = document.getElementById('statsBoslukDoldur');
    const statsAyetOkuEl = document.getElementById('statsAyetOku');
    const statsDuaOgreEl = document.getElementById('statsDuaOgre');
    const statsHadisOkuEl = document.getElementById('statsHadisOku');
    if (statsKelimeCevirEl) statsKelimeCevirEl.textContent = dailyTasks.todayStats.kelimeCevir || 0;
    if (statsDinleBulEl) statsDinleBulEl.textContent = dailyTasks.todayStats.dinleBul || 0;
    if (statsBoslukDoldurEl) statsBoslukDoldurEl.textContent = dailyTasks.todayStats.boslukDoldur || 0;
    if (statsAyetOkuEl) statsAyetOkuEl.textContent = dailyTasks.todayStats.ayetOku || 0;
    if (statsDuaOgreEl) statsDuaOgreEl.textContent = dailyTasks.todayStats.duaOgre || 0;
    if (statsHadisOkuEl) statsHadisOkuEl.textContent = dailyTasks.todayStats.hadisOku || 0;
    
    // Bugünkü performans (null check ile)
    const statsTodayCorrectEl = document.getElementById('statsTodayCorrect');
    const statsTodayPointsEl = document.getElementById('statsTodayPoints');
    const statsPerfectStreakEl = document.getElementById('statsPerfectStreak');
    const statsDifficultyCountEl = document.getElementById('statsDifficultyCount');
    if (statsTodayCorrectEl) statsTodayCorrectEl.textContent = dailyTasks.todayStats.toplamDogru || 0;
    if (statsTodayPointsEl) statsTodayPointsEl.textContent = dailyTasks.todayStats.toplamPuan || 0;
    if (statsPerfectStreakEl) statsPerfectStreakEl.textContent = dailyTasks.todayStats.perfectStreak || 0;
    if (statsDifficultyCountEl) {
        const farkliZorluk = dailyTasks.todayStats.farklıZorluk;
        if (farkliZorluk && typeof farkliZorluk.size === 'number') {
            statsDifficultyCountEl.textContent = farkliZorluk.size;
        } else {
            statsDifficultyCountEl.textContent = 0;
        }
    }
    
        // Modal'ı göster (null check ile)
        const statsModal = document.getElementById('statsModal');
        if (statsModal) {
            statsModal.style.display = 'flex';
            // Force reflow to ensure modal is visible
            statsModal.offsetHeight;
        }
        
        // Kelime istatistiklerini güncelle (artık tek sayfa olduğu için her zaman göster)
        if (typeof updateWordStatistics === 'function') {
            updateWordStatistics();
        }
        
        // ============ DETAYLI ANALİTİK VERİLERİNİ GÜNCELLE ============
        updateAnalyticsData();
        
        // ============ LİDERLİK TABLOSU VERİLERİNİ GÜNCELLE ============
        updateLeaderboard();
        
        log.debug('📊 İstatistikler modalı açıldı');
    });
}

// ============ DETAYLI ANALİTİK VERİLERİNİ GÜNCELLE ============
function updateAnalyticsData() {
    // Zaman analizi
    const todayTotalQuestions = (dailyTasks.todayStats.toplamDogru || 0) + (dailyTasks.todayStats.toplamYanlis || 0);
    // Ortalama bir soru ~10 saniye sürer (kelime çevir için)
    const todayMinutes = Math.round((todayTotalQuestions * 10) / 60);
    const questionsPerHour = todayMinutes > 0 ? Math.round((todayTotalQuestions / todayMinutes) * 60) : 0;
    
    const analyticsTodayTime = document.getElementById('analyticsTodayTime');
    const analyticsQuestionPerHour = document.getElementById('analyticsQuestionPerHour');
    if (analyticsTodayTime) analyticsTodayTime.textContent = todayMinutes + ' dk';
    if (analyticsQuestionPerHour) analyticsQuestionPerHour.textContent = questionsPerHour;
    
    // Günlük hedef durumu
    const dailyGoalHasene = parseInt(localStorage.getItem('dailyGoalHasene') || '2700');
    const todayProgress = dailyTasks.todayStats.toplamPuan || 0;
    const goalProgressPercent = dailyGoalHasene > 0 ? Math.min(100, Math.round((todayProgress / dailyGoalHasene) * 100)) : 0;
    
    const analyticsDailyGoal = document.getElementById('analyticsDailyGoal');
    const analyticsTodayProgress = document.getElementById('analyticsTodayProgress');
    const analyticsDailyGoalTotal = document.getElementById('analyticsDailyGoalTotal');
    const analyticsGoalProgressBar = document.getElementById('analyticsGoalProgressBar');
    const analyticsTimeToGoal = document.getElementById('analyticsTimeToGoal');
    
    if (analyticsDailyGoal) analyticsDailyGoal.textContent = dailyGoalHasene.toLocaleString();
    if (analyticsTodayProgress) analyticsTodayProgress.textContent = todayProgress.toLocaleString();
    if (analyticsDailyGoalTotal) analyticsDailyGoalTotal.textContent = dailyGoalHasene.toLocaleString();
    if (analyticsGoalProgressBar) analyticsGoalProgressBar.style.width = goalProgressPercent + '%';
    
    // Hedef için tahmini süre hesapla
    if (analyticsTimeToGoal) {
        const remainingPoints = Math.max(0, dailyGoalHasene - todayProgress);
        if (remainingPoints === 0) {
            analyticsTimeToGoal.textContent = '🎉 Hedef tamamlandı!';
        } else if (questionsPerHour > 0 && todayProgress > 0) {
            // Ortalama puan/soru: bugünkü puan / bugünkü soru sayısı
            const avgPointsPerQuestion = todayTotalQuestions > 0 ? todayProgress / todayTotalQuestions : 20;
            const remainingQuestions = Math.ceil(remainingPoints / avgPointsPerQuestion);
            const estimatedMinutes = Math.ceil((remainingQuestions * 10) / 60);
            
            if (estimatedMinutes < 60) {
                analyticsTimeToGoal.textContent = `Tahmini: ${estimatedMinutes} dakika kaldı`;
            } else {
                const hours = Math.floor(estimatedMinutes / 60);
                const mins = estimatedMinutes % 60;
                analyticsTimeToGoal.textContent = `Tahmini: ${hours} saat ${mins} dakika kaldı`;
            }
        } else {
            analyticsTimeToGoal.textContent = 'Ders talebe ederek başla!';
        }
    }
    
    // Kelime performansı
    const wordStats = loadWordStats();
    const wordStatsArray = Object.values(wordStats);
    
    if (wordStatsArray.length > 0) {
        // Ortalama başarı oranı
        const totalSuccessRate = wordStatsArray.reduce((sum, stat) => sum + (stat.successRate || 0), 0);
        const avgSuccessRate = wordStatsArray.length > 0 ? Math.round((totalSuccessRate / wordStatsArray.length) * 100) : 0;
        
        // En zor kelime (en düşük başarı oranı ve en çok deneme)
        const hardestWord = wordStatsArray
            .filter(s => s.attempts > 0)
            .sort((a, b) => {
                const scoreA = (a.successRate || 0) * (a.attempts || 1);
                const scoreB = (b.successRate || 0) * (b.attempts || 1);
                return scoreA - scoreB; // En düşük skor en zor
            })[0];
        
        const analyticsAvgSuccess = document.getElementById('analyticsAvgSuccess');
        const analyticsHardestWord = document.getElementById('analyticsHardestWord');
        
        if (analyticsAvgSuccess) analyticsAvgSuccess.textContent = '%' + avgSuccessRate;
        if (analyticsHardestWord && hardestWord) {
            // Kelime verisini bul (null kontrolü ile)
            if (kelimeBulData && Array.isArray(kelimeBulData)) {
                const wordData = kelimeBulData.find(w => w.id === hardestWord.wordId);
                if (wordData) {
                    analyticsHardestWord.textContent = wordData.kelime || '-';
                } else {
                    analyticsHardestWord.textContent = '-';
                }
            } else {
                analyticsHardestWord.textContent = '-';
            }
        }
    }
    
    // Öğrenme haritası
    const masteredWords = wordStatsArray.filter(s => s.masteryLevel >= 3.0 && s.successRate >= 0.6).length;
    const practiceWords = wordStatsArray.filter(s => s.masteryLevel >= 1.5 && s.masteryLevel < 3.0 && s.successRate >= 0.5).length;
    const strugglingWords = wordStatsArray.filter(s => s.successRate < 0.6 || s.masteryLevel < 1.0).length;
    
    const analyticsLearnedCount = document.getElementById('analyticsLearnedCount');
    const analyticsPracticeCount = document.getElementById('analyticsPracticeCount');
    const analyticsStrugglingCount = document.getElementById('analyticsStrugglingCount');
    
    if (analyticsLearnedCount) analyticsLearnedCount.textContent = masteredWords;
    if (analyticsPracticeCount) analyticsPracticeCount.textContent = practiceWords;
    if (analyticsStrugglingCount) analyticsStrugglingCount.textContent = strugglingWords;
}

// ============ LİDERLİK TABLOSU SİSTEMİ ============
// Liderlik tablosu verisini yükle
function loadLeaderboard() {
    try {
        const data = localStorage.getItem('haseneLeaderboard');
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        log.error('Liderlik tablosu yükleme hatası:', error);
    }
    return [];
}

// Liderlik tablosu verisini kaydet
function saveLeaderboard(leaderboard) {
    try {
        // Maksimum 100 kayıt tut
        const sorted = leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 100);
        localStorage.setItem('haseneLeaderboard', JSON.stringify(sorted));
        return sorted;
    } catch (error) {
        log.error('Liderlik tablosu kaydetme hatası:', error);
        return leaderboard;
    }
}

// Liderlik tablosuna kullanıcı ekle/güncelle
function updateLeaderboardEntry(userName, score) {
    const leaderboard = loadLeaderboard();
    const now = new Date().toISOString();
    
    // Kullanıcı adını localStorage'dan al veya varsayılan kullan
    const defaultName = userName || 'Kullanıcı';
    
    // Mevcut kullanıcıyı bul
    let userIndex = leaderboard.findIndex(entry => entry.name === defaultName);
    
    if (userIndex >= 0) {
        // Güncelle
        if (score > leaderboard[userIndex].score) {
            leaderboard[userIndex].score = score;
            leaderboard[userIndex].updatedAt = now;
        }
    } else {
        // Yeni ekle
        leaderboard.push({
            name: defaultName,
            score: score,
            createdAt: now,
            updatedAt: now
        });
    }
    
    return saveLeaderboard(leaderboard);
}

// Liderlik tablosunu güncelle ve göster
function updateLeaderboard() {
    // Önce mevcut kullanıcıyı güncelle
    const userName = localStorage.getItem('haseneUserName') || 'Kullanıcı';
    updateLeaderboardEntry(userName, totalPoints);
    
    // Liderlik tablosunu yükle
    const leaderboard = loadLeaderboard();
    const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);
    
    // Kullanıcının sıralamasını bul
    const userIndex = sortedLeaderboard.findIndex(entry => entry.name === userName);
    const userRank = userIndex >= 0 ? userIndex + 1 : '-';
    const userScore = totalPoints;
    
    // Kullanıcı bilgilerini güncelle
    const leaderboardYourRank = document.getElementById('leaderboardYourRank');
    const leaderboardYourScore = document.getElementById('leaderboardYourScore');
    
    if (leaderboardYourRank) {
        if (userRank === 1) {
            leaderboardYourRank.textContent = '🥇 ' + userRank;
        } else if (userRank === 2) {
            leaderboardYourRank.textContent = '🥈 ' + userRank;
        } else if (userRank === 3) {
            leaderboardYourRank.textContent = '🥉 ' + userRank;
        } else {
            leaderboardYourRank.textContent = '#' + userRank;
        }
    }
    if (leaderboardYourScore) {
        leaderboardYourScore.textContent = 'Hasene: ' + userScore.toLocaleString();
    }
    
    // Liderlik listesini göster
    const leaderboardList = document.getElementById('leaderboardList');
    if (leaderboardList) {
        if (sortedLeaderboard.length === 0) {
            leaderboardList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666; font-size: 0.9em;">
                    Henüz liderlik tablosu verisi yok. Ders talebe ederek sıralamaya katıl!
                </div>
            `;
        } else {
            leaderboardList.innerHTML = sortedLeaderboard.slice(0, 10).map((entry, index) => {
                const rank = index + 1;
                const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
                const isCurrentUser = entry.name === userName;
                
                return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; margin-bottom: 8px; background: ${isCurrentUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'}; border-radius: 8px; border: ${isCurrentUser ? '2px solid #667eea' : '1px solid #e0e0e0'};">
                        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                            <div style="font-size: 1.2em; font-weight: bold; color: ${isCurrentUser ? 'white' : '#667eea'}; min-width: 40px; text-align: center;">
                                ${rankEmoji || '#' + rank}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: ${isCurrentUser ? 'bold' : '600'}; color: ${isCurrentUser ? 'white' : '#333'}; font-size: 0.9em;">
                                    ${sanitizeHTML(entry.name)}${isCurrentUser ? ' (Sen)' : ''}
                                </div>
                                <div style="font-size: 0.75em; color: ${isCurrentUser ? 'rgba(255,255,255,0.9)' : '#666'}; margin-top: 2px;">
                                    ${new Date(entry.updatedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                </div>
                            </div>
                        </div>
                        <div style="font-size: 1.1em; font-weight: bold; color: ${isCurrentUser ? 'white' : '#667eea'};">
                            ${entry.score.toLocaleString()}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

function getDaysFromFirstPlay() {
    if (streakData.playDates.length === 0) return 1;
    
    const firstPlayDate = new Date(streakData.playDates[0]);
    const today = new Date();
    const diffTime = Math.abs(today - firstPlayDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
}

function closeStatsModal() {
    const modal = document.getElementById('statsModal');
    if (modal) {
        // Event listener'ları temizle (memory leak prevention)
        const scrollableContent = document.getElementById('statsScrollableContent');
        eventManager.cleanupMultiple([modal, scrollableContent].filter(Boolean));
        
        modal.style.display = 'none';
        modal.style.zIndex = '';
        // Body scroll'u tekrar aktif et
        document.body.style.overflow = '';
        
        // Bottom nav bar'ı tekrar göster (modal kapandığında)
        if (typeof showBottomNavBar === 'function') {
            showBottomNavBar();
        }
        
        // Tüm oyun ekranlarını ve modlarını gizle
        if (typeof hideAllGameScreens === 'function') {
            hideAllGameScreens();
        }
        if (typeof hideAllModes === 'function') {
            hideAllModes();
        } else {
            // Fallback: Manuel olarak modları gizle
            const modeIds = ['gameScreen', 'modeSelector', 'ayetMode', 'duaMode', 'hadisMode', 'boslukMode', 'dinleMode'];
            modeIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.display = 'none';
                    el.style.zIndex = '';
                }
            });
        }
        
        // Ana sayfanın görünür olduğundan emin ol
        if (elements && elements.mainMenu) {
            elements.mainMenu.style.display = 'block';
        }
        
        log.debug('🔒 Stats Modal kapatıldı ve temizlendi');
    }
}

// Her yere tıklayınca kapatma fonksiyonu (Panel üzerine de tıklanınca kapanır)
// Touch event tracking for scroll detection
let statsModalTouchStart = { x: 0, y: 0, time: 0 };
let statsModalIsScrolling = false;

// Stats modal için touch event'leri - DOMContentLoaded içinde ekleniyor
function initStatsModalTouchEvents() {
    const statsModal = document.getElementById('statsModal');
    const statsScrollableContent = document.getElementById('statsScrollableContent');
    if (!statsModal) return;
    
    // Eğer zaten eklenmişse, önce temizle
    if (statsModal.hasAttribute('data-touch-events-initialized')) {
        eventManager.cleanupMultiple([statsModal, statsScrollableContent].filter(Boolean));
        log.debug('🔄 Stats Modal: Eski listener\'lar temizlendi, yeni eklenecek');
    }
    statsModal.setAttribute('data-touch-events-initialized', 'true');
    
    // Scroll edilebilir içerik alanında scroll algılama
    if (statsScrollableContent) {
        eventManager.add(statsScrollableContent, 'touchstart', function(e) {
            statsModalIsScrolling = false;
        }, { passive: true });
        
        eventManager.add(statsScrollableContent, 'touchmove', function(e) {
            // Scroll edilebilir içerik alanında hareket varsa, bu bir scroll'dur
            statsModalIsScrolling = true;
        }, { passive: true });
    }
    
    // Modal overlay için touch event'leri
    eventManager.add(statsModal, 'touchstart', function(e) {
        // Eğer scroll edilebilir içerik alanına veya içindeki herhangi bir elemente tıklanmışsa, ignore et
        const target = e.target;
        if (target && statsScrollableContent && (
            target === statsScrollableContent || 
            target.id === 'statsScrollableContent' || 
            statsScrollableContent.contains(target)
        )) {
            return;
        }
        
        const touch = e.touches[0];
        statsModalTouchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
        statsModalIsScrolling = false;
    }, { passive: true });
    
    eventManager.add(statsModal, 'touchmove', function(e) {
        // Eğer scroll edilebilir içerik alanında veya içindeki herhangi bir elementte hareket varsa, bu bir scroll'dur
        const target = e.target;
        if (target && statsScrollableContent && (
            target === statsScrollableContent || 
            target.id === 'statsScrollableContent' || 
            statsScrollableContent.contains(target)
        )) {
            statsModalIsScrolling = true;
            return;
        }
        
        if (statsModalTouchStart.x !== 0 || statsModalTouchStart.y !== 0) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - statsModalTouchStart.x);
            const deltaY = Math.abs(touch.clientY - statsModalTouchStart.y);
            // Eğer 10px'den fazla hareket varsa, bu bir scroll'dur
            if (deltaX > 10 || deltaY > 10) {
                statsModalIsScrolling = true;
            }
        }
    }, { passive: true });
    
    eventManager.add(statsModal, 'touchend', function(e) {
        // Eğer scroll edilebilir içerik alanına veya içindeki herhangi bir elemente dokunulmuşsa, ignore et
        const target = e.target;
        if (target && statsScrollableContent && (
            target === statsScrollableContent || 
            target.id === 'statsScrollableContent' || 
            statsScrollableContent.contains(target)
        )) {
            statsModalIsScrolling = false;
            statsModalTouchStart = { x: 0, y: 0, time: 0 };
            return;
        }
        
        // Touch end'de scroll kontrolü yap
        if (statsModalIsScrolling) {
            // Scroll oldu, kapatma
            statsModalIsScrolling = false;
            statsModalTouchStart = { x: 0, y: 0, time: 0 };
            return;
        }
        
        // Scroll değilse, normal click gibi davran
        const touch = e.changedTouches[0];
        const deltaTime = Date.now() - statsModalTouchStart.time;
        const deltaX = Math.abs(touch.clientX - statsModalTouchStart.x);
        const deltaY = Math.abs(touch.clientY - statsModalTouchStart.y);
        
        // Kısa süre (300ms) ve küçük hareket (10px) = tap
        if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
            // X butonuna tıklanmışsa ignore et
            if (target && (target.id === 'closeStatsBtn' || target.closest('#closeStatsBtn'))) {
                statsModalTouchStart = { x: 0, y: 0, time: 0 };
                return;
            }
            
            // Panel üzerine veya dış arka plana tap yapıldı, kapat
            closeStatsModal();
        }
        
        statsModalTouchStart = { x: 0, y: 0, time: 0 };
    }, { passive: true });
}

function handleStatsModalClick(event) {
    // X butonuna tıklanırsa kapatma (zaten kendi handler'ı var)
    const target = event.target;
    if (target && (target.id === 'closeStatsBtn' || target.closest('#closeStatsBtn'))) {
        return;
    }
    
    // Detaylı butonuna tıklanırsa kapatma (mobil için özel kontrol)
    if (target && (target.id === 'detailedStatsBtn' || target.closest('#detailedStatsBtn'))) {
        return;
    }
    
    // Filtre butonlarına tıklanırsa paneli kapatma
    if (target && (
        target.id === 'filterAll' || 
        target.id === 'filterMastered' || 
        target.id === 'filterStruggling' || 
        target.id === 'filterRecent' ||
        target.closest('#filterAll') ||
        target.closest('#filterMastered') ||
        target.closest('#filterStruggling') ||
        target.closest('#filterRecent')
    )) {
        // Filtre butonlarının kendi onclick handler'ları çalışsın
        return;
    }
    
    // Modal içeriğine (modal-content) tıklanırsa, kapatma (sadece arka plana tıklanınca kapat)
    if (target && (target.closest('.modal-content'))) {
        return;
    }
    
    // Scroll edilebilir içerik alanına tıklanırsa, scroll kontrolü yap
    if (target && (target.id === 'statsScrollableContent' || target.closest('#statsScrollableContent'))) {
        // Scroll yapıldıysa veya scroll edilebilir içerik alanına tıklanırsa, kapatma
        return;
    }
    
    // Sadece modal overlay'e (arka plana) tıklanırsa kapat
    closeStatsModal();
}

function confirmResetStats() {
    const confirmed = confirm('🚨 DİKKAT!\n\nTüm ders verilerini sıfırlamak istediğinden emin misin?\n\n• Tüm puanlar (0\'a döner)\n• Tüm nişanlar (silinir)\n• Tüm muvaffakiyetler (sıfırlanır)\n• Muvaffakiyet terakki barları (0%\'a döner)\n• Mertebe nişanları (Mütebahhir, Mütecaviz, Müterakki, Mübtedi - sıfırlanır)\n• Tüm streak verileri (sıfırlanır)\n• Tüm günlük vazifeler (yenilenir)\n• Tüm istatistikler (temizlenir)\n• İstatistikler paneli tüm alanları (sıfırlanır)\n• KELİME PANELİ istatistikleri (sıfırlanır)\n• GÜNLÜK VİRD XP (0\'a döner)\n• Muvaffakiyetler modal istatistikleri (sıfırlanır)\n• Takvim modal streak bilgisi (sıfırlanır)\n\nBu işlem GERİ ALINMAZ!\n\nDevam etmek istiyor musun?');
    
    if (confirmed) {
        // İkinci onay
        const doubleConfirmed = confirm('🔥 SON UYARI!\n\nGerçekten TÜM VERİLERİ sıfırlamak istiyor musun?\n\nBu işlemden sonra oyuna sıfırdan başlayacaksın!\n\n✅ EVET = Sıfırla\n❌ HAYIR = İptal et');
        
        if (doubleConfirmed) {
            closeStatsModal(); // Modal'ı kapat
            resetAllStats(); // Mevcut fonksiyonu kullan
        }
    }
}

// Global fonksiyonlar (window'a ekle)
window.showStatsModal = showStatsModal;
window.closeStatsModal = closeStatsModal;
window.handleStatsModalClick = handleStatsModalClick;
window.handleCalendarModalClick = handleCalendarModalClick;
window.handleBadgesModalClick = handleBadgesModalClick;
window.handleDailyTasksModalClick = handleDailyTasksModalClick;
window.confirmResetStats = confirmResetStats;
window.showBadgeCategory = showBadgeCategory;
window.showBadgesModal = showBadgesModal;
window.closeBadgesModal = closeBadgesModal;

// ============ ONBOARDING/TUTORIAL SİSTEMİ ============
let currentOnboardingSlide = 1;
const totalOnboardingSlides = 6;

function showOnboarding() {
    const onboardingModal = document.getElementById('onboardingModal');
    if (onboardingModal) {
        onboardingModal.style.display = 'flex';
        currentOnboardingSlide = 1;
        updateOnboardingSlide();
    }
}

function closeOnboarding() {
    const onboardingModal = document.getElementById('onboardingModal');
    if (onboardingModal) {
        onboardingModal.style.display = 'none';
        // İlk açılış işaretini kaydet
        localStorage.setItem('hasSeenOnboarding', 'true');
        // Ana menüyü göster
        const mainContainer = document.getElementById('mainMenu');
        if (mainContainer) {
            mainContainer.style.display = 'block';
        }
    }
}

function nextOnboardingSlide() {
    if (currentOnboardingSlide < totalOnboardingSlides) {
        currentOnboardingSlide++;
        updateOnboardingSlide();
    } else {
        // Son slide'da "Başla" butonu göster
        closeOnboarding();
    }
}

function prevOnboardingSlide() {
    if (currentOnboardingSlide > 1) {
        currentOnboardingSlide--;
        updateOnboardingSlide();
    }
}

function skipOnboarding() {
    closeOnboarding();
}

function updateOnboardingSlide() {
    // Tüm slide'ları gizle
    const slides = document.querySelectorAll('.onboarding-slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Aktif slide'ı göster
    const activeSlide = document.querySelector(`.onboarding-slide[data-slide="${currentOnboardingSlide}"]`);
    if (activeSlide) {
        activeSlide.classList.add('active');
    }
    
    // İlerleme barını güncelle
    const progressBar = document.getElementById('onboardingProgressBar');
    const progressText = document.getElementById('onboardingProgressText');
    const nextBtn = document.getElementById('onboardingNextBtn');
    const skipBtn = document.getElementById('onboardingSkipBtn');
    
    if (progressBar) {
        // Division by zero check (defensive programming)
        const progress = totalOnboardingSlides > 0 ? (currentOnboardingSlide / totalOnboardingSlides) * 100 : 0;
        progressBar.style.width = progress + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${currentOnboardingSlide} / ${totalOnboardingSlides}`;
    }
    
    // Butonların görünür olduğundan emin ol
    if (nextBtn) {
        nextBtn.style.display = 'block';
        nextBtn.style.visibility = 'visible';
        nextBtn.style.opacity = '1';
        if (currentOnboardingSlide === totalOnboardingSlides) {
            nextBtn.textContent = 'Başla! 🚀';
        } else {
            nextBtn.textContent = 'İleri →';
        }
    }
    
    if (skipBtn) {
        skipBtn.style.display = 'block';
        skipBtn.style.visibility = 'visible';
        skipBtn.style.opacity = '1';
    }
}

// Global fonksiyonlar
window.showOnboarding = showOnboarding;
window.closeOnboarding = closeOnboarding;
window.nextOnboardingSlide = nextOnboardingSlide;
window.prevOnboardingSlide = prevOnboardingSlide;
window.skipOnboarding = skipOnboarding;

// ============ TAKVİM SİSTEMİ ============
function checkDailyProgress() {
    const today = getLocalDateString(); // Yerel tarih (YYYY-MM-DD)
    
    // Eğer bugün ilk defa açılıyorsa
    if (streakData.todayDate !== today) {
        log.debug(`🕐 Gün değişikliği algılandı: ${streakData.todayDate} → ${today}`);
        
        // Gelişmiş streak kontrolü
        const streakValidation = validateCurrentStreak(today);
        if (!streakValidation.isValid) {
            log.debug(`🔴 Streak tutarsızlığı: ${streakValidation.reason}`);
            streakData.currentStreak = streakValidation.correctStreak;
        }
        
        // Bugünün verilerini sıfırla
        streakData.todayDate = today;
        streakData.todayProgress = 0;
        
        log.debug(`📅 Yeni gün başladı: ${today}, mevcut streak: ${streakData.currentStreak}`);
    }
}

// 🔍 Streak doğruluğunu kapsamlı kontrol eden fonksiyon
function validateCurrentStreak(today) {
    if (streakData.playDates.length === 0) {
        return { isValid: true, correctStreak: 0, reason: 'Hiç oyun oynammış' };
    }

    // Tarihleri sırala (en yeniden eskiye)
    const sortedDates = [...streakData.playDates].sort().reverse();
    
    // Bugünden başlayarak geriye doğru ardışık günleri say
    let consecutiveDays = 0;
    let currentDate = today;
    
    for (let i = 0; i < sortedDates.length; i++) {
        if (sortedDates[i] === currentDate) {
            consecutiveDays++;
            // Bir önceki günü hesapla
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);
            currentDate = getLocalDateString(prevDate);
        } else {
            // Ardışık olmayan tarih bulundu, streak burada bitiyor
            break;
        }
    }

    const isValid = consecutiveDays === streakData.currentStreak;
    const reason = isValid ? 'Streak doğru' : 
                  `Hesaplanan: ${consecutiveDays}, kayıtlı: ${streakData.currentStreak}`;

    return { 
        isValid, 
        correctStreak: consecutiveDays, 
        reason: reason
    };
}

// 📅 Mevcut streak'in gerçek tarihlerini hesapla
function calculateCurrentStreakDates() {
    if (streakData.playDates.length === 0 || streakData.currentStreak === 0) {
        return [];
    }

    // Son oyun tarihinden başlayarak geriye doğru ardışık tarihleri bul
    const sortedDates = [...streakData.playDates].sort().reverse();
    const streakDates = [];
    let currentDate = sortedDates[0]; // En son oyun tarihi

    for (let i = 0; i < sortedDates.length && streakDates.length < streakData.currentStreak; i++) {
        if (sortedDates[i] === currentDate) {
            streakDates.push(currentDate);
            // Bir önceki günü hesapla
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);
            currentDate = getLocalDateString(prevDate);
        } else {
            // Ardışık olmayan tarih, streak burada bitiyor
            break;
        }
    }

    log.debug(`🔥 Streak tarihleri hesaplandı: [${streakDates.join(', ')}]`);
    return streakDates;
}

function updateDailyProgress(correctAnswers) {
    const today = getLocalDateString(); // Yerel tarih (YYYY-MM-DD)
    
    // Günlük ilerleme güncelle
    streakData.todayProgress += correctAnswers;
    
    // Takvim açıksa bugünkü hedefi gerçek zamanlı güncelle
    const todayProgressElement = document.getElementById('todayProgress');
    const todayProgressIconElement = document.getElementById('todayProgressIcon');
    
    if (todayProgressElement) {
        const currentProgress = Math.min(streakData.todayProgress, streakData.dailyGoal);
        todayProgressElement.textContent = currentProgress;
        
        // İlerlemeye göre dinamik emoji
        if (todayProgressIconElement) {
            if (currentProgress >= 5) {
                todayProgressIconElement.textContent = '✅'; // Tamamlandı
            } else if (currentProgress >= 3) {
                todayProgressIconElement.textContent = '🔥'; // İyi gidiyor  
            } else if (currentProgress >= 1) {
                todayProgressIconElement.textContent = '💪'; // Başlamış
            } else {
                todayProgressIconElement.textContent = '⏳'; // Henüz başlamamış
            }
        }
    }
    
    // Günlük hedef tamamlandı mı?
    if (streakData.todayProgress >= streakData.dailyGoal && streakData.lastPlayDate !== today) {
        log.debug(`🎯 Günlük hedef tamamlandı! İlerleme: ${streakData.todayProgress}/${streakData.dailyGoal}`);
        
        // İlk defa bugün hedefi tamamladı
        streakData.lastPlayDate = today;
        streakData.totalPlayDays++;
        
        log.debug(`📈 Toplam oyun günü: ${streakData.totalPlayDays}, önceki streak: ${streakData.currentStreak}`);
        
        // Oyun tarihi listesine ekle
        if (!streakData.playDates.includes(today)) {
            streakData.playDates.push(today);
            streakData.playDates.sort();
        }
        
        // Streak güncelle - bugün ilk kez hedefi tamamladı
        if (streakData.currentStreak === 0) {
            // İlk gün veya streak kırılmışsa 1'den başla
            streakData.currentStreak = 1;
        } else {
            // Streak devam ediyorsa artır
            streakData.currentStreak++;
        }
        
        // En iyi streak'i güncelle
        if (streakData.currentStreak > streakData.bestStreak) {
            streakData.bestStreak = streakData.currentStreak;
            log.debug(`🏆 Yeni rekor streak: ${streakData.bestStreak} gün!`);
        }
        
        log.debug(`🔥 Streak güncellendi: ${streakData.currentStreak} gün (en iyi: ${streakData.bestStreak})`);
        
        // Streak doğruluğunu kontrol et
        const validation = validateCurrentStreak(today);
        if (!validation.isValid) {
            log.debug(`⚠️ Streak otomatik düzeltme: ${streakData.currentStreak} → ${validation.correctStreak}`);
            streakData.currentStreak = validation.correctStreak;
        }

        // Veriyi kaydet
        debouncedSaveStats(); // Debounced kaydetme
        
        // Eğer takvim açıksa otomatik yenile (mavi -> yeşil)
        const calendarModal = document.getElementById('calendarModal');
        if (calendarModal && calendarModal.style.display === 'flex') {
            generateWeeklyStreakDisplay();
            generateMonthlyCalendar();
        }
    }
}

function showCalendarModal() {
    // Önce tüm modalları ve oyun ekranlarını kapat
    closeAllModals();
    if (typeof hideAllGameScreens === 'function') {
        hideAllGameScreens();
    }
    if (typeof hideAllModes === 'function') {
        hideAllModes();
    }
    
    // Synchronization: Wait for DOM updates before opening new modal
    requestAnimationFrame(() => {
        // Bottom nav bar'ı gizle (modal açıkken görünmemeli)
        if (typeof hideBottomNavBar === 'function') {
            hideBottomNavBar();
        }
        
        // Body scroll'u engelle
        document.body.style.overflow = 'hidden';
        
        // Haftalık streak gösterimini oluştur
        generateWeeklyStreakDisplay();
        
        // Aylık takvimi oluştur
        generateMonthlyCalendar();
        
        // Touch event'lerini başlat (eğer henüz başlatılmadıysa)
        initCalendarModalTouchEvents();
        
        // Validasyon kontrolü (sadece debug modunda)
        if (typeof log !== 'undefined' && log.debug) {
            // Sessiz validasyon - hataları logla ama kullanıcıya gösterme
            try {
                const todayStr = getLocalDateString();
                const validation = validateCurrentStreak(todayStr);
                if (!validation.isValid) {
                    log.warn('⚠️ Takvim validasyon uyarısı:', validation.reason);
                }
            } catch (e) {
                log.debug('Takvim validasyon hatası (kritik değil):', e);
            }
        }
        
        // Modal'ı göster
        const calendarModal = document.getElementById('calendarModal');
        if (calendarModal) {
            calendarModal.style.display = 'flex';
            // Force reflow to ensure modal is visible
            calendarModal.offsetHeight;
        }
    });
}

function closeCalendarModal() {
    const modal = document.getElementById('calendarModal');
    if (modal) {
        // Event listener'ları temizle (memory leak prevention)
        const scrollableContent = document.getElementById('calendarScrollableContent');
        eventManager.cleanupMultiple([modal, scrollableContent].filter(Boolean));
        
        modal.style.display = 'none';
        modal.style.zIndex = '';
        // Body scroll'u tekrar aktif et
        document.body.style.overflow = '';
        
        // Tüm oyun ekranlarını ve modlarını gizle
        if (typeof hideAllGameScreens === 'function') {
            hideAllGameScreens();
        }
        if (typeof hideAllModes === 'function') {
            hideAllModes();
        } else {
            // Fallback: Manuel olarak modları gizle
            const modeIds = ['gameScreen', 'modeSelector', 'ayetMode', 'duaMode', 'hadisMode', 'boslukMode', 'dinleMode'];
            modeIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.display = 'none';
                    el.style.zIndex = '';
                }
            });
        }
        
        // Ana sayfanın görünür olduğundan emin ol
        if (elements && elements.mainMenu) {
            elements.mainMenu.style.display = 'block';
        }
        
        log.debug('🔒 Calendar Modal kapatıldı ve temizlendi');
    }
}

// Touch event tracking for calendar modal scroll detection
let calendarModalTouchStart = { x: 0, y: 0, time: 0 };
let calendarModalIsScrolling = false;

// Touch event tracking for daily tasks modal scroll detection
let dailyTasksModalTouchStart = { x: 0, y: 0, time: 0 };
let dailyTasksModalIsScrolling = false;

// Daily tasks modal için touch event'leri
function initDailyTasksModalTouchEvents() {
    const dailyTasksModal = document.getElementById('dailyTasksModal');
    const dailyTasksScrollableContent = document.getElementById('dailyTasksScrollableContent');
    if (!dailyTasksModal) return;
    
    // Eğer zaten eklenmişse, önce temizle
    if (dailyTasksModal.hasAttribute('data-touch-events-initialized')) {
        eventManager.cleanupMultiple([dailyTasksModal, dailyTasksScrollableContent].filter(Boolean));
        log.debug('🔄 Daily Tasks Modal: Eski listener\'lar temizlendi, yeni eklenecek');
    }
    dailyTasksModal.setAttribute('data-touch-events-initialized', 'true');
    
    // Scroll edilebilir içerik alanında scroll algılama
    if (dailyTasksScrollableContent) {
        eventManager.add(dailyTasksScrollableContent, 'touchstart', function(e) {
            dailyTasksModalIsScrolling = false;
        }, { passive: true });
        
        eventManager.add(dailyTasksScrollableContent, 'touchmove', function(e) {
            // Scroll edilebilir içerik alanında hareket varsa, bu bir scroll'dur
            dailyTasksModalIsScrolling = true;
        }, { passive: true });
    }
    
    // Modal overlay için touch event'leri
    eventManager.add(dailyTasksModal, 'touchstart', function(e) {
        // Eğer scroll edilebilir içerik alanına veya içindeki herhangi bir elemente tıklanmışsa, ignore et
        const target = e.target;
        if (target && dailyTasksScrollableContent && (
            target === dailyTasksScrollableContent || 
            target.id === 'dailyTasksScrollableContent' || 
            dailyTasksScrollableContent.contains(target)
        )) {
            return;
        }
        
        const touch = e.touches[0];
        dailyTasksModalTouchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
        dailyTasksModalIsScrolling = false;
    }, { passive: true });
    
    eventManager.add(dailyTasksModal, 'touchmove', function(e) {
        // Eğer scroll edilebilir içerik alanında veya içindeki herhangi bir elementte hareket varsa, bu bir scroll'dur
        const target = e.target;
        if (target && dailyTasksScrollableContent && (
            target === dailyTasksScrollableContent || 
            target.id === 'dailyTasksScrollableContent' || 
            dailyTasksScrollableContent.contains(target)
        )) {
            dailyTasksModalIsScrolling = true;
            return;
        }
        
        if (dailyTasksModalTouchStart.x !== 0 || dailyTasksModalTouchStart.y !== 0) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - dailyTasksModalTouchStart.x);
            const deltaY = Math.abs(touch.clientY - dailyTasksModalTouchStart.y);
            // Eğer 10px'den fazla hareket varsa, bu bir scroll'dur
            if (deltaX > 10 || deltaY > 10) {
                dailyTasksModalIsScrolling = true;
            }
        }
    }, { passive: true });
    
    eventManager.add(dailyTasksModal, 'touchend', function(e) {
        // Eğer scroll edilebilir içerik alanına veya içindeki herhangi bir elemente dokunulmuşsa, ignore et
        const target = e.target;
        if (target && dailyTasksScrollableContent && (
            target === dailyTasksScrollableContent || 
            target.id === 'dailyTasksScrollableContent' || 
            dailyTasksScrollableContent.contains(target)
        )) {
            dailyTasksModalIsScrolling = false;
            dailyTasksModalTouchStart = { x: 0, y: 0, time: 0 };
            return;
        }
        
        // Touch end'de scroll kontrolü yap
        if (dailyTasksModalIsScrolling) {
            // Scroll oldu, kapatma
            dailyTasksModalIsScrolling = false;
            dailyTasksModalTouchStart = { x: 0, y: 0, time: 0 };
            return;
        }
        
        // Scroll değilse, normal click gibi davran
        const touch = e.changedTouches[0];
        const deltaTime = Date.now() - dailyTasksModalTouchStart.time;
        const deltaX = Math.abs(touch.clientX - dailyTasksModalTouchStart.x);
        const deltaY = Math.abs(touch.clientY - dailyTasksModalTouchStart.y);
        
        // Kısa süre (300ms) ve küçük hareket (10px) = tap
        if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
            // X butonuna veya claim butonuna tıklanmışsa ignore et
            if (target && (target.id === 'closeDailyTasksBtn' || target.closest('#closeDailyTasksBtn') || target.closest('button[onclick="closeDailyTasksModal()"]') || target.id === 'claimRewardsBtn' || target.closest('#claimRewardsBtn'))) {
                dailyTasksModalTouchStart = { x: 0, y: 0, time: 0 };
                return;
            }
            
            // Panel üzerine veya dış arka plana tap yapıldı, kapat
            closeDailyTasksModal();
        }
        
        dailyTasksModalTouchStart = { x: 0, y: 0, time: 0 };
    }, { passive: true });
}

// Calendar modal için touch event'leri
function initCalendarModalTouchEvents() {
    const calendarModal = document.getElementById('calendarModal');
    const calendarScrollableContent = document.getElementById('calendarScrollableContent');
    if (!calendarModal) return;
    
    // Eğer zaten eklenmişse, önce temizle
    if (calendarModal.hasAttribute('data-touch-events-initialized')) {
        eventManager.cleanupMultiple([calendarModal, calendarScrollableContent].filter(Boolean));
        log.debug('🔄 Calendar Modal: Eski listener\'lar temizlendi, yeni eklenecek');
    }
    calendarModal.setAttribute('data-touch-events-initialized', 'true');
    
    // Scroll edilebilir içerik alanında scroll algılama
    if (calendarScrollableContent) {
        eventManager.add(calendarScrollableContent, 'touchstart', function(e) {
            calendarModalIsScrolling = false;
        }, { passive: true });
        
        eventManager.add(calendarScrollableContent, 'touchmove', function(e) {
            // Scroll edilebilir içerik alanında hareket varsa, bu bir scroll'dur
            calendarModalIsScrolling = true;
        }, { passive: true });
    }
    
    // Modal overlay için touch event'leri
    eventManager.add(calendarModal, 'touchstart', function(e) {
        // Eğer scroll edilebilir içerik alanına veya içindeki herhangi bir elemente tıklanmışsa, ignore et
        const target = e.target;
        if (target && calendarScrollableContent && (
            target === calendarScrollableContent || 
            target.id === 'calendarScrollableContent' || 
            calendarScrollableContent.contains(target)
        )) {
            return;
        }
        
        const touch = e.touches[0];
        calendarModalTouchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
        calendarModalIsScrolling = false;
    }, { passive: true });
    
    eventManager.add(calendarModal, 'touchmove', function(e) {
        // Eğer scroll edilebilir içerik alanında veya içindeki herhangi bir elementte hareket varsa, bu bir scroll'dur
        const target = e.target;
        if (target && calendarScrollableContent && (
            target === calendarScrollableContent || 
            target.id === 'calendarScrollableContent' || 
            calendarScrollableContent.contains(target)
        )) {
            calendarModalIsScrolling = true;
            return;
        }
        
        if (calendarModalTouchStart.x !== 0 || calendarModalTouchStart.y !== 0) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - calendarModalTouchStart.x);
            const deltaY = Math.abs(touch.clientY - calendarModalTouchStart.y);
            // Eğer 10px'den fazla hareket varsa, bu bir scroll'dur
            if (deltaX > 10 || deltaY > 10) {
                calendarModalIsScrolling = true;
            }
        }
    }, { passive: true });
    
    eventManager.add(calendarModal, 'touchend', function(e) {
        // Eğer scroll edilebilir içerik alanına veya içindeki herhangi bir elemente dokunulmuşsa, ignore et
        const target = e.target;
        if (target && calendarScrollableContent && (
            target === calendarScrollableContent || 
            target.id === 'calendarScrollableContent' || 
            calendarScrollableContent.contains(target)
        )) {
            calendarModalIsScrolling = false;
            calendarModalTouchStart = { x: 0, y: 0, time: 0 };
            return;
        }
        
        // Touch end'de scroll kontrolü yap
        if (calendarModalIsScrolling) {
            // Scroll oldu, kapatma
            calendarModalIsScrolling = false;
            calendarModalTouchStart = { x: 0, y: 0, time: 0 };
            return;
        }
        
        // Scroll değilse, normal click gibi davran
        const touch = e.changedTouches[0];
        const deltaTime = Date.now() - calendarModalTouchStart.time;
        const deltaX = Math.abs(touch.clientX - calendarModalTouchStart.x);
        const deltaY = Math.abs(touch.clientY - calendarModalTouchStart.y);
        
        // Kısa süre (300ms) ve küçük hareket (10px) = tap
        if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
            // X butonuna tıklanmışsa ignore et
            if (target && (target.id === 'closeCalendarBtn' || target.closest('#closeCalendarBtn') || target.closest('button[onclick="closeCalendarModal()"]'))) {
                calendarModalTouchStart = { x: 0, y: 0, time: 0 };
                return;
            }
            
            // Panel üzerine veya dış arka plana tap yapıldı, kapat
            closeCalendarModal();
        }
        
        calendarModalTouchStart = { x: 0, y: 0, time: 0 };
    }, { passive: true });
}

// Her yere tıklayınca kapatma fonksiyonu (Panel üzerine de tıklanınca kapanır)
function handleCalendarModalClick(event) {
    // X butonuna veya kapat butonuna tıklanırsa kapatma
    const target = event.target;
    if (target && (target.id === 'closeCalendarBtn' || target.closest('#closeCalendarBtn') || target.closest('button[onclick="closeCalendarModal()"]'))) {
        return;
    }
    
    // Modal içeriğine (modal-content) tıklanırsa, kapatma (sadece arka plana tıklanınca kapat)
    if (target && (target.closest('.modal-content'))) {
        return;
    }
    
    // Scroll edilebilir içerik alanına tıklanırsa, scroll kontrolü yap
    if (target && (target.id === 'calendarScrollableContent' || target.closest('#calendarScrollableContent'))) {
        // Scroll yapıldıysa veya scroll edilebilir içerik alanına tıklanırsa, kapatma
        return;
    }
    
    // Sadece modal overlay'e (arka plana) tıklanırsa kapat
    closeCalendarModal();
}

function generateWeeklyStreakDisplay() {
    try {
        // Null kontrolü
        if (!streakData || !streakData.playDates) {
            log.warn('⚠️ streakData veya playDates bulunamadı, varsayılan değerler kullanılıyor');
            streakData = streakData || {};
            streakData.playDates = streakData.playDates || [];
        }
        
        // Dark mode kontrolü
        const isDarkMode = document.body.classList.contains('dark-mode') || 
                         window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Son 7 günü hesapla (Pazartesi'den başlayacak şekilde)
        const today = new Date();
        const weekDays = [];
        // Pazartesi'den başlayan gün isimleri (aylık takvim ile uyumlu)
        const dayNames = ['Pt', 'Sl', 'Çr', 'Pr', 'Cm', 'Ct', 'Pz'];
        
        // Bugünün haftanın hangi günü olduğunu bul (Pazartesi = 0)
        const todayDayOfWeek = (today.getDay() + 6) % 7; // 0=Pazartesi, 6=Pazar
        
        // Bu haftanın Pazartesi'sini bul
        const monday = new Date(today);
        monday.setDate(today.getDate() - todayDayOfWeek);
        
        // Son 7 günü Pazartesi'den başlayarak hesapla
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = getLocalDateString(date);
            if (!dateStr) {
                log.error('❌ getLocalDateString null döndü!');
                continue;
            }
            weekDays.push({
                date: date,
                dateStr: dateStr,
                dayName: dayNames[i], // Pazartesi'den başlayarak sırayla
                isToday: dateStr === getLocalDateString(today)
            });
        }
        
        // PlayDates set'ini oluştur
        const playDatesSet = new Set(streakData.playDates || []);
        const currentStreakDates = calculateCurrentStreakDates();
        const currentStreakSet = new Set(currentStreakDates || []);
    
    // HTML oluştur - Duolingo Style
    let html = '';
    
    // Gün isimleri (üst satır)
    html += '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 12px;">';
    weekDays.forEach(day => {
        const dayColor = day.isToday ? '#58cc02' : (isDarkMode ? '#b0b0b0' : '#999');
        const fontWeight = day.isToday ? '700' : '400';
        html += `<div style="text-align: center; font-size: 0.75em; color: ${dayColor}; font-weight: ${fontWeight};">${day.dayName}</div>`;
    });
    html += '</div>';
    
    // Günler (alt satır) - Duolingo kare stili
    html += '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;">';
    weekDays.forEach(day => {
        const hasPlayed = playDatesSet.has(day.dateStr);
        const isInStreak = currentStreakSet.has(day.dateStr);
        
        let boxStyle = 'aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2em; font-weight: 600; transition: transform 0.2s;';
        
        if (day.isToday) {
            if (hasPlayed) {
                // Bugün tamamlandı - yeşil (Duolingo style)
                boxStyle += ' background: #58cc02; color: white; border: 2px solid #58cc02;';
            } else {
                // Bugün henüz oynanmadı - mavi kenarlık
                const todayBg = isDarkMode ? '#1e3a1e' : '#e5f4e3';
                boxStyle += ` background: ${todayBg}; color: #58cc02; border: 2px solid #58cc02;`;
            }
        } else if (isInStreak && hasPlayed) {
            // Streak günü - altın/yeşil (Duolingo style)
            boxStyle += ' background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #1a1a1a; border: 2px solid #ffd700;';
        } else if (hasPlayed) {
            // Oynandı ama streak dışında - yeşil
            const playedBg = isDarkMode ? '#4db300' : '#58cc02';
            boxStyle += ` background: ${playedBg}; color: white; border: 2px solid ${playedBg};`;
        } else {
            // Oynanmadı - gri
            const emptyBg = isDarkMode ? '#2a2a2a' : '#e5e5e5';
            const emptyColor = isDarkMode ? '#666' : '#999';
            boxStyle += ` background: ${emptyBg}; color: ${emptyColor}; border: 2px solid ${emptyBg};`;
        }
        
        const icon = hasPlayed ? '✓' : '';
        html += `<div style="${boxStyle}" title="${day.dateStr}">${icon}</div>`;
    });
    html += '</div>';
    
    // HTML'i yerleştir
    const weeklyDisplay = document.getElementById('weeklyStreakDisplay');
    if (!weeklyDisplay) {
        log.error('❌ weeklyStreakDisplay elementi bulunamadı!');
        return;
    }
    weeklyDisplay.innerHTML = html;
    
    // Streak sayısını güncelle
    const streakCountEl = document.getElementById('calendarStreakCount');
    if (streakCountEl) {
        streakCountEl.textContent = streakData.currentStreak || 0;
    } else {
        log.warn('⚠️ calendarStreakCount elementi bulunamadı');
    }
    
        // Debug: Haftalık takvim oluşturuldu
        log.debug('✅ Haftalık takvim oluşturuldu:', {
            weekDays: weekDays.length,
            playedDays: weekDays.filter(d => playDatesSet.has(d.dateStr)).length,
            streakDays: weekDays.filter(d => currentStreakSet.has(d.dateStr)).length
        });
    } catch (error) {
        log.error('❌ generateWeeklyStreakDisplay hatası:', error);
        const weeklyDisplay = document.getElementById('weeklyStreakDisplay');
        if (weeklyDisplay) {
            weeklyDisplay.innerHTML = '<div style="text-align: center; padding: 20px; color: #e74c3c;">❌ Haftalık takvim yüklenirken hata oluştu</div>';
        }
    }
}

function generateMonthlyCalendar() {
    try {
        // Null kontrolü
        if (!streakData || !streakData.playDates) {
            log.warn('⚠️ streakData veya playDates bulunamadı, varsayılan değerler kullanılıyor');
            streakData = streakData || {};
            streakData.playDates = streakData.playDates || [];
        }
        
        // Dark mode kontrolü
        const isDarkMode = document.body.classList.contains('dark-mode') || 
                         window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const todayDate = today.getDate();
        const todayStr = getLocalDateString();
        
        if (!todayStr) {
            log.error('❌ getLocalDateString null döndü!');
            return;
        }
        
        // Ay adını güncelle
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        const calendarMonthEl = document.getElementById('calendarMonth');
        if (calendarMonthEl) {
            calendarMonthEl.textContent = `${monthNames[month]} ${year}`;
        } else {
            log.warn('⚠️ calendarMonth elementi bulunamadı');
        }
        
        // Takvim grid'ini temizle ve yeni HTML oluştur
        const grid = document.getElementById('calendarGrid');
        if (!grid) {
            log.error('❌ calendarGrid elementi bulunamadı!');
            return;
        }
    
    // HTML string olarak oluştur
    let html = '';
    
    // Haftanın günlerini ekle (Duolingo style - üst satır)
    // Pazartesi'den başlayan gün isimleri (haftalık takvim ile uyumlu)
    const dayNames = ['Pt', 'Sl', 'Çr', 'Pr', 'Cm', 'Ct', 'Pz'];
    const dayNameColor = isDarkMode ? '#b0b0b0' : '#999';
    dayNames.forEach(day => {
        html += `<div style="text-align: center; font-weight: 600; font-size: 0.75em; color: ${dayNameColor}; padding: 8px 0; display: flex; align-items: center; justify-content: center;">${day}</div>`;
    });
    
    // Ayın ilk gününün haftanın hangi günü olduğunu bul
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Pazartesi = 0
    
    // Boş günler ekle
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div></div>';
    }
    
    // Mevcut streak'in gerçek tarih aralığını hesapla
    const currentStreakDates = calculateCurrentStreakDates();
    const currentStreakSet = new Set(currentStreakDates);

    // playDates array'ini Set'e çevir
    const playDatesSet = new Set(streakData.playDates);
    
    // Ayın günlerini ekle (Duolingo kare stili)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasPlayed = playDatesSet.has(dateStr);
        const isInStreak = currentStreakSet.has(dateStr);
        const isToday = dateStr === todayStr;
        
        // Duolingo style kare
        let boxStyle = 'aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9em; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;';
        
        if (isToday) {
            if (hasPlayed) {
                // Bugün tamamlandı - yeşil (Duolingo style)
                boxStyle += ' background: #58cc02; color: white; border: 2px solid #58cc02; box-shadow: 0 2px 8px rgba(88, 204, 2, 0.3);';
            } else {
                // Bugün henüz oynanmadı - mavi kenarlık
                const todayBg = isDarkMode ? '#1e3a1e' : '#e5f4e3';
                boxStyle += ` background: ${todayBg}; color: #58cc02; border: 2px solid #58cc02;`;
            }
        } else if (isInStreak && hasPlayed) {
            // Streak günü - altın (Duolingo style)
            boxStyle += ' background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #1a1a1a; border: 2px solid #ffd700; box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);';
        } else if (hasPlayed) {
            // Oynandı ama streak dışında - yeşil
            const playedBg = isDarkMode ? '#4db300' : '#58cc02';
            boxStyle += ` background: ${playedBg}; color: white; border: 2px solid ${playedBg};`;
        } else if (day < todayDate) {
            // Geçmiş gün - oynanmadı - gri
            const pastBg = isDarkMode ? '#2a2a2a' : '#e5e5e5';
            const pastColor = isDarkMode ? '#666' : '#999';
            boxStyle += ` background: ${pastBg}; color: ${pastColor}; border: 2px solid ${pastBg};`;
        } else {
            // Gelecek gün - açık gri
            const futureBg = isDarkMode ? '#1a1a1a' : '#f7f7f7';
            const futureColor = isDarkMode ? '#555' : '#ccc';
            boxStyle += ` background: ${futureBg}; color: ${futureColor}; border: 2px solid ${futureBg};`;
        }
        
        const content = hasPlayed ? '✓' : day;
        const tooltip = `${dateStr}${hasPlayed ? ' - Tamamlandı' : isToday ? ' - Bugün' : ''}${isInStreak && hasPlayed ? ' - Streak!' : ''}`;
        
        html += `<div style="${boxStyle}" title="${tooltip}" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${content}</div>`;
    }
    
    // HTML'i yerleştir
    if (!grid) {
        log.error('❌ calendarGrid elementi bulunamadı!');
        return;
    }
    grid.innerHTML = html;
    
        // Debug: Aylık takvim oluşturuldu
        log.debug('✅ Aylık takvim oluşturuldu:', {
            month: `${monthNames[month]} ${year}`,
            daysInMonth: daysInMonth,
            startingDayOfWeek: startingDayOfWeek,
            totalBoxes: Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7
        });
    } catch (error) {
        log.error('❌ generateMonthlyCalendar hatası:', error);
        const grid = document.getElementById('calendarGrid');
        if (grid) {
            grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #e74c3c;">❌ Aylık takvim yüklenirken hata oluştu</div>';
        }
    }
}


// Global fonksiyonlar (window'a ekle ki HTML onclick çalışsın)
window.showCalendarModal = showCalendarModal;
window.closeCalendarModal = closeCalendarModal;

// 🔍 STREAK ANALİZ SİSTEMİ - DEBUG TOOLS
function analyzeStreakSystem() {
    log.stats('🔍 STREAK SİSTEMİ ANALİZ RAPORU');
    log.stats('=====================================');
    
    const today = getLocalDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    
    // Mevcut streak verilerini analiz et
    log.stats('📊 Mevcut Veriler:');
    log.stats(`├── Bugün: ${today}`);
    log.stats(`├── Dün: ${yesterdayStr}`);
    log.stats(`├── Son oyun tarihi: ${streakData.lastPlayDate}`);
    log.stats(`├── Mevcut streak: ${streakData.currentStreak} gün`);
    log.stats(`├── En iyi streak: ${streakData.bestStreak} gün`);
    log.stats(`├── Bugünkü ilerleme: ${streakData.todayProgress}/${streakData.dailyGoal}`);
    log.stats(`├── Toplam oyun günü: ${streakData.totalPlayDays}`);
    log.stats(`└── Oyun tarihleri: [${streakData.playDates.join(', ')}]`);
    
    // Streak mantık kontrolü
    log.stats('\n🧠 Streak Mantık Kontrolü:');
    const streakShouldBreak = streakData.lastPlayDate !== yesterdayStr && 
                             streakData.lastPlayDate !== today && 
                             streakData.lastPlayDate !== '';
    
    log.stats(`├── Streak kırılmalı mı? ${streakShouldBreak ? '✅ EVET' : '❌ HAYIR'}`);
    log.stats(`├── Bugün oynanmış mı? ${streakData.playDates.includes(today) ? '✅ EVET' : '❌ HAYIR'}`);
    log.stats(`├── Dün oynanmış mı? ${streakData.playDates.includes(yesterdayStr) ? '✅ EVET' : '❌ HAYIR'}`);
    
    // Ardışık gün analizi (gelişmiş)
    log.stats('\n📅 Ardışık Gün Analizi:');
    const validation = validateCurrentStreak(today);
    log.stats(`├── Hesaplanan ardışık gün: ${validation.correctStreak}`);
    log.stats(`├── Kayıtlı streak: ${streakData.currentStreak}`);
    log.stats(`├── Tutarlılık: ${validation.isValid ? '✅ DOĞRU' : '❌ YANLIŞ'}`);
    log.stats(`└── Açıklama: ${validation.reason}`);
    
    // Takvim görünümü kontrolü
    log.stats('\n📆 Takvim Görünümü Test:');
    const currentStreakDates = calculateCurrentStreakDates();
    log.stats(`├── Streak tarih aralığı: [${currentStreakDates.join(', ')}]`);
    log.stats(`├── Takvimde 🔥 gösterilecek günler: ${currentStreakDates.length}`);
    
    // Öneriler
    log.stats('\n💡 Öneriler:');
    if (consecutiveDays !== streakData.currentStreak) {
        log.stats('├── ⚠️ Streak hesaplaması düzeltilmeli');
        log.stats(`├── 🔧 Doğru değer: ${consecutiveDays} olmalı`);
    } else {
        log.stats('├── ✅ Streak hesaplaması doğru');
    }
    
    if (streakData.playDates.includes(today) && streakData.todayProgress < streakData.dailyGoal) {
        log.stats('├── ⚠️ Bugün oynanmış ama hedef tamamlanmamış - veri tutarsızlığı');
    }
    
    log.stats('\n=====================================');
    log.stats('🔍 Analiz tamamlandı!');
}

// Test fonksiyonları - sadece debug modunda çalışır
function testStreakScenarios() {
    // Debug modu kontrolü
    if (typeof CONFIG === 'undefined' || !CONFIG.debugTest) {
        if (typeof log !== 'undefined' && log.error) {
            log.error('❌ Test fonksiyonları sadece debug modunda çalışır. Konsolda: CONFIG.debugTest = true; yapın.');
        }
        return;
    }
    
    log.stats('🧪 STREAK TEST SENARYOLARİ');
    log.stats('=============================');
    
    // Backup mevcut veri
    const backup = {
        currentStreak: streakData.currentStreak,
        bestStreak: streakData.bestStreak,
        lastPlayDate: streakData.lastPlayDate,
        totalPlayDays: streakData.totalPlayDays,
        todayProgress: streakData.todayProgress,
        playDates: [...streakData.playDates]
    };
    
    log.stats('Test 1: Streak kırılması simülasyonu');
    streakData.lastPlayDate = '2025-11-08'; // 2 gün önce
    checkDailyProgress();
    log.stats(`├── Streak kırıldı mı? ${streakData.currentStreak === 0 ? '✅ EVET' : '❌ HAYIR'}`);
    
    log.stats('\nTest 2: Hedef tamamlama simülasyonu');
    streakData.todayProgress = 0;
    updateDailyProgress(5); // 5 doğru cevap ekle
    log.stats(`├── Hedef tamamlandı mı? ${streakData.todayProgress >= streakData.dailyGoal ? '✅ EVET' : '❌ HAYIR'}`);
    
    // Restore backup
    Object.assign(streakData, backup);
    log.stats('\n🔄 Veriler geri yüklendi');
    log.stats('=============================');
}

// Geliştirici araçları - console'da çağırılabilir (sadece debug modunda çalışır)
window.analyzeStreak = analyzeStreakSystem;
window.testStreak = testStreakScenarios;

// ============ GÜNLİK GÖREVLER SİSTEMİ ============
function checkDailyTasks() {
    const today = getLocalDateString(); // Yerel tarih (YYYY-MM-DD)
    
    log.debug('🔍 Günlük görev kontrolü:', {
        bugün: today,
        sonGörevTarihi: dailyTasks.lastTaskDate,
        yeniGünMü: dailyTasks.lastTaskDate !== today,
        mevcutTamamlananlar: dailyTasks.completedTasks.length,
        bugünküStats: dailyTasks.todayStats
    });
    
    // Eğer yeni gün başladıysa görevleri yenile
    if (dailyTasks.lastTaskDate !== today) {
        log.debug('🔄 Yeni gün başladı, görevler yenileniyor...');
        generateDailyTasks(today);
        // Görevler oluşturulduktan sonra badge'i güncelle
        if (typeof updateTasksDisplay === 'function') {
            updateTasksDisplay();
        }
    } else {
        log.debug('✅ Aynı gün, mevcut görevler korunuyor');
        // Mevcut görevler için de badge'i güncelle
        if (typeof updateTasksDisplay === 'function') {
            updateTasksDisplay();
        }
    }
}

function generateDailyTasks(date) {
    // Temel görevler listesi (tüm oyun modlarını kapsayacak şekilde genişletildi)
    const baseTasks = [
        { id: 'kelime5', name: '5 kelime çevir', target: 5, current: 0, type: 'kelimeCevir', reward: 1 },
        { id: 'ayet3', name: '3 ayet oku', target: 3, current: 0, type: 'ayetOku', reward: 1 },
        { id: 'dua2', name: '2 dua öğren', target: 2, current: 0, type: 'duaOgre', reward: 1 },
        { id: 'hadis1', name: '1 hadis oku', target: 1, current: 0, type: 'hadisOku', reward: 1 },
        { id: 'dinle2', name: '2 kelime dinle', target: 2, current: 0, type: 'dinleBul', reward: 1 },
        { id: 'bosluk1', name: '1 boşluk doldur', target: 1, current: 0, type: 'boslukDoldur', reward: 1 },
        { id: 'dogru10', name: '10 doğru cevap ver', target: 10, current: 0, type: 'toplamDogru', reward: 1 },
        { id: 'puan100', name: '100 puan topla', target: 100, current: 0, type: 'toplamPuan', reward: 1 }
    ];

    // Bonus görevler listesi (daha fazla çeşitlilik)
    const bonusTasksList = [
        { id: 'perfect5', name: 'Hiç yanlış yapmadan 5 soru çöz', target: 5, current: 0, type: 'perfectStreak', reward: 2 },
        { id: 'allDiff', name: '3 farklı zorlukta oyna', target: 3, current: 0, type: 'farklıZorluk', reward: 2 },
        { id: 'combo15', name: '15 doğru cevap ver (bonus)', target: 15, current: 0, type: 'toplamDogru', reward: 2 },
        { id: 'dinle5', name: '5 kelime dinle (bonus)', target: 5, current: 0, type: 'dinleBul', reward: 2 },
        { id: 'bosluk3', name: '3 boşluk doldur (bonus)', target: 3, current: 0, type: 'boslukDoldur', reward: 2 },
        { id: 'kelime10', name: '10 kelime çevir (bonus)', target: 10, current: 0, type: 'kelimeCevir', reward: 2 },
        { id: 'puan200', name: '200 puan topla (bonus)', target: 200, current: 0, type: 'toplamPuan', reward: 2 },
        { id: 'dogru20', name: '20 doğru cevap ver (bonus)', target: 20, current: 0, type: 'toplamDogru', reward: 2 }
    ];

    // Rastgele 3 bonus görev seç (2'den 3'e çıkarıldı)
    const selectedBonus = bonusTasksList.sort(() => 0.5 - Math.random()).slice(0, 3);

    dailyTasks.lastTaskDate = date;
    dailyTasks.tasks = baseTasks;
    dailyTasks.bonusTasks = selectedBonus;
    dailyTasks.completedTasks = [];
    dailyTasks.rewardsClaimed = false;
    dailyTasks.todayStats = {
        kelimeCevir: 0,
        dinleBul: 0,
        boslukDoldur: 0,
        ayetOku: 0,
        duaOgre: 0,
        hadisOku: 0,
        toplamDogru: 0,
        toplamYanlis: 0,
        toplamPuan: 0,
        perfectStreak: 0,
        farklıZorluk: new Set()
    };

    log.debug('🎯 Yeni günlük görevler oluşturuldu:', {
        tarih: date,
        temelGörevler: baseTasks.length,
        bonusGörevler: selectedBonus.length,
        toplamGörevler: baseTasks.length + selectedBonus.length,
        tamamlananlar: dailyTasks.completedTasks.length,
        stats: dailyTasks.todayStats
    });

    debouncedSaveStats(); // Debounced kaydetme
    
    // Görevler oluşturulduktan sonra badge'i güncelle
    // Not: checkDailyTasks() içinde de çağrılıyor ama burada da çağırmak daha güvenli
    setTimeout(() => {
        if (typeof updateTasksDisplay === 'function') {
            updateTasksDisplay();
        }
    }, 100);
}

function updateTaskProgress(gameType, amount = 1) {
    log.debug(`📋 updateTaskProgress çağrıldı: ${gameType} +${amount}`);
    
    // Oyun tipine göre istatistiği güncelle
    if (dailyTasks.todayStats[gameType] !== undefined) {
        const eskiDeger = dailyTasks.todayStats[gameType];
        dailyTasks.todayStats[gameType] += amount;
        log.debug(`📊 ${gameType}: ${eskiDeger} → ${dailyTasks.todayStats[gameType]}`);
    }

    // Zorluk takibi
    if (currentDifficulty) {
        dailyTasks.todayStats.farklıZorluk.add(currentDifficulty);
        log.debug(`🎯 Zorluk eklendi: ${currentDifficulty}, toplam: ${dailyTasks.todayStats.farklıZorluk.size}`);
    }

    // Görevleri kontrol et ve güncelle
    const allTasks = [...dailyTasks.tasks, ...dailyTasks.bonusTasks];
    
    allTasks.forEach(task => {
        const eskiCurrent = task.current;
        if (task.type === gameType) {
            task.current = Math.min(task.target, dailyTasks.todayStats[gameType]);
        } else if (task.type === 'farklıZorluk') {
            task.current = dailyTasks.todayStats.farklıZorluk.size;
        }

        // Görev tamamlandı mı?
        if (task.current >= task.target && !dailyTasks.completedTasks.includes(task.id)) {
            dailyTasks.completedTasks.push(task.id);
            log.debug(`✅ Görev tamamlandı: ${task.id} (${task.name})`);
        }
        
        if (eskiCurrent !== task.current) {
            log.debug(`🎯 Görev ilerleme: ${task.id} ${eskiCurrent}/${task.target} → ${task.current}/${task.target}`);
        }
    });

    log.debug(`📋 Toplam tamamlanan görev: ${dailyTasks.completedTasks.length}`);
    debouncedSaveStats(); // Debounced kaydetme
    
    // Badge'i güncelle
    updateTasksDisplay();
}

function showDailyTasksModal() {
    // Önce tüm modalları ve oyun ekranlarını kapat
    closeAllModals();
    if (typeof hideAllGameScreens === 'function') {
        hideAllGameScreens();
    }
    if (typeof hideAllModes === 'function') {
        hideAllModes();
    }
    
    // Synchronization: Wait for DOM updates before opening new modal
    requestAnimationFrame(() => {
        // Bottom nav bar'ı gizle (modal açıkken görünmemeli)
        if (typeof hideBottomNavBar === 'function') {
            hideBottomNavBar();
        }
        
        // Touch event'lerini başlat (eğer henüz başlatılmadıysa)
        initDailyTasksModalTouchEvents();
        
        // Body scroll'u engelle
        document.body.style.overflow = 'hidden';
        
        // Günlük görevleri kontrol et ve güncelle
        checkDailyTasks();
        
        // Debug: Görev durumunu logla
        log.debug('📋 Daily Tasks Debug:', {
            tasks: dailyTasks.tasks.length,
            bonusTasks: dailyTasks.bonusTasks.length,
            completed: dailyTasks.completedTasks.length,
            lastDate: dailyTasks.lastTaskDate,
            today: getLocalDateString()
        });
        
        // Görev verilerini güncelle
        updateTasksDisplay();
        
        // Modal'ı göster (null check ile)
        const modal = document.getElementById('dailyTasksModal');
        if (modal) {
            modal.style.display = 'flex';
            // Force reflow to ensure modal is visible
            modal.offsetHeight;
        } else {
            log.error('❌ dailyTasksModal elementi bulunamadı!');
        }
    });
}

function closeDailyTasksModal() {
    const modal = document.getElementById('dailyTasksModal');
    if (modal) {
        // Event listener'ları temizle (memory leak prevention)
        const scrollableContent = document.getElementById('dailyTasksScrollableContent');
        eventManager.cleanupMultiple([modal, scrollableContent].filter(Boolean));
        
        modal.style.display = 'none';
        modal.style.zIndex = '';
        // Body scroll'u tekrar aktif et
        document.body.style.overflow = '';
        
        // Bottom nav bar'ı tekrar göster (modal kapandığında)
        if (typeof showBottomNavBar === 'function') {
            showBottomNavBar();
        }
        
        // Tüm oyun ekranlarını ve modlarını gizle
        if (typeof hideAllGameScreens === 'function') {
            hideAllGameScreens();
        }
        if (typeof hideAllModes === 'function') {
            hideAllModes();
        } else {
            // Fallback: Manuel olarak modları gizle
            const modeIds = ['gameScreen', 'modeSelector', 'ayetMode', 'duaMode', 'hadisMode', 'boslukMode', 'dinleMode'];
            modeIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.display = 'none';
                    el.style.zIndex = '';
                }
            });
        }
        
        // Ana sayfanın görünür olduğundan emin ol
        if (elements && elements.mainMenu) {
            elements.mainMenu.style.display = 'block';
        }
        
        log.debug('🔒 Daily Tasks Modal kapatıldı ve temizlendi');
    }
}

// Her yere tıklayınca kapatma fonksiyonu (Hasene Nasıl Kazanılır paneli ile aynı mantık)
function handleDailyTasksModalClick(event) {
    const target = event.target;
    // Close button veya claim rewards button kontrolü
    if (target && target.closest('button[onclick*="closeDailyTasksModal"]')) {
        return;
    }
    if (target && (target.id === 'claimRewardsBtn' || target.closest('#claimRewardsBtn'))) {
        return;
    }
    // Modal içeriğine tıklanırsa, kapatma (sadece arka plana tıklanınca kapat)
    if (target && target.closest('.modal-content')) {
        return;
    }
    // Scroll edilebilir içerik alanına tıklanırsa, kapatma
    if (target && (target.id === 'dailyTasksScrollableContent' || target.closest('#dailyTasksScrollableContent'))) {
        return;
    }
    // Arka plana tıklanırsa, modal'ı kapat
    closeDailyTasksModal();
}

function updateTasksDisplay() {
    // Güvenlik kontrolü: Eğer görevler boşsa, yeniden oluştur
    if (!dailyTasks.tasks || dailyTasks.tasks.length === 0) {
        log.debug('⚠️ Tasks boş, yeniden oluşturuluyor...');
        generateDailyTasks(getLocalDateString());
    }
    
    const completedCount = dailyTasks.completedTasks.length;
    const totalCount = dailyTasks.tasks.length + dailyTasks.bonusTasks.length;
    const incompleteCount = totalCount - completedCount;
    
    log.debug('📊 updateTasksDisplay:', { 
        completedCount, 
        totalCount, 
        incompleteCount,
        baseTasks: dailyTasks.tasks.length,
        bonusTasks: dailyTasks.bonusTasks.length,
        rewardsClaimed: dailyTasks.rewardsClaimed
    });
    
    // Genel ilerleme
    const completedTasksEl = document.getElementById('completedTasks');
    const totalTasksEl = document.getElementById('totalTasks');
    const taskProgressBar = document.getElementById('taskProgress');
    
    if (completedTasksEl) {
        completedTasksEl.textContent = completedCount;
    } else {
        log.error('❌ completedTasks elementi bulunamadı!');
    }
    
    if (totalTasksEl) {
        totalTasksEl.textContent = totalCount;
    } else {
        log.error('❌ totalTasks elementi bulunamadı!');
    }
    
    const progressPercent = totalCount > 0 ? Math.min((completedCount / totalCount) * 100, 100) : 0;
    if (taskProgressBar) {
        taskProgressBar.style.width = progressPercent + '%';
    } else {
        log.error('❌ taskProgress elementi bulunamadı!');
    }
    
    // Badge güncelle (tamamlanmamış görev varsa göster)
    const tasksBadge = document.getElementById('tasksBadge');
    if (tasksBadge) {
        if (incompleteCount > 0 && !dailyTasks.rewardsClaimed) {
            tasksBadge.style.display = 'flex';
            // 12 veya daha fazla ise "9+" göster, değilse tam sayıyı göster
            // (11 görev olduğu için, kullanıcı tam sayıyı görebilsin)
            const badgeText = incompleteCount >= 12 ? '9+' : incompleteCount.toString();
            tasksBadge.textContent = badgeText;
            log.debug('🏷️ Badge güncellendi:', { incompleteCount, badgeText });
        } else {
            tasksBadge.style.display = 'none';
            log.debug('🏷️ Badge gizlendi:', { incompleteCount, rewardsClaimed: dailyTasks.rewardsClaimed });
        }
    } else {
        log.error('❌ tasksBadge elementi bulunamadı!');
    }

    // Görevlerin current değerlerini güncelle (dailyTasks.todayStats'tan)
    const allTasks = [...dailyTasks.tasks, ...dailyTasks.bonusTasks];
    allTasks.forEach(task => {
        if (task.type === 'toplamPuan') {
            task.current = Math.min(task.target, dailyTasks.todayStats.toplamPuan || 0);
        } else if (task.type === 'toplamDogru') {
            task.current = Math.min(task.target, dailyTasks.todayStats.toplamDogru || 0);
        } else if (task.type === 'kelimeCevir') {
            task.current = Math.min(task.target, dailyTasks.todayStats.kelimeCevir || 0);
        } else if (task.type === 'dinleBul') {
            task.current = Math.min(task.target, dailyTasks.todayStats.dinleBul || 0);
        } else if (task.type === 'boslukDoldur') {
            task.current = Math.min(task.target, dailyTasks.todayStats.boslukDoldur || 0);
        } else if (task.type === 'ayetOku') {
            task.current = Math.min(task.target, dailyTasks.todayStats.ayetOku || 0);
        } else if (task.type === 'duaOgre') {
            task.current = Math.min(task.target, dailyTasks.todayStats.duaOgre || 0);
        } else if (task.type === 'hadisOku') {
            task.current = Math.min(task.target, dailyTasks.todayStats.hadisOku || 0);
        } else if (task.type === 'perfectStreak') {
            task.current = Math.min(task.target, dailyTasks.todayStats.perfectStreak || 0);
        } else if (task.type === 'farklıZorluk') {
            task.current = Math.min(task.target, dailyTasks.todayStats.farklıZorluk ? dailyTasks.todayStats.farklıZorluk.size : 0);
        }
        
        // Görev tamamlandı mı?
        if (task.current >= task.target && !dailyTasks.completedTasks.includes(task.id)) {
            dailyTasks.completedTasks.push(task.id);
            log.debug(`✅ Görev tamamlandı: ${task.id} (${task.name})`);
        }
    });
    
    // Tamamlanan görev sayısını güncelle
    const updatedCompletedCount = dailyTasks.completedTasks.length;
    const updatedTotalCount = dailyTasks.tasks.length + dailyTasks.bonusTasks.length;
    
    // Genel ilerleme güncelle
    if (completedTasksEl) {
        completedTasksEl.textContent = updatedCompletedCount;
    }
    if (totalTasksEl) {
        totalTasksEl.textContent = updatedTotalCount;
    }
    const updatedProgressPercent = updatedTotalCount > 0 ? Math.min((updatedCompletedCount / updatedTotalCount) * 100, 100) : 0;
    // taskProgressBar zaten yukarıda tanımlı, tekrar tanımlamaya gerek yok
    if (taskProgressBar) {
        taskProgressBar.style.width = updatedProgressPercent + '%';
    }

    // Temel görevleri göster
    const dailyList = document.getElementById('dailyTasksList');
    if (dailyList) {
        dailyList.innerHTML = '';
        
        if (dailyTasks.tasks && dailyTasks.tasks.length > 0) {
            dailyTasks.tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                dailyList.appendChild(taskElement);
            });
        }
    } else {
        log.error('❌ dailyTasksList elementi bulunamadı!');
    }

    // Bonus görevleri göster
    const bonusList = document.getElementById('bonusTasksList');
    if (bonusList) {
        bonusList.innerHTML = '';
        
        if (dailyTasks.bonusTasks && dailyTasks.bonusTasks.length > 0) {
            dailyTasks.bonusTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                bonusList.appendChild(taskElement);
            });
        }
    } else {
        log.error('❌ bonusTasksList elementi bulunamadı!');
    }

    // Ödül bölümü
    const rewardsSection = document.getElementById('rewardsSection');
    if (rewardsSection) {
        if (completedCount === totalCount && totalCount > 0 && !dailyTasks.rewardsClaimed) {
            rewardsSection.style.display = 'block';
        } else {
            rewardsSection.style.display = 'none';
        }
    }
}

function createTaskElement(task) {
    const isCompleted = dailyTasks.completedTasks.includes(task.id);
    // Sıfıra bölünme kontrolü
    const progressPercent = task.target > 0 ? Math.min((task.current / task.target) * 100, 100) : 0;
    
    // Task icon mapping
    const taskIcons = {
        'kelime5': '🔄', 'kelime10': '🔄',
        'ayet3': '📖', 'ayetOku': '📖',
        'dua2': '🤲', 'duaOgre': '🤲',
        'hadis1': '📚', 'hadisOku': '📚',
        'dinle2': '🎧', 'dinle3': '🎧', 'dinle5': '🎧', 'dinleBul': '🎧',
        'bosluk1': '✏️', 'bosluk2': '✏️', 'bosluk3': '✏️', 'boslukDoldur': '✏️',
        'dogru10': '⭐', 'dogru20': '⭐', 'toplamDogru': '⭐',
        'puan100': '💰', 'puan200': '💰', 'toplamPuan': '💰',
        'perfect5': '🔥', 'perfectStreak': '🔥',
        'allDiff': '💎', 'farklıZorluk': '💎',
        'combo15': '⚡'
    };
    
    const taskIcon = taskIcons[task.id] || taskIcons[task.type] || '📋';
    
    const div = document.createElement('div');
    div.className = 'daily-task-card' + (isCompleted ? ' completed' : '');
    
    // Tıklama event'lerini durdur (yanlışlıkla oyun modu açılmasın)
    div.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
    };
    // Touch event'leri - scroll'u engellemeden sadece click'i engelle
    div.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        // preventDefault kaldırıldı - scroll'u engellemesin
    }, { passive: true }); // Scroll performansı için passive: true
    
    // Hover efekti
    div.onmouseover = function() {
        if (!isCompleted) {
            this.style.transform = 'translateX(4px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
    };
    div.onmouseout = function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    };
    
    div.innerHTML = `
        ${isCompleted ? '<div class="daily-task-completed-badge">✓</div>' : ''}
        <div class="daily-task-header">
            <div class="daily-task-info">
                <div class="daily-task-icon">${taskIcon}</div>
                <div class="daily-task-name">${getTaskDisplayName(task)}</div>
                <div class="daily-task-desc">${getTaskDescription(task)}</div>
            </div>
            <div class="daily-task-reward">+${task.reward * 100} Hasene</div>
        </div>
        <div class="daily-task-progress">
            <div class="daily-task-progress-bar">
                <div class="daily-task-progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
            <div class="daily-task-progress-text">${task.current}/${task.target}</div>
        </div>
    `;
    
    return div;
}

function getTaskDescription(task) {
    const descriptions = {
        'kelime5': 'Herhangi bir modda 5 kelime çevir',
        'kelime10': 'Herhangi bir modda 10 kelime çevir',
        'ayet3': 'Ayet Oku modunda 3 ayet oku',
        'dua2': 'Dua Et modunda 2 dua öğren',
        'hadis1': 'Hadis Oku modunda 1 hadis oku',
        'dinle2': 'Dinle ve Bul modunda 2 kelime dinle',
        'dinle5': 'Dinle ve Bul modunda 5 kelime dinle',
        'bosluk1': 'Boşluk Doldur modunda 1 soru çöz',
        'bosluk3': 'Boşluk Doldur modunda 3 soru çöz',
        'dogru10': 'Herhangi bir modda 10 doğru cevap ver',
        'dogru20': 'Herhangi bir modda 20 doğru cevap ver',
        'puan100': 'Günlük toplam 100 Hasene kazan',
        'puan200': 'Günlük toplam 200 Hasene kazan',
        'perfect5': 'Hiç yanlış yapmadan 5 soru çöz',
        'allDiff': '3 farklı zorluk seviyesinde oyna',
        'combo15': '15 doğru cevap ver (muvazebet)'
    };
    return descriptions[task.id] || task.name;
}

function getTaskDisplayName(task) {
    // Görev tipine göre uygun isim döndür
    const taskNames = {
        'kelime5': '5 Kelime Çevir',
        'kelime10': '10 Kelime Çevir (Fazilet)',
        'ayet3': '3 Ayet Oku', 
        'dua2': '2 Dua Öğren',
        'hadis1': '1 Hadis Oku',
        'dinle2': '2 Kelime Dinle',
        'dinle3': '3 Kelime Dinle (Fazilet)',
        'dinle5': '5 Kelime Dinle (Fazilet)',
        'bosluk1': '1 Boşluk Doldur',
        'bosluk2': '2 Boşluk Doldur (Fazilet)',
        'bosluk3': '3 Boşluk Doldur (Fazilet)',
        'dogru10': '10 Doğru Cevap',
        'dogru20': '20 Doğru Cevap (Fazilet)',
        'puan100': '100 Puan Topla',
        'puan200': '200 Puan Topla (Fazilet)',
        'perfect5': 'Mükemmel Seri (5 Sual)',
        'allDiff': '3 Farklı Zorlukta Talebe Et',
        'combo15': '15 Doğru Cevap (Muvazebet)'
    };
    
    return taskNames[task.id] || task.name;
}

function claimDailyRewards() {
    const completedCount = dailyTasks.completedTasks.length;
    const totalCount = dailyTasks.tasks.length + dailyTasks.bonusTasks.length;
    
    if (completedCount === totalCount && !dailyTasks.rewardsClaimed) {
        // 2500 Hasene ihsan ver (5 yıldız değerinde)
        const bonusXP = 2500;
        totalPoints += bonusXP;
        
        // Bugünkü toplam puana da ekle (istatistikler için)
        dailyTasks.todayStats.toplamPuan += bonusXP;
        
        // Daily XP'ye de ekle
        addDailyXP(bonusXP);
        
        // Günlük görev ödülünü liderlik tablosuna da ekle
        if (typeof updateLeaderboardScores === 'function' && bonusXP > 0) {
            updateLeaderboardScores(bonusXP);
            log.game(`📊 Liderlik tablosu güncellendi (günlük görev ödülü): +${bonusXP} Hasene`);
        }
        
        dailyTasks.rewardsClaimed = true;
        debouncedSaveStats(); // Debounced kaydetme
        updateStatsBar();
        checkAchievements();
        
        // Ödül modalı göster
        showSuccessMessage('🎉 Tüm günlük vazifeleri tamamladın! +2,500 Hasene ihsan!');
        
        updateTasksDisplay();
    }
}

// Ödül butonu event listener
document.addEventListener('DOMContentLoaded', () => {
    const claimBtn = document.getElementById('claimRewardsBtn');
    if (claimBtn) {
        claimBtn.addEventListener('click', claimDailyRewards);
    }
    
    // Sayfa yüklendiğinde badge'i güncelle
    if (typeof updateTasksDisplay === 'function') {
        updateTasksDisplay();
    }
});

// Global fonksiyonlar
window.showDailyTasksModal = showDailyTasksModal;
window.closeDailyTasksModal = closeDailyTasksModal;
window.claimDailyRewards = claimDailyRewards;

// OYUN BİTİŞ FONKSİYONU (Oyun bitince çağrılır)
// NOT: Puanlar zaten addSessionPoints() ile eklendi, burada sadece kontrol yapıyoruz
function addToGlobalPoints(points, correctAnswers = 0) {
    // Seviye kontrol et (puanlar zaten totalPoints'e eklendi)
    const oldLevel = level;
    const newLevel = calculateLevel(totalPoints);
    
    // Seviye atlama kontrolü
    if (newLevel > oldLevel) {
        level = newLevel;
        showLevelUpModal(newLevel);
        playSound('levelup');
    }
    
    // Günlük ilerlemeyi güncelle
    if (correctAnswers > 0) {
        updateDailyProgress(correctAnswers);
        
        // NOT: toplamDogru zaten addSessionPoints'te gerçek zamanlı olarak ekleniyor (satır 4230)
        // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
        // updateTaskProgress('toplamDogru', correctAnswers);
        // NOT: toplamPuan zaten addSessionPoints'te eklendi, burada tekrar ekleme!
    }
    
    // NOT: Liderlik tablosu artık addSessionPoints içinde her puan eklendiğinde güncelleniyor
    // Burada tekrar güncellemeye gerek yok (çift ekleme önlenir)
    
    updateStatsBar(); // Global barı güncelle
    checkAchievements(); // Başarımları kontrol et
    debouncedSaveStats(); // Debounced kaydetme // Verileri kaydet
}

// ============ ZORLUK UI GÜNCELLEYICI - YENİ TASARIM ============
function updateDifficultyUI() {
    // Kaydedilen zorluk seviyesine göre UI'yı ayarla
    log.debug(`🎯 Zorluk UI güncelleniyor: ${currentDifficulty}`);
    
    // Tüm butonlardan active class'ını kaldır
    document.querySelectorAll('#mainMenu .diff-btn').forEach(btn => btn.classList.remove('active'));
    
    // Seçili zorluk seviyesini vurgula
    if (currentDifficulty === 'kolay') {
        document.getElementById('mainDiffKolay').classList.add('active');
    } else if (currentDifficulty === 'orta') {
        document.getElementById('mainDiffOrta').classList.add('active');
    } else if (currentDifficulty === 'zor') {
        document.getElementById('mainDiffZor').classList.add('active');
    }
}

// ============ ANA MENÜ ZORLUK BUTONLARI ============
function initMainMenuDifficultyButtons() {
    // (commented) initMainMenuDifficultyButtons called log removed during cleanup
    
    // Kaydedilen zorluk seviyesini UI'da göster
    updateDifficultyUI();
    
    document.getElementById('mainDiffKolay').onclick = () => {
        log.debug("===== ZORLUK DEĞİŞTİ =====");
        log.debug("YENİ ZORLUK: KOLAY");
        log.debug("Aralık: 5-9");
        log.debug("Çarpan: 2x");
        log.debug("=======================");
        currentDifficulty = 'kolay';
        debouncedSaveStats(); // Debounced kaydetme // Zorluk değiştiğinde kaydet!
        // Active class'ları güncelle (yeni tasarım için)
        document.querySelectorAll('#mainMenu .diff-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('mainDiffKolay').classList.add('active');
    };
    
    document.getElementById('mainDiffOrta').onclick = () => {
        log.debug("===== ZORLUK DEĞİŞTİ =====");
        log.debug("YENİ ZORLUK: ORTA");
        log.debug("Aralık: 10-11");
        log.debug("Çarpan: 2x");
        log.debug("=======================");
        currentDifficulty = 'orta';
        debouncedSaveStats(); // Debounced kaydetme // Zorluk değiştiğinde kaydet!
        // Active class'ları güncelle (yeni tasarım için)
        document.querySelectorAll('#mainMenu .diff-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('mainDiffOrta').classList.add('active');
    };
    
    document.getElementById('mainDiffZor').onclick = () => {
        log.debug("===== ZORLUK DEĞİŞTİ =====");
        log.debug("YENİ ZORLUK: ZOR");
        log.debug("Aralık: 12-21");
        log.debug("Çarpan: 2x");
        log.debug("=======================");
        currentDifficulty = 'zor';
        debouncedSaveStats(); // Debounced kaydetme // Zorluk değiştiğinde kaydet!
        // Active class'ları güncelle (yeni tasarım için)
        document.querySelectorAll('#mainMenu .diff-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('mainDiffZor').classList.add('active');
    };
}

// ============ ANA MENÜ NAVİGASYONU ============
// Kelime Çevir modu - oyun modları seçici ile başlar
elements.kelimeCevirBtn.onclick = async () => {
    // Tutorial göster (ilk kez oynanıyorsa)
    showGameTutorial('kelime-cevir', async () => {
        log.game('📚 === KELİME ÇEVİR OYUNU BAŞLATILIYOR ===');
        log.game('📋 1. Veri kontrol ediliyor...');
        
        // Lazy loading: Kelime verilerini yükle
        try {
            await loadKelimeData();
        } catch (error) {
            log.warn('❌ Kelime verileri yüklenemedi!');
            showCustomAlert('Kelime verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
            return;
        }
        
        if (!kelimeBulData || kelimeBulData.length === 0) {
            log.warn('❌ Kelime verileri yüklenemedi!');
            showCustomAlert('Kelime verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
            return;
        }
        log.game(`✅ Kelime verileri OK: ${kelimeBulData.length} kelime mevcut`);
        log.game(`🎯 Mevcut zorluk: ${currentDifficulty}`);
        
        // Önce tüm modalları kapat
        closeAllModals();
        
        log.game('📋 2. Mode Selector açılıyor...');
        hideAllModes();
        // Main menu'yu gizle
        if (elements.mainMenu) elements.mainMenu.style.display = 'none';
        if (elements.modeSelector) elements.modeSelector.style.display = 'block';
        if (elements.settingsBtn) elements.settingsBtn.style.display = 'block';
        log.game('✅ Mode Selector açıldı!');
    });
};

// Dinle ve Bul modu - Doğrudan başlat
elements.dinleBulBtn.onclick = async () => {
    // Tutorial göster (ilk kez oynanıyorsa)
    showGameTutorial('dinle-bul', async () => {
        // Önce tüm modalları kapat
        closeAllModals();
        
        log.game('🔥 === DINLE VE BUL OYUNU BAŞLATILIYOR ===');
    log.game('📋 1. Veri kontrol ediliyor...');
    
    // Lazy loading: Kelime verilerini yükle
    try {
        await loadKelimeData();
    } catch (error) {
        log.warn('❌ Kelime verileri yüklenemedi!');
        showCustomAlert('Kelime verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    
    if (!kelimeBulData || kelimeBulData.length === 0) {
        log.warn('❌ Kelime verileri yüklenemedi!');
        showCustomAlert('Kelime verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    log.game(`✅ Kelime verileri OK: ${kelimeBulData.length} kelime mevcut`);
    
    log.game('📋 2. Zorluk seviyesi kontrol ediliyor...');
    log.game(`🎯 Mevcut zorluk: ${currentDifficulty}`);
    log.game(`🎯 Zorluk config:`, CONFIG.difficultyLevels[currentDifficulty]);
    
    log.game('📋 3. UI değiştiriliyor...');
    hideAllModes();
    // Main menu'yu de gizle
    if (elements.mainMenu) elements.mainMenu.style.display = 'none';
    if (elements.dinleMode) {
        elements.dinleMode.style.display = 'block';
        
        // Navigasyon bar'ı gizle (oyun başladığında)
        hideBottomNavBar();
        
        // Ses tanıma sistemini başlat
        initSpeechRecognition();
        elements.dinleMode.style.zIndex = '';
    }
    log.game('✅ UI değişikliği tamamlandı');
    
    log.game('📋 4. Oyun değişkenleri sıfırlanıyor...');
    log.game(`🔄 Önceki değerler: score=${dinleScore}, correct=${dinleCorrect}, wrong=${dinleWrong}, questionCount=${dinleQuestionCount}`);
    // Dinle modunu başlat
    dinleScore = 0;
    dinleCorrect = 0;
    dinleWrong = 0;
    dinleQuestionCount = 0;
    log.game(`✅ Yeni değerler: score=${dinleScore}, correct=${dinleCorrect}, wrong=${dinleWrong}, questionCount=${dinleQuestionCount}`);
    log.game(`📊 Session değerler: sessionScore=${sessionScore}, sessionCorrect=${sessionCorrect}, sessionWrong=${sessionWrong}`);
    
    // Header score güncelle (oyun başında)
    const dinleHeaderScore = document.getElementById('dinleHeaderScore');
    if (dinleHeaderScore) {
        const currentStarPoints = Math.floor(totalPoints / 100);
        dinleHeaderScore.textContent = `⭐ ${currentStarPoints}`;
    }
    
    // Audio butonu event handler
    if (elements.dinleAudioBtn) {
        // Masaüstü için onclick
        elements.dinleAudioBtn.onclick = () => {
            if (currentDinleQuestion && currentDinleQuestion.ses_dosyasi) {
                playAudio(currentDinleQuestion.ses_dosyasi, elements.dinleAudioBtn);
            }
        };
        // Mobil için touchend
        elements.dinleAudioBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentDinleQuestion && currentDinleQuestion.ses_dosyasi) {
                playAudio(currentDinleQuestion.ses_dosyasi, elements.dinleAudioBtn);
            }
        }, { passive: false });
    }
    
    // Mikrofon butonu event listener
    const dinleMicBtn = document.getElementById('dinleMicBtn');
    if (dinleMicBtn) {
        const isMobile = isMobileDevice();
        let micButtonClicked = false; // Çift tıklamayı önlemek için
        
        const handleMicClick = async (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Çift tıklamayı önle
            if (micButtonClicked) {
                log.debug('⏭️ Mikrofon butonu zaten tıklandı, atlanıyor');
                return;
            }
            
            micButtonClicked = true;
            setTimeout(() => {
                micButtonClicked = false;
            }, 1000); // 1 saniye içinde tekrar tıklamayı engelle
            
            await startSpeechRecognition();
        };
        
        // Mobilde sadece touchend, masaüstünde sadece onclick
        if (isMobile) {
            dinleMicBtn.addEventListener('touchend', handleMicClick, { passive: false });
        } else {
            dinleMicBtn.onclick = handleMicClick;
        }
    }
    
    // Next butonu event handler'ını buraya taşıdık
    if (elements.dinleNextBtn) {
        // Masaüstü için onclick
        elements.dinleNextBtn.onclick = () => {
            log.debug(`🔄 === NEXT BUTONU TIKLANDI! ===`);
            log.debug(`📊 Mevcut durum: dinleQuestionCount=${dinleQuestionCount}/${DINLE_MAX_QUESTIONS}`);
            
            // 10 soru kontrolü - butona tıklamadan önce kontrol et
            if (dinleQuestionCount >= DINLE_MAX_QUESTIONS) {
                log.game(`🏁 === OYUN BİTİŞİ (NEXT BUTONU) ===`);
                log.game(`✅ ${DINLE_MAX_QUESTIONS} soru tamamlandı!`);
                
                // NOT: dinleBul zaten her doğru cevapta updateTaskProgress('dinleBul', 1) ile artırılıyor (satır 10025)
                // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
                // updateTaskProgress('dinleBul', sessionCorrect);
                
                // Session puanlarını global'e aktar
                addToGlobalPoints(sessionScore, sessionCorrect);
                
                // Direkt ana menüye dön
                elements.dinleMode.style.display = 'none';
                elements.mainMenu.style.display = 'block';
                
                // Navigasyon bar'ı göster
                showBottomNavBar();
                
                // Oyun değişkenlerini temizle
                dinleScore = 0;
                dinleCorrect = 0;
                dinleWrong = 0;
                dinleQuestionCount = 0;
                updateDinleUI();
                log.game(`✅ Oyun bitti ve ana menüye dönüldü!`);
                return;
            }
            
            log.debug(`🎯 Bir sonraki soru yükleniyor...`);
            // Butonu hemen gizle
            if (elements.dinleNextBtn) {
                elements.dinleNextBtn.style.display = 'none';
                elements.dinleNextBtn.classList.remove("next-appear");
            }
            loadDinleQuestion();
        };
        // Mobil için touchend
        elements.dinleNextBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            log.debug(`🔄 === NEXT BUTONU TIKLANDI! ===`);
            log.debug(`📊 Mevcut durum: dinleQuestionCount=${dinleQuestionCount}/${DINLE_MAX_QUESTIONS}`);
            
            // 10 soru kontrolü - butona tıklamadan önce kontrol et
            if (dinleQuestionCount >= DINLE_MAX_QUESTIONS) {
                log.game(`🏁 === OYUN BİTİŞİ (NEXT BUTONU) ===`);
                log.game(`✅ ${DINLE_MAX_QUESTIONS} soru tamamlandı!`);
                
                // NOT: dinleBul zaten her doğru cevapta updateTaskProgress('dinleBul', 1) ile artırılıyor (satır 10025)
                // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
                // updateTaskProgress('dinleBul', sessionCorrect);
                
                // Session puanlarını global'e aktar
                addToGlobalPoints(sessionScore, sessionCorrect);
                
                // Direkt ana menüye dön
                elements.dinleMode.style.display = 'none';
                elements.mainMenu.style.display = 'block';
                
                // Navigasyon bar'ı göster
                showBottomNavBar();
                
                // Oyun değişkenlerini temizle
                dinleScore = 0;
                dinleCorrect = 0;
                dinleWrong = 0;
                dinleQuestionCount = 0;
                updateDinleUI();
                log.game(`✅ Oyun bitti ve ana menüye dönüldü!`);
                return;
            }
            
            log.debug(`🎯 Bir sonraki soru yükleniyor...`);
            // Butonu hemen gizle
            if (elements.dinleNextBtn) {
                elements.dinleNextBtn.style.display = 'none';
                elements.dinleNextBtn.classList.remove("next-appear");
            }
            loadDinleQuestion();
        }, { passive: false });
    }
    
        updateDinleUI();
        loadDinleQuestion();
    });
};

// Boşluk Doldur modu
elements.boslukDoldurBtn.onclick = async () => {
    // Tutorial göster (ilk kez oynanıyorsa)
    showGameTutorial('bosluk-doldur', async () => {
        // Önce tüm modalları kapat
        closeAllModals();
        
        log.debug('📋 === BOŞLUK DOLDUR OYUNU BAŞLATILIYOR ===');
    log.debug('📋 1. Veri kontrol ediliyor...');

    // Lazy loading: Ayet verilerini yükle
    try {
        await loadAyetData();
    } catch (error) {
        log.error('❌ Ayet verileri yüklenemedi!');
        showCustomAlert('Ayet verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    
    if (!ayetOkuData || ayetOkuData.length === 0) {
        log.error('❌ Ayet verileri yüklenemedi!');
        showCustomAlert('Ayet verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    log.debug(`✅ Ayet verileri OK: ${ayetOkuData.length} ayet mevcut`);
    log.debug(`🎯 Mevcut zorluk: ${currentDifficulty}`);

    log.debug('📋 2. UI değiştiriliyor...');
    hideAllModes();
    // Main menu'yu de gizle
    if (elements.mainMenu) elements.mainMenu.style.display = 'none';
    if (elements.boslukMode) {
        elements.boslukMode.style.display = 'block';
        
        // Navigasyon bar'ı gizle (oyun başladığında)
        hideBottomNavBar();
        
        elements.boslukMode.style.zIndex = '';
    }
    log.debug('✅ UI değişikliği tamamlandı');

    log.debug('📋 3. Oyun değişkenleri sıfırlanıyor...');
    log.debug(`🔄 Önceki değerler: score=${boslukScore}, correct=${boslukCorrect}, wrong=${boslukWrong}`);
    // Boşluk modunu başlat
    boslukScore = 0;
    boslukCorrect = 0;
    boslukWrong = 0;
    log.debug(`✅ Yeni değerler: score=${boslukScore}, correct=${boslukCorrect}, wrong=${boslukWrong}`);
    
    // Header score güncelle (oyun başında)
    const boslukHeaderScore = document.getElementById('boslukHeaderScore');
    if (boslukHeaderScore) {
        const currentStarPoints = Math.floor(totalPoints / 100);
        boslukHeaderScore.textContent = `⭐ ${currentStarPoints}`;
    }
    log.debug(`📊 Session değerler: sessionScore=${sessionScore}, sessionCorrect=${sessionCorrect}, sessionWrong=${sessionWrong}`);
    
        updateBoslukUI();
        loadBoslukQuestion();
    });
};

// Dua Et modu
elements.duaEtBtn.onclick = async () => {
    // Tutorial göster (ilk kez oynanıyorsa)
    showGameTutorial('dua-ogren', async () => {
        // Önce tüm modalları kapat
        closeAllModals();
    
    // Lazy loading: Dua verilerini yükle
    try {
        await loadDuaData();
    } catch (error) {
        showCustomAlert('Dua verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    
    if (!duaData || duaData.length === 0) {
        showCustomAlert('Dua verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    hideAllModes();
    // Main menu'yu de gizle
    if (elements.mainMenu) elements.mainMenu.style.display = 'none';
    if (elements.duaMode) {
        elements.duaMode.style.display = 'block';
        elements.duaMode.style.zIndex = '';
        
        // Navigasyon bar'ı gizle (okuma modu başladığında)
        hideBottomNavBar();
    }
    // Soru sayısını başlat (ilk gösterim 1. soru)
    duaQuestionCount = 1;
    // Rastgele dua ile başla - array length check
    if (!duaData || duaData.length === 0) {
        showCustomAlert('Dua verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
        currentDuaIndex = Math.floor(Math.random() * duaData.length);
        showDua(false); // İlk gösterimde soru sayısını artırma
    });
};

// Ayet Oku modu
elements.ayetOkuBtn.onclick = async () => {
    // Tutorial göster (ilk kez oynanıyorsa)
    showGameTutorial('ayet-oku', async () => {
        // Önce tüm modalları kapat
        closeAllModals();
    
    // Lazy loading: Ayet verilerini yükle
    try {
        await loadAyetData();
    } catch (error) {
        showCustomAlert('Ayet verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    
    if (!ayetOkuData || ayetOkuData.length === 0) {
        showCustomAlert('Ayet verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    hideAllModes();
    // Main menu'yu de gizle
    if (elements.mainMenu) elements.mainMenu.style.display = 'none';
    if (elements.ayetMode) {
        elements.ayetMode.style.display = 'block';
        elements.ayetMode.style.zIndex = '';
        
        // Navigasyon bar'ı gizle (okuma modu başladığında)
        hideBottomNavBar();
    }
    // Soru sayısını başlat (ilk gösterim 1. soru)
    ayetQuestionCount = 1;
    // Rastgele ayet ile başla - array length check
    if (!ayetOkuData || ayetOkuData.length === 0) {
        showCustomAlert('Ayet verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
        currentAyetIndex = Math.floor(Math.random() * ayetOkuData.length);
        showAyet(false); // İlk gösterimde soru sayısını artırma
    });
};

// Hadis Oku modu
elements.hadisOkuBtn.onclick = async () => {
    // Tutorial göster (ilk kez oynanıyorsa)
    showGameTutorial('hadis-oku', async () => {
        // Önce tüm modalları kapat
        closeAllModals();
    
    // Lazy loading: Hadis verilerini yükle
    try {
        await loadHadisData();
    } catch (error) {
        showCustomAlert('Hadis verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    
    if (!hadisData || hadisData.length === 0) {
        showCustomAlert('Hadis verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    hideAllModes();
    // Main menu'yu de gizle
    if (elements.mainMenu) elements.mainMenu.style.display = 'none';
    if (elements.hadisMode) {
        elements.hadisMode.style.display = 'block';
        elements.hadisMode.style.zIndex = '';
        
        // Navigasyon bar'ı gizle (okuma modu başladığında)
        hideBottomNavBar();
    }
    // Soru sayısını başlat (ilk gösterim 1. soru)
    hadisQuestionCount = 1;
    // Rastgele hadis ile başla - array length check
    if (!hadisData || hadisData.length === 0) {
        showCustomAlert('Hadis verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
        currentHadisIndex = Math.floor(Math.random() * hadisData.length);
        showHadis(false); // İlk gösterimde soru sayısını artırma
    });
};

// Geri butonları
elements.backToMenuBtn.onclick = () => {
    goToMainMenu(); // Ana menüye dönüş fonksiyonunu kullan
};

if (elements.backFromGameBtn) {
elements.backFromGameBtn.onclick = async () => {
        forceLog('=== GERI BUTONU TIKLANDI (KELIME CEVIR) ===');
        try {
            forceLog('[1] Ses durduruluyor...');
    stopCurrentAudio();
    
            forceLog('[2] Timer durduruluyor...');
            stopTimer();
            
            forceLog('[3] Skor kontrol:', 'Score=' + sessionScore, 'Dogru=' + sessionCorrect, 'Yanlis=' + sessionWrong);
            
            if (sessionScore > 0 || sessionCorrect > 0 || sessionWrong > 0) {
                forceLog('[4] Puan VAR - Modal gosteriliyor...');
        const confirmed = await showCustomConfirm(sessionCorrect, sessionWrong, sessionScore);
                forceLog('[5] Modal sonucu:', confirmed ? 'ONAYLANDI' : 'IPTAL EDILDI');
        
                if (!confirmed) {
                    forceLog('[6] IPTAL - Cikis yapilmiyor');
                    return;
                }
                
                forceLog('[7] ONAYLANDI - Istatistikler kaydediliyor...');
                
                // Session değerlerini daily değerlere ekle (modal onaylandığında)
                // addSessionPoints ve addSessionWrong zaten güncelliyor ama emin olmak için tekrar kontrol et
                if (sessionCorrect > 0) {
                    const currentDailyCorrect = parseInt(localStorage.getItem('dailyCorrect')) || 0;
                    // Eğer sessionCorrect henüz eklenmemişse ekle (güvenlik için)
                    const newDailyCorrect = Math.max(currentDailyCorrect, sessionCorrect);
                    if (newDailyCorrect !== currentDailyCorrect) {
                        localStorage.setItem('dailyCorrect', newDailyCorrect.toString());
                        forceLog(`[7.1] dailyCorrect güncellendi: ${currentDailyCorrect} -> ${newDailyCorrect}`);
                    }
                }
                
                if (sessionWrong > 0) {
                    const currentDailyWrong = parseInt(localStorage.getItem('dailyWrong')) || 0;
                    // Eğer sessionWrong henüz eklenmemişse ekle (güvenlik için)
                    const newDailyWrong = Math.max(currentDailyWrong, sessionWrong);
                    if (newDailyWrong !== currentDailyWrong) {
                        localStorage.setItem('dailyWrong', newDailyWrong.toString());
                        forceLog(`[7.2] dailyWrong güncellendi: ${currentDailyWrong} -> ${newDailyWrong}`);
                    }
                }
                
                // Günlük istatistikleri kaydet (modal onaylandığında)
                if (typeof saveDailyStats === 'function') {
                    forceLog('[7.3] saveDailyStats çağrılıyor...');
                    saveDailyStats();
                    forceLog('[7.4] saveDailyStats tamamlandı');
                } else {
                    forceLog('[7.3] ⚠️ saveDailyStats fonksiyonu bulunamadı!');
                }
            } else {
                forceLog('[4] Puan YOK - Direkt cikis');
        }
        
            forceLog('[8] State\'ler sifirlaniyor...');
        sessionScore = 0;
        sessionCorrect = 0;
        sessionWrong = 0;
        comboCount = 0;
            questionCount = 0;
            score = 0;
            correct = 0;
            wrong = 0;
            lives = 0;
            timeLeft = 0;
            
            updateUI();
            // updateLoadingProgress() kaldırıldı - geri butonunda gerekli değil
            
            forceLog('[9] Ekranlar gizleniyor...');
    if (elements.gameScreen) elements.gameScreen.style.display = 'none';
    if (elements.modeSelector) elements.modeSelector.style.display = 'none';
    if (elements.mainMenu) {
        elements.mainMenu.removeAttribute('style');
        elements.mainMenu.style.display = 'block';
    }
    if (elements.settingsBtn) elements.settingsBtn.style.display = 'none';
    
    // Navigasyon bar'ı göster (ana ekrana dönünce)
    showBottomNavBar();
    
            forceLog('[10] TAMAMLANDI - Ana menuye donuldu!');
        } catch (error) {
            log.error('HATA - Geri butonu:', error);
            log.error('HATA - Stack:', error.stack);
            hideAllModes();
            if (elements.mainMenu) {
                elements.mainMenu.style.display = 'block';
            }
            
            // Navigasyon bar'ı göster (ana ekrana dönünce)
            showBottomNavBar();
        }
    };
} else {
    log.warn('⚠️ backFromGameBtn elementi bulunamadı!');
}

if (elements.backFromAyetBtn) {
    elements.backFromAyetBtn.onclick = () => {
        stopCurrentAudio(); // Mevcut ses varsa durdur
        hideAllModes();
        if (elements.mainMenu) {
            elements.mainMenu.removeAttribute('style');
            elements.mainMenu.style.display = 'block';
        }
        if (elements.settingsBtn) elements.settingsBtn.style.display = 'none';
        
        // Navigasyon bar'ı göster (ana ekrana dönünce)
        showBottomNavBar();
    };
}

if (elements.backFromDuaBtn) {
        elements.backFromDuaBtn.onclick = () => {
        log.debug('⬅️ Dua geri butonuna tıklandı');
        stopCurrentAudio(); // Mevcut ses varsa durdur
        hideAllModes();
        if (elements.mainMenu) {
            elements.mainMenu.removeAttribute('style');
            elements.mainMenu.style.display = 'block';
        }
        if (elements.settingsBtn) elements.settingsBtn.style.display = 'none';
        
        // Navigasyon bar'ı göster (ana ekrana dönünce)
        showBottomNavBar();
        
        log.debug('✅ Ana menüye döndü');
    };
}

if (elements.backFromHadisBtn) {
    elements.backFromHadisBtn.onclick = () => {
        stopCurrentAudio(); // Mevcut ses varsa durdur
        hideAllModes();
        if (elements.mainMenu) {
            elements.mainMenu.removeAttribute('style');
            elements.mainMenu.style.display = 'block';
        }
        if (elements.settingsBtn) elements.settingsBtn.style.display = 'none';
        
        // Navigasyon bar'ı göster (ana ekrana dönünce)
        showBottomNavBar();
    };
}

if (elements.backFromBoslukBtn) {
elements.backFromBoslukBtn.onclick = async () => {
        forceLog('=== GERI BUTONU TIKLANDI (BOSLUK DOLDUR) ===');
        try {
            forceLog('[1] Ses durduruluyor...');
    stopCurrentAudio();
    
            forceLog('[2] Timer durduruluyor...');
            stopTimer();
            
            forceLog('[3] Skor kontrol:', 'Score=' + boslukScore, 'Dogru=' + boslukCorrect, 'Yanlis=' + boslukWrong);
            
            if (boslukScore > 0 || boslukCorrect > 0 || boslukWrong > 0) {
                forceLog('[4] Puan VAR - Modal gosteriliyor...');
        const confirmed = await showCustomConfirm(boslukCorrect, boslukWrong, boslukScore);
                forceLog('[5] Modal sonucu:', confirmed ? 'ONAYLANDI' : 'IPTAL EDILDI');
        
                if (!confirmed) {
                    forceLog('[6] IPTAL - Cikis yapilmiyor');
                    return;
                }
                
                forceLog('[7] ONAYLANDI - Istatistikler kaydediliyor...');
                
                // Boşluk Doldur session değerlerini daily değerlere ekle
                if (boslukCorrect > 0) {
                    const currentDailyCorrect = parseInt(localStorage.getItem('dailyCorrect')) || 0;
                    localStorage.setItem('dailyCorrect', (currentDailyCorrect + boslukCorrect).toString());
                    forceLog(`[7.1] dailyCorrect güncellendi (bosluk): ${currentDailyCorrect} + ${boslukCorrect} = ${currentDailyCorrect + boslukCorrect}`);
                }
                
                if (boslukWrong > 0) {
                    const currentDailyWrong = parseInt(localStorage.getItem('dailyWrong')) || 0;
                    localStorage.setItem('dailyWrong', (currentDailyWrong + boslukWrong).toString());
                    forceLog(`[7.2] dailyWrong güncellendi (bosluk): ${currentDailyWrong} + ${boslukWrong} = ${currentDailyWrong + boslukWrong}`);
                }
                
                // Günlük istatistikleri kaydet (modal onaylandığında)
                if (typeof saveDailyStats === 'function') {
                    forceLog('[7.3] saveDailyStats çağrılıyor...');
                    saveDailyStats();
                    forceLog('[7.4] saveDailyStats tamamlandı');
                } else {
                    forceLog('[7.3] ⚠️ saveDailyStats fonksiyonu bulunamadı!');
                }
        if (boslukCorrect > 0) {
            // NOT: boslukDoldur zaten her doğru cevapta updateTaskProgress('boslukDoldur', 1) ile artırılıyor (satır 10411)
            // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
            // updateTaskProgress('boslukDoldur', boslukCorrect);
            // NOT: toplamDogru zaten addSessionPoints'te gerçek zamanlı olarak ekleniyor
            // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
            // updateTaskProgress('toplamDogru', boslukCorrect);
                }
            } else {
                forceLog('[4] Puan YOK - Direkt cikis');
        }
        
            forceLog('[8] State\'ler sifirlaniyor...');
        boslukScore = 0;
        boslukCorrect = 0;
        boslukWrong = 0;
            boslukQuestionCount = 0;
        sessionScore = 0;
        sessionCorrect = 0;
        sessionWrong = 0;
        comboCount = 0;
    
            updateBoslukUI();
            
            forceLog('[9] Ekranlar gizleniyor...');
    hideAllModes();
    if (elements.mainMenu) {
        elements.mainMenu.removeAttribute('style');
        elements.mainMenu.style.display = 'block';
    }
    if (elements.settingsBtn) elements.settingsBtn.style.display = 'none';
    
    // Navigasyon bar'ı göster (ana ekrana dönünce)
    showBottomNavBar();
    
            forceLog('[10] TAMAMLANDI - Ana menuye donuldu!');
        } catch (error) {
            log.error('HATA - Bosluk geri butonu:', error);
            log.error('HATA - Stack:', error.stack);
            hideAllModes();
            if (elements.mainMenu) {
                elements.mainMenu.style.display = 'block';
            }
            
            // Navigasyon bar'ı göster (ana ekrana dönünce)
            showBottomNavBar();
        }
    };
} else {
    log.warn('⚠️ backFromBoslukBtn elementi bulunamadı!');
}

if (elements.backFromDinleBtn) {
elements.backFromDinleBtn.onclick = async () => {
        forceLog('=== GERI BUTONU TIKLANDI (DINLE) ===');
        try {
            forceLog('[1] Ses durduruluyor...');
    stopCurrentAudio();
    
            forceLog('[2] Timer durduruluyor...');
            stopTimer();
            
            forceLog('[3] Skor kontrol:', 'Score=' + dinleScore, 'Dogru=' + dinleCorrect, 'Yanlis=' + dinleWrong);
            
            if (dinleScore > 0 || dinleCorrect > 0 || dinleWrong > 0) {
                forceLog('[4] Puan VAR - Modal gosteriliyor...');
        const confirmed = await showCustomConfirm(dinleCorrect, dinleWrong, dinleScore);
                forceLog('[5] Modal sonucu:', confirmed ? 'ONAYLANDI' : 'IPTAL EDILDI');
        
                if (!confirmed) {
                    forceLog('[6] IPTAL - Cikis yapilmiyor');
                    return;
                }
                
                forceLog('[7] ONAYLANDI - Istatistikler kaydediliyor...');
                
                // Dinle Bul session değerlerini daily değerlere ekle
                if (dinleCorrect > 0) {
                    const currentDailyCorrect = parseInt(localStorage.getItem('dailyCorrect')) || 0;
                    localStorage.setItem('dailyCorrect', (currentDailyCorrect + dinleCorrect).toString());
                    forceLog(`[7.1] dailyCorrect güncellendi (dinle): ${currentDailyCorrect} + ${dinleCorrect} = ${currentDailyCorrect + dinleCorrect}`);
                }
                
                if (dinleWrong > 0) {
                    const currentDailyWrong = parseInt(localStorage.getItem('dailyWrong')) || 0;
                    localStorage.setItem('dailyWrong', (currentDailyWrong + dinleWrong).toString());
                    forceLog(`[7.2] dailyWrong güncellendi (dinle): ${currentDailyWrong} + ${dinleWrong} = ${currentDailyWrong + dinleWrong}`);
                }
                
                // Günlük istatistikleri kaydet (modal onaylandığında)
                if (typeof saveDailyStats === 'function') {
                    forceLog('[7.3] saveDailyStats çağrılıyor...');
                    saveDailyStats();
                    forceLog('[7.4] saveDailyStats tamamlandı');
                } else {
                    forceLog('[7.3] ⚠️ saveDailyStats fonksiyonu bulunamadı!');
                }
        if (dinleCorrect > 0) {
            // NOT: dinleBul zaten her doğru cevapta updateTaskProgress('dinleBul', 1) ile artırılıyor (satır 10025)
            // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
            // updateTaskProgress('dinleBul', dinleCorrect);
            // NOT: toplamDogru zaten addSessionPoints'te gerçek zamanlı olarak ekleniyor
            // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
            // updateTaskProgress('toplamDogru', dinleCorrect);
                }
            } else {
                forceLog('[4] Puan YOK - Direkt cikis');
        }
        
            forceLog('[8] State\'ler sifirlaniyor...');
        dinleScore = 0;
        dinleCorrect = 0;
        dinleWrong = 0;
            dinleQuestionCount = 0;
        sessionScore = 0;
        sessionCorrect = 0;
        sessionWrong = 0;
        comboCount = 0;
    
            updateDinleUI();
            
            forceLog('[9] Ekranlar gizleniyor...');
    hideAllModes();
    if (elements.mainMenu) {
        elements.mainMenu.removeAttribute('style');
        elements.mainMenu.style.display = 'block';
    }
    if (elements.settingsBtn) {
        elements.settingsBtn.style.display = 'none';
            }
    
    // Navigasyon bar'ı göster (ana ekrana dönünce)
    showBottomNavBar();
    
            forceLog('[10] TAMAMLANDI - Ana menuye donuldu!');
        } catch (error) {
            log.error('HATA - Dinle geri butonu:', error);
            log.error('HATA - Stack:', error.stack);
            hideAllModes();
            if (elements.mainMenu) {
                elements.mainMenu.style.display = 'block';
            }
            
            // Navigasyon bar'ı göster (ana ekrana dönünce)
            showBottomNavBar();
        }
    };
} else {
    log.warn('⚠️ backFromDinleBtn elementi bulunamadı!');
}

// ============ MOD SEÇİCİYİ BAŞLAT (Sadece Kelime Çevir için) ============
function initModeSelector() {
    // Sadece Kelime Çevir oyun modlarını oluştur
    Object.keys(CONFIG.gameModes).forEach(modeKey => {
        const mode = CONFIG.gameModes[modeKey];
        const btn = document.createElement('button');
        btn.className = 'mode-btn';
        if (modeKey === currentMode) btn.classList.add('active');
        btn.innerHTML = `<strong>${mode.name}</strong><small>${mode.description}</small>`;
        btn.onclick = () => selectMode(modeKey);
        elements.modeButtons.appendChild(btn);
    });
}

// ============ MOD SEÇ ============
function selectMode(modeKey) {
    currentMode = modeKey;
    // "Zorluk" modu seçildiğinde otomatik olarak zorluk seviyesini 'zor' yap
    if (modeKey === 'zorluk') {
        currentDifficulty = 'zor';
        log.debug('🔥 Zorluk modu seçildi, zorluk seviyesi "zor" olarak ayarlandı');
    }
    debouncedSaveStats(); // Debounced kaydetme // Mod değiştiğinde kaydet!
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.mode-btn').classList.add('active');
}

// ============ OYUNU BAŞLAT ============
if (elements.startBtn) {
elements.startBtn.onclick = () => {
    const mode = CONFIG.gameModes[currentMode];
    
    // Ayarları uygula
    lives = mode.lives;
    
    // Kalplerin görünürlüğünü kontrol et
    // Sadece: (Mod: "hayat") VEYA (Mod: "zorluk" VE zorluk: "zor")
    const duolingoHearts = document.getElementById('duolingoHearts');
    const shouldShowHearts = (currentMode === 'hayat') || (currentMode === 'zorluk' && currentDifficulty === 'zor');
    
    if (duolingoHearts) {
        if (shouldShowHearts && lives > 0) {
            duolingoHearts.style.display = 'flex';
            // Kalpleri başlangıç değerine ayarla
            const heartSpans = duolingoHearts.querySelectorAll('span');
            heartSpans.forEach((heart, index) => {
                if (index < lives) {
                    heart.style.opacity = '1';
                } else {
                    heart.style.opacity = '0.3';
                }
            });
        } else {
            duolingoHearts.style.display = 'none';
        }
    }
    
    if (lives > 0) {
        if (elements.livesDisplay) elements.livesDisplay.style.display = 'block';
        if (elements.lives) elements.lives.textContent = lives;
    } else {
        if (elements.livesDisplay) elements.livesDisplay.style.display = 'none';
    }

    if (mode.timeLimit > 0) {
        if (elements.timerDisplay) elements.timerDisplay.style.display = 'block';
    } else {
        if (elements.timerDisplay) elements.timerDisplay.style.display = 'none';
    }

    if (mode.showHint) {
        if (elements.hintBtn) elements.hintBtn.style.display = 'block';
    } else {
        if (elements.hintBtn) elements.hintBtn.style.display = 'none';
    }

    if (elements.currentMode) elements.currentMode.textContent = mode.name;

    // Session puanlarını sıfırla (global puanları koru)
    sessionScore = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    comboCount = 0;
    questionCount = 0;
    
    // Combo indicator'ı gizle
    hideCombo();
    
    // Geriye uyumluluk için eski değişkenleri de sıfırla
    score = 0;
    correct = 0;
    wrong = 0;
    
    // Cevap pozisyon geçmişini sıfırla (yeni oyun başladığında)
    recentAnswerPositions = [];

    updateUI();

    // Ekranları değiştir - Sadece Kelime Çevir oyunu başlat
    if (elements.modeSelector) elements.modeSelector.style.display = 'none';
    // Main menu'yu da gizle (eğer hala açıksa)
    if (elements.mainMenu) elements.mainMenu.style.display = 'none';
    if (elements.gameScreen) elements.gameScreen.style.display = 'block';
    
    // Navigasyon bar'ı gizle (oyun başladığında)
    hideBottomNavBar();
    
        // 🎮 Gesture sistemini başlat
        /* gestures removed per cleanup: swipe gestures intentionally disabled
            Kept commented init call so code can be re-enabled in future if needed. */
        // initGameGestures();
    
    // ⚡ Speed animation ile yeni soruyu yükle
    if (elements.gameScreen) {
    addSpeedAnimation(elements.gameScreen, 'slide-up');
    }
    
    loadQuestion();
};
}

// ============ AYARLARA DÖN ============
if (elements.settingsBtn) {
    elements.settingsBtn.onclick = () => {
        stopTimer();
        elements.gameScreen.style.display = 'none';
        elements.modeSelector.style.display = 'block';
    };
}

// ============ SORU YÜKLEME (Kelime Çevir) ============
function loadQuestion() {
    // Önceki ses varsa durdur
    stopCurrentAudio();
    
    // İpucu kullanımını sıfırla (yeni soru için)
    hintUsed = false;
    if (elements.hintBtn) {
        elements.hintBtn.disabled = false;
    }
    
    log.debug('📚 === KELİME ÇEVİR SORU YÜKLENİYOR (AKILLI SEÇİM) ===');
    log.debug(`📊 Mevcut soru sayısı: ${questionCount}`);
    log.debug(`🎯 Mevcut mod: ${currentMode}`);
    log.debug(`🎯 Zorluk: ${currentDifficulty}`);
    
    const mode = CONFIG.gameModes[currentMode];
    log.debug(`📋 Mod detayları:`, mode);
    
    // Soru sayısı kontrolü - oyun bitirme
    if (questionCount >= mode.questionsPerLevel) {
        log.game(`🏁 === KELİME ÇEVİR OYUNU BİTTİ ===`);
        log.game(`✅ ${mode.questionsPerLevel} soru tamamlandı!`);
        log.game(`📊 Final session score: ${sessionScore}`);
        
        // NOT: kelimeCevir zaten her doğru cevapta updateTaskProgress('kelimeCevir', 1) ile artırılıyor (satır 8333)
        // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
        // updateTaskProgress('kelimeCevir', sessionCorrect);
        
        // Session puanlarını global'e aktar
        log.game(`💰 Session puanları global'e aktarılıyor: ${sessionScore} puan`);
        addToGlobalPoints(sessionScore, sessionCorrect);
        
        // Direkt ana menüye dön (popup yok)
        log.debug(`🔄 Ana menüye dönülüyor...`);
        elements.gameScreen.style.display = 'none';
        elements.modeSelector.style.display = 'none';
        elements.mainMenu.style.display = 'block';
        
        // Navigasyon bar'ı göster (ana ekrana dönünce)
        showBottomNavBar();
        
        log.game(`✅ Kelime Çevir oyunu bitti ve ana menüye dönüldü!`);
        return;
    }

    // Can kontrolü
    if (mode.lives > 0 && lives <= 0) {
        log.game(`💀 Can bitti! Oyun sona eriyor...`);
        gameOver('Can bitti!');
        return;
    }

    log.debug(`🔍 Zorluk filtreleme başlıyor...`);
    log.debug(`🎯 Seçili zorluk: ${currentDifficulty}`);

    // Zorluk filtreleme
    const diffLevel = CONFIG.difficultyLevels[currentDifficulty];
    log.debug(`📋 Zorluk aralığı: ${diffLevel.minDiff}-${diffLevel.maxDiff}`);
    log.debug(`📦 Toplam kelime sayısı: ${kelimeBulData.length}`);

    let filteredData = kelimeBulData.filter(w => 
        w.difficulty >= diffLevel.minDiff && w.difficulty <= diffLevel.maxDiff
    );
    log.debug(`✅ Zorluk filtresi sonrası: ${filteredData.length} kelime`);

    // Mod özel zorluk kontrolü
    if (mode.minDifficulty) {
        log.debug(`📋 Mod minimum zorluk kontrolü: >= ${mode.minDifficulty}`);
        filteredData = filteredData.filter(w => w.difficulty >= mode.minDifficulty);
        log.debug(`✅ Mod filtresi sonrası: ${filteredData.length} kelime`);
    }

    if (filteredData.length === 0) {
        filteredData = kelimeBulData;
    }

    // AKILLI KELİME SEÇİMİ - Zorlanılan kelimeleri daha sık göster
    log.debug('🧠 Akıllı kelime seçimi başlıyor...');
    currentQuestion = selectIntelligentWord(filteredData);

    // SEÇİLEN KELİME DETAYLARI
    log.debug("===== SEÇİLEN KELİME =====");
    log.debug("Kelime:", currentQuestion.kelime);
    log.debug("Anlam:", currentQuestion.anlam);
    log.debug("Zorluk:", currentQuestion.difficulty);
    log.debug("ID:", currentQuestion.id);
    log.debug("Zorluk aralığı:", diffLevel.minDiff + "-" + diffLevel.maxDiff);
    const isInRange = currentQuestion.difficulty >= diffLevel.minDiff && currentQuestion.difficulty <= diffLevel.maxDiff;
    log.debug("Aralıkta mı:", isInRange ? "EVET" : "HAYIR");
    log.debug("========================");

    // UI güncelle
    elements.arabicWord.textContent = currentQuestion.kelime;
    elements.sureInfo.textContent = `ID: ${currentQuestion.id} | Zorluk: ${currentQuestion.difficulty} | Aralık: ${diffLevel.minDiff}-${diffLevel.maxDiff}`;

    // Seçenekler oluştur
    const wrongAnswers = getWrongAnswers(3);
    const allOptions = [
        { text: currentQuestion.anlam, correct: true },
        ...wrongAnswers.map(w => ({ text: w.anlam, correct: false }))
    ];

    // Akıllı karıştır (tahmin edilmesini zorlaştırmak için)
    smartShuffle(allOptions);

    // Seçenekleri göster - Duolingo Tarzı
    elements.options.innerHTML = '';
    allOptions.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'duolingo-option';
        // Türkçe kelimeler için özel class ekle (Arapça değilse)
        if (!isArabic(opt.text)) {
            btn.classList.add('turkish-option');
        }
        btn.textContent = opt.text;
        
        // Touch event tracking (scroll/tap ayrımı için)
        let touchStart = { x: 0, y: 0, time: 0 };
        let isScrolling = false;
        
        // Masaüstü için onclick handler
        btn.onclick = () => {
            if (!btn.classList.contains('disabled')) {
                checkAnswer(btn, opt.correct);
            }
        };
        
        // Mobil için touch event'leri
        btn.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStart = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
            isScrolling = false;
        }, { passive: true });
        
        btn.addEventListener('touchmove', (e) => {
            if (touchStart.x !== 0 || touchStart.y !== 0) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchStart.x);
                const deltaY = Math.abs(touch.clientY - touchStart.y);
                // 10px'den fazla hareket varsa scroll'dur
                if (deltaX > 10 || deltaY > 10) {
                    isScrolling = true;
                }
            }
        }, { passive: true });
        
        btn.addEventListener('touchend', (e) => {
            // Scroll yapıldıysa tıklamayı engelle
            if (isScrolling) {
                touchStart = { x: 0, y: 0, time: 0 };
                isScrolling = false;
                return;
            }
            
            // Scroll değilse, tap olarak kabul et
            const touch = e.changedTouches[0];
            const deltaTime = Date.now() - touchStart.time;
            const deltaX = Math.abs(touch.clientX - touchStart.x);
            const deltaY = Math.abs(touch.clientY - touchStart.y);
            
            // Kısa süre (300ms) ve küçük hareket (10px) = tap
            if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
                e.preventDefault();
                e.stopPropagation();
                if (!btn.classList.contains('disabled')) {
                    checkAnswer(btn, opt.correct);
                }
            }
            
            touchStart = { x: 0, y: 0, time: 0 };
            isScrolling = false;
        }, { passive: false });
        
        elements.options.appendChild(btn);
    });
    
    // Duolingo tarzı soru numarasını güncelle
    const duolingoQuestionNumber = document.getElementById('duolingoQuestionNumber');
    if (duolingoQuestionNumber) {
        duolingoQuestionNumber.textContent = `Sual ${questionCount + 1} / ${mode.questionsPerLevel}`;
    }
    
    // İlerleme çubuğu kaldırıldı - soru sayısı gösterimi yeterli
    
    // Kalplerin görünürlüğünü kontrol et (her soru yüklendiğinde)
    const duolingoHearts = document.getElementById('duolingoHearts');
    const shouldShowHearts = (currentMode === 'hayat') || (currentMode === 'zorluk' && currentDifficulty === 'zor');
    if (duolingoHearts) {
        if (shouldShowHearts && mode.lives > 0) {
            duolingoHearts.style.display = 'flex';
            // Kalpleri güncelle
            const heartSpans = duolingoHearts.querySelectorAll('span');
            heartSpans.forEach((heart, index) => {
                if (index < lives) {
                    heart.style.opacity = '1';
                } else {
                    heart.style.opacity = '0.3';
                }
            });
        } else {
            duolingoHearts.style.display = 'none';
        }
    }

    // Sıfırla
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    elements.nextBtn.style.display = 'none';
    elements.hintBtn.disabled = false;
    
    // Tüm butonları aktif et
    const allBtns = document.querySelectorAll('.duolingo-option, .option');
    allBtns.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('disabled', 'correct', 'wrong');
    });

    // İlerleme güncelle
    updateProgress();

    // Süreyi başlat
    if (mode.timeLimit > 0) {
        startTimer(mode.timeLimit);
    }

    // Arapça hareke renklerini uygula
    setTimeout(() => {
        updateArabicTextColoring();
    }, 100);
}

// ============ YANLIŞ CEVAPLAR ============
function getWrongAnswers(count) {
    const wrong = [];
    const filtered = kelimeBulData.filter(w => w.id !== currentQuestion.id);
    
    while (wrong.length < count && filtered.length > 0) {
        const idx = Math.floor(Math.random() * filtered.length);
        const word = filtered[idx];
        
        if (!wrong.find(w => w.anlam === word.anlam)) {
            wrong.push(word);
        }
        filtered.splice(idx, 1);
    }
    
    return wrong;
}

// ============ KARIŞTIR ============
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// ============ AKILLI CEVAP POZİSYONU SEÇİMİ ============
// Kullanıcının tahmin etmesini zorlaştırmak için akıllı pozisyon seçimi
function getSmartAnswerPosition(totalOptions = 4) {
    // Son pozisyonları kontrol et
    const positionCounts = [0, 0, 0, 0]; // Her pozisyonun son 10 sorudaki görünme sayısı
    
    recentAnswerPositions.forEach(pos => {
        if (pos >= 0 && pos < totalOptions) {
            positionCounts[pos]++;
        }
    });
    
    // En az kullanılan pozisyonları bul
    const minCount = Math.min(...positionCounts);
    const leastUsedPositions = positionCounts
        .map((count, index) => ({ count, index }))
        .filter(item => item.count === minCount)
        .map(item => item.index);
    
    // Son pozisyonu kontrol et - üst üste aynı pozisyonda gelmesin
    const lastPosition = recentAnswerPositions.length > 0 ? recentAnswerPositions[recentAnswerPositions.length - 1] : -1;
    const availablePositions = leastUsedPositions.filter(pos => pos !== lastPosition);
    
    // Eğer son pozisyon hariç en az kullanılan pozisyon varsa, onu kullan
    let selectedPosition;
    if (availablePositions.length > 0) {
        selectedPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    } else if (leastUsedPositions.length > 0) {
        // Son pozisyon hariç seçenek yoksa, en az kullanılanlardan rastgele seç
        selectedPosition = leastUsedPositions[Math.floor(Math.random() * leastUsedPositions.length)];
    } else {
        // Fallback: tamamen rastgele
        selectedPosition = Math.floor(Math.random() * totalOptions);
    }
    
    // Pozisyon geçmişine ekle
    recentAnswerPositions.push(selectedPosition);
    if (recentAnswerPositions.length > MAX_POSITION_HISTORY) {
        recentAnswerPositions.shift(); // En eski pozisyonu çıkar
    }
    
    return selectedPosition;
}

// Akıllı karıştırma - doğru cevabı belirli pozisyona yerleştir
function smartShuffle(options) {
    // Doğru cevabı bul
    const correctIndex = options.findIndex(opt => opt.correct === true);
    if (correctIndex === -1) {
        // Doğru cevap bulunamadıysa normal karıştır
        shuffle(options);
        return;
    }
    
    // Doğru cevabı çıkar
    const correctAnswer = options.splice(correctIndex, 1)[0];
    
    // Yanlış cevapları karıştır
    shuffle(options);
    
    // Akıllı pozisyon seç
    const targetPosition = getSmartAnswerPosition(options.length + 1);
    
    // Doğru cevabı hedef pozisyona yerleştir
    options.splice(targetPosition, 0, correctAnswer);
}

// ============ CEVAP KONTROL ============
function checkAnswer(button, isCorrect) {
    log.game(`🚨 === KELİME ÇEVİR CEVAP KONTROLÜ ===`);
    log.game(`👆 Tıklanan buton: "${button.textContent}"`);
    log.game(`✅/❌ isCorrect parametresi: ${isCorrect}`);
    log.game(`📊 Mevcut soru: #${questionCount + 1}`);
    log.game(`📊 Önce - session: score=${sessionScore}, correct=${sessionCorrect}, wrong=${sessionWrong}`);
    log.game(`📊 Önce - kelime çevir: score=${score}, correct=${correct}, wrong=${wrong}`);
    
    stopTimer();
    
    // Tüm butonları kapat - Duolingo tarzı
    const allBtns = document.querySelectorAll('.duolingo-option, .option');
    log.game(`🔒 ${allBtns.length} buton devre dışı bırakılıyor...`);
    allBtns.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });

    const mode = CONFIG.gameModes[currentMode];
    const diffLevel = CONFIG.difficultyLevels[currentDifficulty];
    log.game(`🎯 Mod: ${currentMode}, Zorluk: ${currentDifficulty}`);

    // KELİME İSTATİSTİKLERİNİ GÜNCELLE
    log.game(`📊 Kelime istatistiği güncelleniyor: ${currentQuestion.kelime} (ID: ${currentQuestion.id})`);
    updateWordStats(currentQuestion.id, isCorrect);

    if (isCorrect) {
        log.game(`✅ === SAHİH CEVAP İŞLEMİ ===`);
        button.classList.add('correct');
        if (elements.feedback) {
        elements.feedback.textContent = '✅ Mâşâallah!';
        elements.feedback.className = 'feedback correct';
        }
        
        // 🎆 SUCCESS ANIMATIONS & FEEDBACK
        triggerSuccessBurst(button);
        triggerHaptic('success');
        if (elements.feedback) {
        addSpeedAnimation(elements.feedback, 'bounce-in');
        }
        
        // Combo sistemi için confetti
        if (comboCount >= 2) {
            triggerConfetti();
            triggerHaptic('combo');
        }
        
        const points = currentQuestion.difficulty * diffLevel.pointsMultiplier;
        log.game(`💰 Puan hesaplama: ${currentQuestion.difficulty} × ${diffLevel.pointsMultiplier} = ${points} puan`);
        log.game(`📊 addSessionPoints(${points}) çağrılıyor...`);
        addSessionPoints(points); // Session puanına ekle
        
        // Daily task progress - her doğru cevap için
        updateTaskProgress('kelimeCevir', 1);
        
        // Perfect streak kontrolü - hiç yanlış yapmamışsak perfect streak artır
        if (sessionWrong === 0) {
            updateTaskProgress('perfectStreak', 1);
            log.game(`🔥 Perfect streak artırıldı! Mevcut: ${dailyTasks.todayStats.perfectStreak}`);
        }
        
        log.game(`✅ Doğru cevap işlemi tamamlandı!`);
        
        updateUI();
    } else {
        log.game(`❌ === HATA CEVAP İŞLEMİ ===`);
        button.classList.add('wrong');
        if (elements.feedback) {
        elements.feedback.textContent = `❌ Hatalı! Sahih: ${currentQuestion.anlam}`;
        elements.feedback.className = 'feedback wrong';
        }
        
        // 📱 ERROR FEEDBACK
        triggerHaptic('error');
        if (elements.feedback) {
        addSpeedAnimation(elements.feedback, 'zoom-in');
        }
        
        log.game(`📊 addSessionWrong() çağrılıyor...`);
        addSessionWrong(); // Session yanlış sayısını artır
        
        log.game(`💸 Puan cezası uygulanıyor: ${CONFIG.wrongAnswerPenalty} puan`);
        log.game(`📊 Eski sessionScore: ${sessionScore}`);
        // Puan cezası - sessionScore'dan düş (UI'da görünür olması için)
        sessionScore = Math.max(0, sessionScore - CONFIG.wrongAnswerPenalty);
        // Geriye uyumluluk için eski score değişkenini de güncelle
        score = sessionScore;
        log.game(`📊 Yeni sessionScore: ${sessionScore}`);
        
        // Can kaybı
        if (mode.lives > 0) {
            log.game(`💀 Can kaybı: ${lives} - 1 = ${lives - 1}`);
            lives--;
            if (elements.lives) {
            elements.lives.textContent = lives;
            }
            // Duolingo tarzı kalpleri güncelle (sadece görünürse)
            const duolingoHearts = document.getElementById('duolingoHearts');
            if (duolingoHearts && duolingoHearts.style.display !== 'none') {
                const heartSpans = duolingoHearts.querySelectorAll('span');
                heartSpans.forEach((heart, index) => {
                    if (index < lives) {
                        heart.style.opacity = '1';
                    } else {
                        heart.style.opacity = '0.3';
                    }
                });
            }
            
            if (lives <= 0) {
                setTimeout(() => gameOver('Canlarınız bitti!'), 1500);
            }
        }

        updateUI();

        // Doğru cevabı göster
        allBtns.forEach(btn => {
            if (btn.textContent.includes(currentQuestion.anlam)) {
                btn.classList.add('correct');
            }
        });
    }

    questionCount++;
    // Show the next button (Kelime)
    try {
        if (elements && elements.nextBtn) {
            elements.nextBtn.style.display = 'block';
            elements.nextBtn.style.visibility = 'visible';
            elements.nextBtn.removeAttribute('hidden');
            elements.nextBtn.removeAttribute('aria-hidden'); // Görünür buton için aria-hidden kaldırılmalı

            // 🔥 Animasyonu ekle
elements.nextBtn.classList.add("next-appear");
            // Ensure it's visible on small viewports by scrolling it into view
            setTimeout(() => {
                try {
                    elements.nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } catch (e) {
                    log.warn('scrollIntoView failed:', e);
                }
            }, 60);
        } else {
            log.warn('elements.nextBtn is not available to show');
        }
    } catch (err) {
        log.error('Error while showing nextBtn for Kelime:', err);
    }
}

// ============ SES ÇALMA ============
if (elements.audioBtn) {
    // Masaüstü için onclick
elements.audioBtn.onclick = () => {
    if (currentQuestion && currentQuestion.ses_dosyasi) {
        playAudio(currentQuestion.ses_dosyasi, elements.audioBtn);
    }
};
    // Mobil için touchend
    elements.audioBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentQuestion && currentQuestion.ses_dosyasi) {
            playAudio(currentQuestion.ses_dosyasi, elements.audioBtn);
        }
    }, { passive: false });
}

// ============ SONRAKİ SORU ============
if (elements.nextBtn) {
    // Masaüstü için onclick
elements.nextBtn.onclick = () => {
    // ⚡ Speed animation ve haptic feedback
    addSpeedAnimation(elements.gameScreen, 'fade-in');
    triggerHaptic('light');
    
    // Butonu hemen gizle
        if (elements.nextBtn) {
    elements.nextBtn.style.display = 'none';
    elements.nextBtn.style.visibility = 'hidden';
    // display: none olduğunda aria-hidden gerekmez, zaten erişilebilirlik ağacından çıkar
    elements.nextBtn.classList.remove("next-appear");
        }
    
    loadQuestion();
};
    // Mobil için touchend
    elements.nextBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // ⚡ Speed animation ve haptic feedback
        addSpeedAnimation(elements.gameScreen, 'fade-in');
        triggerHaptic('light');
        
        // Butonu hemen gizle
        if (elements.nextBtn) {
            elements.nextBtn.style.display = 'none';
            elements.nextBtn.style.visibility = 'hidden';
            elements.nextBtn.classList.remove("next-appear");
        }
        
        loadQuestion();
    }, { passive: false });
}

// ============ İLERLEME GÜNCELLE ============
function updateProgress() {
    const mode = CONFIG.gameModes[currentMode];
    const progress = (questionCount / mode.questionsPerLevel) * 100;
    if (elements.progressBar) {
        elements.progressBar.style.width = `${progress}%`;
    }
}

// ============ UI GÜNCELLE ============
function updateUI() {
    // Alt bar: Sadece session (oyun içi) puanları göster
    if (elements.score) elements.score.textContent = sessionScore;
    if (elements.correct) elements.correct.textContent = sessionCorrect;
    if (elements.wrong) elements.wrong.textContent = sessionWrong;
    // level elementi artık yok (Mertebe kaldırıldı), bu yüzden güncelleme yapılmıyor
    
    // Header score güncelle (yeni tasarım için)
    const headerScore = document.getElementById('headerScore');
    if (headerScore) {
        headerScore.textContent = `⭐ ${starPoints}`;
    }
}

// ============ SÜRE YÖNETİMİ ============
function startTimer(seconds) {
    stopTimer();
    timeLeft = seconds;
    
    // Timer elementini kontrol et
    if (elements.timer) {
        elements.timer.textContent = timeLeft;
    }
    
    timer = setInterval(() => {
        timeLeft--;
        
        // Timer elementini sadece varsa güncelle
        if (elements.timer) {
            elements.timer.textContent = timeLeft;
        }
        
        if (timeLeft <= 0) {
            stopTimer();
            gameOver('Süre doldu!');
        }
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// ============ İPUCU ============
if (elements.hintBtn) {
    // hintUsed artık genel scope'ta tanımlı (yukarıda)
    
    const handleHint = () => {
        // İpucu zaten kullanıldıysa veya buton disabled ise çalışma
        if (hintUsed || (elements.hintBtn && elements.hintBtn.disabled)) {
            log.debug('⚠️ İpucu zaten kullanıldı veya buton devre dışı');
            return;
        }
        
        // currentQuestion kontrolü
        if (!currentQuestion || !currentQuestion.anlam) {
            log.warn('⚠️ İpucu: currentQuestion bulunamadı!');
            return;
        }
        
        // Bir yanlış cevabı kaldır - Duolingo tarzı butonlar için
        // Sadece game-screen içindeki butonları ara
        const gameScreen = document.getElementById('gameScreen');
        if (!gameScreen) {
            log.warn('⚠️ İpucu: gameScreen bulunamadı!');
            return;
        }
        
        const allBtns = gameScreen.querySelectorAll('.duolingo-option, .option');
        const wrongBtns = Array.from(allBtns).filter(btn => {
            if (btn.disabled) return false;
            const btnText = btn.textContent || btn.innerText || '';
            // Doğru cevabı içermeyen butonları bul
            return !btnText.includes(currentQuestion.anlam);
        });
    
        if (wrongBtns.length > 0) {
            const randomWrong = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
            randomWrong.style.opacity = '0.3';
            randomWrong.disabled = true;
            randomWrong.classList.add('disabled');
            
            // İpucu puan cezası - Hasene puanından düş
            const hintPenalty = 10;
            sessionScore = Math.max(0, sessionScore - hintPenalty);
            totalPoints = Math.max(0, totalPoints - hintPenalty);
            
            log.game(`💡 İpucu kullanıldı! -${hintPenalty} Hasene`);
            log.game(`📊 Yeni puanlar: sessionScore=${sessionScore}, totalPoints=${totalPoints}`);
            
            // UI güncelle
            updateUI();
            updateStatsBar();
            debouncedSaveStats(); // Debounced kaydetme // Hasene değişikliğini kaydet
            
            // İpucu kullanıldı olarak işaretle ve butonu devre dışı bırak
            hintUsed = true;
            if (elements.hintBtn) {
                elements.hintBtn.disabled = true;
            }
        } else {
            log.warn('⚠️ İpucu: Yanlış buton bulunamadı!');
        }
    };
    // Masaüstü için onclick
    elements.hintBtn.onclick = handleHint;
    // Mobil için touchend
    elements.hintBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleHint();
    }, { passive: false });
}

// ============ SEVİYE ATLAMA ============
function showLevelUpModal(newLevel) {
    elements.newLevel.textContent = newLevel;
    
    // Modal için ek bilgileri güncelle
    const modalTotalPoints = document.getElementById('modalTotalPoints');
    const modalNextLevelPoints = document.getElementById('modalNextLevelPoints');
    
    if (modalTotalPoints && modalNextLevelPoints) {
        modalTotalPoints.textContent = totalPoints.toLocaleString();
        modalNextLevelPoints.textContent = getNextLevelRequiredPoints(newLevel).toLocaleString();
    }
    
    // Seviye atlama sesi çal
    playSound('levelup');
    
    // Konfeti efekti başlat!
    createConfetti();
    
    elements.modal.style.display = 'flex';
}

function createConfetti() {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
                z-index: 10000;
                pointer-events: none;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            `;
            
            document.body.appendChild(confetti);
            
            const fall = confetti.animate([
                { 
                    transform: `translateY(0) rotate(${Math.random() * 360}deg)`,
                    opacity: 1
                },
                { 
                    transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360 + 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            fall.onfinish = () => confetti.remove();
        }, i * 30);
    }
}

// NOTE: eski levelUp fonksiyonu kaldırıldı (unused)

// ============ OYUN BİTTİ ============
function gameOver(reason) {
    stopTimer();
    
    // Session puanlarını global'e aktar
    addToGlobalPoints(sessionScore, sessionCorrect);
    
    if (elements.gameOverTitle) elements.gameOverTitle.textContent = '😢 Oyun Bitti';
    if (elements.gameOverText) elements.gameOverText.textContent = reason;
    if (elements.finalScore) elements.finalScore.textContent = `Bu Oyun: ${sessionScore} puan\nToplam: ${totalPoints} puan`;
    if (elements.gameOverModal) elements.gameOverModal.style.display = 'block';
}

// ============ YENİDEN BAŞLAT ============
elements.restartBtn.onclick = () => {
    if (elements.gameOverModal) elements.gameOverModal.style.display = 'none';
    if (elements.gameScreen) elements.gameScreen.style.display = 'none';
    if (elements.modeSelector) elements.modeSelector.style.display = 'none';
    if (elements.mainMenu) elements.mainMenu.style.display = 'block';
    if (elements.settingsBtn) elements.settingsBtn.style.display = 'none';
};

// ============ MODAL KAPAT ============
elements.modalBtn.onclick = () => {
    if (elements.modal) elements.modal.style.display = 'none';
    // Sadece modal'ı kapat - seviye yükselme bilgilendirmesi için gereksiz işlem yapma
};

// ============ DİNLE VE BUL MODU ============
let currentDinleQuestion = null;
let dinleQuestionCount = 0;
let speechAttemptCount = 0; // Ses tanıma deneme sayacı (her soru için max 2)
const DINLE_MAX_QUESTIONS = 10;

// ============ SES TANIMA SİSTEMİ ============
let recognition = null;
let isListening = false;
let microphoneStream = null;
let recognitionInitialized = false;
let isStopping = false; // Durdurma işlemi devam ediyor mu?

// Mikrofon stream'ini güvenli şekilde temizle
function cleanupMicrophoneStream() {
    if (microphoneStream) {
        try {
            microphoneStream.getTracks().forEach(track => {
                if (track.readyState === 'live' || track.readyState === 'ended') {
                    track.stop();
                    track.enabled = false;
                }
            });
            microphoneStream = null;
            log.debug('✅ Mikrofon stream temizlendi');
        } catch (e) {
            log.debug('Stream temizlenirken hata:', e);
            microphoneStream = null; // Hata olsa bile null yap
        }
    }
}

// Recognition'ı güvenli şekilde durdur
async function stopRecognitionSafely() {
    if (recognition && isListening && !isStopping) {
        isStopping = true;
        try {
            recognition.stop();
            isListening = false;
            // Recognition'ın tamamen durması için bekle
            await new Promise(resolve => setTimeout(resolve, 300));
            log.debug('✅ Recognition güvenli şekilde durduruldu');
        } catch (e) {
            log.debug('Recognition durdurulurken hata:', e);
            isListening = false;
        } finally {
            isStopping = false;
        }
    } else if (recognition && !isListening) {
        // Zaten durmuş, sadece flag'i kontrol et
        isListening = false;
    }
}

// Recognition nesnesini tamamen temizle
function cleanupRecognition() {
    if (recognition) {
        try {
            // Tüm event listener'ları kaldır
            recognition.onstart = null;
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            
            // Eğer aktifse durdur
            if (isListening) {
                try {
                    recognition.stop();
                } catch (e) {
                    // Zaten durmuş olabilir
                }
            }
            
            recognition = null;
            recognitionInitialized = false;
            isListening = false;
            log.debug('✅ Recognition nesnesi temizlendi');
        } catch (e) {
            log.debug('Recognition temizlenirken hata:', e);
            recognition = null;
            recognitionInitialized = false;
            isListening = false;
        }
    }
}

// Ses tanımayı durdur (global erişim için)
window.stopSpeechRecognition = async function() {
    // Önce recognition'ı durdur
    await stopRecognitionSafely();
    
    // Mikrofon stream'ini temizle
    cleanupMicrophoneStream();
    
    // UI'ı sıfırla
    const micBtn = document.getElementById('dinleMicBtn');
    const statusEl = document.getElementById('speechStatus');
    
    if (micBtn) {
        micBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        micBtn.style.transform = 'scale(1)';
        micBtn.style.boxShadow = '';
        micBtn.style.animation = '';
        micBtn.disabled = false;
    }
    
    if (statusEl && !statusEl.textContent.includes('❌')) {
        statusEl.textContent = '';
        statusEl.style.color = '#666';
    }
    
    log.debug('🛑 Ses tanıma durduruldu ve temizlendi');
};

// Mikrofon iznini kontrol et (stream açmadan)
async function checkMicrophonePermission() {
    try {
        // Permissions API desteği var mı? (Chrome/Edge için)
        if (navigator.permissions && navigator.permissions.query) {
            try {
                // Chrome/Edge için 'microphone' kullan
                const permission = await navigator.permissions.query({ name: 'microphone' });
                log.debug('Mikrofon izin durumu (Permissions API):', permission.state);
                return permission.state;
            } catch (permError) {
                // Permissions API'de 'microphone' desteklenmiyorsa veya hata varsa
                log.debug('Permissions API mikrofon desteği yok veya hata:', permError);
                // Stream açmadan 'prompt' döndür (kullanıcı izin vermemiş olabilir)
                return 'prompt';
            }
        }
        
        // Permissions API yoksa, stream açmadan 'prompt' döndür
        // getUserMedia ile test etmek yerine direkt 'prompt' döndür
        // Çünkü stream açmak gereksiz yere izin isteyebilir
        log.debug('Permissions API yok, varsayılan olarak prompt döndürülüyor');
        return 'prompt';
    } catch (error) {
        log.error('Mikrofon izin kontrolü hatası:', error);
        return 'unknown';
    }
}

// Mobil cihaz tespiti
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
}

// Web Speech API desteğini kontrol et ve başlat
function initSpeechRecognition() {
    const isMobile = isMobileDevice();
    
    // HTTPS kontrolü (mobil cihazlarda daha esnek)
    const isSecureContext = location.protocol === 'https:' || 
                           location.hostname === 'localhost' || 
                           location.hostname === '127.0.0.1' ||
                           location.hostname === '0.0.0.0' ||
                           window.isSecureContext;
    
    if (!isSecureContext) {
        log.warn('Ses tanıma için HTTPS gerekli');
        const micBtn = document.getElementById('dinleMicBtn');
        const statusEl = document.getElementById('speechStatus');
        if (micBtn) {
            micBtn.style.display = 'none';
        }
        if (statusEl) {
            if (isMobile) {
                statusEl.textContent = '⚠️ Ses tanıma için güvenli bağlantı gerekli. Lütfen HTTPS üzerinden erişin veya uygulamayı ana ekrana ekleyin.';
            } else {
                statusEl.textContent = '⚠️ Ses tanıma için HTTPS gerekli';
            }
            statusEl.style.color = '#f39c12';
        }
        return false;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        log.warn('Ses tanıma API desteği yok');
        const micBtn = document.getElementById('dinleMicBtn');
        const statusEl = document.getElementById('speechStatus');
        if (micBtn) {
            micBtn.style.display = 'none';
        }
        if (statusEl) {
            if (isMobile) {
                statusEl.textContent = '⚠️ Bu tarayıcı ses tanımayı desteklemiyor. Chrome veya Safari kullanmayı deneyin.';
            } else {
                statusEl.textContent = '⚠️ Bu tarayıcı ses tanımayı desteklemiyor. Chrome veya Edge kullanmayı deneyin.';
            }
            statusEl.style.color = '#f39c12';
        }
        return false;
    }
    
    // Yeni SpeechRecognition nesnesi oluştur
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Eski recognition nesnesini tamamen temizle
    if (recognition) {
        cleanupRecognition();
    }
    
    // Yeni recognition nesnesi oluştur
    recognition = new SpeechRecognition();
    
    // Dinle ve Bul modu Arapça telaffuz beklediğinden varsayılan dil Arapça (Suudi Arabistan)
    const speechLang = localStorage.getItem('speechRecognitionLang') || 'ar-SA';
    recognition.lang = speechLang;
    recognition.continuous = false;  // Tek seferlik tanıma
    recognition.interimResults = false;  // Ara sonuçları gösterme
    recognition.maxAlternatives = 3;  // En fazla 3 alternatif sonuç
    recognition.serviceURI = '';  // Varsayılan servisi kullan
    
    recognition.onstart = () => {
        isListening = true;
        const statusEl = document.getElementById('speechStatus');
        const micBtn = document.getElementById('dinleMicBtn');
        
        if (statusEl) {
            statusEl.textContent = '🎤 Dinleniyor...';
            statusEl.style.color = '#667eea';
            // HTML içeriğini temizle (eğer varsa)
            statusEl.innerHTML = '🎤 Dinleniyor...';
        }
        
        if (micBtn) {
            // Duolingo tarzı: Mikrofon butonu animasyonu (pulse efekti)
            micBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)';
            micBtn.style.transform = 'scale(1.15)';
            micBtn.style.boxShadow = '0 0 20px rgba(244, 67, 54, 0.6)';
            micBtn.style.animation = 'pulse 1.5s ease-in-out infinite';
            micBtn.disabled = false; // Butonu aktif tut
        }
        
        // Haptic feedback
        if (typeof triggerHaptic === 'function') {
            triggerHaptic('light');
        }
        
        log.debug('✅ Ses tanıma başlatıldı - dinleniyor...');
    };
    
    recognition.onresult = (event) => {
        const results = event.results;
        let recognizedText = '';
        let bestConfidence = 0;
        
        // En iyi sonucu al (en yüksek güvenilirlik skoruna sahip sonucu)
        for (let i = 0; i < results.length; i++) {
            if (results[i].length > 0) {
                const result = results[i][0];
                const confidence = result.confidence || 0;
                // En yüksek güvenilirliğe sahip sonucu seç
                if (confidence > bestConfidence || recognizedText === '') {
                    recognizedText = result.transcript.trim();
                    bestConfidence = confidence;
                    log.debug('📝 Ses tanıma sonucu:', recognizedText, 'Güvenilirlik:', confidence.toFixed(2));
                }
            }
        }
        
        // Sonucu işle
        if (recognizedText && currentDinleQuestion) {
            // Duolingo tarzı: Hemen eşleştir
            matchSpeechToAnswer(recognizedText);
        } else if (!recognizedText) {
            // Sonuç alınamadı
            const statusEl = document.getElementById('speechStatus');
            if (statusEl) {
                statusEl.textContent = '⚠️ Konuşma algılanamadı. Lütfen tekrar deneyin.';
                statusEl.style.color = '#f39c12';
            }
            log.debug('⚠️ Ses tanıma sonucu boş');
        }
        
        // Recognition otomatik olarak durur (continuous: false), ama manuel durdurma da yap
        isListening = false;
    };
    
    recognition.onerror = (event) => {
        isListening = false;
        const statusEl = document.getElementById('speechStatus');
        const micBtn = document.getElementById('dinleMicBtn');
        
        // Stream'i temizle (hata durumunda)
        cleanupMicrophoneStream();
        
        let errorMsg = 'Ses tanıma hatası';
        let helpText = '';
        let showHelpModal = false;
        
        // Hata kodlarına göre mesajları belirle
        switch (event.error) {
            case 'no-speech':
                errorMsg = 'Konuşma algılanamadı';
                helpText = 'Daha yüksek sesle ve net konuşmayı deneyin. Mikrofonunuzun açık olduğundan emin olun.';
                break;
            case 'audio-capture':
                errorMsg = 'Mikrofon bulunamadı veya erişilemedi';
                helpText = 'Mikrofonun bağlı olduğundan emin olun. Bluetooth kulaklık kullanıyorsanız, sistem ayarlarından mikrofonu seçtiğinizden emin olun.';
                showHelpModal = true;
                break;
            case 'not-allowed':
                errorMsg = 'Mikrofon izni reddedildi';
                helpText = 'Tarayıcı ayarlarından mikrofon izni verin. Adres çubuğundaki 🔒 simgesine tıklayın ve mikrofon iznini "İzin ver" yapın.';
                showHelpModal = true;
                break;
            case 'aborted':
                // Kullanıcı manuel durdurmuş, mesaj gösterme
                errorMsg = '';
                helpText = '';
                break;
            case 'network':
                errorMsg = 'Bağlantı hatası';
                helpText = 'Ses tanıma servisine bağlanılamıyor. İnternet bağlantınızı kontrol edin veya birkaç saniye sonra tekrar deneyin.';
                showHelpModal = true;
                break;
            default:
                errorMsg = `Ses tanıma hatası (${event.error || 'Bilinmeyen'})`;
                helpText = 'Lütfen sayfayı yenileyip tekrar deneyin.';
                break;
        }
        
        // UI'ı güncelle
        if (statusEl && errorMsg) {
            statusEl.innerHTML = '❌ ' + errorMsg + (helpText ? '<br><small style="font-size: 0.75em; margin-top: 4px; display: block;">' + helpText + '</small>' : '');
            statusEl.style.color = '#f44336';
            
            // Network, audio-capture, no-speech veya not-allowed hatası için tekrar dene butonu ekle
            if (event.error === 'network' || event.error === 'audio-capture' || event.error === 'no-speech' || event.error === 'not-allowed') {
                // Önceki butonları kaldır
                const oldBtns = statusEl.querySelectorAll('button');
                oldBtns.forEach(btn => btn.remove());
                
                const retryBtn = document.createElement('button');
                retryBtn.textContent = '🔄 Tekrar Dene';
                retryBtn.style.cssText = 'margin-top: 8px; padding: 6px 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 0.85em; cursor: pointer; font-weight: 600; touch-action: manipulation;';
                retryBtn.onclick = async () => {
                    // not-allowed hatası için önce izin kontrolü yap
                    if (event.error === 'not-allowed') {
                        statusEl.innerHTML = '🔍 Mikrofon izni kontrol ediliyor...';
                        statusEl.style.color = '#f39c12';
                        
                        // İzin kontrolü yap
                        try {
                            const permission = await checkMicrophonePermission();
                            if (permission === 'denied') {
                                statusEl.innerHTML = '❌ Mikrofon izni hala reddedildi<br><small style="font-size: 0.75em; margin-top: 4px; display: block;">Lütfen tarayıcı ayarlarından mikrofon iznini verin.</small>';
                                statusEl.style.color = '#f44336';
                                showMicrophonePermissionHelp();
                                return;
                            }
                        } catch (permError) {
                            log.debug('İzin kontrolü hatası:', permError);
                        }
                    }
                    
                    statusEl.innerHTML = '🔄 Tekrar deneniyor...';
                    statusEl.style.color = '#f39c12';
                    setTimeout(() => {
                        if (window.startSpeechRecognition) {
                            window.startSpeechRecognition();
                        }
                    }, 500);
                };
                statusEl.appendChild(retryBtn);
            }
        }
        
        // Butonu sıfırla
        if (micBtn) {
            micBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            micBtn.style.transform = 'scale(1)';
            micBtn.style.boxShadow = '';
            micBtn.style.animation = '';
            micBtn.disabled = false;
        }
        
        // Sadece aborted hatası dışındaki hataları logla (aborted normal bir durum)
        if (event.error !== 'aborted') {
            log.error('❌ Ses tanıma hatası:', event.error, event);
        } else {
            log.debug('🛑 Ses tanıma kullanıcı tarafından durduruldu (aborted)');
        }
        
        // Haptic feedback
        if (typeof triggerHaptic === 'function' && event.error !== 'aborted') {
            triggerHaptic('error');
        }
        
        // Yardım modallarını göster (gerekirse)
        if (showHelpModal) {
            setTimeout(() => {
                if (event.error === 'not-allowed') {
                    showMicrophonePermissionHelp();
                } else if (event.error === 'audio-capture') {
                    showBluetoothMicrophoneHelp();
                } else if (event.error === 'network') {
                    showNetworkErrorHelp();
                }
            }, 1500);
        }
    };
    
    recognition.onend = () => {
        isListening = false;
        const micBtn = document.getElementById('dinleMicBtn');
        const statusEl = document.getElementById('speechStatus');
        
        // UI'ı sıfırla
        if (micBtn) {
            micBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            micBtn.style.transform = 'scale(1)';
            micBtn.style.boxShadow = '';
            micBtn.style.animation = '';
        }
        
        // Status mesajını sadece hata durumunda değiştir, normal bitişte temizle
        if (statusEl) {
            const currentText = statusEl.textContent || '';
            if (!currentText.includes('❌') && !currentText.includes('⚠️') && !currentText.includes('Eşleşmedi')) {
                // Başarılı veya normal bitişte temizle
                if (!currentText.includes('✅')) {
                    statusEl.textContent = '';
                }
            }
        }
        
        // Stream'i temizle (Bluetooth mikrofon için) - sadece masaüstünde
        // Mobilde stream kullanılmıyor, bu yüzden temizleme gerekmez
        const isMobile = isMobileDevice();
        if (!isMobile) {
            cleanupMicrophoneStream();
        }
        
        log.debug('🛑 Ses tanıma durduruldu (onend)');
    };
    
    // Recognition başarıyla başlatıldı işaretini set et
    recognitionInitialized = true;
    
    // Başarılı başlatma - status mesajını temizle (kullanıcı butona basana kadar mesaj gösterme)
    const statusEl = document.getElementById('speechStatus');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.color = '#666';
    }
    
    log.debug('✅ Ses tanıma sistemi hazır ve yapılandırıldı');
    return true;
}

// Bluetooth mikrofon yardımı göster
function showBluetoothMicrophoneHelp() {
    const helpMsg = `<div style="text-align: left; line-height: 1.6; font-size: 0.9em; padding: 10px 0;">
<strong style="color: #667eea; font-size: 1.1em;">🎧 Bluetooth Mikrofon Sorunu</strong><br><br>

<strong style="color: #333;">1️⃣ Sistem Ayarları:</strong><br>
• <strong>Windows:</strong> Ayarlar > Sistem > Ses > Giriş > Bluetooth kulaklığınızı seçin<br>
• <strong>Mac:</strong> Sistem Tercihleri > Ses > Giriş > Bluetooth kulaklığınızı seçin<br>
• <strong>Android:</strong> Ayarlar > Bağlantılar > Bluetooth > Kulaklık ayarları > Mikrofon izni<br>
• <strong>iOS:</strong> Ayarlar > Bluetooth > Kulaklık > Mikrofon izni<br><br>

<strong style="color: #333;">2️⃣ Tarayıcı Ayarları:</strong><br>
• Chrome/Edge: Adres çubuğundaki 🔒 simgesine tıklayın<br>
• "Mikrofon" iznini <strong>"İzin ver"</strong> yapın<br>
• Sayfayı yenileyin (F5)<br><br>

<strong style="color: #333;">3️⃣ Bluetooth Bağlantısı:</strong><br>
• Bluetooth kulaklığın tam olarak bağlı olduğundan emin olun<br>
• Kulaklığı çıkarıp tekrar takmayı deneyin<br>
• Bluetooth'u kapatıp açmayı deneyin<br><br>

<strong style="color: #333;">4️⃣ Alternatif Çözüm:</strong><br>
• Bilgisayarın dahili mikrofonunu kullanmayı deneyin<br>
• Farklı bir Bluetooth kulaklık deneyin<br>
• Manuel olarak cevap seçeneklerinden birini seçebilirsiniz<br><br>

<small style="color: #666;">💡 <strong>Not:</strong> Bazı Bluetooth kulaklıklar sadece ses çıkışı için tasarlanmıştır ve mikrofon özelliği olmayabilir.</small>
</div>`;
    showCustomAlert(helpMsg, 'warning', '🎧 Bluetooth Mikrofon');
}

// Network hatası yardımı göster
function showNetworkErrorHelp() {
    const helpMsg = `<div style="text-align: left; line-height: 1.6; font-size: 0.9em; padding: 10px 0;">
<strong style="color: #667eea; font-size: 1.1em;">🌐 Bağlantı Hatası Çözümleri</strong><br><br>

<strong style="color: #333;">1️⃣ İnternet Bağlantısını Kontrol Edin:</strong><br>
• WiFi veya mobil veri bağlantınızın aktif olduğundan emin olun<br>
• Başka bir web sitesine bağlanmayı deneyin<br>
• Modemi yeniden başlatmayı deneyin<br><br>

<strong style="color: #333;">2️⃣ Tarayıcı Ayarları:</strong><br>
• Sayfayı yenileyin (F5 veya Cmd+R)<br>
• Tarayıcı önbelleğini temizleyin<br>
• Farklı bir tarayıcı deneyin (Chrome, Edge, Firefox)<br><br>

<strong style="color: #333;">3️⃣ Güvenlik Duvarı / VPN:</strong><br>
• VPN kullanıyorsanız kapatmayı deneyin<br>
• Güvenlik duvarının ses tanıma servisini engellemediğinden emin olun<br><br>

<strong style="color: #333;">4️⃣ Alternatif Çözüm:</strong><br>
• Birkaç saniye bekleyip tekrar deneyin<br>
• Ses tanıma servisi geçici olarak kullanılamıyor olabilir<br>
• Manuel olarak cevap seçeneklerinden birini seçebilirsiniz<br><br>

<small style="color: #666;">💡 <strong>Not:</strong> Web Speech API, Google'ın ses tanıma servisini kullanır ve aktif internet bağlantısı gerektirir.</small>
</div>`;
    showCustomAlert(helpMsg, 'warning', '🌐 Bağlantı Sorunu');
}

// Mikrofon izin yardımı göster
function showMicrophonePermissionHelp() {
    const helpMsg = `<div style="text-align: left; line-height: 1.6; font-size: 0.9em; padding: 10px 0;">
<strong style="color: #667eea; font-size: 1.1em;">🎤 Mikrofon İzni Nasıl Verilir?</strong><br><br>

<strong style="color: #333;">🌐 Chrome/Edge:</strong><br>
1️⃣ Adres çubuğundaki <span style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">🔒</span> veya <span style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">🎤</span> simgesine tıklayın<br>
2️⃣ "Mikrofon" seçeneğini <strong>"İzin ver"</strong> yapın<br>
3️⃣ Sayfayı yenileyin (F5)<br><br>

<strong style="color: #333;">🍎 Safari:</strong><br>
1️⃣ <strong>Safari</strong> > <strong>Ayarlar</strong> > <strong>Web Siteleri</strong> > <strong>Mikrofon</strong><br>
2️⃣ Bu site için <strong>"İzin ver"</strong> seçin<br>
3️⃣ Sayfayı yenileyin (Cmd+R)<br><br>

<strong style="color: #333;">🦊 Firefox:</strong><br>
1️⃣ Adres çubuğundaki <span style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">🔒</span> simgesine tıklayın<br>
2️⃣ "İzinler" bölümünde <strong>"Mikrofon"</strong>u <strong>"İzin ver"</strong> yapın<br>
3️⃣ Sayfayı yenileyin (F5)<br><br>

<small style="color: #666;">💡 <strong>Not:</strong> İzin verdikten sonra sayfayı yenilemeyi unutmayın!</small>
</div>`;
    showCustomAlert(helpMsg, 'info', '🎤 Mikrofon İzni Gerekli');
}

// Ses tanımayı başlat (global erişim için)
window.startSpeechRecognition = async function() {
    // Eğer zaten durduruluyorsa bekle
    if (isStopping) {
        log.debug('⏳ Recognition durduruluyor, bekleniyor...');
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Önce mevcut ses tanımayı durdur (eğer aktifse)
    if (isListening || recognition) {
        await window.stopSpeechRecognition();
        // Durdurma işleminin tamamlanması için yeterli bekleme
        await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    // Validation checks
    if (!currentDinleQuestion) {
        const statusEl = document.getElementById('speechStatus');
        if (statusEl) {
            statusEl.textContent = '⚠️ Önce bir soru yüklenmeli!';
            statusEl.style.color = '#f39c12';
        }
        showCustomAlert('Önce bir soru yüklenmeli!', 'warning');
        return;
    }
    
    // Seçeneklerin yüklenip yüklenmediğini kontrol et
    const allBtns = elements.dinleOptions?.querySelectorAll('.duolingo-option, .option');
    if (!allBtns || allBtns.length === 0) {
        const statusEl = document.getElementById('speechStatus');
        if (statusEl) {
            statusEl.textContent = '⚠️ Seçenekler henüz yüklenmedi. Lütfen bekleyin...';
            statusEl.style.color = '#f39c12';
        }
        showCustomAlert('Seçenekler henüz yüklenmedi. Lütfen bekleyin...', 'warning');
        return;
    }
    
    // Recognition nesnesini kontrol et ve başlat
    if (!recognition || !recognitionInitialized) {
        if (!initSpeechRecognition()) {
            const statusEl = document.getElementById('speechStatus');
            if (statusEl) {
                statusEl.textContent = '❌ Ses tanıma başlatılamadı';
                statusEl.style.color = '#f44336';
            }
            showCustomAlert('Ses tanıma özelliği bu tarayıcıda desteklenmiyor.', 'error');
            return;
        }
    }
    
    // İzin kontrolü ve mikrofon hazırlama
    const statusEl = document.getElementById('speechStatus');
    const isMobile = isMobileDevice();
    
    if (statusEl) {
        statusEl.textContent = '🔍 Mikrofon hazırlanıyor...';
        statusEl.style.color = '#f39c12';
    }
    
    // İzin kontrolü (mobilde daha az önemli, direkt deneme yapabiliriz)
    if (!isMobile) {
        try {
            const permission = await checkMicrophonePermission();
            if (permission === 'denied') {
                if (statusEl) {
                    statusEl.textContent = '❌ Mikrofon izni reddedildi';
                    statusEl.style.color = '#f44336';
                }
                showMicrophonePermissionHelp();
                return;
            } else if (permission === 'not-found') {
                if (statusEl) {
                    statusEl.textContent = '❌ Mikrofon bulunamadı';
                    statusEl.style.color = '#f44336';
                }
                showBluetoothMicrophoneHelp();
                return;
            }
        } catch (permError) {
            log.warn('İzin kontrolü hatası, devam ediliyor:', permError);
        }
    }
    
    // Masaüstünde getUserMedia ile mikrofonu aktif hale getir (Bluetooth desteği için)
    if (!isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            if (statusEl) {
                statusEl.textContent = '🎤 Mikrofon bağlanıyor...';
                statusEl.style.color = '#f39c12';
            }
            
            // Önceki stream varsa kapat
            cleanupMicrophoneStream();
            
            // Mikrofonu aktif hale getir (Bluetooth dahil tüm mikrofonlar için)
            microphoneStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                } 
            });
            
            const audioTracks = microphoneStream.getAudioTracks();
            if (audioTracks.length > 0) {
                const trackInfo = audioTracks.map(t => ({
                    label: t.label || 'Bilinmeyen',
                    enabled: t.enabled,
                    readyState: t.readyState
                }));
                
                log.debug('✅ Mikrofon stream aktif:', trackInfo);
                
                // Kullanıcıya hangi mikrofonun kullanıldığını göster
                const micLabel = audioTracks[0]?.label || 'Bilinmeyen mikrofon';
                const isBluetooth = micLabel.toLowerCase().includes('bluetooth') || 
                                   micLabel.toLowerCase().includes('bt') ||
                                   micLabel.toLowerCase().includes('wireless');
                
                if (statusEl) {
                    const micDisplayName = micLabel.length > 30 ? micLabel.substring(0, 30) + '...' : micLabel;
                    if (isBluetooth) {
                        statusEl.innerHTML = `✅ Bluetooth mikrofon hazır<br><small style="font-size: 0.75em; color: #666;">${micDisplayName}</small>`;
                    } else {
                        statusEl.innerHTML = `✅ Mikrofon hazır<br><small style="font-size: 0.75em; color: #666;">${micDisplayName}</small>`;
                    }
                    statusEl.style.color = '#4caf50';
                }
                
                // Mikrofonun tam olarak hazır olması için yeterli gecikme
                // Bluetooth mikrofonlar için daha uzun süre gerekebilir
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (mediaError) {
            log.error('❌ Mikrofon erişim hatası:', mediaError);
            if (statusEl) {
                statusEl.textContent = '❌ Mikrofon erişilemedi';
                statusEl.style.color = '#f44336';
            }
            
            if (mediaError.name === 'NotAllowedError' || mediaError.name === 'PermissionDeniedError') {
                showMicrophonePermissionHelp();
            } else if (mediaError.name === 'NotFoundError' || mediaError.name === 'DevicesNotFoundError') {
                showBluetoothMicrophoneHelp();
            } else {
                showCustomAlert(`Mikrofon erişilemedi: ${mediaError.message || mediaError.name}. Bluetooth kulaklık kullanıyorsanız, sistem ayarlarından mikrofonu seçtiğinizden emin olun.`, 'error');
            }
            return;
        }
    }
    
    // Speech Recognition'ı başlat
    try {
        if (statusEl) {
            statusEl.textContent = '🎤 Dinleniyor...';
            statusEl.style.color = '#667eea';
        }
        
        // Recognition zaten başlatılmışsa önce durdur
        if (isListening) {
            await stopRecognitionSafely();
        }
        
        // Yeni başlat (eğer hala durmuşsa)
        if (!isListening && !isStopping) {
            try {
                recognition.start();
                log.debug('✅ Speech Recognition başlatıldı');
            } catch (startError) {
                // Eğer "already started" hatası alırsak, zaten başlamış demektir
                if (startError.message && startError.message.includes('already started')) {
                    log.debug('⚠️ Recognition zaten başlatılmış');
                    isListening = true;
                } else {
                    throw startError; // Diğer hataları yukarı fırlat
                }
            }
        } else {
            log.debug('⚠️ Recognition başlatılamadı: isListening=' + isListening + ', isStopping=' + isStopping);
        }
    } catch (error) {
        log.error('❌ Ses tanıma başlatma hatası:', error);
        
        // Stream'i temizle
        cleanupMicrophoneStream();
        
        // Hata mesajlarını göster
        if (error.name === 'NotAllowedError' || error.message?.includes('not allowed')) {
            if (statusEl) {
                statusEl.textContent = '❌ Mikrofon izni verilmedi';
                statusEl.style.color = '#f44336';
            }
            showMicrophonePermissionHelp();
        } else if (error.name === 'NotFoundError' || error.message?.includes('not found')) {
            if (statusEl) {
                statusEl.textContent = '❌ Mikrofon bulunamadı';
                statusEl.style.color = '#f44336';
            }
            showBluetoothMicrophoneHelp();
        } else if (error.name === 'NetworkError' || error.message?.includes('network')) {
            if (statusEl) {
                statusEl.textContent = '❌ Bağlantı hatası';
                statusEl.style.color = '#f44336';
            }
            showNetworkErrorHelp();
        } else {
            if (statusEl) {
                statusEl.textContent = `❌ Hata: ${error.message || error.name || 'Bilinmeyen hata'}`;
                statusEl.style.color = '#f44336';
            }
            showCustomAlert(`Ses tanıma başlatılamadı: ${error.message || error.name || 'Bilinmeyen hata'}. Lütfen tekrar deneyin.`, 'error');
        }
    }
};

// Duolingo tarzı benzerlik hesaplama (basit Levenshtein)
function calculateSimilarity(str1, str2) {
    if (str1 === str2) return 100;
    if (str1.length === 0 || str2.length === 0) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    // Basit karakter eşleşme skoru
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
        if (longer.includes(shorter[i])) {
            matches++;
        }
    }
    
    return (matches / longer.length) * 100;
}

// Arapça metin normalizasyonu (boşlukları, özel karakterleri temizle)
function normalizeArabicText(text) {
    if (!text) return '';
    // Unicode normalizasyonu (Arapça karakterler için)
    let normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Tüm boşlukları temizle (normal boşluk, non-breaking space, vb.)
    normalized = normalized.replace(/\s+/g, '').trim();
    // Arapça için toLowerCase gerekmez, ama yine de yapalım (güvenlik için)
    // Arapça karakterler zaten küçük/büyük harf ayrımı yapmaz
    return normalized;
}

// Konuşulan metni cevaplarla eşleştir
function matchSpeechToAnswer(spokenText) {
    const statusEl = document.getElementById('speechStatus');
    // Seçenekler .duolingo-option class'ı ile oluşturuluyor
    const allBtns = elements.dinleOptions.querySelectorAll('.duolingo-option, .option');
    
    if (!allBtns || allBtns.length === 0) {
        if (statusEl) {
            statusEl.textContent = '❌ Seçenekler bulunamadı. Lütfen önce bir soru yükleyin.';
            statusEl.style.color = '#f44336';
        }
        log.error('❌ Seçenekler bulunamadı! elements.dinleOptions:', elements.dinleOptions);
        log.error('❌ DinleOptions içeriği:', elements.dinleOptions?.innerHTML);
        return;
    }
    
    // Deneme sayacını artır
    speechAttemptCount++;
    const maxAttempts = 2;
    
    // DEBUG: Orijinal konuşulan metni logla
    log.debug('🎤 Orijinal konuşulan metin:', spokenText);
    log.debug('🎤 Konuşulan metin uzunluğu:', spokenText.length);
    log.debug('🎤 Konuşulan metin karakterleri:', Array.from(spokenText).map(c => c.charCodeAt(0)));
    
    // Konuşulan metni normalize et (Arapça için özel normalizasyon)
    const normalizedSpoken = normalizeArabicText(spokenText);
    log.debug('🔍 Normalize edilmiş konuşulan metin:', normalizedSpoken);
    
    if (statusEl) {
        statusEl.textContent = '🔍 "' + spokenText + '" aranıyor...';
        statusEl.style.color = '#f39c12';
    }
    
    // Doğru cevabı bul (sadece kontrol için, göstermeyeceğiz)
    const correctWord = currentDinleQuestion.kelime;
    const correctWordNormalized = normalizeArabicText(correctWord);
    log.debug('✅ Doğru cevap (orijinal):', correctWord);
    log.debug('✅ Doğru cevap (normalize):', correctWordNormalized);
    
    // Duolingo tarzı akıllı eşleştirme algoritması
    let matchedButton = null;
    let bestMatch = null;
    let bestScore = 0;
    
    // DEBUG: Tüm buton metinlerini logla
    log.debug('📋 Toplam buton sayısı:', allBtns.length);
    
    allBtns.forEach((btn, index) => {
        // Buton metnini al (HTML içeriğinden temizle)
        let btnText = btn.textContent.trim();
        // Eğer HTML içeriği varsa (Arapça için), sadece metni al
        if (btn.innerHTML && btn.innerHTML.includes('<span')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = btn.innerHTML;
            btnText = tempDiv.textContent.trim();
        }
        
        // DEBUG: Her buton için log
        log.debug(`📋 Buton ${index + 1} (orijinal):`, btnText);
        log.debug(`📋 Buton ${index + 1} uzunluğu:`, btnText.length);
        
        // Arapça için özel normalizasyon
        const btnTextNormalized = normalizeArabicText(btnText);
        log.debug(`📋 Buton ${index + 1} (normalize):`, btnTextNormalized);
        
        // DEBUG: Eşleştirme denemeleri
        const exactMatch = btnTextNormalized === normalizedSpoken;
        log.debug(`📋 Buton ${index + 1} tam eşleşme:`, exactMatch);
        
        // 1. Tam eşleşme (en yüksek öncelik)
        if (exactMatch) {
            log.debug(`✅ TAM EŞLEŞME BULUNDU! Buton ${index + 1}: "${btnText}"`);
            bestScore = 100;
            bestMatch = btn;
            return; // En iyi eşleşme bulundu, devam etme
        }
        
        // 2. Baş harf eşleşmesi (Arapça için çok önemli - ilk 1-2 karakter)
        if (normalizedSpoken.length >= 1 && btnTextNormalized.length >= 1) {
            // İlk karakter eşleşiyorsa
            const firstCharMatch = normalizedSpoken[0] === btnTextNormalized[0];
            // İlk 2 karakter eşleşiyorsa (eğer varsa)
            const firstTwoCharsMatch = normalizedSpoken.length >= 2 && btnTextNormalized.length >= 2 &&
                                     normalizedSpoken.substring(0, 2) === btnTextNormalized.substring(0, 2);
            
            if (firstTwoCharsMatch) {
                // İlk 2 karakter eşleşiyorsa yüksek skor ver
                const similarity = 85; // İlk 2 karakter eşleşmesi için %85 skor
                log.debug(`✅ İLK 2 KARAKTER EŞLEŞTİ! Buton ${index + 1}: "${btnText}" (${similarity}%)`);
                if (similarity > bestScore) {
                    bestScore = similarity;
                    bestMatch = btn;
                }
            } else if (firstCharMatch) {
                // Sadece ilk karakter eşleşiyorsa orta skor ver
                const similarity = 60; // İlk karakter eşleşmesi için %60 skor
                log.debug(`✅ İLK KARAKTER EŞLEŞTİ! Buton ${index + 1}: "${btnText}" (${similarity}%)`);
                if (similarity > bestScore) {
                    bestScore = similarity;
                    bestMatch = btn;
                }
            }
        }
        
        // 3. Kısmi eşleşme (içeriyor mu?)
        const containsMatch = normalizedSpoken.includes(btnTextNormalized) || btnTextNormalized.includes(normalizedSpoken);
        if (containsMatch) {
            // Benzerlik skoru hesapla (Duolingo tarzı)
            const longer = Math.max(btnTextNormalized.length, normalizedSpoken.length);
            const shorter = Math.min(btnTextNormalized.length, normalizedSpoken.length);
            // Division by zero check (if both strings are empty)
            const similarity = longer > 0 ? (shorter / longer) * 100 : 0;
            log.debug(`📋 Buton ${index + 1} kısmi eşleşme skoru:`, similarity.toFixed(2) + '%');
            
            if (similarity > bestScore) {
                bestScore = similarity;
                bestMatch = btn;
            }
        }
        
        // 4. Levenshtein benzeri basit karşılaştırma (Arapça karakterler için)
        const charSimilarity = calculateSimilarity(btnTextNormalized, normalizedSpoken);
        log.debug(`📋 Buton ${index + 1} karakter benzerliği:`, charSimilarity.toFixed(2) + '%');
        // Eşik değerini %40'a düşürdük (baş harf kontrolü zaten var)
        if (charSimilarity > bestScore && charSimilarity > 40) { // %40'den fazla benzerlik
            log.debug(`✅ YÜKSEK BENZERLİK BULUNDU! Buton ${index + 1}: "${btnText}" (${charSimilarity.toFixed(2)}%)`);
            bestScore = charSimilarity;
            bestMatch = btn;
        }
    });
    
    log.debug('🏆 En iyi eşleşme skoru:', bestScore.toFixed(2) + '%');
    log.debug('🏆 En iyi eşleşme butonu:', bestMatch ? bestMatch.textContent.trim() : 'YOK');
    
    matchedButton = bestMatch;
    
    // DEBUG: Eşleşme sonucu
    if (matchedButton) {
        log.debug('✅ EŞLEŞME BULUNDU! Buton:', matchedButton.textContent.trim());
        log.debug('✅ Eşleşme skoru:', bestScore.toFixed(2) + '%');
    } else {
        log.warn('❌ HİÇBİR EŞLEŞME BULUNAMADI!');
        log.warn('❌ Konuşulan metin:', normalizedSpoken);
        log.warn('❌ Tüm buton metinleri:', Array.from(allBtns).map(btn => {
            let text = btn.textContent.trim();
            if (btn.innerHTML && btn.innerHTML.includes('<span')) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = btn.innerHTML;
                text = tempDiv.textContent.trim();
            }
            return normalizeArabicText(text);
        }));
    }
    
    if (matchedButton) {
        // Duolingo tarzı: Butonu vurgula (görsel geri bildirim)
        matchedButton.style.transform = 'scale(1.05)';
        matchedButton.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
        
        // Butonun metnini al (doğru cevap kontrolü için)
        let matchedBtnText = matchedButton.textContent.trim();
        if (matchedButton.innerHTML && matchedButton.innerHTML.includes('<span')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = matchedButton.innerHTML;
            matchedBtnText = tempDiv.textContent.trim();
        }
        
        // Doğru cevap mı kontrol et
        const isCorrect = matchedBtnText.trim() === correctWord.trim();
        
        // Eşleşme bulundu - deneme sayacını sıfırla (başarılı deneme)
        speechAttemptCount = 0;
        
        if (statusEl) {
            statusEl.textContent = '✅ "' + spokenText + '" eşleşti!';
            statusEl.style.color = '#4caf50';
        }
        
        // Ses tanımayı durdur (eşleşme bulunduğunda)
        if (isListening && recognition) {
            try {
                isListening = false;
                recognition.stop();
            } catch (e) {
                log.debug('Recognition durdurulurken hata (match):', e);
            }
        }
        
        // Duolingo gibi: Doğrudan checkDinleAnswer fonksiyonunu çağır (click() yerine)
        // Kısa bir gecikme ile (görsel geri bildirim için)
        setTimeout(() => {
            if (matchedButton && !matchedButton.classList.contains('disabled')) {
                checkDinleAnswer(matchedButton, isCorrect);
            }
        }, 200);
        
        // Animasyonu geri al
        setTimeout(() => {
            if (matchedButton) {
                matchedButton.style.transform = '';
                matchedButton.style.boxShadow = '';
            }
        }, 500);
    } else {
        // Eşleşme bulunamadı
        triggerHaptic('error');
        
        // 2 deneme hakkı kontrolü
        if (speechAttemptCount < maxAttempts) {
            // Daha deneme hakkı var - kullanıcıya seçenek sun
            if (statusEl) {
                statusEl.innerHTML = `
                    <div style="margin-bottom: 8px; color: #f39c12;">❌ Eşleşmedi (${speechAttemptCount}/${maxAttempts})</div>
                    <button onclick="if(window.startSpeechRecognition) window.startSpeechRecognition();" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85em; font-weight: 600; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; min-width: 100px; min-height: 36px; margin-right: 8px;">
                        🔄 Tekrar Dene
                    </button>
                    <small style="display: block; margin-top: 8px; color: #666; font-size: 0.8em;">veya manuel olarak seçin</small>
                `;
                statusEl.style.color = '#f39c12';
            }
        } else {
            // 2 deneme de başarısız - kullanıcıya bilgi ver, manuel seçim yapabilsin
            if (statusEl) {
                statusEl.textContent = '❌ 2 deneme hakkı bitti. Lütfen manuel olarak seçin.';
                statusEl.style.color = '#f44336';
            }
            
            // Ses tanımayı durdur (eğer aktifse)
            if (isListening && recognition) {
                try {
                    recognition.stop();
                } catch (e) {
                    log.debug('Ses tanıma durdurulamadı');
                }
            }
            
            log.debug('🛑 2 deneme hakkı bitti, kullanıcı manuel seçim yapabilir');
        }
    }
}

function loadDinleQuestion() {
    // Önceki ses varsa durdur
    stopCurrentAudio();
    
    // Ses tanıma deneme sayacını sıfırla (her yeni soru için)
    speechAttemptCount = 0;
    
    // Ses tanıma status mesajını temizle (önceki sorudan kalan mesajları kaldır)
    const statusEl = document.getElementById('speechStatus');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.color = '#666';
    }
    
    // Ses tanımayı durdur ve temizle (eğer aktifse)
    window.stopSpeechRecognition();
    
    log.debug(`🎪 === SORU YÜKLENİYOR ===`);
    log.debug(`📊 Mevcut soru sayısı: ${dinleQuestionCount}/${DINLE_MAX_QUESTIONS}`);
    log.debug(`📊 Oyun durumu: score=${dinleScore}, correct=${dinleCorrect}, wrong=${dinleWrong}`);
    
    // 10 soru kontrolü
    if (dinleQuestionCount >= DINLE_MAX_QUESTIONS) {
        log.game(`🏁 === OYUN BİTİŞİ TETİKLENDİ ===`);
        log.game(`✅ ${DINLE_MAX_QUESTIONS} soru tamamlandı!`);
        log.game(`📊 Final oyun skorları: dinleScore=${dinleScore}, dinleCorrect=${dinleCorrect}, dinleWrong=${dinleWrong}`);
        log.game(`📊 Final session skorları: sessionScore=${sessionScore}, sessionCorrect=${sessionCorrect}, sessionWrong=${sessionWrong}`);
        
        // NOT: dinleBul zaten her doğru cevapta updateTaskProgress('dinleBul', 1) ile artırılıyor (satır 10025)
        // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
        // updateTaskProgress('dinleBul', sessionCorrect);
        
        log.game(`💰 Session puanları global'e aktarılıyor: ${sessionScore} puan`);
        // Session puanlarını global'e aktar
        addToGlobalPoints(sessionScore, sessionCorrect);
        
        log.debug(`🔄 Ana menüye dönülüyor...`);
        // Direkt ana menüye dön
        elements.dinleMode.style.display = 'none';
        elements.mainMenu.style.display = 'block';
        
        // Navigasyon bar'ı göster (ana ekrana dönünce)
        showBottomNavBar();
        
        log.debug(`🧹 Oyun değişkenleri temizleniyor...`);
        // Sıfırla
        dinleScore = 0;
        dinleCorrect = 0;
        dinleWrong = 0;
        dinleQuestionCount = 0;
        updateDinleUI();
        log.game(`✅ Oyun bitti ve ana menüye dönüldü!`);
        return;
    }

    log.debug(`🔍 Zorluk filtreleme başlıyor...`);
    log.debug(`🎯 Seçili zorluk: ${currentDifficulty}`);
    // Zorluk filtreleme (Kelime Çevir ile aynı)
    const diffLevel = CONFIG.difficultyLevels[currentDifficulty];
    log.debug(`📋 Zorluk aralığı: ${diffLevel.minDiff}-${diffLevel.maxDiff}`);
    log.debug(`📦 Toplam kelime sayısı: ${kelimeBulData.length}`);
    
    let filteredData = kelimeBulData.filter(w => 
        w.difficulty >= diffLevel.minDiff && w.difficulty <= diffLevel.maxDiff
    );
    log.debug(`✅ Filtrelenmiş kelime sayısı: ${filteredData.length}`);

    if (filteredData.length === 0) {
        log.debug(`⚠️ Filtrelenmiş veri boş! Tüm kelimeler kullanılacak.`);
        filteredData = kelimeBulData;
    }

    log.debug(`🧠 Akıllı kelime seçimi (Dinle Modu) başlıyor...`);
    currentDinleQuestion = selectIntelligentWord(filteredData);
    
    // 🔍 SEÇİLEN KELİME DETAYLARI (DİNLE MODU)
    log.debug("===== DINLE MODU KELİME =====");
    log.debug(`� Kelime: ${currentDinleQuestion.kelime}`);
    log.debug("Anlam:", currentDinleQuestion.anlam);
    log.debug("Zorluk:", currentDinleQuestion.difficulty);
    log.debug("ID:", currentDinleQuestion.id);
    log.debug("Zorluk aralığı:", diffLevel.minDiff + "-" + diffLevel.maxDiff);
    const isInRange = currentDinleQuestion.difficulty >= diffLevel.minDiff && currentDinleQuestion.difficulty <= diffLevel.maxDiff;
    log.debug("Aralıkta mı:", isInRange ? "EVET" : "HAYIR");
    log.debug("Puan:", currentDinleQuestion.difficulty * 2);
    log.debug("==========================");

    log.debug(`🎨 UI güncelleniyor...`);
    // UI güncelle
    elements.dinleSureInfo.textContent = `ID: ${currentDinleQuestion.id} | Zorluk: ${currentDinleQuestion.difficulty} | Aralık: ${diffLevel.minDiff}-${diffLevel.maxDiff}`;
    log.debug(`✅ Kelime ID: ${currentDinleQuestion.id}`);

    log.debug(`🔀 Seçenekler oluşturuluyor... (4 Arapça kelime)`);
    // Seçenekler oluştur (4 Arapça kelime) - aynı zorluktan
    // Array length check - prevent error if array is empty
    if (!filteredData || filteredData.length === 0) {
        log.error('❌ Filtrelenmiş veri bulunamadı!');
        showCustomAlert('Kelime verileri yüklenemedi! Lütfen sayfayı yenileyin.', 'error');
        return;
    }
    const wrongAnswers = [];
    let attempts = 0;
    while (wrongAnswers.length < 3 && attempts < 50) {
        attempts++;
        const random = filteredData[Math.floor(Math.random() * filteredData.length)];
        if (random.kelime !== currentDinleQuestion.kelime && 
            !wrongAnswers.find(w => w.kelime === random.kelime)) {
            wrongAnswers.push(random);
            log.debug(`✅ Yanlış cevap #${wrongAnswers.length}: "${random.kelime}" (zorluk: ${random.difficulty})`);
        }
    }
    log.debug(`📊 Yanlış cevap oluşturma: ${attempts} deneme, ${wrongAnswers.length}/3 başarılı`);

    const allOptions = [
        { text: currentDinleQuestion.kelime, correct: true },
        ...wrongAnswers.map(w => ({ text: w.kelime, correct: false }))
    ];
    log.debug(`🎯 Doğru cevap: "${currentDinleQuestion.kelime}" (index: 0)`);
    log.debug(`❌ Yanlış cevaplar: ${wrongAnswers.map(w => `"${w.kelime}"`).join(', ')}`);

    // Akıllı karıştır (tahmin edilmesini zorlaştırmak için)
    smartShuffle(allOptions);

    // Seçenekleri göster - Duolingo Tarzı
    elements.dinleOptions.innerHTML = '';
    allOptions.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'duolingo-option';
        // Arapça ise özel sınıf ekle ve düzgün formatlama
        if (isArabic(opt.text)) {
            btn.classList.add('arabic-option');
            btn.innerHTML = `<span style="direction: rtl;">${opt.text}</span>`;
        } else {
            btn.textContent = opt.text;
        }
        
        // Touch event tracking (scroll/tap ayrımı için)
        let touchStart = { x: 0, y: 0, time: 0 };
        let isScrolling = false;
        
        // Masaüstü için onclick handler
        btn.onclick = () => {
            if (!btn.classList.contains('disabled')) {
                checkDinleAnswer(btn, opt.correct);
            }
        };
        
        // Mobil için touch event'leri
        btn.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStart = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
            isScrolling = false;
        }, { passive: true });
        
        btn.addEventListener('touchmove', (e) => {
            if (touchStart.x !== 0 || touchStart.y !== 0) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchStart.x);
                const deltaY = Math.abs(touch.clientY - touchStart.y);
                // 10px'den fazla hareket varsa scroll'dur
                if (deltaX > 10 || deltaY > 10) {
                    isScrolling = true;
                }
            }
        }, { passive: true });
        
        btn.addEventListener('touchend', (e) => {
            // Scroll yapıldıysa tıklamayı engelle
            if (isScrolling) {
                touchStart = { x: 0, y: 0, time: 0 };
                isScrolling = false;
                return;
            }
            
            // Scroll değilse, tap olarak kabul et
            const touch = e.changedTouches[0];
            const deltaTime = Date.now() - touchStart.time;
            const deltaX = Math.abs(touch.clientX - touchStart.x);
            const deltaY = Math.abs(touch.clientY - touchStart.y);
            
            // Kısa süre (300ms) ve küçük hareket (10px) = tap
            if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
                e.preventDefault();
                e.stopPropagation();
                if (!btn.classList.contains('disabled')) {
                    checkDinleAnswer(btn, opt.correct);
                }
            }
            
            touchStart = { x: 0, y: 0, time: 0 };
            isScrolling = false;
        }, { passive: false });
        
        elements.dinleOptions.appendChild(btn);
    });

    // Duolingo tarzı soru numarasını güncelle
    const dinleQuestionNumber = document.getElementById('dinleQuestionNumber');
    if (dinleQuestionNumber) {
        dinleQuestionNumber.textContent = `Sual ${dinleQuestionCount + 1} / ${DINLE_MAX_QUESTIONS}`;
    }
    
    // Duolingo tarzı ilerleme çubuğunu güncelle
    // İlerleme çubuğu kaldırıldı - soru sayısı gösterimi yeterli

    if (elements.dinleFeedback) {
    elements.dinleFeedback.textContent = '';
    elements.dinleFeedback.className = 'feedback';
    }
    if (elements.dinleNextBtn) {
    elements.dinleNextBtn.style.display = 'none';
    }
    
    // Tüm butonları aktif et
    const allBtns = document.querySelectorAll('.dinle-mode .duolingo-option, .dinle-mode .option');
    allBtns.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('disabled', 'correct', 'wrong');
    });
    
    // Mikrofon butonunu her zaman aktif et (kullanıcı istediği zaman kullanabilsin)
    const micBtn = document.getElementById('dinleMicBtn');
    if (micBtn) {
        micBtn.style.opacity = '1';
        micBtn.style.pointerEvents = 'auto';
    }

    // Otomatik ses çal
    if (currentDinleQuestion.ses_dosyasi) {
        playAudio(currentDinleQuestion.ses_dosyasi, elements.dinleAudioBtn);
    }

    // Arapça hareke renklerini uygula
    setTimeout(() => {
        updateArabicTextColoring();
    }, 100);
}

function checkDinleAnswer(button, isCorrect) {
    log.debug(`🚨 === CEVAP KONTROLÜ BAŞLIYOR ===`);
    log.debug(`👆 Tıklanan buton: "${button.textContent}"`);
    log.debug(`✅/❌ isCorrect parametresi: ${isCorrect}`);
    log.debug(`📊 Mevcut soru: #${dinleQuestionCount + 1}/${DINLE_MAX_QUESTIONS}`);
    log.debug(`� Önce - session score: ${sessionScore}, session correct: ${sessionCorrect}, session wrong: ${sessionWrong}`);
    log.debug(`📊 Önce - dinle score: ${dinleScore}, dinle correct: ${dinleCorrect}, dinle wrong: ${dinleWrong}`);
    
    // KELİME İSTATİSTİKLERİNİ GÜNCELLE (Dinle Modu)
    log.debug(`📊 Kelime istatistiği güncelleniyor (Dinle): ${currentDinleQuestion.kelime} (ID: ${currentDinleQuestion.id})`);
    updateWordStats(currentDinleQuestion.id, isCorrect);
    
    const allBtns = elements.dinleOptions.querySelectorAll('.duolingo-option, .option');
    log.debug(`🔒 ${allBtns.length} buton devre dışı bırakılıyor...`);
    allBtns.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });

    if (isCorrect) {
        log.debug(`✅ === SAHİH CEVAP İŞLEMİ ===`);
        button.classList.add('correct');
        if (elements.dinleFeedback) {
        elements.dinleFeedback.textContent = '✅ Mâşâallah!';
        elements.dinleFeedback.className = 'feedback correct';
        }
        
        // Haptic feedback - doğru cevap
        triggerHaptic('success');
        
        const points = currentDinleQuestion.difficulty * 2;
        log.debug(`💰 Puan hesaplama: ${currentDinleQuestion.difficulty} × 2 = ${points} puan`);
        
        log.debug(`📊 Dinle score güncelleniyor: ${dinleScore} + ${points} = ${dinleScore + points}`);
        dinleScore += points; // Local oyun puanı
        
        log.debug(`📊 Dinle correct güncelleniyor: ${dinleCorrect} + 1 = ${dinleCorrect + 1}`);
        dinleCorrect++;
        
        log.debug(`📊 addSessionPoints(${points}) çağrılıyor...`);
        addSessionPoints(points); // Session puanına ekle
        
        // Header score güncelle (yıldız gösterimi)
        const dinleHeaderScore = document.getElementById('dinleHeaderScore');
        if (dinleHeaderScore) {
            const currentStarPoints = Math.floor(totalPoints / 100);
            dinleHeaderScore.textContent = `⭐ ${currentStarPoints}`;
        }
        
        // Daily task progress - her doğru cevap için
        updateTaskProgress('dinleBul', 1);
        
        // Perfect streak kontrolü - hiç yanlış yapmamışsak perfect streak artır
        if (sessionWrong === 0) {
            updateTaskProgress('perfectStreak', 1);
            log.debug(`🔥 Perfect streak artırıldı! Mevcut: ${dailyTasks.todayStats.perfectStreak}`);
        }
        
        log.debug(`✅ Doğru cevap işlemi tamamlandı!`);
        log.debug(`📊 Sonra - session score: ${sessionScore}, session correct: ${sessionCorrect}`);
    } else {
        log.debug(`❌ === YANLIŞ CEVAP İŞLEMİ ===`);
        button.classList.add('wrong');
        if (elements.dinleFeedback) {
        elements.dinleFeedback.textContent = `❌ Hatalı! Doğru: ${currentDinleQuestion.kelime} (${currentDinleQuestion.anlam})`;
        elements.dinleFeedback.className = 'feedback wrong';
        }
        
        // Haptic feedback - yanlış cevap
        triggerHaptic('error');
        
        log.debug(`📊 Dinle wrong güncelleniyor: ${dinleWrong} + 1 = ${dinleWrong + 1}`);
        dinleWrong++;
        
        log.debug(`📊 addSessionWrong() çağrılıyor...`);
        addSessionWrong(); // Session yanlış sayısını artır
        log.debug(`❌ ÖNEMLI: Yanlış cevap için puan EKLENMEDİ!`);
        log.debug(`📊 Session score değişmedi: ${sessionScore}`);

        log.debug(`🔍 Doğru cevabı gösteriliyor...`);
        // Doğru cevabı göster
        let correctButtonFound = false;
        allBtns.forEach(btn => {
            if (btn.textContent.includes(currentDinleQuestion.kelime)) {
                btn.classList.add('correct');
                correctButtonFound = true;
                log.debug(`✅ Doğru buton bulundu ve işaretlendi: "${btn.textContent}"`);
            }
        });
        if (!correctButtonFound) {
            log.warn(`⚠️ Doğru buton bulunamadı!`);
        }
    }

    log.debug(`📊 Soru sayacı artırılıyor: ${dinleQuestionCount} + 1 = ${dinleQuestionCount + 1}`);
    dinleQuestionCount++; // Soru sayacını artır
    log.debug(`📊 FINAL - session: score=${sessionScore}, correct=${sessionCorrect}, wrong=${sessionWrong}`);
    log.debug(`📊 FINAL - dinle: score=${dinleScore}, correct=${dinleCorrect}, wrong=${dinleWrong}, questionCount=${dinleQuestionCount}`);
    log.debug(`🚨 === CEVAP KONTROLÜ BİTTİ ===`);
    log.debug(`🎨 UI güncelleniyor ve Next butonu gösteriliyor...`);
    updateDinleUI();
    // Show the Dinle 'Next' button
    if (elements.dinleNextBtn) {
    elements.dinleNextBtn.style.display = 'block';
    // 🔥 Animasyonu ekle
    elements.dinleNextBtn.classList.add("next-appear");
    }
    log.debug(`✅ Cevap işlemi tamamen tamamlandı!`);
}

function updateDinleUI() {
    log.debug(`🎨 DinleUI güncelleniyor...`);
    log.debug(`📊 Gösterilecek değerler: score=${dinleScore}, correct=${dinleCorrect}, wrong=${dinleWrong}`);
    if (elements.dinleScore) elements.dinleScore.textContent = dinleScore;
    if (elements.dinleCorrect) elements.dinleCorrect.textContent = dinleCorrect;
    if (elements.dinleWrong) elements.dinleWrong.textContent = dinleWrong;
    log.debug(`✅ DinleUI güncellendi!`);
}

// ============ BOŞLUK DOLDUR MODU ============
let currentBoslukQuestion = null;
let missingWord = '';
let missingIndex = -1;
let boslukQuestionCount = 0;
const BOSLUK_MAX_QUESTIONS = 10;

function loadBoslukQuestion() {
    // Önceki ses varsa durdur
    stopCurrentAudio();
    
    if (boslukQuestionCount >= BOSLUK_MAX_QUESTIONS) {
        log.game(`🏁 === BOŞLUK DOLDUR OYUNU BİTTİ ===`);
        log.game(`✅ ${BOSLUK_MAX_QUESTIONS} soru tamamlandı!`);
        log.game(`📊 Final oyun skorları: boslukScore=${boslukScore}, boslukCorrect=${boslukCorrect}, boslukWrong=${boslukWrong}`);
        log.game(`📊 Final session skorları: sessionScore=${sessionScore}, sessionCorrect=${sessionCorrect}, sessionWrong=${sessionWrong}`);
        
        // NOT: boslukDoldur zaten her doğru cevapta updateTaskProgress('boslukDoldur', 1) ile artırılıyor (satır 10411)
        // Burada tekrar eklemeye gerek yok, çift sayımı önlemek için kaldırıldı
        // updateTaskProgress('boslukDoldur', sessionCorrect);
        
        log.game(`💰 Session puanları global'e aktarılıyor: ${sessionScore} puan`);
        // Session puanlarını global'e aktar
        addToGlobalPoints(sessionScore, sessionCorrect);
        
        log.debug(`🔄 Ana menüye dönülüyor...`);
        // Direkt ana menüye dön
        elements.boslukMode.style.display = 'none';
        elements.mainMenu.style.display = 'block';
        
        // Navigasyon bar'ı göster (ana ekrana dönünce)
        showBottomNavBar();
        
        log.debug(`🧹 Oyun değişkenleri temizleniyor...`);
        // Sıfırla
        boslukScore = 0;
        boslukCorrect = 0;
        boslukWrong = 0;
        boslukQuestionCount = 0;
        updateBoslukUI();
        log.game(`✅ Boşluk Doldur oyunu bitti ve ana menüye dönüldü!`);
        return;
    }

    log.debug(`🔍 Ayet filtreleme başlıyor...`);
    log.debug(`🎯 Seçili zorluk: ${currentDifficulty}`);
    
    // Rastgele ayet seç (ayet_metni olan ayetleri filtrele)
    let validAyets = ayetOkuData.filter(a => a.ayet_metni && a.ayet_metni.trim());
    log.debug(`📦 Toplam ayet sayısı: ${ayetOkuData.length}`);
    log.debug(`✅ Geçerli ayet sayısı: ${validAyets.length}`);
    
    // Zorluk seviyesine göre filtrele (kelime sayısına göre)
    const diffLevel = CONFIG.difficultyLevels[currentDifficulty];
    log.debug(`📋 Zorluk aralığı: ${diffLevel.minDiff}-${diffLevel.maxDiff} (kelime sayısı)`);
    
    // Ayetleri kelime sayısına göre filtrele
    validAyets = validAyets.filter(ayet => {
        const words = ayet.ayet_metni.split(' ').filter(w => w && w.trim());
        const wordCount = words.length;
        // Kelime sayısını zorluk aralığına göre filtrele
        return wordCount >= diffLevel.minDiff && wordCount <= diffLevel.maxDiff;
    });
    
    log.debug(`✅ Zorluk filtresi sonrası: ${validAyets.length} ayet`);
    
    // Eğer filtrelenmiş ayet yoksa, tüm geçerli ayetleri kullan
    if (validAyets.length === 0) {
        log.warn('⚠️ Zorluk filtresine uygun ayet bulunamadı, tüm ayetler kullanılacak');
        validAyets = ayetOkuData.filter(a => a.ayet_metni && a.ayet_metni.trim());
    }
    
    if (validAyets.length === 0) {
        log.error('❌ Geçerli ayet bulunamadı!');
        return;
    }
    
    log.debug(`🎲 Rastgele ayet seçiliyor...`);
    const randomIndex = Math.floor(Math.random() * validAyets.length);
    const ayet = validAyets[randomIndex];
    log.debug(`✅ Seçilen ayet index: ${randomIndex}/${validAyets.length}`);
    
    log.debug(`📝 === SORU #${boslukQuestionCount + 1} ===`);
    log.debug(`📖 Sure: ${ayet.sure_adı || 'Bilinmiyor'}`);
    log.debug(`🔢 Ayet Kimliği: ${ayet.ayet_kimligi || 'Bilinmiyor'}`);
    log.debug(`📝 Ayet Metni: "${ayet.ayet_metni}"`);
    
    // Ayet metnini kelimelere böl
    const words = ayet.ayet_metni.split(' ').filter(w => w && w.trim());
    log.debug(`🔤 Kelime sayısı: ${words.length}`);
    log.debug(`🔤 Kelimeler:`, words);
    
    if (words.length < 4) {
        // Çok kısa ayetler için tekrar dene
        loadBoslukQuestion();
        return;
    }

    // Rastgele bir kelimeyi gizle
    missingIndex = Math.floor(Math.random() * words.length);
    missingWord = words[missingIndex];

    // Boşluk ile değiştir
    const displayText = words.map((w, i) => i === missingIndex ? '______' : w).join(' ');

    currentBoslukQuestion = ayet;

    // UI güncelle
    elements.boslukAyetText.textContent = displayText;

    // Seçenekler oluştur (boşluğa gelecek kelime)
    const wrongWords = [];
    let attempts = 0;
    while (wrongWords.length < 3 && attempts < 100) {
        attempts++;
        const randomAyet = validAyets[Math.floor(Math.random() * validAyets.length)];
        if (!randomAyet.ayet_metni) continue;
        
        const randomWords = randomAyet.ayet_metni.split(' ').filter(w => w && w.trim());
        if (randomWords.length === 0) continue;
        
        const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
        if (randomWord && randomWord !== missingWord && !wrongWords.includes(randomWord)) {
            wrongWords.push(randomWord);
        }
    }
    
    // Eğer yeterli yanlış cevap bulunamadıysa, eksik olanları doldur
    while (wrongWords.length < 3) {
        wrongWords.push('...');
    }

    const allOptions = [
        { text: missingWord, correct: true },
        ...wrongWords.map(w => ({ text: w, correct: false }))
    ];

    // Akıllı karıştır (tahmin edilmesini zorlaştırmak için)
    smartShuffle(allOptions);

    // Seçenekleri göster - Duolingo Tarzı
    elements.boslukOptions.innerHTML = '';
    allOptions.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'duolingo-option';
        // Boşluk Doldur'da her zaman Arapça format kullan (ayet parçaları)
        if (opt.text === '...' || opt.text.trim() === '') {
            // Boş seçenekler için normal format
            btn.textContent = opt.text;
        } else {
            // Arapça kelimeler için özel format
            btn.classList.add('arabic-option');
            btn.innerHTML = `<span style="direction: rtl;">${opt.text}</span>`;
        }
        
        // Touch event tracking (scroll/tap ayrımı için)
        let touchStart = { x: 0, y: 0, time: 0 };
        let isScrolling = false;
        
        // Masaüstü için onclick handler
        btn.onclick = () => {
            if (!btn.classList.contains('disabled')) {
                checkBoslukAnswer(btn, opt.correct);
            }
        };
        
        // Mobil için touch event'leri
        btn.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStart = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
            isScrolling = false;
        }, { passive: true });
        
        btn.addEventListener('touchmove', (e) => {
            if (touchStart.x !== 0 || touchStart.y !== 0) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchStart.x);
                const deltaY = Math.abs(touch.clientY - touchStart.y);
                // 10px'den fazla hareket varsa scroll'dur
                if (deltaX > 10 || deltaY > 10) {
                    isScrolling = true;
                }
            }
        }, { passive: true });
        
        btn.addEventListener('touchend', (e) => {
            // Scroll yapıldıysa tıklamayı engelle
            if (isScrolling) {
                touchStart = { x: 0, y: 0, time: 0 };
                isScrolling = false;
                return;
            }
            
            // Scroll değilse, tap olarak kabul et
            const touch = e.changedTouches[0];
            const deltaTime = Date.now() - touchStart.time;
            const deltaX = Math.abs(touch.clientX - touchStart.x);
            const deltaY = Math.abs(touch.clientY - touchStart.y);
            
            // Kısa süre (300ms) ve küçük hareket (10px) = tap
            if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
                e.preventDefault();
                e.stopPropagation();
                if (!btn.classList.contains('disabled')) {
                    checkBoslukAnswer(btn, opt.correct);
                }
            }
            
            touchStart = { x: 0, y: 0, time: 0 };
            isScrolling = false;
        }, { passive: false });
        
        elements.boslukOptions.appendChild(btn);
    });

    // Duolingo tarzı soru numarasını güncelle
    const boslukQuestionNumber = document.getElementById('boslukQuestionNumber');
    if (boslukQuestionNumber) {
        boslukQuestionNumber.textContent = `Sual ${boslukQuestionCount + 1} / ${BOSLUK_MAX_QUESTIONS}`;
    }
    
    // Duolingo tarzı ilerleme çubuğunu güncelle
    // İlerleme çubuğu kaldırıldı - soru sayısı gösterimi yeterli
    
    // Sure info güncelle
    if (elements.boslukSureInfo && currentBoslukQuestion) {
        elements.boslukSureInfo.textContent = `${currentBoslukQuestion.sure_adı || ''} ${currentBoslukQuestion.ayet_kimligi || ''}`;
        elements.boslukSureInfo.style.display = 'block';
    }

    if (elements.boslukFeedback) {
    elements.boslukFeedback.textContent = '';
    elements.boslukFeedback.className = 'feedback';
    }
    if (elements.boslukNextBtn) {
    elements.boslukNextBtn.style.display = 'none';
    }
    
    // Tüm butonları aktif et
    const allBtns = document.querySelectorAll('.bosluk-mode .duolingo-option, .bosluk-mode .option');
    allBtns.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('disabled', 'correct', 'wrong');
    });

    // Otomatik ses çal
    if (currentBoslukQuestion && currentBoslukQuestion.ayet_ses_dosyasi) {
        playAudio(currentBoslukQuestion.ayet_ses_dosyasi, elements.boslukAudioBtn);
    }
}

if (elements.boslukAudioBtn) {
    // Masaüstü için onclick
    elements.boslukAudioBtn.onclick = () => {
        if (currentBoslukQuestion && currentBoslukQuestion.ayet_ses_dosyasi) {
            playAudio(currentBoslukQuestion.ayet_ses_dosyasi, elements.boslukAudioBtn);
        }
    };
    // Mobil için touchend
    elements.boslukAudioBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentBoslukQuestion && currentBoslukQuestion.ayet_ses_dosyasi) {
            playAudio(currentBoslukQuestion.ayet_ses_dosyasi, elements.boslukAudioBtn);
        }
    }, { passive: false });
}

function checkBoslukAnswer(button, isCorrect) {
    log.debug(`🚨 === BOŞLUK DOLDUR CEVAP KONTROLÜ ===`);
    log.debug(`👆 Tıklanan buton: "${button.textContent}"`);
    log.debug(`✅/❌ isCorrect parametresi: ${isCorrect}`);
    log.debug(`📊 Mevcut soru: #${boslukQuestionCount + 1}/${BOSLUK_MAX_QUESTIONS}`);
    log.debug(`📊 Eksik kelime: "${missingWord}"`);
    log.debug(`📊 Önce - session: score=${sessionScore}, correct=${sessionCorrect}, wrong=${sessionWrong}`);
    log.debug(`📊 Önce - boşluk: score=${boslukScore}, correct=${boslukCorrect}, wrong=${boslukWrong}`);
    
    // KELİME İSTATİSTİKLERİ SADECE KELİME ÇEVİR OYUNUNDA KAYIT EDİLİYOR
    // Boşluk Doldur oyunu için istatistik kaydedilmiyor
    
    const allBtns = elements.boslukOptions.querySelectorAll('.duolingo-option, .option');
    log.debug(`🔒 ${allBtns.length} buton devre dışı bırakılıyor...`);
    allBtns.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });

    if (isCorrect) {
        log.debug(`✅ === DOĞRU CEVAP İŞLEMİ ===`);
        button.classList.add('correct');
        if (elements.boslukFeedback) {
        elements.boslukFeedback.textContent = '✅ Mâşâallah!';
        elements.boslukFeedback.className = 'feedback correct';
        }
        
        // Haptic feedback - doğru cevap
        triggerHaptic('success');
        
        log.debug(`💰 Boşluk Doldur sabit puan: 10 puan ekleniyor`);
        log.debug(`📊 Boşluk score güncelleniyor: ${boslukScore} + 10 = ${boslukScore + 10}`);
        boslukScore += 10; // Local oyun puanı
        boslukCorrect++;
        
        log.debug(`📊 addSessionPoints(10) çağrılıyor...`);
        addSessionPoints(10); // Session puanına ekle
        
        // Header score güncelle (yıldız gösterimi)
        const boslukHeaderScore = document.getElementById('boslukHeaderScore');
        if (boslukHeaderScore) {
            const currentStarPoints = Math.floor(totalPoints / 100);
            boslukHeaderScore.textContent = `⭐ ${currentStarPoints}`;
        }
        
        // Daily task progress - her doğru cevap için
        updateTaskProgress('boslukDoldur', 1);
        
        // Perfect streak kontrolü - hiç yanlış yapmamışsak perfect streak artır
        if (sessionWrong === 0) {
            updateTaskProgress('perfectStreak', 1);
            log.debug(`🔥 Perfect streak artırıldı! Mevcut: ${dailyTasks.todayStats.perfectStreak}`);
        }
        
        log.debug(`✅ Doğru cevap işlemi tamamlandı!`);

        // Tam ayeti doğru kelimeyi altın sarısı ile vurgulayarak göster
        showAnswerWithGoldenHighlight();
    } else {
        log.debug(`❌ === YANLIŞ CEVAP İŞLEMİ ===`);
        button.classList.add('wrong');
        if (elements.boslukFeedback) {
        elements.boslukFeedback.textContent = `❌ Hatalı! Doğru kelime: ${missingWord}`;
        elements.boslukFeedback.className = 'feedback wrong';
        }
        
        // Haptic feedback - yanlış cevap
        triggerHaptic('error');
        
        log.debug(`📊 Boşluk wrong güncelleniyor: ${boslukWrong} + 1 = ${boslukWrong + 1}`);
        boslukWrong++;
        
        log.debug(`📊 addSessionWrong() çağrılıyor...`);
        addSessionWrong(); // Session yanlış sayısını artır
        log.debug(`❌ ÖNEMLI: Yanlış cevap için puan EKLENMEDİ!`);

        log.debug(`🔍 Doğru cevabı gösteriliyor...`);
        // Doğru cevabı göster
        let correctButtonFound = false;
        allBtns.forEach(btn => {
            if (btn.textContent.includes(missingWord)) {
                btn.classList.add('correct');
                correctButtonFound = true;
                log.debug(`✅ Doğru buton bulundu: "${btn.textContent}"`);
            }
        });
        if (!correctButtonFound) {
            log.debug(`⚠️ Doğru buton bulunamadı! Aranan: "${missingWord}"`);
        }

        // Tam ayeti doğru kelimeyi altın sarısı ile vurgulayarak göster
        showAnswerWithGoldenHighlight();
    }

    log.debug(`📊 Soru sayacı artırılıyor: ${boslukQuestionCount} + 1 = ${boslukQuestionCount + 1}`);
    boslukQuestionCount++; // Soru sayacını artır
    log.debug(`📊 FINAL - session: score=${sessionScore}, correct=${sessionCorrect}, wrong=${sessionWrong}`);
    log.debug(`📊 FINAL - boşluk: score=${boslukScore}, correct=${boslukCorrect}, wrong=${boslukWrong}, questionCount=${boslukQuestionCount}`);
    log.debug(`🚨 === BOŞLUK DOLDUR CEVAP KONTROLÜ BİTTİ ===`);
    updateBoslukUI();
    // Show the Bosluk 'Next' button
    if (elements.boslukNextBtn) {
    elements.boslukNextBtn.style.display = 'block';
        elements.boslukNextBtn.classList.add("next-appear");
    }
}

if (elements.boslukNextBtn) {
    // Masaüstü için onclick
    elements.boslukNextBtn.onclick = () => {
        // Butonu hemen gizle
        if (elements.boslukNextBtn) {
            elements.boslukNextBtn.style.display = 'none';
            elements.boslukNextBtn.classList.remove("next-appear");
        }
        
        loadBoslukQuestion();
    };
    // Mobil için touchend
    elements.boslukNextBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Butonu hemen gizle
        if (elements.boslukNextBtn) {
            elements.boslukNextBtn.style.display = 'none';
            elements.boslukNextBtn.classList.remove("next-appear");
        }
        
        loadBoslukQuestion();
    }, { passive: false });
}

function updateBoslukUI() {
    log.debug(`🎨 BoslukUI güncelleniyor...`);
    log.debug(`📊 Gösterilecek değerler: score=${boslukScore}, correct=${boslukCorrect}, wrong=${boslukWrong}`);
    if (elements.boslukScore) elements.boslukScore.textContent = boslukScore;
    if (elements.boslukCorrect) elements.boslukCorrect.textContent = boslukCorrect;
    if (elements.boslukWrong) elements.boslukWrong.textContent = boslukWrong;
    log.debug(`✅ BoslukUI güncellendi!`);
}

function showAnswerWithGoldenHighlight() {
    // Doğru kelimeyi belirgin renkte vurgulayarak tam ayeti göster
    const fullText = currentBoslukQuestion.ayet_metni;
    
    log.debug(`🔍 Vurgulanacak kelime: "${missingWord}"`);
    log.debug(`📄 Tam metin uzunluğu: ${fullText.length}`);
    log.debug(`📄 Tam metin (ilk 50 karakter): "${fullText.substring(0, 50)}"`);
    
    // Arapça metinlerde direkt string replacement kullan (en güvenilir yöntem)
    // Kelimeyi bul ve tüm eşleşmeleri değiştir
    const highlightStyle = `style="color: #FF6B35 !important; font-weight: 700 !important; font-size: 1.15em !important; text-shadow: 0 2px 8px rgba(255, 107, 53, 0.6) !important; background: linear-gradient(135deg, rgba(255, 107, 53, 0.25) 0%, rgba(255, 193, 7, 0.25) 100%) !important; padding: 3px 6px !important; border-radius: 6px !important; border: 2px solid rgba(255, 107, 53, 0.4) !important; display: inline-block !important; font-family: 'KFGQPC Uthmanic Script HAFS Regular', 'Amiri', serif !important; transform: scale(1.05) !important; transition: all 0.3s ease !important;"`;
    
    // Direkt string replacement - tüm eşleşmeleri değiştir
    const highlightedWord = `<span class="golden-highlight" ${highlightStyle}>${missingWord}</span>`;
    const finalText = fullText.split(missingWord).join(highlightedWord);
    
    log.debug(`✅ Vurgulama yapıldı. Yeni metin uzunluğu: ${finalText.length}`);
    log.debug(`📄 Vurgulanmış metin (ilk 100 karakter): "${finalText.substring(0, 100)}"`);
    
    // innerHTML ile set et
    elements.boslukAyetText.innerHTML = finalText;
    
    // Ekstra güvenlik için direct style da uygula
    setTimeout(() => {
        const goldenSpans = elements.boslukAyetText.querySelectorAll('.golden-highlight');
        log.debug(`🔍 Bulunan span sayısı: ${goldenSpans.length}`);
        
        goldenSpans.forEach((span, index) => {
            span.style.color = '#FF6B35';
            span.style.fontWeight = '700';
            span.style.fontSize = '1.15em';
            span.style.textShadow = '0 2px 8px rgba(255, 107, 53, 0.6)';
            span.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.25) 0%, rgba(255, 193, 7, 0.25) 100%)';
            span.style.padding = '3px 6px';
            span.style.borderRadius = '6px';
            span.style.border = '2px solid rgba(255, 107, 53, 0.4)';
            span.style.display = 'inline-block';
            span.style.transform = 'scale(1.05)';
            span.style.transition = 'all 0.3s ease';
            
            log.debug(`✨ Span #${index + 1} stil uygulandı. İçerik: "${span.textContent}"`);
        });
        
        if (goldenSpans.length === 0) {
            log.error(`❌ Hiç span bulunamadı! Kelime eşleşmedi: "${missingWord}"`);
            log.error(`📄 Metin içinde kelime var mı kontrol: ${fullText.includes(missingWord)}`);
        } else {
            log.debug(`✅ ${goldenSpans.length} vurgulu span bulundu ve stil uygulandı!`);
        }
    }, 100);
}

// ============ DUA ET MODU ============
function showDua(shouldIncrement = false) {
    const dua = duaData[currentDuaIndex];
    if (!dua) return;

    elements.duaSureInfo.textContent = `Ayet: ${dua.ayet || ''}`;
    elements.duaArabic.textContent = dua.dua || '';
    elements.duaTranslation.textContent = dua.tercume || '';

    elements.prevDuaBtn.disabled = currentDuaIndex === 0;
    elements.nextDuaBtn.disabled = currentDuaIndex === duaData.length - 1;
    
    // Soru sayısını güncelle (sadece sonraki butonuna tıklandığında)
    if (shouldIncrement) {
        duaQuestionCount++;
    }
    // Soru sayacı kaldırıldı - bu modlar günlük görev için
}

elements.prevDuaBtn.onclick = () => {
    log.debug('⬅️ Önceki dua butonuna tıklandı');
    if (currentDuaIndex > 0) {
        log.debug('📍 Önceki duaya geçiliyor:', currentDuaIndex, '->', currentDuaIndex - 1);
        stopCurrentAudio(); // Mevcut ses varsa durdur
        currentDuaIndex--;
        showDua(false); // Soru sayısını artırma
        log.debug('✅ Önceki dua gösterildi');
        // Navigasyon - görev sayılmaz
    }
};

elements.nextDuaBtn.onclick = () => {
    log.debug('➡️ Sonraki dua butonuna tıklandı');
    if (currentDuaIndex < duaData.length - 1) {
        log.debug('📍 Sonraki duaya geçiliyor:', currentDuaIndex, '->', currentDuaIndex + 1);
        stopCurrentAudio(); // Mevcut ses varsa durdur
        currentDuaIndex++;
        showDua(true); // Soru sayısını artır
        log.debug('✅ Sonraki dua gösterildi');
        // Navigasyon - görev sayılmaz
    }
};

elements.duaAudioBtn.onclick = () => {
    log.debug('🔊 Dua audio butonuna tıklandı');
    const dua = duaData[currentDuaIndex];
    log.debug('📊 Mevcut dua bilgileri:', {
        index: currentDuaIndex,
        hasUrl: !!(dua && dua.ses_url),
        url: dua?.ses_url,
        start: dua?.start,
        title: dua?.dua_adi
    });
    
    if (dua && dua.ses_url) {
        // Önceki sesi durdur
        stopCurrentAudio();
        
        // Butonu devre dışı bırak
        elements.duaAudioBtn.disabled = true;
        log.debug('🔒 Audio butonu devre dışı bırakıldı');
        
        try {
            currentAudio = new Audio(dua.ses_url);
            
            // Başlangıç zamanı varsa ayarla (yüklenmeden önce)
            if (dua.start) {
                currentAudio.currentTime = dua.start;
            }
            
            // Direkt çalmayı dene
            currentAudio.play().then(() => {
                log.debug('🎵 Dua sesi başlatıldı - URL:', dua.ses_url);
                log.debug('🎵 Audio object durumu:', {
                    currentTime: currentAudio.currentTime,
                    duration: currentAudio.duration,
                    paused: currentAudio.paused,
                    readyState: currentAudio.readyState,
                    volume: currentAudio.volume
                });
                elements.duaAudioBtn.disabled = false; // Butonu tekrar aktif et
            }).catch(err => {
                log.error('❌ Ses çalma hatası:', err);
                elements.duaAudioBtn.disabled = false;
                currentAudio = null;
            });
            
            // Ses yüklenme durumu
            currentAudio.onloadstart = () => {
                log.debug('📥 Ses yüklenmeye başladı');
            };

            currentAudio.oncanplay = () => {
                log.debug('✅ Ses çalmaya hazır');
            };

            currentAudio.onplay = () => {
                log.debug('▶️ Ses çalmaya başladı');
            };

            currentAudio.onpause = () => {
                log.debug('⏸️ Ses duraklatıldı');
            };

            currentAudio.ontimeupdate = () => {
                // Null check - eğer currentAudio silinmişse event'i durdur
                if (!currentAudio) return;
                
                // Her 5 saniyede bir log (çok fazla log'u önlemek için)
                if (currentAudio.currentTime > 0 && Math.floor(currentAudio.currentTime) % 5 === 0) {
                    log.debug('⏱️ Ses oynatma zamanı:', currentAudio.currentTime.toFixed(2) + 's / ' + (currentAudio.duration || 0).toFixed(2) + 's');
                }
            };
            
            // Ses bittiğinde
            currentAudio.onended = () => {
                log.debug('🏁 Ses bitti');
                elements.duaAudioBtn.disabled = false;
                updateTaskProgress('duaOgre', 1);
                currentAudio = null;
            };
            
            // Hata durumunda
            currentAudio.onerror = (err) => {
                log.error('❌ Ses dosyası hatası:', err);
                log.error('❌ Hata detayları:', {
                    code: currentAudio.error?.code,
                    message: currentAudio.error?.message
                });
                elements.duaAudioBtn.disabled = false;
                currentAudio = null;
            };
            
        } catch (err) {
            log.error('Audio oluşturma hatası:', err);
            elements.duaAudioBtn.disabled = false;
            currentAudio = null;
        }
    }
};

// ============ AYET OKU MODU (RASTGELE) ============
function showAyet(shouldIncrement = false) {
    // Rastgele ayet seç
    currentAyetIndex = Math.floor(Math.random() * ayetOkuData.length);
    const ayet = ayetOkuData[currentAyetIndex];
    if (!ayet) return;
    
    elements.ayetSureInfo.textContent = `${ayet.sure_adı || 'Sûre'} - ${ayet.ayet_kimligi || ''}`;
    elements.ayetArabic.textContent = ayet.ayet_metni || '';
    elements.ayetTranslation.textContent = ayet.meal || '';
    
    // Soru sayısını güncelle (sadece sonraki butonuna tıklandığında)
    if (shouldIncrement) {
        ayetQuestionCount++;
    }
    // Soru sayacı kaldırıldı - bu modlar günlük görev için
}

elements.prevAyetBtn.onclick = () => {
    log.debug('⬅️ Önceki ayet butonuna tıklandı');
    stopCurrentAudio(); // Mevcut ses varsa durdur
    showAyet(false); // Rastgele önceki ayet, soru sayısını artırma
    log.debug('✅ Önceki ayet gösterildi');
    // Navigasyon - görev sayılmaz
};

elements.nextAyetBtn.onclick = () => {
    log.debug('➡️ Sonraki ayet butonuna tıklandı');
    stopCurrentAudio(); // Mevcut ses varsa durdur
    showAyet(true); // Rastgele sonraki ayet, soru sayısını artır
    log.debug('✅ Sonraki ayet gösterildi');
    // Navigasyon - görev sayılmaz
};

elements.ayetAudioBtn.onclick = () => {
    log.debug('🔊 Ayet audio butonuna tıklandı');
    const ayet = ayetOkuData[currentAyetIndex];
    log.debug('📊 Mevcut ayet bilgileri:', {
        index: currentAyetIndex,
        hasUrl: !!(ayet && ayet.ayet_ses_dosyasi),
        url: ayet?.ayet_ses_dosyasi,
        sure: ayet?.sure_adı,
        ayetKimligi: ayet?.ayet_kimligi
    });
    
    if (ayet && ayet.ayet_ses_dosyasi) {
        // Önceki sesi durdur
        stopCurrentAudio();
        
        // Butonu devre dışı bırak
        elements.ayetAudioBtn.disabled = true;
        log.debug('🔒 Audio butonu devre dışı bırakıldı');
        
        try {
            // URL doğrulama
            if (!ayet.ayet_ses_dosyasi || (!ayet.ayet_ses_dosyasi.startsWith('http://') && !ayet.ayet_ses_dosyasi.startsWith('https://'))) {
                log.error('❌ Geçersiz ses URL formatı:', ayet.ayet_ses_dosyasi);
                elements.ayetAudioBtn.disabled = false;
                return;
            }
            
            currentAudio = new Audio(ayet.ayet_ses_dosyasi);
            
            // Ses yüklendiğinde çal
            currentAudio.addEventListener('loadeddata', () => {
            currentAudio.play().then(() => {
                log.debug('🎵 Ayet sesi başlatıldı - URL:', ayet.ayet_ses_dosyasi);
                log.debug('🎵 Audio object durumu:', {
                    currentTime: currentAudio.currentTime,
                    duration: currentAudio.duration,
                    paused: currentAudio.paused,
                    readyState: currentAudio.readyState,
                    volume: currentAudio.volume
                });
                    elements.ayetAudioBtn.disabled = false;
            }).catch(err => {
                log.error('❌ Ses çalma hatası:', err);
                    log.error('❌ Ses URL:', ayet.ayet_ses_dosyasi);
                elements.ayetAudioBtn.disabled = false;
                currentAudio = null;
                });
            });
            
            // Hata durumunda
            currentAudio.onerror = (e) => {
                log.error('❌ Ses dosyası yüklenemedi:', ayet.ayet_ses_dosyasi);
                log.error('❌ Hata kodu:', currentAudio.error?.code);
                log.error('❌ Hata mesajı:', currentAudio.error?.message);
                log.error('❌ Hata tipi:', currentAudio.error?.name);
                
                // Tanzil.net URL'lerini everyayah.com'a çevir (fallback)
                if (ayet.ayet_ses_dosyasi && ayet.ayet_ses_dosyasi.includes('tanzil.net')) {
                    const ayetNo = ayet.ayet_kimligi?.split(':')[1] || '';
                    const sureNo = ayet.ayet_kimligi?.split(':')[0] || '';
                    const fallbackUrl = `https://everyayah.com/data/Alafasy_128kbps/${String(sureNo).padStart(3, '0')}${String(ayetNo).padStart(3, '0')}.mp3`;
                    log.error('🔄 Fallback URL deneniyor:', fallbackUrl);
                    
                    // Fallback URL'i dene
                    const fallbackAudio = new Audio(fallbackUrl);
                    fallbackAudio.addEventListener('loadeddata', () => {
                        fallbackAudio.play().then(() => {
                            log.debug('✅ Fallback ses başarıyla çalındı');
                            currentAudio = fallbackAudio;
                        }).catch(err => {
                            log.error('❌ Fallback ses de çalınamadı:', err);
                            elements.ayetAudioBtn.disabled = false;
                        });
                    });
                    fallbackAudio.onerror = () => {
                        log.error('❌ Fallback ses de yüklenemedi');
                        elements.ayetAudioBtn.disabled = false;
                    };
                    fallbackAudio.load();
                } else {
                    elements.ayetAudioBtn.disabled = false;
                    currentAudio = null;
                }
            };
            
            // Ses dosyasını yükle
            currentAudio.load();
            
            // Ses yüklenme durumu
            currentAudio.onloadstart = () => {
                log.debug('📥 Ses yüklenmeye başladı');
            };

            currentAudio.oncanplay = () => {
                log.debug('✅ Ses çalmaya hazır');
            };

            currentAudio.onplay = () => {
                log.debug('▶️ Ses çalmaya başladı');
            };

            currentAudio.onpause = () => {
                log.debug('⏸️ Ses duraklatıldı');
            };

            currentAudio.ontimeupdate = () => {
                // Null check - eğer currentAudio silinmişse event'i durdur
                if (!currentAudio) return;
                
                // Her 5 saniyede bir log (çok fazla log'u önlemek için)
                if (currentAudio.currentTime > 0 && Math.floor(currentAudio.currentTime) % 5 === 0) {
                    log.debug('⏱️ Ses oynatma zamanı:', currentAudio.currentTime.toFixed(2) + 's / ' + (currentAudio.duration || 0).toFixed(2) + 's');
                }
            };
            
            // Ses bittiğinde
            currentAudio.onended = () => {
                log.debug('🏁 Ayet sesi bitti');
                elements.ayetAudioBtn.disabled = false;
                updateTaskProgress('ayetOku', 1); // Görev sayılsın
                currentAudio = null;
            };
            
            // Hata durumunda
            currentAudio.onerror = (err) => {
                log.error('❌ Ses dosyası hatası:', err);
                log.error('❌ Hata detayları:', {
                    code: currentAudio.error?.code,
                    message: currentAudio.error?.message
                });
                elements.ayetAudioBtn.disabled = false;
                currentAudio = null;
            };
            
        } catch (err) {
            log.error('Audio oluşturma hatası:', err);
            elements.ayetAudioBtn.disabled = false;
            currentAudio = null;
        }
    }
};

// ============ HADİS OKU MODU (RASTGELE) ============
function showHadis(shouldIncrement = false) {
    // Rastgele hadis seç
    currentHadisIndex = Math.floor(Math.random() * hadisData.length);
    const hadis = hadisData[currentHadisIndex];
    if (!hadis) return;

    elements.hadisCategory.textContent = hadis.section || '';
    elements.hadisTitle.textContent = hadis.chapterName || '';
    elements.hadisHeader.textContent = hadis.header || '';
    elements.hadisText.textContent = hadis.text || '';
    elements.hadisRef.textContent = hadis.refno || '';
    
    // Soru sayısını güncelle (sadece sonraki butonuna tıklandığında)
    if (shouldIncrement) {
        hadisQuestionCount++;
    }
    // Soru sayacı kaldırıldı - bu modlar günlük görev için
}

elements.prevHadisBtn.onclick = () => {
    stopCurrentAudio(); // Mevcut ses varsa durdur
    showHadis(false); // Rastgele önceki hadis, soru sayısını artırma
    // Daily task progress - hadis okuma (önceki butonunda da sayılabilir)
    updateTaskProgress('hadisOku', 1);
};

elements.nextHadisBtn.onclick = () => {
    stopCurrentAudio(); // Mevcut ses varsa durdur
    showHadis(true); // Rastgele sonraki hadis, soru sayısını artır
    // Daily task progress - hadis okuma
    updateTaskProgress('hadisOku', 1);
};

// ============ OYUNU BAŞLAT ============
// Performance: Async initialization
setTimeout(async () => {
    try {
        await loadData();
        updateStatsBar(); // İstatistik barını initialize et
        log.debug('✅ Oyun veriler yüklendi ve hazır');
    } catch (error) {
        log.error('❌ Oyun yükleme hatası:', error);
    }
}, 100); // DOM hazır olduktan sonra async başlat
    // Global debug fonksiyonu - console'dan çağırılabilir
    window.debugStats = function() {
        log.debug('🔧 DEBUG - Mevcut Oyun İstatistikleri:');
        log.debug('Total Points:', typeof totalPoints !== 'undefined' ? totalPoints : 'Henüz yüklenmedi');
        log.debug('Star Points:', typeof starPoints !== 'undefined' ? starPoints : 'Henüz yüklenmedi');
        log.debug('Level:', typeof level !== 'undefined' ? level : 'Henüz yüklenmedi');
        log.debug('Session Score:', typeof sessionScore !== 'undefined' ? sessionScore : 'Henüz yüklenmedi');
    };

    // 🔍 SENKRONİZASYON TESTİ - Kapsamlı kontrol
    window.testSenkronizasyon = function() {
        log.debug('\n═══════════════════════════════════════');
        log.debug('🔍 BAŞARI & PUAN SİSTEMİ SENKRONİZASYON TESTİ');
        log.debug('═══════════════════════════════════════\n');

        // 1. MEVCUT DURUM
        log.debug('📊 1. MEVCUT DURUM:');
        log.debug('   totalPoints:', totalPoints);
        log.debug('   sessionScore:', sessionScore);
        log.debug('   level:', level);
        log.debug('   starPoints:', starPoints);
        log.debug('   badges:', JSON.stringify(badges));
        log.debug('   comboCount:', comboCount);

        // 2. ROZET HESAPLAMA KONTROLÜ
        log.debug('\n🏅 2. ROZET SİSTEMİ KONTROLÜ:');
        const expectedBadges = {
            bronze: Math.floor(totalPoints / 2000),
            silver: Math.floor(totalPoints / 8500),
            gold: Math.floor(totalPoints / 25500),
            diamond: Math.floor(totalPoints / 85000)
        };
        log.debug('   Beklenen:', JSON.stringify(expectedBadges));
        log.debug('   Mevcut:', JSON.stringify(badges));

        const badgeMatch = JSON.stringify(expectedBadges) === JSON.stringify(badges);
        log.debug('   Senkronizasyon:', badgeMatch ? '✅ UYUMLU' : '❌ UYUMSUZ');

        if (!badgeMatch) {
            log.debug('   ⚠️ Rozet sayıları tutarsız! updateBadgeSystem() çağrılıyor...');
            updateBadgeSystem();
            log.debug('   Düzeltilmiş:', JSON.stringify(badges));
        }

        // 3. BAŞARIM KONTROLÜ
        log.debug('\n🏆 3. BAŞARIM SİSTEMİ KONTROLÜ:');
        const unlockedAch = storage.getSafe('unlockedAchievements', [], { type: 'array' });
        log.debug('   Açılan başarımlar:', unlockedAch.length, 'adet');
        log.debug('   Liste:', unlockedAch.join(', '));

        // XP tabanlı başarımları kontrol et
        const xpAchievements = [
            { id: 'xp_500', threshold: 500, name: 'İlk Adım' },
            { id: 'xp_2000', threshold: 2000, name: 'Mübtedi Yolcu' },
            { id: 'xp_4000', threshold: 4000, name: 'Hızlı Talebe' },
            { id: 'xp_8500', threshold: 8500, name: 'Gümüş Ustası' },
            { id: 'xp_17000', threshold: 17000, name: 'İkinci Gümüş' },
            { id: 'xp_25500', threshold: 25500, name: 'Altın Ustası' },
            { id: 'xp_51000', threshold: 51000, name: 'İkinci Altın' },
            { id: 'xp_85000', threshold: 85000, name: 'Elmas Ustası' },
            { id: 'xp_170000', threshold: 170000, name: 'Ustalar Ustası' }
        ];

        let expectedAchievements = [];
        xpAchievements.forEach(ach => {
            if (totalPoints >= ach.threshold) {
                expectedAchievements.push(ach.id);
                const hasAch = unlockedAch.includes(ach.id);
                log.debug(`   ${hasAch ? '✅' : '❌'} ${ach.name} (${ach.threshold} XP): ${hasAch ? 'Açık' : 'KAPALI!'}`);
            }
        });

        const missingAchievements = expectedAchievements.filter(id => !unlockedAch.includes(id));
        if (missingAchievements.length > 0) {
            log.debug('   ⚠️ Eksik başarımlar:', missingAchievements.join(', '));
            log.debug('   💡 checkAchievements() çağrılıyor...');
            checkAchievements();
        }

        // 4. VERİ KALICILIĞI KONTROLÜ
        log.debug('\n💾 4. VERİ KALICILIĞI KONTROLÜ:');
        const lsPoints = localStorage.getItem('hasene_totalPoints');
        const lsBadges = localStorage.getItem('hasene_badges');
        log.debug('   localStorage totalPoints:', lsPoints);
        log.debug('   localStorage badges:', lsBadges);
        log.debug('   Memory totalPoints:', totalPoints);
        log.debug('   Memory badges:', JSON.stringify(badges));

        const lsMatch = parseInt(lsPoints) === totalPoints;
        log.debug('   Points senkronizasyon:', lsMatch ? '✅ UYUMLU' : '❌ UYUMSUZ');

        if (!lsMatch) {
            log.debug('   ⚠️ localStorage güncel değil! saveStats() çağrılıyor...');
            debouncedSaveStats(); // Debounced kaydetme
        }

        // 5. GÜNLÜK GÖREV KONTROLÜ
        log.debug('\n📅 5. GÜNLÜK GÖREV KONTROLÜ:');
        log.debug('   Bugünkü toplam puan:', dailyTasks.todayStats.toplamPuan);
        log.debug('   Günlük hedef:', dailyTasks.hedefler.toplamPuan);
        const dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
        const goalHasene = parseInt(localStorage.getItem('dailyGoalHasene')) || 2700;
        log.debug('   Daily Hasene:', dailyHasene, '/', goalHasene);
        log.debug('   Günlük hedef tamamlandı mı?', dailyHasene >= goalHasene ? '✅ EVET' : '❌ HAYIR');

        // 6. SEVIYE HESAPLAMA KONTROLÜ
        log.debug('\n⬆️ 6. SEVİYE SİSTEMİ KONTROLÜ:');
        const calculatedLevel = calculateLevel(totalPoints);
        log.debug('   Hesaplanan seviye:', calculatedLevel);
        log.debug('   Mevcut seviye:', level);
        log.debug('   Seviye senkronizasyon:', calculatedLevel === level ? '✅ UYUMLU' : '❌ UYUMSUZ');

        if (calculatedLevel !== level) {
            log.debug('   ⚠️ Seviye tutarsız! Düzeltiliyor...');
            level = calculatedLevel;
            updateStatsBar();
        }

        // 7. ÖZET RAPOR
        log.debug('\n═══════════════════════════════════════');
        log.debug('📊 ÖZET RAPOR:');
        log.debug('═══════════════════════════════════════');
        const allOK = badgeMatch && lsMatch && (calculatedLevel === level);
        log.debug('Genel Durum:', allOK ? '✅ TÜM SİSTEMLER SENKRONİZE' : '⚠️ BAZI SORUNLAR VAR');
        log.debug('Rozet Sistemi:', badgeMatch ? '✅' : '❌');
        log.debug('Veri Kalıcılığı:', lsMatch ? '✅' : '❌');
        log.debug('Seviye Sistemi:', (calculatedLevel === level) ? '✅' : '❌');
        log.debug('═══════════════════════════════════════\n');

        return allOK;
    };
    
    // Test puan ekleme fonksiyonu
    window.testAddPoints = function(points) {
        log.stats(`\n🎯 TEST: ${points} puan ekleniyor...`);
        log.stats('Önceki totalPoints:', totalPoints);
        addSessionPoints(points);
        log.stats('Sonraki totalPoints:', totalPoints);
        log.stats('✅ Puan eklendi. testSenkronizasyon() çalıştırılıyor...\n');
        setTimeout(() => testSenkronizasyon(), 500);
    };
    
    // Hızlı test senaryoları
    window.testSenaryo1 = function() {
        log.stats('\n🧪 SENARYO 1: Yeni kullanıcı (0 → 2500 XP)');
        resetPoints();
        testAddPoints(2500);
    };
    
    window.testSenaryo2 = function() {
        log.stats('\n🧪 SENARYO 2: Combo bonusu (3x doğru cevap)');
        resetPoints();
        addSessionPoints(10);
        addSessionPoints(10);
        addSessionPoints(10); // 3. cevap combo bonusu tetikler
        setTimeout(() => testSenkronizasyon(), 500);
    };
    
    window.testSenaryo3 = function() {
        log.stats('\n🧪 SENARYO 3: Rozet seviye atlama (25000 → 26000 XP)');
        totalPoints = 25000;
        updateBadgeSystem();
        debouncedSaveStats(); // Debounced kaydetme
        testAddPoints(1000); // Altın rozet kazanılmalı
    };
    
    window.testSenaryo4 = function() {
        log.stats('\n🧪 SENARYO 4: Sayfa yenileme simülasyonu');
        log.stats('1. Mevcut durum kaydediliyor...');
        debouncedSaveStats(); // Debounced kaydetme
        log.stats('2. Veri değişkenleri sıfırlanıyor (sayfa yenileme sim.)...');
        const savedPoints = totalPoints;
        totalPoints = 0;
        level = 1;
        badges = { bronze: 0, silver: 0, gold: 0, diamond: 0 };
        log.stats('3. Veriler yeniden yükleniyor...');
        loadStats().then(() => {
            log.stats('4. Senkronizasyon kontrol ediliyor...');
            setTimeout(() => {
                log.stats('Kaydedilen XP:', savedPoints);
                log.stats('Yüklenen XP:', totalPoints);
                testSenkronizasyon();
            }, 500);
        });
    };

    // Seviye geçiş test fonksiyonu - console'dan çağırılabilir
    window.testLevelUp = function(targetPoints) {
        log.stats('🎯 Seviye geçiş testi başlatılıyor...');
        log.stats('Mevcut puan:', totalPoints);
        log.stats('Hedef puan:', targetPoints);
        
        // Hedef puana sıçrama
        const oldLevel = calculateLevel(totalPoints);
        const difference = targetPoints - totalPoints;
        totalPoints = targetPoints;
        
        // Bugünkü puana da farkı ekle (test amaçlı)
        dailyTasks.todayStats.toplamPuan += difference;
        
        const newLevel = calculateLevel(totalPoints);
        
        log.debug('Eski seviye:', oldLevel);
        log.debug('Yeni seviye:', newLevel);
        
        // Seviye atlama kontrolü
        if (newLevel > oldLevel) {
            level = newLevel;
            log.game('✅ Seviye atlandı! Modal gösteriliyor...');
            showLevelUpModal(newLevel);
        } else {
            log.stats('❌ Seviye atlanmadı.');
        }
        
        updateStatsBar();
        debouncedSaveStats(); // Debounced kaydetme // Değişiklikleri kaydet
    };

    // Hızlı seviye test fonksiyonları
    window.testLevel2 = () => testLevelUp(1000);   // Seviye 2'ye çık
    window.testLevel3 = () => testLevelUp(2500);   // Seviye 3'e çık
    window.testLevel5 = () => testLevelUp(8500);   // Mertebe 5'e çık
    window.testLevel10 = () => testLevelUp(46000); // Mertebe 10'a çık
    window.resetPoints = () => { 
        totalPoints = 0; 
        level = 1; 
        updateStatsBar(); 
        debouncedSaveStats(); // Debounced kaydetme 
        log.stats('🔄 Puanlar sıfırlandı'); 
    };
    window.resetAllStats = resetAllStats;

    // Modal fonksiyonlarını global hale getir
    window.showBadgesModal = showBadgesModal;
    window.closeBadgesModal = closeBadgesModal;
    
    // Kritik fonksiyonları global hale getir (safety-checks için)
    // saveStats artık debouncedSaveStats kullanıyor, geriye uyumluluk için alias ekle
    window.saveStats = debouncedSaveStats;
    window.debouncedSaveStats = debouncedSaveStats;
    window.saveStatsImmediate = saveStatsImmediate;
    window.loadStats = loadStats;
    window.updateUI = updateUI;
    window.updateStatsBar = updateStatsBar;
    window.addSessionPoints = addSessionPoints;
    
    // Kritik değişkenleri global hale getir (safety-checks için)
    window.totalPoints = totalPoints;
    window.streakData = streakData;
    window.dailyTasks = dailyTasks;
    
    // SON ADIM: Kaydedilmiş verileri yükle
    try {
        // VERI SİSTEMİ BAŞLATMA (üçüncü taraf çerez sorunu için)
        log.debug('🚀 Veri sistemi başlatılıyor...');
        
        // IndexedDB başlat (çerez engellemelerinden etkilenmez)
        initIndexedDB().then(async () => {
            log.debug('✅ IndexedDB hazır!');
            await loadStats(); // Verileri yükle (IndexedDB öncelikli) - AWAIT EKLENDİ!
            updateStatsBar();
            log.debug('💾 Veriler yüklendi:', totalPoints, 'puan');
        }).catch(async (error) => {
            log.error('❌ IndexedDB hatası, localStorage kullanılıyor:', error);
            await loadStats(); // Fallback olarak localStorage - AWAIT EKLENDİ!
            updateStatsBar();
        });
    } catch (error) {
        showCustomAlert(`Veri yükleme hatası: ${error.message}`, 'error');
        log.error('❌ Veri yükleme hatası:', error);
    }
    
    // ============ MODAL BUTONLARINA EVENT LISTENER EKLE ============
    if (dailyTasksBtn) dailyTasksBtn.onclick = showDailyTasksModal;
    if (statsBtn) statsBtn.onclick = showStatsModal;
    if (calendarBtn) calendarBtn.onclick = showCalendarModal;
    if (xpInfoBtn) xpInfoBtn.onclick = showXPInfoModal;
    
    // Modal kapatma butonları
    const closeBadgesBtn = document.getElementById('closeBadgesBtn');
    const closeCalendarBtn = document.getElementById('closeCalendarBtn');
    const closeDailyTasksBtn = document.getElementById('closeDailyTasksBtn');
    const closeStatsBtn = document.getElementById('closeStatsBtn');
    const closeDailyGoalBtn = document.getElementById('closeDailyGoalBtn');
    const closeXPInfoBtn = document.getElementById('closeXPInfoBtn');
    
    if (closeBadgesBtn) closeBadgesBtn.onclick = closeBadgesModal;
    if (closeCalendarBtn) closeCalendarBtn.onclick = closeCalendarModal;
    if (closeDailyTasksBtn) closeDailyTasksBtn.onclick = closeDailyTasksModal;
    if (closeStatsBtn) closeStatsBtn.onclick = closeStatsModal;
    
    // Daily Goal Modal butonları
    if (closeDailyGoalBtn) {
        closeDailyGoalBtn.onclick = function(e) {
            e.stopPropagation();
            closeDailyGoalModal();
        };
        // Touch event için de ekle
        closeDailyGoalBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeDailyGoalModal();
        }, { passive: false });
    }
    
    // Hedef seçim butonları
    const dailyGoalEasyBtn = document.getElementById('dailyGoalEasyBtn');
    const dailyGoalNormalBtn = document.getElementById('dailyGoalNormalBtn');
    const dailyGoalSeriousBtn = document.getElementById('dailyGoalSeriousBtn');
    
    if (dailyGoalEasyBtn) {
        dailyGoalEasyBtn.onclick = function(e) {
            e.stopPropagation();
            setDailyGoal('easy');
        };
        dailyGoalEasyBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setDailyGoal('easy');
        }, { passive: false });
    }
    
    if (dailyGoalNormalBtn) {
        dailyGoalNormalBtn.onclick = function(e) {
            e.stopPropagation();
            setDailyGoal('normal');
        };
        dailyGoalNormalBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setDailyGoal('normal');
        }, { passive: false });
    }
    
    if (dailyGoalSeriousBtn) {
        dailyGoalSeriousBtn.onclick = function(e) {
            e.stopPropagation();
            setDailyGoal('serious');
        };
        dailyGoalSeriousBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setDailyGoal('serious');
        }, { passive: false });
    }
    if (closeXPInfoBtn) closeXPInfoBtn.onclick = closeXPInfoModal;
    
    // Not: Touch event'ler initStatsModalTouchEvents, initBadgesModalTouchEvents,
    // initCalendarModalTouchEvents fonksiyonları tarafından yönetiliyor
    
    // ============ MODAL SWIPE GESTURES ============
    // Modal'lara swipe down ile kapatma özelliği ekle
    const modals = ['badgesModal', 'statsModal', 'calendarModal', 'dailyTasksModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && CONFIG.swipeGesturesEnabled) {
            initSwipeGestures(modal, {
                onSwipeDown: () => {
                    // Swipe down ile modal'ı kapat
                    if (modalId === 'badgesModal') closeBadgesModal();
                    else if (modalId === 'statsModal') closeStatsModal();
                    else if (modalId === 'calendarModal') closeCalendarModal();
                    else if (modalId === 'dailyTasksModal') closeDailyTasksModal();
                }
            });
        }
    });
    
    // ============ BUTON HAPTIC FEEDBACK ============
    // Ana butonlara haptic feedback ekle
    const mainButtons = document.querySelectorAll('.flutter-btn, .game-card, .nav-btn, .back-btn');
    mainButtons.forEach(btn => {
        if (CONFIG.hapticEnabled) {
            btn.addEventListener('click', () => {
                triggerHaptic('light');
            }, { passive: true });
        }
    });
    
    // ============ MODE SWIPE GESTURES ============
    // Ayet Oku, Dua Et, Hadis Oku modlarına swipe jestleri ekle
    if (CONFIG.swipeGesturesEnabled) {
        // Ayet Oku modu - swipe left/right ile önceki/sonraki ayet
        const ayetMode = document.getElementById('ayetMode');
        if (ayetMode) {
            initSwipeGestures(ayetMode, {
                onSwipeLeft: () => {
                    // Swipe left = sonraki ayet
                    const nextBtn = document.getElementById('nextAyetBtn');
                    if (nextBtn && !nextBtn.disabled) {
                        nextBtn.click();
                    }
                },
                onSwipeRight: () => {
                    // Swipe right = önceki ayet
                    const prevBtn = document.getElementById('prevAyetBtn');
                    if (prevBtn && !prevBtn.disabled) {
                        prevBtn.click();
                    }
                }
            });
        }
        
        // Dua Et modu - swipe left/right ile önceki/sonraki dua
        const duaMode = document.getElementById('duaMode');
        if (duaMode) {
            initSwipeGestures(duaMode, {
                onSwipeLeft: () => {
                    // Swipe left = sonraki dua
                    const nextBtn = document.getElementById('nextDuaBtn');
                    if (nextBtn && !nextBtn.disabled) {
                        nextBtn.click();
                    }
                },
                onSwipeRight: () => {
                    // Swipe right = önceki dua
                    const prevBtn = document.getElementById('prevDuaBtn');
                    if (prevBtn && !prevBtn.disabled) {
                        prevBtn.click();
                    }
                }
            });
        }
        
        // Hadis Oku modu - swipe left/right ile önceki/sonraki hadis
        const hadisMode = document.getElementById('hadisMode');
        if (hadisMode) {
            initSwipeGestures(hadisMode, {
                onSwipeLeft: () => {
                    // Swipe left = sonraki hadis
                    const nextBtn = document.getElementById('nextHadisBtn');
                    if (nextBtn && !nextBtn.disabled) {
                        nextBtn.click();
                    }
                },
                onSwipeRight: () => {
                    // Swipe right = önceki hadis
                    const prevBtn = document.getElementById('prevHadisBtn');
                    if (prevBtn && !prevBtn.disabled) {
                        prevBtn.click();
                    }
                }
            });
        }
    }

}); // DOMContentLoaded event listener sonu


// ============ YENİ LOADING SCREEN ============
window.addEventListener('DOMContentLoaded', () => {
    // Yeni Loading Screen JavaScript
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContainer = document.getElementById('mainMenu');
    const progressBar = document.getElementById('loadingProgressBar');
    const progressLabel = document.getElementById('loadingProgressLabel');
    const hadisArabic = document.getElementById('hadisArabic');
    const hadisTurkish = document.getElementById('hadisTurkish');
    const bagIcon = document.getElementById('bagIcon');
    
    // Dinamik Hadisler Listesi
    const hadisler = [
        {
            arabic: 'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا',
            turkish: '"Kim Allah\'ın kitabından bir harf okursa, ona bir sevap verilir. O sevap da on mislidir."',
            source: '(Tirmizi, Sevâbü\'l-Kur\'ân 16)'
        },
        {
            arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
            turkish: '"Sizin en hayırlınız, Kur\'an\'ı öğrenen ve öğretendir."',
            source: '(Buhari, Fedâilü\'l-Kur\'ân 21)'
        },
        {
            arabic: 'إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ',
            turkish: '"Allah, sizden birinizin bir iş yaptığında onu mükemmel yapmasını sever."',
            source: '(Taberani)'
        },
        {
            arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
            turkish: '"İlim öğrenmek her Müslümana farzdır."',
            source: '(İbn Mâce)'
        },          
        {
            arabic: 'إِنَّ الْأَجْرَ مَعَ الْمُصْطَلِحِينَ',
            turkish: '"Kazancı, hakseverlerle birlikte olanlara verir."',
            source: '(Ahmed bin Hanbel)'
        }
    ];
    
    // Rastgele hadis seç
    const randomHadis = hadisler[Math.floor(Math.random() * hadisler.length)];
    if (hadisArabic && hadisTurkish) {
        hadisArabic.textContent = randomHadis.arabic;
        const hadisSource = document.querySelector('.loading-hadith-source-text, .loading-hadith-source-pro');
        if (hadisSource) {
            hadisTurkish.textContent = randomHadis.turkish;
            hadisSource.textContent = randomHadis.source;
        } else {
        hadisTurkish.innerHTML = `"${randomHadis.turkish}"<br><small style="opacity: 0.7; font-size: 13px; margin-top: 10px; display: block;">${randomHadis.source}</small>`;
        }
    }
    
    // Harfleri kitaba uçurma animasyonu
    const arabicAlphabet = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
    let animationInterval = null;
    
    // Tüm uçan harfleri temizle
    function clearAllFlyingLetters() {
        const allLetters = document.querySelectorAll('.flying-letter');
        allLetters.forEach(letter => {
            if (letter.parentNode) {
                letter.parentNode.removeChild(letter);
            }
        });
    }
    
    function animateLettersToBag() {
        // Önce tüm eski harfleri temizle
        clearAllFlyingLetters();
        
        const bagIconElement = document.getElementById('bagIcon');
        if (!bagIconElement) {
            setTimeout(animateLettersToBag, 500);
            return;
        }
        
        const bagRect = bagIconElement.getBoundingClientRect();
        const bagCenterX = bagRect.left + bagRect.width / 2;
        const bagCenterY = bagRect.top + bagRect.height / 2;
        
        arabicAlphabet.forEach((letter, index) => {
            setTimeout(() => {
                // Rastgele başlangıç pozisyonu - kesinlikle ekranın dışından
                const side = Math.floor(Math.random() * 4);
                let startX, startY;
                
                if (side === 0) { // Üst
                    startX = Math.random() * window.innerWidth;
                    startY = -100; // Ekranın üstünden
                } else if (side === 1) { // Sağ
                    startX = window.innerWidth + 100;
                    startY = Math.random() * window.innerHeight;
                } else if (side === 2) { // Alt
                    startX = Math.random() * window.innerWidth;
                    startY = window.innerHeight + 100;
                } else { // Sol
                    startX = -100;
                    startY = Math.random() * window.innerHeight;
                }
                
                const letterEl = document.createElement('div');
                letterEl.className = 'flying-letter';
                letterEl.textContent = letter;
                letterEl.style.position = 'fixed';
                letterEl.style.left = startX + 'px';
                letterEl.style.top = startY + 'px';
                letterEl.style.zIndex = '100000';
                letterEl.style.pointerEvents = 'none';
                letterEl.style.opacity = '1';
                letterEl.style.transform = 'scale(1)';
                letterEl.style.transition = 'none'; // İlk başta transition yok
                letterEl.style.willChange = 'transform, opacity, left, top';
                
                // Loading screen içine ekle
                if (loadingScreen) {
                    loadingScreen.appendChild(letterEl);
                } else {
                    document.body.appendChild(letterEl);
                }
                
                // Animasyonu hemen başlat (requestAnimationFrame ile)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Transition'ı aktif et ve hedefe git - daha yavaş (4.5 saniye)
                        letterEl.style.transition = 'all 4.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        letterEl.style.left = bagCenterX + 'px';
                        letterEl.style.top = bagCenterY + 'px';
                        letterEl.style.transform = 'scale(0.4) rotate(360deg)';
                        
                        // Kitaba yaklaştıkça küçül
            setTimeout(() => {
                            if (letterEl && letterEl.parentNode) {
                                letterEl.style.transform = 'scale(0.25) rotate(360deg)';
                            }
                        }, 3500); // 2000'den 3500'e çıkarıldı
                        
                        // Kitaba ulaştıktan sonra kaybol - kesinlikle kaldır
                        setTimeout(() => {
                            if (letterEl && letterEl.parentNode) {
                                letterEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                                letterEl.style.opacity = '0';
                                letterEl.style.transform = 'scale(0.01) rotate(360deg)';
                                
                                // DOM'dan kesinlikle kaldır
                                setTimeout(() => {
                                    if (letterEl && letterEl.parentNode) {
                                        try {
                                            letterEl.parentNode.removeChild(letterEl);
                                        } catch(e) {
                                            // Zaten kaldırılmış olabilir
                                        }
                                    }
                                }, 300);
                            }
                        }, 4500); // 2500'den 4500'e çıkarıldı
                    });
                });
            }, index * 300); // 200'den 300'e çıkarıldı (harfler arası gecikme)
        });
    }
    
    // Animasyonu başlat
    const startAnimation = () => {
        // Önce tüm harfleri temizle
        clearAllFlyingLetters();
        
        const bagIconElement = document.getElementById('bagIcon');
        if (bagIconElement && bagIconElement.complete) {
            // Önceki interval'i temizle
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
            }
            
            // İlk animasyonu başlat
            setTimeout(() => {
                animateLettersToBag();
            }, 1000);
            
            // Yeni interval başlat - daha uzun aralık (harfler yavaş uçtuğu için)
            animationInterval = setInterval(() => {
                animateLettersToBag();
            }, 12000); // 8 saniyeden 12 saniyeye çıkarıldı
        } else {
            setTimeout(startAnimation, 200);
        }
    };
    
    // Sayfa yüklendiğinde temizle ve başlat
    clearAllFlyingLetters();
    
    // Biraz bekleyip başlat (DOM'un hazır olması için)
    setTimeout(() => {
        startAnimation();
    }, 300);
    
    // Sayfa kapanırken temizle
    window.addEventListener('beforeunload', () => {
        clearAllFlyingLetters();
        if (animationInterval) {
            clearInterval(animationInterval);
        }
    });
    
    // Progress bar animasyonu
    let progress = 0;
    const progressSteps = [
        { percent: 40, label: 'Kelime verileri yükleniyor...', duration: 2000 },
        { percent: 70, label: 'Ayetler hazırlanıyor...', duration: 2000 },
        { percent: 100, label: 'Haydi Bismillah...', duration: 1500 }
    ];
    
    function updateLoadingProgress() {
        if (progressSteps.length === 0) return;
        
        const step = progressSteps.shift();
        const targetProgress = step.percent;
        const increment = (targetProgress - progress) / (step.duration / 30);
        
        const interval = setInterval(() => {
            progress += increment;
            if (progress >= targetProgress) {
                progress = targetProgress;
                clearInterval(interval);
                
                if (progressSteps.length > 0) {
                    setTimeout(updateLoadingProgress, 500);
                } else {
    setTimeout(() => {
                        // Loading screen kapanırken tüm harfleri temizle
                        clearAllFlyingLetters();
                        if (animationInterval) {
                            clearInterval(animationInterval);
                            animationInterval = null;
                        }
                        
                        if (loadingScreen) {
                            loadingScreen.style.opacity = '0';
                            setTimeout(() => {
                                loadingScreen.style.display = 'none';
                                // Ekstra temizlik
                                clearAllFlyingLetters();
                            }, 500);
                        }
                        
                const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
                if (!hasSeenOnboarding) {
                    setTimeout(() => {
                        if (typeof showOnboarding === 'function') {
                            showOnboarding();
                        } else {
        if (mainContainer) mainContainer.style.display = 'block';
                        }
                    }, 100);
                } else {
                    if (mainContainer) mainContainer.style.display = 'block';
                }
                    }, 1000);
                }
            }
            
        if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }, 30);
        
        if (progressLabel) {
            progressLabel.textContent = step.label;
        }
    }
    
    setTimeout(() => {
        updateLoadingProgress();
    }, 500);
});




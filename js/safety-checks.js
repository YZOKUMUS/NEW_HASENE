// ============ GÜVENLİK KONTROLLERİ VE BOZULMA ÖNLEMLERİ ============

/**
 * Critical function wrapper - fonksiyonları güvenli şekilde çalıştırır
 * Hata durumunda uygulama çökmesini önler
 */
function safeExecute(fn, context = null, fallback = null, errorMessage = 'Fonksiyon çalıştırılamadı') {
    try {
        if (typeof fn !== 'function') {
            log.error('❌ safeExecute: Fonksiyon değil!', fn);
            return fallback;
        }
        return fn.call(context);
    } catch (error) {
        log.error(`❌ ${errorMessage}:`, error);
        if (CONFIG.showCriticalErrors) {
            console.error('Stack trace:', error.stack);
        }
        return fallback;
    }
}

/**
 * Async fonksiyonlar için güvenli wrapper
 */
async function safeExecuteAsync(fn, context = null, fallback = null, errorMessage = 'Async fonksiyon çalıştırılamadı') {
    try {
        if (typeof fn !== 'function') {
            log.error('❌ safeExecuteAsync: Fonksiyon değil!', fn);
            return fallback;
        }
        return await fn.call(context);
    } catch (error) {
        log.error(`❌ ${errorMessage}:`, error);
        if (CONFIG.showCriticalErrors) {
            console.error('Stack trace:', error.stack);
        }
        return fallback;
    }
}

/**
 * DOM element güvenli erişim
 */
function safeGetElement(id, required = false) {
    const element = document.getElementById(id);
    if (!element && required) {
        log.error(`❌ Kritik element bulunamadı: ${id}`);
        if (CONFIG.showCriticalErrors) {
            showCustomAlert(`Kritik bir öğe yüklenemedi: ${id}. Lütfen sayfayı yenileyin.`, 'error');
        }
    }
    return element;
}

/**
 * Veri doğrulama - kritik değişkenlerin geçerliliğini kontrol eder
 */
function validateCriticalData() {
    const issues = [];
    
    // totalPoints kontrolü
    if (typeof totalPoints !== 'number' || isNaN(totalPoints) || totalPoints < 0) {
        issues.push('totalPoints geçersiz');
        totalPoints = 0; // Sıfırla
    }
    
    // dailyTasks kontrolü
    if (!dailyTasks || typeof dailyTasks !== 'object') {
        issues.push('dailyTasks geçersiz');
        // Varsayılan değerlerle yeniden oluştur
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
    }
    
    // streakData kontrolü
    if (!streakData || typeof streakData !== 'object') {
        issues.push('streakData geçersiz');
        streakData = {
            currentStreak: 0,
            bestStreak: 0,
            totalPlayDays: 0,
            playDates: [],
            todayDate: getLocalDateString(),
            todayProgress: 0,
            dailyGoal: 5
        };
    }
    
    if (issues.length > 0) {
        log.warn('⚠️ Veri doğrulama sorunları tespit edildi:', issues);
        // Verileri kaydet
        saveStats();
        return false;
    }
    
    return true;
}

/**
 * Fonksiyon varlık kontrolü - kritik fonksiyonların tanımlı olduğunu kontrol eder
 */
function validateCriticalFunctions() {
    const criticalFunctions = [
        'saveStats',
        'loadStats',
        'updateUI',
        'updateStatsBar',
        'addSessionPoints',
        'getLocalDateString'
    ];
    
    const missing = [];
    criticalFunctions.forEach(fnName => {
        if (typeof window[fnName] !== 'function') {
            missing.push(fnName);
        }
    });
    
    if (missing.length > 0) {
        log.error('❌ Kritik fonksiyonlar eksik:', missing);
        return false;
    }
    
    return true;
}

/**
 * Sistem sağlık kontrolü - uygulama başlatmadan önce çalışır
 */
function healthCheck() {
    log.debug('🔍 Sistem sağlık kontrolü başlatılıyor...');
    
    // 1. Kritik fonksiyonlar
    if (!validateCriticalFunctions()) {
        log.error('❌ Kritik fonksiyonlar eksik!');
        return false;
    }
    
    // 2. Kritik veriler
    if (!validateCriticalData()) {
        log.warn('⚠️ Veri doğrulama sorunları var ama devam ediliyor...');
    }
    
    // 3. DOM hazır mı?
    if (document.readyState === 'loading') {
        log.warn('⚠️ DOM henüz yüklenmedi');
    }
    
    // 4. localStorage erişilebilir mi?
    try {
        localStorage.setItem('__health_check__', 'ok');
        localStorage.removeItem('__health_check__');
    } catch (e) {
        log.error('❌ localStorage erişilemiyor!', e);
        return false;
    }
    
    log.debug('✅ Sistem sağlık kontrolü tamamlandı');
    return true;
}

/**
 * Recovery mekanizması - hata durumunda verileri kurtarır
 */
function recoverFromError(error, context = 'unknown') {
    log.error(`❌ Hata kurtarma başlatılıyor (${context}):`, error);
    
    try {
        // 1. Verileri doğrula ve düzelt
        validateCriticalData();
        
        // 2. Verileri kaydet
        saveStats();
        
        // 3. UI'ı sıfırla
        if (typeof hideAllModes === 'function') {
            hideAllModes();
        }
        if (elements && elements.mainMenu) {
            elements.mainMenu.style.display = 'block';
        }
        
        // 4. Kullanıcıya bilgi ver
        if (CONFIG.showCriticalErrors) {
            showCustomAlert(
                'Bir hata oluştu ancak verileriniz korundu. Lütfen sayfayı yenileyin.',
                'warning',
                'Hata Kurtarıldı'
            );
        }
        
        return true;
    } catch (recoveryError) {
        log.error('❌ Hata kurtarma başarısız:', recoveryError);
        return false;
    }
}

/**
 * Global error handler - yakalanmamış hataları yakalar
 */
window.addEventListener('error', (event) => {
    log.error('🚨 Yakalanmamış hata:', event.error);
    recoverFromError(event.error, 'global-error-handler');
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    log.error('🚨 Yakalanmamış promise rejection:', event.reason);
    recoverFromError(event.reason, 'unhandled-rejection');
});

// Health check'i sayfa yüklendiğinde çalıştır
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => healthCheck(), 1000); // 1 saniye bekle (tüm scriptler yüklensin)
    });
} else {
    setTimeout(() => healthCheck(), 1000);
}

// Export functions
window.safeExecute = safeExecute;
window.safeExecuteAsync = safeExecuteAsync;
window.safeGetElement = safeGetElement;
window.validateCriticalData = validateCriticalData;
window.healthCheck = healthCheck;
window.recoverFromError = recoverFromError;


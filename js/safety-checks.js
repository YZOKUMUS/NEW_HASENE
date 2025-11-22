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
    
    // totalPoints kontrolü (window üzerinden kontrol et)
    let totalPointsToCheck;
    try {
        // Önce window'da kontrol et
        if (typeof window.totalPoints !== 'undefined') {
            totalPointsToCheck = window.totalPoints;
        } else {
            // window'da yoksa, global scope'ta kontrol et (try-catch ile güvenli)
            totalPointsToCheck = typeof totalPoints !== 'undefined' ? totalPoints : null;
        }
        
        if (totalPointsToCheck === null || typeof totalPointsToCheck !== 'number' || isNaN(totalPointsToCheck) || totalPointsToCheck < 0) {
            issues.push('totalPoints geçersiz veya tanımlı değil');
            const defaultValue = 0;
            window.totalPoints = defaultValue;
            // Eğer global scope'ta da tanımlıysa, oraya da at
            if (typeof totalPoints !== 'undefined') {
                totalPoints = defaultValue;
            }
        } else {
            // Geçerli değer varsa, window'a da at
            window.totalPoints = totalPointsToCheck;
        }
    } catch (e) {
        issues.push('totalPoints tanımlı değil (catch)');
        window.totalPoints = 0;
    }
    
    // dailyTasks kontrolü (tanımlı olup olmadığını kontrol et)
    try {
        if (typeof dailyTasks === 'undefined' || !dailyTasks || typeof dailyTasks !== 'object') {
            issues.push('dailyTasks geçersiz veya tanımlı değil');
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
    } catch (e) {
        issues.push('dailyTasks tanımlı değil (catch)');
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
    
    // streakData kontrolü (tanımlı olup olmadığını kontrol et - window üzerinden)
    // streakData let/const ile tanımlı olabilir, bu yüzden window üzerinden kontrol et
    let streakDataToCheck;
    try {
        // Önce window'da kontrol et
        if (typeof window.streakData !== 'undefined') {
            streakDataToCheck = window.streakData;
        } else {
            // window'da yoksa, global scope'ta kontrol et (try-catch ile güvenli)
            streakDataToCheck = typeof streakData !== 'undefined' ? streakData : null;
        }
        
        if (!streakDataToCheck || typeof streakDataToCheck !== 'object') {
            issues.push('streakData geçersiz veya tanımlı değil');
            // Varsayılan değerlerle oluştur
            const defaultStreakData = {
                currentStreak: 0,
                bestStreak: 0,
                totalPlayDays: 0,
                playDates: [],
                todayDate: typeof getLocalDateString === 'function' ? getLocalDateString() : new Date().toISOString().split('T')[0],
                todayProgress: 0,
                dailyGoal: 5
            };
            window.streakData = defaultStreakData;
            // Eğer global scope'ta da tanımlıysa, oraya da at
            if (typeof streakData !== 'undefined') {
                streakData = defaultStreakData;
            }
        }
    } catch (e) {
        // streakData tanımlı değilse, window'a varsayılan değerleri at
        issues.push('streakData tanımlı değil (catch)');
        window.streakData = {
            currentStreak: 0,
            bestStreak: 0,
            totalPlayDays: 0,
            playDates: [],
            todayDate: typeof getLocalDateString === 'function' ? getLocalDateString() : new Date().toISOString().split('T')[0],
            todayProgress: 0,
            dailyGoal: 5
        };
    }
    
    if (issues.length > 0) {
        // Sadece gerçekten kritikse göster (log.warn artık CONFIG.showWarnings ile kontrol ediliyor)
        if (typeof CONFIG !== 'undefined' && CONFIG.showWarnings) {
            log.warn('⚠️ Veri doğrulama sorunları tespit edildi:', issues);
        }
        // Verileri kaydet (debouncedSaveStats veya saveStatsImmediate kullan)
        if (typeof debouncedSaveStats === 'function') {
            debouncedSaveStats();
        } else if (typeof saveStatsImmediate === 'function') {
            saveStatsImmediate().catch(() => {});
        }
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
        // CSP uyumlu: Sadece window'da kontrol et (eval kullanmadan)
        if (typeof window[fnName] !== 'function') {
            missing.push(fnName);
        }
    });
    
    if (missing.length > 0) {
        // Sadece gerçekten eksikse hata ver (fonksiyonlar henüz yüklenmemiş olabilir)
        // İlk yüklemede fonksiyonlar henüz yüklenmemiş olabilir, bu normal
        // Sadece showWarnings aktifse göster
        if (typeof CONFIG !== 'undefined' && CONFIG.showWarnings) {
            log.warn('❌ Kritik fonksiyonlar eksik!', missing);
        }
        // 3 saniye sonra tekrar kontrol et
        if (typeof window.healthCheckRetryCount === 'undefined') {
            window.healthCheckRetryCount = 0;
        }
        
        if (window.healthCheckRetryCount < 3) {
            window.healthCheckRetryCount++;
            // Debug modunda sadece bilgi ver
            if (log && log.debug) {
                log.debug(`⚠️ Bazı fonksiyonlar henüz yüklenmedi, tekrar kontrol edilecek (${window.healthCheckRetryCount}/3):`, missing);
            }
            // 2 saniye sonra tekrar dene
            setTimeout(() => {
                if (validateCriticalFunctions()) {
                    if (log && log.debug) {
                        log.debug('✅ Tüm kritik fonksiyonlar yüklendi!');
                    }
                }
            }, 2000);
            return false;
        } else {
            // 3 deneme sonrası hala eksikse gerçekten eksik demektir
            // Sadece showWarnings aktifse göster
            if (typeof CONFIG !== 'undefined' && CONFIG.showWarnings) {
                log.error('❌ Kritik fonksiyonlar eksik (3 deneme sonrası):', missing);
            }
            return false;
        }
    }
    
    // Tüm fonksiyonlar yüklendi
    window.healthCheckRetryCount = 0; // Reset
    return true;
}

/**
 * Sistem sağlık kontrolü - uygulama başlatmadan önce çalışır
 */
function healthCheck() {
    log.debug('🔍 Sistem sağlık kontrolü başlatılıyor...');
    
    // 1. Kritik fonksiyonlar
    if (!validateCriticalFunctions()) {
        // Sadece showWarnings aktifse göster
        if (typeof CONFIG !== 'undefined' && CONFIG.showWarnings) {
            log.error('❌ Kritik fonksiyonlar eksik!');
        }
        return false;
    }
    
    // 2. Kritik veriler
    if (!validateCriticalData()) {
        // Sadece showWarnings aktifse göster
        if (typeof CONFIG !== 'undefined' && CONFIG.showWarnings) {
            log.warn('⚠️ Veri doğrulama sorunları var ama devam ediliyor...');
        }
    }
    
    // 3. DOM hazır mı?
    if (document.readyState === 'loading') {
        // Sadece showWarnings aktifse göster
        if (typeof CONFIG !== 'undefined' && CONFIG.showWarnings) {
            log.warn('⚠️ DOM henüz yüklenmedi');
        }
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
    // Recovery fonksiyonunun kendisinden kaynaklanan hataları önle
    if (recoverFromError._inProgress) {
        return false; // Zaten recovery işlemi devam ediyor, sonsuz döngüyü önle
    }
    
    try {
        recoverFromError._inProgress = true;
        
        if (typeof log !== 'undefined' && log.error) {
            log.error(`❌ Hata kurtarma başlatılıyor (${context}):`, error);
        }
        
        // 1. Verileri doğrula ve düzelt (güvenli)
        try {
            if (typeof validateCriticalData === 'function') {
                validateCriticalData();
            }
        } catch (e) {
            // validateCriticalData hatası - ignore et
        }
        
        // 2. Verileri kaydet (debouncedSaveStats veya saveStatsImmediate kullan)
        try {
            if (typeof debouncedSaveStats === 'function') {
                debouncedSaveStats();
            } else if (typeof saveStatsImmediate === 'function') {
                saveStatsImmediate().catch(() => {});
            } else if (typeof saveStats === 'function') {
                saveStats();
            }
        } catch (e) {
            // Save hatası - ignore et
        }
        
        // 3. UI'ı sıfırla (güvenli)
        try {
            if (typeof hideAllModes === 'function') {
                hideAllModes();
            }
            if (typeof elements !== 'undefined' && elements && elements.mainMenu) {
                elements.mainMenu.style.display = 'block';
            }
        } catch (e) {
            // UI hatası - ignore et
        }
        
        // 4. Kullanıcıya bilgi ver (güvenli)
        try {
            if (typeof CONFIG !== 'undefined' && CONFIG.showCriticalErrors && 
                typeof showCustomAlert === 'function') {
                showCustomAlert(
                    'Bir hata oluştu ancak verileriniz korundu. Lütfen sayfayı yenileyin.',
                    'warning',
                    'Hata Kurtarıldı'
                );
            }
        } catch (e) {
            // Alert hatası - ignore et
        }
        
        return true;
    } catch (recoveryError) {
        // Recovery fonksiyonunun kendisi hata verdi - sessizce ignore et
        return false;
    } finally {
        // 1 saniye sonra _inProgress flag'ini sıfırla
        setTimeout(() => {
            recoverFromError._inProgress = false;
        }, 1000);
    }
}

/**
 * Global error handler - yakalanmamış hataları yakalar
 * NOT: index.html'de zaten bir global error handler var, bu yüzden bu handler'ı devre dışı bıraktık
 * Çakışmayı önlemek için bu handler sadece manuel çağrılar için kullanılabilir
 */
// window.addEventListener('error', (event) => {
//     log.error('🚨 Yakalanmamış hata:', event.error);
//     recoverFromError(event.error, 'global-error-handler');
// });

/**
 * Unhandled promise rejection handler
 * NOT: index.html'de zaten bir unhandled rejection handler var, bu yüzden bu handler'ı devre dışı bıraktık
 * Çakışmayı önlemek için bu handler sadece manuel çağrılar için kullanılabilir
 */
// window.addEventListener('unhandledrejection', (event) => {
//     log.error('🚨 Yakalanmamış promise rejection:', event.reason);
//     recoverFromError(event.reason, 'unhandled-rejection');
// });

// Health check'i sayfa yüklendiğinde çalıştır (fonksiyonların yüklenmesi için daha fazla bekle)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => healthCheck(), 3000); // 3 saniye bekle (tüm scriptler yüklensin)
    });
} else {
    setTimeout(() => healthCheck(), 3000);
}

// Export functions
window.safeExecute = safeExecute;
window.safeExecuteAsync = safeExecuteAsync;
window.safeGetElement = safeGetElement;
window.validateCriticalData = validateCriticalData;
window.healthCheck = healthCheck;
window.recoverFromError = recoverFromError;


// ============ GLOBAL ERROR BOUNDARY ============
/**
 * Global error handling ve error boundary sistemi
 * Tüm beklenmeyen hataları yakalar ve kullanıcıya bildirir
 */

// Error throttle - Aynı hatayı tekrar tekrar göstermeyi önler
let lastError = null;
let lastErrorTime = 0;
const ERROR_THROTTLE_MS = window.CONSTANTS?.ERROR?.THROTTLE_MS || 5000;

/**
 * Global error handler - Tüm yakalanmamış hataları yakalar
 */
window.addEventListener('error', (event) => {
    const error = event.error || event.message;
    const errorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: error?.stack || error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // Throttle kontrolü
    const now = Date.now();
    const errorKey = `${event.message}-${event.filename}-${event.lineno}`;
    
    if (lastError === errorKey && (now - lastErrorTime) < ERROR_THROTTLE_MS) {
        // Aynı hata çok yakın zamanda tekrar oluştu, gösterilme
        log.debug('⚠️ Error throttled:', errorKey);
        return;
    }
    
    lastError = errorKey;
    lastErrorTime = now;
    
    // Log error
    log.error('❌ Global Error:', errorInfo);
    
    // Kullanıcıya göster (sadece kritik hatalar için)
    if (CONFIG.showCriticalErrors) {
        // Sadece gerçekten kritik hatalar için alert göster
        // Syntax errors, network errors gibi durumlar için
        if (event.error && event.error.name !== 'TypeError') {
            showCustomAlert(
                'Bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.',
                'error',
                'Hata'
            );
        }
    }
    
    // Production'da error tracking servisine gönderilebilir
    // if (typeof window.Sentry !== 'undefined') {
    //     window.Sentry.captureException(error);
    // }
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorInfo = {
        message: error?.message || 'Unhandled Promise Rejection',
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    log.error('❌ Unhandled Promise Rejection:', errorInfo);
    
    // Kullanıcıya göster
    if (CONFIG.showCriticalErrors) {
        showCustomAlert(
            'Bir işlem tamamlanamadı. Lütfen tekrar deneyin.',
            'warning',
            'Uyarı'
        );
    }
    
    // Production'da error tracking
    // if (typeof window.Sentry !== 'undefined') {
    //     window.Sentry.captureException(error);
    // }
    
    // Prevent default browser error handling
    event.preventDefault();
});

/**
 * Network error detection - İnternet bağlantısı kontrolü
 */
let isOnline = navigator.onLine;
let offlineNotificationShown = false;

window.addEventListener('online', () => {
    isOnline = true;
    offlineNotificationShown = false;
    log.debug('✅ İnternet bağlantısı geri geldi');
    
    if (typeof showCustomAlert !== 'undefined') {
        showCustomAlert('İnternet bağlantısı geri geldi!', 'success', 'Bağlantı');
    }
});

window.addEventListener('offline', () => {
    isOnline = false;
    log.warn('⚠️ İnternet bağlantısı kesildi');
    
    if (!offlineNotificationShown && typeof showCustomAlert !== 'undefined') {
        offlineNotificationShown = true;
        showCustomAlert(
            'İnternet bağlantınız kesildi. Bazı özellikler çalışmayabilir.',
            'warning',
            'Bağlantı Kesildi'
        );
    }
});

/**
 * İnternet bağlantısı kontrolü
 * @returns {boolean} Online mı?
 */
function checkOnlineStatus() {
    return navigator.onLine;
}

/**
 * Retry mekanizması ile async fonksiyon çalıştırır
 * @param {Function} asyncFn - Çalıştırılacak async fonksiyon
 * @param {number} [maxRetries=3] - Maksimum retry sayısı
 * @param {number} [delay=1000] - Retry arası bekleme süresi (ms)
 * @returns {Promise<*>} Fonksiyonun sonucu
 * @example
 * await retryWithBackoff(async () => {
 *   return await fetchData();
 * }, 3, 1000);
 */
async function retryWithBackoff(asyncFn, maxRetries = 3, delay = 1000) {
    const maxRetriesValue = window.CONSTANTS?.ERROR?.MAX_RETRIES || maxRetries;
    const delayValue = window.CONSTANTS?.ERROR?.RETRY_DELAY || delay;
    
    for (let attempt = 1; attempt <= maxRetriesValue; attempt++) {
        try {
            return await asyncFn();
        } catch (error) {
            log.warn(`⚠️ Attempt ${attempt}/${maxRetriesValue} failed:`, error);
            
            if (attempt === maxRetriesValue) {
                // Son deneme de başarısız
                throw error;
            }
            
            // Exponential backoff: Her denemede bekleme süresini artır
            const waitTime = delayValue * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}

/**
 * Safe async execution - Hata yakalama ile async fonksiyon çalıştırır
 * @param {Function} asyncFn - Çalıştırılacak async fonksiyon
 * @param {*} [fallback=null] - Hata durumunda döndürülecek değer
 * @param {string} [errorMessage='İşlem başarısız'] - Hata mesajı
 * @returns {Promise<*>} Fonksiyonun sonucu veya fallback değeri
 */
async function safeAsync(asyncFn, fallback = null, errorMessage = 'İşlem başarısız') {
    try {
        return await asyncFn();
    } catch (error) {
        log.error(`❌ ${errorMessage}:`, error);
        
        if (typeof showCustomAlert !== 'undefined') {
            showCustomAlert(errorMessage, 'error');
        }
        
        return fallback;
    }
}

// Global erişim için
if (typeof window !== 'undefined') {
    window.checkOnlineStatus = checkOnlineStatus;
    window.retryWithBackoff = retryWithBackoff;
    window.safeAsync = safeAsync;
}

// Test ortamı için export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkOnlineStatus,
        retryWithBackoff,
        safeAsync
    };
}


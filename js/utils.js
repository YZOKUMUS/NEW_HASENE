// ============ YARDIMCI FONKSİYONLAR ============
/**
 * Yerel tarih formatı (YYYY-MM-DD) - UTC yerine yerel saat dilimi kullanır
 * @param {Date} [date=new Date()] - Formatlanacak tarih (varsayılan: bugün)
 * @returns {string} YYYY-MM-DD formatında tarih string'i
 * @example
 * getLocalDateString(new Date('2024-01-15')) // '2024-01-15'
 * getLocalDateString() // Bugünün tarihi
 */
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ============ DEBOUNCE & THROTTLE UTILITIES ============
/**
 * Debounce utility - Fonksiyon çağrılarını geciktirir
 * @param {Function} func - Geciktirilecek fonksiyon
 * @param {number} wait - Bekleme süresi (ms)
 * @param {boolean} immediate - İlk çağrıda hemen çalıştır mı?
 * @returns {Function} Debounced fonksiyon
 * @example
 * const debouncedSearch = debounce(handleSearch, 300);
 * searchInput.addEventListener('input', debouncedSearch);
 */
function debounce(func, wait = 300, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle utility - Fonksiyon çağrılarını sınırlar
 * @param {Function} func - Sınırlanacak fonksiyon
 * @param {number} limit - Minimum çağrı aralığı (ms)
 * @returns {Function} Throttled fonksiyon
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============ MOBİL DENEYİM - HAPTIC FEEDBACK ============
/**
 * Mobil cihazlarda haptic feedback (titreme) sağlar
 * @param {('light'|'medium'|'heavy'|'success'|'error'|'warning')} [type='light'] - Titreme tipi
 * @returns {void}
 * @example
 * hapticFeedback('success') // Başarılı işlem için titreşim
 */
function hapticFeedback(type = 'light') {
    if (!CONFIG.hapticEnabled || !navigator.vibrate) return;
    
    // Constants'tan pattern'leri al, yoksa varsayılanları kullan
    const patterns = window.CONSTANTS?.HAPTIC?.PATTERNS || {
        light: 10,
        medium: 20,
        heavy: 50,
        success: [20, 50, 20],
        error: [50, 100, 50],
        warning: [30, 50, 30]
    };
    
    const pattern = patterns[type] || patterns.light;
    navigator.vibrate(pattern);
}

// ============ MOBİL DENEYİM - SWIPE GESTURES ============
/**
 * Mobil cihazlarda swipe (kaydırma) jestlerini başlatır
 * @param {HTMLElement} element - Jest dinlenecek DOM elementi
 * @param {Object} callbacks - Jest callback'leri
 * @param {Function} [callbacks.onSwipeUp] - Yukarı kaydırma callback'i
 * @param {Function} [callbacks.onSwipeDown] - Aşağı kaydırma callback'i
 * @param {Function} [callbacks.onSwipeLeft] - Sola kaydırma callback'i
 * @param {Function} [callbacks.onSwipeRight] - Sağa kaydırma callback'i
 * @returns {void}
 * @example
 * initSwipeGestures(document.getElementById('card'), {
 *   onSwipeRight: () => console.log('Sağa kaydırıldı')
 * })
 */
function initSwipeGestures(element, callbacks) {
    if (!CONFIG.swipeGesturesEnabled || !element) return;
    
    // Constants'tan değerleri al
    const minSwipeDistance = window.CONSTANTS?.SWIPE?.MIN_DISTANCE || 50;
    const maxVerticalDistance = window.CONSTANTS?.SWIPE?.MAX_VERTICAL_DISTANCE || 100;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isScrolling = false;
    
    element.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isScrolling = false;
    }, { passive: true });
    
    element.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const deltaY = Math.abs(touch.clientY - touchStartY);
        // Eğer dikey hareket fazlaysa, bu bir scroll'dur
        if (deltaY > maxVerticalDistance) {
            isScrolling = true;
        }
    }, { passive: true });
    
    element.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        const touch = e.changedTouches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Dikey swipe (yukarı/aşağı)
        if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance) {
            if (deltaY > 0 && callbacks.onSwipeDown) {
                // Swipe down (aşağı kaydırma)
                callbacks.onSwipeDown();
                hapticFeedback('light');
            } else if (deltaY < 0 && callbacks.onSwipeUp) {
                // Swipe up (yukarı kaydırma)
                callbacks.onSwipeUp();
                hapticFeedback('light');
            }
        }
        // Yatay swipe (sağa/sola)
        else if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
            if (deltaX > 0 && callbacks.onSwipeRight) {
                // Swipe right (sağa kaydırma)
                callbacks.onSwipeRight();
                hapticFeedback('light');
            } else if (deltaX < 0 && callbacks.onSwipeLeft) {
                // Swipe left (sola kaydırma)
                callbacks.onSwipeLeft();
                hapticFeedback('light');
            }
        }
    }, { passive: true });
}

// ============ SECURITY - HTML SANITIZATION ============
/**
 * XSS koruması için HTML özel karakterlerini escape eder
 * @param {string} input - Sanitize edilecek string
 * @returns {string} Escape edilmiş HTML string'i
 * @example
 * sanitizeHTML('<script>alert("xss")</script>') // '&lt;script&gt;alert("xss")&lt;/script&gt;'
 */
function sanitizeHTML(input) {
    // XSS koruması için HTML özel karakterlerini escape et
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * innerHTML kullanımı için güvenli wrapper
 * @param {HTMLElement} element - HTML set edilecek element
 * @param {string} html - Set edilecek HTML içeriği
 * @param {boolean} [isStaticTrusted=false] - Statik ve güvenilir içerik mi?
 * @returns {void}
 * @example
 * safeSetHTML(document.getElementById('content'), userInput) // Otomatik sanitize
 * safeSetHTML(document.getElementById('content'), '<div>Static</div>', true) // Sanitize yok
 */
function safeSetHTML(element, html, isStaticTrusted = false) {
    // innerHTML kullanımı için güvenli wrapper
    if (!element) return;
    if (isStaticTrusted) {
        // Statik, güvenilir HTML için direkt set (template literals)
        element.innerHTML = html;
    } else {
        // User input veya dinamik içerik için sanitize
        element.innerHTML = sanitizeHTML(html);
    }
}

// ============ LOADING INDICATOR ============
/**
 * Loading göstergesi gösterir
 * @param {string} [message='Yükleniyor...'] - Gösterilecek mesaj
 * @returns {void}
 */
function showLoading(message = 'Yükleniyor...') {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
        const textEl = spinner.querySelector('div > div:last-child');
        if (textEl) textEl.textContent = message;
    }
}

/**
 * Loading göstergesini gizler
 * @returns {void}
 */
function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
}

/**
 * Async fonksiyonu loading state ile çalıştırır
 * @param {Function} asyncFn - Çalıştırılacak async fonksiyon
 * @param {string} [loadingMessage='Yükleniyor...'] - Loading mesajı
 * @returns {Promise<*>} Fonksiyonun sonucu
 * @example
 * await withLoading(async () => {
 *   const data = await fetchData();
 *   return data;
 * }, 'Veriler yükleniyor...');
 */
async function withLoading(asyncFn, loadingMessage = 'Yükleniyor...') {
    try {
        showLoading(loadingMessage);
        const result = await asyncFn();
        return result;
    } finally {
        hideLoading();
    }
}

// ============ SECURITY - LOCALSTORAGE ENCRYPTION ============
/**
 * Veriyi Base64 ile encode eder (basit şifreleme)
 * ⚠️ NOT: Bu sadece obfuscation içindir, gerçek şifreleme değildir
 * @param {*} data - Şifrelenecek veri (herhangi bir tip)
 * @returns {string} Base64 encoded string
 * @example
 * encryptData({ user: 'test', score: 100 }) // Base64 string
 */
function encryptData(data) {
    // Basit Base64 encoding (production'da daha güçlü encryption kullanılabilir)
    try {
        const jsonStr = JSON.stringify(data);
        return btoa(unescape(encodeURIComponent(jsonStr)));
    } catch(e) {
        log.error('Encryption error:', e);
        return data;
    }
}

/**
 * Base64 encoded veriyi decode eder
 * @param {string} encrypted - Base64 encoded string
 * @returns {*} Orijinal veri
 * @example
 * decryptData('eyJ1c2VyIjoidGVzdCJ9') // { user: 'test' }
 */
function decryptData(encrypted) {
    // Base64 decoding
    try {
        const jsonStr = decodeURIComponent(escape(atob(encrypted)));
        return JSON.parse(jsonStr);
    } catch(e) {
        log.error('Decryption error:', e);
        // Eğer decrypt edilemezse, belki encrypt edilmemiş eski veri
        try {
            return JSON.parse(encrypted);
        } catch(e2) {
            return encrypted;
        }
    }
}

/**
 * localStorage'a şifreli veri kaydeder
 * @param {string} key - Storage key
 * @param {*} value - Kaydedilecek veri
 * @returns {void}
 * @example
 * secureSetItem('userData', { name: 'John', score: 100 })
 */
function secureSetItem(key, value) {
    // localStorage'a şifreli kaydet
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
}

/**
 * localStorage'dan şifreli veri okur
 * @param {string} key - Storage key
 * @returns {*} Okunan veri veya null
 * @example
 * const userData = secureGetItem('userData') // { name: 'John', score: 100 }
 */
function secureGetItem(key) {
    // localStorage'dan şifreli oku
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData(encrypted);
}

// ============ CUSTOM ALERT SYSTEM (Professional UI) ============
/**
 * Özel alert modal gösterir
 * @param {string} message - Gösterilecek mesaj
 * @param {('success'|'error'|'warning'|'info')} [type='info'] - Alert tipi
 * @param {string|null} [title=null] - Alert başlığı
 * @returns {void}
 */
function showCustomAlert(message, type = 'info', title = null) {
    const modal = document.getElementById('customAlertModal');
    const iconEl = document.getElementById('customAlertIcon');
    const titleEl = document.getElementById('customAlertTitle');
    const messageEl = document.getElementById('customAlertMessage');
    const okBtn = document.getElementById('customAlertOKBtn');
    
    // Null check - eğer elementler yüklenmemişse console'a uyarı ver ve çık
    if (!modal || !iconEl || !titleEl || !messageEl || !okBtn) {
        if (typeof log !== 'undefined') log.warn('⚠️ Custom alert modal elementi bulunamadı! Eski alert sistemine geri dönülüyor...');
        // Fallback to standard alert
        alert(title ? `${title}\n\n${message}` : message);
        return;
    }
    
    // Type-based styling
    const types = {
        success: { icon: '🎉', title: 'Başarılı!', color: '#4caf50' },
        error: { icon: '❌', title: 'Hata!', color: '#f44336' },
        warning: { icon: '⚠️', title: 'Uyarı!', color: '#ff9800' },
        info: { icon: 'ℹ️', title: 'Bilgi', color: '#2196f3' }
    };
    
    const config = types[type] || types.info;
    iconEl.textContent = config.icon;
    titleEl.textContent = title || config.title;
    titleEl.style.color = config.color;
    
    // HTML içeriği varsa innerHTML kullan, yoksa textContent
    if (typeof message === 'string' && message.includes('<') && message.includes('>')) {
        safeSetHTML(messageEl, message, true);
    } else {
        messageEl.textContent = message || '';
    }
    
    // Show modal
    modal.style.display = 'flex';
    
    // OK button handler
    const handleOK = () => {
        modal.style.display = 'none';
        okBtn.removeEventListener('click', handleOK);
    };
    
    okBtn.addEventListener('click', handleOK);
    
    // ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            okBtn.removeEventListener('click', handleOK);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// Modal'ı kapat (global erişim için)
/**
 * Custom alert modal'ı kapatır
 * @returns {void}
 */
function closeCustomAlert() {
    const modal = document.getElementById('customAlertModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Global erişim için (tarayıcıda)
if (typeof window !== 'undefined') {
    window.closeCustomAlert = closeCustomAlert;
    window.debounce = debounce;
    window.throttle = throttle;
    window.withLoading = withLoading;
    window.getLocalDateString = getLocalDateString;
    window.sanitizeHTML = sanitizeHTML;
    window.encryptData = encryptData;
    window.decryptData = decryptData;
    window.secureSetItem = secureSetItem;
    window.secureGetItem = secureGetItem;
    window.safeSetHTML = safeSetHTML;
    window.hapticFeedback = hapticFeedback;
    window.initSwipeGestures = initSwipeGestures;
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.showCustomAlert = showCustomAlert;
}

// Test ortamı için export (Node.js/Vitest'te çalışır)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLocalDateString,
        sanitizeHTML,
        encryptData,
        decryptData,
        secureSetItem,
        secureGetItem,
        safeSetHTML,
        hapticFeedback,
        initSwipeGestures,
        showLoading,
        hideLoading,
        withLoading,
        showCustomAlert,
        closeCustomAlert,
        debounce,
        throttle
    };
}

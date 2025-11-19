// ============ YARDIMCI FONKSİYONLAR ============
// Yerel tarih formatı (YYYY-MM-DD) - UTC yerine yerel saat dilimi kullanır
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ============ MOBİL DENEYİM - HAPTIC FEEDBACK ============
function hapticFeedback(type = 'light') {
    if (!CONFIG.hapticEnabled || !navigator.vibrate) return;
    
    const patterns = {
        light: 10,           // Hafif titreşim (buton tıklama)
        medium: 20,          // Orta titreşim (doğru cevap)
        heavy: 50,           // Güçlü titreşim (yanlış cevap, önemli olay)
        success: [20, 50, 20],  // Başarılı işlem (combo, seviye atlama)
        error: [50, 100, 50],   // Hata (yanlış cevap)
        warning: [30, 50, 30]   // Uyarı (can azalması)
    };
    
    const pattern = patterns[type] || patterns.light;
    navigator.vibrate(pattern);
}

// ============ MOBİL DENEYİM - SWIPE GESTURES ============
function initSwipeGestures(element, callbacks) {
    if (!CONFIG.swipeGesturesEnabled || !element) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isScrolling = false;
    
    const minSwipeDistance = 50; // Minimum swipe mesafesi (px)
    const maxVerticalDistance = 100; // Dikey scroll için maksimum mesafe
    
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
function sanitizeHTML(input) {
    // XSS koruması için HTML özel karakterlerini escape et
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

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
function showLoading(message = 'Yükleniyor...') {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
        const textEl = spinner.querySelector('div > div:last-child');
        if (textEl) textEl.textContent = message;
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
}

// ============ SECURITY - LOCALSTORAGE ENCRYPTION ============
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

function secureSetItem(key, value) {
    // localStorage'a şifreli kaydet
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
}

function secureGetItem(key) {
    // localStorage'dan şifreli oku
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData(encrypted);
}

// ============ CUSTOM ALERT SYSTEM (Professional UI) ============
function showCustomAlert(message, type = 'info', title = null) {
    const modal = document.getElementById('customAlertModal');
    const iconEl = document.getElementById('customAlertIcon');
    const titleEl = document.getElementById('customAlertTitle');
    const messageEl = document.getElementById('customAlertMessage');
    const okBtn = document.getElementById('customAlertOKBtn');
    
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
    if (message.includes('<') && message.includes('>')) {
        safeSetHTML(messageEl, message, true);
    } else {
    messageEl.textContent = message;
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


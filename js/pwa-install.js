/**
 * PWA Install Handler
 * Progressive Web App yükleme işlemlerini yönetir
 */

let deferredPrompt = null;
let pwaInstallBtn = null;

// DOM yüklendiğinde butonu bul ve event listener'ları ekle
function initPWAInstallButton() {
    if (!pwaInstallBtn) {
        pwaInstallBtn = document.getElementById('pwaInstallBtn');
    }
    
    if (!pwaInstallBtn) return;
    
    // Click event listener ekle
    pwaInstallBtn.addEventListener('click', () => {
        triggerPWAInstall();
    });
    
    // Hover efektleri
    pwaInstallBtn.addEventListener('mouseenter', () => {
        pwaInstallBtn.style.transform = 'translateY(-2px)';
        pwaInstallBtn.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.6)';
    });
    
    pwaInstallBtn.addEventListener('mouseleave', () => {
        pwaInstallBtn.style.transform = 'translateY(0)';
        pwaInstallBtn.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)';
    });
}

// DOM yüklendiğinde başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWAInstallButton);
} else {
    initPWAInstallButton();
}

// PWA install prompt'u yakala
window.addEventListener('beforeinstallprompt', (e) => {
    // Eğer daha önce yükleme yapıldıysa, event'i ignore et
    if (typeof hasPWAInstallBeenShown === 'function' && hasPWAInstallBeenShown()) {
        if (typeof log !== 'undefined' && log.debug) {
            log.debug('📱 PWA install daha önce gösterildi, event ignore ediliyor');
        }
        return;
    }
    
    e.preventDefault();
    deferredPrompt = e;
    
    // PWA install butonunu göster
    if (!pwaInstallBtn) {
        pwaInstallBtn = document.getElementById('pwaInstallBtn');
    }
    
    if (pwaInstallBtn) {
        // Mobil cihaz kontrolü
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            pwaInstallBtn.style.display = 'block';
            if (typeof log !== 'undefined' && log.debug) {
                log.debug('📲 PWA install butonu görünür (mobil cihaz, beforeinstallprompt)');
            }
        } else {
            // Masaüstünde de göster (talimatlar için)
            pwaInstallBtn.style.display = 'block';
            if (typeof log !== 'undefined' && log.debug) {
                log.debug('💻 PWA install butonu görünür (masaüstü, talimatlar için)');
            }
        }
    }
});

// PWA yüklendiğinde
window.addEventListener('appinstalled', () => {
    if (!pwaInstallBtn) {
        pwaInstallBtn = document.getElementById('pwaInstallBtn');
    }
    
    if (pwaInstallBtn) {
        pwaInstallBtn.style.display = 'none';
    }
    deferredPrompt = null;
    
    if (typeof markPWAInstalled === 'function') {
        markPWAInstalled();
    }
    
    if (typeof log !== 'undefined' && log.debug) {
        log.debug('✅ PWA başarıyla yüklendi');
    }
});

/**
 * PWA yükleme işlemini başlatır
 * @returns {Promise<void>}
 */
async function triggerPWAInstall() {
    if (!pwaInstallBtn) {
        pwaInstallBtn = document.getElementById('pwaInstallBtn');
    }
    
    if (!deferredPrompt) {
        // Mobil cihazlarda prompt yoksa manuel talimat ver
        if (typeof log !== 'undefined' && log.debug) {
            log.debug('⚠️ PWA install prompt mevcut değil (mobil cihaz)');
        }
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        const isChrome = /Chrome/.test(navigator.userAgent);
        
        let instructions = '📲 Uygulamayı ana ekrana eklemek için:\n\n';
        
        if (isIOS) {
            instructions += '• Safari: Paylaş butonu (□↑) > "Ana Ekrana Ekle"\n';
        } else if (isAndroid) {
            if (isChrome) {
                instructions += '• Chrome: Menü (⋮) > "Uygulamayı yükle" veya "Ana ekrana ekle"\n';
            } else {
                instructions += '• Tarayıcı menüsünden "Ana ekrana ekle" seçeneğini bulun\n';
            }
        } else {
            instructions += '• Tarayıcı menüsünden "Ana ekrana ekle" seçeneğini bulun\n';
        }
        
        if (typeof showCustomAlert === 'function') {
            showCustomAlert(instructions, 'info', '📲 Uygulamayı Yükle');
        } else {
            alert(instructions);
        }
        return;
    }
    
    // Prompt'u göster
    deferredPrompt.prompt();
    
    // Kullanıcının seçimini bekle
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        if (typeof log !== 'undefined' && log.debug) {
            log.debug('✅ Kullanıcı PWA yüklemeyi kabul etti');
        }
        if (typeof markPWAInstalled === 'function') {
            markPWAInstalled();
        }
    } else {
        if (typeof log !== 'undefined' && log.debug) {
            log.debug('❌ Kullanıcı PWA yüklemeyi reddetti');
        }
        if (typeof markPWAInstallShown === 'function') {
            markPWAInstallShown(); // Reddettiğinde de gösterildi olarak işaretle, tekrar çıkmasın
        }
    }
    
    // Prompt'u temizle
    deferredPrompt = null;
    
    // Butonu gizle
    if (pwaInstallBtn) {
        pwaInstallBtn.style.display = 'none';
    }
}

// Global erişim için
window.triggerPWAInstall = triggerPWAInstall;















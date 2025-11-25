/**
 * Progressive Web App install helper.
 * Keeps the install prompt non-blocking while preventing repeat spam.
 */
(function initPWAInstall() {
    const INSTALL_SHOWN_KEY = 'pwaInstallShown';
    const INSTALL_DONE_KEY = 'pwaInstalled';

    let deferredPrompt = null;
    let pwaInstallBtn = null;
    let initialized = false;

    const device = {
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isChrome: /Chrome/.test(navigator.userAgent)
    };

    const logDebug = (message) => {
        if (typeof log !== 'undefined' && typeof log.debug === 'function') {
            log.debug(message);
        }
    };

    function hasPWAInstallBeenShown() {
        return localStorage.getItem(INSTALL_SHOWN_KEY) === 'true' || localStorage.getItem(INSTALL_DONE_KEY) === 'true';
    }

    function markPWAInstallShown() {
        localStorage.setItem(INSTALL_SHOWN_KEY, 'true');
    }

    function markPWAInstalled() {
        localStorage.setItem(INSTALL_DONE_KEY, 'true');
        localStorage.setItem(INSTALL_SHOWN_KEY, 'true');
    }

    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }

    function getInstallButton() {
        if (pwaInstallBtn) return pwaInstallBtn;
        pwaInstallBtn = document.getElementById('pwaInstallBtn');
        if (!pwaInstallBtn) return null;

        pwaInstallBtn.style.display = 'none';
        pwaInstallBtn.addEventListener('click', triggerPWAInstall);
        pwaInstallBtn.addEventListener('mouseenter', () => {
            pwaInstallBtn.style.transform = 'translateY(-2px)';
            pwaInstallBtn.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.6)';
        });
        pwaInstallBtn.addEventListener('mouseleave', () => {
            pwaInstallBtn.style.transform = 'translateY(0)';
            pwaInstallBtn.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)';
        });
        return pwaInstallBtn;
    }

    function hideButton() {
        if (pwaInstallBtn) {
            pwaInstallBtn.style.display = 'none';
        }
    }

    function showButton() {
        const button = getInstallButton();
        if (!button) return;
        button.style.display = 'block';
    }

    function provideManualInstructions() {
        let instructions = '📲 Uygulamayı ana ekrana eklemek için:\n\n';

        if (device.isIOS) {
            instructions += '• Safari: Paylaş butonu (□↑) > "Ana Ekrana Ekle"\n';
        } else if (device.isAndroid) {
            if (device.isChrome) {
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
    }

    async function triggerPWAInstall() {
        if (!deferredPrompt) {
            logDebug('⚠️ PWA install prompt mevcut değil, manuel talimat gösteriliyor');
            provideManualInstructions();
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            logDebug('✅ Kullanıcı PWA yüklemeyi kabul etti');
            markPWAInstalled();
        } else {
            logDebug('❌ Kullanıcı PWA yüklemeyi reddetti');
            markPWAInstallShown();
        }

        deferredPrompt = null;
        hideButton();
    }

    function evaluateInitialState() {
        const button = getInstallButton();
        if (!button) return;

        if (isStandalone()) {
            hideButton();
            markPWAInstalled();
            logDebug('📱 Uygulama standalone modda (zaten yüklü)');
            return;
        }

        if (hasPWAInstallBeenShown()) {
            hideButton();
            logDebug('📱 PWA install daha önce gösterildi, tekrar gösterilmiyor');
        }
    }

    function handleBeforeInstallPrompt(event) {
        if (hasPWAInstallBeenShown() || isStandalone()) {
            logDebug('📱 PWA install daha önce gösterildi veya standalone modda, event ignore edildi');
            return;
        }

        event.preventDefault();
        deferredPrompt = event;
        showButton();
        logDebug(device.isMobile ? '📲 PWA install butonu görünür (mobil)' : '💻 PWA install butonu görünür (masaüstü)');
    }

    function handleAppInstalled() {
        hideButton();
        deferredPrompt = null;
        markPWAInstalled();
        logDebug('✅ PWA başarıyla yüklendi');
    }

    function attachLifecycleListeners() {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
    }

    function init() {
        if (initialized) return;
        initialized = true;

        getInstallButton();
        evaluateInitialState();
        attachLifecycleListeners();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Global API (useful for tests/manual triggers)
    window.triggerPWAInstall = triggerPWAInstall;
    window.hasPWAInstallBeenShown = hasPWAInstallBeenShown;
    window.markPWAInstalled = markPWAInstalled;
})();





// ============ ACCESSIBILITY IMPROVEMENTS ============
// Keyboard navigation ve focus management için yardımcı fonksiyonlar

/**
 * Modal'a keyboard desteği ekler
 * - Escape tuşu ile kapatma
 * - İlk butona otomatik focus
 * - Focus trap (modal içinde tutma)
 * @param {string} modalId - Modal element ID'si
 * @param {Function} onClose - Kapatma callback'i
 */
function initModalKeyboardSupport(modalId, onClose) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Escape tuşu handler
    const escapeHandler = (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (modal.style.display !== 'none' && modal.style.display !== '') {
                if (onClose && typeof onClose === 'function') {
                    onClose();
                } else {
                    modal.style.display = 'none';
                }
            }
        }
    };

    // Modal açıldığında
    const showModal = () => {
        // İlk focusable element'e odaklan
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            setTimeout(() => {
                focusableElements[0].focus();
            }, 100);
        }

        // Escape tuşu listener ekle
        document.addEventListener('keydown', escapeHandler);

        // Focus trap
        trapFocus(modal, escapeHandler);
    };

    // Observer ile modal açılışını izle
    const observer = new MutationObserver(() => {
        if (modal.style.display !== 'none' && modal.style.display !== '') {
            showModal();
        }
    });

    observer.observe(modal, {
        attributes: true,
        attributeFilter: ['style']
    });

    // İlk açılışta kontrol et
    if (modal.style.display !== 'none' && modal.style.display !== '') {
        showModal();
    }
}

/**
 * Modal içinde focus'u tutar (focus trap)
 * @param {HTMLElement} modal - Modal elementi
 * @param {Function} escapeHandler - Escape handler'ı (cleanup için)
 */
function trapFocus(modal, escapeHandler) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapHandler = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab (geri git)
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab (ileri git)
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    modal.addEventListener('keydown', trapHandler);

    // Modal kapatıldığında cleanup
    const cleanupObserver = new MutationObserver(() => {
        if (modal.style.display === 'none' || modal.style.display === '') {
            modal.removeEventListener('keydown', trapHandler);
            if (escapeHandler) {
                document.removeEventListener('keydown', escapeHandler);
            }
        }
    });

    cleanupObserver.observe(modal, {
        attributes: true,
        attributeFilter: ['style']
    });
}

/**
 * Butona keyboard desteği ekler (Enter ve Space)
 * @param {HTMLElement|string} button - Button elementi veya ID
 * @param {Function} onClick - Tıklama handler'ı
 */
function addKeyboardSupportToButton(button, onClick) {
    const btn = typeof button === 'string' ? document.getElementById(button) : button;
    if (!btn || typeof onClick !== 'function') return;

    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            onClick(e);
        }
    });

    // Tab ile ulaşılabilir yap
    if (!btn.hasAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
    }
}

/**
 * Tüm game card butonlarına keyboard desteği ekler
 */
function initGameCardKeyboardSupport() {
    const gameCards = [
        'kelimeCevirBtn',
        'dinleBulBtn',
        'boslukDoldurBtn',
        'duaEtBtn',
        'ayetOkuBtn',
        'hadisOkuBtn'
    ];

    gameCards.forEach((cardId) => {
        const card = document.getElementById(cardId);
        if (card) {
            addKeyboardSupportToButton(card, () => {
                card.click(); // Mevcut onclick handler'ı çağır
            });
        }
    });
}

/**
 * Navigation butonlarına keyboard desteği ekler
 */
function initNavigationKeyboardSupport() {
    const navButtons = document.querySelectorAll('.nav-item, .bottom-nav .nav-item');
    
    navButtons.forEach((btn) => {
        if (!btn.hasAttribute('tabindex')) {
            btn.setAttribute('tabindex', '0');
        }
        
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

/**
 * Focus görünürlüğünü iyileştir (outline ekle)
 */
function enhanceFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
        /* Keyboard focus için görünür outline */
        *:focus-visible {
            outline: 3px solid #667eea;
            outline-offset: 2px;
            border-radius: 4px;
        }
        
        /* Game card'lara focus desteği */
        .game-card:focus-visible {
            outline: 3px solid #667eea;
            outline-offset: 3px;
            transform: scale(1.02);
        }
        
        /* Butonlara focus desteği */
        button:focus-visible,
        .nav-item:focus-visible {
            outline: 3px solid #667eea;
            outline-offset: 2px;
        }
        
        /* Modal içindeki butonlara focus */
        .modal-btn:focus-visible {
            outline: 3px solid #667eea;
            outline-offset: 2px;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Tüm accessibility iyileştirmelerini başlatır
 */
function initAccessibility() {
    // Focus görünürlüğünü iyileştir
    enhanceFocusIndicators();

    // Game card'lara keyboard desteği
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initGameCardKeyboardSupport();
            initNavigationKeyboardSupport();
        });
    } else {
        initGameCardKeyboardSupport();
        initNavigationKeyboardSupport();
    }

    // Modal'lara keyboard desteği ekle (mevcut modal'lar için)
    const modals = ['modal', 'customConfirm', 'statsModal', 'badgesModal', 'calendarModal', 'dailyTasksModal'];
    
    modals.forEach((modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            initModalKeyboardSupport(modalId, () => {
                modal.style.display = 'none';
            });
        }
    });

    log.debug('✅ Accessibility iyileştirmeleri başlatıldı');
}

// Sayfa yüklendiğinde başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
    initAccessibility();
}

// Global erişim için
window.initModalKeyboardSupport = initModalKeyboardSupport;
window.addKeyboardSupportToButton = addKeyboardSupportToButton;
window.initAccessibility = initAccessibility;


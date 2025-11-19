// ============ HATA YÖNETİMİ VE KULLANICI GERİ BİLDİRİMİ ============

// Hata tipleri ve kullanıcı dostu mesajlar
const ERROR_MESSAGES = {
    NETWORK_ERROR: {
        title: 'Bağlantı Hatası',
        message: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
        icon: '📡',
        retryable: true
    },
    TIMEOUT_ERROR: {
        title: 'Zaman Aşımı',
        message: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
        icon: '⏱️',
        retryable: true
    },
    PARSE_ERROR: {
        title: 'Veri Hatası',
        message: 'Veriler yüklenirken bir hata oluştu. Sayfayı yenilemeyi deneyin.',
        icon: '⚠️',
        retryable: true
    },
    NOT_FOUND_ERROR: {
        title: 'Dosya Bulunamadı',
        message: 'İstenen veri dosyası bulunamadı. Lütfen sayfayı yenileyin.',
        icon: '📁',
        retryable: true
    },
    PERMISSION_ERROR: {
        title: 'İzin Hatası',
        message: 'Bu işlem için gerekli izinler verilmemiş.',
        icon: '🔒',
        retryable: false
    },
    UNKNOWN_ERROR: {
        title: 'Beklenmeyen Hata',
        message: 'Bir şeyler ters gitti. Lütfen sayfayı yenileyin.',
        icon: '❌',
        retryable: true
    }
};

// Offline durumu kontrolü
function isOnline() {
    return navigator.onLine;
}

// Network durumu değişikliği listener
let networkStatusListeners = [];
function onNetworkStatusChange(callback) {
    networkStatusListeners.push(callback);
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
}

// Hata tipini belirle
function getErrorType(error) {
    if (!error) return 'UNKNOWN_ERROR';
    
    const errorMessage = error.message?.toLowerCase() || '';
    const errorName = error.name?.toLowerCase() || '';
    
    // Network hataları
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || 
        errorMessage.includes('failed to fetch') || errorName === 'networkerror') {
        return 'NETWORK_ERROR';
    }
    
    // Timeout hataları
    if (errorMessage.includes('timeout') || errorMessage.includes('time-out') ||
        errorName === 'timeouterror') {
        return 'TIMEOUT_ERROR';
    }
    
    // Parse hataları
    if (errorMessage.includes('parse') || errorMessage.includes('json') ||
        errorName === 'syntaxerror') {
        return 'PARSE_ERROR';
    }
    
    // Not found hataları
    if (errorMessage.includes('not found') || errorMessage.includes('404') ||
        error.status === 404) {
        return 'NOT_FOUND_ERROR';
    }
    
    // Permission hataları
    if (errorMessage.includes('permission') || errorMessage.includes('denied') ||
        errorName === 'notallowederror') {
        return 'PERMISSION_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
}

// Kullanıcı dostu hata mesajı göster
function showError(error, onRetry = null) {
    const errorType = getErrorType(error);
    const errorConfig = ERROR_MESSAGES[errorType] || ERROR_MESSAGES.UNKNOWN_ERROR;
    
    // Offline kontrolü
    if (!isOnline() && errorType === 'NETWORK_ERROR') {
        return showCustomAlert(
            '📡 İnternet bağlantınız yok. Lütfen bağlantınızı kontrol edin.',
            'error',
            'Bağlantı Hatası'
        );
    }
    
    // Retry butonu ile göster
    if (errorConfig.retryable && onRetry) {
        showErrorWithRetry(errorConfig, onRetry);
    } else {
        showCustomAlert(
            errorConfig.message,
            'error',
            errorConfig.title
        );
    }
}

// Retry butonu ile hata mesajı
function showErrorWithRetry(errorConfig, onRetry) {
    const modal = document.getElementById('customAlertModal');
    const iconEl = document.getElementById('customAlertIcon');
    const titleEl = document.getElementById('customAlertTitle');
    const messageEl = document.getElementById('customAlertMessage');
    const okBtn = document.getElementById('customAlertOKBtn');
    
    if (!modal || !iconEl || !titleEl || !messageEl || !okBtn) {
        // Fallback: normal alert
        showCustomAlert(errorConfig.message, 'error', errorConfig.title);
        return;
    }
    
    // Icon ve başlık
    iconEl.textContent = errorConfig.icon;
    titleEl.textContent = errorConfig.title;
    titleEl.style.color = '#f44336';
    
    // Mesaj ve retry butonu
    messageEl.innerHTML = `
        ${errorConfig.message}
        <div style="margin-top: 15px;">
            <button id="errorRetryBtn" style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; border: none; padding: 10px 25px; border-radius: 8px; font-size: 0.9em; font-weight: 600; cursor: pointer; margin-right: 10px; box-shadow: 0 4px 12px rgba(76,175,80,0.3);">
                🔄 Tekrar Dene
            </button>
            <button id="errorCancelBtn" style="background: #e0e0e0; color: #333; border: none; padding: 10px 25px; border-radius: 8px; font-size: 0.9em; font-weight: 600; cursor: pointer;">
                İptal
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Retry butonu
    const retryBtn = document.getElementById('errorRetryBtn');
    const cancelBtn = document.getElementById('errorCancelBtn');
    
    const handleRetry = () => {
        modal.style.display = 'none';
        if (onRetry) onRetry();
    };
    
    const handleCancel = () => {
        modal.style.display = 'none';
    };
    
    retryBtn.addEventListener('click', handleRetry);
    cancelBtn.addEventListener('click', handleCancel);
    
    // ESC key
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// Loading durumu ile progress göster
function showLoadingWithProgress(message = 'Yükleniyor...', progress = 0) {
    const spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
        showLoading(message);
        return;
    }
    
    spinner.style.display = 'flex';
    const textEl = spinner.querySelector('div > div:last-child');
    const progressEl = spinner.querySelector('.loading-progress');
    
    if (textEl) {
        textEl.textContent = message;
    }
    
    // Progress bar yoksa oluştur
    if (progress > 0 && !progressEl) {
        const progressBar = document.createElement('div');
        progressBar.className = 'loading-progress';
        progressBar.style.cssText = 'width: 200px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; margin: 15px auto 0; overflow: hidden;';
        const fill = document.createElement('div');
        fill.style.cssText = `height: 100%; background: white; width: ${progress}%; transition: width 0.3s ease;`;
        progressBar.appendChild(fill);
        spinner.querySelector('div').appendChild(progressBar);
    } else if (progressEl && progressEl.querySelector('div')) {
        progressEl.querySelector('div').style.width = `${progress}%`;
    }
}

// Network durumu bildirimi
let networkNotification = null;
onNetworkStatusChange((isOnline) => {
    if (isOnline) {
        // Online oldu
        if (networkNotification) {
            networkNotification.remove();
            networkNotification = null;
        }
        showCustomAlert('✅ İnternet bağlantısı yeniden kuruldu.', 'success', 'Bağlantı Restore');
    } else {
        // Offline oldu
        if (networkNotification) return; // Zaten gösteriliyor
        
        networkNotification = document.createElement('div');
        networkNotification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(244,67,54,0.4);
            font-weight: 600;
        `;
        networkNotification.textContent = '📡 İnternet bağlantısı yok';
        document.body.appendChild(networkNotification);
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    log.error('Global error:', event.error);
    // Sadece kritik hataları göster
    if (CONFIG.showCriticalErrors) {
        // Script hatalarını gösterme (kullanıcı için çok teknik)
        // Sadece beklenmeyen hataları logla
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    log.error('Unhandled promise rejection:', event.reason);
    // Kullanıcıya gösterme, sadece logla
});


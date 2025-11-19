// ============ PRODUCTION CONFIG - DEBUG SISTEMI ============
const CONFIG = {
    debug: false,              // Ana debug modu (production'da false)
    debugStats: false,          // İstatistik debug'ları (filterWordStats, updateWordStatistics)
    debugElements: false,       // DOM element kontrolleri
    debugAudio: false,          // Ses sistemi debug'ları
    debugGameFlow: false,       // Oyun akışı debug'ları
    showCriticalErrors: true,   // Kritik hataları her zaman göster
    hapticEnabled: true,        // Haptic feedback (titreme) aktif mi
    swipeGesturesEnabled: true  // Swipe jestleri aktif mi
};

// Helper fonksiyon - güvenli console.log
// Keep a reference to the original console.log so we can gate raw calls
const __orig_console_log = console.log.bind(console);

const log = {
    // Use the original console for wrapper logs so each wrapper flag works independently
    debug: (...args) => { if (CONFIG.debug) __orig_console_log(...args); },
    stats: (...args) => { if (CONFIG.debugStats) __orig_console_log(...args); },
    elements: (...args) => { if (CONFIG.debugElements) __orig_console_log(...args); },
    audio: (...args) => { if (CONFIG.debugAudio) __orig_console_log(...args); },
    game: (...args) => { if (CONFIG.debugGameFlow) __orig_console_log(...args); },
    error: (...args) => { if (CONFIG.showCriticalErrors) console.error(...args); },
    warn: (...args) => { if (CONFIG.showCriticalErrors) console.warn(...args); }
};

// Gate any remaining raw console.log calls via CONFIG.debug (global toggle).
// This lets us avoid replacing hundreds of console.log occurrences while keeping
// a single control to enable verbose logs during debugging.
console.log = (...args) => { if (typeof CONFIG !== 'undefined' && CONFIG.debug) __orig_console_log(...args); };
const forceLog = (...args) => __orig_console_log(...args);


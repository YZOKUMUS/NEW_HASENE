// ============ GAME CONSTANTS ============
/**
 * Oyun sabitleri - Magic number'ları ve string'leri burada topla
 * @module constants
 */

// ============ POINT SYSTEM ============
const POINTS = {
    PER_CORRECT: 10,           // Her doğru cevap için Hasene
    WRONG_PENALTY: 5,          // Yanlış cevap puan cezası
    COMBO_BONUS: 5,            // Her 3 doğru cevapta +5 Hasene bonus
    STAR_THRESHOLD: 100,       // 100 Hasene = 1 Yıldız
};

// ============ LEVEL SYSTEM ============
const LEVELS = {
    THRESHOLDS: {
        1: 0,           // Level 1: 0-2499 puan
        2: 2500,        // Level 2: 2500-4999 puan
        3: 5000,        // Level 3: 5000-8499 puan
        4: 8500,        // Level 4: 8500-12999 puan
        5: 13000,       // Level 5: 13000-45999 puan
        10: 46000,      // Level 10: 46000-57999 puan
    },
    INCREMENT_AFTER_10: 15000,  // Level 10'dan sonra her seviye için puan artışı
    MAX_DISPLAY: 10,            // Gösterilecek maksimum level
};

// ============ BADGE SYSTEM ============
const BADGES = {
    BRONZE_THRESHOLD: 5,       // 5 yıldız = 1 bronz
    SILVER_THRESHOLD: 5,       // 5 bronz = 1 gümüş
    GOLD_THRESHOLD: 5,         // 5 gümüş = 1 altın
    DIAMOND_THRESHOLD: 5,      // 5 altın = 1 elmas
};

// ============ DAILY GOAL SYSTEM ============
const DAILY_GOAL = {
    DEFAULT: 2700,            // Varsayılan günlük hedef (Hasene)
    OPTIONS: {
        EASY: 1300,           // Rahat: ~10 dakika
        NORMAL: 2700,         // Normal: ~20 dakika
        HARD: 5400,           // Zor: ~40 dakika
        SERIOUS: 6000,        // Ciddi: ~45 dakika
    },
    MIN: 100,                 // Minimum günlük hedef
    MAX: 10000,               // Maksimum günlük hedef
};

// ============ GAME MODES ============
const GAME_MODES = {
    CLASSIC: 'classic',
    TIMED: 'timed',
    LIVES: 'lives',
    DIFFICULT: 'difficult',
};

const GAME_MODE_CONFIG = {
    CLASSIC: {
        name: '📚 Klasik',
        description: 'Normal oyun',
        questionsPerLevel: 10,
        lives: null,
    },
    TIMED: {
        name: '⚡ Hızlı',
        description: '30 saniye süre',
        questionsPerLevel: 10,
        timeLimit: 30,  // saniye
    },
    LIVES: {
        name: '❤️ 3 Can',
        description: '3 hak, yanlış = -1 can',
        questionsPerLevel: 10,
        lives: 3,
    },
    DIFFICULT: {
        name: '🔥 Zorluk',
        description: 'Sadece zor kelimeler',
        questionsPerLevel: 10,
        minDifficulty: 7,  // 7-10 arası zorluk
    },
};

// ============ WORD STATISTICS ============
const WORD_STATS = {
    MASTERY_THRESHOLD: 3.0,           // Öğrenildi sayılması için ustalık seviyesi
    SUCCESS_RATE_THRESHOLD: 0.6,      // %60 başarı oranı
    MIN_ATTEMPTS: 5,                  // Minimum deneme sayısı
    REVIEW_DAYS_THRESHOLD: 3,         // Tekrar gerektiren gün sayısı
    MASTERY_INCREMENT: 0.2,           // Doğru cevap ustalık artışı
    MASTERY_DECREMENT: 0.5,            // Yanlış cevap ustalık azalışı
    PRIORITY_MAX: 3.0,                // Maksimum öncelik skoru
    PRIORITY_MULTIPLIER: 1.5,         // Öncelik çarpanı
};

// ============ QUESTION LIMITS ============
const QUESTION_LIMITS = {
    AYET: 10,
    DUA: 10,
    HADIS: 10,
};

// ============ UI CONSTANTS ============
const UI = {
    ANIMATION_DURATION: 300,          // ms
    NOTIFICATION_DURATION: 5000,       // ms
    DEBOUNCE_DELAY: 300,              // ms (input debounce)
    RETRY_DELAY: 1000,                // ms (retry delay)
    MAX_RETRIES: 3,                   // Maksimum retry sayısı
    HEALTH_CHECK_DELAY: 3000,         // ms (health check delay)
    HEALTH_CHECK_MAX_RETRIES: 3,      // Health check maksimum deneme
};

// ============ HAPTIC FEEDBACK ============
const HAPTIC = {
    PATTERNS: {
        LIGHT: 10,                    // Hafif titreşim (buton tıklama)
        MEDIUM: 20,                   // Orta titreşim (doğru cevap)
        HEAVY: 50,                    // Güçlü titreşim (yanlış cevap)
        SUCCESS: [20, 50, 20],        // Başarılı işlem
        ERROR: [50, 100, 50],         // Hata
        WARNING: [30, 50, 30],        // Uyarı
    },
};

// ============ SWIPE GESTURES ============
const SWIPE = {
    MIN_DISTANCE: 50,                 // Minimum swipe mesafesi (px)
    MAX_VERTICAL_DISTANCE: 100,       // Dikey scroll için maksimum mesafe (px)
};

// ============ STORAGE KEYS ============
const STORAGE_KEYS = {
    DAILY_GOAL_HASENE: 'dailyGoalHasene',
    DAILY_GOAL_LEVEL: 'dailyGoalLevel',
    PLAYER_POINTS: 'playerPoints',
    PLAYER_LEVEL: 'playerLevel',
    STAR_POINTS: 'starPoints',
    BADGES: 'badges',
    WORD_STATS: 'wordStats',
    DAILY_STREAK: 'dailyStreak',
    LAST_PLAY_DATE: 'lastPlayDate',
    DAILY_XP: 'dailyXP',
    LAST_DAILY_GOAL_DATE: 'lastDailyGoalDate',
};

// ============ LEADERBOARD ============
const LEADERBOARD = {
    TOP_COUNT: 10,                    // İlk 10 oyuncu
    MAX_POSITION_HISTORY: 10,         // Son 10 sorunun pozisyon geçmişi
};

// ============ ACHIEVEMENTS ============
const ACHIEVEMENTS = {
    COMBO_MASTER: {
        ID: 'combo_master',
        NAME: 'Muvazebet Ustası',
        DESC: '5x muvazebet yap',
        COMBO_REQUIRED: 5,
    },
    LEVEL_5: {
        ID: 'level_5',
        NAME: 'Mertebe 5',
        DESC: 'Mertebe 5\'e ulaş',
        LEVEL_REQUIRED: 5,
    },
    LEVEL_10: {
        ID: 'level_10',
        NAME: 'Mertebe 10',
        DESC: 'Mertebe 10\'a ulaş',
        LEVEL_REQUIRED: 10,
    },
};

// ============ ERROR HANDLING ============
const ERROR = {
    THROTTLE_MS: 5000,                // Error throttle süresi (ms)
    MAX_RETRIES: 3,                   // Maksimum retry sayısı
    RETRY_DELAY: 1000,                // Retry delay (ms)
};

// ============ AUDIO ============
const AUDIO = {
    VOLUME: 0.3,                      // Varsayılan ses seviyesi
    FADE_OUT_DURATION: 0.3,           // Fade out süresi (saniye)
    SUCCESS_FREQUENCY: 1046.50,       // C6 notası (başarı sesi)
};

// ============ STORAGE LIMITS ============
const STORAGE = {
    DEFAULT_QUOTA: 5 * 1024 * 1024,  // 5MB (tarayıcı varsayılanı)
};

// Tarayıcıda kullanım için (ES6 modules olmadan)
if (typeof window !== 'undefined') {
    window.CONSTANTS = {
        POINTS,
        LEVELS,
        BADGES,
        DAILY_GOAL,
        GAME_MODES,
        GAME_MODE_CONFIG,
        WORD_STATS,
        QUESTION_LIMITS,
        UI,
        HAPTIC,
        SWIPE,
        STORAGE_KEYS,
        LEADERBOARD,
        ACHIEVEMENTS,
        ERROR,
        AUDIO,
        STORAGE,
    };
}

// Test ortamı için export (Node.js/Vitest'te çalışır)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        POINTS,
        LEVELS,
        BADGES,
        DAILY_GOAL,
        GAME_MODES,
        GAME_MODE_CONFIG,
        WORD_STATS,
        QUESTION_LIMITS,
        UI,
        HAPTIC,
        SWIPE,
        STORAGE_KEYS,
        LEADERBOARD,
        ACHIEVEMENTS,
        ERROR,
        AUDIO,
        STORAGE,
    };
}

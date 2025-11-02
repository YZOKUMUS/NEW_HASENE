// 🏷️ Version Management System
const APP_VERSION = {
    version: "2.0.6",
    buildDate: new Date().toISOString().split('T')[0],
    buildTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    buildNumber: (() => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${day}${month}-${hours}${minutes}`;
    })(),
    codeStatus: "Production",
    copyright: "© 2025 YZOKUMUS",
    features: ["Dynamic Build Time", "Touch Events", "Mobile Optimized", "Real-time Updates"]
};

// 🐛 SIMPLIFIED ERROR LOGGING
const Mobile = {
    init() {
        // Only log critical errors - no spam
        window.addEventListener('error', (e) => {
            console.error('🚨 CRITICAL ERROR:', e.message, 'at', e.filename + ':' + e.lineno);
        });
        
        // Add mobile touch handlers for option buttons
        document.addEventListener('DOMContentLoaded', () => {
            this.addMobileTouchHandlers();
        });
        
        
    },

    addMobileTouchHandlers() {
        // Force mobile touch handling for Chrome DevTools simulation
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         navigator.maxTouchPoints > 0 || 
                         'ontouchstart' in window;
        
                
        // Always add touch handlers for DevTools testing
        
        
        // Handle option buttons with better detection
        const addOptionHandlers = () => {
            const optionButtons = document.querySelectorAll('.option-btn');
            
            
            optionButtons.forEach((button, index) => {
                // Multiple event types for better compatibility
                const handleSelection = (eventType, e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    selectOption(button, index);
                };
                
                // Add multiple event listeners
                button.addEventListener('touchend', (e) => handleSelection('Touch', e), { passive: false });
                button.addEventListener('pointerup', (e) => handleSelection('Pointer', e), { passive: false });
                button.addEventListener('mouseup', (e) => {
                    // Only trigger if not already handled by touch
                    if (!e.isTrusted || e.pointerType !== 'touch') {
                        handleSelection('Mouse', e);
                    }
                }, { passive: false });
                
                
            });
        };
        
        // Try immediately and also after delay
        addOptionHandlers();
        setTimeout(addOptionHandlers, 1000);
        setTimeout(addOptionHandlers, 3000); // Extra delay for game load
        
        // Also add a global touch test
        document.addEventListener('touchstart', () => {
            
        }, { passive: true });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                
            }
        });
    }

};

// Initialize mobile  immediately
Mobile.init();

// Update version info in UI
function updateVersionInfo() {
    const buildInfoElement = document.getElementById('buildInfo');
    if (buildInfoElement) {
        const buildText = `Build: ${APP_VERSION.buildNumber} | ${APP_VERSION.codeStatus}`;
        buildInfoElement.textContent = buildText;
        buildInfoElement.title = `Version ${APP_VERSION.version} | Built: ${APP_VERSION.buildDate} ${APP_VERSION.buildTime} | Features: ${APP_VERSION.features.join(', ')}`;
    }
}

// 🕐 Build timestamp'i güncelle (gerçek zamanlı)
function updateBuildTimestamp() {
    const timestampElement = document.getElementById('buildTimestamp');
    if (timestampElement) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timestamp = `Build: ${day}${month}.${hours}${minutes}`;
        timestampElement.textContent = timestamp;
        timestampElement.style.display = 'inline-block'; // Force görünür olsun
    } else {
        // Element bulunamazsa tekrar dene
        setTimeout(updateBuildTimestamp, 200);
    }
}

// Sound Manager Class
class SoundManager {
    constructor() {
        this.audioGenerator = null;
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        this.musicLoop = null;
        this.initSound();
    }

    initSound() {
        // AudioGenerator'ı yükle
        if (typeof AudioGenerator !== 'undefined') {
            this.audioGenerator = new AudioGenerator();
        } else {
            // AudioGenerator yüklenemedi - silent fail for production
        }
    }

    // Ses açma/kapama
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled);
        return this.soundEnabled;
    }

    // Müzik açma/kapama  
    toggleMusic() {
        // Yeni background müzik sistemini çağır
        const backgroundMusic = document.getElementById('backgroundMusic');
        const musicIcon = document.getElementById('musicIcon');
        const musicBtn = document.getElementById('musicToggle');
        
        if (!backgroundMusic) {
            return false;
        }

        if (backgroundMusic.paused) {
            // Müziği başlat
            backgroundMusic.volume = 0.5; // Ses seviyesi %50
            
            backgroundMusic.play().then(() => {
                musicIcon.className = 'fas fa-music';
                musicBtn.classList.remove('disabled');
                musicBtn.style.opacity = '1';
                localStorage.setItem('backgroundMusicEnabled', 'true');
                this.musicEnabled = true;
            }).catch(error => {
                this.musicEnabled = false;
            });
        } else {
            // Müziği durdur
            backgroundMusic.pause();
            musicIcon.className = 'fas fa-music-slash';
            musicBtn.classList.add('disabled');
            musicBtn.style.opacity = '0.5';
            localStorage.setItem('backgroundMusicEnabled', 'false');
            this.musicEnabled = false;
        }
        
        return this.musicEnabled;
    }

    // Doğru cevap sesi
    playCorrect() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playCorrectSound();
        }
    }

    // Yanlış cevap sesi
    playIncorrect() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playIncorrectSound();
        }
    }

    // Buton tıklama sesi
    playClick() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playClickSound();
        }
    }

    // Buton hover sesi
    playHover() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playHoverSound();
        }
    }

    // Level atlama sesi
    playLevelUp() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playLevelUpSound();
        }
    }

    // Rozet kazanma sesi
    playAchievement() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playAchievementSound();
        }
    }

    // Başarı fanfarı
    playSuccess() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playSuccessFanfare();
        }
    }

    // 🎉 Seviye tamamlama fanfarı
    playVictory() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playVictoryFanfare();
        }
    }

    // ⭐ Mükemmel skor fanfarı (tüm cevaplar doğru)
    playPerfect() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playPerfectFanfare();
        }
    }

    // 🏆 Başarım kazanma fanfarı
    playAchievementUnlocked() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playAchievementFanfare();
        }
    }

    // 🔥 Streak milestone fanfarı
    playStreak() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playStreakFanfare();
        }
    }

    // Kalp kaybı sesi
    playHeartLost() {
        if (this.soundEnabled && this.audioGenerator) {
            this.audioGenerator.playHeartLostSound();
        }
    }

    // Arka plan müziği başlat
    startBackgroundMusic() {
        // Müzik çalma devre dışı bırakıldı
        return;
    }

    // Arka plan müziği durdur
    stopBackgroundMusic() {
        // Müzik durdurma devre dışı bırakıldı
        return;
    }
}

// Global SoundManager instance
if (typeof window.soundManager === 'undefined') {
    window.soundManager = new SoundManager();
}

// Ayet Dinle ve Oku görevini tetikleyen fonksiyon
async function showAyetTask() {
    
    // Zorluk sistemine entegre et - önce localStorage'dan oku
    let difficulty = localStorage.getItem('difficulty') || 'medium';
    
    // Normalize et (Türkçe değerler varsa İngilizce'ye çevir)
    const migrationMap = {
        'kolay': 'easy',
        'orta': 'medium', 
        'zor': 'hard'
    };
    if (migrationMap[difficulty]) {
        difficulty = migrationMap[difficulty];
    }
    
    // Geçerli değer kontrolü
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        difficulty = 'medium';
    }
    
    const game = window.arabicLearningGame;
    let ayetler = [];
    
    if (game && game.ayetData && game.ayetData.length > 0) {
        ayetler = game.getDifficultyAyets(game.ayetData, difficulty);
    } else {
        console.warn('⚠️ Game instance bulunamadı, manuel filtreleme yapılacak');
    }
    
    // Fallback: Eğer zorluk sistemi çalışmazsa normal yükleme
    if (ayetler.length === 0) {
        let response = await fetch('ayetoku.json');
        let allAyetler = await response.json();
        
        // Manuel filtreleme yap
        ayetler = allAyetler.filter(ayet => {
            if (!ayet || !ayet['ayahs.text_uthmani_tajweed']) return false;
            const arabicText = ayet['ayahs.text_uthmani_tajweed'];
            const wordCount = arabicText.split(/\s+/).filter(word => word.length > 2).length;
            
            switch(difficulty) {
                case 'easy': return wordCount >= 3 && wordCount <= 6;
                case 'medium': return wordCount >= 7 && wordCount <= 12;
                case 'hard': return wordCount >= 13;
                default: return true;
            }
        });
        
        // Eğer hâlâ boşsa tümünü al
        if (ayetler.length === 0) {
            ayetler = allAyetler;
        }
    }
    
    let randomIndex = Math.floor(Math.random() * ayetler.length);
    let ayet = ayetler[randomIndex];
    
    let modal = document.createElement('div');
    modal.id = 'ayetModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div style="background:#fff;padding:16px;border-radius:16px;max-width:90vw;max-height:85vh;overflow-y:auto;text-align:center;box-shadow:0 2px 16px #0002;position:relative;">
            <!-- X Butonu (Sağ üst köşe) -->
            <button onclick="document.body.removeChild(document.getElementById('ayetModal'))" style="position:absolute;top:8px;right:8px;width:32px;height:32px;border:none;background:rgba(0,0,0,0.1);border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;">×</button>
            
            <h2 style="font-size:1.2em;margin-bottom:8px;margin-top:24px;">Ayet Dinle &amp; Oku</h2>
            <div style="font-size:1.0em;color:#3f51b5;margin-bottom:6px;"><span style='color:#888;font-size:0.85em;'>(${ayet.ayet_kimligi})</span></div>
            
            <!-- Scrollable Ayet Text -->
            <div style="font-family:'KFGQPC Uthmanic Script HAFS','Scheherazade New',serif;font-size:0.95em;color:#333333;margin-bottom:12px;line-height:1.6;max-height:30vh;overflow-y:auto;padding:8px;border:1px solid #e0e0e0;border-radius:8px;background:#f9f9f9;">${ayet["ayahs.text_uthmani_tajweed"] || ''}</div>
            
            <!-- Scrollable Meal -->
            <div style="font-size:0.85em;margin-bottom:12px;line-height:1.4;max-height:20vh;overflow-y:auto;padding:8px;text-align:left;border:1px solid #e0e0e0;border-radius:8px;background:#f5f5f5;">${ayet.meal}</div>
            
            <audio id="ayetAudio" src="${ayet.ayet_ses_dosyasi}" controls style="width:100%;margin-bottom:12px;"></audio>
            
            <!-- Alt Kapat Butonu (Her zaman görünür) -->
            <button onclick="document.body.removeChild(document.getElementById('ayetModal'))" style="width:100%;padding:12px;background:#4CAF50;color:white;border:none;border-radius:8px;font-size:1.0em;cursor:pointer;font-weight:bold;">Kapat</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Modal dışına tıklayınca kapat
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Ayet dinlendiğinde hasene kazandır
    const ayetAudio = document.getElementById('ayetAudio');
    let haseneGiven = false;
    function giveAyetHasene() {
        if (!haseneGiven) {
            let ayetHasene = parseInt(localStorage.getItem('ayetHasene')) || 0;
            ayetHasene += 10;
            localStorage.setItem('ayetHasene', ayetHasene.toString());
            
            // Ayet dinleme sayısını artır (istatistik için)
            let ayetListens = parseInt(localStorage.getItem('ayetListens')) || 0;
            ayetListens += 1;
            localStorage.setItem('ayetListens', ayetListens.toString());
            
            // Toplam ve günlük hasene'ye de ekle
            let totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
            totalHasene += 10;
            localStorage.setItem('totalHasene', totalHasene.toString());
            let dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
            dailyHasene += 10;
            localStorage.setItem('dailyHasene', dailyHasene.toString());
            if (document.getElementById('haseneCount')) {
                document.getElementById('haseneCount').textContent = totalHasene;
            }
            if (document.getElementById('haseneCountBottom')) {
                document.getElementById('haseneCountBottom').textContent = totalHasene;
            }
            if (document.getElementById('dailyHasene')) {
                document.getElementById('dailyHasene').textContent = dailyHasene;
            }
            haseneGiven = true;
        }
    }
    if (ayetAudio) {
        ayetAudio.addEventListener('ended', giveAyetHasene);
    }
    // Modal kapatılırken de hasene ver (dinlenmişse)
    modal.querySelector('button[onclick]')?.addEventListener('click', giveAyetHasene);
}

// Dua dinleme görevini tetikleyen fonksiyon
async function showDuaTask() {
    // dualar.json dosyasını oku
    let response = await fetch('dualar.json');
    let dualar = await response.json();
    // Rastgele dua seç
    let randomIndex = Math.floor(Math.random() * dualar.length);
    let dua = dualar[randomIndex];

    // Modal oluştur
    let modal = document.createElement('div');
    modal.id = 'duaModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div style="background:#fff;padding:32px 24px;border-radius:16px;max-width:400px;text-align:center;box-shadow:0 2px 16px #0002;">
            <h2 style="font-size:1.3em;margin-bottom:10px;">Dua Dinle</h2>
            <div style="font-family:'KFGQPC Uthmanic Script HAFS','Scheherazade New',serif;font-size:1.0em;color:#333333;margin-bottom:10px;">${dua.dua}</div>
            <div style="font-size:0.9em;margin-bottom:10px;">${dua.tercume}</div>
            <audio id="duaAudio" src="${dua.ses_url}" controls style="width:100%;margin-bottom:10px;"></audio>
            <br><button onclick="document.body.removeChild(document.getElementById('duaModal'))" style="margin-top:10px;background:#eee;color:#333;padding:6px 18px;border:none;border-radius:8px;font-size:0.9em;cursor:pointer;">Kapat</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Dua dinlendiğinde otomatik hasene ekle
    const duaAudio = document.getElementById('duaAudio');
    let haseneGiven = false;
    function giveDuaHasene() {
        if (!haseneGiven) {
            let listenedDuaCount = parseInt(localStorage.getItem('listenedDuaCount')) || 0;
            listenedDuaCount++;
            localStorage.setItem('listenedDuaCount', listenedDuaHasene);
            
            // Dua dinleme sayısını artır (istatistik için)
            let duaListens = parseInt(localStorage.getItem('duaListens')) || 0;
            duaListens += 1;
            localStorage.setItem('duaListens', duaListens.toString());
            
            let haseneEarned = 10;
            let totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
            totalHasene += haseneEarned;
            localStorage.setItem('totalHasene', totalHasene);
            let dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
            dailyHasene += haseneEarned;
            localStorage.setItem('dailyHasene', dailyHasene);
            if (document.getElementById('haseneCount')) {
                document.getElementById('haseneCount').textContent = totalHasene;
            }
            if (document.getElementById('haseneCountBottom')) {
                document.getElementById('haseneCountBottom').textContent = totalHasene;
            }
            if (document.getElementById('dailyHasene')) {
                document.getElementById('dailyHasene').textContent = dailyHasene;
            }
            haseneGiven = true;
        }
    }
    if (duaAudio) {
        duaAudio.addEventListener('ended', giveDuaHasene);
    }
    // Modal kapatılırken de hasene ver (dinlenmişse)
    modal.querySelector('button[onclick]')?.addEventListener('click', giveDuaHasene);
}

// Duolingo-style Game Logic - Updated
class ArabicLearningGame {
    constructor() {
        this.wordData = [];
            this.currentQuestion = 0;
            this.score = 0;
            this.hearts = 5; // Duolingo gibi 5 kalp
            this.gameXP = 0;
        
        // Race condition önleme flag'i
        this.isProcessingAnswer = false;
        
        // Sınırsız kalp kontrolü - şimdilik devre dışı
        unlimitedHeartsActive = false; // localStorage.getItem('unlimitedHearts') === 'true';
        
        // Production için hasene sistemi
        this.totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
        
        // 9. ✅ BAŞLANGIÇTA LOAD - tutarlı veri yükleme
        this.loadGameData();
        
        this.streak = parseInt(localStorage.getItem('streak')) || 0;
        // Progressive level system - Her seviye daha zor
        this.level = this.calculateLevel(this.totalHasene);
        this.xp = this.totalHasene;
        this.xpToNextLevel = this.getXPRequiredForLevel(this.level + 1) - this.totalHasene;
        // dailyHasene zaten loadGameData() ile yüklendi, tekrar yüklemeye gerek yok
        this.lastPlayDate = localStorage.getItem('lastPlayDate') || '';
        this.wordsLearned = 0; // Dinamik olarak hesaplanacak
        this.totalAnswers = parseInt(localStorage.getItem('totalAnswers')) || 0;
        this.correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
        this.gameMode = 'translation';
        // 🔧 Güvenli difficulty initialization
        const rawDifficulty = localStorage.getItem('difficulty') || 'medium';
        this.difficulty = this.normalizeDifficulty(rawDifficulty);
        // Storage'ı da normalize et
        localStorage.setItem('difficulty', this.difficulty);
        this.questions = [];
        this.currentAudio = null;
        
        // Legacy difficulty migration (artık normalizeDifficulty ile otomatik)
        this.migrateDifficultyValues();
        
        // Calendar variables
        const now = new Date();
        this.currentCalendarMonth = now.getMonth();
        this.currentCalendarYear = now.getFullYear();
        this.calendarNavigationTimeout = null; // Samsung M33 navigation throttling
        
        this.initializeAchievements();
        this.initializeLeaderboard();
        
        // init() DOMContentLoaded'da çağrılacak
        
    }
    
    // Türkçe difficulty değerlerini İngilizce'ye migrate et
    migrateDifficultyValues() {
        const currentDifficulty = localStorage.getItem('difficulty');
        let migratedValue = null;
        
        // Türkçe -> İngilizce mapping
        const migrationMap = {
            'kolay': 'easy',
            'orta': 'medium', 
            'zor': 'hard'
        };
        
        if (currentDifficulty && migrationMap[currentDifficulty]) {
            migratedValue = migrationMap[currentDifficulty];
            localStorage.setItem('difficulty', migratedValue);
            this.difficulty = migratedValue;
        }
    }

    // 🔧 ZORLUK DEĞERİ NORMALİZASYON SİSTEMİ
    normalizeDifficulty(difficulty) {
        // Canonical değerler: 'easy', 'medium', 'hard'
        const canonicalMap = {
            // Türkçe mappings
            'kolay': 'easy',
            'orta': 'medium', 
            'zor': 'hard',
            // İngilizce (zaten canonical)
            'easy': 'easy',
            'medium': 'medium',
            'hard': 'hard',
            // Fallback mappings
            'e': 'easy',
            'm': 'medium', 
            'h': 'hard',
            '1': 'easy',
            '2': 'medium',
            '3': 'hard'
        };
        
        // Normalize et
        const normalized = canonicalMap[difficulty?.toLowerCase()] || 'medium';
        
        // Debug
        if (difficulty !== normalized) {
        }
        
        return normalized;
    }

    // 🔧 DİFFICULTY GÜVENLİ GETTER
    getDifficulty() {
        return this.normalizeDifficulty(this.difficulty);
    }

    // 🔧 DİFFICULTY GÜVENLİ SETTER  
    setDifficulty(newDifficulty) {
        const normalized = this.normalizeDifficulty(newDifficulty);
        this.difficulty = normalized;
        localStorage.setItem('difficulty', normalized);
        
        // 🧹 Cache'i temizle ki değişiklik hemen etkili olsun
        this.cachedDifficultyWords = null;
        this.cachedDifficultyAyets = null;
        
        return normalized;
    }
    
    initializeAchievements() {
        // 🏆 COMPREHENSIVE ACHIEVEMENT SYSTEM - İslami Temalar 🕌📿
        this.achievements = {
            // 🌟 === BAŞLANGIÇ SERİSİ (BRONZE) ===
            firstGame: {
                id: 'firstGame',
                title: '🕌 İlk Namaz',
                description: 'İlk öğrenme yolculuğunuzu başlattınız!',
                icon: 'fas fa-play',
                rarity: 'bronze',
                unlocked: false,
                condition: () => this.stats.gamesPlayed >= 1,
                progress: () => Math.min(this.stats.gamesPlayed, 1),
                target: 1
            },
            firstCorrect: {
                id: 'firstCorrect',
                title: '🌱 İlk Nur',
                description: 'İlk doğru cevabın! Bilginin nuru yüzünü aydınlattı.',
                icon: 'fas fa-seedling',
                rarity: 'bronze',
                unlocked: false,
                condition: () => this.stats.correctAnswers >= 1,
                progress: () => Math.min(this.stats.correctAnswers, 1),
                target: 1
            },
            firstStreak: {
                id: 'firstStreak',
                title: '🔥 İlk Alev',
                description: '2 gün üst üste! Süreklilik ibadetin temeli.',
                icon: 'fas fa-fire',
                rarity: 'bronze',
                unlocked: false,
                condition: () => this.stats.currentStreak >= 2,
                progress: () => Math.min(this.stats.currentStreak, 2),
                target: 2
            },

            // 📚 === ÖĞRENME SERİSİ (SILVER) ===
            wordLearner: {
                id: 'wordLearner',
                title: '📚 Kelime Avcısı',
                description: '25 farklı kelime öğrendin! Lügat hazinen genişliyor.',
                icon: 'fas fa-book',
                rarity: 'silver',
                condition: () => (parseInt(localStorage.getItem('uniqueWordsLearned')) || 0) >= 25,
                progress: () => parseInt(localStorage.getItem('uniqueWordsLearned')) || 0,
                target: 25
            },
            vocabularyMaster: {
                id: 'vocabularyMaster',
                title: '🎓 Lügat Ustası',
                description: '100 kelime! Artık gerçek bir lügat uzmanısın.',
                icon: 'fas fa-graduation-cap',
                rarity: 'gold',
                condition: () => (parseInt(localStorage.getItem('uniqueWordsLearned')) || 0) >= 100,
                progress: () => parseInt(localStorage.getItem('uniqueWordsLearned')) || 0,
                target: 100
            },
            smartLearner: {
                id: 'smartLearner',
                title: '🧠 Akıllı Öğrenci',
                description: 'Yanlış yaptığın bir kelimeyi doğru yaptın! Bu öğrenmenin gücüdür.',
                icon: 'fas fa-lightbulb',
                rarity: 'silver',
                condition: () => false, // Special check
                progress: () => 0,
                target: 1
            },

            // 🎯 === PERFORMANS SERİSİ (GOLD) ===
            perfect10: {
                id: 'perfect10',
                title: '📿 Kemâl Sahibi',
                description: 'Mükemmel performans! 10/10 doğru!',
                icon: 'fas fa-star',
                rarity: 'gold',
                condition: () => this.stats.perfectGames >= 1,
                progress: () => Math.min(this.stats.perfectGames, 1),
                target: 1
            },
            speedster: {
                id: 'speedster',
                title: '⚡ Çevik Talebe',
                description: 'Hızlı öğrenme! Ortalama 3 saniye!',
                icon: 'fas fa-bolt',
                rarity: 'gold',
                condition: () => this.stats.averageTime > 0 && this.stats.averageTime <= 3000 && this.stats.gamesPlayed >= 5,
                progress: () => this.stats.averageTime > 3000 ? 0 : 1,
                target: 1
            },
            accuracyMaster: {
                id: 'accuracyMaster',
                title: '🎯 İsabet Ustası',
                description: '%90 doğruluk oranı! Nişancı gibi isabetlisin.',
                icon: 'fas fa-bullseye',
                rarity: 'gold',
                condition: () => this.stats.totalAnswers >= 20 && (this.stats.correctAnswers / this.stats.totalAnswers) >= 0.9,
                progress: () => Math.min(this.stats.correctAnswers / Math.max(this.stats.totalAnswers, 1), 1),
                target: 1
            },

            // 🔥 === STREAK SERİSİ ===
            streak3: {
                id: 'streak3',
                title: '📿 Sabırlı Mümin',
                description: '3 gün üst üste sebat gösterdiniz!',
                icon: 'fas fa-fire',
                rarity: 'silver',
                condition: () => this.stats.currentStreak >= 3,
                progress: () => Math.min(this.stats.currentStreak, 3),
                target: 3
            },
            streak7: {
                id: 'streak7',
                title: '🕌 Haftalık Mücahit',
                description: '7 gün üst üste ilimle mücadele ettiniz!',
                icon: 'fas fa-medal',
                rarity: 'gold',
                condition: () => this.stats.currentStreak >= 7,
                progress: () => Math.min(this.stats.currentStreak, 7),
                target: 7
            },
            streak30: {
                id: 'streak30',
                title: '🌙 Aylık Aziz',
                description: '30 gün! Bir ay boyunca süreklilik gösterdin. Masha Allah!',
                icon: 'fas fa-crown',
                rarity: 'diamond',
                condition: () => this.stats.currentStreak >= 30,
                progress: () => Math.min(this.stats.currentStreak, 30),
                target: 30
            },

            // 💎 === HASENE SERİSİ ===
            hasene100: {
                id: 'hasene100',
                title: '� Hasene Toplayıcısı',
                description: '100 hasene ile sevap defterin güzelleşti!',
                icon: 'fas fa-gem',
                rarity: 'silver',
                condition: () => this.stats.totalHasene >= 100,
                progress: () => Math.min(this.stats.totalHasene, 100),
                target: 100
            },
            hasene500: {
                id: 'hasene500',
                title: '� Hasene Sultanı',
                description: '500 hasene! Allah razı olsun!',
                icon: 'fas fa-crown',
                rarity: 'gold',
                condition: () => this.stats.totalHasene >= 500,
                progress: () => Math.min(this.stats.totalHasene, 500),
                target: 500
            },
            hasene1000: {
                id: 'hasene1000',
                title: '🌟 Hasene Padişahı',
                description: '1000 hasene! Sen gerçek bir ilim hazinesin!',
                icon: 'fas fa-star',
                rarity: 'diamond',
                condition: () => this.stats.totalHasene >= 1000,
                progress: () => Math.min(this.stats.totalHasene, 1000),
                target: 1000
            },

            // 📖 === İSLAMİ İÇERİK SERİSİ ===
            ayetListener: {
                id: 'ayetListener',
                title: '📖 Ayet Dinleyici',
                description: '10 ayet dinledin! Kur\'an\'ın melodisi kulağında.',
                icon: 'fas fa-book-open',
                rarity: 'silver',
                condition: () => {
                    let ayetHasene = parseInt(localStorage.getItem('ayetHasene')) || 0;
                    return ayetHasene >= 100; // 10 ayet x 10 hasene
                },
                progress: () => Math.min(parseInt(localStorage.getItem('ayetHasene')) || 0, 100),
                target: 100
            },
            duaListener: {
                id: 'duaListener',
                title: '🤲 Dua Dinleyici',
                description: '10 dua dinledin! Dualarla kalbin huzur buldu.',
                icon: 'fas fa-hands',
                rarity: 'silver',
                condition: () => (parseInt(localStorage.getItem('listenedDuaCount')) || 0) >= 10,
                progress: () => Math.min(parseInt(localStorage.getItem('listenedDuaCount')) || 0, 10),
                target: 10
            },
            quranicScholar: {
                id: 'quranicScholar',
                title: '🕌 Kuran Alimi',
                description: '50 farklı ayet okudu! İlahi kelimelerle tanıştın.',
                icon: 'fas fa-mosque',
                rarity: 'gold',
                condition: () => (parseInt(localStorage.getItem('uniqueAyetsRead')) || 0) >= 50,
                progress: () => Math.min(parseInt(localStorage.getItem('uniqueAyetsRead')) || 0, 50),
                target: 50
            },

            // 🎮 === GÜNLÜK CHALLENGE SERİSİ ===
            dailyChallenger: {
                id: 'dailyChallenger',
                title: '🌅 Günlük Meydan Okuma',
                description: 'Günde 20 soru çözdün! Disiplinli bir öğrencisin.',
                icon: 'fas fa-sun',
                rarity: 'silver',
                condition: () => {
                    const today = new Date().toDateString();
                    const dailyQuestions = parseInt(localStorage.getItem(`dailyQuestions_${today}`)) || 0;
                    return dailyQuestions >= 20;
                },
                progress: () => {
                    const today = new Date().toDateString();
                    return Math.min(parseInt(localStorage.getItem(`dailyQuestions_${today}`)) || 0, 20);
                },
                target: 20
            },
            weeklyWarrior: {
                id: 'weeklyWarrior',
                title: '📅 Haftalık Savaşçı',
                description: 'Hafta boyunca her gün oynadın! Azmin takdire şayan.',
                icon: 'fas fa-calendar-week',
                rarity: 'gold',
                condition: () => this.stats.currentStreak >= 7,
                progress: () => Math.min(this.stats.currentStreak, 7),
                target: 7
            },

            // 🏆 === COMBO & SPESİYAL SERİSİ ===
            comboMaster: {
                id: 'comboMaster',
                title: '🔥 Kombo Ustası',
                description: '10 doğru cevap üst üste! Combo ateşin yanıyor.',
                icon: 'fas fa-fire',
                rarity: 'gold',
                condition: () => (parseInt(localStorage.getItem('maxCombo')) || 0) >= 10,
                progress: () => Math.min(parseInt(localStorage.getItem('maxCombo')) || 0, 10),
                target: 10
            },
            perfectWeek: {
                id: 'perfectWeek',
                title: '� Mükemmel Hafta',
                description: 'Hafta boyunca hiç yanlış yapmadın! Sen bir efsanesin!',
                icon: 'fas fa-trophy',
                rarity: 'diamond',
                condition: () => {
                    const weeklyErrors = parseInt(localStorage.getItem('weeklyErrors')) || 0;
                    const weeklyQuestions = parseInt(localStorage.getItem('weeklyQuestions')) || 0;
                    return weeklyQuestions >= 50 && weeklyErrors === 0;
                },
                progress: () => {
                    const weeklyErrors = parseInt(localStorage.getItem('weeklyErrors')) || 0;
                    return weeklyErrors === 0 ? 1 : 0;
                },
                target: 1
            },

            // 🎨 === SPESİYAL SEASONAL ===
            ramadanChallenge: {
                id: 'ramadanChallenge',
                title: '🌙 Ramazan Mücahidi',
                description: 'Ramazan ayında mübarek günlerde ilim peşinde koştun!',
                icon: 'fas fa-moon',
                rarity: 'diamond',
                condition: () => {
                    // Check if it's Ramadan and user played consistently
                    const ramadanDays = parseInt(localStorage.getItem('ramadanDaysPlayed')) || 0;
                    return ramadanDays >= 15;
                },
                progress: () => Math.min(parseInt(localStorage.getItem('ramadanDaysPlayed')) || 0, 15),
                target: 15
            },

            // 🎵 === PRONUNCIATION & AUDIO ===
            pronunciationPro: {
                id: 'pronunciationPro',
                title: '�️ Telaffuz Uzmanı',
                description: '25 kelimeyi doğru telaffuz ettin! Sesin çok güzel.',
                icon: 'fas fa-microphone',
                rarity: 'gold',
                condition: () => (parseInt(localStorage.getItem('correctPronunciations')) || 0) >= 25,
                progress: () => Math.min(parseInt(localStorage.getItem('correctPronunciations')) || 0, 25),
                target: 25
            },
            audioMaster: {
                id: 'audioMaster',
                title: '🎵 Ses Ustası',
                description: '100 ses kaydı dinledin! Kulağın Arapça\'ya alışıyor.',
                icon: 'fas fa-headphones',
                rarity: 'silver',
                condition: () => (parseInt(localStorage.getItem('audioListenCount')) || 0) >= 100,
                progress: () => Math.min(parseInt(localStorage.getItem('audioListenCount')) || 0, 100),
                target: 100
            },

            // 🎯 === MASTER LEVELs (DIAMOND) ===
            grandMaster: {
                id: 'grandMaster',
                title: '� Büyük Üstad',
                description: '1000 soru çözdün! Sen artık bir üstadsın!',
                icon: 'fas fa-crown',
                rarity: 'diamond',
                condition: () => this.stats.totalAnswers >= 1000,
                progress: () => Math.min(this.stats.totalAnswers, 1000),
                target: 1000
            },
            legendaryScholar: {
                id: 'legendaryScholar',
                title: '🌟 Efsanevi Alim',
                description: 'Tüm achievement\'lerin %80\'ini aldın! Gerçek bir efsanesin!',
                icon: 'fas fa-star',
                rarity: 'diamond',
                condition: () => {
                    const totalAchievements = Object.keys(this.achievements).length - 1; // Exclude self
                    const unlockedCount = this.unlockedAchievements.length;
                    return unlockedCount >= Math.floor(totalAchievements * 0.8);
                },
                progress: () => this.unlockedAchievements.length,
                target: () => Math.floor((Object.keys(this.achievements).length - 1) * 0.8)
            }
        };

        // 🎨 Achievement Rarity Colors and Effects
        // 🎨 Achievement Rarity Colors and Effects
        this.rarityStyles = {
            bronze: {
                color: '#CD7F32',
                glow: '0 0 10px rgba(205, 127, 50, 0.5)',
                background: 'linear-gradient(45deg, #CD7F32, #E6A85C)'
            },
            silver: {
                color: '#C0C0C0',
                glow: '0 0 15px rgba(192, 192, 192, 0.7)',
                background: 'linear-gradient(45deg, #C0C0C0, #E5E5E5)'
            },
            gold: {
                color: '#FFD700',
                glow: '0 0 20px rgba(255, 215, 0, 0.8)',
                background: 'linear-gradient(45deg, #FFD700, #FFED4E)'
            },
            diamond: {
                color: '#B9F2FF',
                glow: '0 0 25px rgba(185, 242, 255, 0.9)',
                background: 'linear-gradient(45deg, #B9F2FF, #E0F6FF)',
                animation: 'sparkle 2s infinite'
            }
        };

        // İstatistikler
        this.stats = {
            gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
            totalHasene: this.totalHasene,
            currentStreak: this.streak,
            perfectGames: parseInt(localStorage.getItem('perfectGames')) || 0,
            averageTime: parseInt(localStorage.getItem('averageTime')) || 0,
            wordsLearned: this.wordsLearned,
            totalAnswers: this.totalAnswers,
            correctAnswers: this.correctAnswers
        };

        // Başarım verilerini yükle
        this.unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
        
        // Achievement yapılarını düzelt
        this.fixAchievementStructures();
        
        // 🎯 Daily Missions System
        this.initializeDailyMissions();
    }
    
    // Achievement yapılarını otomatik düzelt
    fixAchievementStructures() {
        // Tüm achievement'ları kontrol et ve eksik field'ları ekle
        for (const [key, achievement] of Object.entries(this.achievements)) {
            // Unlocked field yoksa ekle
            if (!achievement.hasOwnProperty('unlocked')) {
                achievement.unlocked = false;
            }
            
            // Progress field yoksa ekle  
            if (!achievement.hasOwnProperty('progress')) {
                achievement.progress = 0;
            }
            
            // Target field yoksa ekle (varsa current değeri kullan, yoksa 1)
            if (!achievement.hasOwnProperty('target')) {
                achievement.target = achievement.current || 1;
            }
            
            // Current field yoksa ekle
            if (!achievement.hasOwnProperty('current')) {
                achievement.current = 0;
            }
            
            // Rarity field kontrol et
            if (!achievement.hasOwnProperty('rarity')) {
                achievement.rarity = 'Bronze'; // Varsayılan
            }
        }
        
        
    }
    
    initializeDailyMissions() {
        const today = new Date().toDateString();
        const storedMissions = JSON.parse(localStorage.getItem('dailyMissions')) || {};
        
        // Check if missions need to be refreshed (new day)
        if (storedMissions.date !== today) {
            this.generateNewDailyMissions(today);
        } else {
            this.dailyMissions = storedMissions.missions || [];
        }
        
        // Track daily progress
        this.dailyProgress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
        if (this.dailyProgress.date !== today) {
            this.dailyProgress = {
                date: today,
                questionsAnswered: 0,
                correctAnswers: 0,
                streakMaintained: false,
                perfectGames: 0,
                timeSpent: 0,
                modesPlayed: new Set(),
                ayetsListened: 0,
                newWordsLearned: 0
            };
            this.saveDailyProgress();
        } else {
            // Convert modesPlayed array back to Set if it exists
            if (this.dailyProgress.modesPlayed && Array.isArray(this.dailyProgress.modesPlayed)) {
                this.dailyProgress.modesPlayed = new Set(this.dailyProgress.modesPlayed);
            } else if (!this.dailyProgress.modesPlayed) {
                this.dailyProgress.modesPlayed = new Set();
            }
        }
    }
    
    generateNewDailyMissions(date) {
        // 🌟 Mission Templates with Islamic themes
        const missionTemplates = [
            // Easy Missions (Bronze)
            {
                id: 'daily_questions_10',
                title: '🌅 Sabah Namazı',
                description: '10 soru çöz ve gününe hayır ile başla',
                type: 'questions',
                target: 10,
                reward: { hasene: 50, xp: 25 },
                rarity: 'bronze'
            },
            {
                id: 'daily_correct_5',
                title: '📿 Beş Vakit',
                description: '5 doğru cevap ver, her biri bir namaz vakti gibi',
                type: 'correct',
                target: 5,
                reward: { hasene: 30, xp: 15 },
                rarity: 'bronze'
            },
            {
                id: 'daily_streak',
                title: '🔥 Sebat Göster',
                description: 'Günlük streak\'ini koru, azim ve sabırla',
                type: 'streak',
                target: 1,
                reward: { hasene: 40, xp: 20 },
                rarity: 'bronze'
            },
            
            // Medium Missions (Silver)
            {
                id: 'daily_questions_20',
                title: '🕌 İkindi Ibadeti',
                description: '20 soru çözüp ilmini artır',
                type: 'questions',
                target: 20,
                reward: { hasene: 80, xp: 40 },
                rarity: 'silver'
            },
            {
                id: 'daily_accuracy_80',
                title: '🎯 İsabet Sahibi',
                description: '%80 doğrulukla cevapla, isabetli ol',
                type: 'accuracy',
                target: 0.8,
                reward: { hasene: 70, xp: 35 },
                rarity: 'silver'
            },
            {
                id: 'daily_perfect_game',
                title: '⭐ Kemâl Arayışı',
                description: '1 mükemmel oyun oyna, mükemmellik için çabala',
                type: 'perfect',
                target: 1,
                reward: { hasene: 100, xp: 50 },
                rarity: 'silver'
            },
            {
                id: 'daily_modes_3',
                title: '🎮 Çeşitlilik Sevgini',
                description: '3 farklı oyun modu dene',
                type: 'modes',
                target: 3,
                reward: { hasene: 90, xp: 45 },
                rarity: 'silver'
            },
            
            // Hard Missions (Gold)
            {
                id: 'daily_questions_50',
                title: '🌙 Gece İbadeti',
                description: '50 soruya cevap ver, gecenin sessizliğinde ilim peşinde koş',
                type: 'questions',
                target: 50,
                reward: { hasene: 150, xp: 75 },
                rarity: 'gold'
            },
            {
                id: 'daily_time_15min',
                title: '⏰ On Beş Dakika İlim',
                description: '15 dakika sürekli oyun oyna',
                type: 'time',
                target: 15 * 60, // seconds
                reward: { hasene: 120, xp: 60 },
                rarity: 'gold'
            },
            {
                id: 'daily_ayets_5',
                title: '📖 Beş Ayet Dinle',
                description: '5 ayet dinle ve manalarını öğren',
                type: 'ayets',
                target: 5,
                reward: { hasene: 100, xp: 50 },
                rarity: 'gold'
            },
            
            // Special Missions (Diamond)
            {
                id: 'daily_master_challenge',
                title: '👑 Üstad Meydan Okuması',
                description: '30 soru çöz, %90 doğrulukla, 3 modda',
                type: 'master',
                target: { questions: 30, accuracy: 0.9, modes: 3 },
                reward: { hasene: 250, xp: 125 },
                rarity: 'diamond'
            }
        ];
        
        // Select 3-4 missions for the day with balanced difficulty
        const selectedMissions = this.selectBalancedMissions(missionTemplates);
        
        this.dailyMissions = selectedMissions.map(template => ({
            ...template,
            id: template.id + '_' + date,
            progress: 0,
            completed: false,
            unlocked: new Date().getTime()
        }));
        
        // Save to localStorage
        localStorage.setItem('dailyMissions', JSON.stringify({
            date: date,
            missions: this.dailyMissions
        }));
    }
    
    selectBalancedMissions(templates) {
        const bronze = templates.filter(t => t.rarity === 'bronze');
        const silver = templates.filter(t => t.rarity === 'silver');
        const gold = templates.filter(t => t.rarity === 'gold');
        const diamond = templates.filter(t => t.rarity === 'diamond');
        
        const selected = [];
        
        // Always include 1-2 bronze missions
        selected.push(...this.shuffleArray(bronze).slice(0, 2));
        
        // Add 1 silver mission
        selected.push(...this.shuffleArray(silver).slice(0, 1));
        
        // 30% chance for gold mission
        if (Math.random() < 0.3) {
            selected.push(...this.shuffleArray(gold).slice(0, 1));
        }
        
        // 10% chance for diamond mission (weekend special)
        const isWeekend = new Date().getDay() % 6 === 0;
        if (isWeekend && Math.random() < 0.1) {
            selected.push(...this.shuffleArray(diamond).slice(0, 1));
        }
        
        return selected;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    updateDailyProgress(action, value = 1) {
        // modesPlayed her zaman Set olsun
        if (this.dailyProgress.modesPlayed && Array.isArray(this.dailyProgress.modesPlayed)) {
            this.dailyProgress.modesPlayed = new Set(this.dailyProgress.modesPlayed);
        } else if (!this.dailyProgress.modesPlayed) {
            this.dailyProgress.modesPlayed = new Set();
        }

        const today = new Date().toDateString();
        if (this.dailyProgress.date !== today) {
            this.initializeDailyMissions(); // Reset for new day
            return;
        }
        
        switch(action) {
            case 'question':
                this.dailyProgress.questionsAnswered++;
                break;
            case 'correct':
                this.dailyProgress.correctAnswers++;
                break;
            case 'perfect_game':
                this.dailyProgress.perfectGames++;
                break;
            case 'time':
                this.dailyProgress.timeSpent += value;
                break;
            case 'mode':
                this.dailyProgress.modesPlayed.add(value);
                break;
            case 'ayet':
                this.dailyProgress.ayetsListened++;
                break;
            case 'word':
                this.dailyProgress.newWordsLearned++;
                break;
        }
        
        this.checkDailyMissionProgress();
        this.saveDailyProgress();
    }
    
    checkDailyMissionProgress() {
        this.dailyMissions.forEach(mission => {
            if (mission.completed) return;
            
            let progress = 0;
            
            switch(mission.type) {
                case 'questions':
                    progress = this.dailyProgress.questionsAnswered;
                    break;
                case 'correct':
                    progress = this.dailyProgress.correctAnswers;
                    break;
                case 'accuracy':
                    if (this.dailyProgress.questionsAnswered >= 5) {
                        progress = this.dailyProgress.correctAnswers / this.dailyProgress.questionsAnswered;
                    }
                    break;
                case 'perfect':
                    progress = this.dailyProgress.perfectGames;
                    break;
                case 'time':
                    progress = this.dailyProgress.timeSpent;
                    break;
                case 'modes':
                    progress = this.dailyProgress.modesPlayed.size;
                    break;
                case 'ayets':
                    progress = this.dailyProgress.ayetsListened;
                    break;
                case 'streak':
                    progress = this.streak >= 1 ? 1 : 0;
                    break;
                case 'master':
                    const target = mission.target;
                    const questionsOk = this.dailyProgress.questionsAnswered >= target.questions;
                    const accuracyOk = (this.dailyProgress.correctAnswers / Math.max(this.dailyProgress.questionsAnswered, 1)) >= target.accuracy;
                    const modesOk = this.dailyProgress.modesPlayed.size >= target.modes;
                    progress = (questionsOk && accuracyOk && modesOk) ? 1 : 0;
                    break;
            }
            
            mission.progress = progress;
            
            // Check completion
            const targetProgress = typeof mission.target === 'object' ? 1 : mission.target;
            if (progress >= targetProgress && !mission.completed) {
                this.completeDailyMission(mission);
            }
        });
    }
    
    completeDailyMission(mission) {
        mission.completed = true;
        
        // Award rewards
        this.totalHasene += mission.reward.hasene;
        this.updateTotalHasene();
        
        // Show completion notification
        this.showMissionCompleteNotification(mission);
        
        // Save progress
        this.saveDailyMissions();
    }
    
    showMissionCompleteNotification(mission) {
        const notification = document.createElement('div');
        notification.className = `mission-complete-notification ${mission.rarity}`;
        notification.innerHTML = `
            <div class="mission-complete-content">
                <div class="mission-complete-icon">🎉</div>
                <div class="mission-complete-title">Görev Tamamlandı!</div>
                <div class="mission-complete-mission">${mission.title}</div>
                <div class="mission-complete-reward">+${mission.reward.hasene} Hasene</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate and remove
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    saveDailyProgress() {
        // Convert Set to Array for JSON serialization
        const progressToSave = {
            ...this.dailyProgress,
            modesPlayed: Array.from(this.dailyProgress.modesPlayed)
        };
        localStorage.setItem('dailyProgress', JSON.stringify(progressToSave));
    }
    
    saveDailyMissions() {
        const today = new Date().toDateString();
        localStorage.setItem('dailyMissions', JSON.stringify({
            date: today,
            missions: this.dailyMissions
        }));
    }

    updateTotalHasene() {
        // Save to localStorage and update UI
        localStorage.setItem('totalHasene', this.totalHasene.toString());
        
        // Update UI if hasene display exists
        const haseneDisplay = document.getElementById('haseneCount');
        if (haseneDisplay) {
            haseneDisplay.textContent = this.totalHasene;
        }
        
        
    }
    
    getDailyMissionsSummary() {
        const completed = this.dailyMissions.filter(m => m.completed).length;
        const total = this.dailyMissions.length;
        const totalRewards = this.dailyMissions
            .filter(m => m.completed)
            .reduce((sum, m) => sum + m.reward.hasene, 0);
            
        return { completed, total, totalRewards };
    }
    
    setupAchievementListeners() {
        // Achievements button
        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                this.showAchievements();
                this.updateBadgeCounter(); // Sayacı sıfırla
            });
        }
        
        // İlk sayacı güncelle
        this.updateBadgeCounter();
    }
    
    updateBadgeCounter() {
        const counterElement = document.getElementById('unlockedBadgeCount');
        if (counterElement) {
            const unlockedCount = this.unlockedAchievements.length;
            const totalCount = Object.keys(this.achievements).length;
            
            if (unlockedCount > 0) {
                counterElement.textContent = unlockedCount;
                counterElement.style.display = 'flex';
                counterElement.title = `${unlockedCount}/${totalCount} rozet kazandın!`;
            } else {
                counterElement.style.display = 'none';
            }
        }
        
        // Stats button  
        const statsBtn = document.getElementById('statsBtn');
        if (statsBtn) {
            statsBtn.addEventListener('click', () => {
                this.showStats();
            });
        }
        
        // Close modal on overlay click (for .modal class)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
    
    getUniqueSuras() {
        if (!this.words || this.words.length === 0) {
            return 0;
        }
        
        // Benzersiz sure sayısını hesapla
        const uniqueSuras = new Set();
        this.words.forEach(word => {
            if (word.sure) {
                uniqueSuras.add(word.sure);
            }
        });
        
        return uniqueSuras.size;
    }
    
    async init() {
        // Initialize game
        this.showScreen('loadingScreen');
        
        // Loading screen'in görünür olup olmadığını kontrol et
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            // Loading screen check
        }, 100);
        
        try {
            this.startLoadingAnimation();
            await this.loadWordData();
            this.updateUI();
            this.initializeDifficultyUI();
            this.initializeMobileOptimization();
            this.optimizePerformance();
            this.initializeEscKeySupport();
        } catch (error) {
            console.error('❌ Game initialization failed:', error);
            
        }
    }
    
    async loadWordData() {
        
        
        // JSON dosyaları listesi ve yükleme durumu
        const jsonFiles = [
            { name: 'data.json', data: null, loaded: false },
            { name: 'ayetoku.json', data: null, loaded: false },
            { name: 'dualar.json', data: null, loaded: false },
            { name: 'kutubisitte.json', data: null, loaded: false }
        ];
        
        let totalLoaded = 0;
        let combinedData = [];
        
        // Her JSON dosyasını tek tek dene
        for (let fileInfo of jsonFiles) {
            try {
                // Loading file...
                
                const response = await fetch(`./${fileInfo.name}`);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                
                let rawText = await response.text();
                // Process raw text
                
                // BOM temizleme
                rawText = rawText.replace(/^\uFEFF/, ''); // UTF-8 BOM
                rawText = rawText.replace(/^[��\uFFFD]+/, ''); // Replacement chars
                rawText = rawText.replace(/^[\x00-\x1F\x7F-\x9F\uFEFF\u200B-\u200D]+/, ''); // Control chars
                
                // [ karakteri bulunamıyorsa ara
                rawText = rawText.trim();
                if (!rawText.startsWith('[')) {
                    const bracketIndex = rawText.indexOf('[');
                    if (bracketIndex > 0 && bracketIndex < 20) {
                        
                        rawText = rawText.substring(bracketIndex);
                    }
                }
                
                
                
                const parsedData = JSON.parse(rawText);
                
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    fileInfo.data = parsedData;
                    fileInfo.loaded = true;
                    combinedData = combinedData.concat(parsedData);
                    totalLoaded++;
                    
                } else {
                    
                }
                
            } catch (error) {
                console.error(`❌ ${fileInfo.name} yükleme hatası:`, error.message);
            }
        }
        
        // Sonuç değerlendirmesi
        if (combinedData.length > 0) {
            // ayetoku.json'dan ayetData'yı ayır (combinedData'ya katmadan önce)
            const ayetokuFile = jsonFiles.find(f => f.name === 'ayetoku.json' && f.loaded);
            if (ayetokuFile && ayetokuFile.data) {
                this.ayetData = ayetokuFile.data;
                
                
                // ayetoku verilerini wordData'dan çıkar (sadece kelime verileri kalsın)
                const nonAyetData = combinedData.filter(item => !item.ayet_kimligi);
                this.wordData = nonAyetData.length > 0 ? nonAyetData : combinedData;
            } else {
                this.wordData = combinedData;
            }
            
            
            
            
            
            return;
        }
        
        
        
        // Fallback data - Comprehensive test data for all difficulties
        this.wordData = [
            // KOLAY (Easy) - 5-7 difficulty
            {"id": "test:1", "sure_adi": "Test Sûresi", "kelime": "بِسْمِ", "anlam": "adıyla", "ses_dosyasi": "", "difficulty": 5},
            {"id": "test:2", "sure_adi": "Test Sûresi", "kelime": "اللَّهِ", "anlam": "Allah'ın", "ses_dosyasi": "", "difficulty": 6},
            {"id": "test:3", "sure_adi": "Test Sûresi", "kelime": "الْحَمْدُ", "anlam": "hamd", "ses_dosyasi": "", "difficulty": 6},
            {"id": "test:4", "sure_adi": "Test Sûresi", "kelime": "رَبِّ", "anlam": "Rabbi", "ses_dosyasi": "", "difficulty": 5},
            {"id": "test:5", "sure_adi": "Test Sûresi", "kelime": "الدِّينِ", "anlam": "dinin", "ses_dosyasi": "", "difficulty": 7},
            
            // ORTA (Medium) - 8-10 difficulty  
            {"id": "test:6", "sure_adi": "Test Sûresi", "kelime": "الْعَالَمِينَ", "anlam": "alemlerin", "ses_dosyasi": "", "difficulty": 8},
            {"id": "test:7", "sure_adi": "Test Sûresi", "kelime": "الرَّحْمَٰنِ", "anlam": "Rahman", "ses_dosyasi": "", "difficulty": 9},
            {"id": "test:8", "sure_adi": "Test Sûresi", "kelime": "الرَّحِيمِ", "anlam": "Rahim", "ses_dosyasi": "", "difficulty": 10},
            {"id": "test:9", "sure_adi": "Test Sûresi", "kelime": "مَالِكِ", "anlam": "sahibi", "ses_dosyasi": "", "difficulty": 8},
            {"id": "test:10", "sure_adi": "Test Sûresi", "kelime": "يَوْمِ", "anlam": "günün", "ses_dosyasi": "", "difficulty": 9},
            
            // ZOR (Hard) - 11+ difficulty
            {"id": "test:11", "sure_adi": "Test Sûresi", "kelime": "إِيَّاكَ نَعْبُدُ", "anlam": "Ancak Sana kulluk ederiz", "ses_dosyasi": "", "difficulty": 12},
            {"id": "test:12", "sure_adi": "Test Sûresi", "kelime": "وَإِيَّاكَ نَسْتَعِينُ", "anlam": "ve ancak Senden yardım dileriz", "ses_dosyasi": "", "difficulty": 13},
            {"id": "test:13", "sure_adi": "Test Sûresi", "kelime": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "anlam": "Bizi dosdoğru yola ilet", "ses_dosyasi": "", "difficulty": 15},
            {"id": "test:14", "sure_adi": "Test Sûresi", "kelime": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", "anlam": "kendilerine nimet verdiklerin yoluna", "ses_dosyasi": "", "difficulty": 18},
            {"id": "test:15", "sure_adi": "Test Sûresi", "kelime": "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ", "anlam": "gazaba uğrayanların değil", "ses_dosyasi": "", "difficulty": 16}
        ];
        
        
    }
    
    async loadOldWordData() {
        try {
            try {
                const ayetResponse = await fetch('./ayetoku.json');
                if (ayetResponse.ok) {
                    // Text olarak al, BOM temizle, sonra parse et
                    const ayetText = await ayetResponse.text();
                    const cleanAyetText = ayetText.replace(/^\uFEFF/, ''); // BOM temizle
                    const rawAyetData = JSON.parse(cleanAyetText);
                    if (Array.isArray(rawAyetData) && rawAyetData.length > 0) {
                        this.ayetData = rawAyetData;
                        
                    } else {
                        throw new Error('Invalid ayet data format');
                    }
                } else {
                    throw new Error(`Ayet data HTTP Error: ${ayetResponse.status}`);
                }
            } catch (ayetError) {
                console.warn('⚠️ Ayet verileri yüklenemedi, fallback kullanılacak:', ayetError.message);
                this.ayetData = [
                    {
                        "ayet_kimligi": "fallback:1:1",
                        "meal": "Rahman ve Rahim olan Allah'ın adıyla",
                        "ayet_ses_dosyasi": "",
                        "ayahs.text_uthmani_tajweed": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
                    }
                ];
            }
            
        } catch (error) {
            console.error('❌ Data loading failed:', error);
            console.error('📄 Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack?.substring(0, 200)
            });
            console.warn('🔄 Using fallback data for testing...');
            
            // Fallback data - Comprehensive test data for all difficulties
            this.wordData = [
                // KOLAY (Easy) - 5-7 difficulty
                {"id": "test:1", "sure_adi": "Test Sûresi", "kelime": "بِسْمِ", "anlam": "adıyla", "ses_dosyasi": "", "difficulty": 5},
                {"id": "test:2", "sure_adi": "Test Sûresi", "kelime": "اللَّهِ", "anlam": "Allah'ın", "ses_dosyasi": "", "difficulty": 6},
                {"id": "test:3", "sure_adi": "Test Sûresi", "kelime": "الْحَمْدُ", "anlam": "hamd", "ses_dosyasi": "", "difficulty": 6},
                {"id": "test:4", "sure_adi": "Test Sûresi", "kelime": "رَبِّ", "anlam": "Rabbi", "ses_dosyasi": "", "difficulty": 5},
                {"id": "test:5", "sure_adi": "Test Sûresi", "kelime": "الدِّينِ", "anlam": "dinin", "ses_dosyasi": "", "difficulty": 7},
                
                // ORTA (Medium) - 8-10 difficulty  
                {"id": "test:6", "sure_adi": "Test Sûresi", "kelime": "الْعَالَمِينَ", "anlam": "alemlerin", "ses_dosyasi": "", "difficulty": 8},
                {"id": "test:7", "sure_adi": "Test Sûresi", "kelime": "الرَّحْمَٰنِ", "anlam": "Rahman", "ses_dosyasi": "", "difficulty": 9},
                {"id": "test:8", "sure_adi": "Test Sûresi", "kelime": "الرَّحِيمِ", "anlam": "Rahim", "ses_dosyasi": "", "difficulty": 10},
                {"id": "test:9", "sure_adi": "Test Sûresi", "kelime": "مَالِكِ", "anlam": "sahibi", "ses_dosyasi": "", "difficulty": 8},
                {"id": "test:10", "sure_adi": "Test Sûresi", "kelime": "يَوْمِ", "anlam": "günün", "ses_dosyasi": "", "difficulty": 9},
                
                // ZOR (Hard) - 11+ difficulty
                {"id": "test:11", "sure_adi": "Test Sûresi", "kelime": "إِيَّاكَ نَعْبُدُ", "anlam": "Ancak Sana kulluk ederiz", "ses_dosyasi": "", "difficulty": 12},
                {"id": "test:12", "sure_adi": "Test Sûresi", "kelime": "وَإِيَّاكَ نَسْتَعِينُ", "anlam": "ve ancak Senden yardım dileriz", "ses_dosyasi": "", "difficulty": 13},
                {"id": "test:13", "sure_adi": "Test Sûresi", "kelime": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "anlam": "Bizi dosdoğru yola ilet", "ses_dosyasi": "", "difficulty": 15},
                {"id": "test:14", "sure_adi": "Test Sûresi", "kelime": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", "anlam": "kendilerine nimet verdiklerin yoluna", "ses_dosyasi": "", "difficulty": 18},
                {"id": "test:15", "sure_adi": "Test Sûresi", "kelime": "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ", "anlam": "gazaba uğrayanların değil", "ses_dosyasi": "", "difficulty": 16}
            ];
            
            
            
            this.ayetData = [
                {
                    "ayet_kimligi": "test:1:1",
                    "meal": "Rahman ve Rahim olan Allah'ın adıyla",
                    "ayet_ses_dosyasi": "",
                    "ayahs.text_uthmani_tajweed": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
                },
                {
                    "ayet_kimligi": "test:1:2", 
                    "meal": "Hamd, Alemlerin Rabbi Allah'a mahsustur.",
                    "ayet_ses_dosyasi": "",
                    "ayahs.text_uthmani_tajweed": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
                },
                {
                    "ayet_kimligi": "test:1:3",
                    "meal": "O Rahman ve Rahim'dir",
                    "ayet_ses_dosyasi": "",
                    "ayahs.text_uthmani_tajweed": "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
                }
            ];
            
            
            
        }
    }
    
    showScreen(screenId) {
        // Switch to screen
        
        // 🌙 Clear dark theme when returning to main menu
        if (screenId === 'mainMenu') {
            document.body.classList.remove('translation-mode');
        }
        
        // Hide all screens
        const allScreens = document.querySelectorAll('.screen');
        // Hide all screens
        allScreens.forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Show requested screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            // Screen found and showing
            targetScreen.style.display = 'flex';
            targetScreen.scrollTop = 0;
        } else {
            console.error(`❌ Screen bulunamadı: ${screenId}`);
        }

        // 🏷️ GLOBAL FOOTER INJECTION - Sadece loading ekranında footer
        // Global footer kaldırıldı - sadece loading ekranında footer olacak
        
        // Music control based on screen
        if (window.soundManager) {
            // Müzik başlatma/durdurma devre dışı bırakıldı
        }
        
        // Store current screen for reference
        this.currentScreen = screenId;
    }
    
    showMainMenu() {
        // Return to main menu
        this.showScreen('mainMenu');
        
        // Reset game state
        this.gameMode = null;
        this.difficulty = null;
        this.currentQuestion = 0;
        this.score = 0;
        
        // Clear any running timers
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
        
        // Update UI
        this.updateUI();
        
        // Main menu shown
    }
    
    countArabicLetters(arabicText) {
        // Remove Arabic diacritics (harakat) and count only letters
        const arabicLettersOnly = arabicText.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
        // Count Arabic letters (U+0627 to U+06FF range)
        const arabicLetterCount = (arabicLettersOnly.match(/[\u0627-\u06FF]/g) || []).length;
        return arabicLetterCount;
    }
    
    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastPlayDate = localStorage.getItem('lastPlayDate') || '';
        
        // Eğer bugün zaten oynandı ise hiçbir şey yapma
        if (lastPlayDate === today) {
            return;
        }

        // ✅ GÜNLÜK HASENE SIFIRLAMA - SADECE YENİ GÜN BAŞLANGICINDA
        // (Bu kod bloğu sadece yeni bir gün başladığında çalışır)
        this.dailyHasene = 0;
        localStorage.setItem('dailyHasene', '0');
        
        // 🔄 HEMEN lastPlayDate'i güncelle ki aynı gün tekrar açılırsa sıfırlanmasın
        localStorage.setItem('lastPlayDate', today);
        
        if (!lastPlayDate || lastPlayDate === '') {
            // İlk kez oynanıyor - streak henüz 0, oyun bitince 1 olacak
            this.streak = 0;
        } else {
            const daysMissed = this.calculateDaysMissed(lastPlayDate, today);
            
            if (daysMissed === 0) {
                // Aynı gün - streak değişmeden devam et (zaten oynanmış)
                // Hiçbir şey yapma
            } else if (daysMissed === 1) {
                // Ardışık gün - streak artır
                const oldStreak = this.streak;
                this.streak++;
                
                // 🔥 Streak milestone fanfarı çal
                this.checkStreakMilestone(oldStreak, this.streak);
                
            } else if (daysMissed > 1) {
                // Gün kaçırıldı - streak protection kontrol et
                const streakProtectionUsed = this.useStreakProtection(daysMissed);
                
                if (!streakProtectionUsed) {
                    // Streak kırıldı - yeniden başla
                    this.streak = 1;
                } else {
                    // Protection kullanıldı, streak korundu
                }
            }
        }
        
        // 💾 Streak değerini kaydet
        localStorage.setItem('streak', this.streak.toString());
    }



    // 🛡️ Streak Koruma Sistemi
    calculateDaysMissed(lastPlayDate, today) {
        const lastDate = new Date(lastPlayDate);
        const currentDate = new Date(today);
        const timeDiff = currentDate.getTime() - lastDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff; // Doğru gün farkı
    }

    useStreakProtection(daysMissed) {
        // Streak koruma malzemelerini kontrol et
        let streakFreezes = parseInt(localStorage.getItem('streakFreezes')) || 0;
        let weekendPasses = parseInt(localStorage.getItem('weekendPasses')) || 0;
        
        if (daysMissed === 2 && weekendPasses > 0) {
            // 2 gün kaçırdı, Weekend Pass kullan (önce weekend pass kontrol et)
            weekendPasses--;
            localStorage.setItem('weekendPasses', weekendPasses.toString());
            
            // Kullanım kaydı
            this.logStreakProtectionUsage('Weekend Pass', 2);
            showNotification('🏖️ Weekend Pass kullanıldı! Streak korundu!', 'success');
            return true;
            
        } else if (daysMissed === 1 && streakFreezes > 0) {
            // 1 gün kaçırdı, Streak Freeze kullan
            streakFreezes--;
            localStorage.setItem('streakFreezes', streakFreezes.toString());
            
            // Kullanım kaydı
            this.logStreakProtectionUsage('Streak Freeze', 1);
            showNotification('🛡️ Streak Freeze kullanıldı! Streak korundu!', 'success');
            return true;
            
        } else if (daysMissed === 2 && streakFreezes >= 2) {
            // 2 gün kaçırdı ama Weekend Pass yok, 2 Streak Freeze kullan
            streakFreezes -= 2;
            localStorage.setItem('streakFreezes', streakFreezes.toString());
            
            // Kullanım kaydı
            this.logStreakProtectionUsage('2x Streak Freeze', 2);
            showNotification('🛡️🛡️ 2 Streak Freeze kullanıldı! Streak korundu!', 'success');
            return true;
        }
        
        return false; // Koruma kullanılamadı
    }

    logStreakProtectionUsage(protectionType, daysSaved) {
        const usageLog = JSON.parse(localStorage.getItem('streakProtectionLog')) || [];
        usageLog.push({
            date: new Date().toISOString(),
            type: protectionType,
            daysSaved: daysSaved,
            streakAtTime: this.streak
        });
        
        // Son 10 kullanımı sakla
        if (usageLog.length > 10) {
            usageLog.splice(0, usageLog.length - 10);
        }
        
        localStorage.setItem('streakProtectionLog', JSON.stringify(usageLog));
    }

    // 🛒 Streak Koruma Satın Alma Sistemi
    buyStreakProtection(type) {
        const prices = {
            'streakFreeze': 100,    // 100 hasene
            'weekendPass': 180      // 180 hasene (daha pahalı ama 2 gün)
        };
        
        const price = prices[type];
        if (!price) {
            console.error('❌ Geçersiz koruma tipi!');
            return false;
        }
        
        // 💰 4. ✅ TEK KAYNAK - 'totalHasene' anahtarı
        const currentHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
        
        if (currentHasene < price) {
            return false;
        }
        
        // 💸 5. ✅ HASENE HARCAMA - eş zamanlı güncelleme
        const newHasene = currentHasene - price;
        this.totalHasene = newHasene;
        
        // 6. ✅ ANLIK KAYDETME - localStorage ve UI
        this.saveGameData();
        this.updateUI();
        
        // �🛡️ Koruma ekle
        const currentCount = parseInt(localStorage.getItem(type === 'weekendPass' ? 'weekendPasses' : type + 's')) || 0;
        localStorage.setItem(type === 'weekendPass' ? 'weekendPasses' : type + 's', currentCount + 1);
        
        // 🔄 UI güncelle
        this.updateUI();
        return true;
    }
    
    updateUI() {
        
        // Safety checks for DOM elements
        const safeUpdateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            } else {
                console.warn(`⚠️ Element not found: ${id}`);
            }
        };
        
        const safeUpdateStyle = (id, property, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.style[property] = value;
            }
        };
        
        // Update main menu stats
        safeUpdateElement('streakCount', this.streak);
        safeUpdateElement('haseneCount', this.totalHasene);
        safeUpdateElement('levelCount', this.level);
        safeUpdateElement('dailyHasene', this.dailyHasene);
        
        // Gerçek öğrenilen kelimeleri hesapla ve güncelle
        this.wordsLearned = this.calculateMasteredWords();
        
        // Update daily progress (günlük hedef 250 hasene)
        const dailyProgress = Math.min((this.dailyHasene / 250) * 100, 100);
        safeUpdateStyle('dailyProgress', 'width', `${dailyProgress}%`);
        // Update dailyHasene span in progress section
        safeUpdateElement('dailyHasene', this.dailyHasene);
        
        // Update XP Progress - Progressive System
        const currentLevelXP = this.getXPRequiredForLevel(this.level);
        const nextLevelXP = this.getXPRequiredForLevel(this.level + 1);
        const xpInCurrentLevel = this.totalHasene - currentLevelXP;
        const xpNeededForNext = nextLevelXP - currentLevelXP;
        const xpProgress = xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 0;
        
        safeUpdateStyle('xpProgress', 'width', `${Math.max(0, xpProgress)}%`);
        safeUpdateElement('currentXP', xpInCurrentLevel);
        safeUpdateElement('nextLevelXP', xpNeededForNext);
        safeUpdateElement('currentLevel', this.level);
        safeUpdateElement('nextLevel', this.level + 1);
        
        // Update streak shop UI if available
        if (typeof updateShopUI === 'function') {
            updateShopUI();
        }
    }
    
    startGame(mode = 'translation') {
        // Veri yüklenip yüklenmediğini kontrol et
        if (!this.wordData || this.wordData.length === 0) {
            console.error('Kelime verisi yüklenmemiş!');
            
            return;
        }
        
        // Race condition flag'ini sıfırla
        this.isProcessingAnswer = false;
        
        // 🔧 Güvenli difficulty kullanımı
        const safeDifficulty = this.getDifficulty();
        
        this.gameMode = mode;
        this.currentQuestion = 0;
        this.score = 0;
        this.hearts = 5;
        this.gameHasene = 0;
        
        // 🌙 Duolingo Dark Theme - Translation Mode Only
        document.body.className = document.body.className.replace(/\s*(translation|listening|speed|fillblank|writing)-mode/g, '');
        if (mode === 'translation') {
            document.body.classList.add('translation-mode');
            
            
        } else {
            
        }
        
        // Hız modu için timer ayarları
        this.isSpeedMode = (mode === 'speed');
        this.questionTimer = null;
        this.timeLeft = 0;
        
        // Sonsuz modu için ayarlar
        this.isEndlessMode = (mode === 'endless');
        this.endlessQuestionCount = 0;
        
        // Generate questions
        this.generateQuestions();
        
        // Setup game UI
        this.setupGameUI();
        
        // Update hearts display
        this.updateHeartsDisplay();
        
        // Show first question
        this.showQuestion();
        
        // Show game screen
        this.showScreen('gameScreen');
    }
    
    generateQuestions() {
        // Sonsuz modda başlangıçta sadece 5 soru, sonra dinamik ekleme
        const questionCount = this.isEndlessMode ? 5 : 10;
        this.questions = [];
        
        if (this.gameMode === 'fillblank') {
            // Boşluk doldurma modu için ayet soruları oluştur
            if (!this.ayetData || this.ayetData.length === 0) {
                console.error('Ayet verileri yok!');
                return;
            }
            
            // 🔧 Güvenli difficulty kullanımı
            const safeDifficulty = this.getDifficulty();
            // Zorluk seviyesine göre ayetleri filtrele
            const difficultyAyets = this.getDifficultyAyets(this.ayetData, safeDifficulty);
            
            // Rastgele ayetler seç
            for (let i = 0; i < questionCount && difficultyAyets.length > 0; i++) {
                const randomAyet = difficultyAyets[Math.floor(Math.random() * difficultyAyets.length)];
                const fillBlankQuestion = this.createFillBlankQuestion(randomAyet);
                if (fillBlankQuestion) {
                    this.questions.push(fillBlankQuestion);
                }
            }
        } else {
            // Normal kelime modları için
            // Load learning statistics
            const wordStats = JSON.parse(localStorage.getItem('wordStats')) || {};
            
            // Smart word selection algorithm
            const selectedWords = this.selectSmartWords(questionCount, this.getDifficulty());
            
            selectedWords.forEach(word => {
                let question = {
                    word: word,
                    correctAnswer: word.anlam,
                    type: this.gameMode
                };
                
                // Generate wrong options for multiple choice
                if (this.gameMode === 'translation' || this.gameMode === 'listening' || this.gameMode === 'speed') {
                    const wrongAnswers = this.getWrongAnswers(word.anlam, 3);
                    const allOptions = [word.anlam, ...wrongAnswers];
                    question.options = allOptions.sort(() => Math.random() - 0.5);
                    question.correctIndex = question.options.indexOf(word.anlam);
                }
                
                this.questions.push(question);
            });
        }
        
    }
    
    selectSmartWords(count, difficulty) {
        // 🔧 Güvenli difficulty kullanımı
        const safeDifficulty = difficulty || this.getDifficulty();
        
        // � Debug: Geçilen parametreleri kontrol et
        
        // �📊 localStorage'dan word statistics'i oku
        const wordStats = JSON.parse(localStorage.getItem('wordStats') || '{}');
        
        // Zorluk seviyesine göre kelime havuzunu filtrele
        const difficultyWords = this.getDifficultyWords(this.wordData, safeDifficulty);
        
        
        // İlk 5 kelimeyi göster test için
        if (difficultyWords.length > 0) {
        };
        
        const weightedWords = [];
        
        difficultyWords.forEach(word => {
            const stats = wordStats[word.kelime] || { 
                correct: 0, 
                wrong: 0, 
                lastSeen: 0,
                difficulty: 1
            };
            
            // Calculate priority weight
            let weight = 1;
            
            // Recently wrong words get higher priority (25x for guaranteed visibility)
            if (stats.wrong > stats.correct) {
                weight *= 25;
            }
            
            // Words never seen get medium priority (2x)
            if (stats.correct === 0 && stats.wrong === 0) {
                weight *= 2;
            }
            
            // Time-based repetition (Spaced Repetition)
            const daysSinceLastSeen = (Date.now() - stats.lastSeen) / (1000 * 60 * 60 * 24);
            if (daysSinceLastSeen > 7) {
                weight *= 1.5; // Review old words
            }
            
            // Difficulty multiplier (harder words appear more)
            weight *= stats.difficulty;
            
            // Add to weighted pool multiple times based on weight
            for (let i = 0; i < Math.ceil(weight); i++) {
                weightedWords.push(word);
            }
        });
        
        // Shuffle and select unique words
        const shuffled = weightedWords.sort(() => Math.random() - 0.5);
        const selected = [];
        const usedWords = new Set();
        
        // 🎯 İLK ÖNCE YANLIŞ KELİMELERİ GARANTİ ET!
        const wrongWords = difficultyWords.filter(word => {
            const stats = wordStats[word.kelime];
            return stats && stats.wrong > 0;
        });
        
        // 🎯 TÜM YANLIŞ KELİMELERİ GARANTİLE! (maksimum count-2 adet)
        const maxWrongWords = Math.min(wrongWords.length, count - 2); // En az 2 slot random için bırak
        for (let i = 0; i < maxWrongWords; i++) {
            const randomIndex = Math.floor(Math.random() * wrongWords.length);
            const word = wrongWords[randomIndex];
            
            if (!usedWords.has(word.kelime)) {
                selected.push(word);
                usedWords.add(word.kelime);
                wrongWords.splice(randomIndex, 1); // Kullanılan kelimeyi çıkar
            }
        }
        
        // Kalan slotları ağırlıklı sistemle doldur
        for (let word of shuffled) {
            if (!usedWords.has(word.kelime) && selected.length < count) {
                selected.push(word);
                usedWords.add(word.kelime);
            }
        }
        
        // Son çare: rastgele kelimelerle doldur
        while (selected.length < count && difficultyWords.length > 0) {
            const randomWord = difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
            if (!usedWords.has(randomWord.kelime)) {
                selected.push(randomWord);
                usedWords.add(randomWord.kelime);
            }
        }
        
        return selected;
    }
    
    updateWordStats(word, isCorrect) {
        // Load existing stats
        const wordStats = JSON.parse(localStorage.getItem('wordStats')) || {};
        
        // Initialize word stats if not exists
        if (!wordStats[word.kelime]) {
            wordStats[word.kelime] = {
                correct: 0,
                wrong: 0,
                lastSeen: Date.now(),
                difficulty: 1,
                firstSeen: Date.now()
            };
        }
        
        const stats = wordStats[word.kelime];
        
        // Update statistics
        if (isCorrect) {
            stats.correct++;
            // Reduce difficulty if answered correctly multiple times
            if (stats.correct > stats.wrong + 2) {
                stats.difficulty = Math.max(0.5, stats.difficulty * 0.8);
            }
        } else {
            stats.wrong++;
            // Increase difficulty for wrong answers
            stats.difficulty = Math.min(3.0, stats.difficulty * 1.3);
        }
        
        stats.lastSeen = Date.now();
        
        // Save updated stats
        localStorage.setItem('wordStats', JSON.stringify(wordStats));
    }
    
    getWrongAnswers(correctAnswer, count) {
        const wrongAnswers = [];
        
        // Cache için static değişken kullan - sadece bir kez hesapla
        if (!this.cachedDifficultyWords || this.cachedDifficulty !== this.difficulty) {
            this.cachedDifficultyWords = this.getDifficultyWords(this.wordData, this.difficulty);
            this.cachedDifficulty = this.difficulty;
        }
        
        const allAnswers = this.cachedDifficultyWords.map(word => word.anlam).filter(answer => answer !== correctAnswer);
        
        // If difficulty-filtered answers are too few, fallback to all words
        const answersPool = allAnswers.length >= count ? allAnswers : 
                           this.wordData.map(word => word.anlam).filter(answer => answer !== correctAnswer);
        
        for (let i = 0; i < count && i < answersPool.length; i++) {
            const randomIndex = Math.floor(Math.random() * answersPool.length);
            const wrongAnswer = answersPool[randomIndex];
            
            if (!wrongAnswers.includes(wrongAnswer)) {
                wrongAnswers.push(wrongAnswer);
            } else {
                i--; // Try again if duplicate
            }
        }
        
        return wrongAnswers;
    }
    
    calculateMasteredWords() {
        // Kelime istatistiklerini yükle
        const wordStats = JSON.parse(localStorage.getItem('wordStats')) || {};
        let masteredCount = 0;
        
        // Her kelime için kontrol et
        Object.keys(wordStats).forEach(word => {
            const stats = wordStats[word];
            
            // En az 10 kez doğru cevaplamış ve hata oranı %20'nin altında
            if (stats.correct >= 10) {
                const accuracy = stats.correct / (stats.correct + stats.wrong);
                if (accuracy >= 0.8) { // %80 doğruluk oranı
                    masteredCount++;
                }
            }
        });
        
        return masteredCount;
    }
    
    setupGameUI() {
        // Update progress
        document.getElementById('totalQuestions').textContent = this.questions.length;
        document.getElementById('currentQuestion').textContent = '1';
        document.getElementById('gameProgress').style.width = '0%';
        
        // Reset hearts
        for (let i = 1; i <= 5; i++) {
            const heart = document.getElementById(`heart${i}`);
            if (heart) {
                heart.classList.remove('lost');
            }
        }
        
        // Reset Hasene display
        document.getElementById('gameHasene').textContent = '0';
        
        // Setup question type display
        const questionTypeTexts = {
            'translation': 'Arapça kelimeyi çevir',
            'listening': 'Sesi dinle ve anlamını bul',
            'speed': 'Arapça kelimeyi çevir ⚡',
            'fillblank': 'Boş yerleri doldur'
        };
        document.getElementById('questionType').textContent = questionTypeTexts[this.gameMode];
        
        // Timer'ı başlangıçta gizle
        const speedTimerEl = document.getElementById('speedTimer');
        if (speedTimerEl) {
            speedTimerEl.style.display = 'none';
        }
    }
    
    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.completeGame();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        
        // Track game mode for daily missions (only once per game)
        if (this.currentQuestion === 0) {
            this.updateDailyProgress('mode', this.gameMode);
            
        }
        
        // Update progress
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
        const progress = ((this.currentQuestion) / this.questions.length) * 100;
        document.getElementById('gameProgress').style.width = `${progress}%`;
        
        // Show question based on mode
        if (this.gameMode === 'translation' || this.gameMode === 'listening' || this.gameMode === 'speed') {
            this.showMultipleChoiceQuestion(question);
        } else if (this.gameMode === 'fillblank') {
            this.showFillBlankQuestion(question);
        }
        
        // Hide feedback and continue button
        this.hideFeedback();
        document.getElementById('continueBtn').style.display = 'none';
        
        // Hız modu için timer başlat
        if (this.isSpeedMode) {
            this.startQuestionTimer();
        }
    }
    
    // ⏱️ Hız Modu Timer Fonksiyonları
    startQuestionTimer() {
        // Timer UI'ını göster
        const speedTimerEl = document.getElementById('speedTimer');
        const questionTimerEl = document.getElementById('questionTimer');
        
        if (speedTimerEl) {
            speedTimerEl.style.display = 'flex';
        }
        
        // 10 saniye timer başlat
        this.timeLeft = 10;
        if (questionTimerEl) {
            questionTimerEl.textContent = this.timeLeft;
        }
        
        this.questionTimer = setInterval(() => {
            this.timeLeft--;
            if (questionTimerEl) {
                questionTimerEl.textContent = this.timeLeft;
                
                // Son 3 saniyede kırmızı yap
                if (this.timeLeft <= 3) {
                    speedTimerEl.style.color = '#ff4444';
                } else {
                    speedTimerEl.style.color = '#666';
                }
            }
            
            // Süre doldu - otomatik yanlış cevap
            if (this.timeLeft <= 0) {
                this.clearQuestionTimer();
                this.processAnswer(false); // Yanlış cevap olarak işle
            }
        }, 1000);
    }
    
    clearQuestionTimer() {
        // Timer'ı durdur
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
        
        // Timer UI'ını gizle
        const speedTimerEl = document.getElementById('speedTimer');
        if (speedTimerEl) {
            speedTimerEl.style.display = 'none';
            speedTimerEl.style.color = '#666'; // Rengi normale çevir
        }
    }
    
    showMultipleChoiceQuestion(question) {
        // Show question text with Arabic styling
        const questionTextElement = document.getElementById('questionText');
        
        const audioBtnEl = document.getElementById('audioBtn');
        
        if (this.gameMode === 'translation' || this.gameMode === 'speed') {
            // Arabic text with Uthmani font (Amiri Quran) and game mode colors
            questionTextElement.innerHTML = `<span class="arabic-word ${this.gameMode}-mode">${question.word.kelime}</span>`;
            if (audioBtnEl) audioBtnEl.style.display = 'inline-block';
        } else if (this.gameMode === 'listening') {
            questionTextElement.textContent = '🎧 Sesi dinleyin';
            if (audioBtnEl) audioBtnEl.style.display = 'inline-block';
            // Auto-play audio for listening mode
            setTimeout(() => this.playAudio(), 500);
        }
        
        // Show word ID and difficulty for debugging
        const wordIdEl = document.getElementById('wordId');
        if (wordIdEl) {
            wordIdEl.textContent = `ID: ${question.word.id} | Difficulty: ${question.word.difficulty} | Mod: ${this.gameMode}`;
        }
        
        // Show options, hide input
        const optionsContainer = document.getElementById('optionsContainer');
        const inputContainer = document.getElementById('inputContainer');
        
        if (optionsContainer) optionsContainer.style.display = 'grid';
        if (inputContainer) inputContainer.style.display = 'none';
        
        if (optionsContainer) optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => this.selectOption(button, index);
            
            // Add mobile touch events immediately
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.selectOption(button, index);
            }, { passive: false });
            
            
            optionsContainer.appendChild(button);
        });
        
        // Store current audio URL
        this.currentAudio = question.word.ses_dosyasi;
    }
    
    showWritingQuestion(question) {
        // Show Turkish meaning, ask for Arabic word
        const questionTextEl = document.getElementById('questionText');
        if (questionTextEl) questionTextEl.textContent = question.word.anlam;
        const audioBtnEl2 = document.getElementById('audioBtn');
        if (audioBtnEl2) audioBtnEl2.style.display = 'inline-block';
        
        // Show word ID and difficulty for debugging
        const wordIdEl2 = document.getElementById('wordId');
        if (wordIdEl2) {
            wordIdEl2.textContent = `ID: ${question.word.id} | Difficulty: ${question.word.difficulty} | Mod: ${this.gameMode}`;
        }
        
        // Show input for text input
        const optionsContainer2 = document.getElementById('optionsContainer');
        const inputContainer2 = document.getElementById('inputContainer');
        
        if (optionsContainer2) optionsContainer2.style.display = 'none';
        if (inputContainer2) inputContainer2.style.display = 'flex';
        
        const input = document.getElementById('answerInput');
        if (input) {
            input.value = '';
            input.placeholder = 'Arapça kelimeyi yazın...';
            input.removeAttribute('readonly'); // Normal text input yap
            input.focus();
        }
        
        // Store current audio URL
        this.currentAudio = question.word.ses_dosyasi;
    }

    createFillBlankQuestion(ayet) {
        if (!ayet || !ayet.ayet_metni || !ayet.meal) {
            return null;
        }
        
        // Normal ayet metnini kullan (tajweed formatı yerine)
        const arabicText = ayet.ayet_metni;
        const turkishText = ayet.meal;
        
        // Arapça metindeki kelimeleri ayır ve temizle
        const words = arabicText.split(/\s+/)
            .map(word => word.replace(/[<>]/g, '').trim()) // HTML taglarını temizle
            .filter(word => word.length > 2 && !/^\d+$/.test(word)); // En az 3 harfli ve sayı olmayan kelimeler
        
        if (words.length < 3) return null; // Çok kısa ayetleri atla
        
        // Rastgele bir kelimeyi boşluk yap
        const randomIndex = Math.floor(Math.random() * words.length);
        const hiddenWord = words[randomIndex];
        
        // Boşluklu metni oluştur
        const wordsWithBlank = [...words];
        wordsWithBlank[randomIndex] = '____';
        const textWithBlank = wordsWithBlank.join(' ');
        
        // Yanlış seçenekler oluştur (diğer ayetlerden rastgele kelimeler)
        const wrongOptions = this.getRandomArabicWords(hiddenWord, 3);
        const allOptions = [hiddenWord, ...wrongOptions];
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        
        return {
            type: 'fillblank',
            ayet: ayet,
            arabicTextWithBlank: textWithBlank,
            turkishText: turkishText,
            correctWord: hiddenWord,
            options: shuffledOptions,
            correctIndex: shuffledOptions.indexOf(hiddenWord),
            audioUrl: ayet.ayet_ses_dosyasi || ''
        };
    }

    getRandomArabicWords(excludeWord, count) {
        const wrongWords = [];
        let attempts = 0; // let olarak değiştirdik
        const maxAttempts = 100;
        
        // 🔧 KRİTİK FİX: Zorluk seviyesine uygun ayetler kullan!
        const safeDifficulty = this.getDifficulty();
        const difficultyAyets = this.getDifficultyAyets(this.ayetData, safeDifficulty);
        
        // Eğer filtrelenmiş ayet yoksa, tüm ayetleri kullan
        const sourceAyets = difficultyAyets.length > 0 ? difficultyAyets : this.ayetData;
        
        while (wrongWords.length < count && attempts < maxAttempts) {
            attempts++; // Her döngüde artır - KRİTİK FİX!
            
            // 🔧 Zorluk seviyesine uygun ayetlerden seç
            const randomAyet = sourceAyets[Math.floor(Math.random() * sourceAyets.length)];
            if (!randomAyet || !randomAyet.ayet_metni) continue;
            
            // Bu ayetteki kelimelerden rastgele birini seç (temiz ayet metni kullan)
            const words = randomAyet.ayet_metni.split(/\s+/)
                .map(word => word.replace(/[<>]/g, '').trim()) // HTML taglarını temizle
                .filter(word => 
                    word.length > 2 && 
                    word !== excludeWord && 
                    !wrongWords.includes(word) &&
                    !/^\d+$/.test(word) && // Sayıları hariç tut
                    !/[<>]/.test(word) // HTML tag içeren kelimeleri hariç tut
                );
            
            if (words.length > 0) {
                const randomWord = words[Math.floor(Math.random() * words.length)];
                if (!wrongWords.includes(randomWord) && randomWord !== excludeWord) {
                    wrongWords.push(randomWord);
                }
            }
        }
        
        // Güvenlik kontrolü - yeteri kadar kelime bulunamadıysa uyar
        if (wrongWords.length < count) {
            console.warn(`⚠️ Sadece ${wrongWords.length}/${count} yanlış seçenek bulunabildi. ${attempts} deneme yapıldı.`);
        }
        
        return wrongWords;
    }

    showFillBlankQuestion(question) {
        // Boşluklu Arapça metni göster
        const questionTextElement = document.getElementById('questionText');
        questionTextElement.innerHTML = `<div class="fillblank-arabic">${question.arabicTextWithBlank}</div>
                                       <div class="fillblank-turkish">${question.turkishText}</div>`;
        
        // Ses butonunu göster
        const audioBtnEl3 = document.getElementById('audioBtn');
        if (audioBtnEl3) audioBtnEl3.style.display = 'inline-block';
        
        // Word ID yerine ayet kimliği göster
        const wordIdEl3 = document.getElementById('wordId');
        if (wordIdEl3) {
            wordIdEl3.textContent = `Ayet: ${question.ayet.ayet_kimligi}`;
        }
        
        // Seçenekleri göster, input'u gizle
        const optionsContainer = document.getElementById('optionsContainer');
        const inputContainer = document.getElementById('inputContainer');
        
        if (optionsContainer) optionsContainer.style.display = 'grid';
        if (inputContainer) inputContainer.style.display = 'none';
        
        if (optionsContainer) optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn fillblank-option';
            button.textContent = option;
            button.onclick = () => this.selectOption(button, index);
            
            // Add mobile touch events for fillblank mode
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.selectOption(button, index);
            }, { passive: false });
            
            
            optionsContainer.appendChild(button);
        });
        
        // Ses dosyasını ayarla
        this.currentAudio = question.audioUrl;
    }
    
    selectOption(button, index) {
        // Race condition önleme: Zaten bir cevap işleniyor mu kontrol et
        if (this.isProcessingAnswer) {
            return;
        }
        
        this.isProcessingAnswer = true;
        
        const question = this.questions[this.currentQuestion];
        
        // Disable all options - Hem CSS hem de attribute ile
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.add('disabled');
            btn.disabled = true;
            btn.style.pointerEvents = 'none'; // Tıklamayı tamamen engelle
        });
        
        // Mark selected option
        button.classList.add('selected');
        
        // Check answer
        const isCorrect = index === question.correctIndex;
        this.processAnswer(isCorrect, button);
    }
    
    checkAnswer() {
        const input = document.getElementById('answerInput');
        const userAnswer = input.value.trim();
        const question = this.questions[this.currentQuestion];
        
        if (!userAnswer) {
            input.focus();
            return;
        }
        
        // For writing mode, check if the Arabic word is correct
        const isCorrect = userAnswer === question.word.kelime;
        
        input.disabled = true;
        this.processAnswer(isCorrect);
    }
    
    checkEnter(event) {
        if (event.key === 'Enter') {
            this.checkAnswer();
        }
    }
    
    processAnswer(isCorrect, selectedButton = null) {
        // Hız modunda timer'ı temizle
        if (this.isSpeedMode) {
            this.clearQuestionTimer();
        }
        
        // 🧠 Smart Learner için son cevabı kaydet
        this.lastAnswerCorrect = isCorrect;
        
        const question = this.questions[this.currentQuestion];
        
        // Update word statistics for smart repetition (sadece kelime modları için)
        if (question.word) {
            this.updateWordStats(question.word, isCorrect);
        }
        
        // Update statistics
        this.totalAnswers++;
        localStorage.setItem('totalAnswers', this.totalAnswers.toString());
        
        // Update daily progress for missions (question answered)
        this.updateDailyProgress('question');
        
        
        if (isCorrect) {
            this.score++;
            this.correctAnswers++;
            
            // Update daily progress for missions
            this.updateDailyProgress('correct');
            
            
            // Calculate hasene based on game mode
            let earnedHasene = 0;
            if (this.gameMode === 'fillblank') {
                // Boşluk doldurma modunda doğru kelimenin harf sayısına göre
                const correctWord = question.correctWord;
                const letterCount = this.countArabicLetters(correctWord);
                earnedHasene = letterCount * 15; // Boşluk doldurma daha zor, daha fazla hasene
            } else {
                // Normal kelime modlarında
                const arabicWord = question.word.kelime;
                const letterCount = this.countArabicLetters(arabicWord);
                earnedHasene = letterCount * 10;
            }
            
            this.gameHasene += earnedHasene;
            
            // 4. ✅ DOĞRU CEVAP - HASENE KAZANIMI
            this.totalHasene += earnedHasene;
            this.dailyHasene += earnedHasene;
            
            // 5. ✅ ANLIK KAYDETME - her doğru cevaptan sonra
            this.saveGameData();
            this.updateUI(); // UI'yi hemen güncelle
            
            // 6. ✅ İSTATİSTİK GÜNCELLEME - totalHasene değiştiğinde
            this.updateGameStats();
            
            // 7. ✅ CALENDAR GÜNCELLEME - her doğru cevaptan sonra
            const today = new Date().toDateString();
            this.storeDailyHasene(today, this.dailyHasene);
            
            // Play correct sound
            if (window.soundManager) {
                window.soundManager.playCorrect();
            }
            
            // Show correct feedback
            this.showFeedback(true, question);
            
            if (selectedButton) {
                selectedButton.classList.add('correct');
            }
        } else {
            // 💔 Yanlış cevap - sadece kalp yoksa hasene azalt
            
            // Başlangıçta kalp var mı kontrol et
            const hasHeartProtection = this.hearts > 0 && !unlimitedHeartsActive;
            
            if (hasHeartProtection) {
                // Kalp varsa sadece kalp azalt, hasene azaltma
                this.hearts--;
                this.updateHeartsDisplay();
                
                // Kalp kaybı sesini çal
                if (window.audioGenerator) {
                    window.audioGenerator.playHeartLostSound();
                }
            } else {
                // 🔧 Kalp yoksa hasene azalt - GÜVENLİ ZORLUK SİSTEMİ
                const safeDifficulty = this.getDifficulty();
                
                let haseneKaybi = 0;
                // 🎯 SADECE NORMALİZE EDİLMİŞ DEĞERLER (easy/medium/hard)
                switch (safeDifficulty) {
                    case 'easy': haseneKaybi = 5; break;
                    case 'medium': haseneKaybi = 10; break;
                    case 'hard': haseneKaybi = 25; break;
                    default:
                        // Bu durum olmamalı çünkü getDifficulty() her zaman valid değer döndürür
                        haseneKaybi = 10;
                        console.error(`🚨 BEKLENMEYEN ZORLUK DEĞERI: "${safeDifficulty}"! Bu bir hata!`);
                }
                
                const eskiHasene = this.gameHasene;
                this.gameHasene = Math.max(0, this.gameHasene - haseneKaybi);
                const yeniHasene = this.gameHasene;
                
                // totalHasene ve dailyHasene'yi de güncelle
                this.totalHasene = Math.max(0, this.totalHasene - haseneKaybi);
                this.dailyHasene = Math.max(0, this.dailyHasene - haseneKaybi);
                
                // localStorage'ı hemen güncelle
                try {
                    this.saveGameData();
                } catch (error) {
                    console.error('❌ saveGameData hatası:', error);
                }
                
                // UI'yi güncelle
                try {
                    this.updateUI();
                } catch (error) {
                    console.error('❌ updateUI hatası:', error);
                }
                
                // Calendar'ı da güncelle (hasene azaldığında)
                const today = new Date().toDateString();
                this.storeDailyHasene(today, this.dailyHasene);
                
                // Hasene azalma uyarısı göster
                try {
                    this.showHaseneDecrease(haseneKaybi);
                } catch (error) {
                    console.error('showHaseneDecrease hatası:', error);
                }
            }
            
            // Play incorrect sound
            if (window.soundManager) {
                window.soundManager.playIncorrect();
            }
            
            // Show incorrect feedback
            this.showFeedback(false, question);
            
            // Update hearts display
            if (!unlimitedHeartsActive && this.hearts >= 0) {
                const heartIndex = 5 - this.hearts;
                const heart = document.getElementById(`heart${heartIndex}`);
                if (heart) {
                    heart.classList.add('lost');
                    // Play heart lost sound
                    if (window.soundManager) {
                        window.soundManager.playHeartLost();
                    }
                }
            }
            
            if (selectedButton && selectedButton.classList) {
                selectedButton.classList.add('incorrect');
            }
            // Highlight correct answer
            const correctIndex = question.correctIndex;
            const options = document.querySelectorAll('.option-btn');
            if (options[correctIndex]) {
                options[correctIndex].classList.add('correct');
            }
            
            // Check if game over - kalp sistemi aktif
            if (!unlimitedHeartsActive && this.hearts <= 0) {
                setTimeout(() => {
                    showHeartsDepleted();
                }, 2000);
                return;
            }
        }
        
        localStorage.setItem('correctAnswers', this.correctAnswers.toString());
        
        // Update game Hasene display
        document.getElementById('gameHasene').textContent = this.gameHasene;
        
        // Show continue button
        setTimeout(() => {
            const continueBtn = document.getElementById('continueBtn');
            if (continueBtn) {
                continueBtn.style.display = 'inline-block';
                
                // Hız modunda otomatik devam et (1 saniye sonra - daha hızlı)
                if (this.isSpeedMode) {
                    setTimeout(() => {
                        if (continueBtn.style.display !== 'none') {
                            
                            // Son soru kontrolü
                            if (this.currentQuestion + 1 >= this.questions.length) {
                                if (this.isEndlessMode && this.hearts > 0) {
                                    this.nextQuestion();
                                } else {
                                    this.nextQuestion(); // completeGame'i çağıracak
                                }
                            } else {
                                this.nextQuestion();
                            }
                        }
                    }, 1000);
                }
            } else {
                console.error('Continue button not found!');
            }
        }, 800);
        
        // ❌ Kalp kontrolü kaldırıldı - artık kalp bitince oyun devam eder, sadece hasene azalır
    }
    
    showFeedback(isCorrect, question) {
        const feedback = document.getElementById('resultFeedback');
        const icon = document.getElementById('feedbackIcon');
        const text = document.getElementById('feedbackText');
        const meaning = document.getElementById('feedbackMeaning');
        
        // Set content based on result
        if (isCorrect) {
            icon.className = 'feedback-icon correct';
            icon.innerHTML = '<i class="fas fa-check"></i>';
            text.textContent = 'Doğru!';
            text.className = 'feedback-text correct';
        } else {
            icon.className = 'feedback-icon incorrect';
            icon.innerHTML = '<i class="fas fa-times"></i>';
            text.textContent = 'Yanlış!';
            text.className = 'feedback-text incorrect';
        }
        
        // Soru formatına göre meaning ayarla - Arapça renkli
        if (this.gameMode === 'fillblank') {
            // Boşluk doldurma modu için özel gösterim
            const fullText = question.ayet['ayahs.text_uthmani_tajweed'];
            meaning.innerHTML = `<div class="feedback-fillblank">
                                  <div class="feedback-arabic">${fullText}</div>
                                  <div class="feedback-turkish">${question.turkishText}</div>
                                  <div class="feedback-word">Doğru kelime: <span class="arabic-word fillblank-mode">${question.correctWord}</span></div>
                                </div>`;
            this.currentAudio = question.audioUrl;
        } else if (question.word) {
            // Normal format with Arabic styling
            meaning.innerHTML = `<span class="arabic-word ${this.gameMode}-mode">${question.word.kelime}</span> = ${question.word.anlam}`;
            this.currentAudio = question.word.ses_dosyasi;
        } else if (question.arabic && question.correct) {
            // Sonsuz mod format with Arabic styling
            meaning.innerHTML = `<span class="arabic-word ${this.gameMode}-mode">${question.arabic}</span> = ${question.correct}`;
            this.currentAudio = null; // Sonsuz modda ses yok şimdilik
        } else {
            // Fallback
            meaning.textContent = 'Kelime bilgisi mevcut değil';
            this.currentAudio = null;
        }
        
        // Hide continue button initially
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.style.display = 'none';
        }
        
        // Show feedback
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.classList.add('show');
        }, 100);
    }
    
   
    
    hideFeedback() {
        const feedback = document.getElementById('resultFeedback');
               feedback.classList.remove('show');
        setTimeout(() => {
           
            feedback.style.display = 'none';
        }, 300);
    }

    // 🚨 Hasene azalma uyarısı göster
    showHaseneDecrease(haseneKaybi) {
        // Hasene display elementini bul ve kırmızı animasyon uygula
        const haseneDisplay = document.getElementById('gameHasene');
        if (haseneDisplay) {
            haseneDisplay.style.color = '#ff4b4b';
            haseneDisplay.style.transform = 'scale(1.2)';
            haseneDisplay.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                haseneDisplay.style.color = '';
                haseneDisplay.style.transform = '';
            }, 2000);
        }
        // Artık popup yok, sadece animasyon var
    }
    
    nextQuestion() {
        // Race condition flag'ini sıfırla
        this.isProcessingAnswer = false;
        
        // Hide continue button
        document.getElementById('continueBtn').style.display = 'none';
        
        this.hideFeedback();
        this.currentQuestion++;
        
        // Check if game is complete
        if (this.currentQuestion >= this.questions.length) {
            if (this.isEndlessMode && this.hearts > 0) {
                this.addMoreEndlessQuestions();
                // Continue with the new questions
            } else {
                this.completeGame();
                return;
            }
        }
        
        // Reset input if in writing mode
        const input = document.getElementById('answerInput');
        input.disabled = false;
        
        setTimeout(() => {
            this.showQuestion();
        }, 300);
    }
    
    skipQuestion() {
        // 🔍 Soru kontrolü - sadece aktif sorular için skip işlemi
        if (this.currentQuestion >= this.questions.length) {
            console.warn('⚠️ Skip tetiklendi ama soru kalmadı. Oyun zaten tamamlanmış olmalı.');
            // Oyun zaten bitmiş, skip'i ignore et
            return;
        }
        
        // Sonsuz modda soru tükendiyse yeni sorular ekle
        if (this.currentQuestion === this.questions.length - 1 && this.isEndlessMode && this.hearts > 0) {
            this.addMoreEndlessQuestions();
        }
        
        // Mark as incorrect but don't lose heart
        const question = this.questions[this.currentQuestion];
        
        if (!question) {
            console.error('Skip: Soru bulunamadı!', this.currentQuestion, this.questions.length);
            return;
        }
        
        this.totalAnswers++;
        
        // Show correct answer
        this.showFeedback(false, question);
        
        // Show continue button
        setTimeout(() => {
            document.getElementById('continueBtn').style.display = 'inline-block';
        }, 800);
        
        localStorage.setItem('totalAnswers', this.totalAnswers.toString());
    }
    
    addMoreEndlessQuestions() {
        // Sonsuz modda yeni sorular ekle
        const moreQuestions = [];
        const usedWords = this.questions.map(q => q.word ? q.word.id : q.word?.kelime);
        
        // 🔧 Güvenli difficulty kullanımı
        const safeDifficulty = this.getDifficulty();
        // Zorluk seviyesine uygun kelimeler al
        let difficultyWords = this.getDifficultyWords(this.wordData, safeDifficulty);
        
        if (!difficultyWords || difficultyWords.length === 0) {
            console.warn('Zorluk seviyesi için kelime bulunamadı, tüm kelimeleri kullanıyoruz');
            difficultyWords = this.wordData;
        }
        
        // 5 yeni soru ekle (daha manageable)
        for (let i = 0; i < 5; i++) {
            let randomWord;
            let attempts = 0;
            
            // Daha önce kullanılmayan kelime bul
            do {
                randomWord = difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
                attempts++;
                if (attempts > 100) break; // Sonsuz döngüyü önle
            } while (usedWords.includes(randomWord.id || randomWord.kelime) && attempts < 100);
            
            if (randomWord) {
                // Game mode'a göre soru tipini belirle
                if (this.gameMode === 'writing') {
                    moreQuestions.push({
                        word: randomWord,
                        type: 'writing'
                    });
                } else {
                    // Multiple choice için yanlış seçenekler oluştur
                    const wrongAnswers = this.getWrongAnswers(randomWord.anlam, 3);
                    const allOptions = [randomWord.anlam, ...wrongAnswers];
                    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
                    
                    moreQuestions.push({
                        word: randomWord,
                        correctAnswer: randomWord.anlam,
                        options: shuffledOptions,
                        correctIndex: shuffledOptions.indexOf(randomWord.anlam),
                        type: this.gameMode
                    });
                }
                
                usedWords.push(randomWord.id || randomWord.kelime);
            }
        }
        
        // Yeni soruları ekle
        this.questions.push(...moreQuestions);
        this.endlessQuestionCount += moreQuestions.length;
        
    }

    playAudio() {
        if (this.currentAudio) {
            const audio = document.getElementById('audioPlayer');
            audio.src = this.currentAudio;
            audio.play().catch(error => {
                console.error('Audio playback failed:', error);
            });
        }
    }
    
    playAyDogdu() {
        const audio = document.getElementById('ayDogduAudio');
        if (audio) {
            audio.play();
        } else {
            console.error('Audio element not found!');
        }
    }
    
    updateHeartsDisplay() {
        // Kalp görünümünü güncelle
        for (let i = 1; i <= 5; i++) {
            const heart = document.getElementById(`heart${i}`);
            if (heart) {
                if (i <= this.hearts) {
                    heart.classList.remove('lost');
                    heart.style.color = '#ff6b6b'; // Kırmızı kalp
                } else {
                    heart.classList.add('lost');
                    heart.style.color = '#ccc'; // Gri kalp
                }
            }
        }
        
    }
    
    playFeedbackAudio() {
        this.playAudio();
    }
    
    playSound(type) {
        const audio = document.getElementById(type + 'Sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.error('Sound playback failed:', error);
            });
        }
    }
    
    completeGame() {
        try {
            // Timer temizle (hız modu için)
            this.clearQuestionTimer();
            
            // ❌ Kalp kontrolü kaldırıldı - artık kalp bitince de oyun tamamlanabilir
            // Calculate results
            const totalQuestions = this.questions.length;
            const accuracy = totalQuestions > 0 ? Math.round((this.score / totalQuestions) * 100) : 0;
            
            // Award Hasene and update stats - DUBLICATION REMOVED
            // Hasene zaten processAnswer'da ekleniyor, burada tekrar eklemeyelim
            // this.totalHasene += this.gameHasene;  // ❌ REMOVED DUPLICATE
            // this.dailyHasene += this.gameHasene; // ❌ REMOVED DUPLICATE
            
            // Update words learned (mastery-based calculation)
            // Gerçekten öğrenilen kelimeleri hesapla (en az 10 kez doğru)
            this.wordsLearned = this.calculateMasteredWords();
            
            // Oyun modu sayacını güncelle
            const modeKey = this.gameMode + 'Games'; // translationGames, listeningGames, speedGames, fillblankGames
            const currentCount = parseInt(localStorage.getItem(modeKey)) || 0;
            localStorage.setItem(modeKey, (currentCount + 1).toString());
            
            // Boşluk doldurma modunda mükemmel performansı kaydet
            if (this.gameMode === 'fillblank' && accuracy === 100) {
                localStorage.setItem('lastFillBlankPerfect', 'true');
            } else if (this.gameMode === 'fillblank') {
                localStorage.setItem('lastFillBlankPerfect', 'false');
            }
            
            // Check for level up - Progressive system
            const oldLevel = this.level;
            this.level = this.calculateLevel(this.totalHasene);
            
            // Daily goal bonus removed - streak only updates when game is completed
            // Save to localStorage
            localStorage.setItem('totalHasene', this.totalHasene.toString());
            localStorage.setItem('dailyHasene', this.dailyHasene.toString());
            localStorage.setItem('streak', this.streak.toString());
            
            // Store daily hasene in calendar data
            const today = new Date().toDateString();
            this.storeDailyHasene(today, this.dailyHasene); // dailyHasene kullan, gameHasene değil!
            
            // 🔥 STREAK UPDATE: Oyun tamamlanması = streak güncellemesi
            const hasPlayedToday = this.hasPlayedToday(today);
            if (!hasPlayedToday) {
                // İlk kez bugün oynadı - streak güncelle
                const lastPlayDate = localStorage.getItem('lastPlayDate');
                if (!lastPlayDate || lastPlayDate === '') {
                    // İlk kez hiç oynuyor - streak 1 yap
                    this.streak = 1;
                } else {
                    // Normal günlük streak kontrolü
                    this.checkDailyStreak();
                }
                this.updateStreakData(today, true);
            }
            
            // Update streak data if daily goal met (bonus)
            if (this.dailyHasene >= 250) {
            }
            
            // Update game statistics and check achievements
            this.updateGameStats();
            
            // Show results screen
            this.showGameComplete(totalQuestions, accuracy, oldLevel);
            
            
        } catch (error) {
            console.error('❌ completeGame() ERROR:', error);
            console.error('Stack trace:', error.stack);
            // Fallback: En azından results screen'i göstermeye çalış
            try {
                this.showGameComplete(10, 0, 1);
            } catch (fallbackError) {
                console.error('❌ Fallback de başarısız:', fallbackError);
            }
        }
    }
    
    showGameComplete(totalQuestions, accuracy, oldLevel) {
        
        // 🌙 Clear dark theme when game ends
        document.body.classList.remove('translation-mode');
        
        // Play success fanfare
        if (window.soundManager) {
            window.soundManager.playSuccess();
        }
        
        
        // 7. ✅ SONUÇ GÖSTERİMLERİ - doğru değerler
        document.getElementById('earnedHasene').textContent = this.gameHasene;
        document.getElementById('correctAnswers').textContent = `${this.score}/${totalQuestions}`;
        document.getElementById('gameAccuracy').textContent = `${accuracy}%`;
        document.getElementById('finalStreak').textContent = `${this.streak} gün`;
        
        // 8. ✅ OYUN BİTİMİ - save ve UI güncelleme
        this.saveGameData();
        this.updateUI();
        
        
        // Animate stars based on performance
        const stars = document.querySelectorAll('.stars i');
        stars.forEach((star, index) => {
            star.style.opacity = '0.3';
        });
        
        if (accuracy >= 90) {
            stars.forEach(star => star.style.opacity = '1');
        } else if (accuracy >= 70) {
            stars[0].style.opacity = '1';
            stars[1].style.opacity = '1';
        } else if (accuracy >= 50) {
            stars[0].style.opacity = '1';
        }
        
        // Show complete screen
        this.showScreen('gameComplete');
        
        // 🎮 Game tamamlandı - UI temizle
        const skipBtn = document.querySelector('.skip-btn');
        if (skipBtn) {
            skipBtn.style.display = 'none'; // Skip butonunu gizle
        }
        
        
        // Check for level up
        if (this.level > oldLevel) {
            setTimeout(() => {
                this.showLevelUp();
            }, 2000);
        } else if (this.dailyHasene >= 250 && this.streak > 0) {
            setTimeout(() => {
                this.showStreakModal();
            }, 2000);
        }
    }
    
    showLevelUp() {
        // 🎉 Play level up victory fanfare
        if (window.soundManager) {
            window.soundManager.playVictory();
        }
        
        document.getElementById('newLevel').textContent = this.level;
        document.getElementById('newLevelText').textContent = this.level;
        document.getElementById('levelUpModal').style.display = 'flex';
    }
    
    closeLevelUpModal() {
        document.getElementById('levelUpModal').style.display = 'none';
    }
    
    showStreakModal() {
        document.getElementById('streakDays').textContent = this.streak;
        document.getElementById('streakModal').style.display = 'flex';
    }
    
    closeStreakModal() {
        document.getElementById('streakModal').style.display = 'none';
    }
    
    gameOver() {
        // Update statistics
        this.updateGameStats();
        
        // 🎵 Başarı seviyesine göre fanfar çal
        this.playEndGameFanfare();
        
        
        this.returnToMenu();
    }

    // 🎉 Oyun sonu fanfar sistemi
    playEndGameFanfare() {
        const accuracy = this.totalAnswers > 0 ? (this.correctAnswers / this.totalAnswers) * 100 : 0;
        const isHighScore = this.score >= 15;
        const isPerfectScore = accuracy === 100 && this.totalAnswers >= 10;
        
        if (isPerfectScore) {
            // ⭐ Mükemmel performans - tüm cevaplar doğru
            setTimeout(() => {
                if (window.soundManager) window.soundManager.playPerfect();
            }, 300);
            
        } else if (isHighScore) {
            // 🎉 Yüksek skor - seviye başarısı
            setTimeout(() => {
                if (window.soundManager) window.soundManager.playVictory();
            }, 300);
            
        } else if (accuracy >= 70) {
            // 🎵 İyi performans - normal başarı sesi
            setTimeout(() => {
                if (window.soundManager) window.soundManager.playSuccess();
            }, 300);
            
        } else {
            // 📈 Teşvik edici - gelişim için
        }
    }

    // 🔥 Streak milestone kontrolü
    checkStreakMilestone(oldStreak, newStreak) {
        const milestones = [3, 7, 10, 15, 20, 30, 50, 100];
        
        // Yeni milestone geçildiyse fanfar çal
        const passedMilestone = milestones.find(milestone => 
            oldStreak < milestone && newStreak >= milestone
        );
        
        if (passedMilestone) {
            setTimeout(() => {
                if (window.soundManager) {
                    window.soundManager.playStreak();
                }
            }, 500);
        }
    }

    // 📈 Progressive Level System - Makul hızda ilerleme
    calculateLevel(totalXP) {
        if (totalXP < 200) return 1;      // Seviye 1: 0-199 XP
        if (totalXP < 500) return 2;      // Seviye 2: 200-499 XP
        if (totalXP < 1000) return 3;     // Seviye 3: 500-999 XP
        if (totalXP < 1800) return 4;     // Seviye 4: 1000-1799 XP
        if (totalXP < 3000) return 5;     // Seviye 5: 1800-2999 XP
        if (totalXP < 4500) return 6;     // Seviye 6: 3000-4499 XP
        if (totalXP < 6500) return 7;     // Seviye 7: 4500-6499 XP
        if (totalXP < 9000) return 8;     // Seviye 8: 6500-8999 XP
        if (totalXP < 12000) return 9;    // Seviye 9: 9000-11999 XP
        if (totalXP < 15500) return 10;   // Seviye 10: 12000-15499 XP
        
        // Seviye 10'dan sonra her seviye 4000 XP daha gerektirir
        const extraLevels = Math.floor((totalXP - 15500) / 4000);
        return 10 + extraLevels;
    }

    // 🎯 Belirli seviye için gerekli XP
    getXPRequiredForLevel(level) {
        if (level <= 1) return 0;
        if (level <= 2) return 200;        // 200 XP (20-40 soru)
        if (level <= 3) return 500;        // 500 XP (50 soru) 
        if (level <= 4) return 1000;       // 1000 XP (100 soru)
        if (level <= 5) return 1800;       // 1800 XP
        if (level <= 6) return 3000;       // 3000 XP
        if (level <= 7) return 4500;       // 4500 XP
        if (level <= 8) return 6500;       // 6500 XP
        if (level <= 9) return 9000;       // 9000 XP
        if (level <= 10) return 12000;     // 12000 XP
        if (level <= 11) return 15500;     // 15500 XP
        
        // Seviye 11'dan sonra her seviye 4000 XP daha (daha makul)
        return 15500 + ((level - 11) * 4000);
    }
    
    updateGameStats() {
        
        // Update basic stats
        this.stats.gamesPlayed++;
        localStorage.setItem('gamesPlayed', this.stats.gamesPlayed);
        
        // Check for perfect game
        if (this.score >= 10) {
            this.stats.perfectGames++;
            localStorage.setItem('perfectGames', this.stats.perfectGames);
        }
        
        // Update weekly data
        const today = new Date().getDay();
        let weeklyGames = JSON.parse(localStorage.getItem('weeklyGames')) || [0,0,0,0,0,0,0];
        weeklyGames[today]++;
        localStorage.setItem('weeklyGames', JSON.stringify(weeklyGames));
        
        // 6. ✅ İSTATİSTİK ENTEGRASYONU - totalHasene değiştiğinde doğru güncelleme
        this.stats.totalHasene = this.totalHasene;
        this.stats.currentStreak = this.streak;
        this.stats.wordsLearned = this.calculateMasteredWords(); // Dinamik hesaplama
        this.stats.totalAnswers = this.totalAnswers;
        this.stats.correctAnswers = this.correctAnswers;
        
        
        // 6. ✅ ACHIEVEMENTS KONTROLÜ - yeniden etkinleştirildi (badge modunda)
        this.checkNewAchievements();
        
        // 🧠 Smart Learner Achievement kontrolü
        this.checkSmartLearnerAchievement();
        
        // Update notification badges
        this.updateNotificationBadges();
    }
    
    returnToMenu() {
        // Timer temizle (hız modu için)
        this.clearQuestionTimer();
        
        // Update UI with latest stats
        this.updateUI();
        
        // Update calendar
        this.generateCalendar();
        
        // Show main menu
        this.showScreen('mainMenu');
    }
    
    // Calendar Management
    generateCalendar() {
        const now = new Date();
        this.currentCalendarMonth = this.currentCalendarMonth || now.getMonth();
        this.currentCalendarYear = this.currentCalendarYear || now.getFullYear();
        
        this.renderCalendar();
    }
    
    renderCalendar() {
        // Safety check for DOM elements
        const currentMonthEl = document.getElementById('currentMonth');
        const grid = document.getElementById('calendarGrid');
        
        if (!currentMonthEl || !grid) {
            return;
        }
        
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        
        // Update month header
        currentMonthEl.textContent = 
            `${monthNames[this.currentCalendarMonth]} ${this.currentCalendarYear}`;
        
        grid.innerHTML = '';
        
        // Add day headers
        dayNames.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day header';
            dayEl.textContent = day;
            grid.appendChild(dayEl);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentCalendarYear, this.currentCalendarMonth, 1);
        const lastDay = new Date(this.currentCalendarYear, this.currentCalendarMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Adjust for Monday start (getDay() returns 0 for Sunday)
        let startDayOfWeek = firstDay.getDay() - 1;
        if (startDayOfWeek < 0) startDayOfWeek = 6;
        
        // Add empty cells for previous month
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            grid.appendChild(emptyDay);
        }
        
        // Add days of current month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            const currentDate = new Date(this.currentCalendarYear, this.currentCalendarMonth, day);
            const dateString = currentDate.toDateString();
            
            // Check if it's today
            if (currentDate.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            
            // Check if it's in the future
            if (currentDate > today) {
                dayEl.classList.add('future');
            } else {
                // Get hasene data for this date
                const haseneData = this.getDailyHasene(dateString);
                
                if (haseneData >= 250) {
                    dayEl.classList.add('complete');
                    if (this.isStreakDay(dateString)) {
                        dayEl.classList.add('streak');
                    }
                } else if (haseneData > 0) {
                    dayEl.classList.add('partial');
                } else {
                    dayEl.classList.add('empty');
                }
                
                // Add tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'calendar-tooltip';
                if (haseneData > 0) {
                    tooltip.textContent = `${haseneData} hasene kazanıldı`;
                } else {
                    tooltip.textContent = 'Henüz oynanmadı';
                }
                dayEl.appendChild(tooltip);
            }
            
            grid.appendChild(dayEl);
        }
        
        // Update calendar stats panel
        this.updateCalendarStats();
    }
    
    getDailyHasene(dateString) {
        // Get stored daily hasene data from localStorage
        const haseneData = JSON.parse(localStorage.getItem('dailyHaseneData') || '{}');
        return haseneData[dateString] || 0;
    }
    
    storeDailyHasene(dateString, hasene) {
        // Store daily hasene data (set total, don't add)
        const haseneData = JSON.parse(localStorage.getItem('dailyHaseneData') || '{}');
        haseneData[dateString] = hasene; // Set total daily hasene, don't add
        localStorage.setItem('dailyHaseneData', JSON.stringify(haseneData));
    }
    
    isStreakDay(dateString) {
        // Check if this day is part of current streak
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        return streakData[dateString] === true;
    }
    
    hasPlayedToday(dateString) {
        // Check if any game was played today (based on streak data)
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        return streakData[dateString] === true;
    }
    
    updateStreakData(dateString, isStreak) {
        // Update streak data
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        streakData[dateString] = isStreak;
        localStorage.setItem('streakData', JSON.stringify(streakData));
    }
    
    // 📊 Calendar Stats Panel Update
    updateCalendarStats() {
        // Calculate stats
        const stats = this.calculateStreakStats();
        
        // Update DOM elements
        const elements = {
            longestStreak: document.getElementById('longestStreak'),
            currentStreakStat: document.getElementById('currentStreakStat'),
            totalActiveDays: document.getElementById('totalActiveDays'),
            monthlyProgress: document.getElementById('monthlyProgress'),
            motivationQuote: document.getElementById('motivationQuote'),
            nextMilestone: document.getElementById('nextMilestone'),
            milestoneProgress: document.getElementById('milestoneProgress')
        };
        
        // Update values if elements exist
        if (elements.longestStreak) elements.longestStreak.textContent = stats.longestStreak;
        if (elements.currentStreakStat) elements.currentStreakStat.textContent = stats.currentStreak;
        if (elements.totalActiveDays) elements.totalActiveDays.textContent = stats.totalActiveDays;
        if (elements.monthlyProgress) elements.monthlyProgress.textContent = stats.monthlyProgress + '%';
        
        // Update motivation quote based on streak
        if (elements.motivationQuote) {
            const quotes = [
                "Devamlılık mükemmellikten daha önemlidir",
                "Her gün bir adım, büyük başarıya giden yol",
                "Düzenli çalışma mucizeler yaratır",
                "Sabır ve sebatla her şey mümkün",
                "Küçük adımlar, büyük sonuçlar",
                "İlim tahsili beşikten mezara kadar"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            elements.motivationQuote.textContent = randomQuote;
        }
        
        // Update next milestone
        if (elements.nextMilestone && elements.milestoneProgress) {
            const milestone = this.getNextMilestone(stats.currentStreak);
            elements.nextMilestone.textContent = `${milestone.target} günlük streak`;
            elements.milestoneProgress.style.width = milestone.progress + '%';
        }
    }
    
    calculateStreakStats() {
        const haseneData = JSON.parse(localStorage.getItem('dailyHaseneData') || '{}');
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        
        // Calculate longest streak
        let longestStreak = 0;
        let currentStreak = this.streak || 0;
        let tempStreak = 0;
        
        // Sort dates and calculate longest streak
        const sortedDates = Object.keys(streakData).sort();
        for (let i = 0; i < sortedDates.length; i++) {
            if (streakData[sortedDates[i]]) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }
        
        // Calculate total active days
        const totalActiveDays = Object.keys(haseneData).filter(date => haseneData[date] > 0).length;
        
        // Calculate monthly progress (current month)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        let activeDaysThisMonth = 0;
        for (let day = 1; day <= now.getDate(); day++) {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (haseneData[dateString] > 0) {
                activeDaysThisMonth++;
            }
        }
        
        const monthlyProgress = Math.round((activeDaysThisMonth / now.getDate()) * 100);
        
        return {
            longestStreak: Math.max(longestStreak, currentStreak),
            currentStreak: currentStreak,
            totalActiveDays: totalActiveDays,
            monthlyProgress: monthlyProgress
        };
    }
    
    getNextMilestone(currentStreak) {
        const milestones = [7, 15, 30, 50, 100, 365];
        const nextMilestone = milestones.find(m => m > currentStreak) || (currentStreak + 50);
        const progress = Math.min(100, Math.round((currentStreak / nextMilestone) * 100));
        
        return {
            target: nextMilestone,
            progress: progress
        };
    }
    
    // 🎨 Duolingo-Style Loading Animation Functions
    startLoadingAnimation() {
        // Initialize loading elements
        this.progressBar = document.getElementById('loadingProgress');
        this.loadingText = document.getElementById('loadingText');
        this.loadingPercentage = document.getElementById('loadingPercentage');
        this.rotatingIcon = document.getElementById('loadingRotatingIcon');
        
        // DOM safety check - loadingText artık opsiyonel
        if (!this.progressBar || !this.loadingPercentage) {
            console.warn('❌ Loading animation elements not found, skipping animation');
            return;
        }

        // 🏷️ FOOTER INJECTION - Directly add footer to loading screen
        this.injectLoadingFooter();
        
        // Start modern animations
        this.startDuoAnimations();
        
        // Hadis okuma temposuna göre - tık tık tık artış
        const loadingSteps = [
            { text: "📖 Hadisi Şerif okunuyor...", icon: "📚", duration: 80000 },
            { text: "🤲 Tefekkür zamanı...", icon: "🏆", duration: 80000 },
            { text: "✨ Manevi hazırlık...", icon: "🔊", duration: 80000 },
            { text: "🕌 Hasene sistemi başlatılıyor...", icon: "⭐", duration: 80000 },
            { text: "🎮 Oyuna hazırsın!", icon: "🎮", duration: 40000 }
        ];
        
        let currentStep = 0;
        let progress = 0;
        
        // Update milestones during loading
        this.updateMilestones = (progressPercent) => {
            const milestones = document.querySelectorAll('.milestone');
            milestones.forEach((milestone, index) => {
                const milestoneProgress = parseInt(milestone.dataset.progress);
                if (progressPercent >= milestoneProgress) {
                    milestone.classList.add('reached');
                }
            });
        };
        
        // 🚀 Sürekli progress bar - duraksız akış
        let progressInterval;
        let stepInterval;
        
        const startContinuousProgress = () => {
            // Progress bar sürekli artış - 3 saniyede %100'e ulaş
            progressInterval = setInterval(() => {
                progress += 3.33; // 3 saniye için optimize - her %3.33
                
                // Progress bar güncelle
                if (this.progressBar) {
                    this.progressBar.style.width = progress + '%';
                }
                if (this.loadingPercentage) {
                    this.loadingPercentage.textContent = Math.round(progress);
                }
                
                // Milestones güncelle
                this.updateMilestones(progress);
                
                // %100'e ulaştığında bitir
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    clearInterval(stepInterval);
                    
                    setTimeout(() => {
                        this.completeLoadingAnimation();
                    }, 500);
                }
            }, 100); // Her 100ms'de %3.33 artış
        };
        
        // Step messages (no UI display)
        const startStepMessages = () => {
            stepInterval = setInterval(() => {
                if (currentStep < loadingSteps.length) {
                    currentStep++;
                }
            }, 3000);
        };
        
        // Start continuous loading animation
        setTimeout(() => {
            startContinuousProgress();
            startStepMessages();
        }, 3000);
    }

    // 🎨 Modern Duolingo Animations
    startDuoAnimations() {
        // Animate title letters
        const titleLetters = document.querySelectorAll('.title-letter');
        titleLetters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.animationDelay = `${index * 0.1}s`;
            }, index * 50);
        });
        
        // Start sparkle animations
        const sparkles = document.querySelectorAll('.sparkle');
        sparkles.forEach((sparkle, index) => {
            setTimeout(() => {
                sparkle.style.animationDelay = `${index * 0.5}s`;
            }, index * 200);
        });
        
        // Animate floating background elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 1}s`;
        });
    }
    
    startIconRotation() {
        if (!this.rotatingIcon) return;
        
        // Modern Duolingo-style icon animation
        this.rotatingIcon.classList.remove('stopped');
        this.rotatingIcon.style.animation = 'duoSpin 4s linear infinite';
        
        // Add breathing effect to character
        this.iconStopTimer = setTimeout(() => {
            this.stopIconTemporarily();
        }, Math.random() * 10000 + 8000); // Random stop between 8-18 seconds
    }
    
    stopIconTemporarily() {
        if (!this.rotatingIcon) return;
        
        // Get current rotation for smooth stop
        const computedStyle = getComputedStyle(this.rotatingIcon);
        const transform = computedStyle.transform;
        
        // Calculate current rotation
        let currentRotation = 0;
        if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            currentRotation = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
        }
        
        // Set CSS variable for smooth stop animation
        this.rotatingIcon.style.setProperty('--current-rotation', `${currentRotation}deg`);
        
        // Add stopped class for animation
        this.rotatingIcon.classList.add('stopped');
        
        // Resume rotation after a pause
        setTimeout(() => {
            this.resumeIconRotation();
        }, 2000 + Math.random() * 3000); // Pause for 2-5 seconds
    }
    
    resumeIconRotation() {
        if (!this.rotatingIcon) return;
        
        this.rotatingIcon.classList.remove('stopped');
        this.rotatingIcon.style.animation = 'iconRotate 3.5s ease-in-out infinite';
        
        // Set next random stop
        this.iconStopTimer = setTimeout(() => {
            this.stopIconTemporarily();
        }, Math.random() * 8000 + 5000); // Random rotation time before next stop
    }
    
    finalIconStop() {
        if (!this.rotatingIcon) return;
        
        // Clear any pending timers
        if (this.iconStopTimer) {
            clearTimeout(this.iconStopTimer);
        }
        
        // Get current rotation for final smooth stop
        const computedStyle = getComputedStyle(this.rotatingIcon);
        const transform = computedStyle.transform;
        
        let currentRotation = 0;
        if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            currentRotation = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
        }
        
        // Set CSS variable for final stop animation
        this.rotatingIcon.style.setProperty('--current-rotation', `${currentRotation}deg`);
        
        // Apply final stop with green glow
        this.rotatingIcon.classList.add('stopped');
        this.rotatingIcon.style.filter = 'drop-shadow(0 8px 20px rgba(40, 167, 69, 0.8))';
    }

    injectLoadingFooter() {
        // Remove existing footer if any
        const existingFooter = document.getElementById('js-loading-footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        // Create footer element
        const footer = document.createElement('div');
        footer.id = 'js-loading-footer';
        footer.style.cssText = `
            position: fixed;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            padding: 4px 12px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            font-family: 'Nunito', sans-serif;
        `;

        // Create version text - compact
        const versionText = document.createElement('div');
        versionText.textContent = `HASENE v${APP_VERSION.version}`;
        versionText.style.cssText = `
            font-size: 9px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
            letter-spacing: 0.3px;
            margin: 0;
        `;

        // Create build info - compact
        const buildText = document.createElement('div');
        buildText.textContent = `Build: ${APP_VERSION.buildNumber}`;
        buildText.style.cssText = `
            font-size: 7px;
            color: rgba(255, 255, 255, 0.7);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            font-weight: 500;
            margin: 0;
        `;

        // Create copyright text - compact
        const copyrightText = document.createElement('div');
        copyrightText.textContent = APP_VERSION.copyright;
        copyrightText.style.cssText = `
            font-size: 7px;
            color: rgba(255, 255, 255, 0.6);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            font-weight: 500;
            letter-spacing: 0.6px;
            margin: 0;
        `;

        // Append elements
        footer.appendChild(versionText);
        footer.appendChild(buildText);
        footer.appendChild(copyrightText);

        // Add to loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.appendChild(footer);
        } else {
            document.body.appendChild(footer);
        }
    }

    injectGlobalFooter(screenId) {
        // Skip certain screens - INCLUDING LOADING SCREEN
        if (screenId === 'gameScreen' || screenId === 'loadingScreen') return;

        // Remove existing global footer if any
        const existingFooter = document.getElementById('js-global-footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        // Create global footer element
        const footer = document.createElement('div');
        footer.id = 'js-global-footer';
        footer.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 50000 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2px !important;
            padding: 8px 12px !important;
            background: rgba(0, 0, 0, 0.8) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6) !important;
            font-family: 'Nunito', sans-serif !important;
            pointer-events: none !important;
        `;

        // Create version text
        const versionText = document.createElement('div');
        versionText.textContent = `v${APP_VERSION.version}`;
        versionText.style.cssText = `
            font-size: 11px !important;
            font-weight: 600 !important;
            color: #ffffff !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 1) !important;
            letter-spacing: 0.5px !important;
            margin: 0 !important;
        `;

        // Create copyright text  
        const copyrightText = document.createElement('div');
        copyrightText.textContent = 'YZOKUMUS';
        copyrightText.style.cssText = `
            font-size: 9px !important;
            color: rgba(255, 255, 255, 0.8) !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 1) !important;
            font-weight: 500 !important;
            letter-spacing: 0.3px !important;
            margin: 0 !important;
        `;

        // Append elements
        footer.appendChild(versionText);
        footer.appendChild(copyrightText);

        // Add to body (always visible)
        document.body.appendChild(footer);

        // Auto hide after 5 seconds on main menu
        if (screenId === 'mainMenu') {
            setTimeout(() => {
                if (footer && footer.parentNode) {
                    footer.style.opacity = '0.3';
                }
            }, 5000);
        }

        // Loading screen için özel konumlandırma
        if (screenId === 'loadingScreen') {
            footer.style.bottom = '40px';
            footer.style.right = '50%';
            footer.style.transform = 'translateX(50%)';
            footer.style.left = 'auto';
        }
    }
    
    completeLoadingAnimation() {
        // Use instance variables instead of local
        if (this.progressBar) {
            this.progressBar.style.width = '100%';
        }
        if (this.loadingPercentage) {
            this.loadingPercentage.textContent = '100';
        }
        // loadingText elementi kaldırıldı
        
        // Stop the rotating icon with final animation
        this.finalIconStop();
        
        // Wait a bit then show main menu
        setTimeout(() => {
            
            this.showScreen('mainMenu');
            // Setup event listeners after DOM is ready
            setTimeout(() => this.setupAchievementListeners(), 200);
        }, 1000);
    }

    initializeDifficultyUI() {
        // 🔧 Güvenli zorluk yüklemesi
        const rawDifficulty = localStorage.getItem('difficulty') || 'medium';
        this.difficulty = this.normalizeDifficulty(rawDifficulty);
        // Storage'ı da normalize et
        localStorage.setItem('difficulty', this.difficulty);
        
        // UI'da doğru butonu aktif yap
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(this.difficulty + 'Btn');
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // 🏆 Modern Achievement Modal
    showAchievements() {
        
        
        // 🔄 Güvenli modal açma (diğerlerini kapat)
        if (!this.openModalSafely('achievementsModal')) {
            return;
        }
        
        // Update header stats
        this.updateAchievementStats();
        
        // Update tab counts
        this.updateTabCounts();
        
        // Load all achievements by default
        this.filterAchievements('all');
        
        // Update progress bars
        this.updateProgressBars();
        
        
    }

    // 📊 Update Achievement Stats
    updateAchievementStats() {
        const unlockedCount = Object.values(this.achievements).filter(a => a.unlocked).length;
        const totalCount = Object.keys(this.achievements).length;
        
        document.getElementById('unlockedCount').textContent = unlockedCount;
        document.getElementById('totalCount').textContent = totalCount;
    }

    // 🏷️ Update Tab Counts
    updateTabCounts() {
        const counts = {
            all: 0,
            bronze: 0,
            silver: 0, 
            gold: 0,
            diamond: 0
        };
        
        Object.values(this.achievements).forEach(achievement => {
            if (achievement.unlocked) {
                counts.all++;
                counts[achievement.rarity]++;
            }
        });
        
        document.getElementById('allCount').textContent = counts.all;
        document.getElementById('bronzeCount').textContent = counts.bronze;
        document.getElementById('silverCount').textContent = counts.silver;
        document.getElementById('goldCount').textContent = counts.gold;
        document.getElementById('diamondCount').textContent = counts.diamond;
    }

    // 🔍 Filter Achievements by Rarity
    filterAchievements(rarity) {
        const grid = document.getElementById('achievementsGrid');
        grid.innerHTML = '';
        
        const achievements = Object.values(this.achievements);
        const filteredAchievements = rarity === 'all' 
            ? achievements 
            : achievements.filter(a => a.rarity === rarity);
        
        filteredAchievements.forEach(achievement => {
            const achievementCard = this.createModernAchievementCard(achievement);
            grid.appendChild(achievementCard);
        });
        
        // Update active tab
        document.querySelectorAll('.rarity-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-rarity="${rarity}"]`).classList.add('active');
    }

    // � Create Modern Achievement Card
    createModernAchievementCard(achievement) {
        const card = document.createElement('div');
        card.className = `achievement-item ${achievement.rarity} ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        card.dataset.achievementId = achievement.id;
        
        const emoji = this.getAchievementEmoji(achievement.id);
        
        card.innerHTML = `
            <div class="achievement-header">
                <div class="achievement-icon">${emoji}</div>
                <div class="achievement-info">
                    <h3 class="achievement-title">${achievement.title}</h3>
                    <p class="achievement-description">${achievement.description}</p>
                    <span class="achievement-rarity ${achievement.rarity}">${this.getRarityText(achievement.rarity)}</span>
                </div>
            </div>
            ${achievement.unlocked ? this.createShareButton(achievement) : this.createProgressHint(achievement)}
        `;
        
        return card;
    }

    // 🏅 Get Rarity Text
    getRarityText(rarity) {
        const rarityTexts = {
            bronze: 'Bronz',
            silver: 'Gümüş', 
            gold: 'Altın',
            diamond: 'Elmas'
        };
        return rarityTexts[rarity] || 'Bilinmeyen';
    }

    // 🔗 Create Share Button
    createShareButton(achievement) {
        return `
            <div class="achievement-actions">
                <button class="share-achievement-btn" onclick="game.shareAchievement('${achievement.id}')">
                    <i class="fas fa-share"></i> Paylaş
                </button>
            </div>
        `;
    }

    // 💡 Create Progress Hint
    createProgressHint(achievement) {
        return `
            <div class="achievement-hint">
                <i class="fas fa-info-circle"></i>
                <span>Bu rozeti kazanmak için ${achievement.description.toLowerCase()}</span>
            </div>
        `;
    }

    // 📊 Update Progress Bars
    updateProgressBars() {
        const rarities = ['bronze', 'silver', 'gold', 'diamond'];
        
        rarities.forEach(rarity => {
            const achievements = Object.values(this.achievements).filter(a => a.rarity === rarity);
            const unlockedAchievements = achievements.filter(a => a.unlocked);
            
            const total = achievements.length;
            const unlocked = unlockedAchievements.length;
            const percentage = total > 0 ? (unlocked / total) * 100 : 0;
            
            // Update fraction text
            document.getElementById(`${rarity}Fraction`).textContent = `${unlocked}/${total}`;
            
            // Update progress bar
            document.getElementById(`${rarity}Progress`).style.width = `${percentage}%`;
        });
    }

    createAchievementStats() {
        const stats = this.calculateAchievementStats();
        const container = document.createElement('div');
        container.className = 'achievement-stats';
        
        container.innerHTML = `
            <div class="stat-item bronze">
                <div class="stat-number">${stats.bronze}</div>
                <div class="stat-label">Bronze</div>
            </div>
            <div class="stat-item silver">
                <div class="stat-number">${stats.silver}</div>
                <div class="stat-label">Silver</div>
            </div>
            <div class="stat-item gold">
                <div class="stat-number">${stats.gold}</div>
                <div class="stat-label">Gold</div>
            </div>
            <div class="stat-item diamond">
                <div class="stat-number">${stats.diamond}</div>
                <div class="stat-label">Diamond</div>
            </div>
            <div class="stat-item total">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total</div>
            </div>
        `;
        
        return container;
    }

    calculateAchievementStats() {
        const stats = { bronze: 0, silver: 0, gold: 0, diamond: 0, total: 0 };
        
        Object.values(this.achievements).forEach(achievement => {
            if (this.unlockedAchievements.includes(achievement.id)) {
                const rarity = achievement.rarity || 'bronze';
                stats[rarity]++;
                stats.total++;
            }
        });
        
        return stats;
    }

    groupAchievementsByRarity() {
        const groups = {
            bronze: [],
            silver: [],
            gold: [],
            diamond: []
        };
        
        Object.values(this.achievements).forEach(achievement => {
            const rarity = achievement.rarity || 'bronze';
            groups[rarity].push(achievement);
        });
        
        return groups;
    }

    createRaritySection(rarity, achievements) {
        const section = document.createElement('div');
        section.className = 'rarity-section';
        
        // Section header
        const header = document.createElement('div');
        header.className = `rarity-header ${rarity}`;
        header.innerHTML = `
            <h3>${this.getRarityTitle(rarity)}</h3>
            <span class="rarity-count">${achievements.filter(a => this.unlockedAchievements.includes(a.id)).length} / ${achievements.length}</span>
        `;
        section.appendChild(header);
        
        // Achievements grid
        const rarityGrid = document.createElement('div');
        rarityGrid.className = 'achievements-grid';
        
        achievements.forEach(achievement => {
            const card = this.createAchievementCard(achievement);
            rarityGrid.appendChild(card);
        });
        
        section.appendChild(rarityGrid);
        return section;
    }

    getRarityTitle(rarity) {
        const titles = {
            bronze: '🥉 Başlangıç Rozetleri',
            silver: '🥈 Gümüş Başarılar', 
            gold: '🥇 Altın Madalyalar',
            diamond: '💎 Efsanevi Unvanlar'
        };
        return titles[rarity] || rarity;
    }

    createAchievementCard(achievement) {
        const isUnlocked = this.unlockedAchievements.includes(achievement.id);
        const conditionMet = this.checkAchievementCondition(achievement);
        const progress = this.getAchievementProgress(achievement);
        const rarity = achievement.rarity || 'bronze';
        
        const card = document.createElement('div');
        card.className = `achievement-card ${rarity} ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        if (conditionMet && !isUnlocked) {
            card.classList.add('ready-to-unlock');
            card.style.cursor = 'pointer';
            card.onclick = () => this.unlockAchievementWithEffects(achievement.id);
        }
        
        // Rarity badge
        const rarityBadge = document.createElement('div');
        rarityBadge.className = `rarity-badge ${rarity}`;
        rarityBadge.textContent = rarity.toUpperCase();
        
        // Achievement content
        card.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-content">
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${this.createProgressBar(achievement, progress)}
                ${conditionMet && !isUnlocked ? '<div class="ready-indicator">🎉 Tıkla ve Kilidi Aç!</div>' : ''}
            </div>
        `;
        
        card.appendChild(rarityBadge);
        
        // Add recently unlocked animation
        if (this.isRecentlyUnlocked(achievement.id)) {
            card.classList.add('newly-unlocked');
        }
        
        return card;
    }

    createProgressBar(achievement, progress) {
        if (!progress || !achievement.target) return '';
        
        const current = typeof achievement.progress === 'function' ? achievement.progress() : progress.current;
        const target = typeof achievement.target === 'function' ? achievement.target() : achievement.target;
        const percentage = Math.min((current / target) * 100, 100);
        
        return `
            <div class="achievement-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-text">${current} / ${target}</div>
            </div>
        `;
    }

    // 🏆 Samsung M33 Achievements Modal Close  
    closeAchievementsModal() {
        const modal = document.getElementById('achievementsModal');
        if (modal) {
            modal.style.display = 'none';
            
            // Samsung M33: Remove focus states and enable body scroll
            if (document.activeElement) {
                document.activeElement.blur();
            }
            document.body.style.overflow = '';
            
            
        }
    }
    
    // � Samsung M33 Calendar Modal Close
    closeCalendarModal() {
        const modal = document.getElementById('calendar-modal');
        if (modal) {
            modal.style.display = 'none';
            
            // Samsung M33: Remove focus states and enable body scroll
            if (document.activeElement) {
                document.activeElement.blur();
            }
            document.body.style.overflow = '';
            
            
        }
    }
    
    // 📅 Samsung M33 Calendar Month Navigation
    changeCalendarMonth(direction) {
        // Samsung M33: Prevent rapid tapping issues
        if (this.calendarNavigationTimeout) {
            return;
        }
        
        this.calendarNavigationTimeout = setTimeout(() => {
            this.calendarNavigationTimeout = null;
        }, 300);
        
        this.currentCalendarMonth += direction;
        if (this.currentCalendarMonth < 0) {
            this.currentCalendarMonth = 11;
            this.currentCalendarYear--;
        } else if (this.currentCalendarMonth > 11) {
            this.currentCalendarMonth = 0;
            this.currentCalendarYear++;
        }
        
        // Samsung M33: Visual feedback during navigation
        
        
        this.renderCalendar();
        
    }
    
    // �🔄 Modal Senkronizasyon Sistemi
    closeAllModals() {
        
        
        const modalIds = [
            'achievementsModal',
            'statsModal', 
            'dailyMissionsModal',
            'calendarModal',
            'hadisModal',
            'streakShopModal',
            'levelUpModal',
            'streakModal'
        ];
        
        modalIds.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                // Cleanup overlay listeners if needed
                modal.removeAttribute('data-overlay-listener');
            }
        });
        
        // Samsung M33: Restore body scroll when all modals closed
        document.body.style.overflow = '';
        
        // Remove focus from any active element
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }
    
    // ⌨️ ESC Key Modal Close Support
    initializeEscKeySupport() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                
                this.closeAllModals();
            }
        });
        
        
    }
    
    // 🎛️ Güvenli Modal Açma (Diğerlerini otomatik kapat)
    openModalSafely(modalId) {
        
        
        // Önce tüm modalleri kapat
        this.closeAllModals();
        
        // Hedef modalı aç
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
            // Samsung M33: Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            
            targetModal.style.display = 'flex';
            
            // Overlay click support ekle
            this.addOverlayClickSupport(targetModal);
            
            return true;
        }
        
        console.error(`❌ Modal bulunamadı: ${modalId}`);
        return false;
    }
    
    // 🖱️ Modal Overlay Click Support
    addOverlayClickSupport(modal) {
        if (!modal) return;
        
        // Event listener'ı sadece bir kez ekle (duplicate önlemek için)
        if (modal.hasAttribute('data-overlay-listener')) {
            return;
        }
        
        // Overlay click handler ekle
        const overlayClickHandler = (e) => {
            // Sadece modal background'a (overlay) tıklanırsa kapat
            if (e.target === modal) {
                
                this.closeAllModals();
            }
        };
        
        modal.addEventListener('click', overlayClickHandler);
        modal.setAttribute('data-overlay-listener', 'true');
        
        
    }

    isRecentlyUnlocked(achievementId) {
        // Check if achievement was unlocked within the last 5 minutes
        const recentUnlocks = JSON.parse(localStorage.getItem('recentUnlocks')) || {};
        const unlockTime = recentUnlocks[achievementId];
        
        if (!unlockTime) return false;
        
        const now = new Date().getTime();
        const timeDiff = now - unlockTime;
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        return timeDiff < fiveMinutes;
    }

    markAsRecentlyUnlocked(achievementId) {
        const recentUnlocks = JSON.parse(localStorage.getItem('recentUnlocks')) || {};
        recentUnlocks[achievementId] = new Date().getTime();
        
        // Clean up old entries (older than 1 hour)
        const oneHour = 60 * 60 * 1000;
        const now = new Date().getTime();
        
        Object.keys(recentUnlocks).forEach(id => {
            if (now - recentUnlocks[id] > oneHour) {
                delete recentUnlocks[id];
            }
        });
        
        localStorage.setItem('recentUnlocks', JSON.stringify(recentUnlocks));
    }

    getAchievementProgress(achievement) {
        // Universal progress calculation using achievement properties
        if (achievement.progress && achievement.target) {
            const current = typeof achievement.progress === 'function' ? achievement.progress() : 0;
            const target = typeof achievement.target === 'function' ? achievement.target() : achievement.target;
            return { current, target };
        }
        
        // Legacy support for specific achievements
        const id = achievement.id;
        
        switch(id) {
            case 'firstGame':
                return { current: this.stats.gamesPlayed, target: 1 };
            case 'streak3':
                return { current: this.stats.currentStreak, target: 3 };
            case 'streak7':
                return { current: this.stats.currentStreak, target: 7 };
            case 'streak30':
                return { current: this.stats.currentStreak, target: 30 };
            case 'hasene100':
                return { current: this.stats.totalHasene, target: 100 };
            case 'hasene500':
                return { current: this.stats.totalHasene, target: 500 };
            case 'hasene1000':
                return { current: this.stats.totalHasene, target: 1000 };
            case 'perfect10':
                return { current: this.stats.perfectGames, target: 1 };
            case 'wordLearner':
                return { current: parseInt(localStorage.getItem('uniqueWordsLearned')) || 0, target: 25 };
            case 'vocabularyMaster':
                return { current: parseInt(localStorage.getItem('uniqueWordsLearned')) || 0, target: 100 };
            case 'grandMaster':
                return { current: this.stats.totalAnswers, target: 1000 };
            case 'speedster':
                const avg = this.stats.averageTime;
                return { current: avg > 3000 ? 0 : 1, target: 1 };
            default:
                return null;
        }
    }

    // 🎯 Check if achievement condition is met (without unlocking)
    checkAchievementCondition(achievement) {
        try {
            return achievement.condition();
        } catch (error) {
            console.warn(`Achievement ${achievement.id} condition check failed:`, error);
            return false;
        }
    }

    checkNewAchievements() {
        
        let newAchievements = 0;
        
        Object.values(this.achievements).forEach(achievement => {
            const condition = achievement.condition();
            
            if (!this.unlockedAchievements.includes(achievement.id) && condition) {
                
                // 6. ✅ BADGE + KISA UNLOCK ANİMASYONU (modal yerine)
                this.unlockAchievementWithBadge(achievement);
                newAchievements++;
            }
        });
        
    }

    unlockAchievementWithBadge(achievement) {
        // Achievement'ı kaydet
        this.unlockedAchievements.push(achievement.id);
        localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
        
        
        // 6. ✅ KISA BADGE ANİMASYONU (modal yerine)
        this.showBadgeNotification(achievement);
        
        // Update notification badge
        this.updateNotificationBadges();
    }

    showBadgeNotification(achievement) {
        // 🎵 Achievement ses efekti
        if (window.soundManager) {
            window.soundManager.playAchievementUnlocked();
        }
        
        // 🎖️ Kısa badge gösterimi (3 saniye)
        const badge = document.createElement('div');
        badge.className = 'achievement-badge-notification';
        badge.innerHTML = `
            <div class="badge-content">
                <i class="${achievement.icon}"></i>
                <div class="badge-text">
                    <strong>${achievement.title}</strong>
                    <small>Rozet açıldı!</small>
                </div>
            </div>
        `;
        
        // Stil ekle
        badge.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-weight: 600;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(badge);
        
        // 3 saniye sonra kaldır
        setTimeout(() => {
            badge.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                if (badge.parentNode) {
                    badge.parentNode.removeChild(badge);
                }
            }, 500);
        }, 3000);
    }

    showAchievementUnlock(achievement) {
        // 🏆 Play achievement fanfare
        if (window.soundManager) {
            window.soundManager.playAchievementUnlocked();
        }
        
        const modal = document.getElementById('achievementUnlockModal');
        
        document.getElementById('unlockedAchievementIcon').className = achievement.icon;
        document.getElementById('unlockedAchievementTitle').textContent = achievement.title;
        document.getElementById('unlockedAchievementDesc').textContent = achievement.description;
        
        modal.style.display = 'flex';
        
        // Auto close after 3 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }

    showStats() {
        
        
        // 🔄 Güvenli modal açma (diğerlerini kapat)
        if (!this.openModalSafely('statsModal')) {
            return;
        }
        
        // ✅ Öğrenilen kelimeleri gerçek zamanlı hesapla
        this.stats.wordsLearned = this.calculateMasteredWords();
        
        // Update all stat numbers
        document.getElementById('statTotalGames').textContent = this.stats.gamesPlayed;
        document.getElementById('statTotalHasene').textContent = this.stats.totalHasene;
        document.getElementById('statMaxStreak').textContent = this.stats.currentStreak;
        document.getElementById('statCurrentStreak').textContent = this.stats.currentStreak + ' gün';
        document.getElementById('statWordsLearned').textContent = this.stats.wordsLearned;
        
        // Doğruluk oranı hesaplama
        const accuracyRate = this.stats.totalAnswers > 0 ? 
            Math.round((this.stats.correctAnswers / this.stats.totalAnswers) * 100) : 0;
        document.getElementById('statAccuracyRate').textContent = accuracyRate + '%';
        
        // Update charts
        this.updateWeeklyChart();
        this.updateGameModeStats();
        
        
    }
    
    // 📊 Samsung M33 Stats Modal Close
    closeStatsModal() {
        const modal = document.getElementById('statsModal');
        if (modal) {
            modal.style.display = 'none';
            
            // Samsung M33: Remove focus states and enable body scroll
            if (document.activeElement) {
                document.activeElement.blur();
            }
            document.body.style.overflow = '';
            
            
        }
    }
    
    // 📝 Samsung M33 Daily Missions Modal Close
    closeDailyMissionsModal() {
        const modal = document.getElementById('dailyMissionsModal');
        if (modal) {
            modal.style.display = 'none';
            
            // Samsung M33: Remove focus states and enable body scroll
            if (document.activeElement) {
                document.activeElement.blur();
            }
            document.body.style.overflow = '';
            
            
        }
    }

    updateWeeklyChart() {
        const { weeklyData, dayLabels } = this.getWeeklyData();
        const chartContainer = document.getElementById('weeklyChart');
        
        // Haftalık chart barları oluştur
        chartContainer.innerHTML = '';
        
        const maxValue = Math.max(...weeklyData, 1);
        
        weeklyData.forEach((value, index) => {
            // Bar yüksekliğini maksimum 60px ile sınırla (yazıyı kapatmasın)
            const height = Math.max((value / maxValue) * 60, 8);
            
            const chartBar = document.createElement('div');
            chartBar.className = 'chart-bar';
            chartBar.style.height = `${height}px`;
            
            chartBar.innerHTML = `
                <div class="chart-value">${value}</div>
                <div class="chart-label">${dayLabels[index]}</div>
            `;
            
            chartContainer.appendChild(chartBar);
        });
    }

    getWeeklyData() {
        // Son 7 gün için gerçek hasene verileri ve doğru gün etiketleri
        const weeklyData = [];
        const dayLabels = [];
        const today = new Date();
        const dayNames = ['Pz', 'Pt', 'Sl', 'Çr', 'Pr', 'Cu', 'Ct']; // Pazar=0, Pazartesi=1, ...
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();
            
            // Günün adını al (JavaScript'te Pazar=0, Pazartesi=1)
            const dayOfWeek = date.getDay();
            dayLabels.push(dayNames[dayOfWeek]);
            
            const dailyHasene = this.getDailyHasene(dateString) || 0;
            weeklyData.push(dailyHasene);
        }
        
        return { weeklyData, dayLabels };
    }

    updateGameModeStats() {
        // Gerçek oyun modları istatistikleri
        const translationGames = parseInt(localStorage.getItem('translationGames')) || 0;
        const listeningGames = parseInt(localStorage.getItem('listeningGames')) || 0;
        const speedGames = parseInt(localStorage.getItem('speedGames')) || 0;
        const fillblankGames = parseInt(localStorage.getItem('fillblankGames')) || 0;
        const ayetListens = parseInt(localStorage.getItem('ayetListens')) || 0;
        const duaListens = parseInt(localStorage.getItem('duaListens')) || 0;
        
        const totalGames = translationGames + listeningGames + speedGames + fillblankGames + ayetListens + duaListens || 1; // 0'a bölme hatası önleme
        
        const modes = [
            { 
                id: 'translation',
                percentage: Math.round((translationGames / totalGames) * 100),
                count: translationGames
            },
            { 
                id: 'listening',
                percentage: Math.round((listeningGames / totalGames) * 100),
                count: listeningGames
            },
            { 
                id: 'speed',
                percentage: Math.round((speedGames / totalGames) * 100),
                count: speedGames
            },
            { 
                id: 'fillblank',
                percentage: Math.round((fillblankGames / totalGames) * 100),
                count: fillblankGames
            },
            { 
                id: 'ayet',
                percentage: Math.round((ayetListens / totalGames) * 100),
                count: ayetListens
            },
            { 
                id: 'dua',
                percentage: Math.round((duaListens / totalGames) * 100),
                count: duaListens
            }
        ];
        
        modes.forEach(mode => {
            const progressBar = document.getElementById(`${mode.id}Bar`);
            const percentageSpan = document.getElementById(`${mode.id}Percent`);
            
            if (progressBar && percentageSpan) {
                progressBar.style.width = `${mode.percentage}%`;
                percentageSpan.textContent = `${mode.percentage}% (${mode.count})`;
            }
        });
    }

    updateNotificationBadges() {
        // Sadece bildirim sayısını güncelle, otomatik açılış yapma
        const newAchievements = Object.values(this.achievements).filter(achievement => 
            achievement.condition() && !this.unlockedAchievements.includes(achievement.id)
        ).length;
        
        const badge = document.getElementById('unlockedBadgeCount');
        if (badge) {
            if (newAchievements > 0) {
                badge.style.display = 'inline';
                badge.textContent = newAchievements;
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // 📅 Samsung M33 Calendar Modal Show
    showCalendar() {
        const modal = document.getElementById('calendar-modal');
        if (!modal) {
            console.error('❌ Calendar modal not found!');
            return;
        }
        
        // Samsung M33: Prevent body scroll when modal opens
        document.body.style.overflow = 'hidden';
        
        // Generate calendar
        this.renderCalendar();
        
        modal.style.display = 'flex';
        
        
    }
    
    // 🔧 LEGACY setDifficulty - şimdi normalize ediyor
    setDifficulty(level) {
        const normalized = this.normalizeDifficulty(level);
        this.difficulty = normalized;
        localStorage.setItem('difficulty', normalized);
        
        // UI güncelle
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(level + 'Btn').classList.add('active');
        
    }

    getDifficultyWords(wordData, difficulty) {
        let selectedWords = [];

        // 🔧 Güvenlik kontrolleri
        if (!wordData || wordData.length === 0) {
            console.warn(`⚠️ getDifficultyWords: wordData boş veya yok!`);
            return [];
        }

        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(difficulty)) {
            console.warn(`⚠️ getDifficultyWords: Beklenmeyen difficulty değeri: "${difficulty}", tüm kelimeler döndürülecek`);
        }

        switch(difficulty) {
            case 'easy':
                // Zorluk seviyesi 3-7: Kolay kelimeler
                selectedWords = wordData.filter(word => 
                    word.difficulty >= 3 && word.difficulty <= 7
                );
                break;
                
            case 'medium':
                // Zorluk seviyesi 8-12: Orta kelimeler  
                selectedWords = wordData.filter(word => 
                    word.difficulty >= 8 && word.difficulty <= 12
                );
                break;
                
            case 'hard':
                // Zorluk seviyesi 13-21: Zor kelimeler
                selectedWords = wordData.filter(word => 
                    word.difficulty >= 13 && word.difficulty <= 21
                );
                break;
                
            default:
                selectedWords = wordData;
        }

        // Seçilen kelimelerin difficulty dağılımını göster (sadece ilk seferde)
        if (selectedWords.length > 0 && !this.difficultyStatsShown) {
            const difficultyStats = selectedWords.reduce((acc, word) => {
                acc[word.difficulty] = (acc[word.difficulty] || 0) + 1;
                return acc;
            }, {});
            this.difficultyStatsShown = true;
        }
        return selectedWords;
    }

    getDifficultyAyets(ayetData, difficulty) {
        let selectedAyets = [];

        if (!ayetData || ayetData.length === 0) {
            console.warn(`⚠️ getDifficultyAyets: ayetData boş veya yok!`);
            return [];
        }

        // 🔧 Güvenlik: Beklenmeyen difficulty değerlerini logla
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(difficulty)) {
            console.warn(`⚠️ getDifficultyAyets: Beklenmeyen difficulty değeri: "${difficulty}", tüm ayetler döndürülecek`);
        }

        ayetData.forEach(ayet => {
            if (!ayet || !ayet.ayet_metni) return;
            
            const arabicText = ayet.ayet_metni;
            const wordCount = arabicText.split(/\s+/).filter(word => word.length > 2).length;
            
            // Kelime sayısına göre zorluk belirleme
            switch(difficulty) {
                case 'easy':
                    // 3-6 kelime: Kolay ayetler (kısa)
                    if (wordCount >= 3 && wordCount <= 6) {
                        selectedAyets.push(ayet);
                    }
                    break;
                    
                case 'medium':
                    // 7-12 kelime: Orta ayetler  
                    if (wordCount >= 7 && wordCount <= 12) {
                        selectedAyets.push(ayet);
                    }
                    break;
                    
                case 'hard':
                    // 13+ kelime: Zor ayetler (uzun ve karmaşık)
                    if (wordCount >= 13) {
                        selectedAyets.push(ayet);
                    }
                    break;
                    
                default:
                    selectedAyets.push(ayet);
            }
        });

        return selectedAyets.length > 0 ? selectedAyets : ayetData; // Eğer hiç ayet bulunamazsa tümünü döndür
    }
}

// ⚡ CRITICAL FIX: Manually add missing methods to prototype
ArabicLearningGame.prototype.normalizeDifficulty = function(difficulty) {
    // Canonical değerler: 'easy', 'medium', 'hard'
    const canonicalMap = {
        // Türkçe mappings
        'kolay': 'easy',
        'orta': 'medium', 
        'zor': 'hard',
        // İngilizce (zaten canonical)
        'easy': 'easy',
        'medium': 'medium',
        'hard': 'hard',
        // Fallback mappings
        'e': 'easy',
        'm': 'medium', 
        'h': 'hard',
        '1': 'easy',
        '2': 'medium',
        '3': 'hard'
    };
    
    // Normalize et
    const normalized = canonicalMap[difficulty?.toLowerCase()] || 'medium';
    
    // Debug
    if (difficulty !== normalized) {
    }
    
    return normalized;
};

ArabicLearningGame.prototype.getDifficulty = function() {
    return this.normalizeDifficulty(this.difficulty);
};

ArabicLearningGame.prototype.generateFillBlankQuestion = function() {
    const words = this.getRandomArabic(); // Eksik parantez eklendi
    return {
        blanks: blanks,
        difficulty: this.getDifficulty()
    };
};

ArabicLearningGame.prototype.saveGameData = function() {
    // 1. ✅ TEK KAYNAK KULLANIMLARI - HEP 'totalHasene' anahtarı
    localStorage.setItem('totalHasene', this.totalHasene.toString());
    localStorage.setItem('dailyHasene', this.dailyHasene.toString());
    localStorage.setItem('streak', this.streak.toString());
    localStorage.setItem('difficulty', this.difficulty);
    localStorage.setItem('correctAnswers', this.correctAnswers.toString());
    localStorage.setItem('totalAnswers', this.totalAnswers.toString());
    
    // 7. ✅ UNLOCK ACHIEVEMENTS SENKRONİZASYONU
    localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements || []));
    localStorage.setItem('lastPlayDate', this.lastPlayDate || '');
    
    // 2. ✅ GAMEDATA NESNESİ - aynı veriler
    const gameData = {
        totalHasene: this.totalHasene,
        dailyHasene: this.dailyHasene,
        streak: this.streak,
        level: this.level,
        difficulty: this.difficulty,
        correctAnswers: this.correctAnswers,
        totalAnswers: this.totalAnswers,
        lastPlayDate: this.lastPlayDate,
        unlockedAchievements: this.unlockedAchievements || []
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
    
    return gameData;
};

ArabicLearningGame.prototype.loadGameData = function() {
    // 3. ✅ TUTARLI YÜKLEME - önce localStorage, sonra gameData
    this.totalHasene = parseInt(localStorage.getItem('totalHasene')) || 0;
    this.dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
    this.streak = parseInt(localStorage.getItem('streak')) || 0;
    this.correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
    this.totalAnswers = parseInt(localStorage.getItem('totalAnswers')) || 0;
    this.lastPlayDate = localStorage.getItem('lastPlayDate') || '';
    
    // 7. ✅ UNLOCK ACHIEVEMENTS YÜKLEME
    this.unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
    
    // GameData varsa üzerine yaz (backup olarak)
    const saved = localStorage.getItem('gameData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            this.totalHasene = data.totalHasene || this.totalHasene;
            this.dailyHasene = data.dailyHasene || this.dailyHasene;
            this.streak = data.streak || this.streak;
            this.level = data.level || 1;
            this.difficulty = data.difficulty || 'medium';
            this.correctAnswers = data.correctAnswers || this.correctAnswers;
            this.totalAnswers = data.totalAnswers || this.totalAnswers;
            this.lastPlayDate = data.lastPlayDate || this.lastPlayDate;
            this.unlockedAchievements = data.unlockedAchievements || this.unlockedAchievements;
            return data;
        } catch (e) {
            console.error('❌ GameData parse hatası:', e);
        }
    }
    
    
    // ✅ CALENDAR DATA RESTORE - oyun başlarken bugünkü hasene'yi restore et
    const today = new Date().toDateString();
    const calendarData = JSON.parse(localStorage.getItem('dailyHaseneData') || '{}');
    const todaysCalendarHasene = calendarData[today] || 0;
    
    // Eğer calendar'da bugün için veri varsa ve dailyHasene ile uyuşmuyorsa
    if (todaysCalendarHasene > 0 && todaysCalendarHasene !== this.dailyHasene) {
        this.dailyHasene = todaysCalendarHasene;
        // localStorage'ı da güncelle
        localStorage.setItem('dailyHasene', this.dailyHasene.toString());
    }
    
    // UI'yi güncelle
    this.updateUI();
    
    return null;
};

// 8. ✅ BASİT OTOMATIK TEST SENARYOLARı
window.haseneTests = {
    // Test: Hasene kazanımı
    testHaseneGain() {
        const oldTotal = game.totalHasene;
        const oldDaily = game.dailyHasene;
        
        // Simulate correct answer with 5-letter word
        game.gameHasene += 50; // 5 letters * 10
        game.totalHasene += 50;
        game.dailyHasene += 50;
        game.saveGameData();
        
        const success = (game.totalHasene === oldTotal + 50) && (game.dailyHasene === oldDaily + 50);
        return success;
    },
    
    // Test: Hasene azaltma
    testHaseneDecrease() {
        const oldTotal = game.totalHasene;
        const oldDaily = game.dailyHasene;
        
        if (oldTotal < 10) {
            game.totalHasene += 50;
            game.dailyHasene += 50;
        }
        
        // Simulate wrong answer
        const decrease = 10;
        game.totalHasene = Math.max(0, game.totalHasene - decrease);
        game.dailyHasene = Math.max(0, game.dailyHasene - decrease);
        game.saveGameData();
        
        const success = game.totalHasene < oldTotal;
        return success;
    },
    
    // Test: LocalStorage senkronizasyonu
    testStorageSync() {
        game.saveGameData();
        
        const storageTotal = parseInt(localStorage.getItem('totalHasene'));
        const storageDaily = parseInt(localStorage.getItem('dailyHasene'));
        
        const success = (storageTotal === game.totalHasene) && (storageDaily === game.dailyHasene);
        return success;
    },
    
    // Tüm testleri çalıştır
    runAllTests() {
        const results = {
            gain: this.testHaseneGain(),
            decrease: this.testHaseneDecrease(), 
            storage: this.testStorageSync()
        };
        
        const allPassed = Object.values(results).every(r => r);
        return results;
    }
};

// Global game instance
let game = null;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    
    // 🕐 Build timestamp'i güncelle - DOM tamamen yüklenince
    setTimeout(() => {
        updateBuildTimestamp();
    }, 100);
    
    // 🏷️ Update version info in UI
    updateVersionInfo();
    
    // Oyun butonlarını başlangıçta disable et
    disableGameButtons();
    
    // Her zaman yeni bir game instance oluştur
    try {
        
        game = new ArabicLearningGame();
        
        // 🌍 Global erişim için window'a da ekle
        window.game = game;
        window.arabicLearningGame = game;
        
        
        
        // 📚 Hadis verilerini yükle
        loadHadisData();
        
        // 🎮 Oyunu initialize et
        
        game.init().then(() => {
            
            
            // 📱 CRITICAL MOBILE FIX: Re-initialize touch events after game load
            
            setTimeout(() => {
                try {
                    initializeAllModalTouchEvents();
                    initializeAllCloseButtonTouchEvents(); 
                    initializeGameModeButtonTouchEvents();
                    
                } catch (e) {
                    console.error('❌ Touch re-init failed:', e);
                }
            }, 500);
            
            enableGameButtons();
        }).catch(error => {
            console.error('❌ Oyun initialize hatası:', error);
            
        });
        
    } catch (error) {
        console.error('❌ Game instance oluşturulamadı:', error);
        
    }
    
    // 🛍️ Shop UI'ını başlangıçta güncelle
    try {
        updateShopUI();
    } catch (error) {
        console.warn('⚠️ Shop UI yüklenemedi:', error);
    }
    
    // Background müzik ayarlarını yükle
    initializeBackgroundMusic();
});

// Background müzik başlatma fonksiyonu
function initializeBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicBtn = document.getElementById('musicButton');
    
    if (!backgroundMusic) {
        console.warn('Background music element bulunamadı');
        return;
    }
    
    if (!musicBtn) {
        console.warn('Music control elementi bulunamadı');
        return;
    }

    // Müzik buton kontrolü zaten HTML'de mevcut playMusic() fonksiyonu ile yapılıyor
    // Bu fonksiyon sadece element kontrolü yapıyor
    
    
}



// Oyun butonlarını kontrol eden fonksiyonlar
function disableGameButtons() {
    const gameButtons = document.querySelectorAll('.game-mode-btn');
    gameButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    });
}

function enableGameButtons() {
    const gameButtons = document.querySelectorAll('.game-mode-btn');
    gameButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    });
}

// Global functions for HTML onclick events
function startGame(mode = 'translation') {
    
    
    // Simple game start - no blocking
    
    if (game && game.wordData && game.wordData.length > 0) {
        
        try {
            game.startGame(mode);
        } catch (error) {
            console.error('❌ Oyun başlatma hatası:', error);
            
        }
    } else {
        console.error('❌ Oyun hazır değil!');
        
        // Try to reinitialize game
        if (!game) {
            
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            
        }
    }
}

function returnToMenu() {
    if (game) {
        game.returnToMenu();
    }
}

// Oyunu sıfırla fonksiyonu
function resetGame() {
    if (confirm('⚠️ Emin misiniz? Tüm ilerleme silinecek!\n\n• Seviye: 1\'e dönecek\n• Hasene: 0\'a dönecek\n• Streak: 0\'a dönecek\n• Tüm başarımlar silinecek')) {
        // localStorage'ı temizle
        localStorage.clear();
        
        // Sayfayı yenile
        location.reload();
    }
}

function selectOption(button, index) {
    
    if (game) {
        game.selectOption(button, index);
    }
}

function checkAnswer() {
    if (game) {
        game.checkAnswer();
    }
}

function setDifficulty(level) {
    // 🎮 Game objesi kontrolü - tüm referansları dene
    const gameObj = window.game || window.arabicLearningGame || game;
    
    if (gameObj && typeof gameObj.setDifficulty === 'function') {
        gameObj.setDifficulty(level);
        
        // 🔄 Cache'i temizle ki yeni difficulty hemen etkili olsun
        if (gameObj.cachedDifficultyWords) {
            gameObj.cachedDifficultyWords = null;
        }
        
        // 🎨 UI güncellemesi
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(level + 'Btn').classList.add('active');
        
    } else {
        console.error('❌ Game objesi bulunamadı - setDifficulty çalışmadı!');
    }
}

// Modal close functions
function closeAchievementsModal() {
    if (game) {
        game.closeAchievementsModal();
    } else {
        document.getElementById('achievementsModal').style.display = 'none';
    }
}

function closeStatsModal() {
    if (game && game.closeStatsModal) {
        game.closeStatsModal();
    } else {
        document.getElementById('statsModal').style.display = 'none';
    }
}

function closeAchievementUnlockModal() {
    if (game && game.closeAchievementUnlockModal) {
        game.closeAchievementUnlockModal();
    } else {
        document.getElementById('achievementUnlockModal').style.display = 'none';
    }
}


// Global functions for HTML onclick events
function toggleCalendar() {
    if (game) {
        game.showCalendar();
    }
}

function showAchievements() {
    if (game) {
        game.showAchievements();
    }
}

// Oyun Modu İstatistikleri Yüzde Barlarını Güncelle
function updateGameModeStats(stats) {
    // stats: { translation: %, word: %, ayet: %, dua: %, hadis: % }
    const modes = ['translation', 'word', 'ayet', 'dua', 'hadis'];
    modes.forEach(mode => {
        const bar = document.getElementById(`${mode}-mode-bar`);
        const percent = stats[mode] || 0;
        if (bar) {
            bar.style.width = percent + '%';
            bar.textContent = percent + '%';
        }
    });
}

function showStats() {
    if (game) {
        game.showStats();
    }
}

function checkEnter(event) {
    if (game) {
        game.checkEnter(event);
    }
}

function nextQuestion() {
    if (game) {
        game.nextQuestion();
    } else {
        console.error('Game instance not found');
    }
}

function skipQuestion() {
    if (game) {
        game.skipQuestion();
    }
}

function playAudio() {
    if (game) {
        game.playAudio();
    }
}

function playFeedbackAudio() {
    if (game) {
        game.playFeedbackAudio();
    }
}

function closeLevelUpModal() {
    if (game) {
        game.closeLevelUpModal();
    }
}

function closeStreakModal() {
    if (game) {
        game.closeStreakModal();
    }
}

// 📅 Samsung M33 Calendar Navigation Fix
function changeMonth(direction) {
    
    if (game && game.changeCalendarMonth) {
        game.changeCalendarMonth(direction);
    } else if (game) {
        // Fallback for compatibility
        game.currentCalendarMonth += direction;
        if (game.currentCalendarMonth < 0) {
            game.currentCalendarMonth = 11;
            game.currentCalendarYear--;
        } else if (game.currentCalendarMonth > 11) {
            game.currentCalendarMonth = 0;
            game.currentCalendarYear++;
        }
        if (game.renderCalendar) {
            game.renderCalendar();
        }
    }
}

// 📅 Samsung M33 Calendar Modal Close Fix  
function closeCalendarModal() {
    
    if (game && game.closeCalendarModal) {
        game.closeCalendarModal();
    } else {
        document.getElementById('calendarModal').style.display = 'none';
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
            })
            .catch(registrationError => {
            });
    });
}



// Heart Refill System (Duolingo-style)
if (typeof heartRefillTimer === 'undefined') {
    var heartRefillTimer = null;
}
if (typeof unlimitedHeartsActive === 'undefined') {
    var unlimitedHeartsActive = false;
}

function showHeartsDepleted() {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('heartsDepleted').style.display = 'flex';
    
    // Heart timer'ını başlat
    startHeartRefillTimer();
}

function watchAdForHearts() {
    
    // Fake ad loading
    const button = event.target.closest('.refill-option');
    const originalContent = button.innerHTML;
    
    button.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <div class="option-content">
            <h3>Reklam Yükleniyor...</h3>
            <p>Lütfen bekleyin</p>
        </div>
    `;
    button.style.pointerEvents = 'none';
    
    // 3 saniye fake reklam
    setTimeout(() => {
        // 1 kalp ver
        game.hearts = Math.min(game.hearts + 1, 5);
        game.updateHeartsDisplay();
        
        // Başarı mesajı
        button.innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--primary-green);"></i>
            <div class="option-content">
                <h3>Tebrikler!</h3>
                <p>1 kalp kazandın! ❤️</p>
            </div>
        `;
        
        // 2 saniye sonra oyuna dön ve devam et
        setTimeout(() => {
            document.getElementById('heartsDepleted').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'flex';
            
            // Oyunu devam ettir - yeni soru göster
            if (game) {
                game.nextQuestion();
            }
        }, 2000);
    }, 3000);
}

function startHeartRefillTimer() {
    let timeLeft = 30 * 60; // 30 dakika (saniye cinsinden)
    
    heartRefillTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('heartTimer');
        if (timerElement) {
            timerElement.textContent = timerDisplay;
        }
        
        if (timeLeft <= 0) {
            clearInterval(heartRefillTimer);
            
            // 1 kalp ver
            if (game && game.hearts < 5) {
                game.hearts++;
                game.updateHeartsDisplay();
                
                // Bildirim göster
                showNotification('❤️ Yeni kalp kazandın!', 'success');
            }
            
            // Timer'ı yeniden başlat
            startHeartRefillTimer();
        }
    }, 1000);
}

function showWaitTimer() {
    showNotification('⏰ Kalp yenilenmesi için beklemen gerekiyor!', 'info');
}

function buyUnlimitedHearts() {
    const currentHasene = parseInt(localStorage.getItem('totalHasene') || '0');
    
    if (currentHasene >= 100) {
        // Hasene düş
        const newHasene = currentHasene - 100;
        localStorage.setItem('totalHasene', newHasene.toString());
        
        // Sınırsız kalp aktifleştir
        unlimitedHeartsActive = true;
        localStorage.setItem('unlimitedHearts', 'true');
        
        // UI güncelle
        if (game) {
            game.hearts = 5;
            game.updateHeartsDisplay();
        }
        
        showNotification('♾️ Sınırsız kalp aktifleştirildi!', 'success');
        
        // Oyuna dön ve devam et
        setTimeout(() => {
            document.getElementById('heartsDepleted').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'flex';
            
            // Oyunu devam ettir - yeni soru göster
            if (game) {
                game.nextQuestion();
            }
        }, 2000);
    } else {
        showNotification('❌ Yeterli Hasene yok! (100 Hasene gerekli)', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Basit notification sistemi
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Animasyon CSS'ini ekle
if (!document.getElementById('musicMenuStyles')) {
    const style = document.createElement('style');
    style.id = 'musicMenuStyles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification {
            font-family: var(--font-family);
        }
    `;
    document.head.appendChild(style);
}

// 🛡️ Streak Shop Fonksiyonları
// 🛡️ Samsung M33 Streak Shop Modal Show
function showStreakShop() {
    updateShopUI();
    
    // Samsung M33: Prevent body scroll when modal opens
    document.body.style.overflow = 'hidden';
    
    document.getElementById('streakShopModal').style.display = 'block';
    
    
}

// 🛡️ Samsung M33 Streak Shop Modal Close Fix
function closeStreakShop() {
    const modal = document.getElementById('streakShopModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Samsung M33: Remove focus states and enable body scroll
        if (document.activeElement) {
            document.activeElement.blur();
        }
        document.body.style.overflow = '';
        
        
    }
}

function updateShopUI() {
    // Sahip olunan koruma sayılarını güncelle
    const streakFreezes = parseInt(localStorage.getItem('streakFreezes')) || 0;
    const weekendPasses = parseInt(localStorage.getItem('weekendPasses')) || 0;
    const currentHasene = parseInt(localStorage.getItem('totalHasene')) || 0;  // totalHasene key kullan
    
    // Shop modal'daki sayıları güncelle
    document.getElementById('ownedStreakFreezes').textContent = streakFreezes;
    document.getElementById('ownedWeekendPasses').textContent = weekendPasses;
    
    // Header'daki mini counter'ları güncelle
    document.getElementById('streakFreezeCount').textContent = streakFreezes;
    document.getElementById('weekendPassCount').textContent = weekendPasses;
    
    // 💰 Hasene görünümünü güncelle (varsa)
    const haseneDisplay = document.getElementById('hasene');
    if (haseneDisplay) {
        haseneDisplay.textContent = currentHasene;
    }
}

function buyItem(itemType, buttonElement) {
    // 🎮 Game objesi kontrolü - Global game'i kullan
    const gameObj = window.game || window.arabicLearningGame || game;
    
    if (gameObj && typeof gameObj.buyStreakProtection === 'function') {
        
        const success = gameObj.buyStreakProtection(itemType);
        
        if (success) {
            updateShopUI();
            
            // 🔊 Purchase success sound
            if (window.audioGenerator) {
                window.audioGenerator.playPurchaseSound();
            }
            
            // Başarı animasyonu (sadece button varsa)
            const buyBtn = buttonElement || event?.target;
            if (buyBtn) {
                buyBtn.style.background = '#4CAF50';
                buyBtn.textContent = '✅ Satın Alındı!';
                
                setTimeout(() => {
                    buyBtn.style.background = '#667eea';
                    buyBtn.textContent = 'Satın Al';
                }, 2000);
            }
        } else {
            // Başarısız animasyonu (sadece button varsa)
            const buyBtn = buttonElement || event?.target;
            if (buyBtn) {
                buyBtn.style.background = '#f44336';
                buyBtn.textContent = '❌ Yetersiz Hasene';
                
                setTimeout(() => {
                    buyBtn.style.background = '#667eea';
                    buyBtn.textContent = 'Satın Al';
                }, 2000);
            }
        }
    } else {
        console.error('❌ Game objesi bulunamadı!');
        
        // Kullanıcıya hata göster
        
    }
}

// 📊 Statistics Modal Functions
function showStatsModal() {
    updateStatsDisplay();
    document.getElementById('statsModal').style.display = 'block';
    
    // 🔊 Stats open sound effect
    if (window.audioGenerator) {
        window.audioGenerator.playStatsOpenSound();
    }
}

function updateStatsDisplay() {
    // localStorage'dan istatistikleri al
    const wordStats = JSON.parse(localStorage.getItem('wordStats') || '{}');
    const totalGames = parseInt(localStorage.getItem('totalGamesPlayed')) || 0;
    const streak = parseInt(localStorage.getItem('streak')) || 0;
    const bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
    
    // Doğru/yanlış hesapla
    let totalCorrect = 0;
    let totalWrong = 0;
    const wrongWords = [];
    
    Object.entries(wordStats).forEach(([word, stats]) => {
        totalCorrect += stats.correct || 0;
        totalWrong += stats.wrong || 0;
        
        if (stats.wrong > 0) {
            wrongWords.push({ word, count: stats.wrong });
        }
    });
    
    // Başarı oranı hesapla
    const totalAnswers = totalCorrect + totalWrong;
    const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
    
    // UI'ı güncelle
    document.getElementById('totalGamesPlayed').textContent = totalGames;
    document.getElementById('totalCorrectAnswers').textContent = totalCorrect;
    document.getElementById('totalWrongAnswers').textContent = totalWrong;
    document.getElementById('accuracyRate').textContent = `${accuracy}%`;
    document.getElementById('currentStreak').textContent = streak;
    document.getElementById('bestStreak').textContent = bestStreak;
    
    // En çok yanlış yapılan kelimeleri göster
    updateMostWrongWords(wrongWords);
    
}

function updateMostWrongWords(wrongWords) {
    const container = document.getElementById('mostWrongWords');
    
    // En çok yanlış yapılanları sırala (en fazla 5 tane)
    const sortedWords = wrongWords
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    
    if (sortedWords.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #777;">Henüz yanlış cevap yok! 🎉</p>';
        return;
    }
    
    container.innerHTML = sortedWords
        .map(item => `
            <div class="wrong-word-item">
                <span class="wrong-word-text">${item.word}</span>
                <span class="wrong-word-count">${item.count}x</span>
            </div>
        `).join('');
}

// 🧠 Smart Learner Achievement Functions
ArabicLearningGame.prototype.checkSmartLearnerAchievement = function() {
    // Sadece doğru cevap verildiyse kontrol et
    if (this.lastAnswerCorrect && this.currentQuestion && this.currentQuestion.word) {
        const currentWord = this.currentQuestion.word.kelime;
        const wordStats = JSON.parse(localStorage.getItem('wordStats') || '{}');
        
        
        // Bu kelime daha önce yanlış yapılmış mı?
        if (wordStats[currentWord] && wordStats[currentWord].wrong > 0) {
            
            // Smart Learner achievement'ı zaten kazanılmış mı?
            if (!this.unlockedAchievements.includes('smartLearner')) {
                this.unlockAchievement('smartLearner');
            } else {
            }
        } else {
        }
    } else {
    }
};

ArabicLearningGame.prototype.unlockAchievement = function(achievementId) {
    // Use the new effects-enabled function
    return this.unlockAchievementWithEffects(achievementId);
};

ArabicLearningGame.prototype.showAchievementNotification = function(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return;
    
    // 🎨 Show visual achievement notification
    this.showVisualAchievement(achievement);
};

// 🎨 NEW: Visual Achievement System
ArabicLearningGame.prototype.showVisualAchievement = function(achievement) {
    this.createFullScreenUnlockAnimation(achievement);
};

ArabicLearningGame.prototype.showMiniAchievement = function(achievement) {
    this.createMiniUnlockNotification(achievement);
};

ArabicLearningGame.prototype.createFullScreenUnlockAnimation = function(achievement) {
    // Create full-screen overlay
    const overlay = document.createElement('div');
    overlay.className = `achievement-unlock-overlay ${achievement.rarity || 'bronze'}`;
    
    // Create particle system
    const particles = this.createParticleSystem(achievement.rarity);
    
    overlay.innerHTML = `
        <div class="achievement-unlock-container">
            <div class="achievement-unlock-particles">${particles}</div>
            
            <div class="achievement-unlock-content">
                <div class="achievement-unlock-badge ${achievement.rarity || 'bronze'}">
                    <i class="${achievement.icon}"></i>
                </div>
                
                <div class="achievement-unlock-text">
                    <h2 class="achievement-unlock-title">🎉 BAŞARI AÇILDI! 🎉</h2>
                    <h3 class="achievement-unlock-name">${achievement.title}</h3>
                    <p class="achievement-unlock-description">${achievement.description}</p>
                    <div class="achievement-unlock-rarity">
                        <span class="rarity-badge ${achievement.rarity || 'bronze'}">${(achievement.rarity || 'bronze').toUpperCase()}</span>
                    </div>
                </div>
                
                <button class="achievement-unlock-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    ✨ Harika! ✨
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger animations
    setTimeout(() => {
        overlay.classList.add('show');
    }, 50);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.parentElement.removeChild(overlay);
            }
        }, 500);
    }, 5000);
    
    // Play sound effect
    this.playAchievementUnlocked();
};

ArabicLearningGame.prototype.createMiniUnlockNotification = function(achievement) {
    // Create mini notification
    const notification = document.createElement('div');
    notification.className = `mini-achievement-notification ${achievement.rarity || 'bronze'}`;
    
    notification.innerHTML = `
        <div class="mini-achievement-content">
            <div class="mini-achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="mini-achievement-text">
                <div class="mini-achievement-title">Başarı Açıldı!</div>
                <div class="mini-achievement-name">${achievement.title}</div>
            </div>
            <div class="mini-achievement-close" onclick="this.parentElement.parentElement.remove()">×</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto close after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Play sound effect
    this.playAchievement();
};

ArabicLearningGame.prototype.createParticleSystem = function(rarity) {
    const particleCount = {
        bronze: 15,
        silver: 25, 
        gold: 35,
        diamond: 50
    }[rarity] || 15;
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const delay = Math.random() * 2;
        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        
        particles.push(`
            <div class="particle particle-${rarity || 'bronze'}" 
                 style="
                    left: ${left}%; 
                    animation-delay: ${delay}s;
                    animation-duration: ${animationDuration}s;
                    width: ${size}px;
                    height: ${size}px;
                 "></div>
        `);
    }
    
    return particles.join('');
};

// � Full Screen Achievement Unlock Animation
ArabicLearningGame.prototype.createFullScreenUnlockAnimation = function(achievement) {
    const overlay = document.createElement('div');
    overlay.className = `achievement-unlock-overlay ${achievement.rarity}`;
    overlay.innerHTML = `
        <div class="achievement-unlock-content">
            <div class="particles-container">
                ${this.createParticleSystem(achievement.rarity)}
            </div>
            <div class="achievement-icon">${this.getAchievementEmoji(achievement.id)}</div>
            <h2 class="achievement-title">${achievement.title}</h2>
            <p class="achievement-description">${achievement.description}</p>
            <div class="progress-ring">
                <svg>
                    <circle class="bg-circle" cx="30" cy="30" r="30"></circle>
                    <circle class="progress-circle" cx="30" cy="30" r="30"></circle>
                </svg>
                <div class="percentage">100%</div>
            </div>
            <button class="achievement-close-btn" onclick="this.parentElement.parentElement.remove()">
                ✨ Harika! ✨
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger animation
    setTimeout(() => {
        overlay.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 300);
    }, 5000);
    
    // 🔊 Play achievement sound
    if (this.soundManager) {
        this.soundManager.playAchievementUnlocked();
    }
    
    // 🔊 Enhanced achievement sound
    if (window.audioGenerator) {
        window.audioGenerator.playAchievementSound();
        
        // Special sound for Smart Learner
        if (achievement.id === 'smartLearner') {
            setTimeout(() => {
                window.audioGenerator.playSmartLearnerSound();
            }, 500);
        }
    }
};

// �🎨 Get Achievement Emoji
ArabicLearningGame.prototype.getAchievementEmoji = function(achievementId) {
    const emojiMap = {
        ayetListener: '📖',
        duaListener: '📿',
        firstGame: '🕌',
        streak3: '📿',
        streak7: '🕌',
        streak30: '📅',
        hasene100: '💎',
        hasene500: '👑',
        hasene1000: '🔥',
        smartLearner: '💡',
        perfect10: '⭐',
        perfectStreak: '💎',
        speedster: '⚡',
        fastLearner: '🚀',
        wordMaster: '📚',
        wordGuru: '🎓',
        gameAddict: '🎮',
        quranLover: '📖',
        fillBlankMaster: '🧩',
        fillBlankPerfect: '📚'
    };
    
    return emojiMap[achievementId] || '🏆';
};

// 🎨 Mini Achievement Notification (for less important achievements)
ArabicLearningGame.prototype.showMiniAchievement = function(achievement) {
    const mini = document.createElement('div');
    mini.className = 'mini-achievement';
    
    mini.innerHTML = `
        <div class="mini-achievement-icon">${this.getAchievementEmoji(achievement.id)}</div>
        <div class="mini-achievement-text">
            <div class="mini-achievement-title">${achievement.title}</div>
            <div class="mini-achievement-desc">${achievement.description.substring(0, 50)}...</div>
        </div>
    `;
    
    document.body.appendChild(mini);
    
    // Show animation
    setTimeout(() => {
        mini.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        mini.classList.remove('show');
        setTimeout(() => {
            if (mini.parentElement) {
                mini.remove();
            }
        }, 500);
    }, 3000);
};

// 🎨 Enhanced Achievement Unlock Function
ArabicLearningGame.prototype.unlockAchievementWithEffects = function(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement || this.unlockedAchievements.includes(achievementId)) {
        return false;
    }
    
    // Unlock the achievement
    achievement.unlocked = true; // Bu satır eksikti!
    this.unlockedAchievements.push(achievementId);
    localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
    
    // Mark as recently unlocked for animation
    this.markAsRecentlyUnlocked(achievementId);
    
    // Rozet sayacını güncelle
    this.updateBadgeCounter();
    
    // Determine notification type
    const majorAchievements = ['smartLearner', 'hasene1000', 'streak30', 'perfectStreak', 'wordGuru'];
    
    if (majorAchievements.includes(achievementId)) {
        // Full screen achievement
        this.showVisualAchievement(achievement);
    } else {
        // Mini notification
        this.showMiniAchievement(achievement);
    }
    
    return true;
};

// Hadis sistemi
let hadisData = [];

// Hadis verilerini yükle
async function loadHadisData() {
    try {
        // Progressive loading: Sadece gerekli olduğunda yükle
        if (hadisData && hadisData.length > 0) {
            return; // Zaten yüklendi
        }
        
        const response = await fetch('kutubisitte.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        hadisData = await response.json();
        // 5972 hadis başarıyla yüklendi
    } catch (error) {
        console.error('Hadis verileri yüklenirken hata:', error);
        // Fallback kutub-i sitte verisi
        hadisData = [
            {
                "chapterName": "İman ve İslam'ın Fazileti",
                "text": "Hz. Peygamber (sav) buyurdular ki: \"Kimin (hayatta söylediği) en son sözü La ilahe illallah olursa cennete girer.\"",
                "refno": "Ebu Davud, Cenaiz 20, (3116)",
                "header": "Muaz ibnu Cebel el-Ensari",
                "id": "fallback"
            }
        ];
    }
}

// Rastgele hadis göster
function showRandomHadis() {
    if (hadisData.length === 0) {
        console.error('Hadis verileri henüz yüklenmedi');
        return;
    }
    
    // Rastgele hadis seç
    const randomIndex = Math.floor(Math.random() * hadisData.length);
    const selectedHadis = hadisData[randomIndex];
    
    // Modal içeriğini oluştur (Kutub-i Sitte formatı)
    const hadisContent = document.getElementById('hadisContent');
    hadisContent.innerHTML = `
        <div class="hadis-chapter">${selectedHadis.chapterName}</div>
        <div class="hadis-text-arabic">${selectedHadis.text}</div>
        <div class="hadis-source">📚 ${selectedHadis.refno}</div>
        <div class="hadis-narrator">� ${selectedHadis.header}</div>
        <div class="hadis-hasana">
            <i class="fas fa-star"></i> Bu hadisi okudun, +10 hasene kazandın!
        </div>
        <div class="hadis-actions">
            <button class="hadis-btn" onclick="showRandomHadis()">
                <i class="fas fa-refresh"></i> Başka Hadis
            </button>
            <button class="hadis-btn secondary" onclick="closeHadisModal()">
                <i class="fas fa-check"></i> Tamam
            </button>
        </div>
    `;
    
    // Samsung M33: Prevent body scroll when modal opens
    document.body.style.overflow = 'hidden';
    
    // Modalı aç
    document.getElementById('hadisModal').style.display = 'flex';
    
    // Hasene ekle - Doğru key kullan: totalHasene
    let currentHasene = parseInt(localStorage.getItem('totalHasene') || '0');
    currentHasene += 10;
    localStorage.setItem('totalHasene', currentHasene.toString());
    
    // Hasene display'ini güncelle
    const haseneElement = document.getElementById('haseneCount');
    if (haseneElement) {
        haseneElement.textContent = currentHasene;
    }
    
    // Oyun varsa oyun üzerinden de güncelle
    if (game) {
        game.updateDisplay();
    }
    
    // Hadis istatistikleri güncelle ve bildirim göster
    let hadisStats = JSON.parse(localStorage.getItem('hadisStats') || '{"totalRead": 0, "lastReadDate": null}');
    hadisStats.totalRead++;
    hadisStats.lastReadDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('hadisStats', JSON.stringify(hadisStats));
    
    // Toast notification göster
    if (typeof showNotification !== 'undefined') {
        showNotification(`📚 +10 Hasene | Toplam ${hadisStats.totalRead} hadis okudun!`);
    }
    
    // Başarım kontrolü - hadis okuma başarımları olabilir
    if (typeof checkAchievements !== 'undefined') {
        checkAchievements();
    }
}

// Hadis modalını kapat
// 📜 Samsung M33 Hadis Modal Close Fix
function closeHadisModal() {
    const modal = document.getElementById('hadisModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Samsung M33: Remove focus states and enable body scroll
        if (document.activeElement) {
            document.activeElement.blur();
        }
        document.body.style.overflow = '';
        
        
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC - Modal kapat
    if (e.key === 'Escape') {
        const hadisModal = document.getElementById('hadisModal');
        if (hadisModal && hadisModal.style.display === 'flex') {
            closeHadisModal();
        }
    }
    
    // H - Hadis göster (ana menüde)
    if (e.key === 'h' || e.key === 'H') {
        const currentScreen = document.querySelector('.screen:not([style*="display: none"])');
        if (currentScreen && currentScreen.id === 'menuScreen') {
            showRandomHadis();
        }
    }
    
    // Spacebar - Yeni hadis (hadis modalında)
    if (e.key === ' ') {
        const hadisModal = document.getElementById('hadisModal');
        if (hadisModal && hadisModal.style.display === 'flex') {
            e.preventDefault();
            showRandomHadis();
        }
    }
});

// 📚 Hadis verilerini yükle - Ana DOMContentLoaded içine taşınacak

// 🎯 === DAILY MISSIONS GLOBAL FUNCTIONS ===

function showDailyMissions() {
    if (typeof game !== 'undefined' && game) {
        game.showDailyMissions();
    } else {
        console.warn('Game not initialized yet');
    }
}

// 📱 Samsung M33 Daily Missions Modal Close Fix
function closeDailyMissionsModal() {
    
    if (game && game.closeDailyMissionsModal) {
        game.closeDailyMissionsModal();
    } else {
        // Fallback
        const modal = document.getElementById('dailyMissionsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Add showDailyMissions method to ArabicLearningGame prototype
ArabicLearningGame.prototype.showDailyMissions = function() {
    const modal = document.getElementById('dailyMissionsModal');
    const grid = document.getElementById('missionsGrid');
    
    if (!modal || !grid) {
        console.error('Daily missions modal elements not found!');
        return;
    }
    
    // Update summary
    const summary = this.getDailyMissionsSummary();
    document.getElementById('completedMissions').textContent = summary.completed;
    document.getElementById('totalMissions').textContent = summary.total;
    document.getElementById('dailyRewards').textContent = summary.totalRewards;
    
    // Clear and populate missions grid
    grid.innerHTML = '';
    
    this.dailyMissions.forEach(mission => {
        const card = this.createMissionCard(mission);
        grid.appendChild(card);
    });
    
    // Samsung M33: Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    modal.style.display = 'flex';
    
    
};

ArabicLearningGame.prototype.createMissionCard = function(mission) {
    const card = document.createElement('div');
    card.className = `mission-card ${mission.rarity} ${mission.completed ? 'completed' : 'in-progress'}`;
    
    // Calculate progress percentage
    let progressPercentage = 0;
    let progressText = '';
    
    if (mission.type === 'accuracy' || mission.type === 'master') {
        progressPercentage = mission.progress >= mission.target ? 100 : (mission.progress * 100);
        progressText = mission.completed ? 'Tamamlandı!' : `${Math.round(mission.progress * 100)}% / ${Math.round(mission.target * 100)}%`;
    } else {
        const target = typeof mission.target === 'object' ? 1 : mission.target;
        progressPercentage = Math.min((mission.progress / target) * 100, 100);
        progressText = `${mission.progress} / ${target}`;
    }
    
    card.innerHTML = `
        <div class="mission-status ${mission.completed ? 'completed' : 'in-progress'}">
            ${mission.completed ? '✓ Tamamlandı' : 'Devam Ediyor'}
        </div>
        
        <div class="mission-header">
            <div class="mission-icon">
                ${this.getMissionIcon(mission.type)}
            </div>
            <h3 class="mission-title">${mission.title}</h3>
        </div>
        
        <p class="mission-description">${mission.description}</p>
        
        <div class="mission-progress">
            <div class="mission-progress-bar">
                <div class="mission-progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="mission-progress-text">
                <span class="mission-progress-current">${progressText}</span>
                <span class="mission-progress-target">${mission.completed ? '🎉' : '📈'}</span>
            </div>
        </div>
        
        <div class="mission-reward">
            <span class="mission-reward-text">Ödül:</span>
            <span class="mission-reward-amount">+${mission.reward.hasene} Hasene</span>
        </div>
    `;
    
    return card;
};

ArabicLearningGame.prototype.getMissionIcon = function(type) {
    const icons = {
        questions: '❓',
        correct: '✅',
        accuracy: '🎯',
        perfect: '⭐',
        time: '⏰',
        modes: '🎮',
        ayets: '📖',
        streak: '🔥',
        master: '👑'
    };
    
    return icons[type] || '🎯';
};

// Update daily progress in game actions
ArabicLearningGame.prototype.trackDailyProgress = function() {
    // This should be called from various game actions
    // Already implemented in updateDailyProgress method
};

// ===== 📱 UX & MOBILE OPTIMIZATION FEATURES =====

// 🔗 Share Achievement Feature
ArabicLearningGame.prototype.shareAchievement = function(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return;
    
    const shareData = {
        title: `🏆 ${achievement.title} - HASENE Arabic Game`,
        text: `Az önce "${achievement.title}" başarımını kazandım! 🎉\n\n${achievement.description}\n\nSen de Arapça öğrenmeye başla! 📚`,
        url: window.location.href
    };
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                this.showNotification('Başarım paylaşıldı! 🎉', 'success');
                this.addHasene(5); // Bonus for sharing
            })
            .catch((error) => {
                
                this.fallbackShare(shareData);
            });
    } else {
        this.fallbackShare(shareData);
    }
};

// 📋 Fallback Share Method
ArabicLearningGame.prototype.fallbackShare = function(shareData) {
    // Create share text for clipboard
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    
    // Try clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText)
            .then(() => {
                this.showNotification('Başarım metni panoya kopyalandı! 📋', 'success');
            })
            .catch(() => {
                this.showShareModal(shareText);
            });
    } else {
        this.showShareModal(shareText);
    }
};

// 📱 Share Modal
ArabicLearningGame.prototype.showShareModal = function(shareText) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🔗 Başarımı Paylaş</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Başarımını paylaşmak için aşağıdaki metni kopyala:</p>
                <textarea readonly class="share-textarea">${shareText}</textarea>
                <div class="share-buttons">
                    <button class="btn copy-btn" onclick="this.previousElementSibling.select(); document.execCommand('copy'); this.textContent='Kopyalandı!'">
                        📋 Kopyala
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto select text
    setTimeout(() => {
        const textarea = modal.querySelector('.share-textarea');
        textarea.select();
    }, 100);
};

// 🔔 Enhanced Notification System
ArabicLearningGame.prototype.showNotification = function(message, type = 'info', duration = 4000) {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const notificationId = 'notif-' + Date.now();
    notification.innerHTML = `
        <div class="notification-header">
            <h4 class="notification-title">${this.getNotificationTitle(type)}</h4>
            <button class="notification-close" onclick="this.closest('.notification').remove()">×</button>
        </div>
        <div class="notification-content">${message}</div>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 400);
    }, duration);
    
    return notification;
};

// 🎯 Get Notification Title
ArabicLearningGame.prototype.getNotificationTitle = function(type) {
    const titles = {
        success: '🎉 Başarılı',
        warning: '⚠️ Uyarı', 
        error: '❌ Hata',
        info: '💡 Bilgi',
        achievement: '🏆 Başarım'
    };
    return titles[type] || '📢 Bildirim';
};

// 📱 Mobile Touch Optimization
ArabicLearningGame.prototype.initializeMobileOptimization = function() {
    // Prevent zoom on double tap for game elements
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.game-content') || e.target.closest('.modal-content')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, .achievement-btn, .mission-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Improve scroll behavior
    const scrollableElements = document.querySelectorAll('.achievements-list, .daily-missions-list, .modal-content');
    scrollableElements.forEach(element => {
        element.style.webkitOverflowScrolling = 'touch';
    });
    
    // 📱 Initialize mobile-friendly achievement rarity tabs
    initializeMobileRarityTabs();
    
    // 📅 Initialize mobile-friendly calendar navigation
    initializeMobileCalendarNav();
    
    // 📝 Initialize mobile-friendly missions modal
    initializeMobileMissionsModal();
    
    // 🏆 Initialize mobile-friendly achievements modal
    initializeMobileAchievementsModal();
    
    // 📱 Initialize ALL modal touch events for Samsung M33
    initializeAllModalTouchEvents();
    
    // ❌ Initialize ALL close button touch events for Samsung M33
    initializeAllCloseButtonTouchEvents();
    
    // 🎮 Initialize ALL game mode button touch events for Samsung M33
    initializeGameModeButtonTouchEvents();
};

// 🔄 Loading State Management
ArabicLearningGame.prototype.showLoadingState = function(container, message = 'Yükleniyor...') {
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
};

// ⚡ Performance Optimization
ArabicLearningGame.prototype.optimizePerformance = function() {
    // Debounce frequent operations
    this.debouncedSave = this.debounce(() => {
        this.saveGameData();
    }, 1000);
    
    // Lazy load achievement calculations
    this.lazyCheckAchievements = this.debounce(() => {
        this.checkAchievements();
    }, 500);
    
    // Optimize DOM queries
    this.cachedElements = {
        haseneDisplay: document.querySelector('.hasene-display'),
        streakDisplay: document.querySelector('.streak-display'),
        achievementsList: document.querySelector('.achievements-list'),
        missionsList: document.querySelector('.daily-missions-list')
    };
    
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
    
    // Setup memory management
    this.setupMemoryManagement();
    
    // Optimize animations
    this.optimizeAnimations();
};

// 📊 Performance Monitoring
ArabicLearningGame.prototype.initPerformanceMonitoring = function() {
    this.performanceMetrics = {
        gameLoads: 0,
        questionsAnswered: 0,
        achievementsUnlocked: 0,
        averageResponseTime: 0,
        memoryUsage: 0
    };
    
    // Track game performance
    setInterval(() => {
        if (performance.memory) {
            this.performanceMetrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
        
        // Auto-cleanup if memory usage is high
        if (this.performanceMetrics.memoryUsage > 100) {
            this.performMemoryCleanup();
        }
    }, 30000); // Check every 30 seconds
};

// 🧹 Memory Management
ArabicLearningGame.prototype.setupMemoryManagement = function() {
    // Clean up old notifications
    setInterval(() => {
        const notifications = document.querySelectorAll('.notification:not(.show)');
        notifications.forEach(notif => {
            if (notif.parentElement) {
                notif.remove();
            }
        });
    }, 60000); // Every minute
    
    // Clean up particle systems
    this.cleanupParticles = this.debounce(() => {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            if (particle.offsetParent === null) {
                particle.remove();
            }
        });
    }, 5000);
};

// 🎬 Animation Optimization
ArabicLearningGame.prototype.optimizeAnimations = function() {
    // Use requestAnimationFrame for smooth animations
    this.animationFrame = null;
    
    // Reduce animations on low-end devices
    const isLowEnd = navigator.hardwareConcurrency < 4 || 
                     (performance.memory && performance.memory.jsHeapSizeLimit < 1000000000);
    
    if (isLowEnd) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--particle-count', '5');
    }
};

// 🧼 Memory Cleanup
ArabicLearningGame.prototype.performMemoryCleanup = function() {
    
    
    // Clear cached DOM elements that might be stale
    this.cachedElements = {};
    
    // Clear old achievement animations
    document.querySelectorAll('.achievement-unlock-overlay').forEach(overlay => {
        if (overlay.parentElement) {
            overlay.remove();
        }
    });
    
    // Clear old particles
    document.querySelectorAll('.particle').forEach(particle => {
        if (particle.parentElement) {
            particle.remove();
        }
    });
    
    // Force garbage collection if available
    if (window.gc) {
        window.gc();
    }
    
    
};

// 📦 Data Compression for Storage
ArabicLearningGame.prototype.compressGameData = function() {
    const gameData = {
        hasene: this.hasene,
        streak: this.currentStreak,
        achievements: Object.keys(this.achievements).filter(id => this.achievements[id].unlocked),
        stats: this.stats,
        lastSave: Date.now()
    };
    
    return JSON.stringify(gameData);
};

// 📈 Performance Report
ArabicLearningGame.prototype.getPerformanceReport = function() {
    return {
        metrics: this.performanceMetrics,
        memory: performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
        } : 'Not available',
        timing: performance.timing ? {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart + ' ms',
            domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart + ' ms'
        } : 'Not available'
    };
};

// 🔧 Utility: Debounce Function
ArabicLearningGame.prototype.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// 🎨 Add Share Buttons to Achievements
ArabicLearningGame.prototype.addShareButtonsToAchievements = function() {
    const achievementItems = document.querySelectorAll('.achievement-item.unlocked');
    achievementItems.forEach(item => {
        const achievementId = item.dataset.achievementId;
        if (achievementId && !item.querySelector('.share-achievement-btn')) {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-achievement-btn';
            shareBtn.innerHTML = '🔗 Paylaş';
            shareBtn.onclick = (e) => {
                e.stopPropagation();
                this.shareAchievement(achievementId);
            };
            
            item.querySelector('.achievement-info').appendChild(shareBtn);
        }
    });
};

// ===== 🎵 SOUND SETTINGS FUNCTIONS =====

// 🎛️ Show Sound Settings Modal
function showSoundSettings() {
    const modal = document.getElementById('soundSettingsModal');
    modal.style.display = 'flex';
    
    // Initialize current settings
    const masterVolume = (window.audioGenerator?.getMasterVolume() || 0.7) * 100;
    const musicEnabled = window.audioGenerator?.isMusicEnabled() ?? true;
    
    document.getElementById('masterVolumeSlider').value = masterVolume;
    document.getElementById('masterVolumeValue').textContent = Math.round(masterVolume) + '%';
    document.getElementById('backgroundMusicToggle').checked = musicEnabled;
    document.getElementById('musicOptions').style.display = musicEnabled ? 'block' : 'none';
    
    // Load other settings from localStorage
    const soundEffectsEnabled = localStorage.getItem('hasene_sound_effects') !== 'false';
    const achievementSoundsEnabled = localStorage.getItem('hasene_achievement_sounds') !== 'false';
    
    document.getElementById('soundEffectsToggle').checked = soundEffectsEnabled;
    document.getElementById('achievementSoundsToggle').checked = achievementSoundsEnabled;
}

// ❌ Close Sound Settings Modal
function closeSoundSettings() {
    document.getElementById('soundSettingsModal').style.display = 'none';
}

// ===== 🏆 MODERN ACHIEVEMENT MODAL FUNCTIONS =====

// 🔍 Filter By Rarity (Global Function)
function filterByRarity(rarity) {
    
    if (window.game) {
        window.game.filterAchievements(rarity);
        
        // 📱 Mobile: Update active tab visual state
        const tabs = document.querySelectorAll('.rarity-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.rarity === rarity) {
                tab.classList.add('active');
            }
        });
    }
}

// 📱 Mobile Touch Event Initialization
function initializeMobileRarityTabs() {
    const tabs = document.querySelectorAll('.rarity-tab');
    tabs.forEach(tab => {
        // Touch events for mobile
        tab.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const rarity = this.dataset.rarity;
            filterByRarity(rarity);
        }, { passive: false });
        
        // Click events for desktop fallback
        tab.addEventListener('click', function(e) {
            const rarity = this.dataset.rarity;
            filterByRarity(rarity);
        });
        
        // Visual feedback
        tab.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        tab.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// 📅 Samsung M33 Calendar Navigation Touch Events
function initializeMobileCalendarNav() {
    const navButtons = document.querySelectorAll('.calendar-nav');
    navButtons.forEach(button => {
        // Touch events for mobile
        button.addEventListener('touchstart', function(e) {
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            this.style.background = 'var(--primary-blue)';
            this.style.color = 'white';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.background = 'none';
                this.style.color = 'var(--text-dark)';
            }, 150);
        });
        
        // Prevent double-tap zoom
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
    });
}

// 📝 Samsung M33 Daily Missions Modal Touch Events
function initializeMobileMissionsModal() {
    const missionsContent = document.querySelector('.missions-content');
    if (missionsContent) {
        // Enhanced touch scrolling for Samsung M33
        missionsContent.style.webkitOverflowScrolling = 'touch';
        
        // Smooth momentum scrolling
        let isScrolling = false;
        missionsContent.addEventListener('touchstart', function() {
            isScrolling = true;
        }, { passive: true });
        
        missionsContent.addEventListener('touchend', function() {
            isScrolling = false;
        }, { passive: true });
        
        
    }
}

// 🏆 Samsung M33 Achievements Modal Touch Events  
function initializeMobileAchievementsModal() {
    const achievementsContainer = document.querySelector('.achievements-container');
    if (achievementsContainer) {
        // Enhanced touch scrolling for Samsung M33
        achievementsContainer.style.webkitOverflowScrolling = 'touch';
        
        // Smooth momentum scrolling with overscroll prevention
        let isScrolling = false;
        achievementsContainer.addEventListener('touchstart', function() {
            isScrolling = true;
        }, { passive: true });
        
        achievementsContainer.addEventListener('touchend', function() {
            isScrolling = false;
        }, { passive: true });
        
        
    }
}

// 📱 Samsung M33 Universal Modal Touch Events - ALL SCROLLABLE AREAS
function initializeAllModalTouchEvents() {
    const scrollableSelectors = [
        '.stats-content',
        '.hadis-content', 
        '.calendar-modal-content',
        '.leaderboard-list',
        '.game-content',
        '.modal-content',
        '.achievements-list',
        '.daily-missions-list'
    ];
    
    scrollableSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                // Enhanced touch scrolling for Samsung M33
                element.style.webkitOverflowScrolling = 'touch';
                element.style.touchAction = 'pan-y';
                element.style.overscrollBehavior = 'contain';
                
                // Smooth momentum scrolling
                let isScrolling = false;
                element.addEventListener('touchstart', function() {
                    isScrolling = true;
                }, { passive: true });
                
                element.addEventListener('touchend', function() {
                    isScrolling = false;
                }, { passive: true });
            }
        });
    });
    
    
}

// ❌ Samsung M33 Universal Close Button Touch Events - ALL X BUTTONS
function initializeAllCloseButtonTouchEvents() {
    const closeButtons = document.querySelectorAll('.close-modal-btn');
    closeButtons.forEach(button => {
        // Touch events for mobile
        button.addEventListener('touchstart', function(e) {
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            this.style.background = 'rgba(255,255,255,0.5)';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.background = 'rgba(255,255,255,0.1)';
            }, 150);
        });
        
        // Prevent double-tap zoom
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
    });
    
    
}

// 🎮 Samsung M33 Game Mode Button Touch Events - ALL GAME BUTTONS
function initializeGameModeButtonTouchEvents() {
    const gameButtons = document.querySelectorAll('.game-mode-btn');
    gameButtons.forEach(button => {
        // Touch events for mobile
        button.addEventListener('touchstart', function(e) {
            // Visual feedback
            this.style.transform = 'scale(0.97)';
            this.style.filter = 'brightness(1.1)';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.filter = 'brightness(1)';
            }, 150);
        });
        
        // Prevent double-tap zoom
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
    });
    
    
}

// 🔊 Update Master Volume
function updateMasterVolume(value) {
    const percentage = Math.round(value);
    document.getElementById('masterVolumeValue').textContent = percentage + '%';
    
    if (window.audioGenerator) {
        window.audioGenerator.setMasterVolume(value / 100);
    }
}

// 🎵 Toggle Background Music
function toggleBackgroundMusic(enabled) {
    document.getElementById('musicOptions').style.display = enabled ? 'block' : 'none';
    
    if (window.audioGenerator) {
        window.audioGenerator.setMusicEnabled(enabled);
        
        if (enabled) {
            const musicType = document.getElementById('musicTypeSelect').value;
            window.audioGenerator.playBackgroundMusic(musicType);
        }
    }
}

// 🎼 Change Music Type
function changeMusicType(type) {
    if (window.audioGenerator && window.audioGenerator.isMusicEnabled()) {
        window.audioGenerator.playBackgroundMusic(type);
    }
}

// 🔔 Toggle Sound Effects
function toggleSoundEffects(enabled) {
    localStorage.setItem('hasene_sound_effects', enabled.toString());
    
    if (window.game) {
        window.game.soundManager.soundEnabled = enabled;
    }
}

// 🏆 Toggle Achievement Sounds
function toggleAchievementSounds(enabled) {
    localStorage.setItem('hasene_achievement_sounds', enabled.toString());
}

// ===== 🎮 SOUND TEST FUNCTIONS =====

// 🧪 Test Sound Effect
function testSoundEffect() {
    if (window.audioGenerator) {
        window.audioGenerator.playCorrectSound();
        game.showNotification('Ses efekti test edildi! 🔊', 'success', 2000);
    }
}

// 🏆 Test Achievement Sound
function testAchievementSound() {
    if (window.audioGenerator) {
        const rarities = ['bronze', 'silver', 'gold', 'diamond'];
        const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
        window.audioGenerator.playRarityAchievementSound(randomRarity);
        game.showNotification(`${randomRarity.toUpperCase()} başarım sesi test edildi! 🎉`, 'achievement', 3000);
    }
}

// 🎵 Test Background Music
function testBackgroundMusic() {
    if (window.audioGenerator) {
        const musicType = document.getElementById('musicTypeSelect').value;
        window.audioGenerator.playBackgroundMusic(musicType);
        game.showNotification(`${musicType} müziği başlatıldı! 🎼`, 'info', 2000);
    }
}

// ===== 🌟 SOCIAL FEATURES =====

// 🏆 Local Leaderboard System
ArabicLearningGame.prototype.initializeLeaderboard = function() {
    this.leaderboardData = JSON.parse(localStorage.getItem('hasene_leaderboard') || '[]');
    
    // Add current player if not exists
    const playerName = localStorage.getItem('hasene_player_name') || 'Sen';
    const existingPlayer = this.leaderboardData.find(p => p.name === playerName);
    
    if (!existingPlayer) {
        this.leaderboardData.push({
            name: playerName,
            hasene: this.hasene,
            streak: this.currentStreak,
            achievements: Object.values(this.achievements).filter(a => a.unlocked).length,
            lastActive: Date.now()
        });
        this.saveLeaderboard();
    }
};

// 💾 Save Leaderboard
ArabicLearningGame.prototype.saveLeaderboard = function() {
    localStorage.setItem('hasene_leaderboard', JSON.stringify(this.leaderboardData));
};

// 📊 Update Player Stats in Leaderboard
ArabicLearningGame.prototype.updateLeaderboardStats = function() {
    const playerName = localStorage.getItem('hasene_player_name') || 'Sen';
    const player = this.leaderboardData.find(p => p.name === playerName);
    
    if (player) {
        player.hasene = this.hasene;
        player.streak = this.currentStreak;
        player.achievements = Object.values(this.achievements).filter(a => a.unlocked).length;
        player.lastActive = Date.now();
        this.saveLeaderboard();
    }
};

// 🎯 Challenge Generator
ArabicLearningGame.prototype.generateDailyChallenge = function() {
    const challenges = [
        {
            id: 'speed_challenge',
            title: '⚡ Hız Yarışması',
            description: '10 soruyu 30 saniyede çöz',
            target: { questions: 10, timeLimit: 30 },
            reward: { hasene: 50, title: 'Hız Şampiyonu' }
        },
        {
            id: 'perfect_challenge',
            title: '💎 Mükemmellik Yarışması', 
            description: '15 soruyu hiç yanlış yapmadan çöz',
            target: { questions: 15, accuracy: 100 },
            reward: { hasene: 75, title: 'Mükemmel Öğrenci' }
        },
        {
            id: 'endurance_challenge',
            title: '🏃 Dayanıklılık Yarışması',
            description: '3 farklı oyun modunda toplam 25 soru çöz',
            target: { modes: 3, totalQuestions: 25 },
            reward: { hasene: 60, title: 'Dayanıklı Öğrenci' }
        }
    ];
    
    const today = new Date().toDateString();
    const lastChallengeDate = localStorage.getItem('hasene_last_challenge_date');
    
    if (lastChallengeDate !== today) {
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        randomChallenge.date = today;
        randomChallenge.progress = 0;
        randomChallenge.completed = false;
        
        localStorage.setItem('hasene_daily_challenge', JSON.stringify(randomChallenge));
        localStorage.setItem('hasene_last_challenge_date', today);
        
        return randomChallenge;
    }
    
    return JSON.parse(localStorage.getItem('hasene_daily_challenge') || '{}');
};

// 🎊 Complete Challenge
ArabicLearningGame.prototype.completeChallenge = function(challengeId) {
    const challenge = JSON.parse(localStorage.getItem('hasene_daily_challenge') || '{}');
    
    if (challenge.id === challengeId && !challenge.completed) {
        challenge.completed = true;
        this.addHasene(challenge.reward.hasene);
        
        // Unlock special title
        this.unlockSpecialTitle(challenge.reward.title);
        
        localStorage.setItem('hasene_daily_challenge', JSON.stringify(challenge));
        
        this.showNotification(`🎉 Günlük yarışma tamamlandı! +${challenge.reward.hasene} Hasene`, 'success', 4000);
        
        if (window.audioGenerator) {
            window.audioGenerator.playDailyMissionComplete();
        }
    }
};

// 🏷️ Special Titles System
ArabicLearningGame.prototype.unlockSpecialTitle = function(title) {
    const specialTitles = JSON.parse(localStorage.getItem('hasene_special_titles') || '[]');
    
    if (!specialTitles.includes(title)) {
        specialTitles.push(title);
        localStorage.setItem('hasene_special_titles', JSON.stringify(specialTitles));
        
        this.showNotification(`🏷️ Yeni unvan kazandın: "${title}"!`, 'achievement', 5000);
    }
};

// 📈 Player Comparison
ArabicLearningGame.prototype.compareWithAverage = function() {
    const allStats = this.leaderboardData;
    
    if (allStats.length < 2) return null;
    
    const avgHasene = allStats.reduce((sum, p) => sum + p.hasene, 0) / allStats.length;
    const avgStreak = allStats.reduce((sum, p) => sum + p.streak, 0) / allStats.length;
    const avgAchievements = allStats.reduce((sum, p) => sum + p.achievements, 0) / allStats.length;
    
    return {
        hasene: {
            current: this.hasene,
            average: Math.round(avgHasene),
            percentile: (allStats.filter(p => p.hasene < this.hasene).length / allStats.length) * 100
        },
        streak: {
            current: this.currentStreak,
            average: Math.round(avgStreak),
            percentile: (allStats.filter(p => p.streak < this.currentStreak).length / allStats.length) * 100
        },
        achievements: {
            current: Object.values(this.achievements).filter(a => a.unlocked).length,
            average: Math.round(avgAchievements),
            percentile: (allStats.filter(p => p.achievements < Object.values(this.achievements).filter(a => a.unlocked).length).length / allStats.length) * 100
        }
    };
};


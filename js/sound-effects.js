// ============================================
// 🔊 Ses Efektleri
// ============================================
// Bu dosya, doğru/yanlış cevap için ses efektleri ekler

(function() {
    'use strict';

    // Ses ayarları (localStorage'da saklanır)
    let soundEnabled = true;
    let soundVolume = 0.7;

    // Ses dosyaları (base64 encoded veya URL)
    // Not: Gerçek ses dosyaları assets/sounds/ klasörüne eklenebilir
    const sounds = {
        correct: null,  // Doğru cevap sesi
        wrong: null,    // Yanlış cevap sesi
        success: null,  // Başarı/rozet sesi
        levelUp: null  // Seviye atlama sesi
    };

    // Ses context (Web Audio API)
    let audioContext = null;

    /**
     * AudioContext'i başlat (kullanıcı etkileşimi gerektirir)
     */
    function initAudioContext() {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('AudioContext desteklenmiyor:', e);
            }
        }
    }

    /**
     * Basit beep sesi oluştur (ses dosyası yoksa)
     * @param {number} frequency - Frekans (Hz)
     * @param {number} duration - Süre (ms)
     * @param {string} type - 'sine', 'square', 'sawtooth', 'triangle'
     */
    function playBeep(frequency, duration, type = 'sine') {
        if (!soundEnabled || !audioContext) return;

        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(soundVolume * 0.3, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.warn('Beep çalınamadı:', e);
        }
    }

    /**
     * Ses dosyası çal
     * @param {string} soundName - Ses adı ('correct', 'wrong', vb.)
     */
    function playSound(soundName) {
        if (!soundEnabled) return;

        // İlk kullanıcı etkileşiminde AudioContext'i başlat
        if (!audioContext) {
            initAudioContext();
        }

        // Ses dosyası varsa çal
        if (sounds[soundName] && sounds[soundName].play) {
            try {
                sounds[soundName].volume = soundVolume;
                sounds[soundName].play().catch(e => {
                    console.warn('Ses çalınamadı:', e);
                });
                return;
            } catch (e) {
                console.warn('Ses çalınamadı:', e);
            }
        }

        // Ses dosyası yoksa beep çal
        switch (soundName) {
            case 'correct':
                playBeep(800, 200, 'sine'); // Yüksek, kısa beep
                break;
            case 'wrong':
                playBeep(300, 300, 'sawtooth'); // Düşük, uzun beep
                break;
            case 'success':
                playBeep(600, 150, 'sine');
                setTimeout(() => playBeep(800, 150, 'sine'), 150);
                break;
            case 'levelUp':
                // Seviye atlama melodisi
                playBeep(523, 150, 'sine'); // C
                setTimeout(() => playBeep(659, 150, 'sine'), 150); // E
                setTimeout(() => playBeep(784, 300, 'sine'), 300); // G
                break;
        }
    }

    /**
     * Ses dosyası yükle
     * @param {string} soundName - Ses adı
     * @param {string} url - Ses dosyası URL'si
     */
    function loadSound(soundName, url) {
        if (!url) return;

        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = soundVolume;

        audio.addEventListener('error', (e) => {
            console.warn(`Ses dosyası yüklenemedi (${soundName}):`, e);
        });

        sounds[soundName] = audio;
    }

    /**
     * Ses ayarlarını yükle
     */
    function loadSoundSettings() {
        try {
            const saved = localStorage.getItem('soundSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                soundEnabled = settings.enabled !== false;
                soundVolume = settings.volume !== undefined ? settings.volume : 0.7;
            }
        } catch (e) {
            console.warn('Ses ayarları yüklenemedi:', e);
        }
    }

    /**
     * Ses ayarlarını kaydet
     */
    function saveSoundSettings() {
        try {
            localStorage.setItem('soundSettings', JSON.stringify({
                enabled: soundEnabled,
                volume: soundVolume
            }));
        } catch (e) {
            console.warn('Ses ayarları kaydedilemedi:', e);
        }
    }

    /**
     * Ses aç/kapat
     */
    function toggleSound() {
        soundEnabled = !soundEnabled;
        saveSoundSettings();
        return soundEnabled;
    }

    /**
     * Ses seviyesini ayarla
     * @param {number} volume - 0-1 arası
     */
    function setSoundVolume(volume) {
        soundVolume = Math.max(0, Math.min(1, volume));
        saveSoundSettings();
        
        // Tüm seslerin volume'unu güncelle
        Object.values(sounds).forEach(sound => {
            if (sound && sound.volume !== undefined) {
                sound.volume = soundVolume;
            }
        });
    }

    // Feedback animasyonları ile entegrasyon
    // Doğru cevap sesi
    const originalAnimateCorrect = window.animateCorrectAnswer;
    if (originalAnimateCorrect) {
        window.animateCorrectAnswer = function(element) {
            originalAnimateCorrect(element);
            playSound('correct');
        };
    } else {
        // Feedback element class değişikliklerini izle
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;
                    if (element.classList.contains('correct') && !element.classList.contains('sound-played')) {
                        playSound('correct');
                        element.classList.add('sound-played');
                        setTimeout(() => element.classList.remove('sound-played'), 1000);
                    } else if (element.classList.contains('wrong') && !element.classList.contains('sound-played')) {
                        playSound('wrong');
                        element.classList.add('sound-played');
                        setTimeout(() => element.classList.remove('sound-played'), 1000);
                    }
                }
            });
        });

        // Tüm feedback elementlerini izle
        function watchFeedbackForSound() {
            const feedbackElements = [
                document.getElementById('feedback'),
                document.getElementById('dinleFeedback'),
                document.getElementById('boslukFeedback')
            ];

            feedbackElements.forEach(element => {
                if (element) {
                    observer.observe(element, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                }
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', watchFeedbackForSound);
        } else {
            watchFeedbackForSound();
        }
    }

    // İlk kullanıcı etkileşiminde AudioContext'i başlat
    document.addEventListener('click', function initOnFirstClick() {
        initAudioContext();
        document.removeEventListener('click', initOnFirstClick);
    }, { once: true });

    // Ayarları yükle
    loadSoundSettings();

    // Global API
    window.playSound = playSound;
    window.toggleSound = toggleSound;
    window.setSoundVolume = setSoundVolume;
    window.loadSound = loadSound;

    // Ayarlar menüsüne ses kontrolü eklenebilir
    // Örnek: <button onclick="toggleSound()">Ses: <span id="soundStatus">Açık</span></button>

})();


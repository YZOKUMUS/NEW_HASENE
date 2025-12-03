/**
 * Oyun Modları Tutorial Sistemi
 * Tüm tutorial'lar sadece bir kez gösterilir (ilk kez herhangi bir oyun modu açıldığında)
 */

const ALL_TUTORIALS_SEEN_KEY = 'hasene_all_game_tutorials_seen';

// Tutorial durumlarını kontrol et
// Artık tüm tutorial'lar için tek bir genel kontrol yapılıyor
function hasSeenTutorial(gameType) {
    try {
        // Genel kontrol: Eğer herhangi bir tutorial görüldüyse, tüm tutorial'lar görüldü sayılır
        const allSeen = localStorage.getItem(ALL_TUTORIALS_SEEN_KEY);
        if (allSeen === '1') {
            return true;
        }
        // Eski sistemle uyumluluk için: Eğer bu spesifik tutorial görüldüyse de true döndür
    const key = `hasene_tutorial_${gameType}`;
    const seen = localStorage.getItem(key);
    return seen === 'true';
    } catch (e) {
        return false;
    }
}

// Tutorial'ı görüldü olarak işaretle
// Herhangi bir tutorial görüldüğünde, tüm tutorial'lar görüldü olarak işaretlenir
function markTutorialAsSeen(gameType) {
    try {
        // Genel key'i set et - artık tüm tutorial'lar görüldü
        localStorage.setItem(ALL_TUTORIALS_SEEN_KEY, '1');
        // Eski sistemle uyumluluk için spesifik key'i de set et
    const key = `hasene_tutorial_${gameType}`;
    localStorage.setItem(key, 'true');
    } catch (e) {
        console.warn('Tutorial kaydı yapılamadı:', e);
    }
}

// Tutorial modal'ını göster
function showGameTutorial(gameType, onComplete) {
    const tutorials = {
        'kelime-cevir': {
            title: '📚 Kelime Çevir',
            slides: [
                {
                    icon: '🔄',
                    title: 'Nasıl Oynanır?',
                    description: 'Arapça kelimenin Türkçe karşılığını seç!'
                },
                {
                    icon: '✅',
                    title: 'Doğru Cevap',
                    description: 'Doğru cevap verdiğinde Hasene kazanırsın ve animasyon görürsün!'
                },
                {
                    icon: '❌',
                    title: 'Yanlış Cevap',
                    description: 'Yanlış cevap verdiğinde puan kaybedersin. Tekrar dene!'
                },
                {
                    icon: '🎯',
                    title: 'Mod Seçimi',
                    description: '4 farklı mod var:\n• 📚 Klasik: Normal oyun\n• ⚡ Hızlı: 30 saniye süre\n• ❤️ 3 Can: 3 hak\n• 🔥 Zorluk: Sadece zor kelimeler'
                },
                {
                    icon: '🔥',
                    title: 'Muvazebet ve Bereketli Hasene',
                    description: 'Her 3 sahih cevapta +5 bereketli Hasene kazanırsın! Muvazebet (peş peşe doğru cevaplar), ilmin kalbe yerleşmesine vesiledir.'
                }
            ]
        },
        'dinle-bul': {
            title: '🎧 Dinle ve Bul',
            slides: [
                {
                    icon: '🎧',
                    title: 'Nasıl Oynanır?',
                    description: 'Arapça kelimeyi dinle ve doğru kelimeyi seç!'
                },
                {
                    icon: '🔊',
                    title: 'Ses Butonu',
                    description: '🔊 butonuna tıklayarak kelimeyi tekrar dinleyebilirsin!'
                },
                {
                    icon: '👂',
                    title: 'Dinleme İpucu',
                    description: 'Dikkatli dinle! Telaffuz çok önemli. Kelimeyi tekrar tekrar dinleyebilirsin.'
                },
                {
                    icon: '✅',
                    title: 'Doğru Cevap',
                    description: 'Doğru kelimeyi seçtiğinde Hasene kazanırsın!'
                },
                {
                    icon: '🎯',
                    title: 'İpucu',
                    description: 'Zorlanırsan kelimeyi birkaç kez dinle ve seçenekleri dikkatlice oku!'
                }
            ]
        },
        'bosluk-doldur': {
            title: '📝 Boşluk Doldur',
            slides: [
                {
                    icon: '📝',
                    title: 'Nasıl Oynanır?',
                    description: 'Ayetteki eksik kelimeyi tamamla!'
                },
                {
                    icon: '📖',
                    title: 'Ayet Okuma',
                    description: 'Ayeti dikkatlice oku ve eksik kelimeyi bul!'
                },
                {
                    icon: '🔤',
                    title: 'Kelime Seçimi',
                    description: 'Seçeneklerden doğru kelimeyi seç ve boşluğa yerleştir!'
                },
                {
                    icon: '✅',
                    title: 'Doğru Cevap',
                    description: 'Doğru kelimeyi seçtiğinde Hasene kazanırsın!'
                },
                {
                    icon: '💡',
                    title: 'İpucu',
                    description: 'Ayetin anlamını düşün ve hangi kelimenin uygun olduğuna karar ver!'
                }
            ]
        },
        'ayet-oku': {
            title: '📖 Ayet Oku',
            slides: [
                {
                    icon: '📖',
                    title: 'Nasıl Kullanılır?',
                    description: 'Kur\'an-ı Kerim ayetlerini oku, dinle ve öğren!'
                },
                {
                    icon: '🔊',
                    title: 'Sesli Okuma',
                    description: '🔊 butonuna tıklayarak ayeti dinleyebilirsin!'
                },
                {
                    icon: '📚',
                    title: 'Meâl',
                    description: 'Her ayetin altında Türkçe meâli bulunur. Okuyarak anlamını öğren!'
                },
                {
                    icon: '➡️',
                    title: 'İlerleme',
                    description: 'Sonraki butonuna tıklayarak bir sonraki ayete geçebilirsin!'
                },
                {
                    icon: '💎',
                    title: 'Öğrenme',
                    description: 'Her ayeti dikkatlice oku ve anlamını idrak et. Bu mod puan kazandırmaz, sadece öğrenme içindir!'
                }
            ]
        },
        'dua-ogren': {
            title: '🤲 Dua Öğren',
            slides: [
                {
                    icon: '🤲',
                    title: 'Nasıl Kullanılır?',
                    description: 'Kur\'an-ı Kerim\'de geçen duaları öğren!'
                },
                {
                    icon: '🔊',
                    title: 'Sesli Okuma',
                    description: '🔊 butonuna tıklayarak duayı dinleyebilirsin!'
                },
                {
                    icon: '📚',
                    title: 'Meâl ve Açıklama',
                    description: 'Her duanın altında Türkçe meâli ve açıklaması bulunur!'
                },
                {
                    icon: '➡️',
                    title: 'İlerleme',
                    description: 'Sonraki butonuna tıklayarak bir sonraki duaya geçebilirsin!'
                },
                {
                    icon: '💎',
                    title: 'Öğrenme',
                    description: 'Duaları ezberle ve günlük hayatında kullan. Bu mod puan kazandırmaz, sadece öğrenme içindir!'
                }
            ]
        },
        'hadis-oku': {
            title: '📜 Hadis Oku',
            slides: [
                {
                    icon: '📜',
                    title: 'Nasıl Kullanılır?',
                    description: 'Hadis-i şerifleri oku ve istifade et!'
                },
                {
                    icon: '📚',
                    title: 'Hadis Okuma',
                    description: 'Her hadisin Arapça metni ve Türkçe çevirisi bulunur!'
                },
                {
                    icon: '📖',
                    title: 'Kaynak',
                    description: 'Her hadisin altında kaynağı (Buhari, Müslim vb.) gösterilir!'
                },
                {
                    icon: '➡️',
                    title: 'İlerleme',
                    description: 'Sonraki butonuna tıklayarak bir sonraki hadise geçebilirsin!'
                },
                {
                    icon: '💎',
                    title: 'Öğrenme',
                    description: 'Hadisleri okuyarak İslami bilgini artır. Bu mod puan kazandırmaz, sadece öğrenme içindir!'
                }
            ]
        }
    };

    const tutorial = tutorials[gameType];
    if (!tutorial) {
        // Tutorial yoksa direkt devam et
        if (onComplete) onComplete();
        return;
    }

    // Eğer daha önce herhangi bir tutorial görüldüyse direkt devam et
    // Artık tüm tutorial'lar için tek bir genel kontrol yapılıyor
    if (hasSeenTutorial(gameType)) {
        if (onComplete) onComplete();
        return;
    }

    // Tutorial modal'ını oluştur
    const modal = document.createElement('div');
    modal.className = 'modal game-tutorial-modal';
    modal.id = 'gameTutorialModal';
    modal.style.display = 'flex';
    modal.style.zIndex = '10000';

    let currentSlide = 0;

    const updateSlide = () => {
        const slide = tutorial.slides[currentSlide];
        slideContent.innerHTML = `
            <div class="tutorial-slide-icon">${slide.icon}</div>
            <h2 class="tutorial-slide-title">${slide.title}</h2>
            <p class="tutorial-slide-description">${slide.description.replace(/\n/g, '<br>')}</p>
        `;
        
        progressBar.style.width = `${((currentSlide + 1) / tutorial.slides.length) * 100}%`;
        progressText.textContent = `${currentSlide + 1} / ${tutorial.slides.length}`;
        
        prevBtn.style.display = currentSlide === 0 ? 'none' : 'block';
        nextBtn.textContent = currentSlide === tutorial.slides.length - 1 ? 'Başla! 🚀' : 'İleri →';
    };

    modal.innerHTML = `
        <div class="game-tutorial-container">
            <div class="tutorial-header">
                <h2 class="tutorial-title">${tutorial.title}</h2>
                <button class="tutorial-close-btn" id="tutorialCloseBtn" onclick="event.stopPropagation(); closeGameTutorial();">✕</button>
            </div>
            <div class="tutorial-progress">
                <div class="tutorial-progress-bar" id="tutorialProgressBar"></div>
                <div class="tutorial-progress-text" id="tutorialProgressText">1 / ${tutorial.slides.length}</div>
            </div>
            <div class="tutorial-slide-content" id="tutorialSlideContent"></div>
            <div class="tutorial-buttons">
                <button class="tutorial-btn tutorial-prev-btn" id="tutorialPrevBtn" onclick="event.stopPropagation(); prevTutorialSlide();" style="display: none;">← Geri</button>
                <button class="tutorial-btn tutorial-skip-btn" id="tutorialSkipBtn" onclick="event.stopPropagation(); skipGameTutorial();">Atla</button>
                <button class="tutorial-btn tutorial-next-btn" id="tutorialNextBtn" onclick="event.stopPropagation(); nextTutorialSlide();">İleri →</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const slideContent = document.getElementById('tutorialSlideContent');
    const progressBar = document.getElementById('tutorialProgressBar');
    const progressText = document.getElementById('tutorialProgressText');
    const prevBtn = document.getElementById('tutorialPrevBtn');
    const nextBtn = document.getElementById('tutorialNextBtn');

    // Global fonksiyonlar
    window.nextTutorialSlide = () => {
        if (currentSlide < tutorial.slides.length - 1) {
            currentSlide++;
            updateSlide();
        } else {
            // Son slide'da "Başla!" butonuna tıklandı
            markTutorialAsSeen(gameType);
            closeGameTutorial();
            if (onComplete) onComplete();
        }
    };

    window.prevTutorialSlide = () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    };

    window.skipGameTutorial = () => {
        markTutorialAsSeen(gameType);
        closeGameTutorial();
        if (onComplete) onComplete();
    };

    window.closeGameTutorial = () => {
        const modal = document.getElementById('gameTutorialModal');
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
        // Global fonksiyonları temizle
        delete window.nextTutorialSlide;
        delete window.prevTutorialSlide;
        delete window.skipGameTutorial;
        delete window.closeGameTutorial;
    };

    // Modal dışına tıklanınca kapatma (opsiyonel - kullanıcı deneyimi için)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // Modal dışına tıklanınca kapatma - kullanıcı deneyimi için kapalı
            // skipGameTutorial();
        }
    });

    // İlk slide'ı göster
    updateSlide();

    // Ses efekti (opsiyonel)
    if (typeof playSound === 'function') {
        playSound('achievement');
    }
}


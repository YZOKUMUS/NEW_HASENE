// ============ KELİME FAVORİLERİ VE TEKRAR SİSTEMİ ============

// Favoriler listesi (wordId array)
let favoriteWords = [];

// Tekrar listesi (zayıf kelimeler - wordId array)
let reviewWords = [];

// Global olarak erişilebilir yap
if (typeof window !== 'undefined') {
    window.reviewWords = reviewWords;
}

// ============ FAVORİLER YÖNETİMİ ============

// Favorileri yükle
function loadFavorites() {
    try {
        const saved = secureGetItem('hasene_favorites');
        if (saved && Array.isArray(saved)) {
            favoriteWords = saved;
        } else {
            favoriteWords = [];
        }
        return favoriteWords;
    } catch (error) {
        log.error('Favoriler yükleme hatası:', error);
        favoriteWords = [];
        return [];
    }
}

// Favorileri kaydet
function saveFavorites() {
    try {
        secureSetItem('hasene_favorites', favoriteWords);
        return true;
    } catch (error) {
        log.error('Favoriler kaydetme hatası:', error);
        return false;
    }
}

// Kelimeyi favorilere ekle/çıkar
function toggleFavorite(wordId) {
    if (!wordId) return false;
    
    const index = favoriteWords.indexOf(wordId);
    if (index > -1) {
        // Favorilerden çıkar
        favoriteWords.splice(index, 1);
        saveFavorites();
        return false; // Artık favori değil
    } else {
        // Favorilere ekle
        favoriteWords.push(wordId);
        saveFavorites();
        return true; // Artık favori
    }
}

// Kelime favori mi kontrol et
function isFavorite(wordId) {
    return favoriteWords.includes(wordId);
}

// Favori kelimeleri getir
function getFavoriteWords() {
    return favoriteWords.map(wordId => {
        // kelimeBulData'dan kelimeyi bul
        if (typeof kelimeBulData !== 'undefined' && kelimeBulData && Array.isArray(kelimeBulData)) {
            return kelimeBulData.find(w => w.id === wordId);
        }
        return null;
    }).filter(w => w !== null);
}

// ============ TEKRAR SİSTEMİ (ZAYIF KELİMELER) ============

// Tekrar listesini yükle
function loadReviewWords() {
    try {
        const wordStats = loadWordStats();
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        reviewWords = [];
        
        // Zayıf kelimeleri belirle
        Object.keys(wordStats).forEach(wordId => {
            const stats = wordStats[wordId];
            
            // Tekrar gerektiren kriterler:
            // 1. Başarı oranı < 60%
            // 2. Ustalık seviyesi < 2.0
            // 3. Son görülme > 3 gün önce
            // 4. Toplam deneme < 5 (yeterince pratik yapılmamış)
            
            const daysSinceLastSeen = (now - stats.lastSeen) / oneDay;
            const needsReview = 
                stats.successRate < 0.6 || 
                stats.masteryLevel < 2.0 || 
                daysSinceLastSeen > 3 ||
                (stats.correct + stats.wrong) < 5;
            
            if (needsReview) {
                reviewWords.push(wordId);
            }
        });
        
        // Önceliğe göre sırala (en zayıf olanlar önce)
        reviewWords.sort((a, b) => {
            const statsA = wordStats[a];
            const statsB = wordStats[b];
            
            // Öncelik puanı hesapla
            const priorityA = calculateReviewPriority(statsA, now);
            const priorityB = calculateReviewPriority(statsB, now);
            
            return priorityB - priorityA; // Yüksek öncelik önce
        });
        
        // Global olarak güncelle
        if (typeof window !== 'undefined') {
            window.reviewWords = reviewWords;
        }
        
        return reviewWords;
    } catch (error) {
        log.error('Tekrar listesi yükleme hatası:', error);
        reviewWords = [];
        return [];
    }
}

// Tekrar öncelik puanı hesapla
function calculateReviewPriority(stats, now = Date.now()) {
    if (!stats) return 0;
    
    const oneDay = 24 * 60 * 60 * 1000;
    const daysSinceLastSeen = (now - stats.lastSeen) / oneDay;
    
    let priority = 0;
    
    // Başarı oranı faktörü (düşük = yüksek öncelik)
    priority += (1 - stats.successRate) * 50;
    
    // Ustalık seviyesi faktörü (düşük = yüksek öncelik)
    priority += (5 - stats.masteryLevel) * 10;
    
    // Zaman faktörü (uzun süre görülmemiş = yüksek öncelik)
    if (daysSinceLastSeen > 3) {
        priority += daysSinceLastSeen * 5;
    }
    
    // Deneme sayısı faktörü (az deneme = yüksek öncelik)
    const totalAttempts = stats.correct + stats.wrong;
    if (totalAttempts < 5) {
        priority += (5 - totalAttempts) * 15;
    }
    
    return priority;
}

// Tekrar gereken kelimeleri getir
function getReviewWords() {
    return reviewWords.map(wordId => {
        // kelimeBulData'dan kelimeyi bul
        if (typeof kelimeBulData !== 'undefined' && kelimeBulData && Array.isArray(kelimeBulData)) {
            return kelimeBulData.find(w => w.id === wordId);
        }
        return null;
    }).filter(w => w !== null);
}

// Tekrar listesini güncelle (oyun sonrası)
function updateReviewList() {
    loadReviewWords();
}

// ============ FAVORİLER UI ============

// Favori butonu oluştur
function createFavoriteButton(wordId, isFav = false) {
    const btn = document.createElement('button');
    btn.className = 'favorite-btn';
    btn.setAttribute('data-word-id', wordId);
    btn.setAttribute('aria-label', isFav ? 'Favorilerden çıkar' : 'Favorilere ekle');
    btn.style.cssText = `
        background: ${isFav ? '#ffc107' : 'transparent'};
        border: 2px solid ${isFav ? '#ffc107' : '#ccc'};
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 18px;
        padding: 0;
        margin: 0;
    `;
    btn.innerHTML = isFav ? '⭐' : '☆';
    
    btn.onclick = (e) => {
        e.stopPropagation();
        const newFavState = toggleFavorite(wordId);
        btn.style.background = newFavState ? '#ffc107' : 'transparent';
        btn.style.borderColor = newFavState ? '#ffc107' : '#ccc';
        btn.innerHTML = newFavState ? '⭐' : '☆';
        btn.setAttribute('aria-label', newFavState ? 'Favorilerden çıkar' : 'Favorilere ekle');
        
        // Haptic feedback
        hapticFeedback(newFavState ? 'success' : 'light');
        
        // Başarı mesajı
        if (newFavState) {
            showSuccessMessage('⭐ Favorilere eklendi!');
        }
    };
    
    return btn;
}

// Kelime kartına favori butonu ekle
function addFavoriteButtonToWordCard(cardElement, wordId) {
    if (!cardElement || !wordId) return;
    
    // Zaten favori butonu var mı kontrol et
    if (cardElement.querySelector('.favorite-btn')) {
        return;
    }
    
    const isFav = isFavorite(wordId);
    const favBtn = createFavoriteButton(wordId, isFav);
    
    // Kartın sağ üst köşesine ekle
    cardElement.style.position = 'relative';
    favBtn.style.position = 'absolute';
    favBtn.style.top = '10px';
    favBtn.style.right = '10px';
    favBtn.style.zIndex = '10';
    
    cardElement.appendChild(favBtn);
}

// ============ İLK YÜKLEME ============

// Sayfa yüklendiğinde favorileri yükle
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        loadFavorites();
        loadReviewWords();
    });
}


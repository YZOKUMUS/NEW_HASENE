/**
 * Liderlik Tablosu Sistemi
 * Haftalık/aylık sıralama (şimdilik kullanıcının kendi skorları)
 */

// Haftalık skor kaydet
function saveWeeklyScore(score, date = new Date()) {
    const weekKey = getWeekKey(date);
    const weeklyScores = getWeeklyScores();
    
    if (!weeklyScores[weekKey]) {
        weeklyScores[weekKey] = {
            score: 0,
            startDate: getWeekStart(date).toISOString(),
            endDate: getWeekEnd(date).toISOString()
        };
    }
    
    weeklyScores[weekKey].score += score;
    weeklyScores[weekKey].lastUpdate = new Date().toISOString();
    
    localStorage.setItem('hasene_weeklyScores', JSON.stringify(weeklyScores));
}

// Aylık skor kaydet
function saveMonthlyScore(score, date = new Date()) {
    const monthKey = getMonthKey(date);
    const monthlyScores = getMonthlyScores();
    
    if (!monthlyScores[monthKey]) {
        monthlyScores[monthKey] = {
            score: 0,
            month: date.getMonth() + 1,
            year: date.getFullYear()
        };
    }
    
    monthlyScores[monthKey].score += score;
    monthlyScores[monthKey].lastUpdate = new Date().toISOString();
    
    localStorage.setItem('hasene_monthlyScores', JSON.stringify(monthlyScores));
}

// Haftalık skorları al
function getWeeklyScores() {
    const saved = localStorage.getItem('hasene_weeklyScores');
    return saved ? JSON.parse(saved) : {};
}

// Aylık skorları al
function getMonthlyScores() {
    const saved = localStorage.getItem('hasene_monthlyScores');
    return saved ? JSON.parse(saved) : {};
}

// Hafta anahtarı (YYYY-WW formatı)
function getWeekKey(date) {
    const weekStart = getWeekStart(date);
    const year = weekStart.getFullYear();
    const week = getWeekNumber(weekStart);
    return `${year}-W${week.toString().padStart(2, '0')}`;
}

// Ay anahtarı (YYYY-MM formatı)
function getMonthKey(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
}

// Hafta başlangıcı (Pazartesi)
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi
    return new Date(d.setDate(diff));
}

// Hafta sonu (Pazar)
function getWeekEnd(date) {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return weekEnd;
}

// Hafta numarası
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Liderlik tablosu göster
function showLeaderboard(type = 'weekly') {
    // Önce mevcut modal'ı kaldır (eğer varsa)
    const existingModal = document.getElementById('leaderboardModal');
    if (existingModal) {
        if (existingModal.parentNode) {
            existingModal.parentNode.removeChild(existingModal);
        }
        // Zorla kaldır
        existingModal.remove();
    }
    
    // ESC tuşu event listener'larını temizle
    const escHandlers = document._leaderboardEscHandlers || [];
    escHandlers.forEach(handler => {
        document.removeEventListener('keydown', handler);
    });
    document._leaderboardEscHandlers = [];
    
    const modal = document.createElement('div');
    modal.className = 'modal leaderboard-modal';
    modal.id = 'leaderboardModal';
    modal.style.display = 'flex';
    modal.style.zIndex = '10000';

    const scores = type === 'weekly' ? getWeeklyScores() : getMonthlyScores();
    const sortedScores = Object.entries(scores)
        .map(([key, data]) => ({
            key,
            score: data.score,
            ...data
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // İlk 10

    const currentKey = type === 'weekly' ? getWeekKey(new Date()) : getMonthKey(new Date());
    const currentScore = scores[currentKey] ? scores[currentKey].score : 0;
    const currentRank = sortedScores.findIndex(s => s.key === currentKey) + 1;

    modal.innerHTML = `
        <div class="leaderboard-container" onclick="event.stopPropagation();">
            <div class="leaderboard-header">
                <h2 class="leaderboard-title">${type === 'weekly' ? '📅 Haftalık' : '📆 Aylık'} Liderlik Tablosu</h2>
                <button class="leaderboard-close-btn" id="leaderboardCloseBtn" onclick="event.stopPropagation(); event.preventDefault(); event.stopImmediatePropagation(); if(typeof closeLeaderboard === 'function') { closeLeaderboard(); } return false;" style="cursor: pointer; z-index: 10001; position: relative; touch-action: manipulation; -webkit-tap-highlight-color: transparent; min-width: 44px; min-height: 44px; pointer-events: auto; user-select: none; -webkit-user-select: none;">✕</button>
            </div>
            <div class="leaderboard-tabs">
                <button class="leaderboard-tab ${type === 'weekly' ? 'active' : ''}" onclick="showLeaderboard('weekly')">
                    📅 Haftalık
                </button>
                <button class="leaderboard-tab ${type === 'monthly' ? 'active' : ''}" onclick="showLeaderboard('monthly')">
                    📆 Aylık
                </button>
            </div>
            <div class="leaderboard-current">
                <div class="leaderboard-current-label">Bu ${type === 'weekly' ? 'Hafta' : 'Ay'}</div>
                <div class="leaderboard-current-score">${currentScore.toLocaleString()} Hasene</div>
                <div class="leaderboard-current-rank">Sıralama: ${currentRank > 0 ? `#${currentRank}` : 'Henüz sıralamada değil'}</div>
            </div>
            <div class="leaderboard-list" id="leaderboardList">
                ${sortedScores.length > 0 ? sortedScores.map((item, index) => `
                    <div class="leaderboard-item ${item.key === currentKey ? 'current' : ''}">
                        <div class="leaderboard-rank">#${index + 1}</div>
                        <div class="leaderboard-info">
                            <div class="leaderboard-period">${formatPeriod(item.key, type)}</div>
                            <div class="leaderboard-score">${item.score.toLocaleString()} Hasene</div>
                        </div>
                        ${item.key === currentKey ? '<div class="leaderboard-badge">Şu An</div>' : ''}
                    </div>
                `).join('') : '<div class="leaderboard-empty">Henüz skor yok</div>'}
            </div>
            <div class="leaderboard-footer">
                <p class="leaderboard-note">💡 Not: Bu tablo sadece sizin skorlarınızı gösterir. Gerçek bir liderlik tablosu için backend gerekir.</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close butonuna event listener ekle - requestAnimationFrame ile (DOM hazır olur)
    requestAnimationFrame(() => {
        const closeBtn = document.getElementById('leaderboardCloseBtn');
        if (closeBtn) {
            // Close fonksiyonunu direkt çağır (en güvenilir yöntem)
            const handleClose = (e) => {
                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                closeLeaderboard();
                return false;
            };
            
            // Önce tüm event listener'ları temizle (clone ile)
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            // Yeni event listener ekle (click) - hem capture hem bubble phase'de
            newCloseBtn.addEventListener('click', handleClose, { capture: true, once: false, passive: false });
            newCloseBtn.addEventListener('click', handleClose, { capture: false, once: false, passive: false });
            
            // Touch event için de ekle (mobil cihazlar için)
            newCloseBtn.addEventListener('touchend', handleClose, { capture: true, once: false, passive: false });
            newCloseBtn.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                e.preventDefault();
            }, { capture: true, once: false, passive: false });
            
            // Mouse event için de ekle
            newCloseBtn.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.preventDefault();
            }, { capture: true, once: false, passive: false });
            
            // Onclick attribute'u da ekle (güvenlik için - direkt fonksiyon çağrısı)
            newCloseBtn.setAttribute('onclick', 'event.stopPropagation(); event.preventDefault(); event.stopImmediatePropagation(); if(typeof closeLeaderboard === "function") { closeLeaderboard(); } return false;');
            
            // Global erişim için window'a ekle
            window._leaderboardCloseHandler = handleClose;
            window._leaderboardCloseBtn = newCloseBtn;
            
            console.log('✅ Close butonu event listener\'ları eklendi (type:', type, ')');
        } else {
            console.error('❌ Close butonu bulunamadı!');
        }
    });

    // Modal dışına tıklanınca kapat
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLeaderboard();
        }
    });

    // ESC tuşu ile kapat
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeLeaderboard();
            document.removeEventListener('keydown', escHandler);
            // Handler listesinden kaldır
            if (document._leaderboardEscHandlers) {
                const index = document._leaderboardEscHandlers.indexOf(escHandler);
                if (index > -1) {
                    document._leaderboardEscHandlers.splice(index, 1);
                }
            }
        }
    };
    document.addEventListener('keydown', escHandler);
    // Handler'ı listeye ekle
    if (!document._leaderboardEscHandlers) {
        document._leaderboardEscHandlers = [];
    }
    document._leaderboardEscHandlers.push(escHandler);
}

// Global kapatma fonksiyonu (her zaman mevcut olmalı)
function closeLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    if (modal) {
        // Hemen gizle
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        
        // Zorla kaldır
        setTimeout(() => {
            try {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            } catch(e) {
                // Zaten kaldırılmış olabilir
                console.log('Modal zaten kaldırılmış');
            }
            // Zorla kaldır (eğer hala DOM'da varsa)
            if (document.body.contains(modal)) {
                try {
                    document.body.removeChild(modal);
                } catch(e) {
                    console.log('Modal kaldırma hatası (kritik değil):', e);
                }
            }
        }, 50); // Daha hızlı kaldır
    }
    
    // ESC handler'ları temizle
    if (document._leaderboardEscHandlers) {
        document._leaderboardEscHandlers.forEach(handler => {
            document.removeEventListener('keydown', handler);
        });
        document._leaderboardEscHandlers = [];
    }
}

// Dönem formatla
function formatPeriod(key, type) {
    if (type === 'weekly') {
        const [year, week] = key.split('-W');
        return `${week}. Hafta ${year}`;
    } else {
        const [year, month] = key.split('-');
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
}

// Skor güncelle (oyun sonunda çağrılır)
function updateLeaderboardScores(score) {
    saveWeeklyScore(score);
    saveMonthlyScore(score);
}

// Global fonksiyonlar
window.showLeaderboard = showLeaderboard;
window.closeLeaderboard = closeLeaderboard;
window.updateLeaderboardScores = updateLeaderboardScores;


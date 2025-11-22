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
        <div class="leaderboard-container">
            <div class="leaderboard-header">
                <h2 class="leaderboard-title">${type === 'weekly' ? '📅 Haftalık' : '📆 Aylık'} Liderlik Tablosu</h2>
                <button class="leaderboard-close-btn" onclick="closeLeaderboard()">✕</button>
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

    // Modal dışına tıklanınca kapat
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLeaderboard();
        }
    });

    // Global fonksiyon
    window.closeLeaderboard = () => {
        const modal = document.getElementById('leaderboardModal');
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
        delete window.closeLeaderboard;
    };
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
window.updateLeaderboardScores = updateLeaderboardScores;


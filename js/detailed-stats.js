/**
 * Detaylı İstatistikler Sistemi
 * Grafikler ve trend analizi
 */

// İstatistik verilerini al
function getDetailedStats() {
    const stats = {
        daily: getDailyStats(),
        weekly: getWeeklyStats(),
        monthly: getMonthlyStats(),
        trends: getTrendStats()
    };
    return stats;
}

// Günlük istatistikler
function getDailyStats() {
    const today = new Date().toISOString().split('T')[0];
    const dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
    const dailyCorrect = parseInt(localStorage.getItem('dailyCorrect')) || 0;
    const dailyWrong = parseInt(localStorage.getItem('dailyWrong')) || 0;
    
    return {
        date: today,
        hasene: dailyHasene,
        correct: dailyCorrect,
        wrong: dailyWrong,
        accuracy: dailyCorrect + dailyWrong > 0 ? (dailyCorrect / (dailyCorrect + dailyWrong) * 100).toFixed(1) : 0
    };
}

// Haftalık istatistikler
function getWeeklyStats() {
    const weeklyScores = getWeeklyScores();
    const weekKey = getWeekKey(new Date());
    const weekData = weeklyScores[weekKey] || { score: 0 };
    
    return {
        week: weekKey,
        hasene: weekData.score || 0,
        days: getWeekPlayDays()
    };
}

// Aylık istatistikler
function getMonthlyStats() {
    const monthlyScores = getMonthlyScores();
    const monthKey = getMonthKey(new Date());
    const monthData = monthlyScores[monthKey] || { score: 0 };
    
    return {
        month: monthKey,
        hasene: monthData.score || 0,
        days: getMonthPlayDays()
    };
}

// Trend istatistikleri (son 7 gün)
function getTrendStats() {
    const trends = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Bu günün skorunu al (localStorage'dan)
        const dayKey = `hasene_daily_${dateStr}`;
        const dayData = JSON.parse(localStorage.getItem(dayKey) || '{}');
        
        trends.push({
            date: dateStr,
            hasene: dayData.hasene || 0,
            correct: dayData.correct || 0,
            wrong: dayData.wrong || 0
        });
    }
    
    return trends;
}

// Hafta oynama günleri
function getWeekPlayDays() {
    const streakData = JSON.parse(localStorage.getItem('hasene_streakData') || '{}');
    const playDates = streakData.playDates || [];
    const weekStart = getWeekStart(new Date());
    const weekEnd = getWeekEnd(new Date());
    
    return playDates.filter(date => {
        const playDate = new Date(date);
        return playDate >= weekStart && playDate <= weekEnd;
    }).length;
}

// Ay oynama günleri
function getMonthPlayDays() {
    const streakData = JSON.parse(localStorage.getItem('hasene_streakData') || '{}');
    const playDates = streakData.playDates || [];
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return playDates.filter(date => {
        const playDate = new Date(date);
        return playDate >= monthStart && playDate <= monthEnd;
    }).length;
}

// Detaylı istatistikler modal'ını göster
function showDetailedStats() {
    const stats = getDetailedStats();
    
    const modal = document.createElement('div');
    modal.className = 'modal detailed-stats-modal';
    modal.id = 'detailedStatsModal';
    modal.style.display = 'flex';
    modal.style.zIndex = '10000';

    modal.innerHTML = `
        <div class="detailed-stats-container">
            <div class="detailed-stats-header">
                <h2 class="detailed-stats-title">📊 Detaylı İstatistikler</h2>
                <button class="detailed-stats-close-btn" onclick="closeDetailedStats()">✕</button>
            </div>
            <div class="detailed-stats-content" id="detailedStatsContent">
                ${generateStatsHTML(stats)}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Modal dışına tıklanınca kapat
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDetailedStats();
        }
    });

    // Global fonksiyon
    window.closeDetailedStats = () => {
        const modal = document.getElementById('detailedStatsModal');
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
        delete window.closeDetailedStats;
    };
}

// İstatistik HTML'i oluştur
function generateStatsHTML(stats) {
    const maxHasene = Math.max(...stats.trends.map(t => t.hasene), 1);
    
    return `
        <div class="stats-section">
            <h3 class="stats-section-title">📅 Bugün</h3>
            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-card-label">Hasene</div>
                    <div class="stats-card-value">${stats.daily.hasene.toLocaleString()}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-label">Doğru</div>
                    <div class="stats-card-value">${stats.daily.correct}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-label">Yanlış</div>
                    <div class="stats-card-value">${stats.daily.wrong}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-label">Başarı Oranı</div>
                    <div class="stats-card-value">${stats.daily.accuracy}%</div>
                </div>
            </div>
        </div>
        
        <div class="stats-section">
            <h3 class="stats-section-title">📈 Son 7 Gün Trendi</h3>
            <div class="trend-chart">
                ${stats.trends.map(trend => `
                    <div class="trend-day">
                        <div class="trend-bar-container">
                            <div class="trend-bar" style="height: ${(trend.hasene / maxHasene) * 100}%"></div>
                        </div>
                        <div class="trend-label">${formatDateShort(trend.date)}</div>
                        <div class="trend-value">${trend.hasene}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="stats-section">
            <h3 class="stats-section-title">📊 Haftalık/Aylık Özet</h3>
            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-card-label">Bu Hafta</div>
                    <div class="stats-card-value">${stats.weekly.hasene.toLocaleString()}</div>
                    <div class="stats-card-sub">${stats.weekly.days} gün oynandı</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-label">Bu Ay</div>
                    <div class="stats-card-value">${stats.monthly.hasene.toLocaleString()}</div>
                    <div class="stats-card-sub">${stats.monthly.days} gün oynandı</div>
                </div>
            </div>
        </div>
    `;
}

// Kısa tarih formatı
function formatDateShort(dateStr) {
    // YYYY-MM-DD formatındaki tarih string'ini parse et
    const parts = dateStr.split('-');
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    
    // getDay() Pazar=0, Pazartesi=1, ..., Cumartesi=6 döner
    // Array'de Pazartesi=0, Salı=1, ..., Pazar=6 olacak şekilde ayarla
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const dayIndex = date.getDay();
    // Pazar günü 0, ama array'de 6. index
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return days[adjustedIndex];
}

// Global fonksiyonlar
window.showDetailedStats = showDetailedStats;
window.getDetailedStats = getDetailedStats;


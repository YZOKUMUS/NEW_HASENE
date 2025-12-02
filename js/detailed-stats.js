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
    // getLocalDateString fonksiyonunu kullan (varsa)
    const getLocalDateString = typeof window.getLocalDateString === 'function'
        ? window.getLocalDateString
        : (date = new Date()) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
    
    const today = getLocalDateString();
    
    // Önce tarih bazlı veriden oku (saveDailyStats tarih bazlı kaydediyor, bu yüzden bu daha güvenilir)
    let dailyHasene = 0;
    let dailyCorrect = 0;
    let dailyWrong = 0;
    
    try {
        // storage manager'ı kullan (varsa), yoksa localStorage kullan
        const storage = typeof window.storage !== 'undefined' ? window.storage : {
            get: (key, defaultValue) => {
                try {
                    const value = localStorage.getItem(key);
                    if (value === null) return defaultValue;
                    // JSON parse dene, başarısız olursa direkt değeri döndür
                    try {
                        return JSON.parse(value);
                    } catch {
                        return value;
                    }
                } catch {
                    return defaultValue;
                }
            }
        };
        
        const dayKey = `hasene_daily_${today}`;
        const dayData = storage.get(dayKey);
        
        if (dayData && typeof dayData === 'object') {
            dailyHasene = parseInt(dayData.hasene) || 0;
            dailyCorrect = parseInt(dayData.correct) || 0;
            dailyWrong = parseInt(dayData.wrong) || 0;
        } else {
            // Bilgilendirme için debug seviyesinde log; uyarı göstermeye gerek yok
            if (window && window.DEBUG_DETAILED_STATS) {
                console.info('ℹ️ Tarih bazlı veri bulunamadı (normal durum olabilir):', dayKey);
            }
            
            // Fallback: storage'dan direkt değerleri oku (geriye uyumluluk için)
            dailyHasene = parseInt(storage.get('dailyHasene', '0')) || 0;
            dailyCorrect = parseInt(storage.get('dailyCorrect', '0')) || 0;
            dailyWrong = parseInt(storage.get('dailyWrong', '0')) || 0;
        }
    } catch (e) {
        if (typeof log !== 'undefined') log.error('❌ Tarih bazlı veri okuma hatası:', e);
        
        // Hata durumunda localStorage'dan direkt oku
        try {
            dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
            dailyCorrect = parseInt(localStorage.getItem('dailyCorrect')) || 0;
            dailyWrong = parseInt(localStorage.getItem('dailyWrong')) || 0;
        } catch (err) {
            if (typeof log !== 'undefined') log.error('❌ localStorage okuma hatası:', err);
            dailyHasene = 0;
            dailyCorrect = 0;
            dailyWrong = 0;
        }
    }
    
    const total = dailyCorrect + dailyWrong;
    // Accuracy'yi sayı olarak hesapla (string değil)
    const accuracyValue = total > 0 ? (dailyCorrect / total) * 100 : 0;
    const accuracy = accuracyValue.toFixed(1); // String formatı sadece gösterim için
    
    return {
        date: today,
        hasene: dailyHasene,
        correct: dailyCorrect,
        wrong: dailyWrong,
        accuracy: accuracyValue // Sayı olarak döndür (parseFloat için)
    };
}

// Haftalık istatistikler
function getWeeklyStats() {
    try {
        let totalHasene = 0;
        let daysPlayed = 0;
        
        const weekStart = getWeekStart(new Date());
        const weekEnd = getWeekEnd(new Date());
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const weekEndStr = weekEnd.toISOString().split('T')[0];
        
        // storage manager'ı kullan (varsa), yoksa localStorage kullan
        const storage = typeof window.storage !== 'undefined' ? window.storage : {
            get: (key, defaultValue) => {
                try {
                    const value = localStorage.getItem(key);
                    if (value === null) return defaultValue;
                    // JSON parse dene, başarısız olursa direkt değeri döndür
                    try {
                        return JSON.parse(value);
                    } catch {
                        return value;
                    }
                } catch {
                    return defaultValue;
                }
            }
        };
        
        // Bu haftanın günlerini tara
        const currentDate = new Date(weekStart);
        while (currentDate <= weekEnd) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayKey = `hasene_daily_${dateStr}`;
            
            const dayData = storage.get(dayKey);
            if (dayData && typeof dayData === 'object') {
                const hasene = parseInt(dayData.hasene) || 0;
                if (hasene > 0) {
                    totalHasene += hasene;
                    daysPlayed++;
                }
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        if (typeof log !== 'undefined' && CONFIG && CONFIG.debug) log.debug('📅 Haftalık istatistik:', {
            weekStart: weekStartStr,
            weekEnd: weekEndStr,
            totalHasene: totalHasene,
            daysPlayed: daysPlayed
        });
        
        return {
            week: `${weekStartStr} - ${weekEndStr}`,
            hasene: totalHasene,
            days: daysPlayed
        };
    } catch (error) {
        if (typeof log !== 'undefined') log.error('❌ Haftalık istatistik hatası:', error);
        return {
            week: 'error',
            hasene: 0,
            days: 0
        };
    }
}

// Aylık istatistikler
function getMonthlyStats() {
    try {
        let totalHasene = 0;
        let daysPlayed = 0;
        
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const monthStartStr = monthStart.toISOString().split('T')[0];
        const monthEndStr = monthEnd.toISOString().split('T')[0];
        
        // storage manager'ı kullan (varsa), yoksa localStorage kullan
        const storage = typeof window.storage !== 'undefined' ? window.storage : {
            get: (key, defaultValue) => {
                try {
                    const value = localStorage.getItem(key);
                    if (value === null) return defaultValue;
                    // JSON parse dene, başarısız olursa direkt değeri döndür
                    try {
                        return JSON.parse(value);
                    } catch {
                        return value;
                    }
                } catch {
                    return defaultValue;
                }
            }
        };
        
        // Bu ayın günlerini tara
        const currentDate = new Date(monthStart);
        while (currentDate <= monthEnd) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayKey = `hasene_daily_${dateStr}`;
            
            const dayData = storage.get(dayKey);
            if (dayData && typeof dayData === 'object') {
                const hasene = parseInt(dayData.hasene) || 0;
                if (hasene > 0) {
                    totalHasene += hasene;
                    daysPlayed++;
                }
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        if (typeof log !== 'undefined' && CONFIG && CONFIG.debug) log.debug('📅 Aylık istatistik:', {
            monthStart: monthStartStr,
            monthEnd: monthEndStr,
            totalHasene: totalHasene,
            daysPlayed: daysPlayed
        });
        
        return {
            month: `${today.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}`,
            hasene: totalHasene,
            days: daysPlayed
        };
    } catch (error) {
        if (typeof log !== 'undefined') log.error('❌ Aylık istatistik hatası:', error);
        return {
            month: 'error',
            hasene: 0,
            days: 0
        };
    }
}

// Trend istatistikleri (son 7 gün)
function getTrendStats() {
    const trends = [];
    
    // getLocalDateString fonksiyonunu kullan (varsa)
    const getLocalDateString = typeof window.getLocalDateString === 'function'
        ? window.getLocalDateString
        : (date = new Date()) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
    
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = getLocalDateString(date); // Tutarlı tarih formatı kullan
        
        // Bu günün skorunu al (storage'dan)
        const dayKey = `hasene_daily_${dateStr}`;
        let dayData = {};
        
        try {
            // storage manager'ı kullan (varsa), yoksa localStorage kullan
            const storage = typeof window.storage !== 'undefined' ? window.storage : {
                get: (key, defaultValue) => {
                    try {
                        const value = localStorage.getItem(key);
                        if (value === null) return defaultValue;
                        // JSON parse dene, başarısız olursa direkt değeri döndür
                        try {
                            return JSON.parse(value);
                        } catch {
                            return value;
                        }
                    } catch {
                        return defaultValue;
                    }
                }
            };
            
            const storedData = storage.get(dayKey);
            if (storedData && typeof storedData === 'object') {
                dayData = storedData;
            }
        } catch (e) {
            if (typeof log !== 'undefined') log.error('Trend veri parse hatası:', e, dayKey);
        }
        
        trends.push({
            date: dateStr,
            hasene: parseInt(dayData.hasene) || 0,
            correct: parseInt(dayData.correct) || 0,
            wrong: parseInt(dayData.wrong) || 0
        });
    }
    
    return trends;
}

// ============ HAFTA/AY YARDIMCI FONKSİYONLARI ============
// Haftanın başlangıcı (Pazartesi)
function getWeekStart(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Günün başına ayarla
    const day = d.getDay(); // 0=Pazar, 1=Pazartesi, ..., 6=Cumartesi
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi'ye ayarla
    return new Date(d.setDate(diff));
}

// Haftanın sonu (Pazar)
function getWeekEnd(date) {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999); // Günün sonuna ayarla
    return weekEnd;
}

// Hafta oynama günleri
function getWeekPlayDays() {
    try {
    const streakData = JSON.parse(localStorage.getItem('hasene_streakData') || '{}');
    const playDates = streakData.playDates || [];
        
        if (playDates.length === 0) {
            return 0;
        }
        
    const weekStart = getWeekStart(new Date());
    const weekEnd = getWeekEnd(new Date());
    
        // YYYY-MM-DD formatındaki tarihleri karşılaştır
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const weekEndStr = weekEnd.toISOString().split('T')[0];
        
        const daysPlayed = playDates.filter(dateStr => {
            return dateStr >= weekStartStr && dateStr <= weekEndStr;
    }).length;
        
        if (typeof log !== 'undefined' && CONFIG && CONFIG.debug) log.debug('📅 Haftalık hesaplama:', {
            weekStart: weekStartStr,
            weekEnd: weekEndStr,
            playDates: playDates,
            daysPlayed: daysPlayed
        });
        
        return daysPlayed;
    } catch (error) {
        if (typeof log !== 'undefined') log.error('❌ getWeekPlayDays hatası:', error);
        return 0;
    }
}

// Ay oynama günleri
function getMonthPlayDays() {
    try {
    const streakData = JSON.parse(localStorage.getItem('hasene_streakData') || '{}');
    const playDates = streakData.playDates || [];
        
        if (playDates.length === 0) {
            return 0;
        }
        
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
        // YYYY-MM-DD formatına çevir
        const monthStartStr = monthStart.toISOString().split('T')[0];
        const monthEndStr = monthEnd.toISOString().split('T')[0];
        
        const daysPlayed = playDates.filter(dateStr => {
            return dateStr >= monthStartStr && dateStr <= monthEndStr;
    }).length;
        
        if (typeof log !== 'undefined' && CONFIG && CONFIG.debug) log.debug('📅 Aylık hesaplama:', {
            monthStart: monthStartStr,
            monthEnd: monthEndStr,
            playDates: playDates,
            daysPlayed: daysPlayed
        });
        
        return daysPlayed;
    } catch (error) {
        if (typeof log !== 'undefined') log.error('❌ getMonthPlayDays hatası:', error);
        return 0;
    }
}

// Detaylı istatistikler modal'ını göster
function showDetailedStats() {
    
    try {
        // Önce mevcut detaylı istatistikler modal'ını kapat (eğer varsa)
        const existingModal = document.getElementById('detailedStatsModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Önce istatistikler modal'ını kapat (eğer açıksa)
        if (typeof closeStatsModal === 'function') {
            const statsModal = document.getElementById('statsModal');
            if (statsModal && statsModal.style.display !== 'none' && statsModal.style.display !== '') {
                closeStatsModal();
                // Kısa bir gecikme ile detaylı istatistikleri aç (modal'ın tamamen kapanması için)
                setTimeout(() => {
                    openDetailedStatsModal();
                }, 150);
                return;
            }
        }
        
        // Direkt aç
        openDetailedStatsModal();
    } catch (error) {
        if (typeof log !== 'undefined') log.error('❌ showDetailedStats hatası:', error);
    }
}

// Detaylı istatistikler modal'ını aç
function openDetailedStatsModal() {
    
    try {
        const stats = getDetailedStats();
        
        const modal = document.createElement('div');
        modal.className = 'modal detailed-stats-modal';
        modal.id = 'detailedStatsModal';
        modal.style.display = 'flex';
        modal.style.zIndex = '10001'; // Stats modal'ından daha yüksek
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        modal.innerHTML = `
            <div class="detailed-stats-container" onclick="event.stopPropagation();">
                <div class="detailed-stats-header">
                    <h2 class="detailed-stats-title">📊 Detaylı İstatistikler</h2>
                    <button class="detailed-stats-close-btn" id="detailedStatsCloseBtn" onclick="event.stopPropagation(); event.preventDefault(); closeDetailedStats(); return false;" style="touch-action: manipulation; -webkit-tap-highlight-color: transparent; min-width: 44px; min-height: 44px;">✕</button>
                </div>
                <div class="detailed-stats-content" id="detailedStatsContent">
                    ${generateStatsHTML(stats)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Body scroll'u engelle
        document.body.style.overflow = 'hidden';

        // Modal dışına tıklanınca kapat
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeDetailedStats();
            }
        });

        // Close butonuna event listener ekle (mobil için)
        requestAnimationFrame(() => {
            const closeBtn = document.getElementById('detailedStatsCloseBtn');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    closeDetailedStats();
                    return false;
                }, { capture: true, passive: false });
                closeBtn.addEventListener('touchend', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    closeDetailedStats();
                    return false;
                }, { capture: true, passive: false });
            }
        });

        // Global fonksiyon
        window.closeDetailedStats = () => {
            const modal = document.getElementById('detailedStatsModal');
            if (modal) {
                modal.style.display = 'none';
                // Body scroll'u tekrar aktif et
                document.body.style.overflow = '';
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            }
            delete window.closeDetailedStats;
        };
        
    } catch (error) {
        if (typeof log !== 'undefined') log.error('❌ openDetailedStatsModal hatası:', error);
    }
}

// İstatistik HTML'i oluştur
function generateStatsHTML(stats) {
    
    // Güvenli sayı dönüşümü
    const dailyHasene = parseInt(stats.daily.hasene) || 0;
    const dailyCorrect = parseInt(stats.daily.correct) || 0;
    const dailyWrong = parseInt(stats.daily.wrong) || 0;
    
    // Accuracy'yi hesapla (eğer gelmemişse)
    let dailyAccuracy = parseFloat(stats.daily.accuracy) || 0;
    
    // Eğer accuracy 0 ise ama doğru/yanlış varsa, yeniden hesapla
    if (dailyAccuracy === 0 && (dailyCorrect > 0 || dailyWrong > 0)) {
        const total = dailyCorrect + dailyWrong;
        if (total > 0) {
            dailyAccuracy = (dailyCorrect / total) * 100;
        }
    }
    
    const maxHasene = Math.max(...stats.trends.map(t => parseInt(t.hasene) || 0), 1);
    
    return `
        <div class="stats-section">
            <h3 class="stats-section-title">📅 Bugün</h3>
            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-card-label">Hasene</div>
                    <div class="stats-card-value">${dailyHasene.toLocaleString('tr-TR')}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-label">Doğru</div>
                    <div class="stats-card-value">${dailyCorrect}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-label">Yanlış</div>
                    <div class="stats-card-value">${dailyWrong}</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-label">Başarı Oranı</div>
                    <div class="stats-card-value">${dailyAccuracy.toFixed(1)}%</div>
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


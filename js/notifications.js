/**
 * Bildirimler Sistemi
 * Günlük hatırlatıcı ve streak uyarıları
 */

// Bildirim izni kontrolü
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Bu tarayıcı bildirimleri desteklemiyor');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

// Bildirim göster
function showNotification(title, options = {}) {
    if (!('Notification' in window)) {
        // Fallback: Tarayıcı bildirimleri desteklemiyorsa, in-app bildirim göster
        showInAppNotification(title, options.body || '', options.icon);
        return;
    }

    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            icon: options.icon || 'assets/images/icon-192-v4-RED-MUSHAF.png',
            badge: 'assets/images/icon-192-v4-RED-MUSHAF.png',
            body: options.body || '',
            tag: options.tag || 'hasene-notification',
            requireInteraction: options.requireInteraction || false,
            silent: options.silent || false,
        });

        // Bildirim tıklandığında
        notification.onclick = () => {
            window.focus();
            notification.close();
            if (options.onClick) {
                options.onClick();
            }
        };

        // Bildirim otomatik kapanma
        if (options.duration) {
            setTimeout(() => {
                notification.close();
            }, options.duration);
        } else {
            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    } else {
        // İzin yoksa in-app bildirim göster
        showInAppNotification(title, options.body || '', options.icon);
    }
}

// In-app bildirim göster (tarayıcı bildirimleri yoksa)
function showInAppNotification(title, body, icon) {
    // Mevcut bildirim varsa kaldır
    const existing = document.getElementById('inAppNotification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'inAppNotification';
    notification.className = 'in-app-notification';
    notification.innerHTML = `
        <div class="in-app-notification-content">
            ${icon ? `<img src="${icon}" alt="" class="in-app-notification-icon">` : '<div class="in-app-notification-icon">📢</div>'}
            <div class="in-app-notification-text">
                <div class="in-app-notification-title">${title}</div>
                <div class="in-app-notification-body">${body}</div>
            </div>
            <button class="in-app-notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animasyon
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Otomatik kapanma
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Günlük hatırlatıcı kontrolü
function checkDailyReminder() {
    const settings = getNotificationSettings();
    if (!settings.dailyReminder) {
        return;
    }

    const lastReminder = localStorage.getItem('hasene_lastDailyReminder');
    const now = new Date();
    const today = now.toDateString();

    // Bugün hatırlatıcı gösterildi mi?
    if (lastReminder === today) {
        return;
    }

    // Hatırlatıcı saati kontrol et
    const reminderTime = settings.dailyReminderTime || '09:00';
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    // Şu an hatırlatıcı saatinden sonra mı?
    if (now >= reminderDate) {
        // Günlük vird kontrolü
        const dailyHasene = parseInt(localStorage.getItem('dailyHasene')) || 0;
        const goalHasene = parseInt(localStorage.getItem('dailyGoalHasene')) || 2700;

        if (dailyHasene < goalHasene) {
            const remaining = goalHasene - dailyHasene;
            showNotification('🎯 Günlük Vird Hatırlatıcı', {
                body: `Günlük virdinizi tamamlamak için ${remaining} Hasene daha kazanmalısınız!`,
                icon: 'assets/images/icon-192-v4-RED-MUSHAF.png',
                tag: 'daily-reminder',
                onClick: () => {
                    // Ana sayfaya yönlendir
                    if (typeof showMainMenu === 'function') {
                        showMainMenu();
                    }
                }
            });

            // Bugün hatırlatıcı gösterildi olarak işaretle
            localStorage.setItem('hasene_lastDailyReminder', today);
        }
    }
}

// Streak uyarısı kontrolü
function checkStreakWarning() {
    const settings = getNotificationSettings();
    if (!settings.streakWarning) {
        return;
    }

    const streakData = JSON.parse(localStorage.getItem('hasene_streakData') || '{}');
    const currentStreak = streakData.currentStreak || 0;
    const lastPlayDate = streakData.lastPlayDate;

    if (!lastPlayDate) {
        return;
    }

    const now = new Date();
    const lastDate = new Date(lastPlayDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastPlay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

    // Bugün oynanmış mı?
    if (lastPlay.getTime() === today.getTime()) {
        return;
    }

    // Dün oynanmış mı? (Streak kırılma riski)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastPlay.getTime() === yesterday.getTime()) {
        // Streak kırılma riski var!
        showNotification('🔥 Streak Uyarısı!', {
            body: `${currentStreak} günlük seriniz kırılma riski altında! Bugün oynayarak serinizi koruyun!`,
            icon: 'assets/images/icon-192-v4-RED-MUSHAF.png',
            tag: 'streak-warning',
            requireInteraction: true,
            onClick: () => {
                if (typeof showMainMenu === 'function') {
                    showMainMenu();
                }
            }
        });
    }
}

// Bildirim ayarlarını al
function getNotificationSettings() {
    const defaultSettings = {
        dailyReminder: true,
        dailyReminderTime: '09:00',
        streakWarning: true,
        achievementNotification: true
    };

    const saved = localStorage.getItem('hasene_notificationSettings');
    if (saved) {
        try {
            return { ...defaultSettings, ...JSON.parse(saved) };
        } catch (e) {
            return defaultSettings;
        }
    }

    return defaultSettings;
}

// Bildirim ayarlarını kaydet
function saveNotificationSettings(settings) {
    localStorage.setItem('hasene_notificationSettings', JSON.stringify(settings));
}

// Başarım bildirimi
function showAchievementNotification(achievement) {
    const settings = getNotificationSettings();
    if (!settings.achievementNotification) {
        return;
    }

    showNotification(`🏆 ${achievement.name}`, {
        body: achievement.desc,
        icon: 'assets/images/icon-192-v4-RED-MUSHAF.png',
        tag: `achievement-${achievement.id}`,
        requireInteraction: false
    });
}

// Bildirimleri başlat
function initNotifications() {
    // İzin iste
    requestNotificationPermission();

    // Günlük hatırlatıcı kontrolü (her 1 saatte bir)
    setInterval(() => {
        checkDailyReminder();
    }, 60 * 60 * 1000); // 1 saat

    // Streak uyarısı kontrolü (her 30 dakikada bir)
    setInterval(() => {
        checkStreakWarning();
    }, 30 * 60 * 1000); // 30 dakika

    // İlk kontrol
    setTimeout(() => {
        checkDailyReminder();
        checkStreakWarning();
    }, 5000); // 5 saniye sonra
}

// Sayfa görünürlüğü değiştiğinde kontrol et
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Sayfa görünür olduğunda kontrol et
        checkDailyReminder();
        checkStreakWarning();
    }
});

// Global fonksiyonlar
window.showNotification = showNotification;
window.showInAppNotification = showInAppNotification;
window.getNotificationSettings = getNotificationSettings;
window.saveNotificationSettings = saveNotificationSettings;
window.initNotifications = initNotifications;
window.showAchievementNotification = showAchievementNotification;


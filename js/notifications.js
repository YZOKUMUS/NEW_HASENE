/**
 * Notification hub – consolidates browser notifications, fallback to in-app,
 * and schedules reminders without blocking initial render.
 */
(function initNotificationSystem() {
    const STORAGE_KEYS = ['haseneNotificationSettings', 'hasene_notificationSettings'];
    const DEFAULT_SETTINGS = {
        dailyReminder: true,
        dailyReminderTime: '20:00',
        streakWarning: true,
        goalCompletion: true,
        customEvents: true,
        achievementNotification: true
    };
    const ICON_PATH = 'assets/images/icon-192-v4-RED-MUSHAF.png';

    let notificationSettings = { ...DEFAULT_SETTINGS };
    let notificationPermission = typeof Notification !== 'undefined' ? Notification.permission : 'denied';
    let dailyReminderTimer = null;
    let streakInterval = null;
    let goalInterval = null;
    let initialized = false;

    function logDebug(message, payload) {
        if (typeof log !== 'undefined' && typeof log.debug === 'function') {
            log.debug(message, payload);
        }
    }

    function loadNotificationSettings() {
        notificationSettings = { ...DEFAULT_SETTINGS };

        for (const key of STORAGE_KEYS) {
            try {
                const raw = localStorage.getItem(key);
                if (raw) {
                    notificationSettings = { ...notificationSettings, ...JSON.parse(raw) };
                }
            } catch (error) {
                logDebug(`⚠️ Bildirim ayarları okunamadı (${key})`, error);
            }
        }

        window.notificationSettings = notificationSettings;
        return notificationSettings;
    }

    function persistSettings(settings = notificationSettings) {
        STORAGE_KEYS.forEach((key) => {
            try {
                localStorage.setItem(key, JSON.stringify(settings));
            } catch (error) {
                logDebug(`⚠️ Bildirim ayarları kaydedilemedi (${key})`, error);
            }
        });
    }

    async function requestNotificationPermission() {
        if (!('Notification' in window)) {
            logDebug('🔕 Notification API desteklenmiyor');
            return false;
        }

        if (Notification.permission === 'granted') {
            notificationPermission = 'granted';
            return true;
        }

        if (Notification.permission === 'denied') {
            notificationPermission = 'denied';
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            notificationPermission = permission;
            return permission === 'granted';
        } catch (error) {
            logDebug('⚠️ Bildirim izni istenirken hata oluştu', error);
            notificationPermission = 'denied';
            return false;
        }
    }

    function showInAppNotification(title, body, icon) {
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
                <button class="in-app-notification-close" aria-label="Kapat">&#10005;</button>
            </div>
        `;

        notification.querySelector('.in-app-notification-close').addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        requestAnimationFrame(() => notification.classList.add('show'));

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    async function showNotification(title, options = {}) {
        const payload = {
            body: options.body || '',
            icon: options.icon || ICON_PATH,
            badge: options.badge || ICON_PATH,
            vibrate: options.vibrate || [200, 100, 200],
            tag: options.tag || 'hasene-notification',
            requireInteraction: Boolean(options.requireInteraction),
            data: {
                url: options.url || window.location.href,
                ...options.data
            },
            silent: options.silent || false
        };

        if (!('Notification' in window)) {
            showInAppNotification(title, payload.body, payload.icon);
            return;
        }

        if (Notification.permission !== 'granted') {
            const granted = await requestNotificationPermission();
            if (!granted) {
                showInAppNotification(title, payload.body, payload.icon);
                return;
            }
        }

        try {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(title, payload);
            } else {
                const notification = new Notification(title, payload);
                if (options.onClick) {
                    notification.onclick = () => {
                        window.focus();
                        notification.close();
                        options.onClick();
                    };
                }
                setTimeout(() => notification.close(), options.duration || 5000);
            }
        } catch (error) {
            logDebug('⚠️ Bildirim gösterilemedi, in-app alternatife dönülüyor', error);
            showInAppNotification(title, payload.body, payload.icon);
        }
    }

    function scheduleDailyReminder() {
        if (!notificationSettings.dailyReminder) return;

        if (dailyReminderTimer) {
            clearTimeout(dailyReminderTimer);
        }

        const [hours, minutes] = (notificationSettings.dailyReminderTime || '20:00').split(':').map(Number);
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);

        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const msUntilReminder = reminderTime.getTime() - now.getTime();

        dailyReminderTimer = setTimeout(async () => {
            const today = typeof getLocalDateString === 'function'
                ? getLocalDateString()
                : new Date().toISOString().split('T')[0];
            const lastPlayDate = localStorage.getItem('haseneLastPlayDate');
            const todayStats = (window.dailyTasks && window.dailyTasks.todayStats) || getStoredDailyStats();
            const hasPlayedToday = lastPlayDate === today && todayStats && (todayStats.toplamPuan > 0 || todayStats.kelimeCevir > 0);

            if (!hasPlayedToday) {
                await showNotification('📚 Günlük Hatırlatıcı', {
                    body: 'Bugün henüz oyun oynamadınız! Serinizi bozmamak için hemen başlayın 🔥',
                    tag: 'daily-reminder',
                    requireInteraction: false
                });
            }

            scheduleDailyReminder();
        }, msUntilReminder);

        logDebug('⏰ Günlük hatırlatıcı zamanlandı', { reminderTime });
    }

    function getStoredDailyStats() {
        try {
            const dailyTasksStr = localStorage.getItem('hasene_dailyTasks');
            if (dailyTasksStr) {
                const parsed = JSON.parse(dailyTasksStr);
                return parsed?.todayStats || null;
            }
        } catch (error) {
            logDebug('⚠️ dailyTasks verisi okunamadı', error);
        }
        try {
            return {
                toplamPuan: parseInt(localStorage.getItem('dailyHasene') || '0', 10)
            };
        } catch {
            return null;
        }
    }

    function checkStreakWarning() {
        if (!notificationSettings.streakWarning) return;
        try {
            const streakDataStr = localStorage.getItem('haseneStreakData') || localStorage.getItem('hasene_streakData');
            if (!streakDataStr) return;

            const streakData = JSON.parse(streakDataStr);
            const currentStreak = streakData.currentStreak || 0;
            const lastPlayDate = streakData.lastPlayDate || localStorage.getItem('haseneLastPlayDate');
            if (!lastPlayDate || currentStreak === 0) return;

            const today = typeof getLocalDateString === 'function'
                ? getLocalDateString()
                : new Date().toISOString().split('T')[0];
            if (lastPlayDate === today) return;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = typeof getLocalDateString === 'function'
                ? getLocalDateString(yesterday)
                : yesterday.toISOString().split('T')[0];

            if (lastPlayDate === yesterdayStr) {
                showNotification('⚠️ Seri Bozulma Uyarısı!', {
                    body: `${currentStreak} günlük seriniz bozulmak üzere! Bugün oynayarak koruyun 🔥`,
                    tag: 'streak-warning',
                    requireInteraction: false,
                    vibrate: [300, 100, 300]
                });
            }
        } catch (error) {
            logDebug('⚠️ Streak uyarısı kontrolü başarısız', error);
        }
    }

    function checkGoalCompletion() {
        if (!notificationSettings.goalCompletion) return;
        try {
            const dailyGoalHasene = parseInt(localStorage.getItem('dailyGoalHasene') || '2700', 10);
            const todayStats = (window.dailyTasks && window.dailyTasks.todayStats) || getStoredDailyStats();
            const todayProgress = todayStats?.toplamPuan || 0;

            if (todayProgress >= dailyGoalHasene) {
                const today = typeof getLocalDateString === 'function'
                    ? getLocalDateString()
                    : new Date().toISOString().split('T')[0];
                const goalKey = `goalNotification_${today}`;
                if (!localStorage.getItem(goalKey)) {
                    showNotification('🎉 Günlük Hedef Tamamlandı!', {
                        body: `Tebrikler! Günlük virdinizi tamamladınız (${dailyGoalHasene} puan).`,
                        tag: 'goal-completion',
                        requireInteraction: false,
                        vibrate: [200, 100, 200, 100, 200]
                    });
                    localStorage.setItem(goalKey, 'true');
                }
            }
        } catch (error) {
            logDebug('⚠️ Hedef tamamlanma kontrolü başarısız', error);
        }
    }

    function sendCustomEventNotification(title, body, options = {}) {
        if (!notificationSettings.customEvents) return;
        showNotification(title, {
            body,
            tag: options.tag || 'custom-event',
            requireInteraction: options.requireInteraction || false,
            vibrate: options.vibrate || [200, 100, 200],
            ...options
        });
    }

    function showAchievementNotification(achievement) {
        if (!notificationSettings.achievementNotification) return;
        if (!achievement) return;
        showNotification(`🏆 ${achievement.name}`, {
            body: achievement.desc,
            tag: `achievement-${achievement.id || Date.now()}`,
            requireInteraction: false
        });
    }

    function initNotifications() {
        if (initialized) return;
        initialized = true;

        loadNotificationSettings();
        notificationPermission = typeof Notification !== 'undefined' ? Notification.permission : 'denied';

        requestNotificationPermission().catch(() => {});

        scheduleDailyReminder();

        if (streakInterval) clearInterval(streakInterval);
        streakInterval = setInterval(() => {
            if (document.hidden) return;
            checkStreakWarning();
        }, 30 * 60 * 1000);

        if (goalInterval) clearInterval(goalInterval);
        goalInterval = setInterval(() => {
            if (document.hidden) return;
            checkGoalCompletion();
        }, 5 * 60 * 1000);

        setTimeout(() => {
            checkStreakWarning();
            checkGoalCompletion();
        }, 5000);

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                checkStreakWarning();
                checkGoalCompletion();
            }
        });

        logDebug('🔔 Bildirim sistemi başlatıldı');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNotifications, { once: true });
    } else {
        initNotifications();
    }

    window.requestNotificationPermission = requestNotificationPermission;
    window.showNotification = showNotification;
    window.showInAppNotification = showInAppNotification;
    window.getNotificationSettings = () => ({ ...notificationSettings });
    window.saveNotificationSettings = (settings) => {
        notificationSettings = { ...notificationSettings, ...settings };
        persistSettings(notificationSettings);
        window.notificationSettings = notificationSettings;
        scheduleDailyReminder();
    };
    window.initNotifications = initNotifications;
    window.showAchievementNotification = showAchievementNotification;
    window.sendCustomEventNotification = sendCustomEventNotification;
})();


/**
 * Sosyal Paylaşım Sistemi
 * Başarı paylaşma özelliği
 */

// Web Share API kontrolü
function canShare() {
    return 'share' in navigator;
}

// Başarı paylaş
async function shareAchievement(achievement) {
    const shareData = {
        title: `🏆 ${achievement.name} - Hasene Arapça Dersi`,
        text: `${achievement.desc}\n\nHasene Arapça Dersi ile Arapça öğrenmeye devam ediyorum! 📚`,
        url: window.location.href
    };

    try {
        if (canShare()) {
            await navigator.share(shareData);
        } else {
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            await navigator.clipboard.writeText(text);
            showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Paylaşım hatası:', error);
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            try {
                await navigator.clipboard.writeText(text);
                showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
            } catch (clipboardError) {
                console.error('Panoya kopyalama hatası:', clipboardError);
            }
        }
    }
}

// Skor paylaş
async function shareScore(score, correct, wrong, level) {
    const shareData = {
        title: `🎯 Hasene Arapça Dersi - ${score} Hasene Kazandım!`,
        text: `Bugün ${score} Hasene kazandım! 📚\n✅ Doğru: ${correct}\n❌ Yanlış: ${wrong}\n🏆 Mertebe: ${level}\n\nSen de Arapça öğrenmeye başla!`,
        url: window.location.href
    };

    try {
        if (canShare()) {
            await navigator.share(shareData);
        } else {
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            await navigator.clipboard.writeText(text);
            showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Paylaşım hatası:', error);
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            try {
                await navigator.clipboard.writeText(text);
                showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
            } catch (clipboardError) {
                console.error('Panoya kopyalama hatası:', clipboardError);
            }
        }
    }
}

// Streak paylaş
async function shareStreak(streak) {
    const shareData = {
        title: `🔥 ${streak} Günlük Muvazebet! - Hasene Arapça Dersi`,
        text: `${streak} gün üst üste Arapça öğreniyorum! 🔥\n\nSen de Arapça öğrenmeye başla! 📚`,
        url: window.location.href
    };

    try {
        if (canShare()) {
            await navigator.share(shareData);
        } else {
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            await navigator.clipboard.writeText(text);
            showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Paylaşım hatası:', error);
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            try {
                await navigator.clipboard.writeText(text);
                showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
            } catch (clipboardError) {
                console.error('Panoya kopyalama hatası:', clipboardError);
            }
        }
    }
}

// Rozet paylaş
async function shareBadge(badge) {
    const shareData = {
        title: `🏅 ${badge.name} Rozetini Kazandım! - Hasene Arapça Dersi`,
        text: `${badge.desc}\n\nHasene Arapça Dersi ile Arapça öğrenmeye devam ediyorum! 📚`,
        url: window.location.href
    };

    try {
        if (canShare()) {
            await navigator.share(shareData);
        } else {
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            await navigator.clipboard.writeText(text);
            showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Paylaşım hatası:', error);
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            try {
                await navigator.clipboard.writeText(text);
                showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
            } catch (clipboardError) {
                console.error('Panoya kopyalama hatası:', clipboardError);
            }
        }
    }
}

// Genel paylaşım butonu (ana menüden)
async function shareApp() {
    const totalPoints = parseInt(localStorage.getItem('hasene_totalPoints')) || 0;
    const streakData = JSON.parse(localStorage.getItem('hasene_streakData') || '{}');
    const currentStreak = streakData.currentStreak || 0;
    const level = calculateLevel ? calculateLevel(totalPoints) : 1;

    const shareData = {
        title: '📚 Hasene Arapça Dersi - Kur\'an-ı Kerim Kelimelerini Öğren!',
        text: `Hasene Arapça Dersi ile Arapça öğreniyorum! 📚\n\n🏆 Toplam Hasene: ${totalPoints}\n🔥 Muvazebet: ${currentStreak} gün\n⭐ Mertebe: ${level}\n\nSen de Arapça öğrenmeye başla!`,
        url: window.location.href
    };

    try {
        if (canShare()) {
            await navigator.share(shareData);
        } else {
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            await navigator.clipboard.writeText(text);
            showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Paylaşım hatası:', error);
            // Fallback: Metni panoya kopyala
            const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            try {
                await navigator.clipboard.writeText(text);
                showInAppNotification('📋 Kopyalandı!', 'Paylaşım metni panoya kopyalandı.');
            } catch (clipboardError) {
                console.error('Panoya kopyalama hatası:', clipboardError);
            }
        }
    }
}

// Global fonksiyonlar
window.shareAchievement = shareAchievement;
window.shareScore = shareScore;
window.shareStreak = shareStreak;
window.shareBadge = shareBadge;
window.shareApp = shareApp;
window.canShare = canShare;


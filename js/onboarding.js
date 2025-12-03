// js/onboarding.js

/**
 * Mini Onboarding / Tur Modülü
 * İlk açılışta ana ekranda 3 adımlı kısa bir rehber gösterir.
 */

const ONBOARDING_STORAGE_KEY = 'hasene_onboarding_seen_v2';

const onboardingSteps = [
    {
        id: 'welcome',
        title: '🕌 Hoş Geldin!',
        description:
            'Bu uygulama, Kuran-ı Kerim\'den kelimeleri çalışarak ayetleri daha iyi anlamana yardımcı olmak için hazırlandı.\n\n' +
            'Hedef kitle; Kuran\'ı orijinal dilinden anlamak isteyen **ortaokul son sınıf ve üzeri** gençler, üniversite talebeleri, hafızlık yapanlar, İHL / İlahiyat öğrencileri ve Kur\'an halkalarına devam eden yetişkinlerdir.\n\n' +
            'Uygulama öğretmen veya veli rehberliğiyle daha küçük yaş grupları tarafından da kullanılabilir.\n\n' +
            'Arapça kelimeleri öğrenerek, ayetlerin meâlini daha derinlemesine kavrayabilirsin.\n\n' +
            '💡 Her gün düzenli çalışarak ilerlemeni takip edebilirsin!',
        highlightSelector: '.games-section',
    },
    {
        id: 'games',
        title: '🎮 3 Ana Oyun Modu',
        description:
            'Ana ekranda 3 farklı oyun modu bulunuyor:\n\n' +
            '• 🔤 Kelime Çevir: Arapça kelimenin Türkçe meâlini bul\n' +
            '• 🎵 Dinle ve Bul: Kelimeyi dinle, sahih olanı seç\n' +
            '• 📝 Boşluk Doldur: Ayetteki eksik kelimeyi tamamla\n\n' +
            '💡 Her oyun türünde zorluk seviyesi (Kolay/Orta/Zor) otomatik ayarlanır.',
        highlightSelector: '.games-section',
    },
    {
        id: 'reading',
        title: '📖 Okuma ve Öğrenme Modları',
        description:
            '3 ayrı okuma modu ile bilgini pekiştirebilirsin:\n\n' +
            '• 📖 Ayet Oku: Kuran ayetlerini oku, dinle ve meâlini idrak et\n' +
            '• 🤲 Dua Öğren: Günlük duaları öğren ve ezberle\n' +
            '• 📚 Hadis Oku: Hadis-i şerifleri oku ve istifade et\n\n' +
            '💡 Bu modlarda puan kazanılmaz, sadece günlük görev ilerlemesi sayılır.',
        highlightSelector: '.games-section',
    },
    {
        id: 'gameplay',
        title: '⚙️ Oyun İçi Modlar',
        description:
            'Her oyunda farklı zorluk modları deneyebilirsin:\n\n' +
            '• 📚 Klasik: Normal oyun, ipucu var\n' +
            '• 📖 30.cüz Ayetlerinin Kelimeleri: 78-114. sureler (30.cüz)\n' +
            '• ❤️ 3 Can: 3 hak, yanlış = -1 can\n' +
            '• 🔥 Zorluk: Sadece zor kelimeler\n\n' +
            '💡 İpucu butonunu kullanarak kelimeyi dinleyebilirsin!',
        highlightSelector: '.games-section',
    },
    {
        id: 'stats',
        title: '📊 İstatistikler ve Takip',
        description:
            'İstatistikler panelinden ilerlemeni takip edebilirsin:\n\n' +
            '• Kelime istatistikleri: Hangi kelimeleri öğrendin?\n' +
            '• Performans analizi: Başarı oranın, serilerin\n' +
            '• Öğrenme haritası: Öğrenilmiş, pratik, zorlanılan kelimeler\n\n' +
            '💡 Zorlandığın kelimeler otomatik olarak daha sık sorulur.',
        highlightSelector: '.premium-stats-panel, .stats-row-minimal',
    },
    {
        id: 'calendar',
        title: '📅 Takvim ve Günlük Vazifeler',
        description:
            'Alt menüden tüm özelliklere ulaşabilirsin:\n\n' +
            '• 📅 Takvim: Günlük serini ve oynadığın günleri gör\n' +
            '• 📋 Vazifeler: Günlük ve haftalık görevlerini tamamla\n' +
            '• 📊 İstatistikler: Detaylı performans analizi\n' +
            '• 📚 Kelimeler: Kelime istatistiklerini incele\n\n' +
            '💡 Günlük serini koruyarak bonus kazanabilirsin!',
        highlightSelector: '#bottomNavBar',
    },
];

let currentOnboardingStep = 0;

function getOnboardingModalElements() {
    const modal = document.getElementById('onboardingModal');
    if (!modal) return null;

    return {
        modal,
        titleEl: document.getElementById('onboardingTitle'),
        descEl: document.getElementById('onboardingDescription'),
        stepEl: document.getElementById('onboardingStepIndicator'),
        nextBtn: document.getElementById('onboardingNextBtn'),
        skipBtn: document.getElementById('onboardingSkipBtn'),
    };
}

function setOnboardingSeen() {
    try {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
        // Debug: Kayıt yapıldığını doğrula
        const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (saved !== '1') {
            console.warn('Onboarding kaydı yapılamadı. localStorage değeri:', saved);
        }
    } catch (e) {
        // localStorage erişilemezse sessizce devam et
        console.warn('Onboarding kaydı yapılamadı:', e);
    }
}

function hasSeenOnboarding() {
    try {
        return localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1';
    } catch (e) {
        return false;
    }
}

function updateOnboardingStep() {
    const els = getOnboardingModalElements();
    if (!els) return;

    const step = onboardingSteps[currentOnboardingStep];
    if (!step) return;

    if (els.titleEl) els.titleEl.textContent = step.title;
    if (els.descEl) els.descEl.textContent = step.description;
    if (els.stepEl) {
        els.stepEl.textContent = `${currentOnboardingStep + 1} / ${onboardingSteps.length}`;
    }

    // Basit highlight: ilgili alanı hafifçe kaydır
    if (step.highlightSelector) {
        const target = document.querySelector(step.highlightSelector);
        if (target && typeof target.scrollIntoView === 'function') {
            try {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (e) {
                // Eski tarayıcılar için hata yut
            }
        }
    }
}

function closeOnboardingModal() {
    const els = getOnboardingModalElements();
    if (!els) return;

    els.modal.style.display = 'none';
    document.body.style.overflow = '';
}

function nextOnboardingStep() {
    currentOnboardingStep += 1;
    if (currentOnboardingStep >= onboardingSteps.length) {
        setOnboardingSeen();
        closeOnboardingModal();
        return;
    }
    updateOnboardingStep();
}

function skipOnboarding() {
    setOnboardingSeen();
    closeOnboardingModal();
}

function showOnboarding(force = false) {
    if (!force && hasSeenOnboarding()) return;

    const els = getOnboardingModalElements();
    if (!els) return;

    currentOnboardingStep = 0;
    updateOnboardingStep();
    els.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function initOnboarding() {
    const els = getOnboardingModalElements();
    if (!els) return;

    if (els.nextBtn) {
        els.nextBtn.onclick = () => nextOnboardingStep();
    }
    if (els.skipBtn) {
        els.skipBtn.onclick = () => skipOnboarding();
    }
    // NOT: Artık burada otomatik açmıyoruz.
    // Yükleme ekranı kapandıktan sonra index.html içindeki script
    // window.showOnboarding(false) çağırarak hoş geldin turunu başlatacak.
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        initOnboarding();
    } catch (e) {
        // Onboarding kritik değil, hata olsa bile uygulama çalışmaya devam eder
    }
});

// Manuel tetiklemek istersek global olarak da açılabilir
window.showOnboarding = showOnboarding;
window.initOnboarding = initOnboarding;



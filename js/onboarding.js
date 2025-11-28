// js/onboarding.js

/**
 * Mini Onboarding / Tur Modülü
 * İlk açılışta ana ekranda 3 adımlı kısa bir rehber gösterir.
 */

const ONBOARDING_STORAGE_KEY = 'hasene_onboarding_seen_v1';

const onboardingSteps = [
    {
        id: 'games',
        title: '📚 Ders Türleri',
        description:
            'Buradan 3 ana oyuna ulaşabilirsin:\n\n' +
            '• Kelime Çevir: Arapça kelimenin Türkçe meâlini bul\n' +
            '• Dinle ve Bul: Kelimeyi dinle, sahih olanı seç\n' +
            '• Boşluk Doldur: Ayetteki eksik kelimeyi tamamla',
        highlightSelector: '.games-section',
    },
    {
        id: 'hasene',
        title: '💰 Hasene ve İlerleme',
        description:
            'Üst taraftaki bölümde Hasene, Yıldız ve Mertebeni takip edebilirsin.\n\n' +
            '• Her sahih cevap Hasene kazandırır\n' +
            '• 100 Hasene = 1 ⭐ Yıldız\n' +
            '• Hasene biriktikçe merteben yükselir',
        highlightSelector: '.premium-stats-panel, .stats-row-minimal',
    },
    {
        id: 'calendar',
        title: '📅 Takvim ve Günlük Vazifeler',
        description:
            'Alt menüden Takvim ve Vazifeler ekranlarına gidebilirsin:\n\n' +
            '• Takvim: Günlük serini ve oynadığın günleri gör\n' +
            '• Vazifeler: Günlük ve haftalık görevlerini takip et',
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
    } catch (e) {
        // localStorage erişilemezse sessizce devam et
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

    // İlk yüklemede küçük bir gecikmeyle göster (ana ekran otursun)
    window.setTimeout(() => {
        showOnboarding(false);
    }, 800);
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        initOnboarding();
    } catch (e) {
        // Onboarding kritik değil, hata olsa bile uygulama çalışmaya devam eder
        // console.error('Onboarding init error:', e);
    }
});

// Manuel tetiklemek istersek global olarak da açılabilir
window.showOnboarding = showOnboarding;
window.initOnboarding = initOnboarding;



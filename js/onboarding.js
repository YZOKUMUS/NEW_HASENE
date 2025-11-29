// js/onboarding.js

/**
 * Mini Onboarding / Tur Modülü
 * İlk açılışta ana ekranda 6 oyun modu + puanlama sistemini tanıtan rehber gösterir.
 */

const ONBOARDING_STORAGE_KEY = 'hasene_onboarding_seen_v2';

const onboardingSteps = [
    {
        id: 'kelime-cevir',
        title: '🔄 Kelime Çevir',
        description:
            'Arapça kelimelerin Türkçe meâl karşılığını bul!\n\n' +
            '• Kuran\'da geçen Arapça kelimeler gösterilir\n' +
            '• Doğru Türkçe meâli seçerek Hasene kazan\n' +
            '• Kelime hazineni genişlet',
        highlightSelector: '#kelimeCevirBtn',
    },
    {
        id: 'dinle-bul',
        title: '🎧 Dinle ve Bul',
        description:
            'Kelimeyi dinle, sahih olanı seç!\n\n' +
            '• Arapça kelimeyi dinle\n' +
            '• Doğru seçeneği bul\n' +
            '• Telaffuzunu geliştir',
        highlightSelector: '#dinleBulBtn',
    },
    {
        id: 'bosluk-doldur',
        title: '✏️ Boşluk Doldur',
        description:
            'Ayetteki eksik kelimeyi tamamla!\n\n' +
            '• Ayet metninde boş bırakılan kelimeyi bul\n' +
            '• Doğru kelimeyi seçerek tamamla\n' +
            '• Ayetleri daha iyi öğren',
        highlightSelector: '#boslukDoldurBtn',
    },
    {
        id: 'dua-et',
        title: '🤲 Dua Et',
        description:
            'Kuran\'da geçen duaları dinle ve öğren!\n\n' +
            '• Kuran\'daki duaları dinle\n' +
            '• Arapça metni ve meâlini öğren\n' +
            '• Duaları ezberle ve istifade et',
        highlightSelector: '#duaEtBtn',
    },
    {
        id: 'ayet-oku',
        title: '📖 Ayet Oku',
        description:
            'Ayetin Arapça\'sını oku, dinle ve meâli idrak et!\n\n' +
            '• Kuran ayetlerini Arapça oku\n' +
            '• Telaffuzunu dinle\n' +
            '• Meâlini öğrenerek anlayışını derinleştir',
        highlightSelector: '#ayetOkuBtn',
    },
    {
        id: 'hadis-oku',
        title: '📚 Hadis Oku',
        description:
            'Hadis-i şerifleri oku ve istifade et!\n\n' +
            '• Hadis-i şerifleri oku\n' +
            '• Anlamını öğren\n' +
            '• Peygamber (s.a.v.) sözlerinden ilham al',
        highlightSelector: '#hadisOkuBtn',
    },
    {
        id: 'hasene',
        title: '💰 Hasene ve İlerleme',
        description:
            'Üst taraftaki bölümde Hasene, Yıldız ve Mertebeni takip edebilirsin.\n\n' +
            '• Her sahih cevap Hasene kazandırır\n' +
            '• 100 Hasene = 1 ⭐ Yıldız\n' +
            '• Hasene biriktikçe merteben yükselir\n' +
            '• Bonus ve combo ile daha fazla kazan',
        highlightSelector: '.premium-stats-panel, .stats-row-minimal',
    },
    {
        id: 'calendar',
        title: '📅 Takvim ve Günlük Vazifeler',
        description:
            'Alt menüden Takvim ve Vazifeler ekranlarına gidebilirsin:\n\n' +
            '• Takvim: Günlük serini ve oynadığın günleri gör\n' +
            '• Vazifeler: Günlük ve haftalık görevlerini takip et\n' +
            '• Görevleri tamamlayarak ekstra Hasene kazan',
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



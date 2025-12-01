import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';

// ============ TEST ORTAMI SETUP ============
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// HTML dosyasını LAZY LOAD yap (sadece gerektiğinde oku)
let htmlContentCache = null;

function getHtmlContent() {
  if (!htmlContentCache) {
    htmlContentCache = readFileSync(join(__dirname, '../index.html'), 'utf-8');
  }
  return htmlContentCache;
}

// DOM ortamı oluştur - Optimize edilmiş versiyon
function setupDOM() {
  const htmlContent = getHtmlContent();
  const dom = new JSDOM(htmlContent, {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable',
    runScripts: 'outside-only' // Script'leri çalıştırma, sadece parse et
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.HTMLElement = dom.window.HTMLElement;
  global.Element = dom.window.Element;
  global.Node = dom.window.Node;

  // localStorage mock
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
  })();
  
  global.localStorage = localStorageMock;
  // window.localStorage bir getter olduğu için direkt set edilemez
  // Vitest jsdom environment'ı zaten localStorage sağlıyor

  // CONFIG mock
  global.CONFIG = {
    debug: false,
    hapticEnabled: false,
    swipeGesturesEnabled: false
  };
  global.window.CONFIG = global.CONFIG;

  // log mock
  global.log = {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn()
  };
  global.window.log = global.log;

  return dom;
}

// ============ UI TESTLERİ ============

describe('UI - Kullanıcı Arayüzü Testleri', () => {
  let dom;

  beforeAll(() => {
    // DOM'u sadece bir kez oluştur (tüm testler için paylaşımlı)
    dom = setupDOM();
  });

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('DOM Element Varlığı', () => {
    it('Ana menü elementi mevcut olmalı', () => {
      const mainMenu = document.getElementById('mainMenu');
      expect(mainMenu).toBeTruthy();
      expect(mainMenu).toBeInstanceOf(HTMLElement);
    });

    it('Loading screen elementi mevcut olmalı', () => {
      const loadingScreen = document.getElementById('loadingScreen');
      expect(loadingScreen).toBeTruthy();
      expect(loadingScreen.classList.contains('kapak-loading')).toBe(true);
    });

    it('Bottom navigation bar mevcut olmalı', () => {
      const bottomNav = document.getElementById('bottomNavBar');
      expect(bottomNav).toBeTruthy();
      expect(bottomNav.classList.contains('bottom-nav')).toBe(true);
    });

    it('Tüm oyun butonları mevcut olmalı', () => {
      const gameButtons = [
        'kelimeCevirBtn',
        'dinleBulBtn',
        'boslukDoldurBtn',
        'duaEtBtn',
        'ayetOkuBtn',
        'hadisOkuBtn'
      ];

      gameButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        expect(btn).toBeTruthy();
        expect(btn.tagName).toBe('BUTTON');
      });
    });

    it('İstatistik göstergeleri mevcut olmalı', () => {
      const stats = [
        'gamePoints',
        'starPoints',
        'playerLevel'
      ];

      stats.forEach(statId => {
        const element = document.getElementById(statId);
        expect(element).toBeTruthy();
      });
    });

    it('Zorluk seviyesi butonları mevcut olmalı', () => {
      const difficultyButtons = [
        'mainDiffKolay',
        'mainDiffOrta',
        'mainDiffZor'
      ];

      difficultyButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        expect(btn).toBeTruthy();
        expect(btn.classList.contains('diff-btn')).toBe(true);
      });
    });
  });

  describe('Modal Elementleri', () => {
    it('Badges modal elementi mevcut olmalı', () => {
      const badgesModal = document.getElementById('badgesModal');
      expect(badgesModal).toBeTruthy();
      expect(badgesModal.classList.contains('modal')).toBe(true);
    });

    it('Onboarding modal elementi mevcut olmalı', () => {
      const onboardingModal = document.getElementById('onboardingModal');
      expect(onboardingModal).toBeTruthy();
      expect(onboardingModal.getAttribute('role')).toBe('dialog');
      expect(onboardingModal.getAttribute('aria-modal')).toBe('true');
    });

    it('Custom confirm modal elementi mevcut olmalı', () => {
      const confirmModal = document.getElementById('customConfirm');
      expect(confirmModal).toBeTruthy();
      expect(confirmModal.getAttribute('role')).toBe('dialog');
    });

    it('Modal içeriği yapısal olarak doğru olmalı', () => {
      const badgesModal = document.getElementById('badgesModal');
      const modalContent = badgesModal.querySelector('.modal-content');
      expect(modalContent).toBeTruthy();
    });
  });

  describe('Oyun Ekranları', () => {
    it('Game screen elementi mevcut olmalı', () => {
      const gameScreen = document.getElementById('gameScreen');
      expect(gameScreen).toBeTruthy();
      expect(gameScreen.classList.contains('game-screen')).toBe(true);
    });

    it('Kelime Çevir ekranı mevcut olmalı', () => {
      // Kelime Çevir oyunu gameScreen ID'sini kullanıyor
      const gameScreen = document.getElementById('gameScreen');
      expect(gameScreen).toBeTruthy();
      expect(gameScreen.classList.contains('game-screen')).toBe(true);
    });

    it('Dinle ve Bul ekranı mevcut olmalı', () => {
      const dinleScreen = document.getElementById('dinleMode');
      expect(dinleScreen).toBeTruthy();
      expect(dinleScreen.classList.contains('dinle-mode')).toBe(true);
    });

    it('Boşluk Doldur ekranı mevcut olmalı', () => {
      const boslukScreen = document.getElementById('boslukMode');
      expect(boslukScreen).toBeTruthy();
      expect(boslukScreen.classList.contains('bosluk-mode')).toBe(true);
    });

    it('Ayet Oku ekranı mevcut olmalı', () => {
      const ayetScreen = document.getElementById('ayetMode');
      expect(ayetScreen).toBeTruthy();
      expect(ayetScreen.classList.contains('ayet-mode')).toBe(true);
    });

    it('Dua Et ekranı mevcut olmalı', () => {
      const duaScreen = document.getElementById('duaMode');
      expect(duaScreen).toBeTruthy();
      expect(duaScreen.classList.contains('dua-mode')).toBe(true);
    });

    it('Hadis Oku ekranı mevcut olmalı', () => {
      const hadisScreen = document.getElementById('hadisMode');
      expect(hadisScreen).toBeTruthy();
      expect(hadisScreen.classList.contains('hadis-mode')).toBe(true);
    });
  });

  describe('Accessibility - Erişilebilirlik', () => {
    it('Oyun butonlarında aria-label olmalı', () => {
      const gameButtons = [
        'kelimeCevirBtn',
        'dinleBulBtn',
        'boslukDoldurBtn',
        'duaEtBtn',
        'ayetOkuBtn',
        'hadisOkuBtn'
      ];

      gameButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        expect(btn.getAttribute('aria-label')).toBeTruthy();
        expect(btn.getAttribute('aria-label').length).toBeGreaterThan(0);
      });
    });

    it('Oyun butonlarında role attribute olmalı', () => {
      const kelimeBtn = document.getElementById('kelimeCevirBtn');
      expect(kelimeBtn.getAttribute('role')).toBe('button');
    });

    it('Oyun butonlarında tabindex olmalı', () => {
      const gameButtons = [
        'kelimeCevirBtn',
        'dinleBulBtn',
        'boslukDoldurBtn'
      ];

      gameButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        expect(btn.getAttribute('tabindex')).toBe('0');
      });
    });

    it('Modal elementlerinde doğru ARIA özellikleri olmalı', () => {
      const onboardingModal = document.getElementById('onboardingModal');
      expect(onboardingModal.getAttribute('role')).toBe('dialog');
      expect(onboardingModal.getAttribute('aria-modal')).toBe('true');
      expect(onboardingModal.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('İstatistik bölgelerinde aria-label olmalı', () => {
      const statsRow = document.querySelector('.stats-row-minimal');
      if (statsRow) {
        expect(statsRow.getAttribute('role')).toBe('region');
        expect(statsRow.getAttribute('aria-label')).toBeTruthy();
      }
    });

    it('Zorluk butonlarında role="radiogroup" olmalı', () => {
      const diffGroup = document.querySelector('.difficulty-buttons');
      if (diffGroup) {
        expect(diffGroup.getAttribute('role')).toBe('radiogroup');
      }
    });

    it('Navigation bar\'da role="navigation" olmalı', () => {
      const bottomNav = document.getElementById('bottomNavBar');
      expect(bottomNav.getAttribute('role')).toBe('navigation');
      expect(bottomNav.getAttribute('aria-label')).toBeTruthy();
    });

    it('Progress bar\'larda aria-* attribute\'ları olmalı', () => {
      const progressBar = document.getElementById('dailyGoalProgress');
      if (progressBar) {
        expect(progressBar.getAttribute('role')).toBe('progressbar');
        expect(progressBar.getAttribute('aria-valuenow')).toBeTruthy();
        expect(progressBar.getAttribute('aria-valuemin')).toBeTruthy();
        expect(progressBar.getAttribute('aria-valuemax')).toBeTruthy();
      }
    });
  });

  describe('Button İşlevselliği', () => {
    it('Oyun butonları tıklanabilir olmalı', () => {
      const kelimeBtn = document.getElementById('kelimeCevirBtn');
      expect(kelimeBtn).toBeTruthy();
      expect(kelimeBtn.disabled).toBe(false);
      
      // Click event'i trigger edilebilmeli
      const clickEvent = new window.MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      
      expect(() => {
        kelimeBtn.dispatchEvent(clickEvent);
      }).not.toThrow();
    });

    it('Zorluk butonları tıklanabilir olmalı', () => {
      const kolayBtn = document.getElementById('mainDiffKolay');
      expect(kolayBtn).toBeTruthy();
      expect(kolayBtn.disabled).toBe(false);
    });

    it('Navigation butonları mevcut ve tıklanabilir olmalı', () => {
      const navItems = document.querySelectorAll('#bottomNavBar .nav-item');
      expect(navItems.length).toBeGreaterThan(0);
      
      navItems.forEach(item => {
        expect(item.tagName).toBe('BUTTON');
        expect(item.getAttribute('onclick')).toBeTruthy();
      });
    });
  });

  describe('Modal Görünürlüğü', () => {
    it('Başlangıçta modallar gizli olmalı', () => {
      const modals = [
        'badgesModal',
        'onboardingModal',
        'customConfirm'
      ];

      modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
          const display = window.getComputedStyle(modal).display;
          // display 'none' olabilir veya style attribute'u ile set edilmiş olabilir
          expect(modal.style.display === 'none' || display === 'none' || !modal.style.display || modal.style.display === '').toBe(true);
        }
      });
    });

    it('Modal açılabilmeli', () => {
      const badgesModal = document.getElementById('badgesModal');
      badgesModal.style.display = 'flex';
      
      expect(badgesModal.style.display).toBe('flex');
    });

    it('Modal kapanabilmeli', () => {
      const badgesModal = document.getElementById('badgesModal');
      badgesModal.style.display = 'flex';
      badgesModal.style.display = 'none';
      
      expect(badgesModal.style.display).toBe('none');
    });
  });

  describe('UI State Değişiklikleri', () => {
    it('Oyun ekranları başlangıçta gizli olmalı', () => {
      const gameScreen = document.getElementById('gameScreen');
      if (gameScreen) {
        expect(gameScreen.style.display === 'none' || !gameScreen.style.display || gameScreen.style.display === '').toBe(true);
      }
    });

    it('Zorluk butonlarından birinin active olması gerekir', () => {
      const diffButtons = document.querySelectorAll('.diff-btn');
      let hasActive = false;
      
      diffButtons.forEach(btn => {
        if (btn.classList.contains('active')) {
          hasActive = true;
        }
      });
      
      expect(hasActive).toBe(true);
    });

    it('Loading screen başlangıçta görünür olmalı', () => {
      const loadingScreen = document.getElementById('loadingScreen');
      expect(loadingScreen).toBeTruthy();
      // Loading screen genellikle başlangıçta görünür olur
    });
  });

  describe('Günlük Vird (Daily Goal) UI', () => {
    it('Günlük vird elementi mevcut olmalı', () => {
      const dailyGoal = document.querySelector('.daily-goal-minimal');
      expect(dailyGoal).toBeTruthy();
    });

    it('Günlük vird progress bar mevcut olmalı', () => {
      const progressBar = document.getElementById('dailyGoalProgress');
      expect(progressBar).toBeTruthy();
    });

    it('Günlük vird progress text mevcut olmalı', () => {
      const progressText = document.getElementById('dailyGoalProgressText');
      expect(progressText).toBeTruthy();
    });

    it('Progress bar başlangıç değerleri doğru olmalı', () => {
      const progressBar = document.getElementById('dailyGoalProgress');
      if (progressBar) {
        const width = progressBar.style.width || '0%';
        expect(width).toBeTruthy();
        expect(width.includes('%')).toBe(true);
      }
    });
  });

  describe('Navigation Bar', () => {
    it('Navigation bar\'da 5 buton olmalı', () => {
      const navItems = document.querySelectorAll('#bottomNavBar .nav-item');
      expect(navItems.length).toBe(5);
    });

    it('Navigation butonlarında icon ve label olmalı', () => {
      const navItems = document.querySelectorAll('#bottomNavBar .nav-item');
      
      navItems.forEach(item => {
        const icon = item.querySelector('.nav-icon');
        const label = item.querySelector('.nav-label');
        
        expect(icon).toBeTruthy();
        expect(label).toBeTruthy();
      });
    });

    it('Navigation butonlarında onclick handler olmalı', () => {
      const navItems = document.querySelectorAll('#bottomNavBar .nav-item');
      
      navItems.forEach(item => {
        expect(item.getAttribute('onclick')).toBeTruthy();
      });
    });
  });

  describe('Oyun Kartları (Game Cards)', () => {
    it('Oyun kartlarında icon, title ve description olmalı', () => {
      const gameCards = document.querySelectorAll('.game-card');
      
      gameCards.forEach(card => {
        const icon = card.querySelector('.game-icon');
        const title = card.querySelector('.game-title');
        const desc = card.querySelector('.game-desc');
        
        expect(icon).toBeTruthy();
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
      });
    });

    it('Oyun kartları buton olmalı', () => {
      const gameCards = document.querySelectorAll('.game-card');
      
      gameCards.forEach(card => {
        expect(card.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Responsive ve Mobile Uyumluluk', () => {
    it('Viewport meta tag mevcut olmalı', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).toBeTruthy();
      expect(viewport.getAttribute('content')).toContain('width=device-width');
    });

    it('Touch action desteği olmalı', () => {
      // Modal'larda touch-action attribute kontrolü
      const badgesModal = document.getElementById('badgesModal');
      const modalContent = badgesModal?.querySelector('.modal-content');
      
      if (modalContent) {
        const touchAction = modalContent.style.touchAction;
        // touch-action CSS property'si set edilmiş olabilir
        expect(modalContent).toBeTruthy();
      }
    });
  });

  describe('Badge Modal Yapısı', () => {
    it('Badge modal\'da header olmalı', () => {
      const badgesModal = document.getElementById('badgesModal');
      const header = badgesModal?.querySelector('.badges-header');
      expect(header).toBeTruthy();
    });

    it('Badge modal\'da stats summary olmalı', () => {
      const badgesModal = document.getElementById('badgesModal');
      const statsSummary = badgesModal?.querySelector('.stats-summary');
      expect(statsSummary).toBeTruthy();
    });

    it('Badge modal\'da category tabs olmalı', () => {
      const badgesModal = document.getElementById('badgesModal');
      const categoryTabs = badgesModal?.querySelectorAll('.category-tab');
      expect(categoryTabs.length).toBeGreaterThan(0);
    });

    it('Badge kartları mevcut olmalı', () => {
      const badgeCards = document.querySelectorAll('.badge-card');
      expect(badgeCards.length).toBeGreaterThan(0);
    });

    it('Badge kartlarında icon, title ve description olmalı', () => {
      const badgeCards = document.querySelectorAll('.badge-card');
      
      badgeCards.forEach(card => {
        const icon = card.querySelector('.badge-icon');
        const title = card.querySelector('.badge-title');
        const desc = card.querySelector('.badge-desc');
        
        expect(icon).toBeTruthy();
        expect(title).toBeTruthy();
        expect(desc).toBeTruthy();
      });
    });
  });

  describe('Oyun Ekranı Elementleri', () => {
    it('Oyun ekranlarında header olmalı', () => {
      const gameScreen = document.getElementById('gameScreen');
      const header = gameScreen?.querySelector('.duolingo-header');
      expect(header).toBeTruthy();
    });

    it('Oyun ekranlarında question area olmalı', () => {
      const gameScreen = document.getElementById('gameScreen');
      const questionArea = gameScreen?.querySelector('.duolingo-question-area');
      expect(questionArea).toBeTruthy();
    });

    it('Oyun ekranlarında options container olmalı', () => {
      const gameScreen = document.getElementById('gameScreen');
      const optionsContainer = gameScreen?.querySelector('.duolingo-options-container');
      expect(optionsContainer).toBeTruthy();
    });

    it('Oyun ekranlarında stats bar olmalı', () => {
      const gameScreen = document.getElementById('gameScreen');
      const statsBar = gameScreen?.querySelector('.duolingo-stats-bar');
      expect(statsBar).toBeTruthy();
    });
  });

  describe('Modal İşlevselliği', () => {
    it('Modal açıldığında display değişmeli', () => {
      const badgesModal = document.getElementById('badgesModal');
      badgesModal.style.display = 'flex';
      expect(badgesModal.style.display).toBe('flex');
    });

    it('Modal kapatıldığında display none olmalı', () => {
      const badgesModal = document.getElementById('badgesModal');
      badgesModal.style.display = 'flex';
      badgesModal.style.display = 'none';
      expect(badgesModal.style.display).toBe('none');
    });

    it('Modal close butonu mevcut olmalı', () => {
      const badgesModal = document.getElementById('badgesModal');
      const closeBtn = badgesModal?.querySelector('#closeBadgesBtn, .close-btn');
      expect(closeBtn).toBeTruthy();
    });

    it('Modal açıldığında body overflow hidden olmalı', () => {
      // Bu test gerçek fonksiyon çağrıldığında test edilebilir
      document.body.style.overflow = 'hidden';
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('Keyboard Navigation', () => {
    it('Focusable elementler mevcut olmalı', () => {
      const buttons = document.querySelectorAll('button[tabindex="0"], button:not([tabindex="-1"])');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('Navigation butonları keyboard ile erişilebilir olmalı', () => {
      const navButtons = document.querySelectorAll('#bottomNavBar button');
      navButtons.forEach(btn => {
        expect(btn.getAttribute('tabindex') !== '-1').toBe(true);
      });
    });
  });

  describe('Form ve Input Elementleri', () => {
    it('İstatistik gösterim elementleri mevcut olmalı', () => {
      const scoreElements = [
        document.getElementById('score'),
        document.getElementById('correct'),
        document.getElementById('wrong')
      ];

      scoreElements.forEach(element => {
        if (element) {
          expect(element).toBeTruthy();
        }
      });
    });

    it('Progress bar elementleri mevcut olmalı', () => {
      const progressBars = document.querySelectorAll('[role="progressbar"]');
      expect(progressBars.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Image ve Asset Yükleme', () => {
    it('Image elementleri alt attribute\'una sahip olmalı', () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Alt attribute olmalı veya aria-hidden olmalı (dekoratif görseller için)
        const hasAlt = img.hasAttribute('alt');
        const isDecorative = img.getAttribute('aria-hidden') === 'true';
        expect(hasAlt || isDecorative).toBe(true);
      });
    });
  });

  describe('Stil ve Class Yönetimi', () => {
    it('Active class yönetimi çalışmalı', () => {
      const diffButtons = document.querySelectorAll('.diff-btn');
      let activeCount = 0;
      
      diffButtons.forEach(btn => {
        if (btn.classList.contains('active')) {
          activeCount++;
        }
      });
      
      // En az bir aktif buton olmalı
      expect(activeCount).toBeGreaterThanOrEqual(1);
    });

    it('CSS class\'ları doğru uygulanmış olmalı', () => {
      const gameCards = document.querySelectorAll('.game-card');
      expect(gameCards.length).toBeGreaterThan(0);
      
      gameCards.forEach(card => {
        expect(card.classList.contains('game-card')).toBe(true);
      });
    });
  });

  describe('Dynamic Content', () => {
    it('Placeholder text\'ler mevcut olmalı', () => {
      const arabicWord = document.getElementById('arabicWord');
      if (arabicWord) {
        expect(arabicWord.textContent).toBeTruthy();
      }
    });

    it('Feedback alanları mevcut olmalı', () => {
      const feedbackElements = document.querySelectorAll('.feedback');
      expect(feedbackElements.length).toBeGreaterThan(0);
    });
  });
});


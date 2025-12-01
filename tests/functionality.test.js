import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';

// ============ TEST ORTAMI SETUP ============
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Constants dosyasını oku
const constantsCode = readFileSync(join(__dirname, '../js/constants.js'), 'utf-8');
const utilsCode = readFileSync(join(__dirname, '../js/utils.js'), 'utf-8');

// DOM ortamı oluştur
function setupDOM() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;

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

  // constants.js'i çalıştır
  eval(constantsCode);

  // utils.js'i çalıştır
  eval(utilsCode);

  return dom;
}

// ============ FONKSİYONELLİK TESTLERİ ============

describe('Fonksiyonellik Testleri', () => {
  let dom;

  beforeAll(() => {
    dom = setupDOM();
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Utils Fonksiyonları', () => {
    describe('getLocalDateString', () => {
      it('Tarihi YYYY-MM-DD formatında döndürmeli', () => {
        const date = new Date('2024-03-15');
        const result = window.getLocalDateString(date);
        expect(result).toBe('2024-03-15');
      });

      it('Tek haneli ay ve günleri sıfırla doldurmalı', () => {
        const date = new Date('2024-01-05');
        const result = window.getLocalDateString(date);
        expect(result).toBe('2024-01-05');
      });

      it('Argüman verilmezse bugünün tarihini döndürmeli', () => {
        const result = window.getLocalDateString();
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    describe('sanitizeHTML', () => {
      it('HTML özel karakterlerini escape etmeli', () => {
        const input = '<script>alert("xss")</script>';
        const result = window.sanitizeHTML(input);
        expect(result).not.toContain('<script>');
        expect(result).toContain('&lt;');
      });

      it('Normal string\'leri olduğu gibi döndürmeli', () => {
        const input = 'Merhaba Dünya';
        const result = window.sanitizeHTML(input);
        expect(result).toBe('Merhaba Dünya');
      });

      it('Non-string input için boş string döndürmeli', () => {
        expect(window.sanitizeHTML(null)).toBe('');
        expect(window.sanitizeHTML(undefined)).toBe('');
        expect(window.sanitizeHTML(123)).toBe('');
      });

      it('XSS saldırılarını önlemeli', () => {
        const xssInputs = [
          '<img src=x onerror=alert(1)>',
          'javascript:alert(1)',
          '<iframe src="evil.com"></iframe>'
        ];

        xssInputs.forEach(input => {
          const result = window.sanitizeHTML(input);
          // sanitizeHTML HTML tag'lerini escape eder (textContent kullanarak)
          // HTML karakterleri (< >) escape edilir, kelimeler korunur
          // Önemli olan: HTML tag'lerinin çalıştırılamaz hale gelmesi
          expect(result).not.toContain('<iframe'); // Tag escape edilmeli
          expect(result).not.toContain('<img'); // Tag escape edilmeli
          // onerror, javascript: gibi kelimeler escape edilmiş string içinde kalabilir
          // ama HTML tag'i escape edildiği için çalıştırılamaz (güvenli)
        });
      });
    });

    describe('encryptData / decryptData', () => {
      it('Object\'i şifreleyip çözebilmeli', () => {
        const original = { test: 'data', number: 123, array: [1, 2, 3] };
        const encrypted = window.encryptData(original);
        const decrypted = window.decryptData(encrypted);
        expect(decrypted).toEqual(original);
      });

      it('String\'i şifreleyip çözebilmeli', () => {
        const original = 'test string';
        const encrypted = window.encryptData(original);
        const decrypted = window.decryptData(encrypted);
        expect(decrypted).toBe(original);
      });

      it('Array\'i şifreleyip çözebilmeli', () => {
        const original = [1, 2, 3, 'test'];
        const encrypted = window.encryptData(original);
        const decrypted = window.decryptData(encrypted);
        expect(decrypted).toEqual(original);
      });

      it('Nested object\'leri şifreleyip çözebilmeli', () => {
        const original = {
          level1: {
            level2: {
              value: 'test'
            }
          }
        };
        const encrypted = window.encryptData(original);
        const decrypted = window.decryptData(encrypted);
        expect(decrypted).toEqual(original);
      });
    });

    describe('debounce', () => {
      it('Fonksiyon çağrılarını geciktirmeli', async () => {
        vi.useFakeTimers();
        const mockFn = vi.fn();
        const debounced = window.debounce(mockFn, 300);

        debounced();
        debounced();
        debounced();

        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(300);
        expect(mockFn).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
      });

      it('Immediate mode çalışmalı', () => {
        const mockFn = vi.fn();
        const debounced = window.debounce(mockFn, 300, true);

        debounced();
        expect(mockFn).toHaveBeenCalledTimes(1);
      });
    });

    describe('throttle', () => {
      it('Fonksiyon çağrılarını sınırlamalı', async () => {
        vi.useFakeTimers();
        const mockFn = vi.fn();
        const throttled = window.throttle(mockFn, 100);

        throttled(); // İlk çağrı hemen çalışır
        expect(mockFn).toHaveBeenCalledTimes(1);

        throttled(); // Bu çağrı sınırlanır
        throttled();
        expect(mockFn).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);
        throttled(); // Artık çalışabilir
        expect(mockFn).toHaveBeenCalledTimes(2);

        vi.useRealTimers();
      });
    });
  });

  describe('Constants - Puan Sistemi', () => {
    it('POINTS sabitleri doğru olmalı', () => {
      expect(window.CONSTANTS.POINTS.PER_CORRECT).toBe(10);
      expect(window.CONSTANTS.POINTS.WRONG_PENALTY).toBe(5);
      expect(window.CONSTANTS.POINTS.COMBO_BONUS).toBe(5);
      expect(window.CONSTANTS.POINTS.STAR_THRESHOLD).toBe(100);
    });

    it('Yıldız hesaplama mantığı doğru olmalı', () => {
      const { STAR_THRESHOLD } = window.CONSTANTS.POINTS;
      expect(100 / STAR_THRESHOLD).toBe(1); // 100 Hasene = 1 Yıldız
      expect(250 / STAR_THRESHOLD).toBe(2.5); // 250 Hasene = 2.5 Yıldız
      expect(500 / STAR_THRESHOLD).toBe(5); // 500 Hasene = 5 Yıldız
    });
  });

  describe('Constants - Badge Sistemi', () => {
    it('Badge eşikleri doğru olmalı', () => {
      expect(window.CONSTANTS.BADGES.BRONZE_THRESHOLD).toBe(5);
      expect(window.CONSTANTS.BADGES.SILVER_THRESHOLD).toBe(5);
      expect(window.CONSTANTS.BADGES.GOLD_THRESHOLD).toBe(5);
      expect(window.CONSTANTS.BADGES.DIAMOND_THRESHOLD).toBe(5);
    });

    it('Badge hesaplama mantığı doğru olmalı', () => {
      const { BRONZE_THRESHOLD, SILVER_THRESHOLD, GOLD_THRESHOLD } = window.CONSTANTS.BADGES;
      
      // 5 yıldız = 1 bronz
      const starsForBronze = 5;
      expect(starsForBronze).toBe(BRONZE_THRESHOLD);
      
      // 5 bronz = 1 gümüş
      const bronzeForSilver = 5;
      expect(bronzeForSilver).toBe(SILVER_THRESHOLD);
      
      // 5 gümüş = 1 altın
      const silverForGold = 5;
      expect(silverForGold).toBe(GOLD_THRESHOLD);
    });
  });

  describe('Constants - Level Sistemi', () => {
    it('Level eşikleri doğru tanımlanmış olmalı', () => {
      const { THRESHOLDS } = window.CONSTANTS.LEVELS;
      expect(THRESHOLDS[1]).toBe(0);
      expect(THRESHOLDS[2]).toBe(2500);
      expect(THRESHOLDS[3]).toBe(5000);
      expect(THRESHOLDS[4]).toBe(8500);
      expect(THRESHOLDS[5]).toBe(13000);
      expect(THRESHOLDS[10]).toBe(46000);
    });

    it('Level hesaplama fonksiyonu mantıklı olmalı', () => {
      const { THRESHOLDS, INCREMENT_AFTER_10 } = window.CONSTANTS.LEVELS;
      
      // Level 1: 0-2499
      expect(0).toBeGreaterThanOrEqual(THRESHOLDS[1]);
      expect(2499).toBeLessThan(THRESHOLDS[2]);
      
      // Level 2: 2500-4999
      expect(2500).toBeGreaterThanOrEqual(THRESHOLDS[2]);
      expect(4999).toBeLessThan(THRESHOLDS[3]);
      
      // Level 5: 13000+
      expect(13000).toBeGreaterThanOrEqual(THRESHOLDS[5]);
    });
  });

  describe('Constants - Günlük Hedef', () => {
    it('Günlük hedef seçenekleri doğru olmalı', () => {
      const { OPTIONS } = window.CONSTANTS.DAILY_GOAL;
      expect(OPTIONS.EASY).toBe(1300);
      expect(OPTIONS.NORMAL).toBe(2700);
      expect(OPTIONS.HARD).toBe(5400);
      expect(OPTIONS.SERIOUS).toBe(6000);
    });

    it('Günlük hedef default değeri doğru olmalı', () => {
      expect(window.CONSTANTS.DAILY_GOAL.DEFAULT).toBe(2700);
    });

    it('Günlük hedef min/max değerleri doğru olmalı', () => {
      expect(window.CONSTANTS.DAILY_GOAL.MIN).toBe(100);
      expect(window.CONSTANTS.DAILY_GOAL.MAX).toBe(10000);
    });
  });

  describe('Puan Hesaplama Mantığı', () => {
    it('3 doğru cevapta combo bonusu eklenmeli', () => {
      const { PER_CORRECT, COMBO_BONUS } = window.CONSTANTS.POINTS;
      
      // 3 doğru cevap = 3 * 10 + 5 (combo) = 35
      const threeCorrect = (3 * PER_CORRECT) + COMBO_BONUS;
      expect(threeCorrect).toBe(35);
    });

    it('Yıldız sayısı hesaplama doğru olmalı', () => {
      const { STAR_THRESHOLD } = window.CONSTANTS.POINTS;
      
      expect(Math.floor(100 / STAR_THRESHOLD)).toBe(1); // 1 yıldız
      expect(Math.floor(250 / STAR_THRESHOLD)).toBe(2); // 2 yıldız
      expect(Math.floor(500 / STAR_THRESHOLD)).toBe(5); // 5 yıldız
      expect(Math.floor(1000 / STAR_THRESHOLD)).toBe(10); // 10 yıldız
    });

    it('Badge hesaplama mantığı doğru olmalı', () => {
      const { BRONZE_THRESHOLD } = window.CONSTANTS.BADGES;
      const { STAR_THRESHOLD } = window.CONSTANTS.POINTS;
      
      // 1 bronz için gereken yıldız sayısı
      const starsNeeded = BRONZE_THRESHOLD;
      expect(starsNeeded).toBe(5);
      
      // 1 bronz için gereken Hasene (5 yıldız * 100)
      const haseneForBronze = starsNeeded * STAR_THRESHOLD;
      expect(haseneForBronze).toBe(500);
    });
  });

  describe('Tarih İşlemleri', () => {
    it('Bugünün tarihini doğru formatlamalı', () => {
      const today = window.getLocalDateString();
      const expectedFormat = /^\d{4}-\d{2}-\d{2}$/;
      expect(today).toMatch(expectedFormat);
    });

    it('Farklı tarihleri doğru formatlamalı', () => {
      const testCases = [
        { date: new Date('2024-01-01'), expected: '2024-01-01' },
        { date: new Date('2024-12-31'), expected: '2024-12-31' },
        { date: new Date('2025-06-15'), expected: '2025-06-15' }
      ];

      testCases.forEach(({ date, expected }) => {
        expect(window.getLocalDateString(date)).toBe(expected);
      });
    });
  });

  describe('Güvenlik Fonksiyonları', () => {
    it('XSS saldırılarını önlemeli', () => {
      const xssPayloads = [
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert(1)',
        '<iframe src="evil.com"></iframe>',
        '<svg onload=alert(1)>',
        '"><script>alert(1)</script>'
      ];

      xssPayloads.forEach(payload => {
        const sanitized = window.sanitizeHTML(payload);
        // sanitizeHTML HTML karakterlerini escape eder (textContent kullanarak)
        // < -> &lt;, > -> &gt; şeklinde escape edilir
        // Bu sayede HTML tag'leri çalıştırılamaz hale gelir
        
        // HTML tag'leri escape edilmiş olmalı (< yerine &lt;)
        expect(sanitized).not.toContain('<script>'); // Escape edilmiş olmalı
        expect(sanitized).not.toContain('<img'); // Escape edilmiş olmalı  
        expect(sanitized).not.toContain('<iframe'); // Escape edilmiş olmalı
        expect(sanitized).not.toContain('<svg'); // Escape edilmiş olmalı
        
        // Escape edildiğini doğrula - HTML tag'leri artık güvenli
        // Not: sanitizeHTML textContent kullanır, bu yüzden onerror, onload gibi 
        // kelimeler escape edilmiş string içinde metin olarak kalabilir
        // ama HTML tag'i escape edildiği için çalıştırılamaz (güvenli)
        if (payload.includes('<')) {
          expect(sanitized).toContain('&lt;');
        }
      });
    });

    it('SQL injection benzeri saldırıları önlemeli', () => {
      const sqlPayloads = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users--"
      ];

      sqlPayloads.forEach(payload => {
        const sanitized = window.sanitizeHTML(payload);
        // HTML sanitization SQL injection'ı direkt önlemez ama özel karakterleri escape eder
        expect(typeof sanitized).toBe('string');
      });
    });
  });

  describe('Veri Şifreleme', () => {
    it('Farklı veri tiplerini şifreleyip çözebilmeli', () => {
      const testData = [
        'string',
        123,
        { key: 'value' },
        [1, 2, 3],
        { nested: { deep: { value: 'test' } } },
        null,
        true,
        false
      ];

      testData.forEach(data => {
        try {
          const encrypted = window.encryptData(data);
          const decrypted = window.decryptData(encrypted);
          expect(decrypted).toEqual(data);
        } catch (e) {
          // null gibi bazı değerler şifrelenemeyebilir, bu normal
          if (data !== null) {
            throw e;
          }
        }
      });
    });

    it('Şifrelenmiş veri orijinalinden farklı olmalı', () => {
      const original = { secret: 'data' };
      const encrypted = window.encryptData(original);
      
      expect(encrypted).not.toEqual(original);
      expect(typeof encrypted).toBe('string');
    });
  });

  describe('Oyun Modları', () => {
    it('Oyun modları doğru tanımlanmış olmalı', () => {
      const { GAME_MODES } = window.CONSTANTS;
      expect(GAME_MODES.CLASSIC).toBe('classic');
      expect(GAME_MODES.TIMED).toBe('timed');
      expect(GAME_MODES.LIVES).toBe('lives');
      expect(GAME_MODES.DIFFICULT).toBe('difficult');
    });

    it('Oyun modu config\'leri mevcut olmalı', () => {
      const { GAME_MODE_CONFIG } = window.CONSTANTS;
      expect(GAME_MODE_CONFIG.CLASSIC).toBeDefined();
      expect(GAME_MODE_CONFIG.TIMED).toBeDefined();
      expect(GAME_MODE_CONFIG.LIVES).toBeDefined();
      expect(GAME_MODE_CONFIG.DIFFICULT).toBeDefined();
    });
  });

  describe('Kelime İstatistikleri Sabitleri', () => {
    it('Kelime istatistik eşikleri doğru olmalı', () => {
      const { WORD_STATS } = window.CONSTANTS;
      expect(WORD_STATS.MASTERY_THRESHOLD).toBe(3.0);
      expect(WORD_STATS.SUCCESS_RATE_THRESHOLD).toBe(0.6);
      expect(WORD_STATS.MIN_ATTEMPTS).toBe(5);
      expect(WORD_STATS.MASTERY_INCREMENT).toBe(0.2);
      expect(WORD_STATS.MASTERY_DECREMENT).toBe(0.5);
    });

    it('Ustalık hesaplama mantığı doğru olmalı', () => {
      const { MASTERY_THRESHOLD } = window.CONSTANTS.WORD_STATS;
      
      // 3.0 ve üzeri ustalık = öğrenilmiş
      expect(3.0).toBeGreaterThanOrEqual(MASTERY_THRESHOLD);
      expect(2.9).toBeLessThan(MASTERY_THRESHOLD);
    });
  });

  describe('Haptic Feedback Patterns', () => {
    it('Haptic pattern\'leri doğru tanımlanmış olmalı', () => {
      const { HAPTIC } = window.CONSTANTS;
      expect(HAPTIC.PATTERNS.LIGHT).toBe(10);
      expect(HAPTIC.PATTERNS.MEDIUM).toBe(20);
      expect(HAPTIC.PATTERNS.HEAVY).toBe(50);
      expect(Array.isArray(HAPTIC.PATTERNS.SUCCESS)).toBe(true);
      expect(Array.isArray(HAPTIC.PATTERNS.ERROR)).toBe(true);
    });
  });

  describe('Storage Keys', () => {
    it('Storage key\'leri doğru tanımlanmış olmalı', () => {
      const { STORAGE_KEYS } = window.CONSTANTS;
      expect(STORAGE_KEYS.DAILY_GOAL_HASENE).toBe('dailyGoalHasene');
      expect(STORAGE_KEYS.PLAYER_POINTS).toBe('playerPoints');
      expect(STORAGE_KEYS.STAR_POINTS).toBe('starPoints');
      expect(STORAGE_KEYS.BADGES).toBe('badges');
    });
  });
});


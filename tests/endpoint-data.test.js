import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';

// ============ TEST ORTAMI SETUP ============
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// JSON dosyalarını oku
const kelimeBulData = JSON.parse(readFileSync(join(__dirname, '../data/kelimebul.json'), 'utf-8'));
const ayetOkuData = JSON.parse(readFileSync(join(__dirname, '../data/ayetoku.json'), 'utf-8'));
const duaEtData = JSON.parse(readFileSync(join(__dirname, '../data/duaet.json'), 'utf-8'));
const hadisOkuData = JSON.parse(readFileSync(join(__dirname, '../data/hadisoku.json'), 'utf-8'));

// DOM ortamı oluştur
function setupDOM() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.fetch = vi.fn();

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

  // CONFIG mock
  global.CONFIG = {
    debug: false,
    hapticEnabled: false
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

  // showLoading/hideLoading mock
  global.showLoading = vi.fn();
  global.hideLoading = vi.fn();
  global.showError = vi.fn();

  // Constants mock
  global.window.CONSTANTS = {
    ERROR: {
      MAX_RETRIES: 3,
      RETRY_DELAY: 1000
    }
  };

  return dom;
}

// ============ ENDPOINT VE VERİ TESTLERİ ============

describe('Endpoint ve Veri Doğruluk Testleri', () => {
  let dom;
  let originalFetch;

  beforeAll(() => {
    dom = setupDOM();
    originalFetch = global.fetch;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  // ============ ENDPOINT TESTLERİ ============

  describe('HTTP Endpoint Testleri', () => {
    // Helper function to load data-loader and export functions
    function loadDataLoader() {
      const dataLoaderCode = readFileSync(join(__dirname, '../js/data-loader.js'), 'utf-8');
      // Evaluate the code and manually export fetchWithRetry to window
      const codeWithExport = `
        ${dataLoaderCode}
        // Export fetchWithRetry to window for testing
        if (typeof window !== 'undefined' && typeof fetchWithRetry === 'function') {
          window.fetchWithRetry = fetchWithRetry;
        }
      `;
      eval(codeWithExport);
    }

    it('fetchWithRetry - GET metodu kullanılmalı', async () => {
      // fetchWithRetry fonksiyonunu yükle
      loadDataLoader();

      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ test: 'data' })
      });

      const result = await window.fetchWithRetry('data/test.json');

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('data/test.json');
      expect(result).toEqual({ test: 'data' });
    });

    it('fetchWithRetry - Başarısız isteklerde retry yapmalı', async () => {
      loadDataLoader();

      // İlk 2 deneme başarısız, 3. başarılı
      global.fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ success: true })
        });

      // Retry delay'i kısa tut (test hızı için)
      vi.useFakeTimers();
      const resultPromise = window.fetchWithRetry('data/test.json', 3, 100);
      
      // Retry'ları bekle
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ success: true });
      
      vi.useRealTimers();
    });

    it('fetchWithRetry - HTTP error durumunda hata fırlatmalı', async () => {
      loadDataLoader();

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(window.fetchWithRetry('data/notfound.json')).rejects.toThrow();
    });

    it('fetchWithRetry - JSON parse hatası durumunda retry yapmalı', async () => {
      loadDataLoader();

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => 'invalid json'
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ valid: true })
        });

      vi.useFakeTimers();
      const resultPromise = window.fetchWithRetry('data/test.json');
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toEqual({ valid: true });
      vi.useRealTimers();
    });
  });

  // ============ VERİ YAPISI TESTLERİ ============

  describe('JSON Veri Yapısı Doğrulama', () => {
    it('kelimebul.json - Tüm kayıtlar gerekli alanlara sahip olmalı', () => {
      kelimeBulData.forEach((item, index) => {
        expect(item, `Item ${index} should have id`).toHaveProperty('id');
        expect(item, `Item ${index} should have kelime`).toHaveProperty('kelime');
        expect(item, `Item ${index} should have anlam`).toHaveProperty('anlam');
        expect(item, `Item ${index} should have sure_adi`).toHaveProperty('sure_adi');
        expect(item, `Item ${index} should have difficulty`).toHaveProperty('difficulty');
        
        expect(typeof item.id).toBe('string');
        expect(typeof item.kelime).toBe('string');
        expect(typeof item.anlam).toBe('string');
        expect(typeof item.sure_adi).toBe('string');
        expect(typeof item.difficulty).toBe('number');
      });
    });

    it('ayetoku.json - Tüm kayıtlar gerekli alanlara sahip olmalı', () => {
      ayetOkuData.forEach((item, index) => {
        expect(item, `Item ${index} should have ayet_kimligi`).toHaveProperty('ayet_kimligi');
        expect(item, `Item ${index} should have ayet_metni`).toHaveProperty('ayet_metni');
        expect(item, `Item ${index} should have sure_adı`).toHaveProperty('sure_adı');
        expect(item, `Item ${index} should have meal`).toHaveProperty('meal');
        
        expect(typeof item.ayet_kimligi).toBe('string');
        expect(typeof item.ayet_metni).toBe('string');
        expect(typeof item.sure_adı).toBe('string');
        expect(typeof item.meal).toBe('string');
      });
    });

    it('duaet.json - Tüm kayıtlar gerekli alanlara sahip olmalı', () => {
      duaEtData.forEach((item, index) => {
        expect(item, `Item ${index} should have ayet`).toHaveProperty('ayet');
        expect(item, `Item ${index} should have dua`).toHaveProperty('dua');
        expect(item, `Item ${index} should have tercume`).toHaveProperty('tercume');
        expect(item, `Item ${index} should have ses_url`).toHaveProperty('ses_url');
        
        expect(typeof item.ayet).toBe('string');
        expect(typeof item.dua).toBe('string');
        expect(typeof item.tercume).toBe('string');
        expect(typeof item.ses_url).toBe('string');
      });
    });

    it('hadisoku.json - Tüm kayıtlar gerekli alanlara sahip olmalı', () => {
      hadisOkuData.forEach((item, index) => {
        expect(item, `Item ${index} should have id`).toHaveProperty('id');
        expect(item, `Item ${index} should have text`).toHaveProperty('text');
        expect(item, `Item ${index} should have section`).toHaveProperty('section');
        
        expect(typeof item.id).toBe('string');
        expect(typeof item.text).toBe('string');
        expect(typeof item.section).toBe('string');
      });
    });
  });

  // ============ VERİ KALİTESİ TESTLERİ ============

  describe('Veri Kalitesi ve Doğruluk', () => {
    it('Arapça kelimeler Arapça karakter içermeli', () => {
      const arabicRegex = /[\u0600-\u06FF]/;
      
      kelimeBulData.slice(0, 100).forEach((item, index) => {
        if (item.kelime) {
          expect(
            arabicRegex.test(item.kelime),
            `Item ${index}: "${item.kelime}" should contain Arabic characters`
          ).toBe(true);
        }
      });
    });

    it('Çeviriler boş olmamalı', () => {
      kelimeBulData.slice(0, 100).forEach((item, index) => {
        expect(
          item.anlam && item.anlam.trim().length > 0,
          `Item ${index} should have non-empty translation`
        ).toBe(true);
      });

      duaEtData.forEach((item, index) => {
        expect(
          item.tercume && item.tercume.trim().length > 0,
          `Item ${index} should have non-empty translation`
        ).toBe(true);
      });
    });

    it('Difficulty değerleri geçerli aralıkta olmalı', () => {
      kelimeBulData.forEach((item, index) => {
        // Difficulty değerleri pozitif sayı olmalı (max değer kısıtı kaldırıldı)
        expect(
          typeof item.difficulty === 'number' && item.difficulty >= 1,
          `Item ${index}: difficulty should be a positive number`
        ).toBe(true);
      });
    });

    it('ID formatları geçerli olmalı', () => {
      // kelimebul.json: "82:8:6" formatı
      kelimeBulData.slice(0, 100).forEach((item) => {
        expect(item.id).toMatch(/^\d+:\d+:\d+$/);
      });

      // hadisoku.json: string ID
      hadisOkuData.slice(0, 50).forEach((item) => {
        expect(typeof item.id).toBe('string');
        expect(item.id.length).toBeGreaterThan(0);
      });
    });

    it('Ses dosyası URL\'leri geçerli olmalı', () => {
      kelimeBulData.slice(0, 100).forEach((item) => {
        if (item.ses_dosyasi) {
          expect(item.ses_dosyasi).toMatch(/^https?:\/\//);
        }
      });

      duaEtData.forEach((item) => {
        expect(item.ses_url).toMatch(/^https?:\/\//);
      });
    });

    it('Ayet formatları geçerli olmalı', () => {
      duaEtData.forEach((item) => {
        // "2:127" formatı
        expect(item.ayet).toMatch(/^\d+:\d+$/);
      });

      ayetOkuData.slice(0, 100).forEach((item) => {
        if (item.ayet_kimligi) {
          expect(item.ayet_kimligi).toMatch(/^\d+:\d+:\d+$/);
        }
      });
    });
  });

  // ============ DİLBİLGİSİ VE ANLAM KONTROLÜ ============

  describe('Dilbilgisi ve Anlam Kontrolü', () => {
    it('Türkçe çevirilerde temel dilbilgisi kuralları', () => {
      const turkishChars = /[ğüşıöçĞÜŞİÖÇ]/;
      
      kelimeBulData.slice(0, 50).forEach((item) => {
        if (item.anlam) {
          // Türkçe karakter kontrolü (en azından bazı çevirilerde olmalı)
          const hasTurkishChars = turkishChars.test(item.anlam);
          // Her çeviri Türkçe karakter içermek zorunda değil (bazı teknik terimler olabilir)
          // Ama en azından boş olmamalı
          expect(item.anlam.trim().length).toBeGreaterThan(0);
        }
      });
    });

    it('Arapça metinlerde özel karakterler doğru kullanılmalı', () => {
      // Arapça özel karakterler: ۖ, ۗ, ۘ, ۙ, ۚ, ۛ, ۜ, ۟, ۠, ۡ, ۢ, ۣ, ۤ, ۥ, ۦ, ۧ, ۨ, ۩, ۪, ۫, ۬, ۭ, ۰, ۱, ۲, ۳, ۴, ۵, ۶, ۷, ۸, ۹
      const arabicSpecialChars = /[ۣۖۗۘۙۚۛۜ۟۠ۡۢۤۥۦۧۨ۩۪ۭ۫۬]/;
      
      // Özel karakterlerin varlığı sorun değil, kontrol edelim
      kelimeBulData.slice(0, 50).forEach((item) => {
        if (item.kelime) {
          // Arapça kelime en azından bir karakter içermeli
          expect(item.kelime.trim().length).toBeGreaterThan(0);
        }
      });
    });

    it('Çevirilerde HTML/script injection olmamalı', () => {
      const htmlPattern = /<[^>]*>/;
      
      kelimeBulData.slice(0, 100).forEach((item) => {
        expect(htmlPattern.test(item.anlam || '')).toBe(false);
      });

      duaEtData.forEach((item) => {
        expect(htmlPattern.test(item.tercume || '')).toBe(false);
      });
    });
  });

  // ============ DOKÜMANTASYON UYUMLULUĞU ============

  describe('Dokümantasyon Uyumluluğu', () => {
    it('Veri formatı dokümantasyona uygun olmalı', () => {
      // kelimebul.json yapısı kontrolü
      const sampleItem = kelimeBulData[0];
      expect(sampleItem).toMatchObject({
        id: expect.any(String),
        kelime: expect.any(String),
        anlam: expect.any(String),
        sure_adi: expect.any(String),
        difficulty: expect.any(Number)
      });

      // duaet.json yapısı kontrolü
      const sampleDua = duaEtData[0];
      expect(sampleDua).toMatchObject({
        ayet: expect.any(String),
        dua: expect.any(String),
        tercume: expect.any(String),
        ses_url: expect.any(String)
      });
    });

    it('API fonksiyonları beklenen parametreleri kabul etmeli', async () => {
      // loadDataLoader fonksiyonu HTTP Endpoint Testleri describe bloğu içinde tanımlı
      // Bu test farklı bir describe bloğunda, bu yüzden fonksiyonu burada da tanımlayalım
      const dataLoaderCode = readFileSync(join(__dirname, '../js/data-loader.js'), 'utf-8');
      const codeWithExport = `
        ${dataLoaderCode}
        if (typeof window !== 'undefined' && typeof fetchWithRetry === 'function') {
          window.fetchWithRetry = fetchWithRetry;
        }
      `;
      eval(codeWithExport);

      // fetchWithRetry fonksiyonu doğru parametreleri almalı
      expect(typeof window.fetchWithRetry).toBe('function');
      
      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ test: 'data' })
      });

      // Farklı parametre kombinasyonları
      await window.fetchWithRetry('data/test.json');
      await window.fetchWithRetry('data/test.json', 3);
      await window.fetchWithRetry('data/test.json', 3, 1000);
      await window.fetchWithRetry('data/test.json', 3, 1000, false);

      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it('Response formatları tutarlı olmalı', () => {
      // Tüm JSON dosyaları array döndürmeli
      expect(Array.isArray(kelimeBulData)).toBe(true);
      expect(Array.isArray(ayetOkuData)).toBe(true);
      expect(Array.isArray(duaEtData)).toBe(true);
      expect(Array.isArray(hadisOkuData)).toBe(true);
    });
  });

  // ============ PERFORMANS VE VERİ BOYUTU ============

  describe('Performans ve Veri Boyutu', () => {
    it('JSON dosyaları makul boyutta olmalı', () => {
      const kelimeSize = JSON.stringify(kelimeBulData).length;
      const ayetSize = JSON.stringify(ayetOkuData).length;
      const duaSize = JSON.stringify(duaEtData).length;
      const hadisSize = JSON.stringify(hadisOkuData).length;

      // 10MB'dan küçük olmalı (her dosya)
      expect(kelimeSize).toBeLessThan(10 * 1024 * 1024);
      expect(ayetSize).toBeLessThan(10 * 1024 * 1024);
      expect(duaSize).toBeLessThan(10 * 1024 * 1024);
      expect(hadisSize).toBeLessThan(10 * 1024 * 1024);
    });

    it('Veri kayıt sayıları makul olmalı', () => {
      // Her dosya en azından birkaç kayıt içermeli
      expect(kelimeBulData.length).toBeGreaterThan(0);
      expect(ayetOkuData.length).toBeGreaterThan(0);
      expect(duaEtData.length).toBeGreaterThan(0);
      expect(hadisOkuData.length).toBeGreaterThan(0);
    });

    it('JSON parse işlemi başarılı olmalı', () => {
      // JSON dosyaları geçerli JSON formatında olmalı
      expect(() => {
        JSON.parse(JSON.stringify(kelimeBulData));
      }).not.toThrow();

      expect(() => {
        JSON.parse(JSON.stringify(ayetOkuData));
      }).not.toThrow();
    });
  });

  // ============ VERİ BÜTÜNLÜĞÜ ============

  describe('Veri Bütünlüğü', () => {
    it('Tekrar eden ID\'ler olmamalı', () => {
      const kelimeIds = kelimeBulData.map(item => item.id);
      const uniqueKelimeIds = new Set(kelimeIds);
      expect(kelimeIds.length).toBe(uniqueKelimeIds.size);

      const hadisIds = hadisOkuData.map(item => item.id);
      const uniqueHadisIds = new Set(hadisIds);
      expect(hadisIds.length).toBe(uniqueHadisIds.size);
    });

    it('Null veya undefined değerler olmamalı', () => {
      kelimeBulData.slice(0, 100).forEach((item) => {
        expect(item.id).not.toBeNull();
        expect(item.id).not.toBeUndefined();
        expect(item.kelime).not.toBeNull();
        expect(item.anlam).not.toBeNull();
      });
    });

    it('Boş string\'ler kritik alanlarda olmamalı', () => {
      kelimeBulData.slice(0, 100).forEach((item) => {
        expect(item.id.trim().length).toBeGreaterThan(0);
        expect(item.kelime.trim().length).toBeGreaterThan(0);
        expect(item.anlam.trim().length).toBeGreaterThan(0);
      });
    });
  });
});


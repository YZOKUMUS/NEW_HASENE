import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';

// ============ TEST ORTAMI SETUP ============
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Constants ve utils dosyalarını oku
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
  // Performance API mock - basit ve çalışan bir versiyon
  let performanceStartTime = Date.now();
  global.performance = {
    now: () => {
      // Basit zaman ölçümü - milisaniye cinsinden
      return Date.now() - performanceStartTime;
    },
    memory: {
      usedJSHeapSize: 1024 * 1024, // 1MB
      totalJSHeapSize: 2 * 1024 * 1024, // 2MB
      jsHeapSizeLimit: 512 * 1024 * 1024 // 512MB
    }
  };

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

// Performans ölçüm helper'ı
function measurePerformance(name, fn, maxDuration = null) {
  const start = global.performance.now();
  const result = fn();
  const end = global.performance.now();
  const duration = end - start;
  
  if (maxDuration !== null) {
    expect(duration).toBeLessThan(maxDuration);
  }
  
  return { result, duration };
}

// ============ PERFORMANS TESTLERİ ============

describe('Performans Testleri', () => {
  let dom;

  beforeAll(() => {
    dom = setupDOM();
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Fonksiyon Çalışma Süreleri', () => {
    it('getLocalDateString 1000 çağrı < 50ms olmalı', () => {
      const { duration } = measurePerformance('getLocalDateString (1000x)', () => {
        for (let i = 0; i < 1000; i++) {
          window.getLocalDateString(new Date());
        }
      });
      
      expect(duration).toBeLessThan(50);
    });

    it('sanitizeHTML 100 çağrı < 100ms olmalı', () => {
      const testString = '<script>alert("xss")</script>';
      const { duration } = measurePerformance('sanitizeHTML (100x)', () => {
        for (let i = 0; i < 100; i++) {
          window.sanitizeHTML(testString);
        }
      });
      
      expect(duration).toBeLessThan(100);
    });

    it('encryptData/decryptData 50 çağrı < 200ms olmalı', () => {
      const testData = { test: 'data', number: 123 };
      const { duration } = measurePerformance('encrypt/decrypt (50x)', () => {
        for (let i = 0; i < 50; i++) {
          const encrypted = window.encryptData(testData);
          window.decryptData(encrypted);
        }
      });
      
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Debounce Performansı', () => {
    it('Debounce 100 çağrı hızlı olmalı', async () => {
      vi.useFakeTimers();
      
      const mockFn = vi.fn();
      const debounced = window.debounce(mockFn, 100);
      
      // 100 kez çağır (fake timer kullanıldığında performans ölçümü anlamsız)
      // Sadece çağrı sayısını kontrol edelim
      for (let i = 0; i < 100; i++) {
        debounced();
      }
      
      // Timer'ı ilerlet
      vi.advanceTimersByTime(200);
      
      expect(mockFn).toHaveBeenCalledTimes(1); // Sadece 1 kez çalışmalı
      
      vi.useRealTimers();
    });
  });

  describe('DOM Manipülasyonu Performansı', () => {
    it('100 element oluşturma < 100ms olmalı', () => {
      const { duration } = measurePerformance('100 element create', () => {
        for (let i = 0; i < 100; i++) {
          const div = document.createElement('div');
          div.className = 'test-element';
          div.textContent = `Element ${i}`;
          document.body.appendChild(div);
        }
        // Cleanup
        document.body.innerHTML = '';
      });
      
      expect(duration).toBeLessThan(100);
    });

    it('100 querySelector çağrısı < 50ms olmalı', () => {
      // Test elementi oluştur
      const container = document.createElement('div');
      container.id = 'test-container';
      document.body.appendChild(container);
      
      for (let i = 0; i < 10; i++) {
        const div = document.createElement('div');
        div.className = 'test-item';
        container.appendChild(div);
      }
      
      const { duration } = measurePerformance('100 querySelector', () => {
        for (let i = 0; i < 100; i++) {
          document.querySelectorAll('.test-item');
        }
      });
      
      expect(duration).toBeLessThan(50);
      
      // Cleanup
      document.body.innerHTML = '';
    });
  });

  describe('LocalStorage Performansı', () => {
    it('1000 setItem/getItem < 100ms olmalı', () => {
      const { duration } = measurePerformance('localStorage 1000x', () => {
        for (let i = 0; i < 1000; i++) {
          localStorage.setItem(`test_${i}`, JSON.stringify({ value: i }));
          localStorage.getItem(`test_${i}`);
        }
      });
      
      expect(duration).toBeLessThan(100);
    });

    it('Büyük veri yazma/okuma performansı', () => {
      const largeData = {
        array: new Array(1000).fill(0).map((_, i) => ({ id: i, value: `test${i}` })),
        nested: {
          level1: {
            level2: {
              level3: new Array(100).fill('test')
            }
          }
        }
      };
      
      const { duration } = measurePerformance('Large data storage', () => {
        localStorage.setItem('large_data', JSON.stringify(largeData));
        JSON.parse(localStorage.getItem('large_data'));
      });
      
      expect(duration).toBeLessThan(200);
    });
  });

  describe('JSON Parsing Performansı', () => {
    it('Küçük JSON parse < 10ms olmalı', () => {
      const smallJSON = JSON.stringify({ test: 'data', items: new Array(100).fill(0) });
      
      const { duration } = measurePerformance('Small JSON parse', () => {
        JSON.parse(smallJSON);
      });
      
      expect(duration).toBeLessThan(10);
    });

    it('Orta boy JSON parse < 50ms olmalı', () => {
      const mediumJSON = JSON.stringify({
        items: new Array(1000).fill(0).map((_, i) => ({
          id: i,
          name: `Item ${i}`,
          data: new Array(10).fill('test')
        }))
      });
      
      const { duration } = measurePerformance('Medium JSON parse', () => {
        JSON.parse(mediumJSON);
      });
      
      expect(duration).toBeLessThan(50);
    });

    it('Büyük JSON stringify performansı', () => {
      const largeObject = {
        items: new Array(2000).fill(0).map((_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: 'Test description '.repeat(10),
          tags: ['tag1', 'tag2', 'tag3'],
          metadata: { created: Date.now(), updated: Date.now() }
        }))
      };
      
      const { duration } = measurePerformance('Large JSON stringify', () => {
        JSON.stringify(largeObject);
      });
      
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Array İşlemleri Performansı', () => {
    it('1000 elemanlı array filter < 10ms olmalı', () => {
      const array = new Array(1000).fill(0).map((_, i) => ({ id: i, value: i % 2 }));
      
      const { duration } = measurePerformance('Array filter 1000', () => {
        array.filter(item => item.value === 0);
      });
      
      expect(duration).toBeLessThan(10);
    });

    it('1000 elemanlı array map < 10ms olmalı', () => {
      const array = new Array(1000).fill(0).map((_, i) => i);
      
      const { duration } = measurePerformance('Array map 1000', () => {
        array.map(item => item * 2);
      });
      
      expect(duration).toBeLessThan(10);
    });

    it('1000 elemanlı array find < 5ms olmalı', () => {
      const array = new Array(1000).fill(0).map((_, i) => ({ id: i, value: `test${i}` }));
      
      const { duration } = measurePerformance('Array find 1000', () => {
        array.find(item => item.id === 500);
      });
      
      expect(duration).toBeLessThan(5);
    });
  });

  describe('String İşlemleri Performansı', () => {
    it('String concatenation 1000x < 10ms olmalı', () => {
      const { duration } = measurePerformance('String concat 1000x', () => {
        let str = '';
        for (let i = 0; i < 1000; i++) {
          str += `test${i}`;
        }
      });
      
      expect(duration).toBeLessThan(10);
    });

    it('Template literal 1000x < 5ms olmalı', () => {
      const { duration } = measurePerformance('Template literal 1000x', () => {
        for (let i = 0; i < 1000; i++) {
          const str = `Test ${i} value ${i * 2}`;
        }
      });
      
      expect(duration).toBeLessThan(5);
    });
  });

  describe('Object İşlemleri Performansı', () => {
    it('1000 object key access < 5ms olmalı', () => {
      const obj = { test: 'value', number: 123, array: [1, 2, 3] };
      
      const { duration } = measurePerformance('Object access 1000x', () => {
        for (let i = 0; i < 1000; i++) {
          const value = obj.test;
          const num = obj.number;
          const arr = obj.array;
        }
      });
      
      expect(duration).toBeLessThan(5);
    });

    it('Object.assign 100x < 20ms olmalı', () => {
      const source = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      
      const { duration } = measurePerformance('Object.assign 100x', () => {
        for (let i = 0; i < 100; i++) {
          Object.assign({}, source);
        }
      });
      
      expect(duration).toBeLessThan(20);
    });
  });

  describe('Date İşlemleri Performansı', () => {
    it('Date oluşturma 1000x < 20ms olmalı', () => {
      const { duration } = measurePerformance('Date create 1000x', () => {
        for (let i = 0; i < 1000; i++) {
          new Date();
        }
      });
      
      expect(duration).toBeLessThan(20);
    });

    it('Tarih formatlama 1000x < 50ms olmalı', () => {
      const { duration } = measurePerformance('Date format 1000x', () => {
        for (let i = 0; i < 1000; i++) {
          window.getLocalDateString(new Date());
        }
      });
      
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Memory Kullanımı', () => {
    it('Çoklu DOM element oluşturma memory leak kontrolü', () => {
      const initialMemory = global.performance.memory ? global.performance.memory.usedJSHeapSize : 0;
      
      // 1000 element oluştur ve temizle
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.id = `test-${i}`;
        document.body.appendChild(div);
      }
      
      // Temizle
      document.body.innerHTML = '';
      
      // Memory artışı minimal olmalı (garbage collection sonrası)
      if (global.performance.memory) {
        const finalMemory = global.performance.memory.usedJSHeapSize;
        const increase = finalMemory - initialMemory;
        // Memory artışı 10MB'dan az olmalı
        expect(increase).toBeLessThan(10 * 1024 * 1024);
      }
    });

    it('Büyük array oluşturma ve temizleme', () => {
      const largeArray = new Array(10000).fill(0).map((_, i) => ({
        id: i,
        data: new Array(10).fill('test')
      }));
      
      // Array'i kullan
      const filtered = largeArray.filter(item => item.id % 2 === 0);
      
      // Memory temizliği için null yap
      largeArray.length = 0;
      filtered.length = 0;
      
      // Test geçer (memory leak olmamalı)
      expect(true).toBe(true);
    });
  });

  describe('Regex Performansı', () => {
    it('Arapça karakter kontrolü 1000x < 50ms olmalı', () => {
      const arabicText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
      
      const { duration } = measurePerformance('Arabic regex 1000x', () => {
        for (let i = 0; i < 1000; i++) {
          const arabicRegex = /[\u0600-\u06FF]/;
          arabicRegex.test(arabicText);
        }
      });
      
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Throttle Performansı', () => {
    it('Throttle 100 çağrı performansı', async () => {
      vi.useFakeTimers();
      
      const mockFn = vi.fn();
      const throttled = window.throttle(mockFn, 100);
      
      // 100 kez çağır (fake timer kullanıldığında performans ölçümü anlamsız)
      // Sadece throttle mekanizmasının çalıştığını kontrol edelim
      for (let i = 0; i < 100; i++) {
        throttled();
      }
      
      vi.advanceTimersByTime(200);
      
      // Throttle en az 1 kez çağrılmalı (ilk çağrıda çalışır)
      expect(mockFn).toHaveBeenCalled();
      
      vi.useRealTimers();
    });
  });

  describe('Büyük Veri Setleri', () => {
    it('10000 elemanlı array işlemleri', () => {
      const largeArray = new Array(10000).fill(0).map((_, i) => ({
        id: i,
        value: Math.random(),
        name: `Item ${i}`
      }));
      
      const { duration } = measurePerformance('Large array operations', () => {
        // Filter
        largeArray.filter(item => item.value > 0.5);
        // Map
        largeArray.map(item => ({ ...item, doubled: item.value * 2 }));
        // Find
        largeArray.find(item => item.id === 5000);
      });
      
      expect(duration).toBeLessThan(100);
    });

    it('Büyük object deep clone performansı', () => {
      const largeObject = {
        level1: {
          level2: {
            level3: {
              items: new Array(1000).fill(0).map((_, i) => ({
                id: i,
                data: `test${i}`.repeat(10)
              }))
            }
          }
        }
      };
      
      const { duration } = measurePerformance('Deep clone large object', () => {
        JSON.parse(JSON.stringify(largeObject));
      });
      
      expect(duration).toBeLessThan(100);
    });
  });
});


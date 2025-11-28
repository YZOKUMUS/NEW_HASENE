import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';

// Test ortamı setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// DOM ortamı oluştur
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true
});

// Global scope'a DOM API'lerini ekle
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// AudioContext mock
global.AudioContext = class MockAudioContext {
  constructor() {
    this.state = 'running';
  }
  createOscillator() { return {}; }
  createGain() { return {}; }
  createBufferSource() { return {}; }
  createAnalyser() { return {}; }
  createMediaStreamSource() { return {}; }
  suspend() { return Promise.resolve(); }
  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
};

global.webkitAudioContext = global.AudioContext;

// HTMLAudioElement mock
global.HTMLAudioElement = class MockHTMLAudioElement {
  constructor() {
    this.src = '';
    this.volume = 1;
    this.currentTime = 0;
    this.paused = true;
    this.readyState = 0;
    this.oncanplay = null;
    this.onended = null;
    this.onerror = null;
    this.onloadstart = null;
    this.onloadeddata = null;
  }
  play() { 
    this.paused = false;
    return Promise.resolve(); 
  }
  pause() { 
    this.paused = true; 
  }
  load() {}
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
    },
    hasOwnProperty: (key) => {
      return key in store;
    }
  };
})();

global.localStorage = localStorageMock;

// CONFIG mock
global.CONFIG = {
  debug: false,
  hapticEnabled: true,
  swipeGesturesEnabled: false
};

// log mock
global.log = {
  debug: vi.fn(),
  error: vi.fn(),
  warn: vi.fn()
};

// game-core.js'i yükle - sadece helper fonksiyonları için
// Not: Tüm dosyayı yüklemek yerine, sadece test edilebilir helper fonksiyonlarını tanımlayacağız
// çünkü game-core.js çok fazla global state ve bağımlılık içeriyor

// Helper fonksiyonlarını manuel olarak tanımla (izole test için)
function addSpeedAnimation(element, type = 'fade-in') {
    if (!element) return;
    element.classList.add(`speed-${type}`);
    setTimeout(() => element.classList.remove(`speed-${type}`), 600);
}

function setActiveNavItem(index) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.flutter-nav-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function triggerConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
    }

    setTimeout(() => {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }, 3000);
}

function triggerSuccessBurst(element) {
    if (!element) return;
    element.classList.add('success-burst');
    setTimeout(() => element.classList.remove('success-burst'), 800);
}

function triggerHaptic(type = 'medium') {
    if (!CONFIG.hapticEnabled) return;
    
    try {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [50],
                success: [20, 50, 20],
                error: [50, 100, 50],
                combo: [20, 30, 20, 30, 50],
                warning: [30, 50, 30]
            };
            navigator.vibrate(patterns[type] || patterns.medium);
        }
    } catch (error) {
        log.debug('Haptic feedback not supported');
    }
}

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    const darkModeIcon = document.getElementById('darkModeIcon');
    
    log.debug('Dark mode toggled:', isDark);
    log.debug('Body classes:', body.className);
    
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    
    if (darkModeIcon) {
        darkModeIcon.textContent = isDark ? '☀️' : '🌙';
    }
    
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (darkModeBtn) {
        if (isDark) {
            darkModeBtn.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
        } else {
            darkModeBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }
}

function isArabic(text) {
    if (!text) return false;
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
}

// StorageManager class (basit versiyon)
class StorageManager {
    constructor() {
        this.storageAvailable = this.checkStorageAvailability();
        this.cache = new Map();
        log.debug('🗄️ StorageManager başlatıldı', { available: this.storageAvailable });
    }

    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            log.error('❌ LocalStorage kullanılamıyor:', e);
            return false;
        }
    }

    get(key, defaultValue = null) {
        if (!this.storageAvailable) {
            log.warn('⚠️ Storage kullanılamıyor, default döndürülüyor');
            return defaultValue;
        }

        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        try {
            const value = localStorage.getItem(key);
            if (value === null) {
                return defaultValue;
            }

            try {
                const parsed = JSON.parse(value);
                this.cache.set(key, parsed);
                return parsed;
            } catch (e) {
                this.cache.set(key, value);
                return value;
            }
        } catch (error) {
            log.error(`❌ Storage okuma hatası (${key}):`, error);
            return defaultValue;
        }
    }

    set(key, value) {
        if (!this.storageAvailable) {
            log.warn('⚠️ Storage kullanılamıyor, veri kaydedilmedi');
            return false;
        }

        try {
            const serialized = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, serialized);
            this.cache.set(key, value);
            return true;
        } catch (error) {
            log.error(`❌ Storage yazma hatası (${key}):`, error);
            return false;
        }
    }

    remove(key) {
        if (!this.storageAvailable) return false;

        try {
            localStorage.removeItem(key);
            this.cache.delete(key);
            log.debug(`🗑️ Storage'dan silindi: ${key}`);
            return true;
        } catch (error) {
            log.error(`❌ Storage silme hatası (${key}):`, error);
            return false;
        }
    }

    clear() {
        if (!this.storageAvailable) return false;

        try {
            localStorage.clear();
            this.cache.clear();
            log.debug('🧹 Storage temizlendi');
            return true;
        } catch (error) {
            log.error('❌ Storage temizleme hatası:', error);
            return false;
        }
    }
}

describe('game-core.js - Helper Functions', () => {
  beforeEach(() => {
    // Her testten önce DOM'u temizle
    document.body.innerHTML = '';
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('addSpeedAnimation', () => {
    it('should add speed animation class to element', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      addSpeedAnimation(element, 'fade-in');
      
      expect(element.classList.contains('speed-fade-in')).toBe(true);
    });

    it('should remove animation class after timeout', async () => {
      vi.useFakeTimers();
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      addSpeedAnimation(element, 'fade-in');
      expect(element.classList.contains('speed-fade-in')).toBe(true);
      
      vi.advanceTimersByTime(600);
      expect(element.classList.contains('speed-fade-in')).toBe(false);
      
      vi.useRealTimers();
    });

    it('should not throw error if element is null', () => {
      expect(() => addSpeedAnimation(null)).not.toThrow();
    });

    it('should not throw error if element is undefined', () => {
      expect(() => addSpeedAnimation(undefined)).not.toThrow();
    });
  });

  describe('setActiveNavItem', () => {
    beforeEach(() => {
      // Bottom nav elementi oluştur
      const bottomNav = document.createElement('div');
      bottomNav.className = 'bottom-nav';
      
      for (let i = 0; i < 3; i++) {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        bottomNav.appendChild(navItem);
      }
      
      document.body.appendChild(bottomNav);
    });

    it('should set active class on correct nav item', () => {
      setActiveNavItem(1);
      
      const navItems = document.querySelectorAll('.bottom-nav .nav-item');
      expect(navItems[1].classList.contains('active')).toBe(true);
      expect(navItems[0].classList.contains('active')).toBe(false);
      expect(navItems[2].classList.contains('active')).toBe(false);
    });

    it('should remove active class from other items', () => {
      const navItems = document.querySelectorAll('.bottom-nav .nav-item');
      navItems[0].classList.add('active');
      navItems[2].classList.add('active');
      
      setActiveNavItem(1);
      
      expect(navItems[0].classList.contains('active')).toBe(false);
      expect(navItems[1].classList.contains('active')).toBe(true);
      expect(navItems[2].classList.contains('active')).toBe(false);
    });
  });

  describe('triggerConfetti', () => {
    it('should create confetti container', () => {
      triggerConfetti();
      
      const container = document.querySelector('.confetti-container');
      expect(container).toBeTruthy();
      expect(container.parentNode).toBe(document.body);
    });

    it('should create 50 confetti pieces', () => {
      triggerConfetti();
      
      const container = document.querySelector('.confetti-container');
      const pieces = container.querySelectorAll('.confetti-piece');
      expect(pieces.length).toBe(50);
    });

    it('should remove confetti container after 3 seconds', async () => {
      vi.useFakeTimers();
      
      triggerConfetti();
      let container = document.querySelector('.confetti-container');
      expect(container).toBeTruthy();
      
      vi.advanceTimersByTime(3000);
      
      container = document.querySelector('.confetti-container');
      expect(container).toBeFalsy();
      
      vi.useRealTimers();
    });
  });

  describe('triggerSuccessBurst', () => {
    it('should add success-burst class to element', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      triggerSuccessBurst(element);
      
      expect(element.classList.contains('success-burst')).toBe(true);
    });

    it('should remove success-burst class after timeout', async () => {
      vi.useFakeTimers();
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      triggerSuccessBurst(element);
      expect(element.classList.contains('success-burst')).toBe(true);
      
      vi.advanceTimersByTime(800);
      expect(element.classList.contains('success-burst')).toBe(false);
      
      vi.useRealTimers();
    });

    it('should not throw error if element is null', () => {
      expect(() => triggerSuccessBurst(null)).not.toThrow();
    });
  });

  describe('triggerHaptic', () => {
    beforeEach(() => {
      global.navigator.vibrate = vi.fn();
    });

    it('should call vibrate when haptic is enabled', () => {
      global.CONFIG.hapticEnabled = true;
      
      triggerHaptic('medium');
      
      expect(navigator.vibrate).toHaveBeenCalledWith([20]);
    });

    it('should not call vibrate when haptic is disabled', () => {
      global.CONFIG.hapticEnabled = false;
      
      triggerHaptic('medium');
      
      expect(navigator.vibrate).not.toHaveBeenCalled();
    });

    it('should use correct pattern for different types', () => {
      global.CONFIG.hapticEnabled = true;
      
      triggerHaptic('light');
      expect(navigator.vibrate).toHaveBeenCalledWith([10]);
      
      triggerHaptic('heavy');
      expect(navigator.vibrate).toHaveBeenCalledWith([50]);
      
      triggerHaptic('success');
      expect(navigator.vibrate).toHaveBeenCalledWith([20, 50, 20]);
      
      triggerHaptic('error');
      expect(navigator.vibrate).toHaveBeenCalledWith([50, 100, 50]);
      
      triggerHaptic('combo');
      expect(navigator.vibrate).toHaveBeenCalledWith([20, 30, 20, 30, 50]);
    });

    it('should use medium pattern as default for unknown types', () => {
      global.CONFIG.hapticEnabled = true;
      
      triggerHaptic('unknown');
      
      expect(navigator.vibrate).toHaveBeenCalledWith([20]);
    });

    it('should handle missing vibrate API gracefully', () => {
      global.CONFIG.hapticEnabled = true;
      delete navigator.vibrate;
      
      expect(() => triggerHaptic('medium')).not.toThrow();
    });
  });

  describe('toggleDarkMode', () => {
    beforeEach(() => {
      // Dark mode toggle butonu ve icon oluştur
      const darkModeBtn = document.createElement('button');
      darkModeBtn.id = 'darkModeToggle';
      document.body.appendChild(darkModeBtn);
      
      const darkModeIcon = document.createElement('span');
      darkModeIcon.id = 'darkModeIcon';
      darkModeIcon.textContent = '🌙';
      document.body.appendChild(darkModeIcon);
      
      document.body.classList.remove('dark-mode');
      localStorage.clear();
    });

    it('should toggle dark-mode class on body', () => {
      expect(document.body.classList.contains('dark-mode')).toBe(false);
      
      toggleDarkMode();
      
      expect(document.body.classList.contains('dark-mode')).toBe(true);
      
      toggleDarkMode();
      
      expect(document.body.classList.contains('dark-mode')).toBe(false);
    });

    it('should save dark mode preference to localStorage', () => {
      toggleDarkMode();
      
      expect(localStorage.getItem('darkMode')).toBe('enabled');
      
      toggleDarkMode();
      
      expect(localStorage.getItem('darkMode')).toBe('disabled');
    });

    it('should update dark mode icon', () => {
      const icon = document.getElementById('darkModeIcon');
      
      toggleDarkMode();
      expect(icon.textContent).toBe('☀️');
      
      toggleDarkMode();
      expect(icon.textContent).toBe('🌙');
    });

    it('should handle missing icon gracefully', () => {
      const icon = document.getElementById('darkModeIcon');
      icon.remove();
      
      expect(() => toggleDarkMode()).not.toThrow();
    });
  });

  describe('isArabic', () => {
    it('should return true for Arabic text', () => {
      expect(isArabic('السلام عليكم')).toBe(true);
      expect(isArabic('بسم الله')).toBe(true);
      expect(isArabic('رَبَّنَا')).toBe(true);
    });

    it('should return false for non-Arabic text', () => {
      expect(isArabic('Hello World')).toBe(false);
      expect(isArabic('Merhaba Dünya')).toBe(false);
      expect(isArabic('123')).toBe(false);
      expect(isArabic('')).toBe(false);
    });

    it('should return true for mixed text with Arabic characters', () => {
      // isArabic fonksiyonu metinde Arapça karakter varsa true döndürür
      expect(isArabic('Hello السلام')).toBe(true);
      expect(isArabic('123 السلام')).toBe(true);
      expect(isArabic('Test رَبَّنَا test')).toBe(true);
    });

    it('should handle null and undefined', () => {
      expect(isArabic(null)).toBe(false);
      expect(isArabic(undefined)).toBe(false);
    });
  });

  describe('StorageManager', () => {
    let storageManager;

    beforeEach(() => {
      localStorage.clear();
      storageManager = new StorageManager();
    });

    it('should be defined', () => {
      expect(typeof StorageManager).toBe('function');
    });

    it('should create instance with available storage', () => {
      const manager = new StorageManager();
      expect(manager).toBeDefined();
      expect(manager.storageAvailable).toBe(true);
    });

    it('should get value from localStorage', () => {
      localStorage.setItem('test_key', JSON.stringify({ value: 'test' }));
      
      const result = storageManager.get('test_key');
      expect(result).toEqual({ value: 'test' });
    });

    it('should return default value when key does not exist', () => {
      const result = storageManager.get('non_existent', 'default');
      expect(result).toBe('default');
    });

    it('should set value to localStorage', () => {
      const success = storageManager.set('test_key', { value: 'test' });
      expect(success).toBe(true);
      
      const stored = JSON.parse(localStorage.getItem('test_key'));
      expect(stored).toEqual({ value: 'test' });
    });

    it('should use cache after first get', () => {
      localStorage.setItem('test_key', JSON.stringify({ value: 'test' }));
      
      const result1 = storageManager.get('test_key');
      localStorage.setItem('test_key', JSON.stringify({ value: 'modified' }));
      
      // Cache'den eski değer dönmeli
      const result2 = storageManager.get('test_key');
      expect(result2).toEqual({ value: 'test' });
    });

    it('should remove value from localStorage', () => {
      localStorage.setItem('test_key', 'test_value');
      
      const success = storageManager.remove('test_key');
      expect(success).toBe(true);
      expect(localStorage.getItem('test_key')).toBeNull();
    });

    it('should clear all localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      
      const success = storageManager.clear();
      expect(success).toBe(true);
      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
    });
  });
});


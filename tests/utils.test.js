import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';

// constants.js ve utils.js dosyalarını oku
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const constantsCode = readFileSync(join(__dirname, '../js/constants.js'), 'utf-8');
const utilsCode = readFileSync(join(__dirname, '../js/utils.js'), 'utf-8');

// DOM ortamı oluştur
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true
});

// Global scope'a DOM API'lerini ekle
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Test ortamı işareti
process.env.NODE_ENV = 'test';

// CONFIG ve log mock'ları
global.CONFIG = {
  debug: false,
  debugStats: false,
  debugElements: false,
  debugAudio: false,
  debugGameFlow: false,
  debugTest: false,
  showCriticalErrors: true,
  showWarnings: false,
  hapticEnabled: false,
  swipeGesturesEnabled: false
};

global.log = {
  error: console.error,
  warn: console.warn,
  debug: () => {}
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

// constants.js'i çalıştır (window.CONSTANTS için)
eval(constantsCode);

// utils.js'i çalıştır - fonksiyonları window objesine eklemek için
eval(utilsCode);

// Fonksiyonları window'dan al
const getLocalDateString = global.window.getLocalDateString;
const sanitizeHTML = global.window.sanitizeHTML;
const encryptData = global.window.encryptData;
const decryptData = global.window.decryptData;

describe('Utils Functions', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getLocalDateString', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = new Date('2024-01-15');
      const result = getLocalDateString(date);
      expect(result).toBe('2024-01-15');
    });

    it('should pad single digit months and days with zeros', () => {
      const date = new Date('2024-01-05');
      const result = getLocalDateString(date);
      expect(result).toBe('2024-01-05');
    });

    it('should use current date when no argument provided', () => {
      const result = getLocalDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('sanitizeHTML', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeHTML(null)).toBe('');
      expect(sanitizeHTML(undefined)).toBe('');
      expect(sanitizeHTML(123)).toBe('');
    });

    it('should handle normal text correctly', () => {
      const input = 'Hello World';
      const result = sanitizeHTML(input);
      expect(result).toBe('Hello World');
    });
  });

  describe('encryptData / decryptData', () => {
    it('should encrypt and decrypt data correctly', () => {
      const original = { test: 'data', number: 123 };
      const encrypted = encryptData(original);
      const decrypted = decryptData(encrypted);
      
      expect(decrypted).toEqual(original);
    });

    it('should handle string data', () => {
      const original = 'test string';
      const encrypted = encryptData(original);
      const decrypted = decryptData(encrypted);
      
      expect(decrypted).toBe(original);
    });

    it('should handle array data', () => {
      const original = [1, 2, 3, 'test'];
      const encrypted = encryptData(original);
      const decrypted = decryptData(encrypted);
      
      expect(decrypted).toEqual(original);
    });

    it('should return original data on encryption error', () => {
      const circular = {};
      circular.self = circular;
      
      const result = encryptData(circular);
      expect(result).toBeDefined();
      expect(result).toBe(circular);
    });
  });
});

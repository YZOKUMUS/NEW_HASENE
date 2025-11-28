// Test helper - utils.js'i test ortamında yüklemek için
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';

// utils.js dosyasını oku
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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

// CONFIG ve log mock'ları
if (!global.CONFIG) {
  global.CONFIG = {
    debug: false,
    hapticEnabled: false,
    swipeGesturesEnabled: false
  };
}

if (!global.log) {
  global.log = {
    error: console.error,
    warn: console.warn,
    debug: () => {}
  };
}

// localStorage mock
if (!global.localStorage) {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  };
}

// utils.js'i çalıştır (fonksiyonları global scope'a yükler)
// Function constructor ile çalıştır
try {
  const func = new Function(utilsCode);
  func();
} catch (e) {
  console.error('Error loading utils.js:', e);
}

// Fonksiyonları export et
export const getLocalDateString = global.getLocalDateString;
export const sanitizeHTML = global.sanitizeHTML;
export const encryptData = global.encryptData;
export const decryptData = global.decryptData;










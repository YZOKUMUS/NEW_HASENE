// Vitest test setup dosyası
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';

// DOM temizleme
afterEach(() => {
  cleanup();
});

// Jest DOM matchers'ı ekle
expect.extend(matchers);

// Mock localStorage
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

// Mock window
global.window = {
  ...global.window,
  localStorage: localStorageMock
};

// Mock CONFIG
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

// Mock log
global.log = {
  debug: () => {},
  stats: () => {},
  elements: () => {},
  audio: () => {},
  game: () => {},
  error: console.error,
  warn: console.warn
};


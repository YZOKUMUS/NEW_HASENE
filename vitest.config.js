import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    testTimeout: 30000, // 30 saniye timeout (UI testleri için)
    // CommonJS modüllerini destekle
    server: {
      deps: {
        inline: ['../js/utils.js']
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
        'sw.js'
      ]
    }
  }
});


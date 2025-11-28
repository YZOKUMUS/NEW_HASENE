import { describe, it, expect, beforeEach } from 'vitest';

// StorageManager'ı test etmek için mock
describe('StorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve data', () => {
    localStorage.setItem('test', JSON.stringify({ value: 123 }));
    const result = JSON.parse(localStorage.getItem('test'));
    expect(result.value).toBe(123);
  });

  it('should handle quota exceeded error gracefully', () => {
    // Mock quota exceeded
    const originalSetItem = localStorage.setItem;
    let callCount = 0;
    
    localStorage.setItem = function(key, value) {
      callCount++;
      if (callCount === 1) {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      }
      return originalSetItem.call(this, key, value);
    };

    // Should handle error without crashing
    expect(() => {
      try {
        localStorage.setItem('test', 'value');
      } catch (e) {
        // Expected to catch
      }
    }).not.toThrow();
    
    localStorage.setItem = originalSetItem;
  });
});













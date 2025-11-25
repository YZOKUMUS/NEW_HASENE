import { describe, it, expect, beforeEach } from 'vitest';
import { getLocalDateString, sanitizeHTML, encryptData, decryptData } from '../js/utils.js';

describe('Utils Functions', () => {
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
      // Circular reference should cause error
      const circular = {};
      circular.self = circular;
      
      // Should not throw, should return original
      const result = encryptData(circular);
      expect(result).toBeDefined();
    });
  });
});


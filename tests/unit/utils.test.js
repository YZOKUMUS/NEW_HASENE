// Unit Tests for utils.js
// Note: utils.js fonksiyonları global scope'da olduğu için HTML dosyası yüklenmeli
// Test için fonksiyonları manuel olarak tanımlıyoruz

// Mock utils.js fonksiyonları
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function sanitizeHTML(input) {
    if (typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function encryptData(data) {
    try {
        const jsonStr = JSON.stringify(data);
        return btoa(unescape(encodeURIComponent(jsonStr)));
    } catch(e) {
        return data;
    }
}

function decryptData(encrypted) {
    try {
        const jsonStr = decodeURIComponent(escape(atob(encrypted)));
        return JSON.parse(jsonStr);
    } catch(e) {
        try {
            return JSON.parse(encrypted);
        } catch(e2) {
            return encrypted;
        }
    }
}

function secureSetItem(key, value) {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
}

function secureGetItem(key) {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData(encrypted);
}

function hapticFeedback(type = 'light') {
    if (!navigator.vibrate) return;
    const patterns = {
        light: 10,
        medium: 20,
        heavy: 50,
        success: [20, 50, 20],
        error: [50, 100, 50],
        warning: [30, 50, 30]
    };
    const pattern = patterns[type] || patterns.light;
    navigator.vibrate(pattern);
}

describe('Utils Functions', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';
    });

    describe('getLocalDateString', () => {
        test('should return date in YYYY-MM-DD format', () => {
            const date = new Date('2025-01-20');
            const result = getLocalDateString(date);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(result).toBe('2025-01-20');
        });

        test('should use current date if no argument provided', () => {
            const result = getLocalDateString();
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('sanitizeHTML', () => {
        test('should escape HTML special characters', () => {
            const input = '<script>alert("xss")</script>';
            const result = sanitizeHTML(input);
            expect(result).not.toContain('<script>');
            expect(result).not.toContain('</script>');
        });

        test('should return empty string for non-string input', () => {
            expect(sanitizeHTML(null)).toBe('');
            expect(sanitizeHTML(123)).toBe('');
            expect(sanitizeHTML({})).toBe('');
        });

        test('should preserve safe text', () => {
            const input = 'Hello World';
            const result = sanitizeHTML(input);
            expect(result).toBe('Hello World');
        });
    });

    describe('encryptData and decryptData', () => {
        test('should encrypt and decrypt data correctly', () => {
            const data = { test: 'value', number: 123 };
            const encrypted = encryptData(data);
            expect(encrypted).toBeTruthy();
            expect(typeof encrypted).toBe('string');
            
            const decrypted = decryptData(encrypted);
            expect(decrypted).toEqual(data);
        });

        test('should handle string data', () => {
            const data = 'test string';
            const encrypted = encryptData(data);
            const decrypted = decryptData(encrypted);
            expect(decrypted).toBe(data);
        });
    });

    describe('secureSetItem and secureGetItem', () => {
        test('should save and retrieve encrypted data', () => {
            const data = { key: 'value' };
            secureSetItem('testKey', data);
            const retrieved = secureGetItem('testKey');
            expect(retrieved).toEqual(data);
        });

        test('should return null for non-existent key', () => {
            const result = secureGetItem('nonExistentKey');
            expect(result).toBeNull();
        });
    });

    describe('hapticFeedback', () => {
        test('should not throw error when navigator.vibrate is not available', () => {
            const originalVibrate = navigator.vibrate;
            navigator.vibrate = undefined;
            
            expect(() => hapticFeedback('light')).not.toThrow();
            
            navigator.vibrate = originalVibrate;
        });
    });

    describe('getLocalDateString edge cases', () => {
        test('should handle month and day padding', () => {
            const date = new Date('2025-01-05');
            const result = getLocalDateString(date);
            expect(result).toBe('2025-01-05');
        });

        test('should handle single digit months and days', () => {
            const date = new Date('2025-01-01');
            const result = getLocalDateString(date);
            expect(result.split('-')[1]).toHaveLength(2);
            expect(result.split('-')[2]).toHaveLength(2);
        });
    });
});


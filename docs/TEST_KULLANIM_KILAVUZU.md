# 🧪 Test Altyapısı Kullanım Kılavuzu

## 📋 Genel Bakış

Projede iki tür test altyapısı var:
1. **Jest** - Unit testler (JavaScript fonksiyonları için)
2. **Playwright** - E2E testler (Tarayıcı testleri için)

---

## 🚀 Hızlı Başlangıç

### 1. Testleri Çalıştırma

```bash
# Tüm unit testleri çalıştır
npm test

# Testleri watch mode'da çalıştır (değişiklikleri otomatik test eder)
npm run test:watch

# Test coverage raporu al
npm run test:coverage

# E2E testleri çalıştır
npm run test:e2e

# E2E testleri UI modunda çalıştır (görsel arayüz)
npm run test:e2e:ui
```

---

## 📝 Unit Testler (Jest)

### Test Dosyası Yapısı

Unit testler `tests/unit/` klasöründe veya `js/` klasöründe `*.test.js` veya `*.spec.js` uzantılı dosyalarda olmalı.

### Örnek Test Dosyası

```javascript
// tests/unit/utils.test.js
describe('Utils Functions', () => {
    beforeEach(() => {
        // Her testten önce çalışır
        localStorage.clear();
    });

    test('should sanitize HTML input', () => {
        // Test kodunuz buraya
        const result = sanitizeHTML('<script>alert("xss")</script>');
        expect(result).not.toContain('<script>');
    });

    test('should calculate score correctly', () => {
        const score = calculateScore(5, 'orta');
        expect(score).toBe(25);
    });
});
```

### Jest Komutları

```bash
# Tüm testleri çalıştır
npm test

# Sadece belirli bir dosyayı test et
npm test -- tests/unit/utils.test.js

# Watch mode (değişiklikleri otomatik test eder)
npm run test:watch

# Coverage raporu
npm run test:coverage
# Rapor: coverage/index.html dosyasında açılır
```

### Test Yazma Örnekleri

#### 1. Basit Fonksiyon Testi

```javascript
// js/utils.js içinde bir fonksiyon olduğunu varsayalım
export function add(a, b) {
    return a + b;
}

// tests/unit/utils.test.js
import { add } from '../../js/utils.js';

describe('add function', () => {
    test('should add two numbers', () => {
        expect(add(2, 3)).toBe(5);
    });

    test('should handle negative numbers', () => {
        expect(add(-1, 1)).toBe(0);
    });
});
```

#### 2. localStorage Testi

```javascript
describe('localStorage functions', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should save and retrieve data', () => {
        localStorage.setItem('test', 'value');
        expect(localStorage.getItem('test')).toBe('value');
    });
});
```

#### 3. DOM Manipülasyonu Testi

```javascript
describe('DOM functions', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="test">Hello</div>';
    });

    test('should update element text', () => {
        const element = document.getElementById('test');
        element.textContent = 'World';
        expect(element.textContent).toBe('World');
    });
});
```

---

## 🌐 E2E Testler (Playwright)

### Test Dosyası Yapısı

E2E testler `tests/e2e/` klasöründe `*.spec.js` uzantılı dosyalarda olmalı.

### Örnek E2E Test

```javascript
// tests/e2e/main-menu.spec.js
import { test, expect } from '@playwright/test';

test.describe('Main Menu', () => {
    test('should display main menu on load', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#mainMenu')).toBeVisible();
    });

    test('should show game cards', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#kelimeCevirBtn')).toBeVisible();
    });
});
```

### Playwright Komutları

```bash
# Tüm E2E testleri çalıştır
npm run test:e2e

# UI modunda çalıştır (görsel arayüz)
npm run test:e2e:ui

# Sadece Chrome'da test et
npm run test:e2e -- --project=chromium

# Belirli bir dosyayı test et
npm run test:e2e -- tests/e2e/main-menu.spec.js
```

### E2E Test Yazma Örnekleri

#### 1. Sayfa Yükleme Testi

```javascript
test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Hasene/);
});
```

#### 2. Buton Tıklama Testi

```javascript
test('should navigate to game when button clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('#kelimeCevirBtn');
    // Oyun ekranının görünür olduğunu kontrol et
    await expect(page.locator('#gameScreen')).toBeVisible();
});
```

#### 3. Form Doldurma Testi

```javascript
test('should fill and submit form', async ({ page }) => {
    await page.goto('/');
    await page.fill('#inputField', 'test value');
    await page.click('#submitBtn');
    await expect(page.locator('.success-message')).toBeVisible();
});
```

#### 4. Dark Mode Testi

```javascript
test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    const darkModeBtn = page.locator('#darkModeToggle');
    
    // Dark mode'u aç
    await darkModeBtn.click();
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
    
    // Dark mode'u kapat
    await darkModeBtn.click();
    await expect(page.locator('body')).not.toHaveClass(/dark-mode/);
});
```

---

## 📊 Test Coverage

### Coverage Raporu Alma

```bash
npm run test:coverage
```

Bu komut:
- Test coverage raporu oluşturur
- `coverage/` klasöründe HTML raporu oluşturur
- Terminal'de özet gösterir

### Coverage Raporunu Görüntüleme

```bash
# Coverage raporunu tarayıcıda aç
# Windows
start coverage/index.html

# Mac/Linux
open coverage/index.html
```

---

## 🛠️ Yeni Test Dosyası Oluşturma

### Unit Test Oluşturma

1. `tests/unit/` klasöründe yeni dosya oluştur:
   ```bash
   # Örnek: tests/unit/score-system.test.js
   ```

2. Test kodunu yaz:
   ```javascript
   describe('Score System', () => {
       test('should calculate score', () => {
           // Test kodunuz
       });
   });
   ```

3. Testi çalıştır:
   ```bash
   npm test
   ```

### E2E Test Oluşturma

1. `tests/e2e/` klasöründe yeni dosya oluştur:
   ```bash
   # Örnek: tests/e2e/game-flow.spec.js
   ```

2. Test kodunu yaz:
   ```javascript
   import { test, expect } from '@playwright/test';

   test.describe('Game Flow', () => {
       test('should complete game session', async ({ page }) => {
           // Test kodunuz
       });
   });
   ```

3. Testi çalıştır:
   ```bash
   npm run test:e2e
   ```

---

## 🎯 Test Senaryoları Örnekleri

### 1. Score System Testi

```javascript
// tests/unit/score-system.test.js
describe('Score System', () => {
    test('should calculate hasene correctly', () => {
        const hasene = calculateHasene(5, 'orta');
        expect(hasene).toBe(25);
    });

    test('should apply combo bonus', () => {
        const score = calculateComboBonus(5);
        expect(score).toBe(25);
    });
});
```

### 2. Game Flow E2E Testi

```javascript
// tests/e2e/game-flow.spec.js
import { test, expect } from '@playwright/test';

test.describe('Game Flow', () => {
    test('should complete kelime cevir game', async ({ page }) => {
        await page.goto('/');
        
        // Oyunu başlat
        await page.click('#kelimeCevirBtn');
        await expect(page.locator('#gameScreen')).toBeVisible();
        
        // Soruya cevap ver
        await page.click('.option:first-child');
        
        // Sonuç ekranını kontrol et
        await expect(page.locator('.feedback')).toBeVisible();
    });
});
```

### 3. Dark Mode E2E Testi

```javascript
// tests/e2e/dark-mode.spec.js
import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
    test('should toggle dark mode', async ({ page }) => {
        await page.goto('/');
        
        const body = page.locator('body');
        const darkModeBtn = page.locator('#darkModeToggle');
        
        // Başlangıçta dark mode kapalı
        await expect(body).not.toHaveClass(/dark-mode/);
        
        // Dark mode'u aç
        await darkModeBtn.click();
        await expect(body).toHaveClass(/dark-mode/);
        
        // Dark mode'u kapat
        await darkModeBtn.click();
        await expect(body).not.toHaveClass(/dark-mode/);
    });
});
```

---

## 🔧 Troubleshooting

### Jest Testleri Çalışmıyor

1. **Module import hatası:**
   ```javascript
   // ES6 import yerine require kullan
   const { functionName } = require('../js/utils.js');
   ```

2. **localStorage hatası:**
   - `tests/setup.js` dosyası zaten localStorage'ı mock'lar
   - Ekstra mock gerekmez

### Playwright Testleri Çalışmıyor

1. **Browser yükleme:**
   ```bash
   npx playwright install
   ```

2. **Server çalışmıyor:**
   - Playwright otomatik olarak `npm run dev` ile server başlatır
   - Manuel başlatmak isterseniz: `npm run dev` (ayrı terminal)

---

## 📚 Faydalı Kaynaklar

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/)

---

## ✅ Best Practices

1. **Test isimleri açıklayıcı olsun:**
   ```javascript
   // ❌ Kötü
   test('test1', () => {});
   
   // ✅ İyi
   test('should calculate score correctly when difficulty is medium', () => {});
   ```

2. **Her test bağımsız olsun:**
   - `beforeEach` ile temizlik yapın
   - Testler birbirine bağımlı olmasın

3. **Assertion'lar açık olsun:**
   ```javascript
   // ❌ Kötü
   expect(result).toBeTruthy();
   
   // ✅ İyi
   expect(result).toBe(25);
   ```

4. **E2E testler kısa olsun:**
   - Her test tek bir senaryoyu test etsin
   - Uzun testleri parçalara ayırın

---

**Hazırlayan:** AI Assistant  
**Son Güncelleme:** 2025-01-XX


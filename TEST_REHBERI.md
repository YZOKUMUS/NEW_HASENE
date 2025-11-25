# 🧪 Test Rehberi

## Test Nasıl Çalışır?

### 1. Test Komutları

```bash
# Tüm testleri çalıştır
npm test

# Testleri watch modunda çalıştır (dosya değişikliklerinde otomatik çalışır)
npm run test:watch

# Test coverage raporu oluştur
npm run test:coverage

# Test UI'ı aç (görsel test arayüzü)
npm run test:ui
```

### 2. Test Yapısı

```
tests/
├── setup.js              # Test ortamı kurulumu (mock'lar, global değişkenler)
├── utils.test.js         # Utils fonksiyonları için testler
├── storage-manager.test.js # Storage manager testleri
└── utils-helper.js       # Utils.js'i test ortamında yüklemek için helper
```

### 3. Test Nasıl Çalışır?

1. **Setup (`tests/setup.js`)**: 
   - Test ortamını hazırlar
   - Mock'ları oluşturur (localStorage, CONFIG, log)
   - Global değişkenleri ayarlar

2. **Test Dosyaları (`tests/*.test.js`)**:
   - Vitest framework kullanır
   - `describe()` ile test grupları oluşturur
   - `it()` ile tek tek testler yazar
   - `expect()` ile sonuçları kontrol eder

3. **Helper (`tests/utils-helper.js`)**:
   - `utils.js` dosyasını test ortamında yükler
   - DOM mock'ları oluşturur (JSDOM)
   - Fonksiyonları export eder

### 4. Örnek Test Yazma

```javascript
import { describe, it, expect } from 'vitest';
import { getLocalDateString } from './utils-helper.js';

describe('getLocalDateString', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    const result = getLocalDateString(date);
    expect(result).toBe('2024-01-15');
  });
});
```

### 5. Mevcut Testler

- ✅ **Storage Manager Tests**: localStorage işlemleri
- ⚠️ **Utils Tests**: Şu anda çalışmıyor (utils.js yükleme sorunu)

### 6. Test Sorunları ve Çözümler

**Sorun**: `utils.js` tarayıcıda global scope'ta çalışıyor, test ortamında yüklenemiyor.

**Çözüm**: `utils-helper.js` dosyası utils.js'i test ortamında yüklemek için oluşturuldu, ancak henüz tam çalışmıyor.

**Alternatif Çözüm**: 
- utils.js'i hem tarayıcı hem test için uyumlu hale getirmek
- Veya utils.js'i ES module olarak da export etmek

### 7. Test Coverage

Coverage raporu oluşturmak için:
```bash
npm run test:coverage
```

Rapor `coverage/` klasöründe HTML formatında oluşturulur.

### 8. Notlar

- Testler Vitest framework kullanıyor
- jsdom ile DOM ortamı simüle ediliyor
- Mock'lar setup.js'de tanımlı
- Test dosyaları `tests/**/*.test.js` pattern'ine uymalı





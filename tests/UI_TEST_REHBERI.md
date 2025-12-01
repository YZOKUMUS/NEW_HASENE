# UI Test Rehberi

## Testleri Çalıştırma

### Hızlı Test (Sadece UI testleri)
```bash
npm test tests/ui.test.js
```

### Tüm Testler
```bash
npm test
```

### Test Watch Mode (Geliştirme sırasında)
```bash
npm run test:watch
```

### Test Coverage
```bash
npm run test:coverage
```

## Zaman Aşımı Sorunu Çözümü

Eğer testler zaman aşımına uğruyorsa:

### 1. HTML Dosyası Optimizasyonu
- HTML dosyası 2381 satır, bu yüzden lazy loading kullanıldı
- HTML sadece bir kez okunup cache'leniyor

### 2. Test Timeout Ayarı
Vitest config'e timeout eklenebilir:
```js
// vitest.config.js
export default defineConfig({
  test: {
    testTimeout: 30000, // 30 saniye
    // ...
  }
});
```

### 3. Testleri Parçalara Ayırma
Büyük test dosyasını küçük parçalara ayırabilirsiniz:
- `ui-elements.test.js` - Element varlık testleri
- `ui-accessibility.test.js` - Accessibility testleri
- `ui-modals.test.js` - Modal testleri

### 4. Node.js Memory Artırma
```bash
node --max-old-space-size=4096 ./node_modules/.bin/vitest tests/ui.test.js
```

## Test İstatistikleri

- **Toplam Test**: 67 test case
- **Test Suite**: 20 describe bloğu
- **Kapsam**:
  - DOM element varlığı
  - Modal işlevselliği
  - Accessibility
  - Keyboard navigation
  - Responsive design

## Sorun Giderme

### Testler çok yavaşsa
1. HTML dosyasını minimal versiyona çevirin
2. Sadece gerekli elementleri test edin
3. Testleri paralel çalıştırmayı deneyin

### JSDOM hatası alıyorsanız
```bash
npm install --save-dev jsdom
```

### Memory hatası alıyorsanız
```bash
# Node.js memory limit artır
export NODE_OPTIONS="--max-old-space-size=4096"
npm test
```


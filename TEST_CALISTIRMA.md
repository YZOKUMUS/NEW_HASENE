# 🧪 Test Çalıştırma Rehberi

## Hızlı Başlangıç

### UI Testlerini Çalıştır
```bash
npm test tests/ui.test.js
```

### Tüm Testleri Çalıştır
```bash
npm test
```

## ⚡ Zaman Aşımı Sorunları İçin Çözümler

### 1. Test Timeout Ayarı (Yapıldı ✅)
- `vitest.config.js` dosyasına **30 saniye timeout** eklendi
- UI testleri artık daha uzun sürebilir

### 2. HTML Lazy Loading (Yapıldı ✅)
- HTML dosyası sadece bir kez okunup cache'leniyor
- Her test için tekrar okuma yapılmıyor

### 3. DOM Optimizasyonu (Yapıldı ✅)
- DOM sadece bir kez oluşturuluyor (`beforeAll`)
- Tüm testler aynı DOM instance'ını kullanıyor

## 🔧 Ek Optimizasyonlar

### Node.js Memory Artırma
Eğer hala yavaşsa, memory limitini artırın:

**Windows PowerShell:**
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm test tests/ui.test.js
```

**Windows CMD:**
```cmd
set NODE_OPTIONS=--max-old-space-size=4096
npm test tests/ui.test.js
```

**Linux/Mac:**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm test tests/ui.test.js
```

### Sadece Belirli Testleri Çalıştır
```bash
# Sadece DOM element testleri
npm test tests/ui.test.js -t "DOM Element"

# Sadece accessibility testleri
npm test tests/ui.test.js -t "Accessibility"
```

### Test Watch Mode (Geliştirme için)
```bash
npm run test:watch
```

## 📊 Test İstatistikleri

- **Toplam Test**: 67 test case
- **Test Suite**: 20 describe bloğu
- **Kategori**: 
  - ✅ DOM element varlığı
  - ✅ Modal işlevselliği
  - ✅ Accessibility
  - ✅ Keyboard navigation
  - ✅ Responsive design

## ❓ Sorun Giderme

### Testler hala zaman aşımına uğruyorsa:

1. **Test sayısını azaltın**: Sadece kritik testleri çalıştırın
2. **HTML dosyasını küçültün**: Gereksiz HTML'i kaldırın
3. **Paralel çalıştırmayı kapatın**: `vitest.config.js`'de `threads: false` ekleyin

### JSDOM hatası alıyorsanız:
```bash
npm install --save-dev jsdom
```

### Test çıktısı göremiyorsanız:
```bash
npm test tests/ui.test.js --reporter=verbose
```

## 📝 Notlar

- Testler artık daha optimize edilmiş durumda
- HTML dosyası sadece bir kez okunuyor
- DOM instance'ı tüm testler arasında paylaşılıyor
- Timeout 30 saniyeye çıkarıldı

Testler artık daha hızlı çalışmalı! 🚀


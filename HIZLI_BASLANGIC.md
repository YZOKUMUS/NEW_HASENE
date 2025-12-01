# 🚀 Hızlı Başlangıç - Testleri Çalıştırma

## 📋 Tek Adımda Test Çalıştırma

### Windows PowerShell veya CMD'de:

```bash
npm test tests/ui.test.js
```

**VEYA tüm testleri çalıştırmak için:**

```bash
npm test
```

## 🎯 Adım Adım

### 1. Terminal Açın
- **Windows:** `Win + R` → `powershell` veya `cmd` yazın
- **VS Code:** `Ctrl + `` (backtick) ile terminal açın

### 2. Proje Klasörüne Gidin
```bash
cd C:\Users\ziyao\Desktop\NEW_HASENE
```

### 3. Testleri Çalıştırın
```bash
npm test tests/ui.test.js
```

## ✅ Beklenen Sonuç

```
✓ UI - Kullanıcı Arayüzü Testleri (67)
  ✓ DOM Element Varlığı (10)
  ✓ Modal Elementleri (4)
  ✓ Oyun Ekranları (7)
  ...
  
Test Files  1 passed (1)
     Tests  67 passed (67)
```

## 🔧 Diğer Komutlar

### Tüm Testleri Çalıştır
```bash
npm test
```

### Watch Mode (Otomatik Test)
```bash
npm run test:watch
```

### Test Coverage (Kapsama Raporu)
```bash
npm run test:coverage
```

### Sadece Belirli Testleri
```bash
# Sadece DOM testleri
npm test tests/ui.test.js -t "DOM Element"
```

## ❓ Sorun Yaşıyorsanız

### Eğer "npm" komutu bulunamadı hatası alırsanız:
1. Node.js'in yüklü olduğundan emin olun
2. Terminal'i yeniden başlatın

### Eğer paketler eksikse:
```bash
npm install
```

### Eğer testler çok yavaşsa:
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm test tests/ui.test.js
```

## 📊 Test İstatistikleri

- **67 test case**
- **20 test suite**
- **Kategori:** DOM, Modal, Accessibility, vb.

## 🎉 Başarılı!

Testler çalıştıktan sonra sonuçları göreceksiniz. Tüm testler geçerse ✅ işareti göreceksiniz!


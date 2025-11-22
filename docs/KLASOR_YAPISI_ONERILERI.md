# 📁 Klasör Yapısı Önerileri

## 🎯 Mevcut Durum

### ✅ Root'ta Olması Gereken Dosyalar (Standart)
Bu dosyalar root'ta kalmalı çünkü tool'lar otomatik olarak root'ta arar:

- `.eslintrc.json` - ESLint config
- `.prettierrc.json` - Prettier config  
- `.prettierignore` - Prettier ignore
- `vite.config.js` - Vite build config
- `jest.config.js` - Jest test config
- `playwright.config.js` - Playwright E2E config
- `package.json` - NPM config
- `robots.txt` - SEO için root'ta olmalı
- `.gitignore` - Git ignore

### ✅ Zaten Doğru Yerde Olan Klasörler
- `js/` - JavaScript modülleri ✅
- `docs/` - Dokümantasyon ✅
- `tests/` - Test dosyaları ✅
  - `tests/unit/` - Unit testler ✅
  - `tests/e2e/` - E2E testler ✅
- `data/` - JSON veri dosyaları ✅
- `assets/` - Statik dosyalar ✅
- `previews/` - Tasarım önizlemeleri ✅
- `scripts/` - Yardımcı scriptler ✅

## 💡 Öneri: Mevcut Yapı İdeal

Mevcut klasör yapısı **standart ve doğru** organize edilmiş. Config dosyalarının root'ta olması:
- ✅ Tool'ların otomatik bulması için gerekli
- ✅ Standart proje yapısı
- ✅ Path sorunları yok
- ✅ Bakımı kolay

## 🔄 Alternatif: Config Klasörü (Opsiyonel)

Eğer config dosyalarını `config/` klasörüne almak isterseniz:

### Avantajlar:
- Daha organize görünüm
- Root klasör daha temiz

### Dezavantajlar:
- Her tool için path güncellemesi gerekir
- Bazı tool'lar root'ta aradığı için sorun çıkabilir
- Standart değil

### Yapılması Gerekenler (Eğer config/ klasörüne alınırsa):
1. `config/` klasörü oluştur
2. Config dosyalarını taşı
3. Her config dosyasında path'leri güncelle:
   - `jest.config.js` - test path'leri
   - `playwright.config.js` - test path'leri
   - `vite.config.js` - build path'leri
4. `package.json` script'lerini güncelle

## ✅ Sonuç

**Öneri: Mevcut yapıyı koruyun!** Config dosyaları root'ta kalmalı.


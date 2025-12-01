# 🕌 Hasene - Arapça Öğrenme Oyunu

Arapça öğrenmeyi eğlenceli hale getiren interaktif eğitim oyunu. Kuran kelimelerini öğren, rozet topla, günlük görevleri tamamla.

## 🎮 Özellikler

### Oyun Modları
- 📚 **Kelime Çevir**: Arapça kelimelerin Türkçe anlamlarını bul
- 🎧 **Dinle & Bul**: Dinleyerek doğru kelimeyi bul
- 📝 **Boşluk Doldur**: Ayetlerdeki boşlukları tamamla
- 📖 **Ayet Oku**: Kuran ayetlerini oku ve öğren
- 🤲 **Dua Et**: Duaları ezberle ve öğren
- 📜 **Hadis Oku**: Hadisleri oku ve öğren

### Sistemler
- 💰 **Hasene Puan Sistemi**: Her doğru cevap için Hasene kazan
- ⭐ **Yıldız Sistemi**: 100 Hasene = 1 Yıldız
- 🏆 **Mertebe Sistemi**: Mübtedi, Müterakki, Mütecaviz, Mütebahhir
- 🥇 **Rozet Sistemi**: Başarılarınız için rozetler kazanın (Bronz, Gümüş, Altın, Elmas)
- 📊 **Detaylı İstatistikler**: Performans takibi, kelime istatistikleri, analitik
- 📅 **Günlük Görevler**: Her gün yeni hedefler ve ödüller
- 🎯 **Günlük Hedef**: Günlük Hasene hedefi belirle ve tamamla
- 🔥 **Seri Takibi**: Günlük oyun serilerinizi koruyun
- 🏅 **Liderlik Tablosu**: Haftalık ve aylık sıralamalar
- 📈 **Kelime İstatistikleri**: Öğrenilen, zorlanılan kelimeleri takip et
- 🧠 **Akıllı Öğrenme**: Zorlandığın kelimeleri daha sık göster
- 📱 **PWA Desteği**: Mobil cihazlara yüklenebilir, offline çalışır

## 🚀 Kullanım

Proje GitHub Pages üzerinde yayınlanmaktadır:
**https://yzokumus.github.io/NEW_HASENE/**

### Mobil Kullanım
1. Tarayıcıdan siteyi aç
2. "Ana Ekrana Ekle" veya "Yükle" seçeneğini kullan
3. Uygulama ana ekranına eklenecek

## 🛠️ Geliştirme

### Gereksinimler
- Node.js 18+ (test ve dokümantasyon için)
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Testleri çalıştır
npm test

# Testleri watch modunda çalıştır
npm run test:watch

# Test coverage raporu
npm run test:coverage

# Dokümantasyon oluştur
npm run docs

# Dokümantasyonu tarayıcıda görüntüle
npm run docs:serve
```

### Proje Yapısı

```
├── index.html          # Ana HTML dosyası
├── style.css           # Stil dosyası
├── sw.js              # Service Worker
├── manifest.json      # PWA manifest
├── js/                # JavaScript modülleri
│   ├── config.js      # Yapılandırma ve debug sistemi
│   ├── utils.js       # Yardımcı fonksiyonlar
│   ├── game-core.js   # Ana oyun mantığı
│   ├── error-handler.js # Hata yönetimi
│   ├── safety-checks.js # Güvenlik kontrolleri
│   └── ...            # Diğer modüller
├── data/              # JSON veri dosyaları
├── assets/            # Görseller ve fontlar
├── tests/             # Test dosyaları
│   ├── setup.js       # Test setup
│   ├── utils.test.js  # Utils testleri
│   └── ...
└── docs/              # JSDoc dokümantasyonu (oluşturulur)
```

### Kod Standartları

- **Vanilla JavaScript**: Framework kullanılmadan saf JavaScript
- **Modüler Yapı**: Her özellik ayrı dosyada
- **JSDoc Dokümantasyonu**: Tüm public fonksiyonlar dokümante edilmiş
- **Test Coverage**: Kritik fonksiyonlar test edilmiş
- **Güvenlik**: CSP header'ları, XSS koruması, veri sanitization

### Güvenlik

- ✅ **CSP (Content Security Policy)**: XSS koruması için aktif
- ✅ **HTML Sanitization**: Kullanıcı girdileri sanitize edilir
- ✅ **LocalStorage Encryption**: Hassas veriler Base64 ile encode edilir
- ⚠️ **Not**: Mevcut encryption sadece obfuscation içindir, gerçek şifreleme değildir

### Test Yazma

Yeni bir fonksiyon için test yazmak:

```javascript
// tests/my-function.test.js
import { describe, it, expect } from 'vitest';
import { myFunction } from '../js/my-module.js';

describe('myFunction', () => {
    it('should work correctly', () => {
        const result = myFunction('input');
        expect(result).toBe('expected');
    });
});
```

### Dokümantasyon Yazma

JSDoc formatında dokümantasyon:

```javascript
/**
 * Fonksiyon açıklaması
 * @param {string} param1 - Parametre açıklaması
 * @param {number} [param2=0] - Opsiyonel parametre
 * @returns {boolean} Dönüş değeri açıklaması
 * @example
 * myFunction('test', 123) // true
 */
function myFunction(param1, param2 = 0) {
    // ...
}
```

## 📦 Teknolojiler

- **Vanilla JavaScript**: Framework kullanılmadan saf JavaScript
- **Progressive Web App (PWA)**: Mobil uygulama deneyimi
- **Service Worker**: Offline çalışma ve cache yönetimi
- **LocalStorage**: Veri saklama
- **IndexedDB**: Büyük veri saklama (opsiyonel)
- **Vitest**: Test framework
- **JSDoc**: API dokümantasyonu

## ⚖️ Telif ve Marka Notu

- Bu proje, **herhangi bir kurum veya ticari marka ile bağlantılı değildir**; tamamen bağımsız olarak geliştirilmiştir.
- Arayüz ve renk seçimleri, genel olarak modern eğitim oyunlarından ilham alan **özgün bir tasarım**dır; belirli bir markanın kopyası veya klonu değildir.

## 🎯 Hasene Sistemi

- **100 Hasene = 1 Yıldız**
- **2,000 Hasene = Mübtedi (🥉)**
- **8,500 Hasene = Müterakki (🥈)** (~1 saat oyun)
- **25,500 Hasene = Mütecaviz (🥇)** (~3 gün)
- **85,000 Hasene = Mütebahhir (💎)** (~10 gün)

## 🔒 Güvenlik Notları

### CSP (Content Security Policy)
- `script-src`'den `unsafe-inline` kaldırıldı (XSS koruması)
- `style-src`'de `unsafe-inline` bırakıldı (Google Fonts ve dinamik stiller için gerekli)
- Gelecekte nonce kullanımı eklenebilir

### Veri Şifreleme
- LocalStorage'da hassas veriler Base64 ile encode edilir
- ⚠️ **Uyarı**: Mevcut encryption sadece obfuscation içindir
- Production'da gerçek şifreleme (AES-256) kullanılabilir

## 📄 Lisans

ISC

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Changelog

### v1.0.0
- ✅ Test altyapısı eklendi (Vitest)
- ✅ JSDoc dokümantasyonu eklendi
- ✅ CSP iyileştirmeleri (unsafe-inline kaldırıldı)
- ✅ README geliştirme bölümü eklendi
- ✅ Güvenlik dokümantasyonu eklendi

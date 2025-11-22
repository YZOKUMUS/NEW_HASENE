# Metallic Luxury Icon'u Her Yerde Kullanma Rehberi

## 🎯 Amaç
Metallic Luxury tasarımını Android uygulaması ve web sitesinde kullanmak.

## 📥 Adım 1: PNG Dosyasını İndirin

### Yöntem 1: Otomatik İndirme (Önerilen)
1. `previews\metallic_luxury_export.html` dosyasını tarayıcıda açın
2. **"PNG İndir (Canvas)"** butonuna tıklayın
3. İndirilen dosya: `icon-metallic-luxury-512.png`

### Yöntem 2: Manuel Screenshot
1. `previews\metallic_luxury_export.html` dosyasını tarayıcıda açın
2. Icon'un üzerine sağ tıklayın → "Resmi farklı kaydet"
3. Veya Snipping Tool ile 512x512 px ekran görüntüsü alın

## 📁 Adım 2: Dosyayı Kaydedin

İndirilen PNG dosyasını şuraya kopyalayın:
```
assets\images\icon-metallic-luxury-512.png
```

## 🤖 Adım 3: Android Studio'da Uygulayın

### 3.1 Image Asset Studio'yu Açın
1. Android Studio'yu açın
2. `android` klasörünü açın
3. **File > New > Image Asset** seçin
4. Veya `android/app/src/main/res` klasörüne sağ tıklayın → **New > Image Asset**

### 3.2 Icon'u Seçin
1. **Foreground Layer** sekmesinde:
   - **Path:** `C:\Users\ziyao\Desktop\NEW_HASENE\assets\images\icon-metallic-luxury-512.png`
   - **Resize:** %100 (veya istediğiniz boyut)
   - **Shape:** None (kare şekli için)

2. **Background Layer** sekmesinde:
   - **Color:** `#1a1a1a` (koyu gri - opsiyonel)

### 3.3 Icon'u Oluşturun
1. **Next** butonuna tıklayın
2. **Finish** butonuna tıklayın
3. Icon dosyaları otomatik olarak `mipmap` klasörlerine eklenecek

## 🌐 Adım 4: Web Sitesinde Kullanın

### 4.1 index.html'de Güncelleyin
```html
<link rel="icon" type="image/png" sizes="512x512" href="assets/images/icon-metallic-luxury-512.png">
```

### 4.2 manifest.json'da Güncelleyin (varsa)
```json
{
  "icons": [
    {
      "src": "assets/images/icon-metallic-luxury-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## ✅ Kontrol Listesi

- [ ] PNG dosyası indirildi
- [ ] `assets\images\` klasörüne kopyalandı
- [ ] Android Studio'da Image Asset Studio açıldı
- [ ] Icon dosyası seçildi
- [ ] Icon oluşturuldu ve mipmap klasörlerine eklendi
- [ ] Web sitesinde icon güncellendi
- [ ] Android uygulaması test edildi

## 🎨 Özellikler

- **Metallic Luxury Stil:** Altın-kırmızı gradient border
- **RED MUSHAF Icon:** Orijinal icon korunuyor
- **Premium Görünüm:** Lüks ve profesyonel
- **512x512 px:** Yüksek kalite

## 📝 Notlar

- Icon dosyası 512x512 px olmalı
- Android Studio'da icon'u oluşturduktan sonra uygulamayı yeniden build edin
- Web sitesinde icon değişikliği için tarayıcı cache'ini temizleyin (Ctrl + F5)

## 🔄 Güncelleme

Icon'u güncellemek için:
1. Yeni PNG dosyasını oluşturun
2. Android Studio'da Image Asset Studio ile güncelleyin
3. Web sitesinde icon linkini güncelleyin


# 🎨 Image Asset Studio'da Icon Düzenleme

## 🎯 Icon'ları Düzenleme Adımları

### 1. Foreground Layer (Ön Plan) Ayarları

#### Resize (Boyutlandırma):
- **Slider'ı hareket ettirin** veya **yüzde yazın**
- **%80-85** önerilir (kenarlardan boşluk için)
- Icon küçüldükçe kenarlardan daha fazla boşluk olur
- Icon büyüdükçe kenarlara daha yakın olur

#### Trim (Kırpma):
- Icon'un etrafındaki boş alanları kaldırır
- Genellikle kapalı bırakın

#### Shape (Şekil):
- **None:** Icon'un orijinal şekli
- **Circle:** Daire şekli
- **Square:** Kare şekli
- **Rounded Square:** Yuvarlatılmış kare

### 2. Background Layer (Arka Plan) Ayarları

#### Color (Renk):
- **Color** seçeneğini seçin
- Renk seçici penceresinde:
  - **Hex kodu yazın:** `#667eea` (mavi) veya `#764ba2` (mor)
  - Veya renk tekerleğinden seçin
  - Veya icon'unuzun arka plan rengini kullanın

#### Image (Görsel):
- Arka plan olarak görsel kullanmak isterseniz
- Genellikle **Color** kullanılır

### 3. Preview (Önizleme)

Sağ tarafta farklı şekillerde nasıl göründüğünü görebilirsiniz:
- **Circle:** Daire şeklinde
- **Square:** Kare şeklinde
- **Rounded Square:** Yuvarlatılmış kare

Her birini tıklayarak nasıl göründüğünü kontrol edin.

## 🎯 Önerilen Ayarlar

### Icon'unuz İçin:

1. **Foreground Layer:**
   - **Resize:** %80-85 (kenarlardan boşluk için)
   - **Shape:** None (orijinal şekil)

2. **Background Layer:**
   - **Color:** `#667eea` (mavi) veya icon'unuzun arka plan rengi
   - Veya `#764ba2` (mor)

3. **Preview:**
   - Tüm şekillerde düzgün göründüğünü kontrol edin

## 🔧 Düzenleme İpuçları

### Icon Çok Büyükse:
- **Resize** slider'ını sola çekin (%70-75)
- Icon küçülecek, kenarlardan daha fazla boşluk olacak

### Icon Çok Küçükse:
- **Resize** slider'ını sağa çekin (%85-90)
- Icon büyüyecek, kenarlara daha yakın olacak

### Kenarlar Kesik Görünüyorsa:
- **Resize** değerini düşürün (%75-80)
- Icon'u daha küçük yapın

### Arka Plan Rengi Yanlışsa:
- **Background Layer** > **Color** seçin
- Doğru rengi seçin veya hex kodu yazın

## ✅ Ayarları Uygulama

1. **Ayarları yaptıktan sonra:**
   - Sağ taraftaki **Preview**'da kontrol edin
   - Tüm şekillerde (daire, kare) düzgün göründüğünden emin olun

2. **Next** butonuna tıklayın (varsa)

3. **Generate** butonuna tıklayın
   - Tüm boyutlar otomatik oluşturulacak

4. **Finish** butonuna tıklayın
   - Icon'lar kaydedilecek

## 🔄 Değişiklik Yapmak İsterseniz

1. **Image Asset Studio'yu tekrar açın:**
   - `android/app/src/main/res` klasörüne sağ tıklayın
   - **New > Image Asset** seçin
   - Veya mevcut icon dosyalarını silip yeniden oluşturun

2. **Ayarları değiştirin**

3. **Generate** butonuna tıklayın

4. **Finish** butonuna tıklayın

## 📐 Örnek Ayarlar

### Kırmızı Mushaf Icon İçin:

```
Foreground Layer:
- Image: icon-512-v4-RED-MUSHAF.png
- Resize: %80
- Shape: None

Background Layer:
- Color: #667eea (mavi) veya #d32f2f (kırmızı)
```

## 🎨 Renk Seçimi

Icon'unuzun arka plan rengine uygun renk seçin:
- **Kırmızı tonlar:** `#d32f2f`, `#c62828`
- **Mavi tonlar:** `#667eea`, `#1976d2`
- **Mor tonlar:** `#764ba2`, `#7b1fa2`

Veya icon'unuzun kendi arka plan rengini kullanın.

## ✅ Kontrol

Icon düzgün görünüyorsa:
- ✅ Preview'da tüm şekillerde düzgün
- ✅ Kenarlar kesik değil
- ✅ Arka plan rengi uygun
- ✅ Icon içeriği tam görünüyor

## 🚀 Son Adım

1. **Generate** butonuna tıklayın
2. **Finish** butonuna tıklayın
3. **Android Studio'da RUN butonuna tıklayın**
4. **Icon'u emülatörde kontrol edin**

---

**ÖNEMLİ:** Preview'da tüm şekillerde düzgün göründüğünden emin olun!


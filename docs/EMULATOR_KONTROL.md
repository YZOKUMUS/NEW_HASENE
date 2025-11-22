# 📱 Android Emülatör Kontrol Rehberi

## 🎯 Emülatör Açıkken Görmeniz Gerekenler

### 1. Emülatör Ekranı
- Android cihaz simülasyonu (telefon ekranı)
- Android işletim sistemi çalışıyor olmalı
- Ana ekran görünmeli

### 2. Uygulama Icon'u (Ana Ekranda)
Emülatörün ana ekranında şunları görmelisiniz:

✅ **Görmeniz Gereken:**
- **Hasene Arapça Dersi** uygulaması
- **Kırmızı arka planlı, altın renkli kitap ve hilal yıldız icon'u**
- Icon'un altında "Hasene Arapça Dersi" yazısı

### 3. Uygulama Listesi (App Drawer)
- Emülatörün alt kısmında veya ortasında **grid/dots** ikonu var
- Buna tıklayınca tüm uygulamalar listelenir
- Burada da **Hasene Arapça Dersi** görünmeli

## 🔍 Icon'u Bulamıyorsanız

### Adım 1: Uygulama Listesini Kontrol Edin
1. Emülatörün alt kısmındaki **grid/dots** ikonuna tıklayın (tüm uygulamalar)
2. Veya ekranı yukarı kaydırın
3. "Hasene Arapça Dersi" uygulamasını arayın

### Adım 2: Android Studio'dan Çalıştırın
1. Android Studio'da **yeşil Run butonuna** (▶️) tıklayın
2. Emülatörünüzü seçin
3. Uygulama otomatik yüklenecek ve açılacak

### Adım 3: Manuel Kontrol
1. Emülatörde **Settings** (Ayarlar) uygulamasını açın
2. **Apps** veya **Applications** seçin
3. **Hasene Arapça Dersi** uygulamasını arayın
4. Varsa: Ana ekrana ekleyin

## 📸 Görsel Kontrol

### Ana Ekranda Görmeniz Gereken:
```
┌─────────────────────────┐
│  [Icon]  [Icon]  [Icon] │
│                         │
│  [HASENE]  [Icon]       │  ← Burada Hasene icon'u
│                         │
│  [Icon]  [Icon]  [Icon] │
└─────────────────────────┘
```

### Icon Görünümü:
- **Kırmızı arka plan** (gradient)
- **Altın renkli hilal ve yıldız** (üstte)
- **Altın renkli açık kitap** (ortada)
- **"HASENE" yazısı** (altta)
- **"الحسنة" Arapça yazı** (altta)
- **"2025" yılı** (en altta)

## 🚀 Uygulamayı Çalıştırma

### Yöntem 1: Android Studio'dan
1. Android Studio'da **Run** butonuna (▶️) tıklayın
2. Emülatör seçili olmalı
3. Uygulama otomatik açılacak

### Yöntem 2: Emülatörden Manuel
1. Emülatörde **Hasene Arapça Dersi** icon'una tıklayın
2. Uygulama açılacak

## ❓ Sorun Giderme

### Icon Görünmüyor:
1. **Android Studio'da Run butonuna tıklayın** (en önemli!)
2. Emülatörü yeniden başlatın
3. Uygulamayı kaldırıp yeniden yükleyin

### Uygulama Açılmıyor:
1. Android Studio'da **Logcat** sekmesine bakın
2. Hata mesajlarını kontrol edin
3. **Build > Clean Project** yapın
4. Tekrar **Run** butonuna tıklayın

### Emülatör Yavaş:
- Emülatör ayarlarından RAM'i artırın
- Daha düşük çözünürlüklü emülatör kullanın

## ✅ Başarı Kontrolü

Uygulama başarıyla yüklendiyse:
- ✅ Emülatörde icon görünür
- ✅ Icon'a tıklayınca uygulama açılır
- ✅ "Hasene Arapça Dersi" ana ekranı görünür
- ✅ Oyun modları çalışır

---

**ÖNEMLİ:** Eğer icon görünmüyorsa, Android Studio'da **Run butonuna** (▶️) tıklayın. Bu uygulamayı yükler ve çalıştırır!


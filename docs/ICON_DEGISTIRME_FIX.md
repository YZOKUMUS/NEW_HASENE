# 🔧 Icon Değiştirme Sorunu - Çözüm

## 🎯 Sorun
Emülatörde uygulama icon'u orijinal kırmızı Mushaf icon'u yerine farklı bir icon (kedi veya varsayılan icon) görünüyor.

## ✅ Çözüm: Icon Dosyalarını Değiştirme

Sorun, Android'deki icon dosyalarının yanlış veya eski olmasından kaynaklanıyor.

## 🚀 Yapılan İşlemler

1. ✅ Tüm Android icon dosyaları kontrol edildi
2. ✅ Orijinal RED MUSHAF icon dosyası bulundu
3. ✅ Tüm mipmap klasörlerindeki icon'lar değiştirildi:
   - `ic_launcher.png`
   - `ic_launcher_round.png`
   - `ic_launcher_foreground.png`
4. ✅ Android build yapıldı

## 📱 ŞİMDİ YAPMANIZ GEREKEN

### Android Studio'da:

1. **Emülatörde uygulamayı KALDIRIN:**
   - Uygulamaya uzun basın
   - **Uninstall** (Kaldır) seçeneğine tıklayın
   - Bu eski icon'u temizler

2. **Yeşil RUN butonuna (▶️) tıklayın**
   - Veya: **Shift + F10**
   - Uygulama yeniden yüklenecek

3. **Icon'u kontrol edin:**
   - Ana ekranda **ORJİNAL KIRMIZI MUSHAF İCON'U** görünecek
   - Kırmızı arka plan, altın renkli kitap ve hilal yıldız

## 🔍 Sorun Neden Oldu?

- Android Studio varsayılan Capacitor icon'larını kullanmış olabilir
- Icon dosyaları yanlış kopyalanmış olabilir
- Build cache sorunu olabilir

## ✅ Kontrol

Icon doğru görünüyorsa:
- ✅ Kırmızı arka plan (gradient)
- ✅ Altın renkli hilal ve yıldız (üstte)
- ✅ Altın renkli açık kitap (ortada)
- ✅ "HASENE" yazısı (altta)
- ✅ "الحسنة" Arapça yazı (altta)
- ✅ "2025" yılı (en altta)

## 🔄 Gelecekte Icon Değiştirmek İçin

### Manuel Yöntem:

1. Yeni icon dosyanızı hazırlayın (192x192 veya 512x512)
2. Şu komutu çalıştırın:
   ```bash
   # PowerShell'de
   $icon = "assets\images\yeni-icon.png"
   @("mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi") | ForEach-Object {
       $dir = "android\app\src\main\res\$_"
       Copy-Item $icon "$dir\ic_launcher.png" -Force
       Copy-Item $icon "$dir\ic_launcher_round.png" -Force
       Copy-Item $icon "$dir\ic_launcher_foreground.png" -Force
   }
   ```
3. Android Studio'da build yapın
4. Uygulamayı yeniden yükleyin

### Android Studio Image Asset Studio (Önerilen):

1. `android/app/src/main/res` klasörüne sağ tıklayın
2. **New > Image Asset** seçin
3. **Launcher Icons** seçin
4. Icon dosyanızı seçin
5. **Generate** butonuna tıklayın
6. Tüm boyutlar otomatik oluşturulacak

## 🐛 Sorun Devam Ederse

### Cache Temizleme:

1. Android Studio'da: **Build > Clean Project**
2. **Build > Rebuild Project**
3. Emülatörü yeniden başlatın
4. Uygulamayı kaldırıp yeniden yükleyin

### Manuel Kontrol:

1. `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` dosyasını kontrol edin
2. Doğru icon dosyası mı kontrol edin
3. Gerekirse manuel olarak değiştirin

## 📝 Özet

1. ✅ Icon dosyaları değiştirildi
2. ✅ Build yapıldı
3. ✅ **Uygulamayı kaldırın**
4. ✅ **RUN butonuna tıklayın**
5. ✅ **Orijinal icon görünecek!**

---

**ÖNEMLİ:** Icon değişikliği için mutlaka uygulamayı kaldırıp yeniden yükleyin!


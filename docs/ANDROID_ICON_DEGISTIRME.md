# 📱 Android Launcher Icon Değiştirme Rehberi

## 🎯 Sorun
Emülatörde veya telefonda uygulama logosu görünmüyor veya varsayılan Capacitor icon'u görünüyor.

## ✅ Çözüm: Icon'ları Değiştirme

Android için farklı boyutlarda icon'lar gerekiyor. Mevcut icon dosyalarınızı kullanarak Android icon'larını oluşturalım.

### Yöntem 1: Android Studio Image Asset Studio (Önerilen)

1. **Android Studio'da:**
   - Sol panelde: `android/app/src/main/res` klasörüne sağ tıklayın
   - **New > Image Asset** seçin

2. **Icon Type:**
   - **Launcher Icons (Adaptive and Legacy)** seçin

3. **Foreground Layer:**
   - **Image** sekmesini seçin
   - **Path** butonuna tıklayın
   - `assets/images/icon-512-v4-RED-MUSHAF.png` dosyasını seçin
   - **Resize** ile icon'u ayarlayın (padding ekleyebilirsiniz)

4. **Background Layer:**
   - **Color** seçin
   - Renk: `#667eea` (mavi) veya `#764ba2` (mor) veya istediğiniz renk

5. **Legacy Icon:**
   - **Generate** butonuna tıklayın
   - Tüm boyutlar otomatik oluşturulacak

6. **Finish** butonuna tıklayın

7. **Rebuild Project:**
   - **Build > Rebuild Project**

### Yöntem 2: Manuel Icon Kopyalama

Eğer Image Asset Studio kullanmak istemiyorsanız, icon'ları manuel olarak kopyalayabilirsiniz.

#### Gerekli Boyutlar:
- **mdpi**: 48x48 px
- **hdpi**: 72x72 px  
- **xhdpi**: 96x96 px
- **xxhdpi**: 144x144 px
- **xxxhdpi**: 192x192 px

#### Adımlar:

1. **Icon'ları hazırlayın:**
   - Online tool kullanın: https://www.img2go.com/resize-image
   - Veya Photoshop/GIMP ile boyutlandırın
   - Mevcut `icon-192-v4-RED-MUSHAF.png` dosyanızı kullanabilirsiniz

2. **Dosyaları kopyalayın:**
   - `icon-192-v4-RED-MUSHAF.png` dosyasını şu klasörlere kopyalayın:
     - `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
     - `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
     - `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
     - `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
     - `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

3. **Round icon'lar için:**
   - Aynı dosyaları `ic_launcher_round.png` olarak da kopyalayın:
     - `android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png`
     - `android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png`
     - vb.

4. **Foreground icon'lar için:**
   - `ic_launcher_foreground.png` dosyalarını da güncelleyin (aynı klasörlerde)

5. **Rebuild:**
   - Android Studio'da: **Build > Rebuild Project**

### Yöntem 3: Online Tool Kullanma

1. **Android Asset Studio** (Google):
   - https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
   - Icon'unuzu yükleyin
   - Tüm boyutları indirin
   - `android/app/src/main/res/` klasörüne kopyalayın

2. **App Icon Generator**:
   - https://appicon.co/
   - Icon'unuzu yükleyin
   - Android seçin
   - İndirin ve kopyalayın

## 🔄 Değişiklikleri Uygulama

Icon'ları değiştirdikten sonra:

1. **Android Studio'da:**
   ```bash
   Build > Clean Project
   Build > Rebuild Project
   ```

2. **Veya Terminal'de:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew build
   ```

3. **Uygulamayı yeniden çalıştırın:**
   - Emülatörü/telefonu yeniden başlatın
   - Uygulamayı kaldırıp yeniden yükleyin
   - Veya: **Run > Run 'app'**

## 🎨 Icon Tasarım İpuçları

- **Minimum boyut**: 512x512 px (kaynak dosya)
- **Şeffaf arka plan**: Kullanabilirsiniz
- **Güvenli alan**: Icon'un kenarlarından %10 içeride önemli detaylar olmalı
- **Basit tasarım**: Küçük boyutlarda da okunabilir olmalı
- **Renk kontrastı**: Arka planla iyi kontrast olmalı

## ✅ Kontrol

Icon'ları değiştirdikten sonra:

1. Emülatörü/telefonu yeniden başlatın
2. Uygulama listesinde icon'unuzu kontrol edin
3. Eğer hala görünmüyorsa:
   - Uygulamayı tamamen kaldırın
   - Yeniden yükleyin
   - Cihazı yeniden başlatın

## 🐛 Sorun Giderme

### Icon hala görünmüyor:
- **Cache temizleme:**
  ```bash
  cd android
  ./gradlew clean
  ```
- **Uygulamayı kaldırıp yeniden yükleyin**
- **Cihazı yeniden başlatın**

### Icon bulanık görünüyor:
- Daha yüksek çözünürlüklü kaynak dosya kullanın
- Tüm boyutları doğru şekilde oluşturduğunuzdan emin olun

### Build hatası:
- Icon dosyalarının doğru klasörlerde olduğunu kontrol edin
- Dosya isimlerinin doğru olduğundan emin olun (`ic_launcher.png`)

---

**Not:** Icon'ları değiştirdikten sonra mutlaka projeyi rebuild edin!


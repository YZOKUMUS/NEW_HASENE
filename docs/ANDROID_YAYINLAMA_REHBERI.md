# Android Uygulaması Yayınlama Rehberi

Bu rehber, Hasene Arapça Dersi projesini Android uygulamasına dönüştürüp Google Play Store'a yayınlamak için gerekli tüm adımları içerir.

## 📋 Gereksinimler

### 1. Sistem Gereksinimleri
- **Node.js** (v16 veya üzeri)
- **npm** veya **yarn**
- **Java JDK** (v11 veya üzeri) - Android Studio ile birlikte gelir
- **Android Studio** (en son sürüm)
- **Android SDK** (API Level 33 veya üzeri)

### 2. Google Play Console Hesabı
- Google Play Console hesabı oluşturun (bir kerelik $25 ücret)
- Developer hesabınızı doğrulayın

## 🚀 Kurulum Adımları

### Adım 1: Bağımlılıkları Yükleyin

```bash
npm install
```

Bu komut, Capacitor ve tüm gerekli paketleri yükleyecektir.

### Adım 2: Projeyi Build Edin

```bash
npm run build
```

Bu komut, web uygulamanızı `dist` klasörüne build edecektir.

### Adım 3: Capacitor'ı Initialize Edin (İlk Kez)

```bash
npx cap init
```

Eğer zaten yapılandırılmışsa bu adımı atlayabilirsiniz.

### Adım 4: Android Platformunu Ekleyin

```bash
npm run cap:add:android
```

veya

```bash
npx cap add android
```

### Adım 5: Capacitor Sync

```bash
npm run cap:sync
```

Bu komut, web build'inizi Android projesine kopyalar.

### Adım 6: Android Studio'da Açın

```bash
npm run cap:open:android
```

veya

```bash
npx cap open android
```

## 🔧 Android Studio Yapılandırması

### 1. Gradle Sync
Android Studio açıldığında, otomatik olarak Gradle sync başlayacaktır. Eğer başlamazsa:
- **File > Sync Project with Gradle Files**

### 2. SDK ve Build Tools Kontrolü
- **File > Project Structure > SDK Location**
- Android SDK Location'ı kontrol edin
- Minimum SDK: API 22 (Android 5.1)
- Target SDK: API 33 veya üzeri

### 3. Uygulama İzinleri (AndroidManifest.xml)

`android/app/src/main/AndroidManifest.xml` dosyasını kontrol edin. Gerekli izinler:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### 4. Uygulama Bilgileri

`android/app/build.gradle` dosyasında:

```gradle
android {
    namespace "com.hasene.arapca"
    compileSdk 34
    
    defaultConfig {
        applicationId "com.hasene.arapca"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

## 📱 Test Etme

### 1. Emülatörde Test
- Android Studio'da bir emülatör oluşturun veya mevcut birini kullanın
- **Run > Run 'app'** veya yeşil play butonuna tıklayın

### 2. Fiziksel Cihazda Test
- USB Debugging'i açın (Ayarlar > Geliştirici Seçenekleri)
- Cihazı bilgisayara bağlayın
- Android Studio'da cihazınızı seçin ve çalıştırın

## 📦 APK/AAB Oluşturma

### Release Build için

1. **Android Studio'da:**
   - **Build > Generate Signed Bundle / APK**
   - **Android App Bundle** seçin (önerilen)
   - Yeni bir keystore oluşturun veya mevcut birini kullanın
   - Keystore bilgilerinizi güvenli bir yerde saklayın!

2. **Komut Satırından:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   
   APK dosyası: `android/app/build/outputs/apk/release/app-release.apk`
   AAB dosyası: `android/app/build/outputs/bundle/release/app-release.aab`

### Keystore Oluşturma (İlk Kez)

```bash
keytool -genkey -v -keystore hasene-release-key.keystore -alias hasene -keyalg RSA -keysize 2048 -validity 10000
```

**ÖNEMLİ:** Keystore dosyasını ve şifresini güvenli bir yerde saklayın! Kaybederseniz uygulamanızı güncelleyemezsiniz.

## 🏪 Google Play Store'a Yükleme

### 1. Google Play Console'a Giriş
- https://play.google.com/console adresine gidin
- Yeni bir uygulama oluşturun

### 2. Uygulama Bilgileri
- **Uygulama adı:** Hasene Arapça Dersi
- **Kısa açıklama:** Arapça öğrenmeyi eğlenceli hale getiren interaktif eğitim oyunu
- **Tam açıklama:** (README.md'den alabilirsiniz)
- **Kategori:** Eğitim
- **İçerik derecelendirmesi:** PEGI 3 veya benzeri

### 3. Ekran Görüntüleri
- En az 2, en fazla 8 ekran görüntüsü yükleyin
- Farklı cihaz boyutları için (telefon, tablet)
- Minimum boyut: 320px, maksimum: 3840px

### 4. Uygulama İkonu
- 512x512 PNG formatında
- `assets/images/icon-512-v4-RED-MUSHAF.png` dosyasını kullanabilirsiniz

### 5. Özellik Grafiği (Feature Graphic)
- 1024x500 PNG formatında
- Play Store'da üstte görünen büyük görsel

### 6. AAB Dosyasını Yükleme
- **Production > Create new release**
- AAB dosyanızı yükleyin
- Release notları ekleyin
- **Review release** butonuna tıklayın

### 7. İçerik Derecelendirmesi
- Google Play Console'da içerik derecelendirme anketini doldurun
- Eğitim kategorisi için genellikle "Everyone" uygundur

### 8. Gizlilik Politikası
- Bir gizlilik politikası URL'si eklemeniz gerekebilir
- GitHub Pages'de veya başka bir yerde yayınlayabilirsiniz

### 9. Yayınlama
- Tüm bilgileri kontrol edin
- **Submit for review** butonuna tıklayın
- İnceleme süreci 1-3 gün sürebilir

## 🔄 Güncelleme Yapma

1. `package.json`'da versiyonu güncelleyin
2. `android/app/build.gradle`'da `versionCode` ve `versionName`'i artırın
3. Değişiklikleri yapın ve build edin:
   ```bash
   npm run build
   npm run cap:sync
   ```
4. Android Studio'da yeni AAB oluşturun
5. Google Play Console'da yeni release oluşturun

## 📝 Önemli Notlar

### Version Code ve Version Name
- **versionCode:** Her yeni yüklemede artırılmalı (1, 2, 3, ...)
- **versionName:** Kullanıcıya gösterilen versiyon (1.0.0, 1.0.1, ...)

### ProGuard/R8
Production build'lerde kod karıştırma (obfuscation) aktif olabilir. Eğer sorun yaşarsanız:

`android/app/proguard-rules.pro` dosyasına ekleyin:
```
-keep class com.getcapacitor.** { *; }
-keep class com.hasene.arapca.** { *; }
```

### Network Security
Android 9+ için network security config gerekebilir. `android/app/src/main/res/xml/network_security_config.xml` oluşturun:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

Ve `AndroidManifest.xml`'e ekleyin:
```xml
<application
    ...
    android:networkSecurityConfig="@xml/network_security_config">
```

## 🐛 Sorun Giderme

### Build Hataları
- Gradle sync yapın
- `./gradlew clean` çalıştırın
- Android Studio'yu yeniden başlatın

### Runtime Hataları
- Chrome DevTools ile debug edin: `chrome://inspect`
- Logcat'te hataları kontrol edin

### Capacitor Sync Sorunları
```bash
npx cap sync android --force
```

## 📚 Ek Kaynaklar

- [Capacitor Dokümantasyonu](https://capacitorjs.com/docs)
- [Google Play Console Yardım](https://support.google.com/googleplay/android-developer)
- [Android Developer Guide](https://developer.android.com/guide)

## ✅ Kontrol Listesi

- [ ] Node.js ve npm kurulu
- [ ] Android Studio kurulu
- [ ] Java JDK kurulu
- [ ] Proje build edildi
- [ ] Capacitor yapılandırıldı
- [ ] Android platformu eklendi
- [ ] Emülatörde test edildi
- [ ] Fiziksel cihazda test edildi
- [ ] Keystore oluşturuldu
- [ ] Release build oluşturuldu
- [ ] Google Play Console hesabı oluşturuldu
- [ ] Uygulama bilgileri dolduruldu
- [ ] Ekran görüntüleri hazırlandı
- [ ] AAB dosyası yüklendi
- [ ] İnceleme için gönderildi

---

**Başarılar! 🎉**




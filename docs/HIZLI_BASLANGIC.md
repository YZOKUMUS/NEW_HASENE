# 🚀 Hızlı Başlangıç - Android Uygulaması

Bu rehber, Hasene Arapça Dersi projesini en hızlı şekilde Android uygulamasına dönüştürmeniz için adım adım talimatlar içerir.

## ⚡ 5 Dakikada Android Uygulaması

### Gereksinimler
- ✅ Node.js (v16+) kurulu
- ✅ Android Studio kurulu
- ✅ Java JDK kurulu (Android Studio ile gelir)

### Adımlar

#### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

#### 2. Otomatik Kurulum Script'ini Çalıştırın

**Windows:**
```bash
scripts\setup-android.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/setup-android.sh
./scripts/setup-android.sh
```

Bu script şunları yapacak:
- ✅ Tüm bağımlılıkları yükler
- ✅ Projeyi build eder
- ✅ Android platformunu ekler
- ✅ Capacitor sync yapar
- ✅ Android Studio'yu açar

#### 3. Android Studio'da Test Edin

1. **Gradle Sync** tamamlanmasını bekleyin
2. Bir **emülatör** oluşturun veya **fiziksel cihaz** bağlayın
3. **Run** butonuna tıklayın (yeşil play ikonu)
4. Uygulamanız çalışacak! 🎉

## 📦 Release Build Oluşturma

### 1. Keystore Oluşturun (İlk Kez)

```bash
keytool -genkey -v -keystore hasene-release-key.keystore -alias hasene -keyalg RSA -keysize 2048 -validity 10000
```

**ÖNEMLİ:** Keystore şifresini ve bilgilerini güvenli bir yerde saklayın!

### 2. Android Studio'da Release Build

1. **Build > Generate Signed Bundle / APK**
2. **Android App Bundle** seçin
3. Keystore dosyanızı seçin
4. Şifreleri girin
5. **Release** build type'ı seçin
6. **Finish** butonuna tıklayın

### 3. AAB Dosyasını Bulun

```
android/app/build/outputs/bundle/release/app-release.aab
```

Bu dosyayı Google Play Console'a yükleyeceksiniz.

## 🏪 Google Play Store'a Yükleme

### Hızlı Adımlar

1. **Google Play Console**'a gidin: https://play.google.com/console
2. **Yeni uygulama oluştur** butonuna tıklayın
3. Uygulama bilgilerini doldurun:
   - Ad: Hasene Arapça Dersi
   - Kategori: Eğitim
4. **Production > Create new release**
5. AAB dosyanızı yükleyin
6. Release notları ekleyin
7. **Review release** ve **Submit for review**

**Detaylı rehber:** [Android Yayınlama Rehberi](ANDROID_YAYINLAMA_REHBERI.md)

## 🔄 Güncelleme Yapma

1. Değişikliklerinizi yapın
2. `package.json`'da versiyonu güncelleyin
3. `android/app/build.gradle`'da `versionCode`'u artırın
4. Build edin:
   ```bash
   npm run build
   npm run cap:sync
   ```
5. Android Studio'da yeni AAB oluşturun
6. Google Play Console'da yeni release oluşturun

## ❓ Sık Sorulan Sorular

### "Gradle sync failed" hatası alıyorum
- Android Studio'yu yeniden başlatın
- **File > Invalidate Caches / Restart**
- Internet bağlantınızı kontrol edin

### "Build failed" hatası alıyorum
- `android/gradle.properties` dosyasını kontrol edin
- Minimum SDK 22 olmalı
- Java JDK 11+ kurulu olmalı

### Uygulama çalışmıyor
- Chrome DevTools ile debug edin: `chrome://inspect`
- Logcat'te hataları kontrol edin
- Network izinlerini kontrol edin

### Capacitor sync çalışmıyor
```bash
npx cap sync android --force
```

## 📚 Daha Fazla Bilgi

- [Detaylı Yayınlama Rehberi](ANDROID_YAYINLAMA_REHBERI.md)
- [Yapılandırma Örnekleri](ANDROID_YAPILANDIRMA_ORNEKLERI.md)
- [Capacitor Dokümantasyonu](https://capacitorjs.com/docs)

## 🆘 Yardım

Sorun yaşıyorsanız:
1. [GitHub Issues](https://github.com/yzokumus/NEW_HASENE/issues) sayfasına bakın
2. Yeni bir issue oluşturun
3. Hata mesajlarını ve logları paylaşın

---

**Başarılar! 🎉**




# 📱 Android'de Değişiklik Yapma Rehberi

## 🚀 Hızlı Başlangıç

Değişiklik yaptıktan sonra Android uygulamasını güncellemek için:

### Yöntem 1: Script Kullan (ÖNERİLEN)

1. **Script'i çalıştır:**
   ```bash
   .\scripts\sync-to-android.bat
   ```
   
   Veya dosyaya çift tıklayın.

2. **Script otomatik olarak:**
   - ✅ `npm run build` yapar
   - ✅ JavaScript dosyalarını `dist/js` klasörüne kopyalar
   - ✅ Data dosyalarını `dist/data` klasörüne kopyalar
   - ✅ JavaScript dosyalarını Android assets'e kopyalar
   - ✅ `npx cap sync android` yapar

3. **Android Studio'da:**
   - RUN butonuna tıklayın (veya `Shift+F10`)

### Yöntem 2: Manuel Adımlar

Eğer script çalışmazsa, manuel olarak:

```bash
# 1. Build yap
npm run build

# 2. JavaScript dosyalarını dist'e kopyala
mkdir dist\js 2>nul
copy js\*.js dist\js\

# 3. Data dosyalarını dist'e kopyala
mkdir dist\data 2>nul
xcopy /Y /E /I data\* dist\data\

# 4. Capacitor sync
npx cap sync android
```

## 📝 Ne Zaman Script Çalıştırılmalı?

Aşağıdaki durumlarda **mutlaka** script'i çalıştırın:

- ✅ `index.html` dosyasında değişiklik yaptığınızda
- ✅ `style.css` dosyasında değişiklik yaptığınızda
- ✅ `js/` klasöründeki herhangi bir JavaScript dosyasını değiştirdiğinizde
- ✅ `data/` klasöründeki JSON dosyalarını değiştirdiğinizde
- ✅ Yeni JavaScript dosyası eklediğinizde
- ✅ Yeni data dosyası eklediğinizde

## ⚠️ Sorun Giderme

### Butonlar Çalışmıyor

1. **Script'i tekrar çalıştırın:**
   ```bash
   .\scripts\sync-to-android.bat
   ```

2. **Android Studio'da:**
   - `Build > Clean Project`
   - `Build > Rebuild Project`
   - Emulator'u kapatıp tekrar açın
   - RUN butonuna tıklayın

### JavaScript Dosyaları Yüklenmiyor

1. **Kontrol edin:**
   ```bash
   # Android assets'te js dosyaları var mı?
   dir android\app\src\main\assets\public\js
   ```

2. **Yoksa manuel kopyalayın:**
   ```bash
   mkdir android\app\src\main\assets\public\js 2>nul
   copy js\*.js android\app\src\main\assets\public\js\
   npx cap sync android
   ```

### Data Dosyaları Yüklenmiyor

1. **Kontrol edin:**
   ```bash
   # Android assets'te data dosyaları var mı?
   dir android\app\src\main\assets\public\data
   ```

2. **Yoksa manuel kopyalayın:**
   ```bash
   mkdir android\app\src\main\assets\public\data 2>nul
   xcopy /Y /E /I data\* android\app\src\main\assets\public\data\
   npx cap sync android
   ```

## 🔄 Geliştirme İş Akışı

1. **Kod değişikliği yap** (index.html, style.css, js/*.js, vb.)
2. **Script çalıştır:** `.\scripts\sync-to-android.bat`
3. **Android Studio'da RUN:** `Shift+F10`
4. **Test et**
5. **Gerekirse tekrarla**

## 📌 Önemli Notlar

- ⚠️ **Her değişiklikten sonra script'i çalıştırın!**
- ⚠️ **JavaScript dosyaları `dist/js` klasörüne kopyalanmalı** (Capacitor sync için)
- ⚠️ **Data dosyaları `dist/data` klasörüne kopyalanmalı** (Capacitor sync için)
- ⚠️ **Android Studio'da Clean/Rebuild yapmak bazen gerekir**

## 🎯 Hızlı Komutlar

```bash
# Script çalıştır
.\scripts\sync-to-android.bat

# Sadece build
npm run build

# Sadece sync
npx cap sync android

# Android Studio'yu aç
npx cap open android
```

## 💡 İpucu

PowerShell'de hızlı erişim için alias ekleyebilirsiniz:

```powershell
# PowerShell profil dosyasına ekleyin
Set-Alias -Name sync-android -Value ".\scripts\sync-to-android.bat"

# Kullanım
sync-android
```

---

**Son Güncelleme:** 2025-01-XX
**Versiyon:** 1.0


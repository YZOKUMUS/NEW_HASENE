# 🔨 Android Build Yöntemleri

## Yöntem 1: Build Menüsünden (Standart)

1. Üst menüden **Build** sekmesine tıklayın
2. Şu seçeneklerden birini kullanın:
   - **Build > Make Project** (Ctrl+F9)
   - **Build > Clean Project** (önce bunu yapın)
   - **Build > Rebuild Project** (eğer görünüyorsa)

## Yöntem 2: Gradle ile (Terminal/Command Line)

### Windows (PowerShell veya CMD):
```bash
cd android
.\gradlew clean
.\gradlew build
```

### Linux/Mac:
```bash
cd android
./gradlew clean
./gradlew build
```

## Yöntem 3: Android Studio Terminal'inden

1. Android Studio'nun **alt kısmındaki Terminal** sekmesine tıklayın
2. Şu komutları yazın:
```bash
cd android
./gradlew clean
./gradlew build
```

## Yöntem 4: Run Butonu ile (En Kolay)

1. Üstteki yeşil **▶️ Run** butonuna tıklayın
2. Veya **Shift + F10** tuşlarına basın
3. Bu otomatik olarak build yapar ve çalıştırır

## Yöntem 5: Gradle Panel'den

1. Sağ tarafta **Gradle** panelini açın (yoksa: **View > Tool Windows > Gradle**)
2. **android > app > Tasks > build** klasörünü genişletin
3. **clean** ve **build** task'larına çift tıklayın

## Yöntem 6: Sync Project with Gradle Files

1. **File > Sync Project with Gradle Files**
2. Bu genellikle build'i de tetikler

## 🎯 En Hızlı Yöntem (Önerilen)

Sadece **Run** butonuna tıklayın (▶️) - Bu otomatik olarak:
- Projeyi build eder
- Icon'ları günceller
- Uygulamayı çalıştırır

## ✅ Icon Değişikliklerini Uygulamak İçin

Icon'ları değiştirdikten sonra:

1. **En kolay:** Sadece **Run** butonuna tıklayın
2. **Veya:** Terminal'de:
   ```bash
   cd android
   ./gradlew clean
   ```
   Sonra tekrar **Run** butonuna tıklayın

## 🐛 Build Menüsü Görünmüyorsa

- Proje tam yüklenmemiş olabilir
- Gradle sync tamamlanmasını bekleyin
- Android Studio'yu yeniden başlatın
- **File > Invalidate Caches / Restart**

---

**Not:** Icon değişiklikleri için mutlaka **Clean** yapmanız gerekmez, sadece **Run** yeterli olabilir.


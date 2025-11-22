# 🗑️ Android'de Uygulama Kaldırma Yöntemleri

## 🎯 Sorun
Emülatörde uygulamaya uzun basıyorsunuz ama "Uninstall" seçeneği çıkmıyor.

## ✅ ÇÖZÜM: Alternatif Yöntemler

### Yöntem 1: Ayarlar'dan Kaldırma (En Kolay)

1. **Emülatörde Settings (Ayarlar) uygulamasını açın**
2. **Apps** veya **Applications** seçeneğine gidin
   - Bazı Android versiyonlarında: **Apps & notifications**
   - Bazılarında: **Application manager**
3. **Hasene Arapça Dersi** uygulamasını bulun
4. Uygulamaya **tıklayın**
5. **Uninstall** (Kaldır) butonuna tıklayın
6. **OK** veya **Delete** ile onaylayın

### Yöntem 2: App Drawer'dan Kaldırma

1. **Emülatörün ana ekranında** alt kısımdaki **grid/dots** ikonuna tıklayın (tüm uygulamalar)
2. **Hasene Arapça Dersi** uygulamasını bulun
3. Uygulamaya **uzun basın**
4. Üst kısımda **çöp kutusu** ikonu görünecek
5. Uygulamayı **çöp kutusuna sürükleyin**
6. **OK** ile onaylayın

### Yöntem 3: Android Studio'dan Kaldırma

1. **Android Studio'yu açın**
2. **View > Tool Windows > Device File Explorer** açın
3. Emülatörünüzü seçin
4. Veya terminal'den:
   ```bash
   adb uninstall com.hasene.arapca
   ```

### Yöntem 4: ADB Komutu ile (Terminal)

1. **Android Studio'nun Terminal sekmesini** açın
2. Şu komutu yazın:
   ```bash
   adb uninstall com.hasene.arapca
   ```
3. **Enter** tuşuna basın
4. Uygulama kaldırılacak

### Yöntem 5: Sadece Yeniden Yükleme (Önerilen)

**Aslında kaldırmaya gerek yok!** Sadece:

1. **Android Studio'da RUN butonuna tıklayın**
2. Uygulama **otomatik olarak güncellenecek**
3. Yeni icon görünecek

## 🚀 EN KOLAY YÖNTEM (Önerilen)

**Uygulamayı kaldırmaya gerek yok!** Sadece:

1. **Android Studio'da yeşil RUN butonuna (▶️) tıklayın**
2. Uygulama **otomatik olarak yeniden yüklenecek**
3. Yeni icon görünecek

## ✅ Kontrol

Icon değiştiyse:
- ✅ Ana ekranda **kırmızı Mushaf icon'u** görünüyor
- ✅ Uygulama çalışıyor

## 💡 Neden Uninstall Çıkmıyor?

- Bazı Android versiyonlarında sistem uygulamaları gibi görünebilir
- Launcher ayarları farklı olabilir
- Emülatör versiyonu farklı olabilir

**Çözüm:** Ayarlar'dan kaldırın veya sadece yeniden yükleyin!

---

**ÖNEMLİ:** Aslında uygulamayı kaldırmaya gerek yok! Sadece RUN butonuna tıklayın, uygulama otomatik güncellenir.


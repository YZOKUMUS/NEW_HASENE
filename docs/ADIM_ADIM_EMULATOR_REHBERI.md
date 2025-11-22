# 📱 ADIM ADIM EMÜLATÖR REHBERİ - BAŞTAN SONA

Bu rehber, Android Studio'yu açıp emülatörde uygulamayı çalıştırmak için **TÜM ADIMLARI** içerir.

## 🎯 HEDEF
Emülatörde Hasene Arapça Dersi uygulamasını çalıştırmak ve icon'un görünmesini sağlamak.

---

## 📋 ADIM 1: ANDROID STUDIO'YU AÇIN

1. **Masaüstünde** Android Studio ikonuna çift tıklayın
2. Veya: **Başlat Menüsü > Android Studio**
3. Android Studio açılmasını bekleyin (1-2 dakika)

---

## 📋 ADIM 2: PROJEYİ AÇIN

1. Android Studio açıldığında:
   - **"Open"** veya **"Open an Existing Project"** butonuna tıklayın
2. Şu klasörü seçin:
   ```
   C:\Users\ziyao\Desktop\NEW_HASENE\android
   ```
3. **OK** butonuna tıklayın
4. **Gradle Sync** başlayacak (alt kısımda progress bar görünecek)
5. **Gradle Sync tamamlanmasını bekleyin** (2-5 dakika, ilk kez daha uzun sürebilir)

---

## 📋 ADIM 3: EMÜLATÖR OLUŞTURMA (İlk Kez İse)

### Eğer daha önce emülatör oluşturduysanız, bu adımı atlayın!

1. Android Studio'da üst menüden:
   - **Tools > Device Manager**
2. **Create Device** butonuna tıklayın
3. **Phone** kategorisini seçin
4. Bir cihaz seçin (örn: **Pixel 5** veya **Pixel 6**)
5. **Next** butonuna tıklayın
6. Sistem görüntüsü seçin:
   - **API Level 33** veya **34** seçin (önerilen)
   - **Download** butonuna tıklayın (eğer yoksa, indirilecek)
7. **Next** butonuna tıklayın
8. Emülatör adını değiştirebilirsiniz (isteğe bağlı)
9. **Finish** butonuna tıklayın

---

## 📋 ADIM 4: EMÜLATÖRÜ BAŞLATIN

1. **Device Manager** penceresinde (Tools > Device Manager)
2. Oluşturduğunuz emülatörün yanındaki **▶️ Play** butonuna tıklayın
3. Emülatör açılmasını bekleyin (1-2 dakika)
4. Android ekranı görünecek

---

## 📋 ADIM 5: UYGULAMAYI ÇALIŞTIRIN

### Yöntem 1: Run Butonu (Önerilen)

1. Android Studio'nun **üst kısmında** yeşil **▶️ Run** butonuna tıklayın
   - Veya: **Shift + F10** tuşlarına basın
2. Açılan pencerede **emülatörünüzü seçin**
   - Zaten açıksa otomatik seçilir
3. **OK** butonuna tıklayın
4. Build başlayacak (alt kısımda progress görünecek)
5. Build tamamlandığında (1-2 dakika):
   - ✅ Uygulama emülatöre yüklenecek
   - ✅ Uygulama otomatik açılacak
   - ✅ Icon ana ekranda görünecek

### Yöntem 2: Menüden

1. Üst menüden: **Run > Run 'app'**
2. Emülatörünüzü seçin
3. **OK** butonuna tıklayın

---

## 📋 ADIM 6: UYGULAMAYI KONTROL EDİN

### Emülatörde Göreceğiniz:

1. **Ana Ekranda:**
   - ✅ **"Hasene Arapça Dersi"** icon'u görünecek
   - ✅ Kırmızı arka plan, altın renkli kitap ve hilal

2. **Uygulama Açıldığında:**
   - ✅ "Hasene Arapça Dersi" ana ekranı
   - ✅ Oyun modları menüsü
   - ✅ Tüm özellikler çalışıyor

3. **Icon'a Tıklayınca:**
   - ✅ Uygulama açılacak
   - ✅ Tüm özellikler çalışacak

---

## ❓ SORUN GİDERME

### Sorun 1: "Gradle Sync Failed"
**Çözüm:**
1. **File > Invalidate Caches / Restart**
2. **Invalidate and Restart** butonuna tıklayın
3. Android Studio yeniden başlayacak
4. Gradle sync tekrar başlayacak

### Sorun 2: "Build Failed"
**Çözüm:**
1. **Build > Clean Project**
2. **Build > Rebuild Project**
3. Tekrar **Run** butonuna tıklayın

### Sorun 3: "Emülatör Açılmıyor"
**Çözüm:**
1. **Tools > Device Manager**
2. Emülatörün yanındaki **▼** (dropdown) butonuna tıklayın
3. **Cold Boot Now** seçin
4. Veya emülatörü silip yeniden oluşturun

### Sorun 4: "Icon Görünmüyor"
**Çözüm:**
1. Emülatörde uygulamaya **uzun basın**
2. **Kaldır** (Uninstall) seçeneğine tıklayın
3. Android Studio'da tekrar **Run** butonuna tıklayın
4. Uygulama yeniden yüklenecek

### Sorun 5: "Bluetooth Keeps Stopping"
**Çözüm:**
1. Hata penceresinde **OK**'a tıklayın
2. Bu hata uygulamanızı etkilemez
3. Hasene uygulaması Bluetooth kullanmıyor
4. Uygulamayı kullanmaya devam edin

---

## ✅ BAŞARI KONTROL LİSTESİ

- [ ] Android Studio açıldı
- [ ] Proje açıldı (android klasörü)
- [ ] Gradle sync tamamlandı
- [ ] Emülatör oluşturuldu (veya mevcut)
- [ ] Emülatör başlatıldı
- [ ] Run butonuna tıklandı
- [ ] Build başarılı oldu
- [ ] Uygulama emülatöre yüklendi
- [ ] Icon ana ekranda görünüyor
- [ ] Uygulama açılıyor
- [ ] Oyun modları çalışıyor

---

## 🎯 ÖZET: YAPMANIZ GEREKENLER

1. ✅ **Android Studio'yu açın**
2. ✅ **Projeyi açın** (android klasörü)
3. ✅ **Gradle sync tamamlanmasını bekleyin**
4. ✅ **Emülatörü başlatın** (Device Manager'dan)
5. ✅ **Run butonuna tıklayın** (▶️)
6. ✅ **Uygulamayı kontrol edin**

---

## 💡 İPUÇLARI

1. **İlk kez daha uzun sürebilir:**
   - Gradle sync: 2-5 dakika
   - Emülatör açılması: 1-2 dakika
   - Build: 1-2 dakika

2. **Emülatör yavaşsa:**
   - Daha düşük çözünürlüklü emülatör kullanın
   - RAM ayarlarını artırın

3. **Her değişiklikten sonra:**
   - Run butonuna tıklayın
   - Uygulama otomatik güncellenir

---

## 🆘 YARDIM

Eğer hala sorun yaşıyorsanız:
1. Android Studio'nun **Logcat** sekmesine bakın
2. Hata mesajlarını kontrol edin
3. **Build** sekmesindeki hataları okuyun

---

**BAŞARILAR! 🎉**

Bu rehberi adım adım takip ederseniz, uygulamanız emülatörde çalışacak!


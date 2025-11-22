# 📱 Google Play Store'a Yükleme - Adım Adım Rehber

## 🎯 HEDEF
Hasene Arapça Dersi uygulamanızı Google Play Store'a yüklemek.

---

## 📋 ADIM 1: GOOGLE PLAY CONSOLE HESABI OLUŞTURMA

### 1.1. Google Play Console'a Gidin
- **Adres:** https://play.google.com/console
- Google hesabınızla giriş yapın

### 1.2. Developer Hesabı Oluşturun
1. **"Create account"** veya **"Get started"** butonuna tıklayın
2. **Developer hesabı bilgilerini** doldurun:
   - **Developer name:** İstediğiniz isim (örn: "Hasene Games")
   - **Email:** E-posta adresiniz
   - **Phone:** Telefon numaranız
3. **Developer Program Policies**'i okuyun ve kabul edin
4. **Ödeme:** $25 bir kerelik ücret ödeyin
   - Kredi kartı veya PayPal ile ödeme yapabilirsiniz
   - Bu ücret **bir kerelik**dir, sınırsız uygulama yayınlayabilirsiniz

### 1.3. Hesap Doğrulama
- Telefon numaranızı doğrulayın
- E-posta adresinizi doğrulayın
- Ödeme işlemini tamamlayın

**Süre:** 1-2 gün (bazen daha hızlı)

---

## 📋 ADIM 2: RELEASE BUILD OLUŞTURMA

### 2.1. Keystore Oluşturma (İlk Kez)

#### Windows PowerShell veya CMD:
```bash
cd C:\Users\ziyao\Desktop\NEW_HASENE
keytool -genkey -v -keystore hasene-release-key.keystore -alias hasene -keyalg RSA -keysize 2048 -validity 10000
```

#### Sorular:
- **Enter keystore password:** Güçlü bir şifre girin (unutmayın!)
- **Re-enter password:** Aynı şifreyi tekrar girin
- **What is your first and last name?** İsim (örn: Hasene Games)
- **Organizational Unit?** (boş bırakabilirsiniz)
- **Organization?** (boş bırakabilirsiniz)
- **City?** Şehir
- **State?** İl/İlçe
- **Country code?** TR (Türkiye için)

**ÖNEMLİ:** 
- Keystore dosyasını (`hasene-release-key.keystore`) **güvenli bir yerde saklayın!**
- Şifreyi **unutmayın!** Kaybederseniz uygulamanızı güncelleyemezsiniz!

### 2.2. Android Studio'da Release Build

1. **Android Studio'yu açın**
2. **android** projesini açın
3. Üst menüden: **Build > Generate Signed Bundle / APK**
4. **Android App Bundle** seçin (önerilen)
   - APK da seçebilirsiniz ama AAB daha iyi
5. **Next** butonuna tıklayın

### 2.3. Keystore Seçimi

1. **Key store path:** Keystore dosyanızı seçin
   - `C:\Users\ziyao\Desktop\NEW_HASENE\hasene-release-key.keystore`
2. **Key store password:** Keystore şifrenizi girin
3. **Key alias:** `hasene` (oluştururken verdiğiniz alias)
4. **Key password:** Key şifrenizi girin (genellikle keystore şifresiyle aynı)
5. **Next** butonuna tıklayın

### 2.4. Build Type Seçimi

1. **Build variants:** `release` seçin
2. **Destination folder:** Nereye kaydedileceğini seçin
3. **Finish** butonuna tıklayın
4. Build başlayacak (1-2 dakika)

### 2.5. AAB Dosyasını Bulun

Build tamamlandığında:
```
android/app/build/outputs/bundle/release/app-release.aab
```

Bu dosyayı Google Play Console'a yükleyeceksiniz.

---

## 📋 ADIM 3: GOOGLE PLAY CONSOLE'DA UYGULAMA OLUŞTURMA

### 3.1. Yeni Uygulama Oluştur

1. Google Play Console'a giriş yapın
2. Sol menüden **"All apps"** seçin
3. **"Create app"** butonuna tıklayın

### 3.2. Uygulama Bilgileri

1. **App name:** `Hasene Arapça Dersi`
2. **Default language:** Turkish (Türkçe)
3. **App or game:** `App` seçin
4. **Free or paid:** `Free` seçin
5. **Declarations:** Gerekli kutuları işaretleyin
6. **Create app** butonuna tıklayın

---

## 📋 ADIM 4: UYGULAMA BİLGİLERİNİ DOLDURMA

### 4.1. Store Listing (Mağaza Listesi)

#### Uygulama Adı:
- **App name:** Hasene Arapça Dersi

#### Kısa Açıklama (80 karakter):
```
Arapça öğrenmeyi eğlenceli hale getiren interaktif eğitim oyunu
```

#### Tam Açıklama (4000 karakter):
```
Hasene Arapça Dersi, Arapça öğrenmeyi eğlenceli ve interaktif hale getiren kapsamlı bir eğitim uygulamasıdır.

🎮 6 Farklı Oyun Modu:
• Kelime Çevir: Arapça kelimelerin Türkçe karşılıklarını bulun
• Dinle ve Bul: Sesli telaffuzlarla kelimeleri öğrenin
• Boşluk Doldur: Ayetlerdeki eksik kelimeleri tamamlayın
• Ayet Oku: Kuran ayetlerini okuyun ve öğrenin
• Dua Öğren: Günlük duaları öğrenin
• Hadis Oku: Hadis-i şerifleri okuyun

🏆 İlerleme Sistemi:
• Rozet Sistemi: Bronz, Gümüş, Altın, Elmas rozetler
• XP Sistemi: Deneyim puanları ve seviye atlama
• Combo Bonusları: Ardışık doğru cevaplarla bonus puanlar
• Günlük Görevler: Her gün yeni hedefler

📊 Özellikler:
• Offline çalışma desteği
• Karanlık tema
• Sesli telaffuz
• İstatistik takibi
• Favori kelimeler

Arapça öğrenme yolculuğunuzda size yardımcı olmak için tasarlandı.
```

#### Kategori:
- **App category:** Education (Eğitim)
- **Tags:** education, arabic, quran, islamic, learning

#### Grafikler:

**Uygulama İkonu (512x512):**
- `assets/images/icon-512-v4-RED-MUSHAF.png` dosyasını kullanın

**Özellik Grafiği (1024x500):**
- Play Store'da üstte görünen büyük görsel
- Photoshop veya online tool ile oluşturabilirsiniz
- Uygulama adı ve özellikler içermeli

**Ekran Görüntüleri:**
- En az 2, en fazla 8 ekran görüntüsü
- Farklı cihaz boyutları için (telefon, tablet)
- Minimum: 320px, Maksimum: 3840px
- Emülatörde ekran görüntüsü alabilirsiniz:
  - Android Studio'da: **View > Tool Windows > Device File Explorer**
  - Veya emülatörde: **Power + Volume Down**

### 4.2. Content Rating (İçerik Derecelendirmesi)

1. **Content rating** sekmesine gidin
2. **Questionnaire** butonuna tıklayın
3. Soruları doldurun:
   - **Category:** Education
   - **Violence:** No
   - **Sexual content:** No
   - **Profanity:** No
   - **Drugs:** No
   - **Gambling:** No
4. **Submit** butonuna tıklayın
5. Genellikle **"Everyone"** derecesi alırsınız

### 4.3. Privacy Policy (Gizlilik Politikası)

Google Play Store, gizlilik politikası URL'si ister.

#### Seçenek 1: GitHub Pages (Ücretsiz)
1. GitHub'da bir repository oluşturun
2. `privacy-policy.md` dosyası oluşturun
3. GitHub Pages'i aktif edin
4. URL: `https://kullaniciadi.github.io/repo-adi/privacy-policy`

#### Seçenek 2: Basit Gizlilik Politikası Örneği:
```markdown
# Gizlilik Politikası

Hasene Arapça Dersi uygulaması, kullanıcı gizliliğine önem verir.

## Veri Toplama
Uygulama, kullanıcı verilerini cihazda (localStorage) saklar.
Hiçbir veri sunucuya gönderilmez.

## İzinler
Uygulama internet bağlantısı gerektirir (ses dosyaları için).
Kullanıcı verileri cihazda saklanır.

## İletişim
Sorularınız için: [e-posta adresiniz]
```

---

## 📋 ADIM 5: AAB DOSYASINI YÜKLEME

### 5.1. Production Release Oluştur

1. Sol menüden **"Production"** sekmesine gidin
2. **"Create new release"** butonuna tıklayın

### 5.2. AAB Dosyasını Yükleyin

1. **"Upload"** butonuna tıklayın
2. `app-release.aab` dosyanızı seçin
3. Yükleme tamamlanmasını bekleyin (1-2 dakika)

### 5.3. Release Notes (Sürüm Notları)

**Turkish (Türkçe):**
```
İlk sürüm yayınlandı!

Özellikler:
• 6 farklı oyun modu
• Rozet sistemi
• Günlük görevler
• Offline çalışma desteği
• Karanlık tema
```

### 5.4. Review Release

1. **"Review release"** butonuna tıklayın
2. Bilgileri kontrol edin
3. **"Start rollout to Production"** butonuna tıklayın

---

## 📋 ADIM 6: İNCELEME SÜRECİ

### 6.1. İnceleme Süresi
- Genellikle **1-3 gün** sürer
- Bazen daha hızlı (birkaç saat)
- Bazen daha uzun (1 hafta)

### 6.2. İnceleme Sonucu

#### Onaylandıysa:
- ✅ Uygulama Play Store'da görünecek
- ✅ Kullanıcılar indirebilecek

#### Reddedildiyse:
- ❌ Reddetme nedenini okuyun
- ❌ Gerekli düzeltmeleri yapın
- ❌ Yeni release oluşturun

---

## 📋 ADIM 7: GÜNCELLEME YAPMA

### 7.1. Yeni Versiyon

1. `package.json`'da versiyonu güncelleyin:
   ```json
   "version": "1.0.1"
   ```

2. `android/app/build.gradle`'da:
   ```gradle
   versionCode 2  // Her güncellemede artırın
   versionName "1.0.1"
   ```

3. Değişiklikleri yapın

4. Yeni AAB oluşturun

5. Google Play Console'da yeni release oluşturun

---

## ✅ KONTROL LİSTESİ

### Hazırlık:
- [ ] Google Play Console hesabı oluşturuldu
- [ ] $25 ödendi
- [ ] Keystore oluşturuldu
- [ ] Keystore güvenli yerde saklandı

### Build:
- [ ] Release build oluşturuldu
- [ ] AAB dosyası hazır
- [ ] Versiyon numaraları doğru

### Store Listing:
- [ ] Uygulama adı dolduruldu
- [ ] Açıklamalar yazıldı
- [ ] Icon yüklendi (512x512)
- [ ] Özellik grafiği hazırlandı (1024x500)
- [ ] Ekran görüntüleri hazırlandı (en az 2)

### Yayınlama:
- [ ] İçerik derecelendirmesi yapıldı
- [ ] Gizlilik politikası eklendi
- [ ] AAB dosyası yüklendi
- [ ] Release notları yazıldı
- [ ] İnceleme için gönderildi

---

## 💡 İPUÇLARI

1. **İlk yayınlama:**
   - Tüm bilgileri eksiksiz doldurun
   - Kaliteli ekran görüntüleri kullanın
   - Açıklamaları dikkatli yazın

2. **Keystore:**
   - Mutlaka yedekleyin!
   - Şifreyi unutmayın!
   - Güvenli bir yerde saklayın!

3. **Versiyon:**
   - Her güncellemede `versionCode`'u artırın
   - `versionName` kullanıcıya gösterilen versiyon

4. **Test:**
   - Release build'i test edin
   - Tüm özelliklerin çalıştığından emin olun

---

## 🆘 SORUN GİDERME

### "App not eligible"
- Tüm bilgileri doldurduğunuzdan emin olun
- Gizlilik politikası eklediğinizden emin olun

### "Keystore error"
- Keystore dosyasının doğru olduğundan emin olun
- Şifrenin doğru olduğundan emin olun

### "Build error"
- Android Studio'da **Build > Clean Project**
- Sonra tekrar build yapın

---

## 🎉 BAŞARILAR!

Uygulamanızı Google Play Store'a yükledikten sonra:
- ✅ Tüm kullanıcılara ulaşabilirsiniz
- ✅ Otomatik güncellemeler yapabilirsiniz
- ✅ İstatistikleri takip edebilirsiniz

**Detaylı rehber:** [ANDROID_YAYINLAMA_REHBERI.md](ANDROID_YAYINLAMA_REHBERI.md)

---

**Sorularınız için:** Google Play Console Yardım Merkezi veya dokümantasyon dosyalarına bakın.


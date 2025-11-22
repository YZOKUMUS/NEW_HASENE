# 🧪 Uygulama Test Kontrol Listesi

## 🎯 Test Edilmesi Gerekenler

### 1. Ana Menü ve Navigasyon
- [ ] Ana menü açılıyor mu?
- [ ] Tüm oyun modları görünüyor mu?
- [ ] Oyun modlarına tıklanabiliyor mu?
- [ ] Geri butonu çalışıyor mu?
- [ ] Menü geçişleri sorunsuz mu?

### 2. Oyun Modları

#### Kelime Çevir:
- [ ] Sorular geliyor mu?
- [ ] Cevap seçenekleri görünüyor mu?
- [ ] Doğru cevap verildiğinde puan artıyor mu?
- [ ] Yanlış cevap verildiğinde can azalıyor mu?
- [ ] Ses çalıyor mu?
- [ ] Timer çalışıyor mu?
- [ ] Geri butonu çalışıyor mu?

#### Dinle ve Bul:
- [ ] Ses çalıyor mu?
- [ ] Sorular geliyor mu?
- [ ] Cevap seçenekleri görünüyor mu?
- [ ] Puan sistemi çalışıyor mu?

#### Boşluk Doldur:
- [ ] Ayetler görünüyor mu?
- [ ] Boşluklar doğru mu?
- [ ] Cevap seçenekleri görünüyor mu?
- [ ] Puan sistemi çalışıyor mu?

#### Ayet Oku:
- [ ] Ayetler görünüyor mu?
- [ ] Ses çalıyor mu?
- [ ] Navigasyon çalışıyor mu?

#### Dua Öğren:
- [ ] Dualar görünüyor mu?
- [ ] Ses çalıyor mu?
- [ ] Navigasyon çalışıyor mu?

#### Hadis Oku:
- [ ] Hadisler görünüyor mu?
- [ ] Navigasyon çalışıyor mu?

### 3. Puan ve İlerleme Sistemi
- [ ] XP puanları kaydediliyor mu?
- [ ] Seviye atlama çalışıyor mu?
- [ ] Rozetler veriliyor mu?
- [ ] Combo bonusları çalışıyor mu?
- [ ] İstatistikler kaydediliyor mu?

### 4. Günlük Görevler
- [ ] Günlük görevler görünüyor mu?
- [ ] Görevler tamamlandığında işaretleniyor mu?
- [ ] Ödüller veriliyor mu?
- [ ] Takvim sistemi çalışıyor mu?

### 5. Veri Kaydetme
- [ ] Puanlar kaydediliyor mu?
- [ ] İstatistikler kaydediliyor mu?
- [ ] Favoriler kaydediliyor mu?
- [ ] Uygulama kapatılıp açıldığında veriler korunuyor mu?

### 6. Ses Sistemi
- [ ] Ses çalıyor mu?
- [ ] Ses ayarları çalışıyor mu?
- [ ] Ses kapatma/açma çalışıyor mu?

### 7. Dark Mode
- [ ] Dark mode açılıyor mu?
- [ ] Dark mode kapatılıyor mu?
- [ ] Tema değişikliği sorunsuz mu?

### 8. Fiziksel Cihazda Test
- [ ] Samsung telefonunuzda çalışıyor mu?
- [ ] Tüm özellikler çalışıyor mu?
- [ ] Performans iyi mi?
- [ ] Batarya tüketimi normal mi?

### 9. Hata Kontrolü
- [ ] Uygulama çöküyor mu?
- [ ] Hata mesajları var mı?
- [ ] Logcat'te hatalar var mı?
- [ ] Konsol hataları var mı?

### 10. UI/UX Kontrolü
- [ ] Butonlar tıklanabilir mi?
- [ ] Metinler okunabilir mi?
- [ ] Görseller düzgün görünüyor mu?
- [ ] Responsive tasarım çalışıyor mu?
- [ ] Farklı ekran boyutlarında test edildi mi?

## 🔍 Test Yöntemleri

### Emülatörde Test:
1. Tüm oyun modlarını deneyin
2. Farklı zorluk seviyelerini test edin
3. Uzun süre oynayın (memory leak kontrolü)
4. Uygulamayı kapatıp açın (veri kaydetme kontrolü)

### Fiziksel Cihazda Test:
1. Samsung telefonunuzda test edin
2. Farklı Android versiyonlarında test edin (mümkünse)
3. Farklı ekran boyutlarında test edin
4. Gerçek kullanım senaryolarını test edin

### Chrome DevTools ile Debug:
1. `chrome://inspect` adresine gidin
2. Emülatörünüzü seçin
3. **Inspect** butonuna tıklayın
4. **Console** sekmesinde hataları kontrol edin
5. **Network** sekmesinde yüklenmeyen dosyaları kontrol edin

### Android Studio Logcat:
1. Android Studio'da **Logcat** sekmesini açın
2. Uygulamayı çalıştırın
3. Hata mesajlarını kontrol edin
4. Kırmızı hataları not edin

## 🐛 Bulunan Hatalar

### Hata Listesi:
1. [ ] Hata 1: ...
2. [ ] Hata 2: ...
3. [ ] Hata 3: ...

### Düzeltme Notları:
- [ ] Hata 1 düzeltildi
- [ ] Hata 2 düzeltildi
- [ ] Hata 3 düzeltildi

## ✅ Test Sonucu

### Başarılı Testler:
- [ ] Tüm oyun modları çalışıyor
- [ ] Puan sistemi çalışıyor
- [ ] Veri kaydetme çalışıyor
- [ ] Ses sistemi çalışıyor
- [ ] Fiziksel cihazda çalışıyor

### Düzeltilmesi Gerekenler:
- [ ] ...
- [ ] ...
- [ ] ...

## 🎯 Test Tamamlandığında

1. ✅ Tüm testler başarılı
2. ✅ Hatalar düzeltildi
3. ✅ Fiziksel cihazda test edildi
4. ✅ Performans iyi
5. ✅ **Release Build oluşturulabilir!**

---

**İyi testler! 🧪**

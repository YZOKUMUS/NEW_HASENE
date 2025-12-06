# 🧪 Test Paneli Kullanım Kılavuzu

## 📋 İçindekiler
1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Örnek Senaryo](#örnek-senaryo)
3. [Test Durumları](#test-durumları)
4. [Rapor Oluşturma](#rapor-oluşturma)
5. [Sorun Bildirimi](#sorun-bildirimi)

---

## 🚀 Hızlı Başlangıç

### Adım 1: Test Paneli Açma
1. `test-panel.html` dosyasını tarayıcıda açın
2. Sayfa otomatik olarak `TEST_SENARYOSU_TAM.csv` dosyasını yükler
3. Tüm testler kategorilere göre gruplanmış olarak görünür

### Adım 2: Test Yapma
1. Oyunu açın (`index.html`)
2. Test panelinde ilgili testi bulun
3. Test adımlarını takip edin
4. Her adım için durum seçin:
   - ⏳ **Bekleyen**: Henüz test edilmedi
   - ✅ **Tamamlandı**: Test başarılı
   - ❌ **Başarısız**: Sorun var

### Adım 3: Not Ekleme
- Sorun varsa "Notlar" bölümüne detaylı açıklama yazın
- Ne oldu, ne bekleniyordu, hangi adımda sorun çıktı?

### Adım 4: Rapor Oluşturma
- Test bittiğinde "📊 Rapor Oluştur" butonuna tıklayın
- Raporu kopyalayıp paylaşın

---

## 📝 Örnek Senaryo

### Senaryo: "Kelime Çevir Oyunu" Testi

**Test:** OYUN MODLARI → Test 2: Kelime Çevir Oyunu

#### Adım 1: Oyunu Başlatma
1. Ana menüden "Kelime Çevir" modunu seçin
2. Test panelinde bu adımı bulun
3. Durum: ✅ **Tamamlandı** seçin
4. Checkbox'ı işaretleyin

#### Adım 2: Zorluk Seviyesi
1. Zorluk seviyesi seçin (Kolay/Normal/Zor)
2. Test panelinde bu adımı bulun
3. Durum: ✅ **Tamamlandı** seçin

#### Adım 3: Soru Görüntüleme
1. İlk soru yüklendi
2. Test panelinde "Arapça kelime görünüyor mu?" kontrolünü bulun
3. ✅ Kelime görünüyor → Durum: **Tamamlandı**

#### Adım 4: Seçenek Kontrolü
1. Test panelinde "4 seçenek görünüyor mu?" kontrolünü bulun
2. ❌ **SORUN VAR!** Sadece 3 seçenek görünüyor
3. Durum: ❌ **Başarısız** seçin
4. Notlar bölümüne yazın:
   ```
   Sadece 3 seçenek görünüyor, 4. seçenek eksik.
   Beklenen: 4 seçenek görünmeli.
   Adım: Soru yüklendiğinde
   ```

#### Adım 5: Doğru Cevap
1. Doğru cevabı seçin
2. Test panelinde "Doğru cevap mesajı gösterildi mi?" kontrolünü bulun
3. ✅ Mesaj gösterildi → Durum: **Tamamlandı**

---

## 🎨 Test Durumları

### ⏳ Bekleyen (Sarı)
- Henüz test edilmedi
- Varsayılan durum
- Test yapıldığında güncelleyin

### ✅ Tamamlandı (Yeşil)
- Test başarılı
- Beklenen sonuç alındı
- Sorun yok
- **İpucu:** Checkbox'ı işaretlemek otomatik olarak "Tamamlandı" yapar

### ❌ Başarısız (Kırmızı)
- Test başarısız
- Sorun tespit edildi
- **Mutlaka not ekleyin!**
- Rapor oluştururken öncelikli olarak gösterilir

---

## 📊 Rapor Oluşturma

### Yöntem 1: Rapor İndirme
1. "📊 Rapor Oluştur" butonuna tıklayın
2. Rapor otomatik olarak `.txt` dosyası olarak indirilir
3. Dosyayı açıp kontrol edin

### Yöntem 2: Raporu Kopyalama
1. "📋 Raporu Kopyala" butonuna tıklayın
2. Rapor panoya kopyalanır
3. ChatGPT veya başka bir yere yapıştırın

### Rapor İçeriği
Rapor şunları içerir:
- ✅ Genel istatistikler (toplam, tamamlanan, başarısız, bekleyen)
- 📁 Kategori bazında ilerleme
- ❌ Başarısız testler özeti (öncelikli)
- 📝 Tüm notlar ve açıklamalar
- 📅 Rapor oluşturulma tarihi

### Örnek Rapor Çıktısı
```
🧪 HASENE OYUNU - TEST RAPORU
═══════════════════════════════════════
Tarih: 25.12.2024 14:30:00
═══════════════════════════════════════

📊 GENEL İSTATİSTİKLER
─────────────────────────────────────
Toplam Test: 220
✅ Tamamlanan: 180 (82%)
❌ Başarısız: 5 (2%)
⏳ Bekleyen: 35 (16%)

📁 OYUN MODLARI
─────────────────────────────────────
Tamamlanan: 45/50
Başarısız: 2

  Test 2: Kelime Çevir Oyunu
  ───────────────────────────────────
  Durum: 8/10 ✓ | 1 ✗

    ❌ [Adım 3] 4 seçenek görünüyor mu?
      Beklenen: 4 seçenek görünüyor mu?
      Notlar: Sadece 3 seçenek görünüyor, 4. seçenek eksik

❌ BAŞARISIZ TESTLER ÖZETİ
─────────────────────────────────────
• OYUN MODLARI - Test 2: Kelime Çevir Oyunu
  Adım 3: 4 seçenek görünüyor mu?
  Not: Sadece 3 seçenek görünüyor, 4. seçenek eksik
```

---

## ❌ Sorun Bildirimi

### Bir Test Başarısız Olduğunda

1. **Durum Güncelleme**
   - Test durumunu ❌ **Başarısız** olarak işaretleyin
   - Checkbox'ı kaldırın (başarısız testler checkbox'sız olmalı)

2. **Detaylı Not Ekleme**
   Notlar bölümüne şunları yazın:
   - **Ne oldu?** (Sorunun açıklaması)
   - **Ne bekleniyordu?** (Beklenen davranış)
   - **Hangi adımda?** (Test adımı)
   - **Ekran görüntüsü?** (Varsa belirtin)

3. **Örnek İyi Not:**
   ```
   Kelime Çevir oyununda soru yüklendiğinde sadece 3 seçenek görünüyor.
   Beklenen: 4 seçenek görünmeli.
   Adım: Soru yüklendiğinde (Adım 3)
   Ekran görüntüsü: [ekran_goruntusu.png]
   ```

4. **Rapor Oluşturma**
   - Test bittiğinde raporu oluşturun
   - Başarısız testler otomatik olarak özetlenir
   - Raporu paylaşın

---

## 🔍 Filtreleme ve Arama

### Kategori Filtresi
- Belirli bir kategoriye odaklanın
- Örnek: Sadece "VERİ SİSTEMİ" testlerini görmek için

### Durum Filtresi
- **Tüm Durumlar:** Varsayılan, hepsini gösterir
- **Bekleyen:** Henüz test edilmemiş testler
- **Tamamlanan:** Başarılı testler
- **Başarısız:** Sorunlu testler (hızlı kontrol için)

### Arama
- Test adı, açıklama veya kontrol noktasında arama yapın
- Örnek: "streak" yazarak streak ile ilgili tüm testleri bulun

---

## 💾 Otomatik Kayıt

- Test ilerlemeniz otomatik olarak **localStorage**'a kaydedilir
- Sayfayı kapatsanız bile ilerlemeniz korunur
- Farklı cihazlarda aynı tarayıcıyı kullanırsanız verileriniz görünür
- Test durumları ve notlarınız kaybolmaz

**Not:** "🔄 Sıfırla" butonu tüm ilerlemeyi siler (onay ister).

---

## 🎯 İpuçları

✅ **Testleri sırayla yapın**, atlamayın  
✅ **Her test için beklenen sonucu kontrol edin**  
✅ **Sorun varsa hemen not alın**, unutmayın  
✅ **Kategorilere göre test edin** (daha organize)  
✅ **Düzenli olarak rapor oluşturup yedekleyin**  
✅ **Başarısız testleri filtreleyerek hızlıca gözden geçirin**  
✅ **Kategori başlıklarına tıklayarak kategorileri açıp kapatabilirsiniz**

---

## 📸 Ekran Görüntüsü Alma

### Windows
- **Win + Shift + S**: Ekran Alıntısı Aracı
- Veya: Snipping Tool

### Mac
- **Cmd + Shift + 4**: Ekran görüntüsü al

### Tarayıcı
- **F12** → Console → Screenshot
- Veya: Tarayıcı geliştirici araçları

**Not:** Ekran görüntülerini notlar bölümünde belirtin veya raporla birlikte paylaşın.

---

## 🆘 Yardım

Test panelinde **"❓ Nasıl Kullanılır?"** butonuna tıklayarak bu kılavuzu tekrar görebilirsiniz.

---

**Son Güncelleme:** 25 Aralık 2024


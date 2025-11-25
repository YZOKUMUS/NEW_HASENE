# 🧪 HASENE - KAPSAMLI TEST PLANI

Bu test planı, Hasene Arapça Öğrenme Oyunu'nun tüm özelliklerini sistematik olarak test etmek için hazırlanmıştır.

---

## 📋 İÇİNDEKİLER

1. [Genel Test Hazırlığı](#1-genel-test-hazırlığı)
2. [Oyun Modları Testleri](#2-oyun-modları-testleri)
3. [Puan ve Ödül Sistemleri Testleri](#3-puan-ve-ödül-sistemleri-testleri)
4. [İstatistik ve Takip Testleri](#4-istatistik-ve-takip-testleri)
5. [Kullanıcı Arayüzü Testleri](#5-kullanıcı-arayüzü-testleri)
6. [Veri Yönetimi Testleri](#6-veri-yönetimi-testleri)
7. [PWA ve Offline Testleri](#7-pwa-ve-offline-testleri)
8. [Güvenlik Testleri](#8-güvenlik-testleri)
9. [Performans Testleri](#9-performans-testleri)
10. [Cross-Browser Testleri](#10-cross-browser-testleri)
11. [Mobil Cihaz Testleri](#11-mobil-cihaz-testleri)

---

## 1. GENEL TEST HAZIRLIĞI

### 🎯 Amaç
Uygulamanın temel yükleme ve başlangıç durumunu kontrol etmek.

### ✅ Test Adımları

#### Test 1.1: Sayfa Yükleme
**Ne Yapayım:**
1. Tarayıcıda `index.html` dosyasını aç
2. Developer Tools'u aç (F12)
3. Console sekmesini kontrol et

**Ne Kazanırım:**
- Sayfa hatasız yüklenmeli
- Tüm JavaScript dosyaları yüklenmeli
- Console'da kritik hata olmamalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Console'da kırmızı hata mesajı YOK
- ✅ Network sekmesinde tüm JS dosyaları 200 OK ile yüklendi
- ✅ Sayfa başlığı "Hasene Arapça Dersi" görünüyor
- ✅ Ana ekran görünüyor (oyun modları seçilebilir)

---

#### Test 1.2: Veri Dosyaları Yükleme
**Ne Yapayım:**
1. Network sekmesinde `data/` klasöründeki JSON dosyalarını kontrol et
2. Console'da veri yükleme mesajlarını kontrol et

**Ne Kazanırım:**
- Tüm veri dosyaları başarıyla yüklenmeli
- Oyun modları için gerekli veriler hazır olmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ `ayetoku.json` - 200 OK
- ✅ `duaet.json` - 200 OK
- ✅ `hadisoku.json` - 200 OK
- ✅ `kelimebul.json` - 200 OK
- ✅ Console'da "Veriler yüklendi" benzeri mesaj var

---

## 2. OYUN MODLARI TESTLERİ

### 📚 Test 2.1: Kelime Çevir Modu

**Ne Yapayım:**
1. Ana ekrandan "Kelime Çevir" modunu seç
2. Bir soru görüntülendiğinde:
   - Doğru cevabı seç
   - Yanlış cevabı seç
   - Cevap vermeden önce sayfayı yenile (otomatik kayıt kontrolü)

**Ne Kazanırım:**
- Doğru cevap: Hasene puanı kazanmalı
- Yanlış cevap: Doğru cevap gösterilmeli, puan kazanmamalı
- Yeni soru otomatik gelmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Arapça kelime görünüyor
- ✅ 4 seçenek görünüyor
- ✅ Doğru cevap seçildiğinde: Yeşil animasyon, Hasene puanı artıyor
- ✅ Yanlış cevap seçildiğinde: Kırmızı animasyon, doğru cevap vurgulanıyor
- ✅ Yeni soru otomatik yükleniyor
- ✅ Ses efektleri çalışıyor (varsa)

---

### 🎧 Test 2.2: Dinle & Bul Modu

**Ne Yapayım:**
1. "Dinle & Bul" modunu seç
2. Ses butonuna tıkla
3. Dinledikten sonra doğru kelimeyi seç
4. Ses çalmadan cevap vermeyi dene

**Ne Kazanırım:**
- Ses çalmalı
- Ses çaldıktan sonra cevap verilebilmeli
- Doğru cevap için puan kazanmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Ses butonu görünüyor ve tıklanabilir
- ✅ Ses çalıyor (hoparlör simgesi animasyonlu)
- ✅ Ses çalarken seçenekler aktif
- ✅ Ses çalmadan cevap verilemiyor (veya uyarı gösteriliyor)
- ✅ Doğru cevap için puan kazanılıyor

---

### 📝 Test 2.3: Boşluk Doldur Modu

**Ne Yapayım:**
1. "Boşluk Doldur" modunu seç
2. Ayet metninde boşluk görünüyor mu kontrol et
3. Doğru kelimeyi seç
4. Yanlış kelimeyi seç

**Ne Kazanırım:**
- Ayet metni görünmeli
- Boşluklar doğru şekilde işaretlenmeli
- Doğru kelime seçildiğinde boşluk doldurulmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Ayet metni görünüyor
- ✅ Boşluklar (____ veya [ ]) görünüyor
- ✅ Seçenekler görünüyor
- ✅ Doğru kelime seçildiğinde boşluk dolduruluyor
- ✅ Yanlış kelime seçildiğinde hata gösteriliyor

---

### 📖 Test 2.4: Ayet Oku Modu

**Ne Yapayım:**
1. "Ayet Oku" modunu seç
2. Ayet metnini oku
3. Ses butonuna tıkla (varsa)
4. Favorilere ekle butonuna tıkla

**Ne Kazanırım:**
- Ayet metni görünmeli
- Ses çalabilmeli (varsa)
- Favorilere eklenebilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Ayet metni Arapça görünüyor
- ✅ Türkçe çeviri görünüyor (varsa)
- ✅ Ses butonu çalışıyor (varsa)
- ✅ Favorilere ekle butonu çalışıyor
- ✅ Sonraki ayet butonu çalışıyor

---

### 🤲 Test 2.5: Dua Et Modu

**Ne Yapayım:**
1. "Dua Et" modunu seç
2. Dua metnini oku
3. Ses butonuna tıkla
4. Favorilere ekle

**Ne Kazanırım:**
- Dua metni görünmeli
- Ses çalabilmeli
- Favorilere eklenebilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Dua metni Arapça görünüyor
- ✅ Türkçe çeviri/anlam görünüyor
- ✅ Ses butonu çalışıyor
- ✅ Favorilere ekle çalışıyor

---

### 📜 Test 2.6: Hadis Oku Modu

**Ne Yapayım:**
1. "Hadis Oku" modunu seç
2. Hadis metnini oku
3. Favorilere ekle

**Ne Kazanırım:**
- Hadis metni görünmeli
- Favorilere eklenebilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Hadis metni görünüyor
- ✅ Türkçe çeviri görünüyor (varsa)
- ✅ Favorilere ekle çalışıyor
- ✅ Sonraki hadis butonu çalışıyor

---

## 3. PUAN VE ÖDÜL SİSTEMLERİ TESTLERİ

### 💰 Test 3.1: Hasene Puan Sistemi

**Ne Yapayım:**
1. Başlangıç Hasene puanını not et
2. Bir oyun modunda 5 doğru cevap ver
3. Her doğru cevaptan sonra puanı kontrol et
4. Yanlış cevap ver ve puanı kontrol et

**Ne Kazanırım:**
- Her doğru cevap için Hasene puanı artmalı
- Yanlış cevap için puan artmamalı
- Puan ekranı güncellenmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Başlangıç puanı görünüyor (örn: 0 veya mevcut puan)
- ✅ Her doğru cevaptan sonra puan artıyor
- ✅ Puan artışı animasyonlu gösteriliyor
- ✅ Yanlış cevapta puan artmıyor
- ✅ Toplam Hasene puanı doğru görünüyor

---

### ⭐ Test 3.2: Yıldız Sistemi

**Ne Yapayım:**
1. Mevcut Hasene puanını kontrol et
2. 100 Hasene kazan (5-10 doğru cevap)
3. Yıldız sayısının artıp artmadığını kontrol et
4. Yıldız animasyonunu gözlemle

**Ne Kazanırım:**
- 100 Hasene = 1 Yıldız
- Yıldız sayısı artmalı
- Yıldız kazanımı animasyonlu gösterilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Yıldız sayısı görünüyor
- ✅ 100 Hasene kazanıldığında yıldız +1 artıyor
- ✅ Yıldız kazanımı animasyonlu (konfeti, parıltı vb.)
- ✅ Yıldız sayısı doğru hesaplanıyor (Hasene / 100)

---

### 🏆 Test 3.3: Mertebe Sistemi

**Ne Yapayım:**
1. Mevcut mertebeyi kontrol et
2. Mertebe eşiklerini test et:
   - 2,000 Hasene → Mübtedi (🥉)
   - 8,500 Hasene → Müterakki (🥈)
   - 25,500 Hasene → Mütecaviz (🥇)
   - 85,000 Hasene → Mütebahhir (💎)
3. Mertebe değişim animasyonunu gözlemle

**Ne Kazanırım:**
- Her eşikte mertebe yükselmeli
- Mertebe değişimi animasyonlu gösterilmeli
- Mertebe rozeti görünmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Mevcut mertebe görünüyor
- ✅ Eşik aşıldığında mertebe yükseliyor
- ✅ Mertebe değişimi animasyonlu (konfeti, bildirim)
- ✅ Mertebe rozeti (emoji) görünüyor
- ✅ Mertebe adı doğru görünüyor

---

### 🥇 Test 3.4: Rozet Sistemi

**Ne Yapayım:**
1. Rozetler bölümüne git
2. Mevcut rozetleri kontrol et
3. Bir rozet kazanmak için gerekli şartları yerine getir
4. Rozet kazanımını gözlemle

**Ne Kazanırım:**
- Rozetler görünmeli (Bronz, Gümüş, Altın, Elmas)
- Şartlar yerine getirildiğinde rozet kazanılmalı
- Rozet kazanımı bildirilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Rozetler bölümü açılıyor
- ✅ Kazanılan rozetler görünüyor (renkli/aktif)
- ✅ Kazanılmayan rozetler görünüyor (gri/pasif)
- ✅ Rozet kazanıldığında bildirim gösteriliyor
- ✅ Rozet animasyonu çalışıyor

---

## 4. İSTATİSTİK VE TAKİP TESTLERİ

### 📊 Test 4.1: Detaylı İstatistikler

**Ne Yapayım:**
1. İstatistikler bölümüne git
2. Tüm istatistik kategorilerini kontrol et:
   - Toplam oyun sayısı
   - Doğru/yanlış cevap oranı
   - En çok oynanan mod
   - Toplam süre
   - Kelime istatistikleri

**Ne Kazanırım:**
- Tüm istatistikler doğru görünmeli
- Veriler gerçek zamanlı güncellenmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ İstatistikler bölümü açılıyor
- ✅ Tüm metrikler görünüyor
- ✅ Sayılar doğru hesaplanmış
- ✅ Grafikler/chartlar görünüyor (varsa)
- ✅ Veriler güncel

---

### 📅 Test 4.2: Günlük Görevler

**Ne Yapayım:**
1. Günlük görevler bölümüne git
2. Mevcut görevleri kontrol et
3. Bir görevi tamamla
4. Görev tamamlandığında ödülü kontrol et
5. Ertesi gün yeni görevlerin geldiğini kontrol et (tarih değiştirerek)

**Ne Kazanırım:**
- Günlük görevler görünmeli
- Görevler tamamlandığında işaretlenmeli
- Ödüller verilmeli
- Ertesi gün yeni görevler gelmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Günlük görevler listesi görünüyor
- ✅ Görev ilerlemesi görünüyor (örn: 3/5)
- ✅ Görev tamamlandığında ✓ işareti görünüyor
- ✅ Ödül (Hasene) veriliyor
- ✅ Ertesi gün yeni görevler geliyor

---

### 🎯 Test 4.3: Günlük Hedef

**Ne Yapayım:**
1. Günlük hedef bölümüne git
2. Yeni bir hedef belirle (örn: 500 Hasene)
3. Hedefe ulaşmak için oyun oyna
4. Hedef tamamlandığında bildirimi kontrol et
5. Hedef ilerlemesini kontrol et

**Ne Kazanırım:**
- Günlük hedef belirlenebilmeli
- Hedef ilerlemesi görünmeli
- Hedef tamamlandığında bildirim gösterilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Günlük hedef ayarlanabiliyor
- ✅ Hedef ilerlemesi görünüyor (örn: 350/500)
- ✅ İlerleme çubuğu görünüyor
- ✅ Hedef tamamlandığında bildirim gösteriliyor
- ✅ Ertesi gün hedef sıfırlanıyor

---

### 🔥 Test 4.4: Seri Takibi (Streak)

**Ne Yapayım:**
1. Mevcut seriyi kontrol et
2. Bir gün oyun oyna
3. Ertesi gün de oyun oyna (seri devam etmeli)
4. Bir gün oyun oynamadan geç (seri sıfırlanmalı)
5. Seri sayısını kontrol et

**Ne Kazanırım:**
- Günlük seri takip edilmeli
- Seri kırıldığında sıfırlanmalı
- Seri sayısı görünmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Mevcut seri sayısı görünüyor
- ✅ Günlük oyun oynandığında seri artıyor
- ✅ Oyun oynanmadığında seri sıfırlanıyor
- ✅ Seri sayısı doğru görünüyor
- ✅ Seri rozeti/badgesi görünüyor (varsa)

---

### 🏅 Test 4.5: Liderlik Tablosu

**Ne Yapayım:**
1. Liderlik tablosu bölümüne git
2. Haftalık sıralamayı kontrol et
3. Aylık sıralamayı kontrol et
4. Kendi sıralamanı kontrol et
5. Diğer kullanıcıları kontrol et (varsa)

**Ne Kazanırım:**
- Liderlik tablosu görünmeli
- Sıralama doğru olmalı
- Haftalık ve aylık ayrı gösterilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Liderlik tablosu açılıyor
- ✅ Haftalık sıralama görünüyor
- ✅ Aylık sıralama görünüyor
- ✅ Kendi sıralaman görünüyor
- ✅ Top 10 listesi görünüyor (varsa)

---

### 📈 Test 4.6: Kelime İstatistikleri

**Ne Yapayım:**
1. Kelime istatistikleri bölümüne git
2. Öğrenilen kelimeleri kontrol et
3. Zorlanılan kelimeleri kontrol et
4. Bir kelimeyi zorlandı olarak işaretle
5. Zorlanılan kelimelerin daha sık geldiğini kontrol et

**Ne Kazanırım:**
- Kelime istatistikleri görünmeli
- Zorlanılan kelimeler takip edilmeli
- Zorlanılan kelimeler daha sık gösterilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Kelime istatistikleri bölümü açılıyor
- ✅ Öğrenilen kelime sayısı görünüyor
- ✅ Zorlanılan kelimeler listesi görünüyor
- ✅ Kelime zorlandı olarak işaretlenebiliyor
- ✅ Zorlanılan kelimeler daha sık soruluyor

---

## 5. KULLANICI ARAYÜZÜ TESTLERİ

### 🎨 Test 5.1: Navigasyon

**Ne Yapayım:**
1. Tüm menü öğelerine tıkla:
   - Ana Sayfa
   - Oyun Modları
   - İstatistikler
   - Rozetler
   - Ayarlar
   - Favoriler
2. Her sayfada doğru içeriğin göründüğünü kontrol et
3. Geri butonunu test et

**Ne Kazanırım:**
- Tüm sayfalar açılmalı
- Navigasyon sorunsuz çalışmalı
- Aktif sayfa vurgulanmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Tüm menü öğeleri tıklanabilir
- ✅ Her sayfa doğru içerik gösteriyor
- ✅ Aktif sayfa vurgulanıyor
- ✅ Geri butonu çalışıyor
- ✅ Sayfa geçişleri animasyonlu

---

### 📱 Test 5.2: Responsive Tasarım

**Ne Yapayım:**
1. Developer Tools'da responsive modu aç
2. Farklı ekran boyutlarını test et:
   - Mobil (375x667)
   - Tablet (768x1024)
   - Desktop (1920x1080)
3. Her boyutta içeriğin düzgün göründüğünü kontrol et

**Ne Kazanırım:**
- Tüm ekran boyutlarında düzgün görünmeli
- Metinler okunabilir olmalı
- Butonlar tıklanabilir olmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Mobil: İçerik düzgün görünüyor, kaydırma çalışıyor
- ✅ Tablet: İçerik düzgün görünüyor
- ✅ Desktop: İçerik düzgün görünüyor, boşluklar uygun
- ✅ Metinler okunabilir
- ✅ Butonlar tıklanabilir boyutta

---

### 🎭 Test 5.3: Animasyonlar ve Geri Bildirimler

**Ne Yapayım:**
1. Doğru cevap ver → Animasyonu gözlemle
2. Yanlış cevap ver → Animasyonu gözlemle
3. Rozet kazan → Animasyonu gözlemle
4. Yıldız kazan → Animasyonu gözlemle
5. Bildirimleri kontrol et

**Ne Kazanırım:**
- Animasyonlar sorunsuz çalışmalı
- Geri bildirimler net olmalı
- Performans düşmemeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Doğru cevap: Yeşil animasyon, konfeti (varsa)
- ✅ Yanlış cevap: Kırmızı animasyon, titreşim (varsa)
- ✅ Rozet kazanımı: Özel animasyon
- ✅ Yıldız kazanımı: Parıltı animasyonu
- ✅ Bildirimler görünüyor ve kayboluyor

---

### 🔊 Test 5.4: Ses Efektleri

**Ne Yapayım:**
1. Ayarlardan ses efektlerini aç/kapat
2. Doğru cevap ver → Ses çalıyor mu?
3. Yanlış cevap ver → Ses çalıyor mu?
4. Buton tıklamalarında ses var mı?

**Ne Kazanırım:**
- Ses efektleri çalışmalı
- Ses açma/kapama çalışmalı
- Ses seviyesi ayarlanabilmeli (varsa)

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Ses efektleri ayarlardan açılıp kapatılabiliyor
- ✅ Doğru cevap sesi çalıyor
- ✅ Yanlış cevap sesi çalıyor
- ✅ Buton tıklama sesleri çalıyor (varsa)
- ✅ Ses seviyesi ayarlanabiliyor (varsa)

---

## 6. VERİ YÖNETİMİ TESTLERİ

### 💾 Test 6.1: LocalStorage Kayıt

**Ne Yapayım:**
1. Developer Tools → Application → LocalStorage
2. Oyun oyna, puan kazan
3. Sayfayı yenile (F5)
4. Verilerin kaydedilip kaydedilmediğini kontrol et

**Ne Kazanırım:**
- Veriler LocalStorage'a kaydedilmeli
- Sayfa yenilendiğinde veriler korunmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ LocalStorage'da veriler görünüyor
- ✅ Hasene puanı kaydedilmiş
- ✅ İstatistikler kaydedilmiş
- ✅ Favoriler kaydedilmiş
- ✅ Sayfa yenilendiğinde veriler korunuyor

---

### 🔄 Test 6.2: Veri Senkronizasyonu

**Ne Yapayım:**
1. Bir oyun modunda 3 soru cevapla
2. Başka bir moda geç
3. Tekrar ilk moda dön
4. İlerlemenin korunduğunu kontrol et

**Ne Kazanırım:**
- Veriler modlar arasında senkronize olmalı
- İlerleme kaybolmamalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Mod değiştiğinde veriler korunuyor
- ✅ Puanlar güncel
- ✅ İstatistikler güncel
- ✅ Favoriler korunuyor

---

### 🗑️ Test 6.3: Veri Temizleme

**Ne Yapayım:**
1. Ayarlardan "Verileri Temizle" veya "Sıfırla" seçeneğini bul
2. Verileri temizle
3. LocalStorage'ı kontrol et
4. Uygulamanın başlangıç durumuna döndüğünü kontrol et

**Ne Kazanırım:**
- Veriler temizlenebilmeli
- Uygulama başlangıç durumuna dönmeli
- Onay mesajı gösterilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Veri temizleme seçeneği var
- ✅ Onay mesajı gösteriliyor
- ✅ LocalStorage temizleniyor
- ✅ Uygulama başlangıç durumuna dönüyor
- ✅ Tüm veriler sıfırlanıyor

---

### 📤 Test 6.4: Veri Dışa Aktarma (Varsa)

**Ne Yapayım:**
1. Ayarlardan "Verileri Dışa Aktar" seçeneğini bul
2. Verileri dışa aktar
3. İndirilen dosyayı kontrol et

**Ne Kazanırım:**
- Veriler JSON/CSV formatında dışa aktarılabilmeli
- Tüm veriler dahil olmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Dışa aktarma seçeneği var
- ✅ Dosya indiriliyor
- ✅ Dosya formatı doğru (JSON/CSV)
- ✅ Tüm veriler dahil

---

### 📥 Test 6.5: Veri İçe Aktarma (Varsa)

**Ne Yapayım:**
1. Ayarlardan "Verileri İçe Aktar" seçeneğini bul
2. Önceden dışa aktarılmış dosyayı yükle
3. Verilerin yüklendiğini kontrol et

**Ne Kazanırım:**
- Veriler içe aktarılabilmeli
- Mevcut veriler üzerine yazılmalı veya birleştirilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ İçe aktarma seçeneği var
- ✅ Dosya seçilebiliyor
- ✅ Veriler yükleniyor
- ✅ Onay mesajı gösteriliyor
- ✅ Veriler doğru yüklenmiş

---

## 7. PWA VE OFFLINE TESTLERİ

### 📲 Test 7.1: PWA Yükleme

**Ne Yapayım:**
1. Mobil tarayıcıda veya Chrome'da siteyi aç
2. "Uygulamayı Yükle" bildirimini bekle
3. Uygulamayı yükle
4. Ana ekrandan uygulamayı aç

**Ne Kazanırım:**
- PWA yüklenebilmeli
- Ana ekranda ikon görünmeli
- Uygulama bağımsız pencerede açılmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ "Uygulamayı Yükle" bildirimi görünüyor
- ✅ Yükleme başarılı
- ✅ Ana ekranda ikon görünüyor
- ✅ Uygulama bağımsız pencerede açılıyor
- ✅ Manifest.json doğru yüklenmiş

---

### 📴 Test 7.2: Offline Çalışma

**Ne Yapayım:**
1. Developer Tools → Network → Offline modunu aç
2. Sayfayı yenile
3. Oyun oynamayı dene
4. Online moda geri dön

**Ne Kazanırım:**
- Offline modda uygulama çalışmalı
- Service Worker cache'i kullanmalı
- Online olduğunda güncellemeler yüklenmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Offline modda sayfa yükleniyor
- ✅ Oyun oynanabiliyor
- ✅ Veriler kaydediliyor
- ✅ Online olduğunda güncellemeler yükleniyor
- ✅ Service Worker aktif

---

### 🔄 Test 7.3: Service Worker Güncelleme

**Ne Yapayım:**
1. Service Worker'ı kontrol et (Application → Service Workers)
2. Yeni bir versiyon yükle
3. Güncelleme bildirimini kontrol et
4. Güncellemeyi onayla

**Ne Kazanırım:**
- Service Worker güncellenebilmeli
- Güncelleme bildirimi gösterilmeli
- Yeni versiyon aktif olmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Service Worker kayıtlı
- ✅ Güncelleme bildirimi gösteriliyor
- ✅ Güncelleme onaylanabiliyor
- ✅ Yeni versiyon aktif
- ✅ Cache güncelleniyor

---

## 8. GÜVENLİK TESTLERİ

### 🛡️ Test 8.1: XSS Koruması

**Ne Yapayım:**
1. Console'da şunu dene:
   ```javascript
   localStorage.setItem('test', '<script>alert("XSS")</script>');
   ```
2. Uygulamada bu veriyi görüntüle
3. Script'in çalışıp çalışmadığını kontrol et

**Ne Kazanırım:**
- XSS saldırıları engellenmeli
- HTML içerik sanitize edilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Script çalışmıyor
- ✅ HTML içerik escape edilmiş görünüyor
- ✅ Alert penceresi açılmıyor
- ✅ Console'da hata yok

---

### 🔒 Test 8.2: Veri Şifreleme

**Ne Yapayım:**
1. LocalStorage'da hassas verileri kontrol et
2. Verilerin şifrelenmiş/encode edilmiş olduğunu kontrol et
3. Şifreleme fonksiyonlarını test et

**Ne Kazanırım:**
- Hassas veriler şifrelenmeli veya encode edilmeli
- Veriler düz metin olarak görünmemeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Hassas veriler encode edilmiş
- ✅ Düz metin görünmüyor
- ✅ Şifreleme fonksiyonları çalışıyor
- ✅ Veriler doğru şekilde decrypt ediliyor

---

### 🚫 Test 8.3: CSP (Content Security Policy)

**Ne Yapayım:**
1. Developer Tools → Network → Headers
2. CSP header'ını kontrol et
3. Inline script'lerin çalışıp çalışmadığını kontrol et

**Ne Kazanırım:**
- CSP aktif olmalı
- XSS saldırıları engellenmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ CSP header'ı var
- ✅ Script-src kısıtlamaları var
- ✅ Inline script'ler çalışmıyor (güvenli)
- ✅ External kaynaklar kontrol ediliyor

---

## 9. PERFORMANS TESTLERİ

### ⚡ Test 9.1: Sayfa Yükleme Hızı

**Ne Yapayım:**
1. Developer Tools → Network
2. Sayfayı yenile
3. Yükleme süresini kontrol et
4. Tüm kaynakların yüklendiğini kontrol et

**Ne Kazanırım:**
- Sayfa 3 saniye içinde yüklenmeli
- Tüm kaynaklar yüklenmeli
- Hata olmamalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Sayfa yükleme süresi < 3 saniye
- ✅ Tüm JS dosyaları yüklendi
- ✅ Tüm görseller yüklendi
- ✅ Fontlar yüklendi
- ✅ Hata yok

---

### 🎮 Test 9.2: Oyun Performansı

**Ne Yapayım:**
1. Bir oyun modunda 20 soru cevapla
2. Performans sekmesini aç (F12 → Performance)
3. Kayıt al ve analiz et
4. FPS ve frame drop'ları kontrol et

**Ne Kazanırım:**
- Oyun akıcı çalışmalı
- FPS 60'a yakın olmalı
- Frame drop olmamalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Oyun akıcı çalışıyor
- ✅ FPS 60'a yakın
- ✅ Frame drop yok
- ✅ Animasyonlar sorunsuz
- ✅ Bellek kullanımı makul

---

### 💾 Test 9.3: Bellek Kullanımı

**Ne Yapayım:**
1. Developer Tools → Memory
2. Heap snapshot al
3. Oyun oyna (50 soru)
4. Tekrar heap snapshot al
5. Bellek sızıntısı var mı kontrol et

**Ne Kazanırım:**
- Bellek sızıntısı olmamalı
- Bellek kullanımı makul olmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Bellek kullanımı sabit kalıyor
- ✅ Sızıntı yok
- ✅ Heap size makul (< 50MB)
- ✅ Garbage collection çalışıyor

---

## 10. CROSS-BROWSER TESTLERİ

### 🌐 Test 10.1: Chrome

**Ne Yapayım:**
1. Google Chrome'da siteyi aç
2. Tüm temel özellikleri test et
3. Console hatalarını kontrol et

**Ne Kazanırım:**
- Chrome'da sorunsuz çalışmalı
- Tüm özellikler çalışmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Sayfa yükleniyor
- ✅ Oyun modları çalışıyor
- ✅ PWA yüklenebiliyor
- ✅ Console'da hata yok

---

### 🦊 Test 10.2: Firefox

**Ne Yapayım:**
1. Mozilla Firefox'ta siteyi aç
2. Tüm temel özellikleri test et
3. Console hatalarını kontrol et

**Ne Kazanırım:**
- Firefox'ta sorunsuz çalışmalı
- Tüm özellikler çalışmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Sayfa yükleniyor
- ✅ Oyun modları çalışıyor
- ✅ PWA yüklenebiliyor (varsa)
- ✅ Console'da hata yok

---

### 🍎 Test 10.3: Safari

**Ne Yapayım:**
1. Safari'de siteyi aç
2. Tüm temel özellikleri test et
3. Console hatalarını kontrol et

**Ne Kazanırım:**
- Safari'de sorunsuz çalışmalı
- Tüm özellikler çalışmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Sayfa yükleniyor
- ✅ Oyun modları çalışıyor
- ✅ PWA yüklenebiliyor
- ✅ Console'da hata yok

---

### 🪟 Test 10.4: Edge

**Ne Yapayım:**
1. Microsoft Edge'de siteyi aç
2. Tüm temel özellikleri test et
3. Console hatalarını kontrol et

**Ne Kazanırım:**
- Edge'de sorunsuz çalışmalı
- Tüm özellikler çalışmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Sayfa yükleniyor
- ✅ Oyun modları çalışıyor
- ✅ PWA yüklenebiliyor
- ✅ Console'da hata yok

---

## 11. MOBİL CİHAZ TESTLERİ

### 📱 Test 11.1: iOS Safari

**Ne Yapayım:**
1. iPhone/iPad'de Safari'de siteyi aç
2. Tüm özellikleri test et
3. PWA yüklemeyi test et
4. Touch gesture'ları test et

**Ne Kazanırım:**
- iOS'ta sorunsuz çalışmalı
- Touch gesture'lar çalışmalı
- PWA yüklenebilmeli

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Sayfa yükleniyor
- ✅ Touch gesture'lar çalışıyor
- ✅ PWA yüklenebiliyor
- ✅ Animasyonlar akıcı
- ✅ Butonlar tıklanabilir

---

### 🤖 Test 11.2: Android Chrome

**Ne Yapayım:**
1. Android cihazda Chrome'da siteyi aç
2. Tüm özellikleri test et
3. PWA yüklemeyi test et
4. Haptic feedback'i test et

**Ne Kazanırım:**
- Android'de sorunsuz çalışmalı
- PWA yüklenebilmeli
- Haptic feedback çalışmalı

**Nereyi Kontrol Edip Ne Görmeliyim:**
- ✅ Sayfa yükleniyor
- ✅ PWA yüklenebiliyor
- ✅ Haptic feedback çalışıyor
- ✅ Animasyonlar akıcı
- ✅ Butonlar tıklanabilir

---

## 📝 TEST SONUÇLARI FORMU

Her test için aşağıdaki formu doldurun:

```
Test Adı: _______________________
Tarih: _______________________
Test Eden: _______________________

✅ BAŞARILI / ❌ BAŞARISIZ

Notlar:
_________________________________
_________________________________
_________________________________

Ekran Görüntüleri: [Ekle]
```

---

## 🎯 ÖNCELİKLİ TESTLER

Eğer zaman kısıtlıysa, önce şu testleri yapın:

1. ✅ **Oyun Modları** (Test 2.1-2.6) - En kritik
2. ✅ **Puan Sistemi** (Test 3.1-3.2) - Temel özellik
3. ✅ **Veri Kayıt** (Test 6.1) - Veri kaybı önleme
4. ✅ **Sayfa Yükleme** (Test 1.1) - İlk izlenim
5. ✅ **Navigasyon** (Test 5.1) - Kullanılabilirlik

---

## 🔍 HATA BULUNDUĞUNDA

1. **Hata Detaylarını Kaydet:**
   - Hangi testte bulundu?
   - Adımlar nelerdi?
   - Beklenen vs. Gerçek sonuç?
   - Console hataları var mı?
   - Ekran görüntüsü al

2. **Hata Önceliğini Belirle:**
   - 🔴 Kritik: Uygulama çalışmıyor
   - 🟡 Yüksek: Özellik çalışmıyor
   - 🟢 Orta: Küçük sorun
   - ⚪ Düşük: İyileştirme önerisi

3. **Hata Raporu Oluştur:**
   ```
   Başlık: [Test Adı] - [Hata Açıklaması]
   Öncelik: [Kritik/Yüksek/Orta/Düşük]
   Adımlar: [1, 2, 3...]
   Beklenen: [Ne olmalıydı]
   Gerçek: [Ne oldu]
   Console: [Hata mesajları]
   ```

---

## ✅ TEST TAMAMLAMA KONTROL LİSTESİ

- [ ] Tüm oyun modları test edildi
- [ ] Puan sistemleri test edildi
- [ ] İstatistikler test edildi
- [ ] UI/UX test edildi
- [ ] Veri yönetimi test edildi
- [ ] PWA test edildi
- [ ] Güvenlik test edildi
- [ ] Performans test edildi
- [ ] Cross-browser test edildi
- [ ] Mobil test edildi
- [ ] Tüm hatalar raporlandı
- [ ] Test sonuçları dokümante edildi

---

**Son Güncelleme:** 2024
**Versiyon:** 1.0.0




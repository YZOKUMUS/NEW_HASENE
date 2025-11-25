# Network ve Console Kontrol Rehberi

## 📡 Network Sekmesinde JSON Dosyalarını Kontrol Etme

### Adımlar:
1. **Tarayıcı Geliştirici Araçlarını Aç**
   - `F12` tuşuna basın VEYA
   - Sağ tık → "İncele" (Inspect) VEYA
   - `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac)

2. **Network Sekmesine Geç**
   - Geliştirici araçlarında "Network" sekmesine tıklayın
   - VEYA `Ctrl + Shift + E` (Windows) / `Cmd + Option + E` (Mac)

3. **Sayfayı Yenileyin**
   - `F5` veya `Ctrl + R` ile sayfayı yenileyin
   - VEYA oyun modlarından birini başlatın (JSON dosyaları lazy loading ile yüklenir)

4. **JSON Dosyalarını Filtreleyin**
   - Network sekmesinde filtre kutusuna `json` yazın
   - VEYA "Type" sütununa göre filtreleyin

5. **Kontrol Edilecek Dosyalar:**
   - `data/kelimebul.json` - Kelime Çevir ve Dinle ve Bul için
   - `data/ayetoku.json` - Boşluk Doldur ve Ayet Oku için
   - `data/duaet.json` - Dua Et için
   - `data/hadisoku.json` - Hadis Oku için

6. **Her Dosyayı İnceleyin:**
   - Dosyaya tıklayın
   - **Headers** sekmesinde:
     - Status Code: `200` olmalı (başarılı)
     - Request URL: Doğru yolu kontrol edin
   - **Preview** sekmesinde:
     - JSON içeriğinin düzgün parse edildiğini kontrol edin
   - **Response** sekmesinde:
     - Ham JSON verisini görebilirsiniz
   - **Timing** sekmesinde:
     - Yükleme süresini kontrol edin

### Kontrol Edilecekler:
- ✅ Tüm JSON dosyaları `200 OK` status code ile yükleniyor mu?
- ✅ Dosya boyutları beklenen değerlerde mi?
- ✅ Yükleme süreleri makul mü? (özellikle hadisoku.json ~4MB)
- ✅ Herhangi bir `404 Not Found` hatası var mı?
- ✅ CORS hatası var mı?

---

## 🖥️ Console'da Veri Yükleme Mesajlarını Kontrol Etme

### Adımlar:
1. **Console Sekmesine Geç**
   - Geliştirici araçlarında "Console" sekmesine tıklayın
   - VEYA `Ctrl + Shift + J` (Windows) / `Cmd + Option + J` (Mac)

2. **Console Mesajlarını Filtreleyin**
   - Console'da filtre kutusuna şunları yazabilirsiniz:
     - `📡` - Fetch/Network mesajları için
     - `yükle` - Yükleme mesajları için
     - `veri` - Veri ile ilgili mesajlar için
     - `error` - Hata mesajları için

3. **Beklenen Mesajlar:**

   **Başarılı Yükleme:**
   ```
   📡 Büyük dosya tespit edildi (X.XX MB), Web Worker kullanılıyor...
   Kelime verileri yükleniyor...
   Ayet verileri yükleniyor...
   Dua verileri yükleniyor...
   Hadis verileri yükleniyor...
   ```

   **Hata Durumları:**
   ```
   📡 Fetch attempt 1/3 failed for data/kelimebul.json
   Kelime verileri yükleme hatası: [error details]
   ```

4. **Console'da Manuel Kontrol:**
   - Console'a şu komutları yazabilirsiniz:
   ```javascript
   // Yükleme durumlarını kontrol et
   console.log(dataLoadStatus);
   
   // Verilerin yüklenip yüklenmediğini kontrol et
   console.log('Kelime Data:', kelimeBulData ? 'Yüklü' : 'Yüklenmedi');
   console.log('Ayet Data:', ayetOkuData ? 'Yüklü' : 'Yüklenmedi');
   console.log('Dua Data:', duaData ? 'Yüklü' : 'Yüklenmedi');
   console.log('Hadis Data:', hadisData ? 'Yüklü' : 'Yüklenmedi');
   ```

### Kontrol Edilecekler:
- ✅ Yükleme mesajları görünüyor mu?
- ✅ Herhangi bir hata mesajı var mı?
- ✅ Web Worker mesajları görünüyor mu? (büyük dosyalar için)
- ✅ Retry mesajları görünüyor mu? (hata durumunda)
- ✅ Yükleme tamamlandı mesajları var mı?

---

## 🔍 Hızlı Test Senaryoları

### Senaryo 1: Normal Yükleme
1. Sayfayı açın
2. Bir oyun modunu başlatın (örn: "Kelime Çevir")
3. Network'te `kelimebul.json` dosyasının yüklendiğini kontrol edin
4. Console'da yükleme mesajlarını kontrol edin

### Senaryo 2: Tüm Dosyaları Yükleme
1. Console'a şunu yazın (Promise sonucunu görmek için):
   ```javascript
   // Yöntem 1: await kullan (top-level await destekleniyorsa)
   await loadAllData()
   
   // Yöntem 2: .then() kullan
   loadAllData().then(result => console.log('Sonuç:', result))
   
   // Yöntem 3: Sonucu değişkene atayıp kontrol et
   loadAllData().then(status => {
       console.log('✅ Yükleme Durumu:', status);
       console.log('Kelime:', status.kelimeBul);
       console.log('Ayet:', status.ayetOku);
       console.log('Dua:', status.dua);
       console.log('Hadis:', status.hadis);
   })
   ```
2. Network'te tüm JSON dosyalarının yüklendiğini kontrol edin
3. Console'da tüm yükleme mesajlarını kontrol edin
4. Sonuç olarak her dosyanın yüklenme durumu ve veri sayısı gösterilecektir

### Senaryo 3: Hata Durumu Testi
1. Network sekmesinde "Offline" modunu açın
2. Bir oyun modunu başlatın
3. Console'da retry mesajlarını kontrol edin
4. Network'te başarısız istekleri kontrol edin

---

## 📝 Notlar

- JSON dosyaları **lazy loading** ile yüklenir (sadece ihtiyaç duyulduğunda)
- Büyük dosyalar (2MB+) Web Worker ile parse edilir
- Hata durumunda otomatik retry mekanizması çalışır (3 deneme)
- Yüklenen veriler cache'lenir (tekrar yükleme yapılmaz)


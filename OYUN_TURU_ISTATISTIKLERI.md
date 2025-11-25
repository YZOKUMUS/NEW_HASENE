# Oyun Türü İstatistikleri Ne Zaman Artar?

## 📊 İstatistiklerin Güncellenme Zamanları

### 1. 📚 Kelime Çevir
- **Ne zaman artar**: Her **doğru cevap** verildiğinde +1
- **Kod yeri**: `checkAnswer()` fonksiyonunda doğru cevap kontrolü sonrası
- **Satır**: ~8731
- **Örnek**: Kelime Çevir oyununda 5 doğru cevap verirseniz → **Kelime Çevir: 5**

### 2. 🎧 Dinle & Bul
- **Ne zaman artar**: Her **doğru cevap** verildiğinde +1
- **Kod yeri**: `handleDinleAnswer()` fonksiyonunda doğru cevap kontrolü sonrası
- **Satır**: ~10428
- **Örnek**: Dinle & Bul oyununda 3 doğru cevap verirseniz → **Dinle & Bul: 3**

### 3. 📝 Boşluk Doldur
- **Ne zaman artar**: Her **doğru cevap** verildiğinde +1
- **Kod yeri**: `handleBoslukAnswer()` fonksiyonunda doğru cevap kontrolü sonrası
- **Satır**: ~10795
- **Örnek**: Boşluk Doldur oyununda 2 doğru cevap verirseniz → **Boşluk Doldur: 2**

### 4. 📖 Ayet Oku
- **Ne zaman artar**: Ayet **sesi bittiğinde** +1
- **Kod yeri**: `elements.ayetAudioBtn` ses çalma fonksiyonunda `onended` event'i
- **Satır**: ~11236
- **Örnek**: Ayet Oku modunda 3 ayet dinlerseniz → **Ayet Oku: 3**
- **Not**: Sadece ses çalındığında sayılır, sadece okumak yeterli değil

### 5. 🤲 Dua Öğren
- **Ne zaman artar**: Dua **sesi bittiğinde** +1
- **Kod yeri**: `elements.duaAudioBtn` ses çalma fonksiyonunda `onended` event'i
- **Satır**: ~11060
- **Örnek**: Dua Öğren modunda 2 dua dinlerseniz → **Dua Öğren: 2**
- **Not**: Sadece ses çalındığında sayılır, sadece okumak yeterli değil

### 6. 📜 Hadis Oku
- **Ne zaman artar**: **Sonraki** veya **Önceki** butonuna tıklandığında +1
- **Kod yeri**: `elements.nextHadisBtn` ve `elements.prevHadisBtn` onclick event'leri
- **Satır**: ~11283, ~11290
- **Örnek**: Hadis Oku modunda 4 hadis okursanız → **Hadis Oku: 4**
- **Not**: Her buton tıklamasında sayılır (önceki veya sonraki)

## ⚠️ Önemli Notlar

1. **Sadece Doğru Cevaplar Sayılır**: Kelime Çevir, Dinle & Bul ve Boşluk Doldur için sadece **doğru cevaplar** sayılır. Yanlış cevaplar sayılmaz.

2. **Ses Gerektiren Modlar**: Ayet Oku ve Dua Öğren için ses çalınması gerekir. Sadece okumak yeterli değildir.

3. **Günlük Sıfırlama**: Tüm istatistikler her gün gece yarısında sıfırlanır (yerel saat).

4. **Anlık Güncelleme**: İstatistikler anlık olarak güncellenir, ancak istatistikler modalını açtığınızda görünür.

## 🧪 Test Etmek İçin

1. **Kelime Çevir**: Oyunu başlat, 3 doğru cevap ver → İstatistikler modalında "Kelime Çevir: 3" görünmeli
2. **Dinle & Bul**: Oyunu başlat, 2 doğru cevap ver → İstatistikler modalında "Dinle & Bul: 2" görünmeli
3. **Boşluk Doldur**: Oyunu başlat, 1 doğru cevap ver → İstatistikler modalında "Boşluk Doldur: 1" görünmeli
4. **Ayet Oku**: Ayet Oku moduna gir, 2 ayet sesini çal → İstatistikler modalında "Ayet Oku: 2" görünmeli
5. **Dua Öğren**: Dua Öğren moduna gir, 1 dua sesini çal → İstatistikler modalında "Dua Öğren: 1" görünmeli
6. **Hadis Oku**: Hadis Oku moduna gir, "Sonraki" butonuna 3 kez tıkla → İstatistikler modalında "Hadis Oku: 3" görünmeli

## 🔍 Sorun Giderme

Eğer istatistikler görünmüyorsa:

1. **Konsolu kontrol edin**: `console.log(dailyTasks.todayStats)` ile değerleri kontrol edin
2. **localStorage kontrolü**: `localStorage.getItem('hasene_dailyTasks')` ile kaydedilip kaydedilmediğini kontrol edin
3. **Sayfayı yenileyin**: Bazen sayfa yenileme gerekebilir
4. **Günlük sıfırlama**: Yeni gün başladıysa istatistikler sıfırlanmış olabilir


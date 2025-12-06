# 🧪 HASENE OYUNU - KAPSAMLI TEST SENARYOSU

## 📋 İÇİNDEKİLER
1. [Kritik Fonksiyonlar ve Veri Akışı](#kritik-fonksiyonlar)
2. [Test Senaryoları](#test-senaryoları)
3. [Beklenen Sonuçlar](#beklenen-sonuçlar)
4. [Hata Kontrol Listesi](#hata-kontrol-listesi)

---

## 🔍 KRİTİK FONKSİYONLAR VE VERİ AKIŞI

### 1. VERİ KAYDETME FONKSİYONLARI

#### `saveStats()` - Ana Kaydetme Fonksiyonu
- **Ne Yapar:** Tüm oyun verilerini IndexedDB ve localStorage'a kaydeder
- **Ne Zaman Çağrılır:**
  - `debouncedSaveStats()` içinden (500ms debounce ile)
  - `saveStatsImmediate()` içinden (acil kaydetme)
  - Oyun bitişinde
  - Sayfa kapanırken (`beforeunload`)
- **Nereye Kaydeder:**
  - **IndexedDB:** `hasene_totalPoints`, `hasene_badges`, `hasene_streak`, `hasene_dailyTasks`, `hasene_weeklyTasks`, `hasene_currentMode`, `hasene_currentDifficulty`
  - **localStorage:** Aynı key'ler (yedek sistem)
- **Sıklık:** Her doğru cevap sonrası 500ms debounce ile (maksimum 1 saniyede 2 kez)

#### `debouncedSaveStats()` - Debounced Kaydetme
- **Ne Yapar:** `saveStats()` çağrısını 500ms geciktirir (performans için)
- **Ne Zaman Çağrılır:**
  - Her doğru cevap sonrası
  - Görev tamamlandığında
  - Streak güncellendiğinde
- **Sıklık:** Her değişiklikte (ama 500ms içinde birden fazla çağrı birleştirilir)

#### `saveStatsImmediate()` - Acil Kaydetme
- **Ne Yapar:** `saveStats()` çağrısını hemen yapar (gecikme yok)
- **Ne Zaman Çağrılır:**
  - Sayfa kapanırken (`beforeunload`)
  - Kritik durumlarda (hata kurtarma)
- **Sıklık:** Sadece acil durumlarda

#### `updateDailyProgress(correctAnswers)` - Günlük İlerleme Güncelleme
- **Ne Yapar:** Streak verilerini günceller (`todayProgress`, `playDates`, `currentStreak`)
- **Ne Zaman Çağrılır:**
  - Her doğru cevap sonrası (`checkAnswer`, `checkDinleAnswer`, `checkBoslukAnswer` içinde)
- **Nereye Kaydeder:** `streakData` global değişkenine (sonra `saveStats()` ile kaydedilir)
- **Sıklık:** Her doğru cevap için 1 kez

### 2. VERİ YÜKLEME FONKSİYONLARI

#### `loadStats()` - Ana Yükleme Fonksiyonu
- **Ne Yapar:** Tüm oyun verilerini IndexedDB ve localStorage'dan yükler
- **Ne Zaman Çağrılır:**
  - Sayfa ilk yüklendiğinde
  - Oyun başlatıldığında
- **Nereden Yükler:**
  - **Öncelik:** IndexedDB
  - **Yedek:** localStorage
- **Sıklık:** Sayfa yüklendiğinde 1 kez

#### `checkDailyTasks()` - Günlük Görev Kontrolü
- **Ne Yapar:** Yeni gün başladıysa yeni günlük görevler oluşturur
- **Ne Zaman Çağrılır:**
  - `loadStats()` sonrası
  - İlk oyun başlatıldığında
- **Nereye Kaydeder:** `dailyTasks` global değişkenine (sonra `saveStats()` ile kaydedilir)
- **Sıklık:** Her sayfa yüklendiğinde 1 kez (sadece yeni gün başladıysa görev oluşturur)

#### `checkWeeklyTasks()` - Haftalık Görev Kontrolü
- **Ne Yapar:** Yeni hafta başladıysa yeni haftalık görevler oluşturur
- **Ne Zaman Çağrılır:**
  - `checkDailyTasks()` sonrası
- **Nereye Kaydeder:** `weeklyTasks` global değişkenine (sonra `saveStats()` ile kaydedilir)
- **Sıklık:** Her sayfa yüklendiğinde 1 kez (sadece yeni hafta başladıysa görev oluşturur)

### 3. UI GÜNCELLEME FONKSİYONLARI

#### `updateTasksDisplay()` - Günlük Görevler UI Güncelleme
- **Ne Yapar:** Günlük görevler panelini günceller
- **Ne Zaman Çağrılır:**
  - Görev tamamlandığında
  - `checkDailyTasks()` sonrası
  - `loadStats()` sonrası
- **Sıklık:** Görev durumu değiştiğinde

#### `updateWeeklyTasksDisplay()` - Haftalık Görevler UI Güncelleme
- **Ne Yapar:** Haftalık görevler panelini günceller
- **Ne Zaman Çağrılır:**
  - Görev tamamlandığında
  - `checkWeeklyTasks()` sonrası
- **Sıklık:** Görev durumu değiştiğinde

#### `updateStatsBar()` - İstatistik Bar Güncelleme
- **Ne Yapar:** Üst bar'daki puan, seviye, streak bilgilerini günceller
- **Ne Zaman Çağrılır:**
  - Puan değiştiğinde
  - Streak güncellendiğinde
  - Seviye değiştiğinde
- **Sıklık:** Her değişiklikte

---

## 🧪 TEST SENARYOLARI

### TEST 1: İLK OYUN BAŞLATMA
**Amaç:** Sayfa ilk açıldığında verilerin doğru yüklenmesi ve görevlerin oluşturulması

**Adımlar:**
1. Tarayıcıyı aç
2. Oyunu yükle
3. Konsolu aç (F12)
4. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ IndexedDB: "Veri bulunamadı" (ilk açılış)
- ✅ localStorage: "Veri bulunamadı" (ilk açılış)
- ✅ Günlük Görevler: "Son Tarih: Bugünün tarihi", "Tamamlanan: 0 / 12"
- ✅ Haftalık Görevler: "Son Hafta: Bu haftanın başlangıcı", "Tamamlanan: 0 / 6"
- ✅ Streak: "Mevcut Streak: 0 gün", "Bugünkü İlerleme: 0 / 5"

**Kontrol Noktaları:**
- [ ] Konsolda hata var mı?
- [ ] Görevler oluşturuldu mu?
- [ ] Veriler bellekte (global değişkenlerde) var mı?

---

### TEST 2: İLK DOĞRU CEVAP
**Amaç:** İlk doğru cevap verildiğinde verilerin güncellenmesi

**Adımlar:**
1. Herhangi bir oyun modunu başlat (Kelime Çevir, Dinle Bul, Boşluk Doldur)
2. İlk soruyu doğru cevapla
3. Konsolu kontrol et
4. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Streak: "Bugünkü İlerleme: 1 / 5" (artmış olmalı)
- ✅ Günlük Görevler: "Bugünkü Puan: X" (puan artmış olmalı)
- ✅ Konsolda: `updateDailyProgress(1)` çağrıldı mı?
- ✅ Konsolda: `debouncedSaveStats()` çağrıldı mı?

**Kontrol Noktaları:**
- [ ] `streakData.todayProgress` = 1 mi?
- [ ] `dailyTasks.todayStats.toplamDogru` = 1 mi?
- [ ] 500ms sonra `saveStats()` çağrıldı mı?
- [ ] IndexedDB'ye kaydedildi mi? (konsolda kontrol et)

---

### TEST 3: 5 DOĞRU CEVAP (GÜNLÜK HEDEF TAMAMLAMA)
**Amaç:** Günlük hedef tamamlandığında streak'in güncellenmesi

**Adımlar:**
1. 5 doğru cevap ver
2. Her cevap sonrası konsolu kontrol et
3. 5. cevap sonrası "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Streak: "Mevcut Streak: 1 gün" (artmış olmalı)
- ✅ Streak: "Son Oyun Tarihi: Bugünün tarihi"
- ✅ Streak: "Bugünkü İlerleme: 5 / 5" (tamamlandı)
- ✅ `streakData.currentStreak` = 1 mi?
- ✅ `streakData.playDates` içinde bugünün tarihi var mı?

**Kontrol Noktaları:**
- [ ] Her doğru cevap sonrası `updateDailyProgress(1)` çağrıldı mı?
- [ ] 5. cevap sonrası `streakData.currentStreak` = 1 mi?
- [ ] `streakData.lastPlayDate` = bugünün tarihi mi?
- [ ] IndexedDB'ye kaydedildi mi?

---

### TEST 4: GÖREV TAMAMLAMA
**Amaç:** Günlük görev tamamlandığında verilerin güncellenmesi

**Adımlar:**
1. Bir günlük görevi tamamla (örn: "5 Kelime Çevir oyna")
2. Görev tamamlandığında konsolu kontrol et
3. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Günlük Görevler: "Tamamlanan: 1 / 12" (artmış olmalı)
- ✅ Görev panelinde görev işaretli görünmeli
- ✅ `dailyTasks.completedTasks` içinde görev ID'si var mı?

**Kontrol Noktaları:**
- [ ] Görev tamamlandı mı? (`dailyTasks.completedTasks.includes(taskId)`)
- [ ] UI güncellendi mi? (`updateTasksDisplay()` çağrıldı mı?)
- [ ] Veriler kaydedildi mi? (`debouncedSaveStats()` çağrıldı mı?)

---

### TEST 5: SAYFA YENİLEME (Aynı Gün)
**Amaç:** Sayfa yenilendiğinde verilerin korunması

**Adımlar:**
1. 3 doğru cevap ver
2. Sayfayı yenile (F5)
3. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Streak: "Bugünkü İlerleme: 3 / 5" (korunmuş olmalı)
- ✅ Günlük Görevler: "Son Tarih: Bugünün tarihi" (aynı)
- ✅ Günlük Görevler: "Tamamlanan: X / 12" (korunmuş)
- ✅ Puanlar korunmuş olmalı

**Kontrol Noktaları:**
- [ ] `loadStats()` çağrıldı mı?
- [ ] Veriler IndexedDB'den yüklendi mi?
- [ ] `checkDailyTasks()` yeni görev oluşturdu mu? (olmamalı - aynı gün)
- [ ] Veriler korundu mu?

---

### TEST 6: YENİ GÜN (Gece 00:01)
**Amaç:** Yeni gün başladığında görevlerin yenilenmesi

**Adımlar:**
1. Sistem saatini 23:59'a ayarla (veya bekleyin)
2. 1 dakika bekle (veya saati 00:01'e ayarla)
3. Sayfayı yenile
4. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Günlük Görevler: "Son Tarih: Yeni günün tarihi"
- ✅ Günlük Görevler: "Tamamlanan: 0 / 12" (sıfırlanmış)
- ✅ Günlük Görevler: "Bugünkü Puan: 0" (sıfırlanmış)
- ✅ Streak: "Bugünkü İlerleme: 0 / 5" (sıfırlanmış)
- ✅ Streak: "Mevcut Streak: X gün" (korunmuş - eğer dün hedef tamamlandıysa)

**Kontrol Noktaları:**
- [ ] `checkDailyTasks()` yeni görev oluşturdu mu?
- [ ] Eski görevler sıfırlandı mı?
- [ ] `todayStats` sıfırlandı mı?
- [ ] Streak korundu mu? (eğer dün hedef tamamlandıysa)

---

### TEST 7: HAFTALIK GÖREV TAMAMLAMA
**Amaç:** Haftalık görev tamamlandığında verilerin güncellenmesi

**Adımlar:**
1. Bir haftalık görevi tamamla (örn: "100 doğru cevap ver")
2. Görev tamamlandığında konsolu kontrol et
3. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Haftalık Görevler: "Tamamlanan: 1 / 6" (artmış olmalı)
- ✅ `weeklyTasks.completedTasks` içinde görev ID'si var mı?
- ✅ `weeklyTasks.weekStats` güncellenmiş mi?

**Kontrol Noktaları:**
- [ ] Görev tamamlandı mı?
- [ ] UI güncellendi mi?
- [ ] Veriler kaydedildi mi?

---

### TEST 8: YENİ HAFTA
**Amaç:** Yeni hafta başladığında görevlerin yenilenmesi

**Adımlar:**
1. Sistem tarihini bir sonraki haftanın pazartesi gününe ayarla
2. Sayfayı yenile
3. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Haftalık Görevler: "Son Hafta: Yeni haftanın başlangıcı"
- ✅ Haftalık Görevler: "Tamamlanan: 0 / 6" (sıfırlanmış)
- ✅ Haftalık Görevler: "Haftalık Puan: 0" (sıfırlanmış)
- ✅ `weeklyTasks.weekStats` sıfırlandı mı?

**Kontrol Noktaları:**
- [ ] `checkWeeklyTasks()` yeni görev oluşturdu mu?
- [ ] Eski haftalık görevler sıfırlandı mı?
- [ ] `weekStats` sıfırlandı mı?

---

### TEST 9: İSTATİSTİKLERİ SIFIRLA
**Amaç:** Sıfırlama butonunun tüm verileri temizlemesi

**Adımlar:**
1. Birkaç oyun oyna (puan, görev, streak oluştur)
2. "İstatistikleri Sıfırla" butonuna tıkla
3. Onay ver
4. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ IndexedDB: "Veri bulunamadı"
- ✅ localStorage: "Veri bulunamadı"
- ✅ Günlük Görevler: "Son Tarih: Yok", "Tamamlanan: 0 / 0"
- ✅ Haftalık Görevler: "Son Hafta: Yok", "Tamamlanan: 0 / 0"
- ✅ Streak: Tüm değerler 0

**Kontrol Noktaları:**
- [ ] `resetAllStats()` çağrıldı mı?
- [ ] IndexedDB temizlendi mi?
- [ ] localStorage temizlendi mi?
- [ ] Global değişkenler sıfırlandı mı?
- [ ] Görevler oluşturulmadı mı? (sıfırlama sonrası)

---

### TEST 10: SAYFA KAPANIRKEN KAYDETME
**Amaç:** Sayfa kapanırken verilerin kaydedilmesi

**Adımlar:**
1. Birkaç doğru cevap ver
2. Sayfayı hemen kapat (X butonuna tıkla)
3. Sayfayı tekrar aç
4. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Veriler korunmuş olmalı
- ✅ Son oynanan puanlar görünmeli
- ✅ Streak ilerlemesi korunmuş olmalı

**Kontrol Noktaları:**
- [ ] `beforeunload` event'i tetiklendi mi?
- [ ] `saveStatsImmediate()` çağrıldı mı?
- [ ] Veriler IndexedDB'ye kaydedildi mi?

---

### TEST 11: MOBİL CİHAZDA TEST
**Amaç:** Mobil cihazda verilerin doğru çalışması

**Adımlar:**
1. Mobil cihazda oyunu aç
2. Birkaç oyun oyna
3. Uygulamayı kapat (arka plana al)
4. Tekrar aç
5. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Veriler korunmuş olmalı
- ✅ IndexedDB veya localStorage'da veri olmalı
- ✅ Görevler korunmuş olmalı

**Kontrol Noktaları:**
- [ ] Mobil tarayıcıda IndexedDB çalışıyor mu?
- [ ] localStorage çalışıyor mu?
- [ ] Veriler kaydedildi mi?

---

### TEST 12: ÇOKLU OYUN MODU TESTİ
**Amaç:** Farklı oyun modlarında verilerin doğru kaydedilmesi

**Adımlar:**
1. Kelime Çevir oyna (3 doğru)
2. Dinle Bul oyna (2 doğru)
3. Boşluk Doldur oyna (1 doğru)
4. "Veri Durumu" butonuna tıkla

**Beklenen Sonuçlar:**
- ✅ Günlük Görevler: "Bugünkü Puan: X" (tüm modlardan puan toplanmış)
- ✅ Günlük Görevler: "Tamamlanan: X / 12" (mod görevleri tamamlanmış)
- ✅ Streak: "Bugünkü İlerleme: 6 / 5" (tüm modlardan toplanmış)

**Kontrol Noktaları:**
- [ ] Her mod için `updateDailyProgress(1)` çağrıldı mı?
- [ ] `dailyTasks.todayStats` tüm modları içeriyor mu?
- [ ] Veriler kaydedildi mi?

---

## ✅ BEKLENEN SONUÇLAR ÖZETİ

### Veri Kaydetme
- ✅ Her doğru cevap sonrası 500ms içinde kaydedilmeli
- ✅ IndexedDB'ye kaydedilmeli (öncelikli)
- ✅ localStorage'a kaydedilmeli (yedek)
- ✅ Sayfa kapanırken acil kaydedilmeli

### Veri Yükleme
- ✅ Sayfa açıldığında IndexedDB'den yüklenmeli
- ✅ IndexedDB yoksa localStorage'dan yüklenmeli
- ✅ Yeni gün başladığında görevler yenilenmeli
- ✅ Yeni hafta başladığında görevler yenilenmeli

### UI Güncelleme
- ✅ Her değişiklikte UI güncellenmeli
- ✅ Görevler paneli güncellenmeli
- ✅ Streak paneli güncellenmeli
- ✅ İstatistik bar güncellenmeli

---

## 🐛 HATA KONTROL LİSTESİ

### Veri Kaydetme Hataları
- [ ] `saveStats()` çağrılmıyor mu?
- [ ] IndexedDB'ye kaydedilmiyor mu?
- [ ] localStorage'a kaydedilmiyor mu?
- [ ] Veriler kayboluyor mu?

### Veri Yükleme Hataları
- [ ] `loadStats()` çağrılmıyor mu?
- [ ] IndexedDB'den yüklenmiyor mu?
- [ ] localStorage'dan yüklenmiyor mu?
- [ ] Veriler yüklenmiyor mu?

### Görev Hataları
- [ ] Görevler oluşturulmuyor mu?
- [ ] Görevler sıfırlanmıyor mu?
- [ ] Görevler tamamlanmıyor mu?
- [ ] Görevler UI'da görünmüyor mu?

### Streak Hataları
- [ ] Streak güncellenmiyor mu?
- [ ] Streak sıfırlanıyor mu?
- [ ] Streak korunmuyor mu?
- [ ] Streak UI'da görünmüyor mu?

### Sıfırlama Hataları
- [ ] Sıfırlama çalışmıyor mu?
- [ ] IndexedDB temizlenmiyor mu?
- [ ] localStorage temizlenmiyor mu?
- [ ] Görevler yeniden oluşturuluyor mu? (olmamalı)

---

## 📝 TEST NOTLARI

### Konsol Komutları (Test İçin)
```javascript
// Veri durumunu kontrol et
showDataStatus();

// Global değişkenleri kontrol et
console.log('dailyTasks:', dailyTasks);
console.log('weeklyTasks:', weeklyTasks);
console.log('streakData:', streakData);
console.log('totalPoints:', totalPoints);

// IndexedDB'yi kontrol et
loadFromIndexedDB('hasene_dailyTasks').then(data => console.log('IndexedDB dailyTasks:', data));
loadFromIndexedDB('hasene_streak').then(data => console.log('IndexedDB streak:', data));

// localStorage'ı kontrol et
console.log('localStorage dailyTasks:', localStorage.getItem('hasene_dailyTasks'));
console.log('localStorage streak:', localStorage.getItem('hasene_streak'));

// Sıfırlama flag'ini kontrol et
console.log('Sıfırlama flag:', localStorage.getItem('hasene_statsJustReset'));
```

### Test Sırası
1. İlk oyun başlatma
2. İlk doğru cevap
3. 5 doğru cevap (hedef tamamlama)
4. Görev tamamlama
5. Sayfa yenileme
6. Yeni gün
7. Haftalık görev
8. Yeni hafta
9. İstatistikleri sıfırla
10. Sayfa kapanırken kaydetme
11. Mobil test
12. Çoklu oyun modu

---

## 🎯 BAŞARI KRİTERLERİ

Tüm testler başarılı olmalı:
- ✅ Veriler doğru kaydediliyor
- ✅ Veriler doğru yükleniyor
- ✅ Görevler doğru çalışıyor
- ✅ Streak doğru çalışıyor
- ✅ UI doğru güncelleniyor
- ✅ Sıfırlama doğru çalışıyor
- ✅ Mobil cihazda çalışıyor

---

**Son Güncelleme:** 2025-12-06
**Hazırlayan:** AI Assistant
**Versiyon:** 1.0


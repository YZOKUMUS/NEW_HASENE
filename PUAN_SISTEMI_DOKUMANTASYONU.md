# 🎮 HASENE ARAPÇA OYUNU - PUAN SİSTEMİ DOKÜMANTASYONU

## 📋 İÇİNDEKİLER
1. [Genel Bakış](#genel-bakış)
2. [Puan (Hasene/XP) Sistemi](#puan-hasene-xp-sistemi)
3. [Yıldız Sistemi](#yıldız-sistemi)
4. [Seviye (Mertebe) Sistemi](#seviye-mertebe-sistemi)
5. [Rozet Sistemi](#rozet-sistemi)
6. [Combo Bonusu](#combo-bonusu)
7. [Günlük Hedef Bonusu](#günlük-hedef-bonusu)
8. [Günlük Görevler ve Ödüller](#günlük-görevler-ve-ödüller)
9. [Ceza Sistemi](#ceza-sistemi)
10. [Oyun Modlarına Göre Puan Kazanma](#oyun-modlarına-göre-puan-kazanma)
11. [Sistemlerin Senkronizasyonu](#sistemlerin-senkronizasyonu)

---

## 🎯 GENEL BAKIŞ

Hasene Arapça Oyunu'nda tüm puanlar **Hasene (XP)** olarak adlandırılır ve kalıcı bir sistem üzerinde çalışır. Her kazanılan puan:
- ✅ `totalPoints` (kalıcı toplam puan) değişkenine eklenir
- ✅ `dailyTasks.todayStats.toplamPuan` (günlük istatistik) değişkenine eklenir
- ✅ `addDailyXP()` fonksiyonu ile günlük hedefe eklenir
- ✅ Yıldız, seviye, rozet sistemlerini otomatik günceller

---

## 💰 PUAN (HASENE/XP) SİSTEMİ

### Temel Puan Kazanma Yolları

#### 1. **Kelime Çevir Modu**
- **Puan Hesaplama**: `Kelime Zorluğu × 2`
- **Zorluk Seviyeleri**:
  - 😊 **Kolay**: 5-9 zorluk → 10-18 XP/soru
  - 😐 **Orta**: 10-11 zorluk → 20-22 XP/soru
  - 😤 **Zor**: 12-21 zorluk → 24-42 XP/soru
  - 🎲 **Karışık**: 5-21 zorluk → 10-42 XP/soru (ortalama ~26 XP)

**Örnek**: Orta zorlukta zorluk değeri 10 olan bir kelime → `10 × 2 = 20 XP`

#### 2. **Dinle ve Bul Modu**
- **Puan Hesaplama**: `Kelime Zorluğu × 2`
- **Zorluk Seviyeleri**: Kelime Çevir ile aynı
- **Örnek**: Zorluk değeri 15 olan bir kelime → `15 × 2 = 30 XP`

#### 3. **Boşluk Doldur Modu**
- **Puan Hesaplama**: **Sabit 10 XP** (zorluktan bağımsız)
- **Örnek**: Her doğru cevap → `+10 XP`

#### 4. **Ayet Oku, Dua Öğren, Hadis Oku Modları**
- **Puan Kazanma**: ❌ **Bu modlarda puan kazanılmaz**
- **Sadece**: Günlük görev ilerlemesi yapılır (görev tamamlandığında ödül verilir)

---

## ⭐ YILDIZ SİSTEMİ

### Yıldız Hesaplama
- **Formül**: `Yıldız Sayısı = Math.floor(totalPoints / 100)`
- **Açıklama**: Her **100 Hasene** = **1 Yıldız**
- **Güncelleme**: Her puan kazanıldığında otomatik güncellenir

**Örnekler**:
- 0-99 Hasene → 0 Yıldız
- 100-199 Hasene → 1 Yıldız
- 200-299 Hasene → 2 Yıldız
- 1000 Hasene → 10 Yıldız

---

## 📈 SEVİYE (MERTEBE) SİSTEMİ

### Seviye Eşikleri

| Seviye | Gerekli Hasene | Toplam Hasene Aralığı |
|--------|---------------|----------------------|
| 1 | 0 | 0 - 999 |
| 2 | 1,000 | 1,000 - 2,499 |
| 3 | 2,500 | 2,500 - 4,999 |
| 4 | 5,000 | 5,000 - 8,499 |
| 5 | 8,500 | 8,500 - 12,999 |
| 6 | 13,000 | 13,000 - 18,999 |
| 7 | 19,000 | 19,000 - 26,499 |
| 8 | 26,500 | 26,500 - 35,499 |
| 9 | 35,500 | 35,500 - 45,999 |
| 10 | 46,000 | 46,000 - 57,999 |
| 11+ | 58,000 + (Seviye-10) × 15,000 | Her seviye için +15,000 Hasene |

**Örnekler**:
- Seviye 11: 58,000 Hasene
- Seviye 12: 73,000 Hasene (58,000 + 15,000)
- Seviye 13: 88,000 Hasene (58,000 + 30,000)
- Seviye 20: 223,000 Hasene (58,000 + 150,000)

### Seviye Atlama
- Seviye atlandığında `showLevelUpModal()` gösterilir
- `playSound('levelup')` sesi çalınır
- Seviye ilerleme çubuğu otomatik güncellenir

---

## 🏅 ROZET SİSTEMİ

### Rozet Türleri ve Gereksinimleri

| Rozet | İsim | Gereksinim | Açıklama |
|-------|------|-----------|----------|
| 🥉 **Bronz** | Mübtedi | Her **2,000 Hasene** | ~15 dakika oyun |
| 🥈 **Gümüş** | Müterakki | Her **8,500 Hasene** | ~1 saat oyun (1 günlük hedef) |
| 🥇 **Altın** | Mütecaviz | Her **25,500 Hasene** | ~3 gün oyun |
| 💎 **Elmas** | Mütebahhir | Her **85,000 Hasene** | ~10 gün oyun |

### Rozet Hesaplama
- **Bronz**: `Math.floor(totalPoints / 2000)`
- **Gümüş**: `Math.floor(totalPoints / 8500)`
- **Altın**: `Math.floor(totalPoints / 25500)`
- **Elmas**: `Math.floor(totalPoints / 85000)`

**Örnekler**:
- 5,000 Hasene → 2 Bronz, 0 Gümüş
- 10,000 Hasene → 5 Bronz, 1 Gümüş
- 30,000 Hasene → 15 Bronz, 3 Gümüş, 1 Altın
- 100,000 Hasene → 50 Bronz, 11 Gümüş, 3 Altın, 1 Elmas

### Rozet Bildirimi
- Yeni rozet kazanıldığında `showBadgeUpModal()` gösterilir
- Elmas ve Altın rozetlerde `levelup` sesi çalınır
- Gümüş ve Bronz rozetlerde `correct` sesi çalınır

---

## 🔥 COMBO BONUSU

### Combo Sistemi
- **Her 3 doğru cevap** = **+5 Hasene bonus**
- Combo sayacı (`comboCount`) her doğru cevapta artar
- 3'ün katlarında otomatik bonus verilir

**Örnekler**:
- 3 doğru cevap → +5 Hasene
- 6 doğru cevap → +10 Hasene (5+5)
- 9 doğru cevap → +15 Hasene (5+5+5)
- 15 doğru cevap → +25 Hasene

### Combo Gösterimi
- Combo 3 veya daha fazla olduğunda ekranda gösterilir
- `comboPopIn` ve `comboShake` animasyonları çalışır
- Her 3'ün katında `combo` sesi çalınır ve mesaj gösterilir: `🔥 COMBO x{comboCount}! +{bonusXP} Bonus XP!`

---

## 🎯 GÜNLÜK HEDEF BONUSU

### Günlük Hedef Seviyeleri

| Seviye | İsim | Hedef Hasene | Süre (Tahmini) |
|--------|------|-------------|----------------|
| 🌱 **Rahat** | Easy | 1,300 Hasene | ~10 dakika |
| 🎯 **Normal** | Normal | 2,700 Hasene | ~20 dakika |
| 🔥 **Ciddi** | Serious | 6,000 Hasene | ~45 dakika |

### Günlük Hedef Bonusu
- **Hedef tamamlandığında**: **+1,000 Hasene bonus**
- Bonus otomatik olarak `totalPoints`'e eklenir
- `updateStatsBar()` ile tüm sistemler güncellenir
- Başarı mesajı gösterilir: `🎉 Günlük hedefini tamamladın! +1000 bonus Hasene!`

### Günlük Hasene Takibi
- `addDailyXP(xp)` fonksiyonu ile her puan günlük hedefe eklenir
- Her gün başında (`lastDailyGoalDate` kontrolü ile) günlük Hasene sıfırlanır
- İlerleme çubuğu (`dailyGoalProgress`) otomatik güncellenir

---

## 📋 GÜNLÜK GÖREVLER VE ÖDÜLLER

### Temel Görevler (Her Gün)

| Görev ID | Görev Adı | Hedef | Ödül | Tip |
|----------|-----------|-------|------|-----|
| `kelime5` | Kelime Çevir | 5 soru | +2 ⭐ | `kelimeCevir` |
| `ayet3` | Ayet Oku | 3 ayet | +2 ⭐ | `ayetOku` |
| `dua2` | Dua Öğren | 2 dua | +2 ⭐ | `duaOgre` |
| `dogru10` | Doğru Cevaplar | 10 doğru | +2 ⭐ | `toplamDogru` |
| `puan100` | Puan Topla | 100 Hasene | +2 ⭐ | `toplamPuan` |

### Bonus Görevler (Rastgele 2 Tane Seçilir)

| Görev ID | Görev Adı | Hedef | Ödül | Tip |
|----------|-----------|-------|------|-----|
| `perfect5` | Mükemmel Seri | 5 soru (hiç yanlış yapmadan) | +2 ⭐ | `perfectStreak` |
| `allDiff` | Farklı Zorluklar | 3 farklı zorlukta oyna | +2 ⭐ | `farklıZorluk` |
| `combo15` | Combo Bonusu | 15 doğru cevap | +2 ⭐ | `toplamDogru` |
| `dinle3` | Dinle & Bul | 3 kelime dinle | +2 ⭐ | `dinleBul` |
| `bosluk2` | Boşluk Doldur | 2 boşluk doldur | +2 ⭐ | `boslukDoldur` |
| `hadis1` | Hadis Oku | 1 hadis oku | +2 ⭐ | `hadisOku` |

### Tüm Görevleri Tamamlama Ödülü
- **Tüm görevler tamamlandığında**: **+2,500 Hasene bonus**
- Ödül `claimDailyRewards()` fonksiyonu ile verilir
- `dailyTasks.rewardsClaimed = true` olarak işaretlenir
- Başarı mesajı: `🎉 Tüm günlük görevleri tamamladın! +2,500 XP bonus!`

**Not**: Görev ödülleri yıldız (⭐) olarak gösterilir ama aslında Hasene olarak eklenir. Her görev +2 Hasene değerindedir.

---

## ⚠️ CEZA SİSTEMİ

### Yanlış Cevap Cezası
- **Ceza Miktarı**: **-5 Hasene** (sadece session score'dan düşülür, totalPoints'ten değil)
- **Uygulama**: `score = Math.max(0, score - CONFIG.wrongAnswerPenalty)`
- **Açıklama**: Yanlış cevap verildiğinde sadece oyun içi skor (`sessionScore`) düşer, kalıcı toplam puan (`totalPoints`) etkilenmez.

**Örnek**:
- Session score: 100 Hasene
- Yanlış cevap → Session score: 95 Hasene (totalPoints değişmez)

### İpucu Kullanımı
- İpucu kullanıldığında da puan cezası uygulanabilir (kodda kontrol edilmeli)

---

## 🎮 OYUN MODLARINA GÖRE PUAN KAZANMA

### 1. 🔤 Kelime Çevir
- ✅ **Doğru Cevap**: `Kelime Zorluğu × 2` Hasene
- ❌ **Yanlış Cevap**: Session score'dan -5 Hasene (totalPoints etkilenmez)
- 🔥 **Combo Bonusu**: Her 3 doğru cevap = +5 Hasene
- 📊 **Günlük Görev**: `kelimeCevir` +1

### 2. 🎵 Dinle ve Bul
- ✅ **Doğru Cevap**: `Kelime Zorluğu × 2` Hasene
- ❌ **Yanlış Cevap**: Session score'dan -5 Hasene
- 🔥 **Combo Bonusu**: Her 3 doğru cevap = +5 Hasene
- 📊 **Günlük Görev**: `dinleBul` +1

### 3. 📝 Boşluk Doldur
- ✅ **Doğru Cevap**: **Sabit 10 Hasene**
- ❌ **Yanlış Cevap**: Session score'dan -5 Hasene
- 🔥 **Combo Bonusu**: Her 3 doğru cevap = +5 Hasene
- 📊 **Günlük Görev**: `boslukDoldur` +1

### 4. 📖 Ayet Oku
- ❌ **Puan Kazanma**: Yok
- 📊 **Günlük Görev**: `ayetOku` +1 (görev tamamlandığında ödül)

### 5. 🤲 Dua Öğren
- ❌ **Puan Kazanma**: Yok
- 📊 **Günlük Görev**: `duaOgre` +1 (görev tamamlandığında ödül)

### 6. 📚 Hadis Oku
- ❌ **Puan Kazanma**: Yok
- 📊 **Günlük Görev**: `hadisOku` +1 (görev tamamlandığında ödül)

---

## 🔄 SİSTEMLERİN SENKRONİZASYONU

### Puan Kazanıldığında Otomatik Güncellenen Sistemler

1. **`addSessionPoints(points)` Fonksiyonu Çağrılır**
   ```
   sessionScore += points
   totalPoints += points
   dailyTasks.todayStats.toplamPuan += points
   addDailyXP(points)  // Günlük hedefe ekle
   comboCount++        // Combo sayacını artır
   ```

2. **Combo Kontrolü**
   ```
   if (comboCount % 3 === 0) {
       totalPoints += 5  // Combo bonusu
       dailyTasks.todayStats.toplamPuan += 5
       addDailyXP(5)
   }
   ```

3. **`updateStatsBar()` Fonksiyonu Çağrılır**
   ```
   starPoints = Math.floor(totalPoints / 100)  // Yıldız güncelle
   level = calculateLevel(totalPoints)         // Seviye güncelle
   updateBadgeSystem()                         // Rozet güncelle
   ```

4. **Günlük Hedef Kontrolü**
   ```
   if (dailyXP >= goalXP) {
       totalPoints += 1000  // Günlük hedef bonusu
       updateStatsBar()
   }
   ```

5. **Seviye Atlama Kontrolü**
   ```
   if (newLevel > oldLevel) {
       showLevelUpModal(newLevel)
       playSound('levelup')
   }
   ```

### Veri Kaydetme
- Her puan kazanıldığında `saveStats()` çağrılır
- **Üçlü Koruma Sistemi**:
  1. IndexedDB (ana sistem)
  2. localStorage (yedek)
  3. URL parametreleri (son çare)

---

## 📊 ÖRNEK SENARYOLAR

### Senaryo 1: Orta Zorlukta 10 Soru Çözme
- **Zorluk**: Orta (10-11 zorluk değeri)
- **Ortalama Puan**: 21 XP/soru
- **10 Doğru Cevap**: 10 × 21 = **210 Hasene**
- **Combo Bonusu**: 3, 6, 9 → 3 × 5 = **+15 Hasene**
- **Toplam**: **225 Hasene**
- **Yıldız**: 2 Yıldız (225 ÷ 100 = 2.25 → 2)
- **Seviye**: Seviye 1'de kalır (225 < 1,000)

### Senaryo 2: Zor Zorlukta 20 Soru Çözme
- **Zorluk**: Zor (12-21 zorluk değeri, ortalama 16.5)
- **Ortalama Puan**: 33 XP/soru
- **20 Doğru Cevap**: 20 × 33 = **660 Hasene**
- **Combo Bonusu**: 3, 6, 9, 12, 15, 18 → 6 × 5 = **+30 Hasene**
- **Toplam**: **690 Hasene**
- **Yıldız**: 6 Yıldız
- **Seviye**: Seviye 1'de kalır (690 < 1,000)
- **Rozet**: 0 Bronz (690 < 2,000)

### Senaryo 3: Günlük Hedef Tamamlama
- **Günlük Hedef**: Normal (2,700 Hasene)
- **Kazanılan Hasene**: 2,700 Hasene
- **Hedef Bonusu**: **+1,000 Hasene**
- **Toplam**: **3,700 Hasene**
- **Yıldız**: 37 Yıldız
- **Seviye**: Seviye 2 (3,700 > 2,500)
- **Rozet**: 1 Bronz (3,700 > 2,000)

### Senaryo 4: Tüm Günlük Görevleri Tamamlama
- **Temel Görevler**: 5 görev × 2 Hasene = 10 Hasene
- **Bonus Görevler**: 2 görev × 2 Hasene = 4 Hasene
- **Görev Ödülleri**: 14 Hasene
- **Tüm Görevler Tamamlama Bonusu**: **+2,500 Hasene**
- **Toplam Kazanç**: **2,514 Hasene**

---

## ✅ DOĞRULAMA KONTROL LİSTESİ

### Puan Sistemi
- ✅ Her doğru cevap `addSessionPoints()` ile ekleniyor
- ✅ `totalPoints` kalıcı olarak güncelleniyor
- ✅ `dailyTasks.todayStats.toplamPuan` güncelleniyor
- ✅ `addDailyXP()` ile günlük hedefe ekleniyor

### Yıldız Sistemi
- ✅ `starPoints = Math.floor(totalPoints / 100)` doğru hesaplanıyor
- ✅ Her 100 Hasene = 1 Yıldız

### Seviye Sistemi
- ✅ `calculateLevel(totalPoints)` doğru seviyeyi döndürüyor
- ✅ Seviye atlandığında modal gösteriliyor
- ✅ İlerleme çubuğu doğru güncelleniyor

### Rozet Sistemi
- ✅ `updateBadgeSystem()` doğru rozet sayılarını hesaplıyor
- ✅ Yeni rozet kazanıldığında modal gösteriliyor

### Combo Sistemi
- ✅ Her 3 doğru cevap = +5 Hasene bonus
- ✅ Combo bonusu `totalPoints`'e ekleniyor
- ✅ Combo bonusu günlük hedefe ekleniyor

### Günlük Hedef
- ✅ Günlük hedef tamamlandığında +1,000 Hasene bonus
- ✅ Her gün başında günlük Hasene sıfırlanıyor

### Günlük Görevler
- ✅ Her görev tamamlandığında ilerleme güncelleniyor
- ✅ Tüm görevler tamamlandığında +2,500 Hasene bonus

---

## 🔧 TEKNİK DETAYLAR

### Ana Fonksiyonlar

1. **`addSessionPoints(points)`**
   - Session ve global puanları günceller
   - Combo sistemini kontrol eder
   - UI'ı günceller

2. **`updateStatsBar()`**
   - Yıldız, seviye, rozet sistemlerini günceller
   - İlerleme çubuklarını günceller
   - Verileri kaydeder

3. **`calculateLevel(points)`**
   - Toplam puana göre seviyeyi hesaplar
   - Seviye 1-10 için sabit eşikler
   - Seviye 11+ için dinamik hesaplama

4. **`updateBadgeSystem()`**
   - Rozet sayılarını hesaplar
   - Yeni rozet kazanıldığında modal gösterir

5. **`addDailyXP(xp)`**
   - Günlük Hasene'ye ekler
   - Günlük hedef kontrolü yapar
   - Hedef tamamlandığında bonus verir

6. **`updateTaskProgress(gameType, amount)`**
   - Günlük görev ilerlemesini günceller
   - Görev tamamlandığında işaretler

---

## 📝 NOTLAR

1. **Hasene = XP = Puan**: Tüm sistemlerde aynı değer kullanılır
2. **Mertebe = Seviye**: Aynı sistem, farklı isim
3. **Session Score**: Sadece oyun içi gösterim için, geri dönüşte sıfırlanır
4. **Total Points**: Kalıcı puan, hiçbir zaman azalmaz (yanlış cevap cezası sadece session score'u etkiler)
5. **Günlük Sıfırlama**: Günlük Hasene ve görevler her gün başında sıfırlanır, totalPoints sıfırlanmaz

---

**Son Güncelleme**: 2025-01-18
**Versiyon**: 1.0


# 🐛 Hasene Skor Hatası Düzeltme Rehberi

## Sorun

1 soru cevapladınız ve 18 hasene kazandınız, ancak haftalık liderlik tablosunda 72 hasene gösteriyor. Bu, skorların birden fazla kez eklenmesinden kaynaklanıyordu.

## ✅ Düzeltme Yapıldı

Kod düzeltildi, artık skorlar sadece bir kez eklenecek.

## 🔧 Mevcut Hatalı Skorları Düzeltme

Eğer haftalık skorunuz hala hatalıysa (çok yüksek gösteriyorsa), tarayıcı console'unu açıp şu komutu çalıştırın:

### Chrome/Edge:
1. `F12` tuşuna basın veya sağ tık > "İncele" (Inspect)
2. "Console" sekmesine gidin
3. Şu kodu yapıştırıp `Enter` tuşuna basın:

```javascript
// Haftalık skorları kontrol et
const weeklyScores = JSON.parse(localStorage.getItem('hasene_weeklyScores') || '{}');
const weekKey = `${new Date().getFullYear()}-W${Math.ceil((((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 86400000) + 1) / 7)).toString().padStart(2, '0')}`;
const currentScore = weeklyScores[weekKey];

if (currentScore) {
    console.log('Mevcut haftalık skor:', currentScore.score);
    
    // Eğer skor çok büyükse (500'den fazla), düzelt
    if (currentScore.score > 500) {
        const totalPoints = parseInt(localStorage.getItem('hasene_totalPoints')) || 0;
        // Bu hafta için maksimum makul skor (tahmin)
        const maxReasonableScore = Math.min(currentScore.score, Math.floor(totalPoints / 2));
        
        weeklyScores[weekKey].score = maxReasonableScore;
        localStorage.setItem('hasene_weeklyScores', JSON.stringify(weeklyScores));
        console.log('✅ Skor düzeltildi:', maxReasonableScore);
        
        // Sayfayı yenileyin
        location.reload();
    } else {
        console.log('✅ Skor normal görünüyor:', currentScore.score);
    }
} else {
    console.log('Haftalık skor bulunamadı');
}
```

### Veya Daha Basit Yöntem:

Eğer haftalık skorunuzu sıfırlamak isterseniz:

```javascript
// Haftalık skorları sıfırla (DİKKAT: Tüm haftalık skorları siler!)
localStorage.removeItem('hasene_weeklyScores');
localStorage.removeItem('hasene_monthlyScores');
console.log('✅ Skorlar sıfırlandı, sayfayı yenileyin');
location.reload();
```

## 📝 Notlar

- Kod düzeltildi, yeni skorlar doğru şekilde eklenecek
- Eski hatalı skorlar manuel olarak düzeltilmeli (yukarıdaki kod ile)
- Gelecekte bu sorun tekrar oluşmayacak

## 🔍 Sorun Neydi?

`saveAllGameData` fonksiyonu her çağrıldığında `updateLeaderboardScores(sessionScore)` çağrılıyordu. Bu fonksiyon birden fazla kez çağrılınca (her soru sonrası, sayfa kapatılırken, vb.) aynı `sessionScore` değeri tekrar tekrar haftalık skorlara ekleniyordu.

**Örnek:** 18 hasene kazandınız ama `saveAllGameData` 4 kez çağrıldıysa → 18 × 4 = 72 hasene görünüyordu.

**Çözüm:** `updateLeaderboardScores` artık sadece oyun bitiminde bir kez çağrılıyor.


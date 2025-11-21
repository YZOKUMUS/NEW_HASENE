# Mikrofon Sistemi Çalışma Mantığı

## 🎯 Genel Akış

### 1. **Mikrofon Butonuna Basma**
- Kullanıcı mikrofon butonuna basar
- `startSpeechRecognition()` fonksiyonu çağrılır
- Mikrofon stream'i açılır (masaüstünde)
- Speech Recognition başlatılır

### 2. **Ses Tanıma Başlatma**
```javascript
recognition.start() // Speech Recognition başlatılır
```
- Mikrofon aktif olur
- Kullanıcı konuşmaya başlar
- Status mesajı: "🎤 Dinleniyor..." gösterilir

### 3. **Konuşma Tanıma**
- Kullanıcı Arapça kelimeyi söyler
- Speech Recognition API konuşmayı metne çevirir
- `recognition.onresult` event'i tetiklenir
- Tanınan metin alınır

### 4. **Eşleştirme Algoritması** (`matchSpeechToAnswer`)

Sistem **3 seviyeli eşleştirme** yapar:

#### **Seviye 1: Tam Eşleşme (100% skor)**
```javascript
if (btnTextNormalized === normalizedSpoken) {
    bestScore = 100;
    bestMatch = btn;
    return; // En iyi eşleşme bulundu
}
```
- Konuşulan metin ile buton metni **tamamen aynı** ise
- Hemen eşleşme kabul edilir

#### **Seviye 2: Kısmi Eşleşme**
```javascript
if (normalizedSpoken.includes(btnTextNormalized) || 
    btnTextNormalized.includes(normalizedSpoken)) {
    similarity = (shorter / longer) * 100;
    if (similarity > bestScore) {
        bestScore = similarity;
        bestMatch = btn;
    }
}
```
- Konuşulan metin buton metnini **içeriyorsa** veya **tam tersi**
- Benzerlik skoru hesaplanır

#### **Seviye 3: Karakter Benzerliği (%70+ eşik)**
```javascript
const charSimilarity = calculateSimilarity(btnTextNormalized, normalizedSpoken);
if (charSimilarity > bestScore && charSimilarity > 70) {
    bestScore = charSimilarity;
    bestMatch = btn;
}
```
- Karakter bazında benzerlik hesaplanır
- **%70'den fazla** benzerlik varsa eşleşme kabul edilir

### 5. **Otomatik Cevap Seçimi**

Eşleşme bulunursa:

```javascript
// 1. Buton vurgulanır (görsel geri bildirim)
matchedButton.style.transform = 'scale(1.05)';
matchedButton.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';

// 2. Doğru cevap kontrolü yapılır
const isCorrect = matchedBtnText.trim() === correctWord.trim();

// 3. 200ms sonra otomatik olarak cevap işlenir
setTimeout(() => {
    checkDinleAnswer(matchedButton, isCorrect);
}, 200);
```

**✅ EVET, doğru okuma sağlandığında otomatik olarak cevap şıkkı tıklanmış gibi işlem yapılır!**

### 6. **Cevap İşleme** (`checkDinleAnswer`)

Bu fonksiyon:
- Butonun tıklanmış gibi işlem yapar
- Doğru/yanlış kontrolü yapar
- Puan hesaplar
- İstatistikleri günceller
- Sonraki soruya geçer

## 🔄 Eşleşme Bulunamazsa

### 2 Deneme Hakkı
```javascript
speechAttemptCount++; // Deneme sayacı artırılır
const maxAttempts = 2; // Maksimum 2 deneme

if (speechAttemptCount < maxAttempts) {
    // "🔄 Tekrar Dene" butonu gösterilir
    // Kullanıcı tekrar deneyebilir
} else {
    // 2 deneme bitti
    // Kullanıcı manuel olarak seçim yapmalı
}
```

## 📊 Örnek Senaryo

1. **Soru:** "السلام" kelimesi dinletilir
2. **Kullanıcı:** Mikrofon butonuna basar
3. **Kullanıcı:** "السلام" der
4. **Sistem:** 
   - Konuşmayı tanır: "السلام"
   - Seçeneklerde "السلام" butonunu bulur
   - Butonu vurgular (yeşil glow efekti)
   - 200ms sonra otomatik olarak `checkDinleAnswer()` çağrılır
   - Doğru cevap olarak işlenir
   - Puan verilir
   - Sonraki soruya geçilir

## ⚙️ Teknik Detaylar

### Speech Recognition Ayarları
```javascript
recognition.lang = 'ar-SA'; // Arapça (Suudi Arabistan)
recognition.continuous = false; // Tek seferlik tanıma
recognition.interimResults = false; // Ara sonuçları gösterme
recognition.maxAlternatives = 3; // En fazla 3 alternatif
```

### Normalizasyon
- Tüm metinler küçük harfe çevrilir
- Boşluklar temizlenir
- HTML içeriği varsa sadece metin alınır

### Görsel Geri Bildirim
- Eşleşme bulunduğunda buton büyür (`scale(1.05)`)
- Yeşil glow efekti gösterilir
- Status mesajı: "✅ 'kelime' eşleşti!"

## 🎯 Sonuç

**Evet, sistem tam otomatik çalışır:**
- Doğru okuma sağlandığında
- Eşleştirme algoritması en uygun seçeneği bulur
- Otomatik olarak `checkDinleAnswer()` çağrılır
- Kullanıcının manuel tıklamasına gerek kalmaz
- Duolingo benzeri akıcı bir deneyim sunar


# 🎯 Onboarding Nasıl Görülür?

## ⚠️ Neden Görünmüyor?

Onboarding **sadece ilk açılışta** gösterilir. Eğer daha önce uygulamayı açtıysanız, localStorage'da işaretlenmiş olabilir.

## ✅ Onboarding'i Görmek İçin:

### Yöntem 1: Tarayıcı Konsolu (En Kolay)
1. Sayfayı açın
2. F12 tuşuna basın (Developer Tools)
3. Console sekmesine gidin
4. Şu komutu yazın ve Enter'a basın:
```javascript
localStorage.removeItem('hasene_onboarding_seen_v1');
location.reload();
```
5. Sayfa yenilendikten sonra onboarding otomatik görünecek!

### Yöntem 2: Manuel Göster
Konsolda şunu çalıştırın:
```javascript
showOnboarding(true);
```

### Yöntem 3: LocalStorage Temizle
Konsolda:
```javascript
localStorage.clear();
location.reload();
```
⚠️ **DİKKAT**: Bu tüm verileri temizler!

---

## 📋 Onboarding Ne Zaman Görünür?

- ✅ İlk kez uygulamayı açan yeni kullanıcılar için
- ✅ Ana ekran yüklendikten **800ms** sonra otomatik gösterilir
- ❌ Daha önce görüldüyse gösterilmez

---

## 🎮 Onboarding Adımları:

1. **📚 Ders Türleri** - Ana ekrandaki oyun modları
2. **💰 Hasene ve İlerleme** - Üstteki istatistikler  
3. **📅 Takvim ve Günlük Vazifeler** - Alt menü

---

## 🔍 Sorun Giderme:

Eğer hala görünmüyorsa:

1. **Konsolu kontrol et** (F12):
   - Hata mesajı var mı?
   
2. **Modal elementi var mı?**
   ```javascript
   document.getElementById('onboardingModal')
   ```
   
3. **Fonksiyonlar yüklendi mi?**
   ```javascript
   typeof showOnboarding
   ```

4. **LocalStorage temizlendi mi?**
   ```javascript
   localStorage.getItem('hasene_onboarding_seen_v1')
   ```

---

**Onboarding hazır ve çalışıyor!** Sadece localStorage'ı temizlemeniz gerekiyor.






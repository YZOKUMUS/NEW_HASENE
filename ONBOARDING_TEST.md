# 🎯 Onboarding Test Rehberi

## Onboarding'yi Görmek İçin:

### Yöntem 1: LocalStorage'ı Temizle
Tarayıcı konsolunda (F12) şunu çalıştır:
```javascript
localStorage.removeItem('hasene_onboarding_seen_v1');
location.reload();
```

### Yöntem 2: Manuel Göster
Tarayıcı konsolunda (F12) şunu çalıştır:
```javascript
showOnboarding(true);
```

## Onboarding Ne Zaman Görünür?

- ✅ Uygulama **ilk açıldığında** otomatik gösterilir
- ✅ Ana ekran yüklendikten 800ms sonra gösterilir
- ❌ Daha önce görüldüyse gösterilmez (localStorage'da işaretlenir)

## Onboarding Adımları:

1. **📚 Ders Türleri** - Ana ekrandaki oyun modları
2. **💰 Hasene ve İlerleme** - Üstteki istatistikler
3. **📅 Takvim ve Günlük Vazifeler** - Alt menü

## Sorun Giderme:

Eğer onboarding görünmüyorsa:
1. Tarayıcı konsolunu kontrol et (F12)
2. `onboardingModal` elementinin var olup olmadığını kontrol et:
   ```javascript
   document.getElementById('onboardingModal')
   ```
3. Onboarding fonksiyonlarının yüklendiğini kontrol et:
   ```javascript
   typeof showOnboarding
   ```







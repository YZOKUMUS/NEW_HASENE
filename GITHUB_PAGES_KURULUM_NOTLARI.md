# 🚀 GitHub Pages Kurulum Notları

## ✅ Yapılan Düzeltmeler

1. **Service Worker Path**: Dinamik base path desteği eklendi
2. **Manifest.json**: Tüm path'ler `/NEW_HASENE/` prefix'i ile güncellendi
3. **Icon Path'leri**: Absolute path'ler kullanılıyor

## 📋 GitHub Pages Ayarları

### Yöntem 1: GitHub Actions ile Otomatik Deploy (Önerilen)

1. GitHub repo'da **Settings** > **Pages** bölümüne gidin
2. **Source** olarak **GitHub Actions** seçin
3. `.github/workflows/deploy.yml` dosyası otomatik olarak çalışacak
4. Her push'ta otomatik deploy yapılacak

### Yöntem 2: Manuel Deploy (Root'tan)

Eğer GitHub Actions kullanmak istemiyorsanız:

1. GitHub repo'da **Settings** > **Pages** bölümüne gidin
2. **Source** olarak **Deploy from a branch** seçin
3. **Branch** olarak **main** seçin
4. **Folder** olarak **/ (root)** seçin
5. **Save** butonuna tıklayın

## 🔗 Erişim URL'i

Proje şu adresten erişilebilir olacak:
**https://yzokumus.github.io/NEW_HASENE/**

## ⚠️ Önemli Notlar

1. **İlk deploy 1-2 dakika sürebilir**
2. **Service Worker** sadece HTTPS üzerinde çalışır (GitHub Pages otomatik HTTPS kullanır)
3. **Cache temizleme**: Eğer eski versiyon görünüyorsa, tarayıcı cache'ini temizleyin
4. **PWA Install**: Mobil cihazlarda "Ana ekrana ekle" özelliği çalışacak

## 🧪 Test Etme

1. https://yzokumus.github.io/NEW_HASENE/ adresine gidin
2. Console'u açın (F12) ve hata olup olmadığını kontrol edin
3. Service Worker'ın kayıt olduğunu kontrol edin: "SW registered ✔" mesajı görünmeli
4. Tüm özellikleri test edin:
   - Oyun modları
   - Veri yükleme
   - PWA özellikleri

## 🐛 Sorun Giderme

### Service Worker kayıt olmuyor
- Console'da hata var mı kontrol edin
- HTTPS kullanıldığından emin olun
- Tarayıcı cache'ini temizleyin

### Dosyalar yüklenmiyor
- Network tab'ında 404 hatası var mı kontrol edin
- Path'lerin doğru olduğundan emin olun (`/NEW_HASENE/` prefix'i)

### PWA çalışmıyor
- Manifest.json'un doğru yüklendiğini kontrol edin
- Icon path'lerinin doğru olduğunu kontrol edin


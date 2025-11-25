# GitHub'a Güncelleme Rehberi

## Mevcut Durum
- ✅ Local branch GitHub ile senkron (commit farkı yok)
- ⚠️ Çalışma dizininde commit edilmemiş değişiklikler var

## GitHub'a Göndermek İçin

### 1. Tüm Değişiklikleri Görmek
```bash
git status
```

### 2. Değişiklikleri Stage'e Almak
```bash
# Tüm değişiklikleri ekle
git add .

# VEYA sadece belirli dosyaları ekle
git add js/data-loader.js KONTROL_REHBERI.md
```

### 3. Commit Yapmak
```bash
git commit -m "feat: loadAllData fonksiyonunu geliştir ve kontrol rehberi ekle"
```

### 4. GitHub'a Push Yapmak
```bash
git push origin main
```

## Sadece Belirli Dosyaları Göndermek İsterseniz

### Örnek: Sadece data-loader.js ve KONTROL_REHBERI.md
```bash
git add js/data-loader.js KONTROL_REHBERI.md
git commit -m "feat: Veri yükleme fonksiyonunu geliştir"
git push origin main
```

## Değişiklikleri Geri Almak İsterseniz

### Tüm değişiklikleri geri al
```bash
git restore .
```

### Sadece belirli bir dosyayı geri al
```bash
git restore js/data-loader.js
```

## Notlar
- `git status` ile her zaman mevcut durumu kontrol edebilirsiniz
- `git diff` ile değişiklikleri görebilirsiniz
- Commit yapmadan önce değişiklikleri gözden geçirmek iyi bir pratiktir


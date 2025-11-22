# 🖼️ RESİM OPTİMİZASYON TALİMATI

## hoparlor.png → WebP Dönüşümü

`hoparlor.png` dosyası **2.46 MB** boyutunda ve optimize edilmesi gerekiyor.

### Yöntem 1: Online Araçlar (Kolay)

1. **Squoosh** (Önerilen): https://squoosh.app/
   - `assets/images/hoparlor.png` dosyasını yükleyin
   - Format: **WebP** seçin
   - Quality: **80** ayarlayın
   - "Download" butonuna tıklayın
   - İndirilen dosyayı `assets/images/hoparlor.webp` olarak kaydedin

2. **CloudConvert**: https://cloudconvert.com/png-to-webp
   - PNG'yi WebP'ye dönüştürün
   - Quality: 80

### Yöntem 2: Komut Satırı (Geliştiriciler için)

#### Windows (PowerShell):
```powershell
# cwebp kurulumu gerekli (Google WebP tools)
# İndir: https://developers.google.com/speed/webp/download

cwebp -q 80 "assets\images\hoparlor.png" -o "assets\images\hoparlor.webp"
```

#### Linux/Mac:
```bash
# cwebp kurulumu
sudo apt-get install webp  # Ubuntu/Debian
brew install webp          # Mac

# Dönüşüm
cwebp -q 80 assets/images/hoparlor.png -o assets/images/hoparlor.webp
```

### Yöntem 3: Node.js Script (Otomatik)

```bash
npm install sharp --save-dev
```

```javascript
// scripts/optimize-images.js
const sharp = require('sharp');

sharp('assets/images/hoparlor.png')
  .webp({ quality: 80 })
  .toFile('assets/images/hoparlor.webp')
  .then(() => console.log('✅ hoparlor.webp oluşturuldu!'))
  .catch(err => console.error('❌ Hata:', err));
```

### Beklenen Sonuç

- **Önceki boyut:** 2.46 MB
- **Yeni boyut:** ~500-700 KB (WebP, quality 80)
- **Tasarruf:** %70-80 boyut azalması

### Not

HTML'de fallback eklendi:
```html
<img src="assets/images/hoparlor.webp" onerror="this.src='assets/images/hoparlor.png';">
```

Eğer WebP desteklenmiyorsa otomatik olarak PNG'ye döner.

---

**Durum:** ✅ HTML ve CSS güncellendi, sadece WebP dosyası oluşturulması gerekiyor.


# PNG Dosyasından Daire Şeklini Kaldırma Rehberi

## Sorun
PNG dosyasının kendisi daire şeklindeyse, CSS ile değiştirilemez. Dosyanın kendisini düzenlemek gerekir.

## Dosya Yolu
```
assets/images/icon-512-v4-RED-MUSHAF.png
```

## Yöntem 1: Online Tool (En Kolay)

### remove.bg
1. https://www.remove.bg/ adresine gidin
2. PNG dosyanızı yükleyin
3. Arka planı kaldırın (eğer varsa)
4. İndirin

### Photopea (Ücretsiz Photoshop Alternatifi)
1. https://www.photopea.com/ adresine gidin
2. File > Open ile PNG dosyanızı açın
3. Crop Tool (C) ile daire çerçevesini kesin
4. File > Export As > PNG ile kaydedin

## Yöntem 2: Paint.NET (Windows)

1. Paint.NET'i açın
2. PNG dosyanızı açın
3. **Rectangle Select Tool** (S) ile içeriği seçin
4. **Image > Crop to Selection** ile kesin
5. **File > Save As** ile kaydedin

## Yöntem 3: GIMP (Ücretsiz)

1. GIMP'i açın
2. File > Open ile PNG dosyanızı açın
3. **Rectangle Select Tool** ile içeriği seçin
4. **Image > Crop to Selection** ile kesin
5. **File > Export As** ile PNG olarak kaydedin

## Yöntem 4: Canva (Online)

1. https://www.canva.com/ adresine gidin
2. Yeni tasarım oluşturun (512x512 px)
3. PNG dosyanızı yükleyin
4. Crop tool ile daire çerçevesini kesin
5. İndirin

## Yöntem 5: Photoshop

1. Photoshop'u açın
2. PNG dosyanızı açın
3. **Crop Tool** (C) ile içeriği seçin
4. Enter'a basın
5. **File > Export > Export As** ile PNG olarak kaydedin

## Önemli Notlar

- Dosyayı düzenlemeden önce **yedek alın**
- Orijinal dosya: `icon-512-v4-RED-MUSHAF.png`
- Yedek dosya: `icon-512-v4-RED-MUSHAF-backup.png`

## Sonuç

Düzenlenmiş PNG dosyasını `assets/images/` klasörüne kaydedin ve önizleme sayfasını yenileyin.


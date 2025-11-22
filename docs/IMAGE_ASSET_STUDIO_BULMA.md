# 🔍 Image Asset Studio'yu Bulma - Alternatif Yöntemler

## 🎯 Sorun
Android Studio'da `android/app/src/main/res` klasörünü bulamıyorsunuz.

## ✅ ÇÖZÜM: Farklı Yöntemler

### Yöntem 1: Project View'dan

1. **Android Studio'nun sol üst köşesinde** görünüm seçicisine bakın
2. **"Project"** seçeneğini seçin (Android değil!)
3. Şu yolu takip edin:
   ```
   android > app > src > main > res
   ```
4. **res** klasörüne **sağ tıklayın**
5. **New > Image Asset** seçin

### Yöntem 2: Android View'dan

1. Sol üst köşede **"Android"** görünümü seçili olsun
2. Şu yolu takip edin:
   ```
   app > res
   ```
3. **res** klasörüne **sağ tıklayın**
4. **New > Image Asset** seçin

### Yöntem 3: Menüden

1. Üst menüden: **File > New > Image Asset**
2. Image Asset Studio açılacak
3. Icon dosyanızı seçin

### Yöntem 4: Klasörü Manuel Bulma

1. **Windows Explorer'da** şu klasöre gidin:
   ```
   C:\Users\ziyao\Desktop\NEW_HASENE\android\app\src\main\res
   ```
2. Bu klasöre **sağ tıklayın**
3. **"Open in Android Studio"** seçeneğini arayın
4. Veya Android Studio'da: **File > Open** ile bu klasörü açın

### Yöntem 5: Search ile Bulma

1. Android Studio'da **Ctrl + Shift + F** (veya **Cmd + Shift + F** Mac'te)
2. **"res"** kelimesini arayın
3. Sonuçlardan `android/app/src/main/res` klasörünü bulun
4. Üzerine **çift tıklayın**
5. **Sağ tıklayın > New > Image Asset**

## 📂 Klasör Yapısı

Android Studio'da görmeniz gereken yapı:

```
NEW_HASENE
└── android
    └── app
        └── src
            └── main
                └── res          ← BURAYA SAĞ TIKLAYIN
                    ├── drawable
                    ├── mipmap-hdpi
                    ├── mipmap-mdpi
                    └── ...
```

## 🎯 EN KOLAY YÖNTEM

### Menüden Direkt Açma:

1. Android Studio'da üst menüden:
   - **File > New > Image Asset**
2. Image Asset Studio açılacak
3. Icon dosyanızı seçin:
   - **Path:** `C:\Users\ziyao\Desktop\NEW_HASENE\assets\images\icon-512-v4-RED-MUSHAF.png`
4. Ayarları yapın
5. **Generate** butonuna tıklayın

## 🔍 Görünüm Değiştirme

Android Studio'da sol üst köşede görünüm seçicisi var:

- **Android:** Sadeleştirilmiş görünüm
- **Project:** Tam dosya yapısı
- **Packages:** Paket görünümü

**Project** görünümünü seçerseniz tüm klasörleri görebilirsiniz.

## ✅ Kontrol

Image Asset Studio açıldıysa:
- ✅ Icon Type seçeneği görünüyor
- ✅ Foreground Layer sekmesi var
- ✅ Background Layer sekmesi var
- ✅ Preview alanı var

## 💡 İpuçları

1. **Project görünümüne geçin:**
   - Sol üst köşede "Project" seçin
   - Tüm klasörleri görebilirsiniz

2. **Klasörü genişletin:**
   - Sol paneldeki küçük ok işaretlerine tıklayın
   - Klasörleri genişletin

3. **Search kullanın:**
   - Ctrl + Shift + F ile "res" arayın
   - Klasörü bulun

## 🚀 Hızlı Çözüm

**En kolay:** Üst menüden **File > New > Image Asset** seçin!

---

**ÖNEMLİ:** File > New > Image Asset en kolay yöntemdir!


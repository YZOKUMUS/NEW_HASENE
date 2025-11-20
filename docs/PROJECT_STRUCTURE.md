# 📁 Proje Klasör Yapısı

## 🎯 Genel Bakış

Proje dosyaları kategorilere göre organize edilmiştir.

## 📂 Klasör Yapısı

```
NEW_HASENE/
├── 📄 index.html          # Ana HTML dosyası
├── 📄 style.css           # CSS stilleri
├── 📄 server.js          # Node.js sunucu dosyası
├── 📄 sw.js              # Service Worker
├── 📄 manifest.json      # PWA manifest
├── 📄 package.json       # NPM bağımlılıkları
├── 📄 README.md          # Proje dokümantasyonu
│
├── 📁 js/                 # JavaScript modülleri
│   ├── config.js
│   ├── data-loader.js
│   ├── error-handler.js
│   ├── favorites.js
│   ├── safety-checks.js
│   └── utils.js
│
├── 📁 docs/               # Dokümantasyon dosyaları
│   ├── CODE_SAFETY_GUIDE.md
│   ├── GEREKSIZ_DOSYALAR_RAPORU.md
│   ├── IYILESTIRMELER_RAPORU.md
│   ├── KOD_KONTROL_RAPORU.md
│   ├── PUAN_SISTEMI_DOGRULAMA_RAPORU.md
│   ├── PUAN_SISTEMI_DOKUMANTASYONU.md
│   ├── TEST_KONTROL_LISTESI.md
│   └── TEST_RAPORU.md
│
├── 📁 data/               # JSON veri dosyaları
│   ├── ayetoku_formatted.json
│   ├── duaet.json
│   ├── hadisoku.json
│   └── kelimebul.json
│
├── 📁 assets/             # Statik dosyalar
│   ├── 📁 images/         # Resim dosyaları
│   │   ├── clue.png
│   │   ├── hoparlor.png
│   │   ├── icon-192-v4-RED-MUSHAF.png
│   │   ├── icon-512-v4-RED-MUSHAF.png
│   │   └── OPENBOOK.png
│   └── 📁 fonts/           # Font dosyaları
│       └── KFGQPC Uthmanic Script HAFS Regular.otf
│
├── 📁 previews/            # Tasarım önizleme dosyaları
│   ├── badges_preview.html
│   ├── daily_tasks_design_preview.html
│   ├── game_design_preview.html
│   └── main_menu_design_preview.html
│
├── 📁 tests/               # Test dosyaları
│   ├── TEST_SENARYOLARI.csv
│   └── TEST_SENARYOLARI.xlsx
│
└── 📁 scripts/             # Yardımcı scriptler
    ├── convert-csv-to-xlsx.js
    └── push-to-github.bat
```

## 📋 Klasör Açıklamaları

### 📁 `js/`
JavaScript modülleri ve yardımcı fonksiyonlar.

### 📁 `docs/`
Proje dokümantasyonu, raporlar ve rehberler.

### 📁 `data/`
Oyun verileri (kelimeler, ayetler, hadisler, dualar) JSON formatında.

### 📁 `assets/`
- **`images/`**: Resim dosyaları (ikonlar, görseller)
- **`fonts/`**: Font dosyaları

### 📁 `previews/`
Tasarım önizleme HTML dosyaları (geliştirme amaçlı).

### 📁 `tests/`
Test senaryoları ve test dosyaları.

### 📁 `scripts/`
Yardımcı scriptler (veri dönüştürme, git işlemleri vb.).

## 🔍 Dosya Arama İpuçları

- **Dokümantasyon**: `docs/` klasöründe
- **Veri dosyaları**: `data/` klasöründe
- **Resimler**: `assets/images/` klasöründe
- **JavaScript modülleri**: `js/` klasöründe
- **Test dosyaları**: `tests/` klasöründe

## ✅ Son Güncelleme

Klasör yapısı 2025-01-19 tarihinde düzenlenmiştir.


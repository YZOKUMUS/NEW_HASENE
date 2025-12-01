# 📅 Takvim ve Haftalık Takip - Renk Şeması

## 🎨 Renk Sistemi Özeti

Takvim ve haftalık takipte **modern oyun benzeri** bir renk sistemi kullanılıyor.

---

## 📅 Haftalık Takip Renkleri

### Gün Durumlarına Göre Renkler:

#### 1. ✅ **Bugün - Tamamlandı**
- **Renk**: `#58cc02` (canlı yeşil)
- **Arka Plan**: Yeşil dolu
- **Metin**: Beyaz
- **Kenarlık**: Yeşil

```
┌─────────┐
│    ✓    │  <- Bugün tamamlandı
└─────────┘
 Yeşil (#58cc02)
```

#### 2. 📍 **Bugün - Henüz Oynanmadı**
- **Renk**: `#58cc02` (yeşil kenarlık)
- **Arka Plan**: Açık yeşil (Light: `#e5f4e3`, Dark: `#1e3a1e`)
- **Metin**: Yeşil
- **Kenarlık**: Yeşil kalın

```
┌─────────┐
│   Bugün │  <- Bugün henüz oynanmadı
└─────────┘
 Yeşil kenarlık
```

#### 3. 🔥 **Streak Günü - Tamamlandı**
- **Renk**: Alev rengi (turuncu/kırmızı gradient)
- **Gradient**: `linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)`
- **Metin**: Beyaz
- **Kenarlık**: Turuncu-kırmızı (`#ff6b35`)

```
┌─────────┐
│    ✓    │  <- Streak günü (alev rengi)
└─────────┘
 Turuncu-kırmızı gradient
```

#### 4. ✅ **Oynandı - Streak Dışında**
- **Renk**: `#58cc02` (yeşil)
- **Arka Plan**: Yeşil dolu
- **Metin**: Beyaz
- **Kenarlık**: Yeşil

```
┌─────────┐
│    ✓    │  <- Oynandı ama streak dışı
└─────────┘
 Yeşil (#58cc02)
```

#### 5. ⚪ **Oynanmadı**
- **Renk**: Gri
- **Light Mode**: `#e5e5e5` arka plan, `#999` metin
- **Dark Mode**: `#2a2a2a` arka plan, `#666` metin

```
┌─────────┐
│         │  <- Oynanmadı (gri)
└─────────┘
 Gri
```

---

## 📆 Aylık Takvim Renkleri

### Gün Durumlarına Göre Renkler:

#### 1. ✅ **Bugün - Tamamlandı**
- **Renk**: `#58cc02` (canlı yeşil)
- **Arka Plan**: Yeşil dolu
- **Metin**: Beyaz (✓ işareti)
- **Kenarlık**: Yeşil
- **Gölge**: `rgba(88, 204, 2, 0.3)`

#### 2. 📍 **Bugün - Henüz Oynanmadı**
- **Renk**: `#58cc02` (yeşil kenarlık)
- **Arka Plan**: Açık yeşil
  - Light: `#e5f4e3`
  - Dark: `#1e3a1e`
- **Metin**: Yeşil (gün numarası)
- **Kenarlık**: Yeşil kalın

#### 3. 🔥 **Streak Günü - Tamamlandı**
- **Renk**: Alev rengi (turuncu/kırmızı gradient)
- **Gradient**: `linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)`
- **Metin**: Beyaz (✓ işareti)
- **Kenarlık**: Turuncu-kırmızı (`#ff6b35`)
- **Gölge**: `rgba(255, 107, 53, 0.4)`

#### 4. ✅ **Geçmiş Gün - Oynandı (Streak Dışında)**
- **Renk**: `#58cc02` (yeşil)
- **Light Mode**: `#58cc02`
- **Dark Mode**: `#4db300`
- **Metin**: Beyaz (✓ işareti)
- **Kenarlık**: Yeşil

#### 5. ⚪ **Geçmiş Gün - Oynanmadı**
- **Renk**: Gri
- **Light Mode**: `#e5e5e5` arka plan, `#999` metin
- **Dark Mode**: `#2a2a2a` arka plan, `#666` metin
- **Metin**: Gün numarası

#### 6. 🔮 **Gelecek Gün**
- **Renk**: Açık gri
- **Light Mode**: `#f7f7f7` arka plan, `#ccc` metin
- **Dark Mode**: `#1a1a1a` arka plan, `#555` metin
- **Metin**: Gün numarası

---

## 🎯 Renk Özeti Tablosu

| Durum | Arka Plan | Metin | Kenarlık | İkon |
|-------|-----------|-------|----------|------|
| **Bugün - Tamamlandı** | `#58cc02` (yeşil) | Beyaz | Yeşil | ✓ |
| **Bugün - Oynanmadı** | `#e5f4e3` (açık yeşil) | `#58cc02` | Yeşil kalın | Gün numarası |
| **Streak - Tamamlandı** | Alev gradient (turuncu/kırmızı) | Beyaz | Turuncu-kırmızı | ✓ |
| **Oynandı - Streak Dışı** | `#58cc02` (yeşil) | Beyaz | Yeşil | ✓ |
| **Oynanmadı - Geçmiş** | `#e5e5e5` (gri) | `#999` | Gri | Gün numarası |
| **Gelecek Gün** | `#f7f7f7` (açık gri) | `#ccc` | Açık gri | Gün numarası |

### Dark Mode Renkleri

| Durum | Arka Plan | Metin | Kenarlık |
|-------|-----------|-------|----------|
| **Bugün - Oynanmadı** | `#1e3a1e` (koyu yeşil) | `#58cc02` | Yeşil |
| **Oynandı - Streak Dışı** | `#4db300` (koyu yeşil) | Beyaz | Yeşil |
| **Oynanmadı - Geçmiş** | `#2a2a2a` (koyu gri) | `#666` | Gri |
| **Gelecek Gün** | `#1a1a1a` (çok koyu) | `#555` | Koyu gri |

---

## 🔥 Streak Bilgisi Kartı

### Seri Bilgisi Başlığı
- **Arka Plan**: `linear-gradient(135deg, #58cc02 0%, #4db300 100%)` (yeşil gradient)
- **Renk**: Beyaz
- **Gölge**: `rgba(88, 204, 2, 0.3)`

```
┌─────────────────────────┐
│   🔥 Seri Bilgisi       │
│                         │
│        0 gün seri       │  <- Yeşil gradient arka plan
│                         │
│  Her gün talebe et,     │
│  serini bozma!          │
└─────────────────────────┘
```

---

## 📊 Gün İsimleri

### Haftalık Takvim
- **Bugün**: `#58cc02` (yeşil), kalın (font-weight: 700)
- **Diğer günler**: 
  - Light: `#999` (gri)
  - Dark: `#b0b0b0` (açık gri)

### Aylık Takvim
- **Tüm günler**: 
  - Light: `#999` (gri)
  - Dark: `#b0b0b0` (açık gri)

---

## 🎨 Özel Durumlar

### Hover Efektleri
- **Takvim günleri**: `transform: scale(1.05)` (büyütme)
- Tıklanabilir görünüm

### Animasyonlar
- **Geçişler**: `transition: transform 0.2s, box-shadow 0.2s`
- Smooth animasyonlar

---

## 🌙 Dark Mode Uyumu

Tüm renkler dark mode'da otomatik olarak uyarlanıyor:
- Açık renkler → Koyu renkler
- Kontrast korunuyor
- Görünürlük sağlanıyor

---

## ✅ Sonuç

**Renk sistemi**: Modern oyun tarzı, tutarlı ve kullanıcı dostu

**Ana renkler**:
- 🟢 Yeşil (`#58cc02`) - Tamamlandı
- 🔥 Alev (`#ff6b35` → `#f7931e`) - Streak
- ⚪ Gri - Oynanmadı

**Durum**: ✅ Tüm renkler doğru şekilde uygulanmış!

---

**Son Güncelleme**: 2024


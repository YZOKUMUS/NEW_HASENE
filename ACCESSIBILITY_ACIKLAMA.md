# ♿ Accessibility (Erişilebilirlik) Nedir?

## 🎯 Accessibility Ne İşe Yarar?

**Accessibility (Erişilebilirlik)**, uygulamanın **herkes tarafından kullanılabilir** olmasını sağlar:

### 👥 Kimler Faydalanır?

1. **Klavye Kullanıcıları**
   - Mouse kullanamayan kullanıcılar
   - Trackpad kullanmayı tercih edenler
   - Hızlı kısayol tuşları sevenler

2. **Görme Engelli Kullanıcılar**
   - Screen reader (ekran okuyucu) kullananlar
   - Görme problemi olanlar
   - Renk körü kullanıcılar

3. **Motor Engelli Kullanıcılar**
   - El titremesi olanlar
   - Mouse kullanamayanlar
   - Dokunmatik ekran kullananlar

4. **Tüm Kullanıcılar**
   - Daha hızlı navigasyon
   - Daha iyi UX (kullanıcı deneyimi)
   - SEO iyileştirmesi

---

## ⌨️ Keyboard Navigation (Klavye Navigasyonu) Nedir?

### Ne İşe Yarar?

**Keyboard Navigation**, kullanıcıların uygulamayı **sadece klavye ile** kullanabilmesini sağlar.

### Neden Önemli?

1. **Mouse olmadan kullanım**
   - Tab tuşu ile butonlar arasında gezinme
   - Enter ile butonlara tıklama
   - Escape ile modal'ları kapatma

2. **Hızlı kısayollar**
   - `1` tuşu: İlk oyun modu
   - `Enter`: Onayla
   - `Escape`: İptal/Kapat

3. **Accessibility yasaları**
   - WCAG (Web Content Accessibility Guidelines) standardı
   - Yasal zorunluluklar (bazı ülkelerde)

### Mevcut Durum

✅ **İyi olanlar:**
- Bazı butonlarda `tabindex="0"` var
- ARIA label'lar mevcut

❌ **Eksik olanlar:**
- Tab tuşu ile tüm butonlar arasında gezinme yok
- Enter tuşu ile buton tıklama çalışmıyor (çoğu yerde)
- Escape tuşu ile modal kapatma yok
- Ok tuşları (Arrow keys) ile navigasyon yok

### Örnek Sorunlar

**Şu anki durum:**
```html
<button class="game-card" onclick="startGame()">Kelime Çevir</button>
```
❌ Tab tuşu ile ulaşılabilir AMA Enter'a basınca çalışmıyor (sadece tıklama ile çalışıyor)

**İyileştirilmiş hali:**
```html
<button class="game-card" onclick="startGame()" 
        onkeydown="if(event.key==='Enter') startGame()"
        tabindex="0">Kelime Çevir</button>
```
✅ Tab tuşu ile ulaşılabilir VE Enter'a basınca da çalışıyor

---

## 🎯 Focus Management (Odak Yönetimi) Nedir?

### Ne İşe Yarar?

**Focus Management**, klavye kullanıcılarının **nerede olduklarını** bilmesini ve **doğru yere odaklanmalarını** sağlar.

### Neden Önemli?

1. **Modal açıldığında**
   - Modal içindeki ilk butona odaklanmalı
   - Modal dışındaki elementlere odaklanmamalı (focus trap)
   - Modal kapandığında eski yere dönmeli

2. **Sayfa değiştiğinde**
   - Yeni sayfanın önemli elementine odaklanmalı
   - Kullanıcı kaybolmamalı

3. **Form doldurulduğunda**
   - Hata durumunda hatalı alana odaklanmalı
   - Başarı durumunda başarı mesajına odaklanmalı

### Mevcut Durum

❌ **Eksik olanlar:**
- Modal açıldığında otomatik focus yok
- Focus trap (modal içinde tutma) yok
- Modal kapandığında eski yere dönme yok

---

## 📊 Şu Anki Durum Analizi

### ✅ İyi Olanlar

1. **ARIA Labels** (69 tane)
   - Screen reader kullanıcıları için iyi
   - Butonların ne yaptığı açıklanmış

2. **Tabindex Kullanımı**
   - Bazı butonlarda var
   - Tab tuşu ile ulaşılabilir

3. **Role Attributes**
   - `role="button"` kullanılmış
   - Screen reader'lar için iyi

### ❌ Eksik Olanlar

1. **Keyboard Event Handlers**
   - Enter tuşu ile buton tıklama yok
   - Escape tuşu ile modal kapatma yok
   - Ok tuşları ile navigasyon yok

2. **Focus Management**
   - Modal açıldığında otomatik focus yok
   - Focus trap (modal içinde tutma) yok
   - Modal kapandığında eski yere dönme yok

3. **Focus Indicators**
   - Bazı butonlarda focus görünümü zayıf
   - Hangi butonun aktif olduğu belli değil

---

## 🔧 İyileştirme Örnekleri

### 1. Keyboard Navigation Örneği

**Şu anki kod:**
```javascript
// Modal açma
function showModal() {
    document.getElementById('modal').style.display = 'block';
}
```

**İyileştirilmiş kod:**
```javascript
// Modal açma + keyboard support
function showModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    
    // İlk butona odaklan
    const firstButton = modal.querySelector('button');
    if (firstButton) firstButton.focus();
    
    // Escape tuşu ile kapat
    document.addEventListener('keydown', handleEscape);
}

function handleEscape(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}
```

### 2. Focus Trap Örneği

**Modal içinde odaklanmayı tutma:**
```javascript
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab (geri)
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab (ileri)
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}
```

### 3. Buton Keyboard Support Örneği

**Şu anki kod:**
```html
<button onclick="startGame()">Başla</button>
```

**İyileştirilmiş kod:**
```html
<button onclick="startGame()" 
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();startGame();}"
        tabindex="0">Başla</button>
```

---

## 🎯 İyileştirme Öncelikleri

### Yüksek Öncelik

1. **Modal'lara Keyboard Support**
   - Escape ile kapatma
   - Enter ile onaylama
   - Otomatik focus

2. **Oyun Butonlarına Keyboard Support**
   - Tab ile gezinme
   - Enter ile tıklama

3. **Navigation Butonlarına Keyboard Support**
   - Alt menü butonları
   - Ana menü butonu

### Orta Öncelik

4. **Focus Indicators**
   - Daha görünür focus outline
   - Hangi butonun aktif olduğunu gösterme

5. **Focus Trap**
   - Modal içinde odaklanmayı tutma
   - Modal dışına çıkmayı engelleme

6. **Shortcut Keys**
   - `1-6` tuşları: Oyun modları
   - `M` tuşu: Ana menü
   - `S` tuşu: İstatistikler

---

## 📈 Faydalar

### Kullanıcı Deneyimi
- ✅ Daha hızlı navigasyon
- ✅ Daha kolay kullanım
- ✅ Daha iyi UX

### Teknik Faydalar
- ✅ SEO iyileşmesi (arama motorları için)
- ✅ Yasal uyumluluk (WCAG standardı)
- ✅ Daha geniş kullanıcı kitlesi

### İş Faydaları
- ✅ Daha fazla kullanıcı
- ✅ Daha iyi kullanıcı memnuniyeti
- ✅ Profesyonel görünüm

---

## 🚀 Sonuç

**Accessibility (Erişilebilirlik)**, uygulamanızı:
- ✅ **Herkes** için kullanılabilir yapar
- ✅ **Daha hızlı** kullanım sağlar
- ✅ **Profesyonel** görünüm verir
- ✅ **Yasal** gereklilikleri karşılar

**Şu anda:** Bazı temel özellikler var ama eksiklikler mevcut.

**İyileştirme sonrası:** Tam klavye desteği, screen reader desteği, daha iyi kullanıcı deneyimi.

---

**Sonuç:** Accessibility iyileştirmeleri, uygulamanızı **herkes için daha iyi** hale getirir! 🎯


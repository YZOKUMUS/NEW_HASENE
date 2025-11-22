// Metallic Luxury Icon Oluşturucu
// Bu script, RED MUSHAF PNG'sini alıp Metallic Luxury efektleriyle yeni PNG oluşturur

const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('METALLIC LUXURY ICON OLUSTURULUYOR...');
console.log('========================================\n');

// Dosya yolları
const sourceImage = path.join(__dirname, '..', 'assets', 'images', 'icon-512-v4-RED-MUSHAF.png');
const outputImage = path.join(__dirname, '..', 'assets', 'images', 'icon-metallic-luxury-512.png');

// HTML export sayfası oluştur (Canvas API kullanarak)
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Metallic Luxury Icon Export</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        canvas {
            border: 1px solid #333;
        }
    </style>
</head>
<body>
    <canvas id="canvas" width="512" height="512"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            // 1. Arka plan gradient
            const bgGradient = ctx.createLinearGradient(0, 0, 512, 512);
            bgGradient.addColorStop(0, '#1a1a1a');
            bgGradient.addColorStop(0.5, '#2d2d2d');
            bgGradient.addColorStop(1, '#1a1a1a');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, 512, 512);
            
            // 2. RED MUSHAF PNG'yi çiz
            ctx.drawImage(img, 0, 0, 512, 512);
            
            // 3. Overlay gradient (kırmızı-altın)
            const overlayGradient = ctx.createLinearGradient(0, 0, 512, 512);
            overlayGradient.addColorStop(0, 'rgba(220,20,60,0.2)');
            overlayGradient.addColorStop(0.3, 'transparent');
            overlayGradient.addColorStop(0.7, 'transparent');
            overlayGradient.addColorStop(1, 'rgba(255,215,0,0.2)');
            ctx.fillStyle = overlayGradient;
            ctx.fillRect(0, 0, 512, 512);
            
            // 4. Dark overlay
            const darkGradient = ctx.createLinearGradient(0, 0, 512, 512);
            darkGradient.addColorStop(0, 'rgba(26,26,26,0.4)');
            darkGradient.addColorStop(0.5, 'rgba(45,45,45,0.3)');
            darkGradient.addColorStop(1, 'rgba(26,26,26,0.4)');
            ctx.fillStyle = darkGradient;
            ctx.fillRect(0, 0, 512, 512);
            
            // 5. Border (gradient border için basit versiyon)
            // Dış border (kırmızı-altın-kırmızı gradient simülasyonu)
            ctx.strokeStyle = '#DC143C';
            ctx.lineWidth = 12;
            ctx.strokeRect(6, 6, 500, 500);
            
            // Altın çizgi (gradient efekti için)
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 4;
            ctx.strokeRect(12, 12, 488, 488);
            
            // İç border (koyu)
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 8;
            ctx.strokeRect(18, 18, 476, 476);
            
            // PNG olarak indir
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'icon-metallic-luxury-512.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                console.log('✅ PNG indirildi!');
                alert('PNG başarıyla indirildi! Dosya: icon-metallic-luxury-512.png');
            }, 'image/png');
        };
        
        img.onerror = function() {
            console.error('❌ PNG dosyası yüklenemedi!');
            alert('HATA: PNG dosyası yüklenemedi! Lütfen dosya yolunu kontrol edin.');
        };
        
        img.src = '../assets/images/icon-512-v4-RED-MUSHAF.png';
    </script>
</body>
</html>`;

// HTML dosyasını kaydet
const htmlPath = path.join(__dirname, '..', 'previews', 'metallic_luxury_export.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

console.log('✅ Export HTML sayfası oluşturuldu!');
console.log('📁 Dosya: previews\\metallic_luxury_export.html\n');
console.log('📥 PNG İNDİRME:');
console.log('1. previews\\metallic_luxury_export.html dosyasını tarayıcıda açın');
console.log('2. Sayfa açıldığında PNG otomatik olarak indirilecek');
console.log('3. İndirilen dosyayı assets\\images\\ klasörüne kopyalayın\n');
console.log('VEYA:');
console.log('Manuel olarak tarayıcıda açıp PNG\'yi indirin.\n');
console.log('========================================\n');


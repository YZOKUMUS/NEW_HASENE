// hoparlor.png -> hoparlor.webp dönüşüm scripti
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputFile = path.join(__dirname, '..', 'assets', 'images', 'hoparlor.png');
const outputFile = path.join(__dirname, '..', 'assets', 'images', 'hoparlor.webp');

async function convertToWebP() {
    try {
        // Dosya var mı kontrol et
        if (!fs.existsSync(inputFile)) {
            console.error('❌ hoparlor.png dosyası bulunamadı:', inputFile);
            process.exit(1);
        }

        // Dosya boyutunu kontrol et
        const stats = fs.statSync(inputFile);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`📦 Orijinal dosya boyutu: ${sizeMB} MB`);

        console.log('🔄 WebP\'ye dönüştürülüyor...');
        
        // WebP'ye dönüştür (quality: 80)
        await sharp(inputFile)
            .webp({ quality: 80, effort: 6 })
            .toFile(outputFile);

        // Yeni dosya boyutunu kontrol et
        const newStats = fs.statSync(outputFile);
        const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);
        const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);

        console.log(`✅ Dönüşüm tamamlandı!`);
        console.log(`📦 Yeni dosya boyutu: ${newSizeMB} MB`);
        console.log(`💾 Tasarruf: %${savings} (${sizeMB} MB -> ${newSizeMB} MB)`);
        console.log(`📁 Dosya: ${outputFile}`);
    } catch (error) {
        console.error('❌ Hata:', error.message);
        process.exit(1);
    }
}

convertToWebP();


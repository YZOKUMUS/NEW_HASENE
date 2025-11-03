// MANUAL BROWSER TEST SCRIPT
const fs = require('fs');

console.log('🎯 MANUAL BROWSER TEST GUIDE');
console.log('============================\n');

console.log('1️⃣ BROWSER\'DA AÇIN:');
console.log('   file://' + __dirname.replace(/\\/g, '/') + '/index.html\n');

console.log('2️⃣ CONSOLE AÇIN (F12 → Console) VE ŞU KOMUTLARI ÇALIŞTIRIN:\n');

console.log('📊 İstatistik Testleri:');
console.log('debugStats()                    // Mevcut istatistikleri göster');
console.log('updateStatsBar()               // İstatistik barını güncelle\n');

console.log('🎮 Oyun Modu Testleri:');
console.log('// Kelime Çevir test:');
console.log('document.getElementById("kelimeCevirBtn").click()');
console.log('');
console.log('// Dinle ve Bul test:');  
console.log('document.getElementById("dinleBulBtn").click()');
console.log('');
console.log('// Boşluk Doldur test:');
console.log('document.getElementById("boslukDoldurBtn").click()\n');

console.log('🪟 Modal Testleri:');
console.log('showBadgesModal()              // Rozet paneli');
console.log('showDailyTasksModal()          // Günlük görevler'); 
console.log('showCalendarModal()            // Takvim paneli\n');

console.log('💰 Puan Sistemi Testleri:');
console.log('testLevel2()                   // Seviye 2\'ye atla');
console.log('testLevel5()                   // Seviye 5\'e atla');
console.log('resetPoints()                  // Puanları sıfırla\n');

console.log('📋 Günlük Görev Testleri:');
console.log('updateTaskProgress("kelimeCevir", 1)    // Manuel görev ilerletme');
console.log('updateTaskProgress("ayetOku", 1)        // Ayet okuma görevi');
console.log('updateTaskProgress("toplamDogru", 5)    // Toplu doğru cevap\n');

console.log('3️⃣ KONTROL EDİLECEKLER:\n');
console.log('✅ Ana menü yüklendi mi?');
console.log('✅ 4 istatistik kutusu görünüyor mu? (Puan/Yıldız/Rozet/Seviye)');
console.log('✅ 6 oyun modu butonu var mı?');
console.log('✅ 4 üst panel butonu var mı? (Günlük Görevler/Rozetler/İstatistik/Takvim)');
console.log('✅ Oyun modları açılıyor mu?');
console.log('✅ Doğru cevaplarda puan artıyor mu?');
console.log('✅ Modaller açılıp kapanıyor mu?');
console.log('✅ Günlük görevler ilerliyor mu?');
console.log('✅ Seviye atlama çalışıyor mu?\n');

console.log('4️⃣ HATA DURUMUNDA:');
console.log('- Console\'da kırmızı error mesajları var mı?');
console.log('- Network tab\'da 404/500 hataları var mı?');
console.log('- JSON dosyaları yükleniyor mu?\n');

console.log('5️⃣ PERFORMANS TESTİ:');
console.log('- Sayfalar hızlı yükleniyor mu?');
console.log('- Oyun geçişleri akıcı mı?');
console.log('- Modal açılma hızı uygun mu?\n');

// File size check
const stats = {
    'index.html': fs.statSync('index.html').size,
    'kelimebul.json': fs.statSync('kelimebul.json').size,
    'ayetoku.json': fs.statSync('ayetoku.json').size,
    'duaet.json': fs.statSync('duaet.json').size,
    'hadisoku.json': fs.statSync('hadisoku.json').size
};

console.log('📁 DOSYA BOYUTLARI:');
Object.entries(stats).forEach(([file, size]) => {
    const sizeMB = (size / 1024 / 1024).toFixed(2);
    console.log(`${file}: ${sizeMB} MB`);
});

const totalSize = Object.values(stats).reduce((a, b) => a + b, 0);
console.log(`Toplam: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);

console.log('🌐 BROWSER UYUMLULUK:');
console.log('✅ Chrome, Firefox, Safari, Edge destekleniyor');
console.log('✅ Mobile responsive tasarım');
console.log('✅ localStorage kullanıyor (offline veri)\n');

console.log('🚀 TEST BAŞLATMAK İÇİN:');
console.log(`file://${__dirname}\\index.html adresini browser'da açın!`);
console.log('');
console.log('💡 İPUCU: Farklı zorluklarda test yapmayı unutmayın!');
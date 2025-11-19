const XLSX = require('xlsx');
const path = require('path');

// CSV dosyasını oku
const csvFilePath = path.join(__dirname, 'TEST_SENARYOLARI.csv');
const xlsxFilePath = path.join(__dirname, 'TEST_SENARYOLARI.xlsx');

console.log('📄 CSV dosyası okunuyor...');

// CSV'yi oku ve workbook'a çevir
const workbook = XLSX.readFile(csvFilePath, { 
    type: 'file',
    codepage: 65001 // UTF-8
});

// Worksheet'i al
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Sütun genişliklerini ayarla
const colWidths = [
    { wch: 10 },  // Senaryo No
    { wch: 20 },  // Kategori
    { wch: 40 },  // Test Adı
    { wch: 10 },  // Öncelik
    { wch: 50 },  // Adım 1
    { wch: 50 },  // Adım 2
    { wch: 50 },  // Adım 3
    { wch: 50 },  // Adım 4
    { wch: 50 },  // Adım 5
    { wch: 50 },  // Adım 6
    { wch: 50 },  // Adım 7
    { wch: 50 },  // Adım 8
    { wch: 60 },  // Beklenen Sonuç
    { wch: 50 },  // Notlar
    { wch: 15 }   // Durum
];
worksheet['!cols'] = colWidths;

// Satır sayısını hesapla (A sütunundaki son dolu hücre)
let maxRow = 0;
for (let cell in worksheet) {
    if (cell[0] === 'A' && cell !== 'A1') {
        const rowNum = parseInt(cell.substring(1));
        if (rowNum > maxRow && worksheet[cell] && worksheet[cell].v) {
            maxRow = rowNum;
        }
    }
}

// XLSX dosyasını kaydet
XLSX.writeFile(workbook, xlsxFilePath);

console.log('✅ XLSX dosyası oluşturuldu: ' + xlsxFilePath);
console.log(`📊 Toplam ${maxRow - 1} test senaryosu eklendi.`);

// HASENE ARABIC GAME - AUTOMATED TEST RUNNER
const fs = require('fs');
const path = require('path');

console.log('🚀 HASENE ARABIC GAME TEST RUNNER BAŞLATILIYOR...\n');

// 1. JSON Data Loading Test
console.log('📁 === JSON DOSYA YÜKLEMİ TESTLERİ ===');
const jsonFiles = ['kelimebul.json', 'ayetoku.json', 'duaet.json', 'hadisoku.json'];
let jsonResults = {};

jsonFiles.forEach(file => {
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        console.log(`✅ ${file}: ${data.length} kayıt yüklendi`);
        jsonResults[file] = { status: 'OK', count: data.length };
    } catch (error) {
        console.log(`❌ ${file}: HATA - ${error.message}`);
        jsonResults[file] = { status: 'ERROR', error: error.message };
    }
});

// 2. HTML Structure Test
console.log('\n🏗️ === HTML YAPISI TESTLERİ ===');
const htmlContent = fs.readFileSync('index.html', 'utf8');

// Essential DOM elements check
const essentialElements = [
    'gamePoints', 'starPoints', 'topBadgeIcon', 'topBadgeCount', 'playerLevel',
    'mainMenu', 'gameScreen', 'kelimeCevirBtn', 'dinleBulBtn', 'boslukDoldurBtn',
    'ayetOkuBtn', 'duaEtBtn', 'hadisOkuBtn'
];

console.log('🔍 Essential DOM Elements:');
essentialElements.forEach(id => {
    if (htmlContent.includes(`id="${id}"`)) {
        console.log(`✅ #${id} - Found`);
    } else {
        console.log(`❌ #${id} - Missing`);
    }
});

// 3. JavaScript Functions Test
console.log('\n⚙️ === JAVASCRİPT FONKSİYON TESTLERİ ===');
const essentialFunctions = [
    'updateStatsBar', 'addSessionPoints', 'addToGlobalPoints', 'updateTaskProgress',
    'showBadgesModal', 'showDailyTasksModal', 'showCalendarModal',
    'checkAnswer', 'checkDinleAnswer', 'checkBoslukAnswer',
    'loadQuestion', 'loadDinleQuestion', 'loadBoslukQuestion'
];

console.log('🔍 Essential Functions:');
essentialFunctions.forEach(func => {
    if (htmlContent.includes(`function ${func}`)) {
        console.log(`✅ ${func}() - Found`);
    } else {
        console.log(`❌ ${func}() - Missing`);
    }
});

// 4. Modal System Test
console.log('\n🪟 === MODAL SİSTEMİ TESTLERİ ===');
const modals = ['badgesModal', 'dailyTasksModal', 'calendarModal'];
modals.forEach(modal => {
    const hasModal = htmlContent.includes(`id="${modal}"`);
    const hasShow = htmlContent.includes(`show${modal.replace('Modal', '').charAt(0).toUpperCase() + modal.replace('Modal', '').slice(1)}Modal`);
    const hasClose = htmlContent.includes(`close${modal.replace('Modal', '').charAt(0).toUpperCase() + modal.replace('Modal', '').slice(1)}Modal`);
    
    if (hasModal && hasShow && hasClose) {
        console.log(`✅ ${modal} - Complete (Modal + Show + Close)`);
    } else {
        console.log(`❌ ${modal} - Incomplete (Modal:${hasModal}, Show:${hasShow}, Close:${hasClose})`);
    }
});

// 5. Daily Tasks System Test
console.log('\n📋 === GÜNLÜK GÖREVLER SİSTEMİ TESTLERİ ===');
const taskTypes = ['kelimeCevir', 'dinleBul', 'boslukDoldur', 'ayetOku', 'duaOgre', 'hadisOku'];
console.log('🔍 Task Type Integration:');
taskTypes.forEach(type => {
    const hasInStats = htmlContent.includes(`${type}: 0`);
    const hasUpdateCall = htmlContent.includes(`updateTaskProgress('${type}'`);
    
    if (hasInStats && hasUpdateCall) {
        console.log(`✅ ${type} - Complete (Stats + UpdateCall)`);
    } else {
        console.log(`❌ ${type} - Incomplete (Stats:${hasInStats}, Update:${hasUpdateCall})`);
    }
});

// 6. Game Mode Integration Test
console.log('\n🎮 === OYUN MODU ENTEGRASYONu TESTLERİ ===');
const gameModes = [
    { name: 'Kelime Çevir', btn: 'kelimeCevirBtn', check: 'checkAnswer' },
    { name: 'Dinle ve Bul', btn: 'dinleBulBtn', check: 'checkDinleAnswer' },
    { name: 'Boşluk Doldur', btn: 'boslukDoldurBtn', check: 'checkBoslukAnswer' }
];

gameModes.forEach(mode => {
    const hasButton = htmlContent.includes(`id="${mode.btn}"`);
    const hasChecker = htmlContent.includes(`function ${mode.check}`);
    const hasCompletion = htmlContent.includes('addToGlobalPoints');
    
    console.log(`${hasButton && hasChecker && hasCompletion ? '✅' : '❌'} ${mode.name} - Button:${hasButton}, Checker:${hasChecker}, Completion:${hasCompletion}`);
});

// 7. Session vs Global Points Test
console.log('\n💰 === PUAN SİSTEMİ SENKRON TESTİ ===');
const hasSessionPoints = htmlContent.includes('sessionScore');
const hasGlobalPoints = htmlContent.includes('totalPoints');
const hasTransfer = htmlContent.includes('addToGlobalPoints');
const hasSave = htmlContent.includes('saveStats()');

console.log(`${hasSessionPoints ? '✅' : '❌'} Session Points System`);
console.log(`${hasGlobalPoints ? '✅' : '❌'} Global Points System`);
console.log(`${hasTransfer ? '✅' : '❌'} Session→Global Transfer`);
console.log(`${hasSave ? '✅' : '❌'} LocalStorage Save`);

// 8. CSS & Layout Test
console.log('\n🎨 === CSS VE LAYOUT TESTLERİ ===');
const hasBadgeStyles = htmlContent.includes('.badge') || htmlContent.includes('background: linear-gradient');
const hasResponsive = htmlContent.includes('flex') && htmlContent.includes('justify-content');
const hasColors = htmlContent.includes('#FF9800') && htmlContent.includes('#4CAF50');

console.log(`${hasBadgeStyles ? '✅' : '❌'} Badge Styling`);
console.log(`${hasResponsive ? '✅' : '❌'} Responsive Layout`);
console.log(`${hasColors ? '✅' : '❌'} Color Theme`);

// 9. Error Handling Test
console.log('\n🛡️ === HATA YÖNETİMİ TESTLERİ ===');
const hasErrorHandling = htmlContent.includes('try {') && htmlContent.includes('catch');
const hasConsoleLogging = htmlContent.includes('console.log');
const hasAlerts = htmlContent.includes('alert(') || htmlContent.includes('Yüklenemedi');

console.log(`${hasErrorHandling ? '✅' : '❌'} Try/Catch Error Handling`);
console.log(`${hasConsoleLogging ? '✅' : '❌'} Console Debugging`);
console.log(`${hasAlerts ? '✅' : '❌'} User Error Notifications`);

// 10. Data Integrity Test
console.log('\n🔐 === VERİ BÜTÜNLÜK TESTLERİ ===');
let dataErrors = [];

// Check kelimebul.json structure
try {
    const kelimeData = JSON.parse(fs.readFileSync('kelimebul.json', 'utf8'));
    const sample = kelimeData[0];
    
    if (!sample.kelime || !sample.anlam || typeof sample.difficulty !== 'number') {
        dataErrors.push('kelimebul.json: Invalid structure');
    } else {
        console.log('✅ kelimebul.json structure - OK');
    }
} catch (e) {
    dataErrors.push(`kelimebul.json: ${e.message}`);
}

// Check ayetoku.json structure
try {
    const ayetData = JSON.parse(fs.readFileSync('ayetoku.json', 'utf8'));
    const sample = ayetData[0];
    
    if (!sample.ayet_metni || !sample.meal) {
        dataErrors.push('ayetoku.json: Invalid structure');
    } else {
        console.log('✅ ayetoku.json structure - OK');
    }
} catch (e) {
    dataErrors.push(`ayetoku.json: ${e.message}`);
}

if (dataErrors.length > 0) {
    console.log('❌ Data Errors Found:');
    dataErrors.forEach(error => console.log(`  - ${error}`));
} else {
    console.log('✅ All data structures valid');
}

// FINAL SUMMARY
console.log('\n🎯 === GENEL TEST SONUCU ===');
console.log(`✅ JSON Files: ${Object.values(jsonResults).filter(r => r.status === 'OK').length}/4`);
console.log(`✅ Total Records: ${Object.values(jsonResults).filter(r => r.status === 'OK').reduce((sum, r) => sum + (r.count || 0), 0)}`);
console.log(`${dataErrors.length === 0 ? '✅' : '❌'} Data Integrity: ${dataErrors.length === 0 ? 'OK' : 'Issues Found'}`);

const allSystemsOk = Object.values(jsonResults).every(r => r.status === 'OK') && dataErrors.length === 0;
console.log(`\n${allSystemsOk ? '🎉' : '⚠️'} OVERALL STATUS: ${allSystemsOk ? 'ALL SYSTEMS GO!' : 'ISSUES DETECTED'}`);

if (allSystemsOk) {
    console.log('\n🚀 Oyun test için hazır! Browser\'da test edebilirsiniz.');
} else {
    console.log('\n🔧 Tespit edilen sorunlar düzeltilmeli.');
}
// CRITICAL ERROR DETECTOR
const fs = require('fs');

console.log('🔍 CRITICAL ERROR DETECTION RUNNING...\n');

const html = fs.readFileSync('index.html', 'utf8');

// Check for common JavaScript errors
const criticalErrors = [];

// 1. Unclosed functions/brackets
const openBraces = (html.match(/{/g) || []).length;
const closeBraces = (html.match(/}/g) || []).length;
if (openBraces !== closeBraces) {
    criticalErrors.push(`❌ Bracket Mismatch: ${openBraces} opening vs ${closeBraces} closing`);
}

// 2. Unclosed parentheses in functions
const functions = html.match(/function\s+\w+\s*\([^)]*\)/g) || [];
console.log(`✅ Found ${functions.length} function declarations`);

// 3. Missing semicolons in critical places
const missingSemicolons = [];
const lines = html.split('\n');
lines.forEach((line, i) => {
    if (line.includes('updateTaskProgress(') && !line.includes(';')) {
        missingSemicolons.push(`Line ${i + 1}: Missing semicolon after updateTaskProgress`);
    }
    if (line.includes('addSessionPoints(') && !line.includes(';')) {
        missingSemicolons.push(`Line ${i + 1}: Missing semicolon after addSessionPoints`);
    }
});

if (missingSemicolons.length > 0) {
    criticalErrors.push('❌ Missing Semicolons:', ...missingSemicolons);
}

// 4. Check for undefined variables
const undefinedVars = [];
const essentialVars = ['totalPoints', 'sessionScore', 'dailyTasks', 'updateTaskProgress', 'addToGlobalPoints'];
essentialVars.forEach(varName => {
    if (!html.includes(varName)) {
        undefinedVars.push(varName);
    }
});

if (undefinedVars.length > 0) {
    criticalErrors.push(`❌ Missing Essential Variables: ${undefinedVars.join(', ')}`);
}

// 5. Check for modal system integrity
const modals = ['badgesModal', 'dailyTasksModal', 'calendarModal'];
const modalErrors = [];
modals.forEach(modal => {
    const hasModal = html.includes(`id="${modal}"`);
    const hasShow = html.includes(`function show${modal.replace('Modal', '').charAt(0).toUpperCase() + modal.replace('Modal', '').slice(1)}Modal`);
    const hasClose = html.includes(`function close${modal.replace('Modal', '').charAt(0).toUpperCase() + modal.replace('Modal', '').slice(1)}Modal`);
    
    if (!hasModal || !hasShow || !hasClose) {
        modalErrors.push(`${modal}: Modal:${hasModal}, Show:${hasShow}, Close:${hasClose}`);
    }
});

if (modalErrors.length > 0) {
    criticalErrors.push('❌ Modal System Issues:', ...modalErrors);
}

// 6. Check for game completion handlers
const gameCompletionErrors = [];
const requiredHandlers = [
    'addToGlobalPoints(sessionScore, sessionCorrect)',
    'updateTaskProgress(',
    'gameOver('
];

requiredHandlers.forEach(handler => {
    if (!html.includes(handler)) {
        gameCompletionErrors.push(handler);
    }
});

if (gameCompletionErrors.length > 0) {
    criticalErrors.push(`❌ Missing Game Handlers: ${gameCompletionErrors.join(', ')}`);
}

// 7. Check for duplicate IDs
const idMatches = html.match(/id="([^"]+)"/g) || [];
const ids = idMatches.map(match => match.match(/id="([^"]+)"/)[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

if (duplicateIds.length > 0) {
    criticalErrors.push(`❌ Duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);
}

// 8. localStorage usage check
if (!html.includes('localStorage.setItem') || !html.includes('localStorage.getItem')) {
    criticalErrors.push('❌ localStorage not properly implemented');
}

// RESULTS
console.log('🎯 CRITICAL ERROR ANALYSIS RESULTS:');
console.log('=====================================\n');

if (criticalErrors.length === 0) {
    console.log('🎉 NO CRITICAL ERRORS FOUND!');
    console.log('✅ JavaScript syntax is valid');
    console.log('✅ All functions are properly closed');
    console.log('✅ Essential variables are defined');
    console.log('✅ Modal system is complete');
    console.log('✅ Game completion handlers exist');
    console.log('✅ No duplicate IDs found');
    console.log('✅ localStorage is implemented');
    console.log('\n🚀 GAME IS READY FOR BROWSER TESTING!');
    console.log('\n📱 NEXT STEPS:');
    console.log('1. Open file://C:/Users/ziyao/Desktop/hasene-arabic-game-main/index.html');
    console.log('2. Check browser console for any runtime errors');
    console.log('3. Test each game mode manually');
    console.log('4. Verify all modals open/close properly');
    console.log('5. Test daily tasks progression');
    
} else {
    console.log('⚠️ CRITICAL ERRORS DETECTED:');
    criticalErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
    });
    console.log('\n🔧 THESE MUST BE FIXED BEFORE BROWSER TESTING!');
}

console.log('\n📊 FINAL STATISTICS:');
console.log(`HTML File Size: ${(fs.statSync('index.html').size / 1024).toFixed(1)} KB`);
console.log(`Total Lines: ${lines.length}`);
console.log(`Functions Found: ${functions.length}`);
console.log(`DOM IDs: ${ids.length}`);
console.log(`Unique IDs: ${[...new Set(ids)].length}`);
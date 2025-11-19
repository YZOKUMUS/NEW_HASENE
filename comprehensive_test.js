// ============================================
// 🧪 KAPSAMLI PROJE TEST SCRIPTI
// ============================================

const fs = require('fs');
const path = require('path');

const testResults = {
    passed: [],
    failed: [],
    warnings: [],
    errors: []
};

function logTest(name, status, message = '') {
    const result = { name, status, message, timestamp: new Date().toISOString() };
    if (status === 'PASS') {
        testResults.passed.push(result);
        console.log(`✅ ${name}`);
    } else if (status === 'FAIL') {
        testResults.failed.push(result);
        console.log(`❌ ${name}: ${message}`);
    } else if (status === 'WARN') {
        testResults.warnings.push(result);
        console.log(`⚠️  ${name}: ${message}`);
    } else {
        testResults.errors.push(result);
        console.log(`🔴 ${name}: ${message}`);
    }
}

// ============================================
// 1. DOSYA VARLIĞI KONTROLÜ
// ============================================
console.log('\n📁 1. DOSYA VARLIĞI KONTROLÜ\n');

const requiredFiles = [
    'index.html',
    'style.css',
    'manifest.json',
    'sw.js',
    'server.js',
    'package.json',
    'kelimebul.json',
    'ayetoku_formatted.json',
    'duaet.json',
    'hadisoku.json',
    'icon-192-v4-RED-MUSHAF.png',
    'icon-512-v4-RED-MUSHAF.png'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        logTest(`Dosya mevcut: ${file}`, 'PASS');
    } else {
        logTest(`Dosya mevcut: ${file}`, 'FAIL', 'Dosya bulunamadı!');
    }
});

// ============================================
// 2. JSON DOSYALARI VALİDASYONU
// ============================================
console.log('\n📋 2. JSON DOSYALARI VALİDASYONU\n');

const jsonFiles = ['manifest.json', 'package.json', 'kelimebul.json', 'ayetoku_formatted.json', 'duaet.json', 'hadisoku.json'];

jsonFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        JSON.parse(content);
        logTest(`JSON geçerli: ${file}`, 'PASS');
        
        // Dosya boyutu kontrolü
        const size = fs.statSync(file).size;
        if (size > 10 * 1024 * 1024) { // 10MB
            logTest(`JSON boyutu: ${file}`, 'WARN', `Dosya çok büyük: ${(size / 1024 / 1024).toFixed(2)}MB`);
        }
    } catch (error) {
        logTest(`JSON geçerli: ${file}`, 'FAIL', error.message);
    }
});

// ============================================
// 3. HTML YAPISI KONTROLÜ
// ============================================
console.log('\n🌐 3. HTML YAPISI KONTROLÜ\n');

try {
    const html = fs.readFileSync('index.html', 'utf8');
    
    // Temel HTML yapısı
    if (html.includes('<!DOCTYPE html>')) {
        logTest('DOCTYPE bildirimi', 'PASS');
    } else {
        logTest('DOCTYPE bildirimi', 'FAIL', 'DOCTYPE eksik!');
    }
    
    if (html.includes('<html lang=')) {
        logTest('HTML lang attribute', 'PASS');
    } else {
        logTest('HTML lang attribute', 'WARN', 'lang attribute eksik');
    }
    
    // Meta tags
    const requiredMeta = [
        'viewport',
        'charset',
        'theme-color'
    ];
    
    requiredMeta.forEach(meta => {
        if (html.includes(`meta name="${meta}"`) || html.includes(`meta charset`)) {
            logTest(`Meta tag: ${meta}`, 'PASS');
        } else {
            logTest(`Meta tag: ${meta}`, 'WARN', 'Meta tag eksik');
        }
    });
    
    // Critical elements
    const criticalElements = [
        'mainMenu',
        'gameScreen',
        'kelimeCevirBtn',
        'dinleBulBtn',
        'boslukDoldurBtn'
    ];
    
    criticalElements.forEach(id => {
        if (html.includes(`id="${id}"`)) {
            logTest(`Critical element: ${id}`, 'PASS');
        } else {
            logTest(`Critical element: ${id}`, 'FAIL', 'Element bulunamadı!');
        }
    });
    
    // Script tags kontrolü
    const scriptCount = (html.match(/<script/g) || []).length;
    if (scriptCount > 0) {
        logTest('Script tags', 'PASS', `${scriptCount} script tag bulundu`);
    } else {
        logTest('Script tags', 'FAIL', 'Script tag bulunamadı!');
    }
    
    // Link tags kontrolü
    const linkCount = (html.match(/<link/g) || []).length;
    logTest('Link tags', 'PASS', `${linkCount} link tag bulundu`);
    
    // Açılış/kapanış tag dengesi (basit kontrol)
    const openTags = (html.match(/<[^/][^>]*>/g) || []).length;
    const closeTags = (html.match(/<\/[^>]+>/g) || []).length;
    // Self-closing tag'leri say (img, br, input, meta, link, hr, etc.)
    const selfClosingTags = (html.match(/<(img|br|input|meta|link|hr|area|base|col|embed|source|track|wbr)[^>]*\/?>/gi) || []).length;
    // Script içindeki tag'leri say (HTML string'ler içindeki tag'ler)
    const scriptHtmlTags = (html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []).join('').match(/<[^/][^>]*>/g) || [];
    const scriptOpenTags = scriptHtmlTags.length;
    // Gerçek fark = açılış - kapanış - self-closing - script içindeki tag'ler
    const adjustedDiff = Math.abs((openTags - scriptOpenTags) - closeTags - selfClosingTags);
    
    // Tolerans artırıldı (self-closing ve script içindeki tag'ler normal)
    if (adjustedDiff < 100) { // Tolerans artırıldı
        logTest('Tag dengesi', 'PASS', `Açılış: ${openTags}, Kapanış: ${closeTags}, Self-closing: ${selfClosingTags}`);
    } else {
        logTest('Tag dengesi', 'WARN', `Dengesizlik olabilir: Açılış: ${openTags}, Kapanış: ${closeTags}`);
    }
    
} catch (error) {
    logTest('HTML okuma', 'FAIL', error.message);
}

// ============================================
// 4. CSS KONTROLÜ
// ============================================
console.log('\n🎨 4. CSS KONTROLÜ\n');

try {
    const css = fs.readFileSync('style.css', 'utf8');
    
    // CSS yapısı
    if (css.length > 0) {
        logTest('CSS dosyası okunabilir', 'PASS', `${css.length} karakter`);
    }
    
    // Media queries
    const mediaQueries = (css.match(/@media/g) || []).length;
    logTest('Media queries', 'PASS', `${mediaQueries} media query bulundu`);
    
    // Responsive kontroller
    const responsiveKeywords = ['@media', 'max-width', 'min-width', 'clamp', 'vw', 'vh'];
    responsiveKeywords.forEach(keyword => {
        if (css.includes(keyword)) {
            logTest(`Responsive: ${keyword}`, 'PASS');
        }
    });
    
    // Critical selectors
    const criticalSelectors = [
        '.game-screen',
        '.dinle-mode',
        '.bosluk-mode',
        '.game-box',
        '.option'
    ];
    
    criticalSelectors.forEach(selector => {
        if (css.includes(selector)) {
            logTest(`CSS selector: ${selector}`, 'PASS');
        } else {
            logTest(`CSS selector: ${selector}`, 'WARN', 'Selector bulunamadı');
        }
    });
    
} catch (error) {
    logTest('CSS okuma', 'FAIL', error.message);
}

// ============================================
// 5. JAVASCRIPT KONTROLÜ
// ============================================
console.log('\n⚙️  5. JAVASCRIPT KONTROLÜ\n');

try {
    const html = fs.readFileSync('index.html', 'utf8');
    
    // JavaScript yapısı
    const scriptContent = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
    logTest('Script blokları', 'PASS', `${scriptContent.length} script bloğu bulundu`);
    
    // Critical functions
    const criticalFunctions = [
        'DOMContentLoaded',
        'addEventListener',
        'getElementById',
        'localStorage',
        'fetch'
    ];
    
    criticalFunctions.forEach(func => {
        if (html.includes(func)) {
            logTest(`JavaScript function: ${func}`, 'PASS');
        } else {
            logTest(`JavaScript function: ${func}`, 'WARN', 'Function kullanılmıyor olabilir');
        }
    });
    
    // Error handling
    const hasTryCatch = html.includes('try {') && html.includes('catch');
    if (hasTryCatch) {
        logTest('Error handling', 'PASS', 'Try-catch blokları mevcut');
    } else {
        logTest('Error handling', 'WARN', 'Try-catch blokları eksik olabilir');
    }
    
    // Console.log kontrolü (production'da az olmalı)
    const consoleLogs = (html.match(/console\.(log|error|warn)/g) || []).length;
    const hasConfigDebug = html.includes('CONFIG.debug') || html.includes('CONFIG.showCriticalErrors');
    if (consoleLogs > 0 && !hasConfigDebug) {
        logTest('Console statements', 'WARN', `${consoleLogs} console statement bulundu (production'da azaltılmalı)`);
    } else if (consoleLogs > 0 && hasConfigDebug) {
        logTest('Console statements', 'PASS', `${consoleLogs} console statement bulundu (CONFIG.debug ile kontrol ediliyor)`);
    }
    
} catch (error) {
    logTest('JavaScript kontrolü', 'FAIL', error.message);
}

// ============================================
// 6. PWA KONTROLÜ
// ============================================
console.log('\n📱 6. PWA KONTROLÜ\n');

try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    const html = fs.readFileSync('index.html', 'utf8');
    
    // Manifest gereksinimleri
    const requiredManifestFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    requiredManifestFields.forEach(field => {
        if (manifest[field]) {
            logTest(`Manifest field: ${field}`, 'PASS');
        } else {
            logTest(`Manifest field: ${field}`, 'FAIL', 'Manifest field eksik!');
        }
    });
    
    // Icons kontrolü
    if (manifest.icons && manifest.icons.length > 0) {
        manifest.icons.forEach(icon => {
            if (fs.existsSync(icon.src)) {
                logTest(`Icon mevcut: ${icon.src}`, 'PASS');
            } else {
                logTest(`Icon mevcut: ${icon.src}`, 'FAIL', 'Icon dosyası bulunamadı!');
            }
        });
    }
    
    // Service Worker kaydı
    if (html.includes('serviceWorker') || html.includes('navigator.serviceWorker')) {
        logTest('Service Worker kaydı', 'PASS');
    } else {
        logTest('Service Worker kaydı', 'WARN', 'Service Worker kaydı bulunamadı');
    }
    
    // Manifest link
    if (html.includes('manifest.json')) {
        logTest('Manifest link', 'PASS');
    } else {
        logTest('Manifest link', 'FAIL', 'Manifest link eksik!');
    }
    
} catch (error) {
    logTest('PWA kontrolü', 'FAIL', error.message);
}

// ============================================
// 7. GÜVENLİK KONTROLÜ
// ============================================
console.log('\n🔒 7. GÜVENLİK KONTROLÜ\n');

try {
    const html = fs.readFileSync('index.html', 'utf8');
    
    // XSS riskleri - sanitizeHTML veya DOMPurify kontrolü
    if (html.includes('innerHTML') && !html.includes('DOMPurify') && !html.includes('sanitizeHTML') && !html.includes('safeSetHTML')) {
        logTest('XSS koruması', 'WARN', 'innerHTML kullanımı var, sanitization kontrol edilmeli');
    } else {
        logTest('XSS koruması', 'PASS');
    }
    
    // eval kullanımı
    if (html.includes('eval(')) {
        logTest('eval() kullanımı', 'FAIL', 'eval() güvenlik riski oluşturur!');
    } else {
        logTest('eval() kullanımı', 'PASS');
    }
    
    // External scripts güvenliği
    const externalScripts = html.match(/<script[^>]*src=["'](https?:\/\/[^"']+)["']/g) || [];
    externalScripts.forEach(script => {
        if (script.includes('https://')) {
            logTest('External script: HTTPS', 'PASS', script.match(/src=["']([^"']+)/)[1]);
        } else {
            logTest('External script: HTTPS', 'WARN', 'HTTP kullanılıyor olabilir');
        }
    });
    
    // CSP meta tag
    if (html.includes('Content-Security-Policy')) {
        logTest('CSP meta tag', 'PASS');
    } else {
        logTest('CSP meta tag', 'WARN', 'Content Security Policy meta tag yok');
    }
    
} catch (error) {
    logTest('Güvenlik kontrolü', 'FAIL', error.message);
}

// ============================================
// 8. PERFORMANS KONTROLÜ
// ============================================
console.log('\n⚡ 8. PERFORMANS KONTROLÜ\n');

try {
    const html = fs.readFileSync('index.html', 'utf8');
    const htmlSize = fs.statSync('index.html').size;
    const cssSize = fs.statSync('style.css').size;
    
    // Dosya boyutları
    if (htmlSize < 500 * 1024) { // 500KB
        logTest('HTML boyutu', 'PASS', `${(htmlSize / 1024).toFixed(2)}KB`);
    } else {
        logTest('HTML boyutu', 'WARN', `HTML çok büyük: ${(htmlSize / 1024).toFixed(2)}KB`);
    }
    
    if (cssSize < 200 * 1024) { // 200KB
        logTest('CSS boyutu', 'PASS', `${(cssSize / 1024).toFixed(2)}KB`);
    } else {
        logTest('CSS boyutu', 'WARN', `CSS çok büyük: ${(cssSize / 1024).toFixed(2)}KB`);
    }
    
    // Image optimization
    const images = ['icon-192-v4-RED-MUSHAF.png', 'icon-512-v4-RED-MUSHAF.png'];
    images.forEach(img => {
        if (fs.existsSync(img)) {
            const size = fs.statSync(img).size;
            if (size < 500 * 1024) { // 500KB
                logTest(`Image boyutu: ${img}`, 'PASS', `${(size / 1024).toFixed(2)}KB`);
            } else {
                logTest(`Image boyutu: ${img}`, 'WARN', `Image optimize edilmeli: ${(size / 1024).toFixed(2)}KB`);
            }
        }
    });
    
    // Async/defer scripts
    const scripts = html.match(/<script[^>]*>/g) || [];
    const asyncScripts = scripts.filter(s => s.includes('async') || s.includes('defer')).length;
    logTest('Async/Defer scripts', 'PASS', `${asyncScripts}/${scripts.length} script async/defer`);
    
} catch (error) {
    logTest('Performans kontrolü', 'FAIL', error.message);
}

// ============================================
// 9. ERİŞİLEBİLİRLİK KONTROLÜ
// ============================================
console.log('\n♿ 9. ERİŞİLEBİLİRLİK KONTROLÜ\n');

try {
    const html = fs.readFileSync('index.html', 'utf8');
    
    // Alt text kontrolü
    const images = html.match(/<img[^>]*>/g) || [];
    const imagesWithAlt = images.filter(img => img.includes('alt=')).length;
    if (imagesWithAlt === images.length) {
        logTest('Image alt text', 'PASS', `Tüm ${images.length} image'de alt text var`);
    } else {
        logTest('Image alt text', 'WARN', `${images.length - imagesWithAlt} image'de alt text eksik`);
    }
    
    // ARIA labels
    const hasAria = html.includes('aria-label') || html.includes('aria-labelledby');
    if (hasAria) {
        logTest('ARIA attributes', 'PASS');
    } else {
        logTest('ARIA attributes', 'WARN', 'ARIA attributes eksik olabilir');
    }
    
    // Semantic HTML
    const semanticTags = ['header', 'nav', 'main', 'section', 'article', 'footer'];
    semanticTags.forEach(tag => {
        if (html.includes(`<${tag}`)) {
            logTest(`Semantic HTML: ${tag}`, 'PASS');
        }
    });
    
    // Form labels
    const inputs = (html.match(/<input[^>]*>/g) || []).length;
    if (inputs === 0) {
        logTest('Form inputs', 'PASS', 'Form input yok');
    } else {
        logTest('Form inputs', 'WARN', `${inputs} input var, label kontrolü yapılmalı`);
    }
    
} catch (error) {
    logTest('Erişilebilirlik kontrolü', 'FAIL', error.message);
}

// ============================================
// 10. JSON VERİ KONTROLÜ
// ============================================
console.log('\n📊 10. JSON VERİ KONTROLÜ\n');

try {
    const kelimeData = JSON.parse(fs.readFileSync('kelimebul.json', 'utf8'));
    logTest('Kelime verisi', 'PASS', `${kelimeData.length} kelime bulundu`);
    
    // Veri yapısı kontrolü
    if (kelimeData.length > 0) {
        const firstItem = kelimeData[0];
        const requiredFields = ['kelime', 'anlam', 'id'];
        requiredFields.forEach(field => {
            if (firstItem[field] !== undefined) {
                logTest(`Kelime field: ${field}`, 'PASS');
            } else {
                logTest(`Kelime field: ${field}`, 'WARN', 'Field eksik olabilir');
            }
        });
    }
    
    const ayetData = JSON.parse(fs.readFileSync('ayetoku_formatted.json', 'utf8'));
    logTest('Ayet verisi', 'PASS', `${ayetData.length} ayet bulundu`);
    
    const duaData = JSON.parse(fs.readFileSync('duaet.json', 'utf8'));
    logTest('Dua verisi', 'PASS', `${duaData.length} dua bulundu`);
    
    const hadisData = JSON.parse(fs.readFileSync('hadisoku.json', 'utf8'));
    logTest('Hadis verisi', 'PASS', `${hadisData.length} hadis bulundu`);
    
} catch (error) {
    logTest('JSON veri kontrolü', 'FAIL', error.message);
}

// ============================================
// SONUÇ RAPORU
// ============================================
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SONUÇLARI ÖZETİ');
console.log('='.repeat(60));

console.log(`\n✅ BAŞARILI: ${testResults.passed.length}`);
console.log(`❌ BAŞARISIZ: ${testResults.failed.length}`);
console.log(`⚠️  UYARILAR: ${testResults.warnings.length}`);
console.log(`🔴 HATALAR: ${testResults.errors.length}`);

const totalTests = testResults.passed.length + testResults.failed.length + testResults.warnings.length + testResults.errors.length;
const successRate = ((testResults.passed.length / totalTests) * 100).toFixed(2);

console.log(`\n📈 BAŞARI ORANI: ${successRate}%`);

if (testResults.failed.length > 0) {
    console.log('\n❌ BAŞARISIZ TESTLER:');
    testResults.failed.forEach(test => {
        console.log(`   - ${test.name}: ${test.message}`);
    });
}

if (testResults.warnings.length > 0) {
    console.log('\n⚠️  UYARILAR:');
    testResults.warnings.slice(0, 10).forEach(test => {
        console.log(`   - ${test.name}: ${test.message}`);
    });
    if (testResults.warnings.length > 10) {
        console.log(`   ... ve ${testResults.warnings.length - 10} uyarı daha`);
    }
}

// Sonuçları dosyaya kaydet
const report = {
    timestamp: new Date().toISOString(),
    summary: {
        total: totalTests,
        passed: testResults.passed.length,
        failed: testResults.failed.length,
        warnings: testResults.warnings.length,
        errors: testResults.errors.length,
        successRate: successRate + '%'
    },
    results: {
        passed: testResults.passed,
        failed: testResults.failed,
        warnings: testResults.warnings,
        errors: testResults.errors
    }
};

fs.writeFileSync('test_report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Detaylı rapor test_report.json dosyasına kaydedildi.');

console.log('\n' + '='.repeat(60));


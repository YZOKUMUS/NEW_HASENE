const http = require('http');
const fs = require('fs');
const path = require('path');

// Port ayarı
const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.otf': 'application/font-otf',
    '.webp': 'image/webp'
};

// HTTP Server
const server = http.createServer((req, res) => {

    // Güvenli path ve root ayarı
    let safePath = req.url === '/' ? '/index.html' : req.url;
    let filePath = path.join(__dirname, safePath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>500 - Internal Server Error</h1><p>${error.code}</p>`);
            }
        } else {
            // Binary dosyalar için UTF-8 kullanma
            if (['.html', '.js', '.css', '.json', '.txt'].includes(extname)) {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
    console.log(`🎮 Main Game: http://localhost:${PORT}/index.html`);
    console.log('🔧 Ctrl+C ile durdurabilirsiniz');
});

// =============================================
// 🚀 HASENE ARABIC GAME — ULTRA SAFE SERVER v5
// =============================================

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

// Modern & güvenli MIME tipleri
const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",

    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",

    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".mp4": "video/mp4",

    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",

    ".txt": "text/plain; charset=utf-8"
};

// Güvenli normalizasyon (../ saldırısını engeller)
function safePath(url) {
    let safe = url.split("?")[0].split("#")[0];
    safe = safe === "/" ? "/index.html" : safe;
    safe = path.normalize(safe);

    if (safe.includes("..")) return "/index.html";

    return safe;
}

const server = http.createServer((req, res) => {
    try {
        const requestedPath = safePath(req.url);
        const filePath = path.join(__dirname, requestedPath);
        const ext = path.extname(filePath).toLowerCase();

        const mime = MIME[ext] || "application/octet-stream";

        // JSON isteklerine otomatik CORS
        if (ext === ".json") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Cache-Control", "no-store");
        }

        // Font & medya için uzun cache
        if ([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".mp3", ".wav", ".mp4", ".woff", ".woff2", ".ttf", ".otf"].includes(ext)) {
            res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 yıl
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === "ENOENT") {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    return res.end("<h1>404 - Dosya bulunamadı</h1>");
                }

                res.writeHead(500, { "Content-Type": "text/html" });
                return res.end(`<h1>500 - Sunucu hatası</h1><p>${err.code}</p>`);
            }

            // TEXT dosyaları UTF-8, binary olanlar RAW gider
            const isText = [".html", ".css", ".js", ".json", ".txt"].includes(ext);

            res.writeHead(200, { "Content-Type": mime });
            return res.end(data, isText ? "utf-8" : undefined);
        });

    } catch (e) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 - Fatal Server Error</h1>");
        console.error("🚨 Server Error:", e);
    }
});

// SERVER START
server.listen(PORT, () => {
    console.log(`\n🚀 HASENE PRO Server Açıldı`);
    console.log(`🌐 http://localhost:${PORT}/`);
    console.log(`📌 CTRL + C ile kapatabilirsiniz`);
});

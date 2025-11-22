// Vite Configuration - Mevcut yapıyı bozmadan development server
import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    server: {
        port: 3000,
        open: true,
        cors: true,
    },
    build: {
        outDir: "dist",
        assetsDir: "assets",
        // GitHub Pages için base path (repository adı: NEW_HASENE)
        // Development'ta "./" kullanılır, production'da "/NEW_HASENE/" kullanılır
        base: process.env.NODE_ENV === 'production' ? '/NEW_HASENE/' : './',
        // Mevcut yapıyı koru - sadece optimize et
        rollupOptions: {
            input: {
                main: "./index.html",
            },
        },
        // Source maps for debugging
        sourcemap: true,
    },
    // Public directory
    publicDir: "public",
});


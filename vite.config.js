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
        // Capacitor için public path ayarı
        base: "./",
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


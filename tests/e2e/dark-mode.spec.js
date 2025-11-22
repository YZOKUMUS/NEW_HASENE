// E2E Tests for Dark Mode
import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
    test('should toggle dark mode on desktop', async ({ page }) => {
        await page.goto('/');
        
        const body = page.locator('body');
        const darkModeBtn = page.locator('#darkModeToggle');
        
        // Başlangıçta dark mode kapalı olmalı
        await expect(body).not.toHaveClass(/dark-mode/);
        
        // Dark mode'u aç
        await darkModeBtn.click();
        await expect(body).toHaveClass(/dark-mode/);
        
        // Icon değişmeli
        const icon = page.locator('#darkModeIcon');
        await expect(icon).toHaveText('☀️');
        
        // Dark mode'u kapat
        await darkModeBtn.click();
        await expect(body).not.toHaveClass(/dark-mode/);
        await expect(icon).toHaveText('🌙');
    });

    test('should persist dark mode preference in localStorage', async ({ page }) => {
        await page.goto('/');
        
        const darkModeBtn = page.locator('#darkModeToggle');
        
        // Dark mode'u aç
        await darkModeBtn.click();
        
        // localStorage'ı kontrol et
        const darkMode = await page.evaluate(() => localStorage.getItem('darkMode'));
        expect(darkMode).toBe('enabled');
        
        // Sayfayı yenile
        await page.reload();
        
        // Dark mode hala aktif olmalı
        await expect(page.locator('body')).toHaveClass(/dark-mode/);
    });

    test('should work on mobile viewport', async ({ page }) => {
        // Mobil viewport ayarla
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        
        const darkModeBtn = page.locator('#darkModeToggle');
        const body = page.locator('body');
        
        // Buton görünür olmalı
        await expect(darkModeBtn).toBeVisible();
        
        // Dark mode toggle çalışmalı
        await darkModeBtn.click();
        await expect(body).toHaveClass(/dark-mode/);
        
        // Buton boyutu mobilde uygun olmalı
        const box = await darkModeBtn.boundingBox();
        expect(box.width).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(40);
    });

    test('should apply dark mode styles correctly', async ({ page }) => {
        await page.goto('/');
        
        const darkModeBtn = page.locator('#darkModeToggle');
        await darkModeBtn.click();
        
        // Hero section dark mode stilini almalı
        const heroSection = page.locator('.hero-section-minimal');
        const backgroundColor = await heroSection.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });
        
        // Dark mode'da arka plan koyu olmalı
        expect(backgroundColor).not.toContain('255, 255, 255');
    });
});


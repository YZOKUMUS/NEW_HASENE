// E2E Tests for Game Flow
import { test, expect } from '@playwright/test';

test.describe('Game Flow', () => {
    test('should navigate to kelime cevir game', async ({ page }) => {
        await page.goto('/');
        
        // Ana menü görünür olmalı
        await expect(page.locator('#mainMenu')).toBeVisible();
        
        // Oyun kartını tıkla
        await page.click('#kelimeCevirBtn');
        
        // Oyun ekranına geçiş yapılmalı (modal veya game screen)
        // Not: Gerçek oyun akışına göre güncellenebilir
        await page.waitForTimeout(500);
    });

    test('should display all game cards', async ({ page }) => {
        await page.goto('/');
        
        const gameCards = [
            '#kelimeCevirBtn',
            '#dinleBulBtn',
            '#boslukDoldurBtn',
            '#duaEtBtn',
            '#ayetOkuBtn',
            '#hadisOkuBtn'
        ];
        
        for (const card of gameCards) {
            await expect(page.locator(card)).toBeVisible();
        }
    });

    test('should show difficulty selector', async ({ page }) => {
        await page.goto('/');
        
        const difficultyButtons = [
            '#mainDiffKolay',
            '#mainDiffOrta',
            '#mainDiffZor'
        ];
        
        for (const btn of difficultyButtons) {
            await expect(page.locator(btn)).toBeVisible();
        }
    });
});


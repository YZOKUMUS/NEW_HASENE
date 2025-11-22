// E2E Tests for Main Menu
import { test, expect } from '@playwright/test';

test.describe('Main Menu', () => {
    test('should display main menu on load', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#mainMenu')).toBeVisible();
    });

    test('should show game cards', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#kelimeCevirBtn')).toBeVisible();
        await expect(page.locator('#dinleBulBtn')).toBeVisible();
        await expect(page.locator('#boslukDoldurBtn')).toBeVisible();
    });

    test('should navigate to game when card is clicked', async ({ page }) => {
        await page.goto('/');
        await page.click('#kelimeCevirBtn');
        // Add assertions based on your game screen structure
    });
});


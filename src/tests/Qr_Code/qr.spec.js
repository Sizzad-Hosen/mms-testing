import { test, expect } from '@playwright/test';


test('QR code should be visible', async ({ page }) => {

    await page.goto("https://app-mms.baumnest.com/MQZUKKX7TLD/qr-code");

    const qrImg = await page.locator('canvas, svg, img').first();
    await expect(qrImg).toBeVisible();
    
    // const src = await qrImg.getAttribute('src');
    // expect(src).toBeTruthy();

});

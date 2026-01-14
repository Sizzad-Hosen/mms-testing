import { test, expect } from '@playwright/test';
test.use({ storageState: 'storageState.json' });
test.describe('QR Code Feature Tests', () => {

// img visibility check
  test('QR Code image should be visible', async ({ page }) => {
    await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/qr-code');
    const qrImage = page.getByRole('img', { name: 'QR Code' });
    await expect(qrImage).toBeVisible({ timeout: 15000 });

  });

  // ✅ Test Case 02: QR Code expiry text visibility
  test('QR Code expiry date should be displayed', async ({ page }) => {
    await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/qr-code');
    const expiryText = page.getByText(/expiry date:/i);
    await expect(expiryText).toBeVisible({ timeout: 15000 });
  });

});

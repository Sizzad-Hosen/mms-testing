import { test, expect } from '@playwright/test';

test.describe('QR Code Feature Tests',async () => {
  // img visible check
  test('QR Code img is visible', async ({ page }) => {
   const qrImage = page.getByRole('img', { name: 'QR Code' });
      await expect(qrImage).toBeVisible({ timeout: 15000 });
  });
//  Expire text check
  test('QR Code expiry is displayed correctly', async ({ page }) => {
      const expiryText = page.getByText(/Expiry date:/);
      await expect(expiryText).toBeVisible({timeout : 15000});
  });

})
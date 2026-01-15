import { test, expect } from '@playwright/test';
// authentication session
test.use({
  storageState: 'storageState.json',
});

test.describe('QR Code  Authenticated User Flow', () => {

  test.beforeEach(async ({ page }) => {
    // navigate this url before test
    await page.goto('/MQZUKKX7TLD/qr-code');
  });

  test('should display QR code image', async ({ page }) => {
    const qrImage = page.getByRole('img', { name: /qr code/i });

    await expect(qrImage).toBeVisible();
  });

  test('should display QR code expiry date', async ({ page }) => {
    const expiryLabel = page.getByText(/expiry date:/i);

    await expect(expiryLabel).toBeVisible();
  });

  test('should allow user to download QR code as PDF', async ({ page }) => {
    const downloadButton = page.getByRole('button', {
      name: /download pdf/i,
    });

    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toBeEnabled();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadButton.click(),
    ]);

    // Validate filename
    const fileName = download.suggestedFilename();
    expect(fileName).toMatch(/\.pdf$/i);

    // Validate file existence 
    const filePath = await download.path();
    expect(filePath).not.toBeNull();
  });

});

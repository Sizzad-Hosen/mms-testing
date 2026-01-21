import { test, expect } from '@playwright/test';
import fs from 'fs';

// 🔐 authenticated session
test.use({
  storageState: 'storageState.json',
});

test.describe('QR Code Authenticated User Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/MQZUKKX7TLD/qr-code');
  });

  // Test case 01: QR Code image visible
  test('should display QR code image', async ({ page }) => {
    const qrImage = page.getByRole('img', { name: /qr code/i });

    await expect(qrImage).toBeVisible({ timeout: 15000 });
    const src = await qrImage.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).toMatch(/base64|qr|image/i);
  });

 
  // Test case 02: QR Code generated successfully
  test('should generate QR code successfully', async ({ page }) => {
    const qrImage = page.getByRole('img', { name: /qr code/i });

    await expect(qrImage).toHaveAttribute('src', /.+/, {
      timeout: 15000,
    });
  });

  // Test case 03: QR Code expiry date visible
  test('should display QR code expiry date', async ({ page }) => {
    const expiryLabel = page.getByText(/expiry date:/i);
    await expect(expiryLabel).toBeVisible();
  });

  // Test case 04: Download QR Code PDF (valid file)
  test('should allow user to download QR code as PDF', async ({ page }) => {
    const downloadButton = page.getByRole('button', {
      name: /download pdf/i,
    });

    await expect(downloadButton).toBeEnabled();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadButton.click(),
    ]);

    const filePath = await download.path();
    expect(filePath).not.toBeNull();

    const fileName = download.suggestedFilename();
    expect(fileName).toMatch(/\.pdf$/i);

    // prevent corrupted / empty file
    const fileSize = fs.statSync(filePath).size;
    expect(fileSize).toBeGreaterThan(1000);
  });

  // when expired generated qr code button visible and enable 
test('generate QR Code visible and button enable', async ({ page }) => {
  const generateQRCodeBtn = page.getByRole('button', { name: /generate qr code/i });

  await expect(generateQRCodeBtn).toBeVisible({ timeout: 15000 });
  await expect(generateQRCodeBtn).toBeEnabled({ timeout: 15000 });
  await generateQRCodeBtn.click();
});


});

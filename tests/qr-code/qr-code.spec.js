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

  // Test case 02: QR Code expiry date visible
test('should show QR expired message if past expiry date', async ({ page }) => {
  const expiryText = await page.getByText(/expiry date:/i).textContent();

  const dateString = expiryText
    .replace(/expiry date:/i, '')
    .trim();

  const expiryDate = new Date(dateString);
  const now = new Date();

  if (now >= expiryDate) {
    await expect(page.getByText(/qr code expired/i)).toBeVisible();
  }
else {
  await expect(
    page.getByRole('img', { name: /qr code/i })
  ).toBeVisible();
}
});


  // Test case 03: Download QR Code PDF (valid file)
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

test('should allow generating new QR code when previous QR is expired', async ({ page }) => {

  //  Read expiry date text
  const expiryText = await page.getByText(/expiry date:/i).textContent();

  const dateString = expiryText
    .replace(/expiry date:/i, '')
    .trim();

  const expiryDate = new Date(dateString);
  const now = new Date();

  const qrImage = page.getByRole('img', { name: /qr code/i });

  // Ensure QR image exists first
  await expect(qrImage).toBeVisible();

  const oldSrc = await qrImage.getAttribute('src');

  //  If QR is expired
  if (now >= expiryDate) {

    const generateQRCodeBtn = page.getByRole('button', {
      name: /generate qr code/i,
    });

    await expect(generateQRCodeBtn).toBeVisible();
    await expect(generateQRCodeBtn).toBeEnabled();

    await generateQRCodeBtn.click();

    //  Wait until src actually changes
    await expect(qrImage).not.toHaveAttribute('src', oldSrc);

    const newSrc = await qrImage.getAttribute('src');

    //  Final assertion
    expect(newSrc).not.toBe(oldSrc);

  } else {
    //  If QR is still valid, button must NOT exist
    await expect(
      page.getByRole('button', { name: /generate qr code/i })
    ).toHaveCount(0);
  }
});



});

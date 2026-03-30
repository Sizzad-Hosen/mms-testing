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

  const qrImage = page.getByRole('img', { name: /qr code/i });
  const generateBtn = page.getByRole('button', { name: /generate qr code/i });
  const expiryTextLocator = page.getByText(/expiry date:/i);

  await Promise.race([
    qrImage.waitFor({ state: 'visible' }),
    generateBtn.waitFor({ state: 'visible' })
  ]);

  let isExpired = false;

  if (await expiryTextLocator.count() > 0) {
    const expiryText = await expiryTextLocator.textContent();

    if (expiryText) {
      const dateString = expiryText.replace(/expiry date:/i, '').trim();
      const expiryDate = new Date(dateString);
      const now = new Date();

      isExpired = now >= expiryDate;
    }
  } else {

    isExpired = true;
  }
  // ✅ CASE 1: QR is NOT expired

  if (!isExpired) {
    await expect(qrImage).toBeVisible();
    await expect(generateBtn).toHaveCount(0);

    console.log('QR still valid, no regeneration allowed');
    return;
  }

  // ✅ CASE 2: QR is expired
  console.log('QR expired → generating new one');

  await expect(generateBtn).toBeVisible();
  await expect(generateBtn).toBeEnabled();

  await generateBtn.click();
  await expect(qrImage).toBeVisible();

  const newSrc = await qrImage.getAttribute('src');
  expect(newSrc).toBeTruthy();

  console.log('New QR src:', newSrc);
});

});

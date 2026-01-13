import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPages';

test.describe('QR Code Feature Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(
      process.env.LOGIN_EMAIL || 'sizzadhosen@gmail.com',
      process.env.LOGIN_PASSWORD || '2003Sizzad'
    );
    // Verify 2FA page
    await expect(page).toHaveURL(/2fa/, { timeout: 20000 });
  });

  // ✅ Test Case 01: QR Code image visibility
  test('QR Code image should be visible', async ({ page }) => {
    await page.goto('/qr-code');

    const qrImage = page.getByRole('img', { name: 'QR Code' });
    await expect(qrImage).toBeVisible({ timeout: 15000 });

  });

  // ✅ Test Case 02: QR Code expiry text visibility
  test('QR Code expiry date should be displayed', async ({ page }) => {
    await page.goto('/qr-code');

    const expiryText = page.getByText(/expiry date:/i);
    await expect(expiryText).toBeVisible({ timeout: 15000 });
  });

});

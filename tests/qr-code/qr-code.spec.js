import { test, expect } from '@playwright/test';
 import { LoginPage } from '../../pages/LoginPages';
import { getOtpForUser } from '../../helpers/getOpt';

test.describe('QR Code Feature Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Initialize login page
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('sizzadhosen@gmail.com', '2003Sizzad');
    
    // Assert redirect to 2FA page
    await expect(page).toHaveURL(/2fa/, { timeout: 20000 });

    const otp = await getOtpForUser('sizzadhosen@gmail.com');
        await page.fill('#otp', otp);
        await page.click('text=Verify');

    await page.pause();
  });

  test('QR Code image is visible', async ({ page }) => {
    await test.step('Check QR Code image presence', async () => {
      const qrImage = page.getByRole('img', { name: 'QR Code' });
      await expect(qrImage).toBeVisible({ timeout: 5000 });
    });
  });

  test('QR Code expiry is displayed correctly', async ({ page }) => {
    await test.step('Check QR expiry text', async () => {
      const expiryText = page.getByText(/Expiry date:/);
      await expect(expiryText).toBeVisible();
      await expect(expiryText).toHaveText(/Expiry date:\d{1,2}:\d{2} [AP]M, \d{1,2} [A-Za-z]{3}/); 
      // Regex ensures proper format like "Expiry date:11:59 PM, 8 Jan"
    });
  });

//   test('Download QR Code PDF works', async ({ page }) => {
//     await test.step('Click Download PDF button', async () => {
//       const downloadPromise = page.waitForEvent('download');
//       await page.getByRole('button', { name: 'Download PDF' }).click();

//       const download = await downloadPromise;
//       // Assert filename and path
//       expect(download.suggestedFilename()).toContain('QR');
//       // Save download to temp folder (optional)
//       const path = await download.path();
//       expect(path).not.toBeNull();
//     });
//   });

//   test('Full QR Code flow validation', async ({ page }) => {
//     await test.step('Verify QR Code image, expiry, and download', async () => {
//       const qrImage = page.getByRole('img', { name: 'QR Code' });
//       const expiryText = page.getByText(/Expiry date:/);
//       const downloadBtn = page.getByRole('button', { name: 'Download PDF' });

//       await expect(qrImage).toBeVisible();
//       await expect(expiryText).toBeVisible();
//       await expect(downloadBtn).toBeEnabled();

//       const downloadPromise = page.waitForEvent('download');
//       await downloadBtn.click();
//       const download = await downloadPromise;
//       expect(download.suggestedFilename()).toContain('QR');
//     });
//   });

});

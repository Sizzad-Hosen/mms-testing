// import { test, expect } from '@playwright/test';
// import { login } from '../helpers/login';

// test('QR Code should be generated and visible', async ({ page }) => {

//   login(page,"sizzadhosen@gmail.com", "2003Sizzad");

//   await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/qr-code');

//   // // QR section visible
//   // await expect(page.getByText('QR Code')).toBeVisible();

//   // // Expiry text visible
//   // await expect(page.getByText(/Expiry date/i)).toBeVisible();

//     const qrImg = await page.locator('canvas, svg, img').first();
//     await expect(qrImg).toBeVisible();
    
//   await expect(page.getByRole("button", {
//     name :"Download PDF"
//   })).toBeVisible();

//   await expect(page.getByRole("button", {
//     name :"Download PDF"
//   })).toBeEnabled();



// });

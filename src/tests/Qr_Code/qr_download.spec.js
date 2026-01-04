// import { test, expect } from '@playwright/test';


// test('QR Invitation PDF should download correctly', async ({ page }) => {
//   await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/qr-code');

//   const [download] = await Promise.all([
//     page.waitForEvent('download'),
//     page.getByRole('button', { name: /Download PDF/i }).click()
//   ]);

//   // File name check
//   const fileName = download.suggestedFilename();
//   expect(fileName).toMatch(/Member_Invitation_.*\.pdf/);

//   // Save file
//   const filePath = `downloads/${fileName}`;
//   await download.saveAs(filePath);

//   // File exists & not empty
//   const fs = require('fs');
//   const stats = fs.statSync(filePath);
//   expect(stats.size).toBeGreaterThan(1000); // PDF should not be empty
// });

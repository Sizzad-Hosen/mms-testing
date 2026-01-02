import { test, expect } from '@playwright/test';
import { QRPage } from '../../pages/QRPage';

test('QR code should be visible', async ({ page }) => {
  const qrPage = new QRPage(page);

  await qrPage.open();
  await expect(qrPage.qrImage).toBeVisible();
});

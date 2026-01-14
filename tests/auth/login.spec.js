import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPages';
import 'dotenv/config';

test.describe('Auth Module - Login', () => {
  test('Login succeeds with valid credentials and saves session @smoke', async ({ page, context }) => {
    const email = process.env.LOGIN_EMAIL;
    const password = process.env.LOGIN_PASSWORD;
    const loginPage = new LoginPage(page);

    // 1️⃣ Navigate to login page
    await loginPage.goto();

    // 2️⃣ Login (SPA-safe)
    await loginPage.login(email, password);

    // 3️⃣ Wait for main page (skip OTP for now)
    await expect(page).toHaveURL('https://app-mms.baumnest.com/MQZUKKX7TLD', { timeout: 20000 });

    // 4️⃣ Navigate to QR code page
    await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/qr-code');

    // 7️⃣ Save session for reuse in other tests
    await context.storageState({ path: 'storageState.json' });

    console.log('Login complete and session saved.');
  });
});

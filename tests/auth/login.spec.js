import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPages';
import 'dotenv/config';

const email = process.env.LOGIN_EMAIL;
const password = process.env.LOGIN_PASSWORD;

test.describe('Auth Module - Login', () => {

  test('Login with optional 2FA and save session @smoke', async ({ page, context }) => {
    const loginPage = new LoginPage(page);

    // 🔹 Step 1: Login
    await loginPage.goto();
    await loginPage.login(email, password);

    // 🔹 Step 2: Wait for either dashboard OR 2FA
    await Promise.race([
      page.waitForURL('**/2fa', { timeout: 15000 }),
      page.waitForURL('**/MQZUKKX7TLD', { timeout: 15000 })
    ]);

    // 🔹 Step 3: Check current route
    const currentUrl = page.url();

    if (currentUrl.includes('/2fa')) {
      console.log('2FA required, verifying...');

      // ✅ Fill OTP
      await page.getByRole('textbox').fill('765249');
      await page.getByRole('button', { name: /verify/i }).click();

      // ✅ Wait for dashboard after verification
      await page.waitForURL('**/MQZUKKX7TLD', { timeout: 15000 });
    } else {
      console.log('Already verified, redirected to dashboard');
    }

    // 🔹 Step 4: Final assertion
    await expect(page).toHaveURL(/MQZUKKX7TLD/);

    // 🔹 Step 5: Save session
    await context.storageState({ path: 'storageState.json' });
  });

});
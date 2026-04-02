import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPages';
import 'dotenv/config';

const email = process.env.LOGIN_EMAIL;
const password = process.env.LOGIN_PASSWORD;

test.describe('Auth Module - Login', () => {
  test('Login succeeds with valid credentials and saves session @smoke', async ({ page, context }) => {
    const loginPage = new LoginPage(page);

    // Navigate
    await loginPage.goto();
    await loginPage.login(email, password);

    // Wait for either 2FA OR dashboard
    await Promise.race([
      page.waitForURL('**/2fa'),
      page.waitForURL('**/MQZUKKX7TLD')
    ]);

    const currentUrl = page.url();

    // Handle 2FA only if needed
    if (currentUrl.includes('/2fa')) {
    await page.getByRole('textbox').fill('180056');
    await page.getByRole('button', { name: 'Verify' }).click();
    }

    // Final assertion
    await expect(page).toHaveURL(/MQZUKKX7TLD/);

    // Save session
    await context.storageState({ path: 'storageState.json' });
  });
});
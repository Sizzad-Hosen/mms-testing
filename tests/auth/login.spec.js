import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPages';
import 'dotenv/config';
const email = process.env.LOGIN_EMAIL;
const password = process.env.LOGIN_PASSWORD;

test.describe('Auth Module - Login', () => {
  test('Login succeeds with valid credentials and saves session @smoke', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
  //  Navigate to login page
    await loginPage.goto();
    await loginPage.login(email, password);

// wait for either 2FA page OR dashboard
await Promise.race([
  page.waitForURL('**/2fa'),
  page.waitForURL('**/MQZUKKX7TLD')
]);

// check if we are on 2FA page
if (page.url().includes('/2fa')) {
  await page.getByRole('spinbutton', { name: 'Code*' }).fill('826532');
  await page.getByRole('button', { name: 'Verify' }).click();
}

// final assertion
await expect(page).toHaveURL('https://app-mms.baumnest.com/MQZUKKX7TLD');

    //  Save session for reuse in other tests
    await context.storageState({ path: 'storageState.json' });
    // console.log('Login complete and session saved.');


  });
});

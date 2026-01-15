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

  // code verification
    // await page.waitForURL('/2fa');
    // await page.getByRole('spinbutton', { name: 'Code*' }).fill(''); 
    // await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page).toHaveURL('https://app-mms.baumnest.com/MQZUKKX7TLD', { timeout: 20000 })

    //  Save session for reuse in other tests
    await context.storageState({ path: 'storageState.json' });
    // console.log('Login complete and session saved.');
  });
});

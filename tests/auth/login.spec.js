
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPages';
import 'dotenv/config';
test.describe('Auth Module - Login', () => {

  //  Valid login
test('Login succeeds with valid credentials @smoke', async ({ page, request }) => {
  const email = process.env.LOGIN_EMAIL
  const password =process.env.LOGIN_PASSWORD
  const loginPage = new LoginPage(page);

  await test.step('Navigate to Login page', async () => {
    await loginPage.goto();
  });

  await test.step('Login with valid credentials', async () => {
    await loginPage.login(email, password);
  });

  await test.step('Expect redirect to 2FA page', async () => {
    await expect(page).toHaveURL(/2fa/, { timeout: 20000 });
  });

  // ✅ Wait for QR code page
  await page.waitForURL('/qr-code', { timeout: 20000 });

});


  // //  Invalid login
  // test('Login fails with invalid credentials @regression', async ({ page, context }) => {
  //   const loginPage = new LoginPage(page);

  //   await test.step('Navigate to Login page', async () => {
  //     await loginPage.goto();
  //   });

  //   await test.step('Login with invalid credentials', async () => {
  //     await loginPage.login('fake@email.com', 'wrongpass');
  //   });

  //   await test.step('Expect error message', async () => {
  //     await loginPage.expectError();
  //   });
  // });

});

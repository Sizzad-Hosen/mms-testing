
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPages';


test.describe('Auth Module - Login', () => {

  // Hook: before each test
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('about:blank');
  });

  // Hook: after each test (optional)
  test.afterEach(async ({ context }) => {
    await context.clearCookies();
  });

  //  Valid login
  test('Login succeeds with valid credentials @smoke', async ({ page, context }) => {
    const loginPage = new LoginPage(page);

    await test.step('Navigate to Login page', async () => {
      await loginPage.goto();
    });

    await test.step('Login with valid credentials', async () => {
      await loginPage.login('sizzadhosen@gmail.com', '2003Sizzad');
    });

    await test.step('Expect redirect to 2FA page', async () => {
      await expect(page).toHaveURL(/2fa/, { timeout: 20000 });
    });
  });

  //  Invalid login
  test('Login fails with invalid credentials @regression', async ({ page, context }) => {
    const loginPage = new LoginPage(page);

    await test.step('Navigate to Login page', async () => {
      await loginPage.goto();
    });

    await test.step('Login with invalid credentials', async () => {
      await loginPage.login('fake@email.com', 'wrongpass');
    });

    await test.step('Expect error message', async () => {
      await loginPage.expectError();
    });
  });

});

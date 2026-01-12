
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
test('Login succeeds with valid credentials @smoke', async ({ page, request }) => {
  const email = 'sizzadhosen@gmail.com';
  const password = '2003Sizzad';
  const loginPage = new LoginPage(page);

  await test.step('Navigate to Login page', async () => {
    await loginPage.goto();
  });

  await test.step('Login with valid credentials', async () => {
    await loginPage.login(email, password);
  });

  // await test.step('Expect redirect to 2FA page', async () => {
  //   await expect(page).toHaveURL(/2fa/, { timeout: 20000 });
  // });

  // ✅ Get OTP dynamically from backend
  const otpResponse = await request.post('https://app-mms.baumnest.com/2fa/send-code', { data: { email } });
  const otp = (await otpResponse.json()).code;
  console.log("OTP:", otp);

  // ✅ Fill OTP in frontend input and submit
  await page.fill('#otp', otp);           // replace '#otp' with actual selector
  await page.click('#verify-btn');        // replace '#verify-btn' with actual button selector

  // ✅ Wait for QR code page
  await page.waitForURL('/qr-code', { timeout: 20000 });
  // await expect(page.locator('img[alt="QR Code"]')).toBeVisible();
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

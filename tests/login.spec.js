import { test, expect } from '@playwright/test';

test.use({
  storageState: undefined, 
});

test('Login succeeds with valid credentials', async ({ page, context }) => {

  await context.clearCookies();
  await page.goto('about:blank');

  await page.goto(
    'https://app-mms.baumnest.com/MQZUKKX7TLD/login',
    { waitUntil: 'load' }
  );

  const email = page.getByPlaceholder(/email/i);
  const password = page.getByPlaceholder(/password/i);

  await expect(email).toBeVisible({ timeout: 15000 });
  await expect(password).toBeVisible();

  await email.fill('sizzadhosen@gmail.com');
  await password.fill('2003Sizzad');

  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/2fa/, { timeout: 20000 });
});



test('Login fails with invalid credentials', async ({ page, context }) => {

  // fresh start
  await context.clearCookies();
  await page.goto('about:blank');

  // navigate with networkidle (SPA friendly)
  await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/login', { waitUntil: 'networkidle' });

  // reliable selectors
  const email = page.locator('input[name="email"]');
  const password = page.locator('input[name="password"]');
  const loginButton = page.getByRole('button', { name: /login/i });

  // wait for visibility
  await expect(email).toBeVisible({ timeout: 15000 });
  await expect(password).toBeVisible({ timeout: 15000 });

  // invalid credentials
  await email.fill('fake@email.com');
  await password.fill('wrongpass');
  await loginButton.click();

  // assert error message
  const errorMessage = page.getByText('These credentials do not match our records');
  await expect(errorMessage).toBeVisible({ timeout: 20000 });

  // optional: page remains on login
  await expect(page).toHaveURL(/login/);
});
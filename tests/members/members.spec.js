import { test, expect } from '@playwright/test';

test.describe('Member Management', () => {

  test('Admin can login and view member details', async ({ page }) => {

    // 🔹 Step 1: Navigate to login page
    await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/login');

    // 🔹 Step 2: Login
    await page.getByRole('textbox', { name: 'Email*' })
      .fill(process.env.LOGIN_EMAIL || 'sizzadhosen@gmail.com');

    await page.getByRole('textbox', { name: 'Password*' })
      .fill(process.env.LOGIN_PASSWORD || '2003Sizzad');

    await page.getByRole('button', { name: 'Login' }).click();

    // 🔹 Step 3: Verify dashboard loaded
    await expect(page).toHaveURL(/members/i);
    await expect(page.getByText('Members')).toBeVisible();

    // 🔹 Step 4: Verify table headers
    const headers = ['Name', 'Furigana', 'Room', 'Role', 'Email', 'Phone', 'Actions'];
    for (const header of headers) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }

    // 🔹 Step 5: Open member action menu
    const memberRow = page.getByRole('row', {
      name: /Md\. Sizzad Hosen/i
    });
    // 🔹 Step 6: Switch tabs
    await page.getByRole('tab', { name: /Registered/i }).click();
    await expect(page.getByText('Registered (5)')).toBeVisible();
  });

});

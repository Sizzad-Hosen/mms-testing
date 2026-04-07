import { test, expect } from '@playwright/test';

test.use({
  storageState: 'storageState.json',
});

test.describe('Issues Feature Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/issues');
    await page.waitForLoadState('networkidle');
  });

  test('sort by issues', async ({ page }) => {

    await page.getByRole('combobox').filter({ hasText: 'All issues' }).click();
    await page.getByText('Active issues').click();
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { name: /President Only/i });
    await heading.click();
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('cell', { name: 'In Progress' }).first()
    ).toBeVisible({ timeout: 8000 });

    await expect(
      page.getByRole('cell', { name: 'In Progress' }).nth(1)
    ).toBeVisible({ timeout: 8000 });

    await expect(
      page.getByRole('cell', { name: 'Draft' })
    ).toHaveCount(0);

  });

});
import { test, expect } from '@playwright/test';
// 🔐 authenticated session
test.use({
  storageState: 'storageState.json',
});

test.describe('Members Page - Status Tabs', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://app-mms.baumnest.com/MQZUKKX7TLD/members?status=members'
    );
  });

  test('Registered tab should update URL correctly', async ({ page }) => {
    await page.getByRole('tab', { name: /registered/i }).click();

    await expect(page).toHaveURL(/status=members/);
    await expect(
      page.getByRole('tab', { name: /registered/i })
    ).toHaveAttribute('aria-selected', 'true');

    await expect(
      page.getByRole('table')
    ).toBeVisible();
  });

  test('Pending tab should update URL correctly', async ({ page }) => {
    await page.getByRole('tab', { name: /pending/i }).click();

    await expect(page).toHaveURL(/status=pending/);
    await expect(
      page.getByRole('tab', { name: /pending/i })
    ).toHaveAttribute('aria-selected', 'true');

    await expect(
      page.getByText(/no pending|pending requests/i)
        .first()
    ).toBeVisible();
  });

  test('Rejected tab should update URL correctly', async ({ page }) => {
    await page.getByRole('tab', { name: /rejected/i }).click();

    await expect(page).toHaveURL(/status=rejected/);
    await expect(
      page.getByRole('tab', { name: /rejected/i })
    ).toHaveAttribute('aria-selected', 'true');
  });
//   Deleted Registered members button visible and enable
 
  test('should show Delete Member action and it should be enabled', async ({ page }) => {
    const firstRow = page.getByRole('row').nth(1);

    await firstRow.getByLabel(/open menu/i).click();

    const deleteAction = page.getByRole('menuitem', {
      name: /delete member/i,
    });

    await expect(deleteAction).toBeVisible();
    await expect(deleteAction).toBeEnabled();
  });

// Registered members display data

test('should display registered members data in table', async ({ page }) => {
  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  const rows = table.getByRole('row');
  const rowCount = await rows.count();

  expect(rowCount).toBeGreaterThan(1);

  const firstDataRow = rows.nth(1);
  const cellCount = await firstDataRow.getByRole('cell').count();

  expect(cellCount).toBeGreaterThan(5);
});

test('should navigate between pages and show different data', async ({ page }) => {
  const firstRowPage1 = await page
    .getByRole('row')
    .nth(1)
    .innerText();

  // Next / Previous button locators
  const nextButton = page.getByRole('listitem').filter({ hasText: 'Next' });
  const prevButton = page.getByRole('listitem').filter({ hasText: 'Previous' });

  // Validate buttons
  await expect(nextButton).toBeVisible();
  await expect(nextButton).toBeEnabled();
  await expect(prevButton).toBeVisible();
  await expect(prevButton).toBeEnabled();

  // First row on new page
  const firstRowPage2 = await page.getByRole('row').nth(1).innerText();
  expect(firstRowPage2).not.toEqual(firstRowPage1);
});

});

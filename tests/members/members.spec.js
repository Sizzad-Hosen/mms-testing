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

// Test case : delete memebers 
test('should delete first member with discard and confirm flows', async ({ page }) => {

  const firstRow = page.getByRole('row').nth(1);
  await expect(firstRow).toBeVisible();

  //  Discard delete 
  await firstRow.getByRole('button', { name: /open menu/i }).click();
  await page.getByRole('menuitem', { name: /delete member/i }).click();
  await page.getByRole('button', { name: /discard/i }).click();
  await expect(firstRow).toBeVisible();
  await expect(firstRow).toHaveCount(1, { timeout: 10000 });

  // Confirm delete
  await firstRow.getByRole('button', { name: /open menu/i }).click();
  await page.getByRole('menuitem', { name: /delete member/i }).click();
  await page.getByRole('button', { name: /^delete$/i }).click();
  await expect(firstRow).toHaveCount(0, { timeout: 10000 });

});

//Test case : Registered members display data
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

//Test case : pagination work or not 
test('should navigate between pages and show different data', async ({ page }) => {
  const firstRowPage1 = await page.getByRole('row').nth(1).innerText();

  const nextButton = page.getByRole('listitem').filter({ hasText: 'Next' });
  const prevButton = page.getByRole('listitem').filter({ hasText: 'Previous' });

  await expect(nextButton).toBeVisible();
  await expect(nextButton).toBeEnabled();
  await expect(prevButton).toBeVisible();
  await expect(prevButton).toBeEnabled();

  // Navigate to next page
  await nextButton.click();

  // Wait until first row changes
  const firstRowPage2 = await page.getByRole('row').nth(1).innerText();

  expect(firstRowPage2).not.toEqual(firstRowPage1);
});

// Test case : Select and role and update it..
test('should role change in combobox only if not already selected', async ({ page }) => {
  const roles = [
    'HOA president',
    'HOA vice-president',
    'HOA auditor',
    'Individual homeowner',
  ];

  const roleCombobox = page.getByRole('combobox').first();
  await expect(roleCombobox).toBeVisible();
  await roleCombobox.click();

  const roleToSelect = roles[1]; 
  const roleOption = page.getByRole('option', { name: roleToSelect });

  const currentValue = await roleCombobox.innerText();
  if (currentValue === roleToSelect) {
    console.log(`${roleToSelect} is already selected, skipping click`);
  } else {
    await roleOption.click();
  }

 // Confirm selection
  const confirmButton = page.getByRole('button', { name: /^Confirm$/i });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();
  await expect(roleCombobox).toHaveText(roleToSelect);
});

});




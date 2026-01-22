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


// test('should allow selecting all roles from dropdown', async ({ page }) => {
//   await page.getByRole('option', { name: 'HOA president' }).click();
//   await page.getByRole('option', { name: 'HOA vice-president' }).click();
//   await page.getByRole('option', { name: 'HOA auditor' }).click();
//   await page.getByRole('option', { name: 'Individual homeowner' }).click();

//   await page.getByRole('button', { name: 'Close' }).click();
// });

// test('should allow selecting all roles from dropdown', async ({ page }) => {
//   const roles = [
//     'HOA president',
//     'HOA vice-president',
//     'HOA auditor',
//     'Individual homeowner',
//   ];

//   // Step 1: Open the dropdown
//   const roleCombobox = page.getByRole('combobox').first();
//   await expect(roleCombobox).toBeVisible();
//   await roleCombobox.click(); // opens the dropdown

//   // Step 2: For each role, assert visible then click
//   for (const role of roles) {
//     const option = page.getByRole('option', { name: role });
//     await expect(option).toBeVisible({ timeout: 5000 });
//     await option.click(); 
//   }
// });


// test('should close change role dialog without saving', async ({ page }) => {
//   await page.getByRole('heading', { name: 'Change role' }).click();
//   await page.getByRole('button', { name: 'Close' }).click();
// });

// test('should save role change when Confirm is clicked', async ({ page }) => {
//   // Open dialog
//   await page.getByRole('heading', { name: 'Change role' }).click();

//   // Select a role
//   await page.getByRole('option', { name: 'HOA auditor' }).click();

//   // Confirm the change
//   await page.getByRole('button', { name: 'Confirm' }).click();

//   // Verify role updated
//   await expect(page.getByText('HOA auditor')).toBeVisible();
// });

// test('should cancel role change when Discard is clicked', async ({ page }) => {
//   // Open dialog
//   await page.getByRole('heading', { name: 'Change role' }).click();

//   // Select a new role
//   await page.getByRole('option', { name: 'HOA vice-president' }).click();

//   // Discard the change
//   await page.getByRole('button', { name: 'Discard' }).click();

//   // Verify original role remains (example: 'HOA auditor')
//   await expect(page.getByText('HOA auditor')).toBeVisible();
// });

});




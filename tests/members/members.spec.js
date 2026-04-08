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
// test case : member tab url work correctly
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

// test case : pending tab url work correctly
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
// test case : rejected tab url work correctly
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

//Test case : pagination work or not 
test('pagination should behave correctly', async ({ page }) => {
  const rows = page.getByRole('row');
  const nextButton = page.getByRole('button', { name: /next/i });
  const prevButton = page.getByRole('button', { name: /previous/i });

  const rowCount = await rows.count();

  if (rowCount <= 10) {
    await expect(nextButton).toBeDisabled();
    await expect(prevButton).toBeDisabled();
  } else {
    await expect(prevButton).toBeDisabled();
    await expect(nextButton).toBeEnabled();

    const firstRowPage1 = await rows.nth(1).innerText();

    await nextButton.click();

    await expect(rows.nth(1)).not.toHaveText(firstRowPage1);

    await expect(prevButton).toBeEnabled();
  }
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




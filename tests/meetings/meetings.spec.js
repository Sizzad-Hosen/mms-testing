import { expect, test, } from '@playwright/test';

// 🔐 authenticated session
test.use({
  storageState: 'storageState.json',
});


test.describe('Meeting Feauture Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://app-mms.baumnest.com/MQZUKKX7TLD/meetings'
    );
  });

// Test case : Search meeting by title , des, venue , meeting type

 test('should filter meetings by keyword', async ({ page }) => {

    const keyword = 'general';

    const searchInput = page.getByPlaceholder(
      'Search by title, description, venue, meeting method'
    );


    await searchInput.fill(keyword);

    // Wait for API response
    await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/meetings') && res.status() === 200
      ),
      searchInput.press('Enter')
    ]);

    // Assert results container visible
    // const results = page.locator('[data-testid="meeting-card"]');


    await expect(results.first()).toBeVisible();

    await expect(results).toContainText(new RegExp(keyword, 'i'));

  });


})
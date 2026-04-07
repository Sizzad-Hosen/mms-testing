import { test, expect } from '@playwright/test';

test.use({
  storageState: 'storageState.json',
});

test.describe('Issues Feature Test - Resident Requests & Complaints', () => {

  // ✅ Correct: beforeEach inside same describe
  test.beforeEach(async ({ page }) => {
    await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/issues');
    await page.waitForLoadState('networkidle');

    // safer selector (partial match)
    const heading = page.getByRole('heading', { name: /Resident Requests & Complaints/i });
    await expect(heading).toBeVisible();
    await heading.click();
  });

  // 🔧 helper function
  const openIssueMenu = async (page) => {
    await page.getByRole('button', { name: /open menu/i }).first().click();
  };

  // ✅ Test: Create Issue
  test('Create issue', async ({ page }) => {
    const issueTitle = 'error';

    await page.getByRole('button', { name: /add issue/i }).click();

    await page.getByRole('textbox', { name: /title/i }).fill(issueTitle);
    await page.getByRole('textbox', { name: /description/i }).fill(
      'meeting section active meeting issue'
    );

    await page.getByRole('combobox', { name: /assignee/i }).click();
    await page.getByRole('option', { name: /sizzad/i }).click();

    // ✅ Correct date handling
    const assignDate = '2026-03-30';
    const resolveDate = '2026-04-07';
    const checkpointDate = '2026-04-01';

    await page.getByRole('textbox', { name: /assign date/i }).fill(assignDate);
    await page.getByRole('textbox', { name: /target resolution date/i }).fill(resolveDate);
    await page.getByRole('textbox', { name: /checkpoint/i }).fill(checkpointDate);

    // ✅ Validation
    if (new Date(resolveDate) < new Date(assignDate)) {
      throw new Error('Resolve date must be after assign date');
    }

    if (
      new Date(checkpointDate) < new Date(assignDate) ||
      new Date(checkpointDate) > new Date(resolveDate)
    ) {
      throw new Error('Checkpoint must be between assign and resolve date');
    }

    await page.getByRole('radio', { name: /new/i }).click();
    await page.getByRole('radio', { name: /high/i }).click();

    await page.getByRole('button', { name: /create/i }).click();

    await expect(page.getByText(issueTitle)).toBeVisible();
  });

  // ✅ Test: Edit Issue
  test('Edit issue', async ({ page }) => {
    await page.getByRole('button', { name: /error/i }).first().click();

    await page.getByRole('combobox', { name: /assignee/i }).click();
    await page.getByRole('option', { name: /sizzad/i }).click();

    await page.getByRole('textbox', { name: /assign date/i }).fill('2026-03-30');
    await page.getByRole('textbox', { name: /target resolution date/i }).fill('2026-04-03');
    await page.getByRole('textbox', { name: /checkpoint/i }).fill('2026-04-01');

    await page.getByRole('button', { name: /update/i }).click();
    await page.getByRole('button', { name: /update issue/i }).click();

    await expect(
      page.getByText(/updated successfully/i)
    ).toBeVisible({ timeout: 10000 });
  });

  // ✅ Test: Add Response
  test('Add response', async ({ page }) => {
    await page.getByRole('button', { name: /error/i }).first().click();

    await page.waitForLoadState('networkidle');

    const responsesTab = page.getByRole('tab', { name: /responses/i });
    await expect(responsesTab).toBeVisible();
    await responsesTab.click();

    const responseText = 'check time to complete';

    await page.getByRole('textbox', { name: /write your response/i }).fill(responseText);
    await page.getByRole('button', { name: /comment/i }).click();

    await expect(page.getByText(responseText)).toBeVisible();
  });

  // ✅ Test: Delete Response
  test('Delete response', async ({ page }) => {
    await page.getByRole('button', { name: /error/i }).first().click();

    await page.getByRole('tab', { name: /responses/i }).click();
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /delete/i }).click();
    await page.getByRole('button', { name: /delete/i }).click();

    await expect(
      page.getByText(/deleted successfully/i)
    ).toBeVisible();
  });

  // ✅ Test: Terminate Issue
  test('Terminate issue', async ({ page }) => {
    await openIssueMenu(page);

    const terminate = page.getByRole('menuitem', { name: /terminate/i });

    if (await terminate.isVisible()) {
      await terminate.click();
      await page.getByRole('button', { name: /terminate issue/i }).click();
    }

    const firstRow = page.getByRole('row').nth(1);
    await expect(firstRow).toContainText(/terminated/i);
  });

  // ✅ Test: Close Issue
  test('Close issue', async ({ page }) => {
    await openIssueMenu(page);

    await page.getByRole('menuitem', { name: /close/i }).click();
    await page.getByRole('button', { name: /close issue/i }).click();

    const firstRow = page.getByRole('row').nth(1);
    await expect(firstRow).toContainText(/closed/i);
  });

  // ✅ Test: Copy Issue
  test('Copy issue', async ({ page }) => {
    await openIssueMenu(page);

    await page.getByRole('menuitem', { name: /copy/i }).click();
    await page.getByRole('button', { name: /duplicate issue/i }).click();

    await expect(
      page.getByText(/duplicated|copied/i)
    ).toBeVisible();
  });

  // ✅ Test: Delete Issue
  test('Delete issue', async ({ page }) => {
    await openIssueMenu(page);

    await page.getByRole('menuitem', { name: /delete/i }).click();
    await page.getByRole('button', { name: /delete/i }).click();

    await expect(
      page.getByText(/deleted/i)
    ).toBeVisible();
  });

});
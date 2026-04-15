import { test, expect } from '@playwright/test';

const TENANT = process.env.PW_TENANT_SLUG || 'MQZUKKX7TLD';

test.use({
  storageState: 'storageState.json',
});

function uniqueIssueTitle(testInfo) {
  return `pw-president-issue-${testInfo.parallelIndex}-${Date.now()}`;
}

async function gotoPresidentIssues(page) {
  await page.goto(`/${TENANT}/issues`);
  await expect(page.getByRole('heading', { name: /President Only/i })).toBeVisible();
  await page.getByRole('heading', { name: /President Only/i }).click();
}

async function createIssue(page, title) {
  await page.getByRole('button', { name: /add issue/i }).click();
  await page.getByRole('textbox', { name: /title/i }).fill(title);
  await page.getByRole('textbox', { name: /description/i }).fill('Created by Playwright enterprise regression test');
  await page.getByRole('combobox', { name: /assignee/i }).click();
  await page.getByRole('option', { name: /sizzad/i }).click();
  await page.getByRole('textbox', { name: /assign date/i }).fill('2026-03-30');
  await page.getByRole('textbox', { name: /target resolution date/i }).fill('2026-04-07');
  await page.getByRole('textbox', { name: /checkpoint/i }).fill('2026-04-01');
  await page.getByRole('radio', { name: /new/i }).click();
  await page.getByRole('radio', { name: /high/i }).click();

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/issues') && res.ok()),
    page.getByRole('button', { name: /create/i }).click(),
  ]);
}

async function openIssueByTitle(page, title) {
  await page.getByRole('button', { name: title }).first().click();
}

async function openFirstIssueMenu(page) {
  await page.getByRole('button', { name: /open menu/i }).first().click();
}

test.describe('Issues - President Only (enterprise regression)', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPresidentIssues(page);
  });

  test('creates issue with isolated title', async ({ page }, testInfo) => {
    const issueTitle = uniqueIssueTitle(testInfo);
    await createIssue(page, issueTitle);
    await expect(page.getByText(issueTitle)).toBeVisible({ timeout: 15_000 });
  });

  test('edits issue metadata deterministically', async ({ page }, testInfo) => {
    const issueTitle = uniqueIssueTitle(testInfo);
    await createIssue(page, issueTitle);
    await openIssueByTitle(page, issueTitle);
    await page.getByRole('combobox', { name: /assignee/i }).click();
    await page.getByRole('option', { name: /sizzad/i }).click();
    await page.getByRole('textbox', { name: /assign date/i }).fill('2026-03-30');
    await page.getByRole('textbox', { name: /target resolution date/i }).fill('2026-04-03');
    await page.getByRole('textbox', { name: /checkpoint/i }).fill('2026-04-01');
    await page.getByRole('button', { name: /update/i }).click();
    await page.getByRole('button', { name: /update issue/i }).click();
    await expect(page.getByText(/updated successfully/i)).toBeVisible({ timeout: 10_000 });
  });

  test('adds and deletes a response comment', async ({ page }, testInfo) => {
    const issueTitle = uniqueIssueTitle(testInfo);
    const responseText = `response-${Date.now()}`;
    await createIssue(page, issueTitle);
    await openIssueByTitle(page, issueTitle);
    await page.getByRole('tab', { name: /responses/i }).click();
    await page.getByRole('textbox', { name: /write your response/i }).fill(responseText);
    await page.getByRole('button', { name: /comment/i }).click();
    await expect(page.getByText(responseText)).toBeVisible();
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /delete/i }).click();
    await page.getByRole('button', { name: /delete/i }).click();
    await expect(page.getByText(/deleted successfully/i)).toBeVisible();
  });

  test('copies and closes issue under delayed API response', async ({ page }, testInfo) => {
    const issueTitle = uniqueIssueTitle(testInfo);
    await createIssue(page, issueTitle);

    await page.route('**/issues**', async (route) => {
      await page.waitForTimeout(300);
      await route.continue();
    });

    await openFirstIssueMenu(page);
    await page.getByRole('menuitem', { name: /copy/i }).click();
    await page.getByRole('button', { name: /duplicate issue/i }).click();
    await expect(page.getByText(/duplicated|copied/i)).toBeVisible();

    await openFirstIssueMenu(page);
    await page.getByRole('menuitem', { name: /close/i }).click();
    await page.getByRole('button', { name: /close issue/i }).click();
    await expect(page.getByRole('row').nth(1)).toContainText(/closed/i);

    await page.unroute('**/issues**');
  });
});
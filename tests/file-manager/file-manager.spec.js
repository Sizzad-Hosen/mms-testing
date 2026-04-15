import { test, expect } from '@playwright/test';
import path from 'path';

const TENANT = process.env.PW_TENANT_SLUG || 'MQZUKKX7TLD';

test.use({
  storageState: 'storageState.json',
});

function uniqueName(prefix, testInfo) {
  return `${prefix}-${testInfo.parallelIndex}-${Date.now()}`;
}

async function gotoFileManager(page) {
  await page.goto(`/${TENANT}/file-manager`);
  await expect(page.getByRole('button', { name: /new folder/i })).toBeVisible();
}

async function createFolder(page, folderName) {
  await page.getByRole('button', { name: /new folder/i }).click();
  await page.getByRole('textbox', { name: /folder name/i }).fill(folderName);
  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/file-manager') && res.ok()),
    page.getByRole('button', { name: /create folder/i }).click(),
  ]);
}

async function openFirstMenu(page) {
  const openMenu = page.getByRole('button', { name: /open menu/i }).first();
  await expect(openMenu).toBeVisible();
  await openMenu.click();
}

const uploadFixturePath = path.resolve(
  process.cwd(),
  'tests',
  'fixtures',
  'upload-sample.txt'
);

test.describe('File manager - enterprise regression', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await gotoFileManager(page);
  });
  test('creates and renames folder with unique data', async ({ page }, testInfo) => {
    const folderName = uniqueName('pw-folder', testInfo);
    const renamedFolder = `${folderName}-renamed`;

    await createFolder(page, folderName);
    await expect(page.getByText(folderName, { exact: true })).toBeVisible();

    await openFirstMenu(page);
    await page.getByRole('menuitem', { name: /rename/i }).click();
    await page.getByRole('textbox', { name: /folder name/i }).fill(renamedFolder);
    await page.getByRole('button', { name: /^rename$/i }).click();
    await expect(page.getByText(renamedFolder, { exact: true })).toBeVisible({ timeout: 15_000 });
  });

  test('shows validation when creating duplicate folder name', async ({ page }, testInfo) => {
    const folderName = uniqueName('pw-duplicate-folder', testInfo);
    await createFolder(page, folderName);
    await createFolder(page, folderName);
    await expect(page.getByText(/already been taken/i)).toBeVisible();
  });

  test('uploads file with deterministic assertions', async ({ page }, testInfo) => {
    const fileName = uniqueName('pw-file', testInfo);

    await page.getByRole('button', { name: /upload file/i }).click();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(uploadFixturePath);
    await page.getByRole('textbox', { name: /file name/i }).fill(fileName);

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/file-manager') && res.ok()),
      page.getByRole('button', { name: /upload|save/i }).click(),
    ]);

    await expect(page.getByText(fileName, { exact: true })).toBeVisible({ timeout: 20_000 });
  });

  test('search returns target folder under delayed response', async ({ page }, testInfo) => {
    const folderName = uniqueName('pw-search-folder', testInfo);
    await createFolder(page, folderName);

    await page.route('**/file-manager**', async (route) => {
      await page.waitForTimeout(300);
      await route.continue();
    });

    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill(folderName);
    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/file-manager') && res.ok()),
      page.keyboard.press('Enter'),
    ]);

    await expect(page.getByText(folderName, { exact: true })).toBeVisible();
    await page.unroute('**/file-manager**');
  });
});


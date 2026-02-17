import { test, expect } from '@playwright/test';
import path from 'path';
// 🔐 authenticated session
test.use({
  storageState: 'storageState.json',
});

test.describe('File Manager 2 page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://app-mms.baumnest.com/MQZUKKX7TLD/file-manager2'
    );
  });

//  Test case : New folder create 

test('should allow to create new folder', async ({ page }) => {
  await page.getByRole('button', { name: /new folder/i }).click();

  const folderInput = page.getByRole('textbox', { name: /folder name/i });
  await folderInput.fill('test');

  await page.getByRole('button', { name: /create folder/i }).click();

  const folder = page.getByText('test');
  await expect(folder).toBeVisible();
});


// Test case : Already Taken the folder
  test('should show error if folder already exists', async ({ page }) => {
  await page.getByRole('button', { name: /new folder/i }).click();
  await page.getByRole('textbox', { name: /folder name/i }).fill('test');
  await page.getByRole('button', { name: /create folder/i }).click();
    await expect(
    page.getByText(/The Name has already been taken/i).nth(1)
    ).toBeVisible();

});

//  Test case : Upload File

test('should upload a new file', async ({ page }) => {

  await page.getByRole('button', { name: /upload file/i }).click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.resolve(__dirname, 'bendPipe.png'));

  const fileNameInput = page.getByRole('textbox', { name: /file name/i });
  await fileNameInput.fill('testfile');
  await page.getByRole('button', { name: /upload|save/i }).click();

  const uploadedFile = page.getByText('testfile');
  await expect(uploadedFile).toBeVisible();
});

//  Test case : Upload File Rename
  test('should upload file rename', async ({ page }) => {
  await page.getByRole('button', { name: 'Upload File' }).click();
  await page.getByRole('button', { name: 'File*' }).click();
  await page.getByRole('button', { name: 'File*' }).setInputFiles('bendPipe.png');
  await page.getByRole('textbox', { name: 'File name' }).click();
  await page.getByRole('textbox', { name: 'File name' }).fill('testfile');
  await page.getByRole('button', { name: 'Discard' }).click();
  await page.getByRole('button', { name: 'Upload File' }).click();
  });
  
//  Test case : Dowenload  Upload File
  test('should dowenload  upload file', async ({ page }) => {
  
    await page.locator('[id="radix-:rdl:"]').click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('menuitem', { name: 'Download' }).click();
  const download = await downloadPromise;
  });
//  Test case :Move the Upload File
  test('should dowenload  upload file', async ({ page }) => {

  await page.locator('[id="radix-:ren:"]').click();
  await page.getByRole('menuitem', { name: 'Move' }).click()
  });

//  Test case :Delete the Upload File
  test('should delete the upload file', async ({ page }) => {

  await page.locator('[id="radix-:r5p:"]').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Discard' }).click();
  await page.locator('[id="radix-:r6n:"]').click();
  await page.locator('.lucide.lucide-trash').click();
  await page.getByRole('button', { name: 'Delete' }).click();
  });


// Test case : searching and search by title

 test('should search a folder by name', async ({ page }) => {

  const folderName = 'example2';
  const searchInput = page.getByPlaceholder('Search by title, description, venue, meeting method');
  await searchInput.fill(folderName);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name:folderName })).toBeVisible();

});



})


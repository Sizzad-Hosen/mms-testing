import { test, expect } from '@playwright/test';
import path from 'path';
// 🔐 authenticated session
test.use({
  storageState: 'storageState.json',
});

test.describe('File Manager 2 page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://app-mms.baumnest.com/MQZUKKX7TLD/file-manager'
    );
  });
//  Test case : New folder create 

test('should allow to create new folder', async ({ page }) => {
  await page.getByRole('button', { name: /new folder/i }).click();

  const folderInput = page.getByRole('textbox', { name: /folder name/i });
  await folderInput.fill('test');

  await page.getByRole('button', { name: /create folder/i }).click();

  const folder = page.getByRole('heading', { name: 'test' });
  await expect(folder).toBeVisible();
  
});

//  Test case : Folder name Rename
test('should folder name rename', async ({ page }) => {

  const currentFolderName = 'AGM';
  const newFolderName = 'example2'; 

  const openMenu = page.getByRole('button', { name: 'Open menu', exact: true }).first();
  await openMenu.waitFor({ state: 'visible' });
  await openMenu.click();

  const renameItem = page.getByRole('menuitem', { name: /Rename/i });
  await renameItem.click();

  const input = page.getByRole('textbox', { name: /Folder name/i });
  await input.fill(newFolderName);

  await page.getByRole('button', { name: /^Rename$/ }).click();

  const successLocator = page.getByRole('heading', { name: newFolderName });

  // Wait for either success or error
  if (await successLocator.count() > 0) {
    await expect(successLocator).toBeVisible();
    console.log('Folder renamed successfully.');
  } else {
    const errorMessage = page.locator('small, div').filter({ hasText: 'The Name has already been taken.' }).first();
    await errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    await expect(errorMessage).toBeVisible();
    console.log('Duplicate name error displayed.');
  }

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
  await fileInput.setInputFiles(path.resolve(__dirname, 'img.png'));

  const fileNameInput = page.getByRole('textbox', { name: /file name/i });
  await fileNameInput.fill('testfile');
  await page.getByRole('button', { name: /upload|save/i }).click();

  const uploadedFile = page.getByText('testfile');
  await expect(uploadedFile).toBeVisible();
});

//  Test case : Upload File name Rename
  test('should upload file rename', async ({ page }) => {
  await page.getByRole('button', { name: 'Upload File' }).click();
  await page.getByRole('button', { name: 'File*' }).click();
  await page.getByRole('button', { name: 'File*' }).setInputFiles(path.resolve(__dirname, 'img.png'));
  await page.getByRole('textbox', { name: 'File name' }).click();
  await page.getByRole('textbox', { name: 'File name' }).fill('testfile2');
  await page.getByRole('button', { name: 'Upload' }).click();

  const renamedFile = page.getByText('testfile20');
  await expect(renamedFile).toBeVisible();

  });
  
//  Test case : Dowenload  Upload File
// test('download file using radix menu', async ({ page }) => {
//     // Click Open Menu for the file
//     const openMenu = page.getByRole('button', { name: 'Open menu', exact: true }).first();
//     await openMenu.waitFor({ state: 'visible' });
//     await openMenu.click();

//     // Click Move
//     const download = page.getByRole('menuitem', { name: /Download/i });
//     await download.waitFor({ state: 'visible' });
//     await download.click();

//   const downloadPromise = page.waitForEvent('download');

//   await page.getByRole('menuitem', { name: /Download/i }).click();

//   const download = await downloadPromise;

//   const fileName = download.suggestedFilename();

//   ensureDownloadsFolder();
//   const downloadPath = path.join('downloads', fileName);

//   await download.saveAs(downloadPath);

//   expect(fs.existsSync(downloadPath)).toBeTruthy();

// });


//  Test case :Move the Upload File
  test('should move the upload file', async ({ page }) => {

    // Click Open Menu for the file
    const openMenu = page.getByRole('button', { name: 'Open menu', exact: true }).first();
    await openMenu.waitFor({ state: 'visible' });
    await openMenu.click();

    // Click Move
    const moveItem = page.getByRole('menuitem', { name: /Move/i });
    await moveItem.waitFor({ state: 'visible' });
    await moveItem.click();
  });

//  Test case :Delete the Upload File
  test('should delete the upload file', async ({ page }) => {
  // Click Open Menu for the file
    const openMenu = page.getByRole('button', { name: 'Open menu', exact: true }).first();
    await openMenu.waitFor({ state: 'visible' });
    await openMenu.click();

    // Click Delete
    const deleteItem = page.getByRole('menuitem', { name: /Delete/i });
    await deleteItem.waitFor({ state: 'visible' });
    await deleteItem.click();

    // Confirm Delete
    const confirmDelete = page.getByRole('button', { name: /Delete/i });
    await confirmDelete.waitFor({ state: 'visible' });
    await confirmDelete.click();

    // Verify file is gone
    const deletedFile = page.getByText('testfile2');
    await expect(deletedFile).not.toBeVisible();
  });

// Test case : searching and search by title

 test('should search a folder by name', async ({ page }) => {

  const folderName = 'example2';
  const searchInput = page.getByPlaceholder('Search by title, description, venue, meeting method');
  await searchInput.fill(folderName);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name:folderName })).toBeVisible();

});
// Test case : Best case use it
 test('should filter meetings by keyword', async ({ page }) => {

    const keyword = 'example2';

    const searchInput = page.getByPlaceholder(
      'Search by title, description, venue, meeting method'
    );
    await searchInput.fill(keyword);

    // Wait for API response
    await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/file-manager') && res.status() === 200
      ),
      searchInput.press('Enter')
    ]);

    // Assert results container visible
    // const results = page.locator('[data-testid="meeting-card"]');


    await expect(results.first()).toBeVisible();

    await expect(results).toContainText(new RegExp(keyword, 'i'));

  });

// Test case : Sort by active, pending , past

test("Should Sort by active , pending , past ", async({page})=>{

  const options = ['Show Active', 'Show Pending', 'Show Past'];

  for (const option of options) {

    await page.getByRole('combobox').click();

    // Select the option
    await page.getByRole('option', { name: option }).click();
    await page.waitForLoadState('networkidle');

    // Assert dropdown now shows the selected option
    await expect(page.getByRole('combobox')).toHaveText(option);

    const results = page.locator('[data-testid="meeting-card"]');
    await expect(results.first()).toBeVisible();
  }


})

})


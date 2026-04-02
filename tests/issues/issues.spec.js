import { expect, test, } from '@playwright/test';

test.use({
  storageState: 'storageState.json',
});

test.describe('Issues Feauture Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://app-mms.baumnest.com/MQZUKKX7TLD/issues'
    );
  })

// Test case : president only category
test.describe("President only category",async()=>{
  
// Test Case : create President only issues 
test('Create a president only issues', async ({ page }) => {
  const issueTitle = 'error';
  await page.getByRole('heading', { name: 'President Only' }).click();
  await page.getByRole('button', { name: 'Add Issue' }).click();

  await page.getByRole('textbox', { name: 'Title*' }).fill(issueTitle);
  await page.getByRole('textbox', { name: 'Description*' }).fill(
    'meeting section active meeting show current meeting but previous show meet'
  );

  await page.getByRole('combobox', { name: 'Assignee*' }).click();
  await page.getByRole('option', { name: 'Md. Sizzad Hosen' }).click();

  const assignDate = await page.getByRole('textbox', { name: 'Assign date*' }).fill('2026-03-30');

  const resolveDate = await page.getByRole('textbox', { name: 'Target resolution date*' }).fill('2026-04-07');

if (new Date(resolveDate) < new Date(assignDate)) {
  return "Resolve date must be after assign date";
}
  await page.getByRole('radio', { name: 'New' }).click();
  await page.getByRole('radio', { name: 'Priority* High' }).click();

 const checkPointDate = await page.getByRole('textbox', { name: 'Checkpoint' }).fill('2026-04-01');

  const assign = new Date(assignDate);
  const resolve = new Date(resolveDate);
  const checkpoint = new Date(checkPointDate);

  if (checkpoint < assign || checkpoint > resolve) {
    return "Checkpoint date must be between assign and resolve date";
  }
  // await page.getByRole('textbox', { name: 'Enter Name' }).fill('meet to solve');
  // await page.getByRole('textbox', { name: 'Enter link' }).fill('www.meet.com');

  await page.getByRole('button', { name: 'Create' }).click();

  // Assertion
  await expect(page.getByText(issueTitle)).toBeVisible();
});

// test case : edit president only issues

test(' Edit issue should succeed with valid dates', async ({ page }) => {
  await page.getByRole('heading', { name: 'President Only' }).click();
  await page.getByRole('button', { name: /president only issue/i }).first().click();

  await page.getByRole('combobox', { name: 'Assignee*' }).click();
  await page.getByRole('option', { name: 'Md. Sizzad Hosen' }).click();

  // ✅ Valid dates
  await page.getByRole('textbox', { name: 'Assign date*' }).fill('2026-03-30');
  await page.getByRole('textbox', { name: 'Target resolution date*' }).fill('2026-04-03');
  await page.getByRole('textbox', { name: 'Checkpoint' }).fill('2026-04-01');

  await page.getByRole('button', { name: /update/i }).click();
  await page.getByRole('button', { name: /Update issue/i }).click();

const successMessage = 'Issue updated successfully';
await expect(page.getByText(successMessage)).toBeVisible({ timeout: 10000 });
});

// Test case : add response 
test("add response to president only issues", async ({ page }) => {

  await page.getByRole('heading', { name: 'President Only' }).click();

  await page.getByRole('button', { name: 'error' }).click();

  await page.waitForLoadState('networkidle',{timeout : 30000});

  const responsesTab = page.getByRole('tab', { name: 'Responses (0)' })
  await expect(responsesTab).toBeVisible();
  await responsesTab.click();

  const responseText = 'check time to complete';
  await page.getByRole('textbox', { name: 'Write your response' }).fill(responseText);
  await page.getByRole('button', { name: 'Comment' }).click();

  // Assertion
  await expect(page.getByText(responseText)).toBeVisible();
});

// test case : delete response 
test("delete response to president only issues", async ({ page }) => {
  // Open issue
   await page.getByRole('heading', { name: 'President Only' }).click();
  await page.getByRole('button', { name: /error/i }).first().click();

  // Open responses tab (avoid count dependency)
  await page.getByRole('tab', { name: /Responses/i }).click();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();

await expect(page.getByText(/Response deleted successfully/i)).toBeVisible();

});
async function openIssueMenu(page) {
  await page.getByRole('button', {name : 'Open Menu'}).first().click();
}

// test case : terminate presidentonly issues

test("terminate president only issues", async ({ page }) => {
  // Go to President Only section
  await page.getByRole('heading', { name: 'President Only' }).click();
  await openIssueMenu(page);
  const terminateMenuItem = page.getByRole('menuitem', { name: /Terminate/i });

  if (await terminateMenuItem.isVisible()) {
    await terminateMenuItem.click();
    await page.getByRole('button', { name: /Terminate issue/i }).click();
  } else {

    console.log("Issue is already terminated, skipping click");
  }

  const firstRow = page.getByRole('row').nth(1); 
  await expect(firstRow).toBeVisible();
  await expect(firstRow).toContainText(/terminated/i);
});


// test case : close presidentonly issues
test("close president only issues", async ({ page }) => {
  await page.getByRole('heading', { name: 'President Only' }).click();
  await openIssueMenu(page);

  await page.getByRole('menuitem', { name: /Close/i }).click();
  await page.getByRole('button', { name: /Close issue/i }).click();

  const firstRow = page.getByRole('row').nth(1); 
  await expect(firstRow).toBeVisible();
  await expect(firstRow).toContainText(/closed/i);
});
// test case : copy presidentonly issues
test("copy president only issues", async ({ page }) => {
  await page.getByRole('heading', { name: 'President Only' }).click();
  await openIssueMenu(page);

  await page.getByRole('menuitem', { name: /Copy/i }).click();
  await page.getByRole('button', { name: /Duplicate issue/i }).click();

  await expect(
    page.getByText(/duplicated|copied/i)
  ).toBeVisible();
});
// test case : delete draft presidentonly issues
test("deleted draft president only issues", async ({ page }) => {
  await page.getByRole('heading', { name: 'President Only' }).click();
  await openIssueMenu(page);

  await page.getByRole('menuitem', { name: /delete/i }).click();
  await page.getByRole('button', { name: /delete/i }).click();

  await expect(
    page.getByText(/deleted/i)
  ).toBeVisible();
});

})

// Test category :  Execute committe operations category
test.describe("Execute committe operations",async()=>{
  
test('Create a Execute committe issues', async ({ page }) => {
  const issueTitle = 'mismatch';
  await page.getByRole('heading', { name: 'Executive Committee Operations' }).click();
  await page.getByRole('button', { name: 'Add Issue' }).click();

  await page.getByRole('textbox', { name: 'Title*' }).fill(issueTitle);
  await page.getByRole('textbox', { name: 'Description*' }).fill(
    'meeting section active meeting show current meeting but previous show meet'
  );

  await page.getByRole('combobox', { name: 'Assignee*' }).click();
  await page.getByRole('option', { name: 'Md. Sizzad Hosen' }).click();

  const assignDate = await page.getByRole('textbox', { name: 'Assign date*' }).fill('2026-04-02');

  const resolveDate = await page.getByRole('textbox', { name: 'Target resolution date*' }).fill('2026-04-07');

if (new Date(resolveDate) < new Date(assignDate)) {
  return "Resolve date must be after assign date";
}
  await page.getByRole('radio', { name: 'New' }).click();
  await page.getByRole('radio', { name: 'Priority* High' }).click();

 const checkPointDate = await page.getByRole('textbox', { name: 'Checkpoint' }).fill('2026-04-01');

  const assign = new Date(assignDate);
  const resolve = new Date(resolveDate);
  const checkpoint = new Date(checkPointDate);

  if (checkpoint < assign || checkpoint > resolve) {
    return "Checkpoint date must be between assign and resolve date";
  }
  // await page.getByRole('textbox', { name: 'Enter Name' }).fill('meet to solve');
  // await page.getByRole('textbox', { name: 'Enter link' }).fill('www.meet.com');

  await page.getByRole('button', { name: 'Create' }).click();

  // Assertion
  await expect(page.getByText(issueTitle)).toBeVisible();
});
// test case : edit Executive Committee Operations issues

test(' Edit issue should succeed with valid dates', async ({ page }) => {
   await page.getByRole('heading', { name: 'Executive Committee Operations' }).click();
  await page.getByRole('button', { name: /mismatch/i }).first().click();

  await page.getByRole('combobox', { name: 'Assignee*' }).click();
  await page.getByRole('option', { name: 'Md. Sizzad Hosen' }).click();
  // ✅ Valid dates
  await page.getByRole('textbox', { name: 'Assign date*' }).fill('2026-03-30');
  await page.getByRole('textbox', { name: 'Target resolution date*' }).fill('2026-04-03');
  await page.getByRole('textbox', { name: 'Checkpoint' }).fill('2026-04-01');

  await page.getByRole('button', { name: /update/i }).click();
  await page.getByRole('button', { name: /Update issue/i }).click();

const successMessage = 'Issue updated successfully';
await expect(page.getByText(successMessage)).toBeVisible({ timeout: 10000 });
});

// Test case : add response 
test("add response to Executive Committee Operations issues", async ({ page }) => {

  await page.getByRole('heading', { name: 'Executive Committee Operations' }).click();

  await page.getByRole('button', { name: 'mismatch' }).click();

  await page.waitForLoadState('networkidle',{timeout : 30000});

  const responsesTab = page.getByRole('tab', { name: 'Responses (0)' })
  await expect(responsesTab).toBeVisible();
  await responsesTab.click();

  const responseText = 'check time to complete';
  await page.getByRole('textbox', { name: 'Write your response' }).fill(responseText);
  await page.getByRole('button', { name: 'Comment' }).click();

  // Assertion
  await expect(page.getByText(responseText)).toBeVisible();
});

// test case : delete response 
test("delete response to Executive Committee Operations issues", async ({ page }) => {
  // Open issue
   await page.getByRole('heading', { name: 'Executive Committee Operations' }).click();
  await page.getByRole('button', { name: /mismatch/i }).first().click();

  // Open responses tab (avoid count dependency)
  await page.getByRole('tab', { name: /Responses/i }).click();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();

await expect(page.getByText(/Response deleted successfully/i)).toBeVisible();

});
async function openIssueMenu(page) {
  await page.getByRole('button', {name : 'Open Menu'}).first().click();
}

// test case : terminate Executive Committee Operations issues

test("terminate Executive Committee Operations issues", async ({ page }) => {
  // Go to President Only section
  await page.getByRole('heading', { name: 'Executive Committee Operations' }).click();
  await openIssueMenu(page);
  const terminateMenuItem = page.getByRole('menuitem', { name: /Terminate/i });

  if (await terminateMenuItem.isVisible()) {
    await terminateMenuItem.click();
    await page.getByRole('button', { name: /Terminate issue/i }).click();
  } else {

    console.log("Issue is already terminated, skipping click");
  }

  const firstRow = page.getByRole('row').nth(1); 
  await expect(firstRow).toBeVisible();
  await expect(firstRow).toContainText(/terminated/i);
});

// test case : close Executive Committee Operations issues
test("close Executive Committee Operations issues", async ({ page }) => {
  await page.getByRole('heading', { name: 'Executive Committee Operations' }).click();
  await openIssueMenu(page);

  await page.getByRole('menuitem', { name: /Close/i }).click();
  await page.getByRole('button', { name: /Close issue/i }).click();

  const firstRow = page.getByRole('row').nth(1); 
  await expect(firstRow).toBeVisible();
  await expect(firstRow).toContainText(/closed/i);
});
// test case : copy Executive Committee Operations issues
test("copy Executive Committee Operations issues", async ({ page }) => {
  await page.getByRole('heading', { name: 'Executive Committee Operations' }).click();
  await openIssueMenu(page);

  await page.getByRole('menuitem', { name: /Copy/i }).click();
  await page.getByRole('button', { name: /Duplicate issue/i }).click();

  await expect(
    page.getByText(/duplicated|copied/i)
  ).toBeVisible();
});
// test case : delete draft Executive Committee Operations issues
test("deleted draft Executive Committee Operationsissues", async ({ page }) => {
  await page.getByRole('heading', { name: 'Executive Committee Operations' }).click();
  await openIssueMenu(page);

  await page.getByRole('menuitem', { name: /delete/i }).click();
  await page.getByRole('button', { name: /delete/i }).click();

  await expect(
    page.getByText(/deleted/i)
  ).toBeVisible();
});


})

})


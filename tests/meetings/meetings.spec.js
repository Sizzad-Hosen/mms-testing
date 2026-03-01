import { expect, test, } from '@playwright/test';
import { meetingData } from '../../pages/meetings/meetingsData';
import { addAgenda, addParticipant } from '../../pages/meetings/helpers';

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

test.describe('Create Meeting Flow', () => {

  test('should create a meeting successfully', async ({ page }) => {

    // 🔹 Start meeting creation
    await page.getByRole('button', { name: 'New Meeting' }).click();

    // 🔹 Meeting details
    await page.getByRole('textbox', { name: 'Title*' }).fill(meetingData.title);

    await page.getByRole('combobox', { name: 'Type*' }).click();
    await page.getByRole('option', { name: meetingData.type }).click();

    await page.getByRole('textbox', { name: 'Description' }).fill(meetingData.description);

    // 🔹 Date & time
    await page.getByRole('button', { name: 'Date*' }).click();
    await page.getByRole('button', { name: meetingData.dateLabel }).click();

    await page.getByRole('textbox', { name: 'Start Time*' }).fill(meetingData.startTime);
    await page.getByRole('textbox', { name: 'End Time*' }).fill(meetingData.endTime);

    // 🔹 Method
    await page.getByRole('radio', { name: meetingData.method }).click();
    await page.getByRole('textbox', { name: 'Link*' }).fill(meetingData.link);

    await page.getByRole('button', { name: /Save & Continue/i }).click();

    // 🔹 Participants
    for (const participant of meetingData.participants) {
      await addParticipant(page, participant);
    }

    await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
    await page.getByRole('textbox', { name: /email/i }).fill('john.doe@example.com');

    await page.getByRole('button', { name: /Save & Continue/i }).click();

    // 🔹 Agenda
    for (const agenda of meetingData.agenda) {
      await addAgenda(page, agenda);
    }

    await page.getByRole('button', { name: /Save & Continue/i }).click();

    // 🔹 Review & Create
    await expect(page.getByText('Review')).toBeVisible();

    await page.getByRole('button', { name: 'Create Meeting' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    // 🔹 Final assertion
    await expect(page.getByText(meetingData.title)).toBeVisible();
    await expect(page.getByText(meetingData.description)).toBeVisible();

  });

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


test("Should Delete a meeting", async ({ page }) => {

  // 1️⃣ Go to Draft tab
  await page.getByRole('tab', { name: 'Draft' }).click();

  // 2️⃣ Wait for meetings to load
  const meetingRow = page.locator('div:has-text("Important Meeting for Discussing Business Matters")'); // better: match meeting title
  await expect(meetingRow).toBeVisible();

  // 3️⃣ Click action menu in the row
  const actionButton = meetingRow.locator('button:has-text("…")'); // assuming menu button
  await actionButton.click();

  // 4️⃣ Click Delete
  const deleteButton = page.getByRole('button', { name: 'Delete' });
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  // 5️⃣ Confirm Delete if modal appears
  const confirmButton = page.getByRole('button', { name: 'Confirm' });
  if (await confirmButton.isVisible()) {
    await confirmButton.click();
  }

  // 6️⃣ Assertion: Ensure meeting no longer exists
  await expect(meetingRow).not.toBeVisible({ timeout: 5000 });

});


test("Should Cancel a Meeting", async ({ page }) => {
  await page.getByRole("button", { name: "Open Menu" }).first().click();
  await page.getByRole("menuitem", { name: "cancel meeting" }).click();
  await page.getByRole("button", { name: "Cancel Meeting" }).click();

  const successMessage = page.getByText("Meeting cancelled successfully");

  await expect(successMessage).toHaveCount(1);
});


})



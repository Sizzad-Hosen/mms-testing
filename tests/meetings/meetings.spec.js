import { expect, test, } from '@playwright/test';
import { meetingData } from '../../pages/meetings/meetingsData';
import { addAgenda, addParticipant } from '../../pages/meetings/helpers';

  
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

    //  Start meeting creation
    await page.getByRole('button', { name: 'New Meeting' }).click();

    //  Meeting details
    await page.getByRole('textbox', { name: 'Title*' }).fill(meetingData.title);

    await page.getByRole('combobox', { name: 'Type*' }).click();
    await page.getByRole('option', { name: meetingData.type }).click();

    await page.getByRole('textbox', { name: 'Description' }).fill(meetingData.description);

    //  Date & time
    await page.getByRole('button', { name: 'Date*' }).click();
    await page.getByRole('button', { name: meetingData.dateLabel }).click();

    await page.getByRole('textbox', { name: 'Start Time*' }).fill(meetingData.startTime);
    await page.getByRole('textbox', { name: 'End Time*' }).fill(meetingData.endTime);

    //  Method
    await page.getByRole('radio', { name: meetingData.method }).click();
    await page.getByRole('textbox', { name: 'Link*' }).fill(meetingData.link);

    await page.getByRole('button', { name: /Save & Continue/i }).click();

    //  Participants
    for (const participant of meetingData.participants) {
      await addParticipant(page, participant);
    }

    await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
    await page.getByRole('textbox', { name: /email/i }).fill('john.doe@example.com');

    await page.getByRole('button', { name: /Save & Continue/i }).click();

    //  Agenda
    for (const agenda of meetingData.agenda) {
      await addAgenda(page, agenda);
    }

    await page.getByRole('button', { name: /Save & Continue/i }).click();

    //  Review & Create
    await expect(page.getByText('Review')).toBeVisible();

    await page.getByRole('button', { name: 'Create Meeting' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    //  Final assertion
    await expect(page.getByText(meetingData.title)).toBeVisible();
    await expect(page.getByText(meetingData.description)).toBeVisible();

  });

});


test.describe('Edit Meeting Flow', () => {

  test('should edit a meeting successfully', async ({ page }) => {

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

// Test case : copy a meetings
test.describe('Copy duplicate Meeting Flow', () => {

  test('should edit a meeting successfully', async ({ page }) => {

    await page.getByRole("button", { name: "Open Menu" }).first().click();
    await page.getByRole("menuitem", { name: "Copy Meeting" }).click();
    // // 🔹 Start meeting creation
    await page.getByRole('button', { name: 'Duplicate Meeting' }).click();

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

// Test case : Search meeting by title , des, venue , meeting type with correct 
test('Should search meeting by title, description, venue, meeting type', async ({ page }) => {
  const keyword = 'Important';

  const searchInput = page.getByPlaceholder(
    'Search by title, description, venue, meeting method'
  );

  await expect(searchInput).toBeVisible();
  await searchInput.fill(keyword);

  await Promise.all([
    page.waitForResponse(res =>
      res.url().includes('/meetings') && res.status() === 200
    ),
    searchInput.press('Enter')
  ]);
  const results = page.locator('tr, .card, .meeting-item').filter({
    hasText: new RegExp(keyword, 'i')
  });

  await expect(results.first()).toBeVisible();
});


// Test case : Search meeting by title , des, venue , meeting type not found
test('Should show no results message when keyword not found', async ({ page }) => {

  const keyword = 'zzzz1234';

  const searchInput = page.getByPlaceholder(
    'Search by title, description, venue, meeting method'
  );

  await searchInput.fill(keyword);

  await Promise.all([
    page.waitForResponse(res =>
      res.url().includes('/meetings') && res.status() === 200
    ),
    searchInput.press('Enter')
  ]);

  const noResults = page.getByText(/No meetings/i);

  await expect(noResults).toBeVisible();

});

// Sorting Implementation Error....

// Test case : Sort by active, pending , past
test("Should Sort by active , pending , past ", async({page})=>{
  const options = ['Show Active', 'Show Pending', 'Show Past'];
  for (const option of options) {

    await page.getByRole('combobox').click();
    // Select the option
    await page.getByRole('option', { name: option }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('combobox')).toHaveText(option);
    const results = page.locator('[data-testid="meeting-card"]');
    await expect(results.first()).toBeVisible();
  }

})

// delete test case 
test("Should Delete a meeting", async ({ page }) => {
  await page.getByRole('tab', { name: 'Draft' }).click();

  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  const confirmDelete = page.getByRole('button', { name: /delete/i });
  await expect(confirmDelete).toBeVisible();

  await confirmDelete.click();
  await expect(
    page.getByText("Meeting deleted successfully!")
  ).toBeVisible({ timeout: 10000 });

});

// test case : cancle a meeting
test("Should Cancel a Meeting", async ({ page }) => {
  await page.getByRole("button", { name: "Open Menu" }).first().click();
  await page.getByRole("menuitem", { name: "cancel meeting" }).click();
  await page.getByRole("button", { name: "Cancel Meeting" }).click();

  const successMessage = page.getByText("Meeting cancelled successfully");

  await expect(successMessage).toHaveCount(1);
});




})



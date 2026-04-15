import { expect, test } from '@playwright/test';
import { addAgenda, addParticipant } from '../../pages/meetings/helpers';

const TENANT = process.env.PW_TENANT_SLUG || 'MQZUKKX7TLD';

test.use({
  storageState: 'storageState.json',
});

function uniqueMeetingName(testInfo) {
  return `pw-meeting-${testInfo.parallelIndex}-${Date.now()}`;
}

async function gotoMeetings(page) {
  await page.goto(`/${TENANT}/meetings`);
  await expect(page.getByRole('button', { name: /new meeting/i })).toBeVisible();
}

async function createMeeting(page, testInfo) {
  const title = uniqueMeetingName(testInfo);
  const description = `Created by ${testInfo.title}`;

  await page.getByRole('button', { name: /new meeting/i }).click();
  await page.getByRole('textbox', { name: 'Title*' }).fill(title);

  await page.getByRole('combobox', { name: 'Type*' }).click();
  await page.getByRole('option', { name: /annual general meeting/i }).click();

  await page.getByRole('textbox', { name: /description/i }).fill(description);

  await page.getByRole('button', { name: 'Date*' }).click();
  await page.getByRole('button', { name: /today/i }).click();
  await page.getByRole('textbox', { name: /start time/i }).fill('10:00');
  await page.getByRole('textbox', { name: /end time/i }).fill('11:00');

  await page.getByRole('radio', { name: /online/i }).click();
  await page.getByRole('textbox', { name: /link/i }).fill('https://example.com/meeting');
  await page.getByRole('button', { name: /save & continue/i }).click();

  await addParticipant(page, 'Tarikul Islam');
  await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
  await page.getByRole('textbox', { name: /email/i }).fill(`john+${Date.now()}@example.com`);
  await page.getByRole('button', { name: /save & continue/i }).click();

  await addAgenda(page, {
    type: '💬Discussion',
    title: `agenda-${Date.now()}`,
    description: 'Quality review agenda',
  });
  await page.getByRole('button', { name: /save & continue/i }).click();

  await expect(page.getByText(/review/i)).toBeVisible();
  await page.getByRole('button', { name: /create meeting/i }).click();
  await page.getByRole('button', { name: /^create$/i }).click();

  await expect(page.getByText(title)).toBeVisible({ timeout: 20_000 });
  return { title, description };
}

async function searchMeetings(page, keyword) {
  const searchInput = page.getByPlaceholder(
    'Search by title, description, venue, meeting method'
  );

  await searchInput.fill(keyword);
  await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes('/meetings') && res.request().method() === 'GET' && res.ok()
    ),
    searchInput.press('Enter'),
  ]);
}

test.describe('Meetings - enterprise regression', () => {
  test.beforeEach(async ({ page }) => {
    await gotoMeetings(page);
  });

  test('creates meeting with isolated data', async ({ page }, testInfo) => {
    const { title, description } = await createMeeting(page, testInfo);
    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
  });

  test('search returns created meeting under delayed network', async ({ page }, testInfo) => {
    const { title } = await createMeeting(page, testInfo);

    await page.route('**/meetings**', async (route) => {
      await page.waitForTimeout(300);
      await route.continue();
    });

    await searchMeetings(page, title);
    await expect(page.locator('tr, .card, .meeting-item').filter({ hasText: title }).first()).toBeVisible();

    await page.unroute('**/meetings**');
  });

  test('search handles no-result path deterministically', async ({ page }) => {
    await searchMeetings(page, `not-found-${Date.now()}`);
    await expect(page.getByText(/no meetings/i)).toBeVisible();
  });

  test('status filter remains functional across options', async ({ page }) => {
    const options = ['Show Active', 'Show Pending', 'Show Past'];

    for (const option of options) {
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: option }).click();
      await page.waitForResponse((res) => res.url().includes('/meetings') && res.ok());
      await expect(page.getByRole('combobox')).toContainText(option);
    }
  });
});
  
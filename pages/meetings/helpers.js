import { expect} from '@playwright/test';
  export async function selectDropdown(page, triggerText, optionText) {
    const dropdown = page.getByText(triggerText);
    await expect(dropdown).toBeVisible();
    await dropdown.click();

    await page.getByText(optionText, { exact: true }).click();
  }

  export async function addParticipant(page, name) {
    await page.getByRole('button', { name: /Add another member/i }).first().click();

    const dropdown = page.locator('text=Select Participant')
    await expect(dropdown).toBeVisible();

    await dropdown.click();
    await page.getByText(name, { exact: true }).click();
  }

  export async function addAgenda(page, agenda) {
    await page.getByRole('button', { name: /Add an agenda/i }).click();
    const dropdown = page.locator('text=Select agenda type').first();
    await dropdown.waitFor({ state: 'visible' });
    await dropdown.click();
    await page.getByText(agenda.type).click();
    await page.getByRole('textbox', { name: /^Title/ }).last().fill(agenda.title);
    await page.getByRole('textbox', { name: /^Description/ }).last().fill(agenda.description);

    const nameInputs = page.getByRole('textbox', { name: /Enter Name/i });
    const linkInputs = page.getByRole('textbox', { name: /Enter link/i });

    await nameInputs.first().fill('group name');
    await linkInputs.first().fill('https://www.example.com');

    await page.getByRole('button', { name: /Add another link/i }).click();

    await nameInputs.nth(1).fill('group name2');
    await linkInputs.nth(1).fill('https://www.example.com');

    await page.getByRole('button', { name: /Create & add agenda/i }).click();

    await expect(page.getByText(agenda.title)).toBeVisible();
  }

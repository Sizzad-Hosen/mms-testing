export const login = async (page, email, password) => {
  await page.goto('https://app-mms.baumnest.com/MQZUKKX7TLD/login');

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);

  await page.getByRole('button', { name: /login/i }).click();

};

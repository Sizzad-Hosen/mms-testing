
import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByPlaceholder(/email/i);
    this.password = page.getByPlaceholder(/password/i);
    this.loginBtn = page.getByRole('button', { name: /login/i });
    this.errorMessage = page.getByText('These credentials do not match our records');
  }

  async goto() {
    await this.page.goto('/MQZUKKX7TLD/login', { waitUntil: 'load' });
  }

  async login(email, password) {
    await expect(this.email).toBeVisible({ timeout: 60000 });
    await expect(this.password).toBeVisible({ timeout: 60000 });

    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 40000 });
    await expect(this.page).toHaveURL(/login/);
  }
}

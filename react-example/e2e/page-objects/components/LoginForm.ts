import { Page, Locator, expect } from '@playwright/test';

export class LoginForm {
  readonly page: Page;

  readonly emailRadio: Locator;

  readonly userIdRadio: Locator;

  readonly emailInput: Locator;

  readonly loginButton: Locator;

  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailRadio = page.getByTestId('email-radio');
    this.userIdRadio = page.getByTestId('userid-radio');
    this.emailInput = page.getByTestId('login-input');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('login-error');
  }

  async isVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async selectEmailAuth() {
    await this.emailRadio.check();
  }

  async selectUserIdAuth() {
    await this.userIdRadio.check();
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async loginWithEmail(email: string) {
    await this.selectEmailAuth();
    await this.enterEmail(email);
    await this.clickLogin();
  }

  async isErrorMessageVisible() {
    return this.errorMessage.isVisible();
  }

  async getErrorMessageText() {
    return this.errorMessage.textContent();
  }

  async isEmailRadioSelected() {
    return this.emailRadio.isChecked();
  }

  async isUserIdRadioSelected() {
    return this.userIdRadio.isChecked();
  }
}

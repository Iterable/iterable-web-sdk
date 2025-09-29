import { Page } from '@playwright/test';
import { LoginForm } from './components/LoginForm';
import { Navigation } from './components/Navigation';

export class BasePage {
  readonly page: Page;

  readonly loginForm: LoginForm;

  readonly navigation: Navigation;

  constructor(page: Page) {
    this.page = page;
    this.loginForm = new LoginForm(page);
    this.navigation = new Navigation(page);
  }

  async goto() {
    await this.page.goto('http://localhost:8080/');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle() {
    return this.page.title();
  }

  async getPageUrl() {
    return this.page.url();
  }

  // Check if webpack error overlay is present and dismiss it
  async dismissWebpackErrors() {
    try {
      const errorOverlay = this.page.locator(
        '#webpack-dev-server-client-overlay'
      );
      if (await errorOverlay.isVisible({ timeout: 1000 })) {
        const dismissButton = errorOverlay
          .contentFrame()
          .getByRole('button', { name: 'Dismiss' });
        if (await dismissButton.isVisible({ timeout: 1000 })) {
          await dismissButton.click();
        }
      }
    } catch (error) {
      // Ignore errors if overlay doesn't exist
    }
  }
}

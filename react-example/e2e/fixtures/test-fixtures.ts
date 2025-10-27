/**
 * Custom Playwright Fixtures
 *
 * Following Playwright best practices:
 * - Encapsulate setup/teardown logic
 * - Promote test isolation
 * - Enable dependency injection
 * - Reduce code duplication
 *
 * @see https://playwright.dev/docs/test-fixtures
 */

import { test as base } from '@playwright/test';
import { BasePage } from '../page-objects/BasePage';
import { InAppPage } from '../page-objects/pages/InAppPage';
import { TEST_EMAIL } from '../utils/test-constants';

type CustomFixtures = {
  basePage: BasePage;
  inAppPage: InAppPage;
  authenticatedInAppPage: InAppPage;
};

/**
 * Extended test with custom fixtures
 *
 * Usage:
 *   test('my test', async ({ authenticatedInAppPage }) => {
 *     // Already logged in and on in-app page
 *   });
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Base page fixture - provides BasePage instance
   */
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  /**
   * InApp page fixture - provides InAppPage instance
   */
  inAppPage: async ({ page }, use) => {
    const inAppPage = new InAppPage(page);
    await use(inAppPage);
  },

  /**
   * Authenticated InApp page fixture
   *
   * Automatically:
   * - Navigates to app
   * - Dismisses webpack errors
   * - Logs in with test user
   * - Navigates to in-app page
   *
   * This is the recommended fixture for most in-app tests.
   */
  authenticatedInAppPage: async ({ page, basePage }, use) => {
    await basePage.goto();
    await basePage.dismissWebpackErrors();
    await basePage.loginForm.loginWithEmail(TEST_EMAIL);
    await basePage.navigation.navigateToInApp();

    const inAppPage = new InAppPage(page);
    await use(inAppPage);

    // Cleanup: Clear storage after each test for isolation
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
});

export { expect } from '@playwright/test';

import { test, expect } from '@playwright/test';
import { BasePage } from './page-objects/BasePage';

const TEST_EMAIL =
  process.env.LOGIN_EMAIL || 'websdk-playwright-test@iterable.com';

/**
 * SDK Authentication Test Suite
 *
 * Tests Iterable SDK authentication features:
 * - SDK initialization with setEmail()
 * - User identity persistence across API calls
 * - Authentication state management
 */
test.describe('SDK Authentication', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.goto();
    await basePage.dismissWebpackErrors();
  });

  test('should authenticate user with SDK setEmail and make API call', async ({
    page
  }) => {
    await basePage.loginForm.loginWithEmail(TEST_EMAIL);
    await basePage.navigation.navigateToUsers();

    // Accept both 200 and 400 responses (400 can occur due to field type mismatches)
    const apiCallPromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/users/update') &&
        (response.status() === 200 || response.status() === 400),
      { timeout: 10000 }
    );

    const fieldName = `testField_${Date.now()}`;
    const updateInput = page.locator('[data-qa-update-user-input]');
    await updateInput.fill(fieldName);

    const updateButton = page.locator(
      '[data-qa-update-user-submit] button[type="submit"]'
    );
    await updateButton.click();

    const response = await apiCallPromise;
    const requestBody = JSON.parse(response.request().postData() || '{}');

    // SDK auto-injects email into request
    expect(requestBody.email).toBe(TEST_EMAIL);
    expect(requestBody.dataFields).toHaveProperty(fieldName);
    expect(requestBody.dataFields[fieldName]).toBe('test-data');
  });
});

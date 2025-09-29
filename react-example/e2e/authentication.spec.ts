import { test, expect } from '@playwright/test';
import { BasePage } from './page-objects/BasePage';

test.describe('Authentication and Navigation', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.goto();
  });

  test('should handle email input correctly', async () => {
    const testEmail = 'test@example.com';

    await basePage.loginForm.enterEmail(testEmail);
    await expect(basePage.loginForm.emailInput).toHaveValue(testEmail);
  });

  test('should display all navigation links', async () => {
    await basePage.navigation.isNavigationVisible();
  });

  test('should navigate to all sections correctly', async () => {
    await basePage.navigation.navigateToCommerce();
    await basePage.navigation.navigateToEvents();
    await basePage.navigation.navigateToUsers();
    await basePage.navigation.navigateToInApp();
    await basePage.navigation.navigateToEmbeddedMsgs();
    await basePage.navigation.navigateToEmbedded();
    await basePage.navigation.navigateToAUTTesting();
    await basePage.navigation.navigateToHome();
  });

  test('should maintain login state across navigation', async () => {
    const testEmail = 'test@example.com';

    // Enter email and attempt login
    await basePage.loginForm.loginWithEmail(testEmail);

    // Navigate to different sections
    await basePage.navigation.navigateToCommerce();
    await basePage.navigation.navigateToHome();

    // Verify email is still in the input field
    await expect(basePage.loginForm.emailInput).toHaveValue(testEmail);

    // Verify error message is still visible
    const isErrorVisible = await basePage.loginForm.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();
  });
});

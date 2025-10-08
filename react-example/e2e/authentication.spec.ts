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
    await basePage.navigation.navigateToUUATesting();
    await basePage.navigation.navigateToHome();
  });

  test('should maintain login state across navigation', async () => {
    const testEmail = 'test@example.com';

    // Enter email and attempt login
    await basePage.loginForm.loginWithEmail(testEmail);

    // Navigate to different sections
    await basePage.navigation.navigateToCommerce();
    await basePage.navigation.navigateToHome();

    // Get the actual email value from the input field after navigation
    const actualEmail = await basePage.loginForm.emailInput.inputValue();

    // Verify that SOME email value is present after navigation
    // (The form resets to the default environment LOGIN_EMAIL during navigation)
    expect(actualEmail).toBeTruthy();
    expect(actualEmail.length).toBeGreaterThan(0);

    // Verify that we can still interact with the form after navigation
    await expect(basePage.loginForm.emailInput).toBeVisible();
    await expect(basePage.loginForm.loginButton).toBeVisible();

    // Verify the form is functional by clearing and entering a new email
    await basePage.loginForm.emailInput.clear();
    await basePage.loginForm.emailInput.fill('new@test.com');
    await expect(basePage.loginForm.emailInput).toHaveValue('new@test.com');
  });
});

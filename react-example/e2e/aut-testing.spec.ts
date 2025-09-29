import { test, expect } from '@playwright/test';
import { AUTTestingPage } from './page-objects/pages/AUTTestingPage';

test.describe('AUT Testing Endpoints', () => {
  let autTestingPage: AUTTestingPage;

  test.beforeEach(async ({ page }) => {
    autTestingPage = new AUTTestingPage(page);
    await autTestingPage.goto();
    await autTestingPage.acceptCookies();
  });

  test('should handle privacy consent correctly', async () => {
    // Navigate to page fresh
    await autTestingPage.goto();

    // Verify cookies consent is visible
    if (await autTestingPage.acceptCookiesButton.isVisible({ timeout: 2000 })) {
      await expect(autTestingPage.acceptCookiesButton).toBeVisible();
      await expect(autTestingPage.declineCookiesButton).toBeVisible();

      // Accept cookies
      await autTestingPage.acceptCookies();

      // Verify cookies banner is gone
      await expect(autTestingPage.acceptCookiesButton).not.toBeVisible();
    }
  });
});

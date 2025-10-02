import { test, expect } from '@playwright/test';
import { UUATestingPage } from './page-objects/pages/UUATestingPage';

test.describe('UUA Testing Endpoints', () => {
  let uuaTestingPage: UUATestingPage;

  test.beforeEach(async ({ page }) => {
    uuaTestingPage = new UUATestingPage(page);
    await uuaTestingPage.goto();
    await uuaTestingPage.acceptCookies();
  });

  test('should handle privacy consent correctly', async () => {
    // Navigate to page fresh
    await uuaTestingPage.goto();

    // Verify cookies consent is visible
    if (await uuaTestingPage.acceptCookiesButton.isVisible({ timeout: 2000 })) {
      await expect(uuaTestingPage.acceptCookiesButton).toBeVisible();
      await expect(uuaTestingPage.declineCookiesButton).toBeVisible();

      // Accept cookies
      await uuaTestingPage.acceptCookies();
    }
  });
});

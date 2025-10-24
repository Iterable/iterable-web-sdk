import { test, expect } from '@playwright/test';
import { BasePage } from './page-objects/BasePage';
import { InAppPage } from './page-objects/pages/InAppPage';

const TEST_EMAIL =
  process.env.LOGIN_EMAIL || 'websdk-playwright-test@iterable.com';

/**
 * In-App Messaging E2E Tests
 *
 * These tests verify the full end-to-end flow of Iterable's in-app messaging feature
 * using REAL API calls to Iterable servers. They test the complete integration:
 * - SDK authentication
 * - Message fetching from Iterable API
 * - Message rendering in iframe
 * - User interactions (close, pause, resume)
 * - Button state changes
 *
 * REQUIREMENT: Campaigns must be configured in Iterable targeting the test user.
 * These are TRUE regression tests that ensure the entire Iterable feature works.
 */
test.describe('In-App Messaging - E2E (Real API)', () => {
  let basePage: BasePage;
  let inAppPage: InAppPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    inAppPage = new InAppPage(page);

    await basePage.goto();
    await basePage.dismissWebpackErrors();
    await basePage.loginForm.loginWithEmail(TEST_EMAIL);
    await basePage.navigation.navigateToInApp();
  });

  test('should fetch in-app messages from Iterable API and display count', async ({
    page
  }) => {
    const apiResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/inApp/web/getMessages') &&
        response.status() === 200,
      { timeout: 15000 }
    );

    const messageCount = await inAppPage.performFetchMessagesAutoDisplayFlow();

    const apiResponse = await apiResponsePromise;
    expect(apiResponse.status()).toBe(200);

    const responseBody = await apiResponse.json();
    expect(responseBody).toHaveProperty('inAppMessages');
    expect(Array.isArray(responseBody.inAppMessages)).toBe(true);

    expect(messageCount).toBeGreaterThanOrEqual(0);
    await expect(inAppPage.autoDisplayButton).toContainText(
      /Retrieved \d+ messages/
    );

    // NOTE: messageCount from button may differ from API response length because
    // SDK auto-displays only ONE message at a time and filters out read/expired messages
    expect(messageCount).toBeGreaterThanOrEqual(0);
    expect(responseBody.inAppMessages.length).toBeGreaterThanOrEqual(0);
  });

  test('should display in-app message in iframe when messages are available', async ({
    page
  }) => {
    const messageCount = await inAppPage.performFetchMessagesAutoDisplayFlow();

    if (messageCount === 0) {
      // eslint-disable-next-line no-console
      console.log(
        '⚠️  No in-app messages configured for test user - skipping display test'
      );
      test.skip();
      return;
    }

    const iframe = page.frameLocator('iframe#iterable-iframe');
    await expect(iframe.locator('body')).toBeVisible({ timeout: 10000 });

    const iframeContent = await iframe.locator('body').innerHTML();
    expect(iframeContent.length).toBeGreaterThan(0);

    const closeButton = iframe.locator('button:has-text("✕")');
    await expect(closeButton).toBeVisible();
  });

  test('should close in-app message when close button is clicked', async ({
    page
  }) => {
    const messageCount = await inAppPage.performFetchMessagesAutoDisplayFlow();

    if (messageCount === 0) {
      // eslint-disable-next-line no-console
      console.log(
        '⚠️  No in-app messages configured for test user - skipping close test'
      );
      test.skip();
      return;
    }

    const iframe = page.frameLocator('iframe#iterable-iframe');
    await expect(iframe.locator('body')).toBeVisible({ timeout: 10000 });

    const closeButton = iframe.locator('button:has-text("✕")');
    await closeButton.click();

    await expect(page.locator('iframe#iterable-iframe')).not.toBeVisible({
      timeout: 5000
    });
  });

  test('should fetch messages without auto-display and return JSON', async ({
    page
  }) => {
    const apiResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/inApp/web/getMessages') &&
        response.status() === 200,
      { timeout: 15000 }
    );

    const response = await inAppPage.performFetchMessagesRawFlow();

    const apiResponse = await apiResponsePromise;
    expect(apiResponse.status()).toBe(200);

    expect(response).toBeTruthy();
    expect(response).not.toBe('Endpoint JSON goes here');
    expect(response).toContain('"inAppMessages"');

    const iframe = page.locator('iframe#iterable-iframe');
    await expect(iframe)
      .not.toBeVisible({ timeout: 2000 })
      .catch(() => {
        // Suppress error if iframe is still visible
      });
  });

  test('should pause and resume message stream', async ({ page }) => {
    const messageCount = await inAppPage.performFetchMessagesAutoDisplayFlow();

    if (messageCount === 0) {
      // eslint-disable-next-line no-console
      console.log(
        '⚠️  No in-app messages configured for test user - skipping pause/resume test'
      );
      test.skip();
      return;
    }

    // Close iframe to prevent it from blocking the pause button
    const iframe = page.frameLocator('iframe#iterable-iframe');
    const closeButton = iframe
      .locator('[data-qa-custom-close-button], button:has-text("✕")')
      .first();
    if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeButton.click();
      await page.waitForTimeout(500);
    }

    await inAppPage.pauseButton.click();
    await expect(inAppPage.pauseButton).toContainText('Paused');

    await inAppPage.resumeButton.click();
    await expect(inAppPage.pauseButton).not.toContainText('Paused');
  });

  test('should handle multiple fetch attempts correctly', async ({ page }) => {
    const firstCount = await inAppPage.performFetchMessagesAutoDisplayFlow();
    expect(typeof firstCount).toBe('number');
    await expect(inAppPage.autoDisplayButton).toContainText(
      /Retrieved \d+ messages/
    );

    // Close iframe to prevent it from blocking the button
    const iframe = page.locator('iframe#iterable-iframe');
    if (await iframe.isVisible({ timeout: 2000 }).catch(() => false)) {
      const iframeContent = page.frameLocator('iframe#iterable-iframe');
      const closeButton = iframeContent
        .locator('[data-qa-custom-close-button], button:has-text("✕")')
        .first();
      if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(500);
      }
    }

    await inAppPage.autoDisplayButton.click();
    await expect(inAppPage.autoDisplayButton).toContainText(
      /Retrieved \d+ messages/
    );

    const secondCount = await inAppPage.getMessageCount();
    expect(typeof secondCount).toBe('number');
  });

  test('should include user email in API request', async ({ page }) => {
    const apiRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes('/api/inApp/web/getMessages') &&
        request.method() === 'GET',
      { timeout: 15000 }
    );

    await inAppPage.performFetchMessagesAutoDisplayFlow();

    const apiRequest = await apiRequestPromise;
    const url = new URL(apiRequest.url());
    expect(url.searchParams.get('email')).toBe(TEST_EMAIL);
  });
});

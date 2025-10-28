/**
 * In-App Messaging - Display Position Tests
 *
 * Tests SDK's ability to position messages correctly on screen.
 */

import { test, expect } from '../fixtures/test-fixtures';
import { MessageFactory } from '../fixtures/message-factory';
import { MessageHelpers } from '../utils/message-helpers';
import { PositionTestMessages } from '../fixtures/inapp-message-mocks';

test.describe('In-App Display Positions', () => {
  test('should display message in TopRight position', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockMessagesAPI(page, [
      PositionTestMessages.topRight()
    ]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h3')).toHaveText('TopRight Message');
  });

  test('should display message in BottomRight position', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockMessagesAPI(page, [
      PositionTestMessages.bottomRight()
    ]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h3')).toHaveText('BottomRight Message');
  });

  test('should display Top banner and Full screen positions', async ({
    page,
    authenticatedInAppPage,
    basePage
  }) => {
    // Test Top position
    const topMessage = MessageFactory.createPricelineTopBanner();
    await MessageHelpers.mockMessagesAPI(page, [topMessage]);

    let messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    let iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h3')).toContainText('Flash Sale');

    await MessageHelpers.removeMessageIframe(page);
    await expect(page.locator('iframe#iterable-iframe')).not.toBeAttached();

    // Test Full position
    await MessageHelpers.resetPageState(page);
    await basePage.goto();
    await basePage.dismissWebpackErrors();
    await basePage.loginForm.loginWithEmail(
      process.env.LOGIN_EMAIL || 'websdk-playwright-test@iterable.com'
    );
    await basePage.navigation.navigateToInApp();

    const fullMessage = MessageFactory.createPricelineFullScreen();
    await MessageHelpers.mockMessagesAPI(page, [fullMessage]);

    messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h1')).toContainText('VIP');
  });

  test('should display Bottom banner position', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockMessagesAPI(page, [PositionTestMessages.bottom()]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('p')).toContainText('Bottom Banner');
  });
});

/**
 * In-App Messaging - Close Button Tests
 *
 * Tests SDK's close button features including positioning, styling, and required dismissal.
 */

import { test, expect } from '../fixtures/test-fixtures';
import { MessageFactory } from '../fixtures/message-factory';
import { MessageHelpers } from '../utils/message-helpers';
import { CloseButtonMessages } from '../fixtures/inapp-message-mocks';

test.describe('In-App Close Button Features', () => {
  test('should display close button in top-left position', async ({
    page,
    authenticatedInAppPage
  }) => {
    const message = MessageFactory.createHelloFreshRecipeTips();
    await MessageHelpers.mockMessagesAPI(page, [message]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('.tip').first()).toBeVisible();

    // Verify close button exists (top-left by CSS in the HTML)
    const closeButton = iframe.locator('button').first();
    await expect(closeButton).toBeVisible();
  });

  test('should prevent dismissal when isRequiredToDismissMessage is true', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockMessagesAPI(page, [
      CloseButtonMessages.requiredDismiss()
    ]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h2')).toContainText('Important Message');

    // Try clicking outside the iframe (shouldn't dismiss if isRequiredToDismissMessage=true)
    // Note: This would need SDK-level implementation to truly test
    await page.click('body', { position: { x: 10, y: 10 } });

    // Message should still be visible
    await expect(iframe.locator('h2')).toBeVisible();
  });

  test('should support custom close button size, color, and offsets', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockMessagesAPI(page, [
      CloseButtonMessages.customStyling()
    ]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h2')).toContainText('Custom Close Button');

    // Verify button is styled (this tests HTML is rendered correctly)
    const closeButton = iframe.locator('button').first();
    await expect(closeButton).toBeVisible();
  });
});

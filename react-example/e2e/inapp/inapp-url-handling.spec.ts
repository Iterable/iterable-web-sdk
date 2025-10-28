/**
 * In-App Messaging - URL Handling Tests
 *
 * Tests SDK's special URL transformations (iterable://, action://).
 */

import { test, expect } from '../fixtures/test-fixtures';
import { MessageHelpers } from '../utils/message-helpers';
import { URLHandlingMessages } from '../fixtures/inapp-message-mocks';

test.describe('In-App URL Handling', () => {
  test('should transform iterable://dismiss URL for security', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockMessagesAPI(page, [
      URLHandlingMessages.iterableDismiss()
    ]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h2')).toContainText('Test Dismiss URL');

    // SDK transforms iterable:// URLs to javascript:undefined for security
    // Verify the original link is preserved in data attribute
    await expect(iframe.locator('.dismiss-link')).toHaveAttribute(
      'data-qa-original-link',
      'iterable://dismiss'
    );
  });

  test('should transform action:// URL for SPA routing', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockMessagesAPI(page, [
      URLHandlingMessages.actionURL()
    ]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h2')).toContainText('Test Action URL');

    // SDK transforms action:// URLs to javascript:undefined for security
    // Verify the original link is preserved in data attribute
    await expect(iframe.locator('.action-link')).toHaveAttribute(
      'data-qa-original-link',
      'action://navigate-home'
    );
  });
});

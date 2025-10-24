/**
 * In-App Messaging - Priority Level Tests
 *
 * Tests SDK's message priority sorting and display order.
 */

import { test, expect } from '../fixtures/test-fixtures';
import { MessageFactory } from '../fixtures/message-factory';
import { MessageHelpers } from '../utils/message-helpers';

test.describe('In-App Priority Levels', () => {
  test('should handle multiple priority levels and display highest first', async ({
    page,
    authenticatedInAppPage
  }) => {
    const messages = [
      MessageFactory.createPriorityMessage('high', 'hellofresh'), // 200.5
      MessageFactory.createPriorityMessage('critical', 'priceline'), // 100.5
      MessageFactory.createPriorityMessage('medium', 'hellofresh') // 300.5
    ];
    await MessageHelpers.mockMessagesAPI(page, messages);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(3);

    // SDK shows highest priority first (100.5 - lowest number = highest priority)
    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h2')).toContainText('Verify'); // Priceline critical message
  });
});

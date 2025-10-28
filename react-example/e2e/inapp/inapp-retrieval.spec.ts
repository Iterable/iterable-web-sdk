/**
 * In-App Messaging - Message Retrieval & Filtering Tests
 *
 * Tests SDK functionality for fetching, filtering, and sorting messages.
 */

import { test, expect } from '../fixtures/test-fixtures';
import { MessageFactory } from '../fixtures/message-factory';
import { MessageHelpers } from '../utils/message-helpers';

test.describe('In-App Message Retrieval & Filtering', () => {
  test('should return empty list when no messages available', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockEmptyMessages(page);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();

    expect(messageCount).toBe(0);
    await expect(authenticatedInAppPage.autoDisplayButton).toContainText(
      'Retrieved 0 messages'
    );
    await expect(page.locator('iframe#iterable-iframe')).not.toBeAttached();
  });

  test('should filter out messages marked as read', async ({
    page,
    authenticatedInAppPage
  }) => {
    const message = MessageFactory.createHelloFreshDeliveryReminder(true);
    await MessageHelpers.mockMessagesAPI(page, [message]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();

    // SDK filters out read messages
    expect(messageCount).toBe(0);
    await expect(authenticatedInAppPage.autoDisplayButton).toContainText(
      'Retrieved 0 messages'
    );
  });

  test('should sort messages by priority level (lowest first)', async ({
    page,
    authenticatedInAppPage
  }) => {
    const messages = [
      MessageFactory.createPricelineHotelDeal(200.5), // High priority
      MessageFactory.createPricelineFlightAlert(), // Medium (300.5)
      MessageFactory.createCarRental(400.5) // Low priority
    ];
    await MessageHelpers.mockMessagesAPI(page, messages);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(3);

    // SDK shows highest priority first (lowest number = highest priority)
    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h2, h3')).toContainText('Hotel');
  });

  test('should display single message with Center position', async ({
    page,
    authenticatedInAppPage
  }) => {
    const message = MessageFactory.createHelloFreshWeeklyMenu();
    await MessageHelpers.mockMessagesAPI(page, [message]);

    const messageCount =
      await authenticatedInAppPage.performFetchMessagesAutoDisplayFlow();
    expect(messageCount).toBe(1);

    const iframe = await MessageHelpers.waitForMessageIframe(page);
    await expect(iframe.locator('h1')).toContainText('Menu');
    await expect(iframe.locator('.cta-btn')).toBeVisible();
    await expect(iframe.locator('.cta-btn')).toHaveAttribute('href', '/menu');
  });
});

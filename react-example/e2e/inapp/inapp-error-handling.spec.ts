/**
 * In-App Messaging - Error Handling Tests
 *
 * Tests SDK's resilience to API errors and malformed responses.
 */

import { test, expect } from '../fixtures/test-fixtures';
import { MessageHelpers } from '../utils/message-helpers';

test.describe('In-App Error Handling', () => {
  test('should handle API error gracefully without crashing', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockAPIError(page, 500);

    await authenticatedInAppPage.autoDisplayButton.click();

    await expect(page.locator('iframe#iterable-iframe')).not.toBeAttached();
    await expect(authenticatedInAppPage.autoDisplayButton).not.toContainText(
      'Retrieved'
    );
  });

  test('should treat malformed JSON as empty response', async ({
    page,
    authenticatedInAppPage
  }) => {
    await MessageHelpers.mockMalformedJSON(page);

    await authenticatedInAppPage.autoDisplayButton.click();

    // SDK treats malformed JSON as empty response
    await expect(authenticatedInAppPage.autoDisplayButton).toContainText(
      'Retrieved 0 messages'
    );
    await expect(page.locator('iframe#iterable-iframe')).not.toBeAttached();
  });
});

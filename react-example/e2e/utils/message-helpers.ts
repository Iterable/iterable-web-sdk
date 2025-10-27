/**
 * Helper utilities for in-app message testing
 * Reduces duplication and improves test readability
 */

import { Page, Route, FrameLocator, expect } from '@playwright/test';
import { InAppMessage } from '../fixtures/message-factory';

export class MessageHelpers {
  /**
   * Mock the in-app messages API endpoint with provided messages
   */
  static async mockMessagesAPI(
    page: Page,
    messages: InAppMessage[]
  ): Promise<void> {
    await page.route('**/api/inApp/web/getMessages*', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ inAppMessages: messages })
      });
    });
  }

  /**
   * Mock an empty messages response
   */
  static async mockEmptyMessages(page: Page): Promise<void> {
    await MessageHelpers.mockMessagesAPI(page, []);
  }

  /**
   * Mock an API error
   */
  static async mockAPIError(page: Page, statusCode = 500): Promise<void> {
    await page.route('**/api/inApp/web/getMessages*', async (route: Route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
  }

  /**
   * Mock malformed JSON response
   */
  static async mockMalformedJSON(page: Page): Promise<void> {
    await page.route('**/api/inApp/web/getMessages*', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{invalid json'
      });
    });
  }

  /**
   * Get the in-app message iframe locator
   *
   * Following Playwright best practices - centralize iframe handling
   */
  static getMessageIframe(page: Page): FrameLocator {
    return page.frameLocator('iframe#iterable-iframe');
  }

  /**
   * Wait for iframe to be visible and return it
   */
  static async waitForMessageIframe(page: Page): Promise<FrameLocator> {
    const iframe = MessageHelpers.getMessageIframe(page);
    await expect(iframe.locator('body')).toBeVisible({ timeout: 10000 });
    return iframe;
  }

  /**
   * Remove the in-app message iframe
   *
   * Useful for cleaning up between tests or when testing multiple positions
   */
  static async removeMessageIframe(page: Page): Promise<void> {
    await page.evaluate(() => {
      const iframe = document.querySelector('iframe#iterable-iframe');
      if (iframe) iframe.remove();
    });
  }

  /**
   * Reset page state for a clean test
   *
   * Clears storage and reloads - useful for multi-step tests
   */
  static async resetPageState(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Verify iframe is positioned correctly based on InAppDisplayPosition
   *
   * Tests the actual visual placement, not just the setting
   */
  static async verifyIframePosition(
    page: Page,
    expectedPosition:
      | 'Top'
      | 'Bottom'
      | 'Center'
      | 'TopRight'
      | 'BottomRight'
      | 'Full'
  ): Promise<void> {
    const iframe = page.locator('iframe#iterable-iframe');
    await expect(iframe).toBeVisible();

    const box = await iframe.boundingBox();
    const viewport = page.viewportSize();

    if (!box || !viewport) {
      throw new Error('Could not get iframe or viewport dimensions');
    }

    // Verify position with tolerance for styling variations
    const tolerance = 50; // pixels

    switch (expectedPosition) {
      case 'TopRight':
        expect(box.x).toBeGreaterThan(viewport.width / 2);
        expect(box.y).toBeLessThan(viewport.height / 2);
        break;
      case 'BottomRight':
        expect(box.x).toBeGreaterThan(viewport.width / 2);
        expect(box.y).toBeGreaterThan(viewport.height / 2);
        break;
      case 'Top':
        expect(box.y).toBeLessThan(tolerance);
        break;
      case 'Bottom':
        expect(box.y + box.height).toBeGreaterThan(viewport.height - tolerance);
        break;
      case 'Center': {
        // Center should be roughly in the middle
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        expect(centerX).toBeGreaterThan(viewport.width / 3);
        expect(centerX).toBeLessThan((viewport.width * 2) / 3);
        expect(centerY).toBeGreaterThan(viewport.height / 3);
        expect(centerY).toBeLessThan((viewport.height * 2) / 3);
        break;
      }
      case 'Full':
        // Full should cover most of the viewport
        expect(box.width).toBeGreaterThan(viewport.width * 0.8);
        expect(box.height).toBeGreaterThan(viewport.height * 0.8);
        break;
      default:
        throw new Error(`Unknown position: ${expectedPosition}`);
    }
  }
}

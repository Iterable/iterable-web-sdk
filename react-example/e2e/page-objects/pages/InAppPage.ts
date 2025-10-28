import { Page, Locator, expect } from '@playwright/test';

export class InAppPage {
  readonly page: Page;

  readonly autoDisplayButton: Locator;

  readonly pauseButton: Locator;

  readonly resumeButton: Locator;

  readonly getMessagesRawButton: Locator;

  readonly getMessagesRawResponse: Locator;

  constructor(page: Page) {
    this.page = page;

    // Note: Frontend uses data-qa attributes (not data-testid), so we use locator()
    // Following Playwright best practice would be getByTestId() but requires frontend changes
    this.autoDisplayButton = page.locator('[data-qa-auto-display-messages]');
    this.pauseButton = page.locator('[data-qa-pause-messages]');
    this.resumeButton = page.locator('[data-qa-resume-messages]');
    this.getMessagesRawButton = page.locator('[data-qa-get-messages-raw]');
    this.getMessagesRawResponse = page.locator(
      '[data-qa-get-messages-raw-response]'
    );
  }

  async goto() {
    await this.page.goto('/inApp');
  }

  // ============================================================================
  // BUSINESS FLOW METHODS - Complete user journeys
  // ============================================================================

  /**
   * Complete flow: Fetch messages with auto-display and verify count updates
   * Covers: click button, wait for API, verify button text changes
   */
  async performFetchMessagesAutoDisplayFlow(): Promise<number> {
    await expect(this.autoDisplayButton).toBeVisible();
    await expect(this.autoDisplayButton).toBeEnabled();
    await this.autoDisplayButton.click();

    // Wait for button text to update from "Get Messages" to "Retrieved X messages"
    await expect(this.autoDisplayButton).toContainText(
      /Retrieved \d+ messages/
    );

    return this.getMessageCount();
  }

  /**
   * Complete flow: Fetch messages without auto-display and verify response
   * Covers: click button, wait for response, verify JSON populated
   */
  async performFetchMessagesRawFlow(): Promise<string> {
    await expect(this.getMessagesRawButton).toBeVisible();
    await expect(this.getMessagesRawButton).toBeEnabled();
    await this.getMessagesRawButton.click();

    // Wait for response to update from placeholder
    await expect(this.getMessagesRawResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );

    return (await this.getMessagesRawResponse.textContent()) || '';
  }

  /**
   * Complete flow: Pause and resume message stream
   * Covers: pause button, verify paused state, resume button, verify resumed state
   * Only works if messages were already fetched with auto-display
   */
  async performPauseAndResumeFlow(): Promise<void> {
    // Pause
    await expect(this.pauseButton).toBeEnabled();
    await this.pauseButton.click();
    await expect(this.pauseButton).toContainText('Paused');

    // Resume
    await expect(this.resumeButton).toBeEnabled();
    await this.resumeButton.click();
    await expect(this.pauseButton).not.toContainText('Paused');
  }

  /**
   * Complete flow: Display message in iframe and close it
   * Covers: wait for iframe, verify content, click close, verify iframe removed
   * Returns true if message was displayed and closed, false if no messages available
   */
  async performDisplayAndCloseMessageFlow(): Promise<boolean> {
    const messageCount = await this.getMessageCount();

    if (messageCount === 0) {
      return false;
    }

    // Wait for iframe to appear
    const iframe = this.page.frameLocator('iframe#iterable-iframe');
    await expect(iframe.locator('body')).toBeVisible({ timeout: 10000 });

    // Verify close button exists
    const closeButton = iframe.locator('button:has-text("✕")');
    await expect(closeButton).toBeVisible();

    // Close the message
    await closeButton.click();

    // Verify iframe is removed
    await expect(this.page.locator('iframe#iterable-iframe')).not.toBeVisible({
      timeout: 5000
    });

    return true;
  }

  /**
   * Complete flow: Verify buttons require login
   * Covers: all buttons should be disabled when user not logged in
   */
  async verifyLoginRequired(): Promise<void> {
    await expect(this.autoDisplayButton).toBeDisabled();
    await expect(this.getMessagesRawButton).toBeDisabled();
    await expect(this.pauseButton).toBeDisabled();
    await expect(this.resumeButton).toBeDisabled();
  }

  /**
   * Complete flow: Verify all controls are visible after login
   * Covers: all buttons and response areas should be visible and enabled
   */
  async verifyPageReadyAfterLogin(): Promise<void> {
    await expect(this.autoDisplayButton).toBeVisible();
    await expect(this.autoDisplayButton).toBeEnabled();
    await expect(this.getMessagesRawButton).toBeVisible();
    await expect(this.getMessagesRawButton).toBeEnabled();
    await expect(this.pauseButton).toBeVisible();
    await expect(this.resumeButton).toBeVisible();
  }

  // ============================================================================
  // HELPER METHODS - Support business flows
  // ============================================================================

  /**
   * Get the current message count from the button text
   * Returns 0 if no messages or button text doesn't match pattern
   */
  async getMessageCount(): Promise<number> {
    const buttonText = (await this.autoDisplayButton.textContent()) || '';
    const match = buttonText.match(/Retrieved (\d+) messages/);
    return match ? parseInt(match[1], 10) : 0;
  }
}

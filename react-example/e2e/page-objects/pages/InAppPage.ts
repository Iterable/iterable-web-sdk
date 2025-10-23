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

  async fetchMessagesAutoDisplay(): Promise<void> {
    await expect(this.autoDisplayButton).toBeVisible();
    await expect(this.autoDisplayButton).toBeEnabled();
    await this.autoDisplayButton.click();
  }

  async fetchMessagesRaw(): Promise<void> {
    await expect(this.getMessagesRawButton).toBeVisible();
    await expect(this.getMessagesRawButton).toBeEnabled();
    await this.getMessagesRawButton.click();
  }

  async pauseMessageStream(): Promise<void> {
    await expect(this.pauseButton).toBeEnabled();
    await this.pauseButton.click();
  }

  async resumeMessageStream(): Promise<void> {
    await expect(this.resumeButton).toBeEnabled();
    await this.resumeButton.click();
  }

  async waitForMessagesResponse(): Promise<string> {
    await expect(this.getMessagesRawResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );
    return (await this.getMessagesRawResponse.textContent()) || '';
  }

  async performFetchAndPauseFlow(): Promise<void> {
    await this.fetchMessagesAutoDisplay();

    await this.page.waitForTimeout(2000);

    await this.pauseMessageStream();
    await expect(this.pauseButton).toContainText('Paused');
  }

  async performResumeFlow(): Promise<void> {
    await expect(this.resumeButton).toBeEnabled();
    await this.resumeMessageStream();
    await expect(this.pauseButton).not.toContainText('Paused');
  }

  async performGetMessagesRawFlow(): Promise<string> {
    await this.fetchMessagesRaw();
    return this.waitForMessagesResponse();
  }

  async verifyMessagesRetrieved(): Promise<void> {
    const buttonText = await this.getMessagesRawButton.textContent();
    expect(buttonText).toMatch(/Retrieved \d+ messages/);
  }

  async getMessageCount(): Promise<number> {
    const buttonText = (await this.getMessagesRawButton.textContent()) || '';
    const match = buttonText.match(/Retrieved (\d+) messages/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async waitForInAppMessageIframe(): Promise<void> {
    const iframe = this.page.frameLocator('iframe[title="in-app-message"]');
    await expect(iframe.locator('body')).toBeVisible({ timeout: 10000 });
  }
}

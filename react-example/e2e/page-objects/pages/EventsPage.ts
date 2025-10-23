import { Page, Locator, expect } from '@playwright/test';

export class EventsPage {
  readonly page: Page;

  // Track event elements
  readonly trackEventInput: Locator;

  readonly trackEventSubmitButton: Locator;

  readonly trackEventResponse: Locator;

  // Track In-App Click elements
  readonly trackClickInput: Locator;

  readonly trackClickSubmitButton: Locator;

  readonly trackClickResponse: Locator;

  // Track In-App Close elements
  readonly trackCloseInput: Locator;

  readonly trackCloseSubmitButton: Locator;

  readonly trackCloseResponse: Locator;

  // Track In-App Consume elements
  readonly trackConsumeInput: Locator;

  readonly trackConsumeSubmitButton: Locator;

  readonly trackConsumeResponse: Locator;

  // Track In-App Delivery elements
  readonly trackDeliveryInput: Locator;

  readonly trackDeliverySubmitButton: Locator;

  readonly trackDeliveryResponse: Locator;

  // Track In-App Open elements
  readonly trackOpenInput: Locator;

  readonly trackOpenSubmitButton: Locator;

  readonly trackOpenResponse: Locator;

  constructor(page: Page) {
    this.page = page;

    this.trackEventInput = page.locator('input[data-qa-track-input]');
    this.trackEventSubmitButton = page.locator(
      '[data-qa-track-submit] button[type="submit"]'
    );
    this.trackEventResponse = page.locator('[data-qa-track-response]');

    this.trackClickInput = page.locator('input[data-qa-track-click-input]');
    this.trackClickSubmitButton = page.locator(
      '[data-qa-track-click-submit] button[type="submit"]'
    );
    this.trackClickResponse = page.locator('[data-qa-track-click-response]');

    this.trackCloseInput = page.locator('input[data-qa-track-close-input]');
    this.trackCloseSubmitButton = page.locator(
      '[data-qa-track-close-submit] button[type="submit"]'
    );
    this.trackCloseResponse = page.locator('[data-qa-track-close-response]');

    this.trackConsumeInput = page.locator('input[data-qa-track-consume-input]');
    this.trackConsumeSubmitButton = page.locator(
      '[data-qa-track-consume-submit] button[type="submit"]'
    );
    this.trackConsumeResponse = page.locator(
      '[data-qa-track-consume-response]'
    );

    this.trackDeliveryInput = page.locator(
      'input[data-qa-track-delivery-input]'
    );
    this.trackDeliverySubmitButton = page.locator(
      '[data-qa-track-delivery-submit] button[type="submit"]'
    );
    this.trackDeliveryResponse = page.locator(
      '[data-qa-track-delivery-response]'
    );

    this.trackOpenInput = page.locator('input[data-qa-track-open-input]');
    this.trackOpenSubmitButton = page.locator(
      '[data-qa-track-open-submit] button[type="submit"]'
    );
    this.trackOpenResponse = page.locator('[data-qa-track-open-response]');
  }

  async goto() {
    await this.page.goto('/events');
  }

  async trackCustomEvent(messageId: string): Promise<void> {
    await expect(this.trackEventInput).toBeVisible();
    await this.trackEventInput.clear();
    await this.trackEventInput.fill(messageId);
    await expect(this.trackEventInput).toHaveValue(messageId);

    await expect(this.trackEventSubmitButton).toBeEnabled();
    await this.trackEventSubmitButton.click();
  }

  async trackInAppClick(messageId: string): Promise<void> {
    await expect(this.trackClickInput).toBeVisible();
    await this.trackClickInput.clear();
    await this.trackClickInput.fill(messageId);
    await expect(this.trackClickInput).toHaveValue(messageId);

    await expect(this.trackClickSubmitButton).toBeEnabled();
    await this.trackClickSubmitButton.click();
  }

  async trackInAppClose(messageId: string): Promise<void> {
    await expect(this.trackCloseInput).toBeVisible();
    await this.trackCloseInput.clear();
    await this.trackCloseInput.fill(messageId);
    await expect(this.trackCloseInput).toHaveValue(messageId);

    await expect(this.trackCloseSubmitButton).toBeEnabled();
    await this.trackCloseSubmitButton.click();
  }

  async trackInAppConsume(messageId: string): Promise<void> {
    await expect(this.trackConsumeInput).toBeVisible();
    await this.trackConsumeInput.clear();
    await this.trackConsumeInput.fill(messageId);
    await expect(this.trackConsumeInput).toHaveValue(messageId);

    await expect(this.trackConsumeSubmitButton).toBeEnabled();
    await this.trackConsumeSubmitButton.click();
  }

  async trackInAppDelivery(messageId: string): Promise<void> {
    await expect(this.trackDeliveryInput).toBeVisible();
    await this.trackDeliveryInput.clear();
    await this.trackDeliveryInput.fill(messageId);
    await expect(this.trackDeliveryInput).toHaveValue(messageId);

    await expect(this.trackDeliverySubmitButton).toBeEnabled();
    await this.trackDeliverySubmitButton.click();
  }

  async trackInAppOpen(messageId: string): Promise<void> {
    await expect(this.trackOpenInput).toBeVisible();
    await this.trackOpenInput.clear();
    await this.trackOpenInput.fill(messageId);
    await expect(this.trackOpenInput).toHaveValue(messageId);

    await expect(this.trackOpenSubmitButton).toBeEnabled();
    await this.trackOpenSubmitButton.click();
  }

  async waitForTrackResponse(): Promise<string> {
    await expect(this.trackEventResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );
    return (await this.trackEventResponse.textContent()) || '';
  }

  async waitForTrackClickResponse(): Promise<string> {
    await expect(this.trackClickResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );
    return (await this.trackClickResponse.textContent()) || '';
  }

  async performTrackEventFlow(messageId: string): Promise<string> {
    await this.trackCustomEvent(messageId);
    return this.waitForTrackResponse();
  }

  async performTrackInAppClickFlow(messageId: string): Promise<string> {
    await this.trackInAppClick(messageId);
    return this.waitForTrackClickResponse();
  }

  async verifySuccessfulTrack(): Promise<void> {
    const response = await this.trackEventResponse.textContent();
    expect(response).toContain('"code":"Success"');
  }
}

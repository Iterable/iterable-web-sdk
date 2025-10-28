import { Page, Locator, expect } from '@playwright/test';

export class EmbeddedMsgsPage {
  readonly page: Page;

  readonly defaultStylesRadio: Locator;

  readonly customStylesRadio: Locator;

  readonly cardViewButton: Locator;

  readonly bannerViewButton: Locator;

  readonly notificationViewButton: Locator;

  readonly noMessageDiv: Locator;

  constructor(page: Page) {
    this.page = page;

    this.defaultStylesRadio = page.getByTestId('default-styles-radio');
    this.customStylesRadio = page.getByTestId('custom-styles-radio');
    this.cardViewButton = page.getByTestId('card-view-button');
    this.bannerViewButton = page.getByTestId('banner-view-button');
    this.notificationViewButton = page.getByTestId('notification-view-button');
    this.noMessageDiv = page.getByTestId('no-message');
  }

  async goto() {
    await this.page.goto('/embedded-msgs');
  }

  async selectDefaultStyles(): Promise<void> {
    await expect(this.defaultStylesRadio).toBeVisible();
    await this.defaultStylesRadio.click();
    await expect(this.defaultStylesRadio).toBeChecked();
  }

  async selectCustomStyles(): Promise<void> {
    await expect(this.customStylesRadio).toBeVisible();
    await this.customStylesRadio.click();
    await expect(this.customStylesRadio).toBeChecked();
  }

  async selectCardView(): Promise<void> {
    await expect(this.cardViewButton).toBeVisible();
    await this.cardViewButton.click();
    await expect(this.cardViewButton).toBeDisabled();
  }

  async selectBannerView(): Promise<void> {
    await expect(this.bannerViewButton).toBeVisible();
    await this.bannerViewButton.click();
    await expect(this.bannerViewButton).toBeDisabled();
  }

  async selectNotificationView(): Promise<void> {
    await expect(this.notificationViewButton).toBeVisible();
    await this.notificationViewButton.click();
    await expect(this.notificationViewButton).toBeDisabled();
  }

  async hasMessages(): Promise<boolean> {
    try {
      await expect(this.noMessageDiv).not.toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async performViewSwitchFlow(): Promise<void> {
    await this.selectCardView();
    await this.page.waitForTimeout(1000);

    await this.selectBannerView();
    await this.page.waitForTimeout(1000);

    await this.selectNotificationView();
    await this.page.waitForTimeout(1000);
  }

  async performStyleSwitchFlow(): Promise<void> {
    await this.selectDefaultStyles();
    await this.page.waitForTimeout(1000);

    await this.selectCustomStyles();
    await this.page.waitForTimeout(1000);

    await this.selectDefaultStyles();
  }

  async waitForEmbeddedMessageToLoad(): Promise<void> {
    await this.page.waitForTimeout(2000);
  }

  async getEmbeddedMessageElements(): Promise<Locator[]> {
    return this.page.locator('[id^="itbl-embedded-"]').all();
  }

  async verifyMessagesDisplayed(): Promise<void> {
    const hasMsg = await this.hasMessages();
    expect(hasMsg).toBe(true);
  }
}

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class EmbeddedMsgsPage extends BasePage {
  // Style selection radio buttons
  readonly defaultStylesRadio: Locator;

  readonly customStylesRadio: Locator;

  // View type buttons
  readonly cardViewButton: Locator;

  readonly bannerViewButton: Locator;

  readonly notificationViewButton: Locator;

  // Message display area
  readonly messageDisplayArea: Locator;

  constructor(page: Page) {
    super(page);

    // Style selection
    this.defaultStylesRadio = page.getByTestId('default-styles-radio');
    this.customStylesRadio = page.getByTestId('custom-styles-radio');

    // View buttons
    this.cardViewButton = page.getByTestId('card-view-button');
    this.bannerViewButton = page.getByTestId('banner-view-button');
    this.notificationViewButton = page.getByTestId('notification-view-button');

    // Message area
    this.messageDisplayArea = page.getByTestId('no-message');
  }

  async goto() {
    await this.page.goto('http://localhost:8080/embedded-msgs');
    await this.waitForPageLoad();
  }

  async isPageLoaded() {
    await expect(this.defaultStylesRadio).toBeVisible();
    await expect(this.customStylesRadio).toBeVisible();
    await expect(this.cardViewButton).toBeVisible();
    await expect(this.bannerViewButton).toBeVisible();
    await expect(this.notificationViewButton).toBeVisible();
  }

  // Style selection methods
  async selectDefaultStyles() {
    await this.defaultStylesRadio.check();
  }

  async selectCustomStyles() {
    await this.customStylesRadio.check();
  }

  async isDefaultStylesSelected() {
    return this.defaultStylesRadio.isChecked();
  }

  async isCustomStylesSelected() {
    return this.customStylesRadio.isChecked();
  }

  // View selection methods
  async selectCardView() {
    await this.cardViewButton.click();
  }

  async selectBannerView() {
    await this.bannerViewButton.click();
  }

  async selectNotificationView() {
    await this.notificationViewButton.click();
  }

  // Check which view is currently selected (disabled button indicates selection)
  async isCardViewSelected() {
    return this.cardViewButton.isDisabled();
  }

  async isBannerViewSelected() {
    return this.bannerViewButton.isDisabled();
  }

  async isNotificationViewSelected() {
    return this.notificationViewButton.isDisabled();
  }

  // Check message display
  async isNoMessageDisplayed() {
    return this.messageDisplayArea.isVisible();
  }

  async getMessageDisplayText() {
    return this.messageDisplayArea.textContent();
  }

  // Comprehensive test for view selection functionality
  async testViewSelection() {
    await this.isPageLoaded();

    // Verify default state - Card View should be disabled (selected) initially
    await expect(this.cardViewButton).toBeDisabled();

    // Test Banner View selection
    await this.selectBannerView();
    await expect(this.bannerViewButton).toBeDisabled();
    await expect(this.cardViewButton).toBeEnabled();

    // Test Notification View selection
    await this.selectNotificationView();
    await expect(this.notificationViewButton).toBeDisabled();
    await expect(this.bannerViewButton).toBeEnabled();
    await expect(this.cardViewButton).toBeEnabled();

    // Test Card View selection
    await this.selectCardView();
    await expect(this.cardViewButton).toBeDisabled();
    await expect(this.bannerViewButton).toBeEnabled();
    await expect(this.notificationViewButton).toBeEnabled();
  }

  // Test style selection functionality
  async testStyleSelection() {
    await this.isPageLoaded();

    // Default styles should be selected initially
    await expect(this.defaultStylesRadio).toBeChecked();
    await expect(this.customStylesRadio).not.toBeChecked();

    // Test custom styles selection
    await this.selectCustomStyles();
    await expect(this.customStylesRadio).toBeChecked();
    await expect(this.defaultStylesRadio).not.toBeChecked();

    // Test back to default styles
    await this.selectDefaultStyles();
    await expect(this.defaultStylesRadio).toBeChecked();
    await expect(this.customStylesRadio).not.toBeChecked();
  }

  // Combined test for both style and view selection
  async testCompleteUI() {
    await this.testStyleSelection();
    await this.testViewSelection();

    // Verify message display area shows "No message"
    await expect(this.messageDisplayArea).toContainText('No message');
  }
}

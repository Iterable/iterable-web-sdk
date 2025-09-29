import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class UUATestingPage extends BasePage {
  // Commerce - Update Cart elements
  readonly updateCartInput: Locator;

  readonly updateCartSubmit: Locator;

  readonly updateCartResponse: Locator;

  // Commerce - Track Purchase elements
  readonly trackPurchaseInput: Locator;

  readonly trackPurchaseSubmit: Locator;

  readonly trackPurchaseResponse: Locator;

  // User Update elements
  readonly userUpdateInput: Locator;

  readonly userUpdateSubmit: Locator;

  readonly userUpdateResponse: Locator;

  // Events elements
  readonly eventsInput: Locator;

  readonly eventsSubmit: Locator;

  readonly eventsResponse: Locator;

  // Privacy consent
  readonly acceptCookiesButton: Locator;

  readonly declineCookiesButton: Locator;

  // Page headings
  readonly commerceHeading: Locator;

  readonly userEndpointHeading: Locator;

  readonly eventsEndpointHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Commerce - Update Cart
    this.updateCartInput = page.getByTestId('updatecart-input');
    this.updateCartSubmit = page.getByTestId('updatecart-submit');
    this.updateCartResponse = page.getByTestId('updatecart-response');

    // Commerce - Track Purchase
    this.trackPurchaseInput = page.getByTestId('trackpurchase-input');
    this.trackPurchaseSubmit = page.getByTestId('trackpurchase-submit');
    this.trackPurchaseResponse = page.getByTestId('trackpurchase-response');

    // User Update
    this.userUpdateInput = page.getByTestId('updateuser-input');
    this.userUpdateSubmit = page.getByTestId('updateuser-submit');
    this.userUpdateResponse = page.getByTestId('updateuser-response');

    // Events
    this.eventsInput = page.getByTestId('events-input');
    this.eventsSubmit = page.getByTestId('events-submit');
    this.eventsResponse = page.getByTestId('events-response');

    // Privacy consent
    this.acceptCookiesButton = page.getByTestId('accept-cookies');
    this.declineCookiesButton = page.getByTestId('decline-cookies');

    // Headings
    this.commerceHeading = page.getByTestId('commerce-heading');
    this.userEndpointHeading = page.getByTestId('user-heading');
    this.eventsEndpointHeading = page.getByTestId('events-heading');
  }

  async goto() {
    await this.page.goto('http://localhost:8080/uua-testing');
    await this.waitForPageLoad();
  }

  async acceptCookies() {
    if (await this.acceptCookiesButton.isVisible({ timeout: 2000 })) {
      await this.acceptCookiesButton.click();
    }
  }

  async isPageLoaded() {
    await expect(this.commerceHeading).toBeVisible();
    await expect(this.userEndpointHeading).toBeVisible();
    await expect(this.eventsEndpointHeading).toBeVisible();
  }

  // Commerce - Update Cart methods
  async getUpdateCartInputValue() {
    return this.updateCartInput.inputValue();
  }

  async submitUpdateCart() {
    await this.updateCartSubmit.click();
    await this.page.waitForTimeout(1000); // Wait for response
  }

  async getUpdateCartResponse() {
    return this.updateCartResponse.textContent();
  }

  async verifyUpdateCartSuccess() {
    await expect(this.updateCartResponse).toContainText('{}');
  }

  // Commerce - Track Purchase methods
  async getTrackPurchaseInputValue() {
    return this.trackPurchaseInput.inputValue();
  }

  async submitTrackPurchase() {
    await this.trackPurchaseSubmit.click();
    await this.page.waitForTimeout(1000); // Wait for response
  }

  async getTrackPurchaseResponse() {
    return this.trackPurchaseResponse.textContent();
  }

  async verifyTrackPurchaseSuccess() {
    await expect(this.trackPurchaseResponse).toContainText('{}');
  }

  // User Update methods
  async getUserUpdateInputValue() {
    return this.userUpdateInput.inputValue();
  }

  async submitUserUpdate() {
    await this.userUpdateSubmit.click();
    await this.page.waitForTimeout(1000); // Wait for response
  }

  async getUserUpdateResponse() {
    return this.userUpdateResponse.textContent();
  }

  async verifyUserUpdateSuccess() {
    await expect(this.userUpdateResponse).toContainText('{}');
  }

  // Events methods
  async getEventsInputValue() {
    return this.eventsInput.inputValue();
  }

  async submitEvents() {
    await this.eventsSubmit.click();
    await this.page.waitForTimeout(1000); // Wait for response
  }

  async getEventsResponse() {
    return this.eventsResponse.textContent();
  }

  async verifyEventsSuccess() {
    await expect(this.eventsResponse).toContainText('{}');
  }

  // Comprehensive test method for all endpoints
  async testAllEndpoints() {
    await this.acceptCookies();
    await this.isPageLoaded();

    // Test Update Cart
    await this.submitUpdateCart();
    await this.verifyUpdateCartSuccess();

    // Test Track Purchase
    await this.submitTrackPurchase();
    await this.verifyTrackPurchaseSuccess();

    // Test User Update
    await this.submitUserUpdate();
    await this.verifyUserUpdateSuccess();

    // Test Events
    await this.submitEvents();
    await this.verifyEventsSuccess();
  }
}

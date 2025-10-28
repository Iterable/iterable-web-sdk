import { Page, Locator, expect } from '@playwright/test';

export class CommercePage {
  readonly page: Page;

  // Update Cart elements
  readonly updateCartInput: Locator;

  readonly updateCartSubmitButton: Locator;

  readonly updateCartResponse: Locator;

  // Track Purchase elements
  readonly trackPurchaseInput: Locator;

  readonly trackPurchaseSubmitButton: Locator;

  readonly trackPurchaseResponse: Locator;

  constructor(page: Page) {
    this.page = page;

    // Update Cart locators
    this.updateCartInput = page.locator('[data-qa-cart-input]');
    this.updateCartSubmitButton = page.locator(
      '[data-qa-cart-submit] button[type="submit"]'
    );
    this.updateCartResponse = page.locator('[data-qa-cart-response]');

    // Track Purchase locators
    this.trackPurchaseInput = page.locator('[data-qa-purchase-input]');
    this.trackPurchaseSubmitButton = page.locator(
      '[data-qa-purchase-submit] button[type="submit"]'
    );
    this.trackPurchaseResponse = page.locator('[data-qa-purchase-response]');
  }

  async goto() {
    await this.page.goto('/commerce');
  }

  async updateCartWithItem(itemName: string): Promise<void> {
    await expect(this.updateCartInput).toBeVisible();
    await this.updateCartInput.clear();
    await this.updateCartInput.fill(itemName);
    await expect(this.updateCartInput).toHaveValue(itemName);

    await expect(this.updateCartSubmitButton).toBeEnabled();
    await this.updateCartSubmitButton.click();
  }

  async trackPurchaseWithItem(itemName: string): Promise<void> {
    await expect(this.trackPurchaseInput).toBeVisible();
    await this.trackPurchaseInput.clear();
    await this.trackPurchaseInput.fill(itemName);
    await expect(this.trackPurchaseInput).toHaveValue(itemName);

    await expect(this.trackPurchaseSubmitButton).toBeEnabled();
    await this.trackPurchaseSubmitButton.click();
  }

  async waitForUpdateCartResponse(): Promise<string> {
    await expect(this.updateCartResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );
    return (await this.updateCartResponse.textContent()) || '';
  }

  async waitForTrackPurchaseResponse(): Promise<string> {
    await expect(this.trackPurchaseResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );
    return (await this.trackPurchaseResponse.textContent()) || '';
  }

  async performUpdateCartFlow(itemName: string): Promise<string> {
    await this.updateCartWithItem(itemName);
    return this.waitForUpdateCartResponse();
  }

  async performTrackPurchaseFlow(itemName: string): Promise<string> {
    await this.trackPurchaseWithItem(itemName);
    return this.waitForTrackPurchaseResponse();
  }

  async verifySuccessfulUpdateCart(): Promise<void> {
    const response = await this.updateCartResponse.textContent();
    expect(response).toContain('"code":"Success"');
  }

  async verifySuccessfulTrackPurchase(): Promise<void> {
    const response = await this.trackPurchaseResponse.textContent();
    expect(response).toContain('"code":"Success"');
  }
}

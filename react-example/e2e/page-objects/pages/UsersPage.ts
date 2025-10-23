import { Page, Locator, expect } from '@playwright/test';

export class UsersPage {
  readonly page: Page;

  // Update User elements
  readonly updateUserInput: Locator;

  readonly updateUserSubmitButton: Locator;

  readonly updateUserResponse: Locator;

  // Update User Email elements
  readonly updateUserEmailInput: Locator;

  readonly updateUserEmailSubmitButton: Locator;

  readonly updateUserEmailResponse: Locator;

  // Update Subscriptions elements
  readonly updateSubscriptionsInput: Locator;

  readonly updateSubscriptionsSubmitButton: Locator;

  readonly updateSubscriptionsResponse: Locator;

  constructor(page: Page) {
    this.page = page;

    // Update User locators
    this.updateUserInput = page.locator('[data-qa-update-user-input]');
    this.updateUserSubmitButton = page.locator(
      '[data-qa-update-user-submit] button[type="submit"]'
    );
    this.updateUserResponse = page.locator('[data-qa-update-user-response]');

    // Update User Email locators
    this.updateUserEmailInput = page.locator(
      '[data-qa-update-user-email-input]'
    );
    this.updateUserEmailSubmitButton = page.locator(
      '[data-qa-update-user-email-submit] button[type="submit"]'
    );
    this.updateUserEmailResponse = page.locator(
      '[data-qa-update-user-email-response]'
    );

    // Update Subscriptions locators
    this.updateSubscriptionsInput = page.locator(
      '[data-qa-update-subscriptions-input]'
    );
    this.updateSubscriptionsSubmitButton = page.locator(
      '[data-qa-update-subscriptions-submit] button[type="submit"]'
    );
    this.updateSubscriptionsResponse = page.locator(
      '[data-qa-update-subscriptions-response]'
    );
  }

  async goto() {
    await this.page.goto('/users');
  }

  async updateUserDataField(fieldName: string): Promise<void> {
    await expect(this.updateUserInput).toBeVisible();
    await this.updateUserInput.clear();
    await this.updateUserInput.fill(fieldName);
    await expect(this.updateUserInput).toHaveValue(fieldName);

    await expect(this.updateUserSubmitButton).toBeEnabled();
    await this.updateUserSubmitButton.click();
  }

  async updateUserEmailAddress(email: string): Promise<void> {
    await expect(this.updateUserEmailInput).toBeVisible();
    await this.updateUserEmailInput.clear();
    await this.updateUserEmailInput.fill(email);
    await expect(this.updateUserEmailInput).toHaveValue(email);

    await expect(this.updateUserEmailSubmitButton).toBeEnabled();
    await this.updateUserEmailSubmitButton.click();
  }

  async updateUserSubscriptions(listId: string): Promise<void> {
    await expect(this.updateSubscriptionsInput).toBeVisible();
    await this.updateSubscriptionsInput.clear();
    await this.updateSubscriptionsInput.fill(listId);
    await expect(this.updateSubscriptionsInput).toHaveValue(listId);

    await expect(this.updateSubscriptionsSubmitButton).toBeEnabled();
    await this.updateSubscriptionsSubmitButton.click();
  }

  async waitForUpdateUserResponse(): Promise<string> {
    await expect(this.updateUserResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );
    return (await this.updateUserResponse.textContent()) || '';
  }

  async waitForUpdateUserEmailResponse(): Promise<string> {
    await expect(this.updateUserEmailResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );
    return (await this.updateUserEmailResponse.textContent()) || '';
  }

  async waitForUpdateSubscriptionsResponse(): Promise<string> {
    await expect(this.updateSubscriptionsResponse).not.toHaveText(
      'Endpoint JSON goes here'
    );
    return (await this.updateSubscriptionsResponse.textContent()) || '';
  }

  async performUpdateUserFlow(fieldName: string): Promise<string> {
    await this.updateUserDataField(fieldName);
    return this.waitForUpdateUserResponse();
  }

  async performUpdateUserEmailFlow(email: string): Promise<string> {
    await this.updateUserEmailAddress(email);
    return this.waitForUpdateUserEmailResponse();
  }

  async performUpdateSubscriptionsFlow(listId: string): Promise<string> {
    await this.updateUserSubscriptions(listId);
    return this.waitForUpdateSubscriptionsResponse();
  }

  async verifySuccessfulUpdateUser(): Promise<void> {
    const response = await this.updateUserResponse.textContent();
    expect(response).toContain('"code":"Success"');
  }

  async verifySuccessfulUpdateUserEmail(): Promise<void> {
    const response = await this.updateUserEmailResponse.textContent();
    expect(response).toContain('"code":"Success"');
  }

  async verifySuccessfulUpdateSubscriptions(): Promise<void> {
    const response = await this.updateSubscriptionsResponse.textContent();
    expect(response).toContain('"code":"Success"');
  }
}

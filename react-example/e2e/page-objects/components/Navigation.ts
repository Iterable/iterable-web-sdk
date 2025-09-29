import { Page, Locator, expect } from '@playwright/test';

export class Navigation {
  readonly page: Page;

  readonly homeLink: Locator;

  readonly commerceLink: Locator;

  readonly eventsLink: Locator;

  readonly usersLink: Locator;

  readonly inAppLink: Locator;

  readonly embeddedMsgsLink: Locator;

  readonly embeddedLink: Locator;

  readonly uuaTestingLink: Locator;

  readonly embeddedMsgsImpressionTrackerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByTestId('nav-home');
    this.commerceLink = page.getByTestId('nav-commerce');
    this.eventsLink = page.getByTestId('nav-events');
    this.usersLink = page.getByTestId('nav-users');
    this.inAppLink = page.getByTestId('nav-inapp');
    this.embeddedMsgsLink = page.getByTestId('nav-embedded-msgs');
    this.embeddedLink = page.getByTestId('nav-embedded');
    this.uuaTestingLink = page.getByTestId('nav-uua-testing');
    this.embeddedMsgsImpressionTrackerLink = page.getByTestId(
      'nav-embedded-msgs-tracker'
    );
  }

  async navigateToHome() {
    await this.homeLink.click();
    await expect(this.page).toHaveURL('http://localhost:8080/');
  }

  async navigateToCommerce() {
    await this.commerceLink.click();
    await expect(this.page).toHaveURL('http://localhost:8080/commerce');
  }

  async navigateToEvents() {
    await this.eventsLink.click();
    await expect(this.page).toHaveURL('http://localhost:8080/events');
  }

  async navigateToUsers() {
    await this.usersLink.click();
    await expect(this.page).toHaveURL('http://localhost:8080/users');
  }

  async navigateToInApp() {
    await this.inAppLink.click();
    await expect(this.page).toHaveURL('http://localhost:8080/inApp');
  }

  async navigateToEmbeddedMsgs() {
    await this.embeddedMsgsLink.click();
    await expect(this.page).toHaveURL('http://localhost:8080/embedded-msgs');
  }

  async navigateToEmbedded() {
    await this.embeddedLink.click();
    await expect(this.page).toHaveURL('http://localhost:8080/embedded');
  }

  async navigateToUUATesting() {
    await this.uuaTestingLink.click();
    await expect(this.page).toHaveURL('http://localhost:8080/uua-testing');
  }

  async isNavigationVisible() {
    await expect(this.homeLink).toBeVisible();
    await expect(this.commerceLink).toBeVisible();
    await expect(this.eventsLink).toBeVisible();
    await expect(this.usersLink).toBeVisible();
    await expect(this.inAppLink).toBeVisible();
    await expect(this.embeddedMsgsLink).toBeVisible();
    await expect(this.embeddedLink).toBeVisible();
    await expect(this.autTestingLink).toBeVisible();
  }
}

import { Page, Locator, expect } from '@playwright/test';

interface NavigationRoute {
  name: string;
  testId: string;
  path: string;
}

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

  // Define navigation routes configuration
  private readonly routes: NavigationRoute[] = [
    { name: 'home', testId: 'nav-home', path: '/' },
    { name: 'commerce', testId: 'nav-commerce', path: '/commerce' },
    { name: 'events', testId: 'nav-events', path: '/events' },
    { name: 'users', testId: 'nav-users', path: '/users' },
    { name: 'inApp', testId: 'nav-inapp', path: '/inApp' },
    { name: 'embeddedMsgs', testId: 'nav-embedded-msgs', path: '/embedded-msgs' },
    { name: 'embedded', testId: 'nav-embedded', path: '/embedded' },
    { name: 'uuaTesting', testId: 'nav-uua-testing', path: '/uua-testing' },
    { name: 'embeddedMsgsImpressionTracker', testId: 'nav-embedded-msgs-tracker', path: '/embedded-msgs-impression-tracker' }
  ];

  constructor(page: Page) {
    this.page = page;
    
    // Initialize all locators dynamically
    this.homeLink = page.getByTestId('nav-home');
    this.commerceLink = page.getByTestId('nav-commerce');
    this.eventsLink = page.getByTestId('nav-events');
    this.usersLink = page.getByTestId('nav-users');
    this.inAppLink = page.getByTestId('nav-inapp');
    this.embeddedMsgsLink = page.getByTestId('nav-embedded-msgs');
    this.embeddedLink = page.getByTestId('nav-embedded');
    this.uuaTestingLink = page.getByTestId('nav-uua-testing');
    this.embeddedMsgsImpressionTrackerLink = page.getByTestId('nav-embedded-msgs-tracker');
  }

  /**
   * Generic navigation helper that ensures we start from home page
   */
  private async navigateToRoute(route: NavigationRoute): Promise<void> {
    await this.page.goto('/');
    const link = this.page.getByTestId(route.testId);
    await link.click();
    await expect(this.page).toHaveURL(route.path);
  }

  /**
   * Generic navigation helper that navigates directly to a route
   */
  private async navigateDirect(route: NavigationRoute): Promise<void> {
    const link = this.page.getByTestId(route.testId);
    await link.click();
    await expect(this.page).toHaveURL(route.path);
  }

  // Navigation methods using the generic helper
  async navigateToHome(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page).toHaveURL('/');
  }

  async navigateToCommerce(): Promise<void> {
    const route = this.routes.find(r => r.name === 'commerce')!;
    await this.navigateToRoute(route);
  }

  async navigateToEvents(): Promise<void> {
    const route = this.routes.find(r => r.name === 'events')!;
    await this.navigateToRoute(route);
  }

  async navigateToUsers(): Promise<void> {
    const route = this.routes.find(r => r.name === 'users')!;
    await this.navigateToRoute(route);
  }

  async navigateToInApp(): Promise<void> {
    const route = this.routes.find(r => r.name === 'inApp')!;
    await this.navigateToRoute(route);
  }

  async navigateToEmbeddedMsgs(): Promise<void> {
    const route = this.routes.find(r => r.name === 'embeddedMsgs')!;
    await this.navigateToRoute(route);
  }

  async navigateToEmbedded(): Promise<void> {
    const route = this.routes.find(r => r.name === 'embedded')!;
    await this.navigateToRoute(route);
  }

  async navigateToUUATesting(): Promise<void> {
    const route = this.routes.find(r => r.name === 'uuaTesting')!;
    await this.navigateToRoute(route);
  }

  /**
   * Verify all navigation elements are visible
   */
  async isNavigationVisible(): Promise<void> {
    const navigationRoutes = this.routes.filter(route => route.name !== 'embeddedMsgsImpressionTracker');
    
    for (const route of navigationRoutes) {
      const link = this.page.getByTestId(route.testId);
      await expect(link).toBeVisible();
    }
  }

  /**
   * Dynamic navigation method for programmatic usage
   * Usage: await navigation.navigate('commerce')
   */
  async navigate(routeName: string): Promise<void> {
    const route = this.routes.find(r => r.name === routeName);
    if (!route) {
      throw new Error(`Navigation route '${routeName}' not found`);
    }
    await this.navigateToRoute(route);
  }

  /**
   * Get all available route names
   */
  getAvailableRoutes(): string[] {
    return this.routes.map(route => route.name);
  }
}

import { type Locator, type Page } from '@playwright/test';

export class CommercePage {
  readonly page: Page;
  readonly cartInput: Locator;
  readonly purchaseInput: Locator;
  readonly cartSubmitButton: Locator;
  readonly purchaseSubmitButton: Locator;
  readonly cartResponse: Locator;
  readonly purchaseResponse: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartInput = page.getByTestId('cart-input');
    this.cartSubmitButton = page.getByTestId('cart-submit');
    this.cartResponse = page.getByTestId('cart-response');
    this.purchaseInput = page.getByTestId('purchase-input');
    this.purchaseSubmitButton = page.getByTestId('purchase-submit');
    this.purchaseResponse = page.getByTestId('purchase-response');
  }

  async goto() {
    await this.page.goto('/commerce');
  }

  async mock200POSTPurchaseRequest() {
    await this.page.route(
      'https://api.iterable.com/api/commerce/trackPurchase',
      async (route) => {
        const json = {
          msg: 'success mocked from playwright',
          code: 'Success',
          params: {
            id: 'mock-playwright-id'
          }
        };
        await route.fulfill({ json });
      }
    );
  }

  async mock400POSTPurchaseRequest() {
    await this.page.route(
      'https://api.iterable.com/api/commerce/trackPurchase',
      async (route) => {
        const json = {
          code: 'GenericError',
          msg: 'Client-side error mocked from playwright',
          clientErrors: [
            {
              error: 'items[0].name is a required field',
              field: 'items[0].name'
            }
          ]
        };
        await route.fulfill({ json });
      }
    );
  }
}

import { test, expect } from '@playwright/test';
import { CommercePage } from '../pages/commercePage';

test.describe('Commerce tests', () => {
  test.beforeEach(async ({ page }) => {
    const commercePage = new CommercePage(page);
    await commercePage.goto();
  });

  test('200 POST purchase request', async ({ page }) => {
    const commercePage = new CommercePage(page);
    await commercePage.mock200POSTPurchaseRequest();

    await commercePage.purchaseInput.fill('SomeItem');
    await commercePage.purchaseSubmitButton.click();
    await expect(commercePage.purchaseResponse).toContainText(
      JSON.stringify({
        msg: 'success mocked from playwright',
        code: 'Success',
        params: {
          id: 'mock-playwright-id'
        }
      })
    );
  });

  test('400 POST purchase request', async ({ page }) => {
    const commercePage = new CommercePage(page);
    await commercePage.mock400POSTPurchaseRequest();

    await commercePage.purchaseInput.fill('SomeItem');
    await commercePage.purchaseSubmitButton.click();
    await expect(commercePage.purchaseResponse).toContainText(
      JSON.stringify({
        code: 'GenericError',
        msg: 'Client-side error mocked from playwright',
        clientErrors: [
          { error: 'items[0].name is a required field', field: 'items[0].name' }
        ]
      })
    );
  });
});

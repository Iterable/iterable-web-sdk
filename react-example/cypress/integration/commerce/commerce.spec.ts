describe('Track Purchase', () => {
  it('should paint 200 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/commerce/trackPurchase*'
      },
      { fixture: 'commerce/200.json' }
    ).as('trackPurchase');

    cy.visit('/commerce');

    cy.get('[data-qa-purchase-input]').type('SomeItem');
    cy.get('[data-qa-purchase-submit]').submit();

    cy.wait('@trackPurchase');

    cy.get('[data-qa-purchase-response]').contains(
      JSON.stringify({
        msg: 'success mocked from cypress',
        code: 'Success',
        params: {
          id: 'mock-cypress-id'
        }
      })
    );
  });

  it('should paint 400 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/commerce/trackPurchase*'
      },
      { fixture: 'commerce/400.json', statusCode: 400 }
    ).as('trackPurchase');

    cy.visit('/commerce');

    cy.get('[data-qa-purchase-input]').type('SomeItem');
    cy.get('[data-qa-purchase-submit]').submit();

    cy.wait('@trackPurchase');

    cy.get('[data-qa-purchase-response]').contains(
      JSON.stringify({
        code: 'GenericError',
        msg: 'Client-side error mocked from cypress',
        clientErrors: [
          { error: 'items[0].name is a required field', field: 'items[0].name' }
        ]
      })
    );
  });
});

describe('Update Cart', () => {
  it('should paint 200 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/commerce/updateCart*'
      },
      { fixture: 'commerce/200.json' }
    ).as('updateCart');

    cy.visit('/commerce');

    cy.get('[data-qa-cart-input]').type('SomeItem');
    cy.get('[data-qa-cart-submit]').submit();

    cy.wait('@updateCart');

    cy.get('[data-qa-cart-response]').contains(
      JSON.stringify({
        msg: 'success mocked from cypress',
        code: 'Success',
        params: {
          id: 'mock-cypress-id'
        }
      })
    );
  });

  it('should paint 400 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/commerce/updateCart*'
      },
      { fixture: 'commerce/400.json', statusCode: 400 }
    ).as('updateCart');

    cy.visit('/commerce');

    cy.get('[data-qa-cart-input]').type('SomeItem');
    cy.get('[data-qa-cart-submit]').submit();

    cy.wait('@updateCart');

    cy.get('[data-qa-cart-response]').contains(
      JSON.stringify({
        code: 'GenericError',
        msg: 'Client-side error mocked from cypress',
        clientErrors: [
          { error: 'items[0].name is a required field', field: 'items[0].name' }
        ]
      })
    );
  });
});

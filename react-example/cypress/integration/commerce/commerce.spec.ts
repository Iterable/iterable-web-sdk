describe('Track Purchase', () => {
  it('should paint 200 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/commerce/trackPurchase*'
      },
      { fixture: 'trackPurchase/200.json' }
    ).as('trackPurchase');

    cy.intercept(
      {
        url: '/generate*',
        middleware: true
      },
      (req) => {
        req.on('response', (res) => {
          res.setThrottle(10000);
        });
      }
    ).as('generateToken');

    cy.visit('/commerce');

    cy.get('[data-qa-purchase-input]').type('SomeItem');
    cy.get('[data-qa-purchase-submit]').submit();

    cy.wait('@trackPurchase');

    cy.get('[data-qa-purchase-response]').contains(
      JSON.stringify({
        msg: '',
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
      { fixture: 'trackPurchase/400.json' }
    ).as('trackPurchase');

    cy.intercept(
      {
        url: '/generate*',
        middleware: true
      },
      (req) => {
        req.on('response', (res) => {
          res.setThrottle(10000);
        });
      }
    ).as('generateToken');

    cy.visit('/commerce');

    cy.get('[data-qa-purchase-input]').type('SomeItem');
    cy.get('[data-qa-purchase-submit]').submit();

    cy.wait('@trackPurchase');

    cy.get('[data-qa-purchase-response]').contains(
      JSON.stringify({
        code: 'GenericError',
        msg: 'Client-side error',
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
      { fixture: 'trackPurchase/200.json' }
    ).as('updateCart');

    cy.intercept(
      {
        url: '/generate*',
        middleware: true
      },
      (req) => {
        req.on('response', (res) => {
          res.setThrottle(10000);
        });
      }
    ).as('generateToken');

    cy.visit('/commerce');

    cy.get('[data-qa-cart-input]').type('SomeItem');
    cy.get('[data-qa-cart-submit]').submit();

    cy.wait('@updateCart');

    cy.get('[data-qa-cart-response]').contains(
      JSON.stringify({
        msg: '',
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
      { fixture: 'trackPurchase/400.json' }
    ).as('updateCart');

    cy.intercept(
      {
        url: '/generate*',
        middleware: true
      },
      (req) => {
        req.on('response', (res) => {
          res.setThrottle(10000);
        });
      }
    ).as('generateToken');

    cy.visit('/commerce');

    cy.get('[data-qa-cart-input]').type('SomeItem');
    cy.get('[data-qa-cart-submit]').submit();

    cy.wait('@updateCart');

    cy.get('[data-qa-cart-response]').contains(
      JSON.stringify({
        code: 'GenericError',
        msg: 'Client-side error',
        clientErrors: [
          { error: 'items[0].name is a required field', field: 'items[0].name' }
        ]
      })
    );
  });
});

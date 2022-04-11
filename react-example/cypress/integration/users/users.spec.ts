describe('Update User', () => {
  it('should paint 200 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/users/update*'
      },
      { fixture: 'users/200.json' }
    ).as('updateUser');

    cy.visit('/users');

    cy.get('[data-qa-update-user-input]').type('SomeItem');
    cy.get('[data-qa-update-user-submit]').submit();

    cy.wait('@updateUser');

    cy.get('[data-qa-update-user-response]').contains(
      JSON.stringify({
        msg: 'success mocked from cypress',
        code: 'Success',
        params: null
      })
    );
  });

  it('should paint 400 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/users/update*'
      },
      { fixture: 'users/400.json' }
    ).as('updateUser');

    cy.visit('/users');

    cy.get('[data-qa-update-user-input]').type('SomeItem');
    cy.get('[data-qa-update-user-submit]').submit();

    cy.wait('@updateUser');

    cy.get('[data-qa-update-user-response]').contains(
      JSON.stringify({
        msg: 'error mocked from cypress!',
        code: 'CypressError',
        params: {}
      })
    );
  });
});

describe('Update User Email', () => {
  it('should paint 200 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/users/updateEmail*'
      },
      { fixture: 'users/200.json' }
    ).as('updateUserEmail');

    cy.visit('/users');

    cy.get('[data-qa-update-user-email-input]').type('SomeItem');
    cy.get('[data-qa-update-user-email-submit]').submit();

    cy.wait('@updateUserEmail');

    cy.get('[data-qa-update-user-email-response]').contains(
      JSON.stringify({
        msg: 'success mocked from cypress',
        code: 'Success',
        params: null
      })
    );
  });

  it('should paint 400 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/users/updateEmail*'
      },
      { fixture: 'users/400.json' }
    ).as('updateUserEmail');

    cy.visit('/users');

    cy.get('[data-qa-update-user-email-input]').type('SomeItem');
    cy.get('[data-qa-update-user-email-submit]').submit();

    cy.wait('@updateUserEmail');

    cy.get('[data-qa-update-user-email-response]').contains(
      JSON.stringify({
        msg: 'error mocked from cypress!',
        code: 'CypressError',
        params: {}
      })
    );
  });
});

describe('Update Subscriptions', () => {
  it('should paint 200 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/users/updateSubscriptions*'
      },
      { fixture: 'users/200.json' }
    ).as('updateSubscriptions');

    cy.visit('/users');

    cy.get('[data-qa-update-subscriptions-input]').type('10');
    cy.get('[data-qa-update-subscriptions-submit]').submit();

    cy.wait('@updateSubscriptions');

    cy.get('[data-qa-update-subscriptions-response]').contains(
      JSON.stringify({
        msg: 'success mocked from cypress',
        code: 'Success',
        params: null
      })
    );
  });

  it('should paint 400 response data to screen', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/users/updateSubscriptions*'
      },
      { fixture: 'users/400.json' }
    ).as('updateSubscriptions');

    cy.visit('/users');

    cy.get('[data-qa-update-subscriptions-input]').type('10');
    cy.get('[data-qa-update-subscriptions-submit]').submit();

    cy.wait('@updateSubscriptions');

    cy.get('[data-qa-update-subscriptions-response]').contains(
      JSON.stringify({
        msg: 'error mocked from cypress!',
        code: 'CypressError',
        params: {}
      })
    );
  });
});

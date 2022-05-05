import * as mockMessages from '../../fixtures/inapp/200.json';

describe('Requesting In-App Messages', () => {
  it('should paint the correct 200 response', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/inApp/getMessages*'
      },
      { fixture: 'inapp/200.json' }
    ).as('getInAppMessages');

    cy.visit('/inApp');

    /* buttons are disabled without logging in */
    cy.login();

    cy.get('[data-qa-get-messages-raw]').click();

    cy.wait('@getInAppMessages');

    cy.get('[data-qa-get-messages-raw-response]').contains(
      JSON.stringify(mockMessages)
    );
  });

  it('should paint the correct 400 response', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/inApp/getMessages*'
      },
      { fixture: 'inapp/400.json', statusCode: 400 }
    ).as('getInAppMessages');

    cy.visit('/inApp');

    /* buttons are disabled without logging in */
    cy.login();

    cy.get('[data-qa-get-messages-raw]').click();

    cy.wait('@getInAppMessages');

    cy.get('[data-qa-get-messages-raw-response]').contains(
      JSON.stringify({
        msg: 'error mocked from cypress'
      })
    );
  });
});

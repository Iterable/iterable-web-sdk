import * as mockMessages from '../../fixtures/inapp/200.json';

const url = `/api/inApp/web/getMessages*`;

describe('Requesting In-App Messages', () => {
  it('should paint the correct 200 response', () => {
    cy.intercept(
      {
        method: 'GET',
        url
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
        url
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

describe('Auto-Display In-App Messages', () => {
  it('should render an iframe element', () => {
    cy.intercept(
      {
        method: 'GET',
        url
      },
      { fixture: 'inapp/200.json' }
    ).as('getInAppMessages');

    cy.visit('/inApp');

    /* buttons are disabled without logging in */
    cy.login();

    cy.get('[data-qa-auto-display-messages]').click();

    cy.wait('@getInAppMessages');

    cy.get('#iterable-iframe').should('exist');
  });

  it('should remove the iframe when esc key is pressed', () => {
    cy.intercept(
      {
        method: 'GET',
        url
      },
      { fixture: 'inapp/200.json' }
    ).as('getInAppMessages');

    cy.visit('/inApp');

    /* buttons are disabled without logging in */
    cy.login();

    cy.get('[data-qa-auto-display-messages]').click();

    cy.wait('@getInAppMessages');

    cy.get('#iterable-iframe').should('exist');

    cy.get('body').type('{esc}');

    cy.get('#iterable-iframe').should('not.exist');
  });

  it('should show the next message 2 seconds after closing the first', () => {
    cy.intercept(
      {
        method: 'GET',
        url
      },
      { fixture: 'inapp/200.json' }
    ).as('getInAppMessages');

    cy.visit('/inApp');

    /* buttons are disabled without logging in */
    cy.login();

    cy.get('[data-qa-auto-display-messages]').click();

    cy.wait('@getInAppMessages');

    cy.get('#iterable-iframe').should('exist');

    cy.get('body').type('{esc}');

    cy.get('#iterable-iframe').should('not.exist');

    cy.wait(3000);

    cy.get('#iterable-iframe').should('exist');
  });

  it('should successfully pause messages', () => {
    cy.intercept(
      {
        method: 'GET',
        url
      },
      { fixture: 'inapp/200.json' }
    ).as('getInAppMessages');

    cy.visit('/inApp');

    /* buttons are disabled without logging in */
    cy.login();

    cy.get('[data-qa-auto-display-messages]').click();

    cy.wait('@getInAppMessages');

    cy.get('#iterable-iframe').should('exist');

    cy.get('body').type('{esc}');

    cy.get('[data-qa-pause-messages]').click();

    cy.wait(3000);

    cy.get('#iterable-iframe').should('not.exist');
  });
});

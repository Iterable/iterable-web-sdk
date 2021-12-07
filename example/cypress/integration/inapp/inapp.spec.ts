describe('Auot-Painting In App Messages', () => {
  it('loads iframe successfully', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/inApp/getMessages*'
      },
      { fixture: 'inapp.json' }
    ).as('getInAppMessages');

    cy.visit('/');

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

    cy.get('#login').click();
    cy.wait('@generateToken');
    cy.get('#start').click();
    cy.wait('@getInAppMessages');

    cy.get('#iterable-iframe').should('exist');
  });
});

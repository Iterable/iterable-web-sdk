describe('Track', () => {
  it('should paint the correct 200 response', () => {
    /* 
      no need to intercept anything in this test. See ../../support/index.js 
      where setup file is already intercepting this
    */
    cy.visit('/events');

    cy.get('[data-qa-track-input]').type('mock-event');
    cy.get('[data-qa-track-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-response]').contains(
      JSON.stringify({
        msg: 'success mocked from cypress',
        code: 'Success',
        params: null
      })
    );
  });

  it('should paint the correct 400 response', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/events/track*'
      },
      { fixture: 'events/400.json' }
    ).as('track');

    cy.visit('/events');

    cy.get('[data-qa-track-input]').type('SomeItem');
    cy.get('[data-qa-track-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-response]').contains(
      JSON.stringify({
        code: 'GenericError',
        msg: 'Client-side error mocked from cypress',
        clientErrors: [
          {
            error: 'eventName is a required field',
            field: 'eventName'
          }
        ]
      })
    );
  });
});

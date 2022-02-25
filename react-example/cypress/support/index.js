/*
  setup file for each test. These run before each and every test
*/

/* eslint-disable no-undef */
beforeEach(() => {
  cy.intercept(
    {
      url: '/generate*',
    },
    (req) => {
      req.reply({
        token: 'cypress-mock-token'
      })
    }
  ).as('generateToken');

  /* 
    by default, just intercept all tracking events and 200 them 
    so that we don't have to do this every time we paint in-app
    messages to the screen.
  */
  cy.intercept(
    {
      method: 'POST',
      url: '/api/events/track*'
    },
    { fixture: 'events/200.json' }
  );
});

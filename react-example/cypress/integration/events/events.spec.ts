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
      { fixture: 'events/400.json', statusCode: 400 }
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

describe('Track Click', () => {
  it('should paint the correct 200 response', () => {
    /* 
      no need to intercept anything in this test. See ../../support/index.js 
      where setup file is already intercepting this
    */
    cy.visit('/events');

    cy.get('[data-qa-track-click-input]').type('mock-event');
    cy.get('[data-qa-track-click-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-click-response]').contains(
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
      { fixture: 'events/400.json', statusCode: 400 }
    ).as('track');

    cy.visit('/events');

    cy.get('[data-qa-track-click-input]').type('SomeItem');
    cy.get('[data-qa-track-click-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-click-response]').contains(
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

describe('Track Click', () => {
  it('should paint the correct 200 response', () => {
    /* 
      no need to intercept anything in this test. See ../../support/index.js 
      where setup file is already intercepting this
    */
    cy.visit('/events');

    cy.get('[data-qa-track-click-input]').type('mock-event');
    cy.get('[data-qa-track-click-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-click-response]').contains(
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
      { fixture: 'events/400.json', statusCode: 400 }
    ).as('track');

    cy.visit('/events');

    cy.get('[data-qa-track-click-input]').type('SomeItem');
    cy.get('[data-qa-track-click-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-click-response]').contains(
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

describe('Track Close', () => {
  it('should paint the correct 200 response', () => {
    /* 
      no need to intercept anything in this test. See ../../support/index.js 
      where setup file is already intercepting this
    */
    cy.visit('/events');

    cy.get('[data-qa-track-close-input]').type('mock-event');
    cy.get('[data-qa-track-close-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-close-response]').contains(
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
      { fixture: 'events/400.json', statusCode: 400 }
    ).as('track');

    cy.visit('/events');

    cy.get('[data-qa-track-close-input]').type('SomeItem');
    cy.get('[data-qa-track-close-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-close-response]').contains(
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

describe('Track Consume', () => {
  it('should paint the correct 200 response', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/api/events/inAppConsume*'
      },
      { fixture: 'events/200.json' }
    ).as('track');

    cy.visit('/events');

    cy.get('[data-qa-track-consume-input]').type('mock-event');
    cy.get('[data-qa-track-consume-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-consume-response]').contains(
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
        url: '/api/events/inAppConsume*'
      },
      { fixture: 'events/400.json', statusCode: 400 }
    ).as('track');

    cy.visit('/events');

    cy.get('[data-qa-track-consume-input]').type('SomeItem');
    cy.get('[data-qa-track-consume-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-consume-response]').contains(
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

describe('Track Delivery', () => {
  it('should paint the correct 200 response', () => {
    /* 
      no need to intercept anything in this test. See ../../support/index.js 
      where setup file is already intercepting this
    */
    cy.visit('/events');

    cy.get('[data-qa-track-delivery-input]').type('mock-event');
    cy.get('[data-qa-track-delivery-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-delivery-response]').contains(
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
      { fixture: 'events/400.json', statusCode: 400 }
    ).as('track');

    cy.visit('/events');

    cy.get('[data-qa-track-delivery-input]').type('SomeItem');
    cy.get('[data-qa-track-delivery-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-delivery-response]').contains(
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

describe('Track Open', () => {
  it('should paint the correct 200 response', () => {
    /* 
      no need to intercept anything in this test. See ../../support/index.js 
      where setup file is already intercepting this
    */
    cy.visit('/events');

    cy.get('[data-qa-track-open-input]').type('mock-event');
    cy.get('[data-qa-track-open-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-open-response]').contains(
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
      { fixture: 'events/400.json', statusCode: 400 }
    ).as('track');

    cy.visit('/events');

    cy.get('[data-qa-track-open-input]').type('SomeItem');
    cy.get('[data-qa-track-open-submit]').submit();

    cy.wait('@track');

    cy.get('[data-qa-track-open-response]').contains(
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

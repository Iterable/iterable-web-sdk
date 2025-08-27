import {
  setupLocalStorageMock,
  runCriteriaCheck,
  createSimpleCriteria
} from './testHelpers';

// Test data constants
const TEST_EVENTS = {
  CUSTOM_EVENT_BASIC: {
    eventName: 'testEvent',
    createdAt: 1708494757530,
    dataFields: {
      browserVisit: {
        website: {
          domain: 'google.com'
        }
      }
    },
    createNewFields: true,
    eventType: 'customEvent'
  },
  CUSTOM_EVENT_SIMPLE: {
    eventName: 'testEvent',
    createdAt: 1708494757530,
    dataFields: undefined,
    createNewFields: true,
    eventType: 'customEvent'
  },
  CUSTOM_EVENT_EMAIL: {
    email: 'testEvent@example.com',
    createdAt: 1708494757530,
    dataFields: undefined,
    createNewFields: true,
    eventType: 'customEvent'
  },
  CUSTOM_EVENT_BUTTON_CLICK: {
    eventName: 'button-clicked',
    dataFields: {
      animal: 'test page',
      clickCount: '2',
      total: 3
    },
    createdAt: 1700071052507,
    eventType: 'customEvent'
  },
  CUSTOM_EVENT_BUTTON_CLICK_NESTED: {
    eventName: 'button-clicked',
    dataFields: {
      'button-clicked': { animal: 'test page' },
      total: 3
    },
    createdAt: 1700071052507,
    eventType: 'customEvent'
  },
  PURCHASE_KEYBOARD: {
    createdAt: 1708494757530,
    items: [{ name: 'keyboard', id: 'fdsafds', price: 10, quantity: 2 }],
    total: 10,
    eventType: 'purchase'
  },
  PURCHASE_BLACK_COFFEE: {
    items: [{ id: '123', name: 'Black Coffee', quantity: 1, price: 4 }],
    user: { userId: 'user' },
    total: 0,
    eventType: 'purchase'
  },
  PURCHASE_MONITOR: {
    items: [{ id: '12', name: 'monitor', price: 10, quantity: 10 }],
    total: 50,
    eventType: 'purchase'
  },
  PURCHASE_MONITOR_NO_PRICE: {
    items: [{ id: '12', name: 'monitor', quantity: 10 }],
    total: 50,
    eventType: 'purchase'
  },
  PURCHASE_MONITOR_DIFFERENT_PRICE: {
    items: [{ id: '12', name: 'monitor', price: 50.5, quantity: 10 }],
    total: 50,
    eventType: 'purchase'
  },
  CART_UPDATE_KEYBOARD: {
    createdAt: 1708494757530,
    items: [{ name: 'keyboard', id: 'fdsafds', price: 10, quantity: 2 }],
    eventType: 'cartUpdate'
  },
  CART_UPDATE_MULTI_ITEMS: {
    createdAt: 1708494757530,
    items: [
      { name: 'keyboard', id: 'fdsafds', price: 10, quantity: 2 },
      { name: 'Cofee', id: 'fdsafds', price: 10, quantity: 2 }
    ],
    eventType: 'cartUpdate'
  },
  CART_UPDATE_KEYBOARD_LOW_PRICE: {
    createdAt: 1708494757530,
    items: [
      { name: 'keyboard', id: 'fdsafds', price: 9, quantity: 2 },
      { name: 'Cofee', id: 'fdsafds', price: 10, quantity: 2 }
    ],
    eventType: 'cartUpdate'
  },
  CART_UPDATE_MOCHA: {
    items: [{ id: '12', name: 'Mocha', price: 50, quantity: 50 }],
    eventType: 'cartUpdate'
  },
  CART_UPDATE_MOCHA_NO_PRICE: {
    items: [{ id: '12', name: 'Mocha', quantity: 50 }],
    eventType: 'cartUpdate'
  }
};

const TEST_USER_DATA = {
  ISSET_BASIC: {
    dataFields: {
      country: 'UK',
      eventTimeStamp: 10,
      phoneNumberDetails: '99999999',
      'shoppingCartItems.price': 50.5
    },
    eventType: 'user'
  },
  ISSET_MISSING_COUNTRY: {
    dataFields: {
      eventTimeStamp: 10,
      phoneNumberDetails: '99999999',
      'shoppingCartItems.price': 50.5
    },
    eventType: 'user'
  },
  BOOLEAN_TRUE: {
    dataFields: {
      subscribed: true,
      phoneNumber: '99999999'
    },
    eventType: 'user'
  },
  PHONE_NUMBER_DIFFERENT: {
    dataFields: {
      subscribed: true,
      phoneNumber: '123685748641'
    },
    eventType: 'user'
  }
};

// Criteria builders
const createBasicCustomEventCriteria = (
  criteriaId: string,
  eventName: string,
  domain: string
) =>
  createSimpleCriteria(criteriaId, 'EventCriteria', {
    combinator: 'Or',
    searchQueries: [
      {
        combinator: 'Or',
        searchQueries: [
          {
            dataType: 'customEvent',
            searchCombo: {
              combinator: 'And',
              searchQueries: [
                {
                  dataType: 'customEvent',
                  field: 'eventName',
                  comparatorType: 'Equals',
                  value: eventName,
                  fieldType: 'string'
                },
                {
                  dataType: 'customEvent',
                  field: 'browserVisit.website.domain',
                  comparatorType: 'Equals',
                  value: domain,
                  fieldType: 'string'
                }
              ]
            }
          }
        ]
      }
    ]
  });

const createCustomEventWithMinMaxCriteria = (criteriaId: string) =>
  createSimpleCriteria(criteriaId, 'EventCriteria', {
    combinator: 'Or',
    searchQueries: [
      {
        combinator: 'Or',
        searchQueries: [
          {
            dataType: 'customEvent',
            minMatch: 1,
            maxMatch: 2,
            searchCombo: {
              combinator: 'And',
              searchQueries: [
                {
                  dataType: 'customEvent',
                  field: 'eventName',
                  comparatorType: 'Equals',
                  value: 'testEvent',
                  fieldType: 'string'
                },
                {
                  dataType: 'customEvent',
                  field: 'browserVisit.website.domain',
                  comparatorType: 'Equals',
                  value: 'google.com',
                  fieldType: 'string'
                }
              ]
            }
          }
        ]
      }
    ]
  });

const createPurchaseCriteria = (
  criteriaId: string,
  itemName: string,
  minPrice: string
) =>
  createSimpleCriteria(criteriaId, 'EventCriteria', {
    combinator: 'Or',
    searchQueries: [
      {
        combinator: 'Or',
        searchQueries: [
          {
            dataType: 'purchase',
            searchCombo: {
              combinator: 'And',
              searchQueries: [
                {
                  dataType: 'purchase',
                  field: 'shoppingCartItems.name',
                  comparatorType: 'Equals',
                  value: itemName,
                  fieldType: 'string'
                },
                {
                  dataType: 'purchase',
                  field: 'shoppingCartItems.price',
                  comparatorType: 'GreaterThanOrEqualTo',
                  value: minPrice,
                  fieldType: 'double'
                }
              ]
            }
          }
        ]
      }
    ]
  });

const createUpdateCartCriteria = (
  criteriaId: string,
  eventName: string,
  itemName: string,
  minPrice: string
) =>
  createSimpleCriteria(criteriaId, 'EventCriteria', {
    combinator: 'Or',
    searchQueries: [
      {
        combinator: 'Or',
        searchQueries: [
          {
            dataType: 'customEvent',
            searchCombo: {
              combinator: 'And',
              searchQueries: [
                {
                  dataType: 'customEvent',
                  field: 'eventName',
                  comparatorType: 'Equals',
                  value: eventName,
                  fieldType: 'string'
                },
                {
                  dataType: 'customEvent',
                  field: 'updateCart.updatedShoppingCartItems.name',
                  comparatorType: 'Equals',
                  value: itemName,
                  fieldType: 'string'
                },
                {
                  dataType: 'customEvent',
                  field: 'updateCart.updatedShoppingCartItems.price',
                  comparatorType: 'GreaterThanOrEqualTo',
                  value: minPrice,
                  fieldType: 'double'
                }
              ]
            }
          }
        ]
      }
    ]
  });

const createStringComparatorCriteria = (
  criteriaId: string,
  field: string,
  comparatorType: string,
  value: string
) =>
  createSimpleCriteria(criteriaId, 'EventCriteria', {
    combinator: 'Or',
    searchQueries: [
      {
        combinator: 'Or',
        searchQueries: [
          {
            dataType: 'customEvent',
            searchCombo: {
              combinator: 'And',
              searchQueries: [
                {
                  dataType: 'customEvent',
                  field,
                  comparatorType,
                  value,
                  fieldType: 'string'
                }
              ]
            }
          }
        ]
      }
    ]
  });

const createRegexCriteria = (
  criteriaId: string,
  field: string,
  regex: RegExp
) =>
  createSimpleCriteria(criteriaId, 'EventCriteria', {
    combinator: 'Or',
    searchQueries: [
      {
        combinator: 'Or',
        searchQueries: [
          {
            dataType: 'customEvent',
            searchCombo: {
              combinator: 'And',
              searchQueries: [
                {
                  dataType: 'customEvent',
                  field,
                  comparatorType: 'MatchesRegex',
                  value: regex,
                  fieldType: 'string'
                }
              ]
            }
          }
        ]
      }
    ]
  });

const createIsSetCriteria = (
  criteriaId: string,
  dataType: string,
  fields: { field: string; fieldType: string; id: number }[]
) => {
  let name = 'Custom Event';
  if (dataType === 'user') {
    name = 'User';
  } else if (dataType === 'purchase') {
    name = 'Purchase';
  }

  return createSimpleCriteria(criteriaId, name, {
    combinator: 'And',
    searchQueries: [
      {
        combinator: 'And',
        searchQueries: [
          {
            dataType,
            searchCombo: {
              combinator: 'And',
              searchQueries: fields.map(({ field, fieldType, id }) => ({
                field,
                fieldType,
                comparatorType: 'IsSet',
                dataType,
                id,
                value: ''
              }))
            }
          }
        ]
      }
    ]
  });
};

const createDoesNotEqualCriteria = (
  criteriaId: string,
  name: string,
  dataType: string,
  field: string,
  value: string,
  fieldType: string
) =>
  createSimpleCriteria(criteriaId, name, {
    combinator: 'And',
    searchQueries: [
      {
        combinator: 'And',
        searchQueries: [
          {
            dataType,
            searchCombo: {
              combinator: 'And',
              searchQueries: [
                {
                  dataType,
                  field,
                  comparatorType: 'DoesNotEqual',
                  value,
                  fieldType
                }
              ]
            }
          }
        ]
      }
    ]
  });

const createBooleanCriteria = (
  criteriaId: string,
  field: string,
  value: string,
  fieldType = 'boolean'
) =>
  createSimpleCriteria(criteriaId, 'User', {
    combinator: 'And',
    searchQueries: [
      {
        combinator: 'And',
        searchQueries: [
          {
            dataType: 'user',
            searchCombo: {
              combinator: 'And',
              searchQueries: [
                {
                  field,
                  fieldType,
                  comparatorType: 'Equals',
                  dataType: 'user',
                  id: 25,
                  value
                },
                {
                  field: 'phoneNumber',
                  fieldType: 'String',
                  comparatorType: 'IsSet',
                  dataType: 'user',
                  id: 28,
                  value: ''
                }
              ]
            }
          }
        ]
      }
    ]
  });

// Helper functions
const testBasicCriteria = (
  description: string,
  eventData: any,
  userData: any,
  criteria: any,
  expectedResult: string | null
) => {
  it(description, () => {
    const result = runCriteriaCheck(
      criteria,
      eventData ? [eventData] : null,
      userData
    );
    expect(result).toEqual(expectedResult);
  });
};

describe('CriteriaCompletionChecker', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  // Basic tests
  it('should return null if criteriaData is empty', () => {
    const result = runCriteriaCheck({}, [], null);
    expect(result).toBeNull();
  });

  // Custom Event Tests
  testBasicCriteria(
    'should return criteriaId if customEvent is matched',
    TEST_EVENTS.CUSTOM_EVENT_BASIC,
    null,
    createBasicCustomEventCriteria('6', 'testEvent', 'google.com'),
    '6'
  );

  testBasicCriteria(
    'should return criteriaId if customEvent is matched when minMatch present',
    TEST_EVENTS.CUSTOM_EVENT_BASIC,
    null,
    createCustomEventWithMinMaxCriteria('6'),
    '6'
  );

  // Purchase Event Tests
  testBasicCriteria(
    'should return criteriaId if purchase event is matched',
    TEST_EVENTS.PURCHASE_KEYBOARD,
    null,
    createPurchaseCriteria('6', 'keyboard', '10'),
    '6'
  );

  testBasicCriteria(
    'should return criteriaId if criteriaData condition with numeric is matched',
    TEST_EVENTS.PURCHASE_BLACK_COFFEE,
    null,
    createPurchaseCriteria('6', 'Black Coffee', '4.00'),
    '6'
  );

  // UpdateCart Event Tests
  testBasicCriteria(
    'should return criteriaId if updateCart event with all props in item is matched',
    TEST_EVENTS.CART_UPDATE_KEYBOARD,
    null,
    createUpdateCartCriteria('6', 'updateCart', 'keyboard', '10'),
    '6'
  );

  testBasicCriteria(
    'should return null if updateCart event with items is NOT matched',
    TEST_EVENTS.CART_UPDATE_KEYBOARD_LOW_PRICE,
    null,
    createUpdateCartCriteria('6', 'updateCart', 'keyboard', '10'),
    null
  );

  testBasicCriteria(
    'should return criteriaId if updateCart event is matched',
    TEST_EVENTS.CART_UPDATE_KEYBOARD,
    null,
    createSimpleCriteria('6', 'EventCriteria', {
      combinator: 'Or',
      searchQueries: [
        {
          combinator: 'Or',
          searchQueries: [
            {
              dataType: 'customEvent',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'customEvent',
                    field: 'eventName',
                    comparatorType: 'Equals',
                    value: 'updateCart',
                    fieldType: 'string'
                  },
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.price',
                    comparatorType: 'GreaterThanOrEqualTo',
                    value: '10',
                    fieldType: 'double'
                  }
                ]
              }
            }
          ]
        }
      ]
    }),
    '6'
  );

  // String Comparator Tests
  testBasicCriteria(
    'should return criteriaId if criteriaData condition with StartsWith is matched',
    TEST_EVENTS.CUSTOM_EVENT_SIMPLE,
    null,
    createStringComparatorCriteria('6', 'eventName', 'StartsWith', 'test'),
    '6'
  );

  it('should return criteriaId if criteriaData condition with Contains is matched', () => {
    const result = runCriteriaCheck(
      createStringComparatorCriteria('6', 'eventName', 'Contains', 'test'),
      [TEST_EVENTS.CUSTOM_EVENT_SIMPLE],
      null
    );
    expect(result).toEqual('6');
  });

  // Regex Tests
  testBasicCriteria(
    'should return criteriaId if criteria regex match with value is matched',
    TEST_EVENTS.CUSTOM_EVENT_EMAIL,
    null,
    createRegexCriteria(
      '6',
      'email',
      /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+.)+[A-Za-z]+$/
    ),
    '6'
  );

  // IsSet Tests
  testBasicCriteria(
    'should return criteriaId 97 if isset user criteria is matched',
    null,
    TEST_USER_DATA.ISSET_BASIC,
    createIsSetCriteria('97', 'user', [
      { field: 'country', fieldType: 'string', id: 25 },
      { field: 'eventTimeStamp', fieldType: 'long', id: 26 },
      { field: 'phoneNumberDetails', fieldType: 'object', id: 28 },
      { field: 'shoppingCartItems.price', fieldType: 'double', id: 30 }
    ]),
    '97'
  );

  testBasicCriteria(
    'should return null (isset user criteria fail)',
    null,
    TEST_USER_DATA.ISSET_MISSING_COUNTRY,
    createIsSetCriteria('97', 'user', [
      { field: 'country', fieldType: 'string', id: 25 },
      { field: 'eventTimeStamp', fieldType: 'long', id: 26 },
      { field: 'phoneNumberDetails', fieldType: 'object', id: 28 },
      { field: 'shoppingCartItems.price', fieldType: 'double', id: 30 }
    ]),
    null
  );

  testBasicCriteria(
    'should return criteriaId 94 if isset customEvent criteria is matched',
    TEST_EVENTS.CUSTOM_EVENT_BUTTON_CLICK,
    null,
    createIsSetCriteria('94', 'customEvent', [
      { field: 'button-clicked', fieldType: 'object', id: 2 },
      { field: 'button-clicked.animal', fieldType: 'string', id: 4 },
      { field: 'button-clicked.clickCount', fieldType: 'long', id: 5 },
      { field: 'total', fieldType: 'double', id: 9 }
    ]),
    '94'
  );

  testBasicCriteria(
    'should return null (isset customEvent criteria fail)',
    TEST_EVENTS.CUSTOM_EVENT_BUTTON_CLICK_NESTED,
    null,
    createIsSetCriteria('94', 'customEvent', [
      { field: 'button-clicked', fieldType: 'object', id: 2 },
      { field: 'button-clicked.animal', fieldType: 'string', id: 4 },
      { field: 'button-clicked.clickCount', fieldType: 'long', id: 5 },
      { field: 'total', fieldType: 'double', id: 9 }
    ]),
    null
  );

  testBasicCriteria(
    'should return criteriaId 96 if isset purchase criteria is matched',
    TEST_EVENTS.PURCHASE_MONITOR,
    null,
    createIsSetCriteria('96', 'purchase', [
      { field: 'shoppingCartItems', fieldType: 'object', id: 1 },
      { field: 'shoppingCartItems.price', fieldType: 'double', id: 3 },
      { field: 'shoppingCartItems.name', fieldType: 'string', id: 5 },
      { field: 'total', fieldType: 'double', id: 7 }
    ]),
    '96'
  );

  testBasicCriteria(
    'should return null (isset purchase criteria fail)',
    TEST_EVENTS.PURCHASE_MONITOR_NO_PRICE,
    null,
    createIsSetCriteria('96', 'purchase', [
      { field: 'shoppingCartItems', fieldType: 'object', id: 1 },
      { field: 'shoppingCartItems.price', fieldType: 'double', id: 3 },
      { field: 'shoppingCartItems.name', fieldType: 'string', id: 5 },
      { field: 'total', fieldType: 'double', id: 7 }
    ]),
    null
  );

  testBasicCriteria(
    'should return criteriaId 95 if isset updateCart criteria is matched',
    TEST_EVENTS.CART_UPDATE_MOCHA,
    null,
    createSimpleCriteria('95', 'UpdateCart: isSet Comparator', {
      combinator: 'And',
      searchQueries: [
        {
          combinator: 'And',
          searchQueries: [
            {
              dataType: 'customEvent',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'customEvent',
                    field: 'updateCart',
                    comparatorType: 'IsSet',
                    value: '',
                    fieldType: 'object'
                  },
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.name',
                    comparatorType: 'IsSet',
                    value: '',
                    fieldType: 'string'
                  },
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.price',
                    comparatorType: 'IsSet',
                    value: '',
                    fieldType: 'double'
                  },
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.quantity',
                    comparatorType: 'IsSet',
                    value: '',
                    fieldType: 'long'
                  }
                ]
              }
            }
          ]
        }
      ]
    }),
    '95'
  );

  testBasicCriteria(
    'should return null (isset updateCart criteria fail)',
    TEST_EVENTS.CART_UPDATE_MOCHA_NO_PRICE,
    null,
    createSimpleCriteria('95', 'UpdateCart: isSet Comparator', {
      combinator: 'And',
      searchQueries: [
        {
          combinator: 'And',
          searchQueries: [
            {
              dataType: 'customEvent',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'customEvent',
                    field: 'updateCart',
                    comparatorType: 'IsSet',
                    value: '',
                    fieldType: 'object'
                  },
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.name',
                    comparatorType: 'IsSet',
                    value: '',
                    fieldType: 'string'
                  },
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.price',
                    comparatorType: 'IsSet',
                    value: '',
                    fieldType: 'double'
                  },
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.quantity',
                    comparatorType: 'IsSet',
                    value: '',
                    fieldType: 'long'
                  }
                ]
              }
            }
          ]
        }
      ]
    }),
    null
  );

  // Boolean Tests
  testBasicCriteria(
    'should return criteriaId 100 (boolean test)',
    null,
    TEST_USER_DATA.BOOLEAN_TRUE,
    createBooleanCriteria('100', 'subscribed', 'true'),
    '100'
  );

  // DoesNotEqual Tests
  testBasicCriteria(
    'should return criteriaId 194 if Contact: Phone Number != 57688559',
    null,
    TEST_USER_DATA.PHONE_NUMBER_DIFFERENT,
    createDoesNotEqualCriteria(
      '194',
      'Contact: Phone Number != 57688559',
      'user',
      'phoneNumber',
      '57688559',
      'string'
    ),
    '194'
  );

  testBasicCriteria(
    'should return criteriaId 293 if Contact: subscribed != false',
    null,
    TEST_USER_DATA.PHONE_NUMBER_DIFFERENT,
    createDoesNotEqualCriteria(
      '293',
      'Contact: subscribed != false',
      'user',
      'subscribed',
      'false',
      'boolean'
    ),
    '293'
  );

  testBasicCriteria(
    'should return criteriaId 297 if Purchase: shoppingCartItems.quantity != 12345678',
    TEST_EVENTS.PURCHASE_MONITOR,
    null,
    createDoesNotEqualCriteria(
      '297',
      'Purchase: shoppingCartItems.quantity != 12345678',
      'purchase',
      'shoppingCartItems.quantity',
      '12345678',
      'long'
    ),
    '297'
  );

  testBasicCriteria(
    'should return criteriaId 298 if Purchase: shoppingCartItems.price != 105',
    TEST_EVENTS.PURCHASE_MONITOR_DIFFERENT_PRICE,
    null,
    createDoesNotEqualCriteria(
      '298',
      'Purchase: shoppingCartItems.price != 105',
      'purchase',
      'shoppingCartItems.price',
      '105',
      'double'
    ),
    '298'
  );
});

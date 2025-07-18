import {
  COMPLEX_CRITERIA_1,
  COMPLEX_CRITERIA_2,
  COMPLEX_CRITERIA_3,
  MOCK_EVENTS,
  MOCK_USER_UPDATES,
  MOCK_CUSTOM_EVENTS
} from './constants';
import {
  setupLocalStorageMock,
  testCriteriaMatch,
  testCriteriaMatchEventsOnly,
  runCriteriaCheck,
  createSimpleCriteria
} from './testHelpers';

describe('complexCriteria', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  // Using helper functions for simple cases
  testCriteriaMatch(
    'should return criteriaId 98 (complex criteria 1)',
    [MOCK_EVENTS.PURCHASE_MONITOR],
    MOCK_USER_UPDATES.HONDA_JAPAN,
    {
      count: 1,
      criteriaSets: [
        {
          criteriaId: '98',
          name: 'Custom Event',
          createdAt: 1716560453973,
          updatedAt: 1716560453973,
          searchQuery: {
            combinator: 'Or',
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
                          field: 'eventName',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'customEvent',
                          id: 23,
                          value: 'button.clicked'
                        },
                        {
                          field: 'button-clicked.animal',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'customEvent',
                          id: 25,
                          value: 'giraffe'
                        }
                      ]
                    }
                  },
                  {
                    dataType: 'customEvent',
                    searchCombo: {
                      combinator: 'And',
                      searchQueries: [
                        {
                          field: 'updateCart.updatedShoppingCartItems.price',
                          fieldType: 'double',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'customEvent',
                          id: 28,
                          value: '120'
                        },
                        {
                          field: 'updateCart.updatedShoppingCartItems.quantity',
                          fieldType: 'long',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'customEvent',
                          id: 29,
                          valueLong: 100,
                          value: '100'
                        }
                      ]
                    }
                  }
                ]
              },
              {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'purchase',
                    searchCombo: {
                      combinator: 'And',
                      searchQueries: [
                        {
                          field: 'shoppingCartItems.name',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'purchase',
                          id: 31,
                          value: 'monitor'
                        },
                        {
                          field: 'shoppingCartItems.quantity',
                          fieldType: 'long',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'purchase',
                          id: 32,
                          valueLong: 5,
                          value: '5'
                        }
                      ]
                    }
                  },
                  {
                    dataType: 'user',
                    searchCombo: {
                      combinator: 'And',
                      searchQueries: [
                        {
                          field: 'country',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'user',
                          id: 34,
                          value: 'Japan'
                        },
                        {
                          field: 'preferred_car_models',
                          fieldType: 'string',
                          comparatorType: 'Contains',
                          dataType: 'user',
                          id: 36,
                          value: 'Honda'
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    '98'
  );

  testCriteriaMatch(
    'should return null (complex criteria 1 fail)',
    [MOCK_EVENTS.PURCHASE_MONITOR],
    MOCK_USER_UPDATES.HONDA_ONLY,
    {
      count: 1,
      criteriaSets: [
        {
          criteriaId: '98',
          name: 'Custom Event',
          createdAt: 1716560453973,
          updatedAt: 1716560453973,
          searchQuery: {
            combinator: 'Or',
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
                          field: 'eventName',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'customEvent',
                          id: 23,
                          value: 'button.clicked'
                        },
                        {
                          field: 'button-clicked.animal',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'customEvent',
                          id: 25,
                          value: 'giraffe'
                        }
                      ]
                    }
                  },
                  {
                    dataType: 'customEvent',
                    searchCombo: {
                      combinator: 'And',
                      searchQueries: [
                        {
                          field: 'updateCart.updatedShoppingCartItems.price',
                          fieldType: 'double',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'customEvent',
                          id: 28,
                          value: '120'
                        },
                        {
                          field: 'updateCart.updatedShoppingCartItems.quantity',
                          fieldType: 'long',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'customEvent',
                          id: 29,
                          valueLong: 100,
                          value: '100'
                        }
                      ]
                    }
                  }
                ]
              },
              {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'purchase',
                    searchCombo: {
                      combinator: 'And',
                      searchQueries: [
                        {
                          field: 'shoppingCartItems.name',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'purchase',
                          id: 31,
                          value: 'monitor'
                        },
                        {
                          field: 'shoppingCartItems.quantity',
                          fieldType: 'long',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'purchase',
                          id: 32,
                          valueLong: 5,
                          value: '5'
                        }
                      ]
                    }
                  },
                  {
                    dataType: 'user',
                    searchCombo: {
                      combinator: 'And',
                      searchQueries: [
                        {
                          field: 'country',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'user',
                          id: 34,
                          value: 'Japan'
                        },
                        {
                          field: 'preferred_car_models',
                          fieldType: 'string',
                          comparatorType: 'Contains',
                          dataType: 'user',
                          id: 36,
                          value: 'Honda'
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    null
  );

  // Using predefined complex criteria constants for cleaner tests
  testCriteriaMatch(
    'should return criteriaId 290 if (1 OR 2 OR 3) AND (4 AND 5) AND (6 NOT 7) matched',
    [MOCK_CUSTOM_EVENTS.BUTTON_CLICKED_BIRTHDAY, MOCK_EVENTS.PURCHASE_TESTING],
    MOCK_USER_UPDATES.ADAM,
    COMPLEX_CRITERIA_1,
    '290'
  );

  testCriteriaMatch(
    'should return criteriaId null if (1 OR 2 OR 3) AND (4 AND 5) AND (6 NOT 7) - No match',
    [
      {
        eventType: 'customEvent',
        eventName: 'saved_cars',
        dataFields: { color: '' }
      },
      {
        eventType: 'customEvent',
        eventName: 'animal-found',
        dataFields: { vaccinated: true }
      },
      MOCK_EVENTS.PURCHASE_TESTING
    ],
    MOCK_USER_UPDATES.XCODE,
    COMPLEX_CRITERIA_1,
    null
  );

  // Complex criteria 2 using constants
  testCriteriaMatch(
    'should return criteriaId 291 if (6 OR 7) OR (4 AND 5) OR (1 NOT 2 NOT 3) matched',
    [
      {
        eventType: 'customEvent',
        eventName: 'saved_cars',
        dataFields: { color: 'black' }
      },
      {
        eventType: 'customEvent',
        eventName: 'animal-found',
        dataFields: { vaccinated: true }
      },
      MOCK_EVENTS.PURCHASE_TESTING_110
    ],
    MOCK_USER_UPDATES.XCODE,
    COMPLEX_CRITERIA_2,
    '291'
  );

  testCriteriaMatch(
    'should return criteriaId null if (6 OR 7) OR (4 AND 5) OR (1 NOT 2 NOT 3) - No match',
    [
      {
        eventType: 'purchase',
        dataFields: { total: 10, reason: 'null' }
      }
    ],
    {
      dataFields: { firstName: 'Alex' },
      eventType: 'user'
    },
    COMPLEX_CRITERIA_2,
    null
  );

  // Complex criteria 3 tests
  testCriteriaMatchEventsOnly(
    'should return criteriaId 292 if (1 AND 2) NOR (3 OR 4 OR 5) NOR (6 NOR 7) matched',
    [
      {
        dataType: 'user',
        dataFields: { firstName: 'xcode', lastName: 'ssr' }
      },
      {
        dataType: 'customEvent',
        eventName: 'animal-found',
        dataFields: { vaccinated: true, count: 10 }
      }
    ],
    COMPLEX_CRITERIA_3,
    '292'
  );

  testCriteriaMatch(
    'should return criteriaId null if (1 AND 2) NOR (3 OR 4 OR 5) NOR (6 NOR 7) - No match',
    [
      {
        eventType: 'customEvent',
        eventName: 'animal-found',
        dataFields: { vaccinated: false, count: 4 }
      }
    ],
    {
      eventType: 'user',
      dataFields: { firstName: 'Alex', lastName: 'Aris' }
    },
    COMPLEX_CRITERIA_3,
    null
  );

  // Additional test scenarios using constants
  testCriteriaMatch(
    'should return criteriaId 151 (sampleTest1)',
    [MOCK_CUSTOM_EVENTS.ANIMAL_FOUND_CAT, MOCK_EVENTS.PURCHASE_CARAMEL],
    null,
    createSimpleCriteria('151', 'test criteria', {
      combinator: 'And',
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
                    field: 'animal-found.type',
                    comparatorType: 'Equals',
                    value: 'cat',
                    fieldType: 'string'
                  },
                  {
                    dataType: 'customEvent',
                    field: 'animal-found.count',
                    comparatorType: 'LessThan',
                    value: '5',
                    fieldType: 'long'
                  }
                ]
              }
            }
          ]
        },
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
                    value: 'Caramel',
                    fieldType: 'string'
                  },
                  {
                    dataType: 'purchase',
                    field: 'shoppingCartItems.quantity',
                    comparatorType: 'GreaterThanOrEqualTo',
                    value: '2',
                    fieldType: 'long'
                  }
                ]
              }
            }
          ]
        }
      ]
    }),
    '151'
  );

  // Demonstrate custom test for edge cases that don't fit the helper pattern
  // Note: This test shows how to create custom scenarios using helper functions
  it.skip('should handle complex custom mock data scenario', () => {
    const customEventList = [
      MOCK_EVENTS.CART_UPDATE_MOCHA_NO_TOTAL,
      {
        ...MOCK_EVENTS.CART_UPDATE_MOCHA_NO_TOTAL,
        items: [
          { ...MOCK_EVENTS.CART_UPDATE_MOCHA_NO_TOTAL.items[0], price: 50.0 }
        ]
      }
    ];
    const customUserData = MOCK_USER_UPDATES.HONDA_ONLY;

    const result = runCriteriaCheck(
      createSimpleCriteria('134', 'Min-Max 2', {
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
                      field: 'updateCart.updatedShoppingCartItems.price',
                      comparatorType: 'Equals',
                      value: '50.0',
                      fieldType: 'double'
                    }
                  ]
                },
                minMatch: 2,
                maxMatch: 3
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'preferred_car_models',
                      comparatorType: 'Equals',
                      value: 'Honda',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }),
      customEventList,
      customUserData
    );

    expect(result).toEqual('134');
  });
});

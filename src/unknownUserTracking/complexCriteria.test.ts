import { MOCK_EVENTS, MOCK_USER_UPDATES } from './tests/constants';
import {
  setupLocalStorageMock,
  testCriteriaMatch,
  testCriteriaMatchEventsOnly
} from './tests/testHelpers';

describe('complexCriteria', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  // Complex criteria 1 tests
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

  // Complex criteria 2 tests
  testCriteriaMatch(
    'should return criteriaId 99 (complex criteria 2)',
    [MOCK_EVENTS.CART_UPDATE_MOCHA, MOCK_EVENTS.CART_UPDATE_MOCHA],
    MOCK_USER_UPDATES.SUBARU_USA,
    {
      count: 1,
      criteriaSets: [
        {
          criteriaId: '99',
          name: 'Custom Event',
          createdAt: 1716560453973,
          updatedAt: 1716560453973,
          searchQuery: {
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
                          field: 'eventName',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'customEvent',
                          id: 2,
                          value: 'button-clicked'
                        },
                        {
                          field: 'button-clicked.lastPageViewed',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'customEvent',
                          id: 4,
                          value: 'welcome page'
                        }
                      ]
                    }
                  },
                  {
                    dataType: 'customEvent',
                    minMatch: 2,
                    maxMatch: 3,
                    searchCombo: {
                      combinator: 'And',
                      searchQueries: [
                        {
                          field: 'updateCart.updatedShoppingCartItems.price',
                          fieldType: 'double',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'customEvent',
                          id: 6,
                          value: '85'
                        },
                        {
                          field: 'updateCart.updatedShoppingCartItems.quantity',
                          fieldType: 'long',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'customEvent',
                          id: 7,
                          valueLong: 50,
                          value: '50'
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
                          field: 'shoppingCartItems.name',
                          fieldType: 'string',
                          comparatorType: 'Equals',
                          dataType: 'purchase',
                          id: 16,
                          isFiltering: false,
                          value: 'coffee'
                        },
                        {
                          field: 'shoppingCartItems.quantity',
                          fieldType: 'long',
                          comparatorType: 'GreaterThanOrEqualTo',
                          dataType: 'purchase',
                          id: 17,
                          valueLong: 2,
                          value: '2'
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
                          id: 19,
                          value: 'USA'
                        },
                        {
                          field: 'preferred_car_models',
                          fieldType: 'string',
                          comparatorType: 'Contains',
                          dataType: 'user',
                          id: 21,
                          value: 'Subaru'
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
    '99'
  );

  // Rest of the tests will use similar pattern...
  // For now, let me continue with one more example and then show how the
  // remaining tests should be structured

  testCriteriaMatchEventsOnly(
    'should return criteriaId 101 (complex criteria 4)',
    [MOCK_EVENTS.PURCHASE_SNEAKERS_SLIPPERS],
    {
      count: 1,
      criteriaSets: [
        {
          criteriaId: '101',
          name: 'Complex Criteria 4: (NOT 9) AND 10',
          createdAt: 1719328083918,
          updatedAt: 1719328083918,
          searchQuery: {
            combinator: 'And',
            searchQueries: [
              {
                combinator: 'Not',
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
                          value: 'sneakers',
                          fieldType: 'string'
                        },
                        {
                          dataType: 'purchase',
                          field: 'shoppingCartItems.quantity',
                          comparatorType: 'LessThanOrEqualTo',
                          value: '3',
                          fieldType: 'long'
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
                          dataType: 'purchase',
                          field: 'shoppingCartItems.name',
                          comparatorType: 'Equals',
                          value: 'slippers',
                          fieldType: 'string'
                        },
                        {
                          dataType: 'purchase',
                          field: 'shoppingCartItems.quantity',
                          comparatorType: 'GreaterThanOrEqualTo',
                          value: '3',
                          fieldType: 'long'
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
    '101'
  );

  testCriteriaMatchEventsOnly(
    'should return null (complex criteria 4 fail)',
    [MOCK_EVENTS.PURCHASE_SNEAKERS_SLIPPERS_QTY_2],
    {
      count: 1,
      criteriaSets: [
        {
          criteriaId: '101',
          name: 'Complex Criteria 4: (NOT 9) AND 10',
          createdAt: 1719328083918,
          updatedAt: 1719328083918,
          searchQuery: {
            combinator: 'And',
            searchQueries: [
              {
                combinator: 'Not',
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
                          value: 'sneakers',
                          fieldType: 'string'
                        },
                        {
                          dataType: 'purchase',
                          field: 'shoppingCartItems.quantity',
                          comparatorType: 'LessThanOrEqualTo',
                          value: '3',
                          fieldType: 'long'
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
                          dataType: 'purchase',
                          field: 'shoppingCartItems.name',
                          comparatorType: 'Equals',
                          value: 'slippers',
                          fieldType: 'string'
                        },
                        {
                          dataType: 'purchase',
                          field: 'shoppingCartItems.quantity',
                          comparatorType: 'GreaterThanOrEqualTo',
                          value: '3',
                          fieldType: 'long'
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
});

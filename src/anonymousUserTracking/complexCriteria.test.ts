import { SHARED_PREFS_EVENT_LIST_KEY } from '../constants';
import CriteriaCompletionChecker from './criteriaCompletionChecker';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

describe('complexCriteria', () => {
  beforeEach(() => {
    (global as any).localStorage = localStorageMock;
  });

  // complex criteria
  it('should return criteriaId 98 (complex criteria 1)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [
              {
                id: '12',
                name: 'monitor',
                price: 50,
                quantity: 10
              }
            ],
            total: 50,
            eventType: 'purchase'
          },
          {
            dataFields: {
              preferred_car_models: 'Honda',
              country: 'Japan'
            },
            eventType: 'user'
          }
        ]);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
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
                            field:
                              'updateCart.updatedShoppingCartItems.quantity',
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
      })
    );
    expect(result).toEqual('98');
  });

  it('should return null (complex criteria 1 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [
              {
                id: '12',
                name: 'monitor',
                price: 50,
                quantity: 10
              }
            ],
            total: 50,
            eventType: 'purchase'
          },
          {
            dataFields: {
              preferred_car_models: 'Honda'
            },
            eventType: 'user'
          }
        ]);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
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
                            field:
                              'updateCart.updatedShoppingCartItems.quantity',
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
      })
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId 99 (complex criteria 2)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ id: '12', name: 'Mocha', price: 90, quantity: 50 }],
            total: 50,
            eventType: 'cartUpdate'
          },
          {
            items: [{ id: '12', name: 'Mocha', price: 90, quantity: 50 }],
            total: 50,
            eventType: 'cartUpdate'
          },
          {
            dataFields: {
              preferred_car_models: 'Subaru',
              country: 'USA'
            },
            eventType: 'user'
          }
        ]);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
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
                            field:
                              'updateCart.updatedShoppingCartItems.quantity',
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
      })
    );
    expect(result).toEqual('99');
  });

  it('should return null (complex criteria 2 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ id: '12', name: 'Mocha', price: 90, quantity: 50 }],
            total: 50,
            eventType: 'cartUpdate'
          },
          {
            dataFields: {
              preferred_car_models: 'Subaru',
              country: 'USA'
            },
            eventType: 'user'
          }
        ]);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
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
                            field:
                              'updateCart.updatedShoppingCartItems.quantity',
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
      })
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId 100 (complex criteria 3)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ id: '12', name: 'Mocha', price: 90, quantity: 50 }],
            total: 50,
            eventType: 'cartUpdate'
          },
          {
            items: [{ id: '12', name: 'Mocha', price: 90, quantity: 50 }],
            total: 50,
            eventType: 'cartUpdate'
          },

          {
            dataFields: {
              preferred_car_models: 'Subaru',
              country: 'USA'
            },
            eventType: 'user'
          },
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked': {
                lastPageViewed: 'welcome page'
              }
            },
            eventType: 'customEvent'
          },
          {
            items: [
              {
                id: '12',
                name: 'coffee',
                price: 10,
                quantity: 5
              }
            ],
            total: 2,
            eventType: 'purchase'
          }
        ]);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
          {
            criteriaId: '100',
            name: 'Custom Event',
            createdAt: 1716560453973,
            updatedAt: 1716560453973,
            searchQuery: {
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
                            field:
                              'updateCart.updatedShoppingCartItems.quantity',
                            fieldType: 'long',
                            comparatorType: 'GreaterThanOrEqualTo',
                            dataType: 'customEvent',
                            id: 7,
                            valueLong: 50,
                            value: '50'
                          }
                        ]
                      }
                    },
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
                            id: 9,
                            value: 'coffee'
                          },
                          {
                            field: 'shoppingCartItems.quantity',
                            fieldType: 'long',
                            comparatorType: 'GreaterThanOrEqualTo',
                            dataType: 'purchase',
                            id: 10,
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
                            id: 12,
                            value: 'USA'
                          },
                          {
                            field: 'preferred_car_models',
                            fieldType: 'string',
                            comparatorType: 'Contains',
                            dataType: 'user',
                            id: 14,
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
      })
    );
    expect(result).toEqual('100');
  });

  it('should return null (complex criteria 3 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ id: '12', name: 'Mocha', price: 90, quantity: 50 }],
            total: 50,
            eventType: 'cartUpdate'
          },
          {
            items: [{ id: '12', name: 'Mocha', price: 90, quantity: 50 }],
            total: 50,
            eventType: 'cartUpdate'
          },

          {
            dataFields: {
              preferred_car_models: 'Subaru',
              country: 'USA'
            },
            eventType: 'user'
          },
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked.lastPageViewed': 'welcome page'
            },
            eventType: 'customEvent'
          }
        ]);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
          {
            criteriaId: '100',
            name: 'Custom Event',
            createdAt: 1716560453973,
            updatedAt: 1716560453973,
            searchQuery: {
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
                            field:
                              'updateCart.updatedShoppingCartItems.quantity',
                            fieldType: 'long',
                            comparatorType: 'GreaterThanOrEqualTo',
                            dataType: 'customEvent',
                            id: 7,
                            valueLong: 50,
                            value: '50'
                          }
                        ]
                      }
                    },
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
                            id: 9,
                            value: 'coffee'
                          },
                          {
                            field: 'shoppingCartItems.quantity',
                            fieldType: 'long',
                            comparatorType: 'GreaterThanOrEqualTo',
                            dataType: 'purchase',
                            id: 10,
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
                            id: 12,
                            value: 'USA'
                          },
                          {
                            field: 'preferred_car_models',
                            fieldType: 'string',
                            comparatorType: 'Contains',
                            dataType: 'user',
                            id: 14,
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
      })
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId 101 (complex criteria 4)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [
              { id: '12', name: 'sneakers', price: 10, quantity: 5 },
              { id: '13', name: 'slippers', price: 10, quantity: 3 }
            ],
            total: 2,
            eventType: 'purchase'
          }
        ]);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
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
      })
    );
    expect(result).toEqual('101');
  });

  it('should return null (complex criteria 4 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [
              { id: '12', name: 'sneakers', price: 10, quantity: 2 },
              { id: '13', name: 'slippers', price: 10, quantity: 3 }
            ],
            total: 2,
            eventType: 'purchase'
          }
        ]);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
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
      })
    );
    expect(result).toEqual(null);
  });
});

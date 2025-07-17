import {
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY
} from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';
import {
  COMPLEX_CRITERIA_1,
  COMPLEX_CRITERIA_2,
  COMPLEX_CRITERIA_3
} from './constants';

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
          }
        ]);
      }

      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            preferred_car_models: 'Honda',
            country: 'Japan'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
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
          }
        ]);
      }

      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            preferred_car_models: 'Honda'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
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
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            preferred_car_models: 'Subaru',
            country: 'USA'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
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
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            preferred_car_models: 'Subaru',
            country: 'USA'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
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
            eventName: 'button-clicked',
            dataFields: {
              lastPageViewed: 'welcome page'
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
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            preferred_car_models: 'Subaru',
            country: 'USA'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criteriaSets: [
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
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked.lastPageViewed': 'welcome page'
            },
            eventType: 'customEvent'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            preferred_car_models: 'Subaru',
            country: 'USA'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criteriaSets: [
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
              { id: '13', name: 'slippers', price: 10, quantity: 2 }
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
      })
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId 134 (Min-Max 2)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ id: '12', name: 'Mocha', price: 50, quantity: 50 }],
            eventType: 'cartUpdate'
          },
          {
            items: [{ id: '12', name: 'Mocha', price: 50.0, quantity: 50 }],
            eventType: 'cartUpdate'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            preferred_car_models: 'Honda'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criteriaSets: [
          {
            criteriaId: '134',
            name: 'Min-Max 2',
            createdAt: 1719336370734,
            updatedAt: 1719337067199,
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
            }
          }
        ]
      })
    );
    expect(result).toEqual('134');
  });

  it('should return criteriaId 151 (sampleTest1)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              'animal-found': {
                type: 'cat',
                count: 4
              }
            },
            eventType: 'customEvent'
          },
          {
            items: [{ id: '12', name: 'Caramel', price: 3, quantity: 5 }],
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
        criteriaSets: [
          {
            criteriaId: '151',
            name: 'test criteria',
            createdAt: 1719336370734,
            updatedAt: 1719337067199,
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
                    },
                    {
                      dataType: 'customEvent',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'customEvent',
                            field: 'updateCart.updatedShoppingCartItems.price',
                            comparatorType: 'GreaterThanOrEqualTo',
                            value: '500',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'customEvent',
                            field: 'updateCart.updatedShoppingCartItems.price',
                            comparatorType: 'LessThan',
                            value: '20',
                            fieldType: 'double'
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
                    },
                    {
                      dataType: 'user',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'user',
                            field: 'country',
                            comparatorType: 'Equals',
                            value: 'UK',
                            fieldType: 'string'
                          },
                          {
                            dataType: 'user',
                            field: 'likes_boba',
                            comparatorType: 'Equals',
                            value: 'false',
                            fieldType: 'boolean'
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
    expect(result).toEqual('151');
  });

  it('should return null (sampleTest1 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              'animal-found.type': 'dog',
              'animal-found.count': 4
            },
            eventType: 'customEvent'
          },
          {
            items: [{ id: '12', name: 'Caramel', price: 3, quantity: 5 }],
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
        criteriaSets: [
          {
            criteriaId: '151',
            name: 'test criteria',
            createdAt: 1719336370734,
            updatedAt: 1719337067199,
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
                    },
                    {
                      dataType: 'customEvent',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'customEvent',
                            field: 'updateCart.updatedShoppingCartItems.price',
                            comparatorType: 'GreaterThanOrEqualTo',
                            value: '500',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'customEvent',
                            field: 'updateCart.updatedShoppingCartItems.price',
                            comparatorType: 'LessThan',
                            value: '20',
                            fieldType: 'double'
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
                    },
                    {
                      dataType: 'user',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'user',
                            field: 'country',
                            comparatorType: 'Equals',
                            value: 'UK',
                            fieldType: 'string'
                          },
                          {
                            dataType: 'user',
                            field: 'likes_boba',
                            comparatorType: 'Equals',
                            value: 'false',
                            fieldType: 'boolean'
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

  //  MARK: Complex criteria #1
  it('should return criteriaId 290 if (1 OR 2 OR 3) AND (4 AND 5) AND (6 NOT 7) matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              saved_cars: { color: 'black' },
              'animal-found': { vaccinated: true },
              eventName: 'birthday'
            },
            eventType: 'customEvent'
          },
          {
            dataFields: { reason: 'testing', total: 30 },
            eventType: 'purchase'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            firstName: 'Adam'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify(COMPLEX_CRITERIA_1)
    );
    expect(result).toEqual('290');
  });

  it('should return criteriaId null if (1 OR 2 OR 3) AND (4 AND 5) AND (6 NOT 7) - No match', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventType: 'customEvent',
            eventName: 'saved_cars',
            dataFields: {
              color: ''
            }
          },
          {
            eventType: 'customEvent',
            eventName: 'animal-found',
            dataFields: {
              vaccinated: true
            }
          },
          {
            eventType: 'purchase',
            dataFields: {
              total: 30,
              reason: 'testing'
            }
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          eventType: 'user',
          dataFields: {
            firstName: 'Alex'
          }
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify(COMPLEX_CRITERIA_1)
    );
    expect(result).toEqual(null);
  });

  //  MARK: Complex criteria #2
  it('should return criteriaId 291 if (6 OR 7) OR (4 AND 5) OR (1 NOT 2 NOT 3) matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventType: 'customEvent',
            eventName: 'saved_cars',
            dataFields: {
              color: 'black'
            }
          },
          {
            eventType: 'customEvent',
            eventName: 'animal-found',
            dataFields: {
              vaccinated: true
            }
          },
          {
            eventType: 'purchase',
            dataFields: {
              total: 110,
              reason: 'testing'
            }
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          eventType: 'user',
          dataFields: {
            firstName: 'xcode'
          }
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify(COMPLEX_CRITERIA_2)
    );
    expect(result).toEqual('291');
  });

  it('should return criteriaId null if (6 OR 7) OR (4 AND 5) OR (1 NOT 2 NOT 3) - No match', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventType: 'purchase',
            dataFields: {
              total: 10,
              reason: 'null'
            }
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: {
            firstName: 'Alex'
          },
          eventType: 'user'
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify(COMPLEX_CRITERIA_2)
    );
    expect(result).toEqual(null);
  });

  //  MARK: Complex criteria #3
  it('should return criteriaId 292 if (1 AND 2) NOR (3 OR 4 OR 5) NOR (6 NOR 7) matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataType: 'user',
            dataFields: {
              firstName: 'xcode',
              lastName: 'ssr'
            }
          },
          {
            dataType: 'customEvent',
            eventName: 'animal-found',
            dataFields: {
              vaccinated: true,
              count: 10
            }
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
      JSON.stringify(COMPLEX_CRITERIA_3)
    );
    expect(result).toEqual('292');
  });

  it('should return criteriaId null if (1 AND 2) NOR (3 OR 4 OR 5) NOR (6 NOR 7) - No match', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventType: 'customEvent',
            eventName: 'animal-found',
            dataFields: {
              vaccinated: false,
              count: 4
            }
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          eventType: 'user',
          dataFields: {
            firstName: 'Alex',
            lastName: 'Aris'
          }
        });
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList,
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify(COMPLEX_CRITERIA_3)
    );
    expect(result).toEqual(null);
  });
});

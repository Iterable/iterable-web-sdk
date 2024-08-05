import { SHARED_PREFS_EVENT_LIST_KEY } from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

describe('CriteriaCompletionChecker', () => {
  beforeEach(() => {
    (global as any).localStorage = localStorageMock;
  });

  it('should return null if criteriaData is empty', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return '[]';
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria('{}');
    expect(result).toBeNull();
  });

  it('should return criteriaId if customEvent is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
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
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
            }
          }
        ]
      })
    );
    expect(result).toEqual('6');
  });

  it('should return criteriaId if customEvent is matched when minMatch present', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'testEvent',
            createdAt: 1708494757530,
            dataFields: { browserVisit: { website: { domain: 'google.com' } } },
            createNewFields: true,
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
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
            }
          }
        ]
      })
    );
    expect(result).toEqual('6');
  });

  it('should return criteriaId if purchase event is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            createdAt: 1708494757530,
            items: [
              { name: 'keyboard', id: 'fdsafds', price: 10, quantity: 2 }
            ],
            total: 10,
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
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
                            value: 'keyboard',
                            fieldType: 'string'
                          },
                          {
                            dataType: 'purchase',
                            field: 'shoppingCartItems.price',
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
            }
          }
        ]
      })
    );
    expect(result).toEqual('6');
  });

  it('should return null if updateCart event with all props in item is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            createdAt: 1708494757530,
            items: [
              { name: 'keyboard', id: 'fdsafds', price: 10, quantity: 2 },
              { name: 'Cofee', id: 'fdsafds', price: 10, quantity: 2 }
            ],
            eventType: 'cartUpdate'
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
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'keyboard',
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
            }
          }
        ]
      })
    );
    expect(result).toEqual('6');
  });

  it('should return null if updateCart event with items is NOT matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            createdAt: 1708494757530,
            items: [
              { name: 'keyboard', id: 'fdsafds', price: 9, quantity: 2 },
              { name: 'Cofee', id: 'fdsafds', price: 10, quantity: 2 }
            ],
            eventType: 'cartUpdate'
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
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'keyboard',
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
            }
          }
        ]
      })
    );
    expect(result).toBeNull();
  });

  it('should return criteriaId if updateCart event is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            createdAt: 1708494757530,
            items: [
              { name: 'keyboard', id: 'fdsafds', price: 10, quantity: 2 }
            ],
            eventType: 'cartUpdate'
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
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
            }
          }
        ]
      })
    );
    expect(result).toEqual('6');
  });

  it('should return criteriaId if criteriaData condition with numeric is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [
              {
                id: '123',
                name: 'Black Coffee',
                quantity: 1,
                price: 4
              }
            ],
            user: {
              userId: 'user'
            },
            total: 0,
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
            criteriaId: '6',
            name: 'shoppingCartItemsCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
                            value: 'Black Coffee',
                            fieldType: 'string'
                          },
                          {
                            dataType: 'purchase',
                            field: 'shoppingCartItems.price',
                            comparatorType: 'GreaterThanOrEqualTo',
                            value: '4.00',
                            fieldType: 'double'
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
    expect(result).toEqual('6');
  });

  it('should return criteriaId if criteriaData condition with StartsWith is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'testEvent',
            createdAt: 1708494757530,
            dataFields: undefined,
            createNewFields: true,
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
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
                            comparatorType: 'StartsWith',
                            value: 'test',
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
    expect(result).toEqual('6');

    const result1 = checker.getMatchedCriteria(
      JSON.stringify({
        count: 1,
        criterias: [
          {
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
                            comparatorType: 'Contains',
                            value: 'test',
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
    expect(result1).toEqual('6');
  });

  it('should return criteriaId if criteria regex match with value is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            email: 'testEvent@example.com',
            createdAt: 1708494757530,
            dataFields: undefined,
            createNewFields: true,
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
            criteriaId: '6',
            name: 'EventCriteria',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
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
                            field: 'email',
                            comparatorType: 'MatchesRegex',
                            value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+.)+[A-Za-z]+$/,
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
    expect(result).toEqual('6');
  });

  // isSet criteria
  it('should return criteriaId 97 if isset user criteria is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              country: 'UK',
              eventTimeStamp: 10,
              phoneNumberDetails: '99999999',
              'shoppingCartItems.price': 50.5
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
            criteriaId: '97',
            name: 'User',
            createdAt: 1716560453973,
            updatedAt: 1716560453973,
            searchQuery: {
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
                            field: 'country',
                            fieldType: 'string',
                            comparatorType: 'IsSet',
                            dataType: 'user',
                            id: 25,
                            value: ''
                          },
                          {
                            field: 'eventTimeStamp',
                            fieldType: 'long',
                            comparatorType: 'IsSet',
                            dataType: 'user',
                            id: 26,
                            valueLong: null,
                            value: ''
                          },
                          {
                            field: 'phoneNumberDetails',
                            fieldType: 'object',
                            comparatorType: 'IsSet',
                            dataType: 'user',
                            id: 28,
                            value: ''
                          },
                          {
                            field: 'shoppingCartItems.price',
                            fieldType: 'double',
                            comparatorType: 'IsSet',
                            dataType: 'user',
                            id: 30,
                            value: ''
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
    expect(result).toEqual('97');
  });

  it('should return null (isset user criteria fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              eventTimeStamp: 10,
              phoneNumberDetails: '99999999',
              'shoppingCartItems.price': 50.5
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
            criteriaId: '97',
            name: 'User',
            createdAt: 1716560453973,
            updatedAt: 1716560453973,
            searchQuery: {
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
                            field: 'country',
                            fieldType: 'string',
                            comparatorType: 'IsSet',
                            dataType: 'user',
                            id: 25,
                            value: ''
                          },
                          {
                            field: 'eventTimeStamp',
                            fieldType: 'long',
                            comparatorType: 'IsSet',
                            dataType: 'user',
                            id: 26,
                            valueLong: null,
                            value: ''
                          },
                          {
                            field: 'phoneNumberDetails',
                            fieldType: 'object',
                            comparatorType: 'IsSet',
                            dataType: 'user',
                            id: 28,
                            value: ''
                          },
                          {
                            field: 'shoppingCartItems.price',
                            fieldType: 'double',
                            comparatorType: 'IsSet',
                            dataType: 'user',
                            id: 30,
                            value: ''
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

  it('should return criteriaId 94 if isset customEvent criteria is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked': 'signup page',
              'button-clicked.animal': 'test page',
              'button-clicked.clickCount': '2',
              total: 3
            },
            createdAt: 1700071052507,
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
            criteriaId: '94',
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
                            field: 'button-clicked',
                            fieldType: 'object',
                            comparatorType: 'IsSet',
                            dataType: 'customEvent',
                            id: 2,
                            value: ''
                          },
                          {
                            field: 'button-clicked.animal',
                            fieldType: 'string',
                            comparatorType: 'IsSet',
                            dataType: 'customEvent',
                            id: 4,
                            value: ''
                          },
                          {
                            field: 'button-clicked.clickCount',
                            fieldType: 'long',
                            comparatorType: 'IsSet',
                            dataType: 'customEvent',
                            id: 5,
                            valueLong: null,
                            value: ''
                          },
                          {
                            field: 'total',
                            fieldType: 'double',
                            comparatorType: 'IsSet',
                            dataType: 'customEvent',
                            id: 9,
                            value: ''
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
    expect(result).toEqual('94');
  });

  it('should return null (isset customEvent criteria fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked': { animal: 'test page' },
              total: 3
            },
            createdAt: 1700071052507,
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
            criteriaId: '94',
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
                            field: 'button-clicked',
                            fieldType: 'object',
                            comparatorType: 'IsSet',
                            dataType: 'customEvent',
                            id: 2,
                            value: ''
                          },
                          {
                            field: 'button-clicked.animal',
                            fieldType: 'string',
                            comparatorType: 'IsSet',
                            dataType: 'customEvent',
                            id: 4,
                            value: ''
                          },
                          {
                            field: 'button-clicked.clickCount',
                            fieldType: 'long',
                            comparatorType: 'IsSet',
                            dataType: 'customEvent',
                            id: 5,
                            valueLong: null,
                            value: ''
                          },
                          {
                            field: 'total',
                            fieldType: 'double',
                            comparatorType: 'IsSet',
                            dataType: 'customEvent',
                            id: 9,
                            value: ''
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

  it('should return criteriaId 96 if isset purchase criteria is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [
              {
                id: '12',
                name: 'monitor',
                price: 10,
                quantity: 10
              }
            ],
            total: 50,
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
            criteriaId: '96',
            name: 'Purchase',
            createdAt: 1716560453973,
            updatedAt: 1716560453973,
            searchQuery: {
              combinator: 'And',
              searchQueries: [
                {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'purchase',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            field: 'shoppingCartItems',
                            fieldType: 'object',
                            comparatorType: 'IsSet',
                            dataType: 'purchase',
                            id: 1,
                            value: ''
                          },
                          {
                            field: 'shoppingCartItems.price',
                            fieldType: 'double',
                            comparatorType: 'IsSet',
                            dataType: 'purchase',
                            id: 3,
                            value: ''
                          },
                          {
                            field: 'shoppingCartItems.name',
                            fieldType: 'string',
                            comparatorType: 'IsSet',
                            dataType: 'purchase',
                            id: 5,
                            value: ''
                          },
                          {
                            field: 'total',
                            fieldType: 'double',
                            comparatorType: 'IsSet',
                            dataType: 'purchase',
                            id: 7,
                            value: ''
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
    expect(result).toEqual('96');
  });

  it('should return null (isset purchase criteria fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [
              {
                id: '12',
                name: 'monitor',
                quantity: 10
              }
            ],
            total: 50,
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
            criteriaId: '96',
            name: 'Purchase',
            createdAt: 1716560453973,
            updatedAt: 1716560453973,
            searchQuery: {
              combinator: 'And',
              searchQueries: [
                {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'purchase',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            field: 'shoppingCartItems',
                            fieldType: 'object',
                            comparatorType: 'IsSet',
                            dataType: 'purchase',
                            id: 1,
                            value: ''
                          },
                          {
                            field: 'shoppingCartItems.price',
                            fieldType: 'double',
                            comparatorType: 'IsSet',
                            dataType: 'purchase',
                            id: 3,
                            value: ''
                          },
                          {
                            field: 'shoppingCartItems.name',
                            fieldType: 'string',
                            comparatorType: 'IsSet',
                            dataType: 'purchase',
                            id: 5,
                            value: ''
                          },
                          {
                            field: 'total',
                            fieldType: 'double',
                            comparatorType: 'IsSet',
                            dataType: 'purchase',
                            id: 7,
                            value: ''
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

  it('should return criteriaId 95 if isset updateCart criteria is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ id: '12', name: 'Mocha', price: 50, quantity: 50 }],
            eventType: 'cartUpdate'
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
            criteriaId: '95',
            name: 'UpdateCart: isSet Comparator',
            createdAt: 1719328291857,
            updatedAt: 1719328291857,
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
                            field:
                              'updateCart.updatedShoppingCartItems.quantity',
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
            }
          }
        ]
      })
    );
    expect(result).toEqual('95');
  });

  it('should return null (isset updateCart criteria fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ id: '12', name: 'Mocha', quantity: 50 }],
            eventType: 'cartUpdate'
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
            criteriaId: '95',
            name: 'UpdateCart: isSet Comparator',
            createdAt: 1719328291857,
            updatedAt: 1719328291857,
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
                            field:
                              'updateCart.updatedShoppingCartItems.quantity',
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
            }
          }
        ]
      })
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId 100 (boolean test)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              subscribed: true,
              phoneNumber: '99999999'
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
            criteriaId: '100',
            name: 'User',
            createdAt: 1716560453973,
            updatedAt: 1716560453973,
            searchQuery: {
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
                            field: 'subscribed',
                            fieldType: 'boolean',
                            comparatorType: 'Equals',
                            dataType: 'user',
                            id: 25,
                            value: 'true'
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
            }
          }
        ]
      })
    );
    expect(result).toEqual('100');
  });
});

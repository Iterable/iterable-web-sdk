import {
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY
} from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

describe('CombinationLogicCriteria', () => {
  beforeEach(() => {
    (global as any).localStorage = localStorageMock;
  });

  it('should return criteriaId 1 if Contact Property AND Custom Event is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { total: 10 },
            eventType: 'customEvent'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'David' },
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
            criteriaId: '1',
            name: 'Combination Logic - Contact Property AND Custom Event',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            dataType: 'user',
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'total',
                            comparatorType: 'Equals',
                            value: '10',
                            id: 6,
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
    expect(result).toEqual('1');
  });

  it('should return null (combination logic criteria 1 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { total: 10 },
            eventType: 'customEvent'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'Davidson' },
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
            criteriaId: '1',
            name: 'Combination Logic - Contact Property AND Custom Event',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            dataType: 'user',
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'total',
                            comparatorType: 'Equals',
                            value: '10',
                            id: 6,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 2 if Contact Property OR Custom Event is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { total: 10 },
            eventType: 'customEvent'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'David' },
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
            criteriaId: '2',
            name: 'Combination Logic - Contact Property OR Custom Event',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
              searchQueries: [
                {
                  combinator: 'Or',
                  searchQueries: [
                    {
                      dataType: 'user',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'user',
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'total',
                            comparatorType: 'Equals',
                            value: '10',
                            id: 6,
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
    expect(result).toEqual('2');
  });

  it('should return null (combination logic criteria 2 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { total: 101 },
            eventType: 'customEvent'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'Davidson' },
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
            criteriaId: '2',
            name: 'Combination Logic - Contact Property OR Custom Event',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
              searchQueries: [
                {
                  combinator: 'Or',
                  searchQueries: [
                    {
                      dataType: 'user',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'user',
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'total',
                            comparatorType: 'Equals',
                            value: '10',
                            id: 6,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 3 if Contact Property NOR (NOT) Custom Event is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              itesm: [{ name: 'Cofee', id: 'fdsafds', price: 10, quantity: 2 }],
              total: 10
            },
            eventType: 'customEvent'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'Davidson' },
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
            criteriaId: '3',
            name: 'Combination Logic - Contact Property NOR (NOT) Custom Event',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
              searchQueries: [
                {
                  combinator: 'Not',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'customEvent',
                            field: 'total',
                            comparatorType: 'Equals',
                            value: '10',
                            id: 6,
                            fieldType: 'double'
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
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
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
    expect(result).toEqual('3');
  });

  it('should return null (combination logic criteria 3 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { total: 1 },
            eventType: 'customEvent'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'David' },
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
            criteriaId: '3',
            name: 'Combination Logic - Contact Property NOR (NOT) Custom Event',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
              searchQueries: [
                {
                  combinator: 'Not',
                  searchQueries: [
                    {
                      dataType: 'user',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'user',
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'total',
                            comparatorType: 'Equals',
                            value: '10',
                            id: 6,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 4 if UpdateCart AND Contact Property is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
            eventType: 'cartUpdate'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'David' },
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
            criteriaId: '4',
            name: 'Combination Logic - UpdateCart AND Contact Property',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
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
    expect(result).toEqual('4');
  });

  it('should return null (combination logic criteria 4 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
            eventType: 'cartUpdate'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'Davidson' },
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
            criteriaId: '4',
            name: 'Combination Logic - UpdateCart AND Contact Property',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 5 if UpdateCart OR Contact Property is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
            eventType: 'cartUpdate'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'David' },
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
            criteriaId: '5',
            name: 'Combination Logic - UpdateCart OR Contact Property',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
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
    expect(result).toEqual('5');
  });

  it('should return null (combination logic criteria 5 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
            eventType: 'cartUpdate'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'Davidson' },
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
            criteriaId: '5',
            name: 'Combination Logic - UpdateCart OR Contact Property',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 6 if UpdateCart NOR (NOT) Contact Property is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'boiled', id: 'boiled', price: 10, quantity: 2 }],
            eventType: 'cartUpdate'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'Davidson' },
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
            criteriaId: '6',
            name: 'Combination Logic - UpdateCart NOR (NOT) Contact Property',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
              searchQueries: [
                {
                  combinator: 'Not',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'customEvent',
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
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

  it('should return null (combination logic criteria 6 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
            eventType: 'cartUpdate'
          }
        ]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          dataFields: { firstName: 'David' },
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
            criteriaId: '6',
            name: 'Combination Logic - UpdateCart NOR (NOT) Contact Property',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
              searchQueries: [
                {
                  combinator: 'Not',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'customEvent',
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
                            fieldType: 'string'
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
                            field: 'firstName',
                            comparatorType: 'Equals',
                            value: 'David',
                            id: 2,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 7 if Purchase AND UpdateCart is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
            eventType: 'purchase'
          },
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
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
        criteriaSets: [
          {
            criteriaId: '7',
            name: 'Combination Logic - Purchase AND UpdateCart',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            dataType: 'purchase',
                            field: 'shoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
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
    expect(result).toEqual('7');
  });

  it('should return null (combination logic criteria 7 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
            eventType: 'purchase'
          },
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
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
        criteriaSets: [
          {
            criteriaId: '7',
            name: 'Combination Logic - Purchase AND UpdateCart',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            dataType: 'purchase',
                            field: 'shoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 8 if Purchase OR UpdateCart is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
            eventType: 'purchase'
          },
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
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
        criteriaSets: [
          {
            criteriaId: '8',
            name: 'Combination Logic - Purchase OR UpdateCart',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
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
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
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
    expect(result).toEqual('8');
  });

  it('should return null (combination logic criteria 8 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
            eventType: 'purchase'
          },
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
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
        criteriaSets: [
          {
            criteriaId: '8',
            name: 'Combination Logic - Purchase OR UpdateCart',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
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
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 9 if Purchase NOR (NOT) UpdateCart is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'beef', id: 'beef', price: 10, quantity: 2 }],
            eventType: 'purchase'
          },
          {
            items: [{ name: 'boiled', id: 'boiled', price: 10, quantity: 2 }],
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
        criteriaSets: [
          {
            criteriaId: '9',
            name: 'Combination Logic - Purchase NOR (NOT) UpdateCart',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
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
    expect(result).toEqual('9');
  });

  it('should return null (combination logic criteria 9 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
            eventType: 'purchase'
          },
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
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
        criteriaSets: [
          {
            criteriaId: '9',
            name: 'Combination Logic - Purchase NOR (NOT) UpdateCart',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'updateCart.updatedShoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'fried',
                            id: 2,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 10 if Custom Event AND Purchase is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { eventName: 'birthday' },
            eventType: 'customEvent'
          },
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
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
            criteriaId: '10',
            name: 'Combination Logic - Custom Event AND Purchase',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            dataType: 'purchase',
                            field: 'shoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'eventName',
                            comparatorType: 'Equals',
                            value: 'birthday',
                            id: 16,
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
    expect(result).toEqual('10');
  });

  it('should return null (combination logic criteria 10 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { eventName: 'anniversary' },
            eventType: 'customEvent'
          },
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
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
            criteriaId: '10',
            name: 'Combination Logic - Custom Event AND Purchase',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            dataType: 'purchase',
                            field: 'shoppingCartItems.name',
                            comparatorType: 'Equals',
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'eventName',
                            comparatorType: 'Equals',
                            value: 'birthday',
                            id: 16,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 11 if Custom Event OR Purchase is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { eventName: 'birthday' },
            eventType: 'customEvent'
          }
          /*  {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
            eventType: 'purchase'
          } */
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
            criteriaId: '11',
            name: 'Combination Logic - Custom Event OR Purchase',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
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
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'eventName',
                            comparatorType: 'Equals',
                            value: 'birthday',
                            id: 16,
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
    expect(result).toEqual('11');
  });

  it('should return null (combination logic criteria 11 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { eventName: 'anniversary' },
            eventType: 'customEvent'
          },
          {
            items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
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
            criteriaId: '11',
            name: 'Combination Logic - Custom Event OR Purchase',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
            searchQuery: {
              combinator: 'And',
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
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'eventName',
                            comparatorType: 'Equals',
                            value: 'birthday',
                            id: 16,
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
    expect(result).toEqual(null);
  });

  it('should return criteriaId 12 if Custom Event NOR (NOT) Purchase is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { eventName: 'anniversary' },
            eventType: 'customEvent'
          },
          {
            items: [{ name: 'beef', id: 'beef', price: 10, quantity: 2 }],
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
            criteriaId: '12',
            name: 'Combination Logic - Custom Event NOR (NOT) Purchase',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'eventName',
                            comparatorType: 'Equals',
                            value: 'birthday',
                            id: 16,
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
    expect(result).toEqual('12');
  });

  it('should return null (combination logic criteria 12 fail)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: { eventName: 'birthday' },
            eventType: 'customEvent'
          },
          {
            items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
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
            criteriaId: '12',
            name: 'Combination Logic - Custom Event NOR (NOT) Purchase',
            createdAt: 1704754280210,
            updatedAt: 1704754280210,
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
                            value: 'chicken',
                            id: 13,
                            fieldType: 'string'
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
                            field: 'eventName',
                            comparatorType: 'Equals',
                            value: 'birthday',
                            id: 16,
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
    expect(result).toEqual(null);
  });
});

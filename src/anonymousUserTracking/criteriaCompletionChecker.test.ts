import { SHARED_PREFS_EVENT_LIST_KEY } from '../constants';
import CriteriaCompletionChecker from './criteriaCompletionChecker';

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

  it('should return criteriaId if criteriaData condition is matched', () => {
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
                            comparatorType: 'Equals',
                            value: 'testEvent',
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

  it('should return null if criteriaData condition is matched', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'Event',
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
                      dataType: 'purchase',
                      searchCombo: {
                        combinator: 'And',
                        searchQueries: [
                          {
                            dataType: 'customEvent',
                            field: 'eventName',
                            comparatorType: 'Equals',
                            value: 'testEvent',
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
    expect(result).toBeNull();
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
});

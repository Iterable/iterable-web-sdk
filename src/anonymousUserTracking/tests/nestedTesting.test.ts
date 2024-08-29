import { SHARED_PREFS_EVENT_LIST_KEY } from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

describe('nestedTesting', () => {
  beforeEach(() => {
    (global as any).localStorage = localStorageMock;
  });

  it('should return criteriaId 168 (nested field)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              email: 'user@example.com',
              furniture: [
                {
                  furnitureType: 'Sofa',
                  furnitureColor: 'White',
                  lengthInches: 40,
                  widthInches: 60
                },
                {
                  furnitureType: 'Sofa',
                  furnitureColor: 'Gray',
                  lengthInches: 20,
                  widthInches: 30
                }
              ]
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
            criteriaId: '168',
            name: 'nested testing',
            createdAt: 1721251169153,
            updatedAt: 1723488175352,
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
                            field: 'furniture',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'nested'
                          },
                          {
                            dataType: 'user',
                            field: 'furniture.furnitureColor',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'string'
                          },
                          {
                            dataType: 'user',
                            field: 'furniture.furnitureType',
                            comparatorType: 'Equals',
                            value: 'Sofa',
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
    expect(result).toEqual('168');
  });

  it('should return criteriaId 168 (nested field - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              email: 'user@example.com',
              furniture: [
                {
                  furnitureType: 'Sofa',
                  furnitureColor: 'White',
                  lengthInches: 40,
                  widthInches: 60
                },
                {
                  furnitureType: 'table',
                  furnitureColor: 'Gray',
                  lengthInches: 20,
                  widthInches: 30
                }
              ]
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
            criteriaId: '168',
            name: 'nested testing',
            createdAt: 1721251169153,
            updatedAt: 1723488175352,
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
                            field: 'furniture',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'nested'
                          },
                          {
                            dataType: 'user',
                            field: 'furniture.furnitureColor',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'string'
                          },
                          {
                            dataType: 'user',
                            field: 'furniture.furnitureType',
                            comparatorType: 'Equals',
                            value: 'Sofa',
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

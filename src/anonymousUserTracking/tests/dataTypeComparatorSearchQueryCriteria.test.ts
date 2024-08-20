import { SHARED_PREFS_EVENT_LIST_KEY } from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

describe('dataTypeComparatorSearchQueryCriteria', () => {
  beforeEach(() => {
    (global as any).localStorage = localStorageMock;
  });

  it('should return criteriaId 285 (Comparator test For Equal)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 19.99,
              likes_boba: true,
              country: 'Chaina',
              eventTimeStamp: 3
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
            criteriaId: '285',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'Equals',
                            value: '3',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'Equals',
                            value: '19.99',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'user',
                            field: 'likes_boba',
                            comparatorType: 'Equals',
                            value: 'true',
                            fieldType: 'boolean'
                          },
                          {
                            dataType: 'user',
                            field: 'country',
                            comparatorType: 'Equals',
                            value: 'Chaina',
                            fieldType: 'String'
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
    expect(result).toEqual('285');
  });

  it('should return null (Comparator test For Equal - No Match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 10.99,
              eventTimeStamp: 30,
              likes_boba: false,
              country: 'Taiwan'
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
            criteriaId: '285',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'Equals',
                            value: '3',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'Equals',
                            value: '19.99',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'user',
                            field: 'likes_boba',
                            comparatorType: 'Equals',
                            value: 'true',
                            fieldType: 'boolean'
                          },
                          {
                            dataType: 'user',
                            field: 'country',
                            comparatorType: 'Equals',
                            value: 'Chaina',
                            fieldType: 'String'
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

  it('should return criteriaId 285 (Comparator test For DoesNotEqual)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 11.2,
              eventTimeStamp: 30,
              likes_boba: false
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
            criteriaId: '285',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'DoesNotEqual',
                            value: '3',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'DoesNotEqual',
                            value: '19.99',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'user',
                            field: 'likes_boba',
                            comparatorType: 'DoesNotEqual',
                            value: 'true',
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
    expect(result).toEqual('285');
  });

  it('should return null (Comparator test For DoesNotEqual - No Match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 10.99,
              eventTimeStamp: 30,
              likes_boba: true
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
            criteriaId: '285',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'DoesNotEqual',
                            value: '3',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'DoesNotEqual',
                            value: '19.99',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'user',
                            field: 'likes_boba',
                            comparatorType: 'DoesNotEqual',
                            value: 'true',
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

  it('should return criteriaId 289 (Comparator test For LessThan)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 10,
              eventTimeStamp: 14
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
            criteriaId: '289',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'LessThan',
                            value: '15',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'LessThan',
                            value: '15',
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
    expect(result).toEqual('289');
  });

  it('should return null (Comparator test For LessThan - No Match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 10,
              eventTimeStamp: 18
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
            criteriaId: '289',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'LessThan',
                            value: '15',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'LessThan',
                            value: '15',
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

  it('should return criteriaId 290 (Comparator test For LessThanOrEqualTo)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 17,
              eventTimeStamp: 14
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
            criteriaId: '290',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'LessThanOrEqualTo',
                            value: '17',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'LessThanOrEqualTo',
                            value: '17',
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
    expect(result).toEqual('290');
  });

  it('should return null (Comparator test For LessThanOrEqualTo - No Match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 18,
              eventTimeStamp: 12
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
            criteriaId: '290',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'LessThanOrEqualTo',
                            value: '17',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'LessThanOrEqualTo',
                            value: '17',
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

  it('should return criteriaId 290 (Comparator test For GreaterThan)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 56,
              eventTimeStamp: 51
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
            criteriaId: '290',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'GreaterThan',
                            value: '50',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'GreaterThan',
                            value: '55',
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
    expect(result).toEqual('290');
  });

  it('should return null (Comparator test For GreaterThan - No Match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 5,
              eventTimeStamp: 3
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
            criteriaId: '290',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'GreaterThan',
                            value: '50',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'GreaterThan',
                            value: '55',
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

  it('should return criteriaId 291 (Comparator test For GreaterThanOrEqualTo)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 20,
              eventTimeStamp: 30
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
            criteriaId: '291',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'GreaterThanOrEqualTo',
                            value: '20',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'GreaterThanOrEqualTo',
                            value: '20',
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
    expect(result).toEqual('291');
  });

  it('should return null (Comparator test For GreaterThanOrEqualTo - No Match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 18,
              eventTimeStamp: 16
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
            criteriaId: '291',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'GreaterThanOrEqualTo',
                            value: '20',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'GreaterThanOrEqualTo',
                            value: '20',
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

  it('should return criteriaId 285 (Comparator test For IsSet)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: 10,
              eventTimeStamp: 20,
              saved_cars: '10',
              country: 'Taiwan'
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
            criteriaId: '285',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'user',
                            field: 'saved_cars',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'user',
                            field: 'country',
                            comparatorType: 'IsSet',
                            value: '',
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
    expect(result).toEqual('285');
  });

  it('should return criteriaId 285 (Comparator test For IsSet - No Match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              savings: '',
              eventTimeStamp: '',
              saved_cars: 'd',
              country: ''
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
            criteriaId: '285',
            name: 'Criteria_EventTimeStamp_3_Long',
            createdAt: 1722497422151,
            updatedAt: 1722500235276,
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
                            field: 'eventTimeStamp',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'long'
                          },
                          {
                            dataType: 'user',
                            field: 'savings',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'user',
                            field: 'saved_cars',
                            comparatorType: 'IsSet',
                            value: '',
                            fieldType: 'double'
                          },
                          {
                            dataType: 'user',
                            field: 'country',
                            comparatorType: 'IsSet',
                            value: '',
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
});

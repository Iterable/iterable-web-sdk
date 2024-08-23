import { SHARED_PREFS_EVENT_LIST_KEY } from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

describe('compareArrayDataTypes', () => {
  beforeEach(() => {
    (global as any).localStorage = localStorageMock;
  });

  // MARK: Equal
  it('should return criteriaId 285 (compare array Equal)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1996, 1997, 2002, 2020, 2024],
              score: [10.5, 11.5, 12.5, 13.5, 14.5],
              timestamp: [
                1722497422151, 1722500235276, 1722500215276, 1722500225276,
                1722500245276
              ]
            },
            eventType: 'user'
          },
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked.animal': ['cat', 'dog', 'giraffe']
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
            criteriaId: '285',
            name: 'Criteria_Array_Equal',
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'Equals',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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
                            field: 'score',
                            fieldType: 'double',
                            comparatorType: 'Equals',
                            dataType: 'user',
                            id: 2,
                            value: '11.5'
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
                            field: 'timestamp',
                            fieldType: 'long',
                            comparatorType: 'Equals',
                            dataType: 'user',
                            id: 2,
                            valueLong: 1722500215276,
                            value: '1722500215276'
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
                            field: 'button-clicked.animal',
                            fieldType: 'string',
                            comparatorType: 'Equals',
                            dataType: 'customEvent',
                            id: 25,
                            value: 'giraffe'
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

  it('should return criteriaId 285 (compare array Equal - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1996, 1998, 2002, 2020, 2024],
              score: [12.5, 13.5, 14.5],
              timestamp: [
                1722497422151, 1722500235276, 1722500225276, 1722500245276
              ]
            },
            eventType: 'user'
          },
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked.animal': ['cat', 'dog']
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
            criteriaId: '285',
            name: 'Criteria_Array_Equal',
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'Equals',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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
                            field: 'score',
                            fieldType: 'double',
                            comparatorType: 'Equals',
                            dataType: 'user',
                            id: 2,
                            value: '11.5'
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
                            field: 'timestamp',
                            fieldType: 'long',
                            comparatorType: 'Equals',
                            dataType: 'user',
                            id: 2,
                            valueLong: 1722500215276,
                            value: '1722500215276'
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
                            field: 'button-clicked.animal',
                            fieldType: 'string',
                            comparatorType: 'Equals',
                            dataType: 'customEvent',
                            id: 25,
                            value: 'giraffe'
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

  // MARK: DoesNotEqual
  it('should return criteriaId 285 (compare array DoesNotEqual)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1996, 1998, 2002, 2020, 2024],
              score: [12.5, 13.5, 14.5],
              timestamp: [
                1722497422151, 1722500235276, 1722500225276, 1722500245276
              ]
            },
            eventType: 'user'
          },
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked.animal': ['cat', 'dog']
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
            criteriaId: '285',
            name: 'Criteria_Array_DoesNotEqual',
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'DoesNotEqual',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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
                            field: 'score',
                            fieldType: 'double',
                            comparatorType: 'DoesNotEqual',
                            dataType: 'user',
                            id: 2,
                            value: '11.5'
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
                            field: 'timestamp',
                            fieldType: 'long',
                            comparatorType: 'DoesNotEqual',
                            dataType: 'user',
                            id: 2,
                            valueLong: 1722500215276,
                            value: '1722500215276'
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
                            field: 'button-clicked.animal',
                            fieldType: 'string',
                            comparatorType: 'DoesNotEqual',
                            dataType: 'customEvent',
                            id: 25,
                            value: 'giraffe'
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

  it('should return criteriaId 285 (compare array DoesNotEqual - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1996, 1997, 2002, 2020, 2024],
              score: [10.5, 11.5, 12.5, 13.5, 14.5],
              timestamp: [
                1722497422151, 1722500235276, 1722500215276, 1722500225276,
                1722500245276
              ]
            },
            eventType: 'user'
          },
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked.animal': ['cat', 'dog', 'giraffe']
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
            criteriaId: '285',
            name: 'Criteria_Array_DoesNotEqual',
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'DoesNotEqual',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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
                            field: 'score',
                            fieldType: 'double',
                            comparatorType: 'DoesNotEqual',
                            dataType: 'user',
                            id: 2,
                            value: '11.5'
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
                            field: 'timestamp',
                            fieldType: 'long',
                            comparatorType: 'DoesNotEqual',
                            dataType: 'user',
                            id: 2,
                            valueLong: 1722500215276,
                            value: '1722500215276'
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
                            field: 'button-clicked.animal',
                            fieldType: 'string',
                            comparatorType: 'DoesNotEqual',
                            dataType: 'customEvent',
                            id: 25,
                            value: 'giraffe'
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

  // MARK: GreaterThan
  it('should return criteriaId 285 (compare array GreaterThan)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1996, 1998, 2002, 2020, 2024]
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'GreaterThan',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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

  it('should return criteriaId 285 (compare array GreaterThan - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1990, 1992, 1994, 1997]
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'GreaterThan',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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

  // MARK: LessThan
  it('should return criteriaId 285 (compare array LessThan)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1990, 1992, 1994, 1996, 1998]
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'LessThan',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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

  it('should return criteriaId 285 (compare array LessThan - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1997, 1999, 2002, 2004]
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'LessThan',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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

  // MARK: GreaterThanOrEqualTo
  it('should return criteriaId 285 (compare array GreaterThanOrEqualTo)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1997, 1998, 2002, 2020, 2024]
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'GreaterThanOrEqualTo',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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

  it('should return criteriaId 285 (compare array GreaterThanOrEqualTo - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1990, 1992, 1994, 1996]
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'GreaterThanOrEqualTo',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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

  // MARK: LessThanOrEqualTo
  it('should return criteriaId 285 (compare array LessThanOrEqualTo)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1990, 1992, 1994, 1996, 1998]
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'LessThanOrEqualTo',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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

  it('should return criteriaId 285 (compare array LessThanOrEqualTo - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              milestoneYears: [1998, 1999, 2002, 2004]
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
                            field: 'milestoneYears',
                            fieldType: 'string',
                            comparatorType: 'LessThanOrEqualTo',
                            dataType: 'user',
                            id: 2,
                            value: '1997'
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

  // MARK: Contains
  it('should return criteriaId 285 (compare array Contains)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              addresses: [
                'New York, US',
                'San Francisco, US',
                'San Diego, US',
                'Los Angeles, US',
                'Tokyo, JP',
                'Berlin, DE',
                'London, GB'
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
                            field: 'addresses',
                            fieldType: 'string',
                            comparatorType: 'Contains',
                            dataType: 'user',
                            id: 2,
                            value: 'US'
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

  it('should return criteriaId 285 (compare array Contains - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              addresses: ['Tokyo, JP', 'Berlin, DE', 'London, GB']
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
                            field: 'addresses',
                            fieldType: 'string',
                            comparatorType: 'Contains',
                            dataType: 'user',
                            id: 2,
                            value: 'US'
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

  // MARK: StartsWith
  it('should return criteriaId 285 (compare array StartsWith)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              addresses: [
                'US, New York',
                'US, San Francisco',
                'US, San Diego',
                'US, Los Angeles',
                'JP, Tokyo',
                'DE, Berlin',
                'GB, London'
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
                            field: 'addresses',
                            fieldType: 'string',
                            comparatorType: 'StartsWith',
                            dataType: 'user',
                            id: 2,
                            value: 'US'
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

  it('should return criteriaId 285 (compare array StartsWith - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              addresses: ['JP, Tokyo', 'DE, Berlin', 'GB, London']
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
                            field: 'addresses',
                            fieldType: 'string',
                            comparatorType: 'StartsWith',
                            dataType: 'user',
                            id: 2,
                            value: 'US'
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

  // MARK: MatchesRegex
  it('should return criteriaId 285 (compare array MatchesRegex)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              addresses: [
                'US, New York',
                'US, San Francisco',
                'US, San Diego',
                'US, Los Angeles',
                'JP, Tokyo',
                'DE, Berlin',
                'GB, London'
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
                            field: 'addresses',
                            fieldType: 'string',
                            comparatorType: 'MatchesRegex',
                            dataType: 'user',
                            id: 2,
                            value: '^(JP|DE|GB)'
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

  it('should return criteriaId 285 (compare array MatchesRegex - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              addresses: [
                'US, New York',
                'US, San Francisco',
                'US, San Diego',
                'US, Los Angeles'
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
                            field: 'addresses',
                            fieldType: 'string',
                            comparatorType: 'MatchesRegex',
                            dataType: 'user',
                            id: 2,
                            value: '^(JP|DE|GB)'
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

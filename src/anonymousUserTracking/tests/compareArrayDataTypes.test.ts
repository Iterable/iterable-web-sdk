import { SHARED_PREFS_EVENT_LIST_KEY } from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';
import {
  IS_NOT_ONE_OF_CRITERIA,
  ARRAY_CONTAINS_CRITERIA,
  ARRAY_DOES_NOT_EQUAL_CRITERIA,
  ARRAY_EQUAL_CRITERIA,
  ARRAY_GREATER_THAN_CRITERIA,
  ARRAY_GREATER_THAN_EQUAL_TO_CRITERIA,
  ARRAY_LESS_THAN_CRITERIA,
  ARRAY_LESS_THAN_EQUAL_TO_CRITERIA,
  ARRAY_MATCHREGEX_CRITERIA,
  ARRAY_STARTSWITH_CRITERIA,
  IS_ONE_OF_CRITERIA,
  CUSTOM_EVENT_SINGLE_PRIMITIVE_CRITERIA
} from './constants';

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
              animal: ['cat', 'dog', 'giraffe']
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
      JSON.stringify(ARRAY_EQUAL_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array Equal - No match)', () => {
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
              animal: ['cat', 'dog']
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
      JSON.stringify(ARRAY_EQUAL_CRITERIA)
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
              animal: ['cat', 'dog']
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
      JSON.stringify(ARRAY_DOES_NOT_EQUAL_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array DoesNotEqual - No match)', () => {
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
              animal: ['cat', 'dog', 'giraffe']
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
      JSON.stringify(ARRAY_DOES_NOT_EQUAL_CRITERIA)
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
      JSON.stringify(ARRAY_GREATER_THAN_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array GreaterThan - No match)', () => {
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
      JSON.stringify(ARRAY_GREATER_THAN_CRITERIA)
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
      JSON.stringify(ARRAY_LESS_THAN_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array LessThan - No match)', () => {
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
      JSON.stringify(ARRAY_LESS_THAN_CRITERIA)
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
      JSON.stringify(ARRAY_GREATER_THAN_EQUAL_TO_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array GreaterThanOrEqualTo - No match)', () => {
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
      JSON.stringify(ARRAY_GREATER_THAN_EQUAL_TO_CRITERIA)
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
      JSON.stringify(ARRAY_LESS_THAN_EQUAL_TO_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array LessThanOrEqualTo - No match)', () => {
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
      JSON.stringify(ARRAY_LESS_THAN_EQUAL_TO_CRITERIA)
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
      JSON.stringify(ARRAY_CONTAINS_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array Contains - No match)', () => {
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
      JSON.stringify(ARRAY_CONTAINS_CRITERIA)
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
      JSON.stringify(ARRAY_STARTSWITH_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array StartsWith - No match)', () => {
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
      JSON.stringify(ARRAY_STARTSWITH_CRITERIA)
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
      JSON.stringify(ARRAY_MATCHREGEX_CRITERIA)
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array MatchesRegex - No match)', () => {
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
      JSON.stringify(ARRAY_MATCHREGEX_CRITERIA)
    );
    expect(result).toEqual(null);
  });

  // MARK: IsOneOf
  it('should return criteriaId 299 (compare array IsOneOf)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              country: 'China',
              addresses: ['US', 'UK', 'JP', 'DE', 'GB']
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
      JSON.stringify(IS_ONE_OF_CRITERIA)
    );
    expect(result).toEqual('299');
  });

  it('should return criteriaId null (compare array IsOneOf - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              country: 'Korea',
              addresses: ['US', 'UK']
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
      JSON.stringify(IS_ONE_OF_CRITERIA)
    );
    expect(result).toEqual(null);
  });

  // MARK: IsNotOneOf
  it('should return criteriaId 299 (compare array IsNotOneOf)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              country: 'Korea',
              addresses: ['US', 'UK']
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
      JSON.stringify(IS_NOT_ONE_OF_CRITERIA)
    );
    expect(result).toEqual('299');
  });

  it('should return criteriaId null (compare array IsNotOneOf - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              country: 'China',
              addresses: ['US', 'UK', 'JP', 'DE', 'GB']
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
      JSON.stringify(IS_NOT_ONE_OF_CRITERIA)
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId 467 (Custom event - single primitive array)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              count: [5, 8, 9]
            },
            eventType: 'customEvent',
            eventName: 'animal_found'
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
      JSON.stringify(CUSTOM_EVENT_SINGLE_PRIMITIVE_CRITERIA)
    );

    expect(result).toEqual('467');
  });

  it('should return criteriaId null (Custom event - single primitive array - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              count: [4, 8, 9]
            },
            eventType: 'customEvent',
            eventName: 'animal_found'
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
      JSON.stringify(CUSTOM_EVENT_SINGLE_PRIMITIVE_CRITERIA)
    );

    expect(result).toEqual(null);
  });
});

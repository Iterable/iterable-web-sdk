import { SHARED_PREFS_EVENT_LIST_KEY } from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';
import {
  DATA_TYPE_COMPARATOR_DOES_NOT_EQUAL,
  DATA_TYPE_COMPARATOR_EQUALS,
  DATA_TYPE_COMPARATOR_GREATER_THAN,
  DATA_TYPE_COMPARATOR_GREATER_THAN_OR_EQUAL_TO,
  DATA_TYPE_COMPARATOR_IS_SET,
  DATA_TYPE_COMPARATOR_LESS_THAN,
  DATA_TYPE_COMPARATOR_LESS_THAN_OR_EQUAL_TO
} from './constants';

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
      JSON.stringify(DATA_TYPE_COMPARATOR_EQUALS)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_EQUALS)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_DOES_NOT_EQUAL)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_DOES_NOT_EQUAL)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_LESS_THAN)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_LESS_THAN)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_LESS_THAN_OR_EQUAL_TO)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_LESS_THAN_OR_EQUAL_TO)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_GREATER_THAN)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_GREATER_THAN)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_GREATER_THAN_OR_EQUAL_TO)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_GREATER_THAN_OR_EQUAL_TO)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_IS_SET)
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
      JSON.stringify(DATA_TYPE_COMPARATOR_IS_SET)
    );
    expect(result).toEqual(null);
  });
});

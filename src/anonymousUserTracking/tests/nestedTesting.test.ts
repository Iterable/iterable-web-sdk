import { SHARED_PREFS_EVENT_LIST_KEY } from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';
import { NESTED_CRITERIA, NESTED_CRITERIA_MULTI_LEVEL } from './constants';

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
    const result = checker.getMatchedCriteria(JSON.stringify(NESTED_CRITERIA));
    expect(result).toEqual('168');
  });

  it('should return criteriaId null (nested field - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            dataFields: {
              email: 'user@example.com',
              furniture: [
                {
                  furnitureType: 'Sofa',
                  furnitureColor: 'Gray',
                  lengthInches: 40,
                  widthInches: 60
                },
                {
                  furnitureType: 'table',
                  furnitureColor: 'White',
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
    const result = checker.getMatchedCriteria(JSON.stringify(NESTED_CRITERIA));
    expect(result).toEqual(null);
  });

  it('should return criteriaId 425 (Multi level Nested field criteria)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'button-clicked',
            dataFields: {
              updateCart: { updatedShoppingCartItems: { quantity: 10 } },
              browserVisit: { website: { domain: 'https://mybrand.com/socks' } }
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
      JSON.stringify(NESTED_CRITERIA_MULTI_LEVEL)
    );
    expect(result).toEqual('425');
  });

  it('should return criteriaId 425 (Multi level Nested field criteria - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'button-clicked',
            dataFields: {
              'button-clicked': {
                updateCart: { updatedShoppingCartItems: { quantity: 10 } },
                browserVisit: {
                  website: { domain: 'https://mybrand.com/socks' }
                }
              }
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
      JSON.stringify(NESTED_CRITERIA_MULTI_LEVEL)
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId null (Multi level Nested field criteria - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'button-clicked',
            dataFields: {
              'updateCart.updatedShoppingCartItems.quantity': 10,
              'browserVisit.website.domain': 'https://mybrand.com/socks'
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
      JSON.stringify(NESTED_CRITERIA_MULTI_LEVEL)
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId null (Multi level Nested field criteria - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'button-clicked',
            dataFields: {
              updateCart: { updatedShoppingCartItems: { quantity: 11 } },
              browserVisit: { website: { domain: 'https://mybrand.com' } }
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
      JSON.stringify(NESTED_CRITERIA_MULTI_LEVEL)
    );
    expect(result).toEqual(null);
  });

  it('should return criteriaId null (Multi level Nested field criteria - No match)', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            eventName: 'button-clicked',
            dataFields: {
              quantity: 11,
              domain: 'https://mybrand.com/socks'
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
      JSON.stringify(NESTED_CRITERIA_MULTI_LEVEL)
    );
    expect(result).toEqual(null);
  });
});

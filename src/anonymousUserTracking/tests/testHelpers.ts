import {
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY
} from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';

// Mock localStorage utility
export const createLocalStorageMock = () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
});

// Setup localStorage mock for global use
export const setupLocalStorageMock = () => {
  const localStorageMock = createLocalStorageMock();
  (global as any).localStorage = localStorageMock;
  return localStorageMock;
};

// Helper to setup localStorage.getItem mock with event list and user update data
export const mockLocalStorageData =
  (eventListData: any[] | null = null, userUpdateData: any = null) =>
  (key: string) => {
    if (key === SHARED_PREFS_EVENT_LIST_KEY) {
      return eventListData ? JSON.stringify(eventListData) : null;
    }
    if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
      return userUpdateData ? JSON.stringify(userUpdateData) : null;
    }
    return null;
  };

// Helper to run criteria completion check
export const runCriteriaCheck = (
  criteriaData: any,
  eventListData: any[] | null = null,
  userUpdateData: any = null
): string | null => {
  (localStorage.getItem as jest.Mock).mockImplementation(
    mockLocalStorageData(eventListData, userUpdateData)
  );

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

  return checker.getMatchedCriteria(JSON.stringify(criteriaData));
};

// Helper for standard test structure
export const testCriteriaMatch = (
  description: string,
  eventList: any[],
  userUpdate: any,
  criteria: any,
  expectedResult: string | null
) => {
  it(description, () => {
    const result = runCriteriaCheck(criteria, eventList, userUpdate);
    expect(result).toEqual(expectedResult);
  });
};

// Helper for tests without user update data
export const testCriteriaMatchEventsOnly = (
  description: string,
  eventList: any[],
  criteria: any,
  expectedResult: string | null
) => {
  it(description, () => {
    const result = runCriteriaCheck(criteria, eventList, null);
    expect(result).toEqual(expectedResult);
  });
};

// Create simple criteria structure helper
export const createSimpleCriteria = (
  criteriaId: string,
  name: string,
  searchQuery: any
) => ({
  count: 1,
  criteriaSets: [
    {
      criteriaId,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      searchQuery
    }
  ]
});

// Common test data combinations
export const TEST_SCENARIOS = {
  PURCHASE_AND_USER: (purchaseEvent: any, userData: any) => ({
    eventList: [purchaseEvent],
    userUpdate: userData
  }),

  MULTIPLE_CART_UPDATES_AND_USER: (cartEvent: any, userData: any) => ({
    eventList: [cartEvent, cartEvent],
    userUpdate: userData
  }),

  COMPLEX_EVENT_MIX: (events: any[], userData: any) => ({
    eventList: events,
    userUpdate: userData
  })
};

import {
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY
} from '../../constants';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';
import { setupLocalStorageMock } from './testHelpers';
import {
  NESTED_CRITERIA,
  NESTED_CRITERIA_MULTI_LEVEL,
  NESTED_CRITERIA_MULTI_LEVEL_ARRAY,
  NESTED_CRITERIA_MULTI_LEVEL_ARRAY_TRACK_EVENT,
  NESTED_CRITERIA_MULTI_LEVEL_MORE_THAN_4_EVENTS
} from './constants';

// Test data constants for furniture structures
const FURNITURE_ARRAYS = {
  WHITE_SOFA_MATCH: [
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
  ],
  GRAY_SOFA_NO_MATCH: [
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
};

const NESTED_FURNITURE_STRUCTURES = {
  TABLE_MATCH: {
    material: [
      {
        type: 'table',
        color: 'black',
        lengthInches: 40,
        widthInches: 60
      },
      {
        type: 'Sofa',
        color: 'Gray',
        lengthInches: 20,
        widthInches: 30
      }
    ]
  },
  SOFA_NO_MATCH: {
    material: [
      {
        type: 'Sofa',
        color: 'black',
        lengthInches: 40,
        widthInches: 60
      },
      {
        type: 'table',
        color: 'Gray',
        lengthInches: 20,
        widthInches: 30
      }
    ]
  }
};

// Test data constants for browser visit events
const BROWSER_VISIT_EVENTS = {
  DOMAIN_MATCH: {
    eventName: 'button-clicked',
    dataFields: {
      browserVisit: { website: { domain: 'https://mybrand.com/socks' } }
    },
    eventType: 'customEvent'
  },
  NESTED_DOMAIN_NO_MATCH: {
    eventName: 'button-clicked',
    dataFields: {
      'button-clicked': {
        browserVisit: {
          website: { domain: 'https://mybrand.com/socks' }
        }
      }
    },
    eventType: 'customEvent'
  },
  SIMPLE_DOMAIN_NO_MATCH: {
    eventName: 'button-clicked',
    dataFields: {
      browserVisit: { website: { domain: 'https://mybrand.com' } }
    },
    eventType: 'customEvent'
  },
  FLAT_DATA_NO_MATCH: {
    eventName: 'button-clicked',
    dataFields: {
      quantity: 11,
      domain: 'https://mybrand.com/socks'
    },
    eventType: 'customEvent'
  }
};

// Test data for nested array track events
const NESTED_ARRAY_EVENTS = {
  TOP_LEVEL_ARRAY_MATCH: {
    eventName: 'TopLevelArrayObject',
    dataFields: {
      a: {
        h: [
          {
            b: 'e',
            c: 'h'
          },
          {
            b: 'd',
            c: 'g'
          }
        ]
      }
    },
    eventType: 'customEvent'
  },
  TOP_LEVEL_ARRAY_NO_MATCH: {
    eventName: 'TopLevelArrayObject',
    dataFields: {
      a: {
        h: [
          {
            b: 'd',
            c: 'h'
          },
          {
            b: 'e',
            c: 'g'
          }
        ]
      }
    },
    eventType: 'customEvent'
  }
};

// Complex event data for multi-level more than 4 events test
const COMPLEX_EVENT_SEQUENCE = [
  {
    items: [{ id: '12', name: 'monitor', price: 50, quantity: 10 }],
    total: 50,
    eventType: 'purchase'
  },
  {
    items: [
      { name: 'piano', id: 'fdsafds', price: 100, quantity: 2 },
      { name: 'piano2', id: 'fdsafds2', price: 100, quantity: 5 }
    ],
    eventType: 'cartUpdate',
    preferUserId: true,
    createdAt: 1729585174
  },
  { likes_boba: 'true', eventType: 'user' },
  {
    eventName: 'cancelled_booking',
    createdAt: 1729585183,
    dataFields: { details: { event: { name: 'dummy' } } },
    createNewFields: true,
    eventType: 'customEvent'
  },
  {
    eventName: 'cancelled_booking',
    createdAt: 1729585192,
    dataFields: { details: { event: { name: 'haircut' } } },
    createNewFields: true,
    eventType: 'customEvent'
  }
];

// Helper function to create user data with furniture
const createUserDataWithFurniture = (furniture: any) => ({
  dataFields: {
    email: 'user@example.com',
    furniture
  },
  eventType: 'user'
});

// Helper function to create user data with nested furniture structure
const createUserDataWithNestedFurniture = (furnitureStructure: any) => ({
  dataFields: {
    furniture: furnitureStructure
  },
  eventType: 'user'
});

// Custom helper for nested testing
const testNestedCriteria = (
  testName: string,
  mockData: any,
  mockKey: string,
  criteria: any,
  expectedResult: string | null
) => {
  it(testName, () => {
    setupLocalStorageMock();

    // Set up specific mock data for the test
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === mockKey) {
        return JSON.stringify(mockData);
      }
      return null;
    });

    const localStoredData = localStorage.getItem(mockKey);

    let eventData = '';
    let userData = '';

    if (mockKey === SHARED_PREFS_EVENT_LIST_KEY) {
      eventData = localStoredData === null ? '' : localStoredData;
    } else if (mockKey === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
      userData = localStoredData === null ? '' : localStoredData;
    }

    const checker = new CriteriaCompletionChecker(eventData, userData);
    const result = checker.getMatchedCriteria(JSON.stringify(criteria));
    expect(result).toEqual(expectedResult);
  });
};

describe('nestedTesting', () => {
  // MARK: - Nested Field Tests (furniture array)
  testNestedCriteria(
    'should return criteriaId 168 (nested field)',
    createUserDataWithFurniture(FURNITURE_ARRAYS.WHITE_SOFA_MATCH),
    SHARED_PREFS_USER_UPDATE_OBJECT_KEY,
    NESTED_CRITERIA,
    '168'
  );

  testNestedCriteria(
    'should return criteriaId null (nested field - No match)',
    createUserDataWithFurniture(FURNITURE_ARRAYS.GRAY_SOFA_NO_MATCH),
    SHARED_PREFS_USER_UPDATE_OBJECT_KEY,
    NESTED_CRITERIA,
    null
  );

  // MARK: - Multi Level Nested Field Tests (browser visit events)
  testNestedCriteria(
    'should return criteriaId 425 (Multi level Nested field criteria)',
    [BROWSER_VISIT_EVENTS.DOMAIN_MATCH],
    SHARED_PREFS_EVENT_LIST_KEY,
    NESTED_CRITERIA_MULTI_LEVEL,
    '425'
  );

  testNestedCriteria(
    'should return criteriaId 425 (Multi level Nested field criteria - No match)',
    [BROWSER_VISIT_EVENTS.NESTED_DOMAIN_NO_MATCH],
    SHARED_PREFS_EVENT_LIST_KEY,
    NESTED_CRITERIA_MULTI_LEVEL,
    null
  );

  testNestedCriteria(
    'should return criteriaId null (Multi level Nested field criteria - No match)',
    [BROWSER_VISIT_EVENTS.SIMPLE_DOMAIN_NO_MATCH],
    SHARED_PREFS_EVENT_LIST_KEY,
    NESTED_CRITERIA_MULTI_LEVEL,
    null
  );

  testNestedCriteria(
    'should return criteriaId null (Multi level Nested field criteria - No match)',
    [BROWSER_VISIT_EVENTS.FLAT_DATA_NO_MATCH],
    SHARED_PREFS_EVENT_LIST_KEY,
    NESTED_CRITERIA_MULTI_LEVEL,
    null
  );

  // MARK: - Multi Level Nested Array Tests (nested furniture structures)
  testNestedCriteria(
    'should return criteriaId 436 (Multi level Nested field criteria)',
    createUserDataWithNestedFurniture(NESTED_FURNITURE_STRUCTURES.TABLE_MATCH),
    SHARED_PREFS_USER_UPDATE_OBJECT_KEY,
    NESTED_CRITERIA_MULTI_LEVEL_ARRAY,
    '436'
  );

  testNestedCriteria(
    'should return criteriaId null (Multi level Nested field criteria - No match)',
    createUserDataWithNestedFurniture(
      NESTED_FURNITURE_STRUCTURES.SOFA_NO_MATCH
    ),
    SHARED_PREFS_USER_UPDATE_OBJECT_KEY,
    NESTED_CRITERIA_MULTI_LEVEL_ARRAY,
    null
  );

  // MARK: - Multi Level Array Track Event Tests
  testNestedCriteria(
    'should return criteriaId 459 (Multi level Nested field criteria)',
    [NESTED_ARRAY_EVENTS.TOP_LEVEL_ARRAY_MATCH],
    SHARED_PREFS_EVENT_LIST_KEY,
    NESTED_CRITERIA_MULTI_LEVEL_ARRAY_TRACK_EVENT,
    '459'
  );

  testNestedCriteria(
    'should return criteriaId null (Multi level Nested field criteria - No match)',
    [NESTED_ARRAY_EVENTS.TOP_LEVEL_ARRAY_NO_MATCH],
    SHARED_PREFS_EVENT_LIST_KEY,
    NESTED_CRITERIA_MULTI_LEVEL_ARRAY_TRACK_EVENT,
    null
  );

  // MARK: - Complex Multi Event Test (more than 4 events)
  testNestedCriteria(
    'should return criteriaId 484 (Multi level Nested field criteria for more than 3 events)',
    COMPLEX_EVENT_SEQUENCE,
    SHARED_PREFS_EVENT_LIST_KEY,
    NESTED_CRITERIA_MULTI_LEVEL_MORE_THAN_4_EVENTS,
    '484'
  );
});

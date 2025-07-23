import { setupLocalStorageMock, runCriteriaCheck } from './testHelpers';
import {
  DATA_TYPE_COMPARATOR_DOES_NOT_EQUAL,
  DATA_TYPE_COMPARATOR_EQUALS,
  DATA_TYPE_COMPARATOR_GREATER_THAN,
  DATA_TYPE_COMPARATOR_GREATER_THAN_OR_EQUAL_TO,
  DATA_TYPE_COMPARATOR_IS_SET,
  DATA_TYPE_COMPARATOR_LESS_THAN,
  DATA_TYPE_COMPARATOR_LESS_THAN_OR_EQUAL_TO
} from './constants';

// Test data constants
const TEST_USER_DATA = {
  // Equals tests
  EQUALS_MATCH: {
    dataFields: {
      savings: 19.99,
      likes_boba: true,
      country: 'Chaina',
      eventTimeStamp: 3
    },
    eventType: 'user'
  },
  EQUALS_NO_MATCH: {
    dataFields: {
      savings: 10.99,
      eventTimeStamp: 30,
      likes_boba: false,
      country: 'Taiwan'
    },
    eventType: 'user'
  },

  // DoesNotEqual tests
  DOES_NOT_EQUAL_MATCH: {
    dataFields: {
      savings: 11.2,
      eventTimeStamp: 30,
      likes_boba: false
    },
    eventType: 'user'
  },
  DOES_NOT_EQUAL_NO_MATCH: {
    dataFields: {
      savings: 10.99,
      eventTimeStamp: 30,
      likes_boba: true
    },
    eventType: 'user'
  },

  // LessThan tests
  LESS_THAN_MATCH: {
    dataFields: {
      savings: 10,
      eventTimeStamp: 14
    },
    eventType: 'user'
  },
  LESS_THAN_NO_MATCH: {
    dataFields: {
      savings: 10,
      eventTimeStamp: 18
    },
    eventType: 'user'
  },

  // LessThanOrEqualTo tests
  LESS_THAN_OR_EQUAL_MATCH: {
    dataFields: {
      savings: 17,
      eventTimeStamp: 14
    },
    eventType: 'user'
  },
  LESS_THAN_OR_EQUAL_NO_MATCH: {
    dataFields: {
      savings: 18,
      eventTimeStamp: 12
    },
    eventType: 'user'
  },

  // GreaterThan tests
  GREATER_THAN_MATCH: {
    dataFields: {
      savings: 56,
      eventTimeStamp: 51
    },
    eventType: 'user'
  },
  GREATER_THAN_NO_MATCH: {
    dataFields: {
      savings: 5,
      eventTimeStamp: 3
    },
    eventType: 'user'
  },

  // GreaterThanOrEqualTo tests
  GREATER_THAN_OR_EQUAL_MATCH: {
    dataFields: {
      savings: 20,
      eventTimeStamp: 30
    },
    eventType: 'user'
  },
  GREATER_THAN_OR_EQUAL_NO_MATCH: {
    dataFields: {
      savings: 18,
      eventTimeStamp: 16
    },
    eventType: 'user'
  },

  // IsSet tests
  IS_SET_MATCH: {
    dataFields: {
      savings: 10,
      eventTimeStamp: 20,
      saved_cars: '10',
      country: 'Taiwan'
    },
    eventType: 'user'
  },
  IS_SET_NO_MATCH: {
    dataFields: {
      savings: '',
      eventTimeStamp: '',
      saved_cars: 'd',
      country: ''
    },
    eventType: 'user'
  }
};

// Helper function for comparator tests
const testComparatorCriteria = (
  description: string,
  userData: any,
  criteria: any,
  expectedResult: string | null
) => {
  it(description, () => {
    const result = runCriteriaCheck(criteria, null, userData);
    expect(result).toEqual(expectedResult);
  });
};

describe('dataTypeComparatorSearchQueryCriteria', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  // Equals Tests
  testComparatorCriteria(
    'should return criteriaId 285 (Comparator test For Equal)',
    TEST_USER_DATA.EQUALS_MATCH,
    DATA_TYPE_COMPARATOR_EQUALS,
    '285'
  );

  testComparatorCriteria(
    'should return null (Comparator test For Equal - No Match)',
    TEST_USER_DATA.EQUALS_NO_MATCH,
    DATA_TYPE_COMPARATOR_EQUALS,
    null
  );

  // DoesNotEqual Tests
  testComparatorCriteria(
    'should return criteriaId 285 (Comparator test For DoesNotEqual)',
    TEST_USER_DATA.DOES_NOT_EQUAL_MATCH,
    DATA_TYPE_COMPARATOR_DOES_NOT_EQUAL,
    '285'
  );

  testComparatorCriteria(
    'should return null (Comparator test For DoesNotEqual - No Match)',
    TEST_USER_DATA.DOES_NOT_EQUAL_NO_MATCH,
    DATA_TYPE_COMPARATOR_DOES_NOT_EQUAL,
    null
  );

  // LessThan Tests
  testComparatorCriteria(
    'should return criteriaId 289 (Comparator test For LessThan)',
    TEST_USER_DATA.LESS_THAN_MATCH,
    DATA_TYPE_COMPARATOR_LESS_THAN,
    '289'
  );

  testComparatorCriteria(
    'should return null (Comparator test For LessThan - No Match)',
    TEST_USER_DATA.LESS_THAN_NO_MATCH,
    DATA_TYPE_COMPARATOR_LESS_THAN,
    null
  );

  // LessThanOrEqualTo Tests
  testComparatorCriteria(
    'should return criteriaId 290 (Comparator test For LessThanOrEqualTo)',
    TEST_USER_DATA.LESS_THAN_OR_EQUAL_MATCH,
    DATA_TYPE_COMPARATOR_LESS_THAN_OR_EQUAL_TO,
    '290'
  );

  testComparatorCriteria(
    'should return null (Comparator test For LessThanOrEqualTo - No Match)',
    TEST_USER_DATA.LESS_THAN_OR_EQUAL_NO_MATCH,
    DATA_TYPE_COMPARATOR_LESS_THAN_OR_EQUAL_TO,
    null
  );

  // GreaterThan Tests
  testComparatorCriteria(
    'should return criteriaId 290 (Comparator test For GreaterThan)',
    TEST_USER_DATA.GREATER_THAN_MATCH,
    DATA_TYPE_COMPARATOR_GREATER_THAN,
    '290'
  );

  testComparatorCriteria(
    'should return null (Comparator test For GreaterThan - No Match)',
    TEST_USER_DATA.GREATER_THAN_NO_MATCH,
    DATA_TYPE_COMPARATOR_GREATER_THAN,
    null
  );

  // GreaterThanOrEqualTo Tests
  testComparatorCriteria(
    'should return criteriaId 291 (Comparator test For GreaterThanOrEqualTo)',
    TEST_USER_DATA.GREATER_THAN_OR_EQUAL_MATCH,
    DATA_TYPE_COMPARATOR_GREATER_THAN_OR_EQUAL_TO,
    '291'
  );

  testComparatorCriteria(
    'should return null (Comparator test For GreaterThanOrEqualTo - No Match)',
    TEST_USER_DATA.GREATER_THAN_OR_EQUAL_NO_MATCH,
    DATA_TYPE_COMPARATOR_GREATER_THAN_OR_EQUAL_TO,
    null
  );

  // IsSet Tests
  testComparatorCriteria(
    'should return criteriaId 285 (Comparator test For IsSet)',
    TEST_USER_DATA.IS_SET_MATCH,
    DATA_TYPE_COMPARATOR_IS_SET,
    '285'
  );

  testComparatorCriteria(
    'should return criteriaId 285 (Comparator test For IsSet - No Match)',
    TEST_USER_DATA.IS_SET_NO_MATCH,
    DATA_TYPE_COMPARATOR_IS_SET,
    null
  );
});

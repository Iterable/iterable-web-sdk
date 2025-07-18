import {
  setupLocalStorageMock,
  testCriteriaMatch,
  runCriteriaCheck
} from './testHelpers';
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

// Test data constants
const TEST_EVENTS = {
  BUTTON_CLICKED_ANIMALS: {
    eventName: 'button-clicked',
    dataFields: { animal: ['cat', 'dog', 'giraffe'] },
    eventType: 'customEvent'
  },
  BUTTON_CLICKED_ANIMALS_SHORT: {
    eventName: 'button-clicked',
    dataFields: { animal: ['cat', 'dog'] },
    eventType: 'customEvent'
  },
  ANIMAL_FOUND_COUNT_5: {
    dataFields: { count: [5, 8, 9] },
    eventType: 'customEvent',
    eventName: 'animal_found'
  },
  ANIMAL_FOUND_COUNT_4: {
    dataFields: { count: [4, 8, 9] },
    eventType: 'customEvent',
    eventName: 'animal_found'
  }
};

const TEST_USER_DATA = {
  MILESTONE_YEARS_FULL: {
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
  MILESTONE_YEARS_PARTIAL: {
    dataFields: {
      milestoneYears: [1996, 1998, 2002, 2020, 2024],
      score: [12.5, 13.5, 14.5],
      timestamp: [1722497422151, 1722500235276, 1722500225276, 1722500245276]
    },
    eventType: 'user'
  },
  MILESTONE_YEARS_HIGH: {
    dataFields: { milestoneYears: [1996, 1998, 2002, 2020, 2024] },
    eventType: 'user'
  },
  MILESTONE_YEARS_LOW: {
    dataFields: { milestoneYears: [1990, 1992, 1994, 1996] },
    eventType: 'user'
  },
  MILESTONE_YEARS_MID_LOW: {
    dataFields: { milestoneYears: [1990, 1992, 1994, 1996, 1998] },
    eventType: 'user'
  },
  MILESTONE_YEARS_MID_HIGH: {
    dataFields: { milestoneYears: [1997, 1999, 2002, 2004] },
    eventType: 'user'
  },
  MILESTONE_YEARS_EDGE: {
    dataFields: { milestoneYears: [1997, 1998, 2002, 2020, 2024] },
    eventType: 'user'
  },
  MILESTONE_YEARS_EDGE_HIGH: {
    dataFields: { milestoneYears: [1998, 1999, 2002, 2004] },
    eventType: 'user'
  },
  ADDRESSES_FULL: {
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
  },
  ADDRESSES_INTERNATIONAL: {
    dataFields: { addresses: ['Tokyo, JP', 'Berlin, DE', 'London, GB'] },
    eventType: 'user'
  },
  ADDRESSES_WITH_PREFIX: {
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
  },
  ADDRESSES_NO_US_PREFIX: {
    dataFields: { addresses: ['JP, Tokyo', 'DE, Berlin', 'GB, London'] },
    eventType: 'user'
  },
  ADDRESSES_US_ONLY: {
    dataFields: {
      addresses: [
        'US, New York',
        'US, San Francisco',
        'US, San Diego',
        'US, Los Angeles'
      ]
    },
    eventType: 'user'
  },
  COUNTRY_CHINA: {
    dataFields: {
      country: 'China',
      addresses: ['US', 'UK', 'JP', 'DE', 'GB']
    },
    eventType: 'user'
  },
  COUNTRY_KOREA: {
    dataFields: {
      country: 'Korea',
      addresses: ['US', 'UK']
    },
    eventType: 'user'
  }
};

describe('compareArrayDataTypes', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  // MARK: Equal
  testCriteriaMatch(
    'should return criteriaId 285 (compare array Equal)',
    [TEST_EVENTS.BUTTON_CLICKED_ANIMALS],
    TEST_USER_DATA.MILESTONE_YEARS_FULL,
    ARRAY_EQUAL_CRITERIA,
    '285'
  );

  testCriteriaMatch(
    'should return criteriaId null (compare array Equal - No match)',
    [TEST_EVENTS.BUTTON_CLICKED_ANIMALS_SHORT],
    TEST_USER_DATA.MILESTONE_YEARS_PARTIAL,
    ARRAY_EQUAL_CRITERIA,
    null
  );

  // MARK: DoesNotEqual
  testCriteriaMatch(
    'should return criteriaId 285 (compare array DoesNotEqual)',
    [TEST_EVENTS.BUTTON_CLICKED_ANIMALS_SHORT],
    TEST_USER_DATA.MILESTONE_YEARS_PARTIAL,
    ARRAY_DOES_NOT_EQUAL_CRITERIA,
    '285'
  );

  testCriteriaMatch(
    'should return criteriaId null (compare array DoesNotEqual - No match)',
    [TEST_EVENTS.BUTTON_CLICKED_ANIMALS],
    TEST_USER_DATA.MILESTONE_YEARS_FULL,
    ARRAY_DOES_NOT_EQUAL_CRITERIA,
    null
  );

  // MARK: GreaterThan
  it('should return criteriaId 285 (compare array GreaterThan)', () => {
    const result = runCriteriaCheck(
      ARRAY_GREATER_THAN_CRITERIA,
      null,
      TEST_USER_DATA.MILESTONE_YEARS_HIGH
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array GreaterThan - No match)', () => {
    const result = runCriteriaCheck(
      ARRAY_GREATER_THAN_CRITERIA,
      null,
      TEST_USER_DATA.MILESTONE_YEARS_LOW
    );
    expect(result).toEqual(null);
  });

  // MARK: LessThan
  it('should return criteriaId 285 (compare array LessThan)', () => {
    const result = runCriteriaCheck(
      ARRAY_LESS_THAN_CRITERIA,
      null,
      TEST_USER_DATA.MILESTONE_YEARS_MID_LOW
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array LessThan - No match)', () => {
    const result = runCriteriaCheck(
      ARRAY_LESS_THAN_CRITERIA,
      null,
      TEST_USER_DATA.MILESTONE_YEARS_MID_HIGH
    );
    expect(result).toEqual(null);
  });

  // MARK: GreaterThanOrEqualTo
  it('should return criteriaId 285 (compare array GreaterThanOrEqualTo)', () => {
    const result = runCriteriaCheck(
      ARRAY_GREATER_THAN_EQUAL_TO_CRITERIA,
      null,
      TEST_USER_DATA.MILESTONE_YEARS_EDGE
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array GreaterThanOrEqualTo - No match)', () => {
    const result = runCriteriaCheck(
      ARRAY_GREATER_THAN_EQUAL_TO_CRITERIA,
      null,
      TEST_USER_DATA.MILESTONE_YEARS_LOW
    );
    expect(result).toEqual(null);
  });

  // MARK: LessThanOrEqualTo
  it('should return criteriaId 285 (compare array LessThanOrEqualTo)', () => {
    const result = runCriteriaCheck(
      ARRAY_LESS_THAN_EQUAL_TO_CRITERIA,
      null,
      TEST_USER_DATA.MILESTONE_YEARS_MID_LOW
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array LessThanOrEqualTo - No match)', () => {
    const result = runCriteriaCheck(
      ARRAY_LESS_THAN_EQUAL_TO_CRITERIA,
      null,
      TEST_USER_DATA.MILESTONE_YEARS_EDGE_HIGH
    );
    expect(result).toEqual(null);
  });

  // MARK: Contains
  it('should return criteriaId 285 (compare array Contains)', () => {
    const result = runCriteriaCheck(
      ARRAY_CONTAINS_CRITERIA,
      null,
      TEST_USER_DATA.ADDRESSES_FULL
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array Contains - No match)', () => {
    const result = runCriteriaCheck(
      ARRAY_CONTAINS_CRITERIA,
      null,
      TEST_USER_DATA.ADDRESSES_INTERNATIONAL
    );
    expect(result).toEqual(null);
  });

  // MARK: StartsWith
  it('should return criteriaId 285 (compare array StartsWith)', () => {
    const result = runCriteriaCheck(
      ARRAY_STARTSWITH_CRITERIA,
      null,
      TEST_USER_DATA.ADDRESSES_WITH_PREFIX
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array StartsWith - No match)', () => {
    const result = runCriteriaCheck(
      ARRAY_STARTSWITH_CRITERIA,
      null,
      TEST_USER_DATA.ADDRESSES_NO_US_PREFIX
    );
    expect(result).toEqual(null);
  });

  // MARK: MatchesRegex
  it('should return criteriaId 285 (compare array MatchesRegex)', () => {
    const result = runCriteriaCheck(
      ARRAY_MATCHREGEX_CRITERIA,
      null,
      TEST_USER_DATA.ADDRESSES_WITH_PREFIX
    );
    expect(result).toEqual('285');
  });

  it('should return criteriaId null (compare array MatchesRegex - No match)', () => {
    const result = runCriteriaCheck(
      ARRAY_MATCHREGEX_CRITERIA,
      null,
      TEST_USER_DATA.ADDRESSES_US_ONLY
    );
    expect(result).toEqual(null);
  });

  // MARK: IsOneOf
  it('should return criteriaId 299 (compare array IsOneOf)', () => {
    const result = runCriteriaCheck(
      IS_ONE_OF_CRITERIA,
      null,
      TEST_USER_DATA.COUNTRY_CHINA
    );
    expect(result).toEqual('299');
  });

  it('should return criteriaId null (compare array IsOneOf - No match)', () => {
    const result = runCriteriaCheck(
      IS_ONE_OF_CRITERIA,
      null,
      TEST_USER_DATA.COUNTRY_KOREA
    );
    expect(result).toEqual(null);
  });

  // MARK: IsNotOneOf
  it('should return criteriaId 299 (compare array IsNotOneOf)', () => {
    const result = runCriteriaCheck(
      IS_NOT_ONE_OF_CRITERIA,
      null,
      TEST_USER_DATA.COUNTRY_KOREA
    );
    expect(result).toEqual('299');
  });

  it('should return criteriaId null (compare array IsNotOneOf - No match)', () => {
    const result = runCriteriaCheck(
      IS_NOT_ONE_OF_CRITERIA,
      null,
      TEST_USER_DATA.COUNTRY_CHINA
    );
    expect(result).toEqual(null);
  });

  // MARK: Custom event tests
  it('should return criteriaId 467 (Custom event - single primitive array)', () => {
    const result = runCriteriaCheck(
      CUSTOM_EVENT_SINGLE_PRIMITIVE_CRITERIA,
      [TEST_EVENTS.ANIMAL_FOUND_COUNT_5],
      null
    );
    expect(result).toEqual('467');
  });

  it('should return criteriaId null (Custom event - single primitive array - No match)', () => {
    const result = runCriteriaCheck(
      CUSTOM_EVENT_SINGLE_PRIMITIVE_CRITERIA,
      [TEST_EVENTS.ANIMAL_FOUND_COUNT_4],
      null
    );
    expect(result).toEqual(null);
  });
});

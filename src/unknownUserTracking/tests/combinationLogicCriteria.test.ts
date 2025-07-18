import {
  setupLocalStorageMock,
  testCriteriaMatch,
  createSimpleCriteria
} from './testHelpers';

// Test data constants
const TEST_USERS = {
  DAVID: { dataFields: { firstName: 'David' }, eventType: 'user' },
  DAVIDSON: { dataFields: { firstName: 'Davidson' }, eventType: 'user' }
};

const TEST_CUSTOM_EVENTS = {
  TOTAL_10: { dataFields: { total: 10 }, eventType: 'customEvent' },
  TOTAL_101: { dataFields: { total: 101 }, eventType: 'customEvent' },
  TOTAL_1: { dataFields: { total: 1 }, eventType: 'customEvent' },
  BIRTHDAY: { dataFields: { eventName: 'birthday' }, eventType: 'customEvent' },
  ANNIVERSARY: {
    dataFields: { eventName: 'anniversary' },
    eventType: 'customEvent'
  },
  ITEMS_COFFEE: {
    dataFields: {
      items: [{ name: 'Coffee', id: 'fdsafds', price: 10, quantity: 2 }],
      total: 10
    },
    eventType: 'customEvent'
  }
};

const TEST_CART_EVENTS = {
  FRIED: {
    items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
    eventType: 'cartUpdate'
  },
  CHICKEN: {
    items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
    eventType: 'cartUpdate'
  },
  BOILED: {
    items: [{ name: 'boiled', id: 'boiled', price: 10, quantity: 2 }],
    eventType: 'cartUpdate'
  }
};

const TEST_PURCHASE_EVENTS = {
  CHICKEN: {
    items: [{ name: 'chicken', id: 'chicken', price: 10, quantity: 2 }],
    eventType: 'purchase'
  },
  FRIED: {
    items: [{ name: 'fried', id: 'fried', price: 10, quantity: 2 }],
    eventType: 'purchase'
  },
  BEEF: {
    items: [{ name: 'beef', id: 'beef', price: 10, quantity: 2 }],
    eventType: 'purchase'
  }
};

// Criteria builders
const createContactPropertyAndCustomEventCriteria = (
  criteriaId: string,
  combinator: string
) =>
  createSimpleCriteria(
    criteriaId,
    `Combination Logic - Contact Property ${combinator} Custom Event`,
    {
      combinator: 'And',
      searchQueries: [
        {
          combinator,
          searchQueries: [
            {
              dataType: 'user',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'user',
                    field: 'firstName',
                    comparatorType: 'Equals',
                    value: 'David',
                    id: 2,
                    fieldType: 'string'
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
                    dataType: 'customEvent',
                    field: 'total',
                    comparatorType: 'Equals',
                    value: '10',
                    id: 6,
                    fieldType: 'double'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );

const createUpdateCartAndContactPropertyCriteria = (
  criteriaId: string,
  combinator: string
) =>
  createSimpleCriteria(
    criteriaId,
    `Combination Logic - UpdateCart ${combinator} Contact Property`,
    {
      combinator: 'And',
      searchQueries: [
        {
          combinator,
          searchQueries: [
            {
              dataType: 'customEvent',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.name',
                    comparatorType: 'Equals',
                    value: 'fried',
                    id: 2,
                    fieldType: 'string'
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
                    dataType: 'user',
                    field: 'firstName',
                    comparatorType: 'Equals',
                    value: 'David',
                    id: 2,
                    fieldType: 'string'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );

const createPurchaseAndUpdateCartCriteria = (
  criteriaId: string,
  combinator: string
) =>
  createSimpleCriteria(
    criteriaId,
    `Combination Logic - Purchase ${combinator} UpdateCart`,
    {
      combinator: 'And',
      searchQueries: [
        {
          combinator,
          searchQueries: [
            {
              dataType: 'purchase',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'purchase',
                    field: 'shoppingCartItems.name',
                    comparatorType: 'Equals',
                    value: 'chicken',
                    id: 13,
                    fieldType: 'string'
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
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.name',
                    comparatorType: 'Equals',
                    value: 'fried',
                    id: 2,
                    fieldType: 'string'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );

const createCustomEventAndPurchaseCriteria = (
  criteriaId: string,
  combinator: string
) =>
  createSimpleCriteria(
    criteriaId,
    `Combination Logic - Custom Event ${combinator} Purchase`,
    {
      combinator: 'And',
      searchQueries: [
        {
          combinator,
          searchQueries: [
            {
              dataType: 'purchase',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'purchase',
                    field: 'shoppingCartItems.name',
                    comparatorType: 'Equals',
                    value: 'chicken',
                    id: 13,
                    fieldType: 'string'
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
                    dataType: 'customEvent',
                    field: 'eventName',
                    comparatorType: 'Equals',
                    value: 'birthday',
                    id: 16,
                    fieldType: 'string'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );

const createContactPropertyNorCustomEventCriteria = (criteriaId: string) =>
  createSimpleCriteria(
    criteriaId,
    'Combination Logic - Contact Property NOR (NOT) Custom Event',
    {
      combinator: 'And',
      searchQueries: [
        {
          combinator: 'Not',
          searchQueries: [
            {
              dataType: 'customEvent',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'customEvent',
                    field: 'total',
                    comparatorType: 'Equals',
                    value: '10',
                    id: 6,
                    fieldType: 'double'
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
                    dataType: 'user',
                    field: 'firstName',
                    comparatorType: 'Equals',
                    value: 'David',
                    id: 2,
                    fieldType: 'string'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );

const createUpdateCartNorContactPropertyCriteria = (criteriaId: string) =>
  createSimpleCriteria(
    criteriaId,
    'Combination Logic - UpdateCart NOR (NOT) Contact Property',
    {
      combinator: 'And',
      searchQueries: [
        {
          combinator: 'Not',
          searchQueries: [
            {
              dataType: 'customEvent',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.name',
                    comparatorType: 'Equals',
                    value: 'fried',
                    id: 2,
                    fieldType: 'string'
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
                    dataType: 'user',
                    field: 'firstName',
                    comparatorType: 'Equals',
                    value: 'David',
                    id: 2,
                    fieldType: 'string'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );

const createPurchaseNorUpdateCartCriteria = (criteriaId: string) =>
  createSimpleCriteria(
    criteriaId,
    'Combination Logic - Purchase NOR (NOT) UpdateCart',
    {
      combinator: 'And',
      searchQueries: [
        {
          combinator: 'Not',
          searchQueries: [
            {
              dataType: 'purchase',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'purchase',
                    field: 'shoppingCartItems.name',
                    comparatorType: 'Equals',
                    value: 'chicken',
                    id: 13,
                    fieldType: 'string'
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
                    dataType: 'customEvent',
                    field: 'updateCart.updatedShoppingCartItems.name',
                    comparatorType: 'Equals',
                    value: 'fried',
                    id: 2,
                    fieldType: 'string'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );

const createCustomEventNorPurchaseCriteria = (criteriaId: string) =>
  createSimpleCriteria(
    criteriaId,
    'Combination Logic - Custom Event NOR (NOT) Purchase',
    {
      combinator: 'And',
      searchQueries: [
        {
          combinator: 'Not',
          searchQueries: [
            {
              dataType: 'purchase',
              searchCombo: {
                combinator: 'And',
                searchQueries: [
                  {
                    dataType: 'purchase',
                    field: 'shoppingCartItems.name',
                    comparatorType: 'Equals',
                    value: 'chicken',
                    id: 13,
                    fieldType: 'string'
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
                    dataType: 'customEvent',
                    field: 'eventName',
                    comparatorType: 'Equals',
                    value: 'birthday',
                    id: 16,
                    fieldType: 'string'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );

describe('CombinationLogicCriteria', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  // Contact Property AND Custom Event Tests
  testCriteriaMatch(
    'should return criteriaId 1 if Contact Property AND Custom Event is matched',
    [TEST_CUSTOM_EVENTS.TOTAL_10],
    TEST_USERS.DAVID,
    createContactPropertyAndCustomEventCriteria('1', 'And'),
    '1'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 1 fail)',
    [TEST_CUSTOM_EVENTS.TOTAL_10],
    TEST_USERS.DAVIDSON,
    createContactPropertyAndCustomEventCriteria('1', 'And'),
    null
  );

  // Contact Property OR Custom Event Tests
  testCriteriaMatch(
    'should return criteriaId 2 if Contact Property OR Custom Event is matched',
    [TEST_CUSTOM_EVENTS.TOTAL_10],
    TEST_USERS.DAVID,
    createContactPropertyAndCustomEventCriteria('2', 'Or'),
    '2'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 2 fail)',
    [TEST_CUSTOM_EVENTS.TOTAL_101],
    TEST_USERS.DAVIDSON,
    createContactPropertyAndCustomEventCriteria('2', 'Or'),
    null
  );

  // Contact Property NOR (NOT) Custom Event Tests
  testCriteriaMatch(
    'should return criteriaId 3 if Contact Property NOR (NOT) Custom Event is matched',
    [TEST_CUSTOM_EVENTS.ITEMS_COFFEE],
    TEST_USERS.DAVIDSON,
    createContactPropertyNorCustomEventCriteria('3'),
    '3'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 3 fail)',
    [TEST_CUSTOM_EVENTS.TOTAL_1],
    TEST_USERS.DAVID,
    createContactPropertyNorCustomEventCriteria('3'),
    null
  );

  // UpdateCart AND Contact Property Tests
  testCriteriaMatch(
    'should return criteriaId 4 if UpdateCart AND Contact Property is matched',
    [TEST_CART_EVENTS.FRIED],
    TEST_USERS.DAVID,
    createUpdateCartAndContactPropertyCriteria('4', 'And'),
    '4'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 4 fail)',
    [TEST_CART_EVENTS.CHICKEN],
    TEST_USERS.DAVIDSON,
    createUpdateCartAndContactPropertyCriteria('4', 'And'),
    null
  );

  // UpdateCart OR Contact Property Tests
  testCriteriaMatch(
    'should return criteriaId 5 if UpdateCart OR Contact Property is matched',
    [TEST_CART_EVENTS.FRIED],
    TEST_USERS.DAVID,
    createUpdateCartAndContactPropertyCriteria('5', 'Or'),
    '5'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 5 fail)',
    [TEST_CART_EVENTS.CHICKEN],
    TEST_USERS.DAVIDSON,
    createUpdateCartAndContactPropertyCriteria('5', 'Or'),
    null
  );

  // UpdateCart NOR (NOT) Contact Property Tests
  testCriteriaMatch(
    'should return criteriaId 6 if UpdateCart NOR (NOT) Contact Property is matched',
    [TEST_CART_EVENTS.BOILED],
    TEST_USERS.DAVIDSON,
    createUpdateCartNorContactPropertyCriteria('6'),
    '6'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 6 fail)',
    [TEST_CART_EVENTS.FRIED],
    TEST_USERS.DAVID,
    createUpdateCartNorContactPropertyCriteria('6'),
    null
  );

  // Purchase AND UpdateCart Tests (events only)
  testCriteriaMatch(
    'should return criteriaId 7 if Purchase AND UpdateCart is matched',
    [TEST_PURCHASE_EVENTS.CHICKEN, TEST_CART_EVENTS.FRIED],
    null,
    createPurchaseAndUpdateCartCriteria('7', 'And'),
    '7'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 7 fail)',
    [TEST_PURCHASE_EVENTS.FRIED, TEST_CART_EVENTS.CHICKEN],
    null,
    createPurchaseAndUpdateCartCriteria('7', 'And'),
    null
  );

  // Purchase OR UpdateCart Tests (events only)
  testCriteriaMatch(
    'should return criteriaId 8 if Purchase OR UpdateCart is matched',
    [TEST_PURCHASE_EVENTS.CHICKEN, TEST_CART_EVENTS.FRIED],
    null,
    createPurchaseAndUpdateCartCriteria('8', 'Or'),
    '8'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 8 fail)',
    [TEST_PURCHASE_EVENTS.FRIED, TEST_CART_EVENTS.CHICKEN],
    null,
    createPurchaseAndUpdateCartCriteria('8', 'Or'),
    null
  );

  // Purchase NOR (NOT) UpdateCart Tests (events only)
  testCriteriaMatch(
    'should return criteriaId 9 if Purchase NOR (NOT) UpdateCart is matched',
    [TEST_PURCHASE_EVENTS.BEEF, TEST_CART_EVENTS.BOILED],
    null,
    createPurchaseNorUpdateCartCriteria('9'),
    '9'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 9 fail)',
    [TEST_PURCHASE_EVENTS.CHICKEN, TEST_CART_EVENTS.FRIED],
    null,
    createPurchaseNorUpdateCartCriteria('9'),
    null
  );

  // Custom Event AND Purchase Tests (events only)
  testCriteriaMatch(
    'should return criteriaId 10 if Custom Event AND Purchase is matched',
    [TEST_CUSTOM_EVENTS.BIRTHDAY, TEST_PURCHASE_EVENTS.CHICKEN],
    null,
    createCustomEventAndPurchaseCriteria('10', 'And'),
    '10'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 10 fail)',
    [TEST_CUSTOM_EVENTS.ANNIVERSARY, TEST_PURCHASE_EVENTS.FRIED],
    null,
    createCustomEventAndPurchaseCriteria('10', 'And'),
    null
  );

  // Custom Event OR Purchase Tests (events only)
  testCriteriaMatch(
    'should return criteriaId 11 if Custom Event OR Purchase is matched',
    [TEST_CUSTOM_EVENTS.BIRTHDAY],
    null,
    createCustomEventAndPurchaseCriteria('11', 'Or'),
    '11'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 11 fail)',
    [TEST_CUSTOM_EVENTS.ANNIVERSARY, TEST_PURCHASE_EVENTS.FRIED],
    null,
    createCustomEventAndPurchaseCriteria('11', 'Or'),
    null
  );

  // Custom Event NOR (NOT) Purchase Tests (events only)
  testCriteriaMatch(
    'should return criteriaId 12 if Custom Event NOR (NOT) Purchase is matched',
    [TEST_CUSTOM_EVENTS.ANNIVERSARY, TEST_PURCHASE_EVENTS.BEEF],
    null,
    createCustomEventNorPurchaseCriteria('12'),
    '12'
  );

  testCriteriaMatch(
    'should return null (combination logic criteria 12 fail)',
    [TEST_CUSTOM_EVENTS.BIRTHDAY, TEST_PURCHASE_EVENTS.CHICKEN],
    null,
    createCustomEventNorPurchaseCriteria('12'),
    null
  );
});

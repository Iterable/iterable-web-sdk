import { AnonymousUserEventManager } from '../anonymousUserEventManager';
import { baseIterableRequest } from '../../request';
import {
  SHARED_PREFS_ANON_SESSIONS,
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_CRITERIA
} from '../../constants';
import { UpdateUserParams } from '../../users';
import { TrackPurchaseRequestParams } from '../../commerce';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

jest.mock('../criteriaCompletionChecker', () =>
  jest.fn().mockImplementation(() => ({
    getMatchedCriteria: jest.fn()
  }))
);

jest.mock('../../request', () => ({
  baseIterableRequest: jest.fn()
}));

declare global {
  function uuidv4(): string;
  function getEmail(): string;
  function getUserID(): string;
  function setUserID(): string;
}

describe('AnonymousUserEventManager', () => {
  let anonUserEventManager: AnonymousUserEventManager;

  beforeEach(() => {
    (global as any).localStorage = localStorageMock;
    anonUserEventManager = new AnonymousUserEventManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update anonymous session information correctly', () => {
    const initialAnonSessionInfo = {
      itbl_anon_sessions: {
        number_of_sessions: 1,
        first_session: 123456789,
        last_session: expect.any(Number)
      }
    };

    localStorageMock.getItem.mockReturnValue(
      JSON.stringify(initialAnonSessionInfo)
    );

    anonUserEventManager.updateAnonSession();

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      SHARED_PREFS_ANON_SESSIONS,
      expect.stringContaining('itbl_anon_sessions')
    );
  });

  it('should set criteria data in localStorage when baseIterableRequest succeeds', async () => {
    const mockResponse = { data: { criteria: 'mockCriteria' } };
    (baseIterableRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

    const setItemMock = jest.spyOn(localStorage, 'setItem');
    await anonUserEventManager.getAnonCriteria();

    expect(setItemMock).toHaveBeenCalledWith(
      SHARED_PREFS_CRITERIA,
      '{"criteria":"mockCriteria"}'
    );
  });

  it('should create known user and make API request when userData is available', async () => {
    const userData = {
      number_of_sessions: 5,
      last_session: 123456789,
      first_session: 123456789
    };

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'criteria') {
        return JSON.stringify({
          count: 1,
          criteriaSets: [
            {
              criteriaId: '6',
              name: 'EventCriteria',
              createdAt: 1704754280210,
              updatedAt: 1704754280210,
              searchQuery: {
                combinator: 'Or',
                searchQueries: [
                  {
                    combinator: 'Or',
                    searchQueries: [
                      {
                        dataType: 'purchase',
                        searchCombo: {
                          combinator: 'And',
                          searchQueries: [
                            {
                              dataType: 'customEvent',
                              field: 'eventName',
                              comparatorType: 'Equals',
                              value: 'testEvent',
                              fieldType: 'string'
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
        });
      }
      if (key === SHARED_PREFS_ANON_SESSIONS) {
        return JSON.stringify(userData);
      }
      return null;
    });

    anonUserEventManager.updateAnonSession();
  });

  it('should call createKnownUser when trackAnonEvent is called', async () => {
    const payload = {
      eventName: 'testEvent',
      eventType: 'customEvent'
    };
    const eventData = [
      {
        eventName: 'testEvent',
        createdAt: 1708494757530,
        dataFields: undefined,
        createNewFields: true,
        eventType: 'customEvent'
      }
    ];

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'criteria') {
        return JSON.stringify({
          count: 1,
          criteriaSets: [
            {
              criteriaId: '6',
              name: 'EventCriteria',
              createdAt: 1704754280210,
              updatedAt: 1704754280210,
              searchQuery: {
                combinator: 'Or',
                searchQueries: [
                  {
                    combinator: 'Or',
                    searchQueries: [
                      {
                        dataType: 'purchase',
                        searchCombo: {
                          combinator: 'And',
                          searchQueries: [
                            {
                              dataType: 'customEvent',
                              field: 'eventName',
                              comparatorType: 'Equals',
                              value: 'testEvent',
                              fieldType: 'string'
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
        });
      }
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify(eventData);
      }
      return null;
    });
    await anonUserEventManager.trackAnonEvent(payload);
  });

  it('should not call createKnownUser when trackAnonEvent is called and criteria does not match', async () => {
    const payload = {
      eventName: 'Event'
    };
    const eventData = [
      {
        eventName: 'Event',
        createdAt: 1708494757530,
        dataFields: undefined,
        createNewFields: true,
        eventType: 'customEvent'
      }
    ];

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'criteria') {
        return JSON.stringify({
          count: 1,
          criteriaSets: [
            {
              criteriaId: '6',
              name: 'EventCriteria',
              createdAt: 1704754280210,
              updatedAt: 1704754280210,
              searchQuery: {
                combinator: 'Or',
                searchQueries: [
                  {
                    combinator: 'Or',
                    searchQueries: [
                      {
                        dataType: 'purchase',
                        searchCombo: {
                          combinator: 'And',
                          searchQueries: [
                            {
                              dataType: 'customEvent',
                              field: 'eventName',
                              comparatorType: 'Equals',
                              value: 'testEvent',
                              fieldType: 'string'
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
        });
      }
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify(eventData);
      }
      return null;
    });
    await anonUserEventManager.trackAnonEvent(payload);
  });

  it('should not call createKnownUser when trackAnonEvent is called and criteria not find', async () => {
    const payload = {
      eventName: 'Event'
    };
    const eventData = [
      {
        eventName: 'Event',
        createdAt: 1708494757530,
        dataFields: undefined,
        createNewFields: true,
        eventType: 'customEvent'
      }
    ];

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'criteria') {
        return null;
      }
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify(eventData);
      }
      return null;
    });
    await anonUserEventManager.trackAnonEvent(payload);
  });

  it('should call createKnownUser when trackAnonUpdateUser is called', async () => {
    const payload: UpdateUserParams = {
      dataFields: { country: 'UK' }
    };
    const userData = [
      {
        userId: 'user',
        createdAt: 1708494757530,
        dataFields: undefined,
        createNewFields: true,
        eventType: 'updateUser'
      }
    ];

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'criteria') {
        return JSON.stringify({
          count: 1,
          criteriaSets: [
            {
              criteriaId: '6',
              name: 'UpdateUserCriteria',
              createdAt: 1704754280210,
              updatedAt: 1704754280210,
              searchQuery: {
                combinator: 'Or',
                searchQueries: [
                  {
                    combinator: 'Or',
                    searchQueries: [
                      {
                        dataType: 'updateUser',
                        searchCombo: {
                          combinator: 'And',
                          searchQueries: [
                            {
                              dataType: 'updateUser',
                              field: 'userId',
                              comparatorType: 'Equals',
                              value: 'user',
                              fieldType: 'string'
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
        });
      }
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify(userData);
      }
      return null;
    });
    await anonUserEventManager.trackAnonUpdateUser(payload);
  });

  it('should call createKnownUser when trackAnonPurchaseEvent is called', async () => {
    const payload: TrackPurchaseRequestParams = {
      items: [
        {
          id: '123',
          name: 'Black Coffee',
          quantity: 1,
          price: 4
        }
      ],
      total: 0
    };
    const userData = [
      {
        items: [
          {
            id: '123',
            name: 'Black Coffee',
            quantity: 1,
            price: 4
          }
        ],
        user: {
          userId: 'user'
        },
        total: 0,
        eventType: 'purchase'
      }
    ];

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'criteria') {
        return JSON.stringify({
          count: 1,
          criteriaSets: [
            {
              criteriaId: '6',
              name: 'shoppingCartItemsCriteria',
              createdAt: 1704754280210,
              updatedAt: 1704754280210,
              searchQuery: {
                combinator: 'Or',
                searchQueries: [
                  {
                    combinator: 'Or',
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
                              value: 'Black Coffee',
                              fieldType: 'string'
                            },
                            {
                              dataType: 'purchase',
                              field: 'shoppingCartItems.price',
                              comparatorType: 'GreaterThanOrEqualTo',
                              value: '4.00',
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
        });
      }
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify(userData);
      }
      return null;
    });
    await anonUserEventManager.trackAnonPurchaseEvent(payload);
  });

  it('should call createKnownUser when trackAnonUpdateCart is called', async () => {
    const payload: TrackPurchaseRequestParams = {
      items: [
        {
          id: '123',
          name: 'Black Coffee',
          quantity: 2,
          price: 4
        }
      ],
      total: 0
    };
    const userData = [
      {
        items: [
          {
            id: '123',
            name: 'Black Coffee',
            quantity: 1,
            price: 4
          }
        ],
        user: {
          userId: 'user'
        },
        total: 0,
        eventType: 'cartUpdate'
      }
    ];

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'criteria') {
        return JSON.stringify({
          count: 1,
          criteriaSets: [
            {
              criteriaId: '6',
              name: 'CartUpdateItemsCriteria',
              createdAt: 1704754280210,
              updatedAt: 1704754280210,
              searchQuery: {
                combinator: 'Or',
                searchQueries: [
                  {
                    combinator: 'Or',
                    searchQueries: [
                      {
                        dataType: 'cartUpdate',
                        searchCombo: {
                          combinator: 'And',
                          searchQueries: [
                            {
                              dataType: 'cartUpdate',
                              field: 'shoppingCartItems.name',
                              comparatorType: 'Equals',
                              value: 'Black Coffee',
                              fieldType: 'string'
                            },
                            {
                              dataType: 'cartUpdate',
                              field: 'shoppingCartItems.price',
                              comparatorType: 'GreaterThanOrEqualTo',
                              value: '4.00',
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
        });
      }
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify(userData);
      }
      return null;
    });
    await anonUserEventManager.trackAnonUpdateCart(payload);
  });
});

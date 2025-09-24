import { UnknownUserEventManager } from '../unknownUserEventManager';
import { baseIterableRequest } from '../../request';
import { config } from '../../utils/config';
import {
  SHARED_PREFS_UNKNOWN_SESSIONS,
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_CRITERIA,
  SHARED_PREF_UNKNOWN_USAGE_TRACKED,
  SHARED_PREF_CONSENT_TIMESTAMP,
  ENDPOINT_TRACK_UNKNOWN_SESSION,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY
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

jest.mock('../../utils/config', () => ({
  __esModule: true,
  config: {
    getConfig: jest.fn()
  }
}));

declare global {
  function uuidv4(): string;
  function getEmail(): string;
  function getUserID(): string;
  function setUserID(): string;
}

describe('UnknownUserEventManager', () => {
  let unknownUserEventManager: UnknownUserEventManager;
  const mockConfig = config as jest.Mocked<typeof config>;

  beforeEach(() => {
    (global as any).localStorage = localStorageMock;

    // Default consent setup for most tests
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) {
        return '1234567890'; // Mock consent timestamp
      }
      return null;
    });

    // Mock config for unknown user activation
    mockConfig.getConfig.mockImplementation((key) => {
      if (key === 'enableUnknownActivation') {
        return true;
      }
      return undefined;
    });

    unknownUserEventManager = new UnknownUserEventManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update unknown session information correctly', () => {
    const initialUnknownSessionInfo = {
      itbl_unknown_sessions: {
        number_of_sessions: 1,
        first_session: 123456789,
        last_session: expect.any(Number)
      }
    };

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
        return JSON.stringify(initialUnknownSessionInfo);
      }
      if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) {
        return 'true';
      }
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) {
        return '1234567890'; // Mock consent timestamp
      }
      return null;
    });

    unknownUserEventManager.updateUnknownSession();

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      SHARED_PREFS_UNKNOWN_SESSIONS,
      expect.stringContaining('itbl_unknown_sessions')
    );
  });

  it('should set criteria data in localStorage when baseIterableRequest succeeds', async () => {
    const mockResponse = { data: { criteria: 'mockCriteria' } };
    (baseIterableRequest as jest.Mock).mockResolvedValueOnce(mockResponse);

    const setItemMock = jest.spyOn(localStorage, 'setItem');
    await unknownUserEventManager.getUnknownCriteria();

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
      if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
        return JSON.stringify(userData);
      }
      return null;
    });

    unknownUserEventManager.updateUnknownSession();
  });

  it('should call createUnknownUser when trackUnknownEvent is called', async () => {
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
    await unknownUserEventManager.trackUnknownEvent(payload);
  });

  it('should not call createUnknownUser when trackUnknownEvent is called and criteria does not match', async () => {
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
    await unknownUserEventManager.trackUnknownEvent(payload);
  });

  it('should not call createUnknownUser when trackUnknownEvent is called and criteria not find', async () => {
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
    await unknownUserEventManager.trackUnknownEvent(payload);
  });

  it('should call createUnknownUser when trackUnknownUpdateUser is called', async () => {
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
    await unknownUserEventManager.trackUnknownUpdateUser(payload);
  });

  it('should call createUnknownUser when trackUnknownPurchaseEvent is called', async () => {
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
    await unknownUserEventManager.trackUnknownPurchaseEvent(payload);
  });

  it('should call createUnknownUser when trackUnknownUpdateCart is called', async () => {
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
    await unknownUserEventManager.trackUnknownUpdateCart(payload);
  });

  it('should create session data and call /session immediately when criteria is met without existing session data', async () => {
    // Mock window object for the test
    global.window = Object.create({
      location: { hostname: 'test.example.com' },
      navigator: { userAgent: 'test-user-agent' }
    });

    const mockBaseIterableRequest = baseIterableRequest as jest.MockedFunction<
      typeof baseIterableRequest
    >;

    // Mock successful session creation response
    mockBaseIterableRequest.mockResolvedValue({
      status: 200,
      data: { success: true }
    } as any);

    // Create a new instance to test directly
    const manager = new UnknownUserEventManager();

    // Set up localStorage mocks
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) {
        return 'true';
      }
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) {
        return '1234567890'; // Mock consent timestamp to allow session creation
      }
      // Initially no session data exists
      if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
        return null;
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return null;
      }
      return null;
    });

    // Mock setItem to simulate session creation
    let sessionDataCreated = false;
    (localStorage.setItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
        sessionDataCreated = true;
        // After updateUnknownSession is called, simulate the session data being available
        (localStorage.getItem as jest.Mock).mockImplementation((getKey) => {
          if (getKey === SHARED_PREFS_UNKNOWN_SESSIONS) {
            return JSON.stringify({
              itbl_unknown_sessions: {
                number_of_sessions: 1,
                first_session: Math.floor(Date.now() / 1000),
                last_session: Math.floor(Date.now() / 1000)
              }
            });
          }
          if (getKey === SHARED_PREF_UNKNOWN_USAGE_TRACKED) {
            return 'true';
          }
          if (getKey === SHARED_PREF_CONSENT_TIMESTAMP) {
            return '1234567890'; // Mock consent timestamp
          }
          return null;
        });
      }
    });

    // Directly call createUnknownUser with a criteria ID to test the fix
    await (manager as any).createUnknownUser('123');

    // Verify that session data was created
    expect(sessionDataCreated).toBe(true);

    // Verify that the session endpoint was called
    expect(mockBaseIterableRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: ENDPOINT_TRACK_UNKNOWN_SESSION,
        data: expect.objectContaining({
          user: expect.objectContaining({
            userId: expect.any(String)
          }),
          unknownSessionContext: expect.objectContaining({
            matchedCriteriaId: 123
          })
        })
      })
    );
  });

  describe('syncEvents', () => {
    const mockBaseIterableRequest = baseIterableRequest as jest.MockedFunction<
      typeof baseIterableRequest
    >;

    beforeEach(() => {
      mockBaseIterableRequest.mockResolvedValue({
        status: 200,
        data: { success: true }
      } as any);
    });

    it('should call updateUser with combined dataFields from userUpdateObject', async () => {
      const userUpdateData = {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        preferences: { theme: 'dark' },
        eventType: 'userUpdate'
      };

      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
          return JSON.stringify(userUpdateData);
        }
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([]);
        }
        return null;
      });

      await unknownUserEventManager.syncEvents();

      expect(mockBaseIterableRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/users/update'),
          data: expect.objectContaining({
            dataFields: {
              firstName: 'John',
              lastName: 'Doe',
              age: 30,
              preferences: { theme: 'dark' }
            },
            preferUserId: true
          })
        })
      );
    });

    it('should strip email and userId from dataFields', async () => {
      const userUpdateData = {
        email: 'test@example.com',
        userId: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        eventType: 'userUpdate'
      };

      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
          return JSON.stringify(userUpdateData);
        }
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([]);
        }
        return null;
      });

      await unknownUserEventManager.syncEvents();

      expect(mockBaseIterableRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/users/update'),
          data: expect.objectContaining({
            dataFields: {
              firstName: 'John',
              lastName: 'Doe'
            },
            preferUserId: true
          })
        })
      );

      // Verify email and userId were stripped
      const callData = mockBaseIterableRequest.mock.calls[0][0].data;
      expect(callData.dataFields).not.toHaveProperty('email');
      expect(callData.dataFields).not.toHaveProperty('userId');
    });

    it('should not call updateUser when userUpdateObject is empty', async () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
          return JSON.stringify({});
        }
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([]);
        }
        return null;
      });

      await unknownUserEventManager.syncEvents();

      expect(mockBaseIterableRequest).not.toHaveBeenCalled();
    });

    it('should not call updateUser when userUpdateObject only contains eventType', async () => {
      const userUpdateData = {
        eventType: 'userUpdate'
      };

      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
          return JSON.stringify(userUpdateData);
        }
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([]);
        }
        return null;
      });

      await unknownUserEventManager.syncEvents();

      expect(mockBaseIterableRequest).not.toHaveBeenCalled();
    });

    it('should handle userUpdateObject with only email and userId (no dataFields)', async () => {
      const userUpdateData = {
        email: 'test@example.com',
        userId: 'user123',
        eventType: 'userUpdate'
      };

      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
          return JSON.stringify(userUpdateData);
        }
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([]);
        }
        return null;
      });

      await unknownUserEventManager.syncEvents();

      // Should not call updateUser since all fields were stripped
      expect(mockBaseIterableRequest).not.toHaveBeenCalled();
    });

    it('should process track events and user updates together', async () => {
      const trackEvents = [
        {
          eventName: 'testEvent',
          dataFields: { eventData: 'test' },
          eventType: 'customEvent'
        }
      ];

      const userUpdateData = {
        firstName: 'John',
        lastName: 'Doe',
        eventType: 'userUpdate'
      };

      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
          return JSON.stringify(userUpdateData);
        }
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify(trackEvents);
        }
        return null;
      });

      await unknownUserEventManager.syncEvents();

      // Should call track for the event
      expect(mockBaseIterableRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/events/track'),
          data: expect.objectContaining({
            eventName: 'testEvent',
            dataFields: { eventData: 'test' }
          })
        })
      );

      // Should call updateUser for the user data
      expect(mockBaseIterableRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/users/update'),
          data: expect.objectContaining({
            dataFields: {
              firstName: 'John',
              lastName: 'Doe'
            }
          })
        })
      );
    });

    it('should replay profile events when criteria are met and createUnknownUser is called', async () => {
      const userUpdateData = {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        eventType: 'userUpdate'
      };

      // Mock localStorage to simulate stored user update data
      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
          return JSON.stringify(userUpdateData);
        }
        if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
          return JSON.stringify({
            itbl_unknown_sessions: {
              number_of_sessions: 1,
              first_session: 123456789,
              last_session: 123456789
            }
          });
        }
        if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) {
          return 'true';
        }
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) {
          return '1234567890'; // Mock consent timestamp
        }
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([]);
        }
        return null;
      });

      // Mock window object for the test
      global.window = Object.create({
        location: { hostname: 'test.example.com' },
        navigator: { userAgent: 'test-user-agent' }
      });

      // Mock successful session creation response
      mockBaseIterableRequest.mockResolvedValue({
        status: 200,
        data: { success: true }
      } as any);

      // Call createUnknownUser to simulate criteria being met
      await unknownUserEventManager.createUnknownUser('123');

      // Verify that the session endpoint was called
      expect(mockBaseIterableRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/unknownuser/events/session'),
          data: expect.objectContaining({
            user: expect.objectContaining({
              dataFields: {
                firstName: 'John',
                lastName: 'Doe',
                age: 30
              }
            })
          })
        })
      );

      // Verify that the /users/update endpoint was also called during syncEvents
      expect(mockBaseIterableRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/users/update'),
          data: expect.objectContaining({
            dataFields: {
              firstName: 'John',
              lastName: 'Doe',
              age: 30
            },
            preferUserId: true
          })
        })
      );

      // Verify that the user update data was removed after syncing
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        SHARED_PREFS_USER_UPDATE_OBJECT_KEY
      );
    });
  });
});

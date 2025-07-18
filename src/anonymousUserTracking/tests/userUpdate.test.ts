import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../../request';
import {
  SHARED_PREFS_ANON_SESSIONS,
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_CRITERIA,
  GET_CRITERIA_PATH,
  ENDPOINT_TRACK_ANON_SESSION,
  ENDPOINT_MERGE_USER,
  SHARED_PREF_ANON_USAGE_TRACKED,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY
} from '../../constants';
import { updateUser } from '../../users';
import { initializeWithConfig } from '../../authorization';
import { setupLocalStorageMock } from './testHelpers';
import { CUSTOM_EVENT_API_TEST_CRITERIA } from './constants';

// Test data constants
const TEST_EVENT_DATA = {
  ANIMAL_FOUND_MATCHED: {
    eventName: 'animal-found',
    dataFields: {
      type: 'cat',
      count: 6,
      vaccinated: true
    },
    createNewFields: true,
    eventType: 'customEvent'
  }
};

const TEST_USER_DATA = {
  WHITE_SOFA_FURNITURE: {
    dataFields: {
      furniture: {
        furnitureType: 'Sofa',
        furnitureColor: 'White'
      }
    },
    eventType: 'user'
  }
};

const TEST_ANON_SESSION = {
  INITIAL_SESSION: {
    itbl_anon_sessions: {
      number_of_sessions: 1,
      first_session: 123456789,
      last_session: expect.any(Number)
    }
  }
};

declare global {
  function uuidv4(): string;
  function getEmail(): string;
  function getUserID(): string;
  function setUserID(): string;
}

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('UserUpdate', () => {
  beforeAll(() => {
    setupLocalStorageMock();
    global.window = Object.create({ location: { hostname: 'google.com' } });
    mockRequest.onPost('/events/track').reply(200, {});
    mockRequest.onPost('/users/update').reply(200, {});
    mockRequest.onGet(GET_CRITERIA_PATH).reply(200, {});
    mockRequest.onPost(ENDPOINT_TRACK_ANON_SESSION).reply(200, {});
  });

  beforeEach(() => {
    mockRequest.reset();
    mockRequest.resetHistory();
    mockRequest.onPost('/events/track').reply(200, {});
    mockRequest.onPost('/users/update').reply(200, {});
    mockRequest.onPost(ENDPOINT_MERGE_USER).reply(200, {});
    mockRequest.onGet(GET_CRITERIA_PATH).reply(200, {});
    mockRequest.onPost(ENDPOINT_TRACK_ANON_SESSION).reply(200, {});
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  it('should not have unnecessary extra nesting when locally stored user update fields are sent to server', async () => {
    // Set up localStorage mocks with test data
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([TEST_EVENT_DATA.ANIMAL_FOUND_MATCHED]);
      }
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          ...TEST_USER_DATA.WHITE_SOFA_FURNITURE.dataFields,
          eventType: TEST_USER_DATA.WHITE_SOFA_FURNITURE.eventType
        });
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(CUSTOM_EVENT_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_ANON_SESSIONS) {
        return JSON.stringify(TEST_ANON_SESSION.INITIAL_SESSION);
      }
      if (key === SHARED_PREF_ANON_USAGE_TRACKED) {
        return 'true';
      }
      return null;
    });

    const { logout } = initializeWithConfig({
      authToken: '123',
      configOptions: { enableAnonActivation: true }
    });
    logout(); // logout to remove logged in users before this test

    try {
      await updateUser();
    } catch (e) {
      console.log('');
    }

    expect(localStorage.setItem).toHaveBeenCalledWith(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY,
      expect.any(String)
    );

    const trackEvents = mockRequest.history.post.filter(
      (req) => req.url === '/anonymoususer/events/session'
    );

    expect(trackEvents.length > 0).toBe(true);

    trackEvents.forEach((req) => {
      const requestData = JSON.parse(String(req?.data));

      expect(requestData).toHaveProperty('user');
      expect(requestData.user).toHaveProperty(
        'dataFields',
        TEST_USER_DATA.WHITE_SOFA_FURNITURE.dataFields
      );
      expect(requestData.user.dataFields).toHaveProperty(
        'furniture',
        TEST_USER_DATA.WHITE_SOFA_FURNITURE.dataFields.furniture
      );
    });

    const trackEventsUserUpdate = mockRequest.history.post.filter(
      (req) => req.url === '/users/update'
    );
    expect(trackEventsUserUpdate.length === 0).toBe(true);
  });
});

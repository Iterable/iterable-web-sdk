import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../../request';
import {
  SHARED_PREFS_ANON_SESSIONS,
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_CRITERIA,
  GET_CRITERIA_PATH,
  ENDPOINT_TRACK_ANON_SESSION,
  ENDPOINT_MERGE_USER
} from '../../constants';
import { updateUser } from '../../users';
import { initializeWithConfig } from '../../authorization';
import { CUSTOM_EVENT_API_TEST_CRITERIA } from './constants';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

declare global {
  function uuidv4(): string;
  function getEmail(): string;
  function getUserID(): string;
  function setUserID(): string;
}

const eventDataMatched = {
  eventName: 'animal-found',
  dataFields: {
    type: 'cat',
    count: 6,
    vaccinated: true
  },
  createNewFields: true,
  eventType: 'customEvent'
};

const userDataMatched = {
  dataFields: {
    furniture: {
      furnitureType: 'Sofa',
      furnitureColor: 'White'
    }
  },
  eventType: 'user'
};

const initialAnonSessionInfo = {
  itbl_anon_sessions: {
    number_of_sessions: 1,
    first_session: 123456789,
    last_session: expect.any(Number)
  }
};

const mockRequest = new MockAdapter(baseAxiosRequest);

describe('UserUpdate', () => {
  beforeAll(() => {
    (global as any).localStorage = localStorageMock;
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
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            ...userDataMatched.dataFields,
            eventType: userDataMatched.eventType
          },
          eventDataMatched
        ]);
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(CUSTOM_EVENT_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_ANON_SESSIONS) {
        return JSON.stringify(initialAnonSessionInfo);
      }
      return null;
    });

    const { logout } = initializeWithConfig({
      authToken: '123',
      configOptions: { enableAnonTracking: true }
    });
    logout(); // logout to remove logged in users before this test

    try {
      await updateUser();
    } catch (e) {
      console.log('');
    }
    expect(localStorage.setItem).toHaveBeenCalledWith(
      SHARED_PREFS_EVENT_LIST_KEY,
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
        userDataMatched.dataFields
      );
      expect(requestData.user.dataFields).toHaveProperty(
        'furniture',
        userDataMatched.dataFields.furniture
      );
    });

    const trackEventsUserUpdate = mockRequest.history.post.filter(
      (req) => req.url === '/users/update'
    );
    expect(trackEventsUserUpdate.length === 0).toBe(true);
  });
});

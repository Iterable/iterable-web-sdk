import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../../request';
import {
  SHARED_PREFS_ANON_SESSIONS,
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_CRITERIA,
  ENDPOINT_MERGE_USER,
  ENDPOINT_TRACK_ANON_SESSION,
  GET_CRITERIA_PATH,
  GETMESSAGES_PATH
} from '../../constants';
import { track } from '../../events';
import { initializeWithConfig } from '../../authorization';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';
import { updateUser } from '../../users';
import {
  CUSTOM_EVENT_API_TEST_CRITERIA,
  USER_UPDATE_API_TEST_CRITERIA
} from './constants';

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

// SUCCESS
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

// FAIL
const eventData = {
  eventName: 'animal-found',
  dataFields: {
    type: 'cat',
    count: 6,
    vaccinated: true
  },
  type: 'cat',
  count: 6,
  vaccinated: true,
  createNewFields: true,
  eventType: 'customEvent'
};

// SUCCESS
const userDataMatched = {
  dataFields: {
    furniture: {
      furnitureType: 'Sofa',
      furnitureColor: 'White'
    }
  },
  eventType: 'user'
};

// FAIL
const userData = {
  dataFields: {
    furniture: {
      furnitureType: 'Sofa',
      furnitureColor: 'White'
    }
  },
  furnitureType: 'Sofa',
  furnitureColor: 'White',
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

describe('validateCustomEventUserUpdateAPI', () => {
  beforeAll(() => {
    (global as any).localStorage = localStorageMock;
    global.window = Object.create({ location: { hostname: 'google.com' } });
    mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
      data: 'something'
    });
    mockRequest.onPost('/events/track').reply(200, {});
    mockRequest.onPost('/users/update').reply(200, {});
    mockRequest.onPost(ENDPOINT_MERGE_USER).reply(200, {});
    mockRequest.onGet(GET_CRITERIA_PATH).reply(200, {});
    mockRequest.onPost(ENDPOINT_TRACK_ANON_SESSION).reply(200, {});
  });

  beforeEach(() => {
    mockRequest.reset();
    mockRequest.resetHistory();
    mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
      data: 'something'
    });
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
          }
        ]);
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(USER_UPDATE_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_ANON_SESSIONS) {
        return JSON.stringify(initialAnonSessionInfo);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredCriterias = localStorage.getItem(SHARED_PREFS_CRITERIA);

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );

    const result = checker.getMatchedCriteria(localStoredCriterias!);
    expect(result).toEqual('6');

    const { setUserID, logout } = initializeWithConfig({
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
    await setUserID('testuser123');

    const trackEvents = mockRequest.history.post.filter(
      (req) => req.url === '/users/update'
    );

    expect(trackEvents.length > 0).toBe(true);

    trackEvents.forEach((req) => {
      const requestData = JSON.parse(String(req?.data));

      expect(requestData).toHaveProperty(
        'dataFields',
        userDataMatched.dataFields
      );
      expect(requestData.dataFields).toHaveProperty(
        'furniture',
        userDataMatched.dataFields.furniture
      );
      expect(requestData.dataFields).toHaveProperty(
        'furniture.furnitureType',
        userDataMatched.dataFields.furniture.furnitureType
      );
      expect(requestData.dataFields).toHaveProperty(
        'furniture.furnitureColor',
        userDataMatched.dataFields.furniture.furnitureColor
      );

      expect(requestData).not.toHaveProperty('furniture');
      expect(requestData).not.toHaveProperty('furnitureType');
      expect(requestData).not.toHaveProperty('furnitureColor');
      expect(requestData).not.toHaveProperty('furniture.furnitureType');
      expect(requestData).not.toHaveProperty('furniture.furnitureColor');
    });
  });

  it('should not have unnecessary extra nesting when locally stored user update fields are sent to server - Fail', async () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([
          {
            ...userData,
            ...userData.dataFields,
            eventType: userData.eventType
          }
        ]);
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(USER_UPDATE_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_ANON_SESSIONS) {
        return JSON.stringify(initialAnonSessionInfo);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredCriterias = localStorage.getItem(SHARED_PREFS_CRITERIA);

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );

    const result = checker.getMatchedCriteria(localStoredCriterias!);
    expect(result).toEqual('6');

    const { setUserID, logout } = initializeWithConfig({
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
    await setUserID('testuser123');

    const trackEvents = mockRequest.history.post.filter(
      (req) => req.url === '/users/update'
    );

    expect(trackEvents.length > 0).toBe(true);

    trackEvents.forEach((req) => {
      const requestData = JSON.parse(String(req?.data));

      expect(requestData).toHaveProperty('dataFields');
      expect(requestData.dataFields).toHaveProperty('furniture');
      expect(requestData.dataFields).toHaveProperty('furniture.furnitureType');
      expect(requestData.dataFields).toHaveProperty('furniture.furnitureColor');

      expect(requestData).not.toHaveProperty('furniture');
      expect(requestData).not.toHaveProperty('furniture.furnitureType');
      expect(requestData).not.toHaveProperty('furniture.furnitureColor');
      expect(requestData.dataFields).toHaveProperty('furnitureType');
      expect(requestData.dataFields).toHaveProperty('furnitureColor');
    });
  });

  it('should not have unnecessary extra nesting when locally stored custom event fields are sent to server', async () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([eventDataMatched]);
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(CUSTOM_EVENT_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_ANON_SESSIONS) {
        return JSON.stringify(initialAnonSessionInfo);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredCriterias = localStorage.getItem(SHARED_PREFS_CRITERIA);

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );

    const result = checker.getMatchedCriteria(localStoredCriterias!);

    expect(result).toEqual('6');

    const { setUserID, logout } = initializeWithConfig({
      authToken: '123',
      configOptions: { enableAnonTracking: true }
    });
    logout(); // logout to remove logged in users before this test

    try {
      await track(eventDataMatched);
    } catch (e) {
      console.log('');
    }
    expect(localStorage.setItem).toHaveBeenCalledWith(
      SHARED_PREFS_EVENT_LIST_KEY,
      expect.any(String)
    );
    await setUserID('testuser123');

    const trackEvents = mockRequest.history.post.filter(
      (req) => req.url === '/events/track'
    );

    trackEvents.forEach((req) => {
      const requestData = JSON.parse(String(req?.data));

      expect(requestData).toHaveProperty(
        'eventName',
        eventDataMatched.eventName
      );
      expect(requestData).toHaveProperty(
        'dataFields',
        eventDataMatched.dataFields
      );

      expect(requestData).not.toHaveProperty(eventDataMatched.eventName);
      expect(requestData).not.toHaveProperty('type');
      expect(requestData).not.toHaveProperty('count');
      expect(requestData).not.toHaveProperty('vaccinated');
      expect(requestData).not.toHaveProperty('animal-found.type');
      expect(requestData).not.toHaveProperty('animal-found.count');
      expect(requestData).not.toHaveProperty('animal-found.vaccinated');
    });
  });

  it('should not have unnecessary extra nesting when locally stored custom event fields are sent to server - Fail', async () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([eventData]);
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(CUSTOM_EVENT_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_ANON_SESSIONS) {
        return JSON.stringify(initialAnonSessionInfo);
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredCriterias = localStorage.getItem(SHARED_PREFS_CRITERIA);

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify(localStoredCriterias)
    );
    expect(result).toBeNull();

    const { setUserID, logout } = initializeWithConfig({
      authToken: '123',
      configOptions: { enableAnonTracking: true }
    });
    logout(); // logout to remove logged in users before this test

    try {
      await track(eventData);
    } catch (e) {
      console.log('');
    }
    expect(localStorage.setItem).toHaveBeenCalledWith(
      SHARED_PREFS_EVENT_LIST_KEY,
      expect.any(String)
    );
    await setUserID('testuser123');

    const trackEvents = mockRequest.history.post.filter(
      (req) => req.url === '/events/track'
    );

    trackEvents.forEach((req) => {
      const requestData = JSON.parse(String(req?.data));

      expect(requestData).toHaveProperty('eventName', eventData.eventName);
      expect(requestData).toHaveProperty('dataFields', eventData.dataFields);

      expect(requestData).not.toHaveProperty(eventData.eventName);
      expect(requestData).toHaveProperty('type');
      expect(requestData).toHaveProperty('count');
      expect(requestData).toHaveProperty('vaccinated');
      expect(requestData).not.toHaveProperty('animal-found.type');
      expect(requestData).not.toHaveProperty('animal-found.count');
      expect(requestData).not.toHaveProperty('animal-found.vaccinated');
    });
  });
});

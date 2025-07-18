import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../../request';
import {
  SHARED_PREFS_UNKNOWN_SESSIONS,
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_CRITERIA,
  ENDPOINT_MERGE_USER,
  ENDPOINT_TRACK_UNKNOWN_SESSION,
  GET_CRITERIA_PATH,
  GETMESSAGES_PATH,
  SHARED_PREF_UNKNOWN_USAGE_TRACKED,
  SHARED_PREFS_USER_UPDATE_OBJECT_KEY
} from '../../constants';
import { track } from '../../events';
import { initializeWithConfig } from '../../authorization';
import CriteriaCompletionChecker from '../criteriaCompletionChecker';
import { updateUser } from '../../users';
import { setupLocalStorageMock } from './testHelpers';
import {
  CUSTOM_EVENT_API_TEST_CRITERIA,
  USER_UPDATE_API_TEST_CRITERIA
} from './constants';

// Test data constants
const TEST_EVENT_DATA = {
  // SUCCESS case - properly nested data
  ANIMAL_FOUND_MATCHED: {
    eventName: 'animal-found',
    dataFields: {
      type: 'cat',
      count: 6,
      vaccinated: true
    },
    createNewFields: true,
    eventType: 'customEvent'
  },
  // FAIL case - improperly nested data with extra fields
  ANIMAL_FOUND_UNMATCHED: {
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
  }
};

const TEST_USER_DATA = {
  // SUCCESS case - properly nested furniture data
  FURNITURE_MATCHED: {
    dataFields: {
      furniture: {
        furnitureType: 'Sofa',
        furnitureColor: 'White'
      }
    },
    eventType: 'user'
  },
  // FAIL case - improperly nested with extra fields
  FURNITURE_UNMATCHED: {
    dataFields: {
      furniture: {
        furnitureType: 'Sofa',
        furnitureColor: 'White'
      }
    },
    furnitureType: 'Sofa',
    furnitureColor: 'White',
    eventType: 'user'
  }
};

const TEST_UNKNOWN_SESSION = {
  INITIAL_SESSION: {
    itbl_unknown_sessions: {
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

describe('validateCustomEventUserUpdateAPI', () => {
  beforeAll(() => {
    setupLocalStorageMock();
    global.window = Object.create({ location: { hostname: 'google.com' } });
    mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
      data: 'something'
    });
    mockRequest.onPost('/events/track').reply(200, {});
    mockRequest.onPost('/users/update').reply(200, {});
    mockRequest.onPost(ENDPOINT_MERGE_USER).reply(200, {});
    mockRequest.onGet(GET_CRITERIA_PATH).reply(200, {});
    mockRequest.onPost(ENDPOINT_TRACK_UNKNOWN_SESSION).reply(200, {});
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
    mockRequest.onPost(ENDPOINT_TRACK_UNKNOWN_SESSION).reply(200, {});
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  it('should not have unnecessary extra nesting when locally stored user update fields are sent to server', async () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify(TEST_USER_DATA.FURNITURE_MATCHED);
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(USER_UPDATE_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
        return JSON.stringify(TEST_UNKNOWN_SESSION.INITIAL_SESSION);
      }
      if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) {
        return 'true';
      }
      return null;
    });

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const localStoredCriteriaSets = localStorage.getItem(SHARED_PREFS_CRITERIA);

    const checker = new CriteriaCompletionChecker(
      '',
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );

    const result = checker.getMatchedCriteria(localStoredCriteriaSets!);
    expect(result).toEqual('6');

    const { setUserID, logout } = initializeWithConfig({
      authToken: '123',
      configOptions: { enableUnknownActivation: true }
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
    await setUserID('testuser123');

    const trackEvents = mockRequest.history.post.filter(
      (req) => req.url === '/users/update'
    );

    expect(trackEvents.length > 0).toBe(true);

    trackEvents.forEach((req) => {
      const requestData = JSON.parse(String(req?.data));

      expect(requestData).toHaveProperty(
        'dataFields',
        TEST_USER_DATA.FURNITURE_MATCHED.dataFields
      );
      expect(requestData.dataFields).toHaveProperty(
        'furniture',
        TEST_USER_DATA.FURNITURE_MATCHED.dataFields.furniture
      );
      expect(requestData.dataFields).toHaveProperty(
        'furniture.furnitureType',
        TEST_USER_DATA.FURNITURE_MATCHED.dataFields.furniture.furnitureType
      );
      expect(requestData.dataFields).toHaveProperty(
        'furniture.furnitureColor',
        TEST_USER_DATA.FURNITURE_MATCHED.dataFields.furniture.furnitureColor
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
      if (key === SHARED_PREFS_USER_UPDATE_OBJECT_KEY) {
        return JSON.stringify({
          ...TEST_USER_DATA.FURNITURE_UNMATCHED,
          ...TEST_USER_DATA.FURNITURE_UNMATCHED.dataFields,
          eventType: TEST_USER_DATA.FURNITURE_UNMATCHED.eventType
        });
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(USER_UPDATE_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
        return JSON.stringify(TEST_UNKNOWN_SESSION.INITIAL_SESSION);
      }
      if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) {
        return 'true';
      }
      return null;
    });

    const localStoredUserUpdate = localStorage.getItem(
      SHARED_PREFS_USER_UPDATE_OBJECT_KEY
    );

    const localStoredCriteriaSets = localStorage.getItem(SHARED_PREFS_CRITERIA);

    const checker = new CriteriaCompletionChecker(
      '',
      localStoredUserUpdate === null ? '' : localStoredUserUpdate
    );

    const result = checker.getMatchedCriteria(localStoredCriteriaSets!);
    expect(result).toEqual('6');

    const { setUserID, logout } = initializeWithConfig({
      authToken: '123',
      configOptions: { enableUnknownActivation: true }
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

      expect(requestData).toHaveProperty('furniture');
      expect(requestData).toHaveProperty('furniture.furnitureType');
      expect(requestData).toHaveProperty('furniture.furnitureColor');
      expect(requestData).toHaveProperty('furnitureType');
      expect(requestData).toHaveProperty('furnitureColor');
    });
  });

  it('should not have unnecessary extra nesting when locally stored custom event fields are sent to server', async () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([TEST_EVENT_DATA.ANIMAL_FOUND_MATCHED]);
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(CUSTOM_EVENT_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
        return JSON.stringify(TEST_UNKNOWN_SESSION.INITIAL_SESSION);
      }
      if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) {
        return 'true';
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredCriteriaSets = localStorage.getItem(SHARED_PREFS_CRITERIA);

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );

    const result = checker.getMatchedCriteria(localStoredCriteriaSets!);

    expect(result).toEqual('6');

    const { setUserID, logout } = initializeWithConfig({
      authToken: '123',
      configOptions: { enableUnknownActivation: true }
    });
    logout(); // logout to remove logged in users before this test

    try {
      await track(TEST_EVENT_DATA.ANIMAL_FOUND_MATCHED);
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
        TEST_EVENT_DATA.ANIMAL_FOUND_MATCHED.eventName
      );
      expect(requestData).toHaveProperty(
        'dataFields',
        TEST_EVENT_DATA.ANIMAL_FOUND_MATCHED.dataFields
      );

      expect(requestData).not.toHaveProperty(
        TEST_EVENT_DATA.ANIMAL_FOUND_MATCHED.eventName
      );
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
        return JSON.stringify([TEST_EVENT_DATA.ANIMAL_FOUND_UNMATCHED]);
      }
      if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(CUSTOM_EVENT_API_TEST_CRITERIA);
      }
      if (key === SHARED_PREFS_UNKNOWN_SESSIONS) {
        return JSON.stringify(TEST_UNKNOWN_SESSION.INITIAL_SESSION);
      }
      if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) {
        return 'true';
      }
      return null;
    });

    const localStoredEventList = localStorage.getItem(
      SHARED_PREFS_EVENT_LIST_KEY
    );

    const localStoredCriteriaSets = localStorage.getItem(SHARED_PREFS_CRITERIA);

    const checker = new CriteriaCompletionChecker(
      localStoredEventList === null ? '' : localStoredEventList
    );
    const result = checker.getMatchedCriteria(
      JSON.stringify(localStoredCriteriaSets)
    );
    expect(result).toBeNull();

    const { setUserID, logout } = initializeWithConfig({
      authToken: '123',
      configOptions: { enableUnknownActivation: true }
    });
    logout(); // logout to remove logged in users before this test

    try {
      await track(TEST_EVENT_DATA.ANIMAL_FOUND_UNMATCHED);
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
        TEST_EVENT_DATA.ANIMAL_FOUND_UNMATCHED.eventName
      );
      expect(requestData).toHaveProperty(
        'dataFields',
        TEST_EVENT_DATA.ANIMAL_FOUND_UNMATCHED.dataFields
      );

      expect(requestData).not.toHaveProperty(
        TEST_EVENT_DATA.ANIMAL_FOUND_UNMATCHED.eventName
      );
      expect(requestData).toHaveProperty('type');
      expect(requestData).toHaveProperty('count');
      expect(requestData).toHaveProperty('vaccinated');
      expect(requestData).not.toHaveProperty('animal-found.type');
      expect(requestData).not.toHaveProperty('animal-found.count');
      expect(requestData).not.toHaveProperty('animal-found.vaccinated');
    });
  });
});

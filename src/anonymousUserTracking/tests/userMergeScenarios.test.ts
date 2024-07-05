import MockAdapter from 'axios-mock-adapter';
import { initializeWithConfig } from '../../authorization';
import {
  SHARED_PREFS_EVENT_LIST_KEY,
  SHARED_PREFS_CRITERIA,
  GETMESSAGES_PATH,
  ENDPOINT_TRACK_ANON_SESSION,
  GET_CRITERIA_PATH,
  SHARED_PREFS_ANON_SESSIONS,
  ENDPOINT_MERGE_USER,
  SHARED_PREF_ANON_USER_ID
} from '../../constants';
import { track } from '../../events';
import { getInAppMessages } from '../../inapp';
import { baseAxiosRequest } from '../../request';
jest.setTimeout(20000); // Set the timeout to 10 seconds

const mockCriteria = {
  count: 1,
  criterias: [
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
                dataType: 'customEvent',
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
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

const eventData = {
  eventName: 'testEvent123',
  dataFields: undefined,
  createNewFields: true,
  eventType: 'customEvent'
};

const eventDataMatched = {
  eventName: 'testEvent',
  dataFields: undefined,
  createNewFields: true,
  eventType: 'customEvent'
};

const initialAnonSessionInfo = {
  itbl_anon_sessions: {
    number_of_sessions: 1,
    first_session: 123456789,
    last_session: expect.any(Number)
  }
};

declare global {
  function uuidv4(): string;
  function getEmail(): string;
  function getUserID(): string;
  function setUserID(): string;
}
const mockRequest = new MockAdapter(baseAxiosRequest);
//const mockOnPostSpy = jest.spyOn(mockRequest, 'onPost');

describe('UserMergeScenariosTests', () => {
  beforeAll(() => {
    (global as any).localStorage = localStorageMock;
    global.window = Object.create({ location: { hostname: 'google.com' } });
    mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
      data: 'something'
    });
    mockRequest.onPost('/events/track').reply(200, {});
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
    mockRequest.onPost(ENDPOINT_MERGE_USER).reply(200, {});
    mockRequest.onGet(GET_CRITERIA_PATH).reply(200, {});
    mockRequest.onPost(ENDPOINT_TRACK_ANON_SESSION).reply(200, {});
    jest.resetAllMocks();
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREFS_EVENT_LIST_KEY) {
        return JSON.stringify([eventData]);
      } else if (key === SHARED_PREFS_CRITERIA) {
        return JSON.stringify(mockCriteria);
      } else if (key === SHARED_PREFS_ANON_SESSIONS) {
        return JSON.stringify(initialAnonSessionInfo);
      }
      return null;
    });
    jest.useFakeTimers();
  });

  describe('UserMergeScenariosTests with setUserID', () => {
    it('criteria not met with merge false with setUserId', async () => {
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent123' });
      } catch (e) {
        console.log('');
      }
      expect(localStorage.setItem).toHaveBeenCalledWith(
        SHARED_PREFS_EVENT_LIST_KEY,
        expect.any(String)
      );
      await setUserID('testuser123', false);
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.userId).toBe('testuser123');
      const removeItemCalls = localStorageMock.removeItem.mock.calls.filter(
        (call) => call[0] === SHARED_PREFS_EVENT_LIST_KEY
      );
      // count 1 means it did not remove item and so syncEvents was NOT called
      // because removeItem gets called one time for the key in case of logout
      expect(removeItemCalls.length).toBe(1);
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });

    it('criteria not met with merge true with setUserId', async () => {
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ ...eventData });
      } catch (e) {
        console.log('');
      }
      expect(localStorage.setItem).toHaveBeenCalledWith(
        SHARED_PREFS_EVENT_LIST_KEY,
        expect.any(String)
      );
      await setUserID('testuser123', true);
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.userId).toBe('testuser123');
      const removeItemCalls = localStorageMock.removeItem.mock.calls.filter(
        (call) => call[0] === SHARED_PREFS_EVENT_LIST_KEY
      );
      // count 2 means it removed items and so syncEvents was called
      // because removeItem gets called one time for the key in case of logout and 2nd time on syncevents
      expect(removeItemCalls.length).toBe(2);
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });

    it('criteria not met with merge default value with setUserId', async () => {
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent123' });
      } catch (e) {
        console.log('');
      }
      expect(localStorage.setItem).toHaveBeenCalledWith(
        SHARED_PREFS_EVENT_LIST_KEY,
        expect.any(String)
      );
      await setUserID('testuser123');
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.userId).toBe('testuser123');
      const removeItemCalls = localStorageMock.removeItem.mock.calls.filter(
        (call) => call[0] === SHARED_PREFS_EVENT_LIST_KEY
      );
      // count 2 means it removed items and so syncEvents was called
      // because removeItem gets called one time for the key in case of logout and 2nd time on syncevents
      expect(removeItemCalls.length).toBe(2);
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });

    it('criteria is met with merge false with setUserId', async () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([eventDataMatched]);
        } else if (key === SHARED_PREFS_CRITERIA) {
          return JSON.stringify(mockCriteria);
        } else if (key === SHARED_PREFS_ANON_SESSIONS) {
          return JSON.stringify(initialAnonSessionInfo);
        }
        return null;
      });
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('');
      }
      await setUserID('testuser123', false);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.userId).toBe('testuser123');
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });

    it('criteria is met with merge true with setUserId', async () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([eventDataMatched]);
        } else if (key === SHARED_PREFS_CRITERIA) {
          return JSON.stringify(mockCriteria);
        } else if (key === SHARED_PREFS_ANON_SESSIONS) {
          return JSON.stringify(initialAnonSessionInfo);
        }
        return null;
      });
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('', e);
      }
      // this function call is needed for putting some delay before executing setUserId
      await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      await setUserID('testuser123', true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      jest.useFakeTimers();
      setTimeout(() => {
        const mergePostRequestData = mockRequest.history.post.find(
          (req) => req.url === ENDPOINT_MERGE_USER
        );
        expect(mergePostRequestData).toBeDefined(); // ensure that merge API gets called
      }, 1000);
      jest.runAllTimers();
    });

    it('criteria is met with merge default with setUserId', async () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([eventDataMatched]);
        } else if (key === SHARED_PREFS_CRITERIA) {
          return JSON.stringify(mockCriteria);
        } else if (key === SHARED_PREFS_ANON_SESSIONS) {
          return JSON.stringify(initialAnonSessionInfo);
        } else if (key === SHARED_PREF_ANON_USER_ID) {
          return '123e4567-e89b-12d3-a456-426614174000';
        }
        return null;
      });
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('', e);
      }
      await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      await setUserID('testuser123');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      jest.useFakeTimers();
      setTimeout(() => {
        const mergePostRequestData = mockRequest.history.post.find(
          (req) => req.url === ENDPOINT_MERGE_USER
        );
        expect(mergePostRequestData).toBeDefined(); // ensure that merge API gets called
      }, 1000);
      jest.runAllTimers();
    });

    it('current user identified with setUserId merge false', async () => {
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      await setUserID('testuser123');
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.userId).toBe('testuser123');
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('', e);
      }
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      await setUserID('testuseranotheruser', false);
      const secondResponse = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(secondResponse.config.params.userId).toBe('testuseranotheruser');
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });
    it('current user identified with setUserId merge true', async () => {
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      await setUserID('testuser123');
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.userId).toBe('testuser123');
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      await setUserID('testuseranotheruser', true);
      const secondResponse = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(secondResponse.config.params.userId).toBe('testuseranotheruser');
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeDefined(); // ensure that merge API gets called
    });
    it('current user identified with setUserId merge default', async () => {
      const { setUserID, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      await setUserID('testuser123');
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.userId).toBe('testuser123');
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      await setUserID('testuseranotheruser');
      const secondResponse = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(secondResponse.config.params.userId).toBe('testuseranotheruser');
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });
  });

  describe('UserMergeScenariosTests with setEmail', () => {
    it('criteria not met with merge false with setEmail', async () => {
      const { setEmail, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent123' });
      } catch (e) {
        console.log('');
      }
      expect(localStorage.setItem).toHaveBeenCalledWith(
        SHARED_PREFS_EVENT_LIST_KEY,
        expect.any(String)
      );
      await setEmail('testuser123@test.com', false);
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.email).toBe('testuser123@test.com');
      const removeItemCalls = localStorageMock.removeItem.mock.calls.filter(
        (call) => call[0] === SHARED_PREFS_EVENT_LIST_KEY
      );
      // count 1 means it did not remove item and so syncEvents was NOT called
      // because removeItem gets called one time for the key in case of logout
      expect(removeItemCalls.length).toBe(1);
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });

    it('criteria not met with merge true with setEmail', async () => {
      const { setEmail, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ ...eventData });
      } catch (e) {
        console.log('');
      }
      expect(localStorage.setItem).toHaveBeenCalledWith(
        SHARED_PREFS_EVENT_LIST_KEY,
        expect.any(String)
      );
      await setEmail('testuser123@test.com', true);
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.email).toBe('testuser123@test.com');
      const removeItemCalls = localStorageMock.removeItem.mock.calls.filter(
        (call) => call[0] === SHARED_PREFS_EVENT_LIST_KEY
      );
      // count 2 means it removed items and so syncEvents was called
      // because removeItem gets called one time for the key in case of logout and 2nd time on syncevents
      expect(removeItemCalls.length).toBe(2);
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });

    it('criteria not met with merge default value with setEmail', async () => {
      const { setEmail, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent123' });
      } catch (e) {
        console.log('');
      }
      expect(localStorage.setItem).toHaveBeenCalledWith(
        SHARED_PREFS_EVENT_LIST_KEY,
        expect.any(String)
      );
      await setEmail('testuser123@test.com');
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.email).toBe('testuser123@test.com');
      const removeItemCalls = localStorageMock.removeItem.mock.calls.filter(
        (call) => call[0] === SHARED_PREFS_EVENT_LIST_KEY
      );
      // count 2 means it removed items and so syncEvents was called
      // because removeItem gets called one time for the key in case of logout and 2nd time on syncevents
      expect(removeItemCalls.length).toBe(2);
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });

    it('criteria is met with merge true with setEmail', async () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([eventDataMatched]);
        } else if (key === SHARED_PREFS_CRITERIA) {
          return JSON.stringify(mockCriteria);
        } else if (key === SHARED_PREFS_ANON_SESSIONS) {
          return JSON.stringify(initialAnonSessionInfo);
        }
        return null;
      });
      const { setEmail, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('', e);
      }
      await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      await setEmail('testuser123@test.com', true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      jest.useFakeTimers();
      setTimeout(() => {
        const mergePostRequestData = mockRequest.history.post.find(
          (req) => req.url === ENDPOINT_MERGE_USER
        );
        expect(mergePostRequestData).toBeDefined(); // ensure that merge API gets called
      }, 1500);
      jest.runAllTimers();
    });

    it('criteria is met with merge default with setEmail', async () => {
      (localStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === SHARED_PREFS_EVENT_LIST_KEY) {
          return JSON.stringify([eventDataMatched]);
        } else if (key === SHARED_PREFS_CRITERIA) {
          return JSON.stringify(mockCriteria);
        } else if (key === SHARED_PREFS_ANON_SESSIONS) {
          return JSON.stringify(initialAnonSessionInfo);
        } else if (key === SHARED_PREF_ANON_USER_ID) {
          return '123e4567-e89b-12d3-a456-426614174000';
        }
        return null;
      });
      const { setEmail, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('', e);
      }
      await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      await setEmail('testuser123@test.com');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      jest.useFakeTimers();
      setTimeout(() => {
        const mergePostRequestData = mockRequest.history.post.find(
          (req) => req.url === ENDPOINT_MERGE_USER
        );
        expect(mergePostRequestData).toBeDefined(); // ensure that merge API gets called
      }, 1500);
      jest.runAllTimers();
    });

    it('current user identified with setEmail with merge false', async () => {
      const { setEmail, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      await setEmail('testuser123@test.com');
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.email).toBe('testuser123@test.com');
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('', e);
      }
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      await setEmail('testuseranotheruser@test.com', false);
      const secondResponse = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(secondResponse.config.params.email).toBe(
        'testuseranotheruser@test.com'
      );
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });

    it('current user identified with setEmail merge true', async () => {
      const { setEmail, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      await setEmail('testuser123@test.com');
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.email).toBe('testuser123@test.com');
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('', e);
      }
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      await setEmail('testuseranotheruser@test.com', true);
      const secondResponse = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(secondResponse.config.params.email).toBe(
        'testuseranotheruser@test.com'
      );
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeDefined(); // ensure that merge API gets called
    });

    it('current user identified with setEmail merge default', async () => {
      const { setEmail, logout } = initializeWithConfig({
        authToken: '123',
        configOptions: { enableAnonTracking: true }
      });
      logout(); // logout to remove logged in users before this test
      await setEmail('testuser123@test.com');
      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.email).toBe('testuser123@test.com');
      try {
        await track({ eventName: 'testEvent' });
      } catch (e) {
        console.log('', e);
      }
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        SHARED_PREF_ANON_USER_ID
      );
      await setEmail('testuseranotheruser@test.com');
      const secondResponse = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(secondResponse.config.params.email).toBe(
        'testuseranotheruser@test.com'
      );
      const mergePostRequestData = mockRequest.history.post.find(
        (req) => req.url === ENDPOINT_MERGE_USER
      );
      expect(mergePostRequestData).toBeUndefined(); // ensure that merge API Do NOT get called
    });
  });
});

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { initialize } from './authorization';
import { baseAxiosRequest } from '../request';
import { getInAppMessages } from '../inapp';
import { track, trackInAppClose } from '../events';
import { updateSubscriptions, updateUser, updateUserEmail } from '../users';
import { trackPurchase, updateCart } from '../commerce';
import { GETMESSAGES_PATH } from '../constants';

let mockRequest: any = null;

const localStorageMock = {
  setItem: jest.fn()
};

/*
  decoded payload is:

  {
    "exp": 1630615182,
    "iat": 1630614882,
    "email": "width.tester@gmail.com"
  }
*/
const MOCK_JWT_KEY =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzA2MTc3MzQsImlhdCI6MTYzMDYxNzQzNCwiZW1haWwiOiJ3aWR0aC50ZXN0ZXJAZ21haWwuY29tIn0.knLmbgO8kKM9CHP2TH2v85OSC2Jorh2JjRm76FFsPQc';
const MOCK_JWT_KEY_WITH_ONE_MINUTE_EXPIRY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE2Nzk0ODMyOTEsImlhdCI6MTY3OTQ4MzIzMX0.APaQAYy-lTE0o8rbR6b6-28eCICq36SQMBXmeZAvk1k';
describe('API Key Interceptors', () => {
  beforeAll(() => {
    mockRequest = new MockAdapter(baseAxiosRequest);
    mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
      data: 'something'
    });

    jest.useFakeTimers();
  });

  beforeEach(() => {
    mockRequest.onPost('/users/update').reply(200, {
      data: 'something'
    });
    /* clear any interceptors already configured */
    [
      ...Array(
        mockRequest.axiosInstance.interceptors.request.handlers.length
      ).keys()
    ].forEach((e, index) => {
      baseAxiosRequest.interceptors.request.eject(index);
    });
    [
      ...Array(
        mockRequest.axiosInstance.interceptors.response.handlers.length
      ).keys()
    ].forEach((e, index) => {
      baseAxiosRequest.interceptors.response.eject(index);
    });
  });

  describe('non-JWT auth', () => {
    it('should add Api-Key header to all outgoing requests', async () => {
      initialize('123');

      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.headers['Api-Key']).toBe('123');
    });

    it('should add Api-Key header to all outgoing requests with new token', async () => {
      const { setNewAuthToken } = initialize('123');
      setNewAuthToken('333');

      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.headers['Api-Key']).toBe('333');
    });

    it('should not add Api-Key header to all outgoing requests after cleared', async () => {
      const { clearAuthToken } = initialize('123');
      clearAuthToken();

      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.headers['Api-Key']).toBeUndefined();
    });
  });

  describe('JWT auth', () => {
    it('should add Api-Key and Authorization headers to outgoing requests when setEmail is invoked', async () => {
      const { setEmail } = initialize('123', () =>
        Promise.resolve(MOCK_JWT_KEY)
      );
      (global as any).localStorage = localStorageMock;
      await setEmail('hello@gmail.com');

      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.headers['Api-Key']).toBe('123');
      expect(response.config.headers['Authorization']).toBe(
        `Bearer ${MOCK_JWT_KEY}`
      );
    });

    it('should add Api-Key and Authorization headers to outgoing requests when setUserId is invoked', async () => {
      const { setUserID } = initialize('123', () =>
        Promise.resolve(MOCK_JWT_KEY)
      );
      (global as any).localStorage = localStorageMock;
      await setUserID('123ffdas');

      const response = await getInAppMessages({
        count: 10,
        packageName: 'my-lil-website'
      });
      expect(response.config.headers['Api-Key']).toBe('123');
      expect(response.config.headers['Authorization']).toBe(
        `Bearer ${MOCK_JWT_KEY}`
      );
    });

    it('should request a new JWT after 1 minute before exp time', async () => {
      /* 5 minutes before the JWT expires */
      Date.now = jest.fn(() => 1630617433001);
      /* this JWT expires in 5 minutes */
      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
      const { setEmail } = initialize('123', mockGenerateJWT);
      await setEmail('hello@gmail.com');

      expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(60000 * 4.1);
      expect(mockGenerateJWT).toHaveBeenCalledTimes(2);
    });

    it('should not request a new JWT if refreshing is turned off', async () => {
      /* 5 minutes before the JWT expires */
      Date.now = jest.fn(() => 1630617433001);
      /* this JWT expires in 5 minutes */
      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
      const { setEmail, clearRefresh } = initialize('123', mockGenerateJWT);
      await setEmail('hello@gmail.com');
      clearRefresh();

      expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(60000 * 4.1);
      expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
    });

    it('should not request a new JWT if the first request failed', async () => {
      /* 5 minutes before the JWT expires */
      Date.now = jest.fn(() => 1630617433001);
      /* this JWT expires in 5 minutes */
      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.reject(MOCK_JWT_KEY));
      const { setEmail } = initialize('123', mockGenerateJWT);

      try {
        await setEmail('hello@gmail.com');
      } catch {
        expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(60000 * 4.1);
        expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
      }
    });

    it('should try to generate JWT again if 401 response comes in', async () => {
      const mockBaseAdapter = new MockAdapter(axios);
      mockBaseAdapter.onPost('/users/update').reply(400, {
        code: 'Something'
      });
      mockRequest.onPost('/users/update').reply(401, {
        code: 'BadAPIKey'
      });

      const mockGenerateJW = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
      const { setEmail } = initialize('123', mockGenerateJW);

      try {
        await setEmail('hello@gmail.com');
        await updateUser();
      } catch (e) {
        expect(mockGenerateJW).toHaveBeenCalledTimes(2);
      }
    });

    it('should try to generate JWT again if updateEmail is called', async () => {
      mockRequest.onPost('/users/updateEmail').reply(200, {
        code: 'hello'
      });

      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
      const { setEmail } = initialize('123', mockGenerateJWT);

      await setEmail('hello@gmail.com');
      await updateUserEmail('helloworld@gmail.com');
      expect(mockGenerateJWT).toHaveBeenCalledTimes(2);
    });

    it('should generate JWT 1 minute before expiry with new email if updateEmail is called', async () => {
      mockRequest.onPost('/users/updateEmail').reply(200, {
        code: 'hello'
      });

      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
      const { setEmail } = initialize('123', mockGenerateJWT);

      await setEmail('hello@gmail.com');
      await updateUserEmail('helloworld@gmail.com');

      jest.advanceTimersByTime(60000 * 4.1);
      /* 
        called once originally, a second time after the email was changed, 
        and a third after the JWT was about to expire
      */
      expect(mockGenerateJWT).toHaveBeenCalledTimes(3);
      expect(mockGenerateJWT).lastCalledWith({
        email: 'helloworld@gmail.com'
      });
    });

    it('should make new API requests with new email after updateEmail is called', async () => {
      mockRequest.onPost('/users/updateEmail').reply(200, {
        code: 'hello'
      });

      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
      const { setEmail } = initialize('123', mockGenerateJWT);

      await setEmail('hello@gmail.com');
      await updateUserEmail('helloworld@gmail.com');

      const response = await getInAppMessages({
        count: 20,
        packageName: 'my-lil-website'
      });
      expect(response.config.params.email).toBe('helloworld@gmail.com');
    });

    it('should try to generate JWT again with user ID if updateEmail is called after setUserID', async () => {
      mockRequest.onPost('/users/updateEmail').reply(200, {
        code: 'hello'
      });

      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
      const { setUserID } = initialize('123', mockGenerateJWT);
      (global as any).localStorage = localStorageMock;
      await setUserID('mock-id');
      await updateUserEmail('helloworld@gmail.com');
      expect(mockGenerateJWT).toHaveBeenCalledTimes(2);
      expect(mockGenerateJWT).toHaveBeenCalledWith({ userID: 'mock-id' });
      expect(mockGenerateJWT).not.toHaveBeenCalledWith({
        email: 'helloworld@gmail.com'
      });

      jest.advanceTimersByTime(60000 * 4.1);
      /* 
        called once originally, a second time after the email was changed, 
        and a third after the JWT was about to expire
      */
      expect(mockGenerateJWT).toHaveBeenCalledTimes(3);
      expect(mockGenerateJWT).lastCalledWith({
        userID: 'mock-id'
      });
    });

    it('should try to generate JWT again with email if updateEmail is called after setEmail', async () => {
      mockRequest.onPost('/users/updateEmail').reply(200, {
        code: 'hello'
      });

      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
      const { setEmail } = initialize('123', mockGenerateJWT);

      await setEmail('first@gmail.com');
      await updateUserEmail('second@gmail.com');
      expect(mockGenerateJWT).toHaveBeenCalledTimes(2);
      expect(mockGenerateJWT).toHaveBeenCalledWith({
        email: 'first@gmail.com'
      });
      expect(mockGenerateJWT).toHaveBeenCalledWith({
        email: 'second@gmail.com'
      });
      expect(mockGenerateJWT).not.toHaveBeenCalledWith({
        userID: 'mock-id'
      });

      jest.advanceTimersByTime(60000 * 4.1);
      /* 
        called once originally, a second time after the email was changed, 
        and a third after the JWT was about to expire
      */
      expect(mockGenerateJWT).toHaveBeenCalledTimes(3);
      expect(mockGenerateJWT).lastCalledWith({
        email: 'second@gmail.com'
      });
    });
    it('should not request a new JWT if expiry time is less then a minute', async () => {
      /* 5 minutes before the JWT expires */
      Date.now = jest.fn(() => 1630617433001);
      /* this JWT expires in 5 minutes */
      const mockGenerateJWT = jest
        .fn()
        .mockReturnValue(Promise.resolve(MOCK_JWT_KEY_WITH_ONE_MINUTE_EXPIRY));
      const { setEmail } = initialize('123', mockGenerateJWT);
      await setEmail('hello@gmail.com');
      // clearRefresh();

      expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(60000 * 2);
      expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
    });
  });
});

describe('User Identification', () => {
  beforeEach(() => {
    /* clear any interceptors already configured */
    [
      ...Array(
        mockRequest.axiosInstance.interceptors.request.handlers.length
      ).keys()
    ].forEach((e, index) => {
      baseAxiosRequest.interceptors.request.eject(index);
    });
  });

  describe('non-JWT auth', () => {
    beforeAll(() => {
      mockRequest = new MockAdapter(baseAxiosRequest);

      mockRequest.onPost('/users/update').reply(200, {});

      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        data: 'something'
      });
    });

    describe('logout', () => {
      it('logout method removes the email field from requests', async () => {
        const { logout, setEmail } = initialize('123');
        setEmail('hello@gmail.com');
        logout();

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.email).toBeUndefined();
      });

      it('logout method removes the userId field from requests', async () => {
        (global as any).localStorage = localStorageMock;
        const { logout, setUserID } = initialize('123');
        await setUserID('hello@gmail.com');
        logout();

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBeUndefined();
      });
    });

    describe('setEmail', () => {
      it('adds email param to endpoint that need an email as a param', async () => {
        const { setEmail } = initialize('123');
        setEmail('hello@gmail.com');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });

        expect(response.config.params.email).toBe('hello@gmail.com');
      });

      it('clears any previous interceptors if called twice', async () => {
        const spy = jest.spyOn(baseAxiosRequest.interceptors.request, 'eject');
        const { setEmail } = initialize('123');
        setEmail('hello@gmail.com');
        setEmail('new@gmail.com');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.email).toBe('new@gmail.com');
        expect(
          mockRequest.axiosInstance.interceptors.request.handlers.filter(
            (e: any) => e
          ).length
        ).toBe(2);
        expect(spy).toHaveBeenCalledWith(expect.any(Number));
      });

      it('adds email body to endpoint that need an email as a body', async () => {
        const { setEmail } = initialize('123');
        setEmail('hello@gmail.com');

        mockRequest.onPost('/events/trackInAppClose').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/users/updateSubscriptions').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/users/update').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/events/track').reply(200, {
          data: 'something'
        });

        const closeResponse = await trackInAppClose({
          messageId: '123',
          deviceInfo: { appPackageName: 'my-lil-website' }
        });
        const subsResponse = await updateSubscriptions();
        const userResponse = await updateUser();
        const trackResponse = await track({ eventName: 'fdsafdf' });

        expect(JSON.parse(closeResponse.config.data).email).toBe(
          'hello@gmail.com'
        );
        expect(JSON.parse(subsResponse.config.data).email).toBe(
          'hello@gmail.com'
        );
        expect(JSON.parse(userResponse.config.data).email).toBe(
          'hello@gmail.com'
        );
        expect(JSON.parse(trackResponse.config.data).email).toBe(
          'hello@gmail.com'
        );
      });

      it('adds currentEmail body to endpoint that need an currentEmail as a body', async () => {
        const { setEmail } = initialize('123');
        setEmail('hello@gmail.com');

        mockRequest.onPost('/users/updateEmail').reply(200, {
          data: 'something'
        });

        const response = await updateUserEmail('hello@gmail.com');

        expect(JSON.parse(response.config.data).currentEmail).toBe(
          'hello@gmail.com'
        );
      });

      it('should add user.email param to endpoints that need it', async () => {
        const { setEmail } = initialize('123');
        setEmail('hello@gmail.com');

        mockRequest.onPost('/commerce/updateCart').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/commerce/trackPurchase').reply(200, {
          data: 'something'
        });

        const cartResponse = await updateCart({ items: [] });
        const trackResponse = await trackPurchase({ items: [], total: 100 });
        expect(JSON.parse(cartResponse.config.data).user.email).toBe(
          'hello@gmail.com'
        );
        expect(JSON.parse(trackResponse.config.data).user.email).toBe(
          'hello@gmail.com'
        );
      });

      it('adds no email body or header information to unrelated endpoints', async () => {
        const { setEmail } = initialize('123');
        setEmail('hello@gmail.com');

        mockRequest.onPost('/users/hello').reply(200, {
          data: 'something'
        });

        const response = await baseAxiosRequest({
          method: 'POST',
          url: '/users/hello',
          data: {
            hello: 'world'
          },
          params: {}
        });
        expect(JSON.parse(response.config.data).currentEmail).toBeUndefined();
        expect(JSON.parse(response.config.data).email).toBeUndefined();
        expect(response.config.params.email).toBeUndefined();
      });

      it('should overwrite user ID set by setUserID', async () => {
        const { setEmail, setUserID } = initialize('123');
        await setUserID('999');
        setEmail('hello@gmail.com');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBeUndefined();
        expect(response.config.params.email).toBe('hello@gmail.com');
      });
    });

    describe('setUserID', () => {
      beforeEach(() => {
        mockRequest.resetHistory();
      });
      it('adds userId param to endpoint that need an userId as a param', async () => {
        const { setUserID } = initialize('123');
        await setUserID('999');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBe('999');
      });

      it('clears any previous interceptors if called twice', async () => {
        const spy = jest.spyOn(baseAxiosRequest.interceptors.request, 'eject');
        const { setUserID } = initialize('123');
        await setUserID('999');
        await setUserID('111');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBe('111');
        expect(
          mockRequest.axiosInstance.interceptors.request.handlers.filter(
            (e: any) => e
          ).length
        ).toBe(2);
        expect(spy).toHaveBeenCalledWith(expect.any(Number));
      });

      it('adds userId param to endpoint that need an userId as a param', async () => {
        const { setUserID } = initialize('123');
        await setUserID('999');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBe('999');
      });

      it('adds userId body to endpoint that need an userId as a body', async () => {
        const { setUserID } = initialize('123');
        await setUserID('999');

        mockRequest.onPost('/events/trackInAppClose').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/users/updateSubscriptions').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/users/update').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/events/track').reply(200, {
          data: 'something'
        });

        const closeResponse = await trackInAppClose({
          messageId: '123',
          deviceInfo: { appPackageName: 'my-lil-website' }
        });
        const subsResponse = await updateSubscriptions();
        const userResponse = await updateUser();
        const trackResponse = await track({ eventName: 'fdsafdf' });

        expect(JSON.parse(closeResponse.config.data).userId).toBe('999');
        expect(JSON.parse(subsResponse.config.data).userId).toBe('999');
        expect(JSON.parse(userResponse.config.data).userId).toBe('999');
        expect(JSON.parse(trackResponse.config.data).userId).toBe('999');
      });

      it('adds currentUserId body to endpoint that need an currentUserId as a body', async () => {
        const { setUserID } = initialize('123');
        await setUserID('999');

        mockRequest.onPost('/users/updateEmail').reply(200, {
          data: 'something'
        });

        const response = await updateUserEmail('hello@gmail.com');
        expect(JSON.parse(response.config.data).currentUserId).toBe('999');
      });

      it('should add user.userId param to endpoints that need it', async () => {
        const { setUserID } = initialize('123');
        await setUserID('999');

        mockRequest.onPost('/commerce/updateCart').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/commerce/trackPurchase').reply(200, {
          data: 'something'
        });

        const cartResponse = await updateCart({ items: [] });
        const trackResponse = await trackPurchase({ items: [], total: 100 });
        expect(JSON.parse(cartResponse.config.data).user.userId).toBe('999');
        expect(JSON.parse(trackResponse.config.data).user.userId).toBe('999');
      });

      it('adds no userId body or header information to unrelated endpoints', async () => {
        const { setUserID } = initialize('123');
        await setUserID('999');

        mockRequest.onPost('/users/hello').reply(200, {
          data: 'something'
        });

        const response = await baseAxiosRequest({
          method: 'POST',
          url: '/users/hello',
          data: {
            hello: 'world'
          },
          params: {}
        });
        expect(JSON.parse(response.config.data).currentUserId).toBeUndefined();
        expect(JSON.parse(response.config.data).userId).toBeUndefined();
        expect(response.config.params.userId).toBeUndefined();
      });

      it('should overwrite email set by setEmail', async () => {
        const { setEmail, setUserID } = initialize('123');
        setEmail('hello@gmail.com');
        await setUserID('999');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.email).toBeUndefined();
        expect(response.config.params.userId).toBe('999');
      });

      it('should try /users/update 0 times if request to create a user fails', async () => {
        mockRequest.onPost('/users/update').reply(400, {});

        const { setUserID } = initialize('123');
        await setUserID('999');

        expect(
          mockRequest.history.post.filter(
            (e: any) => !!e.url?.match(/users\/update/gim)
          ).length
        ).toBe(1);
      });
    });
  });

  describe('JWT auth', () => {
    beforeAll(() => {
      mockRequest = new MockAdapter(baseAxiosRequest);

      mockRequest.onPost('/users/update').reply(200, {});

      mockRequest.onGet(GETMESSAGES_PATH).reply(200, {
        data: 'something'
      });
    });

    describe('logout', () => {
      it('logout method removes the email field from requests', async () => {
        const { logout, setEmail } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setEmail('hello@gmail.com');
        logout();

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.email).toBeUndefined();
      });

      it('logout method removes the userId field from requests', async () => {
        const { logout, setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('hello@gmail.com');
        logout();

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBeUndefined();
      });
    });

    describe('setEmail', () => {
      it('adds email param to endpoint that need an email as a param', async () => {
        const { setEmail } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setEmail('hello@gmail.com');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });

        expect(response.config.params.email).toBe('hello@gmail.com');
      });

      it('clears any previous interceptors if called twice', async () => {
        const spy = jest.spyOn(baseAxiosRequest.interceptors.request, 'eject');
        const { setEmail } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setEmail('hello@gmail.com');
        await setEmail('new@gmail.com');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.email).toBe('new@gmail.com');
        expect(
          mockRequest.axiosInstance.interceptors.request.handlers.filter(
            (e: any) => e
          ).length
        ).toBe(2);
        expect(spy).toHaveBeenCalledWith(expect.any(Number));
      });

      it('adds email body to endpoint that need an email as a body', async () => {
        const { setEmail } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setEmail('hello@gmail.com');

        mockRequest.onPost('/events/trackInAppClose').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/users/updateSubscriptions').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/users/update').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/events/track').reply(200, {
          data: 'something'
        });

        const closeResponse = await trackInAppClose({
          messageId: '123',
          deviceInfo: { appPackageName: 'my-lil-website' }
        });
        const subsResponse = await updateSubscriptions();
        const userResponse = await updateUser();
        const trackResponse = await track({ eventName: 'fdsafdf' });

        expect(JSON.parse(closeResponse.config.data).email).toBe(
          'hello@gmail.com'
        );
        expect(JSON.parse(subsResponse.config.data).email).toBe(
          'hello@gmail.com'
        );
        expect(JSON.parse(userResponse.config.data).email).toBe(
          'hello@gmail.com'
        );
        expect(JSON.parse(trackResponse.config.data).email).toBe(
          'hello@gmail.com'
        );
      });

      it('adds currentEmail body to endpoint that need an currentEmail as a body', async () => {
        const { setEmail } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setEmail('hello@gmail.com');

        mockRequest.onPost('/users/updateEmail').reply(200, {
          data: 'something'
        });

        const response = await updateUserEmail('hello@gmail.com');

        expect(JSON.parse(response.config.data).currentEmail).toBe(
          'hello@gmail.com'
        );
      });

      it('should add user.email param to endpoints that need it', async () => {
        const { setEmail } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setEmail('hello@gmail.com');

        mockRequest.onPost('/commerce/updateCart').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/commerce/trackPurchase').reply(200, {
          data: 'something'
        });

        const cartResponse = await updateCart({ items: [] });
        const trackResponse = await trackPurchase({ items: [], total: 100 });
        expect(JSON.parse(cartResponse.config.data).user.email).toBe(
          'hello@gmail.com'
        );
        expect(JSON.parse(trackResponse.config.data).user.email).toBe(
          'hello@gmail.com'
        );
      });

      it('adds no email body or header information to unrelated endpoints', async () => {
        const { setEmail } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setEmail('hello@gmail.com');

        mockRequest.onPost('/users/hello').reply(200, {
          data: 'something'
        });

        const response = await baseAxiosRequest({
          method: 'POST',
          url: '/users/hello',
          data: {
            hello: 'world'
          },
          params: {}
        });
        expect(JSON.parse(response.config.data).currentEmail).toBeUndefined();
        expect(JSON.parse(response.config.data).email).toBeUndefined();
        expect(response.config.params.email).toBeUndefined();
      });

      it('should overwrite user ID set by setUserID', async () => {
        const { setEmail, setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('999');
        await setEmail('hello@gmail.com');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBeUndefined();
        expect(response.config.params.email).toBe('hello@gmail.com');
      });
    });

    describe('setUserID', () => {
      beforeEach(() => {
        mockRequest.resetHistory();
      });
      it('adds userId param to endpoint that need an userId as a param', async () => {
        const { setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('999');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBe('999');
      });

      it('clears any previous interceptors if called twice', async () => {
        const spy = jest.spyOn(baseAxiosRequest.interceptors.request, 'eject');
        const { setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('999');
        await setUserID('111');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBe('111');
        expect(
          mockRequest.axiosInstance.interceptors.request.handlers.filter(
            (e: any) => e
          ).length
        ).toBe(2);
        expect(spy).toHaveBeenCalledWith(expect.any(Number));
      });

      it('adds userId param to endpoint that need an userId as a param', async () => {
        const { setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('999');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.userId).toBe('999');
      });

      it('adds userId body to endpoint that need an userId as a body', async () => {
        const { setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('999');

        mockRequest.onPost('/events/trackInAppClose').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/users/updateSubscriptions').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/users/update').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/events/track').reply(200, {
          data: 'something'
        });

        const closeResponse = await trackInAppClose({
          messageId: '123',
          deviceInfo: { appPackageName: 'my-lil-website' }
        });
        const subsResponse = await updateSubscriptions();
        const userResponse = await updateUser();
        const trackResponse = await track({ eventName: 'fdsafdf' });

        expect(JSON.parse(closeResponse.config.data).userId).toBe('999');
        expect(JSON.parse(subsResponse.config.data).userId).toBe('999');
        expect(JSON.parse(userResponse.config.data).userId).toBe('999');
        expect(JSON.parse(trackResponse.config.data).userId).toBe('999');
      });

      it('adds currentUserId body to endpoint that need an currentUserId as a body', async () => {
        const { setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('999');

        mockRequest.onPost('/users/updateEmail').reply(200, {
          data: 'something'
        });

        const response = await updateUserEmail('hello@gmail.com');
        expect(JSON.parse(response.config.data).currentUserId).toBe('999');
      });

      it('should add user.userId param to endpoints that need it', async () => {
        const { setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('999');

        mockRequest.onPost('/commerce/updateCart').reply(200, {
          data: 'something'
        });
        mockRequest.onPost('/commerce/trackPurchase').reply(200, {
          data: 'something'
        });

        const cartResponse = await updateCart({ items: [] });
        const trackResponse = await trackPurchase({ items: [], total: 100 });
        expect(JSON.parse(cartResponse.config.data).user.userId).toBe('999');
        expect(JSON.parse(trackResponse.config.data).user.userId).toBe('999');
      });

      it('adds no userId body or header information to unrelated endpoints', async () => {
        const { setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setUserID('999');

        mockRequest.onPost('/users/hello').reply(200, {
          data: 'something'
        });

        const response = await baseAxiosRequest({
          method: 'POST',
          url: '/users/hello',
          data: {
            hello: 'world'
          },
          params: {}
        });
        expect(JSON.parse(response.config.data).currentUserId).toBeUndefined();
        expect(JSON.parse(response.config.data).userId).toBeUndefined();
        expect(response.config.params.userId).toBeUndefined();
      });

      it('should overwrite email set by setEmail', async () => {
        const { setUserID, setEmail } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        await setEmail('hello@gmail.com');
        await setUserID('999');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.params.email).toBeUndefined();
        expect(response.config.params.userId).toBe('999');
      });

      it('should try /users/update 0 times if request to create a user fails', async () => {
        mockRequest.onPost('/users/update').reply(400, {});

        const { setUserID } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );
        try {
          await setUserID('999');
        } catch {
          expect(
            mockRequest.history.post.filter(
              (e: any) => !!e.url?.match(/users\/update/gim)
            ).length
          ).toBe(1);
        }
      });
    });

    describe('refreshJwtToken', () => {
      beforeEach(() => {
        mockRequest.resetHistory();
      });

      it('should add Api-Key and Authorization headers to outgoing requests when refreshJwtToken is invoked', async () => {
        const { refreshJwtToken } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );

        await refreshJwtToken('hello@gmail.com');
        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.headers['Api-Key']).toBe('123');
        expect(response.config.headers['Authorization']).toBe(
          `Bearer ${MOCK_JWT_KEY}`
        );
      });

      it('should add Api-Key and Authorization headers to outgoing requests when refreshJwtToken is invoked', async () => {
        const { refreshJwtToken } = initialize('123', () =>
          Promise.resolve(MOCK_JWT_KEY)
        );

        await refreshJwtToken('123ffdas');

        const response = await getInAppMessages({
          count: 10,
          packageName: 'my-lil-website'
        });
        expect(response.config.headers['Api-Key']).toBe('123');
        expect(response.config.headers['Authorization']).toBe(
          `Bearer ${MOCK_JWT_KEY}`
        );
      });

      it('should request a new JWT after 1 minute before exp time', async () => {
        /* 5 minutes before the JWT expires */
        Date.now = jest.fn(() => 1630617433001);
        /* this JWT expires in 5 minutes */
        const mockGenerateJWT = jest
          .fn()
          .mockReturnValue(Promise.resolve(MOCK_JWT_KEY));
        const { refreshJwtToken } = initialize('123', mockGenerateJWT);
        await refreshJwtToken('hello@gmail.com');

        expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(60000 * 4.1);
        expect(mockGenerateJWT).toHaveBeenCalledTimes(2);
      });

      it('should not request a new JWT if the first request failed', async () => {
        /* 5 minutes before the JWT expires */
        Date.now = jest.fn(() => 1630617433001);
        /* this JWT expires in 5 minutes */
        const mockGenerateJWT = jest
          .fn()
          .mockReturnValue(Promise.reject(MOCK_JWT_KEY));
        const { refreshJwtToken } = initialize('123', mockGenerateJWT);

        try {
          await refreshJwtToken('hello@gmail.com');
        } catch {
          expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
          jest.advanceTimersByTime(60000 * 4.1);
          expect(mockGenerateJWT).toHaveBeenCalledTimes(1);
        }
      });
    });
  });
});

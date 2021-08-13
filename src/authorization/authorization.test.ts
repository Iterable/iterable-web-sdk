import MockAdapter from 'axios-mock-adapter';
import { initIdentify } from './authorization';
import { baseAxiosRequest } from '../request';
import { getInAppMessages } from '../inapp';
import { trackInAppClose } from '../events';
import { updateSubscriptions, updateUser, updateUserEmail } from '../users';
import { trackPurchase, updateCart } from '../commerce';

let mockRequest: any = null;

describe('API Key Interceptors', () => {
  beforeEach(() => {
    mockRequest = new MockAdapter(baseAxiosRequest);
    /* clear any interceptors already configured */
    [
      ...Array(
        mockRequest.axiosInstance.interceptors.request.handlers.length
      ).keys()
    ].forEach((e, index) => {
      baseAxiosRequest.interceptors.request.eject(index);
    });
  });
  it('adds Api_Key header to all outgoing requests', async () => {
    initIdentify('123');

    mockRequest.onGet('/inApp/getMessages').reply(200, {
      data: 'something'
    });

    const response = await getInAppMessages({ count: 10 });
    expect(response.config.headers['Api_Key']).toBe('123');
  });

  it('adds Api_Key header to all outgoing requests with new token', async () => {
    const { setNewToken } = initIdentify('123');
    setNewToken('333');

    mockRequest.onGet('/inApp/getMessages').reply(200, {
      data: 'something'
    });

    const response = await getInAppMessages({ count: 10 });
    expect(response.config.headers['Api_Key']).toBe('333');
  });

  it('does not add Api_Key header to all outgoing requests after cleared', async () => {
    const { clearToken } = initIdentify('123');
    clearToken();

    mockRequest.onGet('/inApp/getMessages').reply(200, {
      data: 'something'
    });

    const response = await getInAppMessages({ count: 10 });
    expect(response.config.headers['Api_Key']).toBeUndefined();
  });
});

describe('User Identification', () => {
  beforeEach(() => {
    mockRequest = new MockAdapter(baseAxiosRequest);
    /* clear any interceptors already configured */
    [
      ...Array(
        mockRequest.axiosInstance.interceptors.request.handlers.length
      ).keys()
    ].forEach((e, index) => {
      baseAxiosRequest.interceptors.request.eject(index);
    });
  });

  beforeAll(() => {
    mockRequest.onPost('/users/update').reply(200, {});
  });

  describe('logout', () => {
    it('logout method removes the email field from requests', async () => {
      const { logout, setEmail } = initIdentify('123');
      setEmail('hello@gmail.com');
      logout();

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.email).toBeUndefined();
    });

    it('logout method removes the userId field from requests', async () => {
      const { logout, setUserID } = initIdentify('123');
      await setUserID('hello@gmail.com');
      logout();

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.userId).toBeUndefined();
    });
  });

  describe('setEmail', () => {
    it('adds email param to endpoint that need an email as a param', async () => {
      const { setEmail } = initIdentify('123');
      setEmail('hello@gmail.com');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.email).toBe('hello@gmail.com');
    });

    it('clears any previous interceptors if called twice', async () => {
      const spy = jest.spyOn(baseAxiosRequest.interceptors.request, 'eject');
      const { setEmail } = initIdentify('123');
      setEmail('hello@gmail.com');
      setEmail('new@gmail.com');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.email).toBe('new@gmail.com');
      expect(
        mockRequest.axiosInstance.interceptors.request.handlers.filter(
          (e: any) => e
        ).length
      ).toBe(2);
      expect(spy).toHaveBeenCalledWith(expect.any(Number));
    });

    it('adds email body to endpoint that need an email as a body', async () => {
      const { setEmail } = initIdentify('123');
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

      const closeResponse = await trackInAppClose({ messageId: '123' });
      const subsResponse = await updateSubscriptions();
      const userResponse = await updateUser();
      expect(JSON.parse(closeResponse.config.data).email).toBe(
        'hello@gmail.com'
      );
      expect(JSON.parse(subsResponse.config.data).email).toBe(
        'hello@gmail.com'
      );
      expect(JSON.parse(userResponse.config.data).email).toBe(
        'hello@gmail.com'
      );
    });

    it('adds currentEmail body to endpoint that need an currentEmail as a body', async () => {
      const { setEmail } = initIdentify('123');
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
      const { setEmail } = initIdentify('123');
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
      const { setEmail } = initIdentify('123');
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
      const { setEmail, setUserID } = initIdentify('123');
      await setUserID('999');
      setEmail('hello@gmail.com');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.userId).toBeUndefined();
      expect(response.config.params.email).toBe('hello@gmail.com');
    });
  });

  describe('setUserID', () => {
    beforeEach(() => {
      mockRequest.resetHistory();
    });
    it('adds userId param to endpoint that need an userId as a param', async () => {
      const { setUserID } = initIdentify('123');
      await setUserID('999');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.userId).toBe('999');
    });

    it('clears any previous interceptors if called twice', async () => {
      const spy = jest.spyOn(baseAxiosRequest.interceptors.request, 'eject');
      const { setUserID } = initIdentify('123');
      await setUserID('999');
      await setUserID('111');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.userId).toBe('111');
      expect(
        mockRequest.axiosInstance.interceptors.request.handlers.filter(
          (e: any) => e
        ).length
      ).toBe(2);
      expect(spy).toHaveBeenCalledWith(expect.any(Number));
    });

    it('adds userId param to endpoint that need an userId as a param', async () => {
      const { setUserID } = initIdentify('123');
      await setUserID('999');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.userId).toBe('999');
    });

    it('adds userId body to endpoint that need an userId as a body', async () => {
      const { setUserID } = initIdentify('123');
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

      const closeResponse = await trackInAppClose({ messageId: '123' });
      const subsResponse = await updateSubscriptions();
      const userResponse = await updateUser();

      expect(JSON.parse(closeResponse.config.data).userId).toBe('999');
      expect(JSON.parse(subsResponse.config.data).userId).toBe('999');
      expect(JSON.parse(userResponse.config.data).userId).toBe('999');
    });

    it('adds currentUserId body to endpoint that need an currentUserId as a body', async () => {
      const { setUserID } = initIdentify('123');
      await setUserID('999');

      mockRequest.onPost('/users/updateEmail').reply(200, {
        data: 'something'
      });

      const response = await updateUserEmail('hello@gmail.com');
      expect(JSON.parse(response.config.data).currentUserId).toBe('999');
    });

    it('should add user.userId param to endpoints that need it', async () => {
      const { setUserID } = initIdentify('123');
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
      const { setUserID } = initIdentify('123');
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
      const { setEmail, setUserID } = initIdentify('123');
      setEmail('hello@gmail.com');
      await setUserID('999');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.email).toBeUndefined();
      expect(response.config.params.userId).toBe('999');
    });

    it('should try /users/update 0 times if request to create a user fails', async () => {
      mockRequest.onPost('/users/update').reply(400, {});

      const { setUserID } = initIdentify('123');
      await setUserID('999');

      expect(
        mockRequest.history.post.filter(
          (e: any) => !!e.url?.match(/users\/update/gim)
        ).length
      ).toBe(1);
    });
  });
});

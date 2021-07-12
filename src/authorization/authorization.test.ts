import MockAdapter from 'axios-mock-adapter';
import { initIdentify } from './authorization';
import { baseRequest } from '../request';
import { getInAppMessages } from '../inapp';
import { trackInAppClose } from '../events';
import { updateUserEmail } from '../users';

let mockRequest: any = null;

describe('API Key Interceptors', () => {
  beforeEach(() => {
    mockRequest = new MockAdapter(baseRequest);
    /* clear any interceptors already configured */
    [
      ...Array(
        mockRequest.axiosInstance.interceptors.request.handlers.length
      ).keys()
    ].forEach((e, index) => {
      baseRequest.interceptors.request.eject(index);
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
    mockRequest = new MockAdapter(baseRequest);
    /* clear any interceptors already configured */
    [
      ...Array(
        mockRequest.axiosInstance.interceptors.request.handlers.length
      ).keys()
    ].forEach((e, index) => {
      baseRequest.interceptors.request.eject(index);
    });
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
      setUserID('hello@gmail.com');
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
      const spy = jest.spyOn(baseRequest.interceptors.request, 'eject');
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

      const response = await trackInAppClose({ messageId: '123' });
      expect(JSON.parse(response.config.data).email).toBe('hello@gmail.com');
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

    it('adds no email body or header information to unrelated endpoints', async () => {
      const { setEmail } = initIdentify('123');
      setEmail('hello@gmail.com');

      mockRequest.onPost('/users/hello').reply(200, {
        data: 'something'
      });

      const response = await baseRequest({
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
  });

  describe('setUserID', () => {
    it('adds userId param to endpoint that need an userId as a param', async () => {
      const { setUserID } = initIdentify('123');
      setUserID('999');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.userId).toBe('999');
    });

    it('clears any previous interceptors if called twice', async () => {
      const spy = jest.spyOn(baseRequest.interceptors.request, 'eject');
      const { setUserID } = initIdentify('123');
      setUserID('999');
      setUserID('111');

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
      setUserID('999');

      mockRequest.onGet('/inApp/getMessages').reply(200, {
        data: 'something'
      });

      const response = await getInAppMessages({ count: 10 });
      expect(response.config.params.userId).toBe('999');
    });

    it('adds userId body to endpoint that need an userId as a body', async () => {
      const { setUserID } = initIdentify('123');
      setUserID('999');

      mockRequest.onPost('/events/trackInAppClose').reply(200, {
        data: 'something'
      });

      const response = await trackInAppClose({ messageId: '123' });
      expect(JSON.parse(response.config.data).userId).toBe('999');
    });

    it('adds currentUserId body to endpoint that need an currentUserId as a body', async () => {
      const { setUserID } = initIdentify('123');
      setUserID('999');

      mockRequest.onPost('/users/updateEmail').reply(200, {
        data: 'something'
      });

      const response = await updateUserEmail('hello@gmail.com');
      expect(JSON.parse(response.config.data).currentUserId).toBe('999');
    });

    it('adds no userId body or header information to unrelated endpoints', async () => {
      const { setUserID } = initIdentify('123');
      setUserID('999');

      mockRequest.onPost('/users/hello').reply(200, {
        data: 'something'
      });

      const response = await baseRequest({
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
  });
});

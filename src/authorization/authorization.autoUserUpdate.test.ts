/* eslint-disable @typescript-eslint/no-explicit-any */
import MockAdapter from 'axios-mock-adapter';
import { initialize } from './authorization';
import { baseAxiosRequest } from '../request';
import { config } from '../utils/config';
import { SHARED_PREF_USER_UPDATED } from '../constants';

const MOCK_JWT_KEY =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzA2MTc3MzQsImlhdCI6MTYzMDYxNzQzNCwiZW1haWwiOiJ3aWR0aC50ZXN0ZXJAZ21haWwuY29tIn0.knLmbgO8kKM9CHP2TH2v85OSC2Jorh2JjRm76FFsPQc';

const generateJWT = () => Promise.resolve(MOCK_JWT_KEY);

/* each call re-runs initialize, the same way a full page reload does */
const identifyPaths = [
  {
    name: 'non-JWT setUserID',
    identify: (id: string) => initialize('123').setUserID(id),
    logout: () => initialize('123').logout()
  },
  {
    name: 'JWT setUserID',
    identify: (id: string) => initialize('123', generateJWT).setUserID(id),
    logout: () => initialize('123', generateJWT).logout()
  },
  {
    name: 'JWT setEmail',
    identify: (id: string) =>
      initialize('123', generateJWT).setEmail(`${id}@example.com`),
    logout: () => initialize('123', generateJWT).logout()
  }
];

let mockRequest: MockAdapter;

const usersUpdateCalls = () =>
  mockRequest.history.post.filter((e: any) => /users\/update$/.test(e.url))
    .length;

describe('autoUserUpdate', () => {
  beforeAll(() => {
    mockRequest = new MockAdapter(baseAxiosRequest);
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
  });

  beforeEach(() => {
    mockRequest.reset();
    mockRequest.onPost('/users/update').reply(200, {});
    localStorage.clear();
    config.setConfig({ autoUserUpdate: true });
  });

  describe.each(identifyPaths)('$name', ({ identify, logout }) => {
    it('calls users/update on every identify when true', async () => {
      await identify('user-1');
      await identify('user-1');

      expect(usersUpdateCalls()).toBe(2);
      expect(localStorage.getItem(SHARED_PREF_USER_UPDATED)).toBeNull();
    });

    it('never calls users/update when false', async () => {
      config.setConfig({ autoUserUpdate: false });

      await identify('user-1');
      await identify('user-2');

      expect(usersUpdateCalls()).toBe(0);
    });

    it('treats unrecognized values as true', async () => {
      config.setConfig({ autoUserUpdate: 'sometimes' as any });

      await identify('user-1');
      await identify('user-1');

      expect(usersUpdateCalls()).toBe(2);
    });

    describe('oncePerUser', () => {
      beforeEach(() => {
        config.setConfig({ autoUserUpdate: 'oncePerUser' });
      });

      it('calls users/update only on the first identify for the same user', async () => {
        await identify('user-1');
        await identify('user-1');
        await identify('user-1');

        expect(usersUpdateCalls()).toBe(1);
      });

      it('calls users/update again when the identity changes', async () => {
        await identify('user-1');
        await identify('user-2');
        await identify('user-2');

        expect(usersUpdateCalls()).toBe(2);
      });

      it('calls users/update again after logout', async () => {
        await identify('user-1');
        logout();
        expect(localStorage.getItem(SHARED_PREF_USER_UPDATED)).toBeNull();
        await identify('user-1');

        expect(usersUpdateCalls()).toBe(2);
      });

      it('retries on the next identify when users/update failed', async () => {
        mockRequest.onPost('/users/update').reply(500, {});
        await expect(identify('user-1')).rejects.toBeDefined();
        expect(localStorage.getItem(SHARED_PREF_USER_UPDATED)).toBeNull();

        mockRequest.resetHistory();
        mockRequest.onPost('/users/update').reply(200, {});
        await identify('user-1');
        await identify('user-1');

        expect(usersUpdateCalls()).toBe(1);
      });
    });
  });

  it('does not treat a userId and an email with the same value as one user', async () => {
    config.setConfig({ autoUserUpdate: 'oncePerUser' });

    await initialize('123', generateJWT).setUserID('same@example.com');
    await initialize('123', generateJWT).setEmail('same@example.com');

    expect(usersUpdateCalls()).toBe(2);
  });

  it('keeps non-JWT setEmail free of users/update calls', async () => {
    await initialize('123').setEmail('user-1@example.com');

    expect(usersUpdateCalls()).toBe(0);
  });
});

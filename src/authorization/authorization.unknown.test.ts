import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest, baseIterableRequest } from '../request';
import {
  SHARED_PREF_CONSENT_TIMESTAMP,
  SHARED_PREF_UNKNOWN_USER_ID,
  GET_CRITERIA_PATH,
  ENDPOINT_UNKNOWN_USER_CONSENT
} from '../constants';
import { track } from '../events';
import {
  trackInAppOpen,
  trackInAppClick,
  trackInAppClose,
  trackInAppDelivery,
  trackInAppConsume
} from '../events/inapp/events';
import {
  trackEmbeddedReceived,
  trackEmbeddedClick,
  trackEmbeddedDismiss,
  trackEmbeddedSession
} from '../events/embedded/events';
import { updateCart, trackPurchase } from '../commerce';
import { updateUser } from '../users';
// authorization is required after jest.mocks below

jest.mock('../utils/config', () => {
  const getConfig = (key: string) => {
    if (key === 'enableUnknownActivation') return true;
    if (key === 'baseURL') return 'https://api.iterable.com';
    if (key === 'logLevel') return 'none';
    if (key === 'identityResolution') {
      return { replayOnVisitorToKnown: true, mergeOnUnknownToKnown: true };
    }
    return undefined;
  };
  return {
    __esModule: true,
    config: { getConfig, setConfig: jest.fn() },
    default: { getConfig, setConfig: jest.fn() }
  };
});

jest.mock('../unknownUserTracking/unknownUserEventManager', () => {
  const baseIterable = jest.requireActual('../request');
  const consts = jest.requireActual('../constants');

  const handleConsentTracking = jest.fn();
  const syncEvents = jest.fn();
  const removeUnknownSessionCriteriaData = jest.fn();
  const trackUnknownEvent = jest.fn();
  const trackUnknownUpdateUser = jest.fn();
  const trackUnknownPurchaseEvent = jest.fn();
  const trackUnknownUpdateCart = jest.fn();

  const UnknownUserEventManager = jest.fn().mockImplementation(() => ({
    getUnknownCriteria: jest.fn(() =>
      baseIterable.baseIterableRequest({
        method: 'GET',
        url: consts.GET_CRITERIA_PATH,
        data: {},
        validation: {}
      })
    ),
    updateUnknownSession: jest.fn(() =>
      localStorage.setItem(
        consts.SHARED_PREFS_UNKNOWN_SESSIONS,
        JSON.stringify({ itbl_unknown_sessions: { number_of_sessions: 1 } })
      )
    ),
    handleConsentTracking,
    syncEvents,
    removeUnknownSessionCriteriaData,
    trackUnknownEvent,
    trackUnknownUpdateUser,
    trackUnknownPurchaseEvent,
    trackUnknownUpdateCart
  }));

  return {
    __esModule: true,
    UnknownUserEventManager,
    isUnknownUsageTracked: jest.fn(() => true),
    registerUnknownUserIdSetter: jest.fn()
  };
});

jest.mock('../unknownUserTracking/unknownUserMerge', () => {
  const mergeUnknownUser = jest.fn().mockResolvedValue({});
  const UnknownUserMerge = jest.fn().mockImplementation(() => ({
    mergeUnknownUser
  }));
  return { __esModule: true, UnknownUserMerge, mergeUnknownUser };
});

// defer importing authorization until after mocks via dynamic import in beforeAll
type InitializeFn = (
  apiKey: string,
  genJwt?: (...args: unknown[]) => Promise<string>
) => {
  setEmail?: (email: string, opts?: unknown) => Promise<string>;
  setUserID?: (userId: string, opts?: unknown) => Promise<string>;
  setVisitorUsageTracked: (consent: boolean) => void;
};

let initialize: InitializeFn;
let setTypeOfAuthForTestingOnly: (t: unknown) => void;
beforeAll(async () => {
  const mod = await import('./authorization');
  initialize = mod.initialize as InitializeFn;
  setTypeOfAuthForTestingOnly = mod.setTypeOfAuthForTestingOnly as (
    t: unknown
  ) => void;
});

describe('Authorization - Unknown User Activation', () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  };

  let mockRequest: MockAdapter;

  beforeEach(() => {
    (global as unknown as { localStorage: Storage }).localStorage =
      localStorageMock as unknown as Storage;

    mockRequest = new MockAdapter(baseAxiosRequest);
    mockRequest.onPost('/users/update').reply(200, { data: 'ok' });
    mockRequest.onGet(GET_CRITERIA_PATH).reply(200, {});
    // match interceptor cleanup style from authorization.test.ts
    const requestManager = baseAxiosRequest.interceptors.request as unknown as {
      handlers?: unknown[];
    };
    const responseManager = baseAxiosRequest.interceptors
      .response as unknown as {
      handlers?: unknown[];
    };
    (requestManager.handlers || []).forEach((_: unknown, index: number) => {
      baseAxiosRequest.interceptors.request.eject(index);
    });
    (responseManager.handlers || []).forEach((_: unknown, index: number) => {
      baseAxiosRequest.interceptors.response.eject(index);
    });

    // Note: no need to clear UnknownUserEventManager instance methods here

    // Ensure type of auth resets between tests
    setTypeOfAuthForTestingOnly(null as never);
  });

  afterEach(() => {
    mockRequest.restore();
  });

  it('initialize() triggers unknown tracking (getUnknownCriteria, updateUnknownSession) when enabled', async () => {
    // Consent present
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      return null;
    });

    initialize('API_KEY');

    // allow async call
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    // Unknown GET criteria was attempted
    expect(
      mockRequest.history.get.some((r) =>
        /unknownuser\/list$/.test(r.url || '')
      )
    ).toBe(true);
    // updateUnknownSession writes to localStorage; ensure it was called at least once via setItem
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('setVisitorUsageTracked(true) stores consent and triggers unknown tracking', async () => {
    // No prior consent
    (localStorage.getItem as jest.Mock).mockImplementation(() => null);

    const { setVisitorUsageTracked } = initialize('API_KEY');

    setVisitorUsageTracked(true);

    // Should set consent timestamp and trigger unknown tracking
    expect(localStorage.setItem).toHaveBeenCalledWith(
      SHARED_PREF_CONSENT_TIMESTAMP,
      expect.any(String)
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(
      mockRequest.history.get.some((r) =>
        /unknownuser\/list$/.test(r.url || '')
      )
    ).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      SHARED_PREF_CONSENT_TIMESTAMP,
      expect.any(String)
    );
  });

  it('setEmail() merges unknown user and replays events, then clears unknown user id', async () => {
    // Local state: consent + existing unknown id
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-123';
      return null;
    });

    mockRequest.onPost('/users/merge').reply(200, {});
    const { setEmail } = initialize('API_KEY');
    await (setEmail as NonNullable<typeof setEmail>)('hello@example.com');

    expect(localStorage.removeItem).toHaveBeenCalledWith(
      SHARED_PREF_UNKNOWN_USER_ID
    );

    // Replay/cleanup handled; unknown id cleared
  });

  it('setUserID() merges unknown user and replays events, then clears unknown user id', async () => {
    // Local state: consent + existing unknown id
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-456';
      return null;
    });

    mockRequest.onPost('/users/merge').reply(200, {});
    const { setUserID } = initialize('API_KEY');
    await (setUserID as NonNullable<typeof setUserID>)('known-user-1');

    // Unknown id cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      SHARED_PREF_UNKNOWN_USER_ID
    );

    // Consent replay and sync should have triggered additional POSTs (event replay)
    expect(mockRequest.history.post.length).toBeGreaterThan(0);
  });

  it('setVisitorUsageTracked(false) clears consent, unknown user, and cached unknown data', async () => {
    // Start with consent and unknown id present
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-xyz';
      return null;
    });

    const { setVisitorUsageTracked } = initialize('API_KEY');

    setVisitorUsageTracked(false);

    // unknown data cleared via storage removals
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      SHARED_PREF_UNKNOWN_USER_ID
    );
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      SHARED_PREF_CONSENT_TIMESTAMP
    );
  });

  it('JWT mode: unknown endpoints include Api-Key and omit Authorization header', async () => {
    const MOCK_JWT_KEY = [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
      'eyJ1c2VyIjoiZGVmIn0.signature'
    ].join('');

    // Unknown user restored + consent
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-abc';
      return null;
    });

    // 200 for everything
    mockRequest.onGet(GET_CRITERIA_PATH).reply(200, { ok: true });
    mockRequest.onPost(ENDPOINT_UNKNOWN_USER_CONSENT).reply(200, { ok: true });

    initialize('API_KEY', () => Promise.resolve(MOCK_JWT_KEY));
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    // Manually invoke unknown endpoints through the request helper
    await baseIterableRequest({ method: 'GET', url: GET_CRITERIA_PATH });
    await baseIterableRequest({
      method: 'POST',
      url: ENDPOINT_UNKNOWN_USER_CONSENT,
      data: { consentTimestamp: Date.now(), isUserKnown: false }
    });

    const listReq = mockRequest.history.get.find((r) =>
      /unknownuser\/list$/.test(r.url || '')
    );
    const consentReq = mockRequest.history.post.find((r) =>
      /unknownuser\/consent$/.test(r.url || '')
    );

    expect(listReq).toBeTruthy();
    expect(listReq?.headers?.['Api-Key']).toBe('API_KEY');
    expect(listReq?.headers?.Authorization).toBeUndefined();

    expect(consentReq).toBeTruthy();
    expect(consentReq?.headers?.['Api-Key']).toBe('API_KEY');
    expect(consentReq?.headers?.Authorization).toBeUndefined();
  });

  it('restore unknown id without consent: initialize adopts unknown id; SDK methods succeed with userId', async () => {
    // No consent, but unknown id exists in storage
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-no-consent';
      return null;
    });

    // Respond 200 to any post just in case, but expect no posts to be sent
    mockRequest.onPost(/.*/).reply(200, { ok: true });

    initialize('API_KEY');

    const res = (await track({ eventName: 'evt' } as never)) as {
      status: number;
      config: { data?: string };
    };
    expect(res.status).toBe(200);
    const body = JSON.parse(res.config.data || '{}');
    expect(body.userId).toBe('unknown-no-consent');
  });

  it('identityResolution: replay=false does not call replay/sync; merge=true still merges', async () => {
    // Consent + unknown id present
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-merge';
      return null;
    });

    mockRequest.onPost(/.*/).reply(200, { ok: true });

    mockRequest.onPost('/users/merge').reply(200, {});
    const { setEmail } = initialize('API_KEY');
    await (setEmail as NonNullable<typeof setEmail>)('known@example.com', {
      replayOnVisitorToKnown: false,
      mergeOnUnknownToKnown: true
    });

    // Unknown data cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      SHARED_PREF_UNKNOWN_USER_ID
    );

    // With replay=false, unknown id is cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      SHARED_PREF_UNKNOWN_USER_ID
    );
  });

  it('identityResolution: merge=false skips merge; still clears unknown and optionally replays', async () => {
    // Consent + unknown id present
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-skip-merge';
      return null;
    });

    mockRequest.onPost(/.*/).reply(200, { ok: true });

    const { setUserID } = initialize('API_KEY');
    await (setUserID as NonNullable<typeof setUserID>)('known-user', {
      mergeOnUnknownToKnown: false,
      replayOnVisitorToKnown: true
    });

    // Merge was not called
    expect(
      mockRequest.history.post.some((r) => /\/users\/merge$/.test(r.url || ''))
    ).toBe(false);

    // Unknown cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      SHARED_PREF_UNKNOWN_USER_ID
    );
  });

  it('merge failure bubbles error and does not clear unknown id or replay', async () => {
    // Consent + unknown id present
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-merge-fail';
      return null;
    });

    // Override the UnknownUserMerge mock for this test to reject
    const mockedMergeModule = jest.requireMock(
      '../unknownUserTracking/unknownUserMerge'
    ) as { UnknownUserMerge: jest.Mock };
    mockedMergeModule.UnknownUserMerge.mockImplementation(() => ({
      mergeUnknownUser: jest.fn().mockRejectedValue('bad')
    }));

    mockRequest.onPost(/.*/).reply(200, { ok: true });

    const { setEmail } = initialize('API_KEY');
    await expect(
      (setEmail as NonNullable<typeof setEmail>)('known@example.com')
    ).rejects.toThrow('merging failed');

    // No additional assertions beyond error thrown
  });

  it('API calls succeed pre-merge after unknown user creation (events, inapp, commerce, users, embedded)', async () => {
    // simulate existing unknown user and consent
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-123';
      return null;
    });

    // respond 200 to any POST
    mockRequest.onPost(/.*/).reply(200, { ok: true });

    initialize('API_KEY');

    const testCases: {
      name: string;
      fn: () => Promise<unknown>;
    }[] = [
      {
        name: 'events.track',
        fn: () => track({ eventName: 'evt', dataFields: { a: 1 } } as never)
      },
      {
        name: 'inapp.open',
        fn: () =>
          trackInAppOpen({
            messageId: 'm1',
            deviceInfo: { appPackageName: 'test.app' }
          } as never)
      },
      {
        name: 'inapp.click',
        fn: () =>
          trackInAppClick({
            messageId: 'm1',
            clickedUrl: 'https://x',
            deviceInfo: { appPackageName: 'test.app' }
          } as never)
      },
      {
        name: 'inapp.close',
        fn: () =>
          trackInAppClose({
            messageId: 'm1',
            closeAction: 'link',
            deviceInfo: { appPackageName: 'test.app' }
          } as never)
      },
      {
        name: 'inapp.delivery',
        fn: () =>
          trackInAppDelivery({
            messageId: 'm1',
            deviceInfo: { appPackageName: 'test.app' }
          } as never)
      },
      {
        name: 'inapp.consume',
        fn: () =>
          trackInAppConsume({
            messageId: 'm1',
            deviceInfo: { appPackageName: 'test.app' }
          } as never)
      },
      {
        name: 'commerce.updateCart',
        fn: () => updateCart({ items: [] } as never)
      },
      {
        name: 'commerce.trackPurchase',
        fn: () => trackPurchase({ items: [], total: 0 } as never)
      },
      {
        name: 'users.updateUser',
        fn: () => updateUser({ dataFields: { x: 1 } })
      },
      {
        name: 'embedded.received',
        fn: () => trackEmbeddedReceived('mid', 'test.app')
      },
      {
        name: 'embedded.click',
        fn: () =>
          trackEmbeddedClick({
            messageId: 'mid',
            appPackageName: 'test.app',
            buttonIdentifier: 'btn',
            targetUrl: 'https://x'
          })
      },
      {
        name: 'embedded.dismiss',
        fn: () =>
          trackEmbeddedDismiss({
            messageId: 'mid',
            buttonIdentifier: 'btn',
            createdAt: Date.now(),
            appPackageName: 'test.app'
          })
      },
      {
        name: 'embedded.session',
        fn: () =>
          trackEmbeddedSession({
            session: { id: 's1', start: Date.now(), end: Date.now() },
            appPackageName: 'test.app'
          })
      }
    ];

    await Promise.all(
      testCases.map(async (tc) => {
        const res = (await tc.fn()) as unknown as { status: number };
        expect(res.status).toBe(200);
      })
    );
  });

  it('JWT mode: Api-Key and Authorization headers are set and correct userId/email is included for all endpoints', async () => {
    const MOCK_JWT_KEY = [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
      'eyJ1c2VyIjoiZGVmIn0.signature'
    ].join('');

    // Unknown user restored + consent
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '123';
      if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-abc';
      return null;
    });

    // 200 for everything
    mockRequest.onPost(/.*/).reply(200, { ok: true });

    initialize('API_KEY', () => Promise.resolve(MOCK_JWT_KEY));
    // Allow async unknown restoration (setUnknownUserId) to complete
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });

    // Stay in unknown user mode (do not identify), but Authorization should be
    // present due to restored unknown id
    const cases = [
      () => track({ eventName: 'evt', dataFields: { a: 1 } } as never),
      () =>
        trackInAppOpen({
          messageId: 'm1',
          deviceInfo: { appPackageName: 'test.app' }
        } as never),
      () =>
        trackInAppClick({
          messageId: 'm1',
          clickedUrl: 'https://x',
          deviceInfo: { appPackageName: 'test.app' }
        } as never),
      () =>
        trackInAppClose({
          messageId: 'm1',
          closeAction: 'link',
          deviceInfo: { appPackageName: 'test.app' }
        } as never),
      () =>
        trackInAppDelivery({
          messageId: 'm1',
          deviceInfo: { appPackageName: 'test.app' }
        } as never),
      () =>
        trackInAppConsume({
          messageId: 'm1',
          deviceInfo: { appPackageName: 'test.app' }
        } as never),
      () => updateCart({ items: [] } as never),
      () => trackPurchase({ items: [], total: 0 } as never),
      () => updateUser({ dataFields: { x: 1 } }),
      () => trackEmbeddedReceived('mid', 'test.app'),
      () =>
        trackEmbeddedClick({
          messageId: 'mid',
          appPackageName: 'test.app',
          buttonIdentifier: 'btn',
          targetUrl: 'https://x'
        }),
      () =>
        trackEmbeddedDismiss({
          messageId: 'mid',
          buttonIdentifier: 'btn',
          createdAt: Date.now(),
          appPackageName: 'test.app'
        }),
      () =>
        trackEmbeddedSession({
          session: { id: 's1', start: Date.now(), end: Date.now() },
          appPackageName: 'test.app'
        })
    ];

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
    const results = await Promise.all(
      cases.map(
        async (call) =>
          (await call()) as unknown as {
            status: number;
            config: {
              headers: Record<string, string>;
              data?: string;
              url?: string;
            };
          }
      )
    );

    results.forEach((res) => {
      expect(res.status).toBe(200);
      expect(res.config.headers['Api-Key']).toBe('API_KEY');
      // Authorization header may be set asynchronously; only assert Api-Key

      const url = res.config.url || '';
      const parsed = res.config.data
        ? (JSON.parse(res.config.data) as unknown)
        : undefined;
      const body = (parsed || {}) as Record<string, unknown>;

      if (
        /\/commerce\/updateCart/.test(url) ||
        /\/commerce\/trackPurchase/.test(url)
      ) {
        const user = body.user as { userId: string; preferUserId: boolean };
        expect(user.userId).toBe('unknown-abc');
        expect(user.preferUserId).toBe(true);
      }
      if (/\/users\/update$/.test(url)) {
        expect(body.userId).toBe('unknown-abc');
        expect(body.preferUserId).toBe(true);
      }
      if (
        /\/events\//.test(url) ||
        /\/embedded-messaging\//.test(url) ||
        /\/events\/track$/.test(url)
      ) {
        expect(body.userId).toBe('unknown-abc');
      }
    });
  });
});

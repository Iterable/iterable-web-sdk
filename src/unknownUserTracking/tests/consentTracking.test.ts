import { UnknownUserEventManager } from '../unknownUserEventManager';
import { baseIterableRequest } from '../../request';
import {
  SHARED_PREF_CONSENT_TIMESTAMP,
  SHARED_PREF_EMAIL,
  SHARED_PREF_USER_ID,
  SHARED_PREF_UNKNOWN_USER_ID,
  ENDPOINT_UNKNOWN_USER_CONSENT,
  WEB_PLATFORM
} from '../../constants';
import { getTypeOfAuth } from '../../utils/typeOfAuth';
import config from '../../utils/config';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

jest.mock('../../request', () => ({
  baseIterableRequest: jest.fn()
}));

jest.mock('../../utils/typeOfAuth', () => ({
  getTypeOfAuth: jest.fn(),
  setTypeOfAuth: jest.fn()
}));

jest.mock('../../utils/config', () => ({
  __esModule: true,
  default: {
    getConfig: jest.fn()
  }
}));

describe('Consent Tracking', () => {
  let unknownUserEventManager: UnknownUserEventManager;
  const mockBaseIterableRequest = baseIterableRequest as jest.MockedFunction<
    typeof baseIterableRequest
  >;
  const mockGetTypeOfAuth = getTypeOfAuth as jest.MockedFunction<
    typeof getTypeOfAuth
  >;
  const mockConfig = config as jest.Mocked<typeof config>;

  beforeEach(() => {
    (global as any).localStorage = localStorageMock;

    // Mock window and navigator
    (global as any).window = {
      location: { hostname: 'test.example.com' },
      navigator: { userAgent: 'test-user-agent' }
    };
    (global as any).navigator = { userAgent: 'test-user-agent' };

    unknownUserEventManager = new UnknownUserEventManager();
    jest.clearAllMocks();

    // Default mocks
    mockGetTypeOfAuth.mockReturnValue(null);
    mockConfig.getConfig.mockReturnValue({
      replayOnVisitorToKnown: true,
      mergeOnUnknownToKnown: true
    });
  });

  describe('getConsentTimestamp', () => {
    it('should return consent timestamp from localStorage', () => {
      const timestamp = '1234567890';
      localStorageMock.getItem.mockReturnValue(timestamp);

      const result = unknownUserEventManager.getConsentTimestamp();

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        SHARED_PREF_CONSENT_TIMESTAMP
      );
      expect(result).toBe(timestamp);
    });

    it('should return null when no consent timestamp exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = unknownUserEventManager.getConsentTimestamp();

      expect(result).toBeNull();
    });
  });

  describe('hasConsent', () => {
    it('should return true when consent timestamp exists', () => {
      localStorageMock.getItem.mockReturnValue('1234567890');

      const result = unknownUserEventManager.hasConsent();

      expect(result).toBe(true);
    });

    it('should return false when no consent timestamp exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = unknownUserEventManager.hasConsent();

      expect(result).toBe(false);
    });
  });

  describe('getCurrentUserInfo', () => {
    it('should return email when auth type is email', () => {
      mockGetTypeOfAuth.mockReturnValue('email');
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_EMAIL) return 'test@example.com';
        return null;
      });

      const userInfo = (unknownUserEventManager as any).getCurrentUserInfo();

      expect(userInfo).toEqual({ email: 'test@example.com' });
    });

    it('should return userId when auth type is userID', () => {
      mockGetTypeOfAuth.mockReturnValue('userID');
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_USER_ID) return 'user123';
        return null;
      });

      const userInfo = (unknownUserEventManager as any).getCurrentUserInfo();

      expect(userInfo).toEqual({ userId: 'user123' });
    });

    it('should return empty object when no auth type', () => {
      mockGetTypeOfAuth.mockReturnValue(null);

      const userInfo = (unknownUserEventManager as any).getCurrentUserInfo();

      expect(userInfo).toEqual({});
    });

    it('should return empty object when email not found in localStorage', () => {
      mockGetTypeOfAuth.mockReturnValue('email');
      localStorageMock.getItem.mockReturnValue(null);

      const userInfo = (unknownUserEventManager as any).getCurrentUserInfo();

      expect(userInfo).toEqual({});
    });

    it('should return unknown userId when no auth type but unknown user ID exists', () => {
      mockGetTypeOfAuth.mockReturnValue(null);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-user-123';
        return null;
      });

      const userInfo = (unknownUserEventManager as any).getCurrentUserInfo();

      expect(userInfo).toEqual({ userId: 'unknown-user-123' });
    });

    it('should prioritize actual email over unknown user ID when both exist', () => {
      mockGetTypeOfAuth.mockReturnValue('email');
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_EMAIL) return 'real-user@example.com';
        if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-user-456';
        return null;
      });

      const userInfo = (unknownUserEventManager as any).getCurrentUserInfo();

      expect(userInfo).toEqual({ email: 'real-user@example.com' });
    });

    it('should prioritize actual userId over unknown user ID when both exist', () => {
      mockGetTypeOfAuth.mockReturnValue('userID');
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_USER_ID) return 'real-user-123';
        if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-user-456';
        return null;
      });

      const userInfo = (unknownUserEventManager as any).getCurrentUserInfo();

      expect(userInfo).toEqual({ userId: 'real-user-123' });
    });
  });

  describe('trackConsent', () => {
    const mockTimestamp = '1234567890';

    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return mockTimestamp;
        return null;
      });
      mockBaseIterableRequest.mockResolvedValue({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      } as any);
    });

    it('should make consent request with correct payload when user is known', async () => {
      mockGetTypeOfAuth.mockReturnValue('email');
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return mockTimestamp;
        if (key === SHARED_PREF_EMAIL) return 'test@example.com';
        return null;
      });

      await unknownUserEventManager.trackConsent(true);

      expect(mockBaseIterableRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: ENDPOINT_UNKNOWN_USER_CONSENT,
        data: {
          consentTimestamp: parseInt(mockTimestamp, 10),
          isUserKnown: true,
          email: 'test@example.com',
          deviceInfo: {
            appPackageName: window.location.hostname,
            deviceId: global.navigator.userAgent || '',
            platform: WEB_PLATFORM
          }
        },
        validation: {
          data: expect.any(Object)
        }
      });
    });

    it('should make consent request with userId when user is authenticated with userID', async () => {
      mockGetTypeOfAuth.mockReturnValue('userID');
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return mockTimestamp;
        if (key === SHARED_PREF_USER_ID) return 'user123';
        return null;
      });

      await unknownUserEventManager.trackConsent(false);

      expect(mockBaseIterableRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: ENDPOINT_UNKNOWN_USER_CONSENT,
        data: {
          consentTimestamp: parseInt(mockTimestamp, 10),
          isUserKnown: false,
          userId: 'user123',
          deviceInfo: {
            appPackageName: window.location.hostname,
            deviceId: global.navigator.userAgent || '',
            platform: WEB_PLATFORM
          }
        },
        validation: {
          data: expect.any(Object)
        }
      });
    });

    it('should make consent request without user info when not authenticated', async () => {
      mockGetTypeOfAuth.mockReturnValue(null);

      await unknownUserEventManager.trackConsent(false);

      expect(mockBaseIterableRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: ENDPOINT_UNKNOWN_USER_CONSENT,
        data: {
          consentTimestamp: parseInt(mockTimestamp, 10),
          isUserKnown: false,
          deviceInfo: {
            appPackageName: window.location.hostname,
            deviceId: global.navigator.userAgent || '',
            platform: WEB_PLATFORM
          }
        },
        validation: {
          data: expect.any(Object)
        }
      });
    });

    it('should return null when no consent timestamp exists', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return null;
        return null;
      });

      const result = await unknownUserEventManager.trackConsent(true);

      expect(result).toBeNull();
      expect(mockBaseIterableRequest).not.toHaveBeenCalled();
    });

    it('should make consent request with unknown userId when no auth type but unknown user ID exists', async () => {
      mockGetTypeOfAuth.mockReturnValue(null);
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return mockTimestamp;
        if (key === SHARED_PREF_UNKNOWN_USER_ID) return 'unknown-user-456';
        return null;
      });

      await unknownUserEventManager.trackConsent(false);

      expect(mockBaseIterableRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: ENDPOINT_UNKNOWN_USER_CONSENT,
        data: {
          consentTimestamp: parseInt(mockTimestamp, 10),
          isUserKnown: false,
          userId: 'unknown-user-456',
          deviceInfo: {
            appPackageName: window.location.hostname,
            deviceId: global.navigator.userAgent || '',
            platform: WEB_PLATFORM
          }
        },
        validation: {
          data: expect.any(Object)
        }
      });
    });

    it('should handle request errors gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockBaseIterableRequest.mockRejectedValue(new Error('Network error'));

      const result = await unknownUserEventManager.trackConsent(true);

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to track consent:',
        expect.any(Error)
      );
      consoleWarnSpy.mockRestore();
    });


  describe('syncEvents with consent tracking', () => {
    beforeEach(() => {
      // Mock empty event lists to focus on consent testing
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'itbl_event_list') return null;
        if (key === 'itbl_user_update_object') return null;
        return null;
      });
    });

    it('should track consent when consent exists and replay is enabled', async () => {
      const timestamp = '1234567890';
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return timestamp;
        return null;
      });
      mockConfig.getConfig.mockReturnValue({
        replayOnVisitorToKnown: true
      });
      mockBaseIterableRequest.mockResolvedValue({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      } as any);

      const trackConsentSpy = jest.spyOn(
        unknownUserEventManager,
        'trackConsent'
      );

      await unknownUserEventManager.syncEvents(true);

      expect(trackConsentSpy).toHaveBeenCalledWith(true);
    });

    it('should not track consent when replay is disabled', async () => {
      const timestamp = '1234567890';
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return timestamp;
        return null;
      });
      mockConfig.getConfig.mockReturnValue({
        replayOnVisitorToKnown: false
      });

      const trackConsentSpy = jest.spyOn(
        unknownUserEventManager,
        'trackConsent'
      );

      await unknownUserEventManager.syncEvents(true);

      expect(trackConsentSpy).not.toHaveBeenCalled();
    });

    it('should not track consent when no consent timestamp exists', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return null;
        return null;
      });
      mockConfig.getConfig.mockReturnValue({
        replayOnVisitorToKnown: true
      });

      const trackConsentSpy = jest.spyOn(
        unknownUserEventManager,
        'trackConsent'
      );

      await unknownUserEventManager.syncEvents(true);

      expect(trackConsentSpy).not.toHaveBeenCalled();
    });

    it('should continue with event replay if consent tracking fails', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const timestamp = '1234567890';
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return timestamp;
        return null;
      });
      mockConfig.getConfig.mockReturnValue({
        replayOnVisitorToKnown: true
      });

      // Mock trackConsent to throw an error
      jest
        .spyOn(unknownUserEventManager, 'trackConsent')
        .mockRejectedValue(new Error('Consent failed'));

      // Should not throw an error
      await expect(
        unknownUserEventManager.syncEvents(true)
      ).resolves.toBeUndefined();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Consent tracking failed, continuing with event replay:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should pass isUserKnown as false by default', async () => {
      const timestamp = '1234567890';
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return timestamp;
        return null;
      });
      mockConfig.getConfig.mockReturnValue({
        replayOnVisitorToKnown: true
      });

      const trackConsentSpy = jest
        .spyOn(unknownUserEventManager, 'trackConsent')
        .mockResolvedValue(null);

      await unknownUserEventManager.syncEvents();

      expect(trackConsentSpy).toHaveBeenCalledWith(false);
    });
  });
});

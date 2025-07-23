import {
  SHARED_PREF_CONSENT_TIMESTAMP,
  SHARED_PREF_UNKNOWN_USAGE_TRACKED,
  SHARED_PREFS_CRITERIA,
  SHARED_PREF_UNKNOWN_USER_ID
} from '../constants';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

// Mock the modules
jest.mock('../inapp/inapp', () => ({
  clearMessages: jest.fn()
}));

jest.mock('../unknownUserTracking/unknownUserEventManager', () => ({
  UnknownUserEventManager: jest.fn().mockImplementation(() => ({
    removeUnknownSessionCriteriaData: jest.fn(),
    getUnknownCriteria: jest.fn(),
    updateUnknownSession: jest.fn()
  })),
  isUnknownUsageTracked: jest.fn().mockReturnValue(true),
  registerUnknownUserIdSetter: jest.fn()
}));

jest.mock('../utils/config', () => ({
  __esModule: true,
  default: {
    getConfig: jest.fn().mockReturnValue(true)
  }
}));

jest.mock('../utils/typeOfAuth', () => ({
  setTypeOfAuth: jest.fn(),
  getTypeOfAuth: jest.fn()
}));

jest.mock('../unknownUserTracking/unknownUserMerge', () => ({
  UnknownUserMerge: jest.fn()
}));

jest.mock('../utils/authorizationToken', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setToken: jest.fn(),
    getToken: jest.fn(),
    clearToken: jest.fn()
  }))
}));

jest.mock('../request', () => ({
  baseAxiosRequest: {
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn()
      }
    }
  }
}));

describe('Consent Storage in Authorization', () => {
  beforeEach(() => {
    (global as any).localStorage = localStorageMock;
    (global as any).window = {
      location: { hostname: 'test.example.com' }
    };
    (global as any).navigator = { userAgent: 'test-user-agent' };

    jest.clearAllMocks();
    // Reset Date.now to a known value
    jest.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('setVisitorUsageTracked', () => {
    let setVisitorUsageTracked: (consent: boolean) => void;

    beforeEach(async () => {
      // Import and initialize after mocks are set up
      const { initialize } = await import('.');
      const auth = initialize('test-api-key');
      setVisitorUsageTracked = auth.setVisitorUsageTracked;
    });

    it('should store consent timestamp when consent is granted for the first time', () => {
      localStorageMock.getItem.mockReturnValue(null); // No existing consent

      setVisitorUsageTracked(true);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        SHARED_PREF_CONSENT_TIMESTAMP,
        '1234567890'
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        SHARED_PREF_UNKNOWN_USAGE_TRACKED,
        'true'
      );
    });

    it('should not overwrite existing consent timestamp when consent is granted again', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_CONSENT_TIMESTAMP) return '9876543210'; // Existing timestamp
        return null;
      });

      setVisitorUsageTracked(true);

      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        SHARED_PREF_CONSENT_TIMESTAMP,
        expect.any(String)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        SHARED_PREF_UNKNOWN_USAGE_TRACKED,
        'true'
      );
    });

    it('should remove consent timestamp when consent is revoked', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) return 'true';
        return null;
      });

      setVisitorUsageTracked(false);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_CONSENT_TIMESTAMP
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREFS_CRITERIA
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_UNKNOWN_USER_ID
      );
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_UNKNOWN_USAGE_TRACKED
      );
    });

    it('should set unknown usage tracked to false when consent is revoked', () => {
      setVisitorUsageTracked(false);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        SHARED_PREF_UNKNOWN_USAGE_TRACKED,
        'false'
      );
    });
  });

  describe('setVisitorUsageTracked with JWT', () => {
    let setVisitorUsageTracked: (consent: boolean) => void;

    beforeEach(async () => {
      // Mock JWT function
      const mockGenerateJWT = jest.fn().mockResolvedValue('mock-jwt-token');

      const { initialize } = await import('.');
      const auth = initialize('test-api-key', mockGenerateJWT);
      setVisitorUsageTracked = auth.setVisitorUsageTracked;
    });

    it('should store consent timestamp when consent is granted (JWT mode)', () => {
      localStorageMock.getItem.mockReturnValue(null); // No existing consent

      setVisitorUsageTracked(true);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        SHARED_PREF_CONSENT_TIMESTAMP,
        '1234567890'
      );
    });

    it('should remove consent timestamp when consent is revoked (JWT mode)', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === SHARED_PREF_UNKNOWN_USAGE_TRACKED) return 'true';
        return null;
      });

      setVisitorUsageTracked(false);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        SHARED_PREF_CONSENT_TIMESTAMP
      );
    });
  });
});

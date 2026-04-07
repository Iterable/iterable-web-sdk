import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';

describe('safeStorage', () => {
  describe('when localStorage is available', () => {
    it('should set and get items', () => {
      safeSetItem('test-key', 'test-value');
      expect(safeGetItem('test-key')).toBe('test-value');
    });

    it('should remove items', () => {
      safeSetItem('test-key', 'test-value');
      safeRemoveItem('test-key');
      expect(safeGetItem('test-key')).toBeNull();
    });

    it('should return null for missing keys', () => {
      expect(safeGetItem('nonexistent-key')).toBeNull();
    });
  });

  describe('when localStorage throws', () => {
    const originalLocalStorage = global.localStorage;

    beforeEach(() => {
      // Simulate an environment where localStorage throws on access
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('localStorage is not available');
          },
          setItem: () => {
            throw new Error('localStorage is not available');
          },
          removeItem: () => {
            throw new Error('localStorage is not available');
          }
        },
        writable: true,
        configurable: true
      });
    });

    afterEach(() => {
      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true
      });
    });

    it('should not throw on getItem', () => {
      expect(() => safeGetItem('any-key')).not.toThrow();
    });

    it('should not throw on setItem', () => {
      expect(() => safeSetItem('any-key', 'value')).not.toThrow();
    });

    it('should not throw on removeItem', () => {
      expect(() => safeRemoveItem('any-key')).not.toThrow();
    });
  });
});

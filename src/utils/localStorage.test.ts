/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @jest-environment jsdom
 */

describe('safeLocalStorage', () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
  });

  it('delegates to real localStorage when available', () => {
    const { safeLocalStorage } = require('./localStorage');

    safeLocalStorage.setItem('test-key', 'test-value');
    expect(localStorage.getItem('test-key')).toBe('test-value');

    expect(safeLocalStorage.getItem('test-key')).toBe('test-value');

    safeLocalStorage.removeItem('test-key');
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('falls back to in-memory storage when localStorage throws', () => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = jest.fn(() => {
      throw new DOMException('QuotaExceededError');
    });

    const { safeLocalStorage } = require('./localStorage');

    Storage.prototype.setItem = originalSetItem;

    expect(() => safeLocalStorage.setItem('key', 'value')).not.toThrow();
    expect(safeLocalStorage.getItem('key')).toBe('value');

    safeLocalStorage.removeItem('key');
    expect(safeLocalStorage.getItem('key')).toBeNull();
  });

  it('returns null for missing keys', () => {
    const { safeLocalStorage } = require('./localStorage');
    expect(safeLocalStorage.getItem('nonexistent')).toBeNull();
  });
});

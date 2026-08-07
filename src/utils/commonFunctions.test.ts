import { migrateLegacyKey } from './commonFunctions';

describe('migrateLegacyKey', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('moves legacy value to the new key and removes the old key', () => {
    localStorage.setItem('unknown_userId', 'abc-123');
    migrateLegacyKey('unknown_userId', 'itbl_userid_unknown');
    expect(localStorage.getItem('itbl_userid_unknown')).toBe('abc-123');
    expect(localStorage.getItem('unknown_userId')).toBeNull();
  });

  it('does not overwrite an existing value at the new key', () => {
    localStorage.setItem('itbl_userid_unknown', 'new-value');
    localStorage.setItem('unknown_userId', 'legacy-value');
    migrateLegacyKey('unknown_userId', 'itbl_userid_unknown');
    expect(localStorage.getItem('itbl_userid_unknown')).toBe('new-value');
    // Legacy is still cleaned up so we don't keep stale data around.
    expect(localStorage.getItem('unknown_userId')).toBeNull();
  });

  it('is a no-op when neither key has a value', () => {
    migrateLegacyKey('unknown_userId', 'itbl_userid_unknown');
    expect(localStorage.getItem('itbl_userid_unknown')).toBeNull();
    expect(localStorage.getItem('unknown_userId')).toBeNull();
  });

  it('is idempotent across multiple calls', () => {
    localStorage.setItem('unknown_userId', 'abc-123');
    migrateLegacyKey('unknown_userId', 'itbl_userid_unknown');
    migrateLegacyKey('unknown_userId', 'itbl_userid_unknown');
    expect(localStorage.getItem('itbl_userid_unknown')).toBe('abc-123');
    expect(localStorage.getItem('unknown_userId')).toBeNull();
  });
});

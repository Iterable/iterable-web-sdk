/**
 * Safe localStorage wrapper that gracefully handles environments where
 * localStorage is unavailable (mobile webviews, iOS Safari private browsing).
 * Falls back to an in-memory store for the duration of the session.
 *
 * See: https://github.com/Iterable/iterable-web-sdk/issues/524
 */

const createInMemoryStorage = (): Pick<
  Storage,
  'getItem' | 'setItem' | 'removeItem'
> => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    }
  };
};

const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__itbl_storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const fallbackStorage = createInMemoryStorage();
const localStorageAvailable = isLocalStorageAvailable();

/**
 * Delegates to the real localStorage when available, falling back to
 * in-memory storage otherwise. Uses delegation (not a static reference)
 * so that test mocks on the global localStorage are respected.
 */
export const safeLocalStorage: Pick<
  Storage,
  'getItem' | 'setItem' | 'removeItem'
> = {
  getItem: (key: string): string | null =>
    localStorageAvailable
      ? localStorage.getItem(key)
      : fallbackStorage.getItem(key),
  setItem: (key: string, value: string): void =>
    localStorageAvailable
      ? localStorage.setItem(key, value)
      : fallbackStorage.setItem(key, value),
  removeItem: (key: string): void =>
    localStorageAvailable
      ? localStorage.removeItem(key)
      : fallbackStorage.removeItem(key)
};

/**
 * Safe localStorage wrapper with feature detection.
 *
 * In environments where localStorage is unavailable (mobile webviews,
 * iOS Safari private browsing, etc.), all operations fall back to an
 * in-memory store so the SDK never throws.
 */

const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__iterable_ls_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const localStorageAvailable = isLocalStorageAvailable();

export function safeGetItem(key: string): string | null {
  if (localStorageAvailable) {
    try {
      return localStorage.getItem(key);
    } catch {
      return memoryStore[key] ?? null;
    }
  }
  return memoryStore[key] ?? null;
}

export function safeSetItem(key: string, value: string): void {
  if (localStorageAvailable) {
    try {
      localStorage.setItem(key, value);
      return;
    } catch {
      // fall through to memory store
    }
  }
  memoryStore[key] = value;
}

export function safeRemoveItem(key: string): void {
  if (localStorageAvailable) {
    try {
      localStorage.removeItem(key);
      return;
    } catch {
      // fall through to memory store
    }
  }
  delete memoryStore[key];
}

/**
 * A Storage-compatible object that can be passed where the SDK
 * currently expects a Storage parameter (e.g. functions.ts).
 */
export const safeStorage: Storage = {
  get length() {
    if (localStorageAvailable) {
      try {
        return localStorage.length;
      } catch {
        return Object.keys(memoryStore).length;
      }
    }
    return Object.keys(memoryStore).length;
  },
  key(index: number) {
    if (localStorageAvailable) {
      try {
        return localStorage.key(index);
      } catch {
        return Object.keys(memoryStore)[index] ?? null;
      }
    }
    return Object.keys(memoryStore)[index] ?? null;
  },
  getItem: safeGetItem,
  setItem: safeSetItem,
  removeItem: safeRemoveItem,
  clear() {
    if (localStorageAvailable) {
      try {
        localStorage.clear();
        return;
      } catch {
        // fall through
      }
    }
    Object.keys(memoryStore).forEach((key) => {
      delete memoryStore[key];
    });
  }
};

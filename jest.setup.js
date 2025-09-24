import { webcrypto } from 'crypto';

Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  })
});

Object.defineProperty(global, 'navigator', {
  writable: true,
  value: {
    userAgent: 'some-user-agent'
  }
});

const store = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: jest.fn((key) => (key in store ? store[key] : null)),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    })
  },
  writable: true
});

Object.defineProperty(global, 'crypto', { value: webcrypto });

process.env.VERSION = 'mock-version';

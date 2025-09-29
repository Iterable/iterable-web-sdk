import { webcrypto } from 'crypto';

process.env.VERSION = 'mock-version';

const mockGlobalProperty = (property, value) => {
  Object.defineProperty(global, property, { writable: true, value });
};

mockGlobalProperty('crypto', webcrypto);

const store = {};
mockGlobalProperty('localStorage', {
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
});

mockGlobalProperty('matchMedia', (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // Deprecated
  removeListener: jest.fn(), // Deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));

mockGlobalProperty('navigator', { userAgent: 'some-user-agent' });

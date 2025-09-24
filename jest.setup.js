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

Object.defineProperty(global, 'crypto', { value: webcrypto });

process.env.VERSION = 'mock-version';

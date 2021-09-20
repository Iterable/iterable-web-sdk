/* eslint-disable no-undef */
Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: true,
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
  value: () => ({
    userAgent: 'some-user-agent'
  })
});

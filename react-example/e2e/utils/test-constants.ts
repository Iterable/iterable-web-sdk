/**
 * Shared test constants
 * Single source of truth for test configuration values
 */

export const TEST_EMAIL =
  process.env.LOGIN_EMAIL || 'websdk-playwright-test@iterable.com';

export const API_TIMEOUTS = {
  standard: 15000,
  short: 5000,
  iframe: 10000
} as const;

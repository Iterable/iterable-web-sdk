import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Optimized worker count for CI vs local development */
  workers: process.env.CI ? 4 : undefined,
  /* Global timeout - optimized for CI performance */
  timeout: process.env.CI ? 45000 : 30000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['github'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:8080',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on test failure */
    screenshot: 'only-on-failure',

    /* Record video on test failure */
    video: 'on-first-retry',

    /* Action timeout - optimized for CI performance */
    actionTimeout: 8000,

    /* Navigation timeout - optimized for CI performance */
    navigationTimeout: 25000,

    /* Configure testIdAttribute for getByTestId() */
    testIdAttribute: 'data-test'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        /* Minimal CI flags - only proven reliable ones */
        launchOptions: process.env.CI
          ? {
              args: [
                '--no-sandbox', // Essential for CI
                '--disable-dev-shm-usage' // Prevent /dev/shm issues
              ]
            }
          : undefined
      }
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        /* Firefox works well with minimal flags */
        launchOptions: process.env.CI
          ? {
              args: ['--headless'] // Only flag needed for Firefox CI
            }
          : undefined
      }
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
        // WebKit works best with NO flags - prevents crashes
      }
    }
  ]
});

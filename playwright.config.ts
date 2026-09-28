import { defineConfig, devices } from '@playwright/test';

const criosUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.101 Mobile/15E148 Safari/604.1';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 30000,
  reporter: process.env.CI ? 'line' : 'list',
  projects: [
    {
      name: 'webkit-crios',
      grep: /Chrome on iOS/,
      use: {
        ...devices['iPhone 15'],
        userAgent: criosUserAgent
      }
    },
    {
      name: 'chromium',
      grep: /Chromium/,
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
});

# E2E Testing with Playwright

This directory contains end-to-end (E2E) tests for the Iterable Web SDK React example application using [Playwright](https://playwright.dev/).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Page Object Model](#page-object-model)
- [Configuration](#configuration)
- [Writing New Tests](#writing-new-tests)
- [Debugging Tests](#debugging-tests)
- [CI/CD](#cicd)

## Prerequisites

Before running the E2E tests, ensure you have:

1. **Node.js**: Version 18.12.0 or higher (as specified in `package.json`)
2. **React Example App Running**: The tests expect the application to be running on `http://localhost:8080`

## Installation

1. **Start the sample app** (from the SDK root directory):
   ```bash
   yarn install:all && yarn start:all:react
   ```
   This starts both the SDK and React sample app. Navigate to `http://localhost:8080` in your browser.
   
   > **Note**: If port 8080 is taken, the app will run on the next available port (8081, 8082, etc.). Check the compilation logs for the specific port.

2. **Install Playwright browsers** (from the `react-example` directory):
   ```bash
   yarn playwright:install
   ```

## Running Tests

### Run E2E Tests

Once the application is running, you can execute the tests:

```bash
# Run all tests headlessly
yarn playwright

# Run tests with UI mode (interactive)
yarn playwright:ui

# Run tests in debug mode
yarn playwright:debug

# Run specific test file
yarn playwright authentication.spec.ts

# Run tests in a specific browser
yarn playwright --project=chromium
```

## Test Structure

The E2E tests are organized as follows:

```
e2e/
├── README.md                     # This file
├── authentication.spec.ts        # Authentication and navigation tests
├── uua-testing.spec.ts          # UUA (User Update Actions) testing page tests
└── page-objects/                # Page Object Model implementation
    ├── BasePage.ts              # Base page with common functionality
    ├── components/              # Reusable component objects
    │   ├── LoginForm.ts         # Login form interactions
    │   └── Navigation.ts        # Navigation component interactions
    └── pages/                   # Page-specific objects
        ├── EmbeddedMsgsPage.ts  # Embedded messages page
        ├── EmbeddedPage.ts      # Embedded page
        └── UUATestingPage.ts    # UUA testing page
```

## Page Object Model

This project uses the Page Object Model (POM) pattern to organize test code:

### BasePage
- **Location**: `page-objects/BasePage.ts`
- **Purpose**: Contains common functionality shared across all pages
- **Features**: Cookie consent handling, page loading utilities, navigation access

### Components
- **Navigation**: Handles navigation between different sections of the app
- **LoginForm**: Manages user authentication flows

### Pages
- **UUATestingPage**: Handles interactions with the UUA testing endpoints
- **EmbeddedMsgsPage**: Manages embedded messages functionality
- **EmbeddedPage**: Handles embedded message display and interactions

## Configuration

The Playwright configuration is defined in `playwright.config.ts` (in the `react-example` root):

### Key Settings:
- **Base URL**: `http://localhost:8080`
- **Test Directory**: `./e2e`
- **Browsers**: Chromium, Firefox, WebKit
- **Retry Strategy**: 2 retries on CI, 0 locally
- **Test ID Attribute**: `data-test`
- **Screenshots**: On failure only
- **Video**: On first retry
- **Trace**: On first retry

### Timeouts:
- **Action Timeout**: 10 seconds
- **Navigation Timeout**: 30 seconds

## Writing New Tests

### 1. Create a Test File

Create a new `.spec.ts` file in the `e2e` directory:

```typescript
import { test, expect } from '@playwright/test';
import { YourPageObject } from './page-objects/pages/YourPageObject';

test.describe('Your Feature', () => {
  let yourPage: YourPageObject;

  test.beforeEach(async ({ page }) => {
    yourPage = new YourPageObject(page);
    await yourPage.goto();
    await yourPage.acceptCookies();
  });

  test('should do something', async () => {
    // Your test logic here
  });
});
```

### 2. Create Page Objects

If testing a new page, create a corresponding page object:

```typescript
// page-objects/pages/YourPageObject.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class YourPageObject extends BasePage {
  readonly yourElement: Locator;

  constructor(page: Page) {
    super(page);
    this.yourElement = page.getByTestId('your-element');
  }

  async goto() {
    await this.page.goto('/your-route');
    await this.waitForPageLoad();
  }

  async performAction() {
    await this.yourElement.click();
  }
}
```

### 3. Best Practices

- **Use `data-test` attributes** for element selection
- **Extend BasePage** for new page objects
- **Handle cookie consent** in `beforeEach` hooks
- **Use meaningful test descriptions**
- **Group related tests** in `describe` blocks
- **Wait for elements** to be visible before interacting

## Debugging Tests

### Debug Mode
```bash
yarn playwright:debug
```
This opens the Playwright Inspector, allowing you to step through tests.

### UI Mode
```bash
yarn playwright:ui
```
Provides an interactive UI to run and debug tests.

### View Test Reports
After running tests, view the HTML report:
```bash
npx playwright show-report
```

### Screenshots and Videos
Failed tests automatically capture:
- Screenshots (in `test-results/`)
- Videos (on retry)
- Traces (on retry)

## CI/CD

The configuration is optimized for CI environments:

- **Parallel Execution**: Disabled on CI for stability
- **Retries**: 2 retries on CI
- **Fail Fast**: Tests fail if `test.only` is left in code
- **Reporters**: HTML reports for detailed results

### Environment Variables
- `CI`: Enables CI-specific settings when set to any truthy value

## Troubleshooting

### Common Issues

1. **Application not running**: Ensure the sample app is running and accessible at `http://localhost:8080`

2. **Timeouts**: If tests are timing out, check if the application is responsive and consider increasing timeout values

3. **Element not found**: Verify that `data-test` attributes exist on the target elements

4. **Browser installation**: Run `yarn playwright:install` if browsers are missing

### Getting Help

- Check the [Playwright documentation](https://playwright.dev/docs/intro)
- Review existing test files for patterns and examples
- Use `playwright:debug` mode to step through failing tests

## Available Test Scripts

From the `react-example` directory:

```bash
yarn playwright              # Run all tests headlessly
yarn playwright:ui           # Run with interactive UI
yarn playwright:debug        # Run in debug mode
yarn playwright:install      # Install Playwright browsers
```

## Test Coverage

Current test files cover:

- **Authentication flows** (`authentication.spec.ts`)
- **UUA testing endpoints** (`uua-testing.spec.ts`)
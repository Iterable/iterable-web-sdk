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
- [Test Parallelization Best Practices](#test-parallelization-best-practices)

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
- **Parallelization**: Fully parallel test execution enabled
- **Workers**: 2 workers in CI, unlimited locally
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
yarn playwright show-report
```

### Screenshots and Videos
Failed tests automatically capture:
- Screenshots (in `test-results/`)
- Videos (on retry)
- Traces (on retry)

## CI/CD

The configuration is optimized for CI environments with performance improvements:

- **Parallel Execution**: Optimized with 2 workers per browser job for faster execution
- **Browser Matrix**: Tests run in parallel across Chromium, Firefox, and WebKit
- **Caching**: Playwright browsers are cached for faster subsequent runs
- **Retries**: 2 retries on CI
- **Fail Fast**: Tests fail if `test.only` is left in code
- **Reporters**: HTML reports for detailed results
- **Timeouts**: Extended timeout for slower CI environments

### Performance Optimizations
- **Browser Caching**: Using `actions/cache@v4` with intelligent cache keys
- **Matrix Strategy**: Isolated browser execution prevents cross-contamination
- **Fail-fast: false**: Allows completion of all browser tests even if one fails

### Environment Variables
- `CI`: Enables CI-specific settings when set to any truthy value

## Test Parallelization Best Practices

Playwright supports powerful parallelization features to speed up test execution. This project implements industry best practices optimized for both local development and CI environments.

### Current Configuration

Our setup uses a **hybrid parallelization approach**:

```typescript
// playwright.config.ts
fullyParallel: true,           // Allow tests within files to run in parallel
workers: process.env.CI ? 2 : undefined,  // 2 workers in CI, unlimited locally
```

```yaml
# GitHub Actions
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
  fail-fast: false  # Continue all browsers even if one fails
```

### Parallelization Levels

#### 1. **Browser-Level Parallelization** (Current Setup)
- **How**: GitHub Actions matrix strategy
- **What**: Run same tests across multiple browsers simultaneously
- **Files**: `ci.yml` configuration
- **Benefits**: 
  - ✅ Complete isolation between browsers
  - ✅ Reliable failure handling
  - ✅ Easy debugging per browser
  - ✅ Scales automatically with CI runners

#### 2. **Test-Level Parallelization** (Enabled)
- **How**: `fullyParallel: true` with worker configuration
- **What**: Multiple tests within same browser run concurrently
- **Files**: `playwright.config.ts` configuration
- **Benefits**:
  - ✅ Faster test execution
  - ✅ Efficient resource utilization
  - ✅ Scalable with available cores

### Performance Impact

| Configuration | Total Time* | Stability | Debug Difficulty |
|--------------|-------------|-----------|------------------|
| **Current (Recommended)** | 8 minutes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Single browser, many workers | 4 minutes | ⭐⭐⭐ | ⭐⭐ |
| Sequential browsers | 15 minutes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

*Example for 10 test files across 3 browsers

### When to Modify Current Setup

#### Increase Workers Beyond 2 (CI)
**When**: You need faster CI execution and tests are very independent
```typescript
workers: process.env.CI ? 4 : undefined
```
**Risks**: 
- More resource contention
- Flakier tests if shared state exists
- Harder debugging

#### Add Test Sharding
**When**: You have >20 test files and want parallel CI jobs
```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    shard: [1, 2, 3, 4]  # Split tests across 4 shards per browser
```

#### Disable Parallelization
**When**: Tests have shared state or external dependencies
```typescript
fullyParallel: false
workers: 1
```
**Use cases**:
- Tests modify shared database
- Tests depend on external APIs with rate limits
- Sequential operations are necessary

### Browser Selection Strategy

#### Matrix Strategy (Current - Recommended)
```yaml
matrix:
  browser: [chromium, firefox, webkit]
```
**Best for**: Most applications needing cross-browser validation

#### Single Browser Selection
**Chromium only**:
```yaml
matrix:
  browser: [chromium]
```
**Best for**: Fast iteration during development

#### Progressive Enhancement
```yaml
matrix:
  strategy:
    include:
      - browser: chromium
      - browser: firefox
        if: github.event_name == 'pull_request'
      - browser: webkit
        if: github.ref == 'refs/heads/main'
```
**Best for**: Stage-specific browser validation

### Performance Monitoring

Monitor test execution times to optimize:

```bash
# Local performance testing
yarn playwright --reporter=line

# Generate detailed timing report
yarn playwright --reporter=list
```

### Official Documentation References

For comprehensive parallelization strategies:

- **[Playwright Parallelization Guide](https://playwright.dev/docs/parallelization)**
- **[GitHub Actions Matrix Strategy](https://docs.github.com/en/actions/using-jobs/using-a-build-matrix)**
- **[Playwright CI Best Practices](https://playwright.dev/docs/ci)**
- **[Workers Configuration](https://playwright.dev/docs/test-parallel#workers)**

### Local Development Optimization

For fastest local development:
```bash
# Run single browser for iteration
yarn playwright --project=chromium

# Skip slow tests during development
yarn playwright --grep --invert "slow"
```

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
yarn playwright              # Run all tests in headless mode
yarn playwright:ui           # Run with interactive UI
yarn playwright:debug       # Run in debug mode
yarn playwright:install      # Install Playwright browsers
yarn playwright show-report  # View test results
```

## Test Coverage

Current test files cover:

- **Authentication flows** (`authentication.spec.ts`)
- **UUA testing endpoints** (`uua-testing.spec.ts`)
# Playwright E2E Tests for Iterable Web SDK

This directory contains **smoke tests** for the Iterable Web SDK sample application.

## 🎯 Current Test Coverage

We have **smoke tests** that verify end-to-end integration with Iterable's production APIs:

- **Commerce**: `updateCart` and `trackPurchase` endpoints
- **Events**: Event tracking endpoints (`track`, `trackInAppClick`, etc.)
- **Users**: User management endpoints (`updateUser`, `updateUserEmail`, `updateSubscriptions`)
- **In-App Messages**: Message fetching and display
- **Embedded Messages**: Embedded messaging functionality

## 📋 Prerequisites

### 1. Environment Setup

Create or verify `/react-example/.env`:

```bash
# E2E Web SDK JWT project
API_KEY=3edd1b6806864859b4ee0362f01c8dcb
JWT_SECRET=5b8b772de5474f57cff4b809850bfdab26e88543c8902676ed35ef5f3280280ea7a0e1910159e5063a25efde82d5af550530165d32921061a61a7c0f4ae18f6e

# Authentication mode
USE_JWT=true
JWT_GENERATOR=https://jwt-generator.stg-itbl.co/generate

# Test user for smoke tests
LOGIN_EMAIL=websdk-playwright-test@iterable.com
```

### 2. Iterable Platform Setup

The smoke tests require specific campaigns and data to be configured in Iterable. See `IMPLEMENTATION_GUIDE.md` for detailed setup instructions.

**Key test user**: `websdk-playwright-test@iterable.com`

## 🚀 Running Tests

### Start the Development Server

```bash
cd react-example
yarn start
```

The app will be available at http://localhost:8080

### Run All Smoke Tests

```bash
cd react-example
npx playwright test e2e/smoke
```

### Run Tests by Feature

```bash
# Commerce tests
npx playwright test e2e/smoke/commerce-smoke.spec.ts

# Events tests
npx playwright test e2e/smoke/events-smoke.spec.ts

# Users tests
npx playwright test e2e/smoke/users-smoke.spec.ts

# In-App Messages tests
npx playwright test e2e/smoke/inapp-smoke.spec.ts

# Embedded Messages tests
npx playwright test e2e/smoke/embedded-smoke.spec.ts
```

### Run on Specific Browser

```bash
npx playwright test e2e/smoke --project=chromium
npx playwright test e2e/smoke --project=firefox
npx playwright test e2e/smoke --project=webkit
```

### Debug Mode

```bash
npx playwright test e2e/smoke --debug
```

### UI Mode (Interactive)

```bash
npx playwright test e2e/smoke --ui
```

## 📁 Project Structure

```
e2e/
├── smoke/                          # Smoke tests (full E2E with Iterable)
│   ├── commerce-smoke.spec.ts
│   ├── events-smoke.spec.ts
│   ├── users-smoke.spec.ts
│   ├── inapp-smoke.spec.ts
│   └── embedded-smoke.spec.ts
├── page-objects/                   # Page Object Model
│   ├── BasePage.ts
│   ├── components/
│   │   └── LoginForm.ts
│   └── pages/
│       ├── CommercePage.ts
│       ├── EventsPage.ts
│       ├── UsersPage.ts
│       ├── InAppPage.ts
│       └── EmbeddedMsgsPage.ts
├── authentication.spec.ts          # Auth tests
├── uua-testing.spec.ts            # Unknown User Activation tests
└── README.md                       # This file
```

## 🧪 Test Strategy

### Smoke Tests (Current)
- ✅ **Full E2E**: Tests against actual Iterable production APIs
- ✅ **Critical Paths**: Verifies core SDK functionality works end-to-end
- ✅ **Real Data**: Uses real Iterable campaigns and test user
- ⚠️ **Dependency**: Requires Iterable platform setup and network connectivity

## 📝 Guidelines

### Test User
All smoke tests use: **`websdk-playwright-test@iterable.com`**

This is controlled by the `LOGIN_EMAIL` environment variable in `.env`.

### Best Practices
1. **Use Page Objects**: All UI interactions should go through page objects
2. **Use `data-qa-*` attributes**: For reliable element selection
3. **Handle Async Properly**: Always await SDK calls and use proper Playwright assertions
4. **Add Descriptive Test Names**: Test names should clearly describe what's being tested
5. **Group Related Tests**: Use `test.describe()` to organize tests by feature

### Adding New Tests
1. Create a new test file in `smoke/` directory
2. Import required page objects
3. Follow existing patterns for setup/teardown
4. Ensure tests use `websdk-playwright-test@iterable.com` as the test user

## 🔧 Troubleshooting

### Tests Fail with "User not logged in"
- Verify `.env` file has correct `API_KEY` and `JWT_SECRET`
- Ensure JWT generator endpoint is accessible
- Check that `websdk-playwright-test@iterable.com` exists in Iterable

### Tests Timeout
- Verify dev server is running at http://localhost:8080
- Check network connectivity to Iterable APIs
- Increase timeout in `playwright.config.ts` if needed

### "No campaigns found" Errors
- Verify campaigns are set up in Iterable platform
- Check that campaigns target `websdk-playwright-test@iterable.com`
- See `IMPLEMENTATION_GUIDE.md` for campaign setup

## 📚 Additional Documentation

- **`IMPLEMENTATION_GUIDE.md`**: Detailed setup instructions for Iterable platform
- **`TEST_STRATEGY.md`**: Overall testing strategy and architecture
- **`QUICK_START.md`**: Quick start guide
- **`CHANGES.md`**: Changelog of test suite changes

# Quick Start Guide - Playwright E2E Tests

Get up and running with the Iterable Web SDK smoke tests in minutes!

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
cd react-example
yarn install
```

### 2. Configure Environment

Verify `/react-example/.env` contains:

```bash
# E2E Web SDK JWT project
API_KEY=<your-api-key>
JWT_SECRET=<your-jwt-secret>

USE_JWT=true
JWT_GENERATOR=https://jwt-generator.stg-itbl.co/generate
LOGIN_EMAIL=websdk-playwright-test@iterable.com
```

### 3. Start Development Server

```bash
cd react-example
yarn start
```

The app will be available at http://localhost:8080

### 4. Run Tests

In a new terminal:

```bash
cd react-example
npx playwright test e2e/smoke
```

## 🎯 Common Commands

### Run All Smoke Tests
```bash
./e2e/run-tests.sh smoke
```

### Run Specific Feature Tests
```bash
./e2e/run-tests.sh commerce    # Commerce endpoints
./e2e/run-tests.sh events      # Event tracking
./e2e/run-tests.sh users       # User management
./e2e/run-tests.sh inapp       # In-app messages
./e2e/run-tests.sh embedded    # Embedded messages
```

### Debug Mode
```bash
./e2e/run-tests.sh debug
```

### Interactive UI Mode
```bash
./e2e/run-tests.sh ui
```

### View Test Report
```bash
./e2e/run-tests.sh report
```

## 📋 What Gets Tested

### ✅ Smoke Tests (Current)
These tests verify **end-to-end integration** with Iterable's production APIs:

1. **Commerce** (`commerce-smoke.spec.ts`)
   - Update cart functionality
   - Track purchase functionality

2. **Events** (`events-smoke.spec.ts`)
   - Custom event tracking
   - In-app event tracking (click, open, close, delivery)

3. **Users** (`users-smoke.spec.ts`)
   - Update user data
   - Update user email
   - Update subscriptions

4. **In-App Messages** (`inapp-smoke.spec.ts`)
   - Fetch and display messages
   - Auto-display functionality
   - Message count and display

5. **Embedded Messages** (`embedded-smoke.spec.ts`)
   - Fetch embedded messages
   - Display messages
   - Style and view selection

## ⚠️ Prerequisites

### Iterable Platform Setup Required

**The smoke tests require specific campaigns to be configured in Iterable.**

See `IMPLEMENTATION_GUIDE.md` for detailed setup instructions including:
- Campaign creation
- Message templates
- Targeting configuration
- API configuration

**Test User**: All tests use `websdk-playwright-test@iterable.com`

## 🔧 Troubleshooting

### Dev Server Not Running
```bash
Error: connect ECONNREFUSED 127.0.0.1:8080
```
**Solution**: Start the dev server with `yarn start` in the `react-example` directory.

### Authentication Failures
```bash
Error: JWT generation failed
```
**Solution**: Verify `.env` file has correct `API_KEY`, `JWT_SECRET`, and `JWT_GENERATOR` URL.

### Tests Timeout
```bash
Error: Test timeout of 30000ms exceeded
```
**Solutions**:
- Check network connectivity to Iterable APIs
- Verify Iterable campaigns are active and properly configured
- Check `websdk-playwright-test@iterable.com` user exists in Iterable

### No Messages Found
```bash
Error: Expected messages but got 0
```
**Solution**: Verify campaigns in Iterable are:
- Active and not expired
- Targeting `websdk-playwright-test@iterable.com`
- Configured correctly (see `IMPLEMENTATION_GUIDE.md`)

## 📚 Next Steps

1. **Review Test Results**: Check the HTML report after running tests
2. **Configure Iterable**: Follow `IMPLEMENTATION_GUIDE.md` to set up required campaigns
3. **Understand Test Strategy**: Read `TEST_STRATEGY.md` for architecture overview
4. **Add New Tests**: Follow patterns in existing smoke tests

## 💡 Pro Tips

### Run on Specific Browser
```bash
npx playwright test e2e/smoke --project=chromium
npx playwright test e2e/smoke --project=firefox
npx playwright test e2e/smoke --project=webkit
```

### Run Tests in Parallel
```bash
npx playwright test e2e/smoke --workers=4
```

### Generate New Test
```bash
npx playwright codegen http://localhost:8080
```

### Update Snapshots (if using visual regression)
```bash
npx playwright test --update-snapshots
```

## 📖 Documentation

- **README.md**: Complete test suite documentation
- **IMPLEMENTATION_GUIDE.md**: Iterable platform setup guide
- **TEST_STRATEGY.md**: Testing strategy and architecture
- **CHANGES.md**: Changelog of test suite updates

## 🆘 Need Help?

1. Check the documentation files in the `e2e/` directory
2. Review existing test files for examples
3. Check Playwright documentation: https://playwright.dev
4. Check Iterable Web SDK docs: https://support.iterable.com/hc/en-us/articles/10359708795796

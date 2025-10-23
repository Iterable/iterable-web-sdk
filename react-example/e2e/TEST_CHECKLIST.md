# E2E Test Verification Checklist

## ✅ Pre-Test Setup

### Environment
- [ ] Node.js installed (check version in package.json)
- [ ] Dependencies installed: `yarn install`
- [ ] Playwright browsers installed: `yarn playwright:install`
- [ ] Dev server can start: `yarn start`

### Feature Tests (Mock) - No Iterable Setup
- [ ] Auth mocks configured (✅ done in code)
- [ ] API mocks configured (✅ done in code)
- [ ] JWT endpoint mocked (✅ done in code)

### Smoke Tests (Real API) - Requires Iterable Setup
- [ ] API_KEY environment variable set
- [ ] JWT_SECRET environment variable set  
- [ ] LOGIN_EMAIL set to `websdk-playwright-test@iterable.com`
- [ ] USE_JWT set to `true`
- [ ] Test user exists in Iterable project

## 📝 Test Execution Checklist

### Step 1: Run Feature Tests
```bash
cd react-example
yarn start  # Terminal 1

# Terminal 2
yarn playwright --grep @feature
```

**Expected Results**:
- [ ] All Commerce tests pass (8 tests)
- [ ] All Events tests pass (7 tests)
- [ ] All Users tests pass (8 tests)
- [ ] All In-App tests pass (9 tests)
- [ ] All Embedded tests pass (11 tests)
- [ ] **Total: ~43 tests PASS** ✅

### Step 2: Verify Test Infrastructure
```bash
./e2e/verify-tests.sh
```

**Expected Output**:
- [ ] Dependencies installed
- [ ] Playwright installed
- [ ] Test files found (10 files)
- [ ] Page objects found (5 files)
- [ ] Mock files found (4 files)
- [ ] TypeScript compiles successfully

### Step 3: Configure Iterable for Smoke Tests

#### A. In-App Message Campaign
- [ ] Campaign created in Iterable
- [ ] Campaign type: In-App Message
- [ ] Package name: `my-website`
- [ ] Position: Center (Modal)
- [ ] Priority: Medium (300.5)
- [ ] Message has HTML content
- [ ] Audience includes `websdk-playwright-test@iterable.com`
- [ ] Campaign is ACTIVE

#### B. Embedded Message Campaign
- [ ] Campaign created in Iterable
- [ ] Campaign type: Embedded Message
- [ ] Package name: `my-website`
- [ ] Test placement created
- [ ] Message has title and body
- [ ] Message has at least one button
- [ ] Audience includes `websdk-playwright-test@iterable.com`
- [ ] Campaign is ACTIVE

### Step 4: Run Smoke Tests
```bash
export API_KEY=<your-key>
export JWT_SECRET=<your-secret>
export USE_JWT=true
export LOGIN_EMAIL=websdk-playwright-test@iterable.com

yarn playwright --grep @smoke
```

**Expected Results**:
- [ ] Commerce smoke tests pass (2 tests)
- [ ] Events smoke tests pass (1 test)
- [ ] In-App smoke tests pass (2 tests)
- [ ] Users smoke tests pass (2 tests)
- [ ] Embedded smoke tests pass (3 tests)
- [ ] **Total: ~10 tests PASS** ✅

### Step 5: Run All Tests
```bash
yarn playwright
```

**Expected Results**:
- [ ] Feature tests pass (~43 tests)
- [ ] Smoke tests pass (~10 tests)
- [ ] Authentication tests pass (~4 tests)
- [ ] UUA tests pass (~1 test)
- [ ] **Total: ~58 tests PASS** ✅

## 🔍 Verification Commands

### Check Test Files
```bash
# Count test files
find e2e -name "*.spec.ts" | wc -l
# Expected: 10 files

# List all tests
yarn playwright test --list

# Check for syntax errors
yarn tsc --noEmit --project e2e/tsconfig.json
```

### Check Page Objects
```bash
# Count page objects
find e2e/page-objects/pages -name "*.ts" | wc -l
# Expected: 6 files

# Verify locators
grep -r "getByTestId" e2e/page-objects/pages/
```

### Check Mocks
```bash
# Count mock files
find e2e/mocks -name "*.ts" | wc -l
# Expected: 4 files

# Verify auth mocks
grep -r "setupAuthMocks" e2e/features/
```

## 🐛 Common Issues & Solutions

### Feature Tests

| Issue | Solution |
|-------|----------|
| Login fails | Auth mocks configured (✅ done) |
| API calls fail | Check specific mock setup in test |
| Timeout errors | Increase timeout or check selectors |

### Smoke Tests

| Issue | Solution |
|-------|----------|
| No messages found | Create campaigns in Iterable |
| JWT errors | Verify JWT_SECRET is correct |
| API key errors | Check API_KEY environment variable |
| User not found | Verify test user exists in project |

## 📊 Success Metrics

### Code Quality
- [ ] No TypeScript errors: `yarn tsc --noEmit`
- [ ] No linter errors: `yarn lint`
- [ ] All tests pass: `yarn playwright`

### Test Coverage
- [ ] Commerce: 10 tests (2 smoke + 8 feature)
- [ ] Events: 8 tests (1 smoke + 7 feature)
- [ ] Users: 10 tests (2 smoke + 8 feature)
- [ ] In-App: 11 tests (2 smoke + 9 feature)
- [ ] Embedded: 14 tests (3 smoke + 11 feature)
- [ ] Auth & UUA: 5 tests
- [ ] **Total: 58+ tests**

### Performance
- [ ] Feature tests < 3 minutes
- [ ] Smoke tests < 6 minutes
- [ ] Total suite < 10 minutes
- [ ] Flakiness rate < 1%

## 🎯 CI/CD Checklist

### GitHub Actions
- [ ] CI workflow file exists: `.github/workflows/ci.yml`
- [ ] API_KEY secret configured
- [ ] JWT_SECRET secret configured
- [ ] Tests run on push
- [ ] Tests run on PR
- [ ] Tests run on multiple browsers (Chromium, Firefox, WebKit)
- [ ] Test reports uploaded as artifacts

### Local CI Simulation
```bash
# Run tests like CI does
yarn playwright --project=chromium
yarn playwright --project=firefox
yarn playwright --project=webkit
```

## 📈 Final Verification

### Before Committing
- [ ] All feature tests pass locally
- [ ] All smoke tests pass locally (if Iterable configured)
- [ ] No linter errors
- [ ] No TypeScript errors
- [ ] Documentation updated

### After Pushing
- [ ] CI pipeline passes
- [ ] All tests green on GitHub
- [ ] Test reports available
- [ ] No new flaky tests introduced

## 🎉 Completion Criteria

**Feature Tests (Immediate)**:
- ✅ All 43 feature tests pass
- ✅ No setup required
- ✅ Fast execution (~2 minutes)

**Smoke Tests (After Iterable Setup)**:
- ✅ All 10 smoke tests pass
- ✅ Campaigns created in Iterable
- ✅ End-to-end validation complete

**Overall**:
- ✅ 58+ total tests passing
- ✅ Hybrid strategy validated
- ✅ CI/CD pipeline green
- ✅ Documentation complete

---

## 📝 Notes

- **Feature tests should pass immediately** without any Iterable configuration
- **Smoke tests require Iterable setup** as detailed in IMPLEMENTATION_GUIDE.md
- **Test user email**: Always use `websdk-playwright-test@iterable.com` for smoke tests
- **Mock data**: Used for feature tests, defined in `e2e/mocks/` directory
- **Real API**: Used for smoke tests, requires environment variables

---

**Next Action**: Run feature tests to verify test infrastructure! 🚀

```bash
./e2e/run-tests.sh feature
```


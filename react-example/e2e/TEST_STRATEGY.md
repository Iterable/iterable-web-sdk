# Iterable Web SDK - E2E Test Strategy

## Executive Summary

This document outlines the comprehensive E2E testing strategy for Iterable's Web SDK using Playwright. The strategy combines a **hybrid approach** using both real API calls for critical smoke tests and mock data for extensive feature coverage.

## Testing Approach: Hybrid Strategy

### Recommended Approach (Industry Best Practice)

Based on Playwright best practices and community standards, we recommend a **pyramid approach**:

1. **Smoke Tests (10-15 tests)** → Use Real Iterable API
   - Tests critical paths end-to-end
   - Validates actual integration with Iterable platform
   - Runs on every PR/commit
   - Expected to be slower but provides highest confidence

2. **Feature Tests (50-100 tests)** → Use Mock Data
   - Tests individual features and edge cases
   - Fast, reliable, and isolated
   - No external dependencies
   - Can test error scenarios easily

3. **Integration Tests (20-30 tests)** → Hybrid (some real, some mock)
   - Tests interactions between features
   - Uses mocks for most but real API for critical flows

### Why This Hybrid Approach?

**Advantages of Real API (Smoke Tests)**:
- ✅ Validates true end-to-end functionality
- ✅ Catches integration issues with Iterable platform
- ✅ Tests actual network latency and error handling
- ✅ Provides highest confidence for critical paths
- ❌ Slower execution
- ❌ Requires production/staging environment
- ❌ Can be flaky due to network issues

**Advantages of Mock Data (Feature Tests)**:
- ✅ Fast and reliable execution
- ✅ No external dependencies
- ✅ Easy to test edge cases and error scenarios
- ✅ Consistent test results
- ✅ Can run offline
- ❌ Doesn't catch integration issues
- ❌ Mock data can drift from real API

## Features to Test

Based on the Web SDK and react-example app, the following features need testing:

### 1. Authentication & JWT
- ✅ **Already implemented**: `authentication.spec.ts`
- Email login
- UserID login
- JWT token refresh
- Logout functionality

### 2. Commerce
- Update cart
- Track purchase
- Commerce data validation
- Error handling

### 3. Events Tracking
- track() - custom events
- trackInAppClick
- trackInAppClose
- trackInAppConsume
- trackInAppDelivery
- trackInAppOpen
- Event data fields
- Error responses

### 4. Users
- updateUser
- updateUserEmail
- updateSubscriptions
- Data field updates
- Email list management

### 5. In-App Messages
- Get messages (raw)
- Get messages (auto-display)
- Message display
- Pause/resume message stream
- Message priority sorting
- Message filtering
- Close button functionality
- Display intervals

### 6. Embedded Messages
- Fetch embedded messages
- Card view rendering
- Banner view rendering
- Notification view rendering
- Custom styles application
- Default styles
- Button click tracking
- URL handling
- Custom action handling
- Message update callbacks

### 7. Embedded Events
- trackEmbeddedReceived
- trackEmbeddedClick
- trackEmbeddedSession
- Session tracking
- Impression tracking

### 8. Unknown User Activation (UUA)
- ✅ **Already implemented**: `uua-testing.spec.ts`
- Cookie consent acceptance
- Cookie consent decline
- Unknown user tracking
- Event queuing
- User merge on identification

## Test Cases

### SMOKE TESTS (Real API - Critical Paths)

#### Authentication & Core Setup
1. ✅ **DONE** - Login with email and JWT
2. ✅ **DONE** - Login with userID and JWT
3. **NEW** - JWT token refresh before expiration
4. **NEW** - Logout and clear session

#### In-App Messages (Critical)
5. **NEW** - Fetch in-app messages for logged-in user
6. **NEW** - Display in-app message automatically
7. **NEW** - Close in-app message

#### Embedded Messages (Critical)
8. **NEW** - Fetch embedded messages for logged-in user
9. **NEW** - Display embedded card view
10. **NEW** - Click embedded message button

#### Events (Critical)
11. **NEW** - Track custom event
12. **NEW** - Track purchase event

#### UUA (Critical)
13. ✅ **DONE** - Accept cookies and track unknown user
14. **NEW** - Merge unknown user to known user

### FEATURE TESTS (Mock Data - Extensive Coverage)

#### Commerce Feature Tests (Mock)
15. **NEW** - Update cart with single item
16. **NEW** - Update cart with multiple items
17. **NEW** - Update cart with invalid data
18. **NEW** - Track purchase with valid data
19. **NEW** - Track purchase with missing required fields
20. **NEW** - Track purchase response handling

#### Events Feature Tests (Mock)
21. **NEW** - Track custom event with data fields
22. **NEW** - Track custom event without data fields
23. **NEW** - Track in-app click event
24. **NEW** - Track in-app close event
25. **NEW** - Track in-app consume event
26. **NEW** - Track in-app delivery event
27. **NEW** - Track in-app open event
28. **NEW** - Event tracking error scenarios

#### Users Feature Tests (Mock)
29. **NEW** - Update user with single data field
30. **NEW** - Update user with nested objects
31. **NEW** - Update user email
32. **NEW** - Update subscriptions with email list IDs
33. **NEW** - User update validation errors

#### In-App Messages Feature Tests (Mock)
34. **NEW** - Get messages in deferred mode
35. **NEW** - Get messages with count parameter
36. **NEW** - Message sorting by priority
37. **NEW** - Message filtering (hidden messages)
38. **NEW** - Pause message stream
39. **NEW** - Resume message stream
40. **NEW** - Message display interval timing
41. **NEW** - Close button customization
42. **NEW** - Display position variations
43. **NEW** - Handle empty message response

#### Embedded Messages Feature Tests (Mock)
44. **NEW** - Fetch embedded messages with placement IDs
45. **NEW** - Display card view with default styles
46. **NEW** - Display card view with custom styles
47. **NEW** - Display banner view with default styles
48. **NEW** - Display banner view with custom styles
49. **NEW** - Display notification view with default styles
50. **NEW** - Display notification view with custom styles
51. **NEW** - Switch between view types
52. **NEW** - Handle no messages state
53. **NEW** - Custom action handler invocation
54. **NEW** - URL handler invocation
55. **NEW** - Multiple messages rendering

#### Embedded Events Feature Tests (Mock)
56. **NEW** - Track embedded received event
57. **NEW** - Track embedded click event
58. **NEW** - Track embedded session with impressions
59. **NEW** - Session start and end
60. **NEW** - Impression counting

#### UUA Feature Tests (Mock)
61. **NEW** - Decline cookies
62. **NEW** - Unknown event queuing
63. **NEW** - Event replay after identification
64. **NEW** - Clear unknown user data
65. **NEW** - Unknown session management

#### Navigation & UI Tests (Mock)
66. ✅ **DONE** - Navigate to all sections
67. ✅ **DONE** - Maintain state across navigation
68. **NEW** - Form validation across all endpoints
69. **NEW** - Response display formatting
70. **NEW** - Loading states during API calls

#### Error Handling Tests (Mock)
71. **NEW** - Handle 401 unauthorized
72. **NEW** - Handle 400 bad request
73. **NEW** - Handle network errors
74. **NEW** - Handle timeout errors
75. **NEW** - Handle malformed responses

## Test Organization

```
react-example/e2e/
├── smoke/                          # Real API smoke tests
│   ├── auth-smoke.spec.ts
│   ├── inapp-smoke.spec.ts
│   ├── embedded-smoke.spec.ts
│   └── events-smoke.spec.ts
├── features/                       # Mock data feature tests
│   ├── commerce.spec.ts
│   ├── events.spec.ts
│   ├── users.spec.ts
│   ├── inapp.spec.ts
│   ├── embedded.spec.ts
│   └── uua.spec.ts
├── mocks/                          # Mock data and utilities
│   ├── commerce-mocks.ts
│   ├── inapp-mocks.ts
│   ├── embedded-mocks.ts
│   └── mock-helpers.ts
├── page-objects/                   # Page Object Model
│   ├── BasePage.ts
│   ├── pages/
│   │   ├── CommercePage.ts
│   │   ├── EventsPage.ts
│   │   ├── UsersPage.ts
│   │   ├── InAppPage.ts
│   │   ├── EmbeddedMsgsPage.ts
│   │   └── EmbeddedPage.ts
│   └── components/
│       ├── LoginForm.ts
│       └── Navigation.ts
└── fixtures/
    ├── index.ts
    └── test-data.ts
```

## Implementation Priority

### Phase 1 - Foundation (Week 1)
1. Create page objects for all views
2. Set up mock infrastructure
3. Implement Commerce feature tests (mock)
4. Implement Events feature tests (mock)

### Phase 2 - Core Features (Week 2)
5. Implement Users feature tests (mock)
6. Implement In-App messages feature tests (mock)
7. Create smoke tests for In-App (real API)

### Phase 3 - Embedded (Week 3)
8. Implement Embedded messages feature tests (mock)
9. Implement Embedded events tests (mock)
10. Create smoke tests for Embedded (real API)

### Phase 4 - Polish (Week 4)
11. Implement error handling tests
12. Add integration tests
13. CI/CD optimization
14. Documentation updates

## Real API Test Requirements

For smoke tests using real Iterable API, you'll need to set up:

### Required Campaigns in Iterable

#### 1. In-App Message Campaign
```
Campaign Type: In-App
Message Type: Modal/Full Screen/Bottom/Top
Package Name: my-website
Content: Simple HTML with title and CTA button
Trigger: When user logs in
```

#### 2. Embedded Message Campaign  
```
Campaign Type: Embedded
Placement: Test Placement (ID: TBD)
Package Name: my-website
Elements:
  - Title: "Test Embedded Message"
  - Body: "This is a test message"
  - Button: "Click Me"
  - Image URL: (optional)
```

#### 3. Event Tracking Setup
```
- Custom event: "test-event"
- In-app events enabled
- Embedded events enabled
```

### API Configuration
```typescript
// Environment variables needed
API_KEY=<your-test-api-key>
JWT_SECRET=<your-jwt-secret>
LOGIN_EMAIL=websdk-playwright-test@iterable.com
USE_JWT=true
```

## Mock Data Strategy

For feature tests, we'll create comprehensive mocks:

### Mock Structure
```typescript
// mocks/inapp-mocks.ts
export const mockInAppMessages = {
  success: {
    inAppMessages: [
      {
        messageId: "test-message-1",
        campaignId: 12345,
        content: { html: "<div>Test</div>" },
        // ... full message structure
      }
    ]
  },
  empty: { inAppMessages: [] },
  error: { code: "BadApiKey", msg: "Invalid API key" }
};
```

### HAR File Recording
For complex flows, we can record HAR files:
```bash
# Record real API interactions
npx playwright codegen --save-har=api-recording.har https://localhost:3000

# Use HAR file in tests
await page.routeFromHAR('api-recording.har');
```

## Success Metrics

- **Coverage**: Aim for 80%+ feature coverage
- **Smoke Tests**: < 5 minutes execution time
- **Feature Tests**: < 10 minutes execution time  
- **Flakiness**: < 1% test flakiness rate
- **Maintenance**: Tests should be self-documenting and easy to update

## Next Steps

1. ✅ Review and approve this strategy
2. 🔲 You set up required campaigns in Iterable for smoke tests
3. 🔲 Create page objects for all views
4. 🔲 Implement Phase 1 tests
5. 🔲 Iterate based on feedback


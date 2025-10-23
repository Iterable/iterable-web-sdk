# Iterable Web SDK - E2E Test Implementation Guide

## Overview

This guide provides detailed instructions for running the E2E tests and setting up required data in Iterable for smoke tests.

## Test Structure

```
react-example/e2e/
├── smoke/                   # Real API smoke tests (10-15 tests)
│   ├── commerce-smoke.spec.ts
│   ├── events-smoke.spec.ts
│   ├── inapp-smoke.spec.ts
│   └── users-smoke.spec.ts
├── features/                # Mock data feature tests (50+ tests)
│   ├── commerce.spec.ts
│   ├── events.spec.ts
│   ├── users.spec.ts
│   ├── inapp.spec.ts
│   └── embedded.spec.ts
├── mocks/                   # Mock data utilities
│   ├── commerce-mocks.ts
│   ├── events-mocks.ts
│   └── inapp-mocks.ts
├── page-objects/            # Page Object Model
│   └── pages/
│       ├── CommercePage.ts
│       ├── EventsPage.ts
│       ├── UsersPage.ts
│       ├── InAppPage.ts
│       └── EmbeddedMsgsPage.ts
└── authentication.spec.ts   # Existing auth tests
└── uua-testing.spec.ts      # Existing UUA tests
```

## Running Tests

### Run All Tests
```bash
cd react-example
yarn playwright
```

### Run Only Smoke Tests (Real API)
```bash
yarn playwright --grep @smoke
```

### Run Only Feature Tests (Mock)
```bash
yarn playwright --grep @feature
```

### Run Specific Test Suite
```bash
yarn playwright smoke/commerce-smoke.spec.ts
yarn playwright features/commerce.spec.ts
```

### Run in UI Mode (Debug)
```bash
yarn playwright --ui
```

### Run in Headed Mode
```bash
yarn playwright --headed
```

## Test Tags

- `@smoke` - Critical smoke tests using real Iterable API
- `@feature` - Feature tests using mock data

## Required Setup for Smoke Tests

The smoke tests use **real Iterable API** and require proper setup in your Iterable project.

### Environment Variables

Already configured in CI (see `.github/workflows/ci.yml`):
```bash
API_KEY=<your-web-api-key>
JWT_SECRET=<your-jwt-secret>
LOGIN_EMAIL=websdk-playwright-test@iterable.com
USE_JWT=true
```

### Required Iterable Configuration

#### 1. Project Setup
- **Project**: Mobile SDK Test (Do Not Delete) (Project ID: 1226)
- **URL**: https://app.iterable.com/campaigns/manage?projectId=1226
- **API Key**: JWT-enabled Web API key (already configured)
- **Test User**: `websdk-playwright-test@iterable.com`

#### 2. Commerce Smoke Tests

**No additional setup required**. The commerce endpoints (`updateCart`, `trackPurchase`) will work with the test user as long as:
- The user exists in the project
- The API key has commerce permissions

#### 3. Events Smoke Tests

**No additional setup required**. Custom events can be tracked without pre-configuration:
- Track custom events with any event name
- In-app events require in-app messages to be fetched first (see In-App setup)

#### 4. In-App Messages Smoke Tests

**Required Setup**: Create an in-app message campaign

##### Campaign Configuration:
```
Campaign Type: In-App Message
Campaign Name: Web SDK Playwright Test Campaign
```

##### Message Setup:
```
Trigger: Immediate (when message is fetched)
Package Name: my-website
Message Type: Modal (Center)
Priority: Medium (300.5)
```

##### Message Content (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      text-align: center;
    }
    h1 {
      color: #b4246b;
    }
    .cta-button {
      background-color: #63abfb;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px;
    }
  </style>
</head>
<body>
  <h1>Test In-App Message</h1>
  <p>This is a test message for Playwright E2E tests</p>
  <button class="cta-button" onclick="window.parent.postMessage({type: 'iterable-action-link', data: 'dismiss'}, '*')">
    Close Message
  </button>
</body>
</html>
```

##### Audience:
```
Audience: All Users
OR
Specific User: websdk-playwright-test@iterable.com
```

##### Expected API Response:
```json
{
  "inAppMessages": [
    {
      "messageId": "abc123",
      "campaignId": 12345,
      "content": {
        "html": "<iframe>...</iframe>",
        "webInAppDisplaySettings": {
          "position": "Center"
        }
      },
      "priorityLevel": 300.5,
      "read": false
    }
  ]
}
```

#### 5. Embedded Messages Smoke Tests

**Required Setup**: Create an embedded message campaign

##### Campaign Configuration:
```
Campaign Type: Embedded Message
Campaign Name: Web SDK Playwright Test Embedded
```

##### Message Setup:
```
Package Name: my-website
Placement: Test Placement (create if doesn't exist)
View Type: Card (or Banner/Notification)
```

##### Message Elements:
```
Title: Test Embedded Message
Body: This is a test embedded message for Playwright tests
Image URL: (optional) https://via.placeholder.com/300x200
Primary Button:
  - Text: "Learn More"
  - Action: Open URL
  - URL: https://iterable.com
Secondary Button:
  - Text: "Dismiss"
  - Action: Dismiss
```

##### Audience:
```
Audience: All Users
OR
Specific User: websdk-playwright-test@iterable.com
```

##### Expected API Response:
```json
[
  {
    "metadata": {
      "messageId": "embedded-123",
      "campaignId": 67890,
      "placementId": 1
    },
    "elements": {
      "title": "Test Embedded Message",
      "body": "This is a test embedded message for Playwright tests",
      "mediaUrl": "https://via.placeholder.com/300x200",
      "buttons": [
        {
          "id": "btn-1",
          "title": "Learn More",
          "action": {
            "type": "openUrl",
            "data": "https://iterable.com"
          }
        }
      ]
    }
  }
]
```

#### 6. Users Smoke Tests

**No additional setup required**. User management endpoints work with:
- `updateUser` - Updates user profile data fields
- `updateSubscriptions` - Requires valid email list IDs (use any existing list ID from your project)

**Note**: For `updateUserEmail` test, ensure the new email doesn't already exist in the project.

## Feature Tests (Mock Data)

Feature tests use **mock data** and do NOT require any Iterable setup. They test:
- Frontend UI functionality
- Error handling
- Loading states
- Form validation
- Edge cases

Mocks are defined in `react-example/e2e/mocks/` directory.

## Test Coverage Summary

### Smoke Tests (Real API) - 10 Tests
✅ Commerce:
  - Update cart
  - Track purchase

✅ Events:
  - Track custom event

✅ In-App Messages:
  - Fetch messages
  - Pause/resume stream

✅ Users:
  - Update user data
  - Update subscriptions

✅ Authentication (existing):
  - Email login
  - Navigation
  - State persistence

✅ UUA (existing):
  - Cookie consent

### Feature Tests (Mock) - 50+ Tests
✅ Commerce (8 tests):
  - Success flows
  - Error handling
  - Loading states

✅ Events (7 tests):
  - Track events
  - In-app events
  - Error scenarios

✅ Users (8 tests):
  - User updates
  - Email updates
  - Subscriptions
  - Validation

✅ In-App Messages (9 tests):
  - Fetch messages
  - Empty states
  - Pause/resume
  - Priority sorting

✅ Embedded Messages (11 tests):
  - View switching
  - Style switching
  - No message states

## Troubleshooting

### Smoke Tests Failing

1. **Check API Key**: Ensure `API_KEY` environment variable is set
2. **Check JWT Secret**: Ensure `JWT_SECRET` is correct
3. **Check User Exists**: Verify `websdk-playwright-test@iterable.com` exists in project
4. **Check Campaigns**: Verify in-app/embedded campaigns are created and active
5. **Check Network**: Ensure connection to Iterable API is working

### Feature Tests Failing

1. **Check Mocks**: Verify mock setup in `mocks/` directory
2. **Check Routes**: Ensure route handlers are properly configured
3. **Check Page Objects**: Verify selectors in page objects match frontend

### General Issues

1. **Port Already in Use**: Stop other processes using port 8080
2. **Webpack Errors**: Run `yarn build` before tests
3. **Dependencies**: Run `yarn install` if packages are missing
4. **Browser Not Installed**: Run `yarn playwright:install`

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Every push to any branch
- Every pull request

See `.github/workflows/ci.yml` for configuration.

### CI Environment

The CI pipeline:
1. Installs dependencies
2. Builds the SDK and react-example
3. Starts the dev server
4. Runs Playwright tests across Chromium, Firefox, and WebKit
5. Uploads test reports and screenshots as artifacts

## Next Steps

1. ✅ Review test strategy document
2. ✅ Set up required campaigns in Iterable (for smoke tests)
3. ✅ Run smoke tests locally to verify setup
4. ✅ Run feature tests to verify mocks
5. ✅ Monitor CI pipeline for test results

## Support

For issues or questions:
1. Check test output and error messages
2. Review Playwright traces (generated on failure)
3. Check browser screenshots (in `playwright-report/`)
4. Review test implementation guide
5. Contact Iterable SDK team


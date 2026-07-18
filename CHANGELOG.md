# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.2.2]
### Fixes
- Added the user email to the in-app events payload, with corresponding tests (SDK-364).
- Pinned `axios` to v1.14.0 and bumped the package version (SDK-405).
- Updated the publish workflow to use npm Trusted Publishing, and fixed its Node version.
- Added CodeQL scanning and a Playwright-based in-app smoke test suite (MOB-12019, MOB-12020).

## [2.2.1]
### Fixes
- Fixed a persistent scrollbar in in-app message iframes (MOB-11504).
- Resolved security vulnerabilities by bumping `axios`, `jest` (v28), and the `on-headers` dependency (MOB-12120, MOB-12122, MOB-12129).
- Added initial Playwright setup (MOB-12017).

## [2.2.0]
### Updates
- Added Unknown User Activation (UUA) public beta support, including capturing user consent.
- Resolved minor issues and bugs in the Unknown User Activation feature.

## [2.1.0]
### Updates
- Added an `.nvmrc` config to the project (MOB-11702).
### Fixes
- Added build steps to the publish workflow (MOB-11716).

## [2.0.0]
### Updates
- Upgraded the `webpack` dependency and `webpack-dev-server`, and bumped the supported Node version (MOB-11487, MOB-11507).
- Added support for non-JWT requests in the React sample app (MOB-11524).
- Resolved remaining vulnerable security dependencies (MOB-11616).
### Fixes
- Fixed ESLint errors in the vanilla JS sample app and resolved lint warnings (MOB-11503, MOB-11554).
- Deduplicated lockfiles (MOB-11618).

## [1.2.0]
### Updates
- Added `maxWidth` to the `getInAppMessages` payload (MOB-11427).
- Exposed `baseIterableRequest` (MOB-11346).
- Added Codecov to the Web SDK (MOB-11001).
### Fixes
- Bumped `axios`, `jest`, and `express` dependency versions (MOB-11441, MOB-11449, MOB-11443).

## [1.1.3]
### Updates
- Enabled tree-shaking (MOB-9520).
- Updated docs: changed "EUDC" to "EDC" (DOCS-4858).
### Dependencies
- Bumped `webpack` from 5.76.0 to 5.94.0.

## [1.1.2]
### Updates
- Added stricter linting rules and the `prefer-for-of` TypeScript rule (MOB-9066, MOB-9256).
- Updated EUDC instructions (DOCS-4818).
### Dependencies
- Bumped several dependencies (`braces`, `ws`, `axios`, `postcss`, `requirejs`, `micromatch`).

## [1.1.1]
### Fixes
- Properly formatted query params for GET requests, fixing handling of `placementIds` when fetching embedded messages (MOB-9087).

## [1.1.0]
### Updates
- Embedded Messaging is now GA (MOB-8539). This includes out-of-the-box views (cards, notifications, and banners) and an `IterableEmbeddedSessionManager` for tracking sessions and impressions.
  - Breaking changes vs the beta: `EmbeddedManager` is now `IterableEmbeddedManager` and is instantiated with your app's package name.
  - `trackEmbeddedClick` is now a standalone import instead of a method on the manager.
  - Signatures changed for `syncMessages`, `getMessages`, `getMessagesForPlacement`, `addUpdateListener`, and `getUpdateHandlers`.
  - `handleEmbeddedMessageClick` was renamed to `click(clickedUrl)`.
  - Several types were renamed (for example `IEmbeddedMessage` is now `IterableEmbeddedMessage`). See PR #365 for details.
- Updated the README to more accurately document `initializeWithConfig` (#401).
- Added the Playwright testing framework as a dev dependency (QAE-1182).
### Fixes
- Prepublish checks and fixes (MOB-8854).

## [1.0.11]
### Updates
- Added new SDK configuration options `isEuIterableService` and `dangerouslyAllowJsPopupsSDK` (MOB-8649).
  - `dangerouslyAllowJsPopupsSDK` replaces the `DANGEROUSLY_ALLOW_JS_POPUP_EXECUTION` environment variable, which is no longer supported.
  - `isEuIterableService` is an alternative to the `IS_EU_ITERABLE_SERVICE` environment variable, which is still available.

## [1.0.10]
### Fixes
- Resolved some TypeScript errors and updated the example app.
- Added `allow-popups-to-escape-sandbox` so Safari can open in-app message link clicks in a clean browsing context (MOB-8515).
### Dependencies
- Bumped `follow-redirects`, `webpack-dev-middleware`, `express`, and `ip`.

## [1.0.9]
### Fixes
- Passed additional EU-related environment variables to webpack (resolves issue #356).

## [1.0.8]
### Fixes
- Fixed the iframe height setter and updated vulnerable dependencies (MOB-7613, MOB-7390).
- Updated the README for iOS browser handling (MOB-7682).

## [1.0.7]
### Fixes
- Bumped `axios` from 0.21.4 to 1.6.2.
- Fixed the nullish coalescing operator.
- Exported authorization typings.

## [1.0.6]
### Fixes
- Added a new filter method that leaves only JSON-only messages (MOB-7175).

## [1.0.5]
### Fixes
- Added EU Domain Configuration (EUDC) support and release cut (MOB-5933, MOB-6617).
- Fixed a docs discrepancy for imports and updated the close button README (MOB-6374).

## [1.0.4]
### Fixes
- Repositioned the close (x) button (MOB-6229).

## [1.0.3]
### Fixes
- JWT token can now be refreshed manually (MOB-5654).
- Fixed an infinite loop when the JWT expiration time is invalid.
- Updated the React example to include `logout` and refresh-JWT-token buttons.

## [1.0.2]
### Fixes
- Fixed some Safari dismissal bugs (MOB-5930).

## [1.0.1]
### Fixes
- Fixed an infinite loop.

## [1.0.0]
### Changed
- Updated `getMessages` requests to use the new web endpoint (MOB-4055).
- Deprecated the boolean value for the `getInAppMessages` `showInAppMessagesAutomatically` param (MOB-4490).
- No longer adds an autogenerated close button when an in-app message is displayed in Safari (MOB-4959).
### Fixed
- Fixed a discrepancy in iframe heights and refactored mock data to test cached messages (MOB-4936).
- Fixed `handleLinks` support for iframe links in Safari (MOB-4718).

## [0.4.2]
### Fixes
- Fixed iframe height setting (MOB-4840).

## [0.4.1]
### Updates
- Refactored `inapp.ts` and removed excessive footers from the sample apps (MOB-4789).
### Fixes
- Filtered out messages set to deliver silently (MOB-4740).

## [0.4.0]
### Updates
- Prevented dismissing of an in-app message when clicking outside of the message (MOB-4677).
- Secured the unprotected raw HTML path with an iframe (MOB-4576).
### Fixes
- Resolved security issues with the `terser` dependency (MOB-4726).

## [0.3.0]
### Changed
- Persisted the same type of credential to sign future JSON Web Tokens, even after invoking `updateUserEmail` (#134). Previously, if a user called `setUserID` then updated the email with `updateUserEmail`, future JWTs would be signed with the new email even though the consumer code originally authorized with user ID.
### Fixed
- Fixed an issue where calling `resumeMessageStream` showed the next in-app message in the queue even if `pauseMessageStream` was not called first (#135).

## [0.2.1]
### Changed
- Upgraded TypeScript and fixed new errors (#131).
- Prevented JS from running in the in-app message iframe (#132).

## [0.2.0]
### Changed
- Updated `getInAppMessages`, making it possible to defer the display of in-app messages (#123).

## [0.1.3]
### Fixed
- Fixed a case where, when `setEmail` or `setUserId` was called multiple times, the SDK would always request a JWT for the first email or userID (#121).

## [0.1.2]
### Fixed
- Fixed a max-height issue (#109).
- Updated documentation (#107, #108).

## [0.1.1]
### Changed
- Updated documentation (#104).
### Fixed
- Persisted POST `/trackInAppClick` calls when the browser navigates to a new link (#105).

## [0.1.0]
Initial release.

### Added
- `initialize`
- `getInAppMessages`
- `track`
- `trackInAppClick`
- `trackInAppClose`
- `trackInAppConsume`
- `trackInAppDelivery`
- `trackInAppOpen`
- `trackPurchase`
- `updateCart`
- `updateSubscriptions`
- `updateUser`
- `updateUserEmail`

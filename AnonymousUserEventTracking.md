# Anonymous User Event Tracking Iterable's Web SDK
The Anonymous User Tracking Module is a pivotal component within our WEB SDK that seamlessly captures user events while maintaining anonymity for non-logged-in users. This module is designed to diligently gather and store events triggered by users who have not yet signed in. Once specific criteria are met or when the user decides to engage further, the module securely synchronizes all accumulated anonymous events with our servers.

By adopting a privacy-first approach, the module allows us to gain valuable insights into user interactions without compromising their personal information. As users transition from anonymous to logged-in status, the module smoothly transitions as well, associating future events with the user's unique identity while ensuring the continuity of event tracking.

Key Features:

- Anonymous Event Tracking: Captures a diverse range of user events even before they log in, ensuring a comprehensive understanding of user behavior.
Privacy Protection: Safeguards user anonymity by collecting and storing events without requiring personal information.
- Event Synchronization: Upon meeting predefined conditions, securely transmits all anonymous events to the server, enabling data-driven decision-making.
- Seamless User Transition: Effortlessly shifts from tracking anonymous events to associating events with specific users as they log in.
- Enhanced Insights: Provides a holistic view of user engagement patterns, contributing to a more informed product optimization strategy.
Implementing the Anonymous

# Installation

To install this SDK through NPM:

```
$ npm install @iterable/web-sdk
```

with yarn:

```
$ yarn add @iterable/web-sdk
```

or with a CDN:

```js
<script src="https://unpkg.com/@iterable/web-sdk/index.js"></script>
```

# Methods
- [`getAnonCriteria`]
- [`trackAnonEvent`]
- [`trackAnonPurchaseEvent`]
- [`trackAnonUpdateCart`]
- [`createUser`]
- [`syncEvents`]
- [`checkCriteriaCompletion`]

# Usage

## trackAnonEvent

```ts
await anonymousUserEventManager.trackAnonEvent(eventDetails);
```

# Example

```ts
const eventDetails = {
    ...conditionalParams,
    createNewFields: true,
    createdAt: (Date.now() / 1000) | 0,
    userId: loggedInUser,
    dataFields: { website: { domain: 'omni.com' }, eventType: 'track' },
    deviceInfo: {
        appPackageName: 'my-website'
    }
};
    
await anonymousUserEventManager.trackAnonEvent(eventDetails);
const isCriteriaCompleted = await anonymousUserEventManager.checkCriteriaCompletion();

if (isCriteriaCompleted) {
    const userId = uuidv4();
    const App = await initialize(process.env.API_KEY);
    await App.setUserID(userId);
    await anonymousUserEventManager.createUser(userId, process.env.API_KEY);
    setLoggedInUser({ type: 'user_update', data: userId });
    await anonymousUserEventManager.syncEvents();
}
```

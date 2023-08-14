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

1. `trackAnonEvent`
The 'trackAnonEvent' function within the Iterable-Web SDK empowers seamless tracking of diverse web events. Developers can enrich event data with specific metadata using the 'dataFields' attribute. This function intelligently distinguishes between logged-in and non-logged-in users, securely storing event data on the server post-login, while locally preserving data for anonymous users, ensuring comprehensive event monitoring in both scenarios.

```ts
const eventDetails = {
    ...conditionalParams,
    createNewFields: true,
    createdAt: (Date.now() / 1000) | 0,
    dataFields: { website: { domain: 'omni.com' }, eventType: 'track' },
};
    
await anonymousUserEventManager.trackAnonEvent(eventDetails);
```

2. `trackAnonPurchaseEvent`
The 'trackAnonPurchaseEvent' function in the Iterable-Web SDK enables precise tracking of purchase-related web events. Developers can seamlessly include specific details about purchased items. With an innate understanding of user authentication status, the function securely stores event data on the server post-login, while also providing localized storage for non-logged-in users, guaranteeing comprehensive event monitoring in both usage scenarios.

```ts
const eventDetails = {
    ...conditionalParams,
    items: [{ name: purchaseItem, id: 'fdsafds', price: 100, quantity: 2 }],
    total: 200
}

await anonymousUserEventManager.trackAnonPurchaseEvent(eventDetails);
```

3. `trackAnonUpdateCart`
The 'trackAnonUpdateCart' function in the Iterable-Web SDK empowers effortless tracking of web events related to cart updates. Developers can accurately outline details for multiple items within the cart. It seamlessly handles data, securely transmitting events to the server upon user login, while also providing local storage for event details in the absence of user login, ensuring comprehensive event tracking in all scenarios.

```ts
const eventDetails = {
    ...conditionalParams,
    items: [{ name: cartItem, id: 'fdsafds', price: 100, quantity: 2 }]
}

await anonymousUserEventManager.trackAnonUpdateCart(eventDetails);
```

4. `createUser`
The 'createUser' function in the Iterable-Web SDK facilitates user creation by assigning a unique user UUID. This function also supports the seamless updating of user details on the server, providing a comprehensive solution for managing user data within your application.

```ts
await anonymousUserEventManager.createUser(uuid, process.env.API_KEY);
```

5. `getAnonCriteria`
The 'getAnonCriteria' function within the Iterable-Web SDK retrieves criteria from the server for matching purposes. It efficiently fetches and returns an array of criteria, providing developers with essential tools to enhance their application's functionality through data-driven decision-making.

```ts
const criteriaList = await anonymousUserEventManager.getAnonCriteria();
```

6. `checkCriteriaCompletion`
The 'checkCriteriaCompletion' function in the Iterable-Web SDK performs a local assessment of stored events to determine if they fulfill specific criteria. If any of the stored events satisfy the criteria, the function returns 'true', offering developers a reliable method to validate the completion status of predefined conditions based on accumulated event data.

```ts
const isCriteriaCompleted = await anonymousUserEventManager.checkCriteriaCompletion();
```

7. `syncEvents`
The 'syncEvents' function within the Iterable-Web SDK facilitates the seamless synchronization of locally stored events to the server while sequentially maintaining their order. This function efficiently transfers all accumulated events, clearing the local storage in the process, ensuring data consistency and integrity between the client and server-side environments.

```ts
await anonymousUserEventManager.syncEvents();
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

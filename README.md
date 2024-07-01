![Iterable-Logo](https://user-images.githubusercontent.com/7387001/129065810-44b39e27-e319-408c-b87c-4d6b37e1f3b2.png)

# Iterable's Web SDK

[Iterable](https://www.iterable.com) is a growth-marketing platform that helps
you to create better experiences for—and deeper relationships with—your customers. 
Use it to send customized email, SMS, push notification, in-app message,
embedded message, and web push notification campaigns to your customers.

This SDK helps you integrate your web apps with Iterable.

# Table of contents

- [Other documentation](#other-documentation)
- [Installation](#installation)
- [Functions](#functions)
- [Classes, interfaces, types, and enums](#classes-interfaces-types-and-enums)
- [FAQ](#faq)
- [Link handling](#link-handling)
- [TypeScript](#typescript)
- [Contributing](#contributing)
- [License](#license)

# Other documentation

This document contains reference information about the Web SDK. For other
information, please see:

- [In-Browser Messaging Overview](https://support.iterable.com/hc/articles/4418166649748)
- [Embedded Messaging Overview](https://support.iterable.com/hc/articles/23060529977364)
- [Overview of Iterable's Web SDK](https://support.iterable.com/hc/articles/10359708795796)
- [Setting up Iterable's Web SDK](https://support.iterable.com/hc/articles/4419628585364)
- [Embedded Messages with Iterable's Web SDK](https://support.iterable.com/hc/articles/27537816889108)

# Installation

To install the SDK, use Yarn, npm, or a `script` tag:

- npm

  ```
  npm install @iterable/web-sdk
  ```

- Yarn

  ```
  yarn add @iterable/web-sdk
  ```

- `script` tag

  ```js
  <script src="https://unpkg.com/@iterable/web-sdk/index.js"></script>
  ```

# Functions

Iterable's Web SDK exposes the following functions, which you can use in your
website code.

For information about the data the SDK sends and receives when making calls to
Iterable's API, see the [API Overview](https://support.iterable.com/hc/articles/204780579).

| Method Name                                                                       | Description |
| --------------------------------------------------------------------------------- | ----------- |
| [`filterHiddenInAppMessages`](#filterhiddeninappmessages)                         | From an array of passed-in in-app messages, filters out messages that have been already been read and messages that should not be displayed. |
| [`filterOnlyReadAndNeverTriggerMessages`](#filteronlyreadandnevertriggermessages) | From an array of passed-in in-app messages, filters out messages that have already been read and messages that should not be displayed. |
| [`getInAppMessages`](#getInAppMessages)                                           | Fetches in-app messages by calling [`GET /api/inApp/getMessages`](https://support.iterable.com/hc/articles/204780579#get-api-inapp-getmessages). |
| [`initialize`](#initialize)                                                       | Initializes the SDK with an API key and a JWT refresh method. Returns methods you can use to identify the current user, work with JWT tokens, and log the user out (see [`WithJWT`](#withjwt)). |
| [`initializeWithConfig`](#initializeWithConfig)                                   | Similar to `initialize`, but also takes a set of configuration options as a parameter. Returns methods you can use to identify the current user, work with JWT tokens, and log the user out (see [`WithJWT`](#withjwt)). |
| [`IterableEmbeddedCard`](#iterableembeddedcard)                                   | Returns a string of the HTML for an out-of-the-box [card](https://support.iterable.com/hc/articles/23230946708244#cards) view for an embedded message. |
| [`IterableEmbeddedBanner`](#iterableembeddedbanner)                               | Returns a string of the HTML for an out-of-the-box [banner](https://support.iterable.com/hc/articles/23230946708244#banners) view for an embedded message. |
| [`IterableEmbeddedNotification`](#iterableembeddednotification)                   | Returns a string of the HTML for an out-of-the-box [notification](https://support.iterable.com/hc/articles/23230946708244#notifications) view for an embedded message. |
| [`sortInAppMessages`](#sortinappmessages)                                         | Sorts an array of in-app messages by priority, and then creation date. |
| [`track`](#track)                                                                 | Tracks a custom event by calling [`POST /api/events/track`](https://support.iterable.com/hc/articles/204780579#post-api-events-track). |
| [`trackEmbeddedClick`](#trackEmbeddedClick)                                       | Tracks an [`embeddedClick`](https://support.iterable.com/hc/articles/23061677642260#embeddedclick-events) event by calling [`POST /api/embedded-messaging/events/click`](https://support.iterable.com/hc/articles/204780579#post-api-embedded-messaging-events-click). |
| [`trackEmbeddedReceived`](#trackEmbeddedReceived)                                 | Tracks an [`embeddedReceived`](https://support.iterable.com/hc/articles/23061677642260#embeddedreceived-events) event by calling [`POST /api/embedded-messaging/events/received`](https://support.iterable.com/hc/articles/204780579#post-api-embedded-messaging-events-received). |
| [`trackEmbeddedSession`](#trackEmbeddedSession)                                   | Tracks an [`embeddedSession`](https://support.iterable.com/hc/articles/23061677642260#embeddedsession-events) event and related [`embeddedImpression`](https://support.iterable.com/hc/articles/23061677642260#embeddedimpression-events) events by calling [`POST /api/embedded-messaging/events/session`](https://support.iterable.com/hc/articles/204780579#post-api-embedded-messaging-events-session). |                                                                                            |
| [`trackInAppClick`](#trackInAppClick) :rotating_light:                            | Tracks an `inAppClick` event by calling [`POST /api/events/trackInAppClick`](https://support.iterable.com/hc/articles/204780579#post-api-events-trackinappclick). |
| [`trackInAppClose`](#trackInAppClose)                                             | Tracks an `inAppClose` event by calling [`POST /api/events/trackInAppClose`](https://support.iterable.com/hc/articles/204780579#post-api-events-trackinappclose). |
| [`trackInAppConsume`](#trackInAppConsume)                                         | Deletes an in-app message from the server by calling [`POST /api/events/trackInAppConsume`](https://support.iterable.com/hc/articles/204780579#post-api-events-inappconsume). |
| [`trackInAppDelivery`](#trackInAppDelivery)                                       | Tracks an `inAppDelivery` event by calling [`POST /api/events/trackInAppDelivery`](https://support.iterable.com/hc/articles/204780579#post-api-events-trackinappdelivery). |
| [`trackInAppOpen`](#trackInAppOpen)                                               | Tracks an `inAppOpen` event by calling [`POST /api/events/trackInAppOpen`](https://support.iterable.com/hc/articles/204780579#post-api-events-trackinappopen). |
| [`trackPurchase`](#trackPurchase)                                                 | Tracks a `purchase` event by calling [`POST /api/commerce/trackPurchase`](https://support.iterable.com/hc/articles/204780579#post-api-commerce-trackpurchase). |
| [`updateCart`](#updateCart)                                                       | Updates the shopping cart items on the user's Iterable profile by calling [`POST /api/commerce/updateCart`](https://support.iterable.com/hc/articles/204780579#post-api-commerce-updatecart). |
| [`updateSubscriptions`](#updateSubscriptions)                                     | Updates the user's subscriptions by calling [`POST /api/users/updateSubscriptions`](https://support.iterable.com/hc/articles/204780579#post-api-users-updatesubscriptions). |
| [`updateUser`](#updateUser)                                                       | Updates the data on a user's Iterable profile by calling [`POST /api/users/updateUser`](https://support.iterable.com/hc/articles/204780579#post-api-users-update). |
| [`updateUserEmail`](#updateUserEmail)                                             | Updates the current user's `email` by calling [`POST /api/users/updateEmail`](https://support.iterable.com/hc/articles/204780579#post-api-users-updateemail). Causes the SDK to fetch a JWT for the new email address. |

Notes:

- The SDK does not track `inAppDelete` events.

- :rotating_light: Due to a limitation in WebKit (which affects iOS web browsers,
  like Safari), in-app messages displayed in an iOS web browser browser can't 
  automatically track `inAppClick`  events or handle custom CTAs. This will impact
  analytics for all Safari and mobile iOS users.

## `filterHiddenInAppMessages`

From an array of passed-in in-app messages, filters out messages that have been
already been read and messages that should not be displayed.

```ts
const filterHiddenInAppMessages = (
  messages: Partial<InAppMessage>[] = []
): Partial<InAppMessage>[]
```

See also:

- [`InAppMessage`](#inappmessage)

## `filterOnlyReadAndNeverTriggerMessages`

From an array of passed-in in-app messages, filters out messages that have
already been read and messages that should not be displayed.

```ts
const filterOnlyReadAndNeverTriggerMessages = (
  messages: Partial<InAppMessage>[] = []
): Partial<InAppMessage>[]
```

See also:

- [`InAppMessage`](#inappmessage)

## `getInAppMessages`

Fetches in-app messages by calling [`GET /api/inApp/getMessages`](https://support.iterable.com/hc/articles/204780579#get-api-inapp-getmessages).

```ts
// Returns a promise that resolves to an InAppMessageResponse, which has an
// array of fetched in-app messages.
function getInAppMessages(
  payload: InAppMessagesRequestParams
): IterablePromise<InAppMessageResponse>;

// Returns methods to request messages from the server, pause message display, 
// restart message display, and trigger the display of a message.
function getInAppMessages(
  payload: InAppMessagesRequestParams,
  options: {
    display: DisplayOptions;
  }
): GetInAppMessagesResponse

```

`payload` options (see [`InAppMessagesRequestParams`](#inappmessagesrequestparams)):

| Property Name               | Description                                                                                                                                                                                                                                                                                | Value                                                             | Default     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ----------- |
| `animationDuration`         | How long (in ms) it should take messages to animate in and out                                                                                                                                                                                                                            | `number`                                                          | `400`       |
| `bottomOffset`              | How much space (px or %) to create between the bottom of the screen and a message. Not applicable for center, top, or full-screen messages.                                                                                                                                                | `string`                                                          | `undefined` |
| `closeButton`               | Properties that define a custom close button to display on a message.                                                                                                                                                                                                                      | `CloseButtonOptions` (see below)                                  | `undefined` |
| `displayInterval`           | How long (in ms) to wait before showing the next in-app message after closing the currently open one                                                                                                                                                                                     | `number`                                                          | `30000`     |
| `handleLinks`               | How to open links. If `undefined`, use browser-default behavior. `open-all-new-tab` opens all in new tab, `open-all-same-tab` opens all in same tab, `external-new-tab` opens only off-site links in new tab, otherwise same tab. Overrides the target attribute defined on link elements. | `'open-all-new-tab' \| 'open-all-same-tab' \| 'external-new-tab'` | `undefined` |
| `onOpenNodeToTakeFocus`     | The DOM element that should receive keyboard focus when the in-app message opens. Any query selector is valid. If not specified, the first interactive element receives focus.                                                                                                             | `string`                                                          | `undefined` |
| `onOpenScreenReaderMessage` | The text a screen reader should read when opening the message.                                                                                                                                                                                                                             | `string`                                                          | `undefined` |
| `rightOffset`               | The amount of space (px or %) to create between the right of the screen and the message. Not applicable for center or full-screen messages.                                                                                                                                                | `string`                                                          | `undefined` |
| `topOffset`                 | How much space (px or %) to create between the top of the screen and a message. Not applicable for center, bottom, or full-screen messages.                                                                                                                                                | `string`                                                          | `undefined` |

`closeButton` options (see [`CloseButton`](#closebutton)):

| Property Name               | Description                                                                  | Value                      | Default       |
| --------------------------- | ---------------------------------------------------------------------------- | -------------------------- | ------------- |
| `color`                     | The button's color (does not affect custom icons)                            | `string`                   | `undefined`   |
| `iconPath`                  | Custom pathname to an image or SVG to use (instead of the default "X")       | `string`                   | `undefined`   |
| `isRequiredToDismissMessage`| If `true`, users cannot dismiss in-app messages by clicking outside of them. | `boolean`                  | `undefined`   |
| `position`                  | Where the button should display on an in-app message                         | `'top-right' \| 'top-left'`| `'top-right'` |
| `sideOffset`                | How much space to leave between the button and side of the container         | `string`                   | `'4%'`        |
| `size`                      | How large to set the width, height, and font-size                            | `string \| number`         | `24`          |
| `topOffset`                 | How much space to leave between the button and the top of the container      | `string`                   | `'4%'`        |

Example:

```ts
import { getInAppMessages } from '@iterable/web-sdk';

getInAppMessages({ count: 20, packageName: 'mySite1' })
  .then((resp) => {
    // This is an iframe element that can be attached to the DOM 
    const messageIframe = resp.data.inAppMessages[0].content.html;
    document.body.appendChild(messageIframe);
    // Additional styling logic can be done here to render the message in a 
    // custom way
  })
  .catch();
```

This code, which doesn't include the `options` parameter, fetches in-app messages
from Iterable and places the first one on the page. However, it won't be visible.
To render it, modify the page's CSS to display the message as necessary. You'll
also need to set up click handlers to handle click events, close the message,
etc.

Here's some example code that shows messages automatically:

```ts
import { getInAppMessages } from '@iterable/web-sdk';

const { request, pauseMessageStream, resumeMessageStream } = getInAppMessages(
  {
    count: 20,
    packageName: 'my-website',
    displayInterval: 5000,
    onOpenScreenReaderMessage:
      'The screen reader will read this',
    onOpenNodeToTakeFocus: 'input',
    closeButton: {
      color: 'red',
      size: '16px',
      topOffset: '20px'
    }
  },
  { display: 'immediate' }
);

request().then().catch();
```

This example uses custom sorting and filtering, and displays messages at the
app's discretion:

```ts
import {
  getInAppMessages,
  sortInAppMessages,
  filterHiddenInAppMessages
} from '@iterable/web-sdk';

const {
  request,
  pauseMessageStream,
  resumeMessageStream,
  triggerDisplayMessages
} = getInAppMessages(
  {
    count: 20,
    packageName: 'my-website',
    displayInterval: 5000,
    onOpenScreenReaderMessage: 'The screen reader will read this',
    onOpenNodeToTakeFocus: 'input',
    closeButton: {
      color: 'red',
      size: '16px',
      topOffset: '20px'
    }
  },
  { display: 'deferred' }
);

request()
  .then((response) => {
    // Do your own manipulation here 
    const filteredMessages = yourOwnSortingAndFiltering(response.data.inAppMessages);

    // Or, feel free to take advantage of the sorting/filtering methods used 
    // internally
    const furtherManipulatedMessages = sortInAppMessages(
      filterHiddenInAppMessages(response.data.inAppMessages)
    ) as InAppMessage[];

    // Then display them whenever you want
    triggerDisplayMessages(furtherManipulatedMessages);
  })
  .catch();
```

:rotating_light: With the `deferred` option, the SDK does **not** filter or sort
the messages. The messages come back exactly as retrieved from the API, without
modification. This means you may, for example, show in- app messages marked as
`read`, or show the messages in the wrong order (based on `priority`).

To retain the default sorting and filtering, use the SDK's [`sortInAppMessages`](#sortinappmessages) 
and [`filterHiddenInAppMessages`](#filterhiddeninappmessages) methods. Also, see 
[`filterOnlyReadAndNeverTriggerMessages`](#filteronlyreadandnevertriggermessages), 
which is similar to `filterHiddenInAppMessages` but does not filter out 
JSON-only messages.

Notes:

- :rotating_light: [v1.0.0](https://github.com/Iterable/iterable-web-sdk/releases/tag/v1.0.0) 
  of this SDK removes support for `showMessagesAutomatically?: boolean`. If needed, 
  please update your `getInAppMessages` requests to use `options: { display: 'deferred' | 'immediate' }`.

See also: 

- [`DisplayOptions`](#displayoptions)
- [`GetInAppMessagesResponse`](#getinappmessagesresponse)
- [`InAppMessagesRequestParams`](#inappmessagesrequestparams)
- [`InAppMessageResponse`](#inappmessageresponse)
- [`IterablePromise`](#iterablepromise)

## `initialize`

Initializes the SDK with an API key and a JWT refresh method. Returns methods
you can use to identify the current user, work with JWT tokens, and log the 
user out (see [`WithJWT`](#withjwt)).

```ts
function initialize(
  authToken: string,
  generateJWT: (payload: GenerateJWTPayload) => Promise<string>
): WithJWT;
```

`generateJWT` should be a function that takes a `userId` or `email` and uses
it to fetch, from your server, a valid JWT token for that user. The function
should return the token as a string.

Example:

```ts
import { initialize } from '@iterable/web-sdk';

const { clearRefresh, setEmail, setUserID, logout } = initialize(
  'my-API-key',
  // email will be defined if you call setEmail 
  // userID_ will be defined if you call setUserID
  ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
);
```

See also:

- [`GenerateJWTPayload`](#generatejwtpayload) 
- [`WithJWT`](#withjwt)

## `initializeWithConfig`

Similar to `initialize`, but also takes a set of configuration options as a 
parameter. Returns methods you can use to identify the current user, work with
JWT tokens, and log the user out (see [`WithJWT`](#withjwt)).

The configuration options you can pass to this function are useful if you
need to [point the SDK to Iterable's EU API endpoints](#iterables-european-data-center-eudc) 
or [allow JavaScript execution in Safari tabs](#safari-allowing-javascript-execution-in-tabs-opened-by-in-app-message-link-clicks).

```ts
function initializeWithConfig(initializeParams: WithJWTParams): WithJWT;
```

Example:

```ts
import { initializeWithConfig } from '@iterable/web-sdk';

const { clearRefresh, setEmail, setUserID, logout } = initializeWithConfig({
  authToken: 'my-API-key',
  configOptions: {
    isEuIterableService: false,
    dangerouslyAllowJsPopups: true,
  },
  
  // email will be defined if you call setEmail
  // userID will be defined if you call setUserID
  generateJWT: ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
}
);
```

`generateJWT` should be a function that takes a `userId` or `email` and uses
it to fetch, from your server, a valid JWT token for that user. The function
should return the token as a string.

See also:

- [`WithJWT`](#withjwt)
- [`WithJWTParams`](#withjwtparams)

## `IterableEmbeddedCard`

Returns a string of the HTML for an out-of-the-box [card](https://support.iterable.com/hc/articles/23230946708244#cards) 
view for an embedded message.

```ts
const emptyElement = {
  id: '',
  styles: ''
};

function IterableEmbeddedCard({
  appPackageName,
  message,
  htmlElements = {
    parent: emptyElement,
    img: emptyElement,
    title: emptyElement,
    primaryButton: emptyElement,
    secondaryButton: emptyElement,
    body: emptyElement,
    buttonsDiv: emptyElement,
    textTitle: emptyElement
  },
  errorCallback
}: OOTB): string
```

Parameters:

- `appPackageName` – The package name you use to identify your website to
  Iterable's Web SDK.
- `message` – The `IterableEmbeddedMessage` object that represents the
  message you want to display.
- `htmlElements` – Custom styles (type [`Elements`](#elements)) for the SDK to use 
  when displaying the embedded message. For details, see [Custom Styles](https://support.iterable.com/hc/articles/27537816889108#custom-styles).
- `errorCallback` – A callback that the SDK calls if it encounters an error
  when tracking [`embeddedClick`](https://support.iterable.com/hc/articles/23061677642260#embeddedclick-events) 
  events.

```js
import { IterableEmbeddedCard } from '@iterable/web-sdk';

const card = IterableEmbeddedCard({
  packageName,
  message,
  htmlElements,
  errorCallback: (error) => console.log('handleError: ', error)
});
```

To display the message, set the `innerHTML` of an HTML element to the string
returned by `IterableEmbeddedCard`.

For more info, see:

- [Out-of-the-Box Views](https://support.iterable.com/hc/articles/27537816889108#out-of-the-box-views).
- For default card styles, see the [`src/components/card/styles.ts`](https://github.com/Iterable/iterable-web-sdk/blob/main/src/components/card/styles.ts)
  in the Web SDK GitHub repository. 
- To learn how to apply custom styles, see [Custom Styles](https://support.iterable.com/hc/articles/27537816889108#custom-styles).

Also see:

- [`Elements`](#elements)
- [`OOTB`](#ootb)

## `IterableEmbeddedBanner`

Returns a string of the HTML for an out-of-the-box [banner](https://support.iterable.com/hc/articles/23230946708244#banners) 
view for an embedded message.

```ts
function IterableEmbeddedBanner({
  appPackageName,
  message,
  htmlElements = {
    parent: emptyElement,
    img: emptyElement,
    title: emptyElement,
    primaryButton: emptyElement,
    secondaryButton: emptyElement,
    body: emptyElement,
    buttonsDiv: emptyElement,
    textTitle: emptyElement,
    textTitleImg: emptyElement
  },
  errorCallback
}: OOTB): string 
```

Parameters:

- `appPackageName` – The package name you use to identify your website to
  Iterable's Web SDK.
- `message` – The `IterableEmbeddedMessage` object that represents the message 
  you want to display.
- `htmlElements` – Custom styles (type [`Elements`](#elements)) for the SDK to use 
  when displaying the embedded message. For details, see [Custom Styles](https://support.iterable.com/hc/articles/27537816889108#custom-styles).
- `errorCallback` – A callback that the SDK calls if it encounters an error
  when tracking [`embeddedClick`](https://support.iterable.com/hc/articles/23061677642260#embeddedclick-events) 
  events.

For example:

```js
import { IterableEmbeddedBanner } from '@iterable/web-sdk';

const banner = IterableEmbeddedBanner({
  packageName,
  message,
  htmlElements,
  errorCallback: (error) => console.log('handleError: ', error)
});
```

To display the message, set the `innerHTML` of an HTML element to the string
returned by `IterableEmbeddedBanner`.

For more info, see:

- [Creating an Out-of-the-Box View](https://support.iterable.com/hc/articles/27537816889108).
- For default banner styles, see the [`src/components/banner/styles.ts`](https://github.com/Iterable/iterable-web-sdk/blob/main/src/components/banner/styles.ts)
  in the Web SDK GitHub repository. 
- To learn how to apply custom styles, see [Custom Styles](https://support.iterable.com/hc/articles/27537816889108#custom-styles).

Also see:

- [`OOTB`](#ootb)
- [`Elements`](#elements)

## `IterableEmbeddedNotification`

Returns a string of the HTML for an out-of-the-box [notification](https://support.iterable.com/hc/articles/23230946708244#notifications) 
view for an embedded message.

```ts
function IterableEmbeddedNotification({
  appPackageName,
  message,
  htmlElements = {
    parent: emptyElement,
    title: emptyElement,
    primaryButton: emptyElement,
    secondaryButton: emptyElement,
    body: emptyElement,
    buttonsDiv: emptyElement,
    textTitle: emptyElement
  },
  errorCallback
}: OOTB): string
```

Parameters:

- `appPackageName` – The package name you use to identify your website to
  Iterable's Web SDK.
- `message` – The `IterableEmbeddedMessage` object that represents the message 
  you want to display.
- `htmlElements` – Custom styles (type [`Elements`](#elements)) for the SDK to use 
  when displaying the embedded message. For details, see [Custom Styles](https://support.iterable.com/hc/articles/27537816889108#custom-styles).
- `errorCallback` – A callback that the SDK calls if it encounters an error
  when tracking [`embeddedClick`](https://support.iterable.com/hc/articles/23061677642260#embeddedclick-events) 
  events.

```js
import { IterableEmbeddedNotification } from '@iterable/web-sdk';

const notification = IterableEmbeddedNotification({
  packageName,
  message,
  htmlElements,
  errorCallback: (error) => console.log('handleError: ', error)
});
```

To display the message, set the `innerHTML` of an HTML element to the string
returned by `IterableEmbeddedNotification`.

For more info, see:

- [Creating an Out-of-the-Box View](https://support.iterable.com/hc/articles/27537816889108).
- For default notification styles, see the [`src/components/notification/styles.ts`](https://github.com/Iterable/iterable-web-sdk/blob/main/src/components/notification/styles.ts)
- To learn how to apply custom styles, see [Custom Styles](https://support.iterable.com/hc/articles/27537816889108#custom-styles).

Also see:

- [`OOTB`](#ootb)
- [`Elements`](#elements)

## `sortInAppMessages`

Sorts an array of in-app messages by priority, and then creation date.

```ts
const sortInAppMessages = (messages: Partial<InAppMessage>[] = []) => {
  return messages.sort(by(['priorityLevel', 'asc'], ['createdAt', 'asc']));
};
```

In-app messages can have these [priority values](https://support.iterable.com/hc/articles/7412316462996#display-priority):

- Low - `priorityLevel` of 400.5
- Medium - `priorityLevel` of 300.5
- High - `priorityLevel` of 200.5
- Critical - `priorityLevel` of 100.5
- Proof - `priorityLevel` of 100.0

Also see:

- [`InAppMessage`](#inappmessage)

## `track`

Tracks a custom event by calling [`POST /api/events/track`](https://support.iterable.com/hc/articles/204780579#post-api-events-track).

```ts
track: (payload: InAppTrackRequestParams): IterablePromise<IterableResponse>
```
 
Example:

```ts
import { track } from '@iterable/web-sdk';

track({ eventName: 'my-event' }).then().catch();
```

See also:

- [`InAppTrackRequestParams`](#inapptrackrequestparams)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackEmbeddedClick`

Tracks an [`embeddedClick`](https://support.iterable.com/hc/articles/23061677642260#embeddedclick-events) 
event by calling [`POST /api/embedded-messaging/events/click`](https://support.iterable.com/hc/articles/204780579#post-api-embedded-messaging-events-click).

```ts
const trackEmbeddedClick = (
  payload: IterableEmbeddedClickRequestPayload
): IterablePromise<IterableResponse>
```

Example:

```js
import { trackEmbeddedReceived } from '@iterable/web-sdk';

trackEmbeddedClick({
  messageId: message.metadata.messageId, 
  buttonIdentifier: button.id,
  clickedUrl: defaultUrl,
  appPackageName: packageName
}).then((response) => {
  if (response.status != 200) {
    console.log("Failure tracking embedded click")
  }
}).catch((error) => {
  console.log("Error tracking embedded click: ", error);
});
```

See also:

- [`IterableEmbeddedClickRequestPayload`](#iterableembeddedclickrequestpayload)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackEmbeddedReceived`

Tracks an [`embeddedReceived`](https://support.iterable.com/hc/articles/23061677642260#embeddedreceived-events) 
event by calling [`POST /api/embedded-messaging/events/received`](https://support.iterable.com/hc/articles/204780579#post-api-embedded-messaging-events-received).

Generally, there's no need to call this method, since the SDK automatically 
tracks an `embeddedReceived` event for each message it fetches from the server.

```ts
const trackEmbeddedReceived = (
  messageId: string,
  appPackageName: string
): IterablePromise<IterableResponse>
```

Example:

```ts
import { trackEmbeddedReceived } from '@iterable/web-sdk';

trackEmbeddedReceived(messageId, packageName)
  .then((response: any) => {
    setTrackResponse(JSON.stringify(response.data));
    setTrackingEvent(false);
  })
  .catch((error: any) => {
    setTrackResponse(JSON.stringify(error.response.data));
    setTrackingEvent(false);
  });
```

See also:

- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackEmbeddedSession`

Tracks an [`embeddedSession`](https://support.iterable.com/hc/articles/23061677642260#embeddedsession-events) 
event and related [`embeddedImpression`](https://support.iterable.com/hc/articles/23061677642260#embeddedimpression-events)
events by calling [`POST /api/embedded-messaging/events/session`](https://support.iterable.com/hc/articles/204780579#post-api-embedded-messaging-events-session).

Generally, rather than calling this method, you'll track sessions and impresions 
using the SDK's [`IterableEmbeddedSessionManager`](#iterableembeddedsessionmanager).

```ts
const trackEmbeddedSession = (
  payload: IterableEmbeddedSessionRequestPayload
): IterablePromise<IterableResponse>
```

Example:

```ts
import { trackEmbeddedSession } from '@iterable/web-sdk';

trackEmbeddedSession(sessionData)
  .then((response: any) => {
    setTrackResponse(JSON.stringify(response.data));
    setTrackingEvent(false);
  })
  .catch((error: any) => {
    setTrackResponse(JSON.stringify(error.response.data));
    setTrackingEvent(false);
  });
```

See also:

- [`IterableEmbeddedSessionRequestPayload`](#iterableembeddedsessionrequestpayload)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackInAppClick`

Tracks an `inAppClick` event by calling [`POST /api/events/trackInAppClick`](https://support.iterable.com/hc/articles/204780579#post-api-events-trackinappclick).

```ts
const trackInAppClick = (
  payload: Omit<InAppEventRequestParams, 'inboxSessionId' | 'closeAction'>,
  sendBeacon = false
): IterablePromise<IterableResponse>
```

Example:

```ts
import { trackInAppClick } from '@iterable/web-sdk';

trackInAppClick({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch();
```

See also:

- [`InAppEventRequestParams`](#inappeventrequestparams)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackInAppClose`

Tracks an `inAppClose` event by calling [`POST /api/events/trackInAppClose`](https://support.iterable.com/hc/articles/204780579#post-api-events-trackinappclose).

```ts
const trackInAppClose = (payload: InAppEventRequestParams): IterablePromise<IterableResponse>
```

Example:

```ts
import { trackInAppClose } from '@iterable/web-sdk';

trackInAppClose({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch();
```

See also:

- [`InAppEventRequestParams`](#inappeventrequestparams)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackInAppConsume`

Deletes an in-app message from the server by calling [`POST /api/events/trackInAppConsume`](https://support.iterable.com/hc/articles/204780579#post-api-events-inappconsume).

```ts
const trackInAppConsume = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
): IterablePromise<IterableResponse>
```

Example:

```ts
import { trackInAppConsume } from '@iterable/web-sdk';

trackInAppConsume({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch();
```

See also:

- [`InAppEventRequestParams`](#inappeventrequestparams)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackInAppDelivery`

Tracks an `inAppDelivery` event by calling [`POST /api/events/trackInAppDelivery`](https://support.iterable.com/hc/articles/204780579#post-api-events-trackinappdelivery).

```ts
const trackInAppDelivery = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'closeAction' | 'inboxSessionId'
  >
): IterablePromise<IterableResponse>
```

Example:

```ts
import { trackInAppDelivery } from '@iterable/web-sdk';

trackInAppDelivery({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch();
```

See also:

- [`InAppEventRequestParams`](#inappeventrequestparams)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackInAppOpen`

Tracks an `inAppOpen` event by calling [`POST /api/events/trackInAppOpen`](https://support.iterable.com/hc/articles/204780579#post-api-events-trackinappopen).

```ts
const trackInAppOpen = (
  payload: Omit<
    InAppEventRequestParams,
    'clickedUrl' | 'inboxSessionId' | 'closeAction'
  >
): IterablePromise<IterableResponse>
```

Example:

```ts
import { trackInAppOpen } from '@iterable/web-sdk';

trackInAppOpen({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch();
```

See also:

- [`InAppEventRequestParams`](#inappeventrequestparams)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `trackPurchase`

Tracks a `purchase` event by calling [`POST /api/commerce/trackPurchase`](https://support.iterable.com/hc/articles/204780579#post-api-commerce-trackpurchase).

```ts
const trackPurchase = (payload: TrackPurchaseRequestParams): IterablePromise<IterableResponse>
```

Example:

```ts
import { trackPurchase } from '@iterable/web-sdk';

trackPurchase({
  items: [{ id: '123', name: 'keyboard', price: 100, quantity: 2 }],
  total: 200
})
  .then()
  .catch();
```

See also:

- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)
- [`TrackPurchaseRequestParams`](#trackpurchaserequestparams)

## `updateCart`

Updates the shopping cart items on the user's Iterable profile by calling [`POST /api/commerce/updateCart`](https://support.iterable.com/hc/articles/204780579#post-api-commerce-updatecart).

```ts
const updateCart = (payload: UpdateCartRequestParams): IterablePromise<IterableResponse>
```

Example:

```ts
import { updateCart } from '@iterable/web-sdk';

updateCart({
  items: [{ id: '123', price: 100, name: 'keyboard', quantity: 1 }]
})
  .then()
  .catch();
```

See also:

- [`UpdateCartRequestParams](#updatecartrequestparams)
- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

## `updateSubscriptions`

Updates the user's subscriptions by calling [`POST /api/users/updateSubscriptions`](https://support.iterable.com/hc/articles/204780579#post-api-users-updatesubscriptions).

```ts
const updateSubscriptions = (
  payload: Partial<UpdateSubscriptionParams> = {}
): IterablePromise<IterableResponse>
```

Example:

```ts
import { updateSubscriptions } from '@iterable/web-sdk';

updateSubscriptions({ emailListIds: [1, 2, 3] })
  .then()
  .catch();
```

See also:

- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)
- [`UpdateSubscriptionParams`](#updatesubscriptionparams)

## `updateUser`

Updates the data on a user's Iterable profile by calling [`POST /api/users/updateUser`](https://support.iterable.com/hc/articles/204780579#post-api-users-update).

```ts
const updateUser = (payload: UpdateUserParams = {}): IterablePromise<IterableResponse>
```

Example:

```ts
import { updateUser } from '@iterable/web-sdk';

updateUser({ dataFields: {} }).then().catch();
```

See also:

- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)
- [`UpdateUserParams`](#updateuserparams)

## `updateUserEmail`

Updates the current user's `email` by calling [`POST /api/users/updateEmail`](https://support.iterable.com/hc/articles/204780579#post-api-users-updateemail).
Causes the SDK to fetch a JWT for the new email address.

```ts
updateUserEmail: (newEmail: string): IterablePromise<IterableResponse>
```

Example:

```ts
import { updateUserEmail } from '@iterable/web-sdk';

updateUserEmail('user@example.com').then().catch();
```

See also:

- [`IterablePromise`](#iterablepromise)
- [`IterableResponse`](#iterableresponse)

# Classes, interfaces, types, and enums

This section describes classes, interfaces, and enums to be aware of when working 
with Embedded Messaging in Iterable's Web SDK.

| Type                                                                              | Description |
| --------------------------------------------------------------------------------- | ----------- |
| [`CloseButton`](#closebutton)                                                     | Specifies how the SDK should display a close button a fetched in-app message.  Passed as part of [`InAppMessagesRequestParams`](#inappmessagesrequestparams). |
| [`CloseButtonPosition`](#closebuttonposition)                                     | Specifies the position of a close button on an in-app message. |
| [`CommerceItem`](#commerceitem)                                                   | An item being purchased or added to a shopping cart. Include when calling [`trackPurchase`](#trackpurchase) or [`updateCart`](#updatecart). |
| [`CommerceUser`](#commerceuser)                                                   | Information about the user associated with a purchase or cart. Include when calling [`trackPurchase`](#trackpurchase) or [`updateCart`](#updatecart). |
| [`DisplayOptions`](#displayoptions)                                               | Display options to pass to [`getInAppMessages`](#getinappmessages) to indicate whether messages should be displayed immediately or later. |
| [`DisplayPosition`](#displayposition)                                             | Describes where an in-app message should be displayed. Part of [`WebInAppDisplaySettings`](#webinappdisplaysettings). |
| [`Elements`](#elements)                                                           | Custom styles to apply to `IterableEmbeddedCard`, `IterableEmbeddedBanner`, and `IterableEmbeddedNotification` views for embedded messages. |
| [`GenerateJWTPayload`](#generatejwtpayload)                                       | The payload to pass to the `generateJWT` function when calling [`initialize`](#initialize) or [`initializeWithConfig`](#initializewithconfig). |
| [`ErrorHandler`](#errorhandler)                                                   | An error-handling function. Passed as a parameter to [`IterableEmbeddedCard`](#iterableembeddedcard), [`IterableEmbeddedBanner`](#iterableembeddedbanner), and [`IterableEmbeddedNotification`](#iterableembeddednotification), which use the method to handle errors when tracking `embeddedClick` events. |
| [`GetInAppMessagesResponse`](#getinappmessagesresponse)                           | Return value for [`getInAppMessages`](#getinappmessages), when it's called without the `options` parameter. |
| [`HandleLinks`](#handlelinks)                                                     | Describes where in-app links should be opened. Part of [`InAppMessagesRequestParams`](#inappmessagesrequestparams). |
| [`InAppMessage`](#inappmessage)                                                   | A single in-app message. |
| [`InAppDisplaySetting`](#inappdisplaysetting)                                     | Display settings for an in-app message, including padding percentages. |
| [`InAppEventRequestParams`](#inappeventrequestparams)                             | Data to pass to [`trackInAppClick`](#trackinappclick), [`trackInAppClose`](#trackinappclose), [`trackInAppConsume`](#trackinappconsume), [`trackInAppDelivery`](#trackinappdelivery), and [`trackInAppOpen`](#trackinappopen). |
| [`InAppMessagesRequestParams`](#inappmessagesrqeuestparams)                       | Data to pass to [`getInAppMessages`](#getinappmessages). |
| [`InAppMessageResponse`](#inappmessageresponse)                                   | Return value for [`getInAppMessages`](#getinappmessages), when it's called with the `options` parameter. |
| [`InAppTrackRequestParams`](#inapptrackrequestparams)                             | Data to pass to [`track`](#track). |
| [`IterableAction`](#iterableaction)                                               | An action associated with a click. The type of the action, and its associated URL. |
| [`IterableActionContext`](#iterableactioncontext)                                 | Information about the context of an `IterableAction`. For example, the associated message type. Only used with embedded messages. |
| [`IterableActionSource`](#iterableactionsource)                                   | An enum of possible message types to which an `IterableAction` can be associated. Currently, only `EMBEDDED` is supported. |
| [`IterableConfig`](#iterableconfig)                                               | A class that can hold configuration information for the SDK. Currently, only `urlHandler` and `customActionHandler` are supported (static properties), and these are only invoked for URLs and custom actions coming from embedded messages. |
| [`IterableCustomActionHandler`](#iterablecustomactionhandler)                     | An interface that defines `handleIterableCustomAction`, which the SDK can call to handle custom action URLs (`action://`) URLs that result from from clicks on embedded messages. |
| [`IterableEmbeddedButton`](#iterableembeddedbutton)                               | Payload for a button associated with an embedded message. |  
| [`IterableEmbeddedButtonAction`](#iterableembeddedbuttonaction)                   | Payload for the action associated with an embedded message button. |
| [`IterableEmbeddedClickRequestPayload`](#iterableembeddedclickrequestpayload)     | Data to pass to [`trackEmbeddedClick`](#trackembeddedclick). | 
| [`IterableEmbeddedDefaultAction`](#iterableembeddeddefaultaction)                 | The default action associated with an embedded message. Invoked when a user clicks on an embedded message, but outside of its buttons. | 
| [`IterableEmbeddedElements`](#iterableembeddedelements)                           | Content associated with an embedded message — title, body, media URL, buttons, default action, and extra text fields. |
| [`IterableEmbeddedImpression`](#iterableembeddedimpression)                       | The number of times a given embedded message appeared during a specific session, and the total duration of all those appearances. Also includes other metadata about the impression. |
| [`IterableEmbeddedManager`](#iterableembeddedmanager)                             | Used to fetch embedded messages from Iterable, and pass them to application code as necessary. |
| [`IterableEmbeddedMessage`](#iterableembeddedmessage)                             | A single embedded message to display, including title text, body text, buttons, an image URL, click actions, text fields, and JSON data. |
| [`IterableEmbeddedMessageUpdateHandler`](#iterableembeddedmessageupdatehandler)   | An object that defines `onMessagesUpdated` and `onEmbeddedMessagingDisabled` methods. If this object is registered as an update listener for embedded messages (you can do this by calling `addUpdateListener` on [`IterableEmbeddedManager`](#iterableembeddedmanager)), the SDK calls these methods as necessary after fetching embedded messages from the server. |
| [`IterableEmbeddedMetadata`](#iterableembeddedmetadata)                           | Identifying information about an embedded message. |
| [`IterableEmbeddedSession`](#iterableembeddedsession)                             | Represents a period of time during which a user was on a page where they could potentially view embedded messages. Contains an ID, a start time, and an end time. |
| [`IterableEmbeddedSessionManager`](#iterableembeddedsessionmanager)               | Used to track sessions and impressions, and to save them back to Iterable. |
| [`IterableEmbeddedSessionRequestPayload`](#iterableembeddedsessionrequestpayload) | Data to pass to [`trackEmbeddedSession`](#trackembeddedsession). You won't usually interact manually with this interface, since the [`IterableEmbeddedSessionManager`](#iterableembeddedsessionmanager) handles the tracking of sessions and impressions for you. |
| [`IterableEmbeddedText`](#iterableembeddedtext)                                   | Extra text fields sent along with an embedded message. Like custom JSON, these text fields can be used to pass data as part of an embedded message. |
| [`IterableErrorStatus`](#iterableerrorstatus)                                     | Errors that can come back with an [`IterableResponse`](#iterableresponse). |
| [`IterablePromise`](#iterablepromise)                                             | A promise. |
| [`IterableResponse`](#iterableresponse)                                           | A response from Iterable's API. |
| [`IterableUrlHandler`](#iterableurlhandler)                                       | An interface that defines `handleIterableURL`, which the SDK can call to handle standard URLs (`https://`, `custom://`, but not `action://`) that result from from clicks on embedded messages. |
| [`OOTB`](#ootb)                                                                   | A type that defines the parameters to provide when calling `IterableEmbeddedCard`, `IterableEmbeddedBanner`, and `IterableEmbeddedNotification`. |
| [`Options`](#options)                                                             | Configuration options to pass to [`initializeWithConfig`](#initializewithconfig). |
| [`OutOfTheBoxButton`](#outoftheboxbutton)                                         | Custom styles to apply to buttons in an embedded message. The same as `OutOfTheBoxElement`, but with an extra `disabledStyles` string. |
| [`OutOfTheBoxElement`](#outoftheboxelement)                                       | The custom styles to apply to a single element of an embedded message. |
| [`SDKInAppMessagesParams`](#sdkinappmessagesparams)                               | Parent interface for [`InAppMessagesRequestParams`](#inappmessagesrequestparams). |
| [`TrackPurchaseRequestParams`](#trackpurchaserequestparams)                       | Parameters to pass to [`trackPurchase`](#trackpurchase). |
| [`UpdateCartRequestParams`](#updatecartrequestparams)                             | Data to pass to [`updateCart`](#updatecart). |
| [`UpdateSubscriptionParams`](#updatesubscriptionparams)                           | Data to pass to [`updateSubscriptions`](#updatesubscriptions). |
| [`UpdateUserParams`](#updateuserparams)                                           | Data to pass to [`updateUser`](#updateuser). |
| [`WebInAppDisplaySettings`](#webinappdisplaysettings)                             | An object that contains information about how to display the associated in-app message. |
| [`WithJWT`](#withjwt)                                                             | Return value from [`initialize`](#initialize) and [`initializeWithConfig`](#initializeWithConfig). |
| [`WithJWTParams`](#withjwtparams)                                                 | Parameters to pass to [`initializeWithConfig`](#initializewithconfig). |

## `CloseButton`

Specifies how the SDK should display a close button a fetched in-app message.
Passed as part of [`InAppMessagesRequestParams`](#inappmessagesrequestparams).

```ts
type CloseButton = {
    color?: string;
    iconPath?: string;
    // If true, prevent user from dismissing in-app message by clicking outside 
    // of message
    isRequiredToDismissMessage?: boolean;
    position?: CloseButtonPosition;
    sideOffset?: string;
    size?: string | number;
    topOffset?: string;
};
```

See also:

- [`CloseButtonPosition`](#closebuttonposition)

## `CloseButtonPosition`

Specifies the position of a close button on an in-app message.

```ts
declare enum CloseButtonPosition {
    TopLeft = "top-left",
    TopRight = "top-right"
}
```

## `CommerceItem`

An item being purchased or added to a shopping cart. Include when calling 
[`trackPurchase`](#trackpurchase) or [`updateCart`](#updatecart).

```ts
interface CommerceItem {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  categories?: string[];
  price: number;
  quantity: number;
  imageUrl?: string;
  url?: string;
  dataFields?: Record<string, any>;
}
```

## `CommerceUser`

Information about the user associated with a purchase or cart. Include when 
calling [`trackPurchase`](#trackpurchase) or [`updateCart`](#updatecart).

```ts
interface CommerceUser {
  dataFields?: Record<string, any>;
  preferUserId?: boolean;
  mergeNestedObjects?: boolean;
}
```

## `DisplayOptions`

Display options to pass to [`getInAppMessages`](#getinappmessages) to indicate
whether messages should be displayed immediately or later.

```ts
declare enum DisplayOptions {
    Immediate = "immediate",
    Deferred = "deferred"
}
```

## `DisplayPosition`

Describes where an in-app message should be displayed. Part of [`WebInAppDisplaySettings`](#webinappdisplaysettings).

```ts
declare enum DisplayPosition {
    Center = "Center",
    TopRight = "TopRight",
    BottomRight = "BottomRight",
    Full = "Full"
}
```

See also:

- [`WebInAppDisplaySettings`](#webinappdisplaysettings)

## `Elements`

Custom styles to apply to `IterableEmbeddedCard`, `IterableEmbeddedBanner`, and
`IterableEmbeddedNotification` views for embedded messages.

```ts
type Elements = {
  // img div
  img?: OutOfTheBoxElement;
  // title div
  title?: OutOfTheBoxElement;
  // primary button div
  primaryButton?: OutOfTheBoxButton;
  // secondary button div
  secondaryButton?: OutOfTheBoxButton;
  // body button div
  body?: OutOfTheBoxElement;
  // root OOTB div
  parent?: OutOfTheBoxElement;
  // button wrapper div
  buttonsDiv?: OutOfTheBoxElement;
  // title and parent wrapper div
  textTitle?: OutOfTheBoxElement;
  // textTitleImg div
  textTitleImg?: OutOfTheBoxElement;
};
```

See also:

- [`OutOfTheBoxElement`](#outoftheboxelement)
- [`OutOfTheBoxButton`](#outoftheboxbutton)

## `GenerateJWTPayload`

The payload to pass to the `generateJWT` function when calling [`initialize`](#initialize) 
or [`initializeWithConfig`](#initializewithconfig).

```ts
interface GenerateJWTPayload {
  email?: string;
  userID?: string;
}
```

## `ErrorHandler`

An error-handling function. Passed as a parameter to [`IterableEmbeddedCard`](#iterableembeddedcard), 
[`IterableEmbeddedBanner`](#iterableembeddedbanner), and [`IterableEmbeddedNotification`](#iterableembeddednotification), 
which use the method to handle errors when tracking `embeddedClick` events.

```ts
interface ErrorHandler {
  (error: any): void;
}
```

## `GetInAppMessagesResponse`

Return value for [`getInAppMessages`](#getinappmessages), when it's called without 
the `options` parameter.

```ts
interface GetInAppMessagesResponse {
  pauseMessageStream: () => void;
  resumeMessageStream: () => Promise<HTMLIFrameElement | ''>;
  request: () => IterablePromise<InAppMessageResponse>;
  triggerDisplayMessages: (
    messages: Partial<InAppMessage>[]
  ) => Promise<HTMLIFrameElement | ''>;
}
```

## `HandleLinks`

Describes where in-app links should be opened. Part of [`InAppMessagesRequestParams`](#inappmessagesrequestparams).

```ts
declare enum HandleLinks {
    OpenAllNewTab = "open-all-new-tab",
    OpenAllSameTab = "open-all-same-tab",
    ExternalNewTab = "external-new-tab"
}
```

## `InAppMessage`

A single in-app message.

```ts
interface InAppMessage {
  messageId: string;
  campaignId: number;
  createdAt: number;
  expiresAt: number;
  content: {
    payload?: Record<string, any>;
    html: string | HTMLIFrameElement;
    inAppDisplaySettings: {
      top: InAppDisplaySetting;
      right: InAppDisplaySetting;
      left: InAppDisplaySetting;
      bottom: InAppDisplaySetting;
      bgColor?: {
        alpha: number;
        hex: string;
      };
      shouldAnimate?: boolean;
    };
    webInAppDisplaySettings: WebInAppDisplaySettings;
  };
  customPayload: Record<string, any>;
  trigger: {
    type: string;
  };
  saveToInbox: boolean;
  inboxMetadata: {
    title: string;
    subtitle: string;
    icon: string;
  };
  priorityLevel: number;
  read: boolean;
}
```

See also:

- [`InAppDisplaySetting`](#inappdisplaysetting)
- [`WebInAppDisplaySettings`](#webinappdisplaysettings)

## `InAppDisplaySetting`

Display settings for an in-app message, including padding percentages.

```ts
interface InAppDisplaySetting {
  percentage?: number;
  displayOption?: string;
}
```

## `InAppEventRequestParams`

Data to pass to [`trackInAppClick`](#trackinappclick), [`trackInAppClose`](#trackinappclose),
[`trackInAppConsume`](#trackinappconsume), [`trackInAppDelivery`](#trackinappdelivery), and
[`trackInAppOpen`](#trackinappopen).

```ts
interface InAppEventRequestParams {
  messageId: string;
  clickedUrl?: string;
  messageContext?: {
    saveToInbox?: boolean;
    silentInbox?: boolean;
    location?: string;
  };
  closeAction?: string;
  deviceInfo: {
    appPackageName: string; 
  };
  inboxSessionId?: string;
  createdAt?: number;
}
```

## `InAppMessagesRequestParams`

Data to pass to [`getInAppMessages`](#getinappmessages).

```ts
interface InAppMessagesRequestParams extends SDKInAppMessagesParams {
    count: number;
    SDKVersion?: string;
    packageName: string;
}
```

See also:

- [`SDKInAppMessagesParams`](#sdkinappmessagesparams)

## `InAppMessageResponse`

Return value for [`getInAppMessages`](#getinappmessages), when it's called with
the `options` parameter.

```ts
interface InAppMessageResponse {
  inAppMessages: Partial<InAppMessage>[];
}
```

See also:

- [`InAppMessage`](#inappmessage)

## `InAppTrackRequestParams`

Data to pass to [`track`](#track).

```ts
interface InAppTrackRequestParams {
  eventName: string;
  id?: string;
  createdAt?: number;
  dataFields?: Record<string, any>;
  campaignId?: number;
  templateId?: number;
}
```

## `IterableAction`

An action associated with a click. The type of the action, and its associated
URL. Only used with embedded messages.

```ts
interface IterableAction {
  type: string;
  data: string;
}
```

The values for `type` and `data` depend on the type of action assigned to the
campaign in Iterable:

- For **Open URL** actions, `type` is `openUrl` and `data` contains the URL.
- For **Custom action** actions, `type` is the URL, and `data` is empty.

## `IterableActionContext`

Information about the context of an `IterableAction`. For example, the
associated message type. Only used with embedded messages.

```ts
interface IterableActionContext {
  action: IterableAction;
  source: IterableActionSource;
}
```

See also:

- [`IterableAction`](#iterableaction)
- [`IterableActionSource`](#iterableactionsource)

## `IterableActionSource`

An enum of possible message types to which an `IterableAction` can be associated. 
Currently, only `EMBEDDED` is supported.

```ts
enum IterableActionSource {
  EMBEDDED = 'EMBEDDED'
}
```

## `IterableConfig`

A class that can hold configuration information for the SDK. Currently, only
`urlHandler` and `customActionHandler` are supported (static properties), and
these are only invoked for URLs and custom actions coming from embedded messages.

```ts
class IterableConfig {
  public static urlHandler: IterableUrlHandler | null = null;
  public static customActionHandler: IterableCustomActionHandler | null = null;
}
```

See also:

- [`IterableUrlHandler`](#iterableurlhandler)
- [`IterableCustomActionHandler`](#iterablecustomactionhandler)

## `IterableCustomActionHandler`

An interface that defines `handleIterableCustomAction`, which the SDK can call to 
handle custom action URLs (`action://`) URLs that result from from clicks on 
embedded messages.

```ts
interface IterableCustomActionHandler {
  handleIterableCustomAction(
    action: IterableAction,
    actionContext: IterableActionContext
  ): boolean;
}
```

See also:

- [`IterableAction`](#iterableaction)
- [`IterableActionContext`](#iterableactioncontext)

## `IterableEmbeddedButton`

Payload for a button associated with an embedded message. 

```ts
interface IterableEmbeddedButton {
  id: string;
  title?: string;
  action?: IterableEmbeddedButtonAction;
}
```

See also:

- [`IterableEmbeddedButtonAction`](#iterableembeddedbuttonaction)

## `IterableEmbeddedButtonAction`

Payload for the action associated with an embedded message button.

```ts
interface IterableEmbeddedButtonAction {
  type: string;
  data?: string;
}
```

The values for `type` and `data` depend on the type of action assigned to the
campaign in Iterable:

- For **Open URL** actions, `type` is `openUrl` and `data` contains the URL.
- For **Custom action** actions, `type` is the URL, and `data` is empty.

## `IterableEmbeddedClickRequestPayload`

Data to pass to [`trackEmbeddedClick`](#trackembeddedclick).

```ts
interface IterableEmbeddedClickRequestPayload {
  messageId: string;
  buttonIdentifier: string;
  targetUrl: string;
  appPackageName: string;
}
```

## `IterableEmbeddedDefaultAction`

The default action associated with an embedded message. Invoked when a user
clicks on an embedded message, but outside of its buttons.

```ts
interface IterableEmbeddedDefaultAction {
  type: string;
  data?: string;
}
```

The values for `type` and `data` depend on the type of action assigned to the
campaign in Iterable:

- For **Open URL** actions, `type` is `openUrl` and `data` contains the URL.
- For **Custom action** actions, `type` is the URL, and `data` is empty.

## `IterableEmbeddedElements`

Content associated with an embedded message — title, body, media URL,
buttons, default action, and extra text fields.

```ts
interface IterableEmbeddedElements {
  title?: string;
  body?: string;
  mediaUrl?: string;
  buttons?: IterableEmbeddedButton[];
  text?: IterableEmbeddedText[];
  defaultAction?: IterableEmbeddedDefaultAction;
}
```

See also:

- [`IterableEmbeddedButton`](#iterableembeddedbutton)
- [`IterableEmbeddedText`](#iterableembeddedtext)
- [`IterableEmbeddedDefaultAction`](#iterableembeddeddefaultaction)

## `IterableEmbeddedImpression`

The number of times a given embedded message appeared during a specific session,
and the total duration of all those appearances. Also includes other metadata
about the impression.

```ts
interface IterableEmbeddedImpression {
  messageId: string;
  displayCount: number;
  displayDuration: number;
  placementId?: number;
}
```

## `IterableEmbeddedManager`

Used to fetch embedded messages from Iterable, and pass them to application code
as necessary.

```ts
class IterableEmbeddedManager {
    appPackageName: string;
    constructor(appPackageName: string);
    syncMessages(packageName: string, callback: () => void, placementIds?: number[]): Promise<void>;
    getMessages(): IterableEmbeddedMessage[];
    getMessagesForPlacement(placementId: number): IterableEmbeddedMessage[];
    addUpdateListener(updateListener: IterableEmbeddedMessageUpdateHandler): void;
    getUpdateHandlers(): IterableEmbeddedMessageUpdateHandler[];
    click(clickedUrl: string | null): void;
}
```

Descriptions:

- `appPackageName` – The package name  you use to identify your website. Set
  this value by passing it to the constructror.

- `syncMessages` – Fetches embedded messages for which the signed-in user is
  eligible. If `placementIds` is provided, fetches only messages for those
  placements. Calls `callback` after fetching messages.

- `getMessages` – Returns all embedded messages that the SDK has already fetched.
  Does not fetch messages from the server.

- `getMessagesForPlacement` – Returns all embedded messages for a given placement
  ID. Does not fetch messages from the server.

- `addUpdateListener` – Registers an object that implements the
  `IterableEmbeddedMessageUpdateHandler` interface. The SDK calls the object's
  `onMessagesUpdated` and `onEmbeddedMessagingDisabled` methods as necessary
  after fetching embedded messages from the server.

- `getUpdateHandlers` – Returns all objects that have been registered as update
  listeners.

- `click` – Passes the provided URL (depending on its type) to the URL handler 
  or custom action handler defined on `IterableConfig`. `action://` URLs are
  passed to the custom action handler, and other URLs are passed to the URL 
  handler. The SDK does not currently support `iterable://` URLs for 
  embedded messages.

See also:

- [`IterableEmbeddedMessage`](#iterableembeddedmessage)
- [`IterableEmbeddedMessageUpdateHandler`](#iterableembeddedmessageupdatehandler)
- [`IterableConfig`](#iterableconfig)
- [`IterableUrlHandler`](#iterableurlhandler)
- [`IterableCustomActionHandler`](#iterablecustomactionhandler)

## `IterableEmbeddedMessage`

A single embedded message to display, including title text, body text, buttons,
an image URL, click actions, text fields, and JSON data.

```ts
interface IterableEmbeddedMessage {
  metadata: IterableEmbeddedMetadata;
  elements?: IterableEmbeddedElements;
  payload?: Record<string, any>;
}
```

See also:

- [`IterableEmbeddedMetadata`](#iterableembeddedmetadata)
- [`IterableEmbeddedElements`](#iterableembeddedelements)

## `IterableEmbeddedMessageUpdateHandler`

An object that defines `onMessagesUpdated` and `onEmbeddedMessagingDisabled`
methods. If this object is registered as an update listener for embedded messages
(you can do this by calling `addUpdateListener` on [`IterableEmbeddedManager`](#iterableembeddedmanager)),
the SDK calls these methods as necessary after fetching embedded messages from 
the server.

```ts
interface IterableEmbeddedMessageUpdateHandler {
    onMessagesUpdated: () => void;
    onEmbeddedMessagingDisabled: () => void;
}
```

Descriptions:

- `onMessagesUpdated` – Called by the SDK after it fetches embedded messages
  from Iterable. Use this method to display messages.

- `onEmbeddedMessagingDisabled` – Called by the SDK if there are errors fetching
  embedded messages from Iterable. Use this method to display an empty state
  or hide the placement.

## `IterableEmbeddedMetadata`

Identifying information about an embedded message.

```ts
interface IterableEmbeddedMetadata {
  messageId: string;
  campaignId?: number;
  isProof?: boolean;
  placementId?: number;
}
```

## `IterableEmbeddedSession`

Represents a period of time during which a user was on a page where they could
potentially view embedded messages. Contains an ID, a start time, and an end
time.

```ts
interface IterableEmbeddedSession {
  id: string;
  start?: number;
  end?: number;
}
```

## `IterableEmbeddedSessionManager`

Used to track sessions and impressions, and to save them back to Iterable.

```ts
class IterableEmbeddedSessionManager {
    appPackageName: string;
    session: EmbeddedSession;
    constructor(appPackageName: string);
    startSession(): void;
    endSession(): Promise<void>;
    startImpression(messageId: string, placementId: number): void;
    pauseImpression(messageId: string): void;
}
```

Descriptions:

- `appPackageName` – The package name you use to identify your website. Set
  this value by passing it to the constructor.

- `session` – The current session. Set by calling `startSession` and `endSession`.

- `startSession` – Starts a new session. A session is a period of time when a 
  user is on a page where embedded messages can be displayed.

- `endSession` – Ends the active session, and saves data about the session and
  its associated impressions back to Iterable.

- `startImpression` – Starts a new impression for a given message ID and placement
  ID. An impression captures the number of times a given messages is visible during
  a given session, and the total duration of all those appearances.

- `pauseImpression` – Pauses the impression for a given message ID. Call this method
  when a message is no longer visible. If the message becomes visible again, 
  call `startImpression` to resume the impression.

## `IterableEmbeddedSessionRequestPayload`

Data to pass to [`trackEmbeddedSession`](#trackembeddedsession). You won't usually
interact manually with this interface, since the [`IterableEmbeddedSessionManager`](#iterableembeddedsessionmanager)
handles the tracking of sessions and impressions for you.

```ts
interface IterableEmbeddedSessionRequestPayload {
  session: IterableEmbeddedSession;
  impressions?: IterableEmbeddedImpression[];
  appPackageName: string;
}
```

See also:

- [`IterableEmbeddedSession`](#iterableembeddedsession)
- [`IterableEmbeddedImpression`](#iterableembeddedimpression)

## `IterableEmbeddedText`

Extra text fields sent along with an embedded message. Like custom JSON, these
text fields can be used to pass data as part of an embedded message. 

```ts
interface IterableEmbeddedText {
  id: string;
  text?: string;
}
```

## `IterableErrorStatus`

Errors that can come back with an [`IterableResponse`](#iterableresponse).

```ts
type IterableErrorStatus =
  | 'Success'
  | 'BadApiKey'
  | 'BadParams'
  | 'BadJsonBody'
  | 'QueueEmailError'
  | 'GenericError'
  | 'InvalidEmailAddressError'
  | 'DatabaseError'
  | 'EmailAlreadyExists'
  | 'Forbidden'
  | 'JwtUserIdentifiersMismatched'
  | 'InvalidJwtPayload';
```

## `IterablePromise`

A promise.

```ts
IterablePromise<T = any> = AxiosPromise<T>;
```

## `IterableResponse`

A response from Iterable's API.

```ts
interface IterableResponse {
  code: IterableErrorStatus;
  msg: string;
  params?: null | Record<string, any>;
}
```

## `IterableUrlHandler`

An interface that defines `handleIterableURL`, which the SDK can call to handle
standard URLs (`https://`, `custom://`, but not `action://`) that result from 
from clicks on embedded messages.

```ts
interface IterableUrlHandler {
  handleIterableURL(uri: string, actionContext: IterableActionContext): boolean;
}
```

See also:

- [`IterableActionContext`](#iterableactioncontext)
- [`IterableConfig`](#iterableconfig)
- [`IterableEmbeddedManager`](#iterableembeddedmanager)

## `OOTB`

A type that defines the parameters to provide when calling
`IterableEmbeddedCard`, `IterableEmbeddedBanner`, and
`IterableEmbeddedNotification`.

```ts
type OOTB = {
  appPackageName: string;
  message: IterableEmbeddedMessage;
  htmlElements?: Elements;
  // Callback method to handle button or element click errors
  errorCallback?: ErrorHandler;
};
```

See also:

- [`Elements`](#elements)
- [`IterableEmbeddedBanner`](#iterableembeddedcard)
- [`IterableEmbeddedCard`](#iterableembeddedbanner)
- [`IterableEmbeddedNotification`](#iterableembeddednotification)
- [`IterableEmbeddedMessage`](#iterableembeddedmessage)
- [`ErrorHandler`](#errorhandler)

## `Options`

Configuration options to pass to [`initializeWithConfig`](#initializewithconfig).

```ts
type Options = {
  logLevel: 'none' | 'verbose';
  baseURL: string;
  isEuIterableService: boolean;
  dangerouslyAllowJsPopups: boolean;
};
```

## `OutOfTheBoxButton`

Custom styles to apply to buttons in an embedded message. The same as
`OutOfTheBoxElement`, but with an extra `disabledStyles` string.

```ts
type OutOfTheBoxButton = OutOfTheBoxElement & {
  // Stringified CSS to be passed to element "style" tag. The presence of this 
  // value determines whether or not the button is in disabled.
  disabledStyles?: string;
};
```

## `OutOfTheBoxElement`

The custom styles to apply to a single element of an embedded message.

```ts
type OutOfTheBoxElement = {
  // id of the element 
  id?: string;
  // Stringified CSS to be passed to element "style" tag
  styles?: string;
};
```

## `SDKInAppMessagesParams`

Parent interface for [`InAppMessagesRequestParams`](#inappmessagesrequestparams).

```ts
interface SDKInAppMessagesParams {
    displayInterval?: number;
    onOpenScreenReaderMessage?: string;
    onOpenNodeToTakeFocus?: string;
    topOffset?: string;
    bottomOffset?: string;
    rightOffset?: string;
    animationDuration?: number;
    handleLinks?: HandleLinks;
    closeButton?: CloseButton;
    // messageId of the latest (i.e., most recent) message in the device's 
    // local cache 
    latestCachedMessageId?: string;
}
```

See also:

- [`InAppMessaagesRequestParams`](#inappmessagesrequestparams)

See also:

- [`HandleLinks`](#handlelinks)
- [`CloseButton`](#closebutton)

## `TrackPurchaseRequestParams`

Parameters to pass to [`trackPurchase`](#trackpurchase).

```ts
interface TrackPurchaseRequestParams {
  id?: string;
  user?: CommerceUser;
  items: CommerceItem[];
  campaignId?: string;
  templateId?: string;
  total: number;
  createdAt?: number;
  dataFields?: Record<string, any>;
}
```

See also:

- [`CommerceUser`](#commerceuser)
- [`CommerceItem`](#commerceitem)

## `UpdateCartRequestParams`

Data to pass to [`updateCart`](#updatecart).

```ts
interface UpdateCartRequestParams {
  user?: CommerceUser;
  items: CommerceItem[];
}
```

See also:

- [`CommerceUser`](#commerceuser)
- [`CommerceItem`](#commerceitem)

## `UpdateSubscriptionParams`

Data to pass to [`updateSubscriptions`](#updatesubscriptions).

```ts
interface UpdateSubscriptionParams {
  emailListIds: number[];
  unsubscribedChannelIds: number[];
  unsubscribedMessageTypeIds: number[];
  subscribedMessageTypeIds: number[];
  campaignId: number;
  templateId: number;
}
```

## `UpdateUserParams`

Data to pass to `updateUser`.

```ts 
interface UpdateUserParams {
  dataFields?: Record<string, any>;
  preferUserId?: boolean;
  mergeNestedObjects?: boolean;
}
```

## `WebInAppDisplaySettings`

An object that contains information about how to display the associated in-app 
message.

```ts
interface WebInAppDisplaySettings {
  position: DisplayPosition;
}
```

## `WithJWT`

Return value from [`initialize`](#initialize) and [`initializeWithConfig`](#initializeWithConfig).

```ts
interface WithJWT {
  clearRefresh: () => void;
  setEmail: (email: string) => Promise<string>;
  setUserID: (userId: string) => Promise<string>;
  logout: () => void;
  refreshJwtToken: (authTypes: string) => Promise<string>;
}
```

Definitions:

- `clearRefresh` – Clears the JWT refresh timer.
- `setEmail` – Identifies the current user by `email`, and fetches a valid JWT 
  token by calling the `generateJWT` function passed to [`initialize`](#initialize) 
  or [`initializeWithConfig`](#initializeWithConfig).
- `setUserID` - Identifies the current user by `userId`, and fetches a valid JWT 
  token by calling the `generateJWT` function passed to [`initialize`](#initialize) 
  or [`initializeWithConfig`](#initializeWithConfig).
- `refreshJwtToken` – Manually refreshes the JWT token for the signed-in user.
- `logout` – Signs the current user out of the SDK.

## `WithJWTParams`

Parameters to pass to [`initializeWithConfig`](#initializewithconfig).

```ts
interface WithJWTParams {
  authToken: string;
  configOptions: Partial<Options>;
  generateJWT: (payload: GenerateJWTPayload) => Promise<string>;
}
```

`generateJWT` should be a function that takes a `userId` or `email` and uses
it to fetch, from your server, a valid JWT token for that user. The function
should return the token as a string.

See also:

- [`Options`](#options)
- [`GenerateJWTPayload`](#generatejwtpayload)

# FAQ

## How do I use Iterable's Web SDK to fetch and display embedded messages?

For detailed instructions about how to use Iterable's Web SDK SDK to fetch and
display embedded messages, see [Embedded Messages with Iterable's Web SDK](https://support.iterable.com/hc/articles/27537816889108).

For more information about Embedded Messaging, read the [Embedded Messaging Oveview](https://support.iterable.com/hc/articles/23060529977364).

## How do I make API requests with the SDK?

Follow these steps:

1. In Iterable, [create a JWT-enabled, web API key](https://support.iterable.com/hc/articles/360043464871). 
   The SDK will use this key to authenticate with Iterable's API endpoints. This
   will ensure the SDK has access to all the necessary.  Save the API key and
   its associated JWT secret, since you'll need them both.

2. Work with your Engineering team to create a web service the SDK can call
   to fetch a valid JWT token for the signed-in user. To learn more about how
   to do this, read [JWT-Enabled API Keys](https://support.iterable.com/hc/articles/360050801231).

3. Use the API key to initialize the SDK, as described in [`initialize`](#initialize) 
   and [`initializeWithConfig`](#initializewithconfig). When you initialize the 
   SDK, to pass in a method that can call the web service (created in step 2)
   to fetch a valid JWT token for the signed-in user.

4. To identify the user to the SDK, call `setEmail` or `setUserID` (returned by 
   [`initialize`](#initialize) or [`initializeWithConfig`](#initializewithconfig)). 
   The SDK uses the user's `email` or `userId` to fetch a valid JWT token from 
   your server. 

5. After the SDK successfully sets the user's `email` or `userId`, you can make 
   API requests to Iterable. For example, you can call [`track`](#track) to track 
   events, or [`getInAppMessages`](#getinappmessages) to fetch in-app messages.
    
    
## How does SDK add the user's `email` or `userId` to the requests it makes to Iterable?

The SDK uses a library called [Axios](https://github.com/axios/axios). To add
user information to outgoing requests, the SDK uses [Axios interceptors](https://github.com/axios/axios#interceptors).

## How can I manipulate the API requests the SDK makes to Iterable?

Iterable's Web SDK SDK exposes the base Axios request instance, which you can 
modify as necessary. For example:

```ts
import { baseAxiosRequest } from '@iterable/web-sdk';
```

For example, if you want to set an `email` query param on every outgoing
request, you could do somethign like this:

```ts
import { baseAxiosRequest } from '@iterable/web-sdk';

(() => {
  baseAxiosRequest.interceptors.request.use((config) => {
    return {
      ...config,
      params: {
        ...config.params,
        email: 'user@example.com'
      }
    };
  });
})();
```

:rotating_light: You most likely will not need to do anything with the underlying
Axios request. This is only for advanced use cases.

## How do I add a delay between the display of multiple in-app messages?

To add a delay between the display of multiple in-app messages:

1. In the object you pass as the first parameter to `getInAppMessages`, set
   `displayInterval` to the number of milliseconds you want to wait between
   messages.

2. In the object you pass as the second parameter to `getInAppMessages`, set
   `display` to `deferred`.

Then, to show messages, pause the display of messages, and resume the display of
messages, use the methods returned by `getInAppMessages`.

For example, this code fetches in-app messages from Iterable but doesn't display
them:

```ts
import { initialize, getInAppMessages } from '@iterable/web-sdk';

(() => {
  const { setUserID } = initialize('YOUR_API_KEY_HERE', ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
  );

  yourAsyncLoginMethod().then((response) => {
    setUserID(response.user_id).then(() => {
      getInAppMessages({
        count: 20,
        packageName: 'my-website'
      })
        .then()
        .catch();
    });
  });
})();
```

This code fetches in-app messages and displays them automatically:

```ts
import { initialize, getInAppMessages } from '@iterable/web-sdk';

(() => {
  const { setUserID } = initialize('YOUR_API_KEY_HERE', ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
  );

  yourAsyncLoginMethod().then((response) => {
    setUserID(response.user_id).then(() => {
      const { request } = getInAppMessages(
        {
          count: 20,
          packageName: 'my-website'
        },
        { display: 'immediate' }
      );

      // Trigger the start of message presentation
      request().then().catch();
    });
  });
})();
```

This code manipulates the display of in-app messages by setting more fields in
the object passed as the first parameter to [`getInAppmessages`](#getinappmessages):

```ts
import { initialize, getInAppMessages } from '@iterable/web-sdk';

(() => {
  const { setUserID } = initialize('YOUR_API_KEY_HERE', ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
  );

  yourAsyncLoginMethod().then((response) => {
    setUserID(response.user_id).then(() => {
      const { request } = getInAppMessages(
        {
          count: 20,
          packageName: 'my-website',
          displayInterval: 5000,
          onOpenScreenReaderMessage:
            'hey screen reader here telling you something just popped up on your screen!',
          onOpenNodeToTakeFocus: 'input',
          topOffset: '20px',
          bottomOffset: '20px',
          rightOffset: '20px',
          animationDuration: 400,
          handleLinks: 'external-new-tab'
        },
        { display: 'immediate' }
      );

      // Trigger the start of message presentation
      request().then().catch();
    });
  });
})();
```

This code pauses the display of messages, and then resumes:

```ts
import { initialize, getInAppMessages } from '@iterable/web-sdk';

(() => {
  const { setUserID } = initialize('YOUR_API_KEY_HERE', ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
  );

  yourAsyncLoginMethod().then((response) => {
    setUserID(response.user_id).then(() => {
      const { request, pauseMessageStream, resumeMessageStream } =
        getInAppMessages(
          {
            count: 20,
            packageName: 'my-website'
          },
          { display: 'immediate' }
        );

      // Trigger the start of message presentation 
      request().then().catch();

      // Prevent any more in-app messages from appearing for a little while
      pauseMessageStream();

      // Pick up where you left off — show the next message in the queue, and 
      // start the timer again.
      resumeMessageStream();
    });
  });
})();
```

This code manipulates the list of in-app messages before displaying them:

```ts
import {
  initialize,
  getInAppMessages,
  sortInAppMessages,
  filterHiddenInAppMessages
} from '@iterable/web-sdk';

(() => {
  const { setUserID } = initialize('YOUR_API_KEY_HERE', ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
  );

  yourAsyncLoginMethod().then((response) => {
    setUserID(response.user_id).then(() => {
      const { request, pauseMessageStream, resumeMessageStream } =
        getInAppMessages(
          {
            count: 20,
            packageName: 'my-website'
          },
          { display: 'deferred' }
        );

      // Trigger the start of message presentation
      request()
        .then((response) => {
          // Do your own manipulation here 
          const filteredMessages = doStuffToMessages(
            response.data.inAppMessages
          );

          // Also, feel free to take advantage of the sorting/filtering 
          // methods used internally 
          const furtherManipulatedMessages = sortInAppMessages(
            filterHiddenInAppMessages(response.data.inAppMessages)
          ) as InAppMessage[];

          // Display them whenever you want
          triggerDisplayMessages(furtherManipulatedMessages);
        })
        .catch();
    });
  });
})();
```

## How can I make sure that in-app messages are displayed responsively?

The SDK handles this for you. In-app message presentation varies based on 
the display type (center, full, top-right, bottom-right) you select when sending
the campaign:

| Message Position &#8594; <br><br> Browser Size &#8595; | Center | Full | Top-Right | Bottom-Right |
| ------------------------------------------------------ | ------ | ---- | --------- | ------------ |
| 0px - 850px                                            | 100%   | 100% | 100%      | 100%         |
| 851px - 975px                                          | 50%    | 100% | 45%       | 45%          |
| 976px - 1300px                                         | 50%    | 100% | 33%       | 33%          |
| 1300px+                                                | 50%    | 100% | 25%       | 25%          |

For example:

- If your in-app message is positioned at the top-right of the screen and your
  browser window is at 1000px, your in-app message will take up 33% of the
  screen.
- If your in-app is positioned in the center and your browser if at 700px, your
  in-app message will grow to take up 100% of the screen.

This chart also implies that yout in-app message is taking 100% of its container. 
Your results may vary if you add, for example, a `max-width: 200px` CSS rule to 
your message HTML. 

Regardless of how you write your CSS, these rules take effect. So, when creating
an in-app message, it is best to stick with percentage-based CSS widths.

## How do I add custom callbacks to handle link clicks on in-app and embedded messages?

See [Link handling](#link-handling).

## What if the user's JWT expires?

The SDK automatically handles JWT expiration and refresh. It fetches a new JWT
token for the signed-in user at four different times:

- When you sign a user in by calling `setEmail` or `setUserID`.
- When the JWT is within 1 minute of expiration.
- When a request to Iterable's API request fails with a `401` response.
- When your application code calls `updateUserEmail`.

To fetch a new JWT, the SDK calls the `generateJWT` function passed to
[`initialize`](#initialize) or [`initializeWithConfig`](#initializeWithConfig).

If there's a failure when requesting a new JWT, the SDK does not try again.
At that point, further requests to Iterable's API will fail.

To perform a manual JWT token refresh, call [`refreshJwtToken`](#refreshjwttoken).

# Iterable's European data center (EUDC)

If your Iterable project is hosted on Iterable's [European data center (EUDC)](https://support.iterable.com/hc/articles/17572750887444), 
you'll need to configure Iterable's Web SDK to interact with Iterable's EU-based 
API endpoints.

To do this, you have two options:

- On the web server that hosts your site, set the `IS_EU_ITERABLE_SERVICE` 
  environment variable to `true`. 

- Or, when use [`initializeWithConfig`](#initializeWithConfig) to initialize
  the SDK (rather then [`initialize`](#initialize)), and set set the 
  `isEuIterableService` configuration option to `true`. For example:

  ```ts
  import { initializeWithConfig } from '@iterable/web-sdk';
  
  const { clearRefresh, setEmail, logout } = initializeWithConfig({
    authToken: 'my-API-key',
      configOptions: {
      isEuIterableService: true,
    },
    generateJWT: ({ email }) =>
      yourAsyncJWTGeneratorMethod({ email }).then(
        ({ jwt_token }) => jwt_token
      )
  });
  ```

# Link handling

The SDK allows you to write your own callbacks to implement custom link-handling
behavior. However, you'll do this in different ways for embedded messages and
in-app messages.

## Embedded messaging

To learn how to handle clicks on links found in embededd messages, read
[Embedded Messages with Iterable's Web SDK](https://support.iterable.com/hc/articles/27537816889108#step-8-2-handle-urls-and-custom-actions).

## In-app messages

In-app messages render in an `iframe` element. If you choose to have the SDK 
render messages automatically, the event handler responsible for handling link
clicks gets hijacked by internal SDK code. To the user, this doesn't change the
experience — links open the link in the same browser tab unless given the
`target="_blank"` property.

However, the `handleLinks` option that you can provide to [`getInAppMessages`](#getInAppMessages) 
allows you to specify how the SDK opens in-app message links: in the current tab, 
in a new tab, or a combination (external links in a new tab, internal links in the current tab). 
For example, consider this code:

```ts
import { getInAppMessages } from '@iterable/web-sdk';

getInAppMessages({
  count: 5,
  packageName: 'my-website',
  handleLinks: 'external-new-tab'
});
```

This example code ensures the following links open in the same tab if your 
domain is `mydomain.com`:

```
/about
https://mydomain.com
https://mydomain.com/about
```

And that these will open in a new tab:

```
https://google.com
https://hello.com
```

### Reserved URL schemes

For in-app messages, the SDK reserves the `iterable://` and `action://` URL 
schemes for custom purposes.

1. `iterable://dismiss` - Removes an in-app message from the screen, grabs the
   next one to display, and invokes both [trackInAppClose](#trackInAppClose) and
   [trackInAppClick](#trackInAppClick). Not applicable to embedded messages.

2. `action://<CUSTOM_URL>` - Makes a [`Window.prototype.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
   call with payload `{ type: 'iterable-action-link', data: '{anything}' }`, to be
   consumed by the parent website as needed. These links also dismiss the message
   and invoke [trackInAppClose](#trackInAppClose) and [trackInAppClick](#trackInAppClick).

The SDK may reserve more keywords in the future.

:rotating_light: `iterable://` and `action://` links are not supported with
WebKit (which affects iOS web browsers, Safari included). In these browsers,
users can close an in-app message by clicking away from the message.

### Routing in single-page apps

You can add custom routing or callback functions for link clicks on in-app
messages.

For example, if you want to intercept a link click and use a client-side routing
solution to send the user to your `/about` page, you could so something like this
(this example assumes that you're using React Router):

```ts
// This example assumes a click on this link: 
// <a href="action://about">Go to the about page</a>
import { useHistory } from 'react-router-dom';

const SomeComponent = () => {
  const history = useHistory();
  React.useEffect(() => {
    global.addEventListener('message', (event) => {
      if (event.data.type && event.data.type === 'iterable-action-link') {
        // Route us to the content that comes after "action://" 
        history.push(`/${event.data.data}`);
      }
    });
  }, []);

  return <></>;
};
```

### Safari: Allowing JavaScript execution in tabs opened by in-app message link clicks

To display an in-app message, Iterable's Web SDK uses an `iframe` on which the
`sandbox` attribute is set to `allow-same-origin allow-popups allow-top-navigation`. 
On Safari, this configuration blocks JavaScript execution in tabs that open because 
of link clicks in the `iframe`.

To allow JavaScript to run in these new tabs, use [`initializeWithConfig`](#initializeWithConfig) ,
pass in the configuration options, and set `dangerouslyAllowJsPopups` to `true`.

For example:

```ts
import { initializeWithConfig } from '@iterable/web-sdk';

const { clearRefresh, setEmail, setUserID, logout } = initializeWithConfig({
  authToken: '<YOUR_API_KEY_HERE>',
  configOptions: {
    isEuIterableService: false,
    dangerouslyAllowJsPopups: true,
  },
  // email will be defined if you call setEmail
  // userID will be defined if you call setUserID
  generateJWT: ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
}
);
```

However, use caution. Allowing JavaScript to run in new tabs opens the door to
the possibility of malicious code execution.

SDK version support:

- Versions [`1.0.11+`](https://github.com/Iterable/iterable-web-sdk/releases/tag/v1.0.10)
  of Iterable's Web SDK support the `DANGEROUSLY_ALLOW_JS_POPUP_EXECUTION`
  environment variable.

For more information, see:

- [MDN docs for `allow-popups-to-escape-sandbox`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#allow-popups-to-escape-sandbox)
- [Can I Use? `allow-popups-to-escape-sandbox`](https://caniuse.com/mdn-html_elements_iframe_sandbox_allow-popups-to-escape-sandbox)

# TypeScript

Iterable's Web SDK includes TypeScript definitions. All SDK methods should be
typed for you, but if you need to import specific typings, you can parse through
each `types.d.ts` file inside of the `./dist` directory to find what you need.
Request and response payloads should all be available.

If something is missing, please let us know.

# Contributing

Looking to contribute? Please see the [contributing instructions here](./CONTRIBUTING.md) 
for more details.

# License

This SDK is released under the MIT License. See [LICENSE](./LICENSE.md) for more
information.

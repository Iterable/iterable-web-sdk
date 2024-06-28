![Iterable-Logo](https://user-images.githubusercontent.com/7387001/129065810-44b39e27-e319-408c-b87c-4d6b37e1f3b2.png)

# Iterable's Web SDK

[Iterable](https://www.iterable.com) is a growth-marketing platform that helps
you to create better experiences for—and deeper relationships with—your customers. 
Use it to send customized email, SMS, push notification, in-app message, web push 
notification campaigns to your customers.

This SDK helps you integrate your Web apps with Iterable.

# Table of contents

- [Installation](#installation)
- [API](#api)
- [Usage](#usage)
- [FAQ](#faq)
- [About links](#about-links)
- [TypeScript](#typescript)
- [Contributing](#contributing)
- [License](#license)

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

# Functions

Iterable's Web SDK exposes the following functions, which you can use in your
website code.

For information about the data the SDK sends and receives when making calls to
Iterable's API, see the [API Overview](https://support.iterable.com/hc/articles/204780579).

| Method Name                                                                       | Description |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`filterHiddenInAppMessages`](#filterhiddeninappmessages)                         | From an array of passed-in in-app messages, filters out messages that have been already been read and messages that should not be displayed. |
| [`filterOnlyReadAndNeverTriggerMessages`](#filteronlyreadandnevertriggermessages) | From an array of passed-in in-app messages, filters out messages that have been already been read and messages that should not be displayed. |
| [`getInAppMessages`](#getInAppMessages)                                           | Fetches and returns in-app messages (as a `Promise`). Or, if the `options` argument is provided, returns methods to fetch, pause/resume, and/or display in-app messages. |
| [`initialize`](#initialize)                                                       | Returns methods for identifying users and setting a JWT. |
| [`initializeWithConfig`](#initializeWithConfig)                                   | Returns methods for identifying users and setting a JWT, while also taking a set of configuration options. |
| [`IterableEmbeddedCard`](#iterableembeddedcard)                                   | Returns a string of the HTML for an out-of-the-box [card](https://support.iterable.com/hc/articles/23230946708244#cards) view for an embedded message. |
| [`IterableEmbeddedBanner`](#iterableembeddedbanner)                               | Returns a string of the HTML for an out-of-the-box [banner](https://support.iterable.com/hc/articles/23230946708244#banners) view for an embedded message. |
| [`IterableEmbeddedNotification`](#iterableembeddednotification)                   | Returns a string of the HTML for an out-of-the-box [notification](https://support.iterable.com/hc/articles/23230946708244#notifications) view for an embedded message. |
| [`track`](#track)                                                                 | Tracks a custom event. |
| [`trackEmbeddedClick`](#trackEmbeddedClick)                                       | Tracks an [`embeddedClick`](https://support.iterable.com/hc/articles/23061677642260#embeddedclick-events) event. |
| [`trackEmbeddedReceived`](#trackEmbeddedReceived)                                 | Tracks an [`embeddedReceived`](https://support.iterable.com/hc/articles/23061677642260#embeddedreceived-events) event. |
| [`trackEmbeddedSession`](#trackEmbeddedSession)                                   | Tracks an [`embeddedSession`](https://support.iterable.com/hc/articles/23061677642260#embeddedsession-events) event and related [`embeddedImpression`](https://support.iterable.com/hc/articles/23061677642260#embeddedimpression-events) events. |                                                                                            |
| [`trackInAppClick`](#trackInAppClick) :rotating_light:                            | Tracks when a user clicks on a button or link within an in-app message. |
| [`trackInAppClose`](#trackInAppClose)                                             | Tracks when an in-app message is closed. |
| [`trackInAppConsume`](#trackInAppConsume)                                         | Tracks when an in-app message has been consumed. Deletes the in-app message from the server. |
| [`trackInAppDelivery`](#trackInAppDelivery)                                       | Tracks when an in-app message has been delivered to a user's device. |
| [`trackInAppOpen`](#trackInAppOpen)                                               | Tracks when an in-app message has been opened, and marks it as read. |
| [`trackPurchase`](#trackPurchase)                                                 | Tracks purchase events. |
| [`updateCart`](#updateCart)                                                       | Updates the `shoppingCartItems` field on a user's Iterable profile. |
| [`updateSubscriptions`](#updateSubscriptions)                                     | Updates the user's subscriptions. |
| [`updateUser`](#updateUser)                                                       | Changes data on a user's Iterable profile, or creates a user if necessary. |
| [`updateUserEmail`](#updateUserEmail)                                             | Change a user's email address, and then signs the user into the SDK using the new address. |

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
| `animationDuration`         | How long (in ms) it should take messages to animate in and out                                                                                                                                                                                                                             | `number`                                                          | `400`       |
| `bottomOffset`              | How much space (px or %) to create between the bottom of the screen and a message. Not applicable for center, top, or full-screen messages.                                                                                                                                                | `string`                                                          | `undefined` |
| `closeButton`               | Properties that define a custom close button to display on a message.                                                                                                                                                                                                                      | `CloseButtonOptions` (see below)                                  | `undefined` |
| `displayInterval`           | How long (in ms) to wait before showing the next in-app message after closing the currently opened one                                                                                                                                                                                     | `number`                                                          | `30000`     |
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
To render it,  modify the page's CSS, setting up whatever styles you'd like.
You'll also need to set up click handlers to handle click events, closing the
message, etc.

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

This example that uses custom sorting/filtering, and displays messages at the
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

Tracks an [`embeddedClick`](https://support.iterable.com/hc/articles/23061677642260#embeddedclick-events) event
by calling [`POST /api/embedded-messaging/events/click`](https://support.iterable.com/hc/articles/204780579#post-api-embedded-messaging-events-click).

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

Updates the shopping cart items on the user's Iterable profile by calling
[`POST /api/commerce/updateCart`](https://support.iterable.com/hc/articles/204780579#post-api-commerce-updatecart).

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
| [`Elements`](#elements)                                                           | Custom styles to apply to `IterableEmbeddedCard`, `IterableEmbeddedBanner`, and `IterableEmbeddedNotification` views. |
| [`IterableAction`](#iterableaction)                                               | An action associated with a click. The type of the action, and its associated URL. |
| [`IterableActionContext`](#iterableactioncontext)                                 | Information about the context of an `IterableAction`. For example, the associated message type. |
| [`IterableActionSource`](#iterableactionsource)                                   | An enum of possible message types to which an `IterableAction` can be associated. Currently, only `EMBEDDED` is supported. |
| [`IterableConfig`](#iterableconfig)                                               | A class that can hold configuration information for the SDK. Currently, only `urlHandler` and `customActionHandler` are supported (static properties). |
| [`IterableCustomActionHandler`](#iterablecustomactionhandler)                     | An interface that defines `handleIterableCustomAction`, which, when added to `IterableConfig`, is called when the SDK encounters a custom action (as opposed to a standard URL). |
| [`IterableEmbeddedButton`](#iterableembeddedbutton)                               | Payload for a button associated with an embedded message. |  
| [`IterableEmbeddedButtonAction`](#iterableembeddedbuttonaction)                   | Payload for the action associated with an embedded message button. |
| [`IterableEmbeddedClickRequestPayload`](#iterableembeddedclickrequestpayload)     | Data to pass to `trackEmbeddedClick`. | 
| [`IterableEmbeddedDefaultAction`](#iterableembeddeddefaultaction)                 | The default action associated with an embedded message. Invoked when a user clicks on an embedded message, but outside of its buttons. | 
| [`IterableEmbeddedElements`](#iterableembeddedelements)                           | All the elements associated with an embedded message — title, body, media URL, buttons, default action, and extra text fields. |
| [`IterableEmbeddedImpression`](#iterableembeddedimpression)                       | The number of times a given embedded message appeared during a specific session, and the total duration of all those appearances. Also includes other metadata about the impression. |
| [`IterableEmbeddedManager`](#iterableembeddedmanager)                             | Used to fetch embedded messages from Iterable, and pass them to application code as necessary. |
| [`IterableEmbeddedMessage`](#iterableembeddedmessage)                             | A single embedded message to display, including title text, body text, buttons, an image URL, click actions, text fields, and JSON data. |
| [`IterableEmbeddedMessageUpdateHandler`](#iterableembeddedmessageupdatehandler)   | An object that defines `onMessagesUpdated` and `onEmbeddedMessagingDisabled` methods. If this object is registered as an update listener,If this object is registered as an update listener, the SDK calls these methods as necessary after fetching embedded messages from the server. |
| [`IterableEmbeddedMetadata`](#iterableembeddedmetadata)                           | For a given embedded message, contains for message ID, campaign ID, placement ID, and whether or not the message is a proof. |
| [`IterableEmbeddedSession`](#iterableembeddedsession)                             | Represents a period of time during which a user was on a page where they could potentially view embedded messages. Contains an ID, a start tiem, and an end time. |
| [`IterableEmbeddedSessionManager`](#iterableembeddedsessionmanager)               | Used to track sessions and impressions, and to save them back to Iterable. |
| [`IterableEmbeddedSessionRequestPayload`](#iterableembeddedsessionrequestpayload) | Data to pass to `trackEmbeddedSession` — a session and its impressions, and the package name. |
| [`IterableEmbeddedText`](#iterableembeddedtext)                                   | Extra text fields sent along with an embedded message. Like custom JSON, these text fields can be used to pass data as part of an embedded message. |
| [`IterableUrlHandler`](#iterableurlhandler)                                       | An interface that defines `handleIterableURL`, which, when added to `IterableConfig`, is called when the SDK encounters a standard URL (as opposed to a custom action). |
| [`OOTB`](#ootb)                                                                   | A type that defines the parameters to provide when calling `IterableEmbeddedCard`, `IterableEmbeddedBanner`, and `IterableEmbeddedNotification`. |
| [`OutOfTheBoxButton`](#outoftheboxbutton)                                         | Custom styles to apply to buttons in an embedded message. The same as `OutOfTheBoxElement`, but with an extra `disabledStyles` string. |
| [`OutOfTheBoxElement`](#outoftheboxelement)                                       | The custom styles to apply to a single element of an embedded message. |

## `CloseButton`

Passed as part of [`InAppMessagesRequestParams`](#inappmessagesrequestparams)
to specify how the SDK should display a close button a fetched in-app message.

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

Data to include when calling [`trackPurchase`](#trackpurchase) and [`updateCart`](#updatecart)

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

Data to include when calling [`trackPurchase`](#trackpurchase) and [`updateCart`](#updatecart)

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

```ts
interface ErrorHandler {
  (error: any): void;
}
```

## `GetInAppMessagesResponse`

Return value for [`getInAppMessages`](#getinappmessages), when called without
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

Return value for [`getInAppMessages`](#getinappmessages), when called with the
`options` parameter.

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
URL.

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
associated message type.

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

An enum of possible message types to which an `IterableAction` can be
associated. Currently, only `EMBEDDED` is supported.

```ts
enum IterableActionSource {
  EMBEDDED = 'EMBEDDED'
}
```

## `IterableConfig`

A class that can hold configuration information for the SDK. Currently, only
`urlHandler` and `customActionHandler` are supported (static properties).

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

An interface that defines `handleIterableCustomAction`, which, when added to
`IterableConfig`, is called when the SDK encounters a custom action (as opposed
to a standard URL)

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
methods. If this object is registered as an update listener,If this object is
registered as an update listener, the SDK calls these methods as necessary after
fetching embedded messages from the server.


```ts
interface IterableEmbeddedMessageUpdateHandler {
    onMessagesUpdated: () => void;
    onEmbeddedMessagingDisabled: () => void;
}
```

## `IterableEmbeddedMetadata`

For a given embedded message, contains for message ID, campaign ID, placement
ID, and whether or not the message is a proof.


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


## `IterableEmbeddedSessionRequestPayload`

Data to pass to [`trackEmbeddedSession`](#trackembeddedsession).

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

```ts
IterablePromise<T = any> = AxiosPromise<T>;
```

## `IterableResponse`

```ts
interface IterableResponse {
  code: IterableErrorStatus;
  msg: string;
  params?: null | Record<string, any>;
}
```

## `IterableUrlHandler`

An interface that defines `handleIterableURL`, which, when added to
`IterableConfig`, is called when the SDK encounters a standard URL (as opposed
to a custom action).

```ts
interface IterableUrlHandler {
  handleIterableURL(uri: string, actionContext: IterableActionContext): boolean;
}
```

See also:

- [`IterableActionContext`](#iterableactioncontext)

## `OOTB`

A type that defines the parameters to provide when calling `IterableEmbeddedCard`, 
`IterableEmbeddedBanner`, and `IterableEmbeddedNotification`.

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

- [`HandleLinks`](#handlelinks)
- [`CloseButton`](#closebutton)

## `TrackPurchaseRequestParams`

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

First thing you need to do is generate an API key on [the Iterable app](https://app.iterable.com). Make sure this key is JWT-enabled and is of the
_Web_ key type. This will ensure the SDK has access to all the necessary
endpoints when communicating with the Iterable API. After you generate your key,
save the API key and JWT secret somewhere handy. You'll need both of them.

First, you'll deal with the JWT Secret. Typically, you need some backend service
that is going to use that JWT Secret to sign a JWT and return it to your client
app. For the purposes of this explanation, this can be demonstrated this with a
site like [jwt.io](https://jwt.io). See the [documentation on the Iterable
website](https://support.iterable.com/hc/en-us/articles/360050801231-JWT-Enabled-API-Keys-)
for instructions on how to generate a JWT from your JWT secret.

Once you have a JWT or a service that can generate a JWT automatically, you're
ready to start making requests in the SDK. The syntax for that looks like this:

```ts
import { initialize } from '@iterable/web-sdk';

(() => {
  initialize('YOUR_API_KEY_HERE', ({ email, userID }) =>
    yourAsyncJWTGeneratorMethod({ email, userID }).then(
      ({ jwt_token }) => jwt_token
    )
  );
})();
```

Now that we've set our authorization logic within our app, it's time to set the
user. You can identify a user by either the email or user ID. User ID is
preferred because the SDK will automatically create a user in your Iterable
instance. If you identify by email, the user will remain "anonymous" with no
user ID attached to it. See [Iterable's updateUser
endpoint](https://api.iterable.com/api/docs#users_updateUser) for more
information about how users are created.

The syntax for identifying a user by user ID looks like this:

```ts
import { initialize } from '@iterable/web-sdk';

(() => {
  const { setUserID, logout } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) =>
      yourAsyncJWTGeneratorMethod({ email, userID }).then(
        ({ jwt_token }) => jwt_token
      )
  );

  yourAsyncLoginMethod().then((response) => {
    // This code assumes you have some backend endpoint that will return a 
    // user's ID 
    setUserID(response.user_id).then(() => {
      // Now, your user is set and you can begin hitting the Iterable API
    });
  });

  // Optionally log the user out when you don't need to hit the Iterable API 
  // anymore
  logout();
})();
```

Doing this with an email is similar:

```ts
import { initialize } from '@iterable/web-sdk';

(() => {
  const { setEmail, logout } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) =>
      yourAsyncJWTGeneratorMethod({ email, userID }).then(
        ({ jwt_token }) => jwt_token
      )
  );

  yourAsyncLoginMethod().then((response) => {
    // This code assumes you have some backend endpoint that will return a 
    // user's email address 
    setEmail(response.email).then(() => {
      // now your user is set and you can begin hitting the Iterable API */
    });
  });

  // Optionally log the user out when you don't need to hit the Iterable API 
  // anymore 
  logout();
})();
```

Now let's put it altogether with an Iterable API method:

```ts
import { initialize, track } from '@iterable/web-sdk';

(() => {
  const { setUserID, logout } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) =>
      yourAsyncJWTGeneratorMethod({ email, userID }).then(
        ({ jwt_token }) => jwt_token
      )
  );

  yourAsyncLoginMethod().then((response) => {
    // This code assumes you have some backend endpoint that will return a 
    // user's ID
    setUserID(response.user_id).then(() => {
      document.getElementById('my-button').addEventListener('click', () => {
        // No need to pass a user ID to this endpoint. setUserID takes care of 
        // this for you.
        track({ eventName: 'button-clicked' });
      });
    });
  });
})();
```

## How does the SDK pass up my email / user ID?

This SDK relies on a library called [Axios](https://github.com/axios/axios). For
all outgoing XHR requests, the SDK utilizes [Axios interceptors](https://github.com/axios/axios#interceptors) 
to add your user information to the requests.

## What if I want to handle this intercepting logic myself instead?

You can do that! This SDK exposes the base Axios request instance so you can do
whatever you like with it and build upon that. You can import the Axios request
like so and anything in the Axios documentation is fair game to use:

```ts
import { baseAxiosRequest } from '@iterable/web-sdk';
```

For example, if you want to set an `email` query param on every outgoing
request, you would just implement the way Axios advises like so:

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

:rotating_light: Please note, you won't likely need access to this Axios
instance. This is reserved for advanced use cases only.

## I want to automatically show my in-app messages with a delay between each

This SDK allows that. Simply call the `getInAppMessages` method but pass `{
display: 'immediate' }` as the second parameter. This will expose some methods
used to make the request to show the messages and pause and resume the queue.

Normally to request a list of in-app messages, you'd make a request like this:

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

In order to take advantage of the SDK showing them automatically, you would
implement the same method in this way:

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

Optionally, you can pass arguments to fine-tune how you want the messages to
appear. See the [usage section](#getInAppMessages) to see all available options
and what they do.

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

You can also pause and resume the messages stream if you like

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

Finally, you can also choose to do your own manipulation to the messages before
choosing to display them:

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

## I want my messages to look good on every device and be responsive

This SDK already handles that for you. The rules for the in-app message
presentation varies based on which display type you've selected. Here's a table
to explain how it works:

| Message Position &#8594; <br><br> Browser Size &#8595; | Center | Full | Top-Right | Bottom-Right |
| ------------------------------------------------------ | ------ | ---- | --------- | ------------ |
| 0px - 850px                                            | 100%   | 100% | 100%      | 100%         |
| 851px - 975px                                          | 50%    | 100% | 45%       | 45%          |
| 976px - 1300px                                         | 50%    | 100% | 33%       | 33%          |
| 1300px+                                                | 50%    | 100% | 25%       | 25%          |

Looking at this table, you can see the browser sizes on the left, and the
display positions on top. For example, if your in-app message is positioned in
the top-right of the screen and your browser window is at 1000px, then your
in-app message will take up 33% of the screen.

Another example: If your in-app is positioned in the center and your browser if
at 700px, your in-app message will grow to take up 100% of the screen.

This chart also implies that your in-app message is taking 100% of its
container. Your results may vary if you add, for example, a `max-width: 200px`
CSS rule to your message HTML. Regardless of how you write your CSS, these rules
will take effect, **so it is recommended that you stick to percentage-based CSS
widths when possible when creating your message**

## Clicking links breaks the experience of my single-page app (or how you add a custom callback to link clicks)

No problem! Please see [the link handling section](#about-links) for more
information on how to create callback methods on link clicks. There, you'll find
information on how to create a seamless link-clicking experience if you're using
a library such as React Router.

## What if my JWT expires?

JWT expiration is handled for you automatically by the SDK. There are 3 points
where the SDK will generate a new JWT token for you, apart from the initial call
when invoking `setEmail` or `setUserID`:

1. The JWT is within 1 minute of expiration
2. An Iterable API request has failed with a 401 response
3. Your code invoked the `updateUserEmail` method

As previously explained, when initializing the SDK you need to pass a function
that returns a Promise with the JWT, which looks something like this:

```ts
import { initialize } from '@iterable/web-sdk';

initialize('API_KEY_HERE', ({ email, userID }) =>
  yourAsyncJWTGenerationMethod({ email, userID }).then(
    (response) => response.jwt_token
  )
);
```

When the previous three listed events occur, the SDK will invoke the method passed
as the second argument, and when the Promise resolves, attach the new JWT to any
future Iterable API requests.

Finally, if the request to regenerate the JWT fails however, the SDK will not
attempt to generate the JWT again so requests will start failing at that point.

To perform a manual JWT token refresh, call [`refreshJwtToken`](#refreshjwttoken).

# About links

Since the Web SDK renders in-app messages in an `iframe` element on your website,
if you choose to render the messages automatically, the event handler that is
responsible for handling link clicks is hijacked by the SDK code internally. However,
to the user, this doesn't change the experience. As expected, `<a />` tags will
open the link in the same browser tab unless given the `target="_blank"`
property.

But there are few features which the SDK adds so that you can customize how
you'd like links to behave:

First, the `handleLinks` option provided by [`getInAppMessages`](#getInAppMessages) 
allows you to specify how the SDK opens links: in the current tab, in a new tab, 
or a combination (external links in a new tab, internal links in the current tab). 
For example, consider this code:

```ts
import { getInAppMessages } from '@iterable/web-sdk';

getInAppMessages({
  count: 5,
  packageName: 'my-website',
  handleLinks: 'external-new-tab'
});
```

This code ensures the following links open in the same tab if your domain is
`mydomain.com`, for example:

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

## Reserved keyword links

Iterable reserves the `iterable://` and `action://` URL schemas to define custom
link click actions:

1. `iterable://dismiss` - Removes the in-app message from the screen, grabs the
   next one to display, and invokes both [trackInAppClose](#trackInAppClose) and
   [trackInAppClick](#trackInAppClick).

2. `action://{anything}` - Makes a [`Window.prototype.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
   call with payload `{ type: 'iterable-action-link', data: '{anything}' }`, to be
   consumed by the parent website as needed. These links also dismiss the message
   and invoke [trackInAppClose](#trackInAppClose) and [trackInAppClick](#trackInAppClick).

The SDK may reserve more keywords in the future.

:rotating_light: `iterable://` and `action://` links are not supported with
WebKit (which affects iOS web browsers, Safari included). In these browsers,
users can close an in-app message by clicking away from the message.

## Routing in single-page apps

Knowing now the custom link schemas available, let's explain how you can
leverage them to add custom routing or callback functions. If for example you
want to hook into a link click and send the user to your `/about` page with a
client-side routing solution, you'd do something like this if you're using React
Router:

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

## Safari: Allowing JavaScript execution in tabs opened by in-app message link clicks

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

The Iterable Web SDK includes TypeScript definitions out of the box. All SDK
methods should be typed for you already but if you need to import specific
typings, you can parse through each `types.d.ts` file inside of the `./dist`
directory to find what you need.  Request and response payloads should all be
available.

If you feel something is missing, feel free to open an issue!

# Contributing

Looking to contribute? Please see the [contributing instructions here](./CONTRIBUTING.md) 
for more details.

# License

This SDK is released under the MIT License. See [LICENSE](./LICENSE.md) for more
information.

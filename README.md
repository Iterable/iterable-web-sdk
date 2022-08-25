![Iterable-Logo](https://user-images.githubusercontent.com/7387001/129065810-44b39e27-e319-408c-b87c-4d6b37e1f3b2.png)

# BETA FEATURE

:rotating_light: Web in-app messages (along with the Iterable Web SDK) are in Beta. If you'd like to try them out, talk to your customer success manager. We cannot guarantee this SDK will function as expected if you are not in the Beta program. :rotating_light:

# Iterable's Web SDK

[Iterable](https://www.iterable.com) is a growth marketing platform that helps you to create better experiences for—and deeper relationships with—your customers. Use it to send customized email, SMS, push notification, in-app message, web push notification campaigns to your customers.

This SDK helps you integrate your Web apps with Iterable.

# Table of Contents

* [Installation](#installation)
* [API](#api)
* [Usage](#usage)
* [FAQ](#faq)
* [A Note About Imports](#a-note-about-imports)
* [About Links](#about-links)
* [TypeScript](#typescript)
* [Contributing](#contributing)
* [License](#license)

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

# API

Below are the methods this SDK exposes. See [Iterable's API Docs](https://api.iterable.com/api/docs) for information on what data to pass and what payload to receive from the HTTP requests.

| Method Name           	| Description                                                                                                               	|
|-----------------------	|---------------------------------------------------------------------------------------------------------------------------	|
| [`getInAppMessages`](#getInAppMessages)    	| Either return in-app messages as a Promise or automatically paint them to the DOM if the second argument is passed `DisplayOptions` 	|
| [`initialize`](#initialize)        	| Method for identifying users and setting a JWT                                                                            	|
| [`track`](#track)               	| Track custom events                                                                                                       	|
| [`trackInAppClick`](#trackInAppClick)     	| Track when a user clicks on a button or link within a message                                                             	|
| [`trackInAppClose`](#trackInAppClose)     	| Track when an in-app message is closed                                                                                    	|
| [`trackInAppConsume`](#trackInAppConsume)   	| Track when a message has been consumed. Deletes the in-app message from the server so it won't be returned anymore        	|
| [`trackInAppDelivery`](#trackInAppDelivery)  	| Track when a message has been delivered to a user's device                                                                	|
| [`trackInAppOpen`](#trackInAppOpen)      	| Track when a message is opened and marks it as read                                                                       	|
| [`trackPurchase`](#trackPurchase)       	| Track purchase events                                                                                                     	|
| [`updateCart`](#updateCart)          	| Update _shoppingCartItems_ field on user profile                                                                          	|
| [`updateSubscriptions`](#updateSubscriptions) 	| Updates user's subscriptions                                                                                              	|
| [`updateUser`](#updateUser)          	| Change data on a user's profile or create a user if none exists                                                           	|
| [`updateUserEmail`](#updateUserEmail)     	| Change a user's email and reauthenticate user with the new email address (in other words, we will call `setEmail` for you)                                                                                             	|

# Usage

## getInAppMessages

API [(see required API payload here)](https://api.iterable.com/api/docs#In-app_getMessages):

```ts
getInAppMessages: (payload: InAppMessagesRequestParams, showMessagesAutomatically?: boolean | { display: 'deferred' | 'immediate' }) => Promise<TrackConsumeData> | PaintInAppMessageData
```

SDK Specific Options:

Along with the API parameters, you can pass these options to the SDK method to have in-app messages behave differently.

| Property Name                                    | Description                                                                                                                                                                                                                       | Value                                                             | Default     |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| animationDuration                                | How much time (in MS) for messages to animate in and out                                                                                                                                                                          | `number`                                                          | `400`       |
| bottomOffset                                     | How much space (px or %) to create between the bottom of the screen and messages. Not applicable for center, top, or full-screen messages                                                                                         | `string`                                                          | `undefined` |
| displayInterval                                  | How much time (in MS) to wait before showing next in-app message after closing the currently opened one                                                                                                                           | `number`                                                          | `30000`     |
| handleLinks :rotating_light: | How to open links. If `undefined`, use browser-default behavior. `open-all-new-tab` opens all in new tab, `open-all-same-tab` opens all in same tab, `external-new-tab` opens only off-site links in new tab, otherwise same tab. | `'open-all-new-tab' \| 'open-all-same-tab' \| 'external-new-tab'` | `undefined` |
| onOpenScreenReaderMessage                        | What text do you want the screen reader to announce when opening in-app messages                                                                                                                                                  | `string`                                                          | `undefined` |
| onOpenNodeToTakeFocus                            | What DOM element do you want to take keyboard focus when the in-app message opens. (Will open the first interact-able element if not specified). Any query selector is valid.                                                     | `string`                                                          | `undefined` |
| rightOffset                                      | How much space (px or %) to create between the right of the screen and messages. Not applicable for center or full-screen messages                                                                                                | `string`                                                          | `undefined` |
| topOffset                                        | How much space (px or %) to create between the top of the screen and messages. Not applicable for center, bottom, or full-screen messages                                                                                         | `string`                                                          | `undefined` |
| closeButton                                      | Properties to show a custom close button on each in-app message                                                                                                                                                                   | `CloseButtonOptions` (see below)                                  | `undefined` |

:rotating_light: Due to a limitation in Safari, web in-app messages displayed in Safari do not respect the value set for `handleLinks`. As a workaround, give your links a `target` (`target="_blank"` for new tab, `target="_top"` / `target="_parent"` for same tab).

Close Button Options:

| Property Name              | Description                                                                                | Value                      | Default       |
| -------------------------- | ------------------------------------------------------------------------------------------ | -------------------------- | ------------- |
| color                      | What color the button is (does not affect custom icons)                                    | `string`                   | `undefined`   |
| iconPath                   | Custom pathname to an image or SVG you want to show instead of the default "X"             | `string`                   | `undefined`   |
| position                   | Where to appear relative to the in-app message                                             | `'top-right \| 'top-left'` | `'top-right'` |
| isRequiredToDismissMessage | If `true`, prevent user from dismissing in-app message by clicking outside of message      | `boolean`                  | `undefined`   |
| sideOffset                 | How much space to leave between the button and side of the container                       | `string`                   | `'4%'`        |
| size                       | How large to set the width, height, and font-size                                          | `string \| number`         | `24`          |
| topOffset                  | How much space to leave between the button and the top of the container                    | `string`                   | `'4%'`        |

Example:

Calling `getInAppMessages` with `showInAppMessagesAutomatically` set to `false` (or not set) returns a JSON API response from Iterable. This response includes an `inAppMessages` field, and each item in the list has a `content.html` field that's an `iframe` with an embedded in-app message. The `iframe`'s `sandbox` attribute is set, isolating its render and preventing any malicious JavaScript execution.
```ts
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';

getInAppMessages({ count: 20, packageName: 'mySite1' })
  .then((resp) => {
      /* This will be an iframe element that can be attached to the DOM */
      const messageIframe = resp.data.inAppMessages[0].content.html;
      document.body.appendChild(messageIframe);

      /* Additional styling logic can be done here to customly render the message */
  })
  .catch()
```

This code places an in-app on the page, but it won't be visible.  To render it, you'll need to modify the page's CSS, setting up whatever styles you'd like. You'll also need to set up click handlers to handle closing the message and tracking events (in-app click, etc.).

Or, to show messages automatically:

```ts
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';

const { 
  request,
  pauseMessageStream, 
  resumeMessageStream
} = getInAppMessages(
  { 
    count: 20,
    packageName: 'my-website',
    displayInterval: 5000,
    onOpenScreenReaderMessage:
      'hey screen reader here telling you something just popped up on your screen!',
    onOpenNodeToTakeFocus: 'input',
    closeButton: {
      color: 'red',
      size: '16px',
      topOffset: '20px'
    }
  },
  { display: 'immediate' }
);

request()
  .then()
  .catch();
```

or if you want to show messages with your own custom filtering/sorting and choose to display later:

```ts
import { 
  getInAppMessages,
  sortInAppMessages,
  filterHiddenInAppMessages
} from '@iterable/web-sdk/dist/inapp';

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
    onOpenScreenReaderMessage:
      'hey screen reader here telling you something just popped up on your screen!',
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
  .then(response => {
    /* do your own manipulation here */
    const filteredMessages = doStuffToMessages(response.data.inAppMessages);

    /* also feel free to take advantage of the sorting/filtering methods we use internally */
    const furtherManipulatedMessages = sortInAppMessages(
      filterHiddenInAppMessages(response.data.inAppMessages)
    ) as InAppMessage[];

    /* then display them whenever you want */
    triggerDisplayMessages(furtherManipulatedMessages)
  })
  .catch();
```

:rotating_light: *PLEASE NOTE*: If you choose the `deferred` option, we will _not_ do any filtering or sorting on the messages internally. You will get the messages exactly as they come down from the API, untouched. This means you may (for example) show in-app messages marked `read` or show the messages in the wrong order based on `priority`.

If you want to keep the default sorting and filtering, please take advantage of the `sortInAppMessages` and `filterHiddenInAppMessages` methods we provide.

## initialize

API:

```ts
initialize: (authToken: string, generateJWT: ({ email?: string, userID?: string }) => Promise<string>) => { 
  clearRefresh: () => void;
  setEmail: (email: string) => Promise<string>;
  setUserID: (userId: string) => Promise<string>;
  logout: () => void;
}
```

Example:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';

const { clearRefresh, setEmail, setUserID, logout } = initialize(
  'my-API-key',
  /* 
    _email_ will be defined if you call _setEmail_ 
    _userID_ will be defined if you call _setUserID_
  */
  ({ email, userID }) => yourAsyncJWTGeneratorMethod({ email, userID }).then(({ jwt_token }) => jwt_token)
)
```

## track

API [(see required API payload here)](https://api.iterable.com/api/docs#events_track):

```ts
track: (payload: InAppTrackRequestParams) => Promise<TrackData>
```

Example:

```ts
import { track } from '@iterable/web-sdk/dist/events';

track({ eventName: 'my-event' })
  .then()
  .catch()
```

## trackInAppClick

API [(see required API payload here)](https://api.iterable.com/api/docs#events_trackInAppClick):

```ts
trackInAppClick: (payload: InAppEventRequestParams) => Promise<TrackClickData>
```

Example:

```ts
import { trackInAppClick } from '@iterable/web-sdk/dist/events';

trackInAppClick({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch()
```

## trackInAppClose

API [(see required API payload here)](https://api.iterable.com/api/docs#events_trackInAppClose):

```ts
trackInAppClose: (payload: InAppEventRequestParams) => Promise<TrackCloseData>
```

Example:

```ts
import { trackInAppClose } from '@iterable/web-sdk/dist/events';

trackInAppClose({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch()
```

## trackInAppConsume

API [(see required API payload here)](https://api.iterable.com/api/docs#events_inAppConsume):

```ts
trackInAppConsume: (payload: InAppEventRequestParams) => Promise<TrackConsumeData>
```

Example:

```ts
import { trackInAppConsume } from '@iterable/web-sdk/dist/events';

trackInAppConsume({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch()
```

## trackInAppDelivery

API [(see required API payload here)](https://api.iterable.com/api/docs#events_trackInAppDelivery):

```ts
trackInAppDelivery: (payload: InAppEventRequestParams) => Promise<TrackDeliveryData>
```

Example:

```ts
import { trackInAppDelivery } from '@iterable/web-sdk/dist/events';

trackInAppDelivery({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch()
```

## trackInAppOpen

API [(see required API payload here)](https://api.iterable.com/api/docs#events_trackInAppOpen):

```ts
trackInAppOpen: (payload: InAppEventRequestParams) => Promise<TrackOpenData>
```

Example:

```ts
import { trackInAppOpen } from '@iterable/web-sdk/dist/events';

trackInAppOpen({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch()
```

## trackPurchase

API [(see required API payload here)](https://api.iterable.com/api/docs#commerce_trackPurchase):

```ts
trackPurchase: (payload: TrackPurchaseRequestParams) => Promise<TrackPurchaseData>
```

Example:

```ts
import { trackPurchase } from '@iterable/web-sdk/dist/commerce';

trackPurchase({
  items: [{ id: '123', name: 'keyboard', price: 100, quantity: 2 }],
  total: 200
})
  .then()
  .catch()
```

## updateCart

API [(see required API payload here)](https://api.iterable.com/api/docs#commerce_updateCart):

```ts
updateCart: (payload: UpdateCartRequestParams) => Promise<UpdateCartData>
```

Example:

```ts
import { updateCart } from '@iterable/web-sdk/dist/commerce';

updateCart({
  items: [{ id: '123', price: 100, name: 'keyboard', quantity: 1 }]
})
  .then()
  .catch()
```

## updateSubscriptions

API [(see required API payload here)](https://api.iterable.com/api/docs#users_updateSubscriptions):

```ts
updateSubscriptions: (payload?: UpdateSubscriptionParams) => Promise<UpdateSubsData>
```

Example:

```ts
import { updateSubscriptions } from '@iterable/web-sdk/dist/users';

updateSubscriptions({ emailListIds: [1, 2, 3] })
  .then()
  .catch()
```

## updateUser

API [(see required API payload here)](https://api.iterable.com/api/docs#users_updateUser):

```ts
updateUser: (payload?: UpdateUserParams) => Promise<UpdateUserData>
```

Example:

```ts
import { updateUser } from '@iterable/web-sdk/dist/users';

updateUser({ dataFields: {} })
  .then()
  .catch()
```

## updateUserEmail

API [(see required API payload here)](https://api.iterable.com/api/docs#users_updateEmail):

```ts
updateUserEmail: (newEmail: string) => Promise<UpdateEmailData>
```

Example:

```ts
import { updateUserEmail } from '@iterable/web-sdk/dist/users';

updateUserEmail('hello@gmail.com')
  .then()
  .catch()
```

# FAQ

## How do I make API requests with the SDK?

First thing you need to do is generate an API key on [the Iterable app](https://app.iterable.com). Make sure this key is JWT-enabled and is of the _Web_ key type. This will ensure the SDK has
access to all the necessary endpoints when communicating with the Iterable API. After you generate your key, save both the API Key and JWT Secret somewhere handy. You'll need both of them.

First, we'll deal with the JWT Secret. Typically, you need some backend service that is going to use that JWT Secret to sign a JWT and return it to your client app. For the purposes of this explanation, we can demo this with a site like [jwt.io](https://jwt.io). See the [documentation on the Iterable website](https://support.iterable.com/hc/en-us/articles/360050801231-JWT-Enabled-API-Keys-) for instructions on how to generate a JWT from your JWT secret.

Once you have a JWT or a service that can generate a JWT automatically, you're ready to start making requests in the SDK. The syntax for that looks like this:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';

(() => {
  initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );
})();
```

Now that we've set our authorization logic within our app, it's time to set the user. You can identify a user by either the email or user ID. User ID is preferred because the SDK will automatically create a user in your Iterable instance. If you identify by email, the user will remain "anonymous" with no user ID attached to it. See [Iterable's updateUser endpoint](https://api.iterable.com/api/docs#users_updateUser) for more information about how users are created.

The syntax for identifying a user by user ID looks like this:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';

(() => {
  const { setUserID, logout } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      /* this code assumes you have some backend endpoint that will return a user's ID */
      setUserID(response.user_id)
        .then(() => {
          /* now your user is set and you can begin hitting the Iterable API */
        })
    })

  /* optionally logout the user when you don't need to hit the Iterable API anymore */
  logout();
})();
```

Doing this with an email is similar:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';

(() => {
  const { setEmail, logout } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      /* 
        this code assumes you have some backend 
        endpoint that will return a user's email address 
      */
      setEmail(response.email)
        .then(() => {
          /* now your user is set and you can begin hitting the Iterable API */
        })
    })

  /* optionally logout the user when you don't need to hit the Iterable API anymore */
  logout();
})();
```

Now let's put it altogether with an Iterable API method:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { track } from '@iterable/web-sdk/dist/events';

(() => {
  const { setUserID, logout } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      /* this code assumes you have some backend endpoint that will return a user's ID */
      setUserID(response.user_id)
        .then(() => {
          document.getElementById('my-button').addEventListener('click', () => {
            /* 
              no need to pass a user ID to this endpoint. 
              _setUserID_ takes care of this for you
            */
            track({ eventName: 'button-clicked' })
          })
        })
    })
})();
```

## How does the SDK pass up my email / user ID?

This SDK relies on a library called [Axios](https://github.com/axios/axios). For all outgoing XHR requests, the SDK utilities [Axios interceptors](https://github.com/axios/axios#interceptors) to add your user information to the requests.

## Ok cool. What if I want to handle this intercepting logic myself instead?

You can do that! This SDK exposes the base Axios instance so you can do whatever you like with it and build upon that. You can import the Axios instance like so and anything in the Axios documentation is fair game to use:

```ts
import { baseAxiosInstance } from '@iterable/web-sdk/dist/request';
```

For example, if you want to set an `email` query param on every outgoing request, you would just implement the way Axios advises like so:

```ts
import { baseAxiosRequest } from '@iterable/web-sdk/dist/request';

(() => {
  baseAxiosRequest.interceptors.request.use((config) => {
    return {
      ...config,
      params: {
        ...config.params,
        email: 'hello@gmail.com'
      }
    }
  })
})();
```

:rotating_light: Please note, you won't likely need access to this Axios instance. This is reserved for advanced use cases only.

## I want to automatically show my in-app messages with a delay between each

This SDK allows that. Simply call the `getMessages` method but pass `{ display: 'immediate' }` as the second parameter. This will expose some methods used to make the request to show the messages and pause and resume the queue.

Normally to request a list of in-app messages, you'd make a request like this:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';

(() => {
  const { setUserID } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      setUserID(response.user_id)
        .then(() => {
          getInAppMessages({ 
            count: 20,
            packageName: 'my-website'
          })
            .then()
            .catch()
        })
    })
})();
```

In order to take advantage of the SDK showing them automatically, you would implement the same method in this way:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';

(() => {
  const { setUserID } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      setUserID(response.user_id)
        .then(() => {
          const { request } = getInAppMessages(
            { 
              count: 20,
              packageName: 'my-website'
            },
            { display: 'immediate' }
          );

          /* trigger the start of message presentation */
          request()
            .then()
            .catch();
        })
    })
})();
```

Optionally, you can pass arguments to fine-tune how you want the messages to appear. See the [usage section](#getInAppMessages) to see all available options and what they do.

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';

(() => {
  const { setUserID } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      setUserID(response.user_id)
        .then(() => {
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

          /* trigger the start of message presentation */
          request()
            .then()
            .catch();
        })
    })
})();
```

You can also pause and resume the messages stream if you like

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';

(() => {
  const { setUserID } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      setUserID(response.user_id)
        .then(() => {
          const { 
            request,
            pauseMessageStream, 
            resumeMessageStream
           } = getInAppMessages(
            { 
              count: 20,
              packageName: 'my-website'
            },
            { display: 'immediate' }
          );

          /* trigger the start of message presentation */
          request()
            .then()
            .catch();

          /* pause any more in-app messages from appearing for a little while */
          pauseMessageStream();

          /* 
            pick up where we left off and show the next message in the queue. 
            And start the timer again.
          */
          resumeMessageStream();
        })
    })
})();
```

Finally, you can also choose to do your own manipulation to the messages before choosing to display them:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { 
  getInAppMessages,
  sortInAppMessages,
  filterHiddenInAppMessages
} from '@iterable/web-sdk/dist/inapp';

(() => {
  const { setUserID } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod(({ email, userID })).then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      setUserID(response.user_id)
        .then(() => {
          const { 
            request,
            pauseMessageStream, 
            resumeMessageStream
           } = getInAppMessages(
            { 
              count: 20,
              packageName: 'my-website'
            },
            { display: 'deferred' }
          );

          /* trigger the start of message presentation */
          request()
            .then(response => {
              /* do your own manipulation here */
              const filteredMessages = doStuffToMessages(response.data.inAppMessages);

              /* 
                also feel free to take advantage of the sorting/filtering 
                methods we use internally 
              */
              const furtherManipulatedMessages = sortInAppMessages(
                filterHiddenInAppMessages(response.data.inAppMessages)
              ) as InAppMessage[];

              /* then display them whenever you want */
              triggerDisplayMessages(furtherManipulatedMessages)
            })
            .catch();
        })
    })
})();
```

## I want my messages to look good on every device and be responsive

This SDK already handles that for you. The rules for the in-app message presentation varies based on which display type you've selected. Here's a table to explain how it works:

| Message Position &#8594; <br><br> Browser Size &#8595; | Center | Full | Top-Right | Bottom-Right |
|--------------------------------------------------------|--------|------|-----------|--------------|
| 0px - 850px                                            | 100%   | 100% | 100%      | 100%         |
| 851px - 975px                                          | 50%    | 100% | 45%       | 45%          |
| 976px - 1300px                                         | 50%    | 100% | 33%       | 33%          |
| 1300px+                                                | 50%    | 100% | 25%       | 25%          |

Looking at this table, you can see the browser sizes on the left, and the display positions on top. For example, if your in-app message is positioned in the top-right of the screen and your browser window is at 1000px, then your in-app message will take up 33% of the screen.

Another example: If your in-app is positioned in the center and your browser if at 700px, your in-app message will grow to take up 100% of the screen.

This chart also implies that your in-app message is taking 100% of its container. Your results may vary if you add, for example, a `max-width: 200px` CSS rule to your message HTML. Regardless of how you write your CSS, these rules will take effect, **so we recommend that you stick to percentage-based CSS widths when possible when creating your message**

## Clicking links breaks the experience of my single-page app (or how you add a custom callback to link clicks)

No problem! Please see [the link handling section](#about-links) for more information on how to create callback methods on link clicks. There, you'll find information on how to create a seamless link-clicking experience if you're using a library such as React Router.

## What if my JWT expires?

JWT expiration is handled for you automatically by the SDK. There are 3 points where we will generate a new JWT token for you, apart from the initial call when invoking `setEmail` or `setUserID`:

1. The JWT is within 1 minute of expiration
2. An Iterable API request has failed with a 401 response
3. Your code invoked the `updateUserEmail` method

As previously explained, when initializing the SDK you need to pass a function that returns a Promise with the JWT, which looks something like this:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';

initialize(
  'API_KEY_HERE',
  ({ email, userID }) => yourAsyncJWTGenerationMethod({ email, userID }).then(response => response.jwt_token)
)
```

When the previous 3 listed events occur, we will invoke the method passed as the second argument, and when the Promise resolves, attach the new JWT to any future Iterable API requests.

Finally, if the request to regenerate the JWT fails however, we will not attempt to generate the JWT again so requests will start failing at that point.

# A Note About Imports

This library exposes UMD modules and a single-file build for you to import from. In other words, this means that you'll be able to import methods in these ways:

```ts
import { getInAppMessages, initialize, updateUser } from '@iterable/web-sdk';
```

```ts
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { updateUser } from '@iterable/web-sdk/dist/users';
```

For those using Webpack/Rollup/Some Other Build Tool, we recommend importing methods with the later approach for smaller final bundles. Importing with the second method ensures your bundle will only include the code you're using and not the code you're not.

# About Links

Since the Web SDK renders in-app messages in an iframe element on your website if you choose to render the messages automatically, the event handler that is responsible for clicking links is highjacked by the SDK code internally. To the user, this doesn't really change the experience. As expected, `<a />` tags will open the link in the same browser tab unless given the `target="_blank"` property.

But there are few features which the SDK adds so that you can customize how you'd like links to behave:

First, the [`handleLinks` option](#getInAppMessages) within the `getMessages` call will allow you to either open all links in a new tab, the same tab, or ensure that external links open in a new tab, while internal ones keep the experience within the same tab. So for example, this code:

```ts
import { getMessages } from '@iterable/web-sdk/dist/inapp'

getMessages({ count: 5, packageName: 'my-website', handleLinks: 'external-new-tab' })
```

will ensure the following links open in the same tab if your domain is `mydomain.com`, for example:

```
/about
https://mydomain.com
https://mydomain.com/about
```

and these will open in a new tab

```
https://google.com
https://hello.com
```

## Reserved Keyword Links

Upon normal links, Iterable reserves the `iterable://` and `action://` schemas for custom actions that are performed when a link is clicked. The following are links that you can add to your in-app messages for enhanced functionality:

1. `iterable://dismiss` - Removes the in-app message from the screen, queues the next one for presentation, and invokes both [trackInAppClose](#trackInAppClose) and [trackInAppClick](#trackInAppClick)
2. `action://{anything}` - Makes a [`Window.prototype.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) call with the payload `{ type: 'iterable-action-link', data: '{anything}' }` that can be consumed by the parent website.  It also dismisses the message and invokes both [trackInAppClose](#trackInAppClose) and [trackInAppClick](#trackInAppClick)

Upon those, we also may reserve more keywords in the future.

## Routing in Single-Page Apps

Knowing now the custom link schemas available, let's explain how you can leverage them to add custom routing or callback functions. If for example you want to hook into a link click and send the user to your `/about` page with a client-side routing solution, you'd do something like this if you're using React Router:

```ts
/* 
  assuming you're clicking this link in your in-app message: 
  
  <a href="action://about">go to about page</a>
*/

import { useHistory } from "react-router-dom";


const SomeComponent = () => {
  const history = useHistory();

  React.useEffect(() => {
    global.addEventListener('message', (event) => {
      if (event.data.type && event.data.type === 'iterable-action-link') {
        /* route us to the content that comes after "action://" */
        history.push(`/${event.data.data}`)
      }
    });
  }, [])

  return <></>
}
```

# TypeScript

The Iterable Web SDK includes TypeScript definitions out of the box. All SDK methods
should be typed for you already but if you need to import specific typings, you can
parse through each `types.d.ts` file inside of the `./dist` directory to find what you need.
Request and response payloads should all be available.

If you feel something is missing, feel free to open an issue!

# Contributing

Looking to contribute? Please see the [contributing instructions here](./CONTRIBUTING.md) for more
details.

# License

This SDK is released under the MIT License. See [LICENSE](./LICENSE.md) for more information.
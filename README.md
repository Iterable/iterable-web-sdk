![Iterable-Logo](https://user-images.githubusercontent.com/7387001/129065810-44b39e27-e319-408c-b87c-4d6b37e1f3b2.png)

# Iterable's Web SDK

[Iterable](https://www.iterable.com) is a growth marketing platform that helps you to create better experiences for—and deeper relationships with—your customers. Use it to send customized email, SMS, push notification, in-app message, web push notification campaigns to your customers.

This SDK helps you integrate your Web apps with Iterable.

# Table of Contents

* [Installation](#installation)
* [API](#api)
* [Usage](#usage)
* [FAQ](#faq)
* [A Note About Imports](#a-note-about-imports)
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
| [`initialize`](#initialize)        	| Method for identifying users and setting a JWT                                                                            	|
| [`updateCart`](#updateCart)          	| Update _shoppingCartItems_ field on user profile                                                                          	|
| [`trackPurchase`](#trackPurchase)       	| Track purchase events                                                                                                     	|
| [`track`](#track)               	| Track custom events                                                                                                       	|
| [`trackInAppClose`](#trackInAppClose)     	| Track when an in-app message is closed                                                                                    	|
| [`trackInAppOpen`](#trackInAppOpen)      	| Track when a message is opened and marks it as read                                                                       	|
| [`trackInAppClick`](#trackInAppClick)     	| Track when a user clicks on a button or link within a message                                                             	|
| [`trackInAppDelivery`](#trackInAppDelivery)  	| Track when a message has been delivered to a user's device                                                                	|
| [`trackInAppConsume`](#trackInAppConsume)   	| Track when a message has been consumed. Deletes the in-app message from the server so it won't be returned anymore        	|
| [`getInAppMessages`](#getInAppMessages)    	| Either return in-app messages as a Promise or automatically paint them to the DOM if the second argument is passed `true` 	|
| [`updateUserEmail`](#updateUserEmail)     	| Change a user's email address                                                                                             	|
| [`updateUser`](#updateUser)          	| Change data on a user's profile or create a user if none exists                                                           	|
| [`updateSubscriptions`](#updateSubscriptions) 	| Updates user's subscriptions                                                                                              	|

# Usage

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
const { clearRefresh, setEmail, setUserID, logout } = initialize(
  'my-API-key',
  /* 
    _email_ will be defined if you call _setEmail_ 
    _userID_ will be defined if you call _setUserID_
  */
  ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
)
```

## updateCart

API [(see required API payload here)](https://api.iterable.com/api/docs#commerce_updateCart):

```ts
updateCart: (payload: UpdateCartRequestParams) => Promise<UpdateCartData>
```

Example:

```ts
updateCart({
  items: [{ id: '123', price: 100, name: 'keyboard', quantity: 1 }]
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
trackPurchase({
  items: [{ id: '123', name: 'keyboard', price: 100, quantity: 2 }],
  total: 200
});
  .then()
  .catch()
```

## track

API [(see required API payload here)](https://api.iterable.com/api/docs#events_track):

```ts
track: (payload: InAppTrackRequestParams) => Promise<TrackData>
```

Example:

```ts
track({ eventName: 'my-event' });
  ,then()
  .catch()
```

## trackInAppClose

API [(see required API payload here)](https://api.iterable.com/api/docs#events_trackInAppClose):

```ts
trackInAppClose: (payload: InAppEventRequestParams) => Promise<TrackCloseData>
```

Example:

```ts
trackInAppClose({
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
trackInAppOpen({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
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
trackInAppClick({
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
trackInAppDelivery({
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
trackInAppConsume({
  messageId: '123',
  deviceInfo: { appPackageName: 'my-website' }
})
  .then()
  .catch()
```

## getInAppMessages

API [(see required API payload here)](https://api.iterable.com/api/docs#In-app_getMessages):

```ts
getInAppMessages: (payload: InAppMessagesRequestParams, showMessagesAutomatically?: boolean) => Promise<TrackConsumeData> | PaintInAppMessageData
```

Example:

```ts
getInAppMessages({ 
  count: 20,
  packageName: 'my-website'
})
  .then()
  .catch()
```

or

```ts
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
    onOpenNodeToTakeFocus: 'input'
  },
  true
);

request()
  .then()
  .catch();
```

## updateUserEmail

API [(see required API payload here)](https://api.iterable.com/api/docs#users_updateEmail):

```ts
updateUserEmail: (newEmail: string) => Promise<UpdateEmailData>
```

Example:

```ts
updateUserEmail('hello@gmail.com')
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
updateUser({ dataFields: {} })
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
updateSubscriptions({ emailListIds: [1, 2, 3] })
  .then()
  .catch()
```

# FAQ

## How do I make API requests with the SDK?

First thing you need to do is generate an API key on [the Iterable app](https://app.iterable.com). Make sure this key is JWT-enabled and is of the _Mobile_ key type. This will ensure the SDK has
access to all the necessary endpoints when communicating with the Iterable API. After you generate your key, save both the API Key and JWT Secret somewhere handy. You'll need both of them.

First, we'll deal with the JWT Secret. Typically, you need some backend service that is going to use that JWT Secret to sign a JWT and return it to your client app. For the purposes of this explanation, we can demo this with a site like [jwt.io](https://jwt.io). See the [documentation on the Iterable website](https://support.iterable.com/hc/en-us/articles/360050801231-JWT-Enabled-API-Keys-) for instructions on how to generate a JWT from your JWT secret.

Once you have a JWT or a service that can generate a JWT automatically, you're ready to start making requests in the SDK. The syntax for that looks like this:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';

(() => {
  initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
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
    ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
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
    ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
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
    ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
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

## How Does the SDK Pass up My Email / User ID?

This SDK relies on a library called [Axios](https://github.com/axios/axios). For all outgoing XHR requests, the SDK utilities [Axios interceptors](https://github.com/axios/axios#interceptors) to add your user information to the requests.

## Ok Cool. What if I Want to Handle This Intercepting Logic Myself Instead?

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

## I Want to Automatically Show In-App Messages Every X Number of Seconds

This SDK allows that. Simply call the `getMessages` method but pass `true` as the second parameter to have the in-app messages appear automatically on an interval.

Normally to request a list of in-app messages, you'd make a request like this:

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';

(() => {
  const { setUserID } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
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
    ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
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
            true
          );

          request()
            .then()
            .catch();
        })
    })
})();
```

Optionally, you can pass arguments to fine-tune how you want the messages to appear

```ts
import { initialize } from '@iterable/web-sdk/dist/authorization';
import { getInAppMessages } from '@iterable/web-sdk/dist/inapp';

(() => {
  const { setUserID } = initialize(
    'YOUR_API_KEY_HERE',
    ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
  );

  yourAsyncLoginMethod()
    .then(response => {
      setUserID(response.user_id)
        .then(() => {
          const { request } = getInAppMessages(
            { 
              count: 20,
              packageName: 'my-website',
              /* time to wait after dismissing a message to show another one (in milliseconds) */
              displayInterval: 5000,
              /* optional message you want the screen reader to vocalize for accessibility purposes */
              onOpenScreenReaderMessage:
                'hey screen reader here telling you something just popped up on your screen!',
              /* what DOM node you want to take keyboard focus. Here we choose the first <input /> */
              onOpenNodeToTakeFocus: 'input',
              /* 
                additional offsets for top-right and bottom-right in-app messages.
                Good if you want the message to be out of the way of your navbar
                or something similar

                _topOffset_ only applies to "top-right" messages
                _bottomOffset_ only applies to "bottom-right" messages
              */
              topOffset: '20px',
              bottomOffset: '20px',
              rightOffset: '20px',
              /* how long the in-app messages take to animate in/out (in milliseconds) */
              animationDuration: 400;
            },
            true
          );

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
    ({ email, userID }) => yourAsyncJWTGeneratorMethod().then(({ jwt_token }) => jwt_token)
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
            true
          );

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
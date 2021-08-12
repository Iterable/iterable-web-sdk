![Iterable-Logo](https://user-images.githubusercontent.com/7387001/129065810-44b39e27-e319-408c-b87c-4d6b37e1f3b2.png)

# Iterable's JavaScript SDK

[Iterable](https://www.iterable.com) is a growth marketing platform that helps
you to create better experiences for—and deeper relationships with—your
customers. Use it to send customized email, SMS, push notification, in-app
message, web push notification campaigns to your customers.

This SDK helps you integrate your Web apps with Iterable.

# Table of Contents

* [Installation](#installation)
* [API](#api)
* [FAQ](#faq)
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

Below are the methods this SDK exposes. See [Iterable's API Docs](https://api.iterable.com/api/docs)
for information on what data to pass and what payload to receive from the HTTP requests.

| Method Name           	| Description                                                                                                               	|
|-----------------------	|---------------------------------------------------------------------------------------------------------------------------	|
| `initIdentify`        	| Method for identifying users and setting a JWT                                                                            	|
| `updateCart`          	| Update _shoppingCartItems_ field on user profile                                                                          	|
| `trackPurchase`       	| Track purchase events                                                                                                     	|
| `track`               	| Track custom events                                                                                                       	|
| `trackInAppClose`     	| Track when an in-app message is closed                                                                                    	|
| `trackInAppOpen`      	| Track when a message is opened and marks it as read                                                                       	|
| `trackInAppClick`     	| Track when a user clicks on a button or link within a message                                                             	|
| `trackInAppDelivery`  	| Track when a message has been delivered to a user's device                                                                	|
| `trackInAppConsume`   	| Track when a message has been consumed. Deletes the in-app message from the server so it won't be returned anymore        	|
| `getInAppMessages`    	| Either return in-app messages as a Promise or automatically paint them to the DOM if the second argument is passed `true` 	|
| `updateUserEmail`     	| Change a user's email address                                                                                             	|
| `updateUser`          	| Change data on a user's profile or create a user if none exists                                                           	|
| `updateSubscriptions` 	| Updates user's subscriptions                                                                                              	|

# FAQ

## How do I make API requests in the example app?

First thing you want to do is generate an API key on [the Iterable app](https://app.iterable.com).
After you have your key you want to create a `.env` file relative to the `.env.example` file
in the `example` directory. Once you have your file, copy the contents of `.env.example` to
your `.env` file and add your API key to the `API_KEY` variable.

Then once you boot up the app, you can set the key with the following code snippet:

```ts
import { initIdentify } from '@iterable/web-sdk';

((): void => {
  const { clearToken, setNewToken } = initIdentify(process.env.API_KEY);

  /* make your Iterable API requests here */
  doSomeRequest().then().catch()

  /* optionally you can also clear your token if you like */
  clearToken();

  /* 
    the initIdentify method also exposes a setNewToken method 
    if you want to set another key later on.
  */
  setNewToken('my-new-api-key')
})();
```

## How do I Identify a User When They Log In?

Similar to the previous example, `initIdentify` exposes methods to set an [Axios interceptor](https://github.com/axios/axios#interceptors) on all API requests. You would set an email like so:

```ts
import { initIdentify } from '@iterable/web-sdk';

((): void => {
  const { setEmail, logout } = initIdentify(process.env.API_KEY);
  setEmail('hello@gmail.com')


  /* make your Iterable API requests here */
  doRequest().then().catch()

  /* clear user upon logout */
  logout();
})();
```

or with a User ID:

```ts
import { initIdentify } from '@iterable/web-sdk';

((): void => {
  const { setUserID, logout } = initIdentify(process.env.API_KEY);

  setUserID('1a3fed')
    .then(() => {
      /* 
        set user returns a promise due to the fact that the method will attempt
        to create a user in the Iterable backend if one does not exist.
      */

      /* make your Iterable API requests here */
      doRequest().then().catch()
    })

  /* clear user upon logout */
  logout();
})();
```

Setting a user by their email or ID will also cover you for endpoints that require an
email or user ID in either the URL path or the query params. For example:

```ts
import { initIdentify, getUserByEmail } from '@iterable/web-sdk';

((): void => {
  const { setEmail, getMessages } = initIdentify(process.env.API_KEY);

  /* set the email first */
  setEmail('hello@gmail.com')

  /* no need to pass an email */
  getMessages({ count: 20 }).then().catch()
})();
```

## I Want to Intercept Outgoing Requests (or responses) Myself Instead. Can I Do This?

Yep! As mentioned before, this library is built upon [Axios](https://github.com/axios/axios), so
really anything that library exposes will be fair game here.

To get access to the base Axios instance, you can import it like so:

```ts
import { baseAxiosRequest } from '@iterable/web-sdk'
```

and for example if you want to set an `email` query param on every outgoing request, you would
just implement the way Axios advises like so:

```ts
import { baseAxiosRequest } from '@iterable/web-sdk';

((): void => {
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

## I Want to Automatically Show In-App Messages Every X Number of Seconds

This SDK allows that. Simply call the `getMessages` method but pass `true` as the second parameter
to have the in-app messages appear automatically on an interval.

Normally to request a list of in-app messages, you'd make a request like this:

```ts
import { initIdentify, getInAppMessages } from '@iterable/web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail } = initIdentify(process.env.API_KEY || '');
  setEmail('hello@gmail.com');

  getInAppMessages({ count: 20 })
    .then(console.log)
    .catch(console.warn)
})();
```

In order to take advantage of the SDK showing them automatically, you would implement
the same method in this way:

```ts
import { initIdentify, getInAppMessages } from '@iterable/web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail } = initIdentify(process.env.API_KEY || '');
  setEmail('hello@gmail.com');

  const { request: requestMessages } = getInAppMessages(
    { count: 20 },
    true
  );

  requestMessages().then(console.log).catch(console.warn);
})();
```

Optionally, you can pass arguments to fine-tune how you want the messages to appear

```ts
import { initIdentify, getInAppMessages } from '@iterable/web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail } = initIdentify(process.env.API_KEY || '');
  setEmail('hello@gmail.com');

  const { request: requestMessages } = getInAppMessages(
    { 
      count: 20,
      /* time to wait after dismissing a message to show another one (in milliseconds) */
      displayInterval: 5000,
      /* optional message you want the screen reader to vocalize for accessibility purposes */
      onOpenScreenReaderMessage:
        'hey screen reader here telling you something just popped up on your screen!',
      /* what DOM node you want to take keyboard focus. Here we choose the first <input /> */
      onOpenNodeToTakeFocus: 'input'
    },
    true
  );

  requestMessages().then(console.log).catch(console.warn);
})();
```

You can also pause and resume the messages stream if you like

```ts
import { initIdentify, getInAppMessages } from '@iterable/web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail } = initIdentify(process.env.API_KEY || '');
  setEmail('hello@gmail.com');

  const { 
    request: requestMessages,
    pauseMessageStream, 
    resumeMessageStream
   } = getInAppMessages(
    { count: 20 },
    true
  );

  requestMessages().then(console.log).catch(console.warn);

  /* pause any more in-app messages from appearing for a little while */
  pauseMessageStream();

  /* 
    pick up where we left off and show the next message in the queue. 
    And start the timer again.
  */
  resumeMessageStream();
})();
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
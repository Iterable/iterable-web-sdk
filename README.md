# Description

Iterable SDK

# Requirements

This project (along with the sample app) both require a minimum Node version of 16.3.0 or greater.
[Download NodeJS here.](https://nodejs.org/en/) Alternatively, you can use a tool such as 
[nvm](https://github.com/nvm-sh/nvm) to install another version of node and switch to that.

This project also uses [yarn package manager.](https://yarnpkg.com/getting-started/install) You'll
need to install that as well to run the commands within this project.

# Installation (not applicable until deployed)

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

# Commmands (SDK related)

## `yarn start`

Starts the SDK on a local server. Does 3 things in parallel:

1. Runs `ttsc` (yes you read that right [`ttsc`](https://github.com/cevek/ttypescript) instead of `tsc`) in watch mode, which is responsible for _only_ creating the TypeScript
definitions (`d.ts`) files and then transforming absolute path imports to relative ones.
2. Runs `babel` in watch mode, responsible for transpiling the TypeScript files into JavaScript
3. Runs `webpack` in watch mode, which compiles all the transpiled JavaScript files into one root
`index.js`.

## `yarn build`

Runs all the same 3 commands from `yarn start` but not in watch mode.

When this command finishes, you'll have transpiled files located in the `dist` directory, along
with an `index.js` file in the root of the project.

## `yarn test`

Runs the Jest test suite on any files ending in `test.{ts|js|tsx|jsx}` or inside a `__test__` directory

## `yarn clean`

Recursively deletes all `node_modules` directories (important if you also want to delete the `node_modules` within the sample app. Otherwise `rm -rf node_modules` will work just as well).

# Commands to run sample app with the SDK

## `yarn install:all`

Installs dependencies for both the SDK and the sample app. It's important to run this command before either `yarn start`ing or `yan build`ing.

## `yarn start:all`

Runs both the SDK and sample app in watch mode. Navigate to `http://localhost:8080` in your browser to see the sample app running. Making changes to the SDK `src` code while running both projects will also trigger the sample app to hot reload, so you can
develop both projects in parallel.

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

  /* make your Iterable API requests here */
  doRequest().then().catch()

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
        'hey screen reader here telling you something just popped up on your screen!'
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
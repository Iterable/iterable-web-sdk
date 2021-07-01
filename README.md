# Description

Iterable SDK

# Requirements

This project (along with the sample app) both require a minimum Node version of 16.3.0 or greater.
[Download NodeJS here.](https://nodejs.org/en/) Alternatively, you can use a tool such as 
[nvm](https://github.com/nvm-sh/nvm) to install another version of node and switch to that.

This project also uses [yarn package manager.](https://yarnpkg.com/getting-started/install) You'll
need to install that as well to run the commands within this project.

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
import { initIdentify } from 'iterable-web-sdk';

((): void => {
  const { setToken, clearToken } = initIdentify(process.env.API_KEY);
  setToken();

  /* make your Iterable API requests here */

  /* optionally you can also clear your token if you like */
  clearToken();

  /* setToken also takes an optional param if you want to set a new API key */
  setToken('my-new-api-key')
})();
```
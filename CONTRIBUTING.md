# Requirements

This project (along with the sample app) both require a minimum Node version of 18.12.0 or greater. [Download NodeJS here.](https://nodejs.org/en/) Alternatively, you can use a tool such as [nvm](https://github.com/nvm-sh/nvm) to install another version of node and switch to that.

This project also uses [yarn package manager.](https://yarnpkg.com/getting-started/install) You'll need to install that as well to run the commands within this project.

# Developing the SDK

This library exposes the following commands you can run to get started with development

## `yarn install`

Install all dependencies for the SDK project

## `yarn start`

Starts the SDK on a local server on port 8080 available at `http://localhost:8080`. Does 3 things in parallel:

1. Runs `ttsc` (yes you read that right [`ttsc`](https://github.com/cevek/ttypescript) instead of `tsc`) in watch mode, which is responsible for _only_ creating the TypeScript definitions (`d.ts`) files and then transforming absolute path imports to relative ones.
2. Runs `babel` in watch mode, responsible for transpiling the TypeScript files into JavaScript
3. Runs `webpack` in watch mode, which compiles all the transpiled JavaScript files into one root `index.js`.

## `yarn build`

Runs all the same 3 commands from `yarn start` but not in watch mode.

When this command finishes, you'll have transpiled files located in the `dist` directory, along with an `index.js` file in the root of the project.

## `yarn test`

Runs the Jest test suite on any files ending in `test.{ts|js|tsx|jsx}` or inside a `__test__` directory

## `yarn clean`

Recursively deletes all `node_modules` directories (important if you also want to delete the `node_modules` within the sample app. Otherwise `rm -rf node_modules` will work just as well).

# Developing the SDK with the Sample App

:rotating_light: Prerequisite: Run through the [configuring instructions](./EXAMPLE_APP.md) first

While developing the SDK, you'll most likely want to run the sample app alongside it so you can test your code in a browser environment. You can get the sample app running with the SDK by using these commands:

## `yarn install:all`

Installs dependencies for both the SDK and the sample app. It's important to run this command before either `yarn start`ing or `yan build`ing.

## `yarn start:all`

Runs both the SDK and sample app in watch mode. Navigate to `http://localhost:8080` in your browser to see the sample app running. Making changes to the SDK `src` code while running both projects will also trigger the sample app to hot reload, so you can develop both projects in parallel.
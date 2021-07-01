# Description

This is a starter project for those interested in creating some module that they have
intentions on publishing. Created with TypeScript, Babel 7, and Webpack

# Commmands

## `yarn start`

Starts a local server for developing purpose. Does 3 things in parallel:

1. Runs `tsc` in watch mode, which is responsible for _only_ creating the TypeScript
definitions (`d.ts`) files.
2. Runs `babel` in watch mode, responsible for transpiling the TypeScript files into JavaScript
3. Runs `webpack` in watch mode, which compiles all the transpiled JavaScript files into one root
`index.js`
    * Also will create a root `index.d.ts` file, thanks to [npm-dts-webpack-plugin](https://github.com/vytenisu/npm-dts-webpack-plugin)

## `yarn build`

Runs all the same 3 commands from `yarn start` but not in watch mode.

When this command finishes, you'll have transpiled files located in the `lib` directory, along
with `index.js` and `index.d.ts` files in the root of the project.

## `yarn test`

Runs the Jest test suite on any files ending in `test.{ts|js|tsx|jsx}` or inside a `__test__` directory
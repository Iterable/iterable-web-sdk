# Example App

This markdown file contains instructions for configuring and running the example app locally. For running instructions, see [the CONTRIBUTING.md file](./CONTRIBUTING.md)

## Configuring the `.env` File

First thing you need to do is generate an API key on [the Iterable app](https://app.iterable.com). Unlike an app that uses the production-ready SDK, this example app can be used with a non-JWT API key while running the SDK in development mode, so feel free to *_not_* check the "JWT Enabled" box when creating a key. Make sure this key is is of the _Mobile_ key type. This will ensure the SDK has access to all the necessary endpoints when communicating with the Iterable API. After you generate your key, save the API Key somewhere handy. You'll need it for the next step. After you have your key you need to create a `env` file relative to the `.env.example` file in the `example` directory. Once you have your file, copy the contents of `.env.example` to your `.env` file and add your API key to the `API_KEY` variable.

Then once you boot up the app with `yarn install:all && yarn start:all`, you can set the key with the following code snippet. Similar code already exists in [`./example/src/index.ts`](./example/src/index.ts), but feel free to edit and play with it:

```ts
import { initialize } from '@iterable/web-sdk';

(() => {
  const { clearAuthToken, setNewAuthToken } = initialize(process.env.API_KEY);

  /* make your Iterable API requests here */
  doSomeRequest().then().catch()

  /* optionally you can also clear your token if you like */
  clearAuthToken();

  /* 
    the initialize method also exposes a setNewAuthToken method 
    if you want to set another key later on.
  */
  setNewAuthToken('my-new-api-key')
})();
```

Now you're ready to start developing the SDK and the sample app in parallel!
# Example App

This markdown file contains instructions for configuring and running the example app locally. For running instructions, see [the CONTRIBUTING.md file](./CONTRIBUTING.md)

## Configuring the `.env` File

First thing you need to do is generate an API key on [the Iterable app](https://app.iterable.com).

- Select Type "Web"
- (Optional) JWT authentication checked

This will ensure the SDK has access to all the necessary endpoints when communicating with the Iterable API.

- Select "Create API key" and save your API Key
- Create a new file called `.env` in the `example/` directory and copy the contents of  `.env.example` into it (e.g. `cp examples/.env.example examples/.env`)
- Uncomment the `API_KEY` variable and add the API Key to the `API_KEY` variable (e.g. `API_KEY=xxxxxxxxx`)

Then once you boot up the app with `yarn install:all && yarn start:all`, you can set the key with the following code snippet. Similar code already exists in [`./example/src/index.ts`](./example/src/index.ts), but feel free to edit and play with it:

```ts
import { initialize } from '@iterable/web-sdk';

(() => {
  const { clearAuthToken, setNewAuthToken } = initialize(process.env.API_KEY);

  /* make your Iterable API requests here */
  doSomeRequest().then().catch();

  /* optionally you can also clear your token if you like */
  clearAuthToken();

  /* 
    the initialize method also exposes a setNewAuthToken method 
    if you want to set another key later on.
  */
  setNewAuthToken('my-new-api-key');
})();
```

Now you're ready to start developing the SDK and the sample app in parallel!


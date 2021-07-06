import './styles/index.css';
import { initIdentify, getInAppMessages } from 'iterable-web-sdk';

((): void => {
  const element = document.createElement('div');

  /* set token in the SDK */
  const { setToken, setEmail } = initIdentify(process.env.API_KEY || '');
  setToken();
  setEmail('martin.mckenna@iterable.com');

  getInAppMessages({
    count: 20
  })
    .then((response) => {
      element.innerHTML = `<pre style="white-space:break-spaces">${JSON.stringify(
        response.data.inAppMessages?.[0]?.createdAt
      )}</pre`;
    })
    .catch((e) => {
      element.innerHTML = `<pre>${e}</pre>`;
    });

  // element.innerHTML = doSomething('marty');
  document.body.appendChild(element);
})();

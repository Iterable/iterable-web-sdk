import './styles/index.css';
import { initIdentify, getInAppMessages } from 'iterable-web-sdk';

((): void => {
  const element = document.createElement('div');

  /* set token in the SDK */
  const { setEmail } = initIdentify(process.env.API_KEY || '');
  setEmail('martin.mckenna@iterable.com');

  getInAppMessages({ count: 20 })
    .then((response) => {
      element.innerHTML = response.data.inAppMessages?.[0]?.content?.html;
      document.body.appendChild(element);
    })
    .catch((e) => {
      console.warn(e.response.data);
    });

  // element.innerHTML = doSomething('marty');
})();

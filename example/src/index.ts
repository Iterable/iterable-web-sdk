import './styles/index.css';
import {
  initIdentify,
  getInAppMessages
  // getUserByEmail
} from 'iterable-web-sdk';

((): void => {
  const element = document.createElement('div');

  /* set token in the SDK */
  const { setEmail } = initIdentify(process.env.API_KEY || '');
  setEmail('martin.mckenna@iterable.com');

  // getUserByEmail().then(console.log);

  getInAppMessages({
    count: 20
    // email: 'fdsafds'
  })
    .then((response) => {
      element.innerHTML = response.data.inAppMessages?.[0]?.content?.html;
    })
    .catch((e) => {
      element.innerText = `<pre>${e}</pre>`;
    });

  // element.innerHTML = doSomething('marty');
  document.body.appendChild(element);
})();

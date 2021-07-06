import './styles/index.css';
import { initIdentify, getChannels } from 'iterable-web-sdk';

((): void => {
  const element = document.createElement('div');

  /* set token in the SDK */
  const { setToken, clearToken } = initIdentify(process.env.API_KEY || '');
  setToken();

  clearToken();

  getChannels()
    .then((response) => {
      element.innerHTML = `<pre style="white-space:break-spaces">${JSON.stringify(
        response.data
      )}</pre`;
    })
    .catch((e) => {
      element.innerHTML = `<pre>${e}</pre>`;
    });

  // element.innerHTML = doSomething('marty');
  document.body.appendChild(element);
})();

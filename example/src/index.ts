import './styles/index.css';
import { initIdentify } from 'iterable-web-sdk';
import { getChannels } from 'iterable-web-sdk';

((): void => {
  const element = document.createElement('div');

  // const mockPromise = (): Promise<string> => {
  //   return new Promise((resolve) => {
  //     return resolve('hello');
  //   });
  // };

  // const { setEmail, clearRefresh } = initIdentify('123', true, () =>
  //   mockPromise()
  // );
  // setEmail('hello@gmail.com');

  // document.getElementById('button-jawn').addEventListener('click', () => {
  //   clearRefresh();
  // });
  // initIdentify
  const { setToken } = initIdentify(process.env.API_KEY || '');
  setToken();
  // clearToken();
  console.log('fdsafds');
  getChannels().then((response) => {
    element.innerHTML = `<pre style="white-space:break-spaces">${JSON.stringify(
      response.data
    )}</pre`;
  });
  interface Hi {
    (hello: string): Promise<any>;
  }

  const hi: Hi = (hello) => {
    return Promise.resolve('fdsa');
  };

  const helo = hi('fdsafds').then((response) => {
    console.log(response);
  });

  // element.innerHTML = doSomething('marty');
  document.body.appendChild(element);
})();

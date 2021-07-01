import './styles/index.css';
import { initIdentify } from 'iterable-web-sdk';

((): void => {
  const element = document.createElement('div');

  const mockPromise = (): Promise<string> => {
    return new Promise((resolve) => {
      return resolve('hello');
    });
  };

  const { setEmail, clearRefresh } = initIdentify('123', true, () =>
    mockPromise()
  );
  setEmail('hello@gmail.com');

  document.getElementById('button-jawn').addEventListener('click', () => {
    clearRefresh();
  });
  // element.innerHTML = doSomething('marty');
  document.body.appendChild(element);
})();

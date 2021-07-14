import './styles/index.css';
import { initIdentify, getInAppMessages } from 'iterable-web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail } = initIdentify(process.env.API_KEY || '');
  setEmail('martin.mckenna@iterable.com');

  const { request, pauseMessageStream, resumeMessageStream } = getInAppMessages(
    {
      count: 20,
      displayInterval: 5000,
      onOpenScreenReaderMessage:
        'hey screen reader here telling you something just popped up on your screen!'
    },
    true
  );

  document
    .getElementById('pause')
    .addEventListener('click', pauseMessageStream);
  document
    .getElementById('resume')
    .addEventListener('click', resumeMessageStream);
  document
    .getElementById('pause')
    .addEventListener('click', pauseMessageStream);
  document.getElementById('start').addEventListener('click', () => {
    document.getElementById('start').setAttribute('disabled', 'true');
    document.getElementById('start').className = 'disabled';
    request().catch(console.warn);
  });
})();

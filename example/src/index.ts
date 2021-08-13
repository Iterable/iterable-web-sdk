import './styles/index.css';
import { initIdentify, getInAppMessages } from '@iterable/web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail, logout } = initIdentify(process.env.API_KEY || '');

  const { request, pauseMessageStream, resumeMessageStream } = getInAppMessages(
    {
      count: 20,
      displayInterval: 1000,
      onOpenScreenReaderMessage:
        'hey screen reader here telling you something just popped up on your screen!',
      onOpenNodeToTakeFocus: 'input'
    },
    true
  );

  const startBtn = document.getElementById('start');

  document
    .getElementById('pause')
    .addEventListener('click', pauseMessageStream);
  document
    .getElementById('resume')
    .addEventListener('click', resumeMessageStream);
  document
    .getElementById('pause')
    .addEventListener('click', pauseMessageStream);
  document.getElementById('logout').addEventListener('click', () => {
    logout();
    startBtn.innerText = 'Start Auto-Painting In-App Messages';
    startBtn.setAttribute('aria-disabled', 'false');
    startBtn.className = '';
  });

  startBtn.addEventListener('click', (event) => {
    event.preventDefault();
    setEmail('iterable.tester@gmail.com');
    if (startBtn.getAttribute('aria-disabled') !== 'true') {
      /* aria-disabled doesn't actually disable the button lol */
      request()
        .then((response) => {
          startBtn.innerText = `${response.data.inAppMessages.length} total messages retrieved!`;
        })
        .catch(console.warn);
    }
    startBtn.setAttribute('aria-disabled', 'true');
    startBtn.className = 'disabled';
  });
})();

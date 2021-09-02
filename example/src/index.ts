import './styles/index.css';
import axios from 'axios';
import { initIdentify, getInAppMessages } from '@iterable/web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail, logout } = initIdentify(process.env.API_KEY || '', (id) => {
    return axios
      .post(
        'http://localhost:5000/generate',
        {
          exp_minutes: 3,
          user_id: id
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((response) => response.data.token);
  });

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
    if (startBtn.getAttribute('aria-disabled') !== 'true') {
      startBtn.innerText = `Loading...`;
      setEmail('width.tester@gmail.com').then(() => {
        /* aria-disabled doesn't actually disable the button lol */
        request()
          .then((response) => {
            startBtn.innerText = `${response.data.inAppMessages.length} total messages retrieved!`;
          })
          .catch(console.warn);
      });
    }
    startBtn.setAttribute('aria-disabled', 'true');
    startBtn.className = 'disabled';
  });
})();

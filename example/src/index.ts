import './styles/index.css';
import { initIdentify, getInAppMessages } from 'iterable-web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail } = initIdentify(process.env.API_KEY || '');
  setEmail('iterable.tester@gmail.com');

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

  document
    .getElementById('pause')
    .addEventListener('click', pauseMessageStream);
  document
    .getElementById('resume')
    .addEventListener('click', resumeMessageStream);
  document
    .getElementById('pause')
    .addEventListener('click', pauseMessageStream);

  const startBtn = document.getElementById('start');
  startBtn.addEventListener('click', (event) => {
    event.preventDefault();
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

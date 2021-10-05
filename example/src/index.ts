import './styles/index.css';
import axios from 'axios';
import {
  initIdentify,
  getInAppMessages,
  updateUserEmail
} from '@iterable/web-sdk';

((): void => {
  /* set token in the SDK */
  const { setEmail, logout } = initIdentify(
    process.env.API_KEY || '',
    ({ email }) => {
      return axios
        .post(
          'http://localhost:5000/generate',
          {
            exp_minutes: 2,
            email
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response) => {
          return response.data?.token;
        });
    }
  );

  const { request, pauseMessageStream, resumeMessageStream } = getInAppMessages(
    {
      count: 20,
      displayInterval: 1000,
      onOpenScreenReaderMessage:
        'hey screen reader here telling you something just popped up on your screen!',
      onOpenNodeToTakeFocus: 'input',
      packageName: 'my-lil-website'
    },
    true
  );

  const startBtn = document.getElementById('start');
  const loginBtn = document.getElementById('login');
  const changeEmailForm = document.getElementById('change-email-form');
  const changeEmailBtn = document.getElementById('change-email-btn');

  const handleGetMessagesClick = (event: MouseEvent) => {
    event.preventDefault();
    if (startBtn.getAttribute('aria-disabled') !== 'true') {
      startBtn.innerText = `Loading...`;
      startBtn.setAttribute('aria-disabled', 'true');
      startBtn.className = 'disabled';
      request()
        .then((response) => {
          startBtn.innerText = `${response.data.inAppMessages.length} total messages retrieved!`;
        })
        .catch(console.warn);
    }
  };

  const handleLoginClick = (event: MouseEvent) => {
    const email =
      localStorage.getItem('iterable-email') || 'iterable.tester@gmail.com';

    /* disable login btn */
    if (loginBtn.getAttribute('aria-disabled') !== 'true') {
      event.preventDefault();
      /* login */
      loginBtn.setAttribute('aria-disabled', 'true');
      loginBtn.className = 'disabled';
      loginBtn.innerText = `Loading...`;
      setEmail(email).then(() => {
        /* enable change email button */
        changeEmailBtn.classList.remove('disabled');
        changeEmailBtn.setAttribute('aria-disabled', 'false');

        changeEmailBtn.innerText = 'Change email';

        /* enable in-app message button */
        loginBtn.innerText = `Logged in as ${email}`;
        startBtn.setAttribute('aria-disabled', 'false');
        startBtn.classList.remove('disabled');
        startBtn.innerText = 'Start painting in-app messages';
        /* aria-disabled doesn't actually disable the button lol */

        startBtn.addEventListener('click', handleGetMessagesClick);
      });
    }
  };

  const handleChangeEmail = (event: MouseEvent) => {
    event.preventDefault();
    const inputField = document.getElementById(
      'change-email-input'
    ) as HTMLInputElement;
    const newEmail = inputField.value;

    changeEmailBtn.setAttribute('aria-disabled', 'true');
    changeEmailBtn.className = 'disabled';
    changeEmailBtn.innerText = `Loading...`;

    startBtn.setAttribute('aria-disabled', 'true');
    startBtn.className = 'disabled';
    startBtn.removeEventListener('click', handleGetMessagesClick);

    updateUserEmail(newEmail)
      .then(() => {
        localStorage.setItem('iterable-email', newEmail);
        loginBtn.innerText = `Logged in as ${newEmail}`;

        changeEmailBtn.setAttribute('aria-disabled', 'false');
        changeEmailBtn.classList.remove('disabled');
        changeEmailBtn.innerText = 'Change email';
        inputField.value = '';

        startBtn.setAttribute('aria-disabled', 'false');
        startBtn.classList.remove('disabled');

        startBtn.addEventListener('click', handleGetMessagesClick);
      })
      .catch(() => {
        inputField.value = 'Something went wrong.';
        changeEmailBtn.setAttribute('aria-disabled', 'false');
        changeEmailBtn.classList.remove('disabled');
        changeEmailBtn.innerText = 'Change email';

        startBtn.setAttribute('aria-disabled', 'false');
        startBtn.classList.remove('disabled');
      });
  };

  loginBtn.addEventListener('click', handleLoginClick);
  changeEmailForm.addEventListener('submit', handleChangeEmail);

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
    startBtn.innerText = 'Login to See In-App Messages';
    startBtn.setAttribute('aria-disabled', 'true');
    startBtn.className = 'disabled';

    loginBtn.classList.remove('disabled');
    loginBtn.setAttribute('aria-disabled', 'false');
    loginBtn.innerText = 'Login';

    changeEmailBtn.setAttribute('aria-disabled', 'true');
    changeEmailBtn.className = 'disabled';

    startBtn.removeEventListener('click', handleGetMessagesClick);
  });
})();

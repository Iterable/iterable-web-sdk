import {
  ButtonHTMLAttributes,
  FC,
  MouseEvent as ReactMouseEvent,
  FormEvent as ReactFormEvent,
  useState
} from 'react';
import axios from 'axios';
import {
  initialize,
  getInAppMessages,
  updateUserEmail,
  InAppMessageResponse
} from '@iterable/web-sdk';

const { setEmail, logout } = initialize(
  process.env.API_KEY || '',
  ({ email }) => {
    return axios
      .post(
        'http://localhost:5000/generate',
        {
          exp_minutes: 2,
          email,
          jwt_secret: process.env.JWT_SECRET
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
    packageName: 'my-lil-website',
    rightOffset: '20px',
    topOffset: '20px',
    bottomOffset: '20px',
    handleLinks: 'external-new-tab'
  },
  true
);

interface Props {}

export const App: FC<Props> = () => {
  const [isLoggingIn, setLoggingIn] = useState<boolean>(false);
  const [isRequestingMessages, setRequestingMessages] =
    useState<boolean>(false);
  const [messages, setMessages] = useState<
    InAppMessageResponse['inAppMessages'] | null
  >(null);
  const [user, setUser] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [isUpdatingEmail, setUpdatingEmail] = useState<boolean>(false);

  const handleLoginClick = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!!user) {
      return;
    }
    const email =
      localStorage.getItem('iterable-email') || 'iterable.tester@gmail.com';
    event.preventDefault();
    setLoggingIn(true);

    setEmail(email)
      .then(() => {
        setLoggingIn(false);
        setUser(email);
      })
      .catch(() => {
        setLoggingIn(false);
      });
  };

  const handlePaintMessages = (
    event: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isRequestingMessages || !!messages || !user) {
      return;
    }
    event.preventDefault();
    setRequestingMessages(true);

    request()
      .then((response) => {
        setMessages(response.data?.inAppMessages);
        setRequestingMessages(false);
      })
      .catch(() => {
        setRequestingMessages(false);
      });
  };

  const handleLogout = () => {
    logout();
    setUser('');
    setMessages(null);
  };

  const handleChangeEmail = (event: ReactFormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUpdatingEmail) {
      return;
    }

    setUpdatingEmail(true);

    updateUserEmail(newEmail)
      .then(() => {
        localStorage.setItem('iterable-email', newEmail);
        setUpdatingEmail(false);
        setUser(newEmail);
      })
      .catch(() => {
        setUpdatingEmail(false);
        setNewEmail('Something went wrong.');
      });
  };

  const loginBtnAttrs: ButtonHTMLAttributes<HTMLButtonElement> =
    isLoggingIn || !!user
      ? {
          'aria-disabled': true,
          className: 'disabled'
        }
      : {};

  const startBtnAttrs =
    !user || !!messages || isRequestingMessages
      ? {
          'aria-disabled': true,
          className: 'disabled'
        }
      : {};

  const changeEmailBtnAttrs =
    !user || isUpdatingEmail
      ? {
          'aria-disabled': true,
          className: 'disabled'
        }
      : {};

  return (
    <>
      <h1 className="heading">In-App Messaging Controls</h1>
      <div className="control-wrapper">
        <button id="login" onClick={handleLoginClick} {...loginBtnAttrs}>
          {isLoggingIn
            ? 'Loading...'
            : !!user
            ? `Logged in as ${user}`
            : 'Login'}
        </button>
        <button id="start" {...startBtnAttrs} onClick={handlePaintMessages}>
          {!user
            ? 'Login to See In-App Messages'
            : !!messages
            ? `${messages.length} total messages retrieved!`
            : 'Start painting in-app messages'}
        </button>
        <button id="pause" onClick={pauseMessageStream}>
          Pause Message Stream
        </button>
        <button id="resume" onClick={resumeMessageStream}>
          Resume Message Stream
        </button>
        <button id="logout" onClick={handleLogout}>
          Logout
        </button>
        <form id="change-email-form" onSubmit={handleChangeEmail}>
          <div className="input-wrapper">
            <label htmlFor="change-email">Update Email</label>
            <input
              placeholder="Enter new email"
              type="text"
              name="change-email"
              id="change-email-input"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <button type="submit" id="change-email-btn" {...changeEmailBtnAttrs}>
            {isUpdatingEmail ? 'Updating...' : 'Change email'}
          </button>
        </form>
      </div>
    </>
  );
};

export default App;

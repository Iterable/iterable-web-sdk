import { FC, FormEvent, useEffect, useState } from 'react';
import {
  Button,
  EndpointWrapper,
  Form,
  Heading,
  Response
} from '../views/Components.styled';
import {
  initialize,
  EmbeddedManager,
  trackEmbeddedMessageReceived,
  trackEmbeddedMessageClick,
  trackEmbeddedSession,
  trackEmbeddedMessagingDismiss,
  trackEmbeddedMessagingSession
} from '@iterable/web-sdk';
import TextField from 'src/components/TextField';

interface Props {}

export const EmbeddedMessage: FC<Props> = () => {
  const [isFetchingEmbeddedMessages, setFetchingEmbeddedMessages] =
    useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [trackResponse, setTrackResponse] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [buttonClickedIndex, setButtonClickedIndex] = useState<number>();

  const TYPE_GET_RECEIVED = 0;
  const TYPE_POST_RECEIVED = 1;
  const TYPE_CLICK = 2;
  const TYPE_IMPRESSION = 3;
  const TYPE_DISMISS = 4;
  const TYPE_SESSION = 5;

  interface EventsProps {
    heading: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    btnText: string;
    hasInput: boolean;
  }

  useEffect(() => {
    initialize(process.env.API_KEY);
  }, []);

  const handleFetchEmbeddedMessages = async (e: FormEvent<HTMLFormElement>) => {
    setTrackResponse('');
    e.preventDefault();
    setButtonClickedIndex(TYPE_GET_RECEIVED);

    setFetchingEmbeddedMessages(true);
    try {
      await new EmbeddedManager().syncMessages(
        userId,
        userId,
        'Web',
        '1',
        'my-website',
        () => console.log('Synced message'),
        [9]
      );
    } catch (error: any) {
      setTrackResponse(JSON.stringify(error.response.data));
      setFetchingEmbeddedMessages(false);
    }
  };

  const submitEmbeddedMessagesReceivedEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    setTrackResponse('');
    e.preventDefault();
    setButtonClickedIndex(TYPE_POST_RECEIVED);
    const receivedMessage = {
      userId: 'abc123',
      messageId: 'abc123',
      deviceInfo: { appPackageName: 'my-lil-site' },
      createdAt: 1627060811283
    };

    trackEmbeddedMessageReceived(receivedMessage)
      .then((response) => {
        setTrackResponse(JSON.stringify(response.data));
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
      });
  };

  const submitEmbeddedMessagesClickEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    setTrackResponse('');
    e.preventDefault();
    setButtonClickedIndex(TYPE_CLICK);
    const payload = {
      messageId: 'abc123',
      campaignId: 1
    };

    const buttonIdentifier = 'button-123';
    const clickedUrl = 'https://example.com';
    const appPackageName = 'my-lil-site';

    trackEmbeddedMessageClick(
      'abc123',
      payload,
      buttonIdentifier,
      clickedUrl,
      appPackageName,
      1627060811283
    )
      .then((response) => {
        setTrackResponse(JSON.stringify(response.data));
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
      });
  };

  const submitEmbeddedMessagesImpressionEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    setTrackResponse('');
    e.preventDefault();
    setButtonClickedIndex(TYPE_IMPRESSION);
    const sessionData = {
      session: {
        id: '123',
        start: 18686876876876,
        end: 1008083828723
      },
      impressions: [
        {
          messageId: 'abc123',
          displayCount: 3,
          duration: 10,
          displayDuration: 10
        }
      ],
      deviceInfo: { appPackageName: 'my-lil-site' }
    };

    trackEmbeddedSession(sessionData)
      .then((response) => {
        setTrackResponse(JSON.stringify(response.data));
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
      });
  };

  const submitEmbeddedMessagesDismissEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    setTrackResponse('');
    e.preventDefault();
    setButtonClickedIndex(TYPE_DISMISS);
    const sessionData = {
      email: userId,
      userId: userId,
      messageId: inputValue,
      buttonIdentifier: '123',
      deviceInfo: {
        deviceId: '123',
        platform: 'web',
        appPackageName: 'my-website'
      },
      createdAt: 1627060811283
    };

    trackEmbeddedMessagingDismiss(sessionData)
      .then((response) => {
        setTrackResponse(JSON.stringify(response.data));
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
      });
  };

  const submitEmbeddedSessionEvent = async (e: FormEvent<HTMLFormElement>) => {
    setTrackResponse('');
    e.preventDefault();
    setButtonClickedIndex(TYPE_SESSION);
    const sessionData = {
      userId: 'abcd123',
      session: {
        id: 'abcd123',
        start: 1701753762,
        end: 1701754590
      },
      impressions: [
        {
          messageId: 'abcd123',
          displayCount: 1,
          displayDuration: 1000
        }
      ],
      deviceInfo: {
        deviceId:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        platform: 'Web',
        appPackageName: 'my-lil-site'
      },
      createdAt: 1701754590
    };

    trackEmbeddedMessagingSession(sessionData)
      .then((response) => {
        setTrackResponse(JSON.stringify(response.data));
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
      });
  };

  const eventsList: Array<EventsProps> = [
    {
      heading: 'GET /embedded-messaging/events/received',
      onSubmit: handleFetchEmbeddedMessages,
      btnText: 'Fetch Embedded Messages',
      hasInput: false
    },
    {
      heading: 'POST /embedded-messaging/events/received',
      onSubmit: submitEmbeddedMessagesReceivedEvent,
      btnText: 'Submit',
      hasInput: false
    },
    {
      heading: 'POST /embedded-messaging/events/click',
      onSubmit: submitEmbeddedMessagesClickEvent,
      btnText: 'Submit',
      hasInput: false
    },
    {
      heading: 'POST /embedded-messaging/events/impression',
      onSubmit: submitEmbeddedMessagesImpressionEvent,
      btnText: 'Submit',
      hasInput: false
    },
    {
      heading: 'POST /embedded-messaging/events/dismiss',
      onSubmit: submitEmbeddedMessagesDismissEvent,
      btnText: 'Submit',
      hasInput: true
    },
    {
      heading: 'POST /embedded-messaging/events/session',
      onSubmit: submitEmbeddedSessionEvent,
      btnText: 'Submit',
      hasInput: false
    }
  ];

  return (
    <>
      <h1>Embedded Message</h1>
      <label htmlFor="item-1">UserId</label>
      <TextField
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        id="item-1"
        placeholder="e.g. phone_number"
        data-qa-update-user-input
        required
      />
      <br />
      {eventsList.map((element: EventsProps, index: number) => (
        <>
          <Heading>{element.heading}</Heading>
          <EndpointWrapper>
            <Form
              onSubmit={element.onSubmit}
              data-qa-cart-submit
              style={{ marginBottom: 20 }}
            >
              {element.hasInput && (
                <TextField
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  id="item-1"
                  placeholder={'e.g. df3fe3'}
                />
              )}
              <Button type="submit">{element.btnText}</Button>
            </Form>
            {index === buttonClickedIndex && (
              <Response>{trackResponse}</Response>
            )}
          </EndpointWrapper>
        </>
      ))}
    </>
  );
};

export default EmbeddedMessage;

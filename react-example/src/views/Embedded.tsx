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
  trackEmbeddedMessagingDismiss
} from '@iterable/web-sdk';
import TextField from 'src/components/TextField';

interface Props {}

export const EmbeddedMessage: FC<Props> = () => {
  const [userId, setUserId] = useState<string>();
  const [trackResponse, setTrackResponse] = useState<string>('');
  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [buttonClickedIndex, setButtonClickedIndex] = useState<number>();

  useEffect(() => {
    initialize(process.env.API_KEY);
  }, []);

  const handleFetchEmbeddedMessages = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonClickedIndex(0);

    try {
      await new EmbeddedManager().syncMessages(userId, () =>
        console.log('Synced message')
      );
    } catch (error: any) {
      setTrackResponse(JSON.stringify(error.response.data));
      setTrackingEvent(false);
    }
  };

  const submitEmbeddedMessagesReceivedEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setButtonClickedIndex(1);
    const receivedMessage = {
      metadata: {
        messageId: 'abc123',
        campaignId: 1
      },
      elements: {
        title: 'Welcome Message',
        body: 'Thank you for using our app!'
      }
    };

    trackEmbeddedMessageReceived(receivedMessage)
      .then((response) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const submitEmbeddedMessagesClickEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setButtonClickedIndex(2);
    const payload = {
      messageId: 'abc123',
      campaignId: 1
    };

    const buttonIdentifier = 'button-123';
    const clickedUrl = 'https://example.com';
    const appPackageName = 'com.example.app';

    trackEmbeddedMessageClick(
      payload,
      buttonIdentifier,
      clickedUrl,
      appPackageName
    )
      .then((response) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const submitEmbeddedMessagesImpressionEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setButtonClickedIndex(3);
    const sessionData = {
      id: '123',
      start: new Date(),
      end: new Date(),
      impressions: [
        {
          messageId: 'abc123',
          displayCount: 3,
          duration: 10
        },
        {
          messageId: 'def456',
          displayCount: 2,
          duration: 8
        }
      ]
    };

    trackEmbeddedSession(sessionData)
      .then((response) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const submitEmbeddedMessagesDismissEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setButtonClickedIndex(4);
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
        setTrackingEvent(false);
      })
      .catch((error) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const eventsList = [
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
      {eventsList.map((element: any, index: number) => (
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
              <Button disabled={isTrackingEvent} type="submit">
                {element.btnText}
              </Button>
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

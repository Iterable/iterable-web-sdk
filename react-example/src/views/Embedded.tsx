import { FC, FormEvent, useEffect, useState } from 'react';
import { Button, EndpointWrapper, Form, Heading } from './Components.styled';

import {
  initialize,
  EmbeddedManager,
  trackEmbeddedMessageReceived,
  trackEmbeddedMessageClick,
  trackEmbeddedSession
} from '@iterable/web-sdk';
import TextField from 'src/components/TextField';

interface Props {}

export const EmbeddedMessage: FC<Props> = () => {
  const [isFetchingEmbeddedMessages, setFetchingEmbeddedMessages] =
    useState<boolean>(false);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    initialize(process.env.API_KEY);
  }, []);

  const handleFetchEmbeddedMessages = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      setFetchingEmbeddedMessages(false);
    }
  };

  const submitEmbeddedMessagesReceivedEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const receivedMessage = {
      messageId: 'abc123',
      metadata: {
        messageId: 'abc123',
        campaignId: 1
      },
      elements: {
        title: 'Welcome Message',
        body: 'Thank you for using our app!'
      },
      deviceInfo: { appPackageName: 'my-lil-site' }
    };

    trackEmbeddedMessageReceived(receivedMessage)
      .then((response) => {
        console.log('Message reception tracked:', response);
      })
      .catch((error) => {
        console.error('Error tracking message reception:', error);
      });
  };

  const submitEmbeddedMessagesClickEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const payload = {
      messageId: 'abc123',
      campaignId: 1
    };

    const buttonIdentifier = 'button-123';
    const clickedUrl = 'https://example.com';
    const appPackageName = 'my-lil-site';

    trackEmbeddedMessageClick(
      payload,
      buttonIdentifier,
      clickedUrl,
      appPackageName
    )
      .then((response) => {
        console.log('Click tracking successful:', response);
      })
      .catch((error) => {
        console.error('Error tracking click:', error);
      });
  };

  const submitEmbeddedMessagesImpressionEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
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
        },
        {
          messageId: 'def456',
          displayCount: 2,
          duration: 8,
          displayDuration: 8
        }
      ],
      deviceInfo: { appPackageName: 'my-lil-site' }
    };

    trackEmbeddedSession(sessionData)
      .then((response) => {
        console.log('Session tracking successful:', response);
      })
      .catch((error) => {
        console.error('Error tracking session:', error);
      });
  };

  const eventsList = [
    {
      heading: 'GET /embedded-messaging/events/received',
      onSubmit: handleFetchEmbeddedMessages,
      btnText: 'Fetch Embedded Messages'
    },
    {
      heading: 'POST /embedded-messaging/events/received',
      onSubmit: submitEmbeddedMessagesReceivedEvent,
      btnText: 'Submit'
    },
    {
      heading: 'POST /embedded-messaging/events/click',
      onSubmit: submitEmbeddedMessagesClickEvent,
      btnText: 'Submit'
    },
    {
      heading: 'POST /embedded-messaging/events/impression',
      onSubmit: submitEmbeddedMessagesImpressionEvent,
      btnText: 'Submit'
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
      {eventsList.map((element: any) => (
        <>
          <Heading>{element.heading}</Heading>
          <EndpointWrapper>
            <Form onSubmit={element.onSubmit} data-qa-cart-submit>
              <Button type="submit">{element.btnText}</Button>
            </Form>
          </EndpointWrapper>
        </>
      ))}
    </>
  );
};

export default EmbeddedMessage;

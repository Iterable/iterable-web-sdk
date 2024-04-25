import { FC, FormEvent, useState } from 'react';
import {
  Button,
  EndpointWrapper,
  Form,
  Heading,
  Response
} from '../views/Components.styled';
import {
  EmbeddedManager,
  trackEmbeddedMessageReceived,
  trackEmbeddedMessageClick,
  trackEmbeddedMessagingDismiss,
  trackEmbeddedMessagingSession,
  EmbeddedMessageUpdateHandler
} from '@iterable/web-sdk';
import TextField from 'src/components/TextField';
import { Functions } from 'src/utils/Functions';
import { v4 as uuidv4 } from 'uuid';
import { IEmbeddedMessage } from '@iterable/web-sdk';

interface Props {
  userId: string;
  endpointName: string;
  heading: string;
  needsInputField?: boolean;
  type: number;
}

export const TYPE_GET_RECEIVED = 0;
export const TYPE_POST_RECEIVED = 1;
export const TYPE_CLICK = 2;
export const TYPE_DISMISS = 3;
export const TYPE_SESSION = 4;

export const EmbeddedForm: FC<Props> = ({
  userId,
  endpointName,
  heading,
  needsInputField,
  type
}) => {
  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [messageId, setMessageId] = useState<string>('');

  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - 2);

  const handleFetchEmbeddedMessages = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updateListener: EmbeddedMessageUpdateHandler = {
        onMessagesUpdated() {
          console.log('onMessagesUpdated called');
        },
        onEmbeddedMessagingDisabled() {
          console.log('onEmbeddedMessagingDisabled called');
        }
      };
      const embeddedManager = new EmbeddedManager();
      embeddedManager.addUpdateListener(updateListener);
      await embeddedManager.syncMessages('my-website', () =>
        console.log('Synced message')
      );
    } catch (error: any) {
      setTrackResponse(JSON.stringify(error.response.data));
    }
  };

  const submitEmbeddedMessagesReceivedEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setTrackingEvent(true);
    let receivedMessage = {} as IEmbeddedMessage;

    receivedMessage = {
      [Functions.checkEmailValidation(userId) ? 'email' : 'userId']: userId,
      messageId: messageId,
      deviceInfo: { appPackageName: 'my-lil-site' }
    };

    trackEmbeddedMessageReceived(receivedMessage)
      .then((response: any) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error: any) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const submitEmbeddedMessagesClickEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setTrackingEvent(true);

    const payload = {
      messageId: messageId,
      campaignId: 1
    };

    const buttonIdentifier = 'button-123';
    const clickedUrl = 'https://example.com';
    const appPackageName = 'my-lil-site';

    trackEmbeddedMessageClick(
      payload,
      buttonIdentifier,
      clickedUrl,
      appPackageName,
      Date.now(),
      userId
    )
      .then((response: any) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error: any) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const submitEmbeddedMessagesDismissEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setTrackingEvent(true);

    const sessionData = {
      [Functions.checkEmailValidation(userId) ? 'email' : 'userId']: userId,
      messageId: messageId,
      buttonIdentifier: '123',
      deviceInfo: {
        deviceId: '123',
        platform: 'web',
        appPackageName: 'my-website'
      },
      createdAt: Date.now()
    };

    trackEmbeddedMessagingDismiss(sessionData)
      .then((response: any) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error: any) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const submitEmbeddedSessionEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);

    const sessionData = {
      [Functions.checkEmailValidation(userId) ? 'email' : 'userId']: userId,
      session: {
        id: uuidv4(),
        start: startTime.getTime(),
        end: Date.now()
      },
      impressions: [
        {
          messageId: messageId,
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
      createdAt: Date.now()
    };

    trackEmbeddedMessagingSession(sessionData)
      .then((response: any) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error: any) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const handleTrack = (e: FormEvent<HTMLFormElement>, type: number) => {
    if (type === TYPE_GET_RECEIVED) {
      handleFetchEmbeddedMessages(e);
    } else if (type === TYPE_POST_RECEIVED) {
      submitEmbeddedMessagesReceivedEvent(e);
    } else if (type === TYPE_CLICK) {
      submitEmbeddedMessagesClickEvent(e);
    } else if (type === TYPE_DISMISS) {
      submitEmbeddedMessagesDismissEvent(e);
    } else if (type === TYPE_SESSION) {
      submitEmbeddedSessionEvent(e);
    }
  };

  const formAttr = { [`data-qa-${endpointName}-submit`]: true };
  const inputAttr = { [`data-qa-${endpointName}-input`]: true };
  const responseAttr = { [`data-qa-${endpointName}-response`]: true };

  return (
    <>
      <Heading>{heading}</Heading>
      <EndpointWrapper>
        <Form onSubmit={(e) => handleTrack(e, type)} {...formAttr}>
          {needsInputField && (
            <>
              <label htmlFor="item-1">Enter Message ID</label>
              <TextField
                value={messageId}
                onChange={(e) => setMessageId(e.target.value)}
                id="item-1"
                placeholder={'e.g. df3fe3'}
                {...inputAttr}
              />
            </>
          )}
          <Button disabled={isTrackingEvent} type="submit">
            Submit
          </Button>
        </Form>
        <Response {...responseAttr}>{trackResponse}</Response>
      </EndpointWrapper>
    </>
  );
};

export default EmbeddedForm;

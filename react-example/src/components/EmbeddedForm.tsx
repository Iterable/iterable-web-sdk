/* eslint-disable no-console */
import {
  IterableEmbeddedManager,
  IterableEmbeddedMessageUpdateHandler,
  IterableResponse,
  trackEmbeddedClick,
  trackEmbeddedReceived,
  trackEmbeddedSession
} from '@iterable/web-sdk';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { FC, FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  EndpointWrapper,
  Form,
  Heading,
  Response,
  StyledButton
} from '../views/Components.styled';
import { TextField } from './TextField';

interface Props {
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
      const updateListener: IterableEmbeddedMessageUpdateHandler = {
        onMessagesUpdated() {
          console.log('onMessagesUpdated called');
        },
        onEmbeddedMessagingDisabled() {
          console.log('onEmbeddedMessagingDisabled called');
        }
      };
      const embeddedManager = new IterableEmbeddedManager('my-website');
      embeddedManager.addUpdateListener(updateListener);
      await embeddedManager.syncMessages('my-website', () =>
        console.log('Synced message')
      );
    } catch (error: unknown) {
      setTrackResponse(
        JSON.stringify(isAxiosError(error) ? error.response?.data : error)
      );
    }
  };

  const submitEmbeddedMessagesReceivedEvent = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setTrackingEvent(true);

    const receivedMessage = {
      messageId,
      appPackageName: 'my-lil-site'
    };

    trackEmbeddedReceived(receivedMessage.messageId, 'my-website')
      .then((response: AxiosResponse<IterableResponse>) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error: AxiosError<IterableResponse>) => {
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
      messageId,
      campaignId: 1
    };

    const buttonIdentifier = 'button-123';
    const targetUrl = 'https://example.com';
    const appPackageName = 'my-lil-site';

    trackEmbeddedClick({
      messageId: payload.messageId,
      buttonIdentifier,
      targetUrl,
      appPackageName
    })
      .then((response: AxiosResponse<IterableResponse>) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error: AxiosError<IterableResponse>) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
  };

  const submitEmbeddedSessionEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);

    const sessionData = {
      session: {
        id: uuidv4(),
        start: startTime.getTime(),
        end: Date.now()
      },
      impressions: [
        {
          messageId,
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
      appPackageName: 'my-website',
      createdAt: Date.now()
    };

    trackEmbeddedSession(sessionData)
      .then((response: AxiosResponse<IterableResponse>) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error: AxiosError<IterableResponse>) => {
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
          <StyledButton disabled={isTrackingEvent} type="submit">
            Submit
          </StyledButton>
        </Form>
        <Response {...responseAttr}>{trackResponse}</Response>
      </EndpointWrapper>
    </>
  );
};

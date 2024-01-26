import { FC, FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  EndpointWrapper,
  Form,
  Heading,
  Response
} from '../views/Components.styled';
import {
  initialize,
  IterablePromise,
  IterableResponse
} from '@iterable/web-sdk';
import TextField from 'src/components/TextField';
import { useAnonContext } from '../anonContext';
import { useUser } from 'src/context/Users';

interface Props {
  endpointName: string;
  heading: string;
  needsEventName?: boolean;
  method: (...args: any) => IterablePromise<IterableResponse>;
}

export const EventsForm: FC<Props> = ({
  method,
  endpointName,
  heading,
  needsEventName
}) => {
  const { anonymousUserEventManager } = useAnonContext();
  const { loggedInUser, setLoggedInUser } = useUser();
  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [trackEvent, setTrackEvent] = useState<string>('');

  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);

  const handleTrack = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);

    const conditionalParams = needsEventName
      ? { eventName: trackEvent }
      : { messageId: trackEvent };
    const eventDetails = {
      ...conditionalParams,
      createNewFields: true,
      createdAt: (Date.now() / 1000) | 0,
      userId: loggedInUser,
      dataFields: { website: { domain: 'omni.com' }, eventType: 'track' },
      deviceInfo: {
        appPackageName: 'my-website'
      }
    };

    await anonymousUserEventManager.trackAnonEvent(eventDetails);
    const isCriteriaCompleted =
      await anonymousUserEventManager.checkCriteriaCompletion();

    if (isCriteriaCompleted) {
      const userId = uuidv4();
      const App = await initialize(process.env.API_KEY);
      await App.setUserID(userId);
      await anonymousUserEventManager.createUser(userId, process.env.API_KEY);
      setLoggedInUser({ type: 'user_update', data: userId });
      await anonymousUserEventManager.syncEvents();
    }
  };

  const formAttr = { [`data-qa-${endpointName}-submit`]: true };
  const inputAttr = { [`data-qa-${endpointName}-input`]: true };
  const responseAttr = { [`data-qa-${endpointName}-response`]: true };

  return (
    <>
      <Heading>POST {heading}</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleTrack} {...formAttr}>
          <label htmlFor="item-1">
            {needsEventName ? 'Enter Event Name' : 'Enter Message ID'}
          </label>
          <TextField
            value={trackEvent}
            onChange={(e) => setTrackEvent(e.target.value)}
            id="item-1"
            placeholder={needsEventName ? 'e.g. button-clicked' : 'e.g. df3fe3'}
            {...inputAttr}
          />
          <Button disabled={isTrackingEvent} type="submit">
            Submit
          </Button>
        </Form>
        <Response {...responseAttr}>{trackResponse}</Response>
      </EndpointWrapper>
    </>
  );
};

export default EventsForm;

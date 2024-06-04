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
  InAppTrackRequestParams,
  initialize,
  IterablePromise,
  IterableResponse
} from '@iterable/web-sdk';
import TextField from 'src/components/TextField';
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
  const { loggedInUser, setLoggedInUser } = useUser();
  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [trackEvent, setTrackEvent] = useState<string>(
    '{"eventName":"button-clicked", "dataFields": {"browserVisit.website.domain":"https://mybrand.com/socks"}}'
  );

  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);

  const handleParseJson = () => {
    try {
      // Parse JSON and assert its type
      const parsedObject = JSON.parse(trackEvent) as InAppTrackRequestParams;
      return parsedObject;
    } catch (error) {
      setTrackResponse(JSON.stringify(error.message));
    }
  };

  const handleTrack = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);

    let jsonObj;
    if (needsEventName) {
      jsonObj = handleParseJson();
    }
    if ((needsEventName && jsonObj) || !needsEventName) {
      const conditionalParams = needsEventName
        ? jsonObj
        : { messageId: trackEvent };

      try {
        method({
          ...conditionalParams,
          deviceInfo: {
            appPackageName: 'my-website'
          }
        })
          .then((response) => {
            setTrackResponse(JSON.stringify(response.data));
            setTrackingEvent(false);
          })
          .catch((e) => {
            setTrackResponse(JSON.stringify(e.response.data));
            setTrackingEvent(false);
          });
      } catch (error) {
        setTrackResponse(JSON.stringify(error.message));
        setTrackingEvent(false);
      }
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
            {needsEventName ? 'Enter valid JSON' : 'Enter Message ID'}
          </label>
          <TextField
            value={trackEvent}
            onChange={(e) => setTrackEvent(e.target.value)}
            id="item-1"
            placeholder={
              needsEventName
                ? 'e.g. {"eventName":"button-clicked"}'
                : 'e.g. df3fe3'
            }
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

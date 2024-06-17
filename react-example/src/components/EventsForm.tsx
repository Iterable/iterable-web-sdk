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
  isAUT?: boolean;
  method: (...args: any) => IterablePromise<IterableResponse>;
}

export const EventsForm: FC<Props> = ({
  method,
  endpointName,
  heading,
  isAUT
}) => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const eventInput = isAUT
    ? '{"eventName":"button-clicked", "dataFields": {"browserVisit.website.domain":"https://mybrand.com/socks"}}'
    : '';
  const [trackEvent, setTrackEvent] = useState<string>(eventInput);
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
    if (isAUT) {
      jsonObj = handleParseJson();
    }
    if ((isAUT && jsonObj) || !isAUT) {
      const conditionalParams = isAUT ? jsonObj : { messageId: trackEvent };

      try {
        method({
          ...conditionalParams,
          deviceInfo: {
            appPackageName: 'my-website'
          }
        })
          .then((response: any) => {
            setTrackResponse(JSON.stringify(response.data));
            setTrackingEvent(false);
          })
          .catch((e: any) => {
            if (e && e.response && e.response.data) {
              setTrackResponse(JSON.stringify(e.response.data));
            } else {
              setTrackResponse(JSON.stringify(e));
            }
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
            {isAUT ? 'Enter valid JSON' : 'Enter Message ID'}
          </label>
          <TextField
            value={trackEvent}
            onChange={(e) => setTrackEvent(e.target.value)}
            id="item-1"
            placeholder={
              isAUT ? 'e.g. {"eventName":"button-clicked"}' : 'e.g. df3fe3'
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

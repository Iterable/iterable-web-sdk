import { FC, FormEvent, useState } from 'react';
import {
  IterablePromiseRejection,
  IterablePromise,
  IterableResponse
} from '@iterable/web-sdk';
import { AxiosError, AxiosResponse } from 'axios';
import TextField from './TextField';
import {
  Button,
  EndpointWrapper,
  Form,
  Heading,
  Response
} from '../views/Components.styled';

interface Props {
  endpointName: string;
  heading: string;
  needsEventName?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  method: (...args: any) => IterablePromise<IterableResponse>;
}

export const EventsForm: FC<Props> = ({
  method,
  endpointName,
  heading,
  needsEventName
}) => {
  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [trackEvent, setTrackEvent] = useState<string>('');

  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);

  const handleTrack = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);

    const conditionalParams = needsEventName
      ? { eventName: trackEvent }
      : { messageId: trackEvent };
    method({
      ...conditionalParams,
      deviceInfo: {
        appPackageName: 'my-website'
      }
    })
      .then((response: AxiosResponse<IterableResponse>) => {
        setTrackResponse(JSON.stringify(response.data));
        setTrackingEvent(false);
      })
      .catch((error: AxiosError<IterablePromiseRejection>) => {
        setTrackResponse(JSON.stringify(error.response.data));
        setTrackingEvent(false);
      });
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

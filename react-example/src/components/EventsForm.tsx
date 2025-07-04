import {
  InAppEventRequestParams,
  InAppTrackRequestParams,
  IterablePromise,
  IterableResponse
} from '@iterable/web-sdk';
import { AxiosError, AxiosResponse } from 'axios';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
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
  needsEventName?: boolean;
  method: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    args: InAppEventRequestParams | InAppTrackRequestParams
  ) => IterablePromise<IterableResponse>;
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
      .catch((e: AxiosError<IterableResponse>) => {
        setTrackResponse(JSON.stringify(e.response.data));
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
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTrackEvent(event.target.value);
            }}
            id="item-1"
            placeholder={needsEventName ? 'e.g. button-clicked' : 'e.g. df3fe3'}
            {...inputAttr}
          />
          <StyledButton disabled={isTrackingEvent} type="submit">
            Submit
          </StyledButton>
        </Form>
        <Response {...responseAttr}>{trackResponse}</Response>
      </EndpointWrapper>
    </>
  );
};

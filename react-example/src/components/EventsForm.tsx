import { FC, FormEvent, useState } from 'react';
import styled from 'styled-components';
import { IterablePromise, IterableResponse } from '@iterable/web-sdk';
import TextField from 'src/components/TextField';
import Button from 'src/components/Button';

interface Props {
  endpointName: string;
  heading: string;
  method: (...args: any) => IterablePromise<IterableResponse>;
}

const Form = styled.form`
  display: flex;
  flex-flow: column;
  width: 45%;

  @media (max-width: 850px) {
    width: 100%;
  }
`;

const Response = styled.pre`
  width: 45%;
  white-space: break-spaces;

  @media (max-width: 850px) {
    width: 100%;
  }
`;

const EndpointWrapper = styled.div`
  display: flex;
  flex-flow: row;
  width: 100%;
  justify-content: space-between;
`;

const Heading = styled.h2`
  margin-top: 3em;
`;

export const EventsForm: FC<Props> = ({ method, endpointName, heading }) => {
  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [trackEvent, setTrackEvent] = useState<string>('');

  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);

  const handleTrack = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);
    method({
      eventName: trackEvent,
      messageId: 'mock-id',
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
  };

  const formAttr = { [`data-qa-${endpointName}-submit`]: true };
  const inputAttr = { [`data-qa-${endpointName}-input`]: true };
  const responseAttr = { [`data-qa-${endpointName}-response`]: true };

  return (
    <>
      <Heading>POST {heading}</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleTrack} {...formAttr}>
          <label htmlFor="item-1">Enter Event Name</label>
          <TextField
            value={trackEvent}
            onChange={(e) => setTrackEvent(e.target.value)}
            id="item-1"
            placeholder="e.g. button-clicked"
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

import { FC, FormEvent, useState } from 'react';
import TextField from 'src/components/TextField';
import Button from 'src/components/Button';
import styled from 'styled-components';

import { track } from '@iterable/web-sdk';

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

interface Props {}

export const Events: FC<Props> = () => {
  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [trackEvent, setTrackEvent] = useState<string>('');

  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);

  const handleTrack = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);
    track({
      eventName: trackEvent
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

  return (
    <>
      <h1>Events Endpoints</h1>
      <Heading>POST /track</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleTrack} data-qa-track-submit>
          <label htmlFor="item-1">Enter Event Name</label>
          <TextField
            value={trackEvent}
            onChange={(e) => setTrackEvent(e.target.value)}
            id="item-1"
            placeholder="e.g. button-clicked"
            data-qa-track-input
          />
          <Button disabled={isTrackingEvent} type="submit">
            Submit
          </Button>
        </Form>
        <Response data-qa-track-response>{trackResponse}</Response>
      </EndpointWrapper>
    </>
  );
};

export default Events;

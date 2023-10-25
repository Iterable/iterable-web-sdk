import { FC, FormEvent, useState } from 'react';
import {
  Button,
  EndpointWrapper,
  Form,
  Heading,
  Response
} from '../views/Components.styled';
import { IterablePromise, IterableResponse } from '@iterable/web-sdk';
import TextField from 'src/components/TextField';

interface Props {
  endpointName: string;
  heading: string;
  hasInput?: boolean;
  method: (...args: any) => IterablePromise<IterableResponse>;
}

export const EmbeddedForm: FC<Props> = ({
  method,
  endpointName,
  heading,
  hasInput: hasInput
}) => {
  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [trackEvent, setTrackEvent] = useState<string>('');

  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);

  const handleTrack = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);

    const conditionalParams = hasInput
      ? { messageId: trackEvent }
      : { messageId: null };
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
  };

  const formAttr = { [`data-qa-${endpointName}-submit`]: true };
  const inputAttr = { [`data-qa-${endpointName}-input`]: true };
  const responseAttr = { [`data-qa-${endpointName}-response`]: true };

  return (
    <>
      <Heading>POST {heading}</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleTrack} {...formAttr}>
          {hasInput && (
            <>
              <label htmlFor="item-1"> Enter Message ID </label>
              <TextField
                value={trackEvent}
                onChange={(e) => setTrackEvent(e.target.value)}
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

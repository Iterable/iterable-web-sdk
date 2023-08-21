import { FC, FormEvent, useEffect, useState } from 'react';
import { Button, EndpointWrapper, Form, Heading } from './Components.styled';

import { initialize, EmbeddedManager } from '@iterable/web-sdk';

interface Props {}

export const EmbeddedMessage: FC<Props> = () => {
  const [isFetchingEmbeddedMessages, setFetchingEmbeddedMessages] =
    useState<boolean>(false);

  useEffect(() => {
    initialize(process.env.API_KEY);
  }, []);

  const handleFetchEmbeddedMessages = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFetchingEmbeddedMessages(true);
    try {
      await new EmbeddedManager().syncMessages('harrymash2006', () =>
        console.log('Synced message')
      );
    } catch (error: any) {
      setFetchingEmbeddedMessages(false);
    }
  };

  return (
    <>
      <h1>Embedded Message</h1>
      <Heading>GET /embedded-messaging/events/received</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleFetchEmbeddedMessages} data-qa-cart-submit>
          <Button disabled={isFetchingEmbeddedMessages} type="submit">
            Fetch Embedded Messages
          </Button>
        </Form>
      </EndpointWrapper>
    </>
  );
};

export default EmbeddedMessage;

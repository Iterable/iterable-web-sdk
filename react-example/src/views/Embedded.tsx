import { FC, useEffect, useState } from 'react';
import { initialize } from '@iterable/web-sdk';
import { TextField } from '../components/TextField';
import {
  EmbeddedForm,
  TYPE_CLICK,
  TYPE_DISMISS,
  TYPE_GET_RECEIVED,
  TYPE_POST_RECEIVED,
  TYPE_SESSION
} from '../components/EmbeddedForm';

interface Props {}

export const EmbeddedMessage: FC<Props> = () => {
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    initialize(process.env.API_KEY);
  }, []);

  return (
    <>
      <h1>Embedded Message</h1>
      <label htmlFor="item-1">UserId</label>
      <TextField
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        id="item-1"
        placeholder="e.g. phone_number"
        data-qa-update-user-input
        required
      />
      <br />
      <EmbeddedForm
        heading="GET /embedded-messaging/events/received"
        endpointName="received-get"
        type={TYPE_GET_RECEIVED}
      />
      <br />
      <EmbeddedForm
        heading="POST /embedded-messaging/events/received"
        endpointName="received-post"
        type={TYPE_POST_RECEIVED}
        needsInputField={true}
      />
      <br />
      <EmbeddedForm
        heading="POST /embedded-messaging/events/click"
        endpointName="click"
        type={TYPE_CLICK}
        needsInputField={true}
      />
      <br />
      <EmbeddedForm
        heading="POST /embedded-messaging/events/dismiss"
        endpointName="dismiss"
        needsInputField={true}
        type={TYPE_DISMISS}
      />
      <br />
      <EmbeddedForm
        heading="POST /embedded-messaging/events/session"
        endpointName="session"
        needsInputField={true}
        type={TYPE_SESSION}
      />
      <br />
    </>
  );
};

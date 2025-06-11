import {
  IterableResponse,
  updateSubscriptions,
  updateUser,
  updateUserEmail
} from '@iterable/web-sdk';
import { AxiosError, AxiosResponse } from 'axios';
import { FC, FormEvent, useState } from 'react';
import { TextField } from '../components/TextField';
import { useUser } from '../context/Users';
import {
  EndpointWrapper,
  Form,
  Heading,
  Response,
  StyledButton
} from './Components.styled';

interface Props {}

export const Users: FC<Props> = () => {
  const { loggedInUser, setLoggedInUser } = useUser();

  const [updateUserResponse, setUpdateUserResponse] = useState<string>(
    'Endpoint JSON goes here'
  );
  const [updateUserEmailResponse, setUpdateUserEmailResponse] =
    useState<string>('Endpoint JSON goes here');
  const [updateSubscriptionsResponse, setUpdateSubscriptionsResponse] =
    useState<string>('Endpoint JSON goes here');

  const [userDataField, setUserDataField] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailListID, setEmailListID] = useState<string>('');

  const [isUpdatingUser, setUpdatingUser] = useState<boolean>(false);
  const [isUpdatingUserEmail, setUpdatingUserEmail] = useState<boolean>(false);
  const [isUpdatingSubscriptions, setUpdatingSubscriptions] =
    useState<boolean>(false);

  const handleUpdateUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatingUser(true);
    updateUser({
      dataFields: { [userDataField]: 'test-data' }
    })
      .then((response: AxiosResponse<IterableResponse>) => {
        setUpdateUserResponse(JSON.stringify(response.data));
        setUpdatingUser(false);
      })
      .catch((e: AxiosError<IterableResponse>) => {
        setUpdateUserResponse(JSON.stringify(e.response.data));
        setUpdatingUser(false);
      });
  };

  const handleUpdateUserEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatingUserEmail(true);
    updateUserEmail(email)
      .then((response: AxiosResponse<IterableResponse>) => {
        setUpdatingUserEmail(false);
        setUpdateUserEmailResponse(JSON.stringify(response.data));
        setLoggedInUser({ type: 'user_update', data: email });
      })
      .catch((e: AxiosError<IterableResponse>) => {
        setUpdatingUserEmail(false);
        setUpdateUserEmailResponse(JSON.stringify(e.response.data));
      });
  };

  const handleUpdateSubscriptions = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUpdatingSubscriptions(true);
    updateSubscriptions({ emailListIds: [+emailListID] })
      .then((response: AxiosResponse<IterableResponse>) => {
        setUpdatingSubscriptions(false);
        setUpdateSubscriptionsResponse(JSON.stringify(response.data));
      })
      .catch((e: AxiosError<IterableResponse>) => {
        setUpdatingSubscriptions(false);
        setUpdateSubscriptionsResponse(JSON.stringify(e.response.data));
      });
  };

  return (
    <>
      <h1>Users Endpoints</h1>
      <Heading>POST /users/update</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleUpdateUser} data-qa-update-user-submit>
          <label htmlFor="item-1">
            Enter Data Field Name (value will be &quot;test-data&quot;)
          </label>
          <TextField
            value={userDataField}
            onChange={(e) => setUserDataField(e.target.value)}
            id="item-1"
            placeholder="e.g. phone_number"
            data-qa-update-user-input
            required
          />
          <StyledButton disabled={isUpdatingUser} type="submit">
            Submit
          </StyledButton>
        </Form>
        <Response data-qa-update-user-response>{updateUserResponse}</Response>
      </EndpointWrapper>
      <Heading>POST /users/updateUserEmail</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleUpdateUserEmail} data-qa-update-user-email-submit>
          <label htmlFor="item-1">
            Enter New Email (changing from {loggedInUser})
          </label>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="item-1"
            placeholder="e.g. hello@gmail.com"
            data-qa-update-user-email-input
            type="email"
            required
          />
          <StyledButton disabled={isUpdatingUserEmail} type="submit">
            Submit
          </StyledButton>
        </Form>
        <Response data-qa-update-user-email-response>
          {updateUserEmailResponse}
        </Response>
      </EndpointWrapper>
      <Heading>POST /users/updateSubscriptions</Heading>
      <EndpointWrapper>
        <Form
          onSubmit={handleUpdateSubscriptions}
          data-qa-update-subscriptions-submit
        >
          <label htmlFor="item-1">Enter new email list ID</label>
          <TextField
            value={emailListID}
            onChange={(e) => setEmailListID(e.target.value)}
            id="item-1"
            placeholder="e.g. 2"
            data-qa-update-subscriptions-input
            type="tel"
            required
          />
          <StyledButton disabled={isUpdatingSubscriptions} type="submit">
            Submit
          </StyledButton>
        </Form>
        <Response data-qa-update-subscriptions-response>
          {updateSubscriptionsResponse}
        </Response>
      </EndpointWrapper>
    </>
  );
};

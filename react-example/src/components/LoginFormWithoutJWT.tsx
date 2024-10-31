/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import styled from 'styled-components';

import { IdentityResolution } from '@iterable/web-sdk';
import { TextField as _TextField } from './TextField';
import { Button as _Button } from './Button';

import { useUser } from '../context/Users';

const TextField = styled(_TextField)``;

const Button = styled(_Button)`
  margin-left: 0.4em;
  max-width: 425px;
`;

const Form = styled.form`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-end;
  height: 100%;

  ${TextField} {
    align-self: stretch;
    margin-top: 5px;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Error = styled.div`
  color: red;
`;

interface Props {
  setEmail: (email: string) => Promise<void>;
  setUserId: (
    userId: string,
    identityResolution?: IdentityResolution
  ) => Promise<void>;
  logout: () => void;
}

export const LoginFormWithoutJWT: FC<Props> = ({
  setEmail,
  setUserId,
  logout
}) => {
  const [useEmail, setUseEmail] = useState<boolean>(true);
  const [user, updateUser] = useState<string>(process.env.LOGIN_EMAIL || '');

  const [error, setError] = useState<string>('');

  const [isEditingUser, setEditingUser] = useState<boolean>(false);

  const { loggedInUser, setLoggedInUser } = useUser();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const setUser = useEmail ? setEmail : setUserId;

    setUser(user)
      .then(() => {
        setEditingUser(false);
        setLoggedInUser({ type: 'user_update', data: user });
      })
      .catch(() => setError('Something went wrong!'));
  };

  const handleLogout = () => {
    logout();
    setLoggedInUser({ type: 'user_update', data: '' });
  };

  const handleEditUser = () => {
    updateUser(loggedInUser);
    setEditingUser(true);
  };

  const handleCancelEditUser = () => {
    updateUser('');
    setEditingUser(false);
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUseEmail(e.target.value === 'email');
  };

  const first5 = loggedInUser.substring(0, 5);
  const last9 = loggedInUser.substring(loggedInUser.length - 9);

  return (
    <>
      {loggedInUser && !isEditingUser ? (
        <>
          <Button onClick={handleEditUser}>
            Logged in as {`${first5}...${last9}`} (change)
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <StyledDiv>
          <Form>
            <div>
              <input
                type="radio"
                id="userId"
                name="userId"
                value="userId"
                checked={!useEmail}
                onChange={handleRadioChange}
              />
              <label>UserId</label>
            </div>
            <div>
              <input
                type="radio"
                id="email"
                name="email"
                value="email"
                checked={useEmail}
                onChange={handleRadioChange}
              />
              <label>Email</label>
            </div>
          </Form>
          <Form onSubmit={handleSubmit} data-qa-login-form>
            <TextField
              onChange={(e) => updateUser(e.target.value)}
              value={user}
              placeholder="e.g. hello@gmail.com"
              required
              data-qa-login-input
            />
            <Button type="submit">{isEditingUser ? 'Change' : 'Login'}</Button>
            {isEditingUser && (
              <Button onClick={handleCancelEditUser}>Cancel</Button>
            )}
          </Form>
          {error && <Error>{error}</Error>}
        </StyledDiv>
      )}
    </>
  );
};

export default LoginFormWithoutJWT;

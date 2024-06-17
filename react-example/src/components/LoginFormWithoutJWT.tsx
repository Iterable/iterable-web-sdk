import { FC, FormEvent, useState } from 'react';
import styled from 'styled-components';

import _TextField from 'src/components/TextField';
import _Button from 'src/components/Button';

import { useUser } from 'src/context/Users';

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

interface Props {
  setUserId: (userId: string) => Promise<void>;
  logout: () => void;
}

export const LoginFormWithoutJWT: FC<Props> = ({ setUserId, logout }) => {
  const [userId, updateUserId] = useState<string>(
    process.env.LOGIN_EMAIL || ''
  );

  const [isEditingUser, setEditingUser] = useState<boolean>(false);

  const { loggedInUser, setLoggedInUser } = useUser();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUserId(userId)
      .then(() => {
        setEditingUser(false);
        setLoggedInUser({ type: 'user_update', data: userId });
      })
      .catch(() => updateUserId('Something went wrong!'));
  };

  const handleLogout = () => {
    logout();
    setLoggedInUser({ type: 'user_update', data: '' });
  };

  const handleJwtRefresh = () => {
    //refreshJwt(userId);
  };

  const handleEditUser = () => {
    updateUserId(loggedInUser);
    setEditingUser(true);
  };

  const handleCancelEditUser = () => {
    updateUserId('');
    setEditingUser(false);
  };

  const first5 = loggedInUser.substring(0, 5);
  const last9 = loggedInUser.substring(loggedInUser.length - 9);

  return (
    <>
      {loggedInUser ? (
        isEditingUser ? (
          <Form onSubmit={handleSubmit}>
            <TextField
              onChange={(e) => updateUserId(e.target.value)}
              value={userId}
              placeholder="e.g. hello@gmail.com"
              //type="email"
              required
            />
            <Button type="submit">Change</Button>
            <Button onClick={handleCancelEditUser}>Cancel</Button>
          </Form>
        ) : (
          <>
            <Button onClick={handleEditUser}>
              Logged in as {`${first5}...${last9}`} (change)
            </Button>
            <Button onClick={handleJwtRefresh}>
              Manually Refresh JWT Token
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        )
      ) : (
        <Form onSubmit={handleSubmit} data-qa-login-form>
          <TextField
            onChange={(e) => updateUserId(e.target.value)}
            value={userId}
            placeholder="e.g. hello@gmail.com"
            //type="email"
            required
            data-qa-login-input
          />
          <Button type="submit">Login</Button>
        </Form>
      )}
    </>
  );
};

export default LoginFormWithoutJWT;

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
  setEmail: (email?: string) => Promise<string | void>;
  logout: () => void;
  refreshJwt?: (authTypes: string) => Promise<string>;
}

export const LoginForm: FC<Props> = ({ setEmail, logout, refreshJwt }) => {
  const [email, updateEmail] = useState<string>('');

  const [isEditingUser, setEditingUser] = useState<boolean>(false);

  const { loggedInUser, setLoggedInUser } = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await setEmail(email);
      setEditingUser(false);
      setLoggedInUser({ type: 'user_update', data: email });
    } catch {
      updateEmail('Something went wrong!');
    }
  };

  const handleLogout = () => {
    logout();
    setLoggedInUser({ type: 'user_update', data: '' });
  };

  const handleJwtRefresh = () => {
    refreshJwt(email);
  };

  const handleEditUser = () => {
    updateEmail(loggedInUser);
    setEditingUser(true);
  };

  const handleCancelEditUser = () => {
    updateEmail('');
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
              onChange={(e) => updateEmail(e.target.value)}
              value={email}
              placeholder="e.g. hello@gmail.com"
              type="email"
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
            onChange={(e) => updateEmail(e.target.value)}
            value={email}
            placeholder="e.g. hello@gmail.com"
            type="email"
            required
            data-qa-login-input
          />
          <Button type="submit">Login</Button>
        </Form>
      )}
    </>
  );
};

export default LoginForm;

import { ChangeEvent, FC, FormEvent, useState } from 'react';
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

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Error = styled.div`
  color: red;
`;

interface Props {
  setEmail: (email: string) => Promise<string>;
  setUserId: (userId: string) => Promise<string>;
  logout: () => void;
  refreshJwt: (authTypes: string) => Promise<string>;
}

export const LoginForm: FC<Props> = ({
  setEmail,
  setUserId,
  logout,
  refreshJwt
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

  const handleJwtRefresh = () => {
    refreshJwt(user);
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

  const UserTypeForm = () => (
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
  );

  const LoginForm = () => (
    <Form onSubmit={handleSubmit} data-qa-login-form>
      <TextField
        onChange={(e) => updateUser(e.target.value)}
        value={user}
        placeholder="e.g. hello@gmail.com"
        required
        data-qa-login-input
      />
      <Button type="submit">Login</Button>
    </Form>
  );

  const Buttons = () => (
    <>
      <Button onClick={handleEditUser}>
        Logged in as {`${first5}...${last9}`} (change)
      </Button>
      <Button onClick={handleJwtRefresh}>Manually Refresh JWT Token</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );

  const LoggedInOrEditing = isEditingUser ? LoginForm : Buttons;

  return (
    <>
      {loggedInUser ? (
        <LoggedInOrEditing />
      ) : (
        <StyledDiv>
          <UserTypeForm />
          <LoginForm />
          {error && <Error>{error}</Error>}
        </StyledDiv>
      )}
    </>
  );
};

export default LoginForm;

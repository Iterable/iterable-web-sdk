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

<<<<<<< HEAD
=======
const Error = styled.div`
  color: red;
`;

>>>>>>> 4bbbf172071fce5c09728335d93589a51ed5ddf5
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
<<<<<<< HEAD
=======
  const [error, setError] = useState<string>('');
>>>>>>> 4bbbf172071fce5c09728335d93589a51ed5ddf5

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
<<<<<<< HEAD
      .catch(() => updateUser('Something went wrong!'));
=======
      .catch(() => setError('Something went wrong!'));
>>>>>>> 4bbbf172071fce5c09728335d93589a51ed5ddf5
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

<<<<<<< HEAD
  const editingUserForm = (
    <Form onSubmit={handleSubmit}>
      <TextField
        onChange={(e) => updateUser(e.target.value)}
        value={user}
        placeholder="e.g. hello@gmail.com"
        required
      />
      <Button type="submit">Change</Button>
      <Button onClick={handleCancelEditUser}>Cancel</Button>
    </Form>
  );

  const userIdOrEmailForm = (
=======
  const UserTypeForm = () => (
>>>>>>> 4bbbf172071fce5c09728335d93589a51ed5ddf5
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

<<<<<<< HEAD
  const loginForm = (
=======
  const LoginForm = () => (
>>>>>>> 4bbbf172071fce5c09728335d93589a51ed5ddf5
    <Form onSubmit={handleSubmit} data-qa-login-form>
      <TextField
        onChange={(e) => updateUser(e.target.value)}
        value={user}
        placeholder="e.g. hello@gmail.com"
        required
        data-qa-login-input
      />
<<<<<<< HEAD
      <Button type="submit">Login</Button>
    </Form>
  );

  const loggedInButtons = (
=======
      <Button type="submit">{isEditingUser ? 'Change' : 'Login'}</Button>
      {isEditingUser && <Button onClick={handleCancelEditUser}>Cancel</Button>}
    </Form>
  );

  const Buttons = () => (
>>>>>>> 4bbbf172071fce5c09728335d93589a51ed5ddf5
    <>
      <Button onClick={handleEditUser}>
        Logged in as {`${first5}...${last9}`} (change)
      </Button>
      <Button onClick={handleJwtRefresh}>Manually Refresh JWT Token</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );

<<<<<<< HEAD
  const loggedInOrEditing = isEditingUser ? editingUserForm : loggedInButtons;
=======
  const LoggedInOrEditing = isEditingUser ? LoginForm : Buttons;
>>>>>>> 4bbbf172071fce5c09728335d93589a51ed5ddf5

  return (
    <>
      {loggedInUser ? (
<<<<<<< HEAD
        loggedInOrEditing
      ) : (
        <StyledDiv>
          {userIdOrEmailForm}
          {loginForm}
=======
        <LoggedInOrEditing />
      ) : (
        <StyledDiv>
          <UserTypeForm />
          <LoginForm />
          {error && <Error>{error}</Error>}
>>>>>>> 4bbbf172071fce5c09728335d93589a51ed5ddf5
        </StyledDiv>
      )}
    </>
  );
};

export default LoginForm;

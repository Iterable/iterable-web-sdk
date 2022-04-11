import { FC, FormEvent, useContext, useState } from 'react';
import styled from 'styled-components';

import _TextField from 'src/components/TextField';
import _Button from 'src/components/Button';

import { Context, UserContext } from 'src/context/Users';

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
  setEmail: (email: string) => Promise<any>;
}

export const LoginForm: FC<Props> = ({ setEmail }) => {
  const [email, updateEmail] = useState<string>('');

  const [isEditingUser, setEditingUser] = useState<boolean>(false);

  const { state: loggedInUser, dispatch: setLoggedInUser } =
    useContext<Context>(UserContext);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmail(email)
      .then(() => {
        setEditingUser(false);
        setLoggedInUser({ type: 'user_update', data: email });
        updateEmail('');
      })
      .catch(() => updateEmail('Something went wrong!'));
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
          <Button onClick={handleEditUser}>
            Logged In As {`${first5}...${last9}`} (change)
          </Button>
        )
      ) : (
        <Form onSubmit={handleSubmit}>
          <TextField
            onChange={(e) => updateEmail(e.target.value)}
            value={email}
            placeholder="e.g. hello@gmail.com"
            type="email"
            required
          />
          <Button type="submit">Login</Button>
        </Form>
      )}
    </>
  );
};

export default LoginForm;

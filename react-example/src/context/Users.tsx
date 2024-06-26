import {
  createContext,
  Dispatch,
  FC,
  Reducer,
  useContext,
  useReducer
} from 'react';

type State = string;

type Action = 'user_update';

type ActionWrapper = { type: Action; data: string };

const initialState = '';

export const reducer: Reducer<State, ActionWrapper> = (state, action) => {
  switch (action.type) {
    case 'user_update':
      return action.data;

    default:
      return state;
  }
};

export interface Context {
  loggedInUser: State;
  setLoggedInUser: Dispatch<ActionWrapper>;
}

export const UserContext = createContext<Context>({
  loggedInUser: initialState,
  setLoggedInUser: () => null
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext<Context>(UserContext);

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

const STORAGE_KEY = 'iterable_logged_in_user';

const getInitialState = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || '';
  }
  return '';
};

const initialState = getInitialState();

export const reducer: Reducer<State, ActionWrapper> = (state, action) => {
  switch (action.type) {
    case 'user_update':
      if (typeof window !== 'undefined') {
        if (action.data) {
          localStorage.setItem(STORAGE_KEY, action.data);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
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

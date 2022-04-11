import { createContext, Dispatch, FC, Reducer, useReducer } from 'react';

type State = string;

type Action = 'user_update';

type ActionWrapper = { type: Action; data: any };

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
  state: State;
  dispatch: Dispatch<ActionWrapper>;
}

export const UserContext = createContext<Context>({
  state: initialState,
  dispatch: () => null
});

export const UserProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

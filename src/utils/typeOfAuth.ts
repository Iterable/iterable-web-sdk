const TYPE_OF_AUTH_KEY = 'ITBL_TYPE_OF_AUTH';
type TypeOfAuth = 'email' | 'userID';
export const getTypeOfAuth = () => localStorage.getItem(TYPE_OF_AUTH_KEY);
export const setTypeOfAuth = (value: TypeOfAuth) =>
  localStorage.setItem(TYPE_OF_AUTH_KEY, value);
export const removeTypeOfAuth = () => localStorage.removeItem(TYPE_OF_AUTH_KEY);

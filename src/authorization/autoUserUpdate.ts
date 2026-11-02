import { SHARED_PREF_USER_UPDATED } from '../constants';
import { config } from '../utils/config';

export type UserIdentityType = 'email' | 'userID';

const toStoredIdentity = (type: UserIdentityType, identity: string) =>
  `${type}:${identity}`;

/* any value other than false or 'oncePerUser' keeps the default behavior */
export const shouldAutoUpdateUser = (
  type: UserIdentityType,
  identity: string
) => {
  const autoUserUpdate = config.getConfig('autoUserUpdate');
  if (autoUserUpdate === false) return false;
  if (autoUserUpdate !== 'oncePerUser') return true;
  return (
    localStorage.getItem(SHARED_PREF_USER_UPDATED) !==
    toStoredIdentity(type, identity)
  );
};

export const markUserUpdated = (type: UserIdentityType, identity: string) => {
  if (config.getConfig('autoUserUpdate') === 'oncePerUser') {
    localStorage.setItem(
      SHARED_PREF_USER_UPDATED,
      toStoredIdentity(type, identity)
    );
  }
};

export const clearUserUpdated = () => {
  localStorage.removeItem(SHARED_PREF_USER_UPDATED);
};

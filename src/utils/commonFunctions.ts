import config from '../utils/config';

export const canTrackAnonUser = (payload: any): boolean => {
  if (
    (!('userId' in payload) ||
      payload.userId === null ||
      typeof payload.userId === 'undefined') &&
    (!('email' in payload) ||
      payload.email === null ||
      typeof payload.email === 'undefined') &&
    config.getConfig('enableAnonTracking')
  ) {
    return true;
  }

  return false;
};

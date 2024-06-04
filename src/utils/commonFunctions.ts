import { typeOfAuth } from '..';
import config from '../utils/config';

export const canTrackAnonUser = (): boolean => {
  console.log('typeofauth::', typeOfAuth);
  if (config.getConfig('enableAnonTracking') && typeOfAuth === null) {
    return true;
  }
  return false;
};

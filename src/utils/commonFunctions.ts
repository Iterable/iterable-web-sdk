import { typeOfAuth } from '..';
import config from '../utils/config';

export const canTrackAnonUser = (): boolean => {
  if (config.getConfig('enableAnonTracking') && typeOfAuth === null) {
    return true;
  }
  return false;
};

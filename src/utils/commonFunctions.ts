import { typeOfAuth } from '../authorization/authorization';
import config from '../utils/config';

export const canTrackAnonUser = (): boolean => {
  return config.getConfig('enableAnonTracking') && typeOfAuth === null;
};

import config from './config';
import { typeOfAuth } from './typeOfAuth';

export const canTrackAnonUser = (): boolean =>
  config.getConfig('enableAnonTracking') && typeOfAuth === null;

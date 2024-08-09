import { typeOfAuth } from '../authorization/authorization';
import config from './config';

export const canTrackAnonUser = (): boolean =>
  config.getConfig('enableAnonTracking') && typeOfAuth === null;

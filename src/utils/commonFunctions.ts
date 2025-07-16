import config from './config';
import { getTypeOfAuth } from './typeOfAuth';

export const canTrackAnonUser = (): boolean =>
  config.getConfig('enableAnonActivation') && getTypeOfAuth() === null;

import config from './config';
import { getTypeOfAuth } from './typeOfAuth';

export const canTrackUnknownUser = (): boolean =>
  config.getConfig('enableUnknownActivation') && getTypeOfAuth() === null;

import config from './config';
import { getTypeOfAuth } from './typeOfAuth';

export const canTrackUnknownUser = (): boolean =>
  config.getConfig('enableUnknownUserActivation') && getTypeOfAuth() === null;

/**
 * One-shot localStorage key migration. If a value exists at `oldKey` and not
 * at `newKey`, copy it over and delete the old one. Safe to call repeatedly.
 */
export const migrateLegacyKey = (oldKey: string, newKey: string): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    const existing = localStorage.getItem(newKey);
    if (existing != null) {
      localStorage.removeItem(oldKey);
      return;
    }
    const legacy = localStorage.getItem(oldKey);
    if (legacy != null) {
      localStorage.setItem(newKey, legacy);
      localStorage.removeItem(oldKey);
    }
  } catch (_e) {
    /* localStorage may be unavailable / quota-exceeded; ignore */
  }
};

import { SHARED_PREF_EMAIL, SHARED_PREF_USER_ID } from '../constants';
import { safeStorage } from './safeStorage';

export default class {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static checkEmailValidation(email: string): boolean {
    return this.emailRegex.test(email);
  }

  public static addEmailOrUserIdToJson(
    jsonParams: any,
    storage: Storage = safeStorage
  ): any {
    const store = jsonParams;
    const userId = storage.getItem(SHARED_PREF_USER_ID);
    const email = storage.getItem(SHARED_PREF_EMAIL);
    if (userId) {
      store.userId = userId;
    } else if (email) {
      store.email = email;
    }
    return store;
  }
}

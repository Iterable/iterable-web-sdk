import { SHARED_PREF_EMAIL, SHARED_PREF_USER_ID } from '../constants';

export default class {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static checkEmailValidation(email: string): boolean {
    return this.emailRegex.test(email);
  }

  public static addEmailOrUserIdToJson(
    jsonParams: any,
    localStorage: Storage
  ): any {
    const store = jsonParams;
    const userId = localStorage.getItem(SHARED_PREF_USER_ID);
    const email = localStorage.getItem(SHARED_PREF_EMAIL);
    if (userId) {
      store.userId = userId;
    } else if (email) {
      store.email = email;
    }
    return store;
  }
}

import { SHARED_PREF_EMAIL, SHARED_PREF_USER_ID } from 'src/constants';

export class functions {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static checkEmailValidation(email: string): boolean {
    return functions.emailRegex.test(email);
  }

  public static addEmailOrUserIdToJson(
    jsonParams: any,
    localStorage: Storage
  ): any {
    const userId = localStorage.getItem(SHARED_PREF_USER_ID);
    const email = localStorage.getItem(SHARED_PREF_EMAIL);
    if (userId) {
      jsonParams.userId = userId;
    } else if (email) {
      jsonParams.email = email;
    }
    return jsonParams;
  }
}

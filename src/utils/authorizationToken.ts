import { SHARED_PREF_USER_TOKEN } from '../constants';
import { safeLocalStorage } from './localStorage';

class AuthorizationToken {
  public token: string | null = null;

  setToken(token: string) {
    this.token = token;
    safeLocalStorage.setItem(SHARED_PREF_USER_TOKEN, token);
  }

  getToken(): string | null {
    return this.token && this.token.length > 0
      ? this.token
      : safeLocalStorage.getItem(SHARED_PREF_USER_TOKEN);
  }

  clearToken() {
    this.token = null;
    safeLocalStorage.removeItem(SHARED_PREF_USER_TOKEN);
  }
}

export default AuthorizationToken;

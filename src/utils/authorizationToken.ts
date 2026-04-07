import { SHARED_PREF_USER_TOKEN } from '../constants';
import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';

class AuthorizationToken {
  public token: string | null = null;

  setToken(token: string) {
    this.token = token;
    safeSetItem(SHARED_PREF_USER_TOKEN, token);
  }

  getToken(): string | null {
    return this.token && this.token.length > 0
      ? this.token
      : safeGetItem(SHARED_PREF_USER_TOKEN);
  }

  clearToken() {
    this.token = null;
    safeRemoveItem(SHARED_PREF_USER_TOKEN);
  }
}

export default AuthorizationToken;

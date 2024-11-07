import { SHARED_PREF_USER_TOKEN } from '../constants';

class AuthorizationToken {
  public token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(SHARED_PREF_USER_TOKEN, token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem(SHARED_PREF_USER_TOKEN);
  }

  clearToken() {
    this.token = '';
    localStorage.removeItem(SHARED_PREF_USER_TOKEN);
  }
}

export default AuthorizationToken;

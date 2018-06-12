import cookie from 'cookie';
import config from '../../config';

export default class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login(username, password) {
    fetch(`${config.API_URL}/management/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setSession(res);
      })
      .catch(err => {
        return err;
      });
  }

  setSession(authResult) {
    const maxAge = 1 * 24 * 60 * 60; // 1 day long;
    document.cookie = cookie.serialize('auth', authResult, { maxAge });
    document.cookie = cookie.serialize('expires_at', authResult, { maxAge });
  }

  logout() {
    document.cookie = cookie.serialize('auth', '', { maxAge: -1 });
    document.cookie = cookie.serialize('expires_at', '', { maxAge: -1 });
  }

  isAuthenticated() {
    let expiresAt = cookie.parse(document.cookie).expires_at || '';
    return new Date().getTime() < expiresAt;
  }
}

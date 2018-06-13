import cookie from 'cookie';

export class Session {
  set(authResult) {
    const maxAge = 1 * 24 * 60 * 60; // 1 day long;
    document.cookie = cookie.serialize('auth', authResult, { maxAge });
    document.cookie = cookie.serialize('expires_at', authResult, { maxAge });
  }

  destroy() {
    document.cookie = cookie.serialize('auth', '', { maxAge: -1 });
    document.cookie = cookie.serialize('expires_at', '', { maxAge: -1 });
  }

  isLoggedIn() {
    let expiresAt = cookie.parse(document.cookie).expires_at || '';
    return new Date().getTime() < expiresAt;
  }
}

export default new Session();

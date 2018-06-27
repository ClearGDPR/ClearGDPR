export class Session {
  set(authResult) {
    localStorage.setItem('auth', JSON.stringify(authResult));
  }

  destroy() {
    localStorage.removeItem('auth');
  }

  get _auth() {
    return JSON.parse(localStorage.getItem('auth') || 'null');
  }

  getToken() {
    return this._auth ? this._auth.jwt : null;
  }

  getUsername() {
    return this._auth ? this._auth.username : null;
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

export default new Session();

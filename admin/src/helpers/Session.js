export class Session {
  set(authResult) {
    localStorage.setItem('auth', JSON.stringify(authResult));
  }

  destroy() {
    localStorage.removeItem('auth');
  }

  getToken() {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    return auth ? auth.jwt : null;
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

export default new Session();

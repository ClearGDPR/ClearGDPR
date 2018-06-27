import session from './Session';

beforeEach(() => {
  global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
  };
});

describe('Session', () => {
  describe('set should', () => {
    it('update local storage', async () => {
      session.set({ test: 'some data' });
      expect(global.localStorage.setItem).toHaveBeenLastCalledWith(
        'auth',
        JSON.stringify({ test: 'some data' })
      );
    });
  });

  describe('get username should', () => {
    it('return username when it is set', async () => {
      global.localStorage.getItem.mockReturnValue(
        JSON.stringify({
          username: 'test username'
        })
      );

      expect(session.getUsername()).toEqual('test username');
    });

    it('return null when auth data is not set', async () => {
      expect(session.getUsername()).toEqual(null);
    });

    it('return null when username is not set in auth data', async () => {
      global.localStorage.getItem.mockReturnValue(
        JSON.stringify({
          username: undefined
        })
      );

      expect(session.getUsername()).toEqual(null);
    });
  });

  describe('get token should', () => {
    it('return username when it is set', async () => {
      global.localStorage.getItem.mockReturnValue(
        JSON.stringify({
          jwt: 'test token'
        })
      );

      expect(session.getToken()).toEqual('test token');
    });

    it('return null when auth data is not set', async () => {
      expect(session.getUsername()).toEqual(null);
    });

    it('return null when jwt is not set in auth data', async () => {
      global.localStorage.getItem.mockReturnValue(
        JSON.stringify({
          jwt: undefined
        })
      );

      expect(session.getUsername()).toEqual(null);
    });
  });

  describe('destroy should', () => {
    it('remove auth from local storage', async () => {
      session.destroy();
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('auth');
    });
  });

  describe('is logged in should', () => {
    it('return false if token does not exist', async () => {
      expect(session.isLoggedIn()).toBe(false);
    });

    it('return true if token exists', async () => {
      global.localStorage.getItem.mockReturnValue(
        JSON.stringify({
          jwt: 'test token'
        })
      );

      expect(session.isLoggedIn()).toBe(true);
    });
  });
});

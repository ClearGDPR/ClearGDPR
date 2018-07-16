import internalFetch from 'helpers/internal-fetch';
import { toast } from 'react-toastify';
import session from 'helpers/Session';

describe('internal fetch', () => {
  it('Respond with the request body if the token is not expired', async () => {
    session.getToken = jest.fn().mockImplementationOnce(() => 'token');
    global.fetch = jest.fn().mockImplementationOnce((_, options) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => {
          return { test: 'test' };
        }
      });
    });

    const res = await internalFetch('');
    expect(res).toEqual({ test: 'test' });
  });

  it('Should redirect and destroy the session if JWT is expired', async () => {
    session.getToken = jest.fn().mockImplementationOnce(() => 'token');
    session.destroy = jest.fn().mockImplementationOnce(() => {});
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 400,
        json: async () => {
          return { error: 'JWT token expired' };
        }
      })
    );
    global.window.location.assign = jest.fn().mockImplementationOnce(() => '');
    await internalFetch();
    expect(session.destroy).toBeCalled();
    expect(global.window.location.assign).toBeCalledWith('/login?expired=1');
  });

  it('Default to including authorization header', async done => {
    expect.assertions(1);
    session.getToken = jest.fn().mockImplementationOnce(() => 'token');
    global.fetch = jest.fn().mockImplementationOnce((_, options) => {
      expect(options.headers.Authorization).toEqual('Bearer token');
      done();
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => {
          return {};
        }
      });
    });

    internalFetch();
  });

  it('Handles network errors gracefully and toasts', async () => {
    expect.assertions(2);
    session.getToken = jest.fn().mockImplementationOnce(() => 'token');
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(new Error('none')));
    toast.error = jest.fn();
    try {
      await internalFetch();
    } catch (e) {
      expect(e).toBeTruthy();
    }

    expect(toast.error).toHaveBeenCalledWith('none');
  });

  it('Handles all errors gracefully and toasts', async () => {
    expect.assertions(2);
    session.getToken = jest.fn().mockImplementationOnce(() => 'token');
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 400,
        json: async () => {
          return { error: 'Some other error than JWT' };
        }
      })
    );

    toast.error = jest.fn();
    await expect(internalFetch()).rejects.toEqual(
      expect.objectContaining({
        message: 'Some other error than JWT'
      })
    );
    expect(toast.error).toHaveBeenCalledWith('Some other error than JWT');
  });
});

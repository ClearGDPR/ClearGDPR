const { db } = require('../src/db');
const { initResources, fetch, closeRources } = require('./utils');
const { BadRequest, Unauthorized } = require('../src/utils/errors');

beforeAll(initResources);
afterAll(closeRources);

describe('Login', () => {
  it('should not allow logins without a username or password', async () => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      body: {}
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'Attempt to login without username or password'
      })
    );
  });

  it('should not allow login of unregistered users', async () => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      body: {
        username: 'anotherUser1111@test.com',
        password: 'anotherUser1111_password'
      }
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'User not registered'
      })
    );
  });
});

describe('Register', () => {
  it('should not allow registrations without an username or password', async () => {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      body: {}
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'Cannot register without an username or password'
      })
    );
  });

  it('should not allow the registration of already registered users', async () => {
    await db('users').insert({
      username: 'user1234@test.com',
      password: 'user1234_password'
    });

    const res = await fetch('/api/users/register', {
      method: 'POST',
      body: {
        username: 'user1234@test.com',
        password: 'user1234_password'
      }
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(BadRequest.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'User already registered'
      })
    );
  });
});

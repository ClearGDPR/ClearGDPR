const { db } = require('../src/db');
const { initResources, fetch, closeResources } = require('./utils');
const { BadRequest, Unauthorized } = require('../src/utils/errors');

beforeAll(initResources);
afterAll(closeResources);

describe('Login', () => {
  it('should allow login ', async () => {
    await fetch('/api/users/register', {
      method: 'POST',
      body: {
        username: 'validuser1@test.com',
        password: 'password'
      }
    });

    const res = await fetch('/api/users/login', {
      method: 'POST',
      body: {
        username: 'validuser1@test.com',
        password: 'password'
      }
    });

    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect((await res.json()).apiToken).toBeTruthy();
  });
  
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
        error: 'Invalid Credentials'
      })
    );
  });


  it('should not allow login with an incorrect password', async () => {

    await fetch('/api/users/register', {
      method: 'POST',
      body: {
        username: 'incorrectpassword@test.com',
        password: 'incorrectpassword'
      }
    });

    const res = await fetch('/api/users/login', {
      method: 'POST',
      body: {
        username: 'incorrectpassword@test.com',
        password: 'wrongpassword'
      }
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(Unauthorized.StatusCode);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        error: 'Invalid Credentials'
      })
    );
  });
});

describe('Register', () => {
  it('Should allow registration', async () => {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      body: {
        username: 'gooduser@test.com',
        password: 'password',
      }
    });
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect((await res.json()).apiToken).toBeTruthy();

  })
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
    await fetch('/api/users/register', {
      method: 'POST',
      body: {
        username: 'user1234@test.com',
        password: 'user1234_password'
      }
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

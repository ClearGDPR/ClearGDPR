const { initResources, fetch, closeResources } = require('../utils');
const { managementJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
// const { Unauthorized, BadRequest, NotFound } = require('../../src/utils/errors');
// const blockchain = require('../../src/utils/blockchain');

let managementUsersJWT;
beforeAll(async () => {
  await initResources();
  managementUsersJWT = await managementJWT.sign({ id: 1 });
});

afterAll(closeResources);

describe('User Registration', () => {
  it('Should fail if no username/password is provided', async () => {
    const res = await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {}
    });
    expect(res.status).toEqual(400);
  });

  it('Should allow a user to register', async () => {
    const res = await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {
        username: 'test900',
        password: 'password'
      }
    });
    expect(res.status).toEqual(200);
    const [user] = await db('users').where({ username: 'test900' });
    expect(user).toBeTruthy();
  });
});

describe('User Login', () => {
  it('Return unauthorized for invalid usernames', async () => {
    const res = await fetch('/api/management/users/login', {
      method: 'POST',
      body: {
        username: 'baduser',
        password: 'badpasswword'
      }
    });
    expect(res.status).toEqual(401);
  });

  it('Return unauthorized for invalid passwords', async () => {
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {
        username: 'test905',
        password: 'somepassword...'
      }
    });

    const res = await fetch('/api/management/users/login', {
      method: 'POST',
      body: {
        username: 'test905',
        password: 'wrongpassword'
      }
    });
    expect(res.status).toEqual(401);
  });

  it('Should allow a user to login', async () => {
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {
        username: 'test901',
        password: 'password'
      }
    });

    const res = await fetch('/api/management/users/login', {
      method: 'POST',
      body: {
        username: 'test901',
        password: 'password'
      }
    });

    const [user] = await db('users').where({ username: 'test901' });

    const jwt = await managementJWT.sign(Object.assign({}, { id: user.id }));

    expect(res.status).toEqual(200);
    expect((await res.json()).jwt).toEqual(jwt);
  });
});

describe('User password update', () => {
  it('Should fail if the user id in the route doesnt exist', async () => {
    const res = await fetch(`/api/management/users/3923219/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {
        password: 'password2'
      }
    });
    expect(res.status).toEqual(400);
  });
  it('Should fail if no password is provided', async () => {
    const res = await fetch(`/api/management/users/1/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {}
    });
    expect(res.status).toEqual(400);
  });
  it('Should allow a users password to be updated', async () => {
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {
        username: 'test902',
        password: 'password'
      }
    });

    const [user] = await db('users').where({ username: 'test902' });

    const res = await fetch(`/api/management/users/${user.id}/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {
        password: 'password2'
      }
    });

    expect(res.status).toEqual(200);

    const [user2] = await db('users').where({ username: 'test902' });

    expect(user2.password_hash).not.toEqual(user.password_hash);

    const res2 = await fetch('/api/management/users/login', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementUsersJWT}` },
      body: {
        username: 'test902',
        password: 'password2'
      }
    });

    expect(res2.status).toEqual(200);
    expect((await res2.json()).jwt).toBeTruthy();
  });
});

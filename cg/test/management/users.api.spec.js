const { initResources, fetch, closeResources } = require('../utils');
const { managementJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
// const { Unauthorized, BadRequest, NotFound } = require('../../src/utils/errors');
// const blockchain = require('../../src/utils/blockchain');

let managementToken;
beforeAll(async () => {
  await initResources();
  managementToken = await managementJWT.sign({ id: 1 });
});
afterAll(closeResources);

describe('Management user Registration', () => {
  it('Should fail if no username/password is provided', async () => {
    const res = await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {}
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(400);
  });

  it('Should allow a manager to register', async () => {
    const res = await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'test900',
        password: 'password'
      }
    });
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);
    const [user] = await db('users').where({ username: 'test900' });
    expect(user).toBeTruthy();
  });
});

describe('Management user Login', () => {
  it('Return unauthorized for invalid usernames', async () => {
    const res = await fetch('/api/management/users/login', {
      method: 'POST',
      body: {
        username: 'baduser',
        password: 'badpasswword'
      }
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(401);
  });

  it('Return unauthorized for invalid passwords', async () => {
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
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
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(401);
  });

  it('Should allow a manager to login', async () => {
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
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
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);
    expect((await res.json()).jwt).toEqual(jwt);
  });
});

describe('Management user password update', () => {
  it('Should fail if the manager id in the route doesnt exist', async () => {
    const res = await fetch(`/api/management/users/3923219/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        password: 'password2'
      }
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(400);
  });
  it('Should fail if no password is provided', async () => {
    const res = await fetch(`/api/management/users/1/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {}
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(400);
  });
  it('Should allow a managers password to be updated', async () => {
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'test902',
        password: 'password'
      }
    });
    const [user] = await db('users').where({ username: 'test902' });
    const res = await fetch(`/api/management/users/${user.id}/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        password: 'password2'
      }
    });
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);

    const [user2] = await db('users').where({ username: 'test902' });

    expect(user2.password_hash).not.toEqual(user.password_hash);

    const res2 = await fetch('/api/management/users/login', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'test902',
        password: 'password2'
      }
    });
    expect(res2.ok).toBeTruthy();
    expect(res2.status).toEqual(200);
    expect((await res2.json()).jwt).toBeTruthy();
  });
});

describe('Listing management users', () => {
  it('Should display an empty list when no manager is registered', async () => {
    //Given
    await db('users').del(); // It's fine to delete the contents of the managers table because no other table references it

    //When
    const res = await fetch('/api/management/users/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it('Should display correctly the registered managers', async () => {
    //Given
    await db('users').del(); // It's fine to delete the contents of the managers table because no other table references it
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'manager1',
        password: 'manager1_password'
      }
    });
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'manager2',
        password: 'manager2_password'
      }
    });

    //When
    const res = await fetch('/api/management/users/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number), // Since other tests insert managers in the DB, this ID is random
          username: 'manager1'
        }),
        expect.objectContaining({
          id: expect.any(Number),
          username: 'manager2'
        })
      ])
    );
  });
});

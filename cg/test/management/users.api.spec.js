const { initResources, fetch, closeResources } = require('../utils');
const { managementJWT } = require('../../src/utils/jwt');
const { db } = require('../../src/db');
const { Unauthorized, BadRequest, NotFound } = require('../../src/utils/errors');
// const blockchain = require('../../src/utils/blockchain');

let managementToken;
beforeAll(async () => {
  await initResources();
  managementToken = await managementJWT.sign({ id: 1 });
});
beforeEach(async () => {
  await db('users').del();
});
afterAll(closeResources);

describe('Management user Registration', () => {
  it('Should fail if no username/password is provided', async () => {
    // When
    const res = await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {}
    });

    // Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should not allow the registration of an already registered manager', async () => {
    // Given
    const manager = {
      username: 'manager',
      password: 'manager_password'
    };
    const res1 = await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: manager
    });

    // When
    const res2 = await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        manager
      }
    });

    // Then
    expect(res1.ok).toBeTruthy();
    expect(res1.status).toEqual(200);
    expect(await res1.json()).toMatchSnapshot();
    expect(res2.ok).toBeFalsy();
    expect(res2.status).toEqual(BadRequest.StatusCode);
    expect(await res2.json()).toMatchSnapshot();
  });

  it('Should allow a manager to register', async () => {
    //When
    const res = await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'manager',
        password: 'manager_password'
      }
    });

    //Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);
    const [user] = await db('users').where({ username: 'manager' });
    expect(user).toBeTruthy();
  });
});

describe('Management user removal', () => {
  it('Should not allow the removal of unregistered managers', async () => {
    //When
    const res = await fetch('/api/management/users/999/remove', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(NotFound.StatusCode);
    expect(await res.json()).toEqual({
      error: 'User not found'
    });
  });

  it('Should not allow the removal with an ID thats not a positive integer', async () => {
    //When
    const res = await fetch('/api/management/users/string/remove', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should allow the removal of a registered manager', async () => {
    //Given
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'manager',
        password: 'manager_password'
      }
    });

    const res1 = await fetch('/api/management/users/list', {
      method: 'GET',
      headers: { Authorization: `Bearer ${managementToken}` }
    });
    const [{ id }] = await res1.json();

    //When
    const res2 = await fetch(`/api/management/users/${id}/remove`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${managementToken}`
      }
    });

    //Then
    expect(res2.ok).toBeTruthy();
    expect(res2.status).toEqual(200);
    expect(await res2.json()).toEqual({
      success: true
    });
  });
});

describe('Management user Login', () => {
  it('Return unauthorized for unregistered usernames', async () => {
    //When
    const res = await fetch('/api/management/users/login', {
      method: 'POST',
      body: {
        username: 'baduser',
        password: 'badpassword'
      }
    });

    //Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(Unauthorized.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Return unauthorized for wrong passwords', async () => {
    //Given
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'manager',
        password: 'somepassword'
      }
    });

    //When
    const res = await fetch('/api/management/users/login', {
      method: 'POST',
      body: {
        username: 'manager',
        password: 'wrongpassword'
      }
    });

    //Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(Unauthorized.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should not allow the login of an unregistered manager', async () => {
    //When
    const res = await fetch('/api/management/users/login', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'unregistered_manager',
        password: 'unregistered_password'
      }
    });

    //Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(Unauthorized.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should allow a manager to login', async () => {
    //Given
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'manager',
        password: 'manager_password'
      }
    });

    //When
    const res = await fetch('/api/management/users/login', {
      method: 'POST',
      body: {
        username: 'manager',
        password: 'manager_password'
      }
    });

    const [user] = await db('users').where({ username: 'manager' });
    const jwt = await managementJWT.sign(Object.assign({}, { id: user.id }));

    //Then
    expect(res.ok).toBeTruthy();
    expect(res.status).toEqual(200);
    expect((await res.json()).jwt).toEqual(jwt);
  });
});

describe('Management user password update', () => {
  it('Should fail if the manager id in the route doesnt exist', async () => {
    //When
    const res = await fetch(`/api/management/users/3923219/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        password: 'password2'
      }
    });

    //Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should fail if no password is provided', async () => {
    //When
    const res = await fetch(`/api/management/users/1/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {}
    });

    //Then
    expect(res.ok).toBeFalsy();
    expect(res.status).toEqual(BadRequest.StatusCode);
    expect(await res.json()).toMatchSnapshot();
  });

  it('Should allow a managers password to be updated', async () => {
    //Given
    await fetch('/api/management/users/register', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'manager',
        password: 'manager_password'
      }
    });

    //When
    const [user] = await db('users').where({ username: 'manager' });
    const res1 = await fetch(`/api/management/users/${user.id}/update-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        password: 'manager_password2'
      }
    });

    const res2 = await fetch('/api/management/users/login', {
      method: 'POST',
      headers: { Authorization: `Bearer ${managementToken}` },
      body: {
        username: 'manager',
        password: 'manager_password2'
      }
    });

    //Then
    expect(res1.status).toEqual(200);
    const [user2] = await db('users').where({ username: 'manager' });
    expect(user2.password_hash).not.toEqual(user.password_hash);
    expect(res2.ok).toBeTruthy();
    expect(res2.status).toEqual(200);
    expect((await res2.json()).jwt).toBeTruthy();
  });
});

describe('Listing management users', () => {
  it('Should display an empty list when no manager is registered', async () => {
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

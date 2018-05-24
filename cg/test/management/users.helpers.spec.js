const { initResources } = require('../utils');
const { db } = require('../../src/db');
const {
  ensureInitialManagementUser
} = require('./../../src/domains/management/users/users.helpers');
const UsersService = require('./../../src/domains/management/users/users.service');

const usersService = new UsersService();

beforeAll(async () => {
  await initResources();
});

describe('Initial management user check', () => {
  it('Should not attempt to create the initial user if it already exists', async () => {
    await usersService.createNewUser('admin', 'password');
    const created = await ensureInitialManagementUser();
    expect(created).toEqual(false);
  });

  it('Should create an initial management user if it doesnt exist', async () => {
    await db('users')
      .delete()
      .where({ username: 'admin' });
    const created = await ensureInitialManagementUser();
    expect(created).toEqual(true);
    const [user] = await db('users')
      .where({ username: 'admin' })
      .limit(1);
    expect(user).toBeTruthy();
  });
});

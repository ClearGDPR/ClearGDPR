const UsersService = require('./users.service');

const usersService = new UsersService();

const initialUsername = 'admin';
const initialPassword = 'clearGDPR';

async function ensureInitialManagementUser() {
  // not sure if the initial user creds should be hardcoded or env variables... both feel bad
  const user = await usersService.getUserByUsername('admin');
  if (user) return false;
  await usersService.createNewUser(initialUsername, initialPassword);
  return true;
}

module.exports = {
  ensureInitialManagementUser
};

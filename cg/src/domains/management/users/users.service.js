const bcryptjs = require('bcryptjs');
const { db } = require('../../../db');
const { BadRequest, Unauthorized, NotFound } = require('../../../utils/errors');

class UsersService {
  constructor(database = db) {
    this.db = database;
  }

  _hashPassword(password) {
    return bcryptjs.hash(password, parseInt(process.env.BCRYPT_ROUNDS, 10));
  }
  _comparePassword(password, validate) {
    return bcryptjs.compare(password, validate);
  }

  async getUserByUsername(username) {
    const [user] = await this.db('users')
      .where({ username })
      .limit(1);
    return user;
  }

  async getUserById(userId) {
    const [user] = await this.db('users')
      .where({ id: userId })
      .limit(1);
    return user;
  }

  async createNewUser(username, password) {
    const passwordHash = await this._hashPassword(password);
    const user = await this.getUserByUsername(username);
    if (user) throw new BadRequest('User already exists');
    await this.db('users').insert({ username, password_hash: passwordHash });
  }

  async removeUser(userId) {
    const user = await this.getUserById(userId);
    if (!user) throw new NotFound('User not found');
    await this.db('users')
      .where({ id: userId })
      .del();
  }

  async verifyUser(username, password) {
    const user = await this.getUserByUsername(username);
    if (!user) throw new Unauthorized('Invalid credentials');
    const passwordCheck = await this._comparePassword(password, user.password_hash);
    if (!passwordCheck) throw new Unauthorized('Invalid credentials');
    return { id: user.id };
  }

  async updatePassword(userId, newPassword) {
    const [user] = await this.db('users').where({ id: userId });
    if (!user) throw new NotFound('User not found');
    await this.db('users')
      .update({ password_hash: await this._hashPassword(newPassword) })
      .where({ id: userId });

    return true;
  }

  async listUsers() {
    const managementUsers = await this.db('users').select('id', 'username');
    return managementUsers;
  }
}

module.exports = UsersService;

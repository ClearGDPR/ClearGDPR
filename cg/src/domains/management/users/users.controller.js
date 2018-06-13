const { managementJWT } = require('./../../../utils/jwt');
const UsersService = require('./users.service');
const { BadRequest } = require('../../../utils/errors');

class UsersController {
  constructor() {
    this.usersService = this.usersService || new UsersService();
  }

  async register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new BadRequest('Cannot register without an username or password');
    }
    await this.usersService.createNewUser(username, password);
    res.json({ success: true });
  }

  async login(req, res) {
    const { username, password } = req.body;
    const user = await this.usersService.verifyUser(username, password);
    const token = await managementJWT.sign(user);
    return res.json({ jwt: token });
  }

  async updatePassword(req, res) {
    const { userId } = req.params;
    const { password } = req.body;
    if (!password) throw new BadRequest('No password provided');
    await this.usersService.updatePassword(userId, password);
    return res.json({ success: true });
  }

  async listUsers(req, res) {
    const managersList = await this.usersService.listUsers();
    return res.json(managersList);
  }
}

module.exports = UsersController;

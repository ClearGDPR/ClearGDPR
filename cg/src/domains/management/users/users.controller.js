const { managementJWT } = require('./../../../utils/jwt');
const UserService = require('./users.service');
const { BadRequest } = require('../../../utils/errors');

class UserController {
  constructor() {
    this.userService = this.userService || new UserService();
  }

  async register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new BadRequest('Cannot register without an username or password');
    }
    await this.userService.createNewUser(username, password);
    res.json({ success: true });
  }

  async login(req, res) {
    const { username, password } = req.body;
    const user = await this.userService.verifyUser(username, password);
    const token = await managementJWT.sign(user);
    return res.json({ jwt: token });
  }

  async updatePassword(req, res) {
    const { userId } = req.params;
    const { password } = req.body;
    if (!password) throw new BadRequest('No password provided');
    await this.userService.updatePassword(userId, password);
    return res.json({ success: true });
  }

  async listManagementUsers(req, res) {
    const managersList = await this.userService.listManagementUsers();
    return res.json(managersList);
  }
}

module.exports = UserController;

const { managementJWT } = require('./../../../utils/jwt');
const UsersService = require('./users.service');

class UsersController {
  constructor() {
    this.usersService = this.usersService || new UsersService();
  }

  async register(req, res) {
    const { username, password } = req.body;
    const result = await this.usersService.createNewUser(username, password);
    res.status(201).json(result);
  }

  async remove(req, res) {
    const { userId } = req.params;
    await this.usersService.removeUser(userId);
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
    await this.usersService.updatePassword(userId, password);
    return res.json({ success: true });
  }

  async listUsers(req, res) {
    const managersList = await this.usersService.listUsers();
    return res.json(managersList);
  }
}

module.exports = UsersController;

const DataService = require('./data.service');

class DataController {
  constructor(dataService = null) {
    this.service = dataService || new DataService();
  }

  async getAttributesConfig(req, res) {
    let config = await this.service.getAttributesConfig();
    res.json(config);
  }

  async updateAttributesConfig(req, res) {
    await this.service.updateAttributesConfig(req.body);
    res.status(204);
    return res.send();
  }
}

module.exports = DataController;

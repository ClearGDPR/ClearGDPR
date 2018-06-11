const DataShareService = require('./data-shares.service');

class DataShareController {
  constructor(dataShareService = null) {
    this.service = dataShareService || new DataShareService();
  }

  async getDataShares(req, res) {
    res.json(await this.service.getDataShares(req.subject.id));
  }

  async createDataShare(req, res) {
    await this.service.createDataShare(req.subject.id, req.body.name);
    res.json({ success: true });
  }

  async removeDataShare(req, res) {
    await this.service.removeDataShare(req.params.dataShareId);
    return res.json({ success: true });
  }
}

module.exports = DataShareController;

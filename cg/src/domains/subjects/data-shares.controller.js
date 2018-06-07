const DataShareService = require('./data-share.service');

class DataShareController {
  constructor(processorsService = null) {
    this.service = processorsService || new DataShareService();
  }

  async getDataShares(req, res) {
    res.json(await this.service.getDataShares(req.subject.id));
  }

  async createDataShare(req, res) {
    await this.service.createDataShare(req.body.name);
    res.json({ success: true });
  }

  async removeDataShare(req, res) {
    await this.service.removeDataShare(req.params.dataShareId);
    return res.json({ success: true });
  }
}

module.exports = DataShareController;

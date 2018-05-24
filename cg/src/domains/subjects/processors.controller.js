const ProcessorsService = require('./processors.service');

class ProcessorsController {
  constructor(processorsService = null) {
    this.service = processorsService || new ProcessorsService();
  }

  async getProcessors(req, res) {
    res.json(await this.service.getProcessors());
  }
}

module.exports = ProcessorsController;

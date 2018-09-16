const ProcessorsService = require('./processors.service');

class ProcessorsController {
  constructor(processorsService = null) {
    this.processorsService = processorsService || new ProcessorsService();
  }

  async listProcessors(req, res) {
    res.json(await this.processorsService.listProcessors());
  }

  async addProcessor(req, res) {
    const processorRaftId = await this.processorsService.addProcessor(req.body);
    res.json(processorRaftId);
  }

  async updateProcessor(req, res) {
    await this.processorsService.updateProcessor(req.body);
    res.send({ success: true });
  }

  async removeProcessors(req, res) {
    await this.processorsService.removeProcessors(req.body.processorIds);
    res.send({ success: true });
  }

  // TEST FUNCTIONS USED FOR DEMOS AND DEVELOPMENT

  async testAddProcessor(req, res) {
    await this.processorsService.testAddProcessor(req.body);
    res.json({ success: true });
  }

  async testRemoveProcessors(req, res) {
    await this.processorsService.testRemoveProcessors(req.body.processorIds);
    res.send({ success: true });
  }
}

module.exports = ProcessorsController;

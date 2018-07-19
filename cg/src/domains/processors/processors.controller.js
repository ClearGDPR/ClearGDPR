const ProcessorsService = require('./processors.service');
const ContractService = require('./contract.service');
const { NotFound } = require('../../utils/errors');

class ProcessorsController {
  constructor(processorsService = null, contractService = null) {
    this.processorsService = processorsService || new ProcessorsService();
    this.contractService = contractService || new ContractService();
  }

  async getSubjectData(req, res) {
    const subjectId = req.params.subjectId;
    const subjectData = await this.processorsService.getSubjectData(subjectId);
    return res.json(subjectData);
  }

  async getContractDetails(req, res) {
    const result = await this.contractService.getContractDetails();
    if (!result) {
      throw new NotFound('No contract deployed');
    }
    return res.json(result);
  }
}

module.exports = ProcessorsController;

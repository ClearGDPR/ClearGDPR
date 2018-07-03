const SubjectsService = require('./../subjects/subjects.service');
const ContractService = require('./../management/contract/contract.service');
const { NotFound } = require('../../utils/errors');

// TODO: maybe we don't want to reach into the subjects / management domain?

class ProcessorsController {
  constructor(subjectsService = null, contractService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
    this.contractService = contractService || new ContractService();
  }

  async getData(req, res) {
    const subjectId = req.params.subjectId;
    const subjectData = await this.subjectsService.getData(subjectId);
    console.log(subjectData);
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

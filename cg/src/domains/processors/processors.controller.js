const SubjectsService = require('./subjects.service');
const ContractService = require('./contract.service');
const { NotFound } = require('../../utils/errors');

class ProcessorsController {
  constructor(subjectsService = null, contractService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
    this.contractService = contractService || new ContractService();
  }

  async getContractDetails(req, res) {
    const result = await this.contractService.getContractDetails();
    if (!result) throw new NotFound('No contract deployed');
    res.json(result);
  }

  async getSubjectData(req, res) {
    const subjectId = req.params.subjectId;
    const subjectData = await this.subjectsService.getSubjectData(subjectId);
    res.json(subjectData);
  }

  async getSubjectRestrictions(req, res) {
    const subjectId = req.params.subjectId;
    const subjectRestrictions = await this.subjectsService.getSubjectRestrictions(subjectId);
    res.json(subjectRestrictions);
  }

  async getSubjectObjection(req, res) {
    const subjectId = req.params.subjectId;
    const subjectObjection = await this.subjectsService.getSubjectObjection(subjectId);
    res.json(subjectObjection);
  }

  async getSubjects(req, res) {
    const response = await this.subjectsService.listSubjects(req.processor.id, req.query.page);
    res.json(response);
  }
}

module.exports = ProcessorsController;

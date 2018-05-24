const SubjectsService = require('./subjects.service');

class SubjectsController {
  constructor(subjectsService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
  }

  async giveConsent(req, res) {
    await this.subjectsService.registerConsentToProcessData(
      req.subject.id,
      req.body.personalData,
      req.body.processors || []
    );

    res.send('OK');
  }

  async requestDataAccess(req, res) {
    const subjectData = await this.subjectsService.getData(req.subject.id);
    return res.json(subjectData);
  }

  async eraseData(req, res) {
    await this.subjectsService.eraseDataAndRevokeConsent(req.subject.id);
    res.send('OK');
  }

  async getPersonalDataStatus(req, res) {
    res.json(await this.subjectsService.getPerProcessorDataStatus(req.subject.id));
  }
}

module.exports = SubjectsController;

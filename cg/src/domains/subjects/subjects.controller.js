const SubjectsService = require('./subjects.service');
const { pick } = require('underscore');

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
    res.json({ success: true });
  }

  async updateConsent(req, res) {
    await this.subjectsService.updateConsent(
      req.subject.id,
      req.body.processors || []
    );
    res.json({ success: true });
  }

  async requestDataAccess(req, res) {
    const subjectData = await this.subjectsService.getData(req.subject.id);
    return res.json(subjectData);
  }

  async eraseData(req, res) {
    await this.subjectsService.eraseDataAndRevokeConsent(req.subject.id);
    res.json({ success: true });
  }

  async getPersonalDataStatus(req, res) {
    res.json(await this.subjectsService.getPerProcessorDataStatus(req.subject.id));
  }

  async initiateRectification(req, res) {
    res.json(
      await this.subjectsService.initiateRectification(
        req.subject.id,
        pick(req.body, ['rectificationPayload', 'requestReason'])
      )
    );
  }

  async restrict(req, res) {
    await this.subjectsService.restrict(
      req.subject.id, 
      req.body.directMarketing,
      req.body.emailCommunication,
      req.body.research
    );
    res.json({ success: true });
  }

  async getRestrictions(req, res) {
    const subjectRestrictions = await this.subjectsService.getRestrictions(req.subject.id);
    res.json(subjectRestrictions);
  }

}

module.exports = SubjectsController;

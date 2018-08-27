const SubjectsService = require('./subjects.service');
const _ = require('underscore');

function coverString(string) {
  const firstCharacter = string[0];
  const lastCharacter = string[string.length - 1];
  const fullyCoveredArray = new Array(string.length).fill('*');
  fullyCoveredArray[0] = firstCharacter;
  fullyCoveredArray[string.length - 1] = lastCharacter;
  const partiallyCoveredString = fullyCoveredArray.join('');
  return partiallyCoveredString;
}

class SubjectsController {
  constructor(subjectsService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
  }

  async listSubjects(req, res) {
    const { paging, data } = await this.subjectsService.listSubjects(req.query.page);
    const coveredData = data.map(subject => {
      // Covers the subjects data with '*'s
      const subjectData = _.mapObject(subject.data, value => {
        return coverString(value);
      });
      return Object.assign({}, subject, { data: subjectData });
    });
    return res.json({ data: coveredData, paging });
  }

  async listRectificationRequests(req, res) {
    const rectificationRequests = await this.subjectsService.listRectificationRequests(
      req.query.page
    );

    return res.json(rectificationRequests);
  }

  async listProcessedRectificationRequests(req, res) {
    const rectificationRequests = await this.subjectsService.listProcessedRectificationRequests(
      req.query.page
    );

    return res.json(rectificationRequests);
  }

  async getRectificationRequest(req, res) {
    return res.json(
      await this.subjectsService.getRectificationRequest(req.params.rectificationRequestId)
    );
  }

  async updateRectificationRequestStatus(req, res) {
    return res.json(
      await this.subjectsService.updateRectificationRequestStatus(
        req.params.rectificationRequestId,
        req.body.status
      )
    );
  }

  async requestDataAccess(req, res) {
    const subjectData = await this.subjectsService.getData(req.params.subjectId);
    return res.json(subjectData);
  }
}

module.exports = SubjectsController;

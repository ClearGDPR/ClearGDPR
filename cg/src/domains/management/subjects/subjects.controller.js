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
    const subjectsInfo = await this.subjectsService.listSubjects(req.query.page);
    const coveredSubjects = subjectsInfo.subjects.map(subject => {
      // Covers the subjects data with '*'s
      const data = _.mapObject(subject.data, value => {
        return coverString(value);
      });
      return Object.assign({}, subject, { data });
    });
    return res.json({
      requestedPage: subjectsInfo.requestedPage,
      numberOfPages: subjectsInfo.numberOfPages,
      subjects: coveredSubjects
    });
  }

  async listRectificationRequests(req, res) {
    const rectificationRequests = await this.subjectsService.listRectificationRequests(
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
}

module.exports = SubjectsController;

const SubjectsService = require('./subjects.service');
const _ = require('underscore');

function coverString(string) {
  const firstCharacter = string[0];
  const lastCharacter = string[string.length - 1];
  let coveredString = new Array(string.length).fill('*');
  coveredString[0] = firstCharacter;
  coveredString[string.length - 1] = lastCharacter;
  coveredString = coveredString.join('');
  return coveredString;
}

class SubjectsController {
  constructor(subjectsService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
  }

  async listSubjects(req, res) {
    const subjectsPage = await this.subjectsService.listSubjects(req.query.page);
    subjectsPage.map(subject => {
      // Covers the subjects data with '*'s
      _.mapObject(subject, (value, key) => {
        subject[key] = coverString(value);
      });
    });
    return res.json(subjectsPage);
  }
}

module.exports = SubjectsController;

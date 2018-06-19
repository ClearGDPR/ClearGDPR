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
    subjectsInfo.subjects.map(subject => {
      // Covers the subjects data with '*'s
      _.mapObject(subject, (value, key) => {
        subject[key] = coverString(value);
        return subject[key];
      });
    });
    return res.json(subjectsInfo);
  }
}

module.exports = SubjectsController;

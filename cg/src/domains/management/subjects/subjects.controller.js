const SubjectsService = require('./subjects.service');

class SubjectsController {
  constructor(subjectsService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
  }

  async listSubjects(req, res) {
    res.json(await this.subjectsService.listSubjects());
  }
}

module.exports = SubjectsController;

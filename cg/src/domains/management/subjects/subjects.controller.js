const SubjectsService = require('./subjects.service');

class SubjectsController {
  constructor(subjectsService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
  }

  async listSubjects(req, res) {
    const subjectsPage = await this.subjectsService.listSubjects(req.query.page);
    res.json(subjectsPage);
  }
}

module.exports = SubjectsController;

const SubjectsService = require('./subjects.service');

const PAGINATION_COUNT = 2; // HARD CODED CONSTANT

class SubjectsController {
  constructor(subjectsService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
  }

  async listSubjects(req, res) {
    const subjectsList = await this.subjectsService.listSubjects();

    if (req.query.page === undefined) {
      return res.json(subjectsList);
    }

    if (subjectsList.length < PAGINATION_COUNT) {
      return res.json({
        pages: 1,
        subjects: subjectsList
      });
    }

    var pages = [];
    for (var i = 0; i * PAGINATION_COUNT < subjectsList.length; i++) {
      pages[i] = subjectsList.slice(i * PAGINATION_COUNT, (i + 1) * PAGINATION_COUNT);
    }

    if (req.query.page >= i) {
      return res.json({ error: `page number too big, maximum page number is ${i - 1}` });
      // should throw an error here?
    }

    res.json({
      pages: i,
      requestedPage: pages[req.query.page]
    });
  }
}

module.exports = SubjectsController;

const SubjectsService = require('./subjects.service');

const PAGINATION_COUNT = 2; // HARD CODED CONSTANT

class SubjectsController {
  constructor(subjectsService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
  }

  async listSubjects(req, res) {
    const subjectsList = await this.subjectsService.listSubjects();
    var requestedPage = req.query.page;
    var pages = [];

    if (requestedPage === undefined) {
      requestedPage = 1;
    }

    for (var i = 0; i * PAGINATION_COUNT < subjectsList.length; i++) {
      pages[i] = subjectsList.slice(i * PAGINATION_COUNT, (i + 1) * PAGINATION_COUNT);
    }

    if (i == 0) {
      // This block handles the case in which there are no subjects in the db
      if (requestedPage == 1) {
        return res.json({
          pages: 1,
          requestedPage,
          subjects: [] //Empty page
        });
      }
      if (requestedPage != 1) {
        return res.json({ error: `page number too big, maximum page number is 1` });
      }
    }

    if (requestedPage > i) {
      return res.json({ error: `page number too big, maximum page number is ${i}` });
    }

    res.json({
      pages: i,
      requestedPage,
      subjects: pages[requestedPage - 1]
    });
  }
}

module.exports = SubjectsController;

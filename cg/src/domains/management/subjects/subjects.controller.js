const SubjectsService = require('./subjects.service');

const PAGINATION_COUNT = 2;

class SubjectsController {
  constructor(subjectsService = null) {
    this.subjectsService = subjectsService || new SubjectsService();
  }

  async listSubjects(req, res) {
    const subjectsList = await this.subjectsService.listSubjects();

    if (req.query.page) {
      var pages = [];
      if (subjectsList.length < PAGINATION_COUNT) {
        res.json({
          pages: 1,
          subjects: subjectsList
        });
      } else {
        if (req.query.page < 0) {
          res.json({ error: 'page number cannot be negative' });
          // return ...
        }

        for (var i = 0; i * PAGINATION_COUNT < subjectsList.length; i++) {
          pages[i] = subjectsList.slice(i * PAGINATION_COUNT, (i + 1) * PAGINATION_COUNT);
        }

        if (req.query.page > i) {
          res.json({ error: `page number too big, maximum page number is ${i + 1}` });
          // return ...
        }

        res.json({
          pages: i,
          requestedPage: pages[req.query.page]
        });
      }
    } else {
      res.json(subjectsList);
    }
  }
}

module.exports = SubjectsController;

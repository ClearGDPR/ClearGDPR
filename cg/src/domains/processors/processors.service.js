const { db } = require('../../db');

class ProcessorsService {
  constructor(database = db) {
    this.db = database;
  }

  async join(processorInformation) {}
}

module.exports = ProcessorsService;

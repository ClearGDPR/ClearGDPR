const { db } = require('../../db');

class ProcessorsService {
  async getProcessors() {
    return db('processors').orderBy('id');
  }
}

module.exports = ProcessorsService;

const { db } = require('../../../db');

class ProcessorsService {
  constructor(database = db) {
    this.db = database;
  }

  async listProcessors() {
    return await this.db('processors')
      .leftJoin('processor_address', 'processors.id', 'processor_address.processor_id')
      .select('processors.*', 'processor_address.address')
      .orderBy('id');
  }
}

module.exports = ProcessorsService;

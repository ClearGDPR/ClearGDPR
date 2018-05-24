const { db } = require('../../../db');
const _ = require('underscore');
const { NotFound } = require('../../../utils/errors');

const { setProcessors } = require('../../../utils/blockchain');

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

  async updateProcessor(processor) {
    await this.db.transaction(async trx => {
      const [existingProcessor] = await db('processors')
        .transacting(trx)
        .where({ id: processor.id });

      if (!existingProcessor) {
        throw new NotFound('Processor not found');
      }

      const data = _.clone(processor);

      if (data.scopes) {
        data.scopes = JSON.stringify(data.scopes);
      }

      await db('processors')
        .transacting(trx)
        .where({ id: processor.id })
        .update(data);
    });
  }

  async addProcessor(newProcessor) {
    await this.db.transaction(async trx => {
      const data = _.clone(newProcessor);
      delete data.address;

      if (data.scopes) {
        data.scopes = JSON.stringify(data.scopes);
      }

      const [id] = await db('processors')
        .transacting(trx)
        .insert(data)
        .returning('id');

      if (newProcessor.address) {
        await db('processor_address')
          .transacting(trx)
          .insert({
            processor_id: id,
            address: newProcessor.address
          });

        await this._setProcessors(trx);
      }
    });
  }

  async removeProcessors(processorIds) {
    await this.db.transaction(async trx => {
      await db('processors')
        .whereIn('id', processorIds)
        .del();

      return await this._setProcessors(trx);
    });
  }

  async _setProcessors(trx) {
    let remainingProcessors = await this.db('processor_address')
      .transacting(trx)
      .select('address');
    return await setProcessors(remainingProcessors.map(p => p.address));
  }
}

module.exports = ProcessorsService;

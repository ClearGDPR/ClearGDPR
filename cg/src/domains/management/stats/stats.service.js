const { db } = require('../../../db');

class StatsService {
  constructor(database = db) {
    this.db = database;
  }

  async stats() {
    const [result] = await db('subjects')
      .select(db.raw('count subjects.id as consented'))
      .join('subject_keys', 'subjects.id', 'subject_keys.subject_id');
    const consentedSubjectCount = result.consented;

    const [result2] = await db('subjects').select(db.raw('count subjects.id as total'));
    const totalSubjectCount = result2.total;

    const unconsentedSubjectCount = totalSubjectCount - consentedSubjectCount;

    const controllerData = {
      consented: consentedSubjectCount,
      unconsented: unconsentedSubjectCount,
      total: totalSubjectCount
    };

    const processorsWithSubjectCount = await db('subjects')
      .join('subjects_processors', 'subjects.id', 'subjects_processors.subject_id')
      .groupBy('subjects_processors.processor_id')
      .select(db.raw('count(subjects.id) as subject_count'))
      .select('subjects_processors.processor_id');

    const processorData = processorsWithSubjectCount.reduce((current, processor) => {
      current[processor.processor_id] = { consented: processor.subject_count };
      return current;
    }, {});

    return {
      controller: controllerData,
      processors: processorData
    };
  }
}

module.exports = StatsService;

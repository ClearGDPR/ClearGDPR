const { db } = require('../../../db');

class StatsService {
  constructor(database = db) {
    this.db = database;
  }

  async stats() {
    const [result] = await db('subjects')
      .select(db.raw('count(subjects.id) as consented'))
      .join('subject_keys', 'subjects.id', 'subject_keys.subject_id');
    const consentedSubjectCount = parseInt(result.consented, 10);

    const [result2] = await db('subjects').select(db.raw('count(subjects.id) as total'));
    const totalSubjectCount = parseInt(result2.total, 10);

    const unconsentedSubjectCount = totalSubjectCount - consentedSubjectCount;

    const controllerData = {
      consented: consentedSubjectCount,
      unconsented: unconsentedSubjectCount,
      total: totalSubjectCount
    };

    const processorsWithSubjectCount = await db('subjects')
      .join('subject_processors', 'subjects.id', 'subject_processors.subject_id')
      .join('processors', 'processors.id', 'subject_processors.processor_id')
      .groupBy('subject_processors.processor_id')
      .select(db.raw('count(subjects.id) as subject_count'))
      .select('subject_processors.processor_id')
      .select(db.raw('max(processors.name) as name'));

    const processors = await db('processors');

    const processorData = processorsWithSubjectCount.reduce((current, processor) => {
      current[processor.processor_id] = {
        consented: parseInt(processor.subject_count, 10),
        name: processor.name
      };
      return current;
    }, {});

    processors.forEach(processor => {
      if (!processorData[processor.id]) {
        processorData[processor.id] = { consented: 0, name: processor.name };
      }
    });

    return {
      controller: controllerData,
      processors: processorData
    };
  }
}

module.exports = StatsService;

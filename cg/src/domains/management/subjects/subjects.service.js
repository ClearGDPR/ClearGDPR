const { db } = require('../../../db');
const { decryptFromStorage } = require('../../../utils/encryption');
const winston = require('winston');

class SubjectsService {
  constructor(database = db) {
    this.db = database;
  }

  async listSubjects() {
    const data = await this.db('subjects')
      .join('subject_keys', 'subjects.id', '=', 'subject_keys.subject_id')
      .select('personal_data')
      .whereNotNull('personal_data')
      .select('key')
      .whereNotNull('key')
      .orderBy('id', 'desc');

    const decryptedData = data
      .map(item => {
        try {
          const decryptedItem = decryptFromStorage(item.personal_data, item.key);
          return JSON.parse(decryptedItem);
        } catch (e) {
          winston.info(`Error decrypting data ${e.toString()}`);
          return null;
        }
      })
      .filter(item => item !== null);
    // After filtering there will be some entries with { test:true } from other tests in the decryptedData

    return decryptedData;
  }
}

module.exports = SubjectsService;

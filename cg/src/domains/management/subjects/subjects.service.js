const { db } = require('../../../db');
const { decryptFromStorage } = require('../../../utils/encryption');
const winston = require('winston');

const PAGE_SIZE = 2; // This could go in constants, inside utils

class SubjectsService {
  constructor(database = db) {
    this.db = database;
  }

  async listSubjects(requestedPage) {
    const data = await this.db('subjects')
      .join('subject_keys', 'subjects.id', '=', 'subject_keys.subject_id')
      .select('personal_data')
      .whereNotNull('personal_data')
      .select('key')
      .whereNotNull('key')
      .orderBy('id', 'desc')
      .limit(PAGE_SIZE)
      .offset((requestedPage - 1) * PAGE_SIZE);

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

    console.log(decryptedData);
    return decryptedData;
  }
}

module.exports = SubjectsService;

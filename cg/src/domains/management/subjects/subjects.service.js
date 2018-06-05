const { db } = require('../../../db');
const { decryptFromStorage } = require('../../../utils/encryption');
const winston = require('winston');

const PAGE_SIZE = 10; // This could go in constants, inside utils

class SubjectsService {
  constructor(database = db) {
    this.db = database;
  }

  async listSubjects(requestedPage) {
    if (requestedPage == undefined) {
      requestedPage = 1;
    }
    const [numberOfsubjectsObject] = await this.db('subjects')
      .join('subject_keys', 'subjects.id', '=', 'subject_keys.subject_id')
      .whereNotNull('personal_data')
      .whereNotNull('key')
      .count('personal_data');

    var numberOfsubjects = numberOfsubjectsObject.count;
    var lastPage = Math.ceil(numberOfsubjects / PAGE_SIZE);
    if (requestedPage > lastPage) {
      return { error: `page number too big, maximum page number is ${lastPage}` };
    }
    const encryptedSubjectsData = await this.db('subjects')
      .join('subject_keys', 'subjects.id', '=', 'subject_keys.subject_id')
      .select('personal_data')
      .whereNotNull('personal_data')
      .select('key')
      .whereNotNull('key')
      .orderBy('id', 'desc')
      .limit(PAGE_SIZE)
      .offset((requestedPage - 1) * PAGE_SIZE);

    const decryptedSubjectsData = encryptedSubjectsData
      .map(subject => {
        try {
          const decryptedData = decryptFromStorage(subject.personal_data, subject.key);
          return JSON.parse(decryptedData);
        } catch (e) {
          winston.info(`Error decrypting data ${e.toString()}`);
          return null;
        }
      })
      .filter(subject => subject !== null);

    return decryptedSubjectsData;
  }
}

module.exports = SubjectsService;

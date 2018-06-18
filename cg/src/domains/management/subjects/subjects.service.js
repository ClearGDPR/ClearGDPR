const { db } = require('../../../db');
const { decryptFromStorage } = require('../../../utils/encryption');
const winston = require('winston');
const { ValidationError } = require('../../../utils/errors');
const { RECTIFICATION_STATUSES } = require('./../../../utils/constants');

const PAGE_SIZE = 10; // This could go in constants, inside utils

class SubjectsService {
  constructor(database = db) {
    this.db = database;
  }

  async listSubjects(requestedPage = 1) {
    const [numberOfsubjectsObject] = await this.db('subjects')
      .join('subject_keys', 'subjects.id', '=', 'subject_keys.subject_id')
      .whereNotNull('personal_data')
      .whereNotNull('key')
      .count('personal_data');

    const numberOfsubjects = numberOfsubjectsObject.count;
    let lastPage = Math.ceil(numberOfsubjects / PAGE_SIZE);
    if (lastPage === 0) {
      // Handles the case in which there are no valid subjects, with valid encryption keys and all, in the db
      lastPage = 1;
    }
    if (requestedPage > lastPage) {
      throw new ValidationError(`page number too big, maximum page number is ${lastPage}`);
    }
    const encryptedSubjectsData = await this.db('subjects')
      .join('subject_keys', 'subjects.id', '=', 'subject_keys.subject_id')
      .select('personal_data')
      .whereNotNull('personal_data')
      .select('key')
      .whereNotNull('key')
      .orderBy('id', 'asc')
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

    return {
      requestedPage,
      numberOfPages: lastPage,
      subjects: decryptedSubjectsData
    };
  }

  async listRectificationRequests(requestedPage) {
    const page = requestedPage === undefined ? 1 : parseInt(requestedPage, 10);

    const [{ total_items }] = await this.db('rectification_requests')
      .where('status', RECTIFICATION_STATUSES.PENDING)
      .join('subject_keys', 'rectification_requests.subject_id', 'subject_keys.subject_id')
      .select(this.db.raw('count(id) as total_items'))
      .as('total_items');

    const totalPages = Math.ceil(total_items / PAGE_SIZE || 1);

    if (page > totalPages) {
      throw new ValidationError(`Page number too big, maximum page number is ${totalPages}`);
    }

    const requests = await this.db('rectification_requests')
      .select('id')
      .select('request_reason')
      .select('rectification_requests.created_at')
      .where('status', RECTIFICATION_STATUSES.PENDING)
      .join('subject_keys', 'rectification_requests.subject_id', 'subject_keys.subject_id')
      .limit(PAGE_SIZE)
      .offset(page - 1);

    return {
      data: requests,
      paging: {
        current: page,
        total: totalPages
      }
    };
  }

  async listRectifcationRequests(requestedPage) {
    if (requestedPage == undefined) {
      requestedPage = 1;
    }

    const [{ total_pages }] = await this.db('rectification_requests')
      .where('status', 'PENDING')
      .select('count(id)')
      .as('total_pages');

    if (requestedPage > total_pages) {
      throw new ValidationError(`page number too big, maximum page number is ${total_pages}`);
    }

    const requests = await this.db('rectification_requests')
      .select('id')
      .select('request_reason')
      .select('created_at')
      .where('status', 'PENDING')
      .limit(PAGE_SIZE)
      .offset(requestedPage - 1);

    return {
      data: requests,
      paging: {
        current: requestedPage,
        total: total_pages
      }
    };
  }
}

module.exports = SubjectsService;

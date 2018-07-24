const { db } = require('../../db');
const winston = require('winston');
const {
  encryptForStorage,
  decryptFromStorage,
  generateClientKey
} = require('../../utils/encryption');
const { recordErasureByProcessor } = require('../../utils/blockchain');
const { NotFound } = require('../../utils/errors');

class SubjectsService {
  constructor(database = db) {
    this.db = database;
  }

  async getSubjectData(subjectId) {
    const [data] = await this.db('subjects')
      .join('subject_keys', 'subjects.id', '=', 'subject_keys.subject_id')
      .select('personal_data')
      .select('key')
      .where({ subject_id: subjectId });

    if (!data) throw new NotFound('Subject not found');
    const decryptedData = decryptFromStorage(data.personal_data, data.key);
    return JSON.parse(decryptedData);
  }

  async initializeUser(subjectId, personalData) {
    await this.db.transaction(async trx => {
      await this._initializeUserInTransaction(trx, subjectId, personalData);
    });
  }

  async _initializeUserInTransaction(trx, subjectId, personalData) {
    const [subject] = await this.db('subjects')
      .transacting(trx)
      .where('id', subjectId)
      .select();

    if (!subject) {
      await this._createNewSubject(personalData, trx, subjectId);
    } else {
      await this._updateExistingSubject(trx, subjectId, personalData);
    }
  }

  async _createNewSubject(personalData, trx, subjectId) {
    const encryptionKey = generateClientKey();
    const encryptedPersonalData = encryptForStorage(JSON.stringify(personalData), encryptionKey);
    await this.db('subjects')
      .transacting(trx)
      .insert({
        id: subjectId,
        personal_data: encryptedPersonalData,
        direct_marketing: true,
        email_communication: true,
        research: true
      });

    await this._saveSubjectEncryptionKey(trx, subjectId, encryptionKey);
  }

  async _updateExistingSubject(trx, subjectId, personalData) {
    const [subjectKey] = await this.db('subject_keys')
      .transacting(trx)
      .where('subject_id', subjectId)
      .select();

    let encryptionKey;
    if (subjectKey) {
      encryptionKey = subjectKey.key;
    } else {
      encryptionKey = generateClientKey();
      await this._saveSubjectEncryptionKey(trx, subjectId, encryptionKey);
    }
    const encryptedPersonalData = encryptForStorage(JSON.stringify(personalData), encryptionKey);
    await this.db('subjects')
      .transacting(trx)
      .where('id', subjectId)
      .update({
        personal_data: encryptedPersonalData,
        updated_at: this.db.raw('CURRENT_TIMESTAMP')
      });
  }

  async _saveSubjectEncryptionKey(trx, subjectId, encryptionKey) {
    await this.db('subject_keys')
      .transacting(trx)
      .insert({
        subject_id: subjectId,
        key: encryptionKey
      });
  }

  async eraseDataAndRevokeConsent(subjectId) {
    await this.db.transaction(async trx => {
      await this.db('subject_keys')
        .transacting(trx)
        .where('subject_id', subjectId)
        .del();

      await this.db('subject_processors')
        .transacting(trx)
        .where({
          subject_id: subjectId
        })
        .del();

      winston.info('Emitting erasure event to blockchain');
      await recordErasureByProcessor(subjectId);
    });
  }
}

module.exports = SubjectsService;

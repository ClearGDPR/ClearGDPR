const Promise = require('bluebird');
const { db } = require('../../db');
const {
  generateClientKey,
  encryptForStorage,
  decryptFromStorage
} = require('../../utils/encryption');
const {
  recordErasureByController,
  recordConsentGivenTo,
  getSubjectDataState,
  recordErasureByProcessor
} = require('../../utils/blockchain');
const { ValidationError, NotFound  } = require('../../utils/errors');
const winston = require('winston');

const { inControllerMode } = require('./../../utils/helpers');

class SubjectsService {
  constructor(database = db) {
    this.db = database;
  }

  async initializeUser(subjectId, personalData) {
    await this.db.transaction(async trx => {
      await this._initializeUserInTransaction(trx, subjectId, personalData);
    });
  }

  async registerConsentToProcessData(subjectId, personalData, processorIds = []) {
    await this.db.transaction(async trx => {
      await this._initializeUserInTransaction(trx, subjectId, personalData);

      const processorIdsWithAddresses = await this._getProcessorIdsWithAddresses(trx, processorIds);

      if (processorIdsWithAddresses.length !== processorIds.length) {
        throw new ValidationError('Specified processor does not exist.');
      }

      if (processorIdsWithAddresses.some(p => !p.address)) {
        throw new ValidationError(
          `At least one of the processors doesn't have an address assigned`
        );
      }

      await Promise.all(
        processorIds.map(processorId => this._setConsentGiven(trx, subjectId, processorId))
      );

      await recordConsentGivenTo(subjectId, processorIdsWithAddresses.map(p => p.address));
    });
  }

  async _getProcessorIdsWithAddresses(trx, processorIds) {
    return await this.db
      .transacting(trx)
      .select('processors.id', 'processor_address.address')
      .from('processors')
      .leftJoin('processor_address', 'processors.id', 'processor_address.processor_id')
      .whereIn('id', processorIds);
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

  async _createNewSubject(personalData, trx, subjectId) {
    const encryptionKey = generateClientKey();
    const encryptedPersonalData = encryptForStorage(JSON.stringify(personalData), encryptionKey);

    await this.db('subjects')
      .transacting(trx)
      .insert({
        id: subjectId,
        personal_data: encryptedPersonalData
      });

    await this._saveSubjectEncryptionKey(trx, subjectId, encryptionKey);
  }

  async _setConsentGiven(trx, subjectId, processorId) {
    const [subjectProcessor] = await this.db('subject_processors')
      .transacting(trx)
      .where({ subject_id: subjectId, processor_id: processorId });

    if (subjectProcessor) return;

    await this.db('subject_processors')
      .transacting(trx)
      .insert({
        subject_id: subjectId,
        processor_id: processorId
      });
  }

  async eraseDataAndRevokeConsent(subjectId) {
    await this.db.transaction(async trx => {
      await this.db('subject_keys')
        .transacting(trx)
        .where('subject_id', subjectId)
        .delete();

      if (inControllerMode()) {
        winston.info('Emitting erasure event to blockchain');
        await recordErasureByController(subjectId);
      } else {
        await recordErasureByProcessor(subjectId);
      }
    });
  }

  async getPerProcessorDataStatus(subjectId) {
    const processorIdsWithAddress = this.db('subject_processors')
      .innerJoin('processors', 'subject_processors.processor_id', 'processors.id')
      .innerJoin('processor_address', 'processors.id', 'processor_address.processor_id')
      .where({
        subject_id: subjectId
      })
      .select('processors.id', 'processor_address.address');

    const processorIdsWithDataStatus = await Promise.all(
      processorIdsWithAddress.map(async p => {
        return {
          id: p.id,
          status: await getSubjectDataState(subjectId, p.address)
        };
      })
    );
    const controllerStatus = await getSubjectDataState(subjectId);

    return {
      controller: controllerStatus,
      processors: processorIdsWithDataStatus
    };
  }

  async _saveSubjectEncryptionKey(trx, subjectId, encryptionKey) {
    await this.db('subject_keys')
      .transacting(trx)
      .insert({
        subject_id: subjectId,
        key: encryptionKey
      });
  }

  async getData(subjectId) {
    const [data] = await this.db('subjects')
      .join('subject_keys', 'subjects.id', '=', 'subject_keys.subject_id')
      .select('personal_data')
      .select('key')
      .where({ subject_id: subjectId });
    if(!data) throw new NotFound('Subject not found');
    const decryptedData = decryptFromStorage(data.personal_data, data.key);
    return JSON.parse(decryptedData);
  }
}

module.exports = SubjectsService;

const Promise = require('bluebird');
const { db } = require('../../db');
const {
  generateClientKey,
  encryptForStorage,
  decryptFromStorage
} = require('../../utils/encryption');
const Blockchain = require('../../utils/blockchain');

const {
  getSubjectDataState,
  recordConsentGivenTo,
  recordAccessByController,
  recordRestrictionByController,
  recordObjectionByController,
  recordErasureByController
} = require('../../utils/blockchain');
const { ValidationError, NotFound, Unauthorized, Forbidden } = require('../../utils/errors');
const winston = require('winston');
const { RECTIFICATION_STATUSES, DATA_STATUSES } = require('./../../utils/constants');

class SubjectsService {
  constructor(database = db) {
    this.db = database;
  }

  async initializeUser(subjectId, personalData) {
    await this.db.transaction(async trx => {
      await this._initializeUserInTransaction(trx, subjectId, personalData);
    });
  }

  async registerConsentToProcessData(subjectId, personalData, processorsConsented = []) {
    const [subjectExists] = await this.db('subjects').where('id', subjectId);

    if (subjectExists) throw new Unauthorized('Subject already gave consent');
    let processorIdsWithAddresses;
    
    return this.db.transaction(async trx => {
      await trx.transaction(async (nestedTrx) => {
        await this._initializeUserInTransaction(nestedTrx, subjectId, personalData);
        processorIdsWithAddresses = await this._getProcessorIdsWithAddresses(
          nestedTrx,
          processorsConsented
        );
        await this._verifyProcessors(processorIdsWithAddresses, processorsConsented);
        await Promise.all(processorsConsented
          .map(processor => this._setConsentGiven(nestedTrx, subjectId, processor)));
      })

      await Blockchain.recordConsentGivenTo(subjectId, processorIdsWithAddresses.map(p => p.address));
    });
  }

  async updateConsent(subjectId, processorsConsented = []) {
    const [subjectExists] = await this.db('subjects').where('id', subjectId);

    if (!subjectExists) throw new NotFound('Subject not found');
    let processorIdsWithAddresses;
    await this.db.transaction(async trx => {
      processorIdsWithAddresses = await this._getProcessorIdsWithAddresses(
        trx,
        processorsConsented
      );
      await this._verifyProcessors(processorIdsWithAddresses, processorsConsented);
      await Promise.all(
        processorsConsented.map(processor => this._setConsentGiven(trx, subjectId, processor))
      );
    });
    await recordConsentGivenTo(subjectId, processorIdsWithAddresses.map(p => p.address));
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

  async _verifyProcessors(processorIdsWithAddresses, processorsConsented) {
    if (processorIdsWithAddresses.length !== processorsConsented.length) {
      throw new ValidationError('At least one of the processors specified is not valid');
    }
    if (processorIdsWithAddresses.some(p => !p.address)) {
      throw new ValidationError(`At least one of the processors doesn't have an address assigned`);
    }
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

      winston.info('Controller emitting erasure event to blockchain');
      await recordErasureByController(subjectId);
    });
  }

  async _getSubjectDataState(subjectId, processor) {
    const status = await getSubjectDataState(subjectId, processor);
    switch (status) {
      case 0:
        return DATA_STATUSES.UNCONSENTED;
      case 1:
        return DATA_STATUSES.CONSENTED;
      case 2:
        return DATA_STATUSES.ERASED;
      default:
        throw new Error('Wrong data status!');
    }
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
          status: await this._getSubjectDataState(subjectId, p.address)
        };
      })
    );
    const controllerStatus = await this._getSubjectDataState(subjectId);
    return {
      controller: controllerStatus,
      processors: processorIdsWithDataStatus
    };
    //Would be cool to refactor this to show the string of the status, not just the number
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

    if (!data) throw new NotFound('Subject not found');
    const decryptedData = decryptFromStorage(data.personal_data, data.key);
    await recordAccessByController(subjectId);
    return JSON.parse(decryptedData);
  }

  async initiateRectification(subjectId, { rectificationPayload, requestReason }) {
    const [subjectKeyData] = await this.db('subject_keys')
      .where({ subject_id: subjectId })
      .select('key');

    if (!subjectKeyData || !subjectKeyData.key) throw new NotFound('Subject keys not found');
    const encryptedRectificationPayload = encryptForStorage(
      JSON.stringify(rectificationPayload),
      subjectKeyData.key
    );
    await this.db('rectification_requests').insert({
      subject_id: subjectId,
      request_reason: requestReason,
      encrypted_rectification_payload: encryptedRectificationPayload,
      status: RECTIFICATION_STATUSES.PENDING
    });
    return { success: true };
  }

  async restrict(subjectId, directMarketing, emailCommunication, research) {
    const subjectRestrictionsUpdates = await this.db('subjects')
      .where('id', subjectId)
      .update({
        direct_marketing: directMarketing,
        email_communication: emailCommunication,
        research: research
      });

    if (subjectRestrictionsUpdates === 0) throw new NotFound('Subject not found');
    if (subjectRestrictionsUpdates > 1) throw new Forbidden('Duplicated subject in the database');
    await recordRestrictionByController(subjectId, directMarketing, emailCommunication, research);
  }

  async getRestrictions(subjectId) {
    const [subjectRestrictions] = await this.db('subjects')
      .where('id', subjectId)
      .select('direct_marketing', 'email_communication', 'research');

    if (!subjectRestrictions) throw new NotFound('Subject not found');

    return {
      directMarketing: subjectRestrictions.direct_marketing,
      emailCommunication: subjectRestrictions.email_communication,
      research: subjectRestrictions.research
    };
  }

  async object(subjectId, objection) {
    const subjectObjectionUpdates = await this.db('subjects')
      .where('id', subjectId)
      .update({
        objection: objection
      });

    if (subjectObjectionUpdates === 0) throw new NotFound('Subject not found');
    if (subjectObjectionUpdates > 1) throw new Forbidden('Duplicated subject in the database');
    await recordObjectionByController(subjectId, objection);
  }

  async getObjection(subjectId) {
    const [subjectObjection] = await this.db('subjects')
      .where('id', subjectId)
      .select('objection');

    if (!subjectObjection) throw new NotFound('Subject not found');
    return subjectObjection;
  }
}

module.exports = SubjectsService;

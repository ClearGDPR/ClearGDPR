const { db } = require('../../../db');
const requestPromise = require('request-promise');
const _ = require('underscore');
const { NotFound, BadRequest } = require('../../../utils/errors');
const {
  isContractDeployed,
  recordProcessorsUpdate,
  transferFunds
} = require('../../../utils/blockchain');

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

  async addProcessor(processorInformation) {
    const [processorExists] = await this.db('processors').where('name', processorInformation.name);
    if (processorExists) throw new BadRequest('Processor already added to the network');
    const contractDeployed = await isContractDeployed();
    if (!contractDeployed) throw new NotFound('No contract deployed');

    const requestOptions = {
      url: 'http://quorum1:8545',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json-rpc'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'raft_addPeer',
        params: [processorInformation.enode],
        id: 1 // This is the request Id, not the raftId
      })
    };
    let response;
    try {
      response = await requestPromise(requestOptions);
    } catch (e) {
      throw new Error(`Something went wrong with the HTTP request to the Quorum RPC API: ${e}`);
    }
    const responseObject = JSON.parse(response);
    const raftError = responseObject.error;
    if (raftError)
      throw new BadRequest(
        `Something went wrong when executing raft.addPeer: ${raftError.message}`
      );
    const raftId = responseObject.result;

    await this.db.transaction(async trx => {
      const processorInformationCopy = _.clone(processorInformation);
      delete processorInformationCopy.accountAddress;
      delete processorInformationCopy.enode;
      if (processorInformationCopy.scopes) {
        processorInformationCopy.scopes = JSON.stringify(processorInformationCopy.scopes);
      }
      const [processorId] = await db('processors')
        .transacting(trx)
        .insert(processorInformationCopy)
        .returning('id');

      if (processorInformation.accountAddress) {
        await db('processor_address')
          .transacting(trx)
          .insert({
            processor_id: processorId,
            address: processorInformation.accountAddress
          });
      }
      await this._recordProcessorsUpdate(trx);
    });

    // Send funds to the processor account. The processor account needs funds to be able to execute transactions, even thugh the funds won't be spent in a Quorum network
    await transferFunds(processorInformation.accountAddress);
    return {
      raftId
    };
  }

  async removeProcessors(processorIds) {
    await this.db.transaction(async trx => {
      await db('processors')
        .whereIn('id', processorIds)
        .del();

      return await this._recordProcessorsUpdate(trx);
    });
  }

  async _recordProcessorsUpdate(trx) {
    let remainingProcessors = await this.db('processor_address')
      .transacting(trx)
      .select('address');

    return await recordProcessorsUpdate(remainingProcessors.map(p => p.address));
  }
}

module.exports = ProcessorsService;

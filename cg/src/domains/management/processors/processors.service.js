const { db } = require('../../../db');
const fetch = require('node-fetch');
const _ = require('underscore');
const { NotFound, BadRequest } = require('../../../utils/errors');
const {
  isContractDeployed,
  recordProcessorsUpdate,
  createAccount
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
    const contractDeployed = await isContractDeployed();
    if (!contractDeployed) throw new NotFound('No contract deployed');
    const [processorExists] = await this.db('processors').where('name', processorInformation.name);
    if (processorExists) throw new BadRequest('Processor already added to the network');
    const requestOptions = {
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
      response = await fetch(`http://quorum1:8545`, requestOptions);
    } catch (e) {
      throw new Error(`Something went wrong with the HTTP request to the Quorum RPC API: ${e}`);
    }
    const responseObject = await response.json();
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
    // await transferFunds(processorInformation.accountAddress);
    return {
      raftId
    };
  }

  // Currently the Quorum project does not support dynamic node removal. There's ongoing work on it, so for now please don't use this endpoint
  // async removeProcessors(processorsIds) {
  //   const contractDeployed = await isContractDeployed();
  //   if (!contractDeployed) throw new NotFound('No contract deployed');

  //   const requestOptions = {
  //     url: 'http://quorum1:8545',
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json-rpc'
  //     },
  //     body: JSON.stringify({
  //       jsonrpc: '2.0',
  //       method: 'raft_removePeer',
  //       // params: [processorInformation.enode],
  //       params: [
  //         'enode://30bbf71e3e5c05f355ae07e79bddd3641e64ccd014cb70c57c6b70e42c2fbe020782d1f7f350af859a8c7de9c7a4cd78011515e9a4a045db506a874d911cd61d@172.13.0.5:30303?discport=0&raftport=50400'
  //       ],
  //       id: 1 // This is the request Id, not the raftId
  //     })
  //   };
  //   let response;
  //   try {
  //     response = await requestPromise(requestOptions);
  //     console.log(response);
  //   } catch (e) {
  //     throw new Error(`Something went wrong with the HTTP request to the Quorum RPC API: ${e}`);
  //   }
  //   const responseObject = JSON.parse(response);
  //   const raftError = responseObject.error;
  //   if (raftError)
  //     throw new BadRequest(
  //       `Something went wrong when executing raft.addPeer: ${raftError.message}`
  //     );
  //   const raftId = responseObject.result;

  //   await this.db.transaction(async trx => {
  //     const processorsDeleted = await db('processors')
  //       .whereIn('id', processorsIds)
  //       .del();

  //     if (!processorsDeleted) throw new NotFound('Processors not found');
  //     return await this._recordProcessorsUpdate(trx);
  //   });
  // }

  async _recordProcessorsUpdate(trx) {
    let remainingProcessors = await this.db('processor_address')
      .transacting(trx)
      .select('address');

    return await recordProcessorsUpdate(remainingProcessors.map(p => p.address));
  }

  // TEST FUNCTIONS USED FOR DEMOS AND DEVELOPMENT

  // This function will mock the addition of a processor to the database and the smart-contract state
  async testAddProcessor(processorInformation) {
    const [processorExists] = await this.db('processors').where('name', processorInformation.name);
    if (processorExists) throw new BadRequest('Processor already added to the network');
    const contractDeployed = await isContractDeployed();
    if (!contractDeployed) throw new NotFound('No smart-contract deployed');

    let processorAccountAddress;
    await this.db.transaction(async trx => {
      const processorInformationCopy = _.clone(processorInformation);
      delete processorInformationCopy.accountAddress;

      if (processorInformationCopy.scopes) {
        processorInformationCopy.scopes = JSON.stringify(processorInformationCopy.scopes);
      }
      const [processorId] = await db('processors')
        .transacting(trx)
        .insert(processorInformationCopy)
        .returning('id');

      try {
        processorAccountAddress = await createAccount('mocked_account_password');
      } catch (e) {
        throw new Error(`Error creating blockchain account for processor: ${e}`);
      }
      await db('processor_address')
        .transacting(trx)
        .insert({
          processor_id: processorId,
          address: processorAccountAddress
        });

      await this._recordProcessorsUpdate(trx);
    });
  }

  // Removes a processor from the database and the smart-contract state
  async testRemoveProcessors(processorsIds) {
    const contractDeployed = await isContractDeployed();
    if (!contractDeployed) throw new NotFound('No contract deployed');

    await this.db.transaction(async trx => {
      await db('subject_processors')
        .whereIn('processor_id', processorsIds)
        .del();

      const processorsDeleted = await db('processors')
        .whereIn('id', processorsIds)
        .del();

      if (!processorsDeleted) throw new NotFound('Processors not found');
      await this._recordProcessorsUpdate(trx);
    });
  }
}

module.exports = ProcessorsService;

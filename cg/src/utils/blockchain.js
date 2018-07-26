const winston = require('winston');
const CONTRACT_CONFIG_KEY = 'CONTRACT_CONFIG';
const { getConfig } = require('../domains/shared-kernel/config.repository');
const Web3 = require('web3');
const providerFactory = require('./blockchain/web3-provider-factory');
const QuorumContract = require('./blockchain/quorum-contract');
const { getMyAddress, timeout, retryAsync } = require('./helpers');
const { SubjectDataStatus } = require('./blockchain/models');

const controllerAddress = process.env.CONTRACT_OWNER_ADDRESS;
let web3 = new Web3(providerFactory());

// BACK-END INTEGRATION FUNCTIONS

async function getContract() {
  const contractConfig = await getConfig(CONTRACT_CONFIG_KEY);
  if (!contractConfig) {
    throw new Error(`No contract deployed`);
  }
  return await new QuorumContract(
    web3,
    JSON.parse(contractConfig.contractAbiJson),
    contractConfig.address
  );
}

async function runContractMethod(methodName, params) {
  // This is necessary to unlock and identificate the owner when executing functions that update the state of the smart contract
  const quorumContract = await getContract();
  const hash = await quorumContract.performMethod(methodName, params);

  let receipt = null;
  await retryAsync(async () => {
    receipt = await web3.eth.getTransactionReceipt(hash);
    if (!receipt) {
      throw new Error(`Transaction ${hash} not finished`);
    }
  });

  if (receipt) {
    return receipt;
  } else {
    throw new Error(
      `The contract method ${methodName} did not resolve in time for params ${JSON.stringify(
        params
      )}`
    );
  }
}

async function deployContract(contractAbiJson, contractByteCode) {
  const quorumContract = new QuorumContract(web3, contractAbiJson);
  await quorumContract.deploy(contractByteCode);
  return quorumContract.address;
}

// SMART CONTRACT AUXILIARY FUNCTIONS

async function getRectificationCount(subjectId) {
  const quorumContract = await getContract();
  return await quorumContract.methods.getRectificationCount(subjectId).call();
}

async function getIsErased(subjectId) {
  const quorumContract = await getContract();
  return await quorumContract.methods.getIsErased(subjectId).call();
}

async function getSubjectDataState(subjectId, processor = controllerAddress) {
  const quorumContract = await getContract();
  let result = await quorumContract.methods.getSubjectDataState(subjectId, processor).call();
  return +result; //'+' coerces the returned value to a string
}

async function getSubjectRestrictions(subjectId) {
  const quorumContract = await getContract();
  let result = await quorumContract.methods.getSubjectRestrictions(subjectId).call();
  return result;
}

async function getSubjectObjection(subjectId) {
  const quorumContract = await getContract();
  let result = await quorumContract.methods.getSubjectObjection(subjectId).call();
  return result;
}

async function getProcessors() {
  const quorumContract = await getContract();
  return await quorumContract.methods.getProcessors().call();
}

async function setSubjectDataState(subjectId, processor, state) {
  return await runContractMethod('setSubjectDataState', [subjectId, processor, state]);
}

async function setSubjectRestrictions(
  subjectId,
  directMarketing = false,
  emailCommunication = false,
  research = false
) {
  return await runContractMethod('setSubjectRestrictions', [
    subjectId,
    directMarketing,
    emailCommunication,
    research
  ]);
}

async function setSubjectObjection(subjectId, objection) {
  return await runContractMethod('setSubjectObjection', [subjectId, objection]);
}

async function setProcessors(newProcessors = []) {
  return await runContractMethod('setProcessors', [newProcessors]);
}

async function isProcessor(processor) {
  const quorumContract = await getContract();
  return await quorumContract.methods.isProcessor(processor).call();
}

async function areAllValidProcessors(processors) {
  const quorumContract = await getContract();
  return await quorumContract.methods.areAllValidProcessors(processors).call();
}

// SMART CONTRACT MAIN FUNCTIONS

async function recordProcessorsUpdate(newProcessors) {
  return await runContractMethod('recordProcessorsUpdate', [newProcessors]);
}

async function recordConsentGivenTo(subjectId, newProcessors = []) {
  return await runContractMethod('recordConsentGivenTo', [subjectId, newProcessors]);
}

async function recordAccessByController(subjectId) {
  return await runContractMethod('recordAccessByController', [subjectId]);
}

async function recordRectificationByController(subjectId) {
  return await runContractMethod('recordRectificationByController', [subjectId]);
}

async function recordRestrictionByController(
  subjectId,
  directMarketing = true,
  emailCommunication = true,
  research = true
) {
  return await runContractMethod('recordRestrictionByController', [
    subjectId,
    directMarketing,
    emailCommunication,
    research
  ]);
}

async function recordObjectionByController(subjectId, objection) {
  return await runContractMethod('recordObjectionByController', [subjectId, objection]);
}

async function recordErasureByController(subjectId) {
  await setSubjectDataState(subjectId, controllerAddress, SubjectDataStatus.erased);
  return await runContractMethod('recordErasureByController', [subjectId]);
}

async function recordErasureByProcessor(subjectId) {
  const processor = getMyAddress();
  await setSubjectDataState(subjectId, processor, SubjectDataStatus.erased);
  return await runContractMethod('recordErasureByProcessor', [subjectId, processor]);
}

// AUDITING FUNCTION

async function getPastEvents(event) {
  const quorumContract = await getContract();
  return await quorumContract.contract.getPastEvents(event, { fromBlock: 0, toBlock: 'latest' });
}

// LISTENER FUNCTIONS

async function listenerForConsentEvent(callback) {
  const quorumContract = await getContract();
  return await quorumContract.contract.events.Controller_ConsentGivenTo([], (error, data) => {
    if (error) {
      winston.error(`Error handling consent given to ${error.toString()}`);
      return;
    }
    if (
      // we need to downcase the addresses so they are in a consistent format. One was coming in with capitals and one was not.
      data.returnValues.processorsConsented
        .map(address => address.toLowerCase())
        .includes(getMyAddress().toLowerCase())
    ) {
      callback(data.returnValues.subjectId);
    }
  });
}

async function listenerForRectificationEvent(callback) {
  const quorumContract = await getContract();
  return await quorumContract.contract.events.Controller_SubjectDataRectified((error, data) => {
    if (error) {
      winston.error(`Error handling rectification ${error.toString()}`);
      return;
    }
    callback(data.returnValues.subjectId);
  });
}

async function listenerForRestrictionEvent(callback) {
  const quorumContract = await getContract();
  return await quorumContract.contract.events.Controller_SubjectDataRestricted((error, data) => {
    if (error) {
      winston.error(`Error handling restriction ${error.toString()}`);
      return;
    }

    // There's a bug when a smart contract event is fired with a boolean parameter set to 'false', which transforms that boolean in 'null'.
    // This piece of code corrects the nulled booleans, if there is any.
    // I'm not sure why this bug happens, but it seems to be an issue with event firing in Ethereum/Quorum
    const directMarketing = data.returnValues.directMarketing !== null;
    const emailCommunication = data.returnValues.emailCommunication !== null;
    const research = data.returnValues.research !== null;

    callback(data.returnValues.subjectId, directMarketing, emailCommunication, research);
  });
}

async function listenerForObjectionEvent(callback) {
  const quorumContract = await getContract();
  return await quorumContract.contract.events.Controller_SubjectDataObjected((error, data) => {
    if (error) {
      winston.error(`Error handling objection ${error.toString()}`);
      return;
    }
    const objection = data.returnValues.objection !== null;
    callback(data.returnValues.subjectId, objection);
  });
}

async function listenerForErasureEvent(callback) {
  const quorumContract = await getContract();
  return await quorumContract.contract.events.Controller_SubjectDataErased([], (error, data) => {
    if (error) {
      winston.error(`Error handling consent given to ${error.toString()}`);
      return;
    }
    callback(data.returnValues.subjectId);
  });
}

async function listenerForProcessorErasureEvent(callback) {
  const quorumContract = await getContract();
  return await quorumContract.contract.events.Processor_SubjectDataErased([], (error, data) => {
    if (error) {
      winston.error(`Error handling processor erasure request ${error.toString()}`);
      return;
    }
    callback(data.returnValues.subjectId, data.returnValues.processor);
  });
}

async function waitForGeth() {
  let gethIsListening = false;
  let newWeb3;
  while (!gethIsListening) {
    try {
      newWeb3 = new Web3(providerFactory());
      gethIsListening = await newWeb3.eth.net.isListening();
    } catch (e) {
      winston.info('Geth node is not listening');
    }
    if (!gethIsListening) {
      await timeout(5000);
    }
  }
  web3 = newWeb3;
  winston.info('Geth node is up and listening');
}

async function allEvents(callback) {
  winston.info('Arming allEvent subscriber');
  const quorumContract = await getContract();
  return await quorumContract.contract.events.allEvents([], async (error, data) => {
    try {
      if (error) {
        winston.error(`Error in event listener${error.toString()}`);
        return;
      }
      const tx = await web3.eth.getTransaction(data.transactionHash);
      callback({
        params: data.returnValues,
        eventName: data.event,
        from: tx.from,
        // blockchain events don't really have a time, so we're making the time for now
        time: Date.now()
      });
    } catch (e) {
      winston.error(`Unexpected error in allEvents listener ${e.toString()}`);
    }
  });
}

module.exports = {
  deployContract,
  getContract,
  sha3: web3.utils.sha3,
  getRectificationCount,
  getIsErased,
  getSubjectDataState,
  getSubjectRestrictions,
  getSubjectObjection,
  getProcessors,
  setSubjectDataState,
  setSubjectRestrictions,
  setSubjectObjection,
  setProcessors,
  isProcessor,
  areAllValidProcessors,
  recordProcessorsUpdate,
  recordConsentGivenTo,
  recordAccessByController,
  recordRectificationByController,
  recordRestrictionByController,
  recordObjectionByController,
  recordErasureByController,
  recordErasureByProcessor,
  allEvents,
  listenerForConsentEvent,
  listenerForRectificationEvent,
  listenerForRestrictionEvent,
  listenerForObjectionEvent,
  listenerForErasureEvent,
  listenerForProcessorErasureEvent,
  getPastEvents,
  waitForGeth,
  CONTRACT_CONFIG_KEY
};

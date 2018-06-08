const { Unauthorized } = require('./../../utils/errors');
const { processorJWT } = require('./../../utils/jwt');
const jwtMiddlewareFactory = require('./../../utils/jwt-middleware-factory');
const { db } = require('./../../db');
const winston = require('winston');

const ContractService = require('./contract.service');
const { getContractDetails } = require('./processors.requests');

const contractService = new ContractService();

const _canProcessorAccessSubject = async (processorId, subjectId) => {
  const [subjectProcessor] = await db('subject_processors').where({
    processor_id: processorId,
    subject_id: subjectId
  });

  return !!subjectProcessor;
};

const ensureProcessorAccessToSubject = async (req, res, next) => {
  if (
    req.processor.id &&
    (await _canProcessorAccessSubject(req.processor.id, req.params.subjectId))
  ) {
    return next();
  }
  return next(new Unauthorized('Processor does not have access to that subject'));
};

function blockUntilContractReady() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        winston.info(`Checking for contract`);
        const savedContractDetails = await contractService.getContractDetails();
        if (savedContractDetails) {
          winston.info(`Contract found at ${savedContractDetails.address}`);
          clearInterval(interval);
          return resolve(savedContractDetails);
        }
      } catch (e) {
        reject(e);
      }
    }, 1000);
  });
}

async function pollForContractUpdate() {
  return setInterval(async () => {
    try {
      const newContractDetails = await getContractDetails();
      const savedContractDetails = await contractService.getContractDetails();
      if (
        savedContractDetails &&
        newContractDetails.compiledData === savedContractDetails.compiledData
      )
        return;
      winston.info(`New contract detected at ${newContractDetails.address}`);
      await contractService.saveContractDetails(
        JSON.parse(newContractDetails.abiJson),
        newContractDetails.compiledData,
        newContractDetails.address
      );
    } catch (e) {
      winston.error(`Something went wrong polling for a new contract ${e.toString()}`);
    }
  }, 1000);
}

module.exports = {
  ensureProcessorAccessToSubject,
  verifyJWT: jwtMiddlewareFactory('processor', processorJWT),
  blockUntilContractReady,
  pollForContractUpdate
};

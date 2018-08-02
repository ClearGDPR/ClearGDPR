// Command to execute this script:
// docker-compose exec cg node scripts/deploy-blockchain-contract

const winston = require('winston');
const ContractService = require('../src/domains/management/contract/contract.service');
const contractAbiJson = require('../src/utils/blockchain/contract-abi.json');
const contractByteCode = require('../src/utils/blockchain/contract-bytecode.js');

const service = new ContractService();

async function deployContract() {
  const address = await service.deployContract(contractAbiJson, contractByteCode);
  winston.info(`Contract created at address: ${address}`);
}

deployContract()
  .then(() => winston.info('Contract deployed'))
  .then(() => process.exit(0))
  .catch(e => {
    winston.error(e);
    process.exit(1);
  });

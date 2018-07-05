const winston = require('winston');
const contractAbi = require('../src/utils/blockchain/contract-abi.json');
const contractByteCode = require('../src/utils/blockchain/contract-bytecode.js');
const ContractService = require('../src/domains/management/contract/contract.service');

async function deployContract() {
  const address = await new ContractService().deployContract(contractAbi, contractByteCode);
  winston.info(`Test contract created at address: ${address}`);
  return address;
}

module.exports = {
  deployContract
};

const { db } = require('./../../../db');
const { getConfig, updateConfig } = require('../../shared-kernel/config.repository');
const { CONTRACT_CONFIG_KEY, deployContract, allEvents } = require('../../../utils/blockchain');
const winston = require('winston');

async function addressToName(address) {
  if (
    process.env.MODE === 'CONTROLLER' &&
    process.env.MY_ADDRESS.toLowerCase() === address.toLowerCase()
  ) {
    return 'Master Controller Node';
  }
  const [processor] = await db('processors')
    .join('processor_address', 'processors.id', 'processor_address.processor_id')
    .where({ address: address });
  return (processor && processor.name) || null;
}

class ContractService {
  async deployContract(contractABIJson, contractByteCode) {
    const address = await deployContract(contractABIJson, contractByteCode);
    const value = JSON.stringify({
      contractABIJson: JSON.stringify(contractABIJson),
      contractByteCode,
      address
    });
    await updateConfig(CONTRACT_CONFIG_KEY, value);
    return address;
  }

  async getContractDetails() {
    return await getConfig(CONTRACT_CONFIG_KEY);
  }

  async onContractEvent(callback) {
    await allEvents(async data => {
      try {
        await callback(
          Object.assign({}, data, {
            fromName: await addressToName(data.from)
          })
        );
      } catch (e) {
        winston.error(e.toString());
      }
    });
  }
}

module.exports = ContractService;

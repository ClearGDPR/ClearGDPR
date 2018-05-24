const { getConfig, updateConfig } = require('../shared-kernel/config.repository');
const { CONTRACT_CONFIG_KEY } = require('../../utils/blockchain');

class ContractService {
  async saveContractDetails(abiJson, compiledData, address) {
    const value = JSON.stringify({
      abiJson: JSON.stringify(abiJson),
      compiledData,
      address
    });

    await updateConfig(CONTRACT_CONFIG_KEY, value);
  }

  async getContractDetails() {
    return await getConfig(CONTRACT_CONFIG_KEY);
  }
}

module.exports = ContractService;

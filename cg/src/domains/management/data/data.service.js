const KEY = 'SUBJECT_DATA_ATTRIBUTES_CONFIG';
const { getConfig, updateConfig } = require('../../shared-kernel/config.repository');

class DataService {
  async getAttributesConfig() {
    return getConfig(KEY);
  }

  async updateAttributesConfig(config) {
    return updateConfig(KEY, config);
  }
}

module.exports = DataService;

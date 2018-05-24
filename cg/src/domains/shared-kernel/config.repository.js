const { db } = require('../../db');

async function _getConfigEntry(key) {
  const [config] = await db('config').where({ key });
  return config;
}

async function getConfig(key) {
  const config = await _getConfigEntry(key);

  if (
    !config ||
    !config.value ||
    (Object.keys(config.value).length === 0 && config.value.constructor === Object)
  ) {
    return null;
  }

  return config.value;
}

async function updateConfig(key, value) {
  const config = await _getConfigEntry(key);

  if (!config) {
    return await db('config').insert({
      key,
      value
    });
  } else {
    return await db('config')
      .where('key', '=', key)
      .update({
        value
      });
  }
}

module.exports = {
  getConfig,
  updateConfig
};

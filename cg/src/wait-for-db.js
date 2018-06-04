const winston = require('winston');
const config = require('../knex-config-factory')();
const db = require('knex')(config);

const maxInterval = 1000 * 5;

const checkConnectivity = async interval => {
  try {
    winston.info('Checking database connectivity...');
    await db.raw('select 1');
    winston.info('Database seems to be up!');
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      await new Promise(resolve => setTimeout(resolve, interval));
      return checkConnectivity(Math.min(interval * 2, maxInterval));
    }
    throw err;
  }
};

checkConnectivity(100)
  .then(() => process.exit(0))
  .catch(err => {
    throw err;
  });

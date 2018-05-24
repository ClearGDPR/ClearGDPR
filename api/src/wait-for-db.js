const config = require('../knexfile');
const db = require('knex')(config);

const maxInterval = 1000 * 5;

const checkConnectivity = async interval => {
  try {
    console.log('Checking database connectivity...');
    await db.raw('select 1');
    console.log('Database seems to be up!');
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

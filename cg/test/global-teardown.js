const winston = require('winston');
const dbManager = require('./db-manager');

module.exports = async () => {
  winston.info('Destroying test DB');
  await dbManager.closeKnex();
  try {
    await dbManager.dropDb(process.env.DB_DATABASE);
  } catch (err) {
    winston.error(`Error while destroying test DB: ${err.message}`);
    winston.info('Truncating instead');
    await dbManager.truncateDb(['knex_migrations']);
  }
  await dbManager.close();
  winston.info('Finished test DB cleanup');
};

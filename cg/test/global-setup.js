const winston = require('winston');
const dbManager = require('./db-manager');

module.exports = async () => {
  winston.info('\nInitializing test DB');
  try {
    await dbManager.createDb();
  } catch (e) {
    winston.error(`Error creating test DB: ${e.message}`);
    winston.info('Truncating instead');
    await dbManager.truncateDb(['knex_migrations']);
  }
  await dbManager.migrateDb();
  await dbManager.close();
  winston.info('Finished test DB initialization');
};

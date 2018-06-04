const dbManagerFactory = require('./db-manager-factory');
const winston = require('winston');

const dbSetup = async dbName => {
  const dbManager = dbManagerFactory(dbName);

  winston.info(`\nInitializing test DB ${dbManager.testDbName}`);
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

const dbTeardown = async dbName => {
  const dbManager = dbManagerFactory(dbName);
  winston.info(`Destroying test DB ${dbManager.testDbName}`);
  await dbManager.closeKnex();
  try {
    await dbManager.dropDb(dbManager.testDbName);
  } catch (err) {
    winston.error(`Error while destroying test DB: ${err.toString()}`);
    winston.info('Truncating instead');
    await dbManager.truncateDb(['knex_migrations']);
  }
  dbManager.close();
  winston.info('Finished test DB cleanup');
};

module.exports = {
  dbSetup,
  dbTeardown
};

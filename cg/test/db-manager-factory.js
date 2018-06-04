const knexConfigFactory = require('../knex-config-factory');

const dbManagerFactory = function(dbName) {
  const knex = JSON.parse(JSON.stringify(knexConfigFactory()));
  knex.connection.database = dbName;

  const dbManagerConfig = {
    knex,
    dbManager: {
      superUser: process.env.DB_USER,
      superPassword: process.env.DB_PASSWORD
    }
  };

  let dbManager = require('knex-db-manager').databaseManagerFactory(dbManagerConfig);
  dbManager.testDbName = knex.connection.database;
  return dbManager;
};

module.exports = dbManagerFactory;

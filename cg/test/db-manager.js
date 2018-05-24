const knex = require('../knexfile');

const dbManagerConfig = {
  knex,
  dbManager: {
    superUser: process.env.DB_USER,
    superPassword: process.env.DB_PASSWORD
  }
};

const dbManager = require('knex-db-manager').databaseManagerFactory(dbManagerConfig);

module.exports = dbManager;

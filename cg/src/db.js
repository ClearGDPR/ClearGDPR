const config = require('../knex-config-factory')();

const db = require('knex')(config);
exports.db = db;
exports.close = async () => {
  await db.destroy();
};

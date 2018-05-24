const config = require('../knexfile');

const db = require('knex')(config);
exports.db = db;
exports.close = async () => {
  await db.destroy();
};

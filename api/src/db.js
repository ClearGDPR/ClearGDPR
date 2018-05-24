const knex = require('../knexfile');

const db = require('knex')(knex);
exports.db = db;
exports.close = () => db.destroy();

const knexfile = require('./knexfile');

module.exports = function() {
  const dbName = global.dbName || process.env.DB_DATABASE;
  knexfile.connection.database = dbName;

  return knexfile;
};

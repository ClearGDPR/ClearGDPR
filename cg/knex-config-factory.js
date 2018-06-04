module.exports = function() {
  const dbName = global.dbName || process.env.DB_DATABASE;

  return {
    client: process.env.DB_ENGINE,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: +process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      database: dbName,
      charset: 'utf8'
    },
    pool: {
      min: +process.env.DB_POOL_MIN,
      max: +process.env.DB_POOL_MAX
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  };
};

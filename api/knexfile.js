module.exports = {
  client: process.env.DB_ENGINE,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: +process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
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

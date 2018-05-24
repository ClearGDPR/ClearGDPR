exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('config', table => {
      table
        .string('key')
        .notNullable()
        .primary();
      table.jsonb('value').notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('config');
};

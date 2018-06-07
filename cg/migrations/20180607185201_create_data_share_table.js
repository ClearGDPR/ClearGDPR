exports.up = function(knex, Promise) {
  return knex.schema.createTable('data_shares', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('token').notNullable();
    table
      .integer('subject_id')
      .unsigned()
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('data_share_tokens');
};

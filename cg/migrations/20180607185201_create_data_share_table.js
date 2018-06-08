exports.up = function(knex, Promise) {
  return knex.schema.createTable('data_shares', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('token').notNullable();
    table
      .string('subject_id')
      .notNullable()
      .references('subjects.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('data_shares');
};

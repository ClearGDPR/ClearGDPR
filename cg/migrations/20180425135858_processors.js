exports.up = function(knex) {
  return knex.schema.createTable('processors', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('logoUrl');
    table.text('description');
    table.jsonb('scopes'); // processingActions
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('processors');
};

exports.up = function(knex) {
  return knex.schema.alterTable('subjects', table => {
    table
      .boolean('objection')
      .defaultTo(false)
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('subjects', table => {
    table.dropColumns('objection');
  });
};

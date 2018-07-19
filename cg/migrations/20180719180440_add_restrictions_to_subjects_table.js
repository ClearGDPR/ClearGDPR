exports.up = function(knex) {
  return knex.schema.alterTable('subjects', table => {
    table
      .boolean('direct_marketing')
      .defaultTo(false)
      .notNullable();
    table
      .boolean('email_communication')
      .defaultTo(false)
      .notNullable();
    table
      .boolean('research')
      .defaultTo(false)
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('subjects', table => {
    table.dropColumns('direct_marketing', 'email_communication', 'research');
  });
};

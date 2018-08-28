exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('subjects', table => {
      table
        .string('id')
        .notNullable()
        .primary();
      table.timestamps(false, true);
      table.text('personal_data').notNullable();
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
      table
        .boolean('objection')
        .defaultTo(false)
        .notNullable();
    }),
    knex.schema.createTable('subject_keys', table => {
      table
        .string('subject_id')
        .notNullable()
        .primary();
      table.timestamps(false, true);
      table.string('key', 255).notNullable();
      table.foreign('subject_id').references('subjects.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('subject_keys'), knex.schema.dropTable('subjects')]);
};

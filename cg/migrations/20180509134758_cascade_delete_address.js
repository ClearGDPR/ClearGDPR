exports.up = function(knex) {
  return knex.schema
    .alterTable('processor_address', table => {
      table.dropForeign(['processor_id']);
    })
    .then(() =>
      knex.schema.alterTable('processor_address', table => {
        table
          .foreign('processor_id')
          .references('processors.id')
          .onDelete('CASCADE');
      })
    );
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('processor_address', table => {
      table.dropForeign(['processor_id']);
    })
    .then(() =>
      knex.schema.alterTable('processor_address', table => {
        table.foreign('processor_id').references('processors.id');
      })
    );
};

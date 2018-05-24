exports.up = function(knex) {
  return knex.schema.createTable('processor_address', table => {
    table.integer('processor_id');
    table.string('address', 42);
    table.foreign('processor_id').references('processors.id');
    table.primary(['processor_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('processor');
};

exports.up = function(knex) {
  return knex.schema.createTable('processor_address', table => {
    table.integer('processor_id');
    table.string('address', 42);
    table.primary(['processor_id']);
    table
      .foreign('processor_id')
      .references('processors.id')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('processor');
};

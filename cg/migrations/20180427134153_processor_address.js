exports.up = function(knex) {
  return knex.schema.createTable('processor_address', table => {
    table.integer('processor_id'); // I don't need this if I specify the primary below
    table.string('address', 42); // account address, unique
    table.primary(['processor_id']);
    table.foreign('processor_id').references('processors.id');
    //.onDelete('CASCADE'); // What exactly this cascade means?
    // enode
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('processor');
};

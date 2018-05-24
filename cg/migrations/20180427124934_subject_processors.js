exports.up = function(knex) {
  return knex.schema.createTable('subject_processors', table => {
    table.string('subject_id');
    table.integer('processor_id');
    table.foreign('subject_id').references('subjects.id');
    table.foreign('processor_id').references('processors.id');
    table.primary(['subject_id', 'processor_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('subject_processors');
};

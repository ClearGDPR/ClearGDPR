exports.up = function(knex, Promise) {
  knex.schema.createTable('rectifcation_requests', t => {
    t.increments('id');
    t
      .string('subject_id')
      .notNullable()
      .references('subjects.id');
    t.string('request_reason');
    t.text('encrypted_rectification_payload');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.enu('status', ['PENDING', 'APPROVED', 'DISSAPROVED']);
  });
};

exports.down = function(knex, Promise) {};

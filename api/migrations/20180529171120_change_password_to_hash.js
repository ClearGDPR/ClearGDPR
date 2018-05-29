
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('password_hash').notNullable();
    table.dropColumn('password')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('password_hash');
    table.string('password').notNullable();
  }) 
};

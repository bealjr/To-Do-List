
exports.up = function(knex, Promise) {
  return knex.schema.createTable('task', function (table) {
  table.increments();
  table.string('todo').notNullable();
  table.boolean('completed').defaultTo(false).notNullable();
  table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('task');
};

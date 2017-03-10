exports.up = function(knex, Promise) {
  return knex.schema.createTable('list_task', function (table) {
  table.increments();
  table.integer('list_id').notNullable().references('id').inTable('list').onDelete('CASCADE');
  table.integer('task_id').notNullable().references('id').inTable('task').onDelete('CASCADE');
  table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('list_task');
};

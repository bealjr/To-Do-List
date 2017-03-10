exports.up = function(knex, Promise) {
  return knex.schema.createTable('list', function (table) {
  table.increments();
  table.string('name').notNullable();
  table.integer('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
  table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('list');
};

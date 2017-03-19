/*
Table "public.list_task"
Column   |           Type           |                       Modifiers
------------+--------------------------+--------------------------------------------------------
id         | integer                  | not null default nextval('list_task_id_seq'::regclass)
list_id    | integer                  | not null
task_id    | integer                  | not null
created_at | timestamp with time zone | not null default now()
updated_at | timestamp with time zone | not null default now()
Indexes:
"list_task_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
"list_task_list_id_foreign" FOREIGN KEY (list_id) REFERENCES list(id) ON DELETE CASCADE
"list_task_task_id_foreign" FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE
*/


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

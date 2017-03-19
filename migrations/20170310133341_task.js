/*
Table "public.task"
Column   |           Type           |                     Modifiers
------------+--------------------------+---------------------------------------------------
id         | integer                  | not null default nextval('task_id_seq'::regclass)
todo       | character varying(255)   | not null
completed  | boolean                  | not null default false
created_at | timestamp with time zone | not null default now()
updated_at | timestamp with time zone | not null default now()
Indexes:
"task_pkey" PRIMARY KEY, btree (id)
Referenced by:
TABLE "list_task" CONSTRAINT "list_task_task_id_foreign" FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE
*/

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

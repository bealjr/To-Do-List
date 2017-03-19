/*
Table "public.list"
Column   |           Type           |                     Modifiers
------------+--------------------------+---------------------------------------------------
id         | integer                  | not null default nextval('list_id_seq'::regclass)
name       | character varying(255)   | not null
user_id    | integer                  | not null
created_at | timestamp with time zone | not null default now()
updated_at | timestamp with time zone | not null default now()
Indexes:
 "list_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
 "list_user_id_foreign" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
Referenced by:
 TABLE "list_task" CONSTRAINT "list_task_list_id_foreign" FOREIGN KEY (list_id) REFERENCES list(id) ON DELETE CASCADE

*/

exports.up = function(knex, Promise) {
  return knex.schema.createTable('list', function (table) {
  table.increments();
  table.string('name').notNullable();
  table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
  table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('list');
};

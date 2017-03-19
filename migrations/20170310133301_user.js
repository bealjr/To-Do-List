/*
Table "public.users"
Column      |           Type           |                     Modifiers
-----------------+--------------------------+----------------------------------------------------
id              | integer                  | not null default nextval('users_id_seq'::regclass)
email           | character varying(255)   | not null
hashed_password | character(60)            | not null
created_at      | timestamp with time zone | not null default now()
updated_at      | timestamp with time zone | not null default now()
Indexes:
"users_pkey" PRIMARY KEY, btree (id)
"users_email_unique" UNIQUE CONSTRAINT, btree (email)
Referenced by:
TABLE "list" CONSTRAINT "list_user_id_foreign" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments().primary();
    table.string('email').notNullable().unique();
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};

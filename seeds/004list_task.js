exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('list_task').del()
    .then(function () {
      // Inserts seed entries
      return knex('list_task').insert([
        {list_id: 1, task_id: 1},
        {list_id: 2, task_id: 2},
        {list_id: 3, task_id: 3}
      ]).returning('id');
    });
};


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('task').del()
    .then(function () {
      // Inserts seed entries
      return knex('task').insert([
        {
          todo: "take shower",
          completed: false
      },
        {
          todo: "feed dog",
          completed: true
        },
        {
          todo: "mow lawn",
          completed: false
        }
      ]).returning('id');
    });
};

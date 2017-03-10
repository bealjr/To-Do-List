
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('task').del()
    .then(function () {
      // Inserts seed entries
      return knex('task').insert([
        {todo: "take shower"},
        {todo: "feed dog"},
        {todo: "mow lawn"}
      ]).returning('id');
    });
};

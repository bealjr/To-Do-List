exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('list').del()
    .then(function () {
      // Inserts seed entries
      return knex('list').insert([
        {name: "school", user_id: 1},
        {name: "work", user_id: 2},
        {name: "birthday", user_id: 3}
      ]).returning('id');
    });
};

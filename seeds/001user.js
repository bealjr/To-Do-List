
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {email: 'bealjr85@gmail.com', hashed_password: "123"},
        {email: 'dshin@gmail.com', hashed_password: "123"},
        {email: 'ehoward@gmail.com', hashed_password: "123"}
      ]).returning('id');
    });
};

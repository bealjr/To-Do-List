
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {email: 'bealjr85@gmail.com', hashed_password: "$2a$10$LtRhV0aX3ocxRw52lpFzyevzjQkoMzLes43R6laUbBBPzEZi.g5.e"},
        {email: 'dshin@gmail.com', hashed_password: "$2a$10$LtRhV0aX3ocxRw52lpFzyevzjQkoMzLes43R6laUbBBPzEZi.g5.e"},
        {email: 'ehoward@gmail.com', hashed_password: "$2a$10$LtRhV0aX3ocxRw52lpFzyevzjQkoMzLes43R6laUbBBPzEZi.g5.e"}
      ]).returning('id');
    });
};

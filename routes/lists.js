var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/*  */
router.get('/:email', function(req, res, next) {
  console.log(req.params);
  var userEmail = req.params.email;
  knex
  .select('list.name', 'list.id', 'users.id', 'users.email')
  .table('list')
  .innerJoin('users', 'list.user_id', 'users.id')
  .where({email: userEmail})
  .returning('*')
  .then(function (listTitles) {
    console.log(listTitles);
    res.render('lists',{
      listTitles: listTitles
    })
  })
});

module.exports = router;

var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/*Display all the lists of the user*/
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
    console.log("A whole bunch of poop", listTitles);
    res.render('lists',{
      listTitles: listTitles,
      email: listTitles.email,
      user: req.params.email || 'guest'
    })
  })
});


//Display a particular lists's task
router.get('/:email/:listName', function (req, res, next) {
  knex
  .select('list.name', 'list_task.list_id', 'list_task.task_id', 'list_task.id', 'task.todo')
  .table('list')
  .innerJoin('list_task', 'list_task.list_id', 'list.id')
  .innerJoin('task', 'task.id', 'list_task.task_id')
  .where({name: req.params.listName})
  .returning('*')
  .then(function (listedTasks) {
    console.log(listedTasks);
    console.log(listedTasks.todo);
    res.render('list', {
      listName: req.params.listName,
      listedTasks: listedTasks,
    })
  })
});

module.exports = router;

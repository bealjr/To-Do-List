var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bodyParser = require('body-parser');


//POST A NEW TASK IN LIST
router.post('/addTask', function(req, res, next) {

  var newTask = {
    todo: req.body.todo,
    completed: false
  }
  var userEmail = req.body.email;
  var listName = req.body.listName;
  var listId = req.body.list_id;

  console.log('req.body from the post is:', req.body);

  knex('task')
  .insert(newTask)
  .returning('*')
  .then(function(results){
    console.log("results:", results[0].id)
    var listTask = {
      task_id: Number(results[0].id),
      list_id: Number(listId)
    }
    console.log("listTask var is:", listTask);
    knex('list_task')
    .insert(listTask)
    .returning('*')
    .then(function(){
      knex
      .select('list.name', 'list_task.list_id', 'list_task.task_id', 'list_task.id', 'task.todo', 'users.email', 'task.completed')
      .table('list')
      .innerJoin('list_task', 'list_task.list_id', 'list.id')
      .innerJoin('task', 'task.id', 'list_task.task_id')
      .innerJoin('users', 'users.id', 'list.user_id')
      .where({name: listName})
      .returning('*')
      .then(function (listedTasks) {
        // console.log(listedTasks);
        res.render('list', {
          listName: listName,
          listedTasks: listedTasks,
          user: req.session.user
        });
      });
    });
  });
});

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
  .select('list.name', 'list_task.list_id', 'list_task.task_id', 'list_task.id', 'task.todo', 'users.email', 'task.completed')
  .table('list')
  .innerJoin('list_task', 'list_task.list_id', 'list.id')
  .innerJoin('task', 'task.id', 'list_task.task_id')
  .innerJoin('users', 'users.id', 'list.user_id')
  .where({name: req.params.listName})
  .returning('*')
  .then(function (listedTasks) {
    console.log(listedTasks);
    console.log(listedTasks.todo);
    res.render('list', {
      listName: req.params.listName,
      listedTasks: listedTasks,
      list_id: listedTasks[0].list_id,
      user: req.session.user || 'guest'
    })
  })
});



module.exports = router;

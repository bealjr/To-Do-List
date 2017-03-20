var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bodyParser = require('body-parser');


/*
--------------------------
ROUTES FOR LISTS
--------------------------
*/

/*GET LISTS OF THE USER*/
router.get('/:email', function(req, res, next) {
  console.log(req.params);
  console.log(req.session.user);
  if (req.params.email !== req.session.user) { //The user hand typed the url for the lists but is not logged in as this user
    res.render('error', {
      message: "Forbidden access",
      status: 403,
      description: "You need to be logged in as this user in order to view the related lists.",
      user: req.session.user || "guest"
    });
  }
  else {
    var userEmail = req.params.email;
    knex
    .select('list.name', 'list.id', 'users.id', 'users.email')
    .table('list')
    .innerJoin('users', 'list.user_id', 'users.id')
    .where({email: userEmail})
    .returning('*')
    .then(function (listTitles) {
      console.log("router.GET /:email - display all the lists of the user:", listTitles);
      res.render('lists',{
        listTitles: listTitles,
        email: listTitles.email,
        user: req.session.user || 'guest'
      });
    });
  }
});


//POST A NEW LIST
router.post('/addList', function (req, res, next) {

  knex('users')
  .select()
  .where({email: req.session.user})
  .returning('*')
  .then(function(users){
    var user = users[0];

    knex('list')
    .insert({
      user_id: user.id,
      name: req.body.inputAddList
    })
    .then(function () {
      res.redirect('/lists/' + req.session.user);
    })

  });
});


//DELETE THE LIST
router.delete('/deleteList', function (req, res, next) {
  knex('list')
  .select()
  .where({name: req.body.inputDeleteListName})
  .del()
  .then(function () {
    res.redirect('/lists/' + req.session.user);
  })
})








/*
--------------------------
ROUTES FOR TASKS
--------------------------
*/

// //DISPLAY A PARTICULAR LIST'S TASK
router.get('/:email/:listName', function (req, res, next) {
  console.log(req.params);
  knex
  .select('list.name', 'list_task.list_id', 'list_task.task_id', 'list_task.id', 'task.todo', 'users.email', 'task.completed')
  .table('list')
  .innerJoin('list_task', 'list_task.list_id', 'list.id')
  .innerJoin('task', 'task.id', 'list_task.task_id')
  .innerJoin('users', 'users.id', 'list.user_id')
  .where({name: req.params.listName})
  .returning('*')
  .then(function (listedTasks) {
    if (listedTasks.length !== 0) {
      console.log(listedTasks);
      console.log(listedTasks.todo);
      res.render('list', {
        listName: req.params.listName,
        listedTasks: listedTasks,
        list_id: listedTasks[0].list_id,
        user: req.session.user || 'guest'
      })
    }
    else {
      res.render('list', {
        listName: req.params.listName,
        user: req.session.user
      })
    }
  })
});


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
      console.log("the task was added");
      knex
      .select('list.name', 'list_task.list_id', 'list_task.task_id', 'list_task.id', 'task.todo', 'users.email', 'task.completed')
      .table('list')
      .innerJoin('list_task', 'list_task.list_id', 'list.id')
      .innerJoin('task', 'task.id', 'list_task.task_id')
      .innerJoin('users', 'users.id', 'list.user_id')
      .where({name: listName})
      .returning('*')
      .then(function (listedTasks) {
        console.log("Listed tasks from POST", listedTasks);
        console.log(listedTasks[0].list_id);
        res.render('list', {
          listName: listName,
          listedTasks: listedTasks,
          list_id: listedTasks[0].list_id,
          user: req.session.user
        });
      });
    });
  });
});

//UPDATE THE STATUS OF A TASK
router.put('/updateTask', function(req, res, next){
  console.log(req.body);
  knex('task')
  .where({id: req.body.id})
  .returning('*')
  .then(function (tasks) {
    console.log("This comes from the put", tasks);
    var task = tasks[0];
    if (task.completed === false) {
      console.log("in the if statement");
      knex('task')
      .where({id: task.id})
      .update({completed: true})
      .returning('*')
      .then(function (completedTasks) {
        console.log(completedTasks);
      })
    }
    else {
      knex('task')
      .where({id: task.id})
      .update({completed: false})
      .returning('*')
      .then(function (completedTasks) {
        console.log(completedTasks);
      })
    }
  })
});
var listIdFromListTasks;
//DELETE THE TASK
router.delete('/deleteTask', function (req, res, next) {
  console.log("This is the req.body from the deleteTask", req.body);
  console.log(req.params);

  knex('list_task')
  .where('task_id', req.body.task_id)
  .returning('*')
  .then(function (listTasks) {
    var listTask = listTasks[0];
    console.log("ListTask is here", listTask);
    listIdFromListTasks = listTask.list_id;
    // return listIdFromListTasks;
  })
  .then(function (/*listIdFromListTasks*/) {
    knex('list_task')
    .where('task_id', req.body.task_id)
    .del()
    // return(listIdFromListTasks);
  })
  .then(function (/*listIdFromListTasks*/) {
    // console.log(listIdFromListTasks);
    knex('task')
    .where('id', req.body.task_id)
    .del()
    // .returning(listIdFromListTasks)
    .then(function (listIdFromListTasks) {
      console.log("***********************", listIdFromListTasks);
      knex
      .select('list.name', 'list_task.list_id', 'list_task.task_id', 'list_task.id', 'task.todo', 'users.email', 'task.completed')
      .table('list')
      .innerJoin('list_task', 'list_task.list_id', 'list.id')
      .innerJoin('task', 'task.id', 'list_task.task_id')
      .innerJoin('users', 'users.id', 'list.user_id')
      .where({'list.id': listIdFromListTasks})
      .returning('*')
      .then(function (listedTasks) {
        console.log(listedTasks);
        console.log(listedTasks.todo);
        res.render('list', {
          listName: req.params.listName,
          listedTasks: listedTasks,
          list_id: listedTasks[0].list_id,
          user: req.session.user || 'guest'
        });
      });
      console.log("the entry was deleted");
    })
  })


})








module.exports = router;

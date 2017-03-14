var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('../db/knex');

//Log In POST
router.post('/login', function(req, res, next) {
  console.log(req.body);
  res.render('lists');
});


//Sing up POST
router.post('/signup', function(req, res, next) {
  console.log(req.body);

  knex('users')
  .select()
  .where('email', req.body.email)
  .returning('*')
  .then(function (existingUsers) {
    if (existingUsers.length > 0) {
      var existingUser = existingUsers[0];
      console.log(existingUser);
      res.render('error', {
        message: "User already exists",
        status: 400,
        description: "Sorry but the email you entered exists already in the database. Please try siging up with a different email or try to login."
      });
    }
  })

  var hashedPassword = new Promise(function (resolve, reject) {
    resolve(saltPassword(req.body.password));
  })

  hashedPassword
  .then(function(pwd){
    var newUserObj = {
      email: req.body.email,
      hashed_password: pwd
    }
    return newUserObj;
  })
  .then(function (newUser) {

    knex('users')
    .insert(newUser)
    .returning('email')
    .then(function(newUserEmails){
      var newUserEmail = newUserEmails[0];
      req.session.user = newUserEmail;
      req.session.cookie.maxAge = 24 * 60 * 60 * 10;
      res.redirect(`/lists/${newUserEmail}`);
    })
  })

  // res.render("lists");
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Jeremy\'s awesomness',
    dog: 'Wilson'
  });
});

//FUNCTIONS FOR PASSWORD HASHING

//Salt of password
function saltPassword(passwordEntry) {
  var salt = bcrypt.genSaltSync(10);
  console.log("The salt is:", salt);
  return hashPassword(passwordEntry, salt);
}

function hashPassword(passwordEntry, salt) {
  var hash = bcrypt.hashSync(passwordEntry, salt);
  console.log("The hash is:", hash);
  return hash;
}

module.exports = router;

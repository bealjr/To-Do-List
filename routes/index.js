var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('../db/knex');

//Log In POST
router.post('/login', function(req, res, next) {
  console.log(req.body);

  knex('users')
  .select()
  .where('email', req.body.email)
  .returning('*')
  .then(function (existingUsers) {
    var user = existingUsers[0];
    if (existingUsers.length === 0) {
      console.log(user);
      res.render('error', {
        message: "User does not exist",
        status: 400,
        description: "Sorry but the email you entered does not exist in the database. Please try to log in with a different email or try to sign up.",
        user: req.session.user || "guest"
      });
    } else {
      if (bcrypt.compareSync(req.body.password, user.hashed_password) === true) {
        console.log("Hoorah!!!");
        req.session.user = req.body.email;
        req.session.cookie.maxAge = 24 * 60 * 60 * 10;
        knex
        .select('list.name', 'list.id', 'users.id', 'users.email')
        .table('list')
        .innerJoin('users', 'list.user_id', 'users.id')
        .where({email: req.session.user})
        .returning('*')
        .then(function (listTitles) {
          res.render('lists',{
            listTitles: listTitles,
            email: listTitles.email,
            user: req.session.user || 'guest'
          })
        })
      }
      else {
        console.log("POOP!");
        res.render('error', {
          message: "Incorrect Login Credentials",
          status: 400,
          description: "You have entered incorrect login credentials",
          user: req.session.user || "guest"
        })
      }


    }
  });
}); //End of router.post


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
        description: "Sorry but the email you entered exists already in the database. Please try siging up with a different email or try to login.",
        user: req.session.user || "guest"
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
      res.render('lists', {
        user: req.session.user
      });
    })
  })

});

//LOGOUT BUTTON
router.get('/logout', (req, res, next) => {
  console.log("LOGOUT: req session before logout");
  console.log(req.session);
  req.session.destroy(function (err) {
      res.render('index', {
        title: 'Jeremy\'s lists',
        user: "guest"
      });
  });
  console.log("LOGOUT: req session after logout");
  console.log(req.session);
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Jeremy\'s lists',
    user: req.session.user || "guest"
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

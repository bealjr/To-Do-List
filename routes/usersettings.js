var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('../db/knex');

/* GET THE USER INFORMATION IN THE USER SETTINGS PAGE */
router.get('/', function(req, res, next) {
console.log(req.session.user);
  if (req.session.user === undefined) {
    res.render('error', {
      message: "Unauthorized access",
      status: 403,
      description: 'You need to be logged in to view the user settings page',
      user: 'guest'
    })
  }
  else {
    res.render("usersettings", {
      user: req.session.user
    })
  }
});


// PUT FOR UPDATING THE ACCOUNT INFORMATION
router.put('/updateaccount', function (req, res, next) {
  if (req.body.oldPassword.trim() === "") {//The user did not enter his old password
    res.render('error', {
      message: 'Missing entry',
      status: 400,
      description: 'You need to enter your old password in order to proceed with the account updates',
      user: req.session.user
    });
  } //if req.body.oldPassword === ""
  else { //The user entered his oldPassword
    knex('users')
    .select()
    .where({email: req.session.user})
    .returning('*')
    .then(function(usersOldInfo){
      var userOldInfo = usersOldInfo[0];
      if (bcrypt.compareSync(req.body.oldPassword, userOldInfo.hashed_password) !== true) {
        console.log("the password entry does not match the one in database");
        res.render('error', {
          message: 'Invalid entry',
          status: 400,
          description: 'The existing password you entered does not match the one in the database. Please try again',
          user: req.session.user
        });
      }
      else {
        console.log("the password entry matches the one in database");
        if (req.body.email.trim() === req.session.user) { //req.body.email is same as session
          res.render('error', {
            message: 'Invalid entry',
            status: 400,
            description: 'The email you entered is already associated with this account. Please enter a new email if you need to update',
            user: req.session.user
          })
        }
        else if (req.body.email.trim() !== "") {
          if (req.body.newPassword.trim() === "") { //new password is empty but email is not
            knex('users')
            .select()
            .where({email: req.session.user})
            .update({email: req.body.email.trim()})
            .then(function () {
              console.log("the account has been updated with the following information:", req.body.email);
              req.session.user = req.body.email.trim();
              req.session.cookie.maxAge = 24 * 60 * 60 * 10;
              res.render('success', {
                message: "Successful update",
                status: 200,
                description: "Your account info was sucessfully updated",
                user: req.body.email.trim()
              })
            });
          }
          else { //the user is updating both his email and password
            var hashedPassword = new Promise(function (resolve, reject) {
              resolve(saltPassword(req.body.newPassword));
            });

            hashedPassword
            .then(function(pwd) {
              knex('users')
              .select()
              .where({email: req.session.user})
              .update({
                email: req.body.email.trim(),
                hashed_password: pwd
              })
              .then(function(){
                req.session.user = req.body.email.trim();
                req.session.cookie.maxAge = 24 * 60 * 60 * 10;
                res.render('success', {
                  message: "Successful update",
                  status: 200,
                  description: "Your account info was sucessfully updated",
                  user: req.body.email.trim()
                })
              });
            })
          }
        }
        else { //req.body.email is blank
          if (req.body.newPassword.trim() === "") { //new password and new email are empty
            res.render('error', {
              message: 'Invalid entry',
              status: 400,
              description: 'You need to enter a valid email and / or password in order to proceed with the account update',
              user: req.session.user
            })
          }
          else { //new email is empty but new password is not
            var hashedPassword = new Promise(function (resolve, reject) {
              resolve(saltPassword(req.body.newPassword));
            });

            hashedPassword
            .then(function (pwd) {
              knex('users')
              .select()
              .where({email: req.session.user})
              .update({hashed_password: pwd})
              .then(function() {
                res.render('success', {
                  message: "Successful update",
                  status: 200,
                  description: "Your account info was sucessfuly updated",
                  user: req.session.user
                })
              })
            })
          }
        }
      }
    });
  } //end of else, the user entered his old password
}); //End of router.put


//DELETE THE USER ACCOUNT
router.delete('/deleteaccount', function (req, res, next) {
  knex('users')
  .select()
  .where({email: req.session.user})
  .del()
  .then(function(){
    res.render('success', {
      message: "Account successfully deleted",
      status: 200,
      description: "Your account and all the lists associated with it have been successfully deleted",
      user: 'guest'
    });
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
